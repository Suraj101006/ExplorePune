import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createAndStoreOtp,
  verifyOtpCode,
  checkSendRateLimit,
  deriveEmailAuthSecret,
  _resetOtpStoresForTesting,
} from '@/lib/authOtpService';
import { POST as sendCodePost } from '@/app/api/v1/auth/send-code/route';
import { POST as verifyCodePost } from '@/app/api/v1/auth/verify-code/route';
import { NextRequest } from 'next/server';

describe('Auth OTP Verification Engine (lib/authOtpService & API routes)', () => {
  beforeEach(() => {
    _resetOtpStoresForTesting();
    vi.restoreAllMocks();
  });

  describe('OTP Generation & Verification', () => {
    it('generates a 6-digit numeric verification code', () => {
      const code = createAndStoreOtp('explorer@punetour.in');
      expect(code).toBeDefined();
      expect(code).toMatch(/^\d{6}$/);
    });

    it('successfully verifies the correct code and returns a deterministic authSecret', () => {
      const email = 'explorer@punetour.in';
      const code = createAndStoreOtp(email);

      const result = verifyOtpCode(email, code);
      expect(result.valid).toBe(true);
      expect(result.authSecret).toBeDefined();
      expect(result.authSecret?.startsWith('EP$')).toBe(true);
      expect(result.authSecret?.length).toBeGreaterThanOrEqual(16);
    });

    it('consumes code upon successful verification (single-use token protection)', () => {
      const email = 'singleuse@punetour.in';
      const code = createAndStoreOtp(email);

      const firstTry = verifyOtpCode(email, code);
      expect(firstTry.valid).toBe(true);

      const secondTry = verifyOtpCode(email, code);
      expect(secondTry.valid).toBe(false);
      expect(secondTry.reason).toContain('No active verification code');
    });

    it('rejects an incorrect code and tracks remaining attempts', () => {
      const email = 'retry@punetour.in';
      createAndStoreOtp(email);

      const wrongTry = verifyOtpCode(email, '000000');
      expect(wrongTry.valid).toBe(false);
      expect(wrongTry.reason).toContain('4 attempts remaining');
    });

    it('invalidates code after 5 consecutive incorrect attempts', () => {
      const email = 'lockout@punetour.in';
      createAndStoreOtp(email);

      for (let i = 0; i < 4; i++) {
        verifyOtpCode(email, '000000');
      }

      // 5th incorrect attempt locks out the code
      const fifthTry = verifyOtpCode(email, '000000');
      expect(fifthTry.valid).toBe(false);
      expect(fifthTry.reason).toContain('Too many incorrect attempts');
    });

    it('handles case-insensitive and whitespace-padded emails reliably', () => {
      const code = createAndStoreOtp('  UpperUser@PuneTour.IN ');
      const result = verifyOtpCode('upperuser@punetour.in', code);
      expect(result.valid).toBe(true);
    });
  });

  describe('Rate Limiting & Credential Derivation', () => {
    it('enforces send rate limit of maximum 4 codes per window', () => {
      const email = 'ratelimit@punetour.in';

      expect(checkSendRateLimit(email).allowed).toBe(true);
      expect(checkSendRateLimit(email).allowed).toBe(true);
      expect(checkSendRateLimit(email).allowed).toBe(true);
      expect(checkSendRateLimit(email).allowed).toBe(true);

      // 5th request in window is blocked
      const blocked = checkSendRateLimit(email);
      expect(blocked.allowed).toBe(false);
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    });

    it('isolates rate limits per email address', () => {
      const userA = 'userA@punetour.in';
      const userB = 'userB@punetour.in';

      for (let i = 0; i < 4; i++) {
        checkSendRateLimit(userA);
      }
      expect(checkSendRateLimit(userA).allowed).toBe(false);
      expect(checkSendRateLimit(userB).allowed).toBe(true);
    });

    it('derives deterministic credentials for the same email', () => {
      const cred1 = deriveEmailAuthSecret('tanmay@explorepune.in');
      const cred2 = deriveEmailAuthSecret('TANMAY@explorepune.in ');
      const cred3 = deriveEmailAuthSecret('other@explorepune.in');

      expect(cred1).toBe(cred2);
      expect(cred1).not.toBe(cred3);
    });
  });

  describe('Auth API Routes', () => {
    it('validates email on /api/v1/auth/send-code', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({ email: 'not-an-email' }),
      });
      const res = await sendCodePost(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error).toContain('valid email address');
    });

    it('successfully sends code and returns success confirmation', async () => {
      const testEmail = 'api-explorer@punetour.in';
      const req = new NextRequest('http://localhost:3000/api/v1/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({ email: testEmail, name: 'Tanmay' }),
      });
      const res = await sendCodePost(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.email).toBe(testEmail);
    });

    it('validates 6-digit code format on /api/v1/auth/verify-code', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@punetour.in', code: '123' }),
      });
      const res = await verifyCodePost(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error).toContain('6-digit');
    });

    it('verifies code end-to-end via API route', async () => {
      const email = 'e2e@punetour.in';
      const code = createAndStoreOtp(email);

      const req = new NextRequest('http://localhost:3000/api/v1/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify({ email, code, name: 'Heritage Lover' }),
      });
      const res = await verifyCodePost(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.verified).toBe(true);
      expect(json.authSecret).toBeDefined();
      expect(json.name).toBe('Heritage Lover');
    });
  });
});

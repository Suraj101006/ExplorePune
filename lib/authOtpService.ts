import crypto from 'crypto';

interface StoredOtpRecord {
  hash: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  purpose: string;
}

// In-memory OTP storage with 10-minute expiry (fallback for local testing)
const OTP_STORE = new Map<string, StoredOtpRecord>();
const RATE_LIMIT_STORE = new Map<string, number[]>();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const MAX_CODES_PER_WINDOW = 4;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const OTP_SECRET = process.env.OTP_SECRET || 'explore-pune-secure-otp-auth-secret-key-2026';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashOtp(email: string, code: string): string {
  return crypto
    .createHmac('sha256', OTP_SECRET)
    .update(`${normalizeEmail(email)}:${code.trim()}`)
    .digest('hex');
}

/**
 * Derives a deterministic, high-entropy authentication credential for an OTP-verified email.
 * This allows the client to securely authenticate or register the user in Firebase Auth.
 */
export function deriveEmailAuthSecret(email: string): string {
  const norm = normalizeEmail(email);
  return 'EP$' + crypto.createHmac('sha256', OTP_SECRET).update(`ep_verified_${norm}`).digest('hex').slice(0, 24);
}

/**
 * Checks rate limit for sending codes to a given email.
 */
export function checkSendRateLimit(email: string): { allowed: boolean; retryAfterSeconds?: number } {
  const norm = normalizeEmail(email);
  const now = Date.now();
  const history = RATE_LIMIT_STORE.get(norm) || [];
  const validHistory = history.filter((ts) => now - ts < RATE_WINDOW_MS);

  if (validHistory.length >= MAX_CODES_PER_WINDOW) {
    const oldest = validHistory[0];
    const retryAfter = Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  validHistory.push(now);
  RATE_LIMIT_STORE.set(norm, validHistory);
  return { allowed: true };
}

/**
 * Creates a stateless, tamper-proof verification token.
 * This ensures OTP verification works seamlessly across serverless Lambda instances (e.g. Vercel).
 */
export function createOtpVerificationToken(
  email: string,
  code: string,
  purpose: string = 'register',
  ttlMs: number = OTP_TTL_MS
): string {
  const norm = normalizeEmail(email);
  const expiresAt = Date.now() + ttlMs;
  const payload = `${norm}:${expiresAt}:${purpose}`;
  const hmac = crypto
    .createHmac('sha256', OTP_SECRET)
    .update(`${payload}:${code.trim()}`)
    .digest('hex');
  const tokenRaw = `${payload}.${hmac}`;
  return Buffer.from(tokenRaw, 'utf8').toString('base64url');
}

/**
 * Verifies an entered OTP code against a cryptographically signed verification token.
 */
export function verifyOtpToken(
  email: string,
  enteredCode: string,
  token: string
): { valid: boolean; reason?: string; authSecret?: string } {
  try {
    const norm = normalizeEmail(email);
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const dotIndex = decoded.lastIndexOf('.');
    if (dotIndex === -1) {
      return { valid: false, reason: 'Invalid or malformed verification token. Please request a new code.' };
    }

    const payload = decoded.slice(0, dotIndex);
    const hmac = decoded.slice(dotIndex + 1);

    const [tokenEmail, expiresAtStr, purpose] = payload.split(':');
    if (!tokenEmail || !expiresAtStr) {
      return { valid: false, reason: 'Invalid verification token payload. Please request a new code.' };
    }

    if (tokenEmail !== norm) {
      return { valid: false, reason: 'Verification code does not match this email address. Please request a new code.' };
    }

    const expiresAt = Number(expiresAtStr);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false, reason: 'Verification code has expired. Please request a new code.' };
    }

    const expectedHmac = crypto
      .createHmac('sha256', OTP_SECRET)
      .update(`${payload}:${enteredCode.trim()}`)
      .digest('hex');

    const hmacBuf = Buffer.from(hmac, 'hex');
    const expectedBuf = Buffer.from(expectedHmac, 'hex');

    if (hmacBuf.length === expectedBuf.length && crypto.timingSafeEqual(hmacBuf, expectedBuf)) {
      const authSecret = deriveEmailAuthSecret(norm);
      return { valid: true, authSecret };
    } else {
      return { valid: false, reason: 'Incorrect verification code. Please check your email and try again.' };
    }
  } catch (err) {
    return { valid: false, reason: 'Invalid or corrupted verification session. Please request a new code.' };
  }
}

/**
 * Generates and stores a new 6-digit OTP code for an email.
 */
export function createAndStoreOtp(email: string, purpose: string = 'signin'): string {
  const norm = normalizeEmail(email);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = hashOtp(norm, code);
  const now = Date.now();

  OTP_STORE.set(norm, {
    hash,
    email: norm,
    createdAt: now,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    purpose,
  });

  return code;
}

/**
 * Verifies an entered OTP code against either a stateless token or the stored record.
 */
export function verifyOtpCode(
  email: string,
  enteredCode: string,
  token?: string
): { valid: boolean; reason?: string; authSecret?: string } {
  // If stateless token provided (recommended for serverless environments like Vercel)
  if (token && typeof token === 'string' && token.trim().length > 0) {
    return verifyOtpToken(email, enteredCode, token.trim());
  }

  const norm = normalizeEmail(email);
  const record = OTP_STORE.get(norm);

  if (!record) {
    return { valid: false, reason: 'No active verification code found for this email. Please request a new code.' };
  }

  if (Date.now() > record.expiresAt) {
    OTP_STORE.delete(norm);
    return { valid: false, reason: 'Verification code has expired. Please request a new code.' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    OTP_STORE.delete(norm);
    return { valid: false, reason: 'Too many incorrect attempts. For your security, this code was invalidated. Please request a new code.' };
  }

  const enteredHash = hashOtp(norm, enteredCode);
  if (enteredHash !== record.hash) {
    record.attempts += 1;
    if (record.attempts >= MAX_ATTEMPTS) {
      OTP_STORE.delete(norm);
      return {
        valid: false,
        reason: 'Too many incorrect attempts. For your security, this code was invalidated. Please request a new code.',
      };
    }
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      valid: false,
      reason: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // Code is valid! Consume and remove from store
  OTP_STORE.delete(norm);
  const authSecret = deriveEmailAuthSecret(norm);

  return {
    valid: true,
    authSecret,
  };
}

/**
 * Resets stores for test suites.
 */
export function _resetOtpStoresForTesting(): void {
  OTP_STORE.clear();
  RATE_LIMIT_STORE.clear();
}

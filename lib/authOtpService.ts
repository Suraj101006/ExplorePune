import crypto from 'crypto';

interface StoredOtpRecord {
  hash: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  purpose: string;
}

// In-memory OTP storage with 10-minute expiry
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
 * Verifies an entered OTP code against the stored hash.
 */
export function verifyOtpCode(
  email: string,
  enteredCode: string
): { valid: boolean; reason?: string; authSecret?: string } {
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


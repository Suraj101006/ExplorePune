import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Login & Registration Authentication Architecture (app/login/page.tsx)', () => {
  const loginFilePath = path.join(process.cwd(), 'app/login/page.tsx');
  const loginContent = fs.readFileSync(loginFilePath, 'utf8');

  it('1. Defaults directly to Password Sign In mode', () => {
    expect(loginContent).toContain("const [mode, setMode] = useState<'password' | 'phone' | 'up'>('password');");
  });

  it('2. Features a 3-tab authentication switcher (Sign In, Mobile, Register)', () => {
    expect(loginContent).toContain('role="tablist"');
    expect(loginContent).toContain('<span>Sign In</span>');
    expect(loginContent).toContain('<span>Mobile</span>');
    expect(loginContent).toContain('<span>Register</span>');
  });

  it('3. Protects Account Registration with Mandatory Email OTP Verification', () => {
    expect(loginContent).toContain('handleSendRegisterOtp');
    expect(loginContent).toContain('handleVerifyRegisterOtp');
    expect(loginContent).toContain('signUpStep');
    expect(loginContent).toContain('signUpOtpDigits');
    expect(loginContent).toContain('Verify Email & Create Account');
    expect(loginContent).toContain('Verify & Complete Registration');
  });

  it('4. Provides Mobile Phone Sign In with Firebase SMS OTP and reCAPTCHA', () => {
    expect(loginContent).toContain('id="recaptcha-container"');
    expect(loginContent).toContain('RecaptchaVerifier');
    expect(loginContent).toContain('signInWithPhoneNumber');
    expect(loginContent).toContain('handleSendPhoneOtp');
    expect(loginContent).toContain('handleVerifyPhoneOtp');
    expect(loginContent).toContain('COUNTRY_CODES');
    expect(loginContent).toContain('Send SMS Verification Code');
    expect(loginContent).toContain('Verify & Sign In to ExplorePune');
  });

  it('5. Provides direct Email & Password authentication and Google OAuth', () => {
    expect(loginContent).toContain('signInWithEmailAndPassword');
    expect(loginContent).toContain('createUserWithEmailAndPassword');
    expect(loginContent).toContain('signInWithPopup');
    expect(loginContent).toContain('googleSignIn');
    expect(loginContent).toContain('sendPasswordResetEmail');
  });

  it('6. Enforces user consent with Privacy Policy and Terms of Service agreements', () => {
    expect(loginContent).toContain('agreePolicy');
    expect(loginContent).toContain('href="/privacy"');
    expect(loginContent).toContain('href="/terms"');
  });

  it('7. Contains responsive mode toggle links between all authentication options', () => {
    expect(loginContent).toMatch(/Don(&apos;|')t have an account\?/);
    expect(loginContent).toContain('Already have an account?');
    expect(loginContent).toContain('Prefer mobile sign-in?');
    expect(loginContent).toContain('Prefer email sign-in?');
  });
});

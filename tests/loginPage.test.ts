import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Login Page Authentication Architecture (app/login/page.tsx)', () => {
  const loginFilePath = path.join(process.cwd(), 'app/login/page.tsx');
  const loginContent = fs.readFileSync(loginFilePath, 'utf8');

  it('1. Does not contain any OTP verification section or OTP inputs', () => {
    // Ensure OTP states, handlers, and segmented inputs are completely absent
    expect(loginContent).not.toContain("useState<'otp' | 'password' | 'up'>");
    expect(loginContent).not.toContain('handleSendOtp');
    expect(loginContent).not.toContain('handleVerifyOtp');
    expect(loginContent).not.toContain('otpDigits');
    expect(loginContent).not.toContain('digitRefs');
    expect(loginContent).not.toContain('resendTimer');
    expect(loginContent).not.toContain('Code (OTP)');
    expect(loginContent).not.toContain('Enter the 6-Digit Verification Code');
    expect(loginContent).not.toContain('OR USE VERIFICATION CODE');
  });

  it('2. Defaults directly to Password Sign In mode', () => {
    expect(loginContent).toContain("const [mode, setMode] = useState<'password' | 'up'>('password');");
  });

  it('3. Features a clean 2-tab authentication switcher', () => {
    expect(loginContent).toContain('role="tablist"');
    expect(loginContent).toContain('<span>Sign In</span>');
    expect(loginContent).toContain('<span>Create Account</span>');
  });

  it('4. Provides direct Email & Password authentication and Google OAuth', () => {
    expect(loginContent).toContain('signInWithEmailAndPassword');
    expect(loginContent).toContain('createUserWithEmailAndPassword');
    expect(loginContent).toContain('signInWithPopup');
    expect(loginContent).toContain('googleSignIn');
    expect(loginContent).toContain('sendPasswordResetEmail');
  });

  it('5. Protects user consent with Privacy Policy and Terms of Service agreements', () => {
    expect(loginContent).toContain('agreePolicy');
    expect(loginContent).toContain('href="/privacy"');
    expect(loginContent).toContain('href="/terms"');
  });

  it('6. Includes reciprocal mode toggle links between Sign In and Account Creation', () => {
    expect(loginContent).toMatch(/Don(&apos;|')t have an account\?/);
    expect(loginContent).toContain('Already have an account?');
  });
});

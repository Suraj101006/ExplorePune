'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const googleProvider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();
  // Modes: 'otp' (Verification Code), 'password' (Password Sign In), 'up' (Create Account)
  const [mode, setMode] = useState<'otp' | 'password' | 'up'>('otp');
  const [otpStep, setOtpStep] = useState<'send' | 'verify'>('send');
  
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [lang, setLang] = useState<'en' | 'mr'>('en');
  const [agreePolicy, setAgreePolicy] = useState(false);

  // 6-digit segmented OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer and messages
  const [resendTimer, setResendTimer] = useState(0);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  // Countdown timer effect for OTP resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-focus first digit input when entering verification step
  useEffect(() => {
    if (mode === 'otp' && otpStep === 'verify') {
      setTimeout(() => {
        digitRefs.current[0]?.focus();
      }, 100);
    }
  }, [mode, otpStep]);

  const getReturnUrl = () => {
    if (typeof window === 'undefined') return '/account';
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || params.get('next');
    return redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/account';
  };

  async function ensureProfile(uid: string, displayName: string | null) {
    try {
      const ref = doc(db, 'profiles', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          display_name: displayName || 'Pune Explorer',
          role: 'member',
          bio: null,
          profile_visibility: 'public',
          created_at: new Date().toISOString(),
        });
      }
    } catch (profileErr) {
      console.warn('Profile write warning (non-fatal):', profileErr);
    }
  }

  // Handle segmented OTP digit input
  function handleDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned.slice(-1);
    setOtpDigits(newDigits);
    setErr('');

    if (cleaned && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        digitRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setOtpDigits(newDigits);
    setErr('');

    const focusIdx = Math.min(pasteData.length, 5);
    digitRefs.current[focusIdx]?.focus();
  }

  // 1. Send OTP Code Request
  async function handleSendOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErr('');
    setMsg('');

    if (!agreePolicy) {
      setErr('Please tick the checkbox to agree to the Privacy Policy & Terms of Service to proceed.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErr('Please enter a valid email address.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/v1/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined, lang }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErr(data.error || 'Failed to dispatch verification code. Please try again.');
        return;
      }

      setOtpStep('verify');
      setOtpDigits(['', '', '', '', '', '']);
      setResendTimer(60);
      setMsg(
        lang === 'mr'
          ? `६-अंकी पडताळणी कोड आपल्या ${email} ईमेलवर पाठवला आहे.`
          : `A 6-digit verification code has been dispatched to ${email}.`
      );
    } catch (sendErr: any) {
      setErr(sendErr?.message || 'Network error while requesting verification code.');
    } finally {
      setBusy(false);
    }
  }

  // 2. Verify OTP Code and Authenticate with Firebase
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setMsg('');

    const code = otpDigits.join('');
    if (code.length !== 6) {
      setErr('Please enter all 6 digits of your verification code.');
      return;
    }

    setBusy(true);
    try {
      // Step A: Server verifies code and derives secure auth secret
      const res = await fetch('/api/v1/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code, name: name.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.authSecret) {
        setErr(data.error || 'Invalid or expired verification code.');
        setBusy(false);
        return;
      }

      // Step B: Firebase Client Auth using the derived verified secret
      const authSecret = data.authSecret;
      const normalizedEmail = email.trim().toLowerCase();

      try {
        // Try sign-in first
        const userCred = await signInWithEmailAndPassword(auth, normalizedEmail, authSecret);
        if (name && !userCred.user.displayName) {
          await updateProfile(userCred.user, { displayName: name });
        }
        await ensureProfile(userCred.user.uid, userCred.user.displayName || name || null);
        router.push(getReturnUrl());
      } catch (signInErr: any) {
        const errCode = signInErr?.code ?? '';
        if (errCode === 'auth/user-not-found' || errCode === 'auth/invalid-credential') {
          // User doesn't exist yet: seamlessly register them
          try {
            const newCred = await createUserWithEmailAndPassword(auth, normalizedEmail, authSecret);
            if (name) {
              await updateProfile(newCred.user, { displayName: name });
            }
            await ensureProfile(newCred.user.uid, name || null);
            router.push(getReturnUrl());
          } catch (createErr: any) {
            if (createErr?.code === 'auth/email-already-in-use') {
              setErr(
                'This email has an established password. Please switch to the "Password" tab to sign in, or use "Forgot password" to reset it.'
              );
            } else {
              setErr(createErr?.message || 'Failed to complete registration.');
            }
          }
        } else if (errCode === 'auth/wrong-password') {
          setErr(
            'This email has an established password. Please switch to the "Password" tab to sign in, or click "Forgot password" to reset it.'
          );
        } else {
          setErr(signInErr?.message || 'Sign in failed. Please try again.');
        }
      }
    } catch (verifyErr: any) {
      setErr(verifyErr?.message || 'Verification failed. Please check your connection.');
    } finally {
      setBusy(false);
    }
  }

  // 3. Password-based Submit (Sign in or Create Account)
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (!agreePolicy) {
      setErr('Please tick the checkbox to agree to the Privacy Policy & Terms of Service to proceed.');
      return;
    }

    if (mode === 'up' && pw.length < 8) {
      setErr('For your account security, password must be at least 8 characters.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'up') {
        const { user } = await createUserWithEmailAndPassword(auth, email, pw);
        if (name) await updateProfile(user, { displayName: name });
        await ensureProfile(user.uid, name || null);
        router.push(getReturnUrl());
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
        router.push(getReturnUrl());
      }
    } catch (error: any) {
      const code = error?.code ?? '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setErr('Email or password is incorrect. Or try signing in with a Verification Code.');
      } else if (code === 'auth/email-already-in-use') {
        setErr('An account with this email already exists. Try signing in instead.');
      } else if (code === 'auth/weak-password') {
        setErr('Password must be at least 6 characters.');
      } else {
        setErr(error?.message ?? 'Something went wrong.');
      }
    } finally {
      setBusy(false);
    }
  }

  // 4. Google Sign In
  async function googleSignIn() {
    setErr('');
    setMsg('');
    if (!agreePolicy) {
      setErr('Please tick the checkbox to agree to the Privacy Policy & Terms of Service to proceed.');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await ensureProfile(result.user.uid, result.user.displayName);
      router.push(getReturnUrl());
    } catch (error: any) {
      const code = error?.code ?? '';
      if (code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setErr(`Domain "${domain}" is not authorized in Firebase Console. Go to Firebase Console → Authentication → Settings → Authorized domains and add "${domain}".`);
      } else if (code !== 'auth/popup-closed-by-user') {
        setErr(error?.message ?? 'Google sign-in failed.');
      }
    }
  }

  // 5. Password Reset Link
  async function reset() {
    if (!email) return setErr('Enter your email first, then click "Forgot password".');
    try {
      await sendPasswordResetEmail(auth, email);
      setErr('');
      setMsg('If that email has an account, a reset link is on its way.');
    } catch {
      setMsg('If that email has an account, a reset link is on its way.');
    }
  }

  return (
    <main
      className="wrap"
      style={{
        paddingTop: 48,
        paddingBottom: 48,
        maxWidth: 480,
      }}
    >
      <div
        className="panel"
        style={{
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          background: 'var(--card)',
          border: '1px solid var(--line)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <BrandLogo size={68} withBadge alt="Explore Pune Official Logo" />
          </div>
          <h1 style={{ fontSize: 24, margin: '0 0 6px', color: 'var(--ink)' }}>
            {mode === 'otp'
              ? 'Verification Code Sign In'
              : mode === 'password'
              ? 'Welcome Back'
              : 'Create an Account'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            {mode === 'otp'
              ? 'Sign in securely with a 6-digit code sent to your email'
              : mode === 'password'
              ? 'Sign in with your email and password'
              : 'Join the Explore Pune community of heritage explorers'}
          </p>
        </div>

        {/* 3-Tab Mode Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--line-light)',
            padding: 4,
            borderRadius: 'var(--radius-md)',
            marginBottom: 24,
            gap: 4,
          }}
          role="tablist"
          aria-label="Authentication Options"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'otp'}
            onClick={() => {
              setMode('otp');
              setErr('');
              setMsg('');
            }}
            style={{
              flex: 1.2,
              padding: '9px 10px',
              border: 0,
              borderRadius: '10px',
              background: mode === 'otp' ? 'var(--card)' : 'transparent',
              color: mode === 'otp' ? 'var(--primary)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: mode === 'otp' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span>✉️</span>
            <span>Code (OTP)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'password'}
            onClick={() => {
              setMode('password');
              setErr('');
              setMsg('');
            }}
            style={{
              flex: 1,
              padding: '9px 10px',
              border: 0,
              borderRadius: '10px',
              background: mode === 'password' ? 'var(--card)' : 'transparent',
              color: mode === 'password' ? 'var(--ink)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: mode === 'password' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span>🔑</span>
            <span>Password</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'up'}
            onClick={() => {
              setMode('up');
              setErr('');
              setMsg('');
            }}
            style={{
              flex: 1,
              padding: '9px 10px',
              border: 0,
              borderRadius: '10px',
              background: mode === 'up' ? 'var(--card)' : 'transparent',
              color: mode === 'up' ? 'var(--ink)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: mode === 'up' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span>👤</span>
            <span>Register</span>
          </button>
        </div>

        {/* Google Sign-in button */}
        <button
          type="button"
          onClick={googleSignIn}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '11px 16px',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--card)',
            color: 'var(--ink)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 20,
            transition: 'all 0.15s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '20px 0',
            color: 'var(--muted)',
            fontSize: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span>{mode === 'otp' ? 'OR USE VERIFICATION CODE' : 'OR WITH EMAIL'}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        {/* =========================================================================
            MODE 1: VERIFICATION CODE (OTP)
            ========================================================================= */}
        {mode === 'otp' && (
          <div>
            {otpStep === 'send' ? (
              <form onSubmit={handleSendOtp}>
                <div className="field">
                  <label htmlFor="otp-email">Email Address</label>
                  <input
                    id="otp-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="field">
                  <label htmlFor="otp-name">
                    Your Name <span style={{ color: 'var(--muted)', fontWeight: 'normal' }}>(Optional for new explorers)</span>
                  </label>
                  <input
                    id="otp-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanmay Joshi"
                    maxLength={50}
                    autoComplete="name"
                  />
                </div>

                {/* Email Language Choice */}
                <div style={{ margin: '12px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Verification Email Language:</span>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setLang('en')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--line)',
                        background: lang === 'en' ? 'var(--primary-light)' : 'transparent',
                        color: lang === 'en' ? 'var(--primary)' : 'var(--muted)',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang('mr')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--line)',
                        background: lang === 'mr' ? 'var(--primary-light)' : 'transparent',
                        color: lang === 'mr' ? 'var(--primary)' : 'var(--muted)',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      मराठी
                    </button>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div style={{ margin: '14px 0 16px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontSize: 12.5,
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      lineHeight: 1.45,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={agreePolicy}
                      onChange={(e) => setAgreePolicy(e.target.checked)}
                      style={{
                        marginTop: 2,
                        accentColor: '#059669',
                        width: 17,
                        height: 17,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      required
                    />
                    <span>
                      I agree to the{' '}
                      <Link
                        href="/privacy"
                        target="_blank"
                        style={{ color: '#059669', fontWeight: 700, textDecoration: 'underline' }}
                      >
                        Privacy Policy
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/terms"
                        target="_blank"
                        style={{ color: '#059669', fontWeight: 700, textDecoration: 'underline' }}
                      >
                        Terms of Service
                      </Link>{' '}
                      of ExplorePune.
                    </span>
                  </label>
                </div>

                {err && (
                  <p className="note err" role="alert" style={{ marginBottom: 16 }}>
                    {err}
                  </p>
                )}
                {msg && (
                  <p className="note" role="status" style={{ marginBottom: 16 }}>
                    {msg}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn"
                  disabled={busy || !agreePolicy}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: 15,
                    opacity: agreePolicy ? 1 : 0.65,
                    cursor: agreePolicy ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {busy ? 'Sending Code…' : 'Send 6-Digit Verification Code →'}
                </button>
              </form>
            ) : (
              /* OTP Step 2: Enter 6-Digit Code */
              <form onSubmit={handleVerifyOtp}>
                <div
                  style={{
                    background: 'var(--primary-light)',
                    border: '1px solid var(--primary-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: 13, color: 'var(--primary)' }}>
                    <span>Code dispatched to </span>
                    <strong style={{ wordBreak: 'break-all' }}>{email}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('send');
                      setErr('');
                      setMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 0,
                      color: 'var(--primary)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      marginLeft: 8,
                      flexShrink: 0,
                    }}
                  >
                    Edit
                  </button>
                </div>

                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 10,
                    color: 'var(--ink)',
                    textAlign: 'center',
                  }}
                >
                  Enter the 6-Digit Verification Code
                </label>

                {/* 6 Segmented Digit Inputs */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 20,
                  }}
                  onPaste={handleDigitPaste}
                >
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        digitRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      aria-label={`Verification digit ${index + 1} of 6`}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(index, e)}
                      style={{
                        width: 46,
                        height: 52,
                        textAlign: 'center',
                        fontSize: 22,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        borderRadius: 'var(--radius-sm)',
                        border: digit ? '2px solid var(--primary)' : '1px solid var(--line)',
                        background: 'var(--card)',
                        color: 'var(--ink)',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'border-color 0.15s ease',
                      }}
                    />
                  ))}
                </div>

                {/* Resend Timer / Action */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  {resendTimer > 0 ? (
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                      Resend code in <strong>{resendTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={busy}
                      style={{
                        background: 'none',
                        border: 0,
                        color: 'var(--primary)',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Didn&apos;t receive it? Resend verification code
                    </button>
                  )}
                </div>

                {err && (
                  <p className="note err" role="alert" style={{ marginBottom: 16 }}>
                    {err}
                  </p>
                )}
                {msg && (
                  <p className="note" role="status" style={{ marginBottom: 16 }}>
                    {msg}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn"
                  disabled={busy || otpDigits.join('').length !== 6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {busy ? 'Verifying Code…' : 'Verify & Sign In to ExplorePune'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('password');
                      setErr('');
                      setMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 0,
                      color: 'var(--muted)',
                      fontSize: 12.5,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Prefer your password? Switch to password sign-in
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* =========================================================================
            MODE 2 & 3: PASSWORD LOGIN & REGISTRATION
            ========================================================================= */}
        {(mode === 'password' || mode === 'up') && (
          <form onSubmit={handlePasswordSubmit}>
            {mode === 'up' && (
              <div className="field">
                <label htmlFor="name-input">Your Name</label>
                <input
                  id="name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanmay Joshi"
                  minLength={2}
                  maxLength={50}
                  required
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="email-input">Email Address</label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <label htmlFor="password-input" style={{ marginBottom: 0 }}>
                  Password
                </label>
                {mode === 'password' && (
                  <button
                    type="button"
                    onClick={reset}
                    style={{
                      background: 'none',
                      border: 0,
                      padding: 0,
                      fontSize: 12,
                      color: 'var(--primary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password-input"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === 'password' ? 'current-password' : 'new-password'}
                style={{ marginTop: 8 }}
              />
            </div>

            {/* Privacy Policy & Terms Agreement Checkbox */}
            <div style={{ margin: '14px 0 16px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: 12.5,
                  color: 'var(--ink)',
                  cursor: 'pointer',
                  lineHeight: 1.45,
                }}
              >
                <input
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                  style={{
                    marginTop: 2,
                    accentColor: '#059669',
                    width: 17,
                    height: 17,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  required
                />
                <span>
                  I agree to the{' '}
                  <Link
                    href="/privacy"
                    target="_blank"
                    style={{ color: '#059669', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    style={{ color: '#059669', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Terms of Service
                  </Link>{' '}
                  of ExplorePune.
                </span>
              </label>
            </div>

            {err && (
              <p className="note err" role="alert" style={{ marginBottom: 16 }}>
                {err}
              </p>
            )}
            {msg && (
              <p className="note" role="status" style={{ marginBottom: 16 }}>
                {msg}
              </p>
            )}

            <button
              className="btn"
              disabled={busy || !agreePolicy}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 15,
                opacity: agreePolicy ? 1 : 0.65,
                cursor: agreePolicy ? 'pointer' : 'not-allowed',
              }}
            >
              {busy
                ? 'Please wait…'
                : mode === 'password'
                ? 'Sign In to ExplorePune'
                : 'Create My Account'}
            </button>
          </form>
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/">&larr; Back to Explore Pune</Link>
      </p>
    </main>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Smartphone, UserPlus } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const googleProvider = new GoogleAuthProvider();

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'USA / Canada (+1)' },
  { code: '+44', country: 'GB', label: 'UK (+44)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
  { code: '+49', country: 'DE', label: 'Germany (+49)' },
];

export default function LoginPage() {
  const router = useRouter();
  
  // Modes: 'password' (Email Sign In), 'phone' (Mobile Number SMS OTP), 'up' (Create Account with Email OTP)
  const [mode, setMode] = useState<'password' | 'phone' | 'up'>('password');
  
  // Input fields
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  // Registration OTP step state (mode === 'up')
  const [signUpStep, setSignUpStep] = useState<'form' | 'verify'>('form');
  const [signUpOtpDigits, setSignUpOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [signUpResendTimer, setSignUpResendTimer] = useState(0);
  const [verificationToken, setVerificationToken] = useState<string>('');
  const signUpDigitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Phone SMS OTP step state (mode === 'phone')
  const [phoneStep, setPhoneStep] = useState<'send' | 'verify'>('send');
  const [phoneOtpDigits, setPhoneOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  const phoneDigitRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Status and messages
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  // Countdown timer for registration email OTP
  useEffect(() => {
    if (signUpResendTimer <= 0) return;
    const interval = setInterval(() => {
      setSignUpResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [signUpResendTimer]);

  // Countdown timer for phone SMS OTP
  useEffect(() => {
    if (phoneResendTimer <= 0) return;
    const interval = setInterval(() => {
      setPhoneResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [phoneResendTimer]);

  // Auto-focus on first digit when entering verification step
  useEffect(() => {
    if (mode === 'up' && signUpStep === 'verify') {
      setTimeout(() => {
        signUpDigitRefs.current[0]?.focus();
      }, 100);
    }
  }, [mode, signUpStep]);

  useEffect(() => {
    if (mode === 'phone' && phoneStep === 'verify') {
      setTimeout(() => {
        phoneDigitRefs.current[0]?.focus();
      }, 100);
    }
  }, [mode, phoneStep]);

  // Clean up reCAPTCHA verifier on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {}
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

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

  // Segmented digit handlers
  function handleDigitChange(
    index: number,
    value: string,
    digits: string[],
    setDigits: (d: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) {
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = cleaned.slice(-1);
    setDigits(newDigits);
    setErr('');

    if (cleaned && index < 5) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    digits: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleDigitPaste(
    e: React.ClipboardEvent<HTMLElement>,
    setDigits: (d: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setDigits(newDigits);
    setErr('');

    const focusIdx = Math.min(pasteData.length, 5);
    refs.current[focusIdx]?.focus();
  }

  // =========================================================================
  // 1. Password Sign In Submit
  // =========================================================================
  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (!agreePolicy) {
      setErr('Please tick the checkbox to agree to the Privacy Policy & Terms of Service to proceed.');
      return;
    }

    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
      router.push(getReturnUrl());
    } catch (error: any) {
      const code = error?.code ?? '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setErr('Email or password is incorrect. Check your credentials or click "Forgot password" to reset it.');
      } else {
        setErr(error?.message ?? 'Sign in failed. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  // =========================================================================
  // 2. Create Account: Step 1 (Send Email Verification OTP)
  // =========================================================================
  async function handleSendRegisterOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErr('');
    setMsg('');

    if (!agreePolicy) {
      setErr('Please tick the checkbox to agree to the Privacy Policy & Terms of Service to proceed.');
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      setErr('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!email || !email.includes('@')) {
      setErr('Please enter a valid email address.');
      return;
    }

    if (pw.length < 8) {
      setErr('For your account security, password must be at least 8 characters.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/v1/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), purpose: 'register' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErr(data.error || 'Failed to dispatch verification code. Please try again.');
        return;
      }

      if (data.verificationToken) {
        setVerificationToken(data.verificationToken);
        try {
          sessionStorage.setItem('ep_reg_token', data.verificationToken);
        } catch {}
      }

      setSignUpStep('verify');
      setSignUpOtpDigits(['', '', '', '', '', '']);
      setSignUpResendTimer(60);
      setMsg(`A 6-digit email verification code has been dispatched to ${email.trim()}.`);
    } catch (sendErr: any) {
      setErr(sendErr?.message || 'Network error while requesting verification code.');
    } finally {
      setBusy(false);
    }
  }

  // =========================================================================
  // 2b. Create Account: Step 2 (Verify Email OTP & Create Firebase Account)
  // =========================================================================
  async function handleVerifyRegisterOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setMsg('');

    const code = signUpOtpDigits.join('');
    if (code.length !== 6) {
      setErr('Please enter all 6 digits of your email verification code.');
      return;
    }

    setBusy(true);
    try {
      const tokenToVerify =
        verificationToken ||
        (typeof window !== 'undefined' ? sessionStorage.getItem('ep_reg_token') || '' : '');

      // Step A: Verify code with secure backend OTP engine (stateless token supported)
      const res = await fetch('/api/v1/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code,
          name: name.trim(),
          verificationToken: tokenToVerify,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErr(data.error || 'Invalid or expired verification code.');
        setBusy(false);
        return;
      }

      try {
        sessionStorage.removeItem('ep_reg_token');
      } catch {}

      // Step B: Email verified! Create the authenticated Firebase user
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email.trim(), pw);
        if (name.trim()) {
          await updateProfile(user, { displayName: name.trim() });
        }
        await ensureProfile(user.uid, name.trim());
        router.push(getReturnUrl());
      } catch (createErr: any) {
        if (createErr?.code === 'auth/email-already-in-use') {
          setErr('An account with this email address already exists. Please switch to the Sign In tab.');
          setSignUpStep('form');
        } else {
          setErr(createErr?.message || 'Failed to complete registration.');
        }
      }
    } catch (verifyErr: any) {
      setErr(verifyErr?.message || 'Verification failed. Please check your connection.');
    } finally {
      setBusy(false);
    }
  }

  // =========================================================================
  // 3. Mobile Phone SMS Login: Step 1 (Send SMS OTP via Firebase)
  // =========================================================================
  async function handleSendPhoneOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErr('');
    setMsg('');

    if (!agreePolicy) {
      setErr('Please tick the checkbox to agree to the Privacy Policy & Terms of Service to proceed.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (countryCode === '+91' && cleanPhone.length !== 10) {
      setErr('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      setErr('Please enter a valid mobile phone number.');
      return;
    }

    const fullPhoneNumber = `${countryCode}${cleanPhone}`;

    setBusy(true);
    try {
      // Initialize or reuse reCAPTCHA verifier
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            setErr('reCAPTCHA security check expired. Please try sending code again.');
          },
        });
      }

      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      setPhoneStep('verify');
      setPhoneOtpDigits(['', '', '', '', '', '']);
      setPhoneResendTimer(60);
      setMsg(`A 6-digit SMS verification code has been dispatched to ${fullPhoneNumber}.`);
    } catch (phoneErr: any) {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {}
        recaptchaVerifierRef.current = null;
      }

      const code = phoneErr?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setErr(
          'Phone authentication is not enabled yet in Firebase Console. Please enable "Phone" under Firebase Console → Authentication → Sign-in method.'
        );
      } else if (code === 'auth/invalid-phone-number') {
        setErr('Invalid phone number. Please check your country code and mobile digits.');
      } else if (code === 'auth/quota-exceeded') {
        setErr('Daily SMS quota exceeded. You can also sign in with Google or Email.');
      } else if (code === 'auth/too-many-requests') {
        setErr('Too many verification requests. Please wait a moment before trying again.');
      } else {
        setErr(phoneErr?.message || 'Failed to dispatch SMS verification code.');
      }
    } finally {
      setBusy(false);
    }
  }

  // =========================================================================
  // 3b. Mobile Phone SMS Login: Step 2 (Verify SMS OTP)
  // =========================================================================
  async function handleVerifyPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setMsg('');

    const code = phoneOtpDigits.join('');
    if (code.length !== 6) {
      setErr('Please enter all 6 digits of the SMS verification code.');
      return;
    }

    if (!confirmationResult) {
      setErr('Verification session expired. Please request a new SMS code.');
      setPhoneStep('send');
      return;
    }

    setBusy(true);
    try {
      const cred = await confirmationResult.confirm(code);
      await ensureProfile(
        cred.user.uid,
        cred.user.displayName || cred.user.phoneNumber || 'Mobile Explorer'
      );
      router.push(getReturnUrl());
    } catch (verifyErr: any) {
      const code = verifyErr?.code || '';
      if (code === 'auth/invalid-verification-code') {
        setErr('Incorrect SMS code. Please check your text messages and re-enter.');
      } else if (code === 'auth/code-expired') {
        setErr('SMS verification code has expired. Please request a new code.');
      } else {
        setErr(verifyErr?.message || 'Phone verification failed. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  // =========================================================================
  // 4. Google Sign In
  // =========================================================================
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

  // =========================================================================
  // 5. Password Reset Link
  // =========================================================================
  async function reset() {
    if (!email) return setErr('Enter your email first, then click "Forgot password".');
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setErr('');
      setMsg('If that email has an account, a password reset link has been dispatched to your inbox.');
    } catch {
      setMsg('If that email has an account, a password reset link has been dispatched to your inbox.');
    }
  }

  return (
    <main
      className="wrap"
      style={{
        paddingTop: 48,
        paddingBottom: 48,
        maxWidth: 490,
      }}
    >
      {/* Invisible reCAPTCHA container for Firebase Phone Authentication */}
      <div id="recaptcha-container" />

      <div
        className="panel"
        style={{
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--radius-lg)',
          padding: '34px 30px',
          background: 'var(--card)',
          border: '1px solid var(--line)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <BrandLogo size={66} withBadge alt="Explore Pune Official Logo" />
          </div>
          <h1 style={{ fontSize: 23, margin: '0 0 6px', color: 'var(--ink)' }}>
            {mode === 'password'
              ? 'Welcome Back'
              : mode === 'phone'
              ? 'Mobile Number Sign In'
              : signUpStep === 'verify'
              ? 'Verify Your Email'
              : 'Create Verified Account'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, margin: 0, lineHeight: 1.45 }}>
            {mode === 'password'
              ? 'Sign in with your email and password'
              : mode === 'phone'
              ? 'Sign in securely with an SMS verification code'
              : signUpStep === 'verify'
              ? `Enter the 6-digit code sent to ${email} to complete registration`
              : 'Sign up with verified email security for Explore Pune'}
          </p>
        </div>

        {/* 3-Tab Authentication Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--line-light)',
            padding: 4,
            borderRadius: 'var(--radius-md)',
            marginBottom: 22,
            gap: 4,
          }}
          role="tablist"
          aria-label="Authentication Options"
        >
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
              padding: '9px 6px',
              border: 0,
              borderRadius: '9px',
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
              gap: 5,
            }}
          >
            <KeyRound size={14} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'phone'}
            onClick={() => {
              setMode('phone');
              setPhoneStep('send');
              setErr('');
              setMsg('');
            }}
            style={{
              flex: 1,
              padding: '9px 6px',
              border: 0,
              borderRadius: '9px',
              background: mode === 'phone' ? 'var(--card)' : 'transparent',
              color: mode === 'phone' ? 'var(--ink)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: mode === 'phone' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'up'}
            onClick={() => {
              setMode('up');
              setSignUpStep('form');
              setErr('');
              setMsg('');
            }}
            style={{
              flex: 1,
              padding: '9px 6px',
              border: 0,
              borderRadius: '9px',
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
              gap: 5,
            }}
          >
            <UserPlus size={14} />
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
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 18,
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
            margin: '18px 0',
            color: 'var(--muted)',
            fontSize: 11.5,
            letterSpacing: '0.04em',
            fontWeight: 600,
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span>
            {mode === 'password'
              ? 'OR WITH EMAIL & PASSWORD'
              : mode === 'phone'
              ? 'OR WITH MOBILE PHONE'
              : 'OR CREATE VERIFIED ACCOUNT'}
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        {/* =========================================================================
            MODE 1: EMAIL & PASSWORD SIGN IN
            ========================================================================= */}
        {mode === 'password' && (
          <form onSubmit={handlePasswordSignIn}>
            <div className="field">
              <label htmlFor="signin-email">Email Address</label>
              <input
                id="signin-email"
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
                <label htmlFor="signin-password" style={{ marginBottom: 0 }}>
                  Password
                </label>
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
              </div>
              <input
                id="signin-password"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="current-password"
                style={{ marginTop: 8 }}
              />
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
                fontSize: 14.5,
                opacity: agreePolicy ? 1 : 0.65,
                cursor: agreePolicy ? 'pointer' : 'not-allowed',
              }}
            >
              {busy ? 'Signing In…' : 'Sign In to ExplorePune'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('up');
                    setSignUpStep('form');
                    setErr('');
                    setMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 0,
                    padding: 0,
                    color: 'var(--primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Create verified account
                </button>
              </p>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)' }}>
                Prefer mobile sign-in?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('phone');
                    setPhoneStep('send');
                    setErr('');
                    setMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 0,
                    padding: 0,
                    color: 'var(--primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Use Mobile Number
                </button>
              </p>
            </div>
          </form>
        )}

        {/* =========================================================================
            MODE 2: MOBILE NUMBER LOGIN WITH SMS OTP
            ========================================================================= */}
        {mode === 'phone' && (
          <div>
            {phoneStep === 'send' ? (
              <form onSubmit={handleSendPhoneOtp}>
                <div className="field">
                  <label htmlFor="mobile-phone-input">Mobile Phone Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      id="country-code-select"
                      aria-label="Country Code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      style={{
                        width: 110,
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--line)',
                        background: 'var(--card)',
                        color: 'var(--ink)',
                        fontSize: 13.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.country})
                        </option>
                      ))}
                    </select>
                    <input
                      id="mobile-phone-input"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      required
                      autoComplete="tel-national"
                      style={{ flex: 1 }}
                    />
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                    We will send a 6-digit SMS verification code to this number.
                  </p>
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
                    fontSize: 14.5,
                    opacity: agreePolicy ? 1 : 0.65,
                    cursor: agreePolicy ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {busy ? 'Sending SMS Code…' : 'Send SMS Verification Code →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
                    Prefer email sign-in?{' '}
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
                        padding: 0,
                        color: 'var(--primary)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Sign In with Password
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* Phone Step 2: Enter 6-digit SMS OTP */
              <form onSubmit={handleVerifyPhoneOtp}>
                <div
                  style={{
                    background: 'var(--primary-light)',
                    border: '1px solid var(--primary-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    marginBottom: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: 13, color: 'var(--primary)' }}>
                    <span>SMS sent to </span>
                    <strong>{countryCode} {phone}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneStep('send');
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
                  Enter the 6-Digit SMS Code
                </label>

                {/* 6 Segmented SMS Inputs */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 18,
                  }}
                  onPaste={(e) => handleDigitPaste(e, setPhoneOtpDigits, phoneDigitRefs)}
                >
                  {phoneOtpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        phoneDigitRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      aria-label={`SMS verification digit ${index + 1} of 6`}
                      value={digit}
                      onChange={(e) =>
                        handleDigitChange(index, e.target.value, phoneOtpDigits, setPhoneOtpDigits, phoneDigitRefs)
                      }
                      onKeyDown={(e) => handleDigitKeyDown(index, e, phoneOtpDigits, phoneDigitRefs)}
                      style={{
                        width: 46,
                        height: 50,
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

                {/* Resend SMS Timer */}
                <div style={{ textAlign: 'center', marginBottom: 18 }}>
                  {phoneResendTimer > 0 ? (
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                      Resend SMS code in <strong>{phoneResendTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendPhoneOtp()}
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
                      Didn&apos;t receive SMS? Resend code
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
                  disabled={busy || phoneOtpDigits.join('').length !== 6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: 14.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {busy ? 'Verifying SMS Code…' : 'Verify & Sign In to ExplorePune'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* =========================================================================
            MODE 3: CREATE ACCOUNT (WITH EMAIL OTP VERIFICATION)
            ========================================================================= */}
        {mode === 'up' && (
          <div>
            {signUpStep === 'form' ? (
              /* Registration Step 1: Input Account Details */
              <form onSubmit={handleSendRegisterOtp}>
                <div className="field">
                  <label htmlFor="signup-name">Full Name</label>
                  <input
                    id="signup-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanmay Joshi"
                    minLength={2}
                    maxLength={50}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="signup-email">Email Address</label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                  <p style={{ margin: '5px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                    A 6-digit OTP code will be sent to verify this email address.
                  </p>
                </div>

                <div className="field">
                  <label htmlFor="signup-password">Create Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
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
                  type="submit"
                  className="btn"
                  disabled={busy || !agreePolicy}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: 14.5,
                    opacity: agreePolicy ? 1 : 0.65,
                    cursor: agreePolicy ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {busy ? 'Sending Verification Code…' : 'Verify Email & Create Account →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
                    Already have an account?{' '}
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
                        padding: 0,
                        color: 'var(--primary)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* Registration Step 2: Enter Email Verification OTP */
              <form onSubmit={handleVerifyRegisterOtp}>
                <div
                  style={{
                    background: 'var(--primary-light)',
                    border: '1px solid var(--primary-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    marginBottom: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: 13, color: 'var(--primary)' }}>
                    <span>Code sent to </span>
                    <strong style={{ wordBreak: 'break-all' }}>{email}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSignUpStep('form');
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
                  Enter the 6-Digit Email Verification Code
                </label>

                {/* 6 Segmented Digit Inputs */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 18,
                  }}
                  onPaste={(e) => handleDigitPaste(e, setSignUpOtpDigits, signUpDigitRefs)}
                >
                  {signUpOtpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        signUpDigitRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      aria-label={`Verification digit ${index + 1} of 6`}
                      value={digit}
                      onChange={(e) =>
                        handleDigitChange(index, e.target.value, signUpOtpDigits, setSignUpOtpDigits, signUpDigitRefs)
                      }
                      onKeyDown={(e) => handleDigitKeyDown(index, e, signUpOtpDigits, signUpDigitRefs)}
                      style={{
                        width: 46,
                        height: 50,
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
                <div style={{ textAlign: 'center', marginBottom: 18 }}>
                  {signUpResendTimer > 0 ? (
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                      Resend code in <strong>{signUpResendTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendRegisterOtp()}
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
                      Didn&apos;t receive email code? Resend verification code
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
                  disabled={busy || signUpOtpDigits.join('').length !== 6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: 14.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {busy ? 'Verifying & Creating Account…' : 'Verify & Complete Registration'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/">&larr; Back to Explore Pune</Link>
      </p>
    </main>
  );
}

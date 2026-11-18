'use client';
import { useState } from 'react';
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
  // Modes: 'password' (Sign In), 'up' (Create Account)
  const [mode, setMode] = useState<'password' | 'up'>('password');
  
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(false);

  // Status and messages
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

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

  // Password-based Submit (Sign In or Create Account)
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
        setErr('Email or password is incorrect. Check your credentials or click "Forgot password" to reset it.');
      } else if (code === 'auth/email-already-in-use') {
        setErr('An account with this email already exists. Try signing in instead.');
      } else if (code === 'auth/weak-password') {
        setErr('Password must be at least 6 characters.');
      } else {
        setErr(error?.message ?? 'Something went wrong. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  // Google Sign In
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

  // Password Reset Link
  async function reset() {
    if (!email) return setErr('Enter your email first, then click "Forgot password".');
    try {
      await sendPasswordResetEmail(auth, email);
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
            {mode === 'password' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            {mode === 'password'
              ? 'Sign in with your email and password'
              : 'Join the Explore Pune community of heritage explorers'}
          </p>
        </div>

        {/* 2-Tab Mode Switcher */}
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
            aria-selected={mode === 'password'}
            onClick={() => {
              setMode('password');
              setErr('');
              setMsg('');
            }}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: 0,
              borderRadius: '10px',
              background: mode === 'password' ? 'var(--card)' : 'transparent',
              color: mode === 'password' ? 'var(--ink)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: mode === 'password' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>🔑</span>
            <span>Sign In</span>
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
              padding: '10px 12px',
              border: 0,
              borderRadius: '10px',
              background: mode === 'up' ? 'var(--card)' : 'transparent',
              color: mode === 'up' ? 'var(--ink)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: mode === 'up' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>👤</span>
            <span>Create Account</span>
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
            letterSpacing: '0.04em',
            fontWeight: 600,
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span>OR WITH EMAIL</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        {/* =========================================================================
            EMAIL & PASSWORD FORM (SIGN IN & REGISTER)
            ========================================================================= */}
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
            type="submit"
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

          {/* Toggle between Sign In and Register */}
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            {mode === 'password' ? (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('up');
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
                  Create one now
                </button>
              </p>
            ) : (
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
            )}
          </div>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/">&larr; Back to Explore Pune</Link>
      </p>
    </main>
  );
}

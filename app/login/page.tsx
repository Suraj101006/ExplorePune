'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function ensureProfile(uid: string, displayName: string | null) {
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
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    setMsg('');
    try {
      if (mode === 'up') {
        const { user } = await createUserWithEmailAndPassword(auth, email, pw);
        if (name) await updateProfile(user, { displayName: name });
        await ensureProfile(user.uid, name || null);
        router.push('/account');
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
        router.push('/account');
      }
    } catch (error: any) {
      const code = error?.code ?? '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setErr('Email or password is incorrect.');
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

  async function googleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await ensureProfile(result.user.uid, result.user.displayName);
      router.push('/account');
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        setErr(error?.message ?? 'Google sign-in failed.');
      }
    }
  }

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
        maxWidth: 460,
      }}
    >
      <div
        className="panel"
        style={{
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: 'var(--primary-light)',
              fontSize: '24px',
              marginBottom: 12,
            }}
          >
            🚩
          </div>
          <h1 style={{ fontSize: 24, margin: '0 0 6px' }}>
            {mode === 'in' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            {mode === 'in'
              ? 'Sign in to save favorite spots and record visits'
              : 'Join the Explore Pune community of explorers'}
          </p>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: 'flex',
            background: 'var(--line-light)',
            padding: 4,
            borderRadius: 'var(--radius-md)',
            marginBottom: 24,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('in');
              setErr('');
              setMsg('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 0,
              borderRadius: '10px',
              background: mode === 'in' ? '#ffffff' : 'transparent',
              color: mode === 'in' ? 'var(--ink)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: mode === 'in' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('up');
              setErr('');
              setMsg('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 0,
              borderRadius: '10px',
              background: mode === 'up' ? '#ffffff' : 'transparent',
              color: mode === 'up' ? 'var(--ink)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: mode === 'up' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Google sign in button */}
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
            background: '#ffffff',
            color: 'var(--ink)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 20,
            transition: 'all 0.15s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
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
          <span>OR WITH EMAIL</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        {/* Email Form */}
        <form onSubmit={submit}>
          {mode === 'up' && (
            <div className="field">
              <label htmlFor="n">Your Name</label>
              <input
                id="n"
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
            <label htmlFor="e">Email Address</label>
            <input
              id="e"
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
              <label htmlFor="p" style={{ marginBottom: 0 }}>
                Password
              </label>
              {mode === 'in' && (
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
              id="p"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
              style={{ marginTop: 8 }}
            />
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
            disabled={busy}
            style={{ width: '100%', padding: '12px', fontSize: 15 }}
          >
            {busy
              ? 'Please wait…'
              : mode === 'in'
              ? 'Sign In to PuneTRAIL'
              : 'Create My Account'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/">&larr; Back to Explore Pune</Link>
      </p>
    </main>
  );
}

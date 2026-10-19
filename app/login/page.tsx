'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [name, setName] = useState('');
  const [msg, setMsg] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const back = () => `${location.origin}/account`;

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(''); setMsg('');
    if (mode === 'up') {
      const { data, error } = await supabase.auth.signUp({ email, password: pw, options: { data: { display_name: name || undefined }, emailRedirectTo: back() } });
      if (error) setErr(error.message);
      else if (data.session) router.push('/account');
      else setMsg('Check your email and click the link to verify your account, then sign in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) setErr('Email or password is incorrect, or the email is not verified yet.'); else router.push('/account');
    }
    setBusy(false);
  }
  async function reset() {
    if (!email) return setErr('Enter your email first, then choose “Forgot password”.');
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: back() });
    setErr(''); setMsg('If that email has an account, a reset link is on its way. After clicking it you can set a new password on your account page.');
  }

  return (
    <main className="wrap" style={{ paddingTop: 40, maxWidth: 440 }}>
      <h1>{mode === 'in' ? 'Sign in' : 'Create your account'}</h1>
      <form onSubmit={submit} className="panel">
        {mode === 'up' && <div className="field"><label htmlFor="n">Display name</label><input id="n" value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={50} /></div>}
        <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
        <div className="field"><label htmlFor="p">Password</label><input id="p" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required minLength={8} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} /></div>
        {err && <p className="note err" role="alert">{err}</p>}{msg && <p className="note" role="status">{msg}</p>}
        <button className="btn" disabled={busy} style={{ width: '100%' }}>{mode === 'in' ? 'Sign in' : 'Create account'}</button>
        <button type="button" className="chip" style={{ width: '100%', marginTop: 10 }} onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: back() } })}>Continue with Google</button>
      </form>
      <p>
        <button className="chip" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr(''); setMsg(''); }}>{mode === 'in' ? 'New here? Create an account' : 'Have an account? Sign in'}</button>{' '}
        {mode === 'in' && <button className="chip" onClick={reset}>Forgot password</button>}
      </p>
    </main>
  );
}

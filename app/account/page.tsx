'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/useAuth';

const STATUS: Record<string, string> = { pending: 'Waiting for review', published: 'Published', rejected: 'Not approved', removed: 'Removed' };

export default function AccountPage() {
  const { user, ready } = useAuth();
  const [d, setD] = useState<any>(null);
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  const [pw, setPw] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    const [p, f, v, b, r, bl] = await Promise.all([
      supabase.from('profiles').select('display_name, bio, profile_visibility').eq('id', user.id).single(),
      supabase.from('favorites').select('places(name, slug)').eq('user_id', user.id),
      supabase.from('visits').select('id, visited_at, places(name, slug)').eq('user_id', user.id).order('visited_at', { ascending: false }),
      supabase.from('user_milestones').select('earned_at, milestones(name, description)').eq('user_id', user.id),
      supabase.from('reviews').select('id, rating, status, places(name, slug)').eq('user_id', user.id),
      supabase.from('blogs').select('id, title, slug, status, is_draft').eq('author_id', user.id),
    ]);
    setD({ profile: p.data, favs: f.data ?? [], visits: v.data ?? [], badges: b.data ?? [], reviews: r.data ?? [], blogs: bl.data ?? [] });
  }, [user]);
  useEffect(() => { load(); }, [load]);

  if (!ready) return <main className="wrap" style={{ paddingTop: 40 }}>Loading…</main>;
  if (!user) return <main className="wrap" style={{ paddingTop: 40 }}><p className="note">Please <Link href="/login">sign in</Link> to see your account.</p></main>;
  if (!d) return <main className="wrap" style={{ paddingTop: 40 }}>Loading your account…</main>;

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); setErr(''); setMsg('');
    const { error } = await supabase.from('profiles').update({ display_name: String(f.get('n')), bio: String(f.get('b')) || null, profile_visibility: String(f.get('v')) }).eq('id', user!.id);
    error ? setErr('Could not save: ' + error.message) : setMsg('Profile saved.');
  }
  async function changePw(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setMsg('');
    const { error } = await supabase.auth.updateUser({ password: pw });
    error ? setErr(error.message) : (setMsg('Password updated.'), setPw(''));
  }
  async function removeVisit(id: string) { await supabase.from('visits').delete().eq('id', id); load(); }
  async function del() {
    if (!confirm('Delete your account and everything you posted? This cannot be undone.')) return;
    const { data } = await supabase.auth.getSession();
    const res = await fetch('/api/v1/account/delete', { method: 'POST', headers: { Authorization: `Bearer ${data.session?.access_token}` } });
    if (res.ok) { await supabase.auth.signOut(); location.href = '/'; } else setErr((await res.json()).error?.message ?? 'Could not delete the account.');
  }
  const one = (x: any) => (Array.isArray(x) ? x[0] : x);

  return (
    <main className="wrap" style={{ paddingTop: 36, display: 'grid', gap: 20 }}>
      <h1 style={{ margin: 0 }}>Your account</h1>
      {err && <p className="note err" role="alert">{err}</p>}{msg && <p className="note" role="status">{msg}</p>}
      <div className="two" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <form className="panel" onSubmit={saveProfile}>
          <h2 style={{ marginTop: 0 }}>Profile</h2>
          <div className="field"><label htmlFor="n">Display name</label><input id="n" name="n" defaultValue={d.profile?.display_name} minLength={2} maxLength={50} required /></div>
          <div className="field"><label htmlFor="b">About you</label><input id="b" name="b" defaultValue={d.profile?.bio ?? ''} maxLength={500} /></div>
          <div className="field"><label htmlFor="v">Who can see your profile</label><select id="v" name="v" defaultValue={d.profile?.profile_visibility}><option value="public">Everyone</option><option value="private">Only me</option></select></div>
          <button className="btn">Save profile</button>
        </form>
        <form className="panel" onSubmit={changePw}>
          <h2 style={{ marginTop: 0 }}>Password</h2>
          <div className="field"><label htmlFor="pw">New password (8+ characters)</label><input id="pw" type="password" minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="new-password" /></div>
          <button className="btn">Change password</button>
        </form>
      </div>

      <section className="panel"><h2 style={{ marginTop: 0 }}>Badges</h2>
        {d.badges.length === 0 ? <p style={{ margin: 0 }}>No badges yet. Mark a place as visited to earn your first one.</p> :
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{d.badges.map((b: any, i: number) => <span key={i} className="tier verified" title={one(b.milestones)?.description}>{one(b.milestones)?.name}</span>)}</div>}
      </section>
      <section className="panel"><h2 style={{ marginTop: 0 }}>Saved places</h2>
        {d.favs.length === 0 ? <p style={{ margin: 0 }}>Nothing saved yet. Use “Save” on any place page.</p> : <ul>{d.favs.map((f: any, i: number) => <li key={i}><Link href={`/places/${one(f.places)?.slug}`}>{one(f.places)?.name}</Link></li>)}</ul>}
      </section>
      <section className="panel"><h2 style={{ marginTop: 0 }}>Places you’ve visited</h2>
        {d.visits.length === 0 ? <p style={{ margin: 0 }}>No visits recorded yet.</p> : <ul>{d.visits.map((v: any) => <li key={v.id}><Link href={`/places/${one(v.places)?.slug}`}>{one(v.places)?.name}</Link>, {v.visited_at} <button className="chip" onClick={() => removeVisit(v.id)}>Remove</button></li>)}</ul>}
      </section>
      <section className="panel"><h2 style={{ marginTop: 0 }}>Your reviews</h2>
        {d.reviews.length === 0 ? <p style={{ margin: 0 }}>You haven’t reviewed any place yet.</p> : <ul>{d.reviews.map((r: any) => <li key={r.id}><Link href={`/places/${one(r.places)?.slug}`}>{one(r.places)?.name}</Link>, {r.rating}/5, {STATUS[r.status]}</li>)}</ul>}
      </section>
      <section className="panel"><h2 style={{ marginTop: 0 }}>Your blogs</h2>
        <p><Link className="btn" href="/blogs/new">Write a blog</Link></p>
        <ul>{d.blogs.map((b: any) => <li key={b.id}>{b.status === 'published' ? <Link href={`/blogs/${b.slug}`}>{b.title}</Link> : b.title}, {b.is_draft ? 'Draft' : STATUS[b.status]}</li>)}</ul>
      </section>
      <p style={{ display: 'flex', gap: 10 }}>
        <button className="chip" onClick={async () => { await supabase.auth.signOut(); location.href = '/'; }}>Sign out</button>
        <button className="chip" onClick={del}>Delete my account</button>
      </p>
    </main>
  );
}

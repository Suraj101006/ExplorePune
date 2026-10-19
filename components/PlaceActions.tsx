'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/useAuth';

export default function PlaceActions({ placeId }: { placeId: string }) {
  const { user, ready } = useAuth();
  const [fav, setFav] = useState(false); const [visits, setVisits] = useState(0);
  const [open, setOpen] = useState(false); const [msg, setMsg] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [note, setNote] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      const f = await supabase.from('favorites').select('place_id').eq('place_id', placeId).eq('user_id', user.id).maybeSingle();
      setFav(!!f.data);
      const v = await supabase.from('visits').select('id', { count: 'exact', head: true }).eq('place_id', placeId).eq('user_id', user.id);
      setVisits(v.count ?? 0);
    })();
  }, [user, placeId]);

  if (!ready) return null;
  if (!user) return <p className="note" style={{ marginBottom: 24 }}><Link href="/login">Sign in</Link> to save places, record visits and earn badges.</p>;

  async function toggleFav() {
    const q = fav ? supabase.from('favorites').delete().eq('place_id', placeId).eq('user_id', user!.id) : supabase.from('favorites').insert({ place_id: placeId, user_id: user!.id });
    const { error } = await q; if (!error) setFav(!fav); else setMsg('Could not update your saved places.');
  }
  async function visit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('visits').insert({ place_id: placeId, user_id: user!.id, visited_at: date, notes: note || null });
    if (error) return setMsg('Could not record the visit.');
    setVisits((n) => n + 1); setOpen(false); setNote(''); setMsg('Visit recorded. Check your account for new badges.');
  }
  return (
    <div style={{ margin: '0 0 24px' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn" onClick={toggleFav} aria-pressed={fav}>{fav ? 'Saved' : 'Save place'}</button>
        <button className="btn clay" onClick={() => setOpen((o) => !o)} aria-expanded={open}>I’ve been here{visits ? ` (${visits})` : ''}</button>
        {msg && <span role="status">{msg}</span>}
      </div>
      {open && (
        <form onSubmit={visit} className="panel" style={{ marginTop: 12, display: 'grid', gap: 10, maxWidth: 420 }}>
          <div className="field" style={{ margin: 0 }}><label htmlFor="vd">Date of visit</label><input id="vd" type="date" max={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} required /></div>
          <div className="field" style={{ margin: 0 }}><label htmlFor="vn">Note (optional)</label><input id="vn" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} /></div>
          <button className="btn">Save visit</button>
        </form>
      )}
    </div>
  );
}

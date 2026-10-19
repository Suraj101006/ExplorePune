'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/useAuth';

export default function Reviews({ placeId }: { placeId: string }) {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]); const [mine, setMine] = useState<any>(null);
  const [rating, setRating] = useState(5); const [text, setText] = useState('');
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('reviews').select('id, rating, review_text, created_at, user_id, profiles(display_name)').eq('place_id', placeId).eq('status', 'published').order('created_at', { ascending: false }).limit(30);
    setList(data ?? []);
    if (user) {
      const { data: m } = await supabase.from('reviews').select('rating, review_text, status').eq('place_id', placeId).eq('user_id', user.id).maybeSingle();
      setMine(m); if (m) { setRating(m.rating); setText(m.review_text ?? ''); }
    }
  }, [placeId, user]);
  useEffect(() => { load(); }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setMsg('');
    const { error } = await supabase.from('reviews').upsert({ place_id: placeId, user_id: user!.id, rating, review_text: text, status: 'pending' }, { onConflict: 'place_id,user_id' });
    if (error) return setErr('Reviews need 10 to 2000 characters. ' + error.message);
    setMsg('Thanks. Your review will appear once a moderator approves it.'); load();
  }
  async function remove() { await supabase.from('reviews').delete().eq('place_id', placeId).eq('user_id', user!.id); setMine(null); setText(''); setRating(5); load(); }
  async function report(id: string) {
    const reason = prompt('What is wrong with this review?'); if (!reason) return;
    const { error } = await supabase.from('reports').insert({ reporter_id: user!.id, target_type: 'review', target_id: id, reason: reason.slice(0, 500) });
    alert(error ? 'Could not send the report.' : 'Thanks, a moderator will take a look.');
  }

  return (
    <section className="panel" style={{ marginTop: 24 }}>
      <h2 style={{ marginTop: 0 }}>Reviews</h2>
      {list.length === 0 && <p>No reviews yet. Be the first to share what it was like.</p>}
      {list.map((r) => {
        const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
        return (
          <article key={r.id} style={{ borderTop: '1px solid var(--line)', padding: '12px 0' }}>
            <strong>{r.rating}/5</strong> by {p?.display_name ?? 'a traveller'}
            <p style={{ margin: '4px 0', whiteSpace: 'pre-wrap' }}>{r.review_text}</p>
            {user && r.user_id !== user.id && <button className="chip" onClick={() => report(r.id)}>Report</button>}
          </article>
        );
      })}
      {user ? (
        <form onSubmit={save} style={{ borderTop: '1px solid var(--line)', paddingTop: 14, display: 'grid', gap: 10 }}>
          <h3 style={{ margin: 0 }}>{mine ? 'Your review' : 'Write a review'}{mine?.status === 'pending' ? ' (waiting for approval)' : ''}</h3>
          <div className="field" style={{ margin: 0 }}><label htmlFor="rt">Rating</label>
            <select id="rt" value={rating} onChange={(e) => setRating(Number(e.target.value))}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} out of 5</option>)}</select></div>
          <div className="field" style={{ margin: 0 }}><label htmlFor="rx">What was it like? (10 to 2000 characters)</label>
            <textarea id="rx" value={text} onChange={(e) => setText(e.target.value)} minLength={10} maxLength={2000} rows={4} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cdbf9f', font: 'inherit' }} /></div>
          {err && <p className="note err" role="alert">{err}</p>}{msg && <p className="note" role="status">{msg}</p>}
          <div style={{ display: 'flex', gap: 8 }}><button className="btn">{mine ? 'Update review' : 'Submit review'}</button>{mine && <button type="button" className="chip" onClick={remove}>Delete</button>}</div>
        </form>
      ) : <p><Link href="/login">Sign in</Link> to write a review.</p>}
    </section>
  );
}

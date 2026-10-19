'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/useAuth';

const one = (x: any) => (Array.isArray(x) ? x[0] : x);
const slugify = (t: string) => t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
const box = { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cdbf9f', font: 'inherit' } as const;

export default function AdminPage() {
  const { user, isStaff, isAdmin, ready } = useAuth();
  const [tab, setTab] = useState('moderate');
  if (!ready) return <main className="wrap" style={{ paddingTop: 40 }}>Loading…</main>;
  if (!user || !isStaff) return <main className="wrap" style={{ paddingTop: 40 }}><p className="note">This area is for moderators and admins. <Link href="/login">Sign in</Link> with a staff account.</p></main>;
  const tabs = [['moderate', 'Moderation'], ...(isAdmin ? [['places', 'Places and verification'], ['staging', 'Import queue'], ['milestones', 'Badges'], ['stats', 'Statistics']] : [])];
  return (
    <main className="wrap" style={{ paddingTop: 36 }}>
      <h1>Admin</h1>
      <nav className="chips" aria-label="Admin sections">{tabs.map(([k, l]) => <button key={k} className="chip" aria-current={tab === k} onClick={() => setTab(k)}>{l}</button>)}</nav>
      {tab === 'moderate' && <Moderate />}{isAdmin && tab === 'places' && <Places />}{isAdmin && tab === 'staging' && <Staging />}{isAdmin && tab === 'milestones' && <Milestones />}{isAdmin && tab === 'stats' && <Stats />}
    </main>
  );
}

function Moderate() {
  const [rv, setRv] = useState<any[]>([]); const [bl, setBl] = useState<any[]>([]); const [rp, setRp] = useState<any[]>([]);
  const load = useCallback(async () => {
    const [a, b, c] = await Promise.all([
      supabase.from('reviews').select('id, rating, review_text, places(name), profiles(display_name)').eq('status', 'pending').order('created_at').limit(50),
      supabase.from('blogs').select('id, title, content, profiles(display_name)').eq('status', 'pending').eq('is_draft', false).order('created_at').limit(50),
      supabase.from('reports').select('id, target_type, target_id, reason').eq('status', 'open').order('created_at').limit(50),
    ]);
    setRv(a.data ?? []); setBl(b.data ?? []); setRp(c.data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);
  const setStatus = async (table: 'reviews' | 'blogs', id: string, status: string) => {
    await supabase.from(table).update(table === 'blogs' && status === 'published' ? { status, published_at: new Date().toISOString() } : { status }).eq('id', id); load();
  };
  const closeReport = async (r: any, remove: boolean) => {
    if (remove && r.target_type !== 'place') await supabase.from(r.target_type === 'review' ? 'reviews' : 'blogs').update({ status: 'removed' }).eq('id', r.target_id);
    await supabase.from('reports').update({ status: remove ? 'resolved' : 'dismissed' }).eq('id', r.id); load();
  };
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <section className="panel"><h2 style={{ marginTop: 0 }}>Reviews waiting ({rv.length})</h2>
        {rv.length === 0 && <p>Nothing to review.</p>}
        {rv.map((r) => <div key={r.id} style={{ borderTop: '1px solid var(--line)', padding: '10px 0' }}><strong>{one(r.places)?.name}</strong>, {r.rating}/5 by {one(r.profiles)?.display_name}<p style={{ margin: '4px 0', whiteSpace: 'pre-wrap' }}>{r.review_text}</p>
          <button className="btn" onClick={() => setStatus('reviews', r.id, 'published')}>Approve</button> <button className="chip" onClick={() => setStatus('reviews', r.id, 'rejected')}>Reject</button></div>)}</section>
      <section className="panel"><h2 style={{ marginTop: 0 }}>Blogs waiting ({bl.length})</h2>
        {bl.length === 0 && <p>Nothing to review.</p>}
        {bl.map((b) => <details key={b.id} style={{ borderTop: '1px solid var(--line)', padding: '10px 0' }}><summary><strong>{b.title}</strong> by {one(b.profiles)?.display_name}</summary><p style={{ whiteSpace: 'pre-wrap' }}>{b.content}</p>
          <button className="btn" onClick={() => setStatus('blogs', b.id, 'published')}>Approve</button> <button className="chip" onClick={() => setStatus('blogs', b.id, 'rejected')}>Reject</button></details>)}</section>
      <section className="panel"><h2 style={{ marginTop: 0 }}>Open reports ({rp.length})</h2>
        {rp.length === 0 && <p>No open reports.</p>}
        {rp.map((r) => <div key={r.id} style={{ borderTop: '1px solid var(--line)', padding: '10px 0' }}>{r.target_type} {r.target_id.slice(0, 8)}: {r.reason}<br />
          <button className="btn" onClick={() => closeReport(r, true)}>Remove content</button> <button className="chip" onClick={() => closeReport(r, false)}>Dismiss</button></div>)}</section>
    </div>
  );
}

function Places() {
  const [q, setQ] = useState(''); const [list, setList] = useState<any[]>([]); const [sel, setSel] = useState<any>(null); const [msg, setMsg] = useState('');
  const search = async () => {
    let r = supabase.from('places').select('id, name, data_tier, status, description, address, recommended_duration_minutes, website_url, locked_fields').order('name').limit(30);
    if (q.trim()) r = r.ilike('name', `%${q.replace(/[%,()]/g, '')}%`);
    setList((await r).data ?? []);
  };
  useEffect(() => { search(); /* eslint-disable-next-line */ }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const g = (k: string) => String(f.get(k) ?? '').trim();
    const fields: Record<string, any> = { description: g('description') || null, address: g('address') || null, website_url: g('website_url') || null, recommended_duration_minutes: g('dur') ? Number(g('dur')) : null };
    const changed = Object.keys(fields).filter((k) => (fields[k] ?? '') !== ((k === 'recommended_duration_minutes' ? sel.recommended_duration_minutes : sel[k]) ?? ''));
    const patch: any = { ...fields, locked_fields: [...new Set([...(sel.locked_fields ?? []), ...changed])], updated_at: new Date().toISOString() };
    if (f.get('status')) patch.status = g('status');
    // optional verification block: needs a source URL, flips the place to "verified"
    if (g('source_url')) {
      const now = new Date().toISOString(), src = g('source_url');
      await supabase.from('place_hours').delete().eq('place_id', sel.id); await supabase.from('place_prices').delete().eq('place_id', sel.id);
      if (g('opens') && g('closes')) await supabase.from('place_hours').insert([0, 1, 2, 3, 4, 5, 6].map((d) => ({ place_id: sel.id, day_of_week: d, opens_at: g('opens'), closes_at: g('closes'), source_url: src, verified_at: now })));
      if (f.get('free') || g('fee')) await supabase.from('place_prices').insert({ place_id: sel.id, visitor_category: 'Indian adult', amount: f.get('free') ? null : Number(g('fee')), is_free: !!f.get('free'), source_url: src, verified_at: now });
      await supabase.from('place_sources').insert({ place_id: sel.id, field_name: 'hours_and_fees', source_url: src, source_type: 'official_operator', verification_status: 'verified', verified_at: now });
      Object.assign(patch, { data_tier: 'verified', last_verified_at: now });
    }
    const { error } = await supabase.from('places').update(patch).eq('id', sel.id);
    setMsg(error ? 'Save failed: ' + error.message : 'Saved.'); if (!error) { setSel(null); search(); }
  }
  return (
    <div className="two" style={{ gridTemplateColumns: '1fr 2fr' }}>
      <section className="panel"><form onSubmit={(e) => { e.preventDefault(); search(); }} className="search" style={{ margin: 0 }}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search places" aria-label="Search places" /><button className="btn">Go</button></form>
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>{list.map((p) => <li key={p.id}><button className="chip" style={{ width: '100%', textAlign: 'left', margin: '4px 0' }} onClick={() => { setSel(p); setMsg(''); }}>{p.name} <small>({p.data_tier}, {p.status})</small></button></li>)}</ul></section>
      <section className="panel">{!sel ? <p>{msg || 'Choose a place to edit or verify.'}</p> : (
        <form key={sel.id} onSubmit={save} style={{ display: 'grid', gap: 10 }}>
          <h2 style={{ margin: 0 }}>{sel.name}</h2>
          <label>Description<textarea name="description" rows={4} defaultValue={sel.description ?? ''} style={box} /></label>
          <label>Address<input name="address" defaultValue={sel.address ?? ''} style={box} /></label>
          <label>Website<input name="website_url" defaultValue={sel.website_url ?? ''} style={box} /></label>
          <label>Recommended visit (minutes)<input name="dur" type="number" min={5} defaultValue={sel.recommended_duration_minutes ?? ''} style={box} /></label>
          <label>Status<select name="status" defaultValue={sel.status} style={box}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
          <fieldset style={{ border: '1px solid var(--line)', borderRadius: 8 }}><legend>Verify hours and fees (needs an official source)</legend>
            <label>Source URL<input name="source_url" type="url" style={box} /></label>
            <label>Opens<input name="opens" type="time" style={box} /></label><label>Closes<input name="closes" type="time" style={box} /></label>
            <label>Adult fee (₹)<input name="fee" type="number" min={0} style={box} /></label><label><input type="checkbox" name="free" /> Free entry</label>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '6px 0 0' }}>Hours apply to all 7 days. Leave the fee blank if unknown. Fields you edit are locked against re-imports.</p></fieldset>
          {msg && <p className="note">{msg}</p>}<button className="btn">Save</button>
        </form>)}</section>
    </div>
  );
}

function Staging() {
  const [rows, setRows] = useState<any[]>([]); const [cats, setCats] = useState<Map<string, string>>(new Map()); const [msg, setMsg] = useState('');
  const load = useCallback(async () => {
    setRows((await supabase.from('place_import_staging').select('id, name, name_mr, latitude, longitude, suggested_category, source_id').eq('status', 'pending').order('name').limit(50)).data ?? []);
    setCats(new Map(((await supabase.from('place_categories').select('id, slug')).data ?? []).map((c: any) => [c.slug, c.id])));
  }, []);
  useEffect(() => { load(); }, [load]);
  async function approve(r: any) {
    const { data, error } = await supabase.from('places').upsert({ slug: `${slugify(r.name)}-${r.source_id.replace(/[^a-zA-Z0-9]/g, '-')}`, name: r.name, name_mr: r.name_mr, category_id: cats.get(r.suggested_category) ?? cats.get('attractions') ?? null, latitude: r.latitude, longitude: r.longitude, osm_id: r.source_id.startsWith('osm:') ? r.source_id.slice(4) : null, data_tier: 'listed', status: 'published', zone: 'city' }, { onConflict: 'slug' }).select('id').single();
    if (error) return setMsg('Could not publish ' + r.name + ': ' + error.message);
    await supabase.from('place_import_staging').update({ status: 'approved', matched_place_id: data.id }).eq('id', r.id); load();
  }
  const reject = async (id: string) => { await supabase.from('place_import_staging').update({ status: 'rejected' }).eq('id', id); load(); };
  return (
    <section className="panel"><h2 style={{ marginTop: 0 }}>Imported places waiting ({rows.length}{rows.length === 50 ? '+' : ''})</h2>{msg && <p className="note err">{msg}</p>}
      {rows.length === 0 && <p>The queue is empty. Run <code>npm run import:osm</code> to stage more places.</p>}
      {rows.map((r) => <div key={r.id} style={{ borderTop: '1px solid var(--line)', padding: '8px 0', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}><span style={{ flex: 1 }}>{r.name} <small>({r.suggested_category})</small></span>
        <button className="btn" onClick={() => approve(r)}>Publish</button><button className="chip" onClick={() => reject(r.id)}>Reject</button></div>)}</section>
  );
}

function Milestones() {
  const [rows, setRows] = useState<any[]>([]); const [msg, setMsg] = useState('');
  useEffect(() => { supabase.from('milestones').select('id, name, criteria_type, criteria_value, is_active').order('name').then(({ data }) => setRows(data ?? [])); }, []);
  async function save(m: any) { const { error } = await supabase.from('milestones').update({ criteria_value: m.criteria_value, is_active: m.is_active }).eq('id', m.id); setMsg(error ? 'Could not save.' : `Saved ${m.name}.`); }
  const edit = (id: string, p: any) => setRows((r) => r.map((m) => (m.id === id ? { ...m, ...p } : m)));
  return (
    <section className="panel"><h2 style={{ marginTop: 0 }}>Badges</h2>{msg && <p className="note" role="status">{msg}</p>}
      {rows.map((m) => <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', padding: '8px 0', borderTop: '1px solid var(--line)' }}>
        <strong style={{ flex: 1 }}>{m.name} <small>({m.criteria_type})</small></strong>
        <input type="number" min={1} value={m.criteria_value} onChange={(e) => edit(m.id, { criteria_value: Number(e.target.value) })} aria-label={`${m.name} threshold`} style={{ width: 80, padding: 6 }} />
        <label><input type="checkbox" checked={m.is_active} onChange={(e) => edit(m.id, { is_active: e.target.checked })} /> Active</label><button className="btn" onClick={() => save(m)}>Save</button></div>)}</section>
  );
}

function Stats() {
  const [s, setS] = useState<Record<string, number>>({});
  useEffect(() => {
    const c = (t: string, f?: (q: any) => any) => { const q: any = supabase.from(t).select('id', { count: 'exact', head: true }); return (f ? f(q) : q).then((r: any) => r.count ?? 0); };
    Promise.all([c('places', (q) => q.eq('status', 'published')), c('places', (q) => q.eq('data_tier', 'verified')), c('profiles'), c('reviews', (q) => q.eq('status', 'published')), c('blogs', (q) => q.eq('status', 'published')), c('reports', (q) => q.eq('status', 'open')), c('place_import_staging', (q) => q.eq('status', 'pending'))])
      .then(([a, b, p, r, bl, rp, st]) => setS({ 'Published places': a, 'Verified places': b, 'Members': p, 'Published reviews': r, 'Published blogs': bl, 'Open reports': rp, 'Imports waiting': st }));
  }, []);
  return <section className="grid">{Object.entries(s).map(([k, v]) => <div key={k} className="panel"><div style={{ color: 'var(--muted)' }}>{k}</div><strong style={{ fontSize: 32, fontFamily: 'var(--serif)', color: 'var(--green)' }}>{v}</strong></div>)}</section>;
}

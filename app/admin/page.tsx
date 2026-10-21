'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { useAuth } from '@/lib/useAuth';

const slugify = (t: string) =>
  t
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
const box = {
  width: '100%',
  padding: 10,
  borderRadius: '8px',
  border: '1px solid var(--line)',
  font: 'inherit',
} as const;

export default function AdminPage() {
  const { user, isStaff, isAdmin, ready } = useAuth();
  const [tab, setTab] = useState('moderate');

  if (!ready) return <main className="wrap" style={{ paddingTop: 40 }}>Loading…</main>;
  if (!user || !isStaff) {
    return (
      <main className="wrap" style={{ paddingTop: 40 }}>
        <p className="note">
          This area is for moderators and admins. <Link href="/login">Sign in</Link> with a staff account.
        </p>
      </main>
    );
  }

  const tabs = [
    ['moderate', 'Moderation'],
    ['feedback', 'User Feedbacks'],
    ...(isAdmin
      ? [
          ['places', 'Places and verification'],
          ['staging', 'Import queue'],
          ['milestones', 'Badges'],
          ['stats', 'Statistics'],
        ]
      : []),
  ];

  return (
    <main className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
      <h1>Admin Dashboard</h1>
      <nav className="chips" aria-label="Admin sections">
        {tabs.map(([k, l]) => (
          <button key={k} className="chip" aria-current={tab === k} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </nav>
      {tab === 'moderate' && <Moderate />}
      {tab === 'feedback' && <FeedbackAdminViewer />}
      {isAdmin && tab === 'places' && <Places />}
      {isAdmin && tab === 'staging' && <Staging />}
      {isAdmin && tab === 'milestones' && <Milestones />}
      {isAdmin && tab === 'stats' && <Stats />}
    </main>
  );
}

function Moderate() {
  const [rv, setRv] = useState<any[]>([]);
  const [bl, setBl] = useState<any[]>([]);
  const [rp, setRp] = useState<any[]>([]);

  const load = useCallback(async () => {
    try {
      const reviewsSnap = await getDocs(
        query(collection(db, 'reviews'), where('status', '==', 'pending'), limit(50))
      );
      const blogsSnap = await getDocs(
        query(collection(db, 'blogs'), where('status', '==', 'pending'), limit(50))
      );
      const reportsSnap = await getDocs(
        query(collection(db, 'reports'), where('status', '==', 'open'), limit(50))
      );

      setRv(reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setBl(blogsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setRp(reportsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Error loading moderation data:', e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (table: 'reviews' | 'blogs', id: string, status: string) => {
    try {
      await updateDoc(
        doc(db, table, id),
        table === 'blogs' && status === 'published'
          ? { status, published_at: new Date().toISOString() }
          : { status }
      );
      load();
    } catch (e) {
      console.error('Failed to set status:', e);
    }
  };

  const closeReport = async (r: any, remove: boolean) => {
    try {
      if (remove && r.target_type !== 'place') {
        await updateDoc(doc(db, r.target_type === 'review' ? 'reviews' : 'blogs', r.target_id), {
          status: 'removed',
        });
      }
      await updateDoc(doc(db, 'reports', r.id), {
        status: remove ? 'resolved' : 'dismissed',
      });
      load();
    } catch (e) {
      console.error('Failed to close report:', e);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Reviews waiting ({rv.length})</h2>
        {rv.length === 0 && <p>Nothing to review.</p>}
        {rv.map((r) => (
          <div key={r.id} style={{ borderTop: '1px solid var(--line)', padding: '10px 0' }}>
            <strong>{r.place_name || 'Place'}</strong>, {r.rating}/5 by {r.user_name || 'User'}
            <p style={{ margin: '4px 0', whiteSpace: 'pre-wrap' }}>{r.review_text}</p>
            <button className="btn" onClick={() => setStatus('reviews', r.id, 'published')}>
              Approve
            </button>{' '}
            <button className="chip" onClick={() => setStatus('reviews', r.id, 'rejected')}>
              Reject
            </button>
          </div>
        ))}
      </section>

      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Blogs waiting ({bl.length})</h2>
        {bl.length === 0 && <p>Nothing to review.</p>}
        {bl.map((b) => (
          <details key={b.id} style={{ borderTop: '1px solid var(--line)', padding: '10px 0' }}>
            <summary>
              <strong>{b.title}</strong> by {b.author_name || 'User'}
            </summary>
            <p style={{ whiteSpace: 'pre-wrap' }}>{b.content}</p>
            <button className="btn" onClick={() => setStatus('blogs', b.id, 'published')}>
              Approve
            </button>{' '}
            <button className="chip" onClick={() => setStatus('blogs', b.id, 'rejected')}>
              Reject
            </button>
          </details>
        ))}
      </section>

      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Open reports ({rp.length})</h2>
        {rp.length === 0 && <p>No open reports.</p>}
        {rp.map((r) => (
          <div key={r.id} style={{ borderTop: '1px solid var(--line)', padding: '10px 0' }}>
            {r.target_type} {r.target_id?.slice(0, 8)}: {r.reason}
            <br />
            <button className="btn" onClick={() => closeReport(r, true)}>
              Remove content
            </button>{' '}
            <button className="chip" onClick={() => closeReport(r, false)}>
              Dismiss
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

function Places() {
  const [q, setQ] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [sel, setSel] = useState<any>(null);
  const [msg, setMsg] = useState('');

  const search = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'places'), limit(60)));
      let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (q.trim()) {
        const lower = q.toLowerCase();
        items = items.filter(
          (p: any) =>
            (p.name && p.name.toLowerCase().includes(lower)) ||
            (p.name_mr && p.name_mr.toLowerCase().includes(lower))
        );
      }
      setList(items.slice(0, 30));
    } catch (e) {
      console.error('Error fetching places:', e);
    }
  };

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? '').trim();
    const fields: Record<string, any> = {
      description: g('description') || null,
      address: g('address') || null,
      website_url: g('website_url') || null,
      recommended_duration_minutes: g('dur') ? Number(g('dur')) : null,
    };
    const changed = Object.keys(fields).filter(
      (k) =>
        (fields[k] ?? '') !==
        ((k === 'recommended_duration_minutes' ? sel.recommended_duration_minutes : sel[k]) ?? '')
    );
    const patch: any = {
      ...fields,
      locked_fields: [...new Set([...(sel.locked_fields ?? []), ...changed])],
      updated_at: new Date().toISOString(),
    };
    if (f.get('status')) patch.status = g('status');

    if (g('source_url')) {
      const now = new Date().toISOString(),
        src = g('source_url');
      if (g('opens') && g('closes')) {
        patch.opening_hours = { opens: g('opens'), closes: g('closes') };
      }
      if (f.get('free') || g('fee')) {
        patch.place_prices = [
          {
            visitor_category: 'General',
            amount: f.get('free') ? 0 : Number(g('fee')),
            is_free: !!f.get('free'),
            source_url: src,
            verified_at: now,
          },
        ];
      }
      Object.assign(patch, { data_tier: 'verified', last_verified_at: now });
    }

    try {
      await updateDoc(doc(db, 'places', sel.id), patch);
      setMsg('Saved.');
      setSel(null);
      search();
    } catch (err: any) {
      setMsg('Save failed: ' + err.message);
    }
  }

  return (
    <div className="two" style={{ gridTemplateColumns: '1fr 2fr' }}>
      <section className="panel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="search"
          style={{ margin: 0 }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search places"
            aria-label="Search places"
          />
          <button className="btn">Go</button>
        </form>
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          {list.map((p) => (
            <li key={p.id}>
              <button
                className="chip"
                style={{ width: '100%', textAlign: 'left', margin: '4px 0' }}
                onClick={() => {
                  setSel(p);
                  setMsg('');
                }}
              >
                {p.name} <small>({p.data_tier}, {p.status})</small>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        {!sel ? (
          <p>{msg || 'Choose a place to edit or verify.'}</p>
        ) : (
          <form key={sel.id} onSubmit={save} style={{ display: 'grid', gap: 10 }}>
            <h2 style={{ margin: 0 }}>{sel.name}</h2>
            <label>
              Description
              <textarea name="description" rows={4} defaultValue={sel.description ?? ''} style={box} />
            </label>
            <label>
              Address
              <input name="address" defaultValue={sel.address ?? ''} style={box} />
            </label>
            <label>
              Website
              <input name="website_url" defaultValue={sel.website_url ?? ''} style={box} />
            </label>
            <label>
              Recommended visit (minutes)
              <input
                name="dur"
                type="number"
                min={5}
                defaultValue={sel.recommended_duration_minutes ?? ''}
                style={box}
              />
            </label>
            <label>
              Status
              <select name="status" defaultValue={sel.status} style={box}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <fieldset style={{ border: '1px solid var(--line)', borderRadius: 8 }}>
              <legend>Verify hours and fees (needs an official source)</legend>
              <label>
                Source URL
                <input name="source_url" type="url" style={box} />
              </label>
              <label>
                Opens
                <input name="opens" type="time" style={box} />
              </label>
              <label>
                Closes
                <input name="closes" type="time" style={box} />
              </label>
              <label>
                Adult fee (₹)
                <input name="fee" type="number" min={0} style={box} />
              </label>
              <label>
                <input type="checkbox" name="free" /> Free entry
              </label>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '6px 0 0' }}>
                Hours apply to all 7 days. Leave the fee blank if unknown.
              </p>
            </fieldset>
            {msg && <p className="note">{msg}</p>}
            <button className="btn">Save</button>
          </form>
        )}
      </section>
    </div>
  );
}

function Staging() {
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    try {
      const snap = await getDocs(
        query(collection(db, 'place_import_staging'), where('status', '==', 'pending'), limit(50))
      );
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function approve(r: any) {
    try {
      const placeSlug = `${slugify(r.name)}-${Math.random().toString(36).slice(2, 6)}`;
      await setDoc(doc(db, 'places', placeSlug), {
        slug: placeSlug,
        name: r.name,
        name_mr: r.name_mr || null,
        category: r.suggested_category || 'attractions',
        latitude: r.latitude,
        longitude: r.longitude,
        data_tier: 'listed',
        status: 'published',
        zone: 'city',
        created_at: new Date().toISOString(),
      });
      await updateDoc(doc(db, 'place_import_staging', r.id), { status: 'approved' });
      load();
    } catch (error: any) {
      setMsg('Could not publish ' + r.name + ': ' + error.message);
    }
  }

  const reject = async (id: string) => {
    try {
      await updateDoc(doc(db, 'place_import_staging', id), { status: 'rejected' });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>Imported places waiting ({rows.length})</h2>
      {msg && <p className="note err">{msg}</p>}
      {rows.length === 0 && <p>The queue is empty.</p>}
      {rows.map((r) => (
        <div
          key={r.id}
          style={{
            borderTop: '1px solid var(--line)',
            padding: '8px 0',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ flex: 1 }}>
            {r.name} <small>({r.suggested_category})</small>
          </span>
          <button className="btn" onClick={() => approve(r)}>
            Publish
          </button>
          <button className="chip" onClick={() => reject(r.id)}>
            Reject
          </button>
        </div>
      ))}
    </section>
  );
}

function Milestones() {
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'milestones'));
        setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  async function save(m: any) {
    try {
      await updateDoc(doc(db, 'milestones', m.id), {
        criteria_value: m.criteria_value,
        is_active: m.is_active,
      });
      setMsg(`Saved ${m.name}.`);
    } catch {
      setMsg('Could not save.');
    }
  }

  const edit = (id: string, p: any) =>
    setRows((r) => r.map((m) => (m.id === id ? { ...m, ...p } : m)));

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>Badges</h2>
      {msg && (
        <p className="note" role="status">
          {msg}
        </p>
      )}
      {rows.length === 0 && <p>No milestones configured yet.</p>}
      {rows.map((m) => (
        <div
          key={m.id}
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '8px 0',
            borderTop: '1px solid var(--line)',
          }}
        >
          <strong style={{ flex: 1 }}>
            {m.name} <small>({m.criteria_type})</small>
          </strong>
          <input
            type="number"
            min={1}
            value={m.criteria_value}
            onChange={(e) => edit(m.id, { criteria_value: Number(e.target.value) })}
            aria-label={`${m.name} threshold`}
            style={{ width: 80, padding: 6 }}
          />
          <label>
            <input
              type="checkbox"
              checked={m.is_active}
              onChange={(e) => edit(m.id, { is_active: e.target.checked })}
            />{' '}
            Active
          </label>
          <button className="btn" onClick={() => save(m)}>
            Save
          </button>
        </div>
      ))}
    </section>
  );
}

function Stats() {
  const [s, setS] = useState<Record<string, number>>({});

  useEffect(() => {
    const countColl = async (collName: string, status?: string) => {
      try {
        const q = status
          ? query(collection(db, collName), where('status', '==', status))
          : collection(db, collName);
        const snap = await getDocs(q);
        return snap.size;
      } catch {
        return 0;
      }
    };

    Promise.all([
      countColl('places', 'published'),
      countColl('places'),
      countColl('profiles'),
      countColl('reviews', 'published'),
      countColl('blogs', 'published'),
      countColl('reports', 'open'),
      countColl('place_import_staging', 'pending'),
    ]).then(([pubPlaces, totalPlaces, p, r, bl, rp, st]) =>
      setS({
        'Published places': pubPlaces,
        'Total places in DB': totalPlaces,
        Members: p,
        'Published reviews': r,
        'Published blogs': bl,
        'Open reports': rp,
        'Imports waiting': st,
      })
    );
  }, []);

  return (
    <section className="grid">
      {Object.entries(s).map(([k, v]) => (
        <div key={k} className="panel">
          <div style={{ color: 'var(--muted)' }}>{k}</div>
          <strong style={{ fontSize: 32, fontFamily: 'var(--serif)', color: 'var(--green)' }}>
            {v}
          </strong>
        </div>
      ))}
    </section>
  );
}

function FeedbackAdminViewer() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'feedbacks'));
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        items.sort((a: any, b: any) => (b.created_at || '').localeCompare(a.created_at || ''));
        setList(items);
      } catch (err) {
        console.error('Failed to load feedbacks:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>Community Feedback & Suggestions ({list.length})</h2>
      {loading && <p>Loading feedbacks…</p>}
      {!loading && list.length === 0 && <p>No feedback received yet.</p>}
      <div style={{ display: 'grid', gap: 14 }}>
        {list.map((f) => (
          <div
            key={f.id}
            style={{
              padding: 16,
              background: '#ffffff',
              border: '1px solid var(--line)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <strong>{f.user_name || 'Anonymous Explorer'}</strong>{' '}
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>({f.user_email || 'No email'})</span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 700 }}>
                {'⭐'.repeat(f.rating || 5)} ({f.rating || 5}/5)
              </span>
            </div>
            <p style={{ margin: '6px 0', fontSize: 14, color: 'var(--ink)' }}>{f.message}</p>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
              Type: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{f.type}</span> • Date: {new Date(f.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

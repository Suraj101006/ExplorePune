'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, limit } from 'firebase/firestore';
import { useAuth } from '@/lib/useAuth';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'post';

export default function NewBlog() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [places, setPlaces] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [place, setPlace] = useState('');
  const [tags, setTags] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'places'), where('status', '==', 'published'), limit(200))
        );
        const items = snap.docs.map((d) => ({
          id: d.id,
          name: (d.data() as any).name,
          slug: (d.data() as any).slug || d.id,
        }));
        items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setPlaces(items);
      } catch (e) {
        console.error('Failed to load places for blog:', e);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <main className="wrap" style={{ paddingTop: 60, textAlign: 'center', color: 'var(--muted)' }}>
        ⏳ Loading editor...
      </main>
    );
  }

  if (ready && !user) {
    return (
      <main className="wrap" style={{ paddingTop: 60, maxWidth: 500 }}>
        <div className="panel" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>✍️</span>
          <h2>Sign In to Write</h2>
          <p style={{ color: 'var(--muted)', margin: '0 0 20px' }}>
            Please sign in to publish your travel story on Explore Pune.
          </p>
          <Link href="/login" className="btn">
            Sign In Now
          </Link>
        </div>
      </main>
    );
  }

  async function save(draft: boolean) {
    if (title.trim().length < 5 || !content.trim()) {
      return setErr('Please provide a title of at least 5 characters and your story text.');
    }
    setBusy(true);
    setErr('');
    try {
      const selectedPlace = places.find((p) => p.id === place);
      await addDoc(collection(db, 'blogs'), {
        author_id: user!.uid,
        author_name: user!.displayName || user!.email || 'Pune Explorer',
        title: title.trim(),
        slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`,
        content,
        place_id: place || null,
        place_name: selectedPlace ? selectedPlace.name : null,
        place_slug: selectedPlace ? selectedPlace.slug : null,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 8),
        is_draft: draft,
        status: draft ? 'draft' : 'pending',
        created_at: new Date().toISOString(),
        published_at: draft ? null : new Date().toISOString(),
      });
      setBusy(false);
      router.push('/account');
    } catch (e: any) {
      setBusy(false);
      setErr('Could not save: ' + (e?.message || 'Unknown error'));
    }
  }

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="hero-pill">
          <span>✍️</span> Story Editor
        </div>
        <h1 style={{ fontSize: 32, margin: '6px 0 6px' }}>Share Your Pune Experience</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, margin: 0 }}>
          Write about your trek, heritage walk, or local culinary tour. Markdown formatting is supported.
        </p>
      </div>

      <div className="two" style={{ gridTemplateColumns: '1.2fr 1fr', alignItems: 'start' }}>
        <div className="panel">
          <div className="field">
            <label htmlFor="t">Story Title</label>
            <input
              id="t"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              placeholder="e.g. Sunrise Hike to Sinhagad Fort in the Monsoons"
            />
          </div>

          <div className="field">
            <label htmlFor="pl">Related Place (optional)</label>
            <select id="pl" value={place} onChange={(e) => setPlace(e.target.value)}>
              <option value="">No specific place / general travelogue</option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="tg">Tags (comma separated)</label>
            <input
              id="tg"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. trekking, monsoon, photography, forts"
            />
          </div>

          <div className="field">
            <label htmlFor="c">Your Story (Markdown supported)</label>
            <textarea
              id="c"
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your memories here... You can use **bold**, *italics*, bullet lists, and headings."
            />
          </div>

          {err && (
            <p className="note err" role="alert" style={{ marginBottom: 16 }}>
              {err}
            </p>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn" disabled={busy} onClick={() => save(false)}>
              {busy ? 'Submitting…' : 'Submit for Review'}
            </button>
            <button className="chip" disabled={busy} onClick={() => save(true)}>
              Save as Draft
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 14 }}>
            💡 To maintain reliable and safe community content, submitted stories are briefly reviewed by moderators.
          </p>
        </div>

        {/* Live Preview Panel */}
        <div className="panel" style={{ position: 'sticky', top: 90 }}>
          <h2 style={{ fontSize: 18, marginTop: 0, marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
            Live Markdown Preview
          </h2>
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: 'var(--ink-secondary)',
              minHeight: 240,
            }}
          >
            {title && (
              <h1 style={{ fontSize: 22, marginTop: 0, color: 'var(--ink)' }}>{title}</h1>
            )}
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
              {content || '*Your formatted story preview will appear here in real time…*'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}

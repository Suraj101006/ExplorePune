'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/useAuth';

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'post';

export default function NewBlog() {
  const { user, ready } = useAuth(); const router = useRouter();
  const [places, setPlaces] = useState<any[]>([]);
  const [title, setTitle] = useState(''); const [content, setContent] = useState(''); const [place, setPlace] = useState(''); const [tags, setTags] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { supabase.from('places').select('id, name').eq('status', 'published').order('name').limit(500).then(({ data }) => setPlaces(data ?? [])); }, []);

  if (ready && !user) return <main className="wrap" style={{ paddingTop: 40 }}><p className="note"><Link href="/login">Sign in</Link> to write a blog.</p></main>;

  async function save(draft: boolean) {
    if (title.trim().length < 5 || !content.trim()) return setErr('Add a title of at least 5 characters and some text.');
    setBusy(true); setErr('');
    const { error } = await supabase.from('blogs').insert({
      author_id: user!.id, title: title.trim(), slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`, content, place_id: place || null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 8), is_draft: draft, status: 'pending',
    });
    setBusy(false);
    if (error) return setErr('Could not save: ' + error.message);
    router.push('/account');
  }
  return (
    <main className="wrap" style={{ paddingTop: 36 }}>
      <h1>Write a blog</h1>
      <div className="two" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="panel">
          <div className="field"><label htmlFor="t">Title</label><input id="t" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} /></div>
          <div className="field"><label htmlFor="pl">About a place (optional)</label>
            <select id="pl" value={place} onChange={(e) => setPlace(e.target.value)}><option value="">No specific place</option>{places.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div className="field"><label htmlFor="tg">Tags, separated by commas</label><input id="tg" value={tags} onChange={(e) => setTags(e.target.value)} /></div>
          <div className="field"><label htmlFor="c">Your story (Markdown works)</label>
            <textarea id="c" rows={12} value={content} onChange={(e) => setContent(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cdbf9f', font: 'inherit' }} /></div>
          {err && <p className="note err" role="alert">{err}</p>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn" disabled={busy} onClick={() => save(false)}>Submit for review</button>
            <button className="chip" disabled={busy} onClick={() => save(true)}>Save as draft</button>
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Blogs are checked by a moderator before they appear publicly.</p>
        </div>
        <div className="panel"><h2 style={{ marginTop: 0 }}>Preview</h2><ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content || '*Your preview appears here.*'}</ReactMarkdown></div>
      </div>
    </main>
  );
}

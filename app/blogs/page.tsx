import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export const metadata: Metadata = { title: 'Travel blogs' };
export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const { data } = await supabase.from('blogs').select('id, title, slug, tags, published_at, profiles(display_name), places(name)').eq('status', 'published').eq('is_draft', false).order('published_at', { ascending: false }).limit(40);
  const blogs = (data ?? []) as any[]; const one = (x: any) => (Array.isArray(x) ? x[0] : x);
  return (
    <main className="wrap" style={{ paddingTop: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Travel blogs</h1><Link className="btn" href="/blogs/new">Write a blog</Link>
      </div>
      {blogs.length === 0 && <p className="note" style={{ marginTop: 20 }}>No blogs yet. Visited somewhere in Pune? Write the first one.</p>}
      <section className="grid" style={{ marginTop: 20 }}>
        {blogs.map((b) => (
          <Link key={b.id} href={`/blogs/${b.slug}`} className="card">
            <h2>{b.title}</h2>
            <span style={{ color: 'var(--muted)', fontSize: 14 }}>By {one(b.profiles)?.display_name ?? 'a traveller'}{one(b.places) ? `, about ${one(b.places).name}` : ''}</span>
          </Link>))}
      </section>
    </main>
  );
}

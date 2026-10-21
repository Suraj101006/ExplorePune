import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

export const metadata: Metadata = {
  title: 'Traveller Blogs & Stories | Explore Pune',
  description: 'First-hand travelogues, Sahyadri trek tales, and heritage walk journals by Pune locals and visitors.',
};

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  let blogs: any[] = [];
  try {
    const q = query(
      collection(db, 'blogs'),
      where('status', '==', 'published'),
      limit(50)
    );
    const snap = await getDocs(q);
    blogs = snap.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
      .filter((b) => !b.is_draft);
    blogs.sort(
      (a, b) =>
        (b.published_at || b.created_at || '').localeCompare(a.published_at || a.created_at || '')
    );
  } catch (err) {
    console.error('Failed to load blogs:', err);
  }

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div>
          <div className="hero-pill">
            <span>📖</span> Community Travelogues
          </div>
          <h1 style={{ fontSize: 32, margin: '6px 0 6px' }}>Traveller Stories & Guides</h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, margin: 0 }}>
            Read real experiences, Sahyadri hiking trails, and Pune heritage strolls.
          </p>
        </div>
        <Link className="btn clay" href="/blogs/new">
          ✍️ Write a Story
        </Link>
      </div>

      {/* Empty State */}
      {blogs.length === 0 && (
        <div
          className="panel"
          style={{
            textAlign: 'center',
            padding: '56px 24px',
          }}
        >
          <span style={{ fontSize: 44, display: 'block', marginBottom: 12 }}>🖋️</span>
          <h2 style={{ fontSize: 20, margin: '0 0 8px' }}>No stories published yet</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '40ch', margin: '0 auto 20px' }}>
            Have you explored a fort, historic wada, or hidden viewpoint around Pune? Be the first to share your journey!
          </p>
          <Link className="btn" href="/blogs/new">
            Write the First Blog
          </Link>
        </div>
      )}

      {/* Blog Cards Grid */}
      <section className="grid">
        {blogs.map((b) => (
          <Link key={b.id} href={`/blogs/${b.slug}`} className="card">
            <div className="card-top">
              <span className="cat">
                {b.place_name ? `📍 ${b.place_name}` : '🎒 Travel Note'}
              </span>
              {b.published_at && (
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {new Date(b.published_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              )}
            </div>

            <div style={{ minHeight: 48, display: 'flex', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', margin: 0, lineHeight: 1.3 }}>{b.title}</h2>
            </div>

            {b.content && (
              <p
                style={{
                  fontSize: '13.5px',
                  color: 'var(--muted)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  margin: '4px 0 0',
                  minHeight: 58,
                }}
              >
                {b.content.replace(/[#*`_]/g, '')}
              </p>
            )}

            <div
              style={{
                marginTop: 'auto',
                paddingTop: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '13px',
                color: 'var(--ink-secondary)',
                borderTop: '1px solid var(--line-light)',
              }}
            >
              <span>👤</span>
              <span style={{ fontWeight: 600 }}>{b.author_name || 'Pune Traveller'}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: 700 }}>
                Read →
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

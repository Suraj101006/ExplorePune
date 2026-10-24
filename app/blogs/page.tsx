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
          <Link
            key={b.id}
            href={`/blogs/${b.slug}`}
            className="card"
            style={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}
          >
            {/* Optional Cover Banner */}
            {b.cover_image ? (
              <div className="card-media" style={{ height: 160 }}>
                <img
                  src={b.cover_image}
                  alt={b.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div
                style={{
                  height: 48,
                  background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)',
                  borderBottom: '1px solid var(--line-light)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 18px',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>
                  📖 {b.place_name || 'Pune Heritage Travelogue'}
                </span>
              </div>
            )}

            <div className="card-body" style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="card-top" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cat" style={{ fontSize: '11.5px' }}>
                  {b.place_name ? `📍 ${b.place_name}` : '🎒 Travel Story'}
                </span>
                {b.published_at && (
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                    {new Date(b.published_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              <div style={{ minHeight: 46, marginBottom: 8 }}>
                <h2 style={{ fontSize: '18px', margin: 0, lineHeight: 1.35, color: 'var(--ink)' }}>{b.title}</h2>
              </div>

              {b.content && (
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    margin: '0 0 16px',
                    wordBreak: 'break-word',
                  }}
                >
                  {b.content.replace(/[#*`_]/g, '')}
                </p>
              )}

              <div
                className="card-footer"
                style={{
                  marginTop: 'auto',
                  paddingTop: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '13px',
                  color: 'var(--ink-secondary)',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <span>👤</span>
                <span style={{ fontWeight: 600 }}>{b.author_name || 'Pune Explorer'}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Read Story →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

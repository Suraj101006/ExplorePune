import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import BlogReader from '@/components/BlogReader';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const q = query(
      collection(db, 'blogs'),
      where('slug', '==', slug),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data();
      if (data.status === 'published' && !data.is_draft) {
        return { title: `${data.title} | Explore Pune Blogs` };
      }
    }
  } catch {}
  return { title: 'Story Not Found | Explore Pune' };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let blog: any = null;
  try {
    const q = query(
      collection(db, 'blogs'),
      where('slug', '==', slug),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data() as any;
      if (data.status === 'published' && !data.is_draft) {
        blog = { id: snap.docs[0].id, ...data };
      }
    }
  } catch {}

  if (!blog) notFound();

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <Link
          href="/blogs"
          className="chip"
          style={{ marginBottom: 24, display: 'inline-flex', fontSize: 13 }}
        >
          ← Back to All Stories
        </Link>

      <article className="panel" style={{ padding: '36px 32px' }}>
        {blog.place_name && (
          <span className="cat" style={{ display: 'block', marginBottom: 8 }}>
            📍 Story about{' '}
            <Link
              href={`/places/${blog.place_slug || ''}`}
              style={{ color: 'var(--clay)', textDecoration: 'underline' }}
            >
              {blog.place_name}
            </Link>
          </span>
        )}

        <h1 style={{ fontSize: '32px', margin: '4px 0 16px', lineHeight: 1.25 }}>
          {blog.title}
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingBottom: 20,
            borderBottom: '1px solid var(--line)',
            marginBottom: 24,
            fontSize: 14,
            color: 'var(--muted)',
          }}
        >
          <span>👤 By <strong>{blog.author_name || 'Pune Explorer'}</strong></span>
          {blog.published_at && !isNaN(new Date(blog.published_at).getTime()) && (
            <span>
              • Published on{' '}
              {new Date(blog.published_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        <BlogReader content={blog.content || ''} />
      </article>
      </div>
    </main>
  );
}

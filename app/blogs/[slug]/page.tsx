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
        const title = data.title;
        const description =
          data.summary ||
          data.content?.slice(0, 155)?.replace(/[#*`_]/g, '') ||
          'Authentic travelogue and explorer insights on Explore Pune.';
        const imageUrl = data.cover_image || '/images/pune-map-hero.jpg';

        return {
          title,
          description,
          alternates: {
            canonical: `/blogs/${slug}`,
          },
          openGraph: {
            title: `${title} | Explore Pune`,
            description,
            url: `/blogs/${slug}`,
            siteName: 'Explore Pune',
            type: 'article',
            publishedTime: data.published_at || data.created_at,
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: data.title,
              },
            ],
          },
          twitter: {
            card: 'summary_large_image',
            title: `${title} | Explore Pune`,
            description,
            images: [imageUrl],
          },
        };
      }
    }
  } catch {}
  return {
    title: 'Story Not Found | Explore Pune',
    robots: { index: false, follow: false },
  };
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

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.summary || blog.content?.slice(0, 160)?.replace(/[#*`_]/g, ''),
    author: {
      '@type': 'Person',
      name: blog.author_name || 'Pune Traveller',
    },
    datePublished: blog.published_at || blog.created_at,
    image: blog.cover_image
      ? `https://explore-pune-eosin.vercel.app${blog.cover_image}`
      : 'https://explore-pune-eosin.vercel.app/images/pune-map-hero.jpg',
    url: `https://explore-pune-eosin.vercel.app/blogs/${slug}`,
  };

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
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

import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from('blogs').select('title').eq('slug', slug).eq('status', 'published').eq('is_draft', false).maybeSingle();
  return { title: data?.title ?? 'Blog not found' };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from('blogs').select('title, content, published_at, profiles(display_name), places(name, slug)').eq('slug', slug).eq('status', 'published').eq('is_draft', false).maybeSingle();
  if (!data) notFound();
  const one = (x: any) => (Array.isArray(x) ? x[0] : x); const place = one((data as any).places);
  return (
    <main className="wrap" style={{ paddingTop: 36, maxWidth: 720 }}>
      <Link href="/blogs">&larr; All blogs</Link>
      <h1>{data.title}</h1>
      <p style={{ color: 'var(--muted)' }}>By {one((data as any).profiles)?.display_name ?? 'a traveller'}{place && <> about <Link href={`/places/${place.slug}`}>{place.name}</Link></>}</p>
      <article style={{ fontFamily: 'var(--serif)', fontSize: 18, lineHeight: 1.75 }}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{data.content}</ReactMarkdown>
      </article>
    </main>
  );
}

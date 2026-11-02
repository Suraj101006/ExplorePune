import { NextResponse } from 'next/server';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://explorepune-guide.vercel.app';
  const buildDate = new Date().toUTCString();

  const items = ALL_STRUCTURED_PLACES.slice(0, 30).map((place) => {
    const pubDate = new Date(2026, 9, 29).toUTCString();
    const title = place.name_mr ? `${place.name} (${place.name_mr})` : place.name;
    const desc =
      place.description ||
      `Explore ${place.name} in Pune with verified timings, entry fees, and public transit directions.`;

    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${baseUrl}/places/${encodeURIComponent(place.slug || place.id)}</link>
      <guid isPermaLink="true">${baseUrl}/places/${encodeURIComponent(place.slug || place.id)}</guid>
      <description><![CDATA[${desc}]]></description>
      <category><![CDATA[${place.category || 'heritage'}]]></category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  });

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Explore Pune — Heritage, Forts &amp; Transit Travel Feed</title>
    <link>${baseUrl}</link>
    <description>Latest verified visitor timings, entry fees, trekking guides, and public transit schedules for historic Pune destinations.</description>
    <language>en-IN</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items.join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

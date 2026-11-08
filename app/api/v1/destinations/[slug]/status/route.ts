import { NextRequest, NextResponse } from 'next/server';
import { getDestinationLiveStatus } from '@/lib/liveStatusService';
import { isLimited } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  // Rate limit: 60 live status checks per minute per IP
  if (isLimited(req, 'destination-live-status', 60, 60_000)) {
    return NextResponse.json(
      { error: 'Too many status requests. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    const { slug } = await context.params;
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Missing destination slug' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    const status = await getDestinationLiveStatus(slug, forceRefresh);

    return NextResponse.json(status, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'max-age=300',
      },
    });
  } catch (err: any) {
    console.error('[API destination-live-status] Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve destination live status' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchPuneLocationsWithGoogleMaps } from '@/lib/googleMapsLocation';
import { isLimited } from '@/lib/rateLimit';

const SearchSchema = z.object({
  q: z.string().min(1).max(100),
  lang: z.enum(['en', 'mr']).default('en').optional(),
});

export async function GET(req: NextRequest) {
  // Rate limit: 60 searches per 5 minutes per IP
  if (isLimited(req, 'location-search', 60, 300_000)) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many search requests.' } },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  const { searchParams } = new URL(req.url);
  const parsed = SearchSchema.safeParse({
    q: searchParams.get('q') || '',
    lang: searchParams.get('lang') || 'en',
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_QUERY', message: 'Query parameter q is required.' } },
      { status: 400 }
    );
  }

  try {
    const { q, lang } = parsed.data;
    const results = await searchPuneLocationsWithGoogleMaps(q, lang);

    return NextResponse.json(
      {
        success: true,
        data: results,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    console.error('[API Location Search] Error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to search locations.' } },
      { status: 500 }
    );
  }
}

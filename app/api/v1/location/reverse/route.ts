import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { reverseGeocodeGoogleMaps } from '@/lib/googleMapsLocation';
import { isLimited } from '@/lib/rateLimit';

const QuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  lang: z.enum(['en', 'mr']).default('en').optional(),
});

export async function GET(req: NextRequest) {
  // Rate limit: 120 requests per 5 minutes per IP
  if (isLimited(req, 'location-reverse', 120, 300_000)) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many location requests.' } },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    lat: searchParams.get('lat'),
    lng: searchParams.get('lng'),
    lang: searchParams.get('lang') || 'en',
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_COORDINATES', message: 'Valid latitude and longitude parameters are required.' } },
      { status: 400 }
    );
  }

  try {
    const { lat, lng, lang } = parsed.data;
    const result = await reverseGeocodeGoogleMaps(lat, lng, lang);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    console.error('[API Location Reverse] Error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to reverse geocode location.' } },
      { status: 500 }
    );
  }
}

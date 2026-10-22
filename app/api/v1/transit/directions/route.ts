import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getLiveGoogleTransitRoute } from '@/lib/googleTransit';
import { isLimited } from '@/lib/rateLimit';

const RequestSchema = z.object({
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  destLat: z.number().min(-90).max(90),
  destLng: z.number().min(-180).max(180),
  destPlace: z.object({
    id: z.string().max(80),
    name: z.string().max(150),
    name_mr: z.string().max(150).optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    slug: z.string().max(100).optional(),
  }),
  originName: z.string().max(120).optional(),
  lang: z.enum(['en', 'mr']).default('en').optional(),
});

export async function POST(req: NextRequest) {
  // Rate limit: 40 directions calculations per 15 minutes per IP
  if (isLimited(req, 'transit-directions', 40, 900_000)) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many transit directions requests. Please try again shortly.' } },
      { status: 429, headers: { 'Retry-After': '300' } }
    );
  }

  try {
    const raw = await req.json().catch(() => null);
    const parsed = RequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Invalid coordinate or place parameters.' } },
        { status: 400 }
      );
    }

    const { originLat, originLng, destLat, destLng, destPlace, originName, lang } = parsed.data;

    const transitData = await getLiveGoogleTransitRoute({
      originLat,
      originLng,
      destLat,
      destLng,
      destPlace,
      originName,
      isMr: lang === 'mr',
    });

    return NextResponse.json(transitData);
  } catch (err: any) {
    console.error('Transit API route error:', err?.message || err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to process transit directions. Please try again later.' } },
      { status: 500 }
    );
  }
}

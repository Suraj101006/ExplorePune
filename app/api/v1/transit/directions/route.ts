import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getLiveGoogleTransitRoute } from '@/lib/googleTransit';

const RequestSchema = z.object({
  originLat: z.number(),
  originLng: z.number(),
  destLat: z.number(),
  destLng: z.number(),
  destPlace: z.object({
    id: z.string(),
    name: z.string(),
    name_mr: z.string().optional(),
    latitude: z.number(),
    longitude: z.number(),
    slug: z.string().optional(),
  }),
  originName: z.string().optional(),
  lang: z.enum(['en', 'mr']).default('en').optional(),
});

export async function POST(req: NextRequest) {
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
    console.error('Transit API route error:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to process transit directions.' } },
      { status: 500 }
    );
  }
}

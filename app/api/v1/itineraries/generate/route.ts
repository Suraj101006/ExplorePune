import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { isLimited } from '@/lib/rateLimit';
import { buildItinerary, RouteCandidate, TravelMode } from '@/lib/planner';

const Schema = z.object({
  startMinuteOfDay: z.number().min(0).max(1439).default(540),
  availableMinutes: z.number().min(30).max(720),
  mode: z.enum(['walking', 'cycling', 'driving']).default('walking'),
  budgetPerPerson: z.number().min(0).optional(),
  returnToStart: z.boolean().default(false),
  includeUnverified: z.boolean().default(true),
  interests: z.array(z.string().max(40)).max(10).default([]),
  start: z.object({ lat: z.number().min(17).max(20), lng: z.number().min(72.5).max(75.5) }).default({ lat: 18.5195, lng: 73.8553 }),
});

// Spec 8.2 level 2: straight-line distance x detour factor / average speed.
const SPEED_KMH: Record<TravelMode, number> = { walking: 4.5, cycling: 12, driving: 20 };
const DETOUR = 1.3;

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export async function POST(req: NextRequest) {
  if (isLimited(req, 'plan', 20, 3600_000)) {
    return NextResponse.json({ error: { code: 'RATE_LIMITED', message: 'Too many plans this hour. Try again later.' } }, { status: 429, headers: { 'Retry-After': '600' } });
  }
  try {
    const parsed = Schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') } }, { status: 400 });
    }
    const inp = parsed.data;

    const { data, error } = await supabase
      .from('places')
      .select('id, name, slug, latitude, longitude, zone, popularity_score, recommended_duration_minutes, data_tier, place_categories(slug), place_prices(amount, is_free)')
      .eq('status', 'published');
    if (error || !data) {
      return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Could not load places. Please try again.' } }, { status: 500 });
    }

    const coords = new Map<string, { lat: number; lng: number }>([['START', inp.start]]);
    const rows = (data as any[]).filter((p) => {
      if (p.zone === 'day_trip' && inp.availableMinutes < 360) return false; // spec 8.3
      const cat = Array.isArray(p.place_categories) ? p.place_categories[0]?.slug : p.place_categories?.slug;
      return inp.interests.length === 0 || inp.interests.includes(cat);
    });

    const candidates: RouteCandidate[] = rows.map((p) => {
      coords.set(p.id, { lat: p.latitude, lng: p.longitude });
      const price = p.place_prices?.[0];
      const verified = p.data_tier === 'verified';
      return {
        id: p.id, name: p.name, slug: p.slug,
        score: (p.popularity_score || 50) + (verified ? 20 : 0), // verified places rank higher
        visitDurationMinutes: p.recommended_duration_minutes || 45,
        entryCost: price ? (price.is_free ? 0 : Number(price.amount)) : null, // unknown stays null, never 0
        isHoursVerified: verified,
        tier: p.data_tier,
      };
    });

    const getTravel = (from: string, to: string) => {
      const a = coords.get(from), b = coords.get(to);
      if (!a || !b) return null;
      const minutes = Math.ceil(((km(a, b) * DETOUR) / SPEED_KMH[inp.mode]) * 60);
      return { durationMinutes: minutes, isEstimate: true };
    };

    const plan = buildItinerary(inp, candidates, getTravel);
    plan.warnings.unshift(`Travel times are estimates (straight-line x ${DETOUR}, ${SPEED_KMH[inp.mode]} km/h ${inp.mode}).`);
    return NextResponse.json({ data: plan });
  } catch {
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' } }, { status: 500 });
  }
}

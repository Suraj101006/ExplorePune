import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { isLimited } from '@/lib/rateLimit';
import { buildItinerary, RouteCandidate, TravelMode, PlannerResult } from '@/lib/planner';
import { getPublicTransitRoute } from '@/lib/publicTransit';

const Schema = z.object({
  startMinuteOfDay: z.number().min(0).max(1439).default(540),
  availableMinutes: z.number().min(30).max(720),
  mode: z.enum(['walking', 'cycling', 'driving', 'public_transit']).default('walking'),
  budgetPerPerson: z.number().min(0).optional(),
  returnToStart: z.boolean().default(false),
  includeUnverified: z.boolean().default(true),
  interests: z.array(z.string().max(40)).max(10).default([]),
  start: z.object({ lat: z.number().min(17).max(20), lng: z.number().min(72.5).max(75.5) }).default({ lat: 18.5195, lng: 73.8553 }),
  userLocName: z.string().max(100).optional(),
});

// Straight-line distance x detour factor / average speed
const SPEED_KMH: Record<TravelMode, number> = {
  walking: 4.5,
  cycling: 12,
  driving: 20,
  public_transit: 18,
};
const DETOUR = 1.3;

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

function formatMinutesToTime(totalMin: number): string {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function hydratePlan(plan: PlannerResult, inp: any, coords: Map<string, { lat: number; lng: number }>, placesMap?: Map<string, any>) {
  if (inp.mode === 'public_transit') {
    plan.warnings.unshift(
      'Public Transit: Combines Pune Metro (Lines 1 & 2) and PMPML Buses. Tip: Buy the ₹70 PMPML Day Pass (PMC + PCMC) for unlimited city bus travel all day!'
    );
  } else {
    plan.warnings.unshift(
      `Travel times are estimates (straight-line x ${DETOUR}, ${SPEED_KMH[inp.mode as TravelMode]} km/h ${inp.mode}).`
    );
  }

  let prevCoords = inp.start;
  let currentClock = inp.startMinuteOfDay;
  const bufferPerStop = inp.mode === 'driving' || inp.mode === 'public_transit' ? 10 : 5;

  for (const stop of plan.stops) {
    const destCoord = coords.get(stop.placeId);
    if (destCoord) {
      (stop as any).latitude = destCoord.lat;
      (stop as any).longitude = destCoord.lng;
      const transit = getPublicTransitRoute(prevCoords.lat, prevCoords.lng, {
        id: stop.placeId,
        slug: stop.placeSlug,
        name: stop.placeName,
        name_mr: stop.placeName_mr,
        latitude: destCoord.lat,
        longitude: destCoord.lng,
      });
      stop.transitDetails = transit;
      prevCoords = destCoord;
    }

    if (placesMap) {
      const p = placesMap.get(stop.placeId);
      if (p) {
        (stop as any).image_url = p.image_url;
        (stop as any).category_slug = p.category_slug || (Array.isArray(p.place_categories) ? p.place_categories[0]?.slug : p.category);
        (stop as any).address = p.address;
        (stop as any).address_mr = p.address_mr;
      }
    }

    const arrivalMin = currentClock + stop.travelMinutes;
    const departureMin = arrivalMin + stop.visitMinutes;
    (stop as any).arrivalTime = formatMinutesToTime(arrivalMin);
    (stop as any).departureTime = formatMinutesToTime(departureMin);

    currentClock = departureMin + bufferPerStop;
  }
  return plan;
}

export async function POST(req: NextRequest) {
  if (isLimited(req, 'plan', 20, 3600_000)) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many plans this hour. Try again later.' } },
      { status: 429, headers: { 'Retry-After': '600' } }
    );
  }
  try {
    const parsed = Schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') } },
        { status: 400 }
      );
    }
    const inp = parsed.data;

    let data: any[] = [];
    try {
      const snap = await getDocs(query(collection(db, 'places'), where('status', '==', 'published')));
      data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Could not load places. Please try again.' } },
        { status: 500 }
      );
    }

    const coords = new Map<string, { lat: number; lng: number }>([['START', inp.start]]);
    const rows = (data as any[]).filter((p) => {
      if (p.zone === 'day_trip' && inp.availableMinutes < 360) return false;
      const cat = Array.isArray(p.place_categories) ? p.place_categories[0]?.slug : p.place_categories?.slug || p.category_slug;
      return inp.interests.length === 0 || inp.interests.includes(cat);
    });

    const candidates: (RouteCandidate & { category_slug?: string })[] = rows.map((p) => {
      coords.set(p.id, { lat: p.latitude, lng: p.longitude });
      const price = p.place_prices?.[0];
      const verified = p.data_tier === 'verified';
      const cat = Array.isArray(p.place_categories) ? p.place_categories[0]?.slug : p.place_categories?.slug || p.category_slug;
      return {
        id: p.id,
        name: p.name,
        name_mr: p.name_mr,
        slug: p.slug,
        category_slug: cat,
        score: (p.popularity_score || 50) + (verified ? 20 : 0),
        visitDurationMinutes: p.recommended_duration_minutes || 45,
        entryCost: price ? (price.is_free ? 0 : Number(price.amount)) : null,
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

    const placesMap = new Map(data.map((p) => [p.id, p]));

    // =========================================================================
    // GENERATE 3 DISTINCT PLANS
    // =========================================================================

    // Plan 1: Classic Heritage & Main City Highlights (Balanced optimal route)
    const rawPlan1 = buildItinerary(inp, [...candidates], getTravel);
    const plan1 = hydratePlan(rawPlan1, inp, coords, placesMap);

    // Plan 2: Scenic Nature & Hill Trails (Boost outdoor/nature/parks; diversify starting point)
    const topStop1 = plan1.stops[0]?.placeId;
    const candidatesForPlan2 = candidates
      .filter((c) => candidates.length <= 3 || c.id !== topStop1)
      .map((c) => {
        const isNatureOrFort = ['nature', 'forts', 'parks'].includes(c.category_slug || '');
        return {
          ...c,
          score: c.score + (isNatureOrFort ? 60 : -25),
        };
      });
    const rawPlan2 = buildItinerary(inp, candidatesForPlan2.length > 0 ? candidatesForPlan2 : candidates, getTravel);
    const plan2 = hydratePlan(rawPlan2, inp, coords, placesMap);

    // Plan 3: Spiritual Sanctuaries, Art & Cultural Walking (Boost temples/museums; diversify from Plan 1 & 2)
    const topStop2 = plan2.stops[0]?.placeId;
    const candidatesForPlan3 = candidates
      .filter((c) => candidates.length <= 4 || (c.id !== topStop1 && c.id !== topStop2))
      .map((c) => {
        const isSpiritualOrArt = ['temples', 'museums', 'heritage'].includes(c.category_slug || '');
        return {
          ...c,
          score: c.score + (isSpiritualOrArt ? 55 : -20),
        };
      });
    const rawPlan3 = buildItinerary(inp, candidatesForPlan3.length > 0 ? candidatesForPlan3 : candidates, getTravel);
    const plan3 = hydratePlan(rawPlan3, inp, coords, placesMap);

    // Package the 3 plans with metadata
    const plan1Option = {
      ...plan1,
      id: 'plan-1',
      badge: '🏛️',
      titleEn: 'Plan 1: Classic Heritage & Peshwa History',
      titleMr: 'पर्याय १: ऐतिहासिक वास्तू व पेशवेकालीन वारसा',
      themeEn: 'Iconic heritage landmarks, ancient wadas, and central historical treasures.',
      themeMr: 'पुण्यातील ऐतिहासिक वाडे, गड-किल्ले आणि मध्यवर्ती ऐतिहासिक वारसा स्थळे.',
      taglineEn: 'Best for first-time visitors & history enthusiasts',
      taglineMr: 'इतिहासप्रेमी आणि पुण्यात प्रथमच येणाऱ्यांसाठी सर्वोत्तम पर्याय',
    };

    const plan2Option = {
      ...plan2,
      id: 'plan-2',
      badge: '🌿',
      titleEn: 'Plan 2: Scenic Nature & Hill Vistas',
      titleMr: 'पर्याय २: निसर्ग, टेकड्या व निसर्गरम्य सहल',
      themeEn: 'Breezy green hillocks, Japanese gardens, scenic lake viewpoints, and fresh air.',
      themeMr: 'हिरवेगार उद्याने, शांत तलाव, विहंगम टेकड्या आणि प्रसन्न निसर्गरम्य वातावरण.',
      taglineEn: 'Best for outdoor lovers, photography & breezy viewpoints',
      taglineMr: 'निसर्गप्रेमी, फोटोग्राफी व शांत वातावरणासाठी सर्वोत्तम पर्याय',
    };

    const plan3Option = {
      ...plan3,
      id: 'plan-3',
      badge: '🛕',
      titleEn: 'Plan 3: Spiritual & Cultural Sanctuaries',
      titleMr: 'पर्याय ३: आध्यात्मिक, कला व संस्कृती सफर',
      themeEn: 'Ancient rock-cut caves, revered shrines, art museums, and authentic culture.',
      themeMr: 'प्राचीन लेणी, पवित्र तीर्थक्षेत्रे, कला वस्तुसंग्रहालये व सांस्कृतिक अनुभव.',
      taglineEn: 'Best for peace of mind, architecture & cultural immersion',
      taglineMr: 'शांतता, अप्रतिम वास्तुकला व सांस्कृतिक दर्शनासाठी सर्वोत्तम पर्याय',
    };

    const allThreePlans = [plan1Option, plan2Option, plan3Option];

    return NextResponse.json({
      data: {
        ...plan1Option, // keeps backward compatibility for existing callers
        plans: allThreePlans,
      },
    });
  } catch {
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' } },
      { status: 500 }
    );
  }
}

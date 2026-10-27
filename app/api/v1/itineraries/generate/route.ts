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
  start: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).default({ lat: 18.5195, lng: 73.8553 }),
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

function hydratePlan(plan: PlannerResult, inp: any, coords: Map<string, { lat: number; lng: number }>, placesMap?: Map<string, any>, wasClamped?: boolean) {
  if (wasClamped) {
    plan.warnings.unshift(
      'Notice: Your start or GPS coordinates are outside the Pune district boundary. The route has been started from Central Pune (Shaniwar Wada).'
    );
  }
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
    let wasClamped = false;
    // Graceful fallback if GPS origin is outside greater Pune boundary
    if (inp.start.lat < 18.2 || inp.start.lat > 19.0 || inp.start.lng < 73.3 || inp.start.lng > 74.3) {
      inp.start = { lat: 18.5204, lng: 73.8567 };
      wasClamped = true;
    }

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
    // DYNAMIC INTEREST-AWARE 3 DISTINCT PLANS
    // =========================================================================
    const hasSpecificInterests = inp.interests && inp.interests.length > 0;

    // Plan 1: Primary Optimal Sequence
    const rawPlan1 = buildItinerary(inp, [...candidates], getTravel);
    const plan1 = hydratePlan(rawPlan1, inp, coords, placesMap, wasClamped);

    // Plan 2: Alternate Route Sequence (different starting anchor or varied score distribution)
    const topStop1 = plan1.stops[0]?.placeId;
    const candidatesForPlan2 = candidates
      .filter((c) => candidates.length <= 3 || c.id !== topStop1)
      .map((c) => ({
        ...c,
        // If user didn't specify interests, boost outdoor; otherwise maintain interest integrity
        score: c.score + (!hasSpecificInterests && ['nature', 'forts', 'parks'].includes(c.category_slug || '') ? 45 : 0),
      }));
    const rawPlan2 = buildItinerary(inp, candidatesForPlan2.length > 0 ? candidatesForPlan2 : candidates, getTravel);
    const plan2 = hydratePlan(rawPlan2, inp, coords, placesMap, wasClamped);

    // Plan 3: Comprehensive / Varied Route (diversified from Plan 1 & Plan 2)
    const topStop2 = plan2.stops[0]?.placeId;
    const candidatesForPlan3 = candidates
      .filter((c) => candidates.length <= 4 || (c.id !== topStop1 && c.id !== topStop2))
      .map((c) => ({
        ...c,
        score: c.score + (!hasSpecificInterests && ['temples', 'museums', 'heritage'].includes(c.category_slug || '') ? 40 : 0),
      }));
    const rawPlan3 = buildItinerary(inp, candidatesForPlan3.length > 0 ? candidatesForPlan3 : candidates, getTravel);
    const plan3 = hydratePlan(rawPlan3, inp, coords, placesMap, wasClamped);

    // Dynamic Title & Theme Generation matching user's selected interests
    const primaryInterest = inp.interests[0];
    const secondaryInterest = inp.interests[1];

    let p1TitleEn = 'Plan 1: Classic Heritage & Peshwa History';
    let p1TitleMr = 'पर्याय १: ऐतिहासिक वास्तू व पेशवेकालीन वारसा';
    let p1ThemeEn = 'Iconic heritage landmarks, ancient wadas, and central historical treasures.';
    let p1ThemeMr = 'पुण्यातील ऐतिहासिक वाडे, गड-किल्ले आणि मध्यवर्ती ऐतिहासिक वारसा स्थळे.';
    let p1Badge = '🏛️';

    let p2TitleEn = 'Plan 2: Scenic Nature & Hill Vistas';
    let p2TitleMr = 'पर्याय २: निसर्ग, टेकड्या व निसर्गरम्य सहल';
    let p2ThemeEn = 'Breezy green hillocks, Japanese gardens, scenic lake viewpoints, and fresh air.';
    let p2ThemeMr = 'हिरवेगार उद्याने, शांत तलाव, विहंगम टेकड्या आणि प्रसन्न निसर्गरम्य वातावरण.';
    let p2Badge = '🌿';

    let p3TitleEn = 'Plan 3: Spiritual & Cultural Sanctuaries';
    let p3TitleMr = 'पर्याय ३: आध्यात्मिक, कला व संस्कृती सफर';
    let p3ThemeEn = 'Ancient rock-cut caves, revered shrines, art museums, and authentic culture.';
    let p3ThemeMr = 'प्राचीन लेणी, पवित्र तीर्थक्षेत्रे, कला वस्तुसंग्रहालये व सांस्कृतिक अनुभव.';
    let p3Badge = '🛕';

    if (hasSpecificInterests) {
      if (inp.interests.includes('temples') && inp.interests.length === 1) {
        p1Badge = '🛕';
        p1TitleEn = 'Plan 1: Sacred Shrines & Ancient Temples';
        p1TitleMr = 'पर्याय १: प्रसिद्ध मंदिरे व पवित्र देवस्थाने';
        p1ThemeEn = 'Revered Ganpati temples and ancient sacred shrines in Pune.';
        p1ThemeMr = 'पुण्यातील प्रसिद्ध देवस्थाने आणि भाविकांची श्रद्धास्थाने.';

        p2Badge = '🕉️';
        p2TitleEn = 'Plan 2: Historic Temples & Cave Shrines';
        p2TitleMr = 'पर्याय २: ऐतिहासिक लेणी मंदिरे व वास्तुकला';
        p2ThemeEn = 'Rock-cut monolithic cave temples and historic architectural shrines.';
        p2ThemeMr = 'प्राचीन कातळात कोरलेली लेणी मंदिरे आणि पुरातन वास्तू.';

        p3Badge = '✨';
        p3TitleEn = 'Plan 3: Peaceful Darshan & Heritage Walk';
        p3TitleMr = 'पर्याय ३: शांत दर्शन व अध्यात्मिक भ्रमंती';
        p3ThemeEn = 'Serene temple visits with ample prayer time and peaceful ambiance.';
        p3ThemeMr = 'शांत व प्रसन्न वातावरणात दर्शन आणि अध्यात्मिक सफर.';
      } else if (inp.interests.includes('forts') && inp.interests.length === 1) {
        p1Badge = '🏰';
        p1TitleEn = 'Plan 1: Iconic Sahyadri Hill Fortresses';
        p1TitleMr = 'पर्याय १: प्रमुख ऐतिहासिक गड-किल्ले';
        p1ThemeEn = 'Legendary Maratha fortresses with panoramic mountain vistas.';
        p1ThemeMr = 'सह्याद्रीच्या डोंगररांगांमधील शौर्यशाली गड-किल्ले.';

        p2Badge = '⛰️';
        p2TitleEn = 'Plan 2: Bastions & Mountain Trekking';
        p2TitleMr = 'पर्याय २: बुरुज, माची व ट्रेकिंग मोहीम';
        p2ThemeEn = 'Trekking routes across historic fort gates, machis, and ramparts.';
        p2ThemeMr = 'किल्ल्यांची तटबंदी, दरवाजे आणि निसर्गरम्य ट्रेकिंग मार्ग.';

        p3Badge = '🛡️';
        p3TitleEn = 'Plan 3: Historic Fort Heritage Tour';
        p3TitleMr = 'पर्याय ३: शिवकालीन दुर्ग दर्शन';
        p3ThemeEn = 'Deep dive into Maratha defense architecture and historic battles.';
        p3ThemeMr = 'मराठा साम्राज्यातील दुर्ग स्थापत्य आणि गौरवशाली इतिहास.';
      } else if (inp.interests.includes('heritage') && inp.interests.length === 1) {
        p1Badge = '🏛️';
        p1TitleEn = 'Plan 1: Royal Peshwa Wadas & Palaces';
        p1TitleMr = 'पर्याय १: पेशवेकालीन वाडे व राजवाडे';
        p1ThemeEn = 'Architectural masterpieces and historic seats of Maratha prime ministers.';
        p1ThemeMr = 'पुण्यातील ऐतिहासिक वाडे, दिल्ली दरवाजा आणि पेशवेकालीन इतिहास.';

        p2Badge = '📜';
        p2TitleEn = 'Plan 2: Freedom Struggle & Memorial Heritage';
        p2TitleMr = 'पर्याय २: स्वातंत्र्यलढा व ऐतिहासिक स्मारके';
        p2ThemeEn = 'Monuments dedicated to Indian freedom struggle and social reformers.';
        p2ThemeMr = 'स्वातंत्र्यलढ्यातील ऐतिहासिक ठिकाणे आणि स्मारके.';

        p3Badge = '🏰';
        p3TitleEn = 'Plan 3: Heritage Architecture Trail';
        p3TitleMr = 'पर्याय ३: जुन्या पेठा व वास्तू दर्शन';
        p3ThemeEn = 'Intricate woodwork, stone courtyards, and classical Pune architecture.';
        p3ThemeMr = 'पारंपारिक लाकडी कोरीवकाम आणि पुणेरी वास्तुकला दर्शन.';
      } else {
        // Multi-interest customized plan titles
        const joinedEn = inp.interests.map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join(' & ');
        const joinedMr = inp.interests
          .map((x) =>
            x === 'forts' ? 'किल्ले' : x === 'temples' ? 'मंदिरे' : x === 'heritage' ? 'वारसा' : x === 'nature' ? 'निसर्ग' : 'संग्रहालये'
          )
          .join(' व ');

        p1TitleEn = `Plan 1: Best of ${joinedEn}`;
        p1TitleMr = `पर्याय १: ${joinedMr} - मुख्य ठिकाणे`;
        p1ThemeEn = `Curated selection strictly focused on your chosen interests: ${joinedEn}.`;
        p1ThemeMr = `तुमच्या पसंतीनुसार निवडलेली ठिकाणे: ${joinedMr}.`;

        p2TitleEn = `Plan 2: Express ${joinedEn} Route`;
        p2TitleMr = `पर्याय २: ${joinedMr} - वेगवान मार्ग`;
        p2ThemeEn = `Direct high-efficiency transit route connecting top ${joinedEn} spots.`;
        p2ThemeMr = `${joinedMr} मधील प्रमुख ठिकाणांचा थेट व कार्यक्षम मार्ग.`;

        p3TitleEn = `Plan 3: Leisurely ${joinedEn} Explorer`;
        p3TitleMr = `पर्याय ३: ${joinedMr} - सविस्तर सफर`;
        p3ThemeEn = `Relaxed timing and in-depth exploration of ${joinedEn}.`;
        p3ThemeMr = `${joinedMr} चा सविस्तर आणि शांत अनुभव.`;
      }
    }

    // Package the 3 plans with metadata
    const plan1Option = {
      ...plan1,
      id: 'plan-1',
      badge: p1Badge,
      titleEn: p1TitleEn,
      titleMr: p1TitleMr,
      themeEn: p1ThemeEn,
      themeMr: p1ThemeMr,
      taglineEn: 'Best for optimal sequence & top attractions',
      taglineMr: 'उत्तम नियोजन आणि प्रमुख आकर्षणांसाठी सर्वोत्तम पर्याय',
    };

    const plan2Option = {
      ...plan2,
      id: 'plan-2',
      badge: p2Badge,
      titleEn: p2TitleEn,
      titleMr: p2TitleMr,
      themeEn: p2ThemeEn,
      themeMr: p2ThemeMr,
      taglineEn: 'Best for alternative sequence & efficient transit',
      taglineMr: 'पर्यायी क्रम आणि वेगवान प्रवासासाठी सर्वोत्तम पर्याय',
    };

    const plan3Option = {
      ...plan3,
      id: 'plan-3',
      badge: p3Badge,
      titleEn: p3TitleEn,
      titleMr: p3TitleMr,
      themeEn: p3ThemeEn,
      themeMr: p3ThemeMr,
      taglineEn: 'Best for leisurely pace & deep exploration',
      taglineMr: 'शांत गती आणि सविस्तर अनुभवासाठी सर्वोत्तम पर्याय',
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

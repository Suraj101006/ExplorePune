import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { isLimited } from '@/lib/rateLimit';
import { getPublicTransitRoute, calculateDistanceKm } from '@/lib/publicTransit';
import { generateGeminiReply } from '@/lib/gemini';

const Schema = z.object({
  message: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        text: z.string(),
      })
    )
    .optional(),
  lang: z.enum(['en', 'mr']).default('en').optional(),
  userLocation: z.object({ lat: z.number(), lng: z.number() }).optional(),
  apiKey: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const isLimiterBypassed =
    process.env.NODE_ENV !== 'production' && process.env.CHAT_RATE_LIMIT_OFF === '1';
  if (!isLimiterBypassed && isLimited(req, 'chat', 60, 3600_000)) {
    return NextResponse.json(
      {
        reply: 'Hourly chat limit reached. Please try again shortly.',
        error: { code: 'RATE_LIMITED', message: 'Hourly chat limit reached.' },
      },
      { status: 429, headers: { 'Retry-After': '600' } }
    );
  }

  try {
    const raw = await req.json().catch(() => null);
    const parsed = Schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Message must be between 1 and 1000 characters.' } },
        { status: 400 }
      );
    }

    const { message, userLocation, history, apiKey: bodyApiKey } = parsed.data;
    const clientKey = req.headers.get('x-gemini-key') || bodyApiKey;

    // Detect language
    const isDevanagari = /[\u0900-\u097F]/.test(message);
    const requestedLang = parsed.data.lang || (isDevanagari ? 'mr' : 'en');
    const isMr = requestedLang === 'mr' || isDevanagari;

    // Fetch published places from Firestore
    let allPlaces: any[] = [];
    try {
      const snap = await getDocs(
        query(collection(db, 'places'), where('status', '==', 'published'), limit(150))
      );
      allPlaces = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    } catch {
      // Local fallback if firestore fails
      allPlaces = [];
    }

    const lowerMsg = message.toLowerCase().trim();
    const isNearMe =
      /(near\s*me|nearby|closest|near\s*my\s*location|around\s*here)/i.test(lowerMsg) ||
      /(माझ्याजवळ|जवळची|नजीक|येथील|माझ्या\s*परिसरात)/i.test(lowerMsg);

    // Dynamic Live GPS Near-Me calculation
    if (isNearMe && userLocation && typeof userLocation.lat === 'number' && allPlaces.length > 0) {
      const sortedByDistance = [...allPlaces]
        .map((p) => ({
          ...p,
          distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm);

      const top3 = sortedByDistance.slice(0, 3);
      const replyText = isMr
        ? `📍 **तुमच्या सध्याच्या GPS स्थानावरून सर्वात जवळची पुणे पर्यटन स्थळे:**\n\n` +
          top3
            .map(
              (p, i) =>
                `${i + 1}. **[${p.name_mr || p.name}](/places/${p.slug})** — **${p.distanceKm} किमी** अंतरावर\n   🚌 ${getPublicTransitRoute(userLocation.lat, userLocation.lng, p).summaryMr}`
            )
            .join('\n\n') +
          `\n\nयापैकी कोणत्याही ठिकाणाचा सविस्तर मार्ग हवा आहे का?`
        : `📍 **Closest Pune attractions to your location:**\n\n` +
          top3
            .map(
              (p, i) =>
                `${i + 1}. **[${p.name}](/places/${p.slug})** (${p.name_mr || ''}) — **${p.distanceKm} km away**\n   🚌 ${getPublicTransitRoute(userLocation.lat, userLocation.lng, p).summaryEn}`
            )
            .join('\n\n') +
          `\n\nWould you like detailed transit directions for any of these?`;

      return NextResponse.json({
        reply: replyText,
        places: top3,
        transit: getPublicTransitRoute(userLocation.lat, userLocation.lng, top3[0]),
        suggestions: isMr
          ? ['पुणे मेट्रो तिकीट कसे काढावे?', '१ दिवसाची सहल आखा', 'सिंहगड किल्ला मार्ग']
          : ['How to book Pune Metro ticket', 'Plan 1-day itinerary', 'Directions to Sinhagad'],
      });
    }

    // Call Interactive Gemini AI Engine (Firebase AI Logic / Gemini Developer API / Grounded Synthesizer)
    const result = await generateGeminiReply({
      message,
      history,
      lang: requestedLang as 'en' | 'mr',
      allPlaces,
      userLocation,
      clientApiKey: clientKey,
    });

    // Check if the query is asking about public transit to attach a structured transit card
    let transit = result.transit;
    if (!transit && result.places && result.places.length > 0) {
      const isTransitQuery =
        /(metro|bus|pmpml|transit|ticket|pass|how\s*to\s*go|how\s*to\s*reach|fare|मार्ग|कसे\s*जावे|तिकीट|मेट्रो|बस)/i.test(
          lowerMsg
        );
      if (isTransitQuery) {
        transit = getPublicTransitRoute(
          userLocation?.lat || 18.5204,
          userLocation?.lng || 73.8567,
          result.places[0]
        );
      }
    }

    return NextResponse.json({
      reply: result.reply,
      places: result.places,
      transit,
      suggestions: result.suggestions,
      isGemini: result.isGemini,
      model: result.model,
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { reply: 'The assistant encountered an unexpected error. Please try again shortly.' },
      { status: 500 }
    );
  }
}

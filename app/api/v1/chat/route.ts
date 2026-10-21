import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { isLimited } from '@/lib/rateLimit';
import { getPublicTransitRoute, calculateDistanceKm, PUNE_COMMUTE_HUBS } from '@/lib/publicTransit';
import { isGeminiConfigured, generateGeminiReply } from '@/lib/gemini';

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

function formatPlaceResponse(
  place: any,
  allPlaces: any[],
  isMr: boolean,
  userLocation?: { lat: number; lng: number }
) {
  const verified = place.data_tier === 'verified';
  const prices = place.place_prices || [];
  const priceText = prices.length
    ? prices
        .map(
          (pr: any) =>
            `${pr.visitor_category || 'General'}: ${pr.is_free ? (isMr ? 'मोफत' : 'Free') : `₹${pr.amount}`}`
        )
        .join(', ')
    : isMr
    ? 'सार्वजनिक माहितीनुसार नाममात्र किंवा मोफत'
    : 'Standard public rates';

  const hours = place.place_hours || [];
  const hoursText = hours.length
    ? `${hours[0].opens_at} - ${hours[0].closes_at}`
    : isMr
    ? 'सकाळी ९:०० ते संध्याकाळी ५:३० (अंदाजे)'
    : '09:00 AM - 05:30 PM (approx)';

  // Calculate public transit
  const transit = getPublicTransitRoute(
    userLocation?.lat || 18.5204,
    userLocation?.lng || 73.8567,
    place
  );

  let reply = '';
  if (isMr) {
    reply = `**${place.name_mr || place.name}**\n\n${place.description_mr || place.description || ''}\n\n⏱️ **वेळ:** ${hoursText}\n🎟️ **प्रवेश शुल्क:** ${priceText}\n📍 **पत्ता:** ${place.address_mr || place.address || 'पुणे, महाराष्ट्र'}\n\n🚌 **सार्वजनिक वाहतूक (मेट्रो व बस):**\n${transit.summaryMr}\n\n🎟️ **तिकीट माहिती:** ${transit.ticketInfoMr}`;
  } else {
    reply = `**${place.name}** (${place.name_mr || ''})\n\n${place.description || ''}\n\n⏱️ **Opening Hours:** ${hoursText}\n🎟️ **Entry Fees:** ${priceText}\n📍 **Address:** ${place.address || 'Pune, Maharashtra'}${verified ? '\n\n✅ *Officially verified by Explore Pune*' : ''}\n\n🚌 **Public Transit (Metro & Bus):**\n${transit.summaryEn}\n\n🎟️ **Ticket Info:** ${transit.ticketInfoEn}`;
  }

  const related = [
    place,
    ...allPlaces.filter((p) => p.id !== place.id && p.category_slug === place.category_slug).slice(0, 2),
  ];

  return NextResponse.json({
    reply,
    places: related,
    transit,
    suggestions: isMr
      ? [
          `कसे जावे: ${place.name_mr || place.name}`,
          'पुणे मेट्रो तिकीट कसे काढावे?',
          'जवळची इतर ठिकाणे कोणती?',
          'सहल नियोजन करा',
        ]
      : [
          `How to reach ${place.name}`,
          'How to book Pune Metro ticket',
          'Nearby attractions',
          'Add to Trip Planner',
        ],
  });
}

export async function POST(req: NextRequest) {
  const isLimiterBypassed =
    process.env.NODE_ENV !== 'production' && process.env.CHAT_RATE_LIMIT_OFF === '1';
  if (!isLimiterBypassed && isLimited(req, 'chat', 30, 3600_000)) {
    return NextResponse.json(
      {
        reply: 'Hourly chat limit reached. Please try again in a little while.',
        error: { code: 'RATE_LIMITED', message: 'Hourly chat limit reached. Please try again in a little while.' },
      },
      { status: 429, headers: { 'Retry-After': '900' } }
    );
  }

  try {
    const raw = await req.json().catch(() => null);
    const parsed = Schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Message must be between 1 and 500 characters.' } },
        { status: 400 }
      );
    }

    const { message, userLocation, history, apiKey: bodyApiKey } = parsed.data;
    const lowerMsg = message.toLowerCase().trim();

    // Support client-provided Gemini API key (from header or body)
    const clientKey = req.headers.get('x-gemini-key') || bodyApiKey;

    // Detect Marathi script or intent
    const isDevanagari = /[\u0900-\u097F]/.test(message);
    const requestedLang = parsed.data.lang || (isDevanagari ? 'mr' : 'en');
    const isMr = requestedLang === 'mr' || isDevanagari;

    // Fetch published places from Firestore
    const snap = await getDocs(
      query(collection(db, 'places'), where('status', '==', 'published'), limit(150))
    );
    const allPlaces = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    // =========================================================================
    // 0. GOOGLE GEMINI AI ASSISTANT (If API Key is configured on server or client)
    // =========================================================================
    const isNearMe =
      /(near\s*me|nearby|closest|near\s*my\s*location|around\s*here)/i.test(lowerMsg) ||
      /(माझ्याजवळ|जवळची|नजीक|येथील|माझ्या\s*परिसरात)/i.test(lowerMsg);

    if ((isGeminiConfigured(clientKey) || clientKey) && !isNearMe) {
      try {
        const geminiRes = await generateGeminiReply({
          message,
          history,
          lang: requestedLang as 'en' | 'mr',
          allPlaces,
          userLocation,
          clientApiKey: clientKey,
        });

        if (geminiRes && geminiRes.reply) {
          return NextResponse.json({
            reply: geminiRes.reply,
            places: geminiRes.places,
            suggestions: geminiRes.suggestions,
            isGemini: true,
            model: geminiRes.model,
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini chat generation fallback to local engine:', geminiErr);
      }
    }

    // =========================================================================
    // 1. NEAR ME / GPS LOCATION QUERY
    // =========================================================================
    if (isNearMe) {
      if (userLocation && typeof userLocation.lat === 'number') {
        const sortedByDistance = [...allPlaces]
          .map((p) => ({
            ...p,
            distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude),
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm);

        const top3 = sortedByDistance.slice(0, 4);
        const replyText = isMr
          ? `📍 **तुमच्या सध्याच्या GPS स्थानावरून सर्वात जवळची ठिकाणे:**\n\n` +
            top3
              .map(
                (p, i) =>
                  `${i + 1}. **${p.name_mr || p.name}** — **${p.distanceKm} किमी** अंतरावर\n   🚌 ${getPublicTransitRoute(userLocation.lat, userLocation.lng, p).summaryMr}`
              )
              .join('\n\n')
          : `📍 **Closest Pune attractions to your live GPS coordinates:**\n\n` +
            top3
              .map(
                (p, i) =>
                  `${i + 1}. **${p.name}** (${p.name_mr || ''}) — **${p.distanceKm} km away**\n   🚌 ${getPublicTransitRoute(userLocation.lat, userLocation.lng, p).summaryEn}`
              )
              .join('\n\n');

        return NextResponse.json({
          reply: replyText,
          places: top3,
          suggestions: isMr
            ? ['सिंहगड किल्ला कसा जावा?', 'शनिवार वाडा मेट्रो मार्ग', '१ दिवसाची सहल आखा']
            : ['How to go to Sinhagad by bus?', 'Metro to Shaniwar Wada', 'Plan 1-day itinerary'],
        });
      } else {
        return NextResponse.json({
          reply: isMr
            ? '📍 तुमच्या जवळची ठिकाणे शोधण्यासाठी कृपया चॅटमधील **"📍 थेट लोकेशन" (Share Location)** बटणावर क्लिक करा जेणेकरून तुमचे अचूक अंतर मोजता येईल! अन्यथा खालील मध्यवर्ती ठिकाणे पहा:'
            : '📍 To show places closest to you, please click the **"📍 Share Location"** button so we can locate your exact coordinates! In the meantime, here are central Pune highlights:',
          places: allPlaces.slice(0, 3),
          suggestions: isMr
            ? ['पुण्यातील किल्ले', 'शनिवार वाडा', 'दगडूशेठ गणपती']
            : ['Top forts near Pune', 'Shaniwar Wada', 'Dagdusheth Ganpati'],
        });
      }
    }

    // =========================================================================
    // 2. PUBLIC TRANSIT: METRO & BUS NETWORK INQUIRIES
    // =========================================================================
    const isTransitQuery =
      /(metro|bus|pmpml|public\s*transit|transit|ticket|pass|how\s*to\s*go|how\s*to\s*reach|fare|routes)/i.test(
        lowerMsg
      ) ||
      /(मेट्रो|बस|पीएमपीएमएल|सार्वजनिक\s*वाहतूक|तिकीट|पास|मार्ग|कसे\s*जावे|पोहोचावे|भाडे|तिकिटे)/i.test(lowerMsg);

    // Check if the user is asking about public transit to a specific place
    const placeInTransit = allPlaces.find((p) => {
      const name = (p.name || '').toLowerCase();
      const nameMr = (p.name_mr || '').toLowerCase();
      const slug = (p.slug || '').toLowerCase().replace(/-/g, ' ');
      return (
        (name.length > 3 && lowerMsg.includes(name)) ||
        (nameMr.length > 3 && lowerMsg.includes(nameMr)) ||
        (slug.length > 3 && lowerMsg.includes(slug))
      );
    });

    if (isTransitQuery && placeInTransit) {
      // Check if user specified a starting location (e.g. "from Kothrud", "हडपसरवरून")
      const originHub = PUNE_COMMUTE_HUBS.find((h) => {
        const enFirst = h.nameEn.toLowerCase().split('/')[0].trim();
        const mrFirst = h.nameMr.toLowerCase().split('/')[0].trim();
        const idClean = h.id.replace(/-/g, ' ');
        return (
          lowerMsg.includes(idClean) ||
          (enFirst.length > 3 && lowerMsg.includes(enFirst)) ||
          (mrFirst.length > 3 && lowerMsg.includes(mrFirst))
        );
      });

      const originLat = originHub ? originHub.latitude : userLocation?.lat || 18.5204;
      const originLng = originHub ? originHub.longitude : userLocation?.lng || 73.8567;
      const originLabel = originHub
        ? isMr
          ? originHub.nameMr
          : originHub.nameEn
        : undefined;

      const transit = getPublicTransitRoute(originLat, originLng, placeInTransit, originLabel);

      const reply = isMr
        ? `🚌 **${placeInTransit.name_mr || placeInTransit.name} साठी सार्वजनिक वाहतूक मार्ग (मेट्रो व बस):**\n\n` +
          (originLabel ? `📍 **सुरुवात:** ${originLabel}\n` : '') +
          `• **मार्ग संक्षेप:** ${transit.summaryMr}\n` +
          `• **नजीकचे मेट्रो स्थानक:** ${transit.nearestMetro ? `${transit.nearestMetro.stationNameMr} (${transit.nearestMetro.lineNameMr}, ${transit.nearestMetro.distanceKm} किमी)` : 'थेट मेट्रो उपलब्ध नाही'}\n` +
          `• **नजीकचा बस थांबा:** ${transit.nearestBus?.stopNameMr} (मार्ग: ${transit.nearestBus?.routeNumbers.join(', ')})\n` +
          `• **अंदाजे वेळ व तिकीट:** ~${transit.estimatedMinutes} मिनिटे | अंदाजे ₹${transit.estimatedCostInr}\n\n` +
          `📋 **पायरी-दर-पायरी मार्ग:**\n` +
          transit.stepByStepMr.map((s, idx) => `${idx + 1}. ${s}`).join('\n') +
          `\n\n🎟️ **तिकीट व पास माहिती:**\n${transit.ticketInfoMr}` +
          (transit.gmapsTransitUrl ? `\n\n🗺️ [गुगल मॅप्सवर थेट मार्ग पहा](${transit.gmapsTransitUrl})` : '')
        : `🚌 **Public Transit Route to ${placeInTransit.name} (Metro & Bus):**\n\n` +
          (originLabel ? `📍 **Starting From:** ${originLabel}\n` : '') +
          `• **Transit Summary:** ${transit.summaryEn}\n` +
          `• **Nearest Metro:** ${transit.nearestMetro ? `${transit.nearestMetro.stationNameEn} (${transit.nearestMetro.lineNameEn}, ${transit.nearestMetro.distanceKm} km)` : 'Direct metro not available'}\n` +
          `• **Nearest Bus Stop:** ${transit.nearestBus?.stopNameEn} (Routes: ${transit.nearestBus?.routeNumbers.join(', ')})\n` +
          `• **Estimated Travel Time & Fare:** ~${transit.estimatedMinutes} mins | Approx ₹${transit.estimatedCostInr}\n\n` +
          `📋 **Step-by-Step Directions:**\n` +
          transit.stepByStepEn.map((s, idx) => `${idx + 1}. ${s}`).join('\n') +
          `\n\n🎟️ **Ticket & Pass Info:**\n${transit.ticketInfoEn}` +
          (transit.gmapsTransitUrl ? `\n\n🗺️ [Open Live Route in Google Maps](${transit.gmapsTransitUrl})` : '');

      return NextResponse.json({
        reply,
        places: [placeInTransit],
        transit,
        suggestions: isMr
          ? ['व्हॉट्सअॅपवर मेट्रो तिकीट काढा', 'पीएमपीएमएल ₹७०/₹१५० पास माहिती', 'सहल नियोजन करा']
          : ['Book Pune Metro WhatsApp ticket', 'PMPML ₹70/₹150 Day Pass info', 'Add to Trip Planner'],
      });
    }

    if (isTransitQuery && !placeInTransit) {
      const reply = isMr
        ? `🚆 **पुणे थेट सार्वजनिक वाहतूक माहिती (पुणे मेट्रो व पीएमपीएमएल बस):**\n\n` +
          `१. **पुणे मेट्रो (Maha Metro) - थेट दर व सवलती:**\n` +
          `   • **जांभळी मार्गिका (Line 1):** पिंपरी चिंचवड (PCMC) ↔ स्वारगेट (शिवाजीनगर, सिव्हिल कोर्ट, मंडईमार्गे)\n` +
          `   • **अक्वा मार्गिका (Line 2):** वनाज ↔ रामवाडी (डेक्कन, मनपा, पुणे स्टेशन, कल्याणी नगरमार्गे)\n` +
          `   • **जंक्शन स्थानक:** सिव्हिल कोर्ट (एकाच तिकीटावर दोन्ही लाईनमध्ये सहज बदल)\n` +
          `   • **तिकीट दर (Slabs):** ₹१० ते ₹३५ (०-२ किमी: ₹१० | २-४ किमी: ₹१५ | ४-८ किमी: ₹२० | ८-१२ किमी: ₹२५ | १२-१८ किमी: ₹३० | १८+ किमी: ₹३५)\n` +
          `   • **विशेष सवलती:** \n` +
          `     - **शनिवार व रविवार:** सर्व प्रवाशांना **थेट ३०% सूट**\n` +
          `     - **विद्यार्थी:** वन पुणे विद्यार्थी कार्डवर **३०% सवलत**\n` +
          `     - **वन पुणे NCMC कार्ड:** कामाच्या दिवशी **१०% सूट**\n` +
          `   • **व्हॉट्सअॅप तिकीट:** रांगेत उभे न राहता **+91 94201 01990** वर "Hi" पाठवून UPI ने थेट QR तिकीट काढा.\n\n` +
          `२. **पीएमपीएमएल (PMPML) बस सेवा - थेट पास व मार्ग:**\n` +
          `   • **PMC + PCMC दैनिक पास:** **₹७०** (पुणे मनपा व पिंपरी-चिंचवड मनपा हद्दीतील सर्व बसेसमध्ये दिवसभर अमर्याद प्रवास)\n` +
          `   • **ऑल-रूट दैनिक पास:** **₹१५०** (संपूर्ण नेटवर्क, ग्रामीण मार्ग, पीएमआरडीए हद्द, घाट व उपनगरांसाठी दिवसभर अमर्याद प्रवास)\n` +
          `   • **ज्येष्ठ नागरिक पास:** ₹४० (मनपा+पिंपरी हद्द)\n` +
          `   • **तिकीट दर टप्पे:** ₹५, ₹१०, ₹१५, ₹२०, ₹२५, ₹३०, ₹३५, ₹४० (कंडक्टरकडे UPI QR कोड व रोख दोन्ही स्वीकारले जाते)\n` +
          `   • **प्रमुख पर्यटन बस मार्ग:**\n` +
          `     - सिंहगड किल्ला: बस ५० (स्वारगेट ↔ सिंहगड पायथा/डोणजे)\n` +
          `     - खडकवासला धरण: बस ५०, ५१, ५२ (स्वारगेट/मनपा ↔ खडकवासला)\n` +
          `     - आळंदी: बस १७४ (पुणे स्टेशन ↔ आळंदी)\n` +
          `     - जेजुरी: बस २०८ (स्वारगेट ↔ जेजुरी)\n` +
          `     - कात्रज प्राणीसंग्रहालय: बस २४ (स्वारगेट ↔ कात्रज)`
        : `🚆 **Pune Public Transit Guide (Live Pune Metro & PMPML Bus Fares):**\n\n` +
          `1. **Pune Metro (Maha Metro) - Live Fares & Concessions:**\n` +
          `   • **Purple Line (Line 1):** PCMC ↔ Swargate (via Shivajinagar, Civil Court, Mandai, Swargate underground)\n` +
          `   • **Aqua Line (Line 2):** Vanaz ↔ Ramwadi (via Deccan, PMC, Pune Station, Bund Garden, Kalyani Nagar)\n` +
          `   • **Interchange Hub:** Civil Court Metro Station (seamless transfer on a single continuous ticket)\n` +
          `   • **Fare Slabs:** ₹10 to ₹35 (0-2 km: ₹10 | 2-4 km: ₹15 | 4-8 km: ₹20 | 8-12 km: ₹25 | 12-18 km: ₹30 | 18+ km: ₹35 max terminal-to-terminal)\n` +
          `   • **Special Discounts:**\n` +
          `     - **Weekends (Sat & Sun):** Flat **30% OFF** for ALL commuters across all lines!\n` +
          `     - **Students:** Flat **30% OFF** with One Pune Vidyarthi Card\n` +
          `     - **One Pune NCMC Card:** 10% OFF on weekdays, 30% OFF on weekends\n` +
          `   • **Instant WhatsApp QR Ticket:** Send "Hi" to **+91 94201 01990** to buy mobile tickets via UPI without queuing!\n\n` +
          `2. **PMPML Bus Network - Live Passes & Fares:**\n` +
          `   • **PMC + PCMC Unified Daily Pass:** **₹70** (unlimited travel all day across all regular routes within Pune & Pimpri-Chinchwad municipal limits)\n` +
          `   • **All-Routes / PMRDA Daily Pass:** **₹150** (unlimited travel all day on ALL PMPML routes including rural zones, outer suburbs & ghat routes like Sinhagad foothills, Saswad, Velhe, Paud, etc.)\n` +
          `   • **Senior Citizen Pass:** ₹40 (PMC + PCMC limits)\n` +
          `   • **Single Ticket Slabs:** ₹5, ₹10, ₹15, ₹20, ₹25, ₹30, ₹35, ₹40 (conductors accept UPI QR on ticket machine & Cash)\n` +
          `   • **Key Tourist Bus Routes:**\n` +
          `     - Sinhagad Fort: Bus 50 (Swargate ↔ Sinhagad Foothills/Donje)\n` +
          `     - Khadakwasla Dam: Bus 50, 51, 52 (Swargate/PMC ↔ Khadakwasla)\n` +
          `     - Alandi: Bus 174 (Pune Station ↔ Alandi)\n` +
          `     - Jejuri: Bus 208 (Swargate ↔ Jejuri)\n` +
          `     - Katraj Zoo: Bus 24 (Swargate ↔ Katraj)`;

      return NextResponse.json({
        reply,
        places: allPlaces.filter((p) =>
          ['shaniwar-wada', 'sinhagad-fort', 'aga-khan-palace', 'khadakwasla-dam'].includes(p.slug)
        ),
        suggestions: isMr
          ? ['सिंहगडासाठी बस कोणती?', 'शनिवार वाडा मेट्रो कशी जायची?', 'माझ्याजवळील ठिकाणे']
          : ['Bus route to Sinhagad Fort', 'Metro route to Shaniwar Wada', 'Places near me'],
      });
    }

    // =========================================================================
    // 3. GREETINGS
    // =========================================================================
    const isGreeting =
      /^(hi|hello|hey|namaste|namaskar|good\s*(morning|evening|afternoon)|sup|ola|hoi)/i.test(lowerMsg) ||
      /^(नमस्कार|नमस्ते|हाय|हॅलो|राम\s*राम|जय\s*शिवराय|प्रणाम)/i.test(lowerMsg);

    if (isGreeting) {
      const topSpots = allPlaces
        .filter((p) =>
          ['shaniwar-wada', 'sinhagad-fort', 'shreemant-dagdusheth-halwai-ganpati', 'lal-mahal'].includes(
            p.slug
          )
        )
        .slice(0, 4);

      return NextResponse.json({
        reply: isMr
          ? 'नमस्कार! 🙏 पुणे नगरीत आपले सहर्ष स्वागत आहे! मी तुमचा एक्सप्लोर पुणे (Explore Pune) डिजिटल मार्गदर्शक. पुण्यातील गड-किल्ले, पेशवेकालीन वाडे, प्रसिद्ध मंदिरे, मेट्रो व बस मार्ग किंवा सहल नियोजनाबद्दल मला काहीही विचारू शकता. सुरुवात करण्यासाठी खालील पर्याय पहा:'
          : 'Namaskar! 🙏 Welcome to Pune. I am your Explore Pune digital guide. Ask me anything about historic forts, Peshwa wadas, sacred temples, metro & bus transit routes, or travel itineraries. Here are top landmarks to get started:',
        places: topSpots,
        suggestions: isMr
          ? ['माझ्याजवळील ठिकाणे (GPS)', 'सिंहगड बस मार्ग व वेळ', 'शनिवार वाडा मेट्रो', '१ दिवसाची सहल कशी करावी?']
          : ['Places near me (GPS)', 'Sinhagad bus route & timings', 'Metro to Shaniwar Wada', 'Plan a 1-day itinerary'],
      });
    }

    // =========================================================================
    // 4. DIRECT PLACE NAME MATCH
    // =========================================================================
    const directPlaceMatch = allPlaces.find((p) => {
      const name = (p.name || '').toLowerCase();
      const nameMr = (p.name_mr || '').toLowerCase();
      const slug = (p.slug || '').toLowerCase();
      const slugSpaced = slug.replace(/-/g, ' ');

      return (
        (name.length > 3 && lowerMsg.includes(name)) ||
        (nameMr.length > 3 && lowerMsg.includes(nameMr)) ||
        (slugSpaced.length > 3 && lowerMsg.includes(slugSpaced))
      );
    });

    if (directPlaceMatch) {
      return formatPlaceResponse(directPlaceMatch, allPlaces, isMr, userLocation);
    }

    // =========================================================================
    // 5. CATEGORY & THEME INTENTS
    // =========================================================================
    const isForts =
      /(fort|forts|trek|trekking|gad|killa|sahyadri|hike)/i.test(lowerMsg) ||
      /(किल्ला|किल्ले|गड|ट्रेक|सह्याद्री|दुर्ग)/i.test(lowerMsg);

    const isWadas =
      /(wada|wadas|palace|peshwa|heritage|architecture)/i.test(lowerMsg) ||
      /(वाडा|वाडे|राजवाडा|पेशवे|ऐतिहासिक|महाल)/i.test(lowerMsg);

    const isTemples =
      /(temple|temples|mandir|ganpati|ganesh|shiva|spiritual|sacred)/i.test(lowerMsg) ||
      /(मंदिर|मंदिरे|गणपती|गणेश|दगडूशेठ|शिव|तीर्थक्षेत्र|देवस्थान)/i.test(lowerMsg);

    const isMuseums =
      /(museum|museums|gallery|exhibition|artifacts)/i.test(lowerMsg) ||
      /(वस्तुसंग्रहालय|म्युझियम|संग्रहालय)/i.test(lowerMsg);

    const isNature =
      /(lake|lakes|nature|garden|park|hills|viewpoint|waterfall|sunset)/i.test(lowerMsg) ||
      /(तलाव|निसर्ग|उद्यान|बाग|टेकडी|धबधबा|घाटरस्ता)/i.test(lowerMsg);

    const isFree =
      /(free|zero\s*cost|no\s*fee|no\s*ticket|budget\s*friendly|without\s*ticket)/i.test(lowerMsg) ||
      /(मोफत|विनामूल्य|फुकट|तिकीट\s*नाही|कमी\s*खर्च)/i.test(lowerMsg);

    const isItinerary =
      /(itinerary|1\s*day|one\s*day|day\s*trip|plan|tour|route|schedule)/i.test(lowerMsg) ||
      /(सहल|नियोजन|१\s*दिवस|एक\s*दिवस|मार्ग|कसे\s*फिरावे)/i.test(lowerMsg);

    if (isForts) {
      const forts = allPlaces
        .filter(
          (p) =>
            p.category_slug === 'forts' ||
            (p.name || '').toLowerCase().includes('fort') ||
            (p.name_mr || '').includes('किल्ला') ||
            (p.name_mr || '').includes('गड')
        )
        .slice(0, 4);

      return NextResponse.json({
        reply: isMr
          ? `पुण्याभोवती छत्रपती शिवाजी महाराजांच्या पदस्पर्शाने पावन झालेले १२ ऐतिहासिक गड-किल्ले आहेत. सिंहगड हा शहराच्या सर्वात जवळ असून बस क्र. ५० ने थेट जाता येते:`
          : `Pune is surrounded by 12 majestic Sahyadri hill fortresses steeped in Maratha history. Sinhagad, Rajgad, Torna, and Lohagad are among the most famous:`,
        places: forts,
        suggestions: isMr
          ? ['सिंहगडासाठी बस कोणती?', 'राजगड किल्ला कसा जावा?', 'शनिवार वाडा माहिती']
          : ['Bus route to Sinhagad', 'How to reach Rajgad Fort', 'Shaniwar Wada info'],
      });
    }

    if (isWadas) {
      const wadas = allPlaces
        .filter(
          (p) =>
            p.category_slug === 'heritage' ||
            (p.name || '').toLowerCase().includes('wada') ||
            (p.name || '').toLowerCase().includes('mahal') ||
            (p.name_mr || '').includes('वाडा') ||
            (p.name_mr || '').includes('महाल')
        )
        .slice(0, 4);

      return NextResponse.json({
        reply: isMr
          ? `पुण्यात पेशवेकालीन भव्य वास्तू आणि ऐतिहासिक वाडे आहेत. शनिवार वाडा, लाल महाल आणि विश्रामबाग वाडा हे बुधवार पेठ व मंडई मेट्रो स्थानकांपासून चालण्याच्या अंतरावर आहेत:`
          : `Pune boasts glorious 18th-century Peshwa architecture and historic palaces. Shaniwar Wada, Lal Mahal, and Vishrambaug Wada are easily reachable via Budhwar Peth / Mandai Metro stations:`,
        places: wadas,
        suggestions: isMr
          ? ['शनिवार वाड्याचे मेट्रो स्थानक', 'लाल महाल कुठे आहे?', 'पुण्यातील किल्ले']
          : ['Metro station for Shaniwar Wada', 'Where is Lal Mahal?', 'Top forts near Pune'],
      });
    }

    if (isTemples) {
      const temples = allPlaces
        .filter(
          (p) =>
            p.category_slug === 'temples' ||
            (p.name || '').toLowerCase().includes('temple') ||
            (p.name || '').toLowerCase().includes('mandir') ||
            (p.name_mr || '').includes('मंदिर') ||
            (p.name_mr || '').includes('गणपती')
        )
        .slice(0, 4);

      return NextResponse.json({
        reply: isMr
          ? `पुणे हे गणपती बाप्पा आणि प्राचीन देवस्थानांचे माहेरघर आहे. श्रीमंत दगडूशेठ हलवाई गणपती (बुधवार पेठ मेट्रो), आळंदी (बस १७४) आणि सोन्याची जेजुरी (बस २०८) प्रमुख तीर्थक्षेत्रे आहेत:`
          : `Pune is renowned for sacred Ganpati temples and ancient shrines. Dagdusheth Halwai (Budhwar Peth Metro), Alandi (Bus 174), and Golden Jejuri (Bus 208) are prominent:`,
        places: temples,
        suggestions: isMr
          ? ['दगडूशेठ गणपती वेळ व मेट्रो', 'आळंदी बस वेळापत्रक', 'जेजुरी खंडोबा मंदिर']
          : ['Dagdusheth Ganpati metro', 'Alandi bus route', 'Jejuri Khandoba temple'],
      });
    }

    if (isMuseums) {
      const museums = allPlaces
        .filter(
          (p) =>
            p.category_slug === 'museums' ||
            (p.name || '').toLowerCase().includes('museum') ||
            (p.name_mr || '').includes('संग्रहालय')
        )
        .slice(0, 4);

      return NextResponse.json({
        reply: isMr
          ? `पुण्यातील समृद्ध इतिहास, खगोलशास्त्र आणि कला दर्शवणारी प्रमुख वस्तुसंग्रहालये:`
          : `Here are outstanding museums and science centres in Pune showcasing art, miniature railways, and astrophysics:`,
        places: museums,
        suggestions: isMr
          ? ['राजा दिनकर केळकर म्युझियम', 'जोशींचे मिनिएचर रेल्वे संग्रहालय', 'आयुका विज्ञान उद्यान']
          : ['Raja Dinkar Kelkar Museum', 'Joshi Miniature Railways', 'IUCAA Science Park'],
      });
    }

    if (isNature) {
      const nature = allPlaces
        .filter(
          (p) =>
            p.category_slug === 'parks' ||
            p.category_slug === 'nature' ||
            (p.name || '').toLowerCase().includes('lake') ||
            (p.name || '').toLowerCase().includes('garden') ||
            (p.name_mr || '').includes('तलाव') ||
            (p.name_mr || '').includes('उद्यान')
        )
        .slice(0, 4);

      return NextResponse.json({
        reply: isMr
          ? `पुण्यातील शांत, निसर्गरम्य आणि हिरवेगार उद्याने, तलाव व टेकड्या (उदा. पु. ल. देशपांडे बाग, खडकवासला धरण, वेताळ टेकडी):`
          : `Here are refreshing parks, lakes, and scenic viewpoints around Pune to unwind in nature:`,
        places: nature,
        suggestions: isMr
          ? ['खडकवासला धरण बस क्र.', 'वेताळ टेकडी सूर्योदय', 'पु. ल. देशपांडे उद्यान']
          : ['Khadakwasla bus route', 'Vetal Tekdi sunrise', 'Pu La Deshpande Garden'],
      });
    }

    if (isFree) {
      const freePlaces = allPlaces
        .filter((p) => {
          const prices = p.place_prices || [];
          return prices.some((x: any) => x.is_free || x.amount === 0) || !prices.length;
        })
        .slice(0, 4);

      return NextResponse.json({
        reply: isMr
          ? `पुण्यात विनामूल्य (मोफत) प्रवेश असणारी सुंदर आणि प्रसिद्ध ठिकाणे खालीलप्रमाणे आहेत:`
          : `Here are wonderful places in Pune with free admission (no ticket required):`,
        places: freePlaces,
        suggestions: isMr
          ? ['दगडूशेठ गणपती', 'सारसबाग', 'वेताळ टेकडी']
          : ['Dagdusheth Ganpati', 'Sarasbaug', 'Vetal Tekdi'],
      });
    }

    if (isItinerary) {
      const itineraryPlaces = allPlaces.filter((p) =>
        ['shaniwar-wada', 'lal-mahal', 'kasba-ganpati', 'shreemant-dagdusheth-halwai-ganpati'].includes(
          p.slug
        )
      );

      return NextResponse.json({
        reply: isMr
          ? `पुण्यातील १ दिवसाची परिपूर्ण सहल: सकाळी ९:३० वाजता बुधवार पेठ मेट्रो स्थानकावर उतरा -> शनिवार वाडा -> ५ मिनिटांवर लाल महाल -> कसबा गणपती दर्शन -> श्रीमंत दगडूशेठ हलवाई गणपती -> विश्रामबाग वाडा. आमचा 'सहल नियोजन' (Trip Planner) टूल वापरून तुम्ही मेट्रो व बसच्या वेळेनुसार अचूक मार्ग तयार करू शकता!`
          : `Here is a perfect 1-Day Heritage Walk in Pune: Take Metro Line 1 to Budhwar Peth Station -> Shaniwar Wada -> 5 min walk to Lal Mahal -> Kasba Ganpati shrine -> Shreemant Dagdusheth Halwai Ganpati -> Vishrambaug Wada. You can also build an automated custom schedule in our Trip Planner with live GPS and Metro/Bus transit!`,
        places: itineraryPlaces.length ? itineraryPlaces : allPlaces.slice(0, 3),
        suggestions: isMr
          ? ['सहल नियोजन उघडा', 'पुणे मेट्रो मार्गिका', 'सिंहगड किल्ला बस']
          : ['Open Trip Planner', 'Pune Metro routes', 'Sinhagad Fort bus'],
      });
    }

    // Food, Gastronomy & Local Specialities
    const isFood =
      /(misal|food|eat|restaurant|hotel|bakarwadi|bakharwadi|mastani|chai|tea|poha|thali|lunch|dinner|breakfast|snack|taste)/i.test(
        lowerMsg
      ) ||
      /(मिसळ|जेवण|खाद्य|नाश्ता|बाकरवडी|मस्तानी|चहा|पोहे|थाळी|हॉटेल|मिष्टान्न|खाद्यसंस्कृती)/i.test(
        lowerMsg
      );

    if (isFood) {
      return NextResponse.json({
        reply: isMr
          ? `🍽️ **पुण्याची अस्सल खाद्यसंस्कृती (Must-Try Food in Pune):**\n\n` +
            `• **झणझणीत मिसळ पाव:** काटाकिर्र्र (कर्वे रस्ता), बेडेकर टी स्टॉल (नारायण पेठ), वैद्य उपहार गृह (बुधवार पेठ - सर्वात जुनी मिसळ).\n` +
            `• **चितळे बंधू बाकरवडी:** बाजीराव रस्ता किंवा डेक्कन — गरमागरम बाकरवडी, आंबा बर्फी व श्रीखंड.\n` +
            `• **सुजाता मस्तानी:** बाजीराव रस्ता / सदाशिव पेठ — प्रसिद्ध मँगो मस्तानी आईस्क्रीम शेक.\n` +
            `• **एफसी रोड व डेक्कन कॅफे कल्चर:** कॅफे गुड लक (बन मस्का व इराणी चहा - सन १९३५), वैशाली व रुपाली (मसाला डोसा व फिल्टर कॉफी).\n` +
            `• **सिंहगड पायथा/माथा:** अस्सल पिठलं-भाकरी, ठेचा, मटक्यातील ताक आणि कांदा भजी.`
          : `🍽️ **Authentic Pune Food Trail (Must-Try Specialities):**\n\n` +
            `• **Spicy Puneri Misal Pav:** Katakirrr (Karve Road), Bedekar Tea Stall (Narayan Peth), Vaidya Upahar Gruha (Budhwar Peth - Pune's oldest misal).\n` +
            `• **Chitale Bandhu Bakarwadi:** Bajirao Road & Deccan — legendary crispy spiced bakarwadi, mango barfi & shrikhand.\n` +
            `• **Sujata Mastani:** Bajirao Road / Sadashiv Peth — iconic Pune-origin thick mango milkshake topped with ice cream & dry fruits.\n` +
            `• **FC Road & Deccan Cafe Legacy:** Cafe Goodluck (est. 1935 - famous Bun Maska & Irani Chai), Vaishali & Roopali (South Indian & filter coffee).\n` +
            `• **Sinhagad Fort Foothills/Top:** Authentic hot Pitla-Bhakri, garlic thecha, matka curd/taak, and kanda bhaji.`,
        places: allPlaces.filter((p) =>
          ['shaniwar-wada', 'sinhagad-fort', 'lal-mahal'].includes(p.slug)
        ),
        suggestions: isMr
          ? ['शनिवार वाड्याभोवती काय खावे?', 'सिंहगड बस मार्ग', 'पुणे १ दिवसाची सहल']
          : ['Food near Shaniwar Wada', 'Bus to Sinhagad Fort', '1-day Pune plan'],
      });
    }

    // Token-based matching fallback
    const STOP = new Set(
      'the and for are what who how where when which with from that this have has can you tell about near any some give show please there their entry fee fees price prices ticket cost open opening hours timing timings visit visiting place places pune info details mahiti sanga kiti ahe te sanga kaay'.split(
        ' '
      )
    );

    const tokens = lowerMsg
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w));

    const matchedPlaces = allPlaces.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const nameMr = (p.name_mr || '').toLowerCase();
      const slug = (p.slug || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();

      return (
        name.includes(lowerMsg) ||
        nameMr.includes(lowerMsg) ||
        tokens.some(
          (t) =>
            name.includes(t) ||
            nameMr.includes(t) ||
            slug.includes(t) ||
            desc.includes(t)
        )
      );
    });

    if (matchedPlaces.length > 0) {
      return formatPlaceResponse(matchedPlaces[0], allPlaces, isMr, userLocation);
    }

    // Fallback: If no direct match, show top curated Pune highlights
    const highlights = allPlaces.slice(0, 3);
    return NextResponse.json({
      reply: isMr
        ? `या प्रश्नाशी थेट जुळणारी नोंद सापडली नाही. तरीही तुम्ही कोणत्याही पुणे ठिकाणाबद्दल (उदा. "सिंहगड", "शनिवार वाडा", "मेट्रो मार्ग", "माझ्याजवळील ठिकाणे") विचारू शकता:`
        : `I could not find an exact match for that inquiry. You can ask about any listed Pune landmark, public transit routes (Metro/Bus), or tap "Places near me":`,
      places: highlights,
      suggestions: isMr
        ? ['माझ्याजवळील ठिकाणे (GPS)', 'पुणे मेट्रो व बस मार्ग', 'किल्ले कोणते आहेत?', 'शनिवार वाडा']
        : ['Places near me (GPS)', 'Pune Metro & Bus guide', 'Which forts can I visit?', 'Shaniwar Wada'],
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { reply: 'The assistant encountered an unexpected error. Please try again shortly.' },
      { status: 500 }
    );
  }
}

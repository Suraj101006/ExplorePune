/**
 * Explore Pune - Google Gemini AI Service & Website Knowledge Engine
 * Connects the AI Travel Concierge directly to Google Gemini models via Firebase AI Logic (free tier)
 * and Google AI Studio Developer API with multi-turn conversation memory,
 * Pune ground-truth knowledge, and dynamic interactive website responses.
 */

import { app } from './firebase';
import { getPublicTransitRoute, calculateDistanceKm } from './publicTransit';

export interface ChatHistoryTurn {
  role: 'user' | 'model';
  text: string;
}

export interface GeminiChatOptions {
  message: string;
  history?: ChatHistoryTurn[];
  lang?: 'en' | 'mr';
  allPlaces?: any[];
  userLocation?: { lat: number; lng: number };
  clientApiKey?: string;
}

export interface GeminiChatResult {
  reply: string;
  places?: any[];
  transit?: any;
  suggestions?: string[];
  isGemini: boolean;
  model: string;
}

const SYSTEM_PROMPT = `You are Explore Pune AI (पुणे दर्शन मित्र), the official intelligent, warm, and authentic Travel & Cultural Concierge for Explore Pune (https://punetrail.web.app).

Your Persona & Mission:
- Highly conversational, culturally respectful, enthusiastic, and authentic Pune guide.
- Master of both English and Marathi (मराठी).
- ALWAYS ground your knowledge strictly according to the Explore Pune website and authentic Pune reality.
- Deep authority on Pune history: Chhatrapati Shivaji Maharaj, the Maratha Empire, Peshwa dynasty, historic Wadas (Shaniwar Wada, Lal Mahal, Vishrambaug Wada, Phule Wada, Bhide Wada), and Sahyadri forts (Sinhagad, Rajgad, Torna, Purandar, Lohagad, Shivneri).
- Master of authentic Pune food:
  * Iconic Misal Pav: Katakirrr, Bedekar Tea Stall, Vaidya Upahar Gruha, Shri Krishna.
  * Chitale Bandhu Bakarwadi, Amba Barfi, Shrikhand.
  * Sujata Mastani (famous mango ice-cream milkshake).
  * FC Road & Deccan cafes: Cafe Goodluck (Bun Maska & Irani Chai), Vaishali, Roopali, Wadeshwar.
  * Pitla-Bhakri, Thecha, and Matka Dahi at Sinhagad.
- Master of Pune Public Transit:
  * Pune Metro: Purple Line 1 (PCMC to Swargate) and Aqua Line 2 (Vanaz to Ramwadi), Civil Court interchange.
  * WhatsApp QR ticketing: Commuters can text "Hi" to +91 94201 01990 for instant tickets.
  * PMPML city bus network and daily passes: ₹70 (PMC + PCMC limits), ₹150 (all PMRDA & rural/ghat routes like Sinhagad).
  * Always provide practical transit advice when asked how to get anywhere.
- Renowned spiritual sites: Shreemant Dagdusheth Halwai Ganpati, Kasba Ganpati, Sarasbaug, Parvati Hill, Alandi, Dehu, Jejuri.

Behavioral Guidelines & Website Interactivity:
1. When recommending or discussing ANY landmark, ALWAYS provide clickable markdown links using the website slug: [Place Name](/places/place-slug). For example: [Shaniwar Wada](/places/shaniwar-wada), [Sinhagad Fort](/places/sinhagad-fort), [Dagdusheth Ganpati](/places/shreemant-dagdusheth-halwai-ganpati).
2. When the user asks about planning their day, suggest our interactive [Trip Planner](/planner) where they can generate custom schedules with live metro/bus timings.
3. When the user asks about exploration achievements, mention [Explorer Milestones](/milestones).
4. If the user asks in Marathi or Devanagari script, ALWAYS reply in natural, polite Marathi (मराठी).
5. If the user asks in English, reply in engaging, clear English.
6. Keep answers concise, formatted with bold highlights and bullet points (120 to 260 words).
7. End your answer with an interactive follow-up question (e.g. "Would you like bus/metro routes from your area?", "Shall we add this stop to your itinerary in [Trip Planner](/planner)?").`;

export function isGeminiConfigured(clientApiKey?: string): boolean {
  return Boolean(
    clientApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY
  );
}

/**
 * 1. Attempt Firebase AI Logic (Free Tier Gemini Developer API via Firebase SDK)
 */
async function tryFirebaseAi(
  message: string,
  history: ChatHistoryTurn[],
  targetLang: string,
  placesContext: any[],
  userLocation?: { lat: number; lng: number }
): Promise<{ text: string; model: string } | null> {
  try {
    const { getAI, getGenerativeModel, GoogleAIBackend } = await import('firebase/ai');
    const ai = getAI(app, { backend: new GoogleAIBackend() });
    const model = getGenerativeModel(ai, {
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 950,
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const userPrompt = `${message}\n\n[Context: Language: ${targetLang}${userLocation ? ` | Coordinates: ${userLocation.lat}, ${userLocation.lng}` : ''}]\n[Website Places Database: ${JSON.stringify(placesContext.slice(0, 30))}]`;

    // Map history turns
    const chatHistory = history.slice(-6).map((h) => ({
      role: (h.role === 'model' ? 'model' : 'user') as 'model' | 'user',
      parts: [{ type: 'text' as const, text: h.text }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(userPrompt);
    const replyText = result.response.text();

    if (replyText && replyText.trim()) {
      return { text: replyText.trim(), model: 'gemini-firebase-free' };
    }
  } catch (err: any) {
    // Log gracefully if Firebase AI API is still propagating or not enabled
    if (process.env.NODE_ENV !== 'production') {
      console.info('Firebase AI Logic note:', err?.message || err);
    }
  }
  return null;
}

/**
 * 2. Attempt Google AI Studio Gemini API (REST)
 */
async function tryRestGeminiApi(
  apiKey: string,
  message: string,
  history: ChatHistoryTurn[],
  targetLang: string,
  placesContext: any[],
  userLocation?: { lat: number; lng: number }
): Promise<{ text: string; model: string } | null> {
  const userPrompt = `${message}\n\n[Context: Language: ${targetLang}${userLocation ? ` | Coordinates: ${userLocation.lat}, ${userLocation.lng}` : ''}]\n[Website Places Database: ${JSON.stringify(placesContext.slice(0, 30))}]`;

  const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const h of history.slice(-6)) {
    if (h.text && h.text.trim()) {
      formattedContents.push({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      });
    }
  }

  formattedContents.push({
    role: 'user',
    parts: [{ text: userPrompt }],
  });

  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
  ];

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: formattedContents,
          generationConfig: {
            temperature: 0.75,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 950,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const data = await res.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText) {
        return { text: replyText.trim(), model };
      }
    } catch {
      // Continue to next model
    }
  }

  return null;
}

/**
 * 3. Dynamic Interactive Website Knowledge Engine Fallback
 * Generates an interactive, grounded conversational reply using the website's live places database,
 * public transit route calculator, and markdown links when Gemini API is still propagating or offline.
 */
function synthesizeWebsiteInteractiveReply(
  message: string,
  allPlaces: any[],
  isMr: boolean,
  userLocation?: { lat: number; lng: number }
): { reply: string; places: any[]; transit?: any; suggestions: string[] } {
  const lowerMsg = message.toLowerCase().trim();

  // Keyword-based place matching
  const matched = allPlaces.filter((p) => {
    const name = (p.name || '').toLowerCase();
    const nameMr = (p.name_mr || '').toLowerCase();
    const slug = (p.slug || '').toLowerCase().replace(/-/g, ' ');
    return (
      (name.length > 2 && lowerMsg.includes(name)) ||
      (nameMr.length > 2 && lowerMsg.includes(nameMr)) ||
      (slug.length > 2 && lowerMsg.includes(slug))
    );
  });

  // Check category or theme keywords
  const isForts = /(fort|forts|trek|sahyadri|गड|किल्ला|किल्ले|ट्रेक)/i.test(lowerMsg);
  const isTemples = /(temple|mandir|ganpati|गणपती|मंदिर|देवस्थान)/i.test(lowerMsg);
  const isWadas = /(wada|peshwa|heritage|वाडा|पेशवे|वास्तू)/i.test(lowerMsg);
  const isFood = /(misal|food|eat|restaurant|bakarwadi|mastani|मिसळ|खाद्य|बाकरवडी|मस्तानी|नाश्ता)/i.test(lowerMsg);
  const isTransit = /(metro|bus|pmpml|ticket|pass|मेट्रो|बस|तिकीट|पास|मार्ग|कसे जावे)/i.test(lowerMsg);
  const isItinerary = /(itinerary|plan|1 day|सहल|नियोजन|१ दिवस)/i.test(lowerMsg);
  const isNearMe = /(near me|nearby|closest|जवळची|माझ्याजवळ)/i.test(lowerMsg);

  let targetPlaces = matched.slice(0, 3);
  let transitData: any = undefined;

  if (targetPlaces.length > 0 && isTransit) {
    transitData = getPublicTransitRoute(
      userLocation?.lat || 18.5204,
      userLocation?.lng || 73.8567,
      targetPlaces[0]
    );
  }

  if (targetPlaces.length === 0) {
    if (isForts) {
      targetPlaces = allPlaces.filter((p) => p.category_slug === 'forts' || p.category === 'forts').slice(0, 3);
    } else if (isTemples) {
      targetPlaces = allPlaces.filter((p) => p.category_slug === 'temples' || p.category === 'temples').slice(0, 3);
    } else if (isWadas) {
      targetPlaces = allPlaces.filter((p) => p.category_slug === 'heritage' || p.category === 'heritage').slice(0, 3);
    } else if (isNearMe && userLocation) {
      targetPlaces = [...allPlaces]
        .map((p) => ({
          ...p,
          dist: calculateDistanceKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude),
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);
    } else {
      targetPlaces = allPlaces.filter((p) =>
        ['shaniwar-wada', 'sinhagad-fort', 'shreemant-dagdusheth-halwai-ganpati'].includes(p.slug)
      ).slice(0, 3);
    }
  }

  let reply = '';
  const first = targetPlaces[0];

  if (isMr) {
    if (first && isTransit && transitData) {
      reply = `🚌 **[${first.name_mr || first.name}](/places/${first.slug}) साठी सार्वजनिक वाहतूक मार्ग:**\n\n` +
        `• **मार्ग संक्षेप:** ${transitData.summaryMr}\n` +
        `• **नजीकचे स्थानक:** ${transitData.nearestMetro ? `${transitData.nearestMetro.stationNameMr} (${transitData.nearestMetro.lineNameMr})` : transitData.nearestBus?.stopNameMr}\n` +
        `• **अंदाजे वेळ व तिकीट:** ~${transitData.estimatedMinutes} मिनिटे | ₹${transitData.estimatedCostInr}\n\n` +
        `🎟️ **तिकीट:** पुणे मेट्रोसाठी **+91 94201 01990** वर व्हॉट्सअॅप मेसेज पाठवा किंवा पीएमपीएमएलचा **₹७० चा दैनिक पास** वापरा.\n\n` +
        `तुम्हाला या ठिकाणासाठी आमच्या [सहल नियोजक (Trip Planner)](/planner) मध्ये वेळ आखून हवी आहे का?`;
    } else if (first && matched.length > 0) {
      const price = first.place_prices?.[0];
      const hours = first.place_hours?.[0];
      const priceText = price ? (price.is_free ? 'मोफत प्रवेश' : `₹${price.amount}`) : 'सार्वजनिक दर';
      const hoursText = hours ? `${hours.opens_at} - ${hours.closes_at}` : 'सकाळी ९:०० ते सायं ६:००';

      reply = `🚩 **[${first.name_mr || first.name}](/places/${first.slug})**\n\n` +
        `${first.description_mr || first.description || ''}\n\n` +
        `• ⏱️ **वेळ:** ${hoursText}\n` +
        `• 🎟️ **प्रवेश शुल्क:** ${priceText}\n` +
        `• 📍 **पत्ता:** ${first.address_mr || first.address || 'पुणे, महाराष्ट्र'}\n\n` +
        `अधिक माहितीसाठी वर दिलेल्या लिंकवर क्लिक करा. तुम्हाला या ठिकाणाला भेट देण्यासाठी मेट्रो किंवा बसचा मार्ग पाहायचा आहे का?`;
    } else if (isFood) {
      reply = `🍽️ **पुण्यातील अस्सल खाद्यसंस्कृती:**\n\n` +
        `• **झणझणीत मिसळ:** काटाकिर्र्र (कर्वे रस्ता), बेडेकर टी स्टॉल (नारायण पेठ), वैद्य उपहार गृह (बुधवार पेठ).\n` +
        `• **चितळे बंधू:** बाजीराव रस्ता - प्रसिद्ध बाकरवडी व आंबा बर्फी.\n` +
        `• **सुजाता मस्तानी:** अस्सल मँगो मस्तानी आईस्क्रीम शेक.\n` +
        `• **कॅफे गुड लक (सन १९३५):** एफसी रोड - इराणी चहा व बन मस्का.\n\n` +
        `तुम्ही कोणत्या भागात आहात? जवळचे प्रसिद्ध हॉटेल शोधू का?`;
    } else if (isItinerary) {
      reply = `🗺️ **पुण्यातील १ दिवसाची परिपूर्ण सहल:**\n\n` +
        `सकाळी ९:३० वाजता [शनिवार वाडा](/places/shaniwar-wada) (बुधवार पेठ मेट्रो) ➔ [लाल महाल](/places/lal-mahal) ➔ [दगडूशेठ गणपती](/places/shreemant-dagdusheth-halwai-ganpati) ➔ विश्रामबाग वाडा ➔ संध्याकाळी [सारसबाग](/places/sarasbaug).\n\n` +
        `तुमच्या उपलब्ध वेळेनुसार सविस्तर आराखडा हवा असल्यास आमच्या [सहल नियोजक (Trip Planner)](/planner) मध्ये स्वतःचे वेळापत्रक तयार करा!`;
    } else {
      reply = `नमस्कार! 🙏 मी तुमचा Explore Pune AI मार्गदर्शक आहे. पुण्यातील गड-किल्ले जसे [सिंहगड](/places/sinhagad-fort), ऐतिहासिक वास्तू जसे [शनिवार वाडा](/places/shaniwar-wada), मेट्रो मार्ग किंवा सहल नियोजनाबद्दल काहीही विचारू शकता. आपण आज काय पाहू इच्छिता?`;
    }
  } else {
    if (first && isTransit && transitData) {
      reply = `🚌 **Public Transit Route to [${first.name}](/places/${first.slug}):**\n\n` +
        `• **Transit Summary:** ${transitData.summaryEn}\n` +
        `• **Nearest Stop:** ${transitData.nearestMetro ? `${transitData.nearestMetro.stationNameEn} (${transitData.nearestMetro.lineNameEn})` : transitData.nearestBus?.stopNameEn}\n` +
        `• **Estimated Travel Time & Fare:** ~${transitData.estimatedMinutes} mins | Approx ₹${transitData.estimatedCostInr}\n\n` +
        `🎟️ **Booking:** For Pune Metro, message "Hi" on WhatsApp to **+91 94201 01990**, or use PMPML's **₹70 unlimited daily pass**.\n\n` +
        `Would you like to add this destination to your schedule in our [Trip Planner](/planner)?`;
    } else if (first && matched.length > 0) {
      const price = first.place_prices?.[0];
      const hours = first.place_hours?.[0];
      const priceText = price ? (price.is_free ? 'Free Entry' : `₹${price.amount}`) : 'Regular rates';
      const hoursText = hours ? `${hours.opens_at} - ${hours.closes_at}` : '09:00 AM - 06:00 PM';

      reply = `🚩 **[${first.name}](/places/${first.slug})** (${first.name_mr || ''})\n\n` +
        `${first.description || first.description_mr || ''}\n\n` +
        `• ⏱️ **Timings:** ${hoursText}\n` +
        `• 🎟️ **Entry:** ${priceText}\n` +
        `• 📍 **Location:** ${first.address || 'Pune, Maharashtra'}\n\n` +
        `Click the link above to view details, photos, and live map. Would you like public transit (Metro/Bus) directions?`;
    } else if (isFood) {
      reply = `🍽️ **Authentic Pune Gastronomy Trail:**\n\n` +
        `• **Legendary Misal Pav:** Katakirrr (Karve Road), Bedekar Tea Stall (Narayan Peth), Vaidya Upahar Gruha (Budhwar Peth).\n` +
        `• **Chitale Bandhu:** Bajirao Road & Deccan — famous crispy bakarwadi & mango barfi.\n` +
        `• **Sujata Mastani:** Iconic thick ice cream fruit shakes.\n` +
        `• **Cafe Goodluck (est. 1935):** FC Road — classic Bun Maska & Irani Chai.\n\n` +
        `Which Pune neighborhood are you in right now? I can recommend the closest iconic food spot!`;
    } else if (isItinerary) {
      reply = `🗺️ **Recommended 1-Day Pune Heritage Trail:**\n\n` +
        `Start 09:30 AM at [Shaniwar Wada](/places/shaniwar-wada) (Budhwar Peth Metro) ➔ 5 min walk to [Lal Mahal](/places/lal-mahal) ➔ Darshan at [Dagdusheth Ganpati](/places/shreemant-dagdusheth-halwai-ganpati) ➔ [Vishrambaug Wada](/places/vishrambaug-wada) ➔ Sunset at [Sarasbaug](/places/sarasbaug).\n\n` +
        `You can generate a minute-by-minute schedule with buffer times in our [Trip Planner](/planner)!`;
    } else {
      reply = `Namaste! 🙏 Welcome to Explore Pune AI. I can help you discover iconic forts like [Sinhagad](/places/sinhagad-fort), Peshwa palaces like [Shaniwar Wada](/places/shaniwar-wada), Pune Metro routes, and local food trails. What would you like to explore today?`;
    }
  }

  const suggestions = isMr
    ? ['पुणे मेट्रो तिकीट कसे काढावे?', '१ दिवसाची सहल आखा', 'सिंहगड किल्ला बस मार्ग', 'पुण्यातील सर्वोत्तम मिसळ']
    : ['How to book Pune Metro ticket', 'Plan 1-day itinerary', 'Bus route to Sinhagad Fort', 'Best Misal in Pune'];

  return {
    reply,
    places: targetPlaces,
    transit: transitData,
    suggestions,
  };
}

/**
 * Main Entry: Generates Gemini / Interactive AI response grounded in website data.
 */
export async function generateGeminiReply({
  message,
  history = [],
  lang = 'en',
  allPlaces = [],
  userLocation,
  clientApiKey,
}: GeminiChatOptions): Promise<GeminiChatResult> {
  const isDevanagari = /[\u0900-\u097F]/.test(message);
  const isMr = lang === 'mr' || isDevanagari;
  const targetLang = isMr ? 'Marathi (मराठी)' : 'English';

  // Prepare condensed grounded places catalog for RAG
  const queryWords = message.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const relevantPlaces = [...allPlaces].sort((a, b) => {
    const aMatch = queryWords.some(
      (w) => a.name?.toLowerCase().includes(w) || a.name_mr?.toLowerCase().includes(w)
    );
    const bMatch = queryWords.some(
      (w) => b.name?.toLowerCase().includes(w) || b.name_mr?.toLowerCase().includes(w)
    );
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return (b.popularity_score || 0) - (a.popularity_score || 0);
  });

  const placesContext = relevantPlaces.slice(0, 35).map((p) => ({
    name: p.name,
    name_mr: p.name_mr,
    category: p.category_slug || p.category,
    slug: p.slug,
    hours: p.place_hours?.[0] ? `${p.place_hours[0].opens_at} - ${p.place_hours[0].closes_at}` : 'Regular',
    price: p.place_prices?.[0]?.is_free ? 'Free' : `₹${p.place_prices?.[0]?.amount || 25}`,
  }));

  // 1. Try Firebase AI Logic (Free tier Gemini Developer API in Firebase)
  const firebaseRes = await tryFirebaseAi(message, history, targetLang, placesContext, userLocation);
  if (firebaseRes && firebaseRes.text) {
    const lower = firebaseRes.text.toLowerCase();
    const matchedPlaces = allPlaces.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const slug = (p.slug || '').toLowerCase();
      return (name.length > 3 && lower.includes(name)) || (slug.length > 3 && lower.includes(slug));
    }).slice(0, 3);

    return {
      reply: firebaseRes.text,
      places: matchedPlaces.length > 0 ? matchedPlaces : undefined,
      isGemini: true,
      model: firebaseRes.model,
      suggestions: isMr
        ? ['पुणे मेट्रो तिकीट कसे काढावे?', '१ दिवसाची सहल आखा', 'माझ्याजवळील ठिकाणे']
        : ['How to book Pune Metro ticket', 'Plan 1-day itinerary', 'Places near me'],
    };
  }

  // 2. Try Direct Google Gemini API (if API Key is configured in env or client)
  const apiKey =
    clientApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (apiKey) {
    const restRes = await tryRestGeminiApi(
      apiKey,
      message,
      history,
      targetLang,
      placesContext,
      userLocation
    );
    if (restRes && restRes.text) {
      const lower = restRes.text.toLowerCase();
      const matchedPlaces = allPlaces.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const slug = (p.slug || '').toLowerCase();
        return (name.length > 3 && lower.includes(name)) || (slug.length > 3 && lower.includes(slug));
      }).slice(0, 3);

      return {
        reply: restRes.text,
        places: matchedPlaces.length > 0 ? matchedPlaces : undefined,
        isGemini: true,
        model: restRes.model,
        suggestions: isMr
          ? ['पुणे मेट्रो तिकीट कसे काढावे?', '१ दिवसाची सहल आखा', 'माझ्याजवळील ठिकाणे']
          : ['How to book Pune Metro ticket', 'Plan 1-day itinerary', 'Places near me'],
      };
    }
  }

  // 3. Dynamic Interactive Website Knowledge Synthesizer
  // Guarantees zero failures and grounds the response directly in website data
  const syn = synthesizeWebsiteInteractiveReply(message, allPlaces, isMr, userLocation);
  return {
    reply: syn.reply,
    places: syn.places.length > 0 ? syn.places : undefined,
    transit: syn.transit,
    suggestions: syn.suggestions,
    isGemini: false,
    model: 'explore-pune-knowledge-engine',
  };
}

/**
 * Explore Pune - Local Knowledge Engine & Smart Intent Classifier
 * Resolves common Pune tourism queries instantly on the client / edge without API calls:
 * - Categories: Forts, Heritage, Religious, Museums, Nature, Meditation, Family, Short Visits
 * - Place Lookups: Verified Entry Fees, Opening Timings, Best Time to Visit, How to Reach, History
 * - Intent Detection & Context Memory: Handles "it", "its timings", "nearby places"
 * - Trip Planning: Generates structured hour-based itineraries and integrates with /planner
 * - Strict Anti-Hallucination: Emits "I don't have a verified value for this yet." if unverified.
 */

import rawPlaces from '@/data/backup_places_pre_audit_20261023.json';
import { calculateDistanceKm, getPublicTransitRoute } from './publicTransit';

export interface StructuredPlace {
  id: string;
  slug: string;
  name: string;
  name_mr?: string;
  category: string;
  category_slug?: string;
  image_url?: string;
  description?: string;
  description_mr?: string;
  address?: string;
  address_mr?: string;
  latitude: number;
  longitude: number;
  best_time?: string;
  best_time_mr?: string;
  recommended_duration_minutes?: number;
  place_prices?: Array<{ is_free?: boolean; amount?: number; currency?: string }>;
  entry_fee?: number | null;
  fee_status?: 'free' | 'paid' | 'not_verified';
  fee_details?: {
    adult?: number | null;
    child?: number | null;
    foreigner?: number | null;
    camera?: string | null;
    parking?: string | null;
    vehicle_toll?: string | null;
    notes?: string | null;
    notes_mr?: string | null;
  };
  place_hours?: Array<{ opens_at?: string; closes_at?: string; is_closed?: boolean; days?: string }>;
  verification?: {
    status?: string;
    lastChecked?: string;
    sources?: Array<{ name: string; url?: string }>;
  };
  is_family_friendly?: boolean;
}

export const ALL_STRUCTURED_PLACES: StructuredPlace[] = (rawPlaces as any[]) || [];

export interface ChatContext {
  lastReferencedSlug?: string | null;
  userLocation?: { lat: number; lng: number } | null;
  userLocalityName?: string | null;
  lang?: 'en' | 'mr';
}

export interface EngineResult {
  handled: boolean;
  reply: string;
  places?: StructuredPlace[];
  transit?: any;
  suggestions?: string[];
  planPayload?: {
    hours: number;
    title: string;
    slugs: string[];
  };
}

// Map for quick slug lookup
const PLACES_MAP = new Map<string, StructuredPlace>();
ALL_STRUCTURED_PLACES.forEach((p) => {
  PLACES_MAP.set(p.slug, p);
  PLACES_MAP.set(p.id, p);
});

/**
 * Searches for a place by name, marathi name, slug, or keywords
 */
export function findPlaceInQuery(query: string, context?: ChatContext): StructuredPlace | null {
  const clean = query.toLowerCase().trim();

  // 1. Direct name/slug match
  for (const p of ALL_STRUCTURED_PLACES) {
    const slugClean = p.slug.replace(/-/g, ' ');
    const nameClean = p.name.toLowerCase();
    const nameMrClean = (p.name_mr || '').toLowerCase();

    if (
      clean.includes(p.slug) ||
      clean.includes(slugClean) ||
      clean.includes(nameClean) ||
      (nameMrClean && clean.includes(nameMrClean))
    ) {
      return p;
    }

    // Stem matching for Marathi compound names (e.g., शनिवार वाडा -> शनिवार)
    const stemMr = nameMrClean.replace(/(वाडा|महाल|टेकडी|तलाव|धरण|मंदिर|किल्ला)$/, '').trim();
    if (stemMr && stemMr.length >= 4 && clean.includes(stemMr)) {
      return p;
    }
  }

  // 2. Common short aliases
  const ALIASES: Record<string, string> = {
    'shaniwarwada': 'shaniwar-wada',
    'shaniwar wada': 'shaniwar-wada',
    'शनिवार वाडा': 'shaniwar-wada',
    'शनिवार वाड्या': 'shaniwar-wada',
    'शनिवार वाड': 'shaniwar-wada',
    'sinhagad': 'sinhagad-fort',
    'सिंहगड': 'sinhagad-fort',
    'सिंहगडा': 'sinhagad-fort',
    'dagdusheth': 'shreemant-dagdusheth-halwai-ganpati',
    'दगडूशेठ': 'shreemant-dagdusheth-halwai-ganpati',
    'kelkar': 'raja-dinkar-kelkar-museum',
    'केळकर': 'raja-dinkar-kelkar-museum',
    'lal mahal': 'lal-mahal',
    'लाल महाल': 'lal-mahal',
    'लाल महाला': 'lal-mahal',
    'aga khan': 'aga-khan-palace',
    'आगाखान': 'aga-khan-palace',
    'आगा खान': 'aga-khan-palace',
    'pataleshwar': 'pataleshwar-cave-temple',
    'पाताळेश्वर': 'pataleshwar-cave-temple',
    'sarasbaug': 'sarasbaug',
    'सारसबाग': 'sarasbaug',
    'सारसबागे': 'sarasbaug',
    'vetal tekdi': 'vetal-tekdi',
    'वेताळ टेकडी': 'vetal-tekdi',
    'taljai': 'taljai-hills',
    'तळजाई': 'taljai-hills',
    'khadakwasla': 'khadakwasla-dam',
    'खडकवासला': 'khadakwasla-dam',
    'खडकवासल्या': 'khadakwasla-dam',
    'parvati': 'parvati-hill-temples',
    'पर्वती': 'parvati-hill-temples',
    'alandi': 'alandi-dnyaneshwar-mandir',
    'आळंदी': 'alandi-dnyaneshwar-mandir',
    'dehu': 'dehu-gatha-mandir',
    'देहू': 'dehu-gatha-mandir',
    'jejuri': 'jejuri-khandoba-temple',
    'जेजुरी': 'jejuri-khandoba-temple',
    'katraj zoo': 'rajiv-gandhi-zoological-park-katraj',
    'कात्रज प्राणीसंग्रहालय': 'rajiv-gandhi-zoological-park-katraj',
    'कात्रज': 'rajiv-gandhi-zoological-park-katraj',
    'okayama': 'okayama-friendship-garden',
    'पु ल देशपांडे': 'okayama-friendship-garden',
    'pula': 'okayama-friendship-garden',
    'rajgad': 'rajgad-fort',
    'राजगड': 'rajgad-fort',
    'राजगडा': 'rajgad-fort',
    'torna': 'torna-fort',
    'तोरणा': 'torna-fort',
    'तोरण्या': 'torna-fort',
    'lohagad': 'lohagad-fort',
    'लोहगड': 'lohagad-fort',
    'लोहगडा': 'lohagad-fort',
    'shivneri': 'shivneri-fort',
    'शिवनेरी': 'shivneri-fort',
    'purandar': 'purandar-fort',
    'पुरंदर': 'purandar-fort',
    'पुरंदरा': 'purandar-fort',
    'mulshi': 'mulshi-dam',
    'मुळशी': 'mulshi-dam',
  };

  for (const [alias, targetSlug] of Object.entries(ALIASES)) {
    if (clean.includes(alias)) {
      const found = PLACES_MAP.get(targetSlug);
      if (found) return found;
    }
  }

  // 3. Pronoun context resolution: "it", "this place", "its timings", "तिथे", "त्याचे", "याचे"
  const isPronounRef = /\b(it|this place|that place|there|here|its)\b/i.test(clean) ||
    /(तिथे|त्याचे|याचे|या ठिकाणी|त्या जागेचे)/.test(clean);

  if (isPronounRef && context?.lastReferencedSlug) {
    const prev = PLACES_MAP.get(context.lastReferencedSlug);
    if (prev) return prev;
  }

  return null;
}

/**
 * Main Local Knowledge Resolver: Checks structured database and intent
 */
export function resolveLocalKnowledge(
  query: string,
  context: ChatContext = {}
): EngineResult {
  const isDevanagari = /[\u0900-\u097F]/.test(query);
  const isMr = context.lang === 'mr' || isDevanagari;
  const lower = query.toLowerCase().trim();

  // --------------------------------------------------------------------------
  // 1. GREETINGS & INTRODUCTIONS
  // --------------------------------------------------------------------------
  const isGreeting = /^(hi|hello|hey|namaste|नमस्कार|प्रणाम|start|help|कसे आहात)\b/i.test(lower);
  if (isGreeting && lower.length < 25) {
    return {
      handled: true,
      reply: isMr
        ? `नमस्कार! 🙏 मी **Explore Pune AI मार्गदर्शक** आहे. पुण्यातील गड-किल्ले, ऐतिहासिक वास्तू, मंदिरे, सार्वजनिक वाहतूक (मेट्रो व बस), आणि सहल नियोजनात मी तुम्हाला मदत करू शकेन.\n\nतुम्हाला काय शोधायचे आहे?`
        : `Namaste! 🙏 I am your **Explore Pune Travel Assistant**. I can help you with Pune forts, heritage palaces, sacred temples, Pune Metro & PMPML bus schedules, and personalized travel itineraries.\n\nWhat would you like to explore today?`,
      suggestions: isMr
        ? ['🏰 सर्वोत्तम किल्ले', '🏛️ ऐतिहासिक वास्तू', '🛕 प्रसिद्ध मंदिरे', '🗺️ सहल नियोजन (४ तास)', '📍 माझ्याजवळील ठिकाणे']
        : ['🏰 Best Forts', '🏛️ Heritage Places', '🛕 Religious Places', '🗺️ Plan 4-Hour Trip', '📍 Places Near Me'],
    };
  }

  // --------------------------------------------------------------------------
  // 2. DURATION / TRIP PLANNING INTENT (e.g., "I have 4 hours", "6 hours in Pune", "1-day itinerary")
  // --------------------------------------------------------------------------
  const durationHourMatch = lower.match(/(\d+)\s*(hour|hr|तास)/i);
  const durationDayMatch = lower.match(/(\d+)\s*(-|\s)?(day|दिवस)/i);
  let durationHours: number | null = null;
  if (durationHourMatch) {
    durationHours = parseInt(durationHourMatch[1], 10);
  } else if (durationDayMatch) {
    durationHours = 7; // Full day mapped to 7 hours of sightseeing
  } else if (lower.includes('half day') || lower.includes('अर्धा दिवस')) {
    durationHours = 4;
  } else if (lower.includes('full day') || lower.includes('पूर्ण दिवस')) {
    durationHours = 7;
  }

  const isTripIntent = /(plan|itinerary|trip|tour|सहल|नियोजन|भेट देण्यासारखे)/i.test(lower) || durationHours !== null;

  if (durationHours !== null && isTripIntent) {
    const hours = Math.min(10, Math.max(2, durationHours));
    return generateLocalItinerary(hours, isMr);
  }

  // --------------------------------------------------------------------------
  // 3. SPECIFIC PLACE LOOKUP (Entry fee, timings, best time, transit, history)
  // --------------------------------------------------------------------------
  const place = findPlaceInQuery(query, context);

  if (place) {
    const isFeeQuery = /(fee|ticket|cost|price|free|charge|शुल्क|तिकीट|दर|मोफत|पैसे)/i.test(lower);
    const isTimeQuery = /(timing|timings|open|close|hours|वेळ|कधी उघडते|कधी बंद)/i.test(lower);
    const isBestTime = /(best time|season|when to visit|हवामान|कधी जावे|उत्तम वेळ)/i.test(lower);
    const isTransitQuery = /(how to reach|how to go|metro|bus|route|transit|मार्ग|कसे जावे|मेट्रो|बस)/i.test(lower);
    const isHistoryQuery = /(history|who built|significance|story|इतिहास|कोणी बांधले|माहिती)/i.test(lower);

    // 3A. ENTRY FEE QUERY
    if (isFeeQuery) {
      return formatPlaceFee(place, isMr);
    }

    // 3B. TIMINGS QUERY
    if (isTimeQuery) {
      return formatPlaceTimings(place, isMr);
    }

    // 3C. BEST TIME TO VISIT
    if (isBestTime) {
      return formatPlaceBestTime(place, isMr);
    }

    // 3D. TRANSIT / HOW TO REACH
    if (isTransitQuery) {
      return formatPlaceTransit(place, context, isMr);
    }

    // 3E. HISTORY / STORY
    if (isHistoryQuery) {
      return formatPlaceHistory(place, isMr);
    }

    // 3F. GENERAL PLACE OVERVIEW
    return formatPlaceOverview(place, isMr);
  }

  // --------------------------------------------------------------------------
  // 4. CATEGORY RECOMMENDATIONS (Forts, Heritage, Temples, Museums, Nature, etc.)
  // --------------------------------------------------------------------------
  const isFortCategory = /(fort|forts|trek|gad|किल्ला|किल्ले|दुर्ग|ट्रेक)/i.test(lower);
  const isHeritageCategory = /(heritage|wada|palace|peshwa|ऐतिहासिक|वाडा|महाल|वास्तू)/i.test(lower);
  const isTempleCategory = /(temple|temples|religious|mandir|ganpati|दर्शन|मंदिर|मंदिरे|देवस्थान|गणपती)/i.test(lower);
  const isMuseumCategory = /(museum|museums|art|gallery|संग्रहालय|म्युझियम)/i.test(lower);
  const isNatureCategory = /(nature|lake|dam|waterfall|tekdi|hill|धरण|निसर्ग|तलाव|धबधबा|टेकडी)/i.test(lower);
  const isMeditationCategory = /(meditation|peaceful|quiet|spiritual|ध्यान|शांत|आध्यात्मिक)/i.test(lower);
  const isFamilyCategory = /(family|kids|children|कुटुंब|लहान मुले|पालक)/i.test(lower);
  const isShortVisit = /(short visit|quick|1 hour|तासभरात|कमी वेळेत)/i.test(lower);

  if (isFortCategory) {
    return formatCategoryRecommendations('forts', isMr ? '🏰 पुण्यातील प्रमुख गड-किल्ले' : '🏰 Best Forts Around Pune', isMr);
  }
  if (isHeritageCategory) {
    return formatCategoryRecommendations('heritage', isMr ? '🏛️ पेशवेकालीन वास्तू व ऐतिहासिक वारसा' : '🏛️ Historic Wadas & Heritage Places', isMr);
  }
  if (isTempleCategory) {
    return formatCategoryRecommendations('temples', isMr ? '🛕 पुण्यातील प्रसिद्ध मंदिरे व देवस्थाने' : '🛕 Revered Temples & Spiritual Sites', isMr);
  }
  if (isMuseumCategory) {
    return formatCategoryRecommendations('museums', isMr ? '🖼️ प्रसिद्ध वस्तुसंग्रहालये' : '🖼️ Top Museums in Pune', isMr);
  }
  if (isNatureCategory) {
    return formatCategoryRecommendations('nature', isMr ? '🌿 निसर्गरम्य पर्यटन स्थळे, टेकड्या व धरणे' : '🌿 Nature Spots, Tekdis & Lakes', isMr);
  }
  if (isMeditationCategory) {
    return formatCategoryRecommendations('meditation', isMr ? '🧘 ध्यान व शांतता देणारी ठिकाणे' : '🧘 Peaceful Meditation Spots', isMr);
  }
  if (isFamilyCategory) {
    return formatFamilyRecommendations(isMr);
  }
  if (isShortVisit) {
    return formatShortVisitRecommendations(isMr);
  }

  // --------------------------------------------------------------------------
  // 5. NEARBY / NEAR ME INTENT
  // --------------------------------------------------------------------------
  const isNearMe = /(near me|nearby|closest|around here|माझ्याजवळ|जवळची|नजीकची)/i.test(lower);
  if (isNearMe) {
    return formatNearbyPlaces(context, isMr);
  }

  // If not locally resolvable with strict accuracy, return false so server AI handles it
  return {
    handled: false,
    reply: '',
  };
}

// ============================================================================
// HELPER FORMATTERS FOR STRUCTURED KNOWLEDGE
// ============================================================================

function formatPlaceFee(place: StructuredPlace, isMr: boolean): EngineResult {
  const name = isMr && place.name_mr ? place.name_mr : place.name;
  let feeText = '';

  if (place.fee_status === 'free' || place.entry_fee === 0) {
    feeText = isMr
      ? `✅ **अधिकृत माहिती:** [${name}](/places/${place.slug}) साठी **सामान्य प्रवेश पूर्णपणे मोफत (₹0)** आहे.`
      : `✅ **Verified Information:** General visitor entry to [${name}](/places/${place.slug}) is **Verified Free (₹0)**.`;
  } else if (place.entry_fee && place.entry_fee > 0) {
    const adult = place.fee_details?.adult ?? place.entry_fee;
    const child = place.fee_details?.child ? ` (मुले: ₹${place.fee_details.child})` : '';
    const childEn = place.fee_details?.child ? ` (Children: ₹${place.fee_details.child})` : '';
    feeText = isMr
      ? `🎟️ **अधिकृत प्रवेश शुल्क:** [${name}](/places/${place.slug}) चे प्रवेश शुल्क **₹${adult}**${child} आहे.`
      : `🎟️ **Verified Admission Fee:** Entry to [${name}](/places/${place.slug}) is **₹${adult} per adult**${childEn}.`;
  } else {
    feeText = isMr
      ? `ℹ️ [${name}](/places/${place.slug}) च्या प्रवेश शुल्काची अद्ययावत नोंद: **मी सध्या यासाठी अधिकृत निश्चित मूल्य सांगू शकत नाही (I don't have a verified value for this yet).**`
      : `ℹ️ Admission details for [${name}](/places/${place.slug}): **I don't have a verified value for this yet.**`;
  }

  // Parking & vehicle toll details (separated cleanly)
  let extraCharges = '';
  if (place.fee_details?.vehicle_toll) {
    extraCharges += `\n• 🚗 **वाहन टोल / Vehicle Toll:** ${place.fee_details.vehicle_toll}`;
  }
  if (place.fee_details?.parking) {
    extraCharges += `\n• 🅿️ **पार्किंग / Parking:** ${place.fee_details.parking}`;
  }

  // Official source
  const sourceName = place.verification?.sources?.[0]?.name;
  const sourceUrl = place.verification?.sources?.[0]?.url;
  const sourceLine = sourceName
    ? isMr
      ? `\n\n📌 **अधिकृत स्रोत:** ${sourceUrl ? `[${sourceName}](${sourceUrl})` : sourceName}`
      : `\n\n📌 **Official Source:** ${sourceUrl ? `[${sourceName}](${sourceUrl})` : sourceName}`
    : '';

  return {
    handled: true,
    reply: `${feeText}${extraCharges}${sourceLine}`,
    places: [place],
    suggestions: isMr
      ? [`${place.name_mr || place.name} ची वेळ काय आहे?`, `${place.name_mr || place.name} कसे जावे?`, 'जवळची इतर ठिकाणे']
      : [`Timings for ${place.name}`, `How to reach ${place.name}`, `Places near ${place.name}`],
  };
}

function formatPlaceTimings(place: StructuredPlace, isMr: boolean): EngineResult {
  const name = isMr && place.name_mr ? place.name_mr : place.name;
  const hours = place.place_hours?.[0];

  let timingsText = '';
  if (hours && hours.opens_at && hours.closes_at) {
    timingsText = isMr
      ? `⏱️ **[${name}](/places/${place.slug}) च्या अधिकृत वेळा (Timings):**\n• **उघडण्याची वेळ:** ${hours.opens_at}\n• **बंद होण्याची वेळ:** ${hours.closes_at}\n• **दिवस:** ${hours.days || 'सर्व दिवस सुरू'}`
      : `⏱️ **Official Operating Timings for [${name}](/places/${place.slug}):**\n• **Opening Hours:** ${hours.opens_at} to ${hours.closes_at}\n• **Operating Days:** ${hours.days || 'Open all days'}`;
  } else {
    timingsText = isMr
      ? `⏱️ **[${name}](/places/${place.slug}) च्या वेळा (Timings):** सूर्योदय ते सूर्यास्त दरम्यान भेट देणे उत्तम.`
      : `⏱️ **Operating Timings for [${name}](/places/${place.slug}):** Recommended visiting hours are between sunrise and sunset (approx. 6:00 AM – 6:00 PM).`;
  }

  const durationMin = place.recommended_duration_minutes || 60;
  const durationText = isMr
    ? `\n• ⏳ **अपेक्षित वेळ:** सुमारे ${Math.round(durationMin / 60 * 10) / 10} तास`
    : `\n• ⏳ **Recommended Duration:** ~${Math.round(durationMin / 60 * 10) / 10} hours`;

  return {
    handled: true,
    reply: `${timingsText}${durationText}`,
    places: [place],
    suggestions: isMr
      ? [`${place.name_mr || place.name} प्रवेश शुल्क किती?`, `${place.name_mr || place.name} कसे जावे?`, 'पुणे सहल नियोजन']
      : [`Entry fee for ${place.name}`, `How to reach ${place.name}`, 'Plan 4-Hour Trip'],
  };
}

function formatPlaceBestTime(place: StructuredPlace, isMr: boolean): EngineResult {
  const name = isMr && place.name_mr ? place.name_mr : place.name;
  const bestTime = isMr && place.best_time_mr ? place.best_time_mr : place.best_time;

  const reply = isMr
    ? `🌤️ **[${name}](/places/${place.slug}) ला भेट देण्यासाठी सर्वोत्तम वेळ:**\n\n${bestTime || 'ऑक्टोबर ते मार्च (थंड व आल्हाददायक वातावरण).'}\n\nतुम्हाला या ठिकाणाचा बस किंवा मेट्रो मार्ग पाहायचा आहे का?`
    : `🌤️ **Best Time to Visit [${name}](/places/${place.slug}):**\n\n${bestTime || 'October to March (pleasant and cool weather).'}\n\nWould you like transit directions on how to reach here?`;

  return {
    handled: true,
    reply,
    places: [place],
    suggestions: isMr
      ? [`${place.name_mr || place.name} कसे जावे?`, `${place.name_mr || place.name} प्रवेश शुल्क?`, 'जवळची इतर ठिकाणे']
      : [`How to reach ${place.name}`, `Entry fee for ${place.name}`, `Places near ${place.name}`],
  };
}

function formatPlaceTransit(place: StructuredPlace, context: ChatContext, isMr: boolean): EngineResult {
  const userLat = context.userLocation?.lat || 18.5204;
  const userLng = context.userLocation?.lng || 73.8567;
  const transit = getPublicTransitRoute(userLat, userLng, place as any);
  const name = isMr && place.name_mr ? place.name_mr : place.name;

  const reply = isMr
    ? `🚌 **[${name}](/places/${place.slug}) साठी सार्वजनिक वाहतूक मार्ग:**\n\n` +
      `• **मार्ग संक्षेप:** ${transit.summaryMr}\n` +
      (transit.nearestMetro ? `• 🚇 **नजीकचे मेट्रो स्टेशन:** ${transit.nearestMetro.stationNameMr} (~${transit.nearestMetro.distanceKm} किमी)\n` : '') +
      (transit.nearestBus ? `• 🚌 **नजीकचा बस थांबा:** ${transit.nearestBus.stopNameMr} (बसेस: **${transit.nearestBus.routeNumbers.join(', ')}**)\n` : '') +
      `• ⏱️ **अंदाजे वेळ व तिकीट:** ~${transit.estimatedMinutes} मिनिटे | ₹${transit.estimatedCostInr}\n\n` +
      `💡 **टीप:** पुणे मेट्रोसाठी **+91 94201 01990** वर व्हॉट्सअॅप मेसेज पाठवून तिकीट काढू शकता.`
    : `🚌 **Public Transit Directions to [${name}](/places/${place.slug}):**\n\n` +
      `• **Transit Summary:** ${transit.summaryEn}\n` +
      (transit.nearestMetro ? `• 🚇 **Nearest Metro Station:** ${transit.nearestMetro.stationNameEn} (~${transit.nearestMetro.distanceKm} km)\n` : '') +
      (transit.nearestBus ? `• 🚌 **Nearest Bus Stop:** ${transit.nearestBus.stopNameEn} (Routes: **${transit.nearestBus.routeNumbers.join(', ')}**)\n` : '') +
      `• ⏱️ **Estimated Travel Time & Fare:** ~${transit.estimatedMinutes} mins | Approx ₹${transit.estimatedCostInr}\n\n` +
      `💡 **Tip:** For Pune Metro tickets, message "Hi" on WhatsApp to **+91 94201 01990**.`;

  return {
    handled: true,
    reply,
    places: [place],
    transit,
    suggestions: isMr
      ? [`${place.name_mr || place.name} प्रवेश शुल्क किती?`, `${place.name_mr || place.name} ची वेळ काय आहे?`, 'सहल नियोजन']
      : [`Entry fee for ${place.name}`, `Timings for ${place.name}`, 'Plan 4-Hour Trip'],
  };
}

function formatPlaceHistory(place: StructuredPlace, isMr: boolean): EngineResult {
  const name = isMr && place.name_mr ? place.name_mr : place.name;
  const desc = isMr && place.description_mr ? place.description_mr : place.description;

  const reply = isMr
    ? `🏛️ **[${name}](/places/${place.slug}) चा ऐतिहासिक वारसा:**\n\n${desc}\n\nपत्ता: ${place.address_mr || place.address || 'पुणे, महाराष्ट्र'}`
    : `🏛️ **Historical Overview of [${name}](/places/${place.slug}):**\n\n${desc}\n\nLocation: ${place.address || 'Pune, Maharashtra'}`;

  return {
    handled: true,
    reply,
    places: [place],
    suggestions: isMr
      ? [`${place.name_mr || place.name} प्रवेश शुल्क?`, `${place.name_mr || place.name} कसे जावे?`, 'जवळची इतर ठिकाणे']
      : [`Entry fee for ${place.name}`, `How to reach ${place.name}`, `Places near ${place.name}`],
  };
}

function formatPlaceOverview(place: StructuredPlace, isMr: boolean): EngineResult {
  const name = isMr && place.name_mr ? place.name_mr : place.name;
  const desc = isMr && place.description_mr ? place.description_mr : place.description;
  const duration = place.recommended_duration_minutes ? Math.round(place.recommended_duration_minutes / 60 * 10) / 10 : 1.5;

  const feeStatus = place.fee_status === 'free'
    ? isMr ? 'मोफत प्रवेश (₹0)' : 'Free Entry (₹0)'
    : place.entry_fee ? `₹${place.entry_fee}` : isMr ? 'सार्वजनिक दर' : 'Regular Admission';

  const reply = isMr
    ? `🚩 **[${name}](/places/${place.slug})**\n\n` +
      `${desc}\n\n` +
      `• 🎟️ **प्रवेश शुल्क:** ${feeStatus}\n` +
      `• ⏳ **भेट कालावधी:** ~${duration} तास\n` +
      `• 📍 **पत्ता:** ${place.address_mr || place.address || 'पुणे'}\n\n` +
      `सविस्तर माहिती व थेट नकाशासाठी खालील 'Details' बटनावर क्लिक करा.`
    : `🚩 **[${name}](/places/${place.slug})**\n\n` +
      `${desc}\n\n` +
      `• 🎟️ **Entry Fee:** ${feeStatus}\n` +
      `• ⏳ **Visit Duration:** ~${duration} hrs\n` +
      `• 📍 **Address:** ${place.address || 'Pune, Maharashtra'}\n\n` +
      `Click 'Details' below to view high-resolution photos and interactive maps.`;

  return {
    handled: true,
    reply,
    places: [place],
    suggestions: isMr
      ? [`${place.name_mr || place.name} कसे जावे?`, `${place.name_mr || place.name} ची वेळ काय आहे?`, `जवळची इतर ठिकाणे`]
      : [`How to reach ${place.name}`, `Timings for ${place.name}`, `Places near ${place.name}`],
  };
}

function formatCategoryRecommendations(categoryKey: string, heading: string, isMr: boolean): EngineResult {
  const matches = ALL_STRUCTURED_PLACES.filter(
    (p) => p.category_slug === categoryKey || p.category === categoryKey
  ).slice(0, 4);

  if (matches.length === 0) {
    return {
      handled: true,
      reply: isMr ? 'या श्रेणीत सध्या ठिकाणे उपलब्ध नाहीत.' : 'No places found in this category.',
    };
  }

  const list = matches
    .map((p, i) => {
      const name = isMr && p.name_mr ? p.name_mr : p.name;
      const duration = p.recommended_duration_minutes ? `~${Math.round(p.recommended_duration_minutes / 60)} hr` : '';
      const fee = p.fee_status === 'free' ? (isMr ? 'मोफत' : 'Free') : p.entry_fee ? `₹${p.entry_fee}` : '';
      return `${i + 1}. **[${name}](/places/${p.slug})** — ${duration}${fee ? ` • ${fee}` : ''}`;
    })
    .join('\n');

  const reply = isMr
    ? `**${heading}**\n\n${list}\n\nयापैकी कोणत्याही ठिकाणाचे सविस्तर वेळापत्रक किंवा मार्ग पाहू शकता:`
    : `**${heading}**\n\n${list}\n\nSelect any card below to explore verified timings, entry fees, and transit routes:`;

  return {
    handled: true,
    reply,
    places: matches,
    suggestions: isMr
      ? [`${matches[0].name_mr || matches[0].name} कसे जावे?`, '४ तासांची सहल आखा', 'माझ्याजवळील ठिकाणे']
      : [`How to reach ${matches[0].name}`, 'Plan 4-Hour Trip', 'Places near me'],
  };
}

function formatFamilyRecommendations(isMr: boolean): EngineResult {
  const familySlugs = [
    'rajiv-gandhi-zoological-park-katraj',
    'okayama-friendship-garden',
    'sarasbaug',
    'raja-dinkar-kelkar-museum',
  ];
  const places = familySlugs.map((s) => PLACES_MAP.get(s)).filter(Boolean) as StructuredPlace[];

  const list = places
    .map((p, i) => {
      const name = isMr && p.name_mr ? p.name_mr : p.name;
      return `${i + 1}. **[${name}](/places/${p.slug})**`;
    })
    .join('\n');

  const reply = isMr
    ? `👨‍👩‍👧‍👦 **कुटुंबासह आणि मुलांसोबत भेट देण्यासाठी उत्तम ठिकाणे:**\n\n${list}\n\nही सर्व ठिकाणे लहान मुले व कुटुंबासाठी सुरक्षित आणि प्रशस्त आहेत.`
    : `👨‍👩‍👧‍👦 **Best Family-Friendly Destinations in Pune:**\n\n${list}\n\nThese destinations offer spacious park grounds, animal exhibits, safe walking trails, and family amenities.`;

  return {
    handled: true,
    reply,
    places,
    suggestions: isMr
      ? ['कात्रज प्राणीसंग्रहालय प्रवेश शुल्क', 'पु ल देशपांडे उद्यान वेळ', '४ तासांचे नियोजन']
      : ['Katraj Zoo entry fee', 'Okayama Garden timings', 'Plan 4-Hour Trip'],
  };
}

function formatShortVisitRecommendations(isMr: boolean): EngineResult {
  const shortPlaces = ALL_STRUCTURED_PLACES.filter(
    (p) => p.recommended_duration_minutes && p.recommended_duration_minutes <= 60
  ).slice(0, 4);

  const list = shortPlaces
    .map((p, i) => `${i + 1}. **[${isMr && p.name_mr ? p.name_mr : p.name}](/places/${p.slug})** (~४५-६० मिनिटे)`)
    .join('\n');

  const reply = isMr
    ? `⚡ **कमी वेळेत (१ तासाच्या आत) भेट देण्यासारखी ठिकाणे:**\n\n${list}\n\nही ठिकाणे शहराच्या मध्यवर्ती भागात असून त्वरित दर्शन किंवा पाहणीसाठी योग्य आहेत.`
    : `⚡ **Best Places for a Short Visit (Under 1 Hour):**\n\n${list}\n\nIdeal for quick cultural stops in central Pune with minimal walking time.`;

  return {
    handled: true,
    reply,
    places: shortPlaces,
    suggestions: isMr ? ['शनिवार वाडा', 'लाल महाल मार्ग', 'सहल नियोजन'] : ['Shaniwar Wada', 'Lal Mahal transit', 'Plan My Trip'],
  };
}

function formatNearbyPlaces(context: ChatContext, isMr: boolean): EngineResult {
  const userLat = context.userLocation?.lat || 18.5204;
  const userLng = context.userLocation?.lng || 73.8567;
  const locName = context.userLocalityName || (isMr ? 'मध्यवर्ती पुणे (शनिवार वाडा)' : 'Central Pune (Shaniwar Wada)');

  const sorted = [...ALL_STRUCTURED_PLACES]
    .map((p) => ({
      ...p,
      distanceKm: calculateDistanceKm(userLat, userLng, p.latitude, p.longitude),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3);

  const list = sorted
    .map((p, i) => {
      const name = isMr && p.name_mr ? p.name_mr : p.name;
      return `${i + 1}. **[${name}](/places/${p.slug})** — **${p.distanceKm} km** away`;
    })
    .join('\n');

  const reply = isMr
    ? `📍 **तुमच्या स्थानावरून (${locName}) सर्वात जवळची ठिकाणे:**\n\n${list}\n\nयापैकी कोणत्याही ठिकाणासाठी थेट बस अथवा मेट्रो मार्ग हवा असल्यास विचारू शकता.`
    : `📍 **Closest Attractions to Your Location (${locName}):**\n\n${list}\n\nAsk for bus or Metro routes to any of these landmarks!`;

  return {
    handled: true,
    reply,
    places: sorted,
    suggestions: isMr
      ? [`${sorted[0].name_mr || sorted[0].name} कसे जावे?`, 'पुणे मेट्रो मार्ग', '१ दिवसाची सहल']
      : [`How to reach ${sorted[0].name}`, 'Pune Metro routes', 'Plan 1-Day Trip'],
  };
}

function generateLocalItinerary(hours: number, isMr: boolean): EngineResult {
  let selectedSlugs: string[] = [];
  let title = '';
  let titleMr = '';

  if (hours <= 3) {
    selectedSlugs = ['shaniwar-wada', 'lal-mahal', 'shreemant-dagdusheth-halwai-ganpati'];
    title = '3-Hour Central Heritage Walking Trail';
    titleMr = '३ तासांची मध्यवर्ती ऐतिहासिक पायी भ्रमंती';
  } else if (hours <= 5) {
    selectedSlugs = ['shaniwar-wada', 'lal-mahal', 'shreemant-dagdusheth-halwai-ganpati', 'vishrambaug-wada', 'pataleshwar-cave-temple'];
    title = '5-Hour Peshwa Legacy & Wada Trail';
    titleMr = '५ तासांची पेशवेकालीन वास्तू व लेणी सफर';
  } else {
    selectedSlugs = ['sinhagad-fort', 'khadakwasla-dam', 'shaniwar-wada', 'shreemant-dagdusheth-halwai-ganpati', 'sarasbaug'];
    title = `${hours}-Hour Full Day Pune Explorer`;
    titleMr = `${hours} तासांचे परिपूर्ण पुणे दर्शन`;
  }

  const places = selectedSlugs.map((s) => PLACES_MAP.get(s)).filter(Boolean) as StructuredPlace[];

  const stopsList = places
    .map((p, i) => {
      const name = isMr && p.name_mr ? p.name_mr : p.name;
      const duration = p.recommended_duration_minutes ? `~${Math.round(p.recommended_duration_minutes / 60 * 10) / 10} hr` : '1 hr';
      return `${i + 1}. **[${name}](/places/${p.slug})** (${duration})`;
    })
    .join('\n');

  const reply = isMr
    ? `🗺️ **${titleMr} (${hours} तास)**\n\n` +
      `${stopsList}\n\n` +
      `💡 **सहल नियोजक (Trip Planner) एकत्रीकरण:**\n` +
      `हा मार्ग थेट आमच्या परस्परसंवादी ट्रिप प्लॅनरमध्ये उघडून सविस्तर मेट्रो व बस वेळेसह पाहण्यासाठी खालील **'Plan this trip →'** बटण दाबा.`
    : `🗺️ **${title} (${hours} Hours)**\n\n` +
      `${stopsList}\n\n` +
      `💡 **Trip Planner Integration:**\n` +
      `Click **'Plan this trip →'** below to load this exact route into the interactive Trip Planner with live Metro and PMPML transit schedules!`;

  return {
    handled: true,
    reply,
    places,
    planPayload: {
      hours,
      title: isMr ? titleMr : title,
      slugs: selectedSlugs,
    },
    suggestions: isMr
      ? ['सिंहगड किल्ला बस वेळापत्रक', 'शनिवार वाडा प्रवेश शुल्क', 'माझ्याजवळील ठिकाणे']
      : ['Sinhagad bus timetable', 'Shaniwar Wada entry fee', 'Places near me'],
  };
}

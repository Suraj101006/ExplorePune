/**
 * Explore Pune - AI-Powered Personalized Destination Recommendation Engine (PART 7 & GEO/AEO)
 * Recommends curated Pune destinations based on traveler intent, spatial proximity, available time,
 * budget, travel modes, companion context, weather suitability, and transparent match explanations.
 */

import { ALL_STRUCTURED_PLACES, StructuredPlace } from './chatKnowledgeEngine';
import { calculateDistanceKm } from './publicTransit';

export interface LocationTarget {
  lat: number;
  lng: number;
  name?: string;
}

export interface RecommendationCriteria {
  startingLocation?: LocationTarget;
  availableMinutes?: number; // e.g. 120 (2 hours)
  budgetInr?: number; // e.g. 0 (free-only) or max ticket allowance
  interests?: string[]; // e.g. ['heritage', 'forts', 'temples', 'museums', 'nature', 'food']
  travelMode?: 'walking' | 'cycling' | 'driving' | 'public_transit';
  companionType?: 'solo' | 'family' | 'couple' | 'friends';
  accessibilityRequired?: boolean;
  excludePlaceIds?: string[];
  savedPlaceIds?: string[];
  weatherCondition?: {
    isRainy?: boolean;
    tempC?: number;
    heatIndex?: 'cool' | 'moderate' | 'hot';
  };
  currentHourOfDay?: number; // 0 - 23
  maxResults?: number;
  lang?: 'en' | 'mr';
}

export interface DestinationRecommendation {
  place: StructuredPlace;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  distanceKm: number;
  travelMinutes: number;
  visitDurationMinutes: number;
  estimatedCostInr: number;
  nearbyFood?: string;
  isWeatherSuitable: boolean;
  isCurrentlyOpen: boolean;
  orderInRoute: number;
}

export interface RecommendationResult {
  criteriaUsed: {
    originName: string;
    availableMinutes: number;
    travelMode: string;
    budgetInr: number | null;
    interests: string[];
  };
  totalEstimatedMinutes: number;
  totalEstimatedCostInr: number;
  recommendations: DestinationRecommendation[];
  foodSuggestions: Array<{ name: string; landmark: string; specialty: string }>;
  suggestedTimeline: Array<{
    placeName: string;
    slug: string;
    arrivalTimeMinutes: number;
    stayMinutes: number;
    action: string;
  }>;
  summaryExplanation: string;
}

// Known Pune hubs and reference coordinates
export const PUNE_REFERENCE_HUBS: Record<string, { lat: number; lng: number; nameEn: string; nameMr: string }> = {
  'fc-road': { lat: 18.5283, lng: 73.8407, nameEn: 'Fergusson College Road (Deccan)', nameMr: 'एफ. सी. रस्ता (डेक्कन)' },
  'deccan': { lat: 18.5175, lng: 73.8423, nameEn: 'Deccan Gymkhana', nameMr: 'डेक्कन जिमखाना' },
  'shivajinagar': { lat: 18.5322, lng: 73.8518, nameEn: 'Shivajinagar Station', nameMr: 'शिवाजीनगर रेल्वे स्थानक' },
  'pune-station': { lat: 18.5284, lng: 73.8739, nameEn: 'Pune Railway Station', nameMr: 'पुणे रेल्वे स्टेशन' },
  'swargate': { lat: 18.5018, lng: 73.8576, nameEn: 'Swargate Hub', nameMr: 'स्वारगेट' },
  'kothrud': { lat: 18.5074, lng: 73.8077, nameEn: 'Kothrud (Paud Phata)', nameMr: 'कोथरूड' },
  'camp': { lat: 18.5158, lng: 73.8785, nameEn: 'Pune Camp (MG Road)', nameMr: 'पुणे कॅम्प (एम. जी. रोड)' },
  'hadapsar': { lat: 18.5089, lng: 73.9259, nameEn: 'Hadapsar Gadital', nameMr: 'हडपसर गाडीतळ' },
  'aundh': { lat: 18.5602, lng: 73.8077, nameEn: 'Aundh / Parihar Chowk', nameMr: 'औंध / परिहार चौक' },
  'viman-nagar': { lat: 18.5679, lng: 73.9143, nameEn: 'Viman Nagar / Airport', nameMr: 'विमान नगर / विमानतळ' },
  'katraj': { lat: 18.4575, lng: 73.8587, nameEn: 'Katraj Snake Park / Zoo', nameMr: 'कात्रज' },
};

// Curated authentic culinary heritage pitstops linked with Pune localities
export const PUNE_CULINARY_PITSTOPS: Array<{
  name: string;
  nameMr: string;
  landmark: string;
  specialty: string;
  specialtyMr: string;
  lat: number;
  lng: number;
  vicinitySlug: string;
}> = [
  {
    name: 'Bedekar Tea Stall & Misal',
    nameMr: 'बेडेकर टी स्टॉल व मिसळ',
    landmark: 'Narayan Peth, near Shaniwar Wada',
    specialty: 'Puneri Misal with brown bread (since 1948)',
    specialtyMr: 'पुणेरी चवदार मिसळ व ब्रेड',
    lat: 18.5186,
    lng: 73.8514,
    vicinitySlug: 'shaniwar-wada',
  },
  {
    name: 'Vaishali Restaurant',
    nameMr: 'वैशाली उपहारगृह',
    landmark: 'Fergusson College (FC) Road',
    specialty: 'Filter coffee, Mysore Masala Dosa, Sev Potato Dahi Puri',
    specialtyMr: 'फिल्टर कॉफी, डोसा व चाट',
    lat: 18.5235,
    lng: 73.8415,
    vicinitySlug: 'fergusson-college-heritage',
  },
  {
    name: 'Rupali Restaurant',
    nameMr: 'रूपाली उपहारगृह',
    landmark: 'Fergusson College (FC) Road',
    specialty: 'Classic South Indian breakfast and open-air garden seating',
    specialtyMr: 'पारंपरिक नाश्ता आणि खुले वातावरण',
    lat: 18.5222,
    lng: 73.8418,
    vicinitySlug: 'fergusson-college-heritage',
  },
  {
    name: 'Chitale Bandhu Mithaiwale',
    nameMr: 'चितळे बंधू मिठाईवाले',
    landmark: 'Bajirao Road, Sadashiv Peth',
    specialty: 'Original Puneri Bakarwadi and Mango Barfi',
    specialtyMr: 'प्रसिद्ध बाकरवडी व मँगो बर्फी',
    lat: 18.5132,
    lng: 73.8524,
    vicinitySlug: 'vishrambaug-wada',
  },
  {
    name: 'Kayani Bakery',
    nameMr: 'कयानी बेकरी',
    landmark: 'East Street, Camp',
    specialty: 'Legendary Shrewsbury Biscuits and Mawa Cake (since 1955)',
    specialtyMr: 'श्रुसबरी बिस्किटे व मावा केक',
    lat: 18.5152,
    lng: 73.8778,
    vicinitySlug: 'kayani-bakery-camp',
  },
  {
    name: 'Sujata Mastani',
    nameMr: 'सुजाता मस्तानी',
    landmark: 'Sadashiv Peth & Multiple outlets',
    specialty: 'Signature Mango & Kesar Pista Mastani thick milkshake (since 1968)',
    specialtyMr: 'पुण्याची खास मँगो मस्तानी',
    lat: 18.5147,
    lng: 73.8542,
    vicinitySlug: 'sujata-mastani-heritage',
  },
  {
    name: 'Katakirr Misal',
    nameMr: 'काटाकिर्र्र मिसळ',
    landmark: 'Karve Road / Deccan',
    specialty: 'Spicy Kolhapuri-style Tari Misal with Matki',
    specialtyMr: 'झणझणीत कट मिसळ',
    lat: 18.5085,
    lng: 73.8342,
    vicinitySlug: 'nal-stop',
  },
];

/**
 * Calculates transit time between two coordinates based on mode.
 */
export function estimateTransitMinutes(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  mode: 'walking' | 'cycling' | 'driving' | 'public_transit' = 'driving'
): { distanceKm: number; durationMinutes: number } {
  const dist = calculateDistanceKm(fromLat, fromLng, toLat, toLng);
  let duration = 0;

  switch (mode) {
    case 'walking':
      duration = Math.ceil(dist * 13.5); // ~4.5 km/h
      break;
    case 'cycling':
      duration = Math.ceil(dist * 5.0) + 2; // ~12 km/h
      break;
    case 'public_transit':
      // Average 15 km/h + 8 min wait for bus/metro connection
      duration = Math.ceil(dist * 4.0) + 8;
      break;
    case 'driving':
    default:
      // City traffic ~22 km/h
      duration = Math.ceil(dist * 2.8) + 4;
      break;
  }

  return { distanceKm: Math.round(dist * 10) / 10, durationMinutes: Math.max(3, duration) };
}

/**
 * Checks if a place is open given its hours and an hour-of-day (0-23).
 */
export function isPlaceOpenAtHour(place: StructuredPlace, hourOfDay: number): boolean {
  if (!place.place_hours || place.place_hours.length === 0) return true;
  const h = place.place_hours[0];
  if (h.is_closed) return false;

  const parseHour = (timeStr?: string, defaultHour = 9): number => {
    if (!timeStr) return defaultHour;
    const match = timeStr.match(/(\d+):?(\d+)?\s*(AM|PM)/i);
    if (!match) return defaultHour;
    let val = parseInt(match[1]);
    const isPm = match[3].toUpperCase() === 'PM';
    if (isPm && val < 12) val += 12;
    if (!isPm && val === 12) val = 0;
    return val;
  };

  const opensAt = parseHour(h.opens_at, 6);
  const closesAt = parseHour(h.closes_at, 18);

  return hourOfDay >= opensAt && hourOfDay < closesAt;
}

/**
 * Core Recommendation Engine:
 * Scores, filters, explains, and orders destinations based on constraints.
 */
export function recommendDestinations(
  criteria: RecommendationCriteria,
  placesPool: StructuredPlace[] = ALL_STRUCTURED_PLACES
): RecommendationResult {
  const isMr = criteria.lang === 'mr';
  const availableMinutes = criteria.availableMinutes || 180;
  const travelMode = criteria.travelMode || 'driving';
  const budgetInr = criteria.budgetInr !== undefined ? criteria.budgetInr : null;
  const requestedInterests = (criteria.interests || []).map((i) => i.toLowerCase().trim());
  const maxResults = criteria.maxResults || 4;

  // Resolve starting origin coordinates
  let origin = criteria.startingLocation;
  if (!origin || (!origin.lat && !origin.lng)) {
    origin = {
      lat: PUNE_REFERENCE_HUBS['fc-road'].lat,
      lng: PUNE_REFERENCE_HUBS['fc-road'].lng,
      name: PUNE_REFERENCE_HUBS['fc-road'].nameEn,
    };
  }

  const currentHour = criteria.currentHourOfDay !== undefined ? criteria.currentHourOfDay : new Date().getHours();

  // Score candidate destinations
  const candidateScores: DestinationRecommendation[] = [];

  for (const place of placesPool) {
    if (criteria.excludePlaceIds?.includes(place.id) || criteria.excludePlaceIds?.includes(place.slug)) {
      continue;
    }

    // Proximity and travel calculation
    const transit = estimateTransitMinutes(origin.lat, origin.lng, place.latitude, place.longitude, travelMode);
    const visitDuration = place.recommended_duration_minutes || 60;

    // Hard constraint: If travel + visit exceeds available budget by > 20%, skip
    if (transit.durationMinutes + visitDuration > availableMinutes * 1.2) {
      continue;
    }

    // Budget constraint check
    const cost = place.fee_status === 'free' || place.entry_fee === 0 ? 0 : place.entry_fee || 0;
    if (budgetInr !== null && cost > budgetInr) {
      continue;
    }

    // Weather constraint: if rainy, penalize trekking forts and waterfalls
    let isWeatherSuitable = true;
    if (criteria.weatherCondition?.isRainy) {
      if (place.category_slug === 'forts' && transit.distanceKm > 25) {
        isWeatherSuitable = false;
      }
    }

    // Accessibility constraint
    if (criteria.accessibilityRequired && (place.category_slug === 'forts' || place.category === 'forts')) {
      continue; // Forts usually require rugged hill steps
    }

    const isOpenNow = isPlaceOpenAtHour(place, currentHour);

    // Calculate match score (0 - 100) and build transparent match reasons
    let score = 50;
    const reasons: string[] = [];

    // 1. Proximity score
    if (transit.distanceKm <= 3.0) {
      score += 25;
      reasons.push(
        isMr
          ? `${origin.name || 'सुरुवातीच्या ठिकाणा'}पासून फक्त ${transit.distanceKm} किमी अंतरावर (~${transit.durationMinutes} मिनिटे)`
          : `Just ${transit.distanceKm} km from ${origin.name || 'origin'} (~${transit.durationMinutes} min ${travelMode})`
      );
    } else if (transit.distanceKm <= 10.0) {
      score += 15;
      reasons.push(
        isMr
          ? `${transit.distanceKm} किमी अंतरावर सहज पोहोचता येण्याजोगे`
          : `Easily reachable at ${transit.distanceKm} km away`
      );
    } else {
      score += 5;
    }

    // 2. Interest matching
    const placeCat = (place.category_slug || place.category || '').toLowerCase();
    const matchesInterest = requestedInterests.some(
      (req) =>
        placeCat.includes(req) ||
        place.name.toLowerCase().includes(req) ||
        (place.description && place.description.toLowerCase().includes(req))
    );

    if (matchesInterest) {
      score += 25;
      reasons.push(
        isMr
          ? `आपल्या आवडीनुसार (${requestedInterests.join(', ')}) वारसा स्थळ`
          : `Directly matches your interest in ${requestedInterests.join(', ')}`
      );
    }

    // 3. Budget matching
    if (cost === 0) {
      score += 10;
      reasons.push(isMr ? 'विनामूल्य प्रवेश (सर्व पर्यटकांसाठी ₹०)' : 'Free admission (₹0 ticket cost)');
    } else if (budgetInr !== null && cost <= budgetInr) {
      score += 10;
      reasons.push(
        isMr
          ? `प्रवेश शुल्क ₹${cost}, आपल्या ₹${budgetInr} बजेटमध्ये समाविष्ट`
          : `Entry fee ₹${cost} fits comfortably in your ₹${budgetInr} budget`
      );
    }

    // 4. Time fit
    const totalLegTime = transit.durationMinutes + visitDuration;
    if (totalLegTime <= availableMinutes) {
      score += 10;
      reasons.push(
        isMr
          ? `भेट कालावधी (~${Math.round(visitDuration / 60 * 10) / 10} तास) आपल्या ${availableMinutes} मिनिटांच्या वेळेत योग्य बसतो`
          : `Estimated stay (~${Math.round(visitDuration / 60 * 10) / 10}h) fits perfectly into your ${availableMinutes} min schedule`
      );
    }

    // 5. Open status
    if (isOpenNow) {
      score += 5;
      reasons.push(isMr ? 'सध्या पर्यटनासाठी खुले आहे' : 'Currently open for visitor entry');
    }

    // 6. Wishlist prioritization
    if (criteria.savedPlaceIds?.includes(place.id) || criteria.savedPlaceIds?.includes(place.slug)) {
      score += 15;
      reasons.push(isMr ? 'आपल्या सेव्ह केलेल्या आवडत्या यादीत समाविष्ट' : 'Saved in your personal wishlist');
    }

    // 7. Companion bonus
    if (criteria.companionType === 'family' && place.is_family_friendly) {
      score += 10;
      reasons.push(isMr ? 'कुटुंब आणि लहान मुलांसाठी सुरक्षित व सोयीस्कर' : 'Ideal for family visits & child-friendly');
    }

    // Cap score at 100
    const finalScore = Math.min(100, Math.max(10, score));

    // Find nearby food pitstop
    const nearbyPitstop = PUNE_CULINARY_PITSTOPS.find(
      (f) => calculateDistanceKm(place.latitude, place.longitude, f.lat, f.lng) <= 2.5
    );

    candidateScores.push({
      place,
      matchScore: finalScore,
      matchReasons: reasons,
      distanceKm: transit.distanceKm,
      travelMinutes: transit.durationMinutes,
      visitDurationMinutes: visitDuration,
      estimatedCostInr: cost,
      nearbyFood: nearbyPitstop ? `${nearbyPitstop.name} (${nearbyPitstop.specialty})` : undefined,
      isWeatherSuitable,
      isCurrentlyOpen: isOpenNow,
      orderInRoute: 0,
    });
  }

  // Sort by match score desc then distance asc
  candidateScores.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return a.distanceKm - b.distanceKm;
  });

  const timeBasedStops = availableMinutes <= 90 ? 1 : availableMinutes <= 150 ? 2 : availableMinutes <= 240 ? 3 : 4;
  const targetStopsCount = criteria.maxResults || timeBasedStops;

  const selectedRecommendations = candidateScores.slice(0, targetStopsCount);

  // Sequence the route in realistic travel order
  let accumulatedMinutes = 0;
  let totalCost = 0;
  const timeline: Array<{
    placeName: string;
    slug: string;
    arrivalTimeMinutes: number;
    stayMinutes: number;
    action: string;
  }> = [];

  selectedRecommendations.forEach((rec, idx) => {
    rec.orderInRoute = idx + 1;
    accumulatedMinutes += rec.travelMinutes;
    timeline.push({
      placeName: rec.place.name,
      slug: rec.place.slug,
      arrivalTimeMinutes: accumulatedMinutes,
      stayMinutes: rec.visitDurationMinutes,
      action: isMr ? `भेट व दर्शन (~${rec.visitDurationMinutes} मिनिटे)` : `Explore & Sightsee (~${rec.visitDurationMinutes}m)`,
    });
    accumulatedMinutes += rec.visitDurationMinutes;
    totalCost += rec.estimatedCostInr;
  });

  // Extract food options near the selected places
  const relevantFood: Array<{ name: string; landmark: string; specialty: string }> = [];
  selectedRecommendations.forEach((rec) => {
    PUNE_CULINARY_PITSTOPS.forEach((food) => {
      const dist = calculateDistanceKm(rec.place.latitude, rec.place.longitude, food.lat, food.lng);
      if (dist <= 2.2 && !relevantFood.some((f) => f.name === food.name)) {
        relevantFood.push({
          name: isMr ? food.nameMr : food.name,
          landmark: food.landmark,
          specialty: isMr ? food.specialtyMr : food.specialty,
        });
      }
    });
  });

  const summary = isMr
    ? `${origin.name || 'सुरुवातीचे स्थान'} येथून ${availableMinutes} मिनिटांच्या वेळेत ${selectedRecommendations.length} उत्कृष्ट वारसा स्थळांची वैयक्तिक शिफारस तयार केली आहे.`
    : `Curated ${selectedRecommendations.length} verified destinations starting from ${origin.name || 'origin'} tailored to your ${availableMinutes}-minute timeframe and interests.`;

  return {
    criteriaUsed: {
      originName: origin.name || 'Pune City',
      availableMinutes,
      travelMode,
      budgetInr,
      interests: requestedInterests,
    },
    totalEstimatedMinutes: accumulatedMinutes,
    totalEstimatedCostInr: totalCost,
    recommendations: selectedRecommendations,
    foodSuggestions: relevantFood.slice(0, 3),
    suggestedTimeline: timeline,
    summaryExplanation: summary,
  };
}

/**
 * Natural Language Query Parser:
 * Translates queries like "I have 2 hours near FC Road, want historical places and food" into structured criteria.
 */
export function parseRecommendationQuery(
  queryText: string,
  userLocation?: { lat: number; lng: number }
): RecommendationCriteria {
  const text = queryText.toLowerCase();

  // 1. Time extraction (e.g. "2 hours", "two hours", "1.5h", "90 mins", "half day")
  let availableMinutes = 180; // default 3h
  if (text.includes('1 hour') || text.includes('one hour') || text.includes('1 hr') || text.includes('1h')) availableMinutes = 60;
  else if (text.includes('2 hour') || text.includes('two hour') || text.includes('2 hr') || text.includes('2h')) availableMinutes = 120;
  else if (text.includes('3 hour') || text.includes('three hour') || text.includes('3 hr') || text.includes('3h')) availableMinutes = 180;
  else if (text.includes('4 hour') || text.includes('four hour') || text.includes('half day')) availableMinutes = 240;
  else if (text.includes('full day') || text.includes('whole day') || text.includes('8 hour')) availableMinutes = 480;

  // 2. Hub / Starting point extraction
  let startingLocation: LocationTarget | undefined = undefined;
  if (text.includes('fc road') || text.includes('fergusson')) {
    startingLocation = PUNE_REFERENCE_HUBS['fc-road'];
  } else if (text.includes('deccan')) {
    startingLocation = PUNE_REFERENCE_HUBS['deccan'];
  } else if (text.includes('shivajinagar')) {
    startingLocation = PUNE_REFERENCE_HUBS['shivajinagar'];
  } else if (text.includes('pune station') || text.includes('railway station')) {
    startingLocation = PUNE_REFERENCE_HUBS['pune-station'];
  } else if (text.includes('swargate')) {
    startingLocation = PUNE_REFERENCE_HUBS['swargate'];
  } else if (text.includes('kothrud')) {
    startingLocation = PUNE_REFERENCE_HUBS['kothrud'];
  } else if (text.includes('camp') || text.includes('mg road')) {
    startingLocation = PUNE_REFERENCE_HUBS['camp'];
  } else if (userLocation) {
    startingLocation = { lat: userLocation.lat, lng: userLocation.lng, name: 'Current GPS Location' };
  }

  // 3. Interests extraction
  const interests: string[] = [];
  if (text.includes('histor') || text.includes('heritage') || text.includes('wada') || text.includes('peshwa')) {
    interests.push('heritage');
  }
  if (text.includes('fort') || text.includes('trek') || text.includes('killa')) {
    interests.push('forts');
  }
  if (text.includes('temple') || text.includes('mandir') || text.includes('ganpati') || text.includes('spiritual')) {
    interests.push('temples');
  }
  if (text.includes('museum') || text.includes('memorial') || text.includes('art')) {
    interests.push('museums');
  }
  if (text.includes('nature') || text.includes('lake') || text.includes('tekdi') || text.includes('garden') || text.includes('park')) {
    interests.push('nature');
  }
  if (text.includes('food') || text.includes('misal') || text.includes('eat') || text.includes('breakfast') || text.includes('bakery')) {
    interests.push('food');
  }

  // 4. Budget extraction
  let budgetInr: number | undefined = undefined;
  if (text.includes('free') || text.includes('no cost') || text.includes('zero')) {
    budgetInr = 0;
  } else if (text.includes('budget') || text.includes('cheap')) {
    budgetInr = 50;
  }

  // 5. Travel mode extraction
  let travelMode: 'walking' | 'cycling' | 'driving' | 'public_transit' = 'driving';
  if (text.includes('walk') || text.includes('on foot')) travelMode = 'walking';
  else if (text.includes('cycle') || text.includes('bicycle')) travelMode = 'cycling';
  else if (text.includes('metro') || text.includes('bus') || text.includes('pmpml') || text.includes('public transit')) travelMode = 'public_transit';

  // 6. Companion type
  let companionType: 'solo' | 'family' | 'couple' | 'friends' = 'solo';
  if (text.includes('family') || text.includes('kids') || text.includes('children')) companionType = 'family';
  else if (text.includes('friends') || text.includes('group')) companionType = 'friends';
  else if (text.includes('couple')) companionType = 'couple';

  return {
    startingLocation,
    availableMinutes,
    budgetInr,
    interests: interests.length > 0 ? interests : ['heritage', 'culture'],
    travelMode,
    companionType,
    lang: text.includes('marathi') || /[\u0900-\u097F]/.test(queryText) ? 'mr' : 'en',
  };
}

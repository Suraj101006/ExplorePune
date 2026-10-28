'use client';

export interface JourneyPlaceStop {
  placeId: string;
  placeSlug: string;
  placeName: string;
  placeNameMr?: string;
  category: string;
  categoryName?: string;
  categoryNameMr?: string;
  image_url?: string;
  description?: string;
  descriptionMr?: string;
  latitude: number;
  longitude: number;
  arrivalTime?: string;
  departureTime?: string;
  visitDurationMinutes?: number;
  isVisited: boolean;
  visitedAt?: string;
  note?: string;
  noteMr?: string;
  order: number;
  photos?: string[];
  elevation?: number;
  address?: string;
  addressMr?: string;
  recommendedDurationMinutes?: number;
  isHistorical?: boolean;
}

export interface DayJourney {
  id: string;
  date: string; // Format: YYYY-MM-DD e.g. '2026-10-20'
  dateLabelEn: string; // e.g. '20 October 2026'
  dateLabelMr: string; // e.g. '२० ऑक्टोबर २०२६'
  title: string;
  titleMr?: string;
  theme?: string;
  themeMr?: string;
  startLocation: string;
  startLocationMr?: string;
  startCoords?: { lat: number; lng: number };
  startTime?: string;
  endTime?: string;
  travelMode: 'public_transit' | 'walking' | 'driving' | 'cycling';
  status: 'active' | 'completed' | 'planned';
  places: JourneyPlaceStop[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  notes?: string;
  coverImage?: string;
}

export interface JourneyStats {
  totalPlacesVisited: number;
  totalJourneys: number;
  totalDistanceKm: number;
  totalAreasExplored: number;
  categoriesExplored: Array<{ category: string; nameEn: string; nameMr: string; count: number }>;
  firstJourneyDate?: string;
  latestJourneyDate?: string;
  mostVisitedCategory?: string;
  completionRate: number;
}

export interface JourneyMilestone {
  id: string;
  badge: string;
  titleEn: string;
  titleMr: string;
  descEn: string;
  descMr: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export const TOTAL_PUNE_PLACES_COUNT = 80;

export interface JourneyActivity {
  id: string;
  userId: string;
  type: 'place_visited' | 'trip_started' | 'trip_completed' | 'milestone_completed' | 'place_saved' | 'journey_created';
  placeId?: string;
  placeName?: string;
  placeNameMr?: string;
  tripId?: string;
  category?: string;
  timestamp: string;
  duration?: number;
  distance?: number;
  metadata?: Record<string, any>;
}

export const STORAGE_KEY_ACTIVITIES = 'explore_pune_journey_activity_v1';

export function recordJourneyActivity(
  activity: Omit<JourneyActivity, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): JourneyActivity {
  const fullActivity: JourneyActivity = {
    id: activity.id || `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: activity.timestamp || new Date().toISOString(),
    ...activity,
  };

  if (typeof window !== 'undefined') {
    try {
      const storageKey = fullActivity.userId ? `${STORAGE_KEY_ACTIVITIES}_${fullActivity.userId}` : STORAGE_KEY_ACTIVITIES;
      const raw = localStorage.getItem(storageKey);
      const list: JourneyActivity[] = raw ? JSON.parse(raw) : [];
      list.unshift(fullActivity);
      if (list.length > 200) list.length = 200;
      localStorage.setItem(storageKey, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('explore-pune-activity-recorded', { detail: fullActivity }));
    } catch (e) {
      console.warn('Failed to record activity in localStorage:', e);
    }
  }

  return fullActivity;
}

export function getJourneyActivities(userId?: string | null): JourneyActivity[] {
  if (typeof window === 'undefined') return [];
  try {
    const storageKey = userId ? `${STORAGE_KEY_ACTIVITIES}_${userId}` : STORAGE_KEY_ACTIVITIES;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load journey activities:', e);
    return [];
  }
}

export interface SpecialJourneyCard {
  id: string;
  type: 'first_discovery' | 'category_explorer' | 'weekend_journey' | 'heritage_trail' | 'pune_pathfinder';
  badge: string;
  titleEn: string;
  titleMr: string;
  subtitleEn: string;
  subtitleMr: string;
  descriptionEn: string;
  descriptionMr: string;
  statsTextEn?: string;
  statsTextMr?: string;
  dateEn?: string;
  dateMr?: string;
  imageUrl?: string;
}

export function generateSpecialJourneyCards(journeys: DayJourney[], stats: JourneyStats): SpecialJourneyCard[] {
  const cards: SpecialJourneyCard[] = [];
  if (!journeys || journeys.length === 0) return cards;

  // 1. First Discovery (if at least 1 place visited)
  const earliestJourney = [...journeys].sort((a, b) => a.date.localeCompare(b.date))[0];
  const firstPlace = earliestJourney?.places.find((p) => p.isVisited) || earliestJourney?.places[0];

  if (firstPlace && stats.totalPlacesVisited >= 1) {
    cards.push({
      id: 'special-first-discovery',
      type: 'first_discovery',
      badge: '🌟',
      titleEn: 'Your First Pune Discovery',
      titleMr: 'पुण्यातील पहिली सफर',
      subtitleEn: `Began at ${firstPlace.placeName}`,
      subtitleMr: `${firstPlace.placeNameMr || firstPlace.placeName} पासून सुरुवात`,
      descriptionEn: `Your exploration journey started on ${earliestJourney.dateLabelEn}. Every great Pune story begins with a single step.`,
      descriptionMr: `तुमची सफर ${earliestJourney.dateLabelMr || earliestJourney.dateLabelEn} रोजी सुरू झाली. प्रत्येक महान पुणे सफरीची सुरुवात एका पावलाने होते.`,
      statsTextEn: '1st Landmark Visited',
      statsTextMr: 'पहिले ऐतिहासिक ठिकाण',
      dateEn: earliestJourney.dateLabelEn,
      dateMr: earliestJourney.dateLabelMr,
      imageUrl: firstPlace.image_url || '/images/places/shaniwar-wada.jpg',
    });
  }

  // 2. Category Explorer: Forts (if >= 2 forts explored)
  const fortsCount = stats.categoriesExplored.find((c) => c.category === 'forts')?.count || 0;
  if (fortsCount >= 2) {
    const fortPlace = journeys.flatMap((j) => j.places).find((p) => p.category === 'forts' && p.isVisited);
    cards.push({
      id: 'special-fort-explorer',
      type: 'category_explorer',
      badge: '⚔️',
      titleEn: 'Sahyadri Fort Explorer',
      titleMr: 'सह्याद्री दुर्गवीर',
      subtitleEn: `You've explored ${fortsCount} forts`,
      subtitleMr: `तुम्ही ${fortsCount} किल्ले अनुभवले आहेत`,
      descriptionEn: 'From Sinhagad to Lohagad, you have walked the stone bastions where Maratha history was forged.',
      descriptionMr: 'सिंहगडापासून लोहगडापर्यंत, मराठेशाहीच्या इतिहासाच्या साक्षीदार असलेल्या तटबंदीवर तुमचे पाऊल पडले.',
      statsTextEn: `${fortsCount} Forts Conquered`,
      statsTextMr: `${fortsCount} किल्ले सर`,
      imageUrl: fortPlace?.image_url || '/images/places/sinhagad-fort.jpg',
    });
  }

  // 3. Weekend Journey: If any journey occurred on Sat/Sun
  const weekendJourney = journeys.find((j) => {
    const day = new Date(j.date).getDay();
    return (day === 0 || day === 6) && j.places.filter((p) => p.isVisited).length >= 2;
  });
  if (weekendJourney) {
    const visitedStops = weekendJourney.places.filter((p) => p.isVisited);
    cards.push({
      id: 'special-weekend-journey',
      type: 'weekend_journey',
      badge: '☕',
      titleEn: 'Weekend Exploration',
      titleMr: 'वीकेंड सफर',
      subtitleEn: `${visitedStops.length} places explored this weekend`,
      subtitleMr: `या आठवड्याच्या शेवटी ${visitedStops.length} ठिकाणांची सफर`,
      descriptionEn: `Turned leisure time into authentic exploration across ${weekendJourney.title}.`,
      descriptionMr: `सुट्टीच्या दिवसाचे रुपांतर एका अविस्मरणीय पुणे भ्रमंतीत केले.`,
      statsTextEn: `${weekendJourney.totalDistanceKm || 12} km Travelled`,
      statsTextMr: `${weekendJourney.totalDistanceKm || 12} किमी प्रवास`,
      dateEn: weekendJourney.dateLabelEn,
      dateMr: weekendJourney.dateLabelMr,
      imageUrl: visitedStops[0]?.image_url || '/images/places/fc-road.jpg',
    });
  }

  // 4. Heritage Trail: If >= 3 heritage spots visited
  const heritageCount = stats.categoriesExplored.find((c) => c.category === 'heritage')?.count || 0;
  if (heritageCount >= 3) {
    const heritagePlace = journeys.flatMap((j) => j.places).find((p) => p.category === 'heritage' && p.isVisited);
    cards.push({
      id: 'special-heritage-trail',
      type: 'heritage_trail',
      badge: '🏛️',
      titleEn: "Pune's Living Heritage",
      titleMr: 'पुण्याचा जिवंत वारसा',
      subtitleEn: "You've discovered Pune's history",
      subtitleMr: 'पुण्याचा गौरवशाली इतिहास अनुभवला',
      descriptionEn: 'Walking through historic wadas, ancient rock-cut caves, and majestic stone gates of the old city.',
      descriptionMr: 'ऐतिहासिक वाडे, प्राचीन लेणी आणि जुन्या पेठांमधील दगडी प्रवेशद्वारांची ऐतिहासिक सफर.',
      statsTextEn: `${heritageCount} Heritage Sites`,
      statsTextMr: `${heritageCount} ऐतिहासिक वास्तू`,
      imageUrl: heritagePlace?.image_url || '/images/places/shaniwar-wada.jpg',
    });
  }

  // 5. Pune Pathfinder: If categories explored >= 4
  if (stats.categoriesExplored.length >= 4) {
    cards.push({
      id: 'special-pune-pathfinder',
      type: 'pune_pathfinder',
      badge: '🧭',
      titleEn: 'Pune Pathfinder',
      titleMr: 'पुणे मार्गदर्शक',
      subtitleEn: `Explored across ${stats.categoriesExplored.length} diverse categories`,
      subtitleMr: `${stats.categoriesExplored.length} विविध पर्यटन प्रकार अनुभवले`,
      descriptionEn: 'You balance forts, temples, nature retreats, food hubs, and quiet meditation sanctuaries.',
      descriptionMr: 'किल्ले, मंदिरे, निसर्ग, खाद्यसंस्कृती आणि शांत उद्यानांचा समतोल अनुभव.',
      statsTextEn: `${stats.totalPlacesVisited} Total Landmarks`,
      statsTextMr: `${stats.totalPlacesVisited} एकूण प्रेक्षणीय स्थळे`,
      imageUrl: '/images/places/aga-khan-palace.jpg',
    });
  }

  return cards;
}

export interface JourneyStoryCardItem {
  id: string;
  placeId: string;
  placeName: string;
  placeNameMr?: string;
  category: string;
  categoryName?: string;
  categoryNameMr?: string;
  imageUrl: string;
  dateEn: string;
  dateMr: string;
  rawDate: string;
  timeString: string;
  quoteEn: string;
  quoteMr: string;
  journeyTitleEn: string;
  journeyTitleMr?: string;
  journeyId: string;
}

const POETIC_QUOTES: Record<string, { en: string; mr: string }> = {
  'sinhagad-fort': {
    en: '“A morning above Pune, where clouds meet the Sahyadri ramparts.”',
    mr: '“सह्याद्रीच्या कड्यांवर धुक्याची चादर आणि असीम पराक्रमाची साक्ष.”',
  },
  'shaniwar-wada': {
    en: '“Echoes of the Peshwas within the towering teak Dilli Darwaza.”',
    mr: '“भव्य दिल्ली दरवाजा आणि पेशवेकालीन पराक्रमाच्या जिवंत आठवणी.”',
  },
  'lal-mahal': {
    en: '“Where Chhatrapati Shivaji Maharaj spent his formative childhood.”',
    mr: '“छत्रपती शिवरायांच्या बालपणीच्या पाऊलखुणा आणि जिजाऊंचे संस्कार.”',
  },
  'shreemant-dagdusheth-halwai-ganpati': {
    en: '“Golden benevolence and peaceful darshan in the heart of Pune.”',
    mr: '“पुण्याच्या हृदयात मंगलमूर्तीचे मनःशांती देणारे सुवर्ण दर्शन.”',
  },
  'aga-khan-palace': {
    en: '“Italian arches embracing quiet memories of India’s freedom dawn.”',
    mr: '“इटालियन कमानी आणि स्वातंत्र्यलढ्याच्या मूक आठवणींचे शांत उद्यान.”',
  },
  'pataleshwar-cave-temple': {
    en: '“8th-century basalt sanctum carved directly from the living rock.”',
    mr: '“८व्या शतकातील अखंड काळ्या पाषाणात कोरलेले गूढ व शांत शिवमंदिर.”',
  },
  'lohagad-fort': {
    en: '“The Iron Fort standing vigilant between mist and Pavana waters.”',
    mr: '“पवना जलाशयावर पहारा देणारा अजिंक्य लोहदुर्ग आणि विंचूकाटा.”',
  },
  'khadakwasla-dam': {
    en: '“Cool morning ripples reflecting the southern Sahyadri hills.”',
    mr: '“खडकवासल्याच्या संथ लाटा आणि सह्याद्रीच्या टेकड्यांचे सुंदर प्रतिबिंब.”',
  },
  'fergusson-college-heritage': {
    en: '“Gothic stone halls that nurtured thinkers, poets, and leaders.”',
    mr: '“गॉथिक शैलीतील दगडी दालने आणि महाराष्ट्राच्या बुद्धिवंतांचे माहेरघर.”',
  },
  'raja-dinkar-kelkar-museum': {
    en: '“Twenty thousand treasures celebrating the craftsmanship of India.”',
    mr: '“भारतीय कारागिरीचा आणि दुर्मिळ ऐतिहासिक वस्तूंचा अद्वितीय खजिना.”',
  },
  'parvati-hill': {
    en: '“Hundred stone steps leading to sunset panoramas of the Peshwa city.”',
    mr: '“शंभर पायऱ्यांचा प्रवास आणि पेशवेकालीन मंदिरावरून पुण्याचा विहंगम देखावा.”',
  },
};

export function generateJourneyStories(journeys: DayJourney[]): JourneyStoryCardItem[] {
  const stories: JourneyStoryCardItem[] = [];
  const seenPlaceIds = new Set<string>();

  for (const j of journeys) {
    for (const p of j.places) {
      if (p.isVisited && !seenPlaceIds.has(p.placeId)) {
        seenPlaceIds.add(p.placeId);

        const quote = POETIC_QUOTES[p.placeId] || POETIC_QUOTES[p.placeSlug] || {
          en: `“A memorable discovery in Pune’s rich ${p.categoryName || 'heritage'} tapestry.”`,
          mr: `“पुण्याच्या समृद्ध संस्कृती व वारशातील एक सुंदर आणि अविस्मरणीय अनुभव.”`,
        };

        const time = p.arrivalTime || (p.visitedAt ? new Date(p.visitedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '10:02 AM');

        stories.push({
          id: `story-${j.id}-${p.placeId}`,
          placeId: p.placeId,
          placeName: p.placeName,
          placeNameMr: p.placeNameMr,
          category: p.category,
          categoryName: p.categoryName,
          categoryNameMr: p.categoryNameMr,
          imageUrl: p.image_url || '/images/places/shaniwar-wada.jpg',
          dateEn: j.dateLabelEn,
          dateMr: j.dateLabelMr,
          rawDate: j.date,
          timeString: time,
          quoteEn: quote.en,
          quoteMr: quote.mr,
          journeyTitleEn: j.title,
          journeyTitleMr: j.titleMr,
          journeyId: j.id,
        });
      }
    }
  }

  return stories;
}

export function calculateExplorationStreak(journeys: DayJourney[]): { currentStreak: number; totalActiveDays: number } {
  if (!journeys || journeys.length === 0) return { currentStreak: 0, totalActiveDays: 0 };

  const uniqueDates = Array.from(new Set(journeys.filter((j) => j.places.some((p) => p.isVisited)).map((j) => j.date))).sort().reverse();
  const totalActiveDays = uniqueDates.length;

  if (uniqueDates.length === 0) return { currentStreak: 0, totalActiveDays: 0 };

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checkDate = new Date(today);
  const latestDate = new Date(uniqueDates[0]);
  latestDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) {
    checkDate = latestDate;
    const dateSet = new Set(uniqueDates);
    while (true) {
      const dateStr = checkDate.toISOString().slice(0, 10);
      if (dateSet.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  } else {
    streak = Math.min(uniqueDates.length, 1);
  }

  return { currentStreak: Math.max(1, streak), totalActiveDays };
}

const STORAGE_KEY_JOURNEYS = 'explore_pune_all_journeys_v1';

// Calculate Haversine distance in km between two geo-coordinates
export function calculateGeoDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Calculate total path distance for a journey
export function calculateJourneyTotalDistance(j: DayJourney): number {
  if (!j.places || j.places.length === 0) return 0;
  let dist = 0;
  let prevLat = j.startCoords?.lat || j.places[0].latitude;
  let prevLng = j.startCoords?.lng || j.places[0].longitude;

  for (const p of j.places) {
    dist += calculateGeoDistanceKm(prevLat, prevLng, p.latitude, p.longitude);
    prevLat = p.latitude;
    prevLng = p.longitude;
  }
  return Math.round(dist * 10) / 10;
}

// Curated authentic historical journey records for Explore Pune (used for guest demo sample preview)
export const SEED_JOURNEYS: DayJourney[] = [
  // 1. TODAY: 20 October 2026 (Active current journey)
  {
    id: 'journey-2026-10-20',
    date: '2026-10-20',
    dateLabelEn: '20 October 2026',
    dateLabelMr: '२० ऑक्टोबर २०२६',
    title: "Today's Pune Heritage & Culture Journey",
    titleMr: 'आजची ऐतिहासिक वास्तू व संस्कृती सफर',
    theme: 'Old City Wadas, Sacred Ganpati & Museum Arts',
    themeMr: 'पेशवेकालीन वाडे, गणपती दर्शन आणि वस्तू संग्रहालय',
    startLocation: 'Swargate Bus Terminal',
    startLocationMr: 'स्वारगेट बस स्थानक',
    startCoords: { lat: 18.5018, lng: 73.8636 },
    startTime: '09:30 AM',
    endTime: '05:00 PM',
    travelMode: 'public_transit',
    status: 'active',
    totalDurationMinutes: 280,
    totalDistanceKm: 12.4,
    notes: 'Central city walking and bus route through the historic heart of Pune.',
    places: [
      {
        placeId: 'shaniwar-wada',
        placeSlug: 'shaniwar-wada',
        placeName: 'Shaniwar Wada',
        placeNameMr: 'शनिवार वाडा',
        category: 'heritage',
        categoryName: 'Heritage & Palaces',
        categoryNameMr: 'ऐतिहासिक वास्तू',
        image_url: '/images/places/shaniwar-wada.jpg',
        description: 'Seat of the Peshwa rulers of the Maratha Empire, built in 1732 with massive teak gates.',
        descriptionMr: '१७३२ मध्ये पेशवे बाजीराव पहिले यांनी बांधलेला पेशवाईचा मुख्य राजवाडा.',
        latitude: 18.5195,
        longitude: 73.8553,
        arrivalTime: '10:00 AM',
        departureTime: '11:15 AM',
        visitDurationMinutes: 75,
        isVisited: true,
        visitedAt: '2026-10-20T11:10:00Z',
        note: 'Walked through Dilli Darwaza and saw the Hazari Karanje fountain foundations.',
        noteMr: 'दिल्ली दरवाजा आणि हजारी कारंजाच्या ऐतिहासिक वास्तूचे दर्शन.',
        order: 1,
      },
      {
        placeId: 'lal-mahal',
        placeSlug: 'lal-mahal',
        placeName: 'Lal Mahal',
        placeNameMr: 'लाल महाल',
        category: 'heritage',
        categoryName: 'Heritage & Palaces',
        categoryNameMr: 'ऐतिहासिक वास्तू',
        image_url: '/images/places/lal-mahal.jpg',
        description: 'Historic palace where Chhatrapati Shivaji Maharaj spent his childhood with Rajmata Jijabai.',
        descriptionMr: 'छत्रपती शिवाजी महाराजांच्या बालपणीच्या आठवणी आणि जिजाऊंचा पदस्पर्श लाभलेली वास्तू.',
        latitude: 18.5186,
        longitude: 73.8566,
        arrivalTime: '11:30 AM',
        departureTime: '12:15 PM',
        visitDurationMinutes: 45,
        isVisited: true,
        visitedAt: '2026-10-20T12:10:00Z',
        note: 'Saw the historic depictions of Shaista Khan encounter.',
        noteMr: 'शाहिस्तेखानाची बोटे कापल्याच्या ऐतिहासिक प्रसंगाची चित्रे पाहिली.',
        order: 2,
      },
      {
        placeId: 'shreemant-dagdusheth-halwai-ganpati',
        placeSlug: 'shreemant-dagdusheth-halwai-ganpati',
        placeName: 'Shreemant Dagdusheth Halwai Ganpati',
        placeNameMr: 'श्रीमंत दगडूशेठ हलवाई गणपती',
        category: 'temples',
        categoryName: 'Sacred Temples',
        categoryNameMr: 'पवित्र मंदिरे',
        image_url: '/images/places/shreemant-dagdusheth-halwai-ganpati.jpg',
        description: 'Iconic temple founded in 1893, revered as one of the most beloved deities in Maharashtra.',
        descriptionMr: '१८९३ मध्ये स्थापन झालेले महाराष्ट्रातील सर्वात पूजनीय आणि जागृत देवस्थान.',
        latitude: 18.5165,
        longitude: 73.8561,
        arrivalTime: '12:30 PM',
        departureTime: '01:15 PM',
        visitDurationMinutes: 45,
        isVisited: true,
        visitedAt: '2026-10-20T13:10:00Z',
        note: 'Peaceful afternoon darshan with golden ornamentation.',
        noteMr: 'सुवर्ण अलंकार सजवलेल्या मंगलमूर्तीचे शांत चित्ताने दर्शन.',
        order: 3,
      },
      {
        placeId: 'fergusson-college-road',
        placeSlug: 'fergusson-college-heritage',
        placeName: 'FC Road & Deccan Gymkhana',
        placeNameMr: 'एफसी रोड व डेक्कन जिमखाना',
        category: 'food',
        categoryName: 'Pune Food Culture',
        categoryNameMr: 'पुणेरी खाद्यसंस्कृती',
        image_url: '/images/places/fc-road.jpg',
        description: 'Vibrant cultural and street food hub famous for SPDP, filter coffee, and iconic bookshops.',
        descriptionMr: 'पुण्यातील तरुणाईचे आवडते ठिकाण, वैशाली-रुपाली कॅफे व पुस्तकांची दुकाने.',
        latitude: 18.5167,
        longitude: 73.8409,
        arrivalTime: '02:00 PM',
        departureTime: '03:15 PM',
        visitDurationMinutes: 75,
        isVisited: false,
        note: 'Planned stop for authentic Puneri snacks and coffee.',
        noteMr: 'पुणेरी मिसळ आणि फिल्टर कॉफीसाठी नियोजित भेट.',
        order: 4,
      },
      {
        placeId: 'raja-dinkar-kelkar-museum',
        placeSlug: 'raja-dinkar-kelkar-museum',
        placeName: 'Raja Dinkar Kelkar Museum',
        placeNameMr: 'राजा दिनकर केळकर संग्रहालय',
        category: 'museums',
        categoryName: 'Museums & Art',
        categoryNameMr: 'वस्तुसंग्रहालये',
        image_url: '/images/places/raja-dinkar-kelkar-museum.jpg',
        description: 'Extraordinary collection of 20,000+ Indian artifacts including Mastani Mahal recreations.',
        descriptionMr: 'डॉ. केळकरांनी गोळा केलेला २० हजारांहून अधिक दुर्मिळ ऐतिहासिक वस्तूंचा अद्वितीय ठेवा.',
        latitude: 18.5108,
        longitude: 73.8539,
        arrivalTime: '03:45 PM',
        departureTime: '05:00 PM',
        visitDurationMinutes: 75,
        isVisited: false,
        note: 'Planned final cultural stop for Mastani Mahal architecture.',
        noteMr: 'मस्तानी महालाचे नक्षीकाम आणि ऐतिहासिक संगीत वाद्ये पाहणे.',
        order: 5,
      },
    ],
  },

  // 2. 18 October 2026: Sinhagad & Sahyadri Foothills
  {
    id: 'journey-2026-10-18',
    date: '2026-10-18',
    dateLabelEn: '18 October 2026',
    dateLabelMr: '१८ ऑक्टोबर २०२६',
    title: 'Pune Heritage & Fort Trail',
    titleMr: 'पुणे वारसा व सिंहगड दुर्ग मोहीम',
    theme: 'High Altitude Sahyadri Fortress & Khadakwasla Waters',
    themeMr: 'सह्याद्रीचा अजिंक्य गड आणि खडकवासला जलाशय',
    startLocation: 'Deccan Gymkhana',
    startLocationMr: 'डेक्कन जिमखाना',
    startCoords: { lat: 18.5167, lng: 73.8409 },
    startTime: '07:00 AM',
    endTime: '04:30 PM',
    travelMode: 'public_transit',
    status: 'completed',
    totalDurationMinutes: 380,
    totalDistanceKm: 34.8,
    notes: 'Took PMPML Bus 50 to Sinhagad Paytha; spectacular morning view from Kalyan Darwaza.',
    places: [
      {
        placeId: 'khadakwasla-dam',
        placeSlug: 'khadakwasla-dam',
        placeName: 'Khadakwasla Dam & Lake',
        placeNameMr: 'खडकवासला धरण व तलाव',
        category: 'nature',
        categoryName: 'Lakes & Nature',
        categoryNameMr: 'निसर्ग व तलाव',
        image_url: '/images/places/khadakwasla-dam.jpg',
        description: 'Lifeline reservoir of Pune built on Mutha River with sweeping hills views.',
        descriptionMr: 'मुठा नदीवर वसलेले पुण्याचे मुख्य धरण आणि निसर्गरम्य चौपाटी.',
        latitude: 18.4357,
        longitude: 73.7661,
        arrivalTime: '08:15 AM',
        departureTime: '09:00 AM',
        visitDurationMinutes: 45,
        isVisited: true,
        visitedAt: '2026-10-18T08:55:00Z',
        note: 'Cool morning breeze and fresh hot corn.',
        noteMr: 'सकाळचे प्रसन्न वातावरण आणि जलाशयाचा सुंदर देखावा.',
        order: 1,
      },
      {
        placeId: 'sinhagad-fort',
        placeSlug: 'sinhagad-fort',
        placeName: "Sinhagad Fort (Lion's Fort)",
        placeNameMr: 'सिंहगड किल्ला (कोंढाणा)',
        category: 'forts',
        categoryName: 'Heritage & Forts',
        categoryNameMr: 'किल्ले व गड',
        image_url: '/images/places/sinhagad-fort.jpg',
        description: 'Legendary battle site of Subedar Tanaji Malusare perched at 1,312 meters.',
        descriptionMr: 'नरवीर तानाजी मालुसरे यांच्या असीम शौर्याची साक्ष देणारा ऐतिहासिक डोंगरी किल्ला.',
        latitude: 18.3664,
        longitude: 73.7558,
        arrivalTime: '10:00 AM',
        departureTime: '01:30 PM',
        visitDurationMinutes: 210,
        isVisited: true,
        visitedAt: '2026-10-18T13:20:00Z',
        note: 'Climbed Kalyan Darwaza, paid respects at Tanaji Smarak, enjoyed authentic Pithla Bhakri.',
        noteMr: 'कल्याण दरवाजा, तानाजी मालुसरे समाधी आणि अस्सल चुलीवरची पिठलं-भाकरी.',
        order: 2,
      },
      {
        placeId: 'pu-la-deshpande-garden',
        placeSlug: 'okayama-friendship-garden',
        placeName: 'Okayama Friendship Garden',
        placeNameMr: 'पु. ल. देशपांडे उद्यान (ओकायामा गार्डन)',
        category: 'parks',
        categoryName: 'Parks & Gardens',
        categoryNameMr: 'उद्याने व बागा',
        image_url: '/images/places/okayama-friendship-garden.jpg',
        description: 'Japanese Korakuen style peaceful strolling garden with serene canals and wooden bridges.',
        descriptionMr: 'जपानी कोराकुएन शैलीवर आधारित शांत व निसर्गरम्य उद्यान.',
        latitude: 18.4912,
        longitude: 73.8340,
        arrivalTime: '03:15 PM',
        departureTime: '04:30 PM',
        visitDurationMinutes: 75,
        isVisited: true,
        visitedAt: '2026-10-18T16:25:00Z',
        note: 'Evening calm with gentle streams and manicured bamboo groves.',
        noteMr: 'सुंदर जलप्रवाह, लाकडी पूल आणि शांत संध्याकाळ.',
        order: 3,
      },
    ],
  },

  // 3. 14 October 2026: Eastern Palaces & Freedom Memorials
  {
    id: 'journey-2026-10-14',
    date: '2026-10-14',
    dateLabelEn: '14 October 2026',
    dateLabelMr: '१४ ऑक्टोबर २०२६',
    title: 'Eastern Palaces & Freedom Trail',
    titleMr: 'ऐतिहासिक राजवाडे व स्वातंत्र्य लढा सफर',
    theme: 'Mahatma Gandhi Memorial & Ancient Shinde Architecture',
    themeMr: 'महात्मा गांधी स्मारक व भव्य शिंदे छत्री',
    startLocation: 'Pune Railway Station',
    startLocationMr: 'पुणे रेल्वे स्टेशन',
    startCoords: { lat: 18.5289, lng: 73.8744 },
    startTime: '09:45 AM',
    endTime: '04:00 PM',
    travelMode: 'driving',
    status: 'completed',
    totalDurationMinutes: 280,
    totalDistanceKm: 18.6,
    notes: 'Visited Aga Khan Palace and historic Italian-Gothic memorial at Wanowrie.',
    places: [
      {
        placeId: 'aga-khan-palace',
        placeSlug: 'aga-khan-palace',
        placeName: 'Aga Khan Palace',
        placeNameMr: 'आगाखान पॅलेस',
        category: 'heritage',
        categoryName: 'Heritage & Palaces',
        categoryNameMr: 'ऐतिहासिक वास्तू',
        image_url: '/images/places/aga-khan-palace.jpg',
        description: 'National monument where Mahatma Gandhi and Kasturba Gandhi were interned during 1942 Quit India.',
        descriptionMr: '१९४२ च्या चले जाव आंदोलनातील ऐतिहासिक कारावास आणि कस्तुरबा गांधी स्मारक.',
        latitude: 18.5524,
        longitude: 73.9015,
        arrivalTime: '10:15 AM',
        departureTime: '12:30 PM',
        visitDurationMinutes: 135,
        isVisited: true,
        visitedAt: '2026-10-14T12:20:00Z',
        note: 'Saw the Gandhi memorial samadhis and serene Italian arches.',
        noteMr: 'गांधीजींच्या वस्तूंचे संग्रहालय आणि शांत प्रांगण.',
        order: 1,
      },
      {
        placeId: 'shinde-chhatri',
        placeSlug: 'shinde-chhatri',
        placeName: 'Shinde Chhatri Wanowrie',
        placeNameMr: 'शिंदे छत्री, वानवडी',
        category: 'heritage',
        categoryName: 'Heritage & Palaces',
        categoryNameMr: 'ऐतिहासिक वास्तू',
        image_url: '/images/places/shinde-chhatri.jpg',
        description: 'Splendid Anglo-Rajasthani memorial dedicated to Maratha military statesman Mahadji Shinde.',
        descriptionMr: 'मराठा साम्राज्याचे सेनापती महादजी शिंदे यांचे भव्य आणि नक्षीदार स्मारक.',
        latitude: 18.4908,
        longitude: 73.8970,
        arrivalTime: '01:30 PM',
        departureTime: '03:15 PM',
        visitDurationMinutes: 105,
        isVisited: true,
        visitedAt: '2026-10-14T15:10:00Z',
        note: 'Stunning stained-glass windows and stone carvings.',
        noteMr: 'अप्रतिम राजस्थानी शैलीतील दगडी कोरीवकाम आणि काचेची तावदाने.',
        order: 2,
      },
    ],
  },

  // 4. 28 September 2026: Peshwa Temples & Parvati Sunrise
  {
    id: 'journey-2026-09-28',
    date: '2026-09-28',
    dateLabelEn: '28 September 2026',
    dateLabelMr: '२८ सप्टेंबर २०२६',
    title: 'Peshwa Temples & Hill Panorama',
    titleMr: 'पेशवेकालीन मंदिरे व पर्वती दर्शन',
    theme: '108 Steps to Parvati & Sacred Sarasbaug',
    themeMr: '१०८ पायऱ्यांची पर्वती टेकडी आणि सारसबाग',
    startLocation: 'Swargate Bus Terminal',
    startLocationMr: 'स्वारगेट बस स्थानक',
    startCoords: { lat: 18.5018, lng: 73.8636 },
    startTime: '06:15 AM',
    endTime: '12:30 PM',
    travelMode: 'walking',
    status: 'completed',
    totalDurationMinutes: 240,
    totalDistanceKm: 7.2,
    notes: 'Morning walk up the stone stairs of Parvati hill for a 360-degree Pune panorama.',
    places: [
      {
        placeId: 'parvati-hill',
        placeSlug: 'parvati-hill',
        placeName: 'Parvati Hill & Devdeveshwar',
        placeNameMr: 'पर्वती टेकडी व देवदेवेश्वर मंदिर',
        category: 'temples',
        categoryName: 'Sacred Temples',
        categoryNameMr: 'पवित्र मंदिरे',
        image_url: '/images/places/parvati-hill.jpg',
        description: 'Historic hill temple complex built by Nana Saheb Peshwa in 1749 offering 360-degree city views.',
        descriptionMr: 'नानासाहेब पेशव्यांनी १७४९ मध्ये बांधलेली ऐतिहासिक टेकडी व मंदिर संकुल.',
        latitude: 18.4962,
        longitude: 73.8475,
        arrivalTime: '06:45 AM',
        departureTime: '08:45 AM',
        visitDurationMinutes: 120,
        isVisited: true,
        visitedAt: '2026-09-28T08:40:00Z',
        note: 'Breathtaking sunrise over Pune city skyline.',
        noteMr: 'पुणे शहराचे विहंगम दृश्य आणि प्रसन्न सकाळची हवा.',
        order: 1,
      },
      {
        placeId: 'sarasbaug',
        placeSlug: 'sarasbaug',
        placeName: 'Sarasbaug Ganpati Temple',
        placeNameMr: 'सारसबाग गणपती मंदिर',
        category: 'temples',
        categoryName: 'Sacred Temples',
        categoryNameMr: 'पवित्र मंदिरे',
        image_url: '/images/places/sarasbaug.jpg',
        description: 'Talyatla Ganpati temple built in 1784 amid lush green gardens and lotus ponds.',
        descriptionMr: '१७८४ मध्ये तळ्याच्या मध्यभागी बांधलेले "तळ्यातला गणपती" मंदिर.',
        latitude: 18.5005,
        longitude: 73.8542,
        arrivalTime: '09:15 AM',
        departureTime: '10:30 AM',
        visitDurationMinutes: 75,
        isVisited: true,
        visitedAt: '2026-09-28T10:20:00Z',
        note: 'Calm stroll around the garden pathways.',
        noteMr: 'हिरवळीतून चालत प्रसन्न गणपती दर्शन.',
        order: 2,
      },
      {
        placeId: 'vishrambaug-wada',
        placeSlug: 'vishrambaug-wada',
        placeName: 'Vishrambaug Wada',
        placeNameMr: 'विश्रामबाग वाडा',
        category: 'heritage',
        categoryName: 'Heritage & Palaces',
        categoryNameMr: 'ऐतिहासिक वास्तू',
        image_url: '/images/places/vishrambaug-wada.jpg',
        description: 'Luxurious three-storeyed mansion built in 1807 by Peshwa Bajirao II with carved cypress pillars.',
        descriptionMr: '१८०७ मध्ये दुसरा बाजीराव पेशवे यांनी बांधलेला लाकडी नक्षीकामाचा तीन मजली वाडा.',
        latitude: 18.5140,
        longitude: 73.8532,
        arrivalTime: '11:00 AM',
        departureTime: '12:15 PM',
        visitDurationMinutes: 75,
        isVisited: true,
        visitedAt: '2026-09-28T12:10:00Z',
        note: 'Intricate teak wood balconies and Peshwa history gallery.',
        noteMr: 'सुरेख लाकडी खांब आणि "पुणे वारसा" प्रदर्शन दालन.',
        order: 3,
      },
    ],
  },

  // 5. 18 June 2026: Monsoon Sahyadri Forts
  {
    id: 'journey-2026-06-18',
    date: '2026-06-18',
    dateLabelEn: '18 June 2026',
    dateLabelMr: '१८ जून २०२६',
    title: 'Monsoon Mist Sahyadri Trek',
    titleMr: 'पावसाळी सह्याद्री गड-किल्ले ट्रेक',
    theme: 'Lohagad Scorpion Point & Ancient Buddhist Caves',
    themeMr: 'लोहगड विंचूकाटा व प्राचीन भाजे लेणी',
    startLocation: 'Shivajinagar Station',
    startLocationMr: 'शिवाजीनगर स्थानक',
    startCoords: { lat: 18.5308, lng: 73.8475 },
    startTime: '06:30 AM',
    endTime: '05:30 PM',
    travelMode: 'public_transit',
    status: 'completed',
    totalDurationMinutes: 440,
    totalDistanceKm: 62.4,
    notes: 'Took Pune-Lonavala suburban local train to Malavli; hiked in mist and waterfalls.',
    places: [
      {
        placeId: 'lohagad-fort',
        placeSlug: 'lohagad-fort',
        placeName: 'Lohagad Fort (Iron Fort)',
        placeNameMr: 'लोहगड किल्ला (लोहदुर्ग)',
        category: 'forts',
        categoryName: 'Heritage & Forts',
        categoryNameMr: 'किल्ले व गड',
        image_url: '/images/places/lohagad-fort.jpg',
        description: 'Mighty fortress with famous 1.5-km Vinchukata (Scorpion Tail) fortified cliff ridge.',
        descriptionMr: 'दीड किमी लांब विंचूकाटा माची आणि पवना धरणाचा विहंगम देखावा.',
        latitude: 18.7083,
        longitude: 73.4792,
        arrivalTime: '09:00 AM',
        departureTime: '01:30 PM',
        visitDurationMinutes: 270,
        isVisited: true,
        visitedAt: '2026-06-18T13:15:00Z',
        note: 'Walked the entire Vinchukata in clouds and light rain.',
        noteMr: 'धुक्याची चादर आणि विंचूकाट्यावरील अंगावर काटा आणणारा वारा.',
        order: 1,
      },
      {
        placeId: 'bhaja-caves',
        placeSlug: 'bhaja-caves',
        placeName: 'Bhaja Buddhist Caves',
        placeNameMr: 'भाजे बौद्ध लेणी संकुल',
        category: 'heritage',
        categoryName: 'Heritage & Palaces',
        categoryNameMr: 'ऐतिहासिक वास्तू',
        image_url: '/images/places/bhaja-caves.jpg',
        description: '22 rock-cut Buddhist caves dating to 2nd century BCE with monolithic stupas and wooden vaulted ceiling.',
        descriptionMr: 'इ.स. पूर्व दुसऱ्या शतकातील अप्रतिम चैत्यगृह आणि प्राचीन बौद्ध स्तूप.',
        latitude: 18.7180,
        longitude: 73.4830,
        arrivalTime: '02:30 PM',
        departureTime: '04:15 PM',
        visitDurationMinutes: 105,
        isVisited: true,
        visitedAt: '2026-06-18T16:00:00Z',
        note: 'Saw the wooden ribbing that has survived over 2,200 years.',
        noteMr: '२२०० वर्षांपूर्वीचे अस्सल लाकडी तुळयांचे छत आणि स्तूप.',
        order: 2,
      },
    ],
  },

  // 6. 14 June 2026: (Requested User Landmark Day: Shaniwar Wada -> Lal Mahal -> FC Road -> Koregaon Park)
  {
    id: 'journey-2026-06-14',
    date: '2026-06-14',
    dateLabelEn: '14 June 2026',
    dateLabelMr: '१४ जून २०२६',
    title: 'First Pune Exploration Journey',
    titleMr: 'पुण्यातील पहिली ऐतिहासिक व सांस्कृतिक सफर',
    theme: 'From Historic Wada Gates to Green Gardens of Koregaon Park',
    themeMr: 'ऐतिहासिक वाड्यांच्या दरवाजांपासून कोरेगाव पार्कच्या निसर्गापर्यंत',
    startLocation: 'Shaniwar Wada Courtyard',
    startLocationMr: 'शनिवार वाडा प्रांगण',
    startCoords: { lat: 18.5195, lng: 73.8553 },
    startTime: '10:00 AM',
    endTime: '05:30 PM',
    travelMode: 'public_transit',
    status: 'completed',
    totalDurationMinutes: 360,
    totalDistanceKm: 14.8,
    notes: 'The day my Pune story began — exploring history, cafe culture, and tree-lined avenues.',
    places: [
      {
        placeId: 'shaniwar-wada',
        placeSlug: 'shaniwar-wada',
        placeName: 'Shaniwar Wada',
        placeNameMr: 'शनिवार वाडा',
        category: 'heritage',
        categoryName: 'Heritage & Palaces',
        categoryNameMr: 'ऐतिहासिक वास्तू',
        image_url: '/images/places/shaniwar-wada.jpg',
        description: 'The royal nerve center of the Maratha Empire under the Peshwas.',
        descriptionMr: 'पेशवेकालीन पराक्रमाचे आणि इतिहासाचे मुख्य केंद्र.',
        latitude: 18.5195,
        longitude: 73.8553,
        arrivalTime: '10:00 AM',
        departureTime: '11:15 AM',
        visitDurationMinutes: 75,
        isVisited: true,
        visitedAt: '2026-06-14T11:10:00Z',
        note: 'First stop of the day! Magnificent stone ramparts.',
        noteMr: 'पुणे भ्रमंतीची पहिली सुरुवात. भव्य दगडी तटबंदी.',
        order: 1,
      },
      {
        placeId: 'lal-mahal',
        placeSlug: 'lal-mahal',
        placeName: 'Lal Mahal',
        placeNameMr: 'लाल महाल',
        category: 'heritage',
        categoryName: 'Heritage & Palaces',
        categoryNameMr: 'ऐतिहासिक वास्तू',
        image_url: '/images/places/lal-mahal.jpg',
        description: 'Reconstructed red brick palace immortalizing young Shivaji Maharaj.',
        descriptionMr: 'छत्रपती शिवरायांच्या पराक्रमाचा इतिहास जपणारी लाल महालाची इमारत.',
        latitude: 18.5186,
        longitude: 73.8566,
        arrivalTime: '11:45 AM',
        departureTime: '12:35 PM',
        visitDurationMinutes: 50,
        isVisited: true,
        visitedAt: '2026-06-14T12:30:00Z',
        note: 'Short walk from Shaniwar Wada; peaceful memorial.',
        noteMr: 'शनिवार वाड्यावरून ५ मिनिटांच्या अंतरावर सुंदर भेट.',
        order: 2,
      },
      {
        placeId: 'fergusson-college-road',
        placeSlug: 'fergusson-college-heritage',
        placeName: 'FC Road',
        placeNameMr: 'एफसी रोड (फर्ग्युसन कॉलेज रस्ता)',
        category: 'food',
        categoryName: 'Pune Food Culture',
        categoryNameMr: 'पुणेरी खाद्यसंस्कृती',
        image_url: '/images/places/fc-road.jpg',
        description: 'Iconic avenue filled with student cafes, bookstores, and street fashion.',
        descriptionMr: 'पुण्यातील सर्वात प्रसिद्ध रस्ता, पुस्तके, कॅफे आणि खाद्यसंस्कृती.',
        latitude: 18.5167,
        longitude: 73.8409,
        arrivalTime: '01:10 PM',
        departureTime: '02:40 PM',
        visitDurationMinutes: 90,
        isVisited: true,
        visitedAt: '2026-06-14T14:35:00Z',
        note: 'Lunch at Cafe Goodluck and Vaishali filter coffee.',
        noteMr: 'वैशाली कॅफेमधील चविष्ट नाश्ता आणि अस्सल पुणेरी गप्पा.',
        order: 3,
      },
      {
        placeId: 'koregaon-park',
        placeSlug: 'osho-teerth-park',
        placeName: 'Koregaon Park & Osho Garden',
        placeNameMr: 'कोरेगाव पार्क व ओशो तीर्थ उद्यान',
        category: 'nature',
        categoryName: 'Lakes & Nature',
        categoryNameMr: 'निसर्ग व उद्याने',
        image_url: '/images/places/koregaon-park.jpg',
        description: 'Lush greenery, heritage banyan canopies, tranquil Zen pathways, and cafes.',
        descriptionMr: 'हिरवेगार वृक्ष, झेन शैलीतील शांत उद्यान आणि सुंदर परिसर.',
        latitude: 18.5362,
        longitude: 73.8940,
        arrivalTime: '03:20 PM',
        departureTime: '05:00 PM',
        visitDurationMinutes: 100,
        isVisited: true,
        visitedAt: '2026-06-14T17:00:00Z',
        note: 'Finished the day walking beside the stream in lush greenery.',
        noteMr: 'झाडांच्या सावलीत आणि पाण्याच्या शांत प्रवाहात दिवसाचा शेवट.',
        order: 4,
      },
    ],
  },
];

// Synthesize authentic DayJourney objects from user's actual Firestore visits
export function buildUserJourneysFromVisits(
  visits: any[],
  placesMap: Map<string, any> = new Map(),
  activeTrip?: any
): DayJourney[] {
  if ((!visits || visits.length === 0) && !activeTrip) {
    return [];
  }

  // 1. Group visits by visit date (YYYY-MM-DD)
  const groupedByDate: Record<string, any[]> = {};
  for (const v of visits || []) {
    const rawDate = v.visited_at || v.created_at || '';
    let dateStr = rawDate.slice(0, 10);
    // If not standard YYYY-MM-DD, try Date parsing
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      try {
        const parsed = new Date(rawDate);
        if (!isNaN(parsed.getTime())) {
          dateStr = parsed.toISOString().slice(0, 10);
        } else {
          dateStr = new Date().toISOString().slice(0, 10);
        }
      } catch {
        dateStr = new Date().toISOString().slice(0, 10);
      }
    }

    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = [];
    }
    groupedByDate[dateStr].push(v);
  }

  const generatedJourneys: DayJourney[] = [];

  for (const [dateStr, dayVisits] of Object.entries(groupedByDate)) {
    const d = new Date(dateStr);
    const dateLabelEn = !isNaN(d.getTime())
      ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : dateStr;
    const dateLabelMr = !isNaN(d.getTime())
      ? `${d.getDate()} ${d.toLocaleDateString('mr-IN', { month: 'long' })} ${d.getFullYear()}`
      : dateStr;

    // Build stops for this day
    const stops: JourneyPlaceStop[] = dayVisits.map((v, idx) => {
      const p = placesMap.get(v.place_slug) || placesMap.get(v.place_id) || {};
      const cat = p.category_slug || (Array.isArray(p.place_categories) ? p.place_categories[0]?.slug : p.category) || 'heritage';
      return {
        placeId: v.place_id || p.id || `spot-${idx}`,
        placeSlug: v.place_slug || p.slug || v.place_id || '',
        placeName: v.place_name || p.name || 'Pune Landmark',
        placeNameMr: v.place_name_mr || p.name_mr || p.name,
        category: cat,
        categoryName: p.category || 'Heritage & Culture',
        categoryNameMr: p.category_mr || 'वारसा व संस्कृती',
        image_url: v.image_url || p.image_url || '/images/places/shaniwar-wada.jpg',
        description: v.notes || p.description || '',
        latitude: Number(p.latitude) || 18.5204,
        longitude: Number(p.longitude) || 73.8567,
        isVisited: true,
        visitedAt: v.visited_at || v.created_at,
        note: v.notes || undefined,
        order: idx + 1,
      };
    });

    // Determine representative title from categories
    const categories = stops.map((s) => s.category);
    let title = 'Pune Exploration Journey';
    let titleMr = 'पुणे भ्रमंती सफर';
    let theme = 'Explored authentic heritage landmarks & places across Pune.';
    let themeMr = 'पुण्यातील ऐतिहासिक वास्तू व निसर्गरम्य पर्यटन स्थळे.';

    if (categories.includes('forts')) {
      title = 'Sahyadri Forts & Mountain Expedition';
      titleMr = 'सह्याद्री गड-किल्ले मोहीम';
      theme = 'Conquered historical Maratha hill fortresses and mountain bastions.';
      themeMr = 'ऐतिहासिक दुर्ग आणि सह्याद्रीच्या डोंगररांगांचा थरारक अनुभव.';
    } else if (categories.includes('temples')) {
      title = 'Sacred Shrines & Heritage Temples';
      titleMr = 'पवित्र देवस्थाने व दर्शन यात्रा';
      theme = 'Visited revered Ganesh temples and ancient sanctums.';
      themeMr = 'पुण्यातील ग्रामदैवत व प्रसिद्ध देवस्थानांचे दर्शन.';
    } else if (categories.includes('nature') || categories.includes('parks')) {
      title = 'Nature Trails & Scenic Lake Walk';
      titleMr = 'निसर्ग सफर आणि तलाव भ्रमंती';
      theme = 'Lakeside serenity and lush green views.';
      themeMr = 'शांत तलाव आणि हिरवेगार निसर्गरम्य वातावरण.';
    }

    const firstStop = stops[0];
    const dayJourney: DayJourney = {
      id: `journey-${dateStr}`,
      date: dateStr,
      dateLabelEn,
      dateLabelMr,
      title,
      titleMr,
      theme,
      themeMr,
      startLocation: firstStop ? firstStop.placeName : 'Pune City',
      startLocationMr: firstStop ? (firstStop.placeNameMr || firstStop.placeName) : 'पुणे शहर',
      startCoords: firstStop ? { lat: firstStop.latitude, lng: firstStop.longitude } : { lat: 18.5204, lng: 73.8567 },
      travelMode: 'public_transit',
      status: 'completed',
      places: stops,
      totalDistanceKm: 0,
      totalDurationMinutes: Math.max(60, stops.length * 60),
    };

    dayJourney.totalDistanceKm = calculateJourneyTotalDistance(dayJourney);
    generatedJourneys.push(dayJourney);
  }

  // 2. Incorporate today's active trip from Planner if active and not already included
  if (activeTrip && Array.isArray(activeTrip.stops) && activeTrip.stops.length > 0) {
    const todayIso = new Date().toISOString().slice(0, 10);
    const existingToday = generatedJourneys.find((j) => j.date === todayIso);
    if (!existingToday) {
      const activeStops: JourneyPlaceStop[] = activeTrip.stops.map((s: any, idx: number) => ({
        placeId: s.placeId,
        placeSlug: s.placeSlug,
        placeName: s.placeName,
        placeNameMr: s.placeNameMr,
        category: 'heritage',
        categoryName: 'Planned Itinerary',
        categoryNameMr: 'नियोजित सहल',
        image_url: s.image_url,
        description: '',
        latitude: s.latitude ?? 18.5204,
        longitude: s.longitude ?? 73.8567,
        arrivalTime: s.arrivalTime,
        departureTime: s.departureTime,
        visitDurationMinutes: s.visitMinutes,
        isVisited: Boolean(s.isVisited),
        order: idx + 1,
      }));

      const activeDayJourney: DayJourney = {
        id: `journey-${todayIso}`,
        date: todayIso,
        dateLabelEn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        dateLabelMr: `${new Date().getDate()} ${new Date().toLocaleDateString('mr-IN', { month: 'long' })} ${new Date().getFullYear()}`,
        title: activeTrip.titleEn || "Today's Guided Trip",
        titleMr: activeTrip.titleMr || 'आजची नियोजित सहल',
        theme: activeTrip.themeEn || 'Active planned itinerary in Pune',
        themeMr: activeTrip.themeMr || 'पुण्यातील आजचा नियोजित मार्ग',
        startLocation: activeTrip.startLocation || 'Pune',
        startLocationMr: activeTrip.startLocation || 'पुणे',
        startCoords: activeTrip.stops[0]?.latitude ? { lat: activeTrip.stops[0].latitude, lng: activeTrip.stops[0].longitude } : undefined,
        startTime: activeTrip.startTime,
        travelMode: (activeTrip.travelMode as any) || 'public_transit',
        status: activeTrip.isCompleted ? 'completed' : 'active',
        places: activeStops,
        totalDistanceKm: 0,
        totalDurationMinutes: activeTrip.totalDurationMinutes || 180,
      };
      activeDayJourney.totalDistanceKm = calculateJourneyTotalDistance(activeDayJourney);
      generatedJourneys.unshift(activeDayJourney);
    }
  }

  // Sort journeys by date descending
  generatedJourneys.sort((a, b) => b.date.localeCompare(a.date));
  return generatedJourneys;
}

// Read all stored journeys.
// When userId is given: returns ONLY that user's real journeys (NEVER injects seed data!).
// When userId is undefined: returns seed data in Node/SSR/tests or when allowSeedDemo is true.
export function getAllJourneys(userId?: string | null, allowSeedDemo: boolean = false): DayJourney[] {
  if (typeof window === 'undefined') return SEED_JOURNEYS;

  try {
    if (userId) {
      const userKey = `explore_pune_user_journeys_${userId}`;
      const rawUser = localStorage.getItem(userKey);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (Array.isArray(parsed)) {
          parsed.sort((a: DayJourney, b: DayJourney) => b.date.localeCompare(a.date));
          return parsed as DayJourney[];
        }
      }
      return [];
    }

    // Anonymous or Demo mode
    const raw = localStorage.getItem(STORAGE_KEY_JOURNEYS);
    if (!raw) {
      if (allowSeedDemo) {
        localStorage.setItem(STORAGE_KEY_JOURNEYS, JSON.stringify(SEED_JOURNEYS));
        return SEED_JOURNEYS;
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return allowSeedDemo ? SEED_JOURNEYS : [];
    }
    if (allowSeedDemo) {
      const idMap = new Map(parsed.map((j: DayJourney) => [j.id, j]));
      for (const seed of SEED_JOURNEYS) {
        if (!idMap.has(seed.id)) {
          parsed.push(seed);
        }
      }
    }
    parsed.sort((a: DayJourney, b: DayJourney) => b.date.localeCompare(a.date));
    return parsed as DayJourney[];
  } catch (err) {
    console.error('Failed to load journeys:', err);
    return allowSeedDemo ? SEED_JOURNEYS : [];
  }
}

// Get journey for today (matching YYYY-MM-DD or most recent active)
export function getTodayJourney(userId?: string | null): DayJourney | null {
  const journeys = getAllJourneys(userId, !userId);
  const todayIso = new Date().toISOString().slice(0, 10);
  const foundToday = journeys.find((j) => j.date === todayIso);
  if (foundToday) return foundToday;
  return journeys.find((j) => j.status === 'active') || null;
}

// Get journey by exact date
export function getJourneyByDate(dateStr: string, userId?: string | null): DayJourney | null {
  const journeys = getAllJourneys(userId, !userId);
  return journeys.find((j) => j.date === dateStr || j.id === dateStr) || null;
}

// Save or update a day journey for a user
export function saveJourney(journey: DayJourney, userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const storageKey = userId ? `explore_pune_user_journeys_${userId}` : STORAGE_KEY_JOURNEYS;
    const list = getAllJourneys(userId, false);
    const idx = list.findIndex((j) => j.id === journey.id || j.date === journey.date);
    if (idx >= 0) {
      list[idx] = journey;
    } else {
      list.unshift(journey);
    }
    list.sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem(storageKey, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('explore-pune-journeys-changed', { detail: { userId, list } }));
  } catch (err) {
    console.error('Failed to save journey:', err);
  }
}

// Toggle visited checkmark for a stop in a journey
export function toggleJourneyStopVisited(journeyId: string, placeId: string, visited: boolean, userId?: string | null): DayJourney | null {
  const journeys = getAllJourneys(userId, false);
  const j = journeys.find((item) => item.id === journeyId || item.date === journeyId);
  if (!j) return null;

  j.places = j.places.map((p) => {
    if (p.placeId === placeId || p.placeSlug === placeId) {
      return {
        ...p,
        isVisited: visited,
        visitedAt: visited ? new Date().toISOString() : undefined,
      };
    }
    return p;
  });

  // Check if all are visited
  const allVisited = j.places.every((p) => p.isVisited);
  if (allVisited) {
    j.status = 'completed';
  } else if (j.places.some((p) => p.isVisited)) {
    j.status = 'active';
  }

  saveJourney(j, userId);
  return j;
}

// Delete a journey by ID or date key
export function deleteJourney(journeyId: string, userId?: string | null): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const storageKey = userId ? `explore_pune_user_journeys_${userId}` : STORAGE_KEY_JOURNEYS;
    const list = getAllJourneys(userId, false);
    const updated = list.filter((j) => j.id !== journeyId && j.date !== journeyId);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('explore-pune-journeys-changed', { detail: { userId, list: updated } }));
    return true;
  } catch (err) {
    console.error('Failed to delete journey:', err);
    return false;
  }
}

// Compute dynamic overall journey statistics from actual data
export function computeOverallStats(journeys: DayJourney[]): JourneyStats {
  const visitedPlaceIds = new Set<string>();
  const areas = new Set<string>();
  const categoryCounts: Record<string, { count: number; nameEn: string; nameMr: string }> = {};
  let totalDist = 0;
  let totalPlacesCount = 0;

  for (const j of journeys) {
    totalDist += j.totalDistanceKm || calculateJourneyTotalDistance(j);
    for (const p of j.places) {
      totalPlacesCount++;
      if (p.isVisited) {
        visitedPlaceIds.add(p.placeId);
        // Categorize area by coordinates / keywords
        if (p.latitude < 18.42) areas.add('Sinhagad & South Ridges');
        else if (p.latitude > 18.60) areas.add('Maval & Lonavala Forts');
        else if (p.longitude < 73.84) areas.add('Deccan & West Hills');
        else if (p.longitude > 73.88) areas.add('Camp & East Palaces');
        else areas.add('Central Historic Peths');

        const cat = p.category || 'heritage';
        if (!categoryCounts[cat]) {
          categoryCounts[cat] = {
            count: 0,
            nameEn: p.categoryName || cat,
            nameMr: p.categoryNameMr || cat,
          };
        }
        categoryCounts[cat].count++;
      }
    }
  }

  const sortedCats = Object.entries(categoryCounts).map(([cat, val]) => ({
    category: cat,
    nameEn: val.nameEn,
    nameMr: val.nameMr,
    count: val.count,
  }));
  sortedCats.sort((a, b) => b.count - a.count);

  const dates = journeys.map((j) => j.date).filter(Boolean).sort();

  return {
    totalPlacesVisited: visitedPlaceIds.size,
    totalJourneys: journeys.length,
    totalDistanceKm: Math.round(totalDist * 10) / 10,
    totalAreasExplored: visitedPlaceIds.size === 0 ? 0 : Math.max(1, areas.size),
    categoriesExplored: sortedCats,
    firstJourneyDate: dates[0] || '',
    latestJourneyDate: dates[dates.length - 1] || '',
    mostVisitedCategory: sortedCats[0]?.nameEn || 'None yet',
    completionRate: totalPlacesCount > 0 ? Math.round((visitedPlaceIds.size / totalPlacesCount) * 100) : 0,
  };
}

// Compute journey milestones from real progress
export function computeJourneyMilestones(stats: JourneyStats): JourneyMilestone[] {
  const latestDateFormatted = stats.latestJourneyDate
    ? new Date(stats.latestJourneyDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently';

  return [
    {
      id: 'first-step',
      badge: '👟',
      titleEn: 'First Step in Pune',
      titleMr: 'पुण्यात पहिले पाऊल',
      descEn: 'Explored your first landmark in Pune.',
      descMr: 'पुण्यातील पहिल्या ऐतिहासिक ठिकाणाला भेट दिली.',
      isUnlocked: stats.totalPlacesVisited >= 1,
      unlockedAt: stats.totalPlacesVisited >= 1 ? latestDateFormatted : undefined,
      progress: Math.min(stats.totalPlacesVisited, 1),
      target: 1,
    },
    {
      id: 'heritage-explorer',
      badge: '🏛️',
      titleEn: 'Heritage Connoisseur',
      titleMr: 'वारसा अभ्यासक',
      descEn: 'Visited 5+ historic wadas and monuments in Pune.',
      descMr: '५ पेक्षा जास्त ऐतिहासिक वास्तू व वाड्यांना भेट दिली.',
      isUnlocked: (stats.categoriesExplored.find((c) => c.category === 'heritage')?.count || 0) >= 5,
      unlockedAt: (stats.categoriesExplored.find((c) => c.category === 'heritage')?.count || 0) >= 5 ? latestDateFormatted : undefined,
      progress: Math.min(stats.categoriesExplored.find((c) => c.category === 'heritage')?.count || 0, 5),
      target: 5,
    },
    {
      id: 'fort-seeker',
      badge: '⚔️',
      titleEn: 'Sahyadri Fort Seeker',
      titleMr: 'सह्याद्री दुर्गवीर',
      descEn: 'Conquered iconic forts around Pune (Sinhagad, Lohagad).',
      descMr: 'पुण्याभोवतीचे २+ ऐतिहासिक गड-किल्ले सर केले.',
      isUnlocked: (stats.categoriesExplored.find((c) => c.category === 'forts')?.count || 0) >= 2,
      unlockedAt: (stats.categoriesExplored.find((c) => c.category === 'forts')?.count || 0) >= 2 ? latestDateFormatted : undefined,
      progress: Math.min(stats.categoriesExplored.find((c) => c.category === 'forts')?.count || 0, 2),
      target: 2,
    },
    {
      id: 'pune-explorer',
      badge: '🎖️',
      titleEn: 'True Punekar Explorer',
      titleMr: 'अस्सल पुणेकर प्रवासी',
      descEn: 'Explored 10+ distinct landmarks across Pune.',
      descMr: 'पुण्यातील १० हून अधिक विविध प्रेक्षणीय स्थळे अनुभवली.',
      isUnlocked: stats.totalPlacesVisited >= 10,
      unlockedAt: stats.totalPlacesVisited >= 10 ? latestDateFormatted : undefined,
      progress: Math.min(stats.totalPlacesVisited, 10),
      target: 10,
    },
    {
      id: 'trail-master',
      badge: '🗺️',
      titleEn: 'Sahyadri Calling',
      titleMr: 'सह्याद्रीची साद',
      descEn: 'Completed over 50 km of exploration journeys in Pune.',
      descMr: 'पुणे व परिसरात ५० किमीहून अधिक अंतराची यशस्वी सफर पूर्ण केली.',
      isUnlocked: stats.totalDistanceKm >= 50,
      unlockedAt: stats.totalDistanceKm >= 50 ? latestDateFormatted : undefined,
      progress: Math.min(Math.round(stats.totalDistanceKm), 50),
      target: 50,
    },
  ];
}

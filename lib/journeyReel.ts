'use client';

import { DayJourney, JourneyPlaceStop } from '@/lib/journeyStorage';
import { getDestinationProfile } from '@/lib/destinationIntelligence';
import { REAL_SONG_CATALOG, ReelSongTrack } from '@/lib/reelSongLibrary';

export interface JourneyReelMusicTrack {
  id: string;
  title: string;
  titleMr?: string;
  artist: string;
  mood: 'adventure' | 'heritage' | 'spiritual' | 'ambient' | 'nature' | 'food';
  license: string;
  source: string;
  attributionRequired: boolean;
  audioGeneratorType: 'fort_adventure' | 'heritage_classical' | 'peaceful_flute' | 'lakeside_chill' | 'pune_ambient' | 'food_trail';
  descriptionEn: string;
  descriptionMr: string;
  vocalLanguage?: string;
  isRealVocalSong?: boolean;
}

export const REEL_MUSIC_TRACKS: JourneyReelMusicTrack[] = [
  // 1. Authentic Marathi & Hindi Vocal Songs
  {
    id: 'song-sahyadri-powada',
    title: 'Garja Sahyadri (गरजा सह्याद्री - पोवाडा)',
    titleMr: 'गरजा सह्याद्री • वीररस पोवाडा व ढोल नाद',
    artist: 'Traditional Lokshahir Ensemble',
    mood: 'adventure',
    license: 'Royalty-Free Traditional Cultural Heritage',
    source: 'Real Marathi Folk Vocal & Dhol-Tasha',
    attributionRequired: false,
    audioGeneratorType: 'fort_adventure',
    descriptionEn: 'Passionate Lokshahir vocal chant and thunderous Puneri dhol beats for Sahyadri forts.',
    descriptionMr: 'किल्ल्यांच्या डोंगररांगा, वारा आणि साहसी दुर्गभ्रमंतीला साजेसा अस्सल मराठी शाहिरी आवाज.',
    vocalLanguage: 'Marathi',
    isRealVocalSong: true,
  },
  {
    id: 'song-dagdusheth-aarti',
    title: 'Majha Ganaraya (माझा गणराया - अभंग)',
    titleMr: 'माझा गणराया • दगडूशेठ भक्तिरस अभंग व बासरी',
    artist: 'Pune Devotional Sangeet Mandali',
    mood: 'spiritual',
    license: 'Royalty-Free Traditional Abhang',
    source: 'Authentic Marathi Abhang & Temple Flute',
    attributionRequired: false,
    audioGeneratorType: 'peaceful_flute',
    descriptionEn: 'Pure melodic female & chorus devotional singing with pakhawaj and bansuri flute.',
    descriptionMr: 'दगडूशेठ व पवित्र मंदिरांसाठी मनःशांती देणारा मंजुळ अभंग आणि घंटानाद.',
    vocalLanguage: 'Marathi',
    isRealVocalSong: true,
  },
  {
    id: 'song-peshwa-tarana',
    title: 'Shaniwar Wada Tarana (पेशवाई तराना)',
    titleMr: 'पेशवाई तराना • शास्त्रीय सतार, तानपुरा व बोल',
    artist: 'Maharashtra Classical Heritage Ensemble',
    mood: 'heritage',
    license: 'Royalty-Free Classical Heritage',
    source: 'Royal 18th-Century Classical Vocal Tarana',
    attributionRequired: false,
    audioGeneratorType: 'heritage_classical',
    descriptionEn: 'Regal acoustic sitar, tanpura, and classical vocal tarana in Raga Bhupali.',
    descriptionMr: 'वाडे, कमानी आणि पेशवाई वैभवाला उजाळा देणारे शास्त्रीय सतार, तानपुरा व बोल.',
    vocalLanguage: 'Sanskrit / Classical',
    isRealVocalSong: true,
  },
  {
    id: 'song-roohani-pune',
    title: 'Roohani Pune (रूहानी पुणे - हिंदी गझल)',
    titleMr: 'रूहानी पुणे • शांत सायंकाळ, गझल व गिटार',
    artist: 'Deccan Acoustic Collective',
    mood: 'ambient',
    license: 'Royalty-Free Original Vocal',
    source: 'Acoustic Guitar & Soulful Hindi Vocals',
    attributionRequired: false,
    audioGeneratorType: 'pune_ambient',
    descriptionEn: 'Warm acoustic guitar chords and soulful Hindi vocals reminiscing Pune’s charm.',
    descriptionMr: 'पुण्याच्या विविध पेठा, टेकड्या व सांस्कृतिक ठिकाणांसाठी भावपूर्ण गझल सूर.',
    vocalLanguage: 'Hindi',
    isRealVocalSong: true,
  },
  {
    id: 'song-puneri-khadya-jingle',
    title: 'Puneri Chawad (पुणेरी चवदार कट्टा)',
    titleMr: 'पुणेरी चवदार कट्टा • झणझणीत मिसळ व चहा ताल',
    artist: 'Pune Street Food Beats Collective',
    mood: 'food',
    license: 'Royalty-Free Original Vocal',
    source: 'Fast Folk Percussion & Street Vocals',
    attributionRequired: false,
    audioGeneratorType: 'food_trail',
    descriptionEn: 'Upbeat rhythmic dholak and lively Marathi vocals for food trails and culinary crawls.',
    descriptionMr: 'झणझणीत मिसळ, मस्तानी आणि चहाच्या कट्ट्यासाठी वेगवान चविष्ट संगीत.',
    vocalLanguage: 'Marathi',
    isRealVocalSong: true,
  },
  {
    id: 'song-sahyadri-breeze',
    title: 'Lakeside Bliss (खडकवासला संथ लाटा)',
    titleMr: 'खडकवासला संथ लाटा • निसर्ग सूर व बासरी',
    artist: 'Sahyadri Nature Waves',
    mood: 'nature',
    license: 'Royalty-Free Creative Commons Open',
    source: 'Lake Water Waves & Soft Bansuri Humming',
    attributionRequired: false,
    audioGeneratorType: 'lakeside_chill',
    descriptionEn: 'Gentle acoustic piano, soft bansuri flute, and peaceful water ripple resonance.',
    descriptionMr: 'तलाव, धरण आणि हिरवेगार टेकड्यांच्या भ्रमंतीसाठी सुखद व शांत संगीत.',
    vocalLanguage: 'Vocal Humming',
    isRealVocalSong: true,
  },
  // 2. Ambient Synthesized Classics
  {
    id: 'track-sahydri-adventure',
    title: 'Sahyadri Bastion Trail',
    titleMr: 'सह्याद्री दुर्ग नाद',
    artist: 'Explore Pune Studio',
    mood: 'adventure',
    license: 'Royalty-Free CC0',
    source: 'Built-in Authentic Ambient Synth',
    attributionRequired: false,
    audioGeneratorType: 'fort_adventure',
    descriptionEn: 'Epic mountain winds, deep rhythmic cadence, and heroic Sahyadri adventure atmosphere.',
    descriptionMr: 'किल्ल्यांच्या डोंगररांगा, वारा आणि साहसी दुर्गभ्रमंतीला साजेसे वीररस संगीत.',
    isRealVocalSong: false,
  },
  {
    id: 'track-peshwa-heritage',
    title: 'Peshwa Royal Raga',
    titleMr: 'पेशवेकालीन राजदरबार',
    artist: 'Pune Cultural Heritage Ensemble',
    mood: 'heritage',
    license: 'Royalty-Free CC0',
    source: 'Built-in Authentic Classical Acoustic',
    attributionRequired: false,
    audioGeneratorType: 'heritage_classical',
    descriptionEn: 'Warm acoustic sitar and tanpura harmonics echoing Pune’s historic 18th-century wadas.',
    descriptionMr: 'वाडे, कमानी आणि पेशवाई वैभवाला उजाळा देणारे शास्त्रीय सतार व तानपुरा सूर.',
    isRealVocalSong: false,
  },
  {
    id: 'track-sacred-peace',
    title: 'Sacred Sanctum Flute',
    titleMr: 'पवित्र बासरी व घंटानाद',
    artist: 'Deccan Spiritual Soundscapes',
    mood: 'spiritual',
    license: 'Royalty-Free CC0',
    source: 'Built-in Authentic Meditative Acoustic',
    attributionRequired: false,
    audioGeneratorType: 'peaceful_flute',
    descriptionEn: 'Peaceful bansuri flute notes and tranquil chimes for sacred shrines and rock-cut caves.',
    descriptionMr: 'दगडूशेठ व पाताळेश्वरसाठी मनःशांती देणारी मंजुळ बासरी आणि घंटानाद.',
    isRealVocalSong: false,
  },
  {
    id: 'track-lakeside-chill',
    title: 'Khadakwasla Ripple Breeze',
    titleMr: 'खडकवासला संथ लाटा',
    artist: 'Sahyadri Nature Waves',
    mood: 'nature',
    license: 'Royalty-Free CC0',
    source: 'Built-in Nature Waves & Piano',
    attributionRequired: false,
    audioGeneratorType: 'lakeside_chill',
    descriptionEn: 'Gentle acoustic piano chords and soft water ripple resonance for lakes, dams, and nature.',
    descriptionMr: 'तलाव, धरण आणि हिरवेगार टेकड्यांच्या भ्रमंतीसाठी सुखद व शांत संगीत.',
    isRealVocalSong: false,
  },
  {
    id: 'track-pune-ambient',
    title: 'Pune Morning Panorama',
    titleMr: 'पुणे प्रभात धून',
    artist: 'Explore Pune Collective',
    mood: 'ambient',
    license: 'Royalty-Free CC0',
    source: 'Built-in Morning Acoustic Shimmer',
    attributionRequired: false,
    audioGeneratorType: 'pune_ambient',
    descriptionEn: 'Bright, balanced travel acoustic melodies suitable for all city landmarks and street walks.',
    descriptionMr: 'पुण्याच्या विविध पेठा व सांस्कृतिक ठिकाणांसाठी प्रसन्न प्रभात धून.',
    isRealVocalSong: false,
  },
];

export interface ReelPlaceItem {
  placeId: string;
  placeSlug: string;
  placeName: string;
  placeNameMr?: string;
  category: string;
  categoryName?: string;
  categoryNameMr?: string;
  locationSubtitle?: string;
  elevation?: string;
  visitedAt?: string;
  quoteEn?: string;
  quoteMr?: string;
  photos: string[];
}

export type ReelVisualScene =
  | {
      type: 'intro';
      title: string;
      titleMr?: string;
      dateLabel: string;
      dateLabelMr?: string;
      placesCount: number;
      totalDistanceKm: number;
    }
  | {
      type: 'place_intro';
      place: ReelPlaceItem;
      placeIndex: number;
      totalPlaces: number;
    }
  | {
      type: 'place_photo';
      place: ReelPlaceItem;
      photoUrl: string;
      photoIndex: number;
      totalPhotosInPlace: number;
      placeIndex: number;
      totalPlaces: number;
    }
  | {
      type: 'outro';
      journeyTitle: string;
      journeyTitleMr?: string;
      dateLabel: string;
      placesCount: number;
      totalDistanceKm: number;
      placesSummary: string[];
    };

export interface JourneyReelData {
  id: string;
  journeyId: string;
  title: string;
  titleMr?: string;
  type: 'today' | 'overall' | 'custom';
  date: string;
  places: ReelPlaceItem[];
  reel: {
    duration: number; // in seconds
    music: JourneyReelMusicTrack;
    style: 'cinematic' | 'adventure' | 'heritage' | 'spiritual' | 'food' | 'nature' | 'minimal';
    generatedAt: string;
  };
}

const STORAGE_KEY_REELS = 'explore_pune_generated_reels_v1';
const STORAGE_KEY_PLACE_PHOTOS = 'explore_pune_place_photos_v1';

// Default place location details & poetic descriptions
const PLACE_METADATA_EXTRAS: Record<
  string,
  {
    subtitle: string;
    elevation?: string;
    quoteEn: string;
    quoteMr: string;
  }
> = {
  'sinhagad-fort': {
    subtitle: 'Sahyadri Fortress • Pune, MH',
    elevation: 'Elevation 1,312 m',
    quoteEn: '“Where mountain winds whisper centuries of Maratha valour.”',
    quoteMr: '“सह्याद्रीच्या कड्यांवर धुक्याची चादर आणि असीम पराक्रमाची साक्ष.”',
  },
  'shaniwar-wada': {
    subtitle: 'Historic Peshwa Seat • Pune, MH',
    elevation: 'Built 1732 AD',
    quoteEn: '“Echoes of the Peshwa court standing tall through the teak gates.”',
    quoteMr: '“भव्य दिल्ली दरवाजा आणि पेशवेकालीन पराक्रमाच्या जिवंत आठवणी.”',
  },
  'lal-mahal': {
    subtitle: 'Childhood Home of Chhatrapati Shivaji Maharaj',
    elevation: 'Kasba Peth, Pune',
    quoteEn: '“Sacred grounds where Shivaji Maharaj spent his formative youth.”',
    quoteMr: '“छत्रपती शिवरायांच्या बालपणीच्या पाऊलखुणा आणि जिजाऊंचे संस्कार.”',
  },
  'aga-khan-palace': {
    subtitle: 'Freedom Heritage & Italian Arches • Pune, MH',
    elevation: 'Built 1892 AD',
    quoteEn: '“Italian arches embracing quiet memories of India’s freedom dawn.”',
    quoteMr: '“इटालियन कमानी आणि स्वातंत्र्यलढ्याच्या मूक आठवणींचे शांत उद्यान.”',
  },
  'pataleshwar-cave-temple': {
    subtitle: '8th-Century Rock-Cut Monolith • JM Road',
    elevation: 'Rashtrakuta Dynasty',
    quoteEn: '“Carved directly from living basalt stone twelve centuries ago.”',
    quoteMr: '“८व्या शतकातील अखंड काळ्या पाषाणात कोरलेले गूढ व शांत शिवमंदिर.”',
  },
  'khadakwasla-dam': {
    subtitle: 'Serene Foothills & Lake • Pune, MH',
    elevation: 'Basin of Sinhagad',
    quoteEn: '“Cool morning ripples reflecting southern Sahyadri ridge lines.”',
    quoteMr: '“खडकवासल्याच्या संथ लाटा आणि सह्याद्रीच्या टेकड्यांचे सुंदर प्रतिबिंब.”',
  },
  'shreemant-dagdusheth-halwai-ganpati': {
    subtitle: 'Beloved City Deity • Budhwar Peth',
    elevation: 'Established 1893 AD',
    quoteEn: '“Golden benevolence and peaceful darshan in the heart of Pune.”',
    quoteMr: '“पुण्याच्या हृदयात मंगलमूर्तीचे मनःशांती देणारे सुवर्ण दर्शन.”',
  },
  'lohagad-fort': {
    subtitle: 'The Iron Fortress • Pavana Basin',
    elevation: 'Elevation 1,033 m',
    quoteEn: '“Vinchukata fortification guarding the historic trade routes.”',
    quoteMr: '“पवना जलाशयावर पहारा देणारा अजिंक्य लोहदुर्ग आणि विंचूकाटा.”',
  },
  'raja-dinkar-kelkar-museum': {
    subtitle: '20,000 Rare Artifacts • Shukrawar Peth',
    elevation: 'Established 1962 AD',
    quoteEn: '“Extraordinary collection of carved teak, instruments, and Mastani Mahal.”',
    quoteMr: '“भारतीय कारागिरीचा आणि दुर्मिळ ऐतिहासिक वस्तूंचा अद्वितीय खजिना.”',
  },
};

/**
 * Smart Place-Based Music Recommendation Scoring Engine
 * Scoring: Place Category + Journey Mood + Photo Count
 */
export function getRecommendedMusic(
  places: Array<{ category: string; placeId?: string; placeSlug?: string }>,
  preferredMood?: string
): { recommended: JourneyReelMusicTrack; alternatives: JourneyReelMusicTrack[] } {
  if (preferredMood) {
    const matched = REEL_MUSIC_TRACKS.find((t) => t.mood === preferredMood);
    if (matched) {
      return {
        recommended: matched,
        alternatives: REEL_MUSIC_TRACKS.filter((t) => t.id !== matched.id),
      };
    }
  }

  // Count categories
  let fortCount = 0;
  let heritageCount = 0;
  let templeCount = 0;
  let natureCount = 0;
  let foodCount = 0;

  for (const p of places) {
    const cat = (p.category || '').toLowerCase();
    const id = (p.placeId || p.placeSlug || '').toLowerCase();

    if (cat.includes('fort') || id.includes('fort') || id.includes('sinhagad') || id.includes('lohagad')) {
      fortCount += 2;
    } else if (cat.includes('temple') || cat.includes('sacred') || id.includes('ganpati') || id.includes('pataleshwar')) {
      templeCount += 2;
    } else if (cat.includes('food') || cat.includes('culinary') || id.includes('misal') || id.includes('bakery') || id.includes('fc-road')) {
      foodCount += 2;
    } else if (cat.includes('heritage') || cat.includes('palace') || cat.includes('museum') || id.includes('wada')) {
      heritageCount += 2;
    } else if (cat.includes('nature') || cat.includes('lake') || cat.includes('dam') || cat.includes('park')) {
      natureCount += 2;
    }
  }

  let recommendedTrack = REEL_MUSIC_TRACKS[3]; // Roohani Pune fallback

  if (fortCount >= Math.max(heritageCount, templeCount, natureCount, foodCount) && fortCount > 0) {
    recommendedTrack = REEL_MUSIC_TRACKS[0]; // Garja Sahyadri Powada
  } else if (templeCount >= Math.max(heritageCount, natureCount, foodCount) && templeCount > 0) {
    recommendedTrack = REEL_MUSIC_TRACKS[1]; // Majha Ganaraya Abhang
  } else if (heritageCount >= Math.max(natureCount, foodCount) && heritageCount > 0) {
    recommendedTrack = REEL_MUSIC_TRACKS[2]; // Peshwa Tarana
  } else if (foodCount > 0 && foodCount >= natureCount) {
    recommendedTrack = REEL_MUSIC_TRACKS[4]; // Puneri Chawad
  } else if (natureCount > 0) {
    recommendedTrack = REEL_MUSIC_TRACKS[5]; // Lakeside Bliss
  }

  const alternatives = REEL_MUSIC_TRACKS.filter((t) => t.id !== recommendedTrack.id);

  return { recommended: recommendedTrack, alternatives };
}

/**
 * Builds ReelPlaceItem array from DayJourney or JourneyPlaceStop[]
 */
export function buildReelPlacesFromJourney(journey: DayJourney): ReelPlaceItem[] {
  const customPhotosMap = getStoredCustomPhotosMap();
  const rawStops = journey.places && journey.places.length > 0 ? journey.places : [];

  // Filter to visited stops, or if none visited yet, use all planned stops
  let targetStops = rawStops.some((p) => p.isVisited)
    ? rawStops.filter((p) => p.isVisited)
    : rawStops;

  // Safety fallback: If journey currently has 0 stops, provide iconic Pune landmarks so reel always renders visually
  if (targetStops.length === 0) {
    targetStops = [
      {
        placeId: 'shaniwar-wada',
        placeSlug: 'shaniwar-wada',
        placeName: 'Shaniwar Wada',
        placeNameMr: 'शनिवार वाडा',
        category: 'heritage',
        categoryName: 'Peshwa Heritage',
        categoryNameMr: 'पेशवेकालीन वारसा',
        image_url: '/images/places/shaniwar-wada.jpg',
        latitude: 18.5196,
        longitude: 73.8553,
        order: 1,
        isVisited: true,
      },
      {
        placeId: 'aga-khan-palace',
        placeSlug: 'aga-khan-palace',
        placeName: 'Aga Khan Palace',
        placeNameMr: 'आगा खान पॅलेस',
        category: 'heritage',
        categoryName: 'National Monument',
        categoryNameMr: 'राष्ट्रीय स्मारक',
        image_url: '/images/places/aga-khan-palace.jpg',
        latitude: 18.5529,
        longitude: 73.9015,
        order: 2,
        isVisited: true,
      },
      {
        placeId: 'sinhagad-fort',
        placeSlug: 'sinhagad-fort',
        placeName: "Sinhagad Fort (Lion's Fort)",
        placeNameMr: 'सिंहगड किल्ला (कोंढाणा)',
        category: 'forts',
        categoryName: 'Sahyadri Fortress',
        categoryNameMr: 'सह्याद्री दुर्ग',
        image_url: '/images/places/sinhagad-fort.jpg',
        latitude: 18.3664,
        longitude: 73.7558,
        order: 3,
        isVisited: true,
      },
    ];
  }

  return targetStops.map((stop) => {
    const slug = stop.placeSlug || stop.placeId || 'pune-landmark';
    const profile = getDestinationProfile(stop);
    const extra = PLACE_METADATA_EXTRAS[slug] || PLACE_METADATA_EXTRAS[stop.placeId] || {
      subtitle: `${stop.categoryName || profile.themeNameEn} • Pune, MH`,
      elevation: undefined,
      quoteEn: stop.note || profile.narrativeCurve.climaxQuoteEn,
      quoteMr: stop.noteMr || profile.narrativeCurve.climaxQuoteMr,
    };

    // Photos: Check custom uploaded photos, then stop photos, then primary image_url
    const userUploaded = customPhotosMap[stop.placeId] || customPhotosMap[slug] || [];
    const stopPhotos = stop.photos || [];
    const fallbackImage = stop.image_url || '/images/places/shaniwar-wada.jpg';

    const combinedPhotos = Array.from(new Set([...userUploaded, ...stopPhotos, fallbackImage])).filter(Boolean);

    return {
      placeId: stop.placeId,
      placeSlug: slug,
      placeName: stop.placeName,
      placeNameMr: stop.placeNameMr || stop.placeName,
      category: stop.category,
      categoryName: stop.categoryName || 'Pune Landmark',
      categoryNameMr: stop.categoryNameMr || 'पुणे प्रेक्षणीय स्थळ',
      locationSubtitle: extra.subtitle,
      elevation: extra.elevation,
      visitedAt: stop.visitedAt || stop.arrivalTime,
      quoteEn: extra.quoteEn,
      quoteMr: extra.quoteMr,
      photos: combinedPhotos.length > 0 ? combinedPhotos : [fallbackImage],
    };
  });
}

/**
 * Builds the complete One-Reel Scene List
 * Structure:
 * 1. Intro (0-2.5 sec)
 * 2. For each place:
 *    - Place intro billboard (1.8 sec)
 *    - Place photo(s) (2.8 sec each)
 * 3. Outro recap (3.5 sec)
 */
export function buildOneReelSceneSequence(
  reelData: JourneyReelData
): { scenes: ReelVisualScene[]; totalScenes: number; estimatedDurationSeconds: number } {
  const scenes: ReelVisualScene[] = [];
  const places = reelData.places || [];

  // 1. Opening Intro Scene
  scenes.push({
    type: 'intro',
    title: reelData.title || 'My Pune Journey',
    titleMr: reelData.titleMr || 'माझा पुणे प्रवास',
    dateLabel: reelData.date,
    placesCount: places.length,
    totalDistanceKm: places.length * 5.2, // estimated
  });

  // 2. Sequential Place Introductions and Photos
  places.forEach((place, placeIdx) => {
    // Elegant Place Introduction Screen (e.g. "SINHAGAD / Pune, Maharashtra")
    scenes.push({
      type: 'place_intro',
      place,
      placeIndex: placeIdx + 1,
      totalPlaces: places.length,
    });

    // Place Photos
    const photosToDisplay = place.photos && place.photos.length > 0 ? place.photos : ['/images/places/shaniwar-wada.jpg'];
    // Limit to 3 photos max per place to prevent reels from becoming endlessly long
    const cappedPhotos = photosToDisplay.slice(0, 3);

    cappedPhotos.forEach((photoUrl, photoIdx) => {
      scenes.push({
        type: 'place_photo',
        place,
        photoUrl,
        photoIndex: photoIdx + 1,
        totalPhotosInPlace: cappedPhotos.length,
        placeIndex: placeIdx + 1,
        totalPlaces: places.length,
      });
    });
  });

  // 3. Closing Outro Scene
  scenes.push({
    type: 'outro',
    journeyTitle: reelData.title,
    journeyTitleMr: reelData.titleMr,
    dateLabel: reelData.date,
    placesCount: places.length,
    totalDistanceKm: places.length * 5.2,
    placesSummary: places.map((p) => p.placeName),
  });

  // Calculate estimated duration
  // Intro: 2.5s, each place_intro: 1.8s, each photo: 2.8s, Outro: 3.5s
  let duration = 2.5 + 3.5;
  for (const s of scenes) {
    if (s.type === 'place_intro') duration += 1.8;
    if (s.type === 'place_photo') duration += 2.8;
  }

  return {
    scenes,
    totalScenes: scenes.length,
    estimatedDurationSeconds: Math.round(duration),
  };
}

/**
 * LocalStorage Helpers for Generated Reels
 */
export function saveGeneratedReel(reel: JourneyReelData, userId?: string | null): void {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return;
  try {
    const key = userId ? `${STORAGE_KEY_REELS}_${userId}` : STORAGE_KEY_REELS;
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    const list: JourneyReelData[] = raw ? JSON.parse(raw) : [];

    // Replace if id exists, or unshift
    const idx = list.findIndex((r) => r.id === reel.id || r.journeyId === reel.journeyId);
    if (idx >= 0) {
      list[idx] = reel;
    } else {
      list.unshift(reel);
    }
    if (list.length > 20) list.length = 20;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(list));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('explore-pune-reel-saved', { detail: reel }));
    }
  } catch (err) {
    console.warn('Failed to save generated reel:', err);
  }
}

export function getSavedReels(userId?: string | null): JourneyReelData[] {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return [];
  try {
    const key = userId ? `${STORAGE_KEY_REELS}_${userId}` : STORAGE_KEY_REELS;
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLatestReelForJourney(journeyId: string, userId?: string | null): JourneyReelData | null {
  const reels = getSavedReels(userId);
  return reels.find((r) => r.journeyId === journeyId) || null;
}

/**
 * LocalStorage for user-uploaded custom place photos
 */
function getStoredCustomPhotosMap(): Record<string, string[]> {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return {};
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_PLACE_PHOTOS) : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomPlacePhotos(placeId: string, photos: string[]): void {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return;
  try {
    const map = getStoredCustomPhotosMap();
    map[placeId] = photos;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PLACE_PHOTOS, JSON.stringify(map));
    }
  } catch (err) {
    console.warn('Failed to store place photos:', err);
  }
}

/**
 * Client-side Canvas Image Compressor
 * Converts File to web-friendly optimized JPEG data URL to prevent localStorage exhaustion
 */
export async function compressUploadedPhoto(file: File, maxDim = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

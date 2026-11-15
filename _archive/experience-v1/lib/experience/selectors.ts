/**
 * Pune Through Time — Experience Platform Data Selectors
 * Grounded in data/pune_places_106.json and verified historical records.
 *
 * Rules:
 * - 15 total cataloged forts, 7 featured high-altitude forts
 * - Shaniwar Wada hours: 09:30 AM – 05:30 PM (ASI verified)
 * - Raja Dinkar Kelkar Museum: 20,000+ Indian artifacts
 * - Realistic dwell & walking time calculation
 * - Karla Caves radius gating (<25km excluded for short/halfDay trips)
 * - getTodaysPeth() for day-of-week historic Pune Peth
 */

import placesData from '@/data/pune_places_106.json';
import {
  ExperiencePlace,
  ITINERARY_TEMPLATES,
  FORTS_ADVENTURE_DATA,
  EXPERIENCE_CATEGORIES,
  ItineraryTemplate,
  FortAdventure,
} from '@/lib/experienceData';

export const ALL_EXPERIENCE_PLACES: ExperiencePlace[] = placesData as ExperiencePlace[];

// Pune City Center coordinates (Zero Stone Pune / Historic Core)
export const PUNE_CENTER_COORDINATES = {
  latitude: 18.5204,
  longitude: 73.8567,
} as const;

/**
 * Calculates straight-line distance in kilometres using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number = PUNE_CENTER_COORDINATES.latitude,
  lng2: number = PUNE_CENTER_COORDINATES.longitude
): number {
  if (typeof lat1 !== 'number' || typeof lng1 !== 'number') return 0;
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat1 - lat2) * Math.PI) / 180;
  const dLon = ((lng1 - lng2) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat2 * Math.PI) / 180) *
      Math.cos((lat1 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// -------------------------------------------------------------
// Core Place Selectors
// -------------------------------------------------------------

export function getAllPlaces(): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES;
}

export function getPlaceBySlug(slug: string): ExperiencePlace | undefined {
  return ALL_EXPERIENCE_PLACES.find((p) => p.slug === slug);
}

export function getPlacesByCategory(categorySlug: string): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES.filter((p) => p.category_slug === categorySlug);
}

/**
 * Returns all 15 cataloged forts in the Pune district catalog
 */
export function getCatalogedForts(): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES.filter((p) => p.category_slug === 'forts');
}

/**
 * Returns the 7 featured high-altitude forts with deep adventure profiles
 */
export function getFeaturedForts(): FortAdventure[] {
  return FORTS_ADVENTURE_DATA;
}

export function getHeritagePlaces(): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES.filter((p) => p.category_slug === 'heritage');
}

export function getSpiritualPlaces(): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES.filter((p) => p.category_slug === 'temples');
}

export function getNaturePlaces(): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES.filter(
    (p) => p.category_slug === 'nature' || p.category_slug === 'parks'
  );
}

export function getFoodPlaces(): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES.filter((p) => p.category_slug === 'food');
}

export function getPlacesInRadius(
  lat: number,
  lng: number,
  maxRadiusKm: number
): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES.filter((p) => {
    const dist = calculateDistanceKm(p.latitude, p.longitude, lat, lng);
    return dist <= maxRadiusKm;
  });
}

// -------------------------------------------------------------
// CHAPTER 0: PRELOADER SELECTORS
// -------------------------------------------------------------

export interface PreloaderStats {
  totalDestinations: number;
  catalogedForts: number;
  featuredForts: number;
  templeSanctuaries: number;
  heritageWadas: number;
  natureTekdis: number;
  curatedMuseums: number;
  culinaryTraditions: number;
  centuriesOfHistory: number; // 8th Century to 21st Century = 13 centuries
  verifiedDataRate: number; // Percentage verified
}

export function getPreloaderStats(): PreloaderStats {
  const catalogedForts = getCatalogedForts().length; // 15
  const featuredForts = getFeaturedForts().length; // 7
  const templeSanctuaries = getSpiritualPlaces().length; // 27
  const heritageWadas = getHeritagePlaces().length; // 29
  const natureTekdis = getNaturePlaces().length; // 20 (14 nature + 6 parks)
  const curatedMuseums = getPlacesByCategory('museums').length; // 9
  const culinaryTraditions = getFoodPlaces().length; // 6

  return {
    totalDestinations: ALL_EXPERIENCE_PLACES.length, // 106
    catalogedForts,
    featuredForts,
    templeSanctuaries,
    heritageWadas,
    natureTekdis,
    curatedMuseums,
    culinaryTraditions,
    centuriesOfHistory: 13,
    verifiedDataRate: 100,
  };
}

// -------------------------------------------------------------
// CHAPTER 1: ARRIVAL SELECTORS
// -------------------------------------------------------------

export interface ArrivalHeroData {
  place: ExperiencePlace;
  altitudeMeters: number;
  altitudeFeet: number;
  distanceFromPuneKm: number;
  historicBattleYear: number;
  keyFeature: string;
  keyFeatureMr: string;
}

export function getArrivalHeroData(): ArrivalHeroData {
  const sinhagad =
    getPlaceBySlug('sinhagad-fort') ||
    ALL_EXPERIENCE_PLACES.find((p) => p.category_slug === 'forts')!;

  return {
    place: sinhagad,
    altitudeMeters: 1312,
    altitudeFeet: 4304,
    distanceFromPuneKm: 30,
    historicBattleYear: 1670,
    keyFeature: 'Monolithic bastion ridge guarding the Sahyadri gateway to Pune',
    keyFeatureMr: 'पुण्याच्या सह्याद्री प्रवेशद्वाराचे रक्षण करणारा अभेद्य नरवीर गड',
  };
}

// -------------------------------------------------------------
// CHAPTER 2: HISTORICAL EPOCHS SELECTORS
// -------------------------------------------------------------

export interface HistoricalEpoch {
  id: 'ancient-monolith' | 'maratha-swarajya' | 'peshwa-zenith' | 'renaissance-reform';
  eraNameEn: string;
  eraNameMr: string;
  timeframeEn: string;
  timeframeMr: string;
  headlineEn: string;
  headlineMr: string;
  narrativeEn: string;
  narrativeMr: string;
  focalPlaceSlug: string;
  focalPlace?: ExperiencePlace;
  associatedPlaceSlugs: string[];
  associatedPlaces: ExperiencePlace[];
  architecturalStyleEn: string;
  architecturalStyleMr: string;
}

export function getHistoricalEpochs(): HistoricalEpoch[] {
  return [
    {
      id: 'ancient-monolith',
      eraNameEn: 'Rashtrakuta & Early Rock-Cut Era',
      eraNameMr: 'राष्ट्रकूट व प्राचीन शैलोत्कीर्ण काळ',
      timeframeEn: '8th Century CE (c. 750–900 CE)',
      timeframeMr: 'इ.स. ८ वे शतक',
      headlineEn: 'Subterranean Basalt Shrines & Ancient Crossroads',
      headlineMr: 'जमीन खोदून कोरलेली भव्य बेसाल्ट लेणी व प्राचीन वस्ती',
      narrativeEn:
        'Carved contemporaneously with Ellora caves from a single monolithic basalt bed, Pataleshwar Cave Temple establishes Punyavishaya as an ancient Shaivite sanctuary and trans-Sahyadri trade route.',
      narrativeMr:
        'वेरूळच्या लेण्यांच्या समकालीन एकाच काळ्या कातळात कोरलेले पाताळेश्वर मंदिर. शिवकालीन पुण्याच्या शतकोन्-शतके आधी हे क्षेत्र पुण्यविषय म्हणून प्रसिद्ध होते.',
      focalPlaceSlug: 'pataleshwar-cave-temple',
      focalPlace: getPlaceBySlug('pataleshwar-cave-temple'),
      associatedPlaceSlugs: ['pataleshwar-cave-temple', 'karla-caves', 'bhaja-caves'],
      associatedPlaces: ['pataleshwar-cave-temple', 'karla-caves', 'bhaja-caves']
        .map(getPlaceBySlug)
        .filter((p): p is ExperiencePlace => Boolean(p)),
      architecturalStyleEn: 'Monolithic Rock-Cut Basalt Architecture',
      architecturalStyleMr: 'एकाश्म कातळ-खोदीव बेसाल्ट शिल्पकला',
    },
    {
      id: 'maratha-swarajya',
      eraNameEn: 'Chhatrapati Shivaji Maharaj & Hindavi Swarajya',
      eraNameMr: 'छत्रपती शिवाजी महाराज व हिंदवी स्वराज्य',
      timeframeEn: '17th Century CE (1630–1680 CE)',
      timeframeMr: 'इ.स. १७ वे शतक',
      headlineEn: 'The Cradle of Swarajya & Sahyadri Strongholds',
      headlineMr: 'स्वराज्याची जननी आणि सह्याद्रीचे अजिंक्य गड-किल्ले',
      narrativeEn:
        'From childhood in Lal Mahal under Rajmata Jijau to conquering Torna at 16, establishing Sinhagad as the southern shield, and outwitting Mughal forces through master guerrilla warfare.',
      narrativeMr:
        'राजमाता जिजाऊंच्या संस्कारांत लाल महालात बालपण, वयाच्या अवघ्या १६ व्या वर्षी तोरणा जिंकून स्वराज्याची उभारणी, आणि सिंहगडावरून सह्याद्रीचे रक्षण.',
      focalPlaceSlug: 'sinhagad-fort',
      focalPlace: getPlaceBySlug('sinhagad-fort'),
      associatedPlaceSlugs: ['sinhagad-fort', 'lal-mahal', 'rajgad-fort', 'torna-fort', 'kasba-ganpati'],
      associatedPlaces: ['sinhagad-fort', 'lal-mahal', 'rajgad-fort', 'torna-fort', 'kasba-ganpati']
        .map(getPlaceBySlug)
        .filter((p): p is ExperiencePlace => Boolean(p)),
      architecturalStyleEn: 'Dry-Stone Bastions, Machis & Fortress Gateways',
      architecturalStyleMr: 'चिरेबंदी तटबंदी, माच्या आणि गोमुखी प्रवेशद्वारे',
    },
    {
      id: 'peshwa-zenith',
      eraNameEn: 'Peshwa Era & The Wada Capital',
      eraNameMr: 'पेशवे काळ आणि शनिवार वाड्याची राजधानी',
      timeframeEn: '18th to Early 19th Century (1714–1818 CE)',
      timeframeMr: 'इ.स. १८ वे ते १९ वे शतक',
      headlineEn: 'Imperial Governance, Teak Palaces & 18 Bazaars',
      headlineMr: 'साम्राज्याची राजधानी, लाकडी वाडे आणि १८ पेठांचा विस्तार',
      narrativeEn:
        'Peshwa Bajirao I transforms Pune into the political capital of India. The massive 7-storey Shaniwar Wada, ornate Vishrambaug timber facades, and 18 weekday peths flourish across the river basin.',
      narrativeMr:
        'थोरले बाजीराव पेशव्यांनी शनिवार वाडा बांधून पुण्याला राजधानी केले. अष्टकोनी कारंजे, सागवानी खांबांचे वाडे आणि आठवड्याच्या वारांनुसार १८ पेठांची स्थापना झाली.',
      focalPlaceSlug: 'shaniwar-wada',
      focalPlace: getPlaceBySlug('shaniwar-wada'),
      associatedPlaceSlugs: ['shaniwar-wada', 'vishrambaug-wada', 'parvati-hill', 'tulshibaug-temple', 'raja-dinkar-kelkar-museum'],
      associatedPlaces: ['shaniwar-wada', 'vishrambaug-wada', 'parvati-hill', 'tulshibaug-temple', 'raja-dinkar-kelkar-museum']
        .map(getPlaceBySlug)
        .filter((p): p is ExperiencePlace => Boolean(p)),
      architecturalStyleEn: 'Maratha Teak Wood Wada Architecture & Stone Plinths',
      architecturalStyleMr: 'सुरेख लाकडी कोरीव काम, मेघडंबरी व दगडी जोते',
    },
    {
      id: 'renaissance-reform',
      eraNameEn: 'Social Renaissance & Freedom Struggle',
      eraNameMr: 'सामाजिक प्रबोधन व स्वातंत्र्य लढा',
      timeframeEn: 'Mid-19th to 20th Century (1848–1947 CE)',
      timeframeMr: 'इ.स. १९ वे ते २० वे शतक',
      headlineEn: 'First Girls\' School, Swarajya Drums & Gandhi\'s Sanctuary',
      headlineMr: 'पहिली मुलींची शाळा, टिळकांचे केसरी आणि गांधीजींचा मुक्काम',
      narrativeEn:
        'Jyotirao and Savitribai Phule ignite girls\' education at Bhide Wada (1848). Lokmanya Tilak sparks mass mobilization with public Ganeshotsav at Kesari Wada. Mahatma Gandhi and Kasturba interned at Aga Khan Palace.',
      narrativeMr:
        'महात्मा जोतीराव व क्रांतीज्योती सावित्रीबाई फुले यांनी भिडे वाड्यात मुलींची पहिली शाळा काढली. टिळकांनी केसरी वाड्यातून जनजागृती केली आणि आगाखान पॅलेस स्वातंत्र्यलढ्याचे साक्षीदार ठरले.',
      focalPlaceSlug: 'aga-khan-palace',
      focalPlace: getPlaceBySlug('aga-khan-palace'),
      associatedPlaceSlugs: ['aga-khan-palace', 'kesari-wada', 'bhide-wada', 'shreemant-dagdusheth-halwai-ganpati'],
      associatedPlaces: ['aga-khan-palace', 'kesari-wada', 'bhide-wada', 'shreemant-dagdusheth-halwai-ganpati']
        .map(getPlaceBySlug)
        .filter((p): p is ExperiencePlace => Boolean(p)),
      architecturalStyleEn: 'Indo-Saracenic, Italianate Arches & Colonial Brick Palaces',
      architecturalStyleMr: 'इंडो-सारासेनिक, इटालियन कमानी आणि वसाहतकालीन स्थापत्य',
    },
  ];
}

// -------------------------------------------------------------
// CHAPTER 3: 16 PATHWAYS SELECTORS
// -------------------------------------------------------------

export interface PathwayCategorySummary {
  id: string;
  title: string;
  titleMr: string;
  tagline: string;
  description: string;
  iconName: string;
  coverImage: string;
  placeCount: number;
  featuredPlaces: ExperiencePlace[];
}

export function getPathwayCategories(): PathwayCategorySummary[] {
  return EXPERIENCE_CATEGORIES.map((cat) => {
    const matching = ALL_EXPERIENCE_PLACES.filter(cat.slugFilter);
    return {
      id: cat.id,
      title: cat.title,
      titleMr: cat.titleMr,
      tagline: cat.tagline,
      description: cat.description,
      iconName: cat.iconName,
      coverImage: cat.coverImage,
      placeCount: matching.length,
      featuredPlaces: matching.slice(0, 3),
    };
  });
}

export function getPlacesByPathway(pathwayId: string): ExperiencePlace[] {
  const cat = EXPERIENCE_CATEGORIES.find((c) => c.id === pathwayId);
  if (!cat) return [];
  return ALL_EXPERIENCE_PLACES.filter(cat.slugFilter);
}

// -------------------------------------------------------------
// CHAPTER 4: LIVING MAP & TODAY'S PETH SELECTORS
// -------------------------------------------------------------

export interface MapPin {
  id: string;
  slug: string;
  name: string;
  nameMr: string;
  categorySlug: string;
  category: string;
  latitude: number;
  longitude: number;
  popularityScore: number;
  imageUrl: string;
  isFort: boolean;
  distanceFromCenterKm: number;
}

export function getMapPlacePins(): MapPin[] {
  return ALL_EXPERIENCE_PLACES.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    nameMr: p.name_mr || p.name,
    categorySlug: p.category_slug,
    category: p.category,
    latitude: p.latitude,
    longitude: p.longitude,
    popularityScore: p.popularity_score || 85,
    imageUrl: p.image_url,
    isFort: p.category_slug === 'forts',
    distanceFromCenterKm: calculateDistanceKm(p.latitude, p.longitude),
  }));
}

export interface PethInfo {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayNameEn: string;
  dayNameMr: string;
  pethNameEn: string;
  pethNameMr: string;
  establishedBy: string;
  establishedYear: string;
  historicalRoleEn: string;
  historicalRoleMr: string;
  specialtyBazaarEn: string;
  specialtyBazaarMr: string;
  associatedPlaceSlugs: string[];
  associatedPlaces: ExperiencePlace[];
  visitorTipEn: string;
  visitorTipMr: string;
}

export const HISTORIC_PETHS_DATA: PethInfo[] = [
  {
    dayOfWeek: 0,
    dayNameEn: 'Sunday',
    dayNameMr: 'रविवार',
    pethNameEn: 'Raviwar Peth',
    pethNameMr: 'रविवार पेठ',
    establishedBy: 'Nilopant Mujumdar (under Shivaji Maharaj, 1670 CE; developed further by Peshwas)',
    establishedYear: '1670 CE (Originally Malkapur)',
    historicalRoleEn:
      'The premier wholesale bullion, textile, and hardware bazaar of Old Pune, bustling with merchants from across Western India.',
    historicalRoleMr:
      'सोन्या-चांदीचे सराफी व्यवहार, कापड आणि लोखंडी साहित्याची जुन्या पुण्यातील सर्वात मोठी व्यापारी पेठ.',
    specialtyBazaarEn: 'Sona-Chandi (Gold & Silver Jewellery), Bohri Ali hardware, paper and wholesale packaging.',
    specialtyBazaarMr: 'सराफ कट्टा (सोने-चांदी), बोहरी आळी (रंग, हार्डवेअर), कागद आणि घाऊक बाजारपेठ.',
    associatedPlaceSlugs: ['tambat-ali-craft-quarter', 'tulshibaug-temple'],
    associatedPlaces: [],
    visitorTipEn: 'Visit Bohri Ali early morning to admire narrow lanes lined with ornate wooden bracket facades before shops open.',
    visitorTipMr: 'सकाळी लवकर बोहरी आळीत फिरल्यास लाकडी वाड्यांच्या जुन्या कोरीव कामाचे उत्तम दर्शन घडते.',
  },
  {
    dayOfWeek: 1,
    dayNameEn: 'Monday',
    dayNameMr: 'सोमवार',
    pethNameEn: 'Somwar Peth',
    pethNameMr: 'सोमवार पेठ',
    establishedBy: 'Shahaji Raje / Dadoji Konddeo (Originally Shahpura, mid-17th Century)',
    establishedYear: 'c. 1640 CE',
    historicalRoleEn:
      'Historic settlement for Gosavi warriors, Shaivite ascetics, and medieval stone carvers; home to sacred temple tanks.',
    historicalRoleMr:
      'गोसावी योद्धे, साधू आणि प्राचीन शिवमंदिरांचे आशियान; पुण्यातील सर्वात जुन्या लोकवस्त्यांपैकी एक.',
    specialtyBazaarEn: 'Timber markets, auto spare parts, monumental stone carvings, ceremonial temple flowers.',
    specialtyBazaarMr: 'लाकूड व लाकडी सामान, ऑटो स्पेअर्स, दगडी मूर्तीकाम आणि पूजेचे साहित्य.',
    associatedPlaceSlugs: ['trishund-ganpati-temple', 'pataleshwar-cave-temple'],
    associatedPlaces: [],
    visitorTipEn: 'Seek out the 1770 CE Trishund Ganpati Temple with its rare three-trunked basalt idol and basement meditation crypt.',
    visitorTipMr: '१७७० मधील तीन सोंडेच्या त्रिशुंड गणपतीचे भुयारी तळघर आणि काळ्या पाषाणातील शिल्पकला अवश्य पाहा.',
  },
  {
    dayOfWeek: 2,
    dayNameEn: 'Tuesday',
    dayNameMr: 'मंगळवार',
    pethNameEn: 'Mangalwar Peth',
    pethNameMr: 'मंगळवार पेठ',
    establishedBy: 'Shaista Khan (originally Shaistepura, 1660 CE; re-christened Mangalwar Peth by Peshwas)',
    establishedYear: '1662 CE (Renamed 1730 CE)',
    historicalRoleEn:
      'Northern riverbank frontier of historic Pune; renowned for copper, bronze casting, iron mongery, and ancient Svetambara Jain shrines.',
    historicalRoleMr:
      'मुळा-मुठा नदीकाठची उत्तर सीमा; लोहार, कासार, धातू कारागीर आणि जुन्या जैन मंदिरांचे केंद्र.',
    specialtyBazaarEn: 'Raw metals, iron casting, industrial parts, electrical fittings, and old Jain basadi alleys.',
    specialtyBazaarMr: 'लोखंड, तांबे-पितळ धातूकाम, इलेक्ट्रीकल्स आणि पारंपरिक व्यापारी दुकाने.',
    associatedPlaceSlugs: ['lal-mahal', 'shaniwar-wada'],
    associatedPlaces: [],
    visitorTipEn: 'Explore the inner alleys to discover traditional blacksmith anvils and centuries-old wooden jharokha balconies.',
    visitorTipMr: 'आतील गल्ल्यांमधून फिरताना पारंपरिक लोहारकाम आणि शतकानुशतके जुने लाकडी झरोके नजरेस पडतात.',
  },
  {
    dayOfWeek: 3,
    dayNameEn: 'Wednesday',
    dayNameMr: 'बुधवार',
    pethNameEn: 'Budhwar Peth',
    pethNameMr: 'बुधवार पेठ',
    establishedBy: 'Aurangzeb (Mohiyabad, late 17th C.); revitalized 1703 CE by Peshwa Balaji Vishwanath',
    establishedYear: '1703 CE',
    historicalRoleEn:
      'The vibrant commercial, intellectual and spiritual core of the Peshwa capital; locus of Pune Gramadaivat Tambdi Jogeshwari.',
    historicalRoleMr:
      'पेशवाईच्या राजधानीचा राजकीय, बौद्धिक व व्यापारी गाभा; पुण्याची ग्रामदेवता तांबडी जोगेश्वरीचे पावन स्थान.',
    specialtyBazaarEn: 'Appa Balwant Chowk (ABC) educational books, stationery, electrical lighting, watches and cloth.',
    specialtyBazaarMr: 'अप्पा बळवंत चौक (पुस्तके व स्टेशनरी), इलेक्ट्रॉनिक दिवे, घड्याळे आणि कापड बाजार.',
    associatedPlaceSlugs: ['shreemant-dagdusheth-halwai-ganpati', 'tulshibaug-temple'],
    associatedPlaces: [],
    visitorTipEn: 'Visit the revered Shreemant Dagdusheth Ganpati and walk down Appa Balwant Chowk for rare historical books and scholarly volumes.',
    visitorTipMr: 'श्रीमंत दगडूशेठ हलवाई गणपतीचे दर्शन घेऊन अप्पा बळवंत चौकातील ऐतिहासिक पुस्तकांचे दालन पाहा.',
  },
  {
    dayOfWeek: 4,
    dayNameEn: 'Thursday',
    dayNameMr: 'गुरुवार',
    pethNameEn: 'Guruwar Peth',
    pethNameMr: 'गुरुवार पेठ',
    establishedBy: 'Jivajipant Khasgiwale under Peshwa Bajirao I (Originally Vetal Peth)',
    establishedYear: '1729 CE',
    historicalRoleEn:
      'Artisanal and residential sanctuary for Peshwa cavalry officers, paper molders, printing houses, and famous mud wrestling talims.',
    historicalRoleMr:
      'पेशव्यांचे घोडेस्वार, कागद उत्पादक आणि नामवंत कुस्ती आखाड्यांचे (तालीम) ऐतिहासिक माहेरघर.',
    specialtyBazaarEn: 'Wholesale pulses, grains, jaggery, traditional wrestling talims, and pooja copper ware.',
    specialtyBazaarMr: 'धान्य, डाळी, गूळ, पारंपरिक तालीम व्यायामशाळा आणि पूजेची भांडी.',
    associatedPlaceSlugs: ['vishrambaug-wada', 'raja-dinkar-kelkar-museum'],
    associatedPlaces: [],
    visitorTipEn: 'Peek inside historic mud wrestling pits (talims) in the early morning where wrestlers practice traditional kushti.',
    visitorTipMr: 'सकाळी लवकर तालमींमध्ये जाऊन लाल मातीतील अस्सल कुस्तीच्या डावांचा सराव अनुभवता येतो.',
  },
  {
    dayOfWeek: 5,
    dayNameEn: 'Friday',
    dayNameMr: 'शुक्रवार',
    pethNameEn: 'Shukrawar Peth',
    pethNameMr: 'शुक्रवार पेठ',
    establishedBy: 'Peshwa Bajirao I (Originally Visapur, 1734 CE)',
    establishedYear: '1734 CE',
    historicalRoleEn:
      'The largest and most populous peth in the Peshwa era; home to noble wadas, Tulshibaug courtyards, and museum archives.',
    historicalRoleMr:
      'पेशवे काळातील क्षेत्रफळाने सर्वात मोठी पेठ; सरदार-दरबारी मंडळींचे वाडे आणि तुळशीबाग बाजारपेठ.',
    specialtyBazaarEn: 'Brass & copper kitchenware, handloom textiles, Paithani sarees, footwear, and wooden toys.',
    specialtyBazaarMr: 'तुळशीबाग (भांडी, गृहोपयोगी वस्तू), पैठणी साड्या, चपला आणि लाकडी खेळणी.',
    associatedPlaceSlugs: ['raja-dinkar-kelkar-museum', 'tulshibaug-temple'],
    associatedPlaces: [],
    visitorTipEn: 'Visit Raja Dinkar Kelkar Museum (20,000+ Indian artifacts) followed by shopping for authentic brass utensils in Tulshibaug.',
    visitorTipMr: 'राजा दिनकर केळकर संग्रहालयातील २०,०००+ वस्तूंचा खजिना पाहून तुळशीबागेत अस्सल पितळी भांड्यांची खरेदी करा.',
  },
  {
    dayOfWeek: 6,
    dayNameEn: 'Saturday',
    dayNameMr: 'शनिवार',
    pethNameEn: 'Shaniwar Peth / Wada',
    pethNameMr: 'शनिवार पेठ / वाडा',
    establishedBy: 'Moropant Pingle under Shivaji Maharaj (1672 CE); imperial citadel built 1732 CE by Bajirao I',
    establishedYear: '1672 CE (Wada: 1732 CE)',
    historicalRoleEn:
      'The imperial capital of the Maratha Empire from which military campaigns spanned from Attock to Cuttack; administrative nerve center of Swarajya.',
    historicalRoleMr:
      'अटकेपार झेंडा फडकवणाऱ्या मराठा साम्राज्याची राजधानी; शनिवार वाड्याचा ऐतिहासिक बुरुज आणि शनिवार पेठ.',
    specialtyBazaarEn: 'Scholarly Marathi publications, bookbinders, art framing, and historic riverside flower ghats.',
    specialtyBazaarMr: 'ग्रंथ प्रकाशने, पुस्तक बांधणी, फ्रेमिंग, आणि ओंकारेश्वर घाटावरील फुले.',
    associatedPlaceSlugs: ['shaniwar-wada', 'kasba-ganpati', 'lal-mahal'],
    associatedPlaces: [],
    visitorTipEn: 'Walk through the steel-spiked Delhi Darwaza of Shaniwar Wada (09:30 AM – 05:30 PM), then pay respects at Kasba Ganpati.',
    visitorTipMr: 'शनिवार वाड्याच्या अणकुचीदार खिळ्यांच्या दिल्ली दरवाज्यातून आत जाऊन (सकाळी ९:३० ते ५:३०) कसबा गणपतीचे दर्शन घ्या.',
  },
];

/**
 * Returns the historic Pune Peth matching the current day of the week
 * (Sunday -> Raviwar Peth, Monday -> Somwar Peth, ..., Saturday -> Shaniwar Peth / Wada)
 */
export function getTodaysPeth(date: Date = new Date()): PethInfo {
  const dayIndex = date.getDay(); // 0 to 6
  const peth = HISTORIC_PETHS_DATA.find((p) => p.dayOfWeek === dayIndex) || HISTORIC_PETHS_DATA[6];
  return {
    ...peth,
    associatedPlaces: peth.associatedPlaceSlugs
      .map(getPlaceBySlug)
      .filter((p): p is ExperiencePlace => Boolean(p)),
  };
}

export function getAllPeths(): PethInfo[] {
  return HISTORIC_PETHS_DATA.map((peth) => ({
    ...peth,
    associatedPlaces: peth.associatedPlaceSlugs
      .map(getPlaceBySlug)
      .filter((p): p is ExperiencePlace => Boolean(p)),
  }));
}

// -------------------------------------------------------------
// CHAPTER 5: TACTILE PLAYGROUND SELECTORS
// -------------------------------------------------------------

export interface PlaygroundGameData {
  misalGame: {
    titleEn: string;
    titleMr: string;
    descriptionEn: string;
    descriptionMr: string;
    spiceLevels: Array<{ id: string; labelEn: string; labelMr: string; scoville: string }>;
    ingredients: Array<{ id: string; nameEn: string; nameMr: string; icon: string; essential: boolean }>;
    famousJoints: ExperiencePlace[];
  };
  tambatGame: {
    titleEn: string;
    titleMr: string;
    techniqueEn: string;
    techniqueMr: string;
    craftQuarterPlace?: ExperiencePlace;
    rhythmPattern: number[]; // beat delays in ms
  };
  tanajiGame: {
    titleEn: string;
    titleMr: string;
    cliffNameEn: string;
    cliffNameMr: string;
    climbYear: number;
    fortPlace?: ExperiencePlace;
  };
  relicGame: {
    titleEn: string;
    titleMr: string;
    museumPlace?: ExperiencePlace;
    artifactCount: number; // 20,000+
    featuredCategories: Array<{ nameEn: string; nameMr: string; count: number }>;
  };
  dholTashaGame: {
    titleEn: string;
    titleMr: string;
    manacheGanpati: Array<{ rank: number; nameEn: string; nameMr: string; slug: string }>;
    dagdushethPlace?: ExperiencePlace;
  };
}

export function getPlaygroundGameData(): PlaygroundGameData {
  const bedekar = getPlaceBySlug('bedekar-tea-stall-misal');
  const tambatAli = getPlaceBySlug('tambat-ali-craft-quarter');
  const sinhagad = getPlaceBySlug('sinhagad-fort');
  const kelkarMuseum = getPlaceBySlug('raja-dinkar-kelkar-museum');
  const dagdusheth = getPlaceBySlug('shreemant-dagdusheth-halwai-ganpati');

  return {
    misalGame: {
      titleEn: 'Puneri Misal Master',
      titleMr: 'अस्सल पुणेरी मिसळ मेकर',
      descriptionEn: 'Assemble the iconic Puneri misal bowl with fiery tarri, sprouted matki, crunchy farsan, chopped onions, and fresh lemon wedge.',
      descriptionMr: 'झणझणीत तर्री, मोड आलेली मटकी, कुरकुरीत फरसाण, बारीक कांदा आणि लिंबू पिळून अस्सल पुणेरी मिसळ तयार करा.',
      spiceLevels: [
        { id: 'mild', labelEn: 'Medium Spicy (साधी)', labelMr: 'मध्यम तिखट', scoville: '5,000 SHU' },
        { id: 'spicy', labelEn: 'Puneri Spicy (तिखट)', labelMr: 'पुणेरी तिखट', scoville: '25,000 SHU' },
        { id: 'zanzanit', labelEn: 'Kolhapuri/Puneri Zanzanit (झणझणीत)', labelMr: 'अस्सल झणझणीत तर्री', scoville: '75,000 SHU' },
      ],
      ingredients: [
        { id: 'matki', nameEn: 'Sprouted Matki Usal', nameMr: 'मोड आलेली मटकी उसळ', icon: '🌱', essential: true },
        { id: 'farsan', nameEn: 'Crispy Puneri Farsan', nameMr: 'कुरकुरीत पुणेरी फरसाण', icon: '🥨', essential: true },
        { id: 'tarri', nameEn: 'Fiery Kat / Tarri Rassa', nameMr: 'गरमागरम झणझणीत कट/रस्सा', icon: '🥣', essential: true },
        { id: 'onion', nameEn: 'Fine Chopped Onions & Coriander', nameMr: 'बारीक चिरलेला कांदा व कोथिंबीर', icon: '🧅', essential: true },
        { id: 'lemon', nameEn: 'Fresh Lemon Wedge', nameMr: 'लिंबाची फोड', icon: '🍋', essential: true },
        { id: 'pav', nameEn: 'Fresh Buttered Ladi Pav', nameMr: 'ताजा लादी पाव', icon: '🍞', essential: true },
        { id: 'curd', nameEn: 'Cooling Dahi Cup', nameMr: 'गारगार ताक/दही वाटी', icon: '🥛', essential: false },
      ],
      famousJoints: [bedekar].filter((p): p is ExperiencePlace => Boolean(p)),
    },
    tambatGame: {
      titleEn: 'Matharkaam Beat Rhythm',
      titleMr: 'तांबट आळी — माथारकाम ताल',
      techniqueEn: 'Traditional hand-hammered dimpling (Matharkaam) of red copper vessels practiced for 400 years.',
      techniqueMr: 'तांब्याच्या भांड्यांवर हाताने घण घालून नाजूक नक्षी (माथारकाम) उमटवण्याची ४०० वर्षे जुनी कला.',
      craftQuarterPlace: tambatAli,
      rhythmPattern: [0, 400, 800, 1200, 1500, 1900],
    },
    tanajiGame: {
      titleEn: 'Tanaji Malusare’s Night Escalade',
      titleMr: 'नरवीर तानाजी मालुसरे — सिंहगड मोहीम',
      cliffNameEn: 'Dronagiri Precipice (Tanaji Kada)',
      cliffNameMr: 'द्रोणागिरी कडा (तानाजी कडा)',
      climbYear: 1670,
      fortPlace: sinhagad,
    },
    relicGame: {
      titleEn: 'Kelkar Museum Relic Vault',
      titleMr: 'राजा केळकर संग्रहालय — अमूल्य खजिना',
      museumPlace: kelkarMuseum,
      artifactCount: 20000,
      featuredCategories: [
        { nameEn: 'Mastani Mahal Reconstruction', nameMr: 'मस्तानी महाल पुनर्रचना', count: 1 },
        { nameEn: 'Historical Musical Instruments', nameMr: 'दुर्मीळ वाद्य संग्रह', count: 180 },
        { nameEn: 'Peshwa Era Locks & Padlocks', nameMr: 'ऐतिहासिक कुलूप संग्रह', count: 420 },
        { nameEn: 'Traditional Kitchen & Betel Nut Cutters', nameMr: 'अडकिते व पारंपरिक भांडी', count: 2500 },
      ],
    },
    dholTashaGame: {
      titleEn: 'Ganeshotsav Dhol-Tasha Pulse',
      titleMr: 'पुणेरी ढोल-ताशा गजर',
      manacheGanpati: [
        { rank: 1, nameEn: 'Shri Kasba Ganpati (City Deity)', nameMr: 'श्री कसबा गणपती (पुण्याचे ग्रामदैवत)', slug: 'kasba-ganpati' },
        { rank: 2, nameEn: 'Shri Tambdi Jogeshwari (Presiding Goddess)', nameMr: 'श्री तांबडी जोगेश्वरी', slug: 'tambdi-jogeshwari' },
        { rank: 3, nameEn: 'Shri Guruji Talim', nameMr: 'श्री गुरुजी तालीम', slug: 'guruji-talim' },
        { rank: 4, nameEn: 'Shri Tulshibaug Ganpati', nameMr: 'श्री तुळशीबाग गणपती', slug: 'tulshibaug-temple' },
        { rank: 5, nameEn: 'Shri Kesari Wada Ganpati (Tilak Mandir)', nameMr: 'श्री केसरी वाडा गणपती', slug: 'kesari-wada' },
      ],
      dagdushethPlace: dagdusheth,
    },
  };
}

// -------------------------------------------------------------
// CHAPTER 6: 4 SEASONS SELECTORS
// -------------------------------------------------------------

export interface SeasonInfo {
  id: 'monsoon' | 'winter' | 'summer' | 'festive';
  nameEn: string;
  nameMr: string;
  monthsEn: string;
  monthsMr: string;
  temperatureEn: string;
  temperatureMr: string;
  atmosphereEn: string;
  atmosphereMr: string;
  colorPalette: string[];
  recommendedPlaceSlugs: string[];
  recommendedPlaces: ExperiencePlace[];
}

export function getSeasonalExperiences(): SeasonInfo[] {
  return [
    {
      id: 'monsoon',
      nameEn: 'Monsoon Magic (Varsha Ritu)',
      nameMr: 'पावसाळा (वर्षा ऋतू)',
      monthsEn: 'June to September',
      monthsMr: 'जून ते सप्टेंबर',
      temperatureEn: '22°C – 27°C • Fresh Mountain Showers',
      temperatureMr: '२२°से ते २७°से • रिमझिम पाऊस व दाट धुके',
      atmosphereEn: 'Cascading waterfalls, mist-shrouded Sahyadri summits, emerald hills, and piping hot kanda bhaji at Donje paytha.',
      atmosphereMr: 'धुके वेढलेले किल्ले, फेसाळणारे धबधबे आणि सिंहगड पायथ्याशी मिळणारी गरमागरम कांदा भजी व पिठलं-भाकरी.',
      colorPalette: ['#065f46', '#10b981', '#34d399', '#ecfdf5'],
      recommendedPlaceSlugs: ['sinhagad-fort', 'lohagad-fort', 'khadakwasla-dam', 'mulshi-dam'],
      recommendedPlaces: ['sinhagad-fort', 'lohagad-fort', 'khadakwasla-dam', 'mulshi-dam']
        .map(getPlaceBySlug)
        .filter((p): p is ExperiencePlace => Boolean(p)),
    },
    {
      id: 'winter',
      nameEn: 'Pleasant Winter (Hemant & Shishir)',
      nameMr: 'हिवाळा (गुलाबी थंडी)',
      monthsEn: 'October to February',
      monthsMr: 'ऑक्टोबर ते फेब्रुवारी',
      temperatureEn: '12°C – 28°C • Crisp Sunlit Days',
      temperatureMr: '१२°से ते २८°से • आल्हाददायक गुलाबी थंडी',
      atmosphereEn: 'Crisp morning walks on Vetal Tekdi, cycling along university avenues, and comfortable heritage walking trails in the Peths.',
      atmosphereMr: 'वेताळ टेकडीवर सकाळचा ताज्या हवेतील फेरफटका, सावित्रीबाई फुले विद्यापीठातील रस्ते आणि पेठांमधील हेरिटेज वॉक.',
      colorPalette: ['#1e3a8a', '#3b82f6', '#93c5fd', '#eff6ff'],
      recommendedPlaceSlugs: ['vetal-tekdi', 'shaniwar-wada', 'aga-khan-palace', 'pataleshwar-cave-temple'],
      recommendedPlaces: ['vetal-tekdi', 'shaniwar-wada', 'aga-khan-palace', 'pataleshwar-cave-temple']
        .map(getPlaceBySlug)
        .filter((p): p is ExperiencePlace => Boolean(p)),
    },
    {
      id: 'summer',
      nameEn: 'Golden Summer (Grishma Ritu)',
      nameMr: 'उन्हाळा (मस्तानी व सावलीचे वाडे)',
      monthsEn: 'March to May',
      monthsMr: 'मार्च ते मे',
      temperatureEn: '24°C – 38°C • Golden Sunsets',
      temperatureMr: '२४°से ते ३८°से • सोनेरी सूर्यास्त',
      atmosphereEn: 'Cool shaded courtyards of wooden wadas, chilled Sujata mango mastani, and breezy sunsets at Khadakwasla backwaters.',
      atmosphereMr: 'विश्रामबाग वाड्याची थंडगार सावली, सुजाता मस्तानीचा आस्वाद आणि संध्याकाळी खडकवासला धरणावरील गार वारा.',
      colorPalette: ['#b45309', '#f59e0b', '#fde68a', '#fffbeb'],
      recommendedPlaceSlugs: ['sujata-mastani-sadashiv-peth', 'khadakwasla-dam', 'vishrambaug-wada', 'okayama-friendship-garden'],
      recommendedPlaces: ['sujata-mastani-sadashiv-peth', 'khadakwasla-dam', 'vishrambaug-wada', 'okayama-friendship-garden']
        .map(getPlaceBySlug)
        .filter((p): p is ExperiencePlace => Boolean(p)),
    },
    {
      id: 'festive',
      nameEn: 'Ganeshotsav Fervor (Bhadrapada)',
      nameMr: 'गणेशोत्सव (भाद्रपद महापर्व)',
      monthsEn: 'August – September (10 Days)',
      monthsMr: 'ऑगस्ट – सप्टेंबर (१० दिवस)',
      temperatureEn: '23°C – 29°C • Electric Citywide Energy',
      temperatureMr: '२३°से ते २९°से • अभूतपूर्व जल्लोष व भक्तिभाव',
      atmosphereEn: 'Dhol-tasha beats shaking the streets, grand historic decors at Dagdusheth, 5 Manache Ganpati darshan, and fragrant modaks.',
      atmosphereMr: 'दुमदुमणाऱ्या ढोल-ताशा पथकांचे वादन, ५ मानाच्या गणपतींचे दर्शन, देखावे आणि उकडीच्या मोदकांचा दरवळणारा सुगंध.',
      colorPalette: ['#991b1b', '#dc2626', '#fca5a5', '#fef2f2'],
      recommendedPlaceSlugs: ['kasba-ganpati', 'shreemant-dagdusheth-halwai-ganpati', 'tulshibaug-temple', 'kesari-wada'],
      recommendedPlaces: ['kasba-ganpati', 'shreemant-dagdusheth-halwai-ganpati', 'tulshibaug-temple', 'kesari-wada']
        .map(getPlaceBySlug)
        .filter((p): p is ExperiencePlace => Boolean(p)),
    },
  ];
}

// -------------------------------------------------------------
// CHAPTER 7: PLAN YOUR JOURNEY SELECTORS
// -------------------------------------------------------------

export function getItineraryTemplates(): ItineraryTemplate[] {
  return ITINERARY_TEMPLATES;
}

export interface FinderCriteria {
  selectedTime: '2hr' | 'halfDay' | 'fullDay' | 'weekend';
  selectedPassion: string;
  selectedBudget?: 'free' | 'budget' | 'any';
  selectedGroup?: 'solo' | 'couple' | 'friends' | 'family';
}

/**
 * Filters places for the personalized finder with strict distance radius gating:
 * short/city trips ('2hr' or 'halfDay') exclude places farther than 25km from Pune city center
 * (e.g. Karla Caves ~60km away in Lonavala) so they only appear for 'fullDay' or 'weekend' getaways.
 */
export function filterPlacesForFinder(criteria: FinderCriteria): ExperiencePlace[] {
  let pool = [...ALL_EXPERIENCE_PLACES];

  // 1. Filter by Passion
  if (criteria.selectedPassion === 'heritage') {
    pool = pool.filter((p) => p.category_slug === 'heritage');
  } else if (criteria.selectedPassion === 'forts') {
    pool = pool.filter((p) => p.category_slug === 'forts');
  } else if (criteria.selectedPassion === 'culinary') {
    pool = pool.filter((p) => p.category_slug === 'food');
    if (pool.length === 0) pool = ALL_EXPERIENCE_PLACES.filter((p) => p.category_slug === 'food');
  } else if (criteria.selectedPassion === 'spiritual') {
    pool = pool.filter((p) => p.category_slug === 'temples');
  } else if (criteria.selectedPassion === 'nature') {
    pool = pool.filter((p) => p.category_slug === 'nature' || p.category_slug === 'parks');
  }

  // 2. Filter by Budget
  if (criteria.selectedBudget === 'free') {
    pool = pool.filter((p) => p.entry_fee === 0 || p.fee_status === 'free');
  }

  // 3. Filter by Group
  if (criteria.selectedGroup === 'family') {
    const familyFavs = pool.filter((p) =>
      ['parks', 'museums', 'temples', 'heritage'].includes(p.category_slug)
    );
    if (familyFavs.length >= 3) pool = familyFavs;
  }

  // 4. Distance Radius Gating:
  // Karla Caves (~60km away in Lonavala) and distant getaways are gated > 25km.
  // For '2hr' and 'halfDay' trips, enforce radius <= 25km.
  if (criteria.selectedTime === '2hr' || criteria.selectedTime === 'halfDay') {
    pool = pool.filter((p) => {
      const dist = calculateDistanceKm(p.latitude, p.longitude);
      return dist <= 25;
    });
  }

  // 5. Limit by Time
  let maxStops = 4;
  if (criteria.selectedTime === '2hr') maxStops = 2;
  if (criteria.selectedTime === 'halfDay') maxStops = 3;
  if (criteria.selectedTime === 'fullDay') maxStops = 5;
  if (criteria.selectedTime === 'weekend') maxStops = 6;

  pool.sort((a, b) => (b.popularity_score || 80) - (a.popularity_score || 80));
  return pool.slice(0, maxStops);
}

// -------------------------------------------------------------
// CHAPTER 8: OUTRO & PASSPORT SELECTORS
// -------------------------------------------------------------

export interface ExperienceCatalogSummary {
  totalPlaces: number;
  totalCatalogedForts: number; // 15
  totalFeaturedForts: number; // 7
  totalTemples: number; // 27
  totalHeritage: number; // 29
  totalNatureAndParks: number; // 20
  totalMuseums: number; // 9
  totalFoodStops: number; // 6
  shaniwarWadaHours: string; // '09:30 AM – 05:30 PM'
  kelkarMuseumArtifacts: string; // '20,000+'
}

export function getExperienceCatalogSummary(): ExperienceCatalogSummary {
  return {
    totalPlaces: ALL_EXPERIENCE_PLACES.length,
    totalCatalogedForts: getCatalogedForts().length, // 15
    totalFeaturedForts: getFeaturedForts().length, // 7
    totalTemples: getSpiritualPlaces().length, // 27
    totalHeritage: getHeritagePlaces().length, // 29
    totalNatureAndParks: getNaturePlaces().length, // 20
    totalMuseums: getPlacesByCategory('museums').length, // 9
    totalFoodStops: getFoodPlaces().length, // 6
    shaniwarWadaHours: '09:30 AM – 05:30 PM',
    kelkarMuseumArtifacts: '20,000+',
  };
}

export interface PassportStamp {
  id: string;
  placeSlug: string;
  titleEn: string;
  titleMr: string;
  category: string;
  icon: string;
  sealTextEn: string;
  sealTextMr: string;
}

export function getCuratedPassportStamps(): PassportStamp[] {
  return [
    {
      id: 'stamp-sinhagad',
      placeSlug: 'sinhagad-fort',
      titleEn: 'Sinhagad Fort',
      titleMr: 'सिंहगड किल्ला',
      category: 'Fort',
      icon: 'Mountain',
      sealTextEn: '1670 CE • Sahyadri Ramparts Verified',
      sealTextMr: 'इ.स. १६७० • अजिंक्य सह्याद्री बुरुज',
    },
    {
      id: 'stamp-shaniwar-wada',
      placeSlug: 'shaniwar-wada',
      titleEn: 'Shaniwar Wada',
      titleMr: 'शनिवार वाडा',
      category: 'Heritage',
      icon: 'Landmark',
      sealTextEn: '1732 CE • Peshwa Imperial Seat',
      sealTextMr: 'इ.स. १७३२ • पेशवे राजधानी',
    },
    {
      id: 'stamp-pataleshwar',
      placeSlug: 'pataleshwar-cave-temple',
      titleEn: 'Pataleshwar Cave Temple',
      titleMr: 'पाताळेश्वर लेणी',
      category: 'Rock-Cut',
      icon: 'Flame',
      sealTextEn: '8th C. CE • Rashtrakuta Basalt Monolith',
      sealTextMr: '८ वे शतक • राष्ट्रकूट एकाश्म लेणी',
    },
    {
      id: 'stamp-dagdusheth',
      placeSlug: 'shreemant-dagdusheth-halwai-ganpati',
      titleEn: 'Dagdusheth Ganpati',
      titleMr: 'श्रीमंत दगडूशेठ हलवाई गणपती',
      category: 'Devasthan',
      icon: 'Sparkles',
      sealTextEn: '1893 CE • Divine Resplendence',
      sealTextMr: 'इ.स. १८९३ • मंगलमूर्ती दर्शन',
    },
    {
      id: 'stamp-aga-khan',
      placeSlug: 'aga-khan-palace',
      titleEn: 'Aga Khan Palace',
      titleMr: 'आगाखान पॅलेस',
      category: 'Memorial',
      icon: 'Compass',
      sealTextEn: '1892 CE • Quit India Freedom Cradle',
      sealTextMr: 'इ.स. १८९२ • भारत छोडो पावन स्मारक',
    },
    {
      id: 'stamp-kelkar-museum',
      placeSlug: 'raja-dinkar-kelkar-museum',
      titleEn: 'Raja Dinkar Kelkar Museum',
      titleMr: 'राजा दिनकर केळकर संग्रहालय',
      category: 'Museum',
      icon: 'Palette',
      sealTextEn: '20,000+ Indian Artifacts Curated',
      sealTextMr: '२०,०००+ दुर्मिळ वस्तू संग्रह',
    },
  ];
}

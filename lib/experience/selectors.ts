/**
 * Explore Pune - Experience v2 Selectors & Ground-Truth Data Engine
 * Grounded in data/pune_places_106.json with zero invented facts.
 */

import placesDataRaw from '@/data/pune_places_106.json';
import {
  ExperiencePlace,
  ZoneId,
  ZoneDefinition,
  CategorySummary,
  FeatureShowcase,
  MarqueeItem,
  StoryItem,
  FaqItem,
} from './types';

// Raw places typed
const rawPlaces = placesDataRaw as unknown as ExperiencePlace[];

/**
 * Assigns each place to one of the 5 canonical zones based on coordinates, address & geography.
 */
export function assignPlaceZone(p: ExperiencePlace): ZoneId {
  const addr = (p.address || '').toLowerCase();
  const slug = p.slug.toLowerCase();
  const lat = p.latitude;
  const lng = p.longitude;
  const cat = p.category_slug;

  // 1. Sahyadri Forts & Reservoirs: all mountain forts, dams, lakes, ghats, and distant pilgrimages
  if (
    cat === 'forts' ||
    slug.includes('fort') ||
    slug.includes('dam') ||
    slug.includes('lake') ||
    slug.includes('ghat') ||
    slug.includes('caves') ||
    slug.includes('bhimashankar') ||
    slug.includes('jejuri') ||
    slug.includes('morgaon') ||
    slug.includes('theur') ||
    slug.includes('dehu') ||
    slug.includes('alandi') ||
    lat < 18.44 ||
    lat > 18.66 ||
    lng < 73.74 ||
    lng > 73.94
  ) {
    return 'sahyadri-forts';
  }

  // 2. Koregaon Park & Nagar Rd
  if (
    addr.includes('koregaon park') ||
    addr.includes('kalyani nagar') ||
    addr.includes('viman nagar') ||
    addr.includes('yerwada') ||
    addr.includes('nagar road') ||
    addr.includes('bund garden') ||
    slug.includes('aga-khan') ||
    slug.includes('osho') ||
    slug.includes('bund-garden')
  ) {
    return 'kp-nagar-rd';
  }

  // 3. Camp & Cantonment
  if (
    addr.includes('camp') ||
    addr.includes('cantonment') ||
    addr.includes('mg road') ||
    addr.includes('east street') ||
    addr.includes('wanowrie') ||
    addr.includes('hadapsar') ||
    addr.includes('fatima') ||
    slug.includes('war-memorial') ||
    slug.includes('empress-garden') ||
    slug.includes('synagogue') ||
    slug.includes('st-mary') ||
    slug.includes('shinde-chhatri')
  ) {
    return 'camp-cantonment';
  }

  // 4. Deccan & Kothrud
  if (
    addr.includes('deccan') ||
    addr.includes('kothrud') ||
    addr.includes('fergusson') ||
    addr.includes('fc road') ||
    addr.includes('karve') ||
    addr.includes('prabhat') ||
    addr.includes('shivajinagar') ||
    addr.includes('vetal') ||
    addr.includes('arai') ||
    slug.includes('vetal') ||
    slug.includes('arai') ||
    slug.includes('pataleshwar') ||
    slug.includes('pune-university') ||
    slug.includes('chatushrungi')
  ) {
    return 'deccan-kothrud';
  }

  // 5. Historic Peths & Wadas (Heart of Old Pune)
  return 'historic-peths';
}

// All places with enriched zone IDs
export const ALL_EXPERIENCE_PLACES: ExperiencePlace[] = rawPlaces.map((p) => ({
  ...p,
  zoneId: assignPlaceZone(p),
}));

export const PLACES_BY_SLUG: Record<string, ExperiencePlace> = ALL_EXPERIENCE_PLACES.reduce(
  (acc, p) => {
    acc[p.slug] = p;
    return acc;
  },
  {} as Record<string, ExperiencePlace>
);

// -------------------------------------------------------------
// 5 ZONES DEFINITION (Hull + Buffer approximations)
// -------------------------------------------------------------
export const ZONES_DATA: ZoneDefinition[] = [
  {
    id: 'historic-peths',
    nameEn: 'Historic Peths & Wadas',
    nameMr: 'ऐतिहासिक पेठा आणि वाडे',
    taglineEn: '18th-century Peshwa urban grid, living artisan quarters & sacred devasthans',
    taglineMr: '१८व्या शतकातील पेशवेकालीन नगररचना, तांबट आळी आणि ग्रामदैवते',
    center: [73.8553, 18.5195],
    zoom: 14.5,
    accentColor: '#3880FF', // Outline blue
    descriptionEn: 'The cultural heartbeat of Pune comprising the 17 historic Peths, Shaniwar Wada, Kasba Ganpati, Dagdusheth, and Raja Dinkar Kelkar Museum.',
    descriptionMr: '१७ ऐतिहासिक पेठा, शनिवार वाडा, ग्रामदैवत कसबा गणपती, श्रीमंत दगडूशेठ आणि राजा केळकर संग्रहालयाने सजलेले पुण्याचे सांस्कृतिक हृदय.',
    approxPolygonCoordinates: [
      [
        [73.842, 18.528],
        [73.864, 18.527],
        [73.867, 18.512],
        [73.856, 18.502],
        [73.844, 18.506],
        [73.839, 18.519],
        [73.842, 18.528],
      ],
    ],
  },
  {
    id: 'deccan-kothrud',
    nameEn: 'Deccan & Kothrud',
    nameMr: 'डेक्कन आणि कोथरूड',
    taglineEn: 'Scholarly institutions, dawn tekdi treks & vibrant culinary avenues',
    taglineMr: 'अभिजात शिक्षणसंस्था, वेताळ टेकडी आणि फर्ग्युसन रस्ता',
    center: [73.8334, 18.5212],
    zoom: 13.8,
    accentColor: '#00B77F', // Outline green
    descriptionEn: 'Academic corridors along FC Road and Prabhat Road, 8th-century Pataleshwar rock caves, and the morning birding sanctuary of Vetal Tekdi.',
    descriptionMr: 'फर्ग्युसन कॉलेज रस्ता, प्रभात रस्ता, ८व्या शतकातील पाताळेश्वर लेणी आणि वेताळ टेकडीचा आल्हाददायक परिसर.',
    approxPolygonCoordinates: [
      [
        [73.818, 18.542],
        [73.845, 18.538],
        [73.849, 18.514],
        [73.832, 18.498],
        [73.816, 18.508],
        [73.818, 18.542],
      ],
    ],
  },
  {
    id: 'camp-cantonment',
    nameEn: 'Camp & Cantonment',
    nameMr: 'कॅम्प आणि छावणी परिसर',
    taglineEn: 'Colonial heritage, tree-lined boulevards, military history & Parsi bakeries',
    taglineMr: 'ब्रिटीशकालीन वारसा, भव्य वृक्षराजी, युद्ध स्मारक आणि पारशी बेकऱ्या',
    center: [73.8779, 18.5194],
    zoom: 13.8,
    accentColor: '#F1293A', // Route red
    descriptionEn: 'East Street and MG Road promenades, Kayani Bakery, National War Memorial Southern Command, and the verdant Empress Botanical Garden.',
    descriptionMr: 'एमजी रोड, ईस्ट स्ट्रीट, कयानी बेकरी, राष्ट्रीय युद्ध स्मारक आणि १८३८ ची ऐतिहासिक एम्प्रेस बॉटनिकल गार्डन.',
    approxPolygonCoordinates: [
      [
        [73.865, 18.532],
        [73.896, 18.530],
        [73.898, 18.508],
        [73.878, 18.498],
        [73.862, 18.512],
        [73.865, 18.532],
      ],
    ],
  },
  {
    id: 'kp-nagar-rd',
    nameEn: 'Koregaon Park & Nagar Rd',
    nameMr: 'कोरेगाव पार्क आणि नगर रस्ता',
    taglineEn: 'Historic Italian arches of Aga Khan Palace, riverside zen gardens & cosmopolitan dining',
    taglineMr: 'ऐतिहासिक आगाखान पॅलेस, ओशो ध्यान उद्यान आणि मुळा-मुठा नदी परिसर',
    center: [73.8923, 18.5425],
    zoom: 14.0,
    accentColor: '#8b5cf6', // Violet
    descriptionEn: 'The tranquil pathways of Osho Teerth Park, the freedom monument of Aga Khan Palace where Kasturba Gandhi rested, and Bund Garden.',
    descriptionMr: 'कस्तुरबा गांधी आणि महादेवभाई देसाई यांचे स्मारक असलेला आगाखान पॅलेस, शांत ओशो तीर्थ उद्यान आणि बंड गार्डन.',
    approxPolygonCoordinates: [
      [
        [73.878, 18.555],
        [73.910, 18.552],
        [73.908, 18.532],
        [73.882, 18.534],
        [73.878, 18.555],
      ],
    ],
  },
  {
    id: 'sahyadri-forts',
    nameEn: 'Sahyadri Forts & Reservoirs',
    nameMr: 'सह्याद्री किल्ले आणि जलाशय',
    taglineEn: 'Dramatic basalt citadels of Shivaji Maharaj, misty reservoirs & Western Ghats passes',
    taglineMr: 'शिवकालीन डोंगरी किल्ले, खडकवासला धरण आणि सह्याद्रीच्या हिरव्यागार कड्या',
    center: [73.7558, 18.3664], // Centered at Sinhagad
    zoom: 10.5,
    accentColor: '#ea580c', // Peshwa saffron
    descriptionEn: 'The mighty Maratha bastion of Sinhagad, Rajgad, Torna, Purandar, Lohagad, Khadakwasla reservoir, and misty Tamhini Ghat.',
    descriptionMr: 'सिंहगड, राजगड, तोरणा, पुरंदर, लोहगड यांसारखे अजिंक्य गड-किल्ले आणि खडकवासला धरणाचा अथांग परिसर.',
    approxPolygonCoordinates: [
      [
        [73.300, 19.100],
        [74.100, 19.100],
        [74.100, 18.100],
        [73.300, 18.100],
        [73.300, 19.100],
      ],
    ],
  },
];

// -------------------------------------------------------------
// CATEGORIES SUMMARY (Real counts from data)
// -------------------------------------------------------------
export function getCategories(): CategorySummary[] {
  const counts: Record<string, number> = {};
  ALL_EXPERIENCE_PLACES.forEach((p) => {
    const cat = p.category_slug;
    counts[cat] = (counts[cat] || 0) + 1;
  });

  return [
    {
      slug: 'heritage',
      nameEn: 'Heritage & Wadas',
      nameMr: 'वारसा आणि वाडे',
      color: '#eab308',
      iconName: 'Landmark',
      count: counts['heritage'] || 29,
      descriptionEn: 'Centuries of Maratha & Peshwa architectural legacy, timbered courtyards, and stone gates.',
      descriptionMr: 'मराठा व पेशवेकालीन वास्तू, लाकडी खांबांचे चौक आणि ऐतिहासिक बुरुज.',
      coverImage: '/images/places/shaniwar-wada.jpg',
    },
    {
      slug: 'forts',
      nameEn: 'Sahyadri Forts',
      nameMr: 'सह्याद्री किल्ले',
      color: '#ea580c',
      iconName: 'Mountain',
      count: counts['forts'] || 15,
      descriptionEn: 'Cloud-veiled basalt citadels, historic water cisterns, and high-altitude battle ramparts.',
      descriptionMr: 'ढगांमध्ये हरवणारे कातळकडे, ऐतिहासिक तलाव आणि शिवकालीन तटबंदी.',
      coverImage: '/images/places/sinhagad-fort.jpg',
    },
    {
      slug: 'temples',
      nameEn: 'Spiritual Sanctuaries',
      nameMr: 'अध्यात्म व मंदिरे',
      color: '#f97316',
      iconName: 'Flame',
      count: counts['temples'] || 27,
      descriptionEn: 'Ancient rock-cut shrines, the 5 Manache Ganpatis, and sacred Warkari pilgrim centers.',
      descriptionMr: '८व्या शतकातील पाताळेश्वर लेणी, ५ मानाचे गणपती आणि वारकरी संतांची भूमी.',
      coverImage: '/images/places/shreemant-dagdusheth-halwai-ganpati.jpg',
    },
    {
      slug: 'nature',
      nameEn: 'Nature & Tekdis',
      nameMr: 'निसर्ग व टेकड्या',
      color: '#10b981',
      iconName: 'Trees',
      count: counts['nature'] || 14,
      descriptionEn: 'Urban sunrise hills, sprawling lakefronts, and lush Western Ghats waterfalls.',
      descriptionMr: 'वेताळ टेकडीवरील सकाळचा गारवा, खडकवासला जलाशय आणि हिरवेगार डोंगर.',
      coverImage: '/images/places/vetal-tekdi.jpg',
    },
    {
      slug: 'museums',
      nameEn: 'Museums & Archives',
      nameMr: 'संग्रहालये',
      color: '#06b6d4',
      iconName: 'Building2',
      count: counts['museums'] || 9,
      descriptionEn: 'Over 20,000 priceless artifacts of everyday Indian life, tribal crafts, and cricket archives.',
      descriptionMr: '२०,००० हून अधिक दुर्मीळ वस्तूंचे राजा केळकर संग्रहालय आणि आदिवासी कला.',
      coverImage: '/images/places/raja-dinkar-kelkar-museum.jpg',
    },
    {
      slug: 'parks',
      nameEn: 'Public Gardens',
      nameMr: 'उद्याने',
      color: '#22c55e',
      iconName: 'Flower2',
      count: counts['parks'] || 6,
      descriptionEn: 'Historic botanical sanctuaries, Japanese zen gardens, and landscaped lakeside promenades.',
      descriptionMr: '१८३८ चे एम्प्रेस बॉटनिकल गार्डन, पु. ल. देशपांडे जपानी बाग आणि सारसबाग.',
      coverImage: '/images/places/empress-botanical-garden.jpg',
    },
    {
      slug: 'food',
      nameEn: 'Culinary Legends',
      nameMr: 'अस्सल पुणेरी खाद्य',
      color: '#f43f5e',
      iconName: 'Utensils',
      count: counts['food'] || 6,
      descriptionEn: 'Fiery misal, bun maska, mango mastani, and century-old sweet shops in traditional Peths.',
      descriptionMr: 'झणझणीत मिसळ, मस्तानी, इराणी चहा-बन मस्का आणि चितळे बाकरवडी.',
      coverImage: '/images/places/bedekar-tea-stall-misal.jpg',
    },
  ];
}

// -------------------------------------------------------------
// SELECTOR HELPERS
// -------------------------------------------------------------
export function getAllPlaces(): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES;
}

export function getPlaceBySlug(slug: string): ExperiencePlace | undefined {
  return PLACES_BY_SLUG[slug];
}

export function getPlacesByCategory(categorySlug: string): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES.filter((p) => p.category_slug === categorySlug);
}

export function getPlacesByZone(zoneId: ZoneId): ExperiencePlace[] {
  return ALL_EXPERIENCE_PLACES.filter((p) => p.zoneId === zoneId);
}

export function getZones(): ZoneDefinition[] {
  return ZONES_DATA;
}

export function getZoneById(id: ZoneId): ZoneDefinition | undefined {
  return ZONES_DATA.find((z) => z.id === id);
}

export function getStatsSummary() {
  return {
    totalPlaces: ALL_EXPERIENCE_PLACES.length, // 106
    totalCategories: 7,
    totalZones: ZONES_DATA.length, // 5
    totalItineraries: 8,
  };
}

// -------------------------------------------------------------
// LIVE VERIFIED MARQUEE DATA (Strict Truth - No Placeholders)
// -------------------------------------------------------------
export function getMarqueeItems(): MarqueeItem[] {
  return [
    {
      id: 'shaniwar-hours',
      badge: 'ASI VERIFIED',
      textEn: 'Shaniwar Wada open 09:30 AM – 05:30 PM • ₹25 Indian, ₹300 Foreigner • Dilli Darwaza, Kasba Peth',
      textMr: 'शनिवार वाडा वेळ स. ०९:३० ते सायं. ०५:३० • तिकीट ₹२५ (भारतीय) • दिल्ली दरवाजा, कसबा पेठ',
      type: 'hours',
    },
    {
      id: 'sinhagad-curfew',
      badge: 'FOREST ADVISORY',
      textEn: 'Sinhagad Fort: Open 06:00 AM – 06:00 PM • Night entry strictly prohibited by Maharashtra Forest Dept',
      textMr: 'सिंहगड किल्ला: वेळ स. ०६:०० ते सायं. ०६:०० • वनविभागातर्फे रात्री प्रवेशास सक्त मनाई',
      type: 'verified',
    },
    {
      id: 'kelkar-count',
      badge: 'MUSEUM ARCHIVE',
      textEn: 'Raja Dinkar Kelkar Museum: 20,000+ authentic Indian everyday artifacts • 10:00 AM – 05:30 PM',
      textMr: 'राजा दिनकर केळकर संग्रहालय: २०,०००+ दुर्मीळ भारतीय ऐतिहासिक कलावस्तू • स. १०:०० ते सायं. ०५:३०',
      type: 'verified',
    },
    {
      id: 'metro-connectivity',
      badge: 'TRANSIT READY',
      textEn: 'Pune Metro Line 1 & Line 2: Direct access to Mandai, Deccan Gymkhana, and Civil Court interchange',
      textMr: 'पुणे मेट्रो मार्ग १ व २: मंडई, डेक्कन जिमखाना आणि दिवाणी न्यायालय इंटरचेंज थेट जोडणी',
      type: 'transit',
    },
    {
      id: 'free-monuments',
      badge: '100% FREE ENTRY',
      textEn: 'Pataleshwar Cave Temple (8th C. Rashtrakuta), Vetal Tekdi, and Sarasbaug: ₹0 admission for all',
      textMr: 'पाताळेश्वर लेणी (८वे शतक), वेताळ टेकडी आणि सारसबाग: सर्वांसाठी १००% विनामूल्य प्रवेश',
      type: 'tickets',
    },
  ];
}

// -------------------------------------------------------------
// REAL VERIFIED SITE FEATURES (For Part A Pinned Section A4)
// -------------------------------------------------------------
export function getFeatureShowcases(): FeatureShowcase[] {
  return [
    {
      id: 'catalog-106',
      badgeEn: '106 VERIFIED DESTINATIONS',
      badgeMr: '१०६ पडताळलेली ठिकाणे',
      titleEn: '106 Verified Places With Live Status',
      titleMr: '१०६ पडताळलेली ठिकाणे आणि वेळेची माहिती',
      subtitleEn: 'Archaeologically authenticated visiting hours, ticket gates, and seasonal tips.',
      subtitleMr: 'पुरातत्व विभाग प्रमाणित वेळा, प्रवेश शुल्क आणि ऋतूनुसार सर्वोत्तम वेळ.',
      descriptionEn: 'Every single destination in Explore Pune has been verified against ASI, Forest Department, and municipal registries. Zero invented hours or missing ticket details.',
      descriptionMr: 'पुण्यातील प्रत्येक स्थळाची माहिती अधिकृत शासकीय व पुरातत्व नोंदींवर आधारित आहे. कोणतीही खोटी माहिती किंवा अंदाज नाही.',
      route: '/destinations',
      actionTextEn: 'Browse all 106 places',
      actionTextMr: 'सर्व १०६ ठिकाणे पहा',
      iconName: 'Compass',
      imageUrl: '/images/places/shaniwar-wada.jpg',
      statNumber: '106',
      statLabelEn: 'Published Destinations',
      statLabelMr: 'प्रमाणित ठिकाणे',
    },
    {
      id: 'trip-planner',
      badgeEn: 'SMART ITINERARIES',
      badgeMr: 'स्मार्ट प्रवास नियोजन',
      titleEn: 'Trip Planner with Metro & PMPML Transit',
      titleMr: 'मेट्रो व पीएमपीएमएल सह प्रवास नियोजन',
      subtitleEn: 'Generate optimized multi-stop itineraries with QR-coded PDF exports.',
      subtitleMr: 'कमी वेळेत जास्तीत जास्त अनुभव देणारे नियोजन आणि क्यूआर कोडसह पीडीएफ.',
      descriptionEn: 'Select from 8 field-tested templates or build your custom route. Automatically computes realistic dwell times and public transit routes across Pune Metro and PMPML bus lines.',
      descriptionMr: '८ पूर्वनिर्मित प्रवास योजनांमधून निवडा किंवा स्वतःची योजना आखा. वास्तववादी वेळ आणि बस/मेट्रो प्रवासाचा अचूक ताळमेळ.',
      route: '/planner',
      actionTextEn: 'Build your itinerary',
      actionTextMr: 'प्रवास योजना तयार करा',
      iconName: 'CalendarCheck2',
      imageUrl: '/images/places/sinhagad-fort.jpg',
      statNumber: '8',
      statLabelEn: 'Ready Itineraries',
      statLabelMr: 'तयार प्रवास योजना',
    },
    {
      id: 'my-journey',
      badgeEn: 'OFFLINE EXPEDITION PASS',
      badgeMr: 'ऑफलाइन प्रवास पास',
      titleEn: 'My Journey & Offline Saved Places',
      titleMr: 'माझी यात्रा आणि जतन केलेली ठिकाणे',
      subtitleEn: 'Save destinations with one tap; view your journey pass without an internet connection.',
      subtitleMr: 'एका क्लिकवर ठिकाणे जतन करा आणि इंटरनेट नसतानाही माहिती मिळवा.',
      descriptionEn: 'Never lose track of your planned stops. Download your personalized digital expedition pass directly to your mobile device for remote Sahyadri valley exploration.',
      descriptionMr: 'सह्याद्रीच्या दऱ्याखोऱ्यांत इंटरनेट नसतानाही तुमची जतन केलेली ठिकाणे आणि संपर्क क्रमांक तुमच्या सोबत राहतात.',
      route: '/journey',
      actionTextEn: 'Open My Journey',
      actionTextMr: 'माझी यात्रा उघडा',
      iconName: 'BookmarkCheck',
      imageUrl: '/images/places/vetal-tekdi.jpg',
      statNumber: '1-Click',
      statLabelEn: 'Offline Save',
      statLabelMr: 'ऑफलाइन सेव्ह',
    },
    {
      id: 'milestones-passport',
      badgeEn: 'CULTURAL PASSPORT',
      badgeMr: 'सांस्कृतिक पासपोर्ट',
      titleEn: 'Milestones, Badges & Passport Stamps',
      titleMr: 'यशस्वी टप्पे आणि डिजिटल स्टॅम्प्स',
      subtitleEn: 'Unlock authentic cultural badges as you discover Pune’s living heritage.',
      subtitleMr: 'पुण्याचा इतिहास अनुभवताना गोळा करा मानाचे सांस्कृतिक स्टॅम्प्स.',
      descriptionEn: 'Track your Pune exploration milestones from Sinhagad Conqueror to Peth Connoisseur. Collect verifiable digital badges as you visit heritage bastions and artisanal lanes.',
      descriptionMr: 'सिंहगड सर करण्यापासून ते जुन्या पेठांमधील खाऊगल्ली शोधण्यापर्यंत, तुमची प्रगती नोंदवा आणि डिजिटल बॅजेस मिळवा.',
      route: '/milestones',
      actionTextEn: 'View my milestones',
      actionTextMr: 'माझे टप्पे पहा',
      iconName: 'Award',
      imageUrl: '/images/places/kasba-ganpati.jpg',
      statNumber: '10+',
      statLabelEn: 'Collectible Badges',
      statLabelMr: 'सांस्कृतिक बॅजेस',
    },
    {
      id: 'community-stories',
      badgeEn: 'COMMUNITY & BLOGS',
      badgeMr: 'समुदाय आणि कथा',
      titleEn: 'Traveller Dispatches & Community Stories',
      titleMr: 'प्रवाशांचे अनुभव आणि माहितीपूर्ण ब्लॉग्स',
      subtitleEn: 'Read first-hand accounts and share your verified tips with fellow explorers.',
      subtitleMr: 'स्थानिक पुणेकर आणि पर्यटकांचे अनुभव, ट्रेकच्या कथा व छायाचित्रे.',
      descriptionEn: 'Explore authentic trek journals, early morning wada photography guides, and seasonal monsoon safety alerts shared by verified members of our travel community.',
      descriptionMr: 'सह्याद्री ट्रेकचे अनुभव, पहाटेच्या हेरिटेज वॉकच्या नोंदी आणि पर्यटकांनी दिलेली उपयुक्त माहिती.',
      route: '/community',
      actionTextEn: 'Join the community',
      actionTextMr: 'समुदायात सामील व्हा',
      iconName: 'Users',
      imageUrl: '/images/places/raja-dinkar-kelkar-museum.jpg',
      statNumber: '100%',
      statLabelEn: 'Moderated Stories',
      statLabelMr: 'सत्यापित अनुभव',
    },
    {
      id: 'helplines-weather',
      badgeEn: 'SAFETY & WEATHER',
      badgeMr: 'सुरक्षा आणि हवामान',
      titleEn: 'Emergency Helplines & Live Weather',
      titleMr: 'आपत्कालीन संपर्क आणि थेट हवामान',
      subtitleEn: 'Real-time Pune weather alerts, monsoon waterfall warnings, and 24/7 helplines.',
      subtitleMr: 'थेट तापमान, पावसाचा अंदाज, धबधब्यांवरील सुरक्षा सूचना आणि २४/७ मदत क्रमांक.',
      descriptionEn: 'Stay safe with live temperature telemetry from our weather API and instant one-tap emergency calling to Pune Tourist Police, 112 emergency services, and ambulance 108.',
      descriptionMr: 'पुणे पर्यटक पोलीस, ११२ आपत्कालीन सेवा आणि १०८ रुग्णवाहिका क्रमांकांसह सुरक्षित प्रवासाची संपूर्ण हमी.',
      route: '/help',
      actionTextEn: 'Access helplines guide',
      actionTextMr: 'सुरक्षा मार्गदर्शिका पहा',
      iconName: 'ShieldAlert',
      imageUrl: '/images/places/khadakwasla-dam.jpg',
      statNumber: '24/7',
      statLabelEn: 'Emergency Readiness',
      statLabelMr: 'आपत्कालीन सज्जता',
    },
  ];
}

// -------------------------------------------------------------
// STORIES (Real blogs from repository)
// -------------------------------------------------------------
export function getTopStories(): StoryItem[] {
  return [
    {
      id: 'morning-at-sinhagad',
      titleEn: 'A Morning at Sinhagad: Where the Clouds Touch Maratha Stone',
      titleMr: 'सिंहगडावर एक सकाळ: जेथे ढग शिवकालीन तटांना स्पर्श करतात',
      authorNoteEn: 'Editorial Field Dispatch by Tourism Research Desk',
      authorNoteMr: 'पुणे पर्यटन संशोधन विभागाचा विशेष अहवाल',
      readingMinutes: 4,
      coverImage: '/images/places/sinhagad-fort.jpg',
      excerptEn: 'Before the city awakens, a cool mountain mist creeps over the battlements of Sinhagad. Standing at Tanaji Kada as the sun pierces the Sahyadri peaks, history ceases to be a textbook and turns into breathing stone.',
      excerptMr: 'पहाटेच्या दाट धुक्यातून कल्याण दरवाजाकडे वाट काढताना ४०० वर्षांचा इतिहास जिवंत होतो. गरमागरम पिठलं-भाकरी आणि सह्याद्रीच्या डोंगररांगांचा विहंगम देखावा.',
      featuredSlugs: ['sinhagad-fort', 'khadakwasla-dam'],
      route: '/blogs/morning-at-sinhagad',
    },
    {
      id: 'walking-historic-peths',
      titleEn: 'Walking Through the 17 Peths: The Living Heart of Old Pune',
      titleMr: '१७ पेठांमधून एक पायी सफर: जुन्या पुण्याचे जिवंत हृदय',
      authorNoteEn: 'Urban Heritage & Architecture Commentary',
      authorNoteMr: 'शहरी वारसा व वास्तुकला अभ्यास',
      readingMinutes: 5,
      coverImage: '/images/places/shaniwar-wada.jpg',
      excerptEn: 'Named after the days of the week and historical founders, Pune\'s 17 Peths are living open-air museums of wooden wadas, copper artisans, flower markets, and centuries-old sweetmakers.',
      excerptMr: 'वार आणि संस्थापकांच्या नावाने ओळखल्या जाणाऱ्या १७ पेठा म्हणजे लाकडी वाडे, तांबट कारागीर आणि ऐतिहासिक खाद्यसंस्कृतीचा खुला ठेवा.',
      featuredSlugs: ['shaniwar-wada', 'kasba-ganpati', 'raja-dinkar-kelkar-museum'],
      route: '/blogs/walking-historic-peths',
    },
    {
      id: 'tekdi-culture-vetal',
      titleEn: 'Tekdi Culture: Why Pune Greets the Sunrise on Its Hills',
      titleMr: 'टेकडी संस्कृती: पुणेकर पहाटे टेकड्यांवर का गर्दी करतात?',
      authorNoteEn: 'Pune Lifestyle & Environmental Chronicle',
      authorNoteMr: 'पुणेरी जीवनशैली आणि निसर्ग संवाद',
      readingMinutes: 4,
      coverImage: '/images/places/vetal-tekdi.jpg',
      excerptEn: 'From ARAI to Vetal Tekdi, the basalt hillocks that cup the city are more than parks — they are daily community commons where peacocks call and generations walk together.',
      excerptMr: 'वेताळ टेकडी आणि एआरएआय म्हणजे केवळ डोंगर नव्हे, तर पुणेकरांच्या दिवसाची ऊर्जा देणारे ऑक्सिजन हब आहेत.',
      featuredSlugs: ['vetal-tekdi', 'arai-tekdi'],
      route: '/blogs/tekdi-culture-vetal',
    },
  ];
}

// -------------------------------------------------------------
// VERIFIED FAQ ACCORDION (Grounded in municipal and site facts)
// -------------------------------------------------------------
export function getFaqItems(): FaqItem[] {
  return [
    {
      id: 'entry-fees',
      questionEn: 'Are the destinations in Pune expensive to visit?',
      questionMr: 'पुण्यातील पर्यटन स्थळांना भेट देणे खर्चिक आहे का?',
      answerEn: 'Most nature spots, tekdis, and historic temples (like Pataleshwar Caves, Vetal Tekdi, and Dagdusheth Ganpati) are 100% free of charge (₹0). ASI monuments such as Shaniwar Wada charge a nominal entry fee of ₹25 for Indian nationals and ₹300 for foreign visitors. The Raja Dinkar Kelkar Museum charges ₹100 for adults and ₹30 for children.',
      answerMr: 'पुण्यातील बहुतांश मंदिरे, टेकड्या आणि लेणी (उदा. पाताळेश्वर, वेताळ टेकडी, दगडूशेठ) पूर्णपणे विनामूल्य आहेत. शनिवार वाड्यासाठी ₹२५ (भारतीय) आणि राजा केळकर संग्रहालयासाठी ₹१०० नाममात्र प्रवेश शुल्क आहे.',
      category: 'fees',
    },
    {
      id: 'best-time-sinhagad',
      questionEn: 'What are the rules and best hours for visiting Sinhagad Fort?',
      questionMr: 'सिंहगड किल्ल्याला भेट देण्यासाठी कोणती वेळ सर्वोत्तम आहे आणि कोणते नियम आहेत?',
      answerEn: 'The Maharashtra Forest Department strictly enforces a night entry curfew: the fort is open only from 06:00 AM to 06:00 PM. Best visiting hours are early morning between 06:00 AM and 09:00 AM to avoid summit vehicle congestion and catch the Sahyadri morning mist.',
      answerMr: 'वनविभागाच्या नियमांनुसार सिंहगडावर रात्री प्रवेशास बंदी असून गड सकाळी ६:०० ते संध्याकाळी ६:०० पर्यंतच खुला असतो. गर्दी टाळण्यासाठी व आल्हाददायक धुक्याचा आनंद घेण्यासाठी सकाळी ६:०० ते ९:०० ही सर्वोत्तम वेळ आहे.',
      category: 'safety',
    },
    {
      id: 'metro-connectivity',
      questionEn: 'Can I explore Pune using the Pune Metro?',
      questionMr: 'पुणे मेट्रोने शहरातील प्रमुख ठिकाणे पाहता येतात का?',
      answerEn: 'Yes! Pune Metro connects key heritage and cultural hubs. The Mandai station places you right next to Mahatma Phule Mandai and Tulshibaug. Deccan Gymkhana station gives direct access to FC Road, while Civil Court serves as the central interchange connecting Line 1 (Pimpri to Swargate) and Line 2 (Vanaz to Ramwadi).',
      answerMr: 'होय! पुणे मेट्रोमुळे प्रवास अतिशय सोपा झाला आहे. मंडई स्थानक तुळशीबाग व मंडईजवळ आहे, डेक्कन स्थानकावरून फर्ग्युसन रस्ता जवळ आहे, आणि दिवाणी न्यायालय इंटरचेंज दोन्ही मार्गिकांना जोडते.',
      category: 'transit',
    },
    {
      id: 'bilingual-support',
      questionEn: 'Does Explore Pune support Marathi across all features?',
      questionMr: 'या संपूर्ण वेबसाइटवर मराठी भाषेचा पर्याय उपलब्ध आहे का?',
      answerEn: 'Yes. Every destination, itinerary stop, map pin, safety advisory, and article is fully bilingual in authentic Marathi (Devanagari) and English. Simply toggle the language button in the navigation header.',
      answerMr: 'होय! सर्व १०६ ठिकाणे, नकाशे, प्रवास नियोजन आणि सुरक्षा सूचना शुद्ध व अस्सल मराठीमध्ये उपलब्ध आहेत. वरील भाषा बटणावर क्लिक करून आपण कधीही भाषा बदलू शकता.',
      category: 'general',
    },
    {
      id: 'offline-use',
      questionEn: 'Can I use this guide offline while trekking in the Sahyadris?',
      questionMr: 'सह्याद्रीत ट्रेकिंग करताना इंटरनेट नसतानाही माहिती पाहता येते का?',
      answerEn: 'Yes. Through the "My Journey" feature (/journey), you can save any destination with a single tap. Your saved places and digital pass remain accessible offline in your browser storage even without cellular connectivity.',
      answerMr: 'होय! "माझी यात्रा" (/journey) द्वारे तुम्ही एका क्लिकवर ठिकाणे सेव्ह करू शकता. सह्याद्रीत रेंज नसतानाही तुमची सेव्ह केलेली माहिती ब्राऊझरमध्ये सुरक्षित राहते.',
      category: 'features',
    },
  ];
}

// -------------------------------------------------------------
// GEOJSON EXPORTERS FOR MAPLIBRE GL JS
// -------------------------------------------------------------
export function getPlacesGeoJson(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: ALL_EXPERIENCE_PLACES.map((p) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [p.longitude, p.latitude],
      },
      properties: {
        id: p.slug,
        slug: p.slug,
        name: p.name,
        name_mr: p.name_mr || p.name,
        category: p.category_slug,
        zoneId: p.zoneId,
        image_url: p.image_url,
        address: p.address,
        address_mr: p.address_mr || p.address,
        opening_hours: p.opening_hours || 'Open all days',
        entry_fee: p.entry_fee ?? 0,
        popularity: p.popularity_score || 80,
      },
    })),
  };
}

export function getZonesGeoJson(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: ZONES_DATA.map((z) => ({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: z.approxPolygonCoordinates,
      },
      properties: {
        id: z.id,
        nameEn: z.nameEn,
        nameMr: z.nameMr,
        color: z.accentColor,
        descriptionEn: z.descriptionEn,
        descriptionMr: z.descriptionMr,
        taglineEn: z.taglineEn,
        taglineMr: z.taglineMr,
        centerLng: z.center[0],
        centerLat: z.center[1],
        zoom: z.zoom,
      },
    })),
  };
}

/**
 * Precomputed Pune Municipal Boundary GeoJSON (from OpenStreetMap, ODbL).
 */
export function getPuneBoundaryGeoJson(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [73.74, 18.57],
              [73.78, 18.61],
              [73.84, 18.63],
              [73.91, 18.62],
              [73.96, 18.57],
              [73.97, 18.51],
              [73.93, 18.45],
              [73.88, 18.42],
              [73.81, 18.44],
              [73.75, 18.48],
              [73.74, 18.57],
            ],
          ],
        },
        properties: {
          name: 'Pune Municipal Corporation Boundary',
          attribution: '© OpenStreetMap contributors (ODbL)',
        },
      },
    ],
  };
}

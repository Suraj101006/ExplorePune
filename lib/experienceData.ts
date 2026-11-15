import placesData from '@/data/pune_places_106.json';

export interface ExperiencePlace {
  id: string;
  slug: string;
  name: string;
  name_mr?: string;
  category_slug: string;
  category: string;
  place_categories?: Array<{ slug: string; name?: string } | string>;
  image_url: string;
  description: string;
  description_mr?: string;
  address: string;
  address_mr?: string;
  best_time?: string;
  best_time_mr?: string;
  latitude: number;
  longitude: number;
  data_tier?: string;
  popularity_score?: number;
  recommended_duration_minutes?: number;
  entry_fee?: number;
  fee_status?: string;
  fee_details?: any;
  opening_hours?: string;
  opening_hours_mr?: string;
  weekly_closure?: string;
  weekly_closure_mr?: string;
}

export const ALL_106_PLACES: ExperiencePlace[] = placesData as unknown as ExperiencePlace[];

// Quick slug lookup map
export const PLACES_BY_SLUG: Record<string, ExperiencePlace> = ALL_106_PLACES.reduce(
  (acc, p) => {
    acc[p.slug] = p;
    return acc;
  },
  {} as Record<string, ExperiencePlace>
);

// -------------------------------------------------------------
// SECTION 02: 16 EXPERIENCE CATEGORIES
// -------------------------------------------------------------
export interface ExperienceCategory {
  id: string;
  title: string;
  titleMr: string;
  tagline: string;
  description: string;
  iconName: string;
  coverImage: string;
  slugFilter: (place: ExperiencePlace) => boolean;
}

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  {
    id: 'heritage-history',
    title: 'Heritage & History',
    titleMr: 'वारसा आणि इतिहास',
    tagline: 'Centuries of Maratha, Peshwa and Freedom-Era Valor',
    description: 'Explore the monumental wadas, historic bastions, and royal corridors where Pune shaped the course of Indian history.',
    iconName: 'Landmark',
    coverImage: '/images/places/shaniwar-wada.jpg',
    slugFilter: (p) => p.category_slug === 'heritage' || p.category_slug === 'forts',
  },
  {
    id: 'forts-adventure',
    title: 'Forts & Adventure',
    titleMr: 'किल्ले आणि साहस',
    tagline: 'Towering Sahyadri Strongholds & Ridge Treks',
    description: 'Conquer dramatic cloud-veiled peaks, ancient stone gateways, and historical ramparts built into jagged basalt ridges.',
    iconName: 'Mountain',
    coverImage: '/images/places/sinhagad-fort.jpg',
    slugFilter: (p) => p.category_slug === 'forts',
  },
  {
    id: 'spiritual-experiences',
    title: 'Spiritual Experiences',
    titleMr: 'अध्यात्म आणि मंदिरे',
    tagline: 'Ancient Devasthans, Ashta Vinayakas & Shrines',
    description: 'Immerse in divine resonance from the historic Kasba and Dagdusheth Ganpatis to ancient rock-cut Shiva shrines.',
    iconName: 'Flame',
    coverImage: '/images/places/shreemant-dagdusheth-halwai-ganpati.jpg',
    slugFilter: (p) => p.category_slug === 'temples',
  },
  {
    id: 'nature-outdoors',
    title: 'Nature & Outdoors',
    titleMr: 'निसर्ग आणि शांतता',
    tagline: 'Urban Tekdis, Misty Lakes and Sahyadri Waterfalls',
    description: 'Breathe crisp morning air on Vetal Tekdi, witness Khadakwasla sunsets, and wander scenic garden walkways.',
    iconName: 'Trees',
    coverImage: '/images/places/vetal-tekdi.jpg',
    slugFilter: (p) => p.category_slug === 'nature' || p.category_slug === 'parks',
  },
  {
    id: 'food-culinary',
    title: 'Food & Culinary Experiences',
    titleMr: 'पुणेरी खाद्यसंस्कृती',
    tagline: 'Fiery Misal, Creamy Mastani and Irani Heritage',
    description: 'Savour iconic culinary traditions from Bedekar and Katakirr to Chitale Bakarwadi and heritage Irani bun maska.',
    iconName: 'Utensils',
    coverImage: '/images/places/bedekar-tea-stall-misal.jpg',
    slugFilter: (p) => p.category_slug === 'food',
  },
  {
    id: 'culture-traditions',
    title: 'Culture & Traditions',
    titleMr: 'संस्कृती आणि परंपरा',
    tagline: 'Ganeshotsav, Dhol-Tasha & Coppersmith Alleys',
    description: 'Feel the rhythmic heartbeat of Pune through 400-year-old copper beating in Tambat Ali and theatrical legacies.',
    iconName: 'Sparkles',
    coverImage: '/images/places/tambat-ali-craft-quarter.jpg',
    slugFilter: (p) =>
      ['tambat-ali-craft-quarter', 'balgandharva-ranga-mandir', 'kasba-ganpati', 'shreemant-dagdusheth-halwai-ganpati', 'kesari-wada'].includes(p.slug) ||
      p.category_slug === 'heritage',
  },
  {
    id: 'art-architecture',
    title: 'Art & Architecture',
    titleMr: 'कला आणि स्थापत्य',
    tagline: 'Monolithic Rock-Cut Marvels & Intricate Woodcraft',
    description: 'Marvel at 8th-century Rashtrakuta basalt carvings at Pataleshwar and multi-storied timber wadas of the Peshwa court.',
    iconName: 'Palette',
    coverImage: '/images/places/pataleshwar-cave-temple.jpg',
    slugFilter: (p) =>
      ['pataleshwar-cave-temple', 'vishrambaug-wada', 'raja-dinkar-kelkar-museum', 'shinde-chhatri', 'karla-caves', 'bhaja-caves'].includes(p.slug) ||
      p.category_slug === 'museums',
  },
  {
    id: 'markets-shopping',
    title: 'Markets & Shopping',
    titleMr: 'बाजार आणि खरेदी',
    tagline: 'Historic Bazaars, Brassware and FC Road Boutiques',
    description: 'Wander through sensory shopping trails in Tulshibaug, brass-lined Tambat alleys, and bustling Deccan fashion avenues.',
    iconName: 'ShoppingBag',
    coverImage: '/images/places/tulshibaug-temple.jpg',
    slugFilter: (p) =>
      ['tulshibaug-temple', 'tambat-ali-craft-quarter', 'fc-road-culinary-trail', 'chitale-bandhu-bakarwadi', 'kayani-bakery-camp'].includes(p.slug),
  },
  {
    id: 'museums-learning',
    title: 'Museums & Learning',
    titleMr: 'संग्रहालये आणि ज्ञान',
    tagline: 'Living Curiosities, Tribal Archives & Miniature Railways',
    description: 'Encounter extraordinary collections at Raja Dinkar Kelkar Museum, Blades of Glory Cricket gallery, and Pune Rail Museum.',
    iconName: 'Compass',
    coverImage: '/images/places/raja-dinkar-kelkar-museum.jpg',
    slugFilter: (p) => p.category_slug === 'museums',
  },
  {
    id: 'festivals-events',
    title: 'Festivals & Events',
    titleMr: 'उत्सव आणि सोहळे',
    tagline: 'The World-Renowned 10-Day Puneri Ganeshotsav',
    description: 'Experience electric festive fervor as Pune comes alive with dhol-tasha beats, floral rangolis, and community celebrations.',
    iconName: 'PartyPopper',
    coverImage: '/images/places/kasba-ganpati.jpg',
    slugFilter: (p) =>
      ['kasba-ganpati', 'shreemant-dagdusheth-halwai-ganpati', 'parvati-hill', 'sarasbaug-ganpati', 'alandi-dnyaneshwar-mandir'].includes(p.slug),
  },
  {
    id: 'nightlife-entertainment',
    title: 'Nightlife & Entertainment',
    titleMr: 'रात्रजीवन आणि विरंगुळा',
    tagline: 'Vibrant Cafe Culture, Theatre & Sunset Lookouts',
    description: 'Unwind at atmospheric Koregaon Park cafes, catch a live Marathi drama at Balgandharva, or soak in dusk over the hills.',
    iconName: 'Moon',
    coverImage: '/images/places/balgandharva-ranga-mandir.jpg',
    slugFilter: (p) =>
      ['balgandharva-ranga-mandir', 'fc-road-culinary-trail', 'sujata-mastani-sadashiv-peth', 'parvati-hill', 'kayani-bakery-camp'].includes(p.slug),
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    titleMr: 'अनोखे आणि दुर्लक्षित ठिकाणे',
    tagline: 'Secret Three-Trunked Shrines & Antique Bicycles',
    description: 'Step off the tourist trail to uncover secret stepwells, curious mechanical museums, and secluded sacred groves.',
    iconName: 'Compass',
    coverImage: '/images/places/trishund-ganpati-temple.jpg',
    slugFilter: (p) =>
      ['trishund-ganpati-temple', 'someshwar-temple-pashan', 'joshi-miniature-railway', 'vikram-pendse-cycles-museum', 'bhide-wada', 'bhor-rajwada-palace'].includes(p.slug),
  },
  {
    id: 'family-experiences',
    title: 'Family Experiences',
    titleMr: 'कौटुंबिक सहल',
    tagline: 'Zoological Reserves, Toy Trains & Verdant Parks',
    description: 'Delight all ages with the Rajiv Gandhi Zoo & Snake Park, Joshi Miniature Railway, and the serene Okayama Friendship Garden.',
    iconName: 'HeartHandshake',
    coverImage: '/images/places/okayama-friendship-garden.jpg',
    slugFilter: (p) =>
      ['rajiv-gandhi-zoological-park', 'joshi-miniature-railway', 'okayama-friendship-garden', 'sarasbaug', 'empress-botanical-garden'].includes(p.slug),
  },
  {
    id: 'romantic-experiences',
    title: 'Romantic Experiences',
    titleMr: 'शांत आणि रोमँटिक जागा',
    tagline: 'Golden Hour Hilltops & Tranquil Watersides',
    description: 'Share quiet moments watching crimson sunsets over Khadakwasla backwaters or strolling shaded garden bridges.',
    iconName: 'Heart',
    coverImage: '/images/places/khadakwasla-dam.jpg',
    slugFilter: (p) =>
      ['parvati-hill', 'khadakwasla-dam', 'okayama-friendship-garden', 'vetal-tekdi', 'mulshi-dam'].includes(p.slug),
  },
  {
    id: 'photography-locations',
    title: 'Photography Locations',
    titleMr: 'फोटोग्राफीसाठी सर्वोत्तम',
    tagline: 'Gothic Arches, Majestic Gates & Cloud Inversions',
    description: 'Frame legendary compositions at Shaniwar Wada\'s Dilli Darwaza, Aga Khan Italian arches, and Sinhagad\'s windward ridges.',
    iconName: 'Camera',
    coverImage: '/images/places/aga-khan-palace.jpg',
    slugFilter: (p) =>
      ['aga-khan-palace', 'shaniwar-wada', 'sinhagad-fort', 'parvati-hill', 'shinde-chhatri', 'karla-caves'].includes(p.slug),
  },
  {
    id: 'weekend-getaways',
    title: 'Weekend Getaways',
    titleMr: 'आठवड्याच्या शेवटी सहली',
    tagline: 'Monsoon Ghats, Cloud-Capped Forts & Buddhist Caves',
    description: 'Escape the city limits to explore dramatic Lonavala-Khandala ridges, Karla and Bhaja rock shelters, and Mulshi lake shores.',
    iconName: 'MapPin',
    coverImage: '/images/places/lohagad-fort.jpg',
    slugFilter: (p) =>
      ['lohagad-fort', 'visapur-fort', 'karla-caves', 'bhaja-caves', 'mulshi-dam', 'panshet-dam', 'bhimashankar-jyotirlinga'].includes(p.slug),
  },
];

// -------------------------------------------------------------
// SECTION 04: HISTORICAL TIMELINE & HERITAGE DEEP DIVES
// -------------------------------------------------------------
export interface HeritageEra {
  era: string;
  century: string;
  title: string;
  summary: string;
  keyPlaces: string[];
}

export const PUNE_HERITAGE_TIMELINE: HeritageEra[] = [
  {
    era: 'Rashtrakuta Dynasty',
    century: '8th Century CE',
    title: 'Rock-Cut Monoliths & Early Settlements',
    summary: 'The earliest enduring stone monuments of Pune, carved straight from solid basalt under the Rashtrakutas, establishing Punyavishaya as a sacred trading and spiritual crossroads.',
    keyPlaces: ['pataleshwar-cave-temple'],
  },
  {
    era: 'Maratha Kingdom',
    century: '17th Century CE',
    title: 'Chhatrapati Shivaji Maharaj & Sinhagad',
    summary: 'Shivaji Maharaj spent his childhood at Lal Mahal with Rajmata Jijau, establishing the Swarajya flag across Sahyadri bastions like Sinhagad, Rajgad, and Torna.',
    keyPlaces: ['lal-mahal', 'sinhagad-fort', 'rajgad-fort', 'torna-fort'],
  },
  {
    era: 'Peshwa Golden Age',
    century: '18th Century CE',
    title: 'The Imperial Capital of the Maratha Empire',
    summary: 'Peshwa Bajirao I declared Pune the political capital of the Maratha Empire, constructing the formidable Shaniwar Wada, Parvati Temple complex, and establishing the planned Peth merchant quarters.',
    keyPlaces: ['shaniwar-wada', 'vishrambaug-wada', 'parvati-hill', 'nana-wada'],
  },
  {
    era: 'Reform & Freedom Movement',
    century: '19th & 20th Century CE',
    title: 'The Crucible of Social Transformation & Freedom',
    summary: 'Mahatma Jyotirao and Savitribai Phule championed universal education, Lokmanya Tilak forged national unity at Kesari Wada, and Mahatma Gandhi was interned at the Aga Khan Palace during the 1942 Quit India struggle.',
    keyPlaces: ['aga-khan-palace', 'kesari-wada', 'mahatma-phule-wada', 'bhide-wada'],
  },
];

// -------------------------------------------------------------
// SECTION 05: FORTS & ADVENTURE CATALOG
// -------------------------------------------------------------
export interface FortAdventure {
  slug: string;
  name: string;
  marathiName: string;
  elevationMeters: number;
  difficulty: 'Easy' | 'Moderate' | 'Easy to Moderate' | 'Challenging' | 'Strenuous';
  trekDurationHours: string;
  distanceFromPuneKm: number;
  bestSeason: string;
  baseVillage: string;
  accessibility: string;
  safetyAdvisory: string;
  facilities: string;
  highlights: string[];
}

export const FORTS_ADVENTURE_DATA: FortAdventure[] = [
  {
    slug: 'sinhagad-fort',
    name: 'Sinhagad Fort (Lion\'s Fort)',
    marathiName: 'सिंहगड किल्ला',
    elevationMeters: 1312,
    difficulty: 'Moderate',
    trekDurationHours: '1.5 - 2 hrs (climb)',
    distanceFromPuneKm: 30,
    bestSeason: 'Monsoon & Winter (July - Feb)',
    baseVillage: 'Donje / Golewadi Paytha',
    accessibility: 'Motorable ghat road available up to top parking (₹50-₹100 toll) or hiking trail from Donje Paytha.',
    safetyAdvisory: 'Forest Department curfew 06:00 PM to 06:00 AM. Steep windward drop-offs at Tanaji Kada; slippery rocks in heavy rain.',
    facilities: 'Authentic pithla-bhakri, kanda bhaji, matka dahi food stalls; basic washrooms near top parking.',
    highlights: ['Tanaji Malusare Samadhi', 'Kalyan Darwaza', 'Pune Kendra Doordarshan Tower', 'Panoramic Khadakwasla views'],
  },
  {
    slug: 'rajgad-fort',
    name: 'Rajgad Fort (King of Forts)',
    marathiName: 'राजगड किल्ला',
    elevationMeters: 1376,
    difficulty: 'Challenging',
    trekDurationHours: '3 - 4 hrs (climb)',
    distanceFromPuneKm: 55,
    bestSeason: 'Winter & Post-Monsoon (Oct - Feb)',
    baseVillage: 'Gunjavane (via Chor Darwaza) or Pali',
    accessibility: 'Steep trekking trails only. No motorable road to top.',
    safetyAdvisory: 'Exposed rocky patches with iron railings near Chor Darwaza. Carry at least 2-3 litres of drinking water.',
    facilities: 'Basic local food available on Padmavati Machi; temple shelter for overnight camping with prior permission.',
    highlights: ['Bale Killa citadel', 'Sanjivani Machi zigzag fortification', 'Suvela Machi natural rock needle hole (Nedhe)'],
  },
  {
    slug: 'torna-fort',
    name: 'Torna Fort (Prachandagad)',
    marathiName: 'तोरणा किल्ला (प्रचंडगड)',
    elevationMeters: 1403,
    difficulty: 'Strenuous',
    trekDurationHours: '3.5 - 4.5 hrs (climb)',
    distanceFromPuneKm: 65,
    bestSeason: 'September to February',
    baseVillage: 'Velhe',
    accessibility: 'Trekking path with steep scree slopes and rock-cut stairs with safety chains.',
    safetyAdvisory: 'Extremely high winds along Zunjar Machi ridge. High stamina required; avoid descent after dark.',
    facilities: 'Mengai Devi Temple provides emergency shelter; local villagers at Velhe offer meals and guide support.',
    highlights: ['First fort captured by Shivaji Maharaj in 1646', 'Budhla Machi ridge', 'Towering altitude over Sahyadris'],
  },
  {
    slug: 'purandar-fort',
    name: 'Purandar Fort',
    marathiName: 'पुरंदर किल्ला',
    elevationMeters: 1398,
    difficulty: 'Moderate',
    trekDurationHours: '1.5 - 2 hrs',
    distanceFromPuneKm: 45,
    bestSeason: 'July to February',
    baseVillage: 'Ghavar / Saswad',
    accessibility: 'Motorable road leads to military checkpoint; remainder reached on foot through fortified stone gates.',
    safetyAdvisory: 'Located within active Indian Army Academy perimeter. Mandatory Indian Government Photo ID check. Entry closes at 05:00 PM.',
    facilities: 'Clean parking, basic refreshments near cantonment gate.',
    highlights: ['Birthplace of Chhatrapati Sambhaji Maharaj', 'Murarbaji Deshpande Statue', 'Kedareshwar Temple at peak'],
  },
  {
    slug: 'lohagad-fort',
    name: 'Lohagad Fort (Iron Fort)',
    marathiName: 'लोहगड किल्ला',
    elevationMeters: 1033,
    difficulty: 'Easy',
    trekDurationHours: '1 - 1.5 hrs',
    distanceFromPuneKm: 60,
    bestSeason: 'Monsoon (June - Sept) & Winter',
    baseVillage: 'Malavali / Lohagadwadi',
    accessibility: 'Well-carved stone steps with railings up to the top. Local train connectivity to Malavali Station.',
    safetyAdvisory: 'Vinchukata (Scorpion\'s Tail) ridge can have ferocious crosswinds; stay well clear of edges during heavy rain.',
    facilities: 'Local tea, sweet corn, and bhakri stalls at Lohagadwadi base.',
    highlights: ['Vinchukata narrow promontory', 'Four consecutive defense gates', 'Laxmi Kothi underground caves'],
  },
  {
    slug: 'visapur-fort',
    name: 'Visapur Fort',
    marathiName: 'विसापूर किल्ला',
    elevationMeters: 1084,
    difficulty: 'Moderate',
    trekDurationHours: '2 - 2.5 hrs',
    distanceFromPuneKm: 62,
    bestSeason: 'Monsoon (famous for waterfall staircase)',
    baseVillage: 'Bhaje Village / Malavali',
    accessibility: 'Trail goes through a seasonal rocky stream bed and forest trail.',
    safetyAdvisory: 'Walking up active waterfall steps requires non-slip trekking footwear. Avoid trekking during flash flood red alerts.',
    facilities: 'Food stalls available at Bhaja base village; none on the fort plateau.',
    highlights: ['Ascending through cascading waterfall stairs', 'Expansive plateau with ruins', 'Direct view across to Lohagad'],
  },
  {
    slug: 'tikona-fort',
    name: 'Tikona Fort (Vitandgad)',
    marathiName: 'तिकोना किल्ला (वितंडगड)',
    elevationMeters: 1076,
    difficulty: 'Easy to Moderate',
    trekDurationHours: '1 - 1.5 hrs',
    distanceFromPuneKm: 50,
    bestSeason: 'August to February',
    baseVillage: 'Tikona Peth / Kamshet',
    accessibility: 'Trail with engineered steep stone steps and safety rope railings.',
    safetyAdvisory: 'Final vertical rock staircase is very steep; take steps one at a time holding the cable railing.',
    facilities: 'Water tank (non-potable); snacks and tea at Tikona Peth parking.',
    highlights: ['Triangular pyramid profile visible for miles', 'Trimbakeshwar Mahadev Temple', 'Views of Pawna Dam reservoir'],
  },
];

// -------------------------------------------------------------
// SECTION 06: TASTE OF PUNE (CULINARY REGISTRY)
// -------------------------------------------------------------
export interface CulinaryDelight {
  id: string;
  dishName: string;
  dishNameMr: string;
  tagline: string;
  description: string;
  culturalBackground: string;
  whereToTry: string;
  verifiedAddress: string;
  priceRange: string;
  isVegetarian: boolean;
  timings: string;
  imageUrl: string;
  placeSlug?: string;
}

export const TASTE_OF_PUNE_DATA: CulinaryDelight[] = [
  {
    id: 'puneri-misal',
    dishName: 'Authentic Puneri Misal',
    dishNameMr: 'पुणेरी मिसळ',
    tagline: 'Fiery, Spiced Sprouted Moth Bean Curry with Pohe & Farsan',
    description: 'Puneri Misal is distinctly characterized by its aromatic red "tarri" or "kat", layered over seasoned pohe, matki (sprouted moth beans), and crispy farsan, served with fresh bread buns and lemon wedges.',
    culturalBackground: 'Originated as a protein-rich morning fuel for gymkhana athletes and mill workers in old Pune, it evolved into an intellectual breakfast debate staple across Deccan and Sadashiv Peth.',
    whereToTry: 'Bedekar Tea Stall (Narayan Peth) & Katakirr Misal (Karve Nagar / Deccan)',
    verifiedAddress: '418, Munjabacha Bol, Narayan Peth, Pune 411030',
    priceRange: '₹90 – ₹130 per plate',
    isVegetarian: true,
    timings: '07:30 AM – 07:00 PM (Closed Mondays)',
    imageUrl: '/images/places/bedekar-tea-stall-misal.jpg',
    placeSlug: 'bedekar-tea-stall-misal',
  },
  {
    id: 'sujata-mastani',
    dishName: 'Iconic Sujata Mastani',
    dishNameMr: 'सुजाता मस्तानी',
    tagline: 'Thick Rich Milkshake Crowned with Pure Fruit Ice Cream & Dry Fruits',
    description: 'Pune\'s quintessential signature dessert — neither just a milkshake nor merely ice cream, Mastani is a decadent dessert drink layered with fruit pulp, heavy milk cream, ice cream, and pistachios.',
    culturalBackground: 'Legend attributes the name to the legendary beauty Mastani Bai, consort of Peshwa Bajirao I. Sujata Mastani pioneered the standardized fruit formulation in Sadashiv Peth in the 1960s.',
    whereToTry: 'Sujata Mastani Flagship (Sadashiv Peth)',
    verifiedAddress: '1260, Sadashiv Peth, Near Khanya Murlidhar Temple, Pune 411030',
    priceRange: '₹90 – ₹160 per glass',
    isVegetarian: true,
    timings: '11:00 AM – 11:30 PM (Daily)',
    imageUrl: '/images/places/sujata-mastani-sadashiv-peth.jpg',
    placeSlug: 'sujata-mastani-sadashiv-peth',
  },
  {
    id: 'chitale-bakarwadi',
    dishName: 'Chitale Bandhu Bakarwadi',
    dishNameMr: 'चितळे बंधू बाकरवडी',
    tagline: 'Spiral Crispy Gram Flour Rolls Stuffed with Spiced Poppy & Coconut',
    description: 'A crunchy, deep-fried spiral pastry packed with a secret blend of roasted coconut, sesame, poppy seeds, and fiery Maharashtrian spices balance with tamarind tang.',
    culturalBackground: 'Crafted by the Chitale family in 1976, their automated production line on Bajirao Road created a global Puneri souvenir that visitors carry across continents.',
    whereToTry: 'Chitale Bandhu Mithaiwale (Bajirao Road & Deccan Gymkhana)',
    verifiedAddress: '759/54, Deccan Gymkhana, Pune 411004',
    priceRange: '₹380 per kg',
    isVegetarian: true,
    timings: '09:00 AM – 01:00 PM, 04:00 PM – 08:30 PM (Closed Monday morning)',
    imageUrl: '/images/places/chitale-bandhu-bakarwadi.jpg',
    placeSlug: 'chitale-bandhu-bakarwadi',
  },
  {
    id: 'kayani-shrewsbury',
    dishName: 'Kayani Bakery Shrewsbury Biscuits',
    dishNameMr: 'कायानी बेकरी श्रुजबरी बिस्किटे',
    tagline: 'Melt-in-the-Mouth Heritage British-Parsi Butter Biscuits',
    description: 'World-famous butter cookies with a golden crumb, baked according to the authentic secret formulation preserved since 1955 by the Kayani family.',
    culturalBackground: 'Established by Iranian Parsi immigrants on East Street in the Pune Cantonment, Kayani Bakery remains an enduring emblem of Pune\'s colonial cosmopolitan heritage.',
    whereToTry: 'Kayani Bakery (East Street, Pune Camp)',
    verifiedAddress: '6, Dr Coyaji Rd, East Street, Camp, Pune 411001',
    priceRange: '₹440 per kg',
    isVegetarian: false, // contains eggs
    timings: '07:30 AM – 01:00 PM, 03:30 PM – 08:00 PM (Closed Sundays)',
    imageUrl: '/images/places/kayani-bakery-camp.jpg',
    placeSlug: 'kayani-bakery-camp',
  },
  {
    id: 'irani-chai-bun-maska',
    dishName: 'Irani Chai & Bun Maska',
    dishNameMr: 'इराणी चहा आणि बन मस्का',
    tagline: 'Creamy Slow-Brewed Khada Chai with Fresh Maska-Slathered Pav',
    description: 'A rich, condensed milk tea steeped in brass samovars, paired with warm, crusty buns generously spread with homemade white butter and dipped into hot tea.',
    culturalBackground: 'Colonial-era meeting grounds where generations of poets, students, and freedom fighters gathered around curved bentwood chairs and marble tables.',
    whereToTry: 'Cafe Goodluck (FC Road) & Vohuman Cafe (Near Pune Station)',
    verifiedAddress: 'Fergusson College Road, Deccan Gymkhana, Pune 411004',
    priceRange: '₹40 – ₹90 per serving',
    isVegetarian: true,
    timings: '07:00 AM – 11:00 PM (Daily)',
    imageUrl: '/images/places/fc-road-culinary-trail.jpg',
    placeSlug: 'fc-road-culinary-trail',
  },
  {
    id: 'badshahi-boarding-thali',
    dishName: 'Traditional Puneri Brahmin Thali',
    dishNameMr: 'पुणेरी सात्विक थाळी',
    tagline: 'Simple, Nourishing Home-Style Maharashtrian Thali',
    description: 'Wholesome brass thali featuring steaming varan-bhaat (dal-rice with ghee), freshly rolled hot poli (chapatis), koshimbir (salads), seasonal sabzi, and cooling mattha.',
    culturalBackground: 'Badshahi Boarding House has continuously served authentic, non-commercialized Puneri meals on Tilak Road for nearly a century without altering its austere culinary integrity.',
    whereToTry: 'Badshahi Boarding House (Tilak Road)',
    verifiedAddress: '1187, Sadashiv Peth, Tilak Road, Pune 411030',
    priceRange: '₹140 – ₹180 per thali',
    isVegetarian: true,
    timings: '11:30 AM – 02:30 PM, 07:30 PM – 09:30 PM',
    imageUrl: '/images/places/tulshibaug-temple.jpg',
  },
];

// -------------------------------------------------------------
// SECTION 07: CULTURE & TRADITIONS
// -------------------------------------------------------------
export interface CulturalHeritage {
  title: string;
  titleMr: string;
  subtitle: string;
  description: string;
  significance: string;
  location: string;
  seasonOrFrequency: string;
  imageUrl: string;
}

export const CULTURE_TRADITIONS_DATA: CulturalHeritage[] = [
  {
    title: 'Manache 5 Ganpati & Ganeshotsav',
    titleMr: 'मानाचे ५ गणपती आणि गणेशोत्सव',
    subtitle: 'The 130-Year Tradition Founded by Lokmanya Tilak in 1893',
    description: 'Pune is the birthplace of the Sarvajanik Ganeshotsav. The five revered Manache Ganpatis (Kasba, Tambdi Jogeshwari, Guruji Talim, Tulshibaug, and Kesari Wada) lead the grand immersion procession with strict historical seniority.',
    significance: 'Transformed an intimate household celebration into a historic national movement that united people across barriers during the freedom struggle.',
    location: 'Old Pune Peths (Kasba, Budhwar, Narayan Peth)',
    seasonOrFrequency: 'Bhadrapada month (August / September, 10 Days)',
    imageUrl: '/images/places/kasba-ganpati.jpg',
  },
  {
    title: 'Dhol-Tasha Pathak Culture',
    titleMr: 'ढोल-ताशा पथके',
    subtitle: 'Thunderous Rhythmic Reverence on the Streets of Pune',
    description: 'Over 150 dedicated student-led pathaks practice for months to play synchronized dhol, tasha, and dhwaj routines in pure traditional attire (kurta-pyjama and saffron fentas).',
    significance: 'A disciplined civic youth tradition combining physical vigor, musical precision, and community devotion with zero commercial remuneration.',
    location: 'Laxmi Road, Tilak Road & Alka Talkies Chowk',
    seasonOrFrequency: 'Ganesh Festival & Maharashtra Day',
    imageUrl: '/images/places/shreemant-dagdusheth-halwai-ganpati.jpg',
  },
  {
    title: 'Tambat Ali Coppersmithing Heritage',
    titleMr: 'तांबट आळी — तांबे-पितळेचे शिल्प',
    subtitle: '400 Years of Rhythmic Hammering in Kasba Peth',
    description: 'Tambat Ali is Pune\'s living artisan quarter where generational coppersmiths shape and beat glowing copper into water vessels (bamb), cooking pots, and sacred pujaware with rhythmic hammer strikes called "matharkaam".',
    significance: 'Settled by Peshwas in the 17th century to forge cannon parts and coinage; today preserved as an irreplaceable living industrial craft.',
    location: 'Tambat Ali, Kasba Peth, Pune',
    seasonOrFrequency: 'Year-Round (Best visited weekdays 10 AM - 5 PM)',
    imageUrl: '/images/places/tambat-ali-craft-quarter.jpg',
  },
  {
    title: 'Marathi Theatre & Natyasangeet',
    titleMr: 'मराठी रंगभूमी आणि नाट्यसंगीत',
    subtitle: 'The Intellectual Stage at Balgandharva Ranga Mandir',
    description: 'Pune is the beating heart of experimental and classical Marathi theatre. Audiences queue outside Balgandharva for morning musical plays, intellectual debates, and celebrated social comedies.',
    significance: 'Preserved the musical drama tradition (Sangeet Natak) popularized by the iconic actor-singer Narayan Shripad Rajhans (Balgandharva).',
    location: 'JM Road, Shivajinagar & Tilak Smarak Mandir',
    seasonOrFrequency: 'Year-Round evening & weekend shows',
    imageUrl: '/images/places/balgandharva-ranga-mandir.jpg',
  },
  {
    title: 'Varkari Palkhi Wari Pilgrimage',
    titleMr: 'वारकरी पालखी सोहळा',
    subtitle: '800-Year-Old Walking Pilgrimage Passing Through Pune',
    description: 'Hundreds of thousands of barefoot pilgrims (Varkaris) accompany the holy silver palanquins of Sant Dnyaneshwar (from Alandi) and Sant Tukaram (from Dehu) singing devotional abhangas and playing the veena.',
    significance: 'An unparalleled egalitarian tradition celebrating human brotherhood, spiritual humility, and devotion to Lord Vitthala.',
    location: 'Alandi, Dehu, and halting in Pune City centers',
    seasonOrFrequency: 'Ashadhi Ekadashi Season (June - July)',
    imageUrl: '/images/places/alandi-dnyaneshwar-mandir.jpg',
  },
];

// -------------------------------------------------------------
// SECTION 08: NATURE & PEACEFUL ESCAPES
// -------------------------------------------------------------
export interface NatureSpot {
  slug: string;
  name: string;
  nameMr: string;
  category: 'Urban Tekdi' | 'Lakes & Dams' | 'Monsoon Waterfalls' | 'Botanical Gardens';
  description: string;
  bestTimeOfDay: string;
  seasonalHighlight: string;
  locationScope: 'Within Pune City' | 'Regional Scenic Getaway';
  imageUrl: string;
}

export const NATURE_ESCAPES_DATA: NatureSpot[] = [
  {
    slug: 'vetal-tekdi',
    name: 'Vetal Tekdi (ARAI Hill)',
    nameMr: 'वेताळ टेकडी',
    category: 'Urban Tekdi',
    description: 'The highest natural summit within Pune city limits at 800m. A beloved wilderness sanctuary for joggers, birdwatchers, and sunrise meditators.',
    bestTimeOfDay: '05:30 AM – 08:30 AM or 05:00 PM – 07:00 PM',
    seasonalHighlight: 'Lush green carpet during monsoon with migratory birds arriving in winter.',
    locationScope: 'Within Pune City',
    imageUrl: '/images/places/vetal-tekdi.jpg',
  },
  {
    slug: 'taljai-hills',
    name: 'Taljai Hills Reserve',
    nameMr: 'तळजाई टेकडी',
    category: 'Urban Tekdi',
    description: 'A protected municipal forest sanctuary in Sahakar Nagar home to wild peacocks, paved winding walking loops, and quiet bamboo clusters.',
    bestTimeOfDay: 'Early mornings (Peacock sighting hours)',
    seasonalHighlight: 'Verdant canopy from July to November with cool breeze.',
    locationScope: 'Within Pune City',
    imageUrl: '/images/places/taljai-hills.jpg',
  },
  {
    slug: 'parvati-hill',
    name: 'Parvati Hill Summit',
    nameMr: 'पार्वती टेकडी',
    category: 'Urban Tekdi',
    description: 'A 103-step climb up stone stairs leads to 18th-century Peshwa shrines and the most sweeping 360-degree sunset vista of Pune\'s urban skyline.',
    bestTimeOfDay: '05:00 PM – 07:30 PM (Golden hour & dusk)',
    seasonalHighlight: 'Crisp winter evenings with illuminated temple spires.',
    locationScope: 'Within Pune City',
    imageUrl: '/images/places/parvati-hill.jpg',
  },
  {
    slug: 'khadakwasla-dam',
    name: 'Khadakwasla Dam & Reservoir',
    nameMr: 'खडकवासला धरण',
    category: 'Lakes & Dams',
    description: 'The lifeline reservoir of Pune, where water breezes and lakeside stalls serving steaming bhutta (corn) make it a classic Pune afternoon escape.',
    bestTimeOfDay: 'Late afternoon to sunset',
    seasonalHighlight: 'High reservoir levels and misty hills during July - September.',
    locationScope: 'Regional Scenic Getaway',
    imageUrl: '/images/places/khadakwasla-dam.jpg',
  },
  {
    slug: 'mulshi-dam',
    name: 'Mulshi Dam & Tamhini Ghat',
    nameMr: 'मुळशी धरण आणि ताम्हिणी घाट',
    category: 'Monsoon Waterfalls',
    description: 'A breathtaking mountain pass slicing through the Western Ghats, framed by dense mossy forests and hundreds of cascading seasonal waterfalls.',
    bestTimeOfDay: 'Daylight hours only (avoid night transit)',
    seasonalHighlight: 'Spectacular monsoon greenery from July through September.',
    locationScope: 'Regional Scenic Getaway',
    imageUrl: '/images/places/mulshi-dam.jpg',
  },
  {
    slug: 'okayama-friendship-garden',
    name: 'Pune Okayama Friendship Garden',
    nameMr: 'पु ल देशपांडे उद्यान (जपानी गार्डन)',
    category: 'Botanical Gardens',
    description: 'Modeled after the famous 300-year-old Kōraku-en Garden of Okayama, featuring tranquil water canals, wooden arch bridges, and manicured lawns.',
    bestTimeOfDay: '06:00 AM – 10:00 AM & 04:00 PM – 07:30 PM',
    seasonalHighlight: 'Flowering blooms and tranquil koi fish viewing year-round.',
    locationScope: 'Within Pune City',
    imageUrl: '/images/places/okayama-friendship-garden.jpg',
  },
];

// -------------------------------------------------------------
// SECTION 09: HIDDEN GEMS OF PUNE
// -------------------------------------------------------------
export interface HiddenGem {
  slug: string;
  name: string;
  nameMr: string;
  tagline: string;
  description: string;
  whyItsUnique: string;
  locality: string;
  imageUrl: string;
}

export const HIDDEN_GEMS_DATA: HiddenGem[] = [
  {
    slug: 'trishund-ganpati-temple',
    name: 'Trishund Mayureshwar Ganpati',
    nameMr: 'त्रिशुंड गणपती मंदिर',
    tagline: 'The Three-Trunked Lord on a Peacock with Mysterious Carvings',
    description: 'Tucked away in the narrow residential bylanes of Somwar Peth, this 1770 CE stone temple was built by ascetic Bhimjigiri Gosavi in an intricate blend of Rajasthani, Malwa, and South Indian architectural styles.',
    whyItsUnique: 'Features a unique 3-faced, 6-armed Ganesh seated on a peacock, with bas-relief carvings depicting a British soldier chaining a rhinoceros.',
    locality: 'Somwar Peth',
    imageUrl: '/images/places/trishund-ganpati-temple.jpg',
  },
  {
    slug: 'someshwar-temple-pashan',
    name: 'Someshwar Temple Pashan',
    nameMr: 'सोमेश्वर मंदिर पाषाण',
    tagline: '1000-Year-Old Hemadpanthi Temple Beside Ramnadi',
    description: 'An ancient basalt Shiva temple originally constructed during the Yadava dynasty on the banks of the tranquil Ramnadi, later renovated by Shivaji Maharaj\'s mother Rajmata Jijau.',
    whyItsUnique: 'Surrounded by ancient banyan trees and a natural stone water kalyani, offering profound quietude minutes away from Pune\'s IT corridors.',
    locality: 'Pashan',
    imageUrl: '/images/places/someshwar-temple-pashan.jpg',
  },
  {
    slug: 'joshi-miniature-railway',
    name: 'Joshi\'s Museum of Miniature Railway',
    nameMr: 'जोशींचे मिनिएचर रेल्वे संग्रहालय',
    tagline: 'A Handcrafted Marvel of Micro-Scale Trains, Stations & Signals',
    description: 'A passion project by B.S. Joshi, this animated museum features a fully functional miniature city with 1:87 scale working trains, level crossings, steam engines, and night lighting.',
    whyItsUnique: 'The only museum of its kind in India featuring fully automated model trains synchronized to sound effects and narrations.',
    locality: 'Kothrud',
    imageUrl: '/images/places/joshi-miniature-railway.jpg',
  },
  {
    slug: 'vikram-pendse-cycles-museum',
    name: 'Vikram Pendse Cycles Museum',
    nameMr: 'विक्रम पेंडसे सायकल संग्रहालय',
    tagline: 'Century-Old Bicycles & Vintage Mechanical Artifacts',
    description: 'A private museum showcasing rare bicycles dating back to the 1914 BSA Airborne folding bicycle used by British paratroopers in WWII, alongside vintage clocks and gramophones.',
    whyItsUnique: 'A private three-floor museum illustrating the two-wheeled evolution that earned Pune its title as the "Bicycle City of India".',
    locality: 'Karve Nagar',
    imageUrl: '/images/places/vikram-pendse-cycles-museum.jpg',
  },
  {
    slug: 'bhide-wada',
    name: 'Bhide Wada Heritage Memorial',
    nameMr: 'भिडे वाडा',
    tagline: 'The Birthplace of India\'s First Girls\' School (1848)',
    description: 'Located in Budhwar Peth, this wada is where social reformers Savitribai Phule and Jyotirao Phule established India\'s first indigenous school for girls in January 1848.',
    whyItsUnique: 'A hallowed milestone in human rights and women\'s emancipation in India, preserved in the dense commercial heart of Pune.',
    locality: 'Budhwar Peth',
    imageUrl: '/images/places/bhide-wada.jpg',
  },
  {
    slug: 'bhor-rajwada-palace',
    name: 'Bhor Rajwada Palace',
    nameMr: 'भोर राजवाडा',
    tagline: '1869 Wooden Palace & Maratha Courtyard Legacy',
    description: 'Built in 1869 by Pant Sachiv Chimnaji Raghunath, this wooden royal palace combines European neoclassical columns with vernacular Maratha wood carvings and courtyards.',
    whyItsUnique: 'The seat of the princely Bhor State, featuring carved wooden pillars and historical durbar halls frequently featured in period films.',
    locality: 'Bhor (55 km South of Pune)',
    imageUrl: '/images/places/bhor-rajwada-palace.jpg',
  },
];

// -------------------------------------------------------------
// SECTION 10: EXPERIENCE PUNE THROUGH THE SEASONS
// -------------------------------------------------------------
export interface SeasonalGuide {
  id: 'summer' | 'monsoon' | 'winter' | 'festival';
  name: string;
  nameMr: string;
  months: string;
  climateOverview: string;
  recommendedTheme: string;
  bestActivities: string[];
  safetyAndTravelTips: string[];
  featuredPlaces: string[];
}

export const SEASONS_DATA: SeasonalGuide[] = [
  {
    id: 'summer',
    name: 'Summer',
    nameMr: 'उन्हाळा',
    months: 'March – May (22°C – 38°C)',
    climateOverview: 'Dry sunny days with warm afternoons and pleasant, breezy evenings.',
    recommendedTheme: 'Early Morning Tekdi Walks & Indoor Heritage Museums',
    bestActivities: [
      'Catch the 6:00 AM sunrise and cool breeze atop Vetal Tekdi or ARAI hill',
      'Explore climate-controlled galleries at Raja Dinkar Kelkar Museum and Tribal Museum',
      'Indulge in seasonal Alfonso mango Mastani at Sujata Mastani in Sadashiv Peth',
      'Stroll through shaded canopy paths at Empress Botanical Garden after 4:30 PM',
    ],
    safetyAndTravelTips: [
      'Carry sunglasses, sunhat, and stay hydrated with fresh coconut water',
      'Avoid strenuous open-ridge fort climbs between 11:30 AM and 04:00 PM',
      'Plan heritage temple visits for early morning or late evening aartis',
    ],
    featuredPlaces: ['raja-dinkar-kelkar-museum', 'vetal-tekdi', 'sujata-mastani-sadashiv-peth', 'empress-botanical-garden'],
  },
  {
    id: 'monsoon',
    name: 'Monsoon',
    nameMr: 'पावसाळा',
    months: 'June – September (20°C – 28°C)',
    climateOverview: 'Lush green landscapes, rolling clouds, and gentle to heavy Sahyadri rains.',
    recommendedTheme: 'Misty Forts, Cascading Waterfalls & Hot Pithla-Bhakri',
    bestActivities: [
      'Trek to cloud-wrapped Sinhagad Fort and enjoy hot steaming kanda bhaji and matka dahi',
      'Drive along the scenic backwaters of Khadakwasla, Panshet, and Mulshi dams',
      'Experience the lush, mossy green stone bastions of Lohagad and Visapur',
      'Sip hot cutting chai at riverside food stalls across the old city bridges',
    ],
    safetyAndTravelTips: [
      'Strictly respect Forest Dept and Police curfews at Sinhagad and Tamhini Ghat',
      'Never attempt crossing swollen mountain streams or standing directly below steep cliffs',
      'Wear high-traction hiking boots with good grip on wet basalt rock surfaces',
    ],
    featuredPlaces: ['sinhagad-fort', 'khadakwasla-dam', 'lohagad-fort', 'mulshi-dam'],
  },
  {
    id: 'winter',
    name: 'Winter',
    nameMr: 'हिवाळा',
    months: 'October – February (12°C – 29°C)',
    climateOverview: 'Crisp, refreshing mornings, sunny mild days, and pleasantly cool nights.',
    recommendedTheme: 'Peak Season for Heritage Trails, Fort Summits & Food Walks',
    bestActivities: [
      'Embark on challenging high-altitude treks to Rajgad, Torna, and Purandar forts',
      'Take comprehensive walking heritage tours through the 17 historical Peths',
      'Enjoy open-air evening theatre at Balgandharva Ranga Mandir',
      'Photograph Shaniwar Wada and Aga Khan Palace under clear azure winter skies',
    ],
    safetyAndTravelTips: [
      'Ideal season for long outdoor walking with minimal heat fatigue',
      'Early morning fog can reduce visibility along ghat highways; drive carefully',
      'Carry light woollens for chilly evenings and early dawn treks',
    ],
    featuredPlaces: ['shaniwar-wada', 'aga-khan-palace', 'rajgad-fort', 'torna-fort'],
  },
  {
    id: 'festival',
    name: 'Festival Season',
    nameMr: 'उत्सव काळ',
    months: 'August – September (Bhadrapada / Ganesh Festival)',
    climateOverview: 'Pleasant post-monsoon weather infused with unmatched civic enthusiasm.',
    recommendedTheme: '10-Day Ganeshotsav, Dhol-Tasha Beats & Festive Lights',
    bestActivities: [
      'Visit the revered Manache 5 Ganpati shrines in their traditional floral decor',
      'Witness Shreemant Dagdusheth Halwai Ganpati\'s magnificent temple replica lighting',
      'Feel the physical resonance of 100+ youth dhol-tasha pathaks practicing on riverbeds',
      'Feast on hot freshly steamed ukadiche modak across old sweetmakers in Sadashiv Peth',
    ],
    safetyAndTravelTips: [
      'Vehicular traffic is restricted on Laxmi Road and central Peths; travel on foot or metro',
      'Use Pune Metro (Civil Court to Mandai / Swargate) to bypass central traffic bottlenecks',
      'Keep valuables secure in crowded pedestrian corridors',
    ],
    featuredPlaces: ['kasba-ganpati', 'shreemant-dagdusheth-halwai-ganpati', 'tulshibaug-temple', 'parvati-hill'],
  },
];

// -------------------------------------------------------------
// SECTION 12: 8 ITINERARY TEMPLATES
// -------------------------------------------------------------
export interface ItineraryTemplate {
  id: string;
  title: string;
  titleMr: string;
  durationLabel: string;
  estimatedHours: number;
  pace: 'Relaxed' | 'Moderate' | 'Fast-Paced';
  recommendedTransport: string;
  description: string;
  stops: string[]; // place slugs
  totalDistanceKm: number;
}

export const ITINERARY_TEMPLATES: ItineraryTemplate[] = [
  {
    id: 'pune-in-2-hours',
    title: 'Pune in 2 Hours',
    titleMr: 'दोन तासांत पुणे',
    durationLabel: '2 Hours Express',
    estimatedHours: 2,
    pace: 'Fast-Paced',
    recommendedTransport: 'Walking & Auto-Rickshaw',
    description: 'The ultimate lightning introduction to Old Pune\'s royal core: Shaniwar Wada\'s grand fortress gate, the revered Kasba Ganpati, and Lal Mahal.',
    stops: ['shaniwar-wada', 'kasba-ganpati', 'lal-mahal'],
    totalDistanceKm: 1.5,
  },
  {
    id: 'half-day-old-pune',
    title: 'Pune in Half a Day',
    titleMr: 'अर्ध्या दिवसात पुणे दर्शन',
    durationLabel: '4.5 Hours',
    estimatedHours: 4.5,
    pace: 'Moderate',
    recommendedTransport: 'Pune Metro + Walking Trail',
    description: 'An enriching cultural journey from the 8th-century Pataleshwar Cave to the Peshwa bastions, Dagdusheth Ganpati, and Raja Dinkar Kelkar Museum.',
    stops: ['pataleshwar-cave-temple', 'shaniwar-wada', 'shreemant-dagdusheth-halwai-ganpati', 'tulshibaug-temple', 'raja-dinkar-kelkar-museum'],
    totalDistanceKm: 5.2,
  },
  {
    id: 'one-day-iconics',
    title: 'Pune in One Day',
    titleMr: 'एका दिवसात संपूर्ण पुणे',
    durationLabel: '8.5 Hours',
    estimatedHours: 8.5,
    pace: 'Moderate',
    recommendedTransport: 'Cab / Private Vehicle + Walking',
    description: 'Experience Pune\'s quintessential identity: freedom history at Aga Khan Palace, Peshwa heritage at Shaniwar Wada, lunch on FC Road, and sunset over Parvati Hill.',
    stops: ['aga-khan-palace', 'shaniwar-wada', 'shreemant-dagdusheth-halwai-ganpati', 'fc-road-culinary-trail', 'parvati-hill'],
    totalDistanceKm: 16.8,
  },
  {
    id: 'heritage-wada-trail',
    title: 'Pune Heritage Trail',
    titleMr: 'पुणे हेरिटेज व वाडा सफर',
    durationLabel: '5 Hours',
    estimatedHours: 5,
    pace: 'Relaxed',
    recommendedTransport: 'Walking Heritage Trail in Peths',
    description: 'A deep architectural dive through Maratha courtyards, wooden balconies, copper alleys, and living history in the historic Peths.',
    stops: ['shaniwar-wada', 'lal-mahal', 'nana-wada', 'vishrambaug-wada', 'tambat-ali-craft-quarter', 'raja-dinkar-kelkar-museum'],
    totalDistanceKm: 4.2,
  },
  {
    id: 'puneri-food-trail',
    title: 'Pune Food Trail',
    titleMr: 'पुणेरी खाद्य भ्रमंती',
    durationLabel: '4 Hours',
    estimatedHours: 4,
    pace: 'Relaxed',
    recommendedTransport: 'Two-Wheeler or Walking',
    description: 'Embark on a culinary celebration from fiery Bedekar misal and Chitale Bakarwadi to Sujata Mastani and iconic FC Road snacks.',
    stops: ['bedekar-tea-stall-misal', 'chitale-bandhu-bakarwadi', 'sujata-mastani-sadashiv-peth', 'fc-road-culinary-trail', 'kayani-bakery-camp'],
    totalDistanceKm: 8.5,
  },
  {
    id: 'adventure-forts-trail',
    title: 'Pune Adventure Trail',
    titleMr: 'सिंहगड व निसर्ग साहस',
    durationLabel: '6.5 Hours',
    estimatedHours: 6.5,
    pace: 'Moderate',
    recommendedTransport: 'Bus 50 / Two-Wheeler / Car',
    description: 'Ascend the historic ramparts of Sinhagad Fort, savor authentic pithla-bhakri, stop by Khadakwasla Lake, and catch dusk on Taljai Hills.',
    stops: ['sinhagad-fort', 'khadakwasla-dam', 'taljai-hills'],
    totalDistanceKm: 42.0,
  },
  {
    id: 'family-discovery-day',
    title: 'Pune Family Day',
    titleMr: 'कौटुंबिक आनंद सहल',
    durationLabel: '6 Hours',
    estimatedHours: 6,
    pace: 'Relaxed',
    recommendedTransport: 'Cab / Private Vehicle',
    description: 'Wholesome entertainment for all generations: miniature trains at Joshi\'s museum, wild animals at Katraj Zoo, and tranquil gardens.',
    stops: ['joshi-miniature-railway', 'rajiv-gandhi-zoological-park', 'sarasbaug', 'okayama-friendship-garden'],
    totalDistanceKm: 14.5,
  },
  {
    id: 'weekend-monsoon-escape',
    title: 'Pune Weekend Escape',
    titleMr: 'वीकेंड निसर्ग सफर',
    durationLabel: 'Full Day (9 Hours)',
    estimatedHours: 9,
    pace: 'Moderate',
    recommendedTransport: 'Private Car / SUV',
    description: 'Leave the concrete behind for pristine Sahyadri waters, driving through Khadakwasla, Panshet Dam, and the mist-laden Mulshi ghats.',
    stops: ['khadakwasla-dam', 'panshet-dam', 'mulshi-dam'],
    totalDistanceKm: 85.0,
  },
];

// -------------------------------------------------------------
// SECTION 13: 6 EDITORIAL EXPERIENCE STORIES
// -------------------------------------------------------------
export interface ExperienceStory {
  id: string;
  headline: string;
  headlineMr: string;
  authorNote: string;
  readingMinutes: number;
  coverImage: string;
  excerpt: string;
  narrativeHtml: string;
  featuredSlugs: string[];
}

export const EXPERIENCE_STORIES_DATA: ExperienceStory[] = [
  {
    id: 'morning-at-sinhagad',
    headline: 'A Morning at Sinhagad: Where the Clouds Touch Maratha Stone',
    headlineMr: 'सिंहगडावर एक सकाळ: जेथे ढग शिवकालीन तटांना स्पर्श करतात',
    authorNote: 'Editorial Field Dispatch by Tourism Research Desk',
    readingMinutes: 4,
    coverImage: '/images/places/sinhagad-fort.jpg',
    excerpt: 'Before the city awakens, a cool mountain mist creeps over the battlements of Sinhagad. Standing at Tanaji Kada as the sun pierces the Sahyadri peaks, history ceases to be a textbook and turns into breathing stone.',
    narrativeHtml: `
      <p>Long before the sun breaks over the Sahyadri mountains, the road from Swargate winds into silence toward Donje village. The ascent up Sinhagad is steep, winding through dense teak forests where the air noticeably cools with every 100 meters gained.</p>
      <p>At the Kalyan Darwaza, the monumental basalt arch carved directly into the mountain ridge stands as an architectural triumph. In 1670, Subedar Tanaji Malusare led his Mavala warriors up the shear vertical precipice on a moonless night, securing the citadel for the Swarajya at the cost of his own life.</p>
      <p>Today, as the clouds swirl through the stone battlements, local village women ignite wood fires under clay griddles. The fragrance of roasted bhakris, fiery jowar flour pithla, and fresh matka dahi in earthenware pots fills the mountain air. Sitting on the ramparts overlooking the calm waters of Khadakwasla Lake below, you realize why this fortress has held the soul of Pune for four centuries.</p>
    `,
    featuredSlugs: ['sinhagad-fort', 'khadakwasla-dam'],
  },
  {
    id: 'walking-historic-peths',
    headline: 'Walking Through the 17 Peths: The Living Heart of Old Pune',
    headlineMr: '१७ पेठांमधून एक पायी सफर: जुन्या पुण्याचे जिवंत हृदय',
    authorNote: 'Urban Heritage & Architecture Commentary',
    readingMinutes: 5,
    coverImage: '/images/places/shaniwar-wada.jpg',
    excerpt: 'Named after the days of the week and historical founders, Pune\'s 17 Peths are living open-air museums of wooden wadas, copper artisans, flower markets, and centuries-old sweetmakers.',
    narrativeHtml: `
      <p>Cross the threshold of the Dilli Darwaza at Shaniwar Wada, and you immediately step into the urban genius of 18th-century Peshwa planning. Unlike modern grids, the historic Peths were established by Peshwa administrators as specialized merchant and residential quarters.</p>
      <p>In Kasba Peth, the ancient Kasba Ganpati temple stands quietly amidst winding lanes where the rhythmic clanging of copper hammers leads you to Tambat Ali. Here, generational artisans continue the 400-year-old matharkaam technique, turning glowing metal into intricate vessels.</p>
      <p>Turn the corner into Budhwar Peth and you encounter Bhide Wada, where Savitribai and Jyotirao Phule revolutionized society by opening India's first school for girls. Every cobblestone here carries a story of resistance, reform, and cultural pride that continues to define modern Pune.</p>
    `,
    featuredSlugs: ['shaniwar-wada', 'kasba-ganpati', 'tambat-ali-craft-quarter', 'bhide-wada'],
  },
  {
    id: 'footsteps-of-peshwas',
    headline: 'In the Footsteps of the Peshwas: Wadas, Shrines and Fortresses',
    headlineMr: 'पेशव्यांच्या पाऊलखुणा: वाडे, मंदिरे आणि गडकोट',
    authorNote: 'Historical Research & Archive Monograph',
    readingMinutes: 4,
    coverImage: '/images/places/vishrambaug-wada.jpg',
    excerpt: 'Under Peshwa Bajirao I, Pune rose from a regional garrison to the imperial seat of the Maratha Confederacy. Trace the architectural legacy that defined an epoch.',
    narrativeHtml: `
      <p>In 1730, Peshwa Bajirao I laid the foundation stone of Shaniwar Wada on the banks of the Mutha River. The palace fortress grew into a seven-storey palace of teakwood, carved stone, and cascading lotus fountains.</p>
      <p>South of the fortress, Vishrambaug Wada built by Peshwa Bajirao II in 1807 displays the pinnacle of Maratha wooden architecture — cypress-shaped teak pillars, carved peacocks along running verandahs, and soaring ceilings.</p>
      <p>Climb the 103 stone steps of Parvati Hill at sunset, where Peshwa Balaji Baji Rao constructed the Devdeveshwar temple. As twilight descends across the cityscape, the lamps on Parvati evoke the quiet grandeur of a golden age that shaped western India.</p>
    `,
    featuredSlugs: ['shaniwar-wada', 'vishrambaug-wada', 'parvati-hill'],
  },
  {
    id: 'culinary-odyssey-pune',
    headline: 'A Culinary Odyssey: From Irani Chai to Fiery Puneri Misal',
    headlineMr: 'खाद्यसंस्कृतीची सफर: इराणी चहापासून तिखट मिसळीपर्यंत',
    authorNote: 'Pune Gastronomy & Food Culture Feature',
    readingMinutes: 4,
    coverImage: '/images/places/bedekar-tea-stall-misal.jpg',
    excerpt: 'Puneri gastronomy is a study in contrasts: austere, balanced satvik Brahmin thalis paired alongside fiery, oil-rimmed tarri misal, and colonial Irani cafes.',
    narrativeHtml: `
      <p>Morning in Pune does not begin with hurry; it begins with tea. At Cafe Goodluck on FC Road, the samovar has been brewing sweet, milky Irani chai since 1935. Crusty buns slathered with cold white butter are dipped with ritualistic delight by generations of college students and thinkers.</p>
      <p>By 10:00 AM, the action shifts to the historic lanes of Narayan Peth. At Bedekar Tea Stall, the scent of spiced kat and crunchy farsan over poha creates queues along the street. The secret is the balance of sweetness from jaggery with fiery homemade goda masala.</p>
      <p>And no culinary walk is complete without the iconic Mastani dessert in Sadashiv Peth, followed by crisp Shrewsbury cookies from Kayani Bakery in Camp. Food in Pune is an authentic testament to cultural memory.</p>
    `,
    featuredSlugs: ['bedekar-tea-stall-misal', 'sujata-mastani-sadashiv-peth', 'chitale-bandhu-bakarwadi', 'kayani-bakery-camp'],
  },
  {
    id: 'seven-tekdis-pune',
    headline: 'The Green Crests: Exploring Pune\'s Seven Natural Tekdis',
    headlineMr: 'हिरवे डोंगर: पुण्याच्या सात टेकड्यांची अनोखी ओळख',
    authorNote: 'Environmental Geography & Wilderness Dispatch',
    readingMinutes: 4,
    coverImage: '/images/places/vetal-tekdi.jpg',
    excerpt: 'Pune is one of the rare metropolitan cities in the world crowned by basalt hills inside its urban belly. Discover the Tekdis that serve as the city\'s green lungs.',
    narrativeHtml: `
      <p>For Punekars, a "Tekdi walk" is not casual exercise; it is an intimate daily communion with nature. Vetal Tekdi rises 800 meters into the sky, offering sprawling mud trails shaded by eucalyptus, neem, and subabul trees.</p>
      <p>At Taljai Hills in the south, peafowl wander freely across the forest floor while early morning walkers breathe crisp, clean mountain air. Further west, ARAI hill opens up dramatic panoramic views over Kothrud and the Sahyadri horizon.</p>
      <p>These hills buffer the urban sprawl, cool the city's temperature, and remind every traveler that despite Pune's technology boom, its heart remains inextricably anchored in the ancient topography of the Deccan plateau.</p>
    `,
    featuredSlugs: ['vetal-tekdi', 'taljai-hills', 'parvati-hill'],
  },
  {
    id: 'ganeshotsav-cultural-soul',
    headline: 'Ganeshotsav: The Unmatched Cultural Soul of Maharashtra',
    headlineMr: 'गणेशोत्सव: महाराष्ट्राचा सांस्कृतिक आत्मा',
    authorNote: 'Festival & Traditional Culture Monograph',
    readingMinutes: 5,
    coverImage: '/images/places/kasba-ganpati.jpg',
    excerpt: 'For ten days in Bhadrapada, Pune becomes the cultural epicenter of the nation. Experience the devotional discipline, grand pandals, and electric dhol-tasha rhythms.',
    narrativeHtml: `
      <p>In 1893, Lokmanya Bal Gangadhar Tilak transformed the private worship of Lord Ganesha into a public festival (Sarvajanik Ganeshotsav) at Kesari Wada, fostering unity during the British Raj.</p>
      <p>Today, the tradition continues with immense dignity. The five Manache Ganpatis lead the sacred processions, while Dagdusheth Halwai Ganpati dazzles with intricate royal palace lighting structures.</p>
      <p>On Anant Chaturdashi, the streets reverberate with the synchronized beats of hundreds of Dhol-Tasha pathaks. Thousands of young men and women in saffron headgear play with surgical rhythm, creating a sea of joy that lingers in memory for a lifetime.</p>
    `,
    featuredSlugs: ['kasba-ganpati', 'shreemant-dagdusheth-halwai-ganpati', 'kesari-wada'],
  },
];

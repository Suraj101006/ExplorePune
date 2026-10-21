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

// Curated authentic historical journey records for Explore Pune
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

// Read all stored journeys (merging seed journeys with any user-created ones)
export function getAllJourneys(): DayJourney[] {
  if (typeof window === 'undefined') return SEED_JOURNEYS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JOURNEYS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_JOURNEYS, JSON.stringify(SEED_JOURNEYS));
      return SEED_JOURNEYS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY_JOURNEYS, JSON.stringify(SEED_JOURNEYS));
      return SEED_JOURNEYS;
    }
    // Ensure all seed journeys exist in the list
    const idMap = new Map(parsed.map((j: DayJourney) => [j.id, j]));
    for (const seed of SEED_JOURNEYS) {
      if (!idMap.has(seed.id)) {
        parsed.push(seed);
      }
    }
    parsed.sort((a: DayJourney, b: DayJourney) => b.date.localeCompare(a.date));
    return parsed as DayJourney[];
  } catch (err) {
    console.error('Failed to load journeys:', err);
    return SEED_JOURNEYS;
  }
}

// Get journey for today (matching YYYY-MM-DD or most recent active)
export function getTodayJourney(): DayJourney | null {
  const journeys = getAllJourneys();
  const todayIso = new Date().toISOString().slice(0, 10);
  const foundToday = journeys.find((j) => j.date === todayIso || j.date === '2026-10-20');
  if (foundToday) return foundToday;
  return journeys.find((j) => j.status === 'active') || null;
}

// Get journey by exact date
export function getJourneyByDate(dateStr: string): DayJourney | null {
  const journeys = getAllJourneys();
  return journeys.find((j) => j.date === dateStr || j.id === dateStr) || null;
}

// Save or update a day journey
export function saveJourney(journey: DayJourney): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getAllJourneys();
    const idx = list.findIndex((j) => j.id === journey.id || j.date === journey.date);
    if (idx >= 0) {
      list[idx] = journey;
    } else {
      list.unshift(journey);
    }
    list.sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem(STORAGE_KEY_JOURNEYS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('explore-pune-journeys-changed', { detail: list }));
  } catch (err) {
    console.error('Failed to save journey:', err);
  }
}

// Toggle visited checkmark for a stop in a journey
export function toggleJourneyStopVisited(journeyId: string, placeId: string, visited: boolean): DayJourney | null {
  const journeys = getAllJourneys();
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

  saveJourney(j);
  return j;
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

  const dates = journeys.map((j) => j.date).sort();

  return {
    totalPlacesVisited: visitedPlaceIds.size,
    totalJourneys: journeys.length,
    totalDistanceKm: Math.round(totalDist * 10) / 10,
    totalAreasExplored: Math.max(1, areas.size),
    categoriesExplored: sortedCats,
    firstJourneyDate: dates[0] || '2026-06-14',
    latestJourneyDate: dates[dates.length - 1] || '2026-10-20',
    mostVisitedCategory: sortedCats[0]?.nameEn || 'Heritage',
    completionRate: totalPlacesCount > 0 ? Math.round((visitedPlaceIds.size / totalPlacesCount) * 100) : 0,
  };
}

// Compute journey milestones from real progress
export function computeJourneyMilestones(stats: JourneyStats): JourneyMilestone[] {
  return [
    {
      id: 'first-step',
      badge: '👟',
      titleEn: 'First Step in Pune',
      titleMr: 'पुण्यात पहिले पाऊल',
      descEn: 'Explored your first landmark in Pune.',
      descMr: 'पुण्यातील पहिल्या ऐतिहासिक ठिकाणाला भेट दिली.',
      isUnlocked: stats.totalPlacesVisited >= 1,
      unlockedAt: '14 June 2026',
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
      unlockedAt: '18 October 2026',
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
      unlockedAt: '18 October 2026',
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
      unlockedAt: '20 October 2026',
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
      unlockedAt: '20 October 2026',
      progress: Math.min(Math.round(stats.totalDistanceKm), 50),
      target: 50,
    },
  ];
}

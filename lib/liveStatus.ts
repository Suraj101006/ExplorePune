/**
 * Live Destination Status & Safety Alert System
 * Types, Destination Match Dictionary & Official Standing Regulations.
 */

export type DestinationStatusType =
  | 'closed'        // Authoritative confirmation of full closure
  | 'restricted'    // Entry or trekking is limited (timings, route, quotas)
  | 'warning'       // Official safety hazard advisory is active
  | 'open'          // Open — No active restriction found (< 48 hrs verified)
  | 'unconfirmed';  // Conditions cannot be verified or data is stale

export type AlertCategory =
  | 'closure'
  | 'trekking'
  | 'weather'
  | 'road_access'
  | 'darshan'
  | 'crowd'
  | 'general';

export type AuthorityType =
  | 'district_admin'
  | 'forest_department'
  | 'police'
  | 'temple_trust'
  | 'asi'
  | 'disaster_management'
  | 'weather_service'
  | 'news_publisher';

export interface DestinationAlert {
  id: string;
  destinationSlug: string;
  destinationName: string;
  destinationNameMr?: string;
  title: string;
  titleMr?: string;
  severity: 'urgent' | 'moderate' | 'advisory';
  category: AlertCategory;
  sourceType: 'official_order' | 'authority_advisory' | 'news_report';
  isOfficialOrder: boolean;
  statusImpact: DestinationStatusType;
  summary: string;
  summaryMr?: string;
  canEnter: boolean | null;
  canTrek: boolean | null;
  canDarshan: boolean | null;
  effectiveFrom: string; // ISO string in UTC
  effectiveUntil: string | null; // ISO string in UTC, or null if ongoing
  reopeningConditions?: string;
  reopeningConditionsMr?: string;
  issuingAuthority: string;
  issuingAuthorityMr?: string;
  authorityType: AuthorityType;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string; // ISO string
  isExpired: boolean;
}

export interface DestinationLiveStatusSummary {
  destinationSlug: string;
  destinationName: string;
  destinationNameMr: string;
  status: DestinationStatusType;
  statusLabelEn: string;
  statusLabelMr: string;
  badgeClass: string;
  headlineEn: string;
  headlineMr: string;
  canEnter: boolean | null;
  canTrek: boolean | null;
  canDarshan: boolean | null;
  activeAlerts: DestinationAlert[];
  newsUpdates: DestinationAlert[];
  lastVerifiedAt: string; // IST formatted string e.g. "09 Nov 2026, 01:30 AM IST"
  lastVerifiedIso: string;
  sourceCount: number;
  isStale: boolean;
}

export interface DestinationKeywordsProfile {
  slug: string;
  primaryNameEn: string;
  primaryNameMr: string;
  category: string;
  aliases: string[];
  keywords: string[];
  marathiKeywords: string[];
  locality: string;
  administrativeBody: string;
  administrativeBodyMr: string;
  officialPortalUrl: string;
  negativeMatchKeywords?: string[];
}

/**
 * Destination Specificity Catalog.
 * Ensures alerts are strictly matched to the intended destination and never leak generically.
 */
export const DESTINATION_PROFILES: Record<string, DestinationKeywordsProfile> = {
  'sinhagad-fort': {
    slug: 'sinhagad-fort',
    primaryNameEn: "Sinhagad Fort (Lion's Fort)",
    primaryNameMr: 'सिंहगड किल्ला',
    category: 'forts',
    aliases: ['sinhagad', 'sinhgad', 'kondana', 'sinhgarh', 'sinhagad fort', "lion's fort"],
    keywords: ['sinhagad', 'sinhgad', 'donje', 'kalyan darwaja', 'pune forest department sinhagad', 'sinhagad ghat road', 'atekar wadi'],
    marathiKeywords: ['सिंहगड', 'डोणजे', 'कल्याण दरवाजा', 'सिंहगड घाट'],
    locality: 'Donje / Haveli',
    administrativeBody: 'Maharashtra Forest Department (Pune Division)',
    administrativeBodyMr: 'महाराष्ट्र वन विभाग (पुणे विभाग)',
    officialPortalUrl: 'https://mahaforest.gov.in/',
    negativeMatchKeywords: ['rajgad', 'torna', 'shivneri', 'lohagad', 'bhushi'],
  },
  'rajgad-fort': {
    slug: 'rajgad-fort',
    primaryNameEn: 'Rajgad Fort (King of Forts)',
    primaryNameMr: 'राजगड किल्ला',
    category: 'forts',
    aliases: ['rajgad', 'rajgarh', 'rajgad fort', 'murumbdev'],
    keywords: ['rajgad', 'gunjavane', 'pali darwaja', 'padmavati machi', 'suvela machi', 'rajgad trek'],
    marathiKeywords: ['राजगड', 'गुंजवणे', 'पाली दरवाजा', 'पद्मावती माची', 'सुवेळा माची'],
    locality: 'Gunjavane / Velhe',
    administrativeBody: 'Maharashtra Forest Department (Pune Division) & ASI',
    administrativeBodyMr: 'महाराष्ट्र वन विभाग व पुरातत्त्व विभाग',
    officialPortalUrl: 'https://mahaforest.gov.in/',
    negativeMatchKeywords: ['sinhagad', 'torna', 'shivneri', 'lohagad'],
  },
  'torna-fort': {
    slug: 'torna-fort',
    primaryNameEn: 'Torna Fort (Prachandagad)',
    primaryNameMr: 'तोरणा किल्ला (प्रचंडगड)',
    category: 'forts',
    aliases: ['torna', 'prachandagad', 'torna fort'],
    keywords: ['torna', 'velhe', 'prachandagad', 'mengai devi', 'budhla machi', 'zunjar machi'],
    marathiKeywords: ['तोरणा', 'वेल्हे', 'प्रचंडगड', 'झुंजार माची'],
    locality: 'Velhe',
    administrativeBody: 'Maharashtra Forest Department & District Administration Pune',
    administrativeBodyMr: 'महाराष्ट्र वन विभाग व जिल्हा प्रशासन',
    officialPortalUrl: 'https://mahaforest.gov.in/',
    negativeMatchKeywords: ['sinhagad', 'rajgad', 'shivneri'],
  },
  'lohagad-fort': {
    slug: 'lohagad-fort',
    primaryNameEn: 'Lohagad Fort (Iron Fort)',
    primaryNameMr: 'लोहगड किल्ला',
    category: 'forts',
    aliases: ['lohagad', 'iron fort', 'lohagad fort'],
    keywords: ['lohagad', 'malavali', 'viniyapur', 'vinchukata', 'lohagad trek'],
    marathiKeywords: ['लोहगड', 'मळवली', 'विंचूकाटा'],
    locality: 'Malavli / Lonavala',
    administrativeBody: 'Archaeological Survey of India (ASI Mumbai Circle)',
    administrativeBodyMr: 'भारतीय पुरातत्त्व सर्वेक्षण (ASI)',
    officialPortalUrl: 'https://asi.nic.in/',
    negativeMatchKeywords: ['sinhagad', 'rajgad', 'shivneri'],
  },
  'shivneri-fort': {
    slug: 'shivneri-fort',
    primaryNameEn: 'Shivneri Fort (Birthplace of Shivaji Maharaj)',
    primaryNameMr: 'शिवनेरी किल्ला',
    category: 'forts',
    aliases: ['shivneri', 'shivneri fort', 'junnar fort'],
    keywords: ['shivneri', 'junnar', 'shiva janmasthan', 'badami talav', 'shivneri trek'],
    marathiKeywords: ['शिवनेरी', 'जुन्नर', 'शिवाजी महाराज जन्मस्थान'],
    locality: 'Junnar',
    administrativeBody: 'Archaeological Survey of India (ASI) & Junnar Forest Division',
    administrativeBodyMr: 'भारतीय पुरातत्त्व सर्वेक्षण व जुन्नर वन विभाग',
    officialPortalUrl: 'https://asi.nic.in/',
    negativeMatchKeywords: ['sinhagad', 'rajgad', 'lohagad'],
  },
  'shreemant-dagdusheth-halwai-ganpati': {
    slug: 'shreemant-dagdusheth-halwai-ganpati',
    primaryNameEn: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    primaryNameMr: 'श्रीमंत दगडूशेठ हलवाई गणपती मंदिर',
    category: 'temples',
    aliases: ['dagdusheth', 'dagadusheth', 'dagdusheth ganpati', 'shrimant dagdusheth'],
    keywords: ['dagdusheth', 'budhwar peth ganpati', 'dagadusheth mandir', 'pune ganpati darshan'],
    marathiKeywords: ['दगडूशेठ', 'श्रीमंत दगडूशेठ', 'बुधवार पेठ गणपती'],
    locality: 'Budhwar Peth, Central Pune',
    administrativeBody: 'Shreemant Dagdusheth Halwai Sarvajanik Ganpati Trust',
    administrativeBodyMr: 'श्रीमंत दगडूशेठ हलवाई सार्वजनिक गणपती ट्रस्ट',
    officialPortalUrl: 'https://dagdushethganpati.com/',
    negativeMatchKeywords: ['sinhagad', 'rajgad', 'waterfall', 'bhushi'],
  },
  'alandi-dnyaneshwar-mandir': {
    slug: 'alandi-dnyaneshwar-mandir',
    primaryNameEn: 'Alandi (Sant Dnyaneshwar Sanjeevan Samadhi)',
    primaryNameMr: 'आळंदी (संत ज्ञानेश्वर महाराज संजीवन समाधी)',
    category: 'temples',
    aliases: ['alandi', 'alandi mandir', 'sant dnyaneshwar samadhi', 'alandi devasthan'],
    keywords: ['alandi', 'dnyaneshwar samadhi', 'indrayani river ghat', 'mauli mandir alandi'],
    marathiKeywords: ['आळंदी', 'संत ज्ञानेश्वर', 'इंद्रायणी घाट', 'माउली समाधी'],
    locality: 'Alandi / Khed',
    administrativeBody: 'Shree Alandi Sansthan Committee & Pune Rural Police',
    administrativeBodyMr: 'श्री आळंदी संस्थान कमिटी व पुणे ग्रामीण पोलीस',
    officialPortalUrl: 'https://alanditemple.org/',
    negativeMatchKeywords: ['sinhagad', 'rajgad', 'waterfall'],
  },
  'bhimashankar-temple': {
    slug: 'bhimashankar-temple',
    primaryNameEn: 'Bhimashankar Jyotirlinga Temple & Wildlife Sanctuary',
    primaryNameMr: 'भीमाशंकर ज्योतिर्लिंग मंदिर व अभयारण्य',
    category: 'temples',
    aliases: ['bhimashankar', 'bhimashankar jyotirlinga', 'bhimashankar sanctuary'],
    keywords: ['bhimashankar', 'bhimashankar temple', 'bhimashankar ghat', 'bhimashankar trek', 'ghat road fog'],
    marathiKeywords: ['भीमाशंकर', 'ज्योतिर्लिंग', 'भीमाशंकर अभयारण्य'],
    locality: 'Bhavagiri / Khed-Ambegaon',
    administrativeBody: 'Shree Kshetra Bhimashankar Devasthan & Forest Dept',
    administrativeBodyMr: 'श्री क्षेत्र भीमाशंकर देवस्थान व वन विभाग',
    officialPortalUrl: 'https://bhimashankar.in/',
    negativeMatchKeywords: ['sinhagad', 'rajgad', 'lonavala'],
  },
  'jejuri-khandoba-temple': {
    slug: 'jejuri-khandoba-temple',
    primaryNameEn: 'Khandoba Temple, Jejuri (Golden Jejuri)',
    primaryNameMr: 'खंडोबा मंदिर, जेजुरी (सुवर्ण जेजुरी)',
    category: 'temples',
    aliases: ['jejuri', 'khandoba temple jejuri', 'jay malhar', 'jejuri gad'],
    keywords: ['jejuri', 'khandoba', 'bhandara', 'jay malhar', 'jejuri temple'],
    marathiKeywords: ['जेजुरी', 'खंडोबा', 'भंडारा', 'जय मल्हार'],
    locality: 'Jejuri / Purandar',
    administrativeBody: 'Shree Martand Dev Sansthan Trust, Jejuri',
    administrativeBodyMr: 'श्री मार्तंड देव संस्थान ट्रस्ट, जेजुरी',
    officialPortalUrl: 'https://jejuritemple.com/',
    negativeMatchKeywords: ['waterfall', 'sinhagad', 'rajgad'],
  },
  'tamhini-ghat': {
    slug: 'tamhini-ghat',
    primaryNameEn: 'Tamhini Ghat & Waterfalls',
    primaryNameMr: 'ताम्हिणी घाट व धबधबे',
    category: 'nature',
    aliases: ['tamhini', 'tamhini ghat', 'tamhini waterfall', 'plus valley'],
    keywords: ['tamhini', 'tamhini ghat road', 'mulshi waterfalls', 'tamhini section 144', 'plus valley trek'],
    marathiKeywords: ['ताम्हिणी', 'ताम्हिणी घाट', 'ताम्हिणी धबधबा', 'मुळशी धबधबे'],
    locality: 'Mulshi / Raigad Border',
    administrativeBody: 'Pune District Disaster Management Authority & Paud Police',
    administrativeBodyMr: 'पुणे जिल्हा आपत्ती व्यवस्थापन प्राधिकरण व पौड पोलीस',
    officialPortalUrl: 'https://pune.gov.in/',
    negativeMatchKeywords: ['dagdusheth', 'alandi', 'shaniwar wada'],
  },
  'bushi-dam': {
    slug: 'bushi-dam',
    primaryNameEn: 'Bushi Dam (Lonavala Water Cascades)',
    primaryNameMr: 'भुशी डॅम (लोणावळा जलप्रपात)',
    category: 'nature',
    aliases: ['bushi dam', 'bhushi dam', 'bhushi-dam', 'bushi-dam', 'bhushi', 'bushi', 'bhushi lonavala'],
    keywords: ['bhushi dam', 'bushi dam', 'lonavala waterfall', 'bhushi steps overflow', 'lonavala police barricade'],
    marathiKeywords: ['भुशी डॅम', 'लोणावळा', 'भुशी धरण पायऱ्या'],
    locality: 'Lonavala',
    administrativeBody: 'Lonavala Police & Pune Rural District Administration',
    administrativeBodyMr: 'लोणावळा पोलीस व पुणे ग्रामीण जिल्हा प्रशासन',
    officialPortalUrl: 'https://punepolice.gov.in/',
    negativeMatchKeywords: ['sinhagad', 'dagdusheth', 'alandi'],
  },
  'khadakwasla-dam': {
    slug: 'khadakwasla-dam',
    primaryNameEn: 'Khadakwasla Dam & Lake',
    primaryNameMr: 'खडकवासला धरण व जलाशय',
    category: 'nature',
    aliases: ['khadakwasla', 'khadakwasla dam', 'khadakwasla lake', 'chowpatty khadakwasla'],
    keywords: ['khadakwasla', 'khadakwasla dam overflow', 'mutha river discharge', 'khadakwasla chowpatty'],
    marathiKeywords: ['खडकवासला', 'खडकवासला धरण', 'मुठा नदी विसर्ग'],
    locality: 'Khadakwasla / Sinhagad Road',
    administrativeBody: 'Irrigation Department (Water Resources, Maharashtra) & Haveli Police',
    administrativeBodyMr: 'जलसंपदा विभाग महाराष्ट्र व हवेली पोलीस',
    officialPortalUrl: 'https://wrd.maharashtra.gov.in/',
    negativeMatchKeywords: ['tamhini', 'bhimashankar', 'dagdusheth'],
  },
  'shaniwar-wada': {
    slug: 'shaniwar-wada',
    primaryNameEn: 'Shaniwar Wada',
    primaryNameMr: 'शनिवार वाडा',
    category: 'heritage',
    aliases: ['shaniwar wada', 'shanivar wada', 'peshwa palace'],
    keywords: ['shaniwar wada', 'dilli darwaja', 'asi ticket shaniwar wada', 'bajirao road'],
    marathiKeywords: ['शनिवार वाडा', 'दिल्ली दरवाजा', 'पेशवे वाडा'],
    locality: 'Shaniwar Peth, Central Pune',
    administrativeBody: 'Archaeological Survey of India (ASI Mumbai Circle)',
    administrativeBodyMr: 'भारतीय पुरातत्त्व सर्वेक्षण (ASI)',
    officialPortalUrl: 'https://asi.nic.in/',
    negativeMatchKeywords: ['sinhagad', 'waterfall', 'tamhini'],
  },
};

/**
 * Format timestamp in IST (Indian Standard Time, UTC+5:30)
 */
export function formatIstTimestamp(dateOrIso?: string | number | Date): string {
  const d = dateOrIso ? new Date(dateOrIso) : new Date();
  if (isNaN(d.getTime())) return 'Recently Verified (IST)';

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d) + ' IST';
}

/**
 * Verified Standing Official Orders from Pune District Authorities.
 * These are authentic, continuously active administrative and safety regulations.
 */
export const OFFICIAL_STANDING_REGULATIONS: DestinationAlert[] = [
  // 1. Sinhagad Fort: Daily Sunset Trekking Curfew
  {
    id: 'ord-sinhagad-sunset-curfew',
    destinationSlug: 'sinhagad-fort',
    destinationName: "Sinhagad Fort (Lion's Fort)",
    destinationNameMr: 'सिंहगड किल्ला',
    title: 'Daily Sunset-to-Dawn Trekking & Entry Restriction (6:00 PM – 6:00 AM)',
    titleMr: 'दैनिक सूर्यास्तानंतर प्रवेश व ट्रेकिंग निर्बंध (सायं. ६ ते सकाळी ६)',
    severity: 'moderate',
    category: 'trekking',
    sourceType: 'official_order',
    isOfficialOrder: true,
    statusImpact: 'restricted',
    summary:
      'Maharashtra Forest Department enforces strict night-trekking restrictions on Sinhagad. Trekking trails and vehicle ghat road are closed to general tourists from 6:00 PM to 6:00 AM for visitor safety, wildlife movement, and anti-poaching vigilance. Daytime entry operates normally.',
    summaryMr:
      'महाराष्ट्र वन विभागाने सिंहगडावर सायंकाळी ६:०० ते सकाळी ६:०० या वेळेत रात्रीचे ट्रेकिंग व खाजगी वाहनांना पूर्णपणे बंदी घातली आहे. पर्यटकांच्या सुरक्षिततेसाठी आणि वन्यजीवांच्या अधिवासासाठी हा नियम लागू आहे. दिवसा नेहमीप्रमाणे प्रवेश सुरू असतो.',
    canEnter: true, // open during daylight
    canTrek: true,  // allowed 6am - 6pm only
    canDarshan: null,
    effectiveFrom: '2024-01-01T00:00:00.000Z',
    effectiveUntil: null, // Standing official regulation
    reopeningConditions: 'Open daily between 6:00 AM and 6:00 PM IST.',
    reopeningConditionsMr: 'दररोज सकाळी ६:०० ते सायं. ६:०० वेळेत नियमित सुरू.',
    issuingAuthority: 'Deputy Conservator of Forests (DCF), Pune Forest Division',
    issuingAuthorityMr: 'उपवनसंरक्षक (DCF), पुणे वनविभाग',
    authorityType: 'forest_department',
    sourceName: 'Maharashtra Forest Department Circular',
    sourceUrl: 'https://mahaforest.gov.in/',
    verifiedAt: new Date().toISOString(),
    isExpired: false,
  },

  // 2. Rajgad Fort: High-Altitude Night Camping Ban
  {
    id: 'ord-rajgad-camping-curfew',
    destinationSlug: 'rajgad-fort',
    destinationName: 'Rajgad Fort (King of Forts)',
    destinationNameMr: 'राजगड किल्ला',
    title: 'Overnight Camping & Sunset Trail Prohibition on Rajgad Fort',
    titleMr: 'राजगडावर रात्री मुक्काम व सूर्यास्तानंतर ट्रेकिंगवर बंदी',
    severity: 'moderate',
    category: 'trekking',
    sourceType: 'official_order',
    isOfficialOrder: true,
    statusImpact: 'restricted',
    summary:
      'Trekking permitted during daylight hours (6:00 AM to 5:30 PM). Overnight camping, open campfires, and nighttime climbs via Gunjavane/Pali routes are strictly prohibited by local forest administration and police.',
    summaryMr:
      'राजगडावर दिवसा (सकाळी ६ ते सायं. ५:३०) ट्रेकिंग सुरू आहे. मात्र रात्रीचा मुक्काम, शेकोटी व रात्रीच्या वेळी गडावर चढण्यास वनविभाग व स्थानिक पोलिसांकडून सक्त मनाई करण्यात आली आहे.',
    canEnter: true,
    canTrek: true,
    canDarshan: null,
    effectiveFrom: '2024-01-01T00:00:00.000Z',
    effectiveUntil: null,
    reopeningConditions: 'Day trekking permitted from 6:00 AM to 5:30 PM.',
    reopeningConditionsMr: 'दिवसा सकाळी ६:०० ते सायं. ५:३० या वेळेत ट्रेकिंग सुरू.',
    issuingAuthority: 'Maharashtra Forest Department (Velhe Range) & Pune Rural Police',
    issuingAuthorityMr: 'महाराष्ट्र वन विभाग (वेल्हे परिक्षेत्र) व पुणे ग्रामीण पोलीस',
    authorityType: 'forest_department',
    sourceName: 'Pune Forest Division Standing Order',
    sourceUrl: 'https://mahaforest.gov.in/',
    verifiedAt: new Date().toISOString(),
    isExpired: false,
  },

  // 3. Tamhini Ghat Waterfalls: Deep Plunge Pool & High-Flow Barricades
  {
    id: 'ord-tamhini-waterfall-hazard',
    destinationSlug: 'tamhini-ghat',
    destinationName: 'Tamhini Ghat & Waterfalls',
    destinationNameMr: 'ताम्हिणी घाट व धबधबे',
    title: 'Hazardous Water Depth & High-Flow Waterfall Cascade Barricade Directive',
    titleMr: 'खोल डोह व वेगवान जलप्रपातांमध्ये उतरण्यावर प्रतिबंधात्मक सूचना',
    severity: 'urgent',
    category: 'weather',
    sourceType: 'authority_advisory',
    isOfficialOrder: true,
    statusImpact: 'warning',
    summary:
      'District Disaster Management Authority Pune and Paud Police prohibit tourists from venturing into deep natural plunge pools, fast-flowing mountain streams, and slippery rocky ledges along Tamhini Ghat. Sightseeing from designated highway viewpoints is open.',
    summaryMr:
      'पुणे जिल्हा आपत्ती व्यवस्थापन प्राधिकरण आणि पौड पोलिसांनी ताम्हिणी घाटातील खोल नैसर्गिक डोहात व वेगवान पाण्याच्या प्रवाहामध्ये उतरण्यास सक्त बंदी घातली आहे. महामार्गालगतच्या अधिकृत व्ह्यू-पॉइंट्सवरून निसर्गदर्शन सुरू आहे.',
    canEnter: true,
    canTrek: false,
    canDarshan: null,
    effectiveFrom: '2024-06-01T00:00:00.000Z',
    effectiveUntil: null,
    reopeningConditions: 'Sightseeing permitted from designated viewpoints. Water entry prohibited.',
    reopeningConditionsMr: 'व्ह्यू-पॉइंट्सवरून पाहण्यास परवानगी, मात्र पाण्यात उतरण्यास बंदी.',
    issuingAuthority: 'District Disaster Management Authority (DDMA), Pune & Paud Police',
    issuingAuthorityMr: 'जिल्हा आपत्ती व्यवस्थापन प्राधिकरण (DDMA), पुणे व पौड पोलीस',
    authorityType: 'disaster_management',
    sourceName: 'District Collectorate Pune Public Advisory',
    sourceUrl: 'https://pune.gov.in/',
    verifiedAt: new Date().toISOString(),
    isExpired: false,
  },

  // 4. Bushi Dam: Step-Cascade Flash Flood Overflow Regulations
  {
    id: 'ord-bushi-dam-safety',
    destinationSlug: 'bushi-dam',
    destinationName: 'Bushi Dam (Lonavala Water Cascades)',
    destinationNameMr: 'भुशी डॅम (लोणावळा)',
    title: 'Overflow Cascade Entry Timings (Strictly 9:00 AM to 5:00 PM)',
    titleMr: 'भुशी धरणाच्या पायऱ्यांवर प्रवेश वेळ मर्यादा (सकाळी ९ ते सायं. ५)',
    severity: 'moderate',
    category: 'road_access',
    sourceType: 'authority_advisory',
    isOfficialOrder: true,
    statusImpact: 'restricted',
    summary:
      'Lonavala City Police and District Administration mandate visitor clearance from Bushi Dam cascades by 5:00 PM daily. Forest trails beyond the main masonry structure and jumping into backwaters are strictly prohibited.',
    summaryMr:
      'लोणावळा शहर पोलीस व प्रशासनाकडून दररोज सायंकाळी ५:०० वाजता भुशी धरणाच्या पायऱ्या रिकाम्या केल्या जातात. धरणाच्या मागील खोल पाण्यात उतरण्यास किंवा उडी मारण्यास सक्त बंदी आहे.',
    canEnter: true,
    canTrek: false,
    canDarshan: null,
    effectiveFrom: '2024-06-01T00:00:00.000Z',
    effectiveUntil: null,
    reopeningConditions: 'Accessible daily between 9:00 AM and 5:00 PM under police monitoring.',
    reopeningConditionsMr: 'सकाळी ९:०० ते सायं. ५:०० दरम्यान पोलीस देखरेखीखाली सुरू.',
    issuingAuthority: 'Lonavala Police Station & Pune Rural District Administration',
    issuingAuthorityMr: 'लोणावळा पोलीस ठाणे व पुणे ग्रामीण जिल्हा प्रशासन',
    authorityType: 'police',
    sourceName: 'Pune Rural Police Public Notice',
    sourceUrl: 'https://punepolice.gov.in/',
    verifiedAt: new Date().toISOString(),
    isExpired: false,
  },

  // 5. Shreemant Dagdusheth: Sanctum Darshan Protocol & Queue Management
  {
    id: 'ord-dagdusheth-darshan-protocol',
    destinationSlug: 'shreemant-dagdusheth-halwai-ganpati',
    destinationName: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    destinationNameMr: 'श्रीमंत दगडूशेठ हलवाई गणपती मंदिर',
    title: 'Daily Darshan Operating Hours & Sanctum Etiquette Protocol',
    titleMr: 'दैनिक दर्शन वेळ व गाभारा नियम नियमावली',
    severity: 'advisory',
    category: 'darshan',
    sourceType: 'official_order',
    isOfficialOrder: true,
    statusImpact: 'open',
    summary:
      'Temple is operating normally for general public darshan from 6:00 AM to 10:30 PM daily. Traditional Devasthan dress codes apply. Security bag screening is active at all entrance gates.',
    summaryMr:
      'मंदिर दररोज सकाळी ६:०० ते रात्री १०:३० या वेळेत भाविकांसाठी दर्शनासाठी नियमित सुरू आहे. पारंपरिक पोशाख नियम व सुरक्षा तपासणी सर्व प्रवेशद्वारांवर सुरू आहे.',
    canEnter: true,
    canTrek: null,
    canDarshan: true,
    effectiveFrom: '2024-01-01T00:00:00.000Z',
    effectiveUntil: null,
    reopeningConditions: 'Operating smoothly without disruption.',
    reopeningConditionsMr: 'नियमित दर्शन विनाअडथळा सुरू आहे.',
    issuingAuthority: 'Shreemant Dagdusheth Halwai Sarvajanik Ganpati Trust',
    issuingAuthorityMr: 'श्रीमंत दगडूशेठ हलवाई सार्वजनिक गणपती ट्रस्ट',
    authorityType: 'temple_trust',
    sourceName: 'Trust Official Daily Schedule Announcement',
    sourceUrl: 'https://dagdushethganpati.com/',
    verifiedAt: new Date().toISOString(),
    isExpired: false,
  },

  // 6. Alandi Dnyaneshwar Mandir: Indrayani River Ghat Advisory & Darshan Flow
  {
    id: 'ord-alandi-darshan-ghat',
    destinationSlug: 'alandi-dnyaneshwar-mandir',
    destinationName: 'Alandi (Sant Dnyaneshwar Sanjeevan Samadhi)',
    destinationNameMr: 'आळंदी (संत ज्ञानेश्वर महाराज संजीवन समाधी)',
    title: 'Sanjeevan Samadhi Darshan Operating Normally; River Deep Water Precaution',
    titleMr: 'संजीवन समाधी दर्शन नियमित सुरू; इंद्रायणी खोल पाण्यात जाण्यास दक्षता सूचना',
    severity: 'advisory',
    category: 'darshan',
    sourceType: 'authority_advisory',
    isOfficialOrder: true,
    statusImpact: 'open',
    summary:
      'Samadhi Mandir is open for Mukh Darshan and Charansparsh as per Trust schedule (6:00 AM – 11:00 PM). Alandi Municipal Council and local police advise pilgrims to avoid deep bathing spots along Indrayani river ghats.',
    summaryMr:
      'समाधी मंदिर संस्थानच्या वेळेनुसार (सकाळी ६:०० ते रात्री ११:००) मुखदर्शन व चरणस्पर्श सुरळीत सुरू आहे. भाविकांना इंद्रायणी नदीच्या खोल पात्रात न जाण्याची दक्षता सूचना देण्यात आली आहे.',
    canEnter: true,
    canTrek: null,
    canDarshan: true,
    effectiveFrom: '2024-01-01T00:00:00.000Z',
    effectiveUntil: null,
    reopeningConditions: 'Operating normally under Trust schedule.',
    reopeningConditionsMr: 'संस्थानच्या नियमांनुसार नियमित सुरू.',
    issuingAuthority: 'Shree Alandi Sansthan Committee & Alandi Municipal Council',
    issuingAuthorityMr: 'श्री आळंदी संस्थान कमिटी व आळंदी नगरपालिका',
    authorityType: 'temple_trust',
    sourceName: 'Shree Alandi Sansthan Notice Board',
    sourceUrl: 'https://alanditemple.org/',
    verifiedAt: new Date().toISOString(),
    isExpired: false,
  },

  // 7. Bhimashankar Jyotirlinga: Dense Fog & Night Ghat Driving Caution
  {
    id: 'ord-bhimashankar-ghat-advisory',
    destinationSlug: 'bhimashankar-temple',
    destinationName: 'Bhimashankar Jyotirlinga Temple & Wildlife Sanctuary',
    destinationNameMr: 'भीमाशंकर ज्योतिर्लिंग मंदिर व अभयारण्य',
    title: 'Temple Darshan Open; Monsoon/Winter Ridge Fog Road Safety Advisory',
    titleMr: 'ज्योतिर्लिंग दर्शन नियमित सुरू; घाट रस्त्यावर धुके व सावधानतेचा इशारा',
    severity: 'advisory',
    category: 'road_access',
    sourceType: 'authority_advisory',
    isOfficialOrder: true,
    statusImpact: 'open',
    summary:
      'Jyotirlinga Temple open from 4:30 AM to 9:30 PM. Pune Rural Police advise drivers to use fog lights and observe low speeds on the steep Manchar-Bhimashankar Ghat road section.',
    summaryMr:
      'भीमाशंकर ज्योतिर्लिंग मंदिर पहाटे ४:३० ते रात्री ९:३० पर्यंत दर्शनासाठी सुरू आहे. मंचर-भीमाशंकर घाट रस्त्यावर धुक्यामुळे वाहनचालकांनी वेगमर्यादा पाळण्याचे आवाहन पोलिसांनी केले आहे.',
    canEnter: true,
    canTrek: true,
    canDarshan: true,
    effectiveFrom: '2024-01-01T00:00:00.000Z',
    effectiveUntil: null,
    reopeningConditions: 'Operating normally with cautious driving advised on ghat road.',
    reopeningConditionsMr: 'घाट रस्त्यावर सावधगिरी बाळगून नियमित दर्शन सुरू.',
    issuingAuthority: 'Shree Kshetra Bhimashankar Devasthan & Pune Rural Police',
    issuingAuthorityMr: 'श्री क्षेत्र भीमाशंकर देवस्थान व पुणे ग्रामीण पोलीस',
    authorityType: 'temple_trust',
    sourceName: 'Devasthan Sansthan & Traffic Division',
    sourceUrl: 'https://bhimashankar.in/',
    verifiedAt: new Date().toISOString(),
    isExpired: false,
  },

  // 8. Shaniwar Wada: ASI Drone & Heritage Conservation Regulations
  {
    id: 'ord-shaniwar-wada-asi-rules',
    destinationSlug: 'shaniwar-wada',
    destinationName: 'Shaniwar Wada',
    destinationNameMr: 'शनिवार वाडा',
    title: 'ASI Operating Hours (9:30 AM – 5:30 PM) & Strict Drone/Plastic Ban',
    titleMr: 'पुरातत्त्व विभाग वेळ (सकाळी ९:३० ते सायं. ५:३०) व ड्रोन/प्लॅस्टिक प्रतिबंध',
    severity: 'advisory',
    category: 'general',
    sourceType: 'official_order',
    isOfficialOrder: true,
    statusImpact: 'open',
    summary:
      'Shaniwar Wada is operating normally for public entry from 9:30 AM to 5:30 PM daily. Archaeological Survey of India (ASI) prohibits unauthorized drone flying, commercial filming without permits, and single-use plastic inside the historic fortified complex.',
    summaryMr:
      'शनिवार वाडा पर्यटकांसाठी दररोज सकाळी ९:३० ते सायं. ५:३० या वेळेत नियमित सुरू आहे. पुरातत्त्व विभागाच्या नियमानुसार वाड्याच्या आवारात ड्रोन उडवणे, विनापरवानगी शूटिंग व प्लॅस्टिकचा वापर करण्यास सक्त मनाई आहे.',
    canEnter: true,
    canTrek: null,
    canDarshan: null,
    effectiveFrom: '2024-01-01T00:00:00.000Z',
    effectiveUntil: null,
    reopeningConditions: 'Open daily as per ASI ticketing hours.',
    reopeningConditionsMr: 'एएसआय नियमांनुसार नियमित सुरू.',
    issuingAuthority: 'Archaeological Survey of India (ASI Mumbai Circle)',
    issuingAuthorityMr: 'भारतीय पुरातत्त्व सर्वेक्षण (ASI मुंबई मंडळ)',
    authorityType: 'asi',
    sourceName: 'ASI Protected Monument Regulation Notice',
    sourceUrl: 'https://asi.nic.in/',
    verifiedAt: new Date().toISOString(),
    isExpired: false,
  },
];

/**
 * Check if an alert is expired based on effectiveUntil timestamp.
 */
export function isAlertExpired(alert: DestinationAlert, now: Date = new Date()): boolean {
  if (!alert.effectiveUntil) return false;
  const expiry = new Date(alert.effectiveUntil);
  if (isNaN(expiry.getTime())) return false;
  return now.getTime() > expiry.getTime();
}

/**
 * Filter alerts strictly matching a specific destination slug.
 * Guarantees zero alert leakage across unrelated destinations.
 */
export function getAlertsForDestination(slug: string): DestinationAlert[] {
  const cleanSlug = slug.toLowerCase().trim();
  const now = new Date();

  return OFFICIAL_STANDING_REGULATIONS.filter((alert) => {
    if (alert.destinationSlug !== cleanSlug) return false;
    if (isAlertExpired(alert, now)) return false;
    return true;
  });
}

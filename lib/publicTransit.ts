/**
 * Explore Pune - Public Transit Engine (Pune Metro & PMPML Buses)
 * Provides comprehensive routing, station data, bus lines, and ticket information.
 * Verified with official Pune Metro (Maha Metro) Phase 1 & PMPML fare charts.
 */

export interface MetroStation {
  id: string;
  nameEn: string;
  nameMr: string;
  line: 'purple' | 'aqua' | 'both';
  lineNameEn: string;
  lineNameMr: string;
  latitude: number;
  longitude: number;
  isInterchange?: boolean;
}

export interface TransitRouteInfo {
  hasTransit: boolean;
  transitType: 'metro_only' | 'bus_only' | 'metro_plus_bus' | 'train_plus_local' | 'intercity_bus';
  summaryEn: string;
  summaryMr: string;
  originNameEn?: string;
  originNameMr?: string;
  nearestMetro?: {
    stationNameEn: string;
    stationNameMr: string;
    lineNameEn: string;
    lineNameMr: string;
    distanceKm: number;
    walkingMinutes: number;
    lineColor: string;
  };
  nearestBus?: {
    stopNameEn: string;
    stopNameMr: string;
    routeNumbers: string[];
    distanceKm: number;
    walkingMinutes: number;
  };
  stepByStepEn: string[];
  stepByStepMr: string[];
  estimatedMinutes: number;
  estimatedCostInr: number;
  ticketInfoEn: string;
  ticketInfoMr: string;
  bookingOptions: {
    metroWhatsApp?: string;
    busApp?: string;
    ticketType?: string;
    dayPassEligible?: boolean;
  };
  gmapsTransitUrl?: string;
  mapBounds?: {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
    centerLat: number;
    centerLng: number;
  };
}

// =========================================================================
// OFFICIAL FARE CALCULATORS (PUNE METRO & PMPML BUSES)
// =========================================================================

/**
 * Pune Metro Official Graduated Fare Slabs (Phase 1):
 * 0 to 2 km: ₹10
 * 2 to 4 km: ₹15
 * 4 to 8 km: ₹20
 * 8 to 12 km: ₹25
 * 12 to 18 km: ₹30
 * 18+ km: ₹35 (Terminal-to-Terminal maximum, e.g. PCMC ↔ Swargate, Vanaz ↔ Ramwadi)
 * Discounts: 30% discount on Saturdays & Sundays; 30% student discount; 10% on Maha Card.
 */
export function calculateMetroFare(distanceKm: number): number {
  if (distanceKm <= 2.0) return 10;
  if (distanceKm <= 4.0) return 15;
  if (distanceKm <= 8.0) return 20;
  if (distanceKm <= 12.0) return 25;
  if (distanceKm <= 18.0) return 30;
  return 35;
}

/**
 * PMPML Official Stage-based Fare Slabs (Non-AC & AC Regular City Buses):
 * Stage 1 (0 to 2 km): ₹5
 * Stage 2 (2 to 4 km): ₹10
 * Stage 3 (4 to 6 km): ₹15
 * Stage 4 (6 to 10 km): ₹20
 * Stage 5 (10 to 14 km): ₹25
 * Stage 6 (14 to 18 km): ₹30
 * Stage 7 (18 to 22 km): ₹35
 * Stage 8 (22 to 26 km): ₹40
 * Beyond 26 km: ₹45 to ₹55
 * Day Passes: ₹70 Unified Daily Pass (PMC + PCMC limits), ₹150 All-Routes Pass (Entire PMPML network including rural/PMRDA). Senior Citizens: ₹40.
 */
export function calculatePmpmlFare(distanceKm: number): number {
  if (distanceKm <= 2.0) return 5;
  if (distanceKm <= 4.0) return 10;
  if (distanceKm <= 6.0) return 15;
  if (distanceKm <= 10.0) return 20;
  if (distanceKm <= 14.0) return 25;
  if (distanceKm <= 18.0) return 30;
  if (distanceKm <= 22.0) return 35;
  if (distanceKm <= 26.0) return 40;
  if (distanceKm <= 32.0) return 45;
  return 50;
}

// =========================================================================
// PUNE METRO STATIONS (Line 1: Purple Line & Line 2: Aqua Line)
// =========================================================================
export const PUNE_METRO_STATIONS: MetroStation[] = [
  // PURPLE LINE (Line 1: PCMC to Swargate)
  { id: 'pcmc', nameEn: 'PCMC Bhavan', nameMr: 'पिंपरी चिंचवड महापालिका भवन', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.6279, longitude: 73.8009 },
  { id: 'sant-tukaram-nagar', nameEn: 'Sant Tukaram Nagar', nameMr: 'संत तुकाराम नगर', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.6192, longitude: 73.8164 },
  { id: 'bhosari-nashik-phata', nameEn: 'Bhosari (Nashik Phata)', nameMr: 'भोसरी (नाशिक फाटा)', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.6042, longitude: 73.8242 },
  { id: 'kasarwadi', nameEn: 'Kasarwadi', nameMr: 'कासारवाडी', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5947, longitude: 73.8272 },
  { id: 'phugewadi', nameEn: 'Phugewadi', nameMr: 'फुगेवाडी', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5839, longitude: 73.8306 },
  { id: 'dapodi', nameEn: 'Dapodi', nameMr: 'दापोडी', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5756, longitude: 73.8322 },
  { id: 'bopodi', nameEn: 'Bopodi', nameMr: 'बोपोडी', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5661, longitude: 73.8344 },
  { id: 'khadki', nameEn: 'Khadki', nameMr: 'खडकी', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5583, longitude: 73.8389 },
  { id: 'range-hill', nameEn: 'Range Hill', nameMr: 'रेंज हिल', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5447, longitude: 73.8442 },
  { id: 'shivajinagar-metro', nameEn: 'Shivajinagar Metro Station', nameMr: 'शिवाजीनगर मेट्रो स्थानक', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5322, longitude: 73.8518 },
  { id: 'civil-court', nameEn: 'Civil Court (Interchange)', nameMr: 'सिव्हिल कोर्ट (जंक्शन)', line: 'both', lineNameEn: 'Purple & Aqua Interchange', lineNameMr: 'जांभळी व अक्वा जंक्शन', latitude: 18.5283, longitude: 73.8571, isInterchange: true },
  { id: 'budhwar-peth', nameEn: 'Budhwar Peth / Phadke Haud', nameMr: 'बुधवार पेठ / फडके हौद', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5178, longitude: 73.8574 },
  { id: 'mandai', nameEn: 'Mandai', nameMr: 'मंडई', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5134, longitude: 73.8562 },
  { id: 'swargate-metro', nameEn: 'Swargate Metro Station', nameMr: 'स्वारगेट मेट्रो स्थानक', line: 'purple', lineNameEn: 'Purple Line (Line 1)', lineNameMr: 'जांभळी मार्गिका (मार्गिका १)', latitude: 18.5018, longitude: 73.8576 },

  // AQUA LINE (Line 2: Vanaz to Ramwadi)
  { id: 'vanaz', nameEn: 'Vanaz', nameMr: 'वनाज', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.4988, longitude: 73.8075 },
  { id: 'anand-nagar', nameEn: 'Anand Nagar', nameMr: 'आनंद नगर', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5021, longitude: 73.8152 },
  { id: 'ideal-colony', nameEn: 'Ideal Colony', nameMr: 'आयडियल कॉलनी', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5054, longitude: 73.8242 },
  { id: 'nal-stop', nameEn: 'Nal Stop', nameMr: 'नल स्टॉप', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5082, longitude: 73.8315 },
  { id: 'garware-college', nameEn: 'Garware College', nameMr: 'गरवारे कॉलेज', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5126, longitude: 73.8384 },
  { id: 'deccan-gymkhana-metro', nameEn: 'Deccan Gymkhana', nameMr: 'डेक्कन जिमखाना', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5175, longitude: 73.8423 },
  { id: 'sambhaji-udyan-metro', nameEn: 'Chhatrapati Sambhaji Udyan', nameMr: 'छत्रपती संभाजी महाराज उद्यान', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5212, longitude: 73.8471 },
  { id: 'pmc-metro', nameEn: 'PMC (Municipal Corporation)', nameMr: 'पुणे महानगरपालिका भवन', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5234, longitude: 73.8532 },
  { id: 'mangalwar-peth', nameEn: 'Mangalwar Peth / RTO', nameMr: 'मंगळवार पेठ / आरटीओ', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5298, longitude: 73.8652 },
  { id: 'pune-station-metro', nameEn: 'Pune Railway Station Metro', nameMr: 'पुणे रेल्वे स्टेशन मेट्रो स्थानक', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5284, longitude: 73.8739 },
  { id: 'ruby-hall', nameEn: 'Ruby Hall Clinic', nameMr: 'रुबी हॉल क्लिनिक', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5332, longitude: 73.8785 },
  { id: 'bund-garden-metro', nameEn: 'Bund Garden Metro', nameMr: 'बंड गार्डन मेट्रो स्थानक', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5364, longitude: 73.8834 },
  { id: 'yerawada', nameEn: 'Yerawada', nameMr: 'येरवडा', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5472, longitude: 73.8892 },
  { id: 'kalyani-nagar-metro', nameEn: 'Kalyani Nagar Metro', nameMr: 'कल्याणी नगर मेट्रो स्थानक', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5488, longitude: 73.9038 },
  { id: 'ramwadi', nameEn: 'Ramwadi', nameMr: 'रामवाडी', line: 'aqua', lineNameEn: 'Aqua Line (Line 2)', lineNameMr: 'अक्वा मार्गिका (मार्गिका २)', latitude: 18.5521, longitude: 73.9184 },
];

// =========================================================================
// PUNE COMMUTE & RESIDENTIAL HUBS (FOR "TRAVEL FROM MY HOME" NAVIGATION)
// =========================================================================
export interface CommuteHub {
  id: string;
  nameEn: string;
  nameMr: string;
  latitude: number;
  longitude: number;
  metroStationEn?: string;
  metroStationMr?: string;
  busTerminalEn: string;
  busTerminalMr: string;
  popularLocalBuses: string[];
}

export const PUNE_COMMUTE_HUBS: CommuteHub[] = [
  {
    id: 'kothrud',
    nameEn: 'Kothrud / Karve Road',
    nameMr: 'कोथरूड / कर्वे रस्ता',
    latitude: 18.5074,
    longitude: 73.8077,
    metroStationEn: 'Vanaz & Ideal Colony (Aqua Line)',
    metroStationMr: 'वनाज व आयडियल कॉलनी (अक्वा मार्गिका)',
    busTerminalEn: 'Paud Phata & Kothrud Depot',
    busTerminalMr: 'पौड फाटा व कोथरूड डेपो',
    popularLocalBuses: [
      'Bus 102 (Kothrud Depot ↔ Hadapsar Gadital via Swargate)',
      'Bus 100 (Kothrud ↔ Pune Railway Station via Deccan)',
      'Bus 36 (Kothrud ↔ Chinchwad Gaon via Bavdhan)',
      'Bus 71 (Kothrud ↔ Swargate Bus Terminal)',
    ],
  },
  {
    id: 'hadapsar',
    nameEn: 'Hadapsar / Magarpatta',
    nameMr: 'हडपसर / मगरपट्टा',
    latitude: 18.5089,
    longitude: 73.9259,
    busTerminalEn: 'Hadapsar Gadital PMPML Hub',
    busTerminalMr: 'हडपसर गाडीतळ पीएमपीएमएल डेपो',
    popularLocalBuses: [
      'Bus 149 (Hadapsar Gadital ↔ Nigdi Pradhikaran via Kharadi & Pimpri)',
      'Bus 159 (Hadapsar Gadital ↔ Manapa PMC Bhavan via Pulgate)',
      'Bus 102 (Hadapsar Gadital ↔ Kothrud Depot via Swargate)',
      'Bus 208 (Hadapsar Gadital ↔ Katraj Bus Depot via Kondhwa)',
    ],
  },
  {
    id: 'hinjewadi',
    nameEn: 'Hinjewadi IT Park / Phase 1',
    nameMr: 'हिंजवडी आयटी पार्क / फेज १',
    latitude: 18.5913,
    longitude: 73.7389,
    busTerminalEn: 'Hinjewadi Shivaji Chowk Terminal',
    busTerminalMr: 'हिंजवडी शिवाजी चौक टर्मिनल',
    popularLocalBuses: [
      'Bus 100 (Hinjewadi Phase 3 ↔ Pune Railway Station via Aundh & Deccan)',
      'Bus 312 (Hinjewadi Phase 3 ↔ Chinchwad Gaon via Dange Chowk)',
      'Bus 348 (Hinjewadi Phase 3 ↔ Nigdi Pradhikaran via Wakad)',
      'Bus 115 (Hinjewadi Phase 1 ↔ Katraj Bus Depot via Highway)',
    ],
  },
  {
    id: 'viman-nagar',
    nameEn: 'Viman Nagar / Airport Rd',
    nameMr: 'विमान नगर / विमानतळ रस्ता',
    latitude: 18.5679,
    longitude: 73.9143,
    metroStationEn: 'Ramwadi Metro (Aqua Line)',
    metroStationMr: 'रामवाडी मेट्रो (अक्वा मार्गिका)',
    busTerminalEn: 'Viman Nagar Corner / Nagar Rd BRT',
    busTerminalMr: 'विमान नगर कॉर्नर / नगर रोड बीआरटी',
    popularLocalBuses: [
      'Bus 174 (Viman Nagar / Airport ↔ Pune Railway Station via Yerawada)',
      'Bus 149 (Kharadi / Viman Nagar Bypass ↔ Nigdi via Dapodi)',
      'Bus 165 (Viman Nagar Corner ↔ Wagholi Kesnand Phata)',
      'Bus 168 (Viman Nagar ↔ Manapa PMC Bhavan)',
    ],
  },
  {
    id: 'kalyani-nagar',
    nameEn: 'Kalyani Nagar / KP',
    nameMr: 'कल्याणी नगर / कोरेगाव पार्क',
    latitude: 18.5463,
    longitude: 73.9033,
    metroStationEn: 'Kalyani Nagar Metro (Aqua Line)',
    metroStationMr: 'कल्याणी नगर मेट्रो स्थानक',
    busTerminalEn: 'Kalyani Nagar Bridge / Nagar Rd',
    busTerminalMr: 'कल्याणी नगर पूल / नगर रस्ता',
    popularLocalBuses: [
      'Bus 174 (Kalyani Nagar ↔ Pune Railway Station)',
      'Bus 165 (Kalyani Nagar ↔ Wagholi)',
    ],
  },
  {
    id: 'shivajinagar',
    nameEn: 'Shivaji Nagar / FC Road',
    nameMr: 'शिवाजीनगर / एफसी रस्ता',
    latitude: 18.5314,
    longitude: 73.8446,
    metroStationEn: 'Shivajinagar Metro (Purple Line)',
    metroStationMr: 'शिवाजीनगर मेट्रो स्थानक',
    busTerminalEn: 'Shivajinagar Central Bus & ST Stand',
    busTerminalMr: 'शिवाजीनगर मध्यवर्ती बस व एसटी स्थानक',
    popularLocalBuses: [
      'Bus 100 (Shivajinagar ↔ Hinjewadi IT Park Phase 3)',
      'Bus 9 (Shivajinagar ↔ Warje Malwadi)',
      'Bus 71 (Shivajinagar ↔ Alandi Devachi)',
      'Bus 148 (Shivajinagar ↔ Pimpri PCMC)',
    ],
  },
  {
    id: 'swargate',
    nameEn: 'Swargate / Mukund Nagar',
    nameMr: 'स्वारगेट / मुकुंद नगर',
    latitude: 18.5018,
    longitude: 73.8576,
    metroStationEn: 'Swargate Metro (Purple Line)',
    metroStationMr: 'स्वारगेट मेट्रो स्थानक',
    busTerminalEn: 'Swargate Bus & ST Terminal',
    busTerminalMr: 'स्वारगेट मध्यवर्ती बस व एसटी डेपो',
    popularLocalBuses: [
      'Bus 50 (Swargate Bus Terminal ↔ Sinhagad Fort Paytha / Donje)',
      'Bus 24 (Swargate ↔ Pune Railway Station)',
      'Bus 71 (Swargate ↔ Alandi Devachi)',
      'Bus 276 (Swargate ↔ Taljai Hills via Sahakar Nagar)',
      'Bus 208 (Swargate ↔ Hadapsar Gadital)',
    ],
  },
  {
    id: 'deccan',
    nameEn: 'Deccan Gymkhana / JM Rd',
    nameMr: 'डेक्कन जिमखाना / जेएम रस्ता',
    latitude: 18.5175,
    longitude: 73.8423,
    metroStationEn: 'Deccan Gymkhana (Aqua Line)',
    metroStationMr: 'डेक्कन जिमखाना मेट्रो स्थानक',
    busTerminalEn: 'Deccan Gymkhana Bus Stand',
    busTerminalMr: 'डेक्कन जिमखाना बस स्थानक',
    popularLocalBuses: [
      'Bus 100 (Deccan ↔ Hinjewadi Phase 3 & Pune Station)',
      'Bus 11 (Deccan ↔ Senapati Bapat Road / Vetal Tekdi)',
      'Bus 9 (Deccan ↔ Warje Malwadi)',
    ],
  },
  {
    id: 'pune-station',
    nameEn: 'Pune Station / Camp',
    nameMr: 'पुणे रेल्वे स्टेशन / कॅम्प',
    latitude: 18.5284,
    longitude: 73.8739,
    metroStationEn: 'Pune Railway Station (Aqua Line)',
    metroStationMr: 'पुणे रेल्वे स्टेशन मेट्रो स्थानक',
    busTerminalEn: 'Pune Station Bus & ST Depot',
    busTerminalMr: 'पुणे स्टेशन बस व एसटी डेपो',
    popularLocalBuses: [
      'Bus 100 (Pune Station ↔ Hinjewadi Maan Phase 3 via Deccan)',
      'Bus 24 (Pune Station ↔ Katraj Bus Depot via Swargate)',
      'Bus 148 (Pune Station ↔ Pimpri PCMC via Khadki)',
      'Bus 174 (Pune Station ↔ Viman Nagar / Pune Airport)',
      'Bus 144 (Pune Station ↔ NDA Gate / Khadakwasla Dam)',
      'Bus 165 (Pune Station ↔ Wagholi Kesnand Phata)',
    ],
  },
  {
    id: 'katraj',
    nameEn: 'Katraj / Dhankawadi',
    nameMr: 'कात्रज / धनकवडी',
    latitude: 18.4575,
    longitude: 73.8587,
    busTerminalEn: 'Katraj Bus Depot',
    busTerminalMr: 'कात्रज बस डेपो',
    popularLocalBuses: [
      'Bus 24 (Katraj Bus Depot ↔ Pune Railway Station via Swargate)',
      'Bus 208 (Katraj Depot ↔ Hadapsar Gadital via Kondhwa)',
      'Bus 42 (Katraj Depot ↔ Nigdi Pradhikaran via Swargate)',
      'Bus 115 (Katraj ↔ Hinjewadi IT Park Phase 1)',
    ],
  },
  {
    id: 'sinhagad-road',
    nameEn: 'Sinhagad Road / Anand Nagar',
    nameMr: 'सिंहगड रस्ता / आनंद नगर',
    latitude: 18.4850,
    longitude: 73.8210,
    metroStationEn: 'Anand Nagar (Aqua Line, 2 km)',
    metroStationMr: 'आनंद नगर मेट्रो (२ किमी)',
    busTerminalEn: 'Manik Baug / Hingne Khurd',
    busTerminalMr: 'माणिक बाग / हिंगणे खुर्द',
    popularLocalBuses: [
      'Bus 50 (Manik Baug ↔ Sinhagad Fort Paytha / Donje)',
      'Bus 51 (Manik Baug ↔ Manapa PMC Bhavan)',
      'Bus 144 (Sinhagad Road ↔ Khadakwasla Dam)',
    ],
  },
  {
    id: 'baner',
    nameEn: 'Baner / Balewadi High St',
    nameMr: 'बाणेर / बालेवाडी हाय स्ट्रीट',
    latitude: 18.5590,
    longitude: 73.7868,
    busTerminalEn: 'Baner Phata / Balewadi Stand',
    busTerminalMr: 'बाणेर फाटा / बालेवाडी बस थांबा',
    popularLocalBuses: [
      'Bus 100 (Baner Phata ↔ Hinjewadi Phase 3 & Pune Station)',
      'Bus 256 (Balewadi Stadium ↔ Manapa PMC Bhavan)',
    ],
  },
  {
    id: 'aundh',
    nameEn: 'Aundh / Bremen Chowk',
    nameMr: 'औंध / ब्रेमेन चौक',
    latitude: 18.5580,
    longitude: 73.8075,
    busTerminalEn: 'Parihar Chowk / Bremen Chowk',
    busTerminalMr: 'परिहार चौक / ब्रेमेन चौक',
    popularLocalBuses: [
      'Bus 100 (Aundh Bremen Chowk ↔ Hinjewadi & Pune Station)',
      'Bus 103 (Aundh ↔ Katraj via Swargate)',
    ],
  },
  {
    id: 'wakad',
    nameEn: 'Wakad / Dange Chowk',
    nameMr: 'वाकड / डांगे चौक',
    latitude: 18.5987,
    longitude: 73.7667,
    busTerminalEn: 'Dange Chowk / Wakad Bridge',
    busTerminalMr: 'डांगे चौक / वाकड ब्रिज',
    popularLocalBuses: [
      'Bus 149 (Wakad / Dange Chowk ↔ Hadapsar Gadital & Nigdi)',
      'Bus 312 (Wakad / Dange Chowk ↔ Hinjewadi Phase 3)',
      'Bus 348 (Wakad ↔ Nigdi Pradhikaran)',
    ],
  },
  {
    id: 'pimpri',
    nameEn: 'Pimpri / PCMC Bhavan',
    nameMr: 'पिंपरी / पिंपरी-चिंचवड मनपा',
    latitude: 18.6279,
    longitude: 73.8009,
    metroStationEn: 'PCMC Bhavan Metro (Purple Line)',
    metroStationMr: 'पिंपरी महापालिका भवन मेट्रो स्थानक',
    busTerminalEn: 'Pimpri Chowk Bus Terminal',
    busTerminalMr: 'पिंपरी चौक बस टर्मिनल',
    popularLocalBuses: [
      'Bus 149 (Pimpri ↔ Hadapsar Gadital via Kharadi & Nigdi)',
      'Bus 148 (Pimpri PCMC ↔ Pune Railway Station via Khadki)',
      'Bus 304 (Pimpri ↔ Chinchwad Gaon)',
    ],
  },
  {
    id: 'chinchwad',
    nameEn: 'Chinchwad / Chapekar Chowk',
    nameMr: 'चिंचवड / चापेकर चौक',
    latitude: 18.6298,
    longitude: 73.7997,
    metroStationEn: 'PCMC Metro (1.5 km)',
    metroStationMr: 'पिंपरी मनपा मेट्रो स्थानक',
    busTerminalEn: 'Chinchwad Gaon / Mahavir Chowk',
    busTerminalMr: 'चिंचवड गाव / महावीर चौक थांबा',
    popularLocalBuses: [
      'Bus 149 (Chinchwad ↔ Hadapsar Gadital via Kharadi & Nigdi)',
      'Bus 312 (Chinchwad Gaon ↔ Hinjewadi Phase 3 via Dange Chowk)',
      'Bus 36 (Chinchwad Gaon ↔ Swargate Bus Terminal)',
    ],
  },
  {
    id: 'nigdi',
    nameEn: 'Nigdi / Pradhikaran',
    nameMr: 'निगडी / प्राधिकरण',
    latitude: 18.6540,
    longitude: 73.7745,
    busTerminalEn: 'Bhakti Shakti Nigdi Bus Terminal',
    busTerminalMr: 'भक्ती शक्ती निगडी बस टर्मिनल',
    popularLocalBuses: [
      'Bus 149 (Nigdi Pradhikaran ↔ Hadapsar Gadital via Chinchwad, Pimpri & Kharadi)',
      'Bus 348 (Nigdi ↔ Hinjewadi IT Park Phase 3 via Wakad)',
      'Bus 42 (Nigdi ↔ Katraj Bus Depot via Swargate)',
    ],
  },
  {
    id: 'bhosari',
    nameEn: 'Bhosari / Nashik Phata',
    nameMr: 'भोसरी / नाशिक फाटा',
    latitude: 18.6042,
    longitude: 73.8242,
    metroStationEn: 'Bhosari Metro (Purple Line)',
    metroStationMr: 'भोसरी (नाशिक फाटा) मेट्रो',
    busTerminalEn: 'Nashik Phata PMPML Depot',
    busTerminalMr: 'नाशिक फाटा पीएमपीएमएल डेपो',
    popularLocalBuses: [
      'Bus 174 (Nashik Phata ↔ Pune Railway Station)',
      'Bus 357 (Bhosari ↔ Hinjewadi Phase 3)',
    ],
  },
  {
    id: 'yerwada',
    nameEn: 'Yerwada / Vishrantwadi',
    nameMr: 'येरवडा / विश्रांतवाडी',
    latitude: 18.5529,
    longitude: 73.8831,
    metroStationEn: 'Yerawada Metro (Aqua Line)',
    metroStationMr: 'येरवडा मेट्रो स्थानक',
    busTerminalEn: 'Yerwada Gunjan Chowk',
    busTerminalMr: 'येरवडा गुंजन चौक थांबा',
    popularLocalBuses: [
      'Bus 149 (Yerawada ↔ Hadapsar Gadital & Nigdi)',
      'Bus 165 (Yerawada ↔ Wagholi Kesnand Phata)',
      'Bus 174 (Yerawada ↔ Pune Station)',
    ],
  },
  {
    id: 'warje',
    nameEn: 'Warje / Karve Nagar',
    nameMr: 'वारजे / कर्वे नगर',
    latitude: 18.4857,
    longitude: 73.7992,
    busTerminalEn: 'Warje Malwadi Bus Stand',
    busTerminalMr: 'वारजे माळवाडी बस स्थानक',
    popularLocalBuses: [
      'Bus 9 (Warje Malwadi ↔ Pune Railway Station via Deccan)',
      'Bus 36 (Warje ↔ Chinchwad Gaon)',
      'Bus 72 (Warje ↔ Swargate Bus Terminal)',
    ],
  },
  {
    id: 'kondhwa',
    nameEn: 'Kondhwa / NIBM Road',
    nameMr: 'कोंढवा / एनआयबीएम रस्ता',
    latitude: 18.4720,
    longitude: 73.8960,
    busTerminalEn: 'NIBM Road / Kondhwa Khurd',
    busTerminalMr: 'एनआयबीएम रोड / कोंढवा खुर्द',
    popularLocalBuses: [
      'Bus 208 (Kondhwa ↔ Hadapsar Gadital & Katraj Depot)',
      'Bus 142 (Kondhwa ↔ Manapa PMC Bhavan)',
    ],
  },
  {
    id: 'bavdhan',
    nameEn: 'Bavdhan / Chandani Chowk',
    nameMr: 'बावधन / चांदणी चौक',
    latitude: 18.5126,
    longitude: 73.7741,
    metroStationEn: 'Vanaz Metro (Aqua Line, 3 km)',
    metroStationMr: 'वनाज मेट्रो स्थानक',
    busTerminalEn: 'Chandani Chowk & Bavdhan Phata',
    busTerminalMr: 'चांदणी चौक व बावधन फाटा',
    popularLocalBuses: [
      'Bus 36 (Bavdhan ↔ Chinchwad Gaon & Kothrud)',
      'Bus 100 (Chandani Chowk ↔ Hinjewadi & Pune Station)',
    ],
  },
];

export const PMPML_OFFICIAL_CORRIDORS = [
  { busNo: '149', routeEn: 'Bus 149 (Hadapsar Gadital ↔ Nigdi Pradhikaran via Kharadi & Pimpri)', routeMr: 'बस १४९ (हडपसर गाडीतळ ↔ निगडी प्राधिकरण)' },
  { busNo: '159', routeEn: 'Bus 159 (Hadapsar Gadital ↔ Manapa PMC Bhavan via Pulgate)', routeMr: 'बस १५९ (हडपसर गाडीतळ ↔ मनपा भवन)' },
  { busNo: '100', routeEn: 'Bus 100 (Hinjewadi Maan Phase 3 ↔ Pune Railway Station via Deccan)', routeMr: 'बस १०० (हिंजवडी फेज ३ ↔ पुणे स्टेशन)' },
  { busNo: '24', routeEn: 'Bus 24 (Katraj Bus Depot ↔ Pune Railway Station via Swargate)', routeMr: 'बस २४ (कात्रज डेपो ↔ पुणे स्टेशन)' },
  { busNo: '50', routeEn: 'Bus 50 (Swargate Bus Terminal ↔ Sinhagad Fort Paytha / Donje)', routeMr: 'बस ५० (स्वारगेट ↔ सिंहगड पायथा)' },
  { busNo: '174', routeEn: 'Bus 174 (Pune Railway Station ↔ Viman Nagar / Pune Airport)', routeMr: 'बस १७४ (पुणे स्टेशन ↔ विमान नगर / विमानतळ)' },
  { busNo: '312', routeEn: 'Bus 312 (Chinchwad Gaon ↔ Hinjewadi Phase 3 via Dange Chowk)', routeMr: 'बस ३१२ (चिंचवड गाव ↔ हिंजवडी फेज ३)' },
  { busNo: '102', routeEn: 'Bus 102 (Kothrud Depot ↔ Hadapsar Gadital via Karve Road)', routeMr: 'बस १०२ (कोथरूड डेपो ↔ हडपसर गाडीतळ)' },
  { busNo: '71', routeEn: 'Bus 71 (Swargate ↔ Alandi Devachi via Shivajinagar)', routeMr: 'बस ७१ (स्वारगेट ↔ आळंदी देवाची)' },
  { busNo: '144', routeEn: 'Bus 144 (Pune Station ↔ NDA Khadakwasla Dam via Swargate)', routeMr: 'बस १४४ (पुणे स्टेशन ↔ खडकवासला धरण)' },
  { busNo: '208', routeEn: 'Bus 208 (Hadapsar Gadital ↔ Katraj Bus Depot via Kondhwa)', routeMr: 'बस २०८ (हडपसर ↔ कात्रज डेपो)' },
  { busNo: '165', routeEn: 'Bus 165 (Pune Station ↔ Wagholi Kesnand Phata)', routeMr: 'बस १६५ (पुणे स्टेशन ↔ वाघोली)' },
  { busNo: '348', routeEn: 'Bus 348 (Nigdi Pradhikaran ↔ Hinjewadi Phase 3 via Wakad)', routeMr: 'बस ३४८ (निगडी ↔ हिंजवडी फेज ३)' },
  { busNo: '9', routeEn: 'Bus 9 (Pune Station ↔ Warje Malwadi via Deccan)', routeMr: 'बस ९ (पुणे स्टेशन ↔ वारजे माळवाडी)' },
];

// Helper: Haversine distance in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Find closest metro station to any coordinate
export function findNearestMetroStation(lat: number, lng: number) {
  let nearest: MetroStation = PUNE_METRO_STATIONS[0];
  let minDistance = calculateDistanceKm(lat, lng, nearest.latitude, nearest.longitude);

  for (const st of PUNE_METRO_STATIONS) {
    const dist = calculateDistanceKm(lat, lng, st.latitude, st.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = st;
    }
  }

  const walkingMinutes = Math.max(1, Math.round(minDistance * 13)); // ~4.5 km/h walking speed
  return {
    station: nearest,
    distanceKm: minDistance,
    walkingMinutes,
    lineColor: nearest.line === 'purple' ? '#7c3aed' : nearest.line === 'aqua' ? '#0284c7' : '#6d28d9',
  };
}

// =========================================================================
// PMPML BUS CORRIDORS & PUBLIC TRANSIT BLUEPRINTS
// =========================================================================
interface PlaceTransitRule {
  slug: string;
  directBuses?: string[];
  nearestStopEn: string;
  nearestStopMr: string;
  busOriginEn: string;
  busOriginMr: string;
  busFrequencyEn: string;
  busFrequencyMr: string;
  busFareInr: number;
  metroAdvised: boolean;
  specialTransitEn?: string;
  specialTransitMr?: string;
}

const PLACE_TRANSIT_RULES: Record<string, PlaceTransitRule> = {
  // FORTS & SAHYADRI
  'sinhagad-fort': {
    slug: 'sinhagad-fort',
    directBuses: ['Bus 50 (Swargate ↔ Sinhagad Paytha/Donje)', 'Bus 51 (PMC ↔ Khanapur)'],
    nearestStopEn: 'Donje Phata / Sinhagad Paytha (Foothills)',
    nearestStopMr: 'डोणजे फाटा / सिंहगड पायथा',
    busOriginEn: 'Swargate Bus Terminal & PMC Bhavan',
    busOriginMr: 'स्वारगेट बस स्थानक व मनपा भवन',
    busFrequencyEn: 'Every 30 minutes from 06:30 AM',
    busFrequencyMr: 'दर ३० मिनिटांनी (सकाळी ६:३० पासून)',
    busFareInr: 25,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 1 to Swargate Station, then take PMPML Bus 50 directly to Sinhagad foothills (Donje). From paytha, shared Jeeps (₹70) go to top or hike via Kalyan Darwaza.',
    specialTransitMr: 'मेट्रो लाईन १ ने स्वारगेट स्थानकावर या, तिथून थेट पीएमपीएमएल बस क्र. ५० पकडून सिंहगड पायथ्याशी (डोणजे) पोहोचा. पायथ्यावरून गडावर जाण्यासाठी शेअर जीप (₹७०) किंवा पायी ट्रेक उपलब्ध आहे.',
  },
  'rajgad-fort': {
    slug: 'rajgad-fort',
    directBuses: ['MSRTC ST Bus (Swargate ↔ Gunjavane)', 'PMPML Bus 64 (Swargate ↔ Bhor)'],
    nearestStopEn: 'Gunjavane Village (Rajgad Base)',
    nearestStopMr: 'गुंजवणे गाव (राजगड पायथा)',
    busOriginEn: 'Swargate ST Stand',
    busOriginMr: 'स्वारगेट एसटी स्टँड',
    busFrequencyEn: 'Hourly morning services',
    busFrequencyMr: 'सकाळी दर तासाला एसटी बसेस',
    busFareInr: 45,
    metroAdvised: true,
    specialTransitEn: 'Metro to Swargate Station → Walk to Swargate MSRTC ST stand → Board Bhor/Gunjavane bus directly to Gunjavane village.',
    specialTransitMr: 'मेट्रोने स्वारगेट स्थानक गाठा → स्वारगेट एसटी स्टँडवरून भोर/गुंजवणे जाणारी बस पकडून गुंजवणे गावात उतरा.',
  },
  'torna-fort': {
    slug: 'torna-fort',
    directBuses: ['MSRTC ST Bus (Swargate ↔ Velhe)', 'PMPML Bus to Velhe'],
    nearestStopEn: 'Velhe Village (Torna Base)',
    nearestStopMr: 'वेल्हे गाव (तोरणा पायथा)',
    busOriginEn: 'Swargate Bus Stand',
    busOriginMr: 'स्वारगेट बस स्थानक',
    busFrequencyEn: 'Every 45 minutes',
    busFrequencyMr: 'दर ४५ मिनिटांनी',
    busFareInr: 50,
    metroAdvised: true,
    specialTransitEn: 'Metro to Swargate Station → Direct MSRTC or PMPML bus to Velhe village at the base of Torna.',
    specialTransitMr: 'स्वारगेट मेट्रो स्थानक → स्वारगेटवरून थेट वेल्हे बस पकडून तोरण्याच्या पायथ्याशी पोहोचा.',
  },
  'shivneri-fort': {
    slug: 'shivneri-fort',
    directBuses: ['MSRTC Semi-Luxury ST Bus (Shivajinagar ↔ Junnar)'],
    nearestStopEn: 'Junnar Bus Stand',
    nearestStopMr: 'जुन्नर बस स्थानक',
    busOriginEn: 'Shivajinagar ST Stand',
    busOriginMr: 'शिवाजीनगर एसटी बस स्थानक',
    busFrequencyEn: 'Every 30 minutes from 05:30 AM',
    busFrequencyMr: 'दर ३० मिनिटांनी नियमित',
    busFareInr: 120,
    metroAdvised: true,
    specialTransitEn: 'Metro to Shivajinagar Metro Station → Take direct Junnar ST bus from Shivajinagar ST Depot (approx 2.5 hrs). Auto from Junnar stand to Shivneri fort is 2 km.',
    specialTransitMr: 'मेट्रोने शिवाजीनगर स्थानकावर या → शिवाजीनगर एसटी डेपोतून थेट जुन्नर बस पकडा (२.५ तास). जुन्नर स्थानकावरून रिक्षाने २ किमी अंतरावर शिवनेरी किल्ला आहे.',
  },
  'lohagad-fort': {
    slug: 'lohagad-fort',
    directBuses: ['Pune Local Train (Pune Station ↔ Malavali Station)'],
    nearestStopEn: 'Malavali Railway Station (2.5 km walk)',
    nearestStopMr: 'मळवली रेल्वे स्थानक',
    busOriginEn: 'Pune Railway Station & Shivajinagar Station',
    busOriginMr: 'पुणे रेल्वे स्टेशन व शिवाजीनगर स्टेशन',
    busFrequencyEn: 'Suburban train runs every 45 minutes',
    busFrequencyMr: 'दर ४५ मिनिटांनी उपनगरीय लोकल ट्रेन',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Take Metro to Pune Railway Station or Shivajinagar → Board Pune-Lonavala suburban local train to Malavali Station (₹15 ticket). Walk or take shared auto to Lohagad/Bhaja base.',
    specialTransitMr: 'पुणे स्टेशन किंवा शिवाजीनगर मेट्रो स्थानक → पुणे-लोणावळा लोकल ट्रेन पकडून मळवली स्थानकावर उतरा (फक्त ₹१५ तिकीट). तिथून पायी किंवा शेअर ऑटोने लोहगड पायथ्याशी जा.',
  },
  'visapur-fort': {
    slug: 'visapur-fort',
    directBuses: ['Pune Local Train (Pune Station ↔ Malavali Station)'],
    nearestStopEn: 'Malavali Railway Station',
    nearestStopMr: 'मळवली रेल्वे स्थानक',
    busOriginEn: 'Pune Railway Station & Shivajinagar Station',
    busOriginMr: 'पुणे रेल्वे स्टेशन व शिवाजीनगर स्टेशन',
    busFrequencyEn: 'Every 45 minutes',
    busFrequencyMr: 'दर ४५ मिनिटांनी लोकल ट्रेन',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Take Suburban train to Malavali Station (₹15), then hike past Bhaja Caves towards the Visapur waterfall staircase route.',
    specialTransitMr: 'लोकल ट्रेनने मळवली स्थानक गाठा (₹१५), तिथून भाजे गावामार्गे विसापूरच्या पायऱ्यांच्या धबधबा ट्रेकला सुरुवात करा.',
  },
  'purandar-fort': {
    slug: 'purandar-fort',
    directBuses: ['PMPML Bus 208 (Swargate ↔ Saswad)', 'Saswad-Purandar Mini Bus'],
    nearestStopEn: 'Saswad Bus Stand / Purandar Base',
    nearestStopMr: 'सासवड बस स्थानक / पुरंदर पायथा',
    busOriginEn: 'Swargate Bus Terminal & Hadapsar Gadital',
    busOriginMr: 'स्वारगेट बस स्थानक व हडपसर गाडीतळ',
    busFrequencyEn: 'Every 20 minutes to Saswad',
    busFrequencyMr: 'दर २० मिनिटांनी सासवड बस',
    busFareInr: 35,
    metroAdvised: true,
    specialTransitEn: 'Metro to Swargate → PMPML Bus 208 to Saswad (₹35) → Connecting local mini bus or shared auto to Purandar Fort gate.',
    specialTransitMr: 'स्वारगेट मेट्रो स्थानक → स्वारगेटवरून पीएमपीएमएल बस क्र. २०८ ने सासवडला जा (₹३५) → सासवडवरून पुरंदर किल्ल्यासाठी स्थानिक बस किंवा रिक्षा.',
  },
  'tikona-fort': {
    slug: 'tikona-fort',
    directBuses: ['Local train to Kamshet Station', 'Kamshet-Pawna PMPML/ST Bus'],
    nearestStopEn: 'Tikona Peth Village',
    nearestStopMr: 'तिकोना पेठ गाव',
    busOriginEn: 'Pune Station (Train) → Kamshet',
    busOriginMr: 'पुणे स्टेशन लोकल ट्रेन → कामशेत',
    busFrequencyEn: 'Hourly local trains to Kamshet',
    busFrequencyMr: 'दर तासाला कामशेतसाठी लोकल ट्रेन',
    busFareInr: 25,
    metroAdvised: true,
    specialTransitEn: 'Local train to Kamshet (₹15) → Board Pawna Lake mini bus or shared Jeep to Tikona Peth at the base of the fort.',
    specialTransitMr: 'लोकलने कामशेत स्थानक (₹१५) → तिथून पवना तलाव बस किंवा जीपने तिकोना पेठ गाठून पायऱ्यांनी गडावर चढा.',
  },
  'karla-caves': {
    slug: 'karla-caves',
    directBuses: ['Pune Local Train to Malavali or Lonavala', 'MSRTC Bus from Lonavala'],
    nearestStopEn: 'Karla Phata / Ekvira Mandir Base',
    nearestStopMr: 'कार्ला फाटा / एकवीरा देवी पायथा',
    busOriginEn: 'Pune Station / Shivajinagar Station',
    busOriginMr: 'पुणे स्टेशन / शिवाजीनगर लोकल ट्रेन',
    busFrequencyEn: 'Every 45 minutes',
    busFrequencyMr: 'दर ४५ मिनिटांनी',
    busFareInr: 20,
    metroAdvised: true,
    specialTransitEn: 'Local train to Malavali Station (3 km walk/auto) or Lonavala Station → Local bus/auto to Karla Caves & Ekvira Devi temple.',
    specialTransitMr: 'लोकल ट्रेनने मळवली किंवा लोणावळा स्टेशन → तिथून स्थानिक बस किंवा ऑटोने कार्ला लेणी पायथ्याशी पोहोचा.',
  },
  'bhaja-caves': {
    slug: 'bhaja-caves',
    directBuses: ['Pune Local Train to Malavali Station (1.8 km walk)'],
    nearestStopEn: 'Bhaja Village, Malavali',
    nearestStopMr: 'भाजे गाव, मळवली',
    busOriginEn: 'Pune Railway Station & Shivajinagar',
    busOriginMr: 'पुणे स्टेशन व शिवाजीनगर',
    busFrequencyEn: 'Every 45 minutes',
    busFrequencyMr: 'दर ४५ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Take Pune-Lonavala local train to Malavali Station. Walk 20 minutes through village directly up to Bhaja Buddhist caves.',
    specialTransitMr: 'पुणे-लोणावळा लोकल ट्रेनने मळवली स्टेशनवर उतरा. तिथून निसर्गरम्य गावातून २० मिनिटे चालत थेट भाजा लेणीवर जाता येते.',
  },

  // HERITAGE & WADAS
  'shaniwar-wada': {
    slug: 'shaniwar-wada',
    directBuses: ['Bus 2', 'Bus 3', 'Bus 9', 'Bus 11', 'Bus 24', 'Bus 36', 'Bus 100', 'Bus 111'],
    nearestStopEn: 'Shaniwar Wada Stop / Appa Balwant Chowk',
    nearestStopMr: 'शनिवार वाडा थांबा / आप्पा बळवंत चौक',
    busOriginEn: 'Swargate, Pune Station, Deccan, Kothrud, Hadapsar',
    busOriginMr: 'स्वारगेट, पुणे स्टेशन, डेक्कन, कोथरूड, हडपसर',
    busFrequencyEn: 'Every 3 to 5 minutes',
    busFrequencyMr: 'दर ३ ते ५ मिनिटांनी सतत',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Pune Metro Line 1 (Purple Line) to Budhwar Peth / Mandai Station or PMC Station (Aqua Line) and walk 400m directly to Dilli Darwaza.',
    specialTransitMr: 'पुणे मेट्रो लाईन १ ने बुधवार पेठ स्थानक किंवा लाईन २ ने मनपा स्थानकावर उतरा आणि ४०० मीटर पायी चालून शनिवार वाड्याच्या दिल्ली दरवाज्यापाशी पोहोचा.',
  },
  'lal-mahal': {
    slug: 'lal-mahal',
    directBuses: ['Bus 3', 'Bus 9', 'Bus 11', 'Bus 24'],
    nearestStopEn: 'Lal Mahal / Kasba Peth Chowk',
    nearestStopMr: 'लाल महाल / कसबा पेठ चौक',
    busOriginEn: 'All central hubs',
    busOriginMr: 'सर्व मध्यवर्ती बस स्थानके',
    busFrequencyEn: 'Every 3 minutes',
    busFrequencyMr: 'दर ३ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Metro to Budhwar Peth Station (Purple Line) or PMC (Aqua Line) - 300m walk right across from Shaniwar Wada.',
    specialTransitMr: 'मेट्रो लाईन १ ने बुधवार पेठ किंवा लाईन २ ने मनपा स्थानक गाठा - शनिवार वाड्यासमोरच लाल महाल आहे.',
  },
  'vishrambaug-wada': {
    slug: 'vishrambaug-wada',
    directBuses: ['Bus 9', 'Bus 11', 'Bus 42'],
    nearestStopEn: 'Vishrambaug Wada / Bajirao Road',
    nearestStopMr: 'विश्रामबाग वाडा / बाजीराव रस्ता',
    busOriginEn: 'Swargate & Deccan Gymkhana',
    busOriginMr: 'स्वारगेट व डेक्कन',
    busFrequencyEn: 'Every 5 minutes',
    busFrequencyMr: 'दर ५ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Metro Line 1 to Mandai Metro Station → Walk 350m along Laxmi Road to Vishrambaug Wada.',
    specialTransitMr: 'मेट्रो लाईन १ ने मंडई स्थानकावर उतरा → लक्ष्मी रोडने ३५० मीटर चालत विश्रामबाग वाड्यात पोहोचा.',
  },
  'aga-khan-palace': {
    slug: 'aga-khan-palace',
    directBuses: ['Bus 132', 'Bus 133', 'Bus 165', 'Bus 167'],
    nearestStopEn: 'Aga Khan Palace Stop, Nagar Road',
    nearestStopMr: 'आगा खान पॅलेस थांबा, नगर रोड',
    busOriginEn: 'Pune Station, PMC Bhavan & Swargate',
    busOriginMr: 'पुणे स्टेशन, मनपा व स्वारगेट',
    busFrequencyEn: 'Every 5 to 8 minutes',
    busFrequencyMr: 'दर ५ ते ८ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Metro Line 2 (Aqua Line) to Kalyani Nagar Metro Station or Ramwadi Station → Walk 800m or take a ₹10 feeder bus directly to the gate.',
    specialTransitMr: 'मेट्रो लाईन २ (अक्वा लाईन) ने कल्याणी नगर किंवा रामवाडी स्थानकावर उतरा → तिथून ८०० मीटर पायी किंवा १० रुपयांच्या फीडर बसने थेट प्रवेशद्वारावर पोहोचा.',
  },
  'shinde-chhatri': {
    slug: 'shinde-chhatri',
    directBuses: ['Bus 148', 'Bus 177'],
    nearestStopEn: 'Shinde Chhatri Stop, Wanowrie',
    nearestStopMr: 'शिंदे छत्री थांबा, वानवडी',
    busOriginEn: 'Pune Station & Swargate',
    busOriginMr: 'पुणे स्टेशन व स्वारगेट',
    busFrequencyEn: 'Every 15 minutes',
    busFrequencyMr: 'दर १५ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: false,
    specialTransitEn: 'Take PMPML Bus 148 from Pune Station or Bus 177 from Swargate directly to Wanowrie Bazar.',
    specialTransitMr: 'पुणे स्टेशनवरून पीएमपीएमएल बस क्र. १४८ किंवा स्वारगेटवरून बस क्र. १७७ थेट वानवडी बाजारसाठी पकडा.',
  },
  'fergusson-college-heritage': {
    slug: 'fergusson-college-heritage',
    directBuses: ['Bus 9', 'Bus 10', 'Bus 11', 'Bus 100', 'Bus 101', 'Bus 103'],
    nearestStopEn: 'Fergusson College Main Gate (FC Road)',
    nearestStopMr: 'फर्ग्युसन महाविद्यालय मुख्य प्रवेशद्वार (एफसी रोड)',
    busOriginEn: 'All hubs',
    busOriginMr: 'सर्व मुख्य डेपो',
    busFrequencyEn: 'Every 2 minutes',
    busFrequencyMr: 'दर २ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 2 (Aqua Line) to Deccan Gymkhana or Garware College Metro Station → Walk 400m onto FC Road.',
    specialTransitMr: 'मेट्रो लाईन २ ने डेक्कन जिमखाना किंवा गरवारे कॉलेज स्थानकावर उतरा → ४०० मीटर पायी चालून फर्ग्युसन कॉलेजच्या मुख्य प्रवेशद्वारावर पोहोचा.',
  },
  'pune-university-heritage-building': {
    slug: 'pune-university-heritage-building',
    directBuses: ['Bus 100', 'Bus 103', 'Bus 115', 'Bus 256'],
    nearestStopEn: 'University Main Gate, Ganeshkhind',
    nearestStopMr: 'विद्यापीठ मुख्य प्रवेशद्वार, गणेशखिंड',
    busOriginEn: 'Pune Station, Swargate, PMC & Kothrud',
    busOriginMr: 'पुणे स्टेशन, स्वारगेट, मनपा व कोथरूड',
    busFrequencyEn: 'Every 4 minutes',
    busFrequencyMr: 'दर ४ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Metro to Shivajinagar Metro Station → Take any University bus from Simla Office (5 mins).',
    specialTransitMr: 'शिवाजीनगर मेट्रो स्थानक → शिमला ऑफिसवरून विद्यापीठ जाणारी बस पकडा (५ मिनिटे).',
  },
  'bund-garden': {
    slug: 'bund-garden',
    directBuses: ['Bus 132', 'Bus 133'],
    nearestStopEn: 'Bund Garden Metro & Bus Stop',
    nearestStopMr: 'बंड गार्डन मेट्रो व बस थांबा',
    busOriginEn: 'Pune Station (1.2 km) & Yerwada',
    busOriginMr: 'पुणे स्टेशन व येरवडा',
    busFrequencyEn: 'Continuous',
    busFrequencyMr: 'सतत उपलब्ध',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 2 (Aqua Line) directly to Bund Garden Metro Station - exit right outside the garden gate!',
    specialTransitMr: 'मेट्रो लाईन २ ने थेट बंड गार्डन मेट्रो स्थानकावर उतरा - बाहेर पडताच बागेचे प्रवेशद्वार आहे!',
  },

  // TEMPLES & SHRINES
  'shreemant-dagdusheth-halwai-ganpati': {
    slug: 'shreemant-dagdusheth-halwai-ganpati',
    directBuses: ['Bus 2', 'Bus 3', 'Bus 9', 'Bus 11', 'Bus 24', 'Bus 36'],
    nearestStopEn: 'Dagdusheth Ganpati / Appa Balwant Chowk',
    nearestStopMr: 'दगडूशेठ गणपती / आप्पा बळवंत चौक थांबा',
    busOriginEn: 'Swargate, Pune Station & PMC',
    busOriginMr: 'स्वारगेट, पुणे स्टेशन व मनपा',
    busFrequencyEn: 'Every 2 minutes',
    busFrequencyMr: 'दर २ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 1 (Purple Line) to Budhwar Peth Station (300m walk) or Mandai Station (450m walk). Direct walking corridor leads straight to the golden sanctum.',
    specialTransitMr: 'मेट्रो लाईन १ ने बुधवार पेठ स्थानकावर उतरा (फक्त ३०० मीटर चालणे) किंवा मंडई स्थानकावरून या. थेट मंदिराच्या सुवर्ण गाभाऱ्यापर्यंत जाता येते.',
  },
  'kasba-ganpati': {
    slug: 'kasba-ganpati',
    directBuses: ['Bus 3', 'Bus 9', 'Bus 11'],
    nearestStopEn: 'Kasba Peth Ganpati Mandir Stop',
    nearestStopMr: 'कसबा पेठ गणपती मंदिर थांबा',
    busOriginEn: 'All central routes',
    busOriginMr: 'सर्व मध्यवर्ती मार्ग',
    busFrequencyEn: 'Every 5 minutes',
    busFrequencyMr: 'दर ५ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Metro to Budhwar Peth Metro Station (400m walk through historic Kasba Peth lanes).',
    specialTransitMr: 'मेट्रो लाईन १ ने बुधवार पेठ स्थानक (ऐतिहासिक कसबा पेठेतून ४०० मीटर चालणे).',
  },
  'pataleshwar-cave-temple': {
    slug: 'pataleshwar-cave-temple',
    directBuses: ['Bus 9', 'Bus 100', 'Bus 103'],
    nearestStopEn: 'Pataleshwar / Balgandharva JM Road Stop',
    nearestStopMr: 'पाताळेश्वर / बालगंधर्व रंगमंदिर थांबा',
    busOriginEn: 'Shivajinagar & Swargate',
    busOriginMr: 'शिवाजीनगर व स्वारगेट',
    busFrequencyEn: 'Every 3 minutes',
    busFrequencyMr: 'दर ३ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Metro Line 2 (Aqua Line) to Chhatrapati Sambhaji Udyan Station or Shivajinagar Metro Station → 400m walk along JM Road.',
    specialTransitMr: 'मेट्रो लाईन २ ने संभाजी महाराज उद्यान किंवा लाईन १ ने शिवाजीनगर स्थानक → जेएम रोडवरून ४०० मीटर चालणे.',
  },
  'chaturshringi-temple': {
    slug: 'chaturshringi-temple',
    directBuses: ['Bus 100', 'Bus 103', 'Bus 115'],
    nearestStopEn: 'Chaturshringi Mandir Stop, SB Road',
    nearestStopMr: 'चतुःशृंगी मंदिर थांबा, सेनापती बापट रस्ता',
    busOriginEn: 'Deccan & Shivajinagar',
    busOriginMr: 'डेक्कन व शिवाजीनगर',
    busFrequencyEn: 'Every 5 minutes',
    busFrequencyMr: 'दर ५ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Metro to Deccan Gymkhana or Shivajinagar → Take Bus 100 on Senapati Bapat Road right to the temple steps.',
    specialTransitMr: 'डेक्कन किंवा शिवाजीनगर मेट्रो स्थानक → सेनापती बापट रोडवरून बस क्र. १०० पकडून थेट मंदिर पायऱ्यांपाशी उतरा.',
  },
  'baps-swaminarayan-mandir': {
    slug: 'baps-swaminarayan-mandir',
    directBuses: ['Bus 294', 'Bus 298', 'Bus 301'],
    nearestStopEn: 'Swaminarayan Mandir, Ambegaon BK',
    nearestStopMr: 'स्वामिनारायण मंदिर, आंबेगाव बुद्रुक',
    busOriginEn: 'Swargate & Katraj Depot',
    busOriginMr: 'स्वारगेट व कात्रज डेपो',
    busFrequencyEn: 'Every 15 minutes',
    busFrequencyMr: 'दर १५ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Metro to Swargate Station → Board Katraj-Dehu bypass bus to Ambegaon Swaminarayan Mandir.',
    specialTransitMr: 'स्वारगेट मेट्रो स्थानक → स्वारगेटवरून कात्रज बायपास बसने आंबेगाव स्वामिनारायण मंदिरापाशी उतरा.',
  },
  'parvati-hill': {
    slug: 'parvati-hill',
    directBuses: ['Bus 11', 'Bus 28', 'Bus 64'],
    nearestStopEn: 'Parvati Paytha Stop',
    nearestStopMr: 'पार्वती पायथा थांबा',
    busOriginEn: 'Swargate (1.5 km) & Deccan',
    busOriginMr: 'स्वारगेट व डेक्कन',
    busFrequencyEn: 'Every 8 minutes',
    busFrequencyMr: 'दर ८ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Metro Line 1 to Swargate Metro Station → Take Bus 11 or a ₹40 auto to Parvati Paytha steps.',
    specialTransitMr: 'मेट्रो लाईन १ ने स्वारगेट स्थानकावर या → बस क्र. ११ किंवा ₹४० रिक्षाने पार्वती पायथ्याशी पोहोचून पायऱ्या चढा.',
  },
  'alandi-dnyaneshwar-mandir': {
    slug: 'alandi-dnyaneshwar-mandir',
    directBuses: ['Bus 174 (Pune Station ↔ Alandi)', 'Bus 179 (Swargate ↔ Alandi)', 'Bus 357 (Hinjewadi ↔ Alandi)'],
    nearestStopEn: 'Alandi ST Stand / Indrayani Ghat',
    nearestStopMr: 'आळंदी बस स्थानक / इंद्रायणी घाट',
    busOriginEn: 'Pune Railway Station & Swargate Bus Terminal',
    busOriginMr: 'पुणे रेल्वे स्टेशन व स्वारगेट बस स्थानक',
    busFrequencyEn: 'Every 10 to 15 minutes',
    busFrequencyMr: 'दर १० ते १५ मिनिटांनी नियमित',
    busFareInr: 25,
    metroAdvised: true,
    specialTransitEn: 'Metro to Pune Station or Swargate → Board direct high-frequency PMPML Bus 174 or 179 to Alandi temple gate.',
    specialTransitMr: 'मेट्रोने पुणे स्टेशन किंवा स्वारगेट गाठा → तिथून थेट दर १० मिनिटांनी सुटणारी पीएमपीएमएल बस क्र. १७४ किंवा १७९ पकडून आळंदी समाधी मंदिरापाशी पोहोचा.',
  },
  'dehu-tukaram-mandir': {
    slug: 'dehu-tukaram-mandir',
    directBuses: ['Bus 186 (Pune Station ↔ Dehu Gaon)', 'Bus 305 (Nigdi ↔ Dehu)'],
    nearestStopEn: 'Dehu Gaon Gatha Mandir Stop',
    nearestStopMr: 'देहू गाव गाथा मंदिर थांबा',
    busOriginEn: 'Pune Station & Nigdi Bus Terminal',
    busOriginMr: 'पुणे स्टेशन व निगडी बस स्थानक',
    busFrequencyEn: 'Every 20 minutes',
    busFrequencyMr: 'दर २० मिनिटांनी',
    busFareInr: 30,
    metroAdvised: true,
    specialTransitEn: 'Metro to PCMC Bhavan Station → Take Bus 305 to Dehu Gatha Mandir on the Indrayani river.',
    specialTransitMr: 'मेट्रो लाईन १ ने पिंपरी चिंचवड (PCMC) स्थानक गाठा → तिथून बस क्र. ३०५ ने देहू गाथा मंदिरापाशी उतरा.',
  },
  'jejuri-khandoba-temple': {
    slug: 'jejuri-khandoba-temple',
    directBuses: ['PMPML Bus 208 (Swargate ↔ Saswad ↔ Jejuri)', 'MSRTC ST Buses'],
    nearestStopEn: 'Jejuri ST Stand / Temple Steps',
    nearestStopMr: 'जेजुरी एसटी स्थानक / गडाच्या पायऱ्या',
    busOriginEn: 'Swargate Bus Terminal & Hadapsar',
    busOriginMr: 'स्वारगेट बस डेपो व हडपसर',
    busFrequencyEn: 'Every 20 minutes',
    busFrequencyMr: 'दर २० मिनिटांनी',
    busFareInr: 55,
    metroAdvised: true,
    specialTransitEn: 'Metro to Swargate Station → Take direct PMPML Bus 208 or MSRTC ST bus to Jejuri (₹55). Steps start 300m from the stand.',
    specialTransitMr: 'स्वारगेट मेट्रो स्थानक → स्वारगेट एसटी डेपोतून थेट जेजुरी बस पकडा (₹५५). बस स्थानकापासून ३०० मीटरवर गडाच्या पायऱ्या आहेत.',
  },
  'bhimashankar-temple': {
    slug: 'bhimashankar-temple',
    directBuses: ['MSRTC ST Direct Bus (Shivajinagar/Swargate ↔ Bhimashankar)'],
    nearestStopEn: 'Bhimashankar Bus Stand (Temple Gate)',
    nearestStopMr: 'भीमाशंकर एसटी बस स्थानक (मंदिर प्रवेशद्वार)',
    busOriginEn: 'Shivajinagar ST Depot & Swargate ST Stand',
    busOriginMr: 'शिवाजीनगर एसटी डेपो व स्वारगेट एसटी स्टँड',
    busFrequencyEn: 'Departures at 05:30 AM, 06:30 AM, 07:30 AM, 09:00 AM, 11:30 AM',
    busFrequencyMr: 'सकाळी ५:३०, ६:३०, ७:३०, ९:०० व ११:३० वाजता',
    busFareInr: 180,
    metroAdvised: true,
    specialTransitEn: 'Metro to Shivajinagar Metro Station → Walk into Shivajinagar ST Depot → Board direct Bhimashankar Jyotirlinga ST bus (approx 3.5 hrs).',
    specialTransitMr: 'शिवाजीनगर मेट्रो स्थानक → शिवाजीनगर एसटी डेपोतून थेट भीमाशंकर ज्योतिर्लिंगाची बस पकडा (अंदाजे ३.५ तास).',
  },
  'tulshibaug-temple': {
    slug: 'tulshibaug-temple',
    directBuses: ['Bus 3', 'Bus 9', 'Bus 11', 'Bus 24'],
    nearestStopEn: 'Mandai / Shanipar Stop',
    nearestStopMr: 'मंडई / शनिपार थांबा',
    busOriginEn: 'Swargate, PMC & Pune Station',
    busOriginMr: 'स्वारगेट, मनपा व पुणे स्टेशन',
    busFrequencyEn: 'Every 2 to 3 minutes',
    busFrequencyMr: 'दर २ ते ३ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Metro Line 1 to Mandai Metro Station → 200m walk through the iconic Tulshibaug shopping market directly to the historic Ram Mandir.',
    specialTransitMr: 'मेट्रो लाईन १ ने मंडई स्थानकावर उतरा → तुळशीबाग बाजारातून फक्त २०० मीटर चालून थेट श्रीराम मंदिरात पोहोचा.',
  },
  'iskcon-nvcc-kondhwa': {
    slug: 'iskcon-nvcc-kondhwa',
    directBuses: ['Bus 142', 'Bus 170', 'Bus 298'],
    nearestStopEn: 'ISKCON NVCC Temple Gate, Katraj-Kondhwa Road',
    nearestStopMr: 'इस्कॉन एनव्हीसीसी मंदिर थांबा, कात्रज-कोंढवा रस्ता',
    busOriginEn: 'Swargate & Katraj',
    busOriginMr: 'स्वारगेट व कात्रज',
    busFrequencyEn: 'Every 15 minutes',
    busFrequencyMr: 'दर १५ मिनिटांनी',
    busFareInr: 20,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 1 to Swargate Metro Station → Take Bus 142 directly to ISKCON NVCC Temple Gate in Kondhwa.',
    specialTransitMr: 'मेट्रो लाईन १ ने स्वारगेट स्थानक गाठा → तिथून पीएमपीएमएल बस क्र. १४२ ने थेट कोंढव्यातील इस्कॉन मंदिराच्या गेटवर उतरा.',
  },

  // MUSEUMS & GALLERIES
  'raja-dinkar-kelkar-museum': {
    slug: 'raja-dinkar-kelkar-museum',
    directBuses: ['Bus 9', 'Bus 11', 'Bus 24', 'Bus 42'],
    nearestStopEn: 'Shanipar Chowk / Mandai (350m walk)',
    nearestStopMr: 'शनिपार चौक / मंडई (३५० मीटर चालणे)',
    busOriginEn: 'Swargate, Deccan & Pune Station',
    busOriginMr: 'स्वारगेट, डेक्कन व पुणे स्टेशन',
    busFrequencyEn: 'Every 3 minutes',
    busFrequencyMr: 'दर ३ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Pune Metro Line 1 (Purple Line) to Mandai Station or Budhwar Peth Station → Walk 500m along historic Bajirao Road to Raja Dinkar Kelkar Museum.',
    specialTransitMr: 'पुणे मेट्रो लाईन १ ने मंडई किंवा बुधवार पेठ स्थानक गाठा → बाजीराव रस्त्याने ५०० मीटर पायी चालून राजा दिनकर केळकर वस्तुसंग्रहालयापाशी पोहोचा.',
  },
  'joshi-miniature-railway': {
    slug: 'joshi-miniature-railway',
    directBuses: ['Bus 9', 'Bus 10', 'Bus 11', 'Bus 64', 'Bus 100'],
    nearestStopEn: 'Paud Phata / Nal Stop (Karve Road)',
    nearestStopMr: 'पौड फाटा / नल स्टॉप थांबा (कर्वे रस्ता)',
    busOriginEn: 'Swargate, Deccan & Pune Station',
    busOriginMr: 'स्वारगेट, डेक्कन व पुणे स्टेशन',
    busFrequencyEn: 'Every 3 minutes',
    busFrequencyMr: 'दर ३ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 2 (Aqua Line) to Nal Stop Metro Station or Ideal Colony Station → Walk 600m into Erandwane (Lane 6) to Joshi Museum.',
    specialTransitMr: 'मेट्रो लाईन २ ने नल स्टॉप किंवा आयडियल कॉलनी स्थानक → एरंडवणे गल्ली क्र. ६ ने ६०० मीटर चालून जोशी रेल्वे संग्रहालयात पोहोचा.',
  },
  'joshi-miniature-railway-museum': {
    slug: 'joshi-miniature-railway-museum',
    directBuses: ['Bus 9', 'Bus 10', 'Bus 11', 'Bus 64', 'Bus 100'],
    nearestStopEn: 'Paud Phata / Nal Stop (Karve Road)',
    nearestStopMr: 'पौड फाटा / नल स्टॉप थांबा (कर्वे रस्ता)',
    busOriginEn: 'Swargate, Deccan & Pune Station',
    busOriginMr: 'स्वारगेट, डेक्कन व पुणे स्टेशन',
    busFrequencyEn: 'Every 3 minutes',
    busFrequencyMr: 'दर ३ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 2 (Aqua Line) to Nal Stop Metro Station or Ideal Colony Station → Walk 600m into Erandwane (Lane 6) to Joshi Museum.',
    specialTransitMr: 'मेट्रो लाईन २ ने नल स्टॉप किंवा आयडियल कॉलनी स्थानक → एरंडवणे गल्ली क्र. ६ ने ६०० मीटर चालून जोशी रेल्वे संग्रहालयात पोहोचा.',
  },
  'tribal-museum': {
    slug: 'tribal-museum',
    directBuses: ['Bus 132', 'Bus 133', 'Bus 165'],
    nearestStopEn: 'Circuit House / Queens Garden Stop',
    nearestStopMr: 'सर्किट हाऊस / क्वीन्स गार्डन थांबा',
    busOriginEn: 'Pune Station & Yerawada',
    busOriginMr: 'पुणे स्टेशन व येरवडा',
    busFrequencyEn: 'Every 10 minutes',
    busFrequencyMr: 'दर १० मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 2 (Aqua Line) to Bund Garden Metro Station or Pune Railway Station Metro → 800m walk along shaded Queens Garden Road.',
    specialTransitMr: 'मेट्रो लाईन २ ने बंड गार्डन किंवा पुणे रेल्वे स्टेशन मेट्रो स्थानक → क्वीन्स गार्डन रोडने ८०० मीटर चालून आदिवासी संग्रहालयात पोहोचा.',
  },
  'iucaa-science-park': {
    slug: 'iucaa-science-park',
    directBuses: ['Bus 100', 'Bus 103', 'Bus 115'],
    nearestStopEn: 'Savitribai Phule Pune University IUCAA Gate',
    nearestStopMr: 'सावित्रीबाई फुले पुणे विद्यापीठ / आयुका (IUCAA) गेट',
    busOriginEn: 'Shivajinagar, Swargate & PMC',
    busOriginMr: 'शिवाजीनगर, स्वारगेट व मनपा',
    busFrequencyEn: 'Every 5 minutes',
    busFrequencyMr: 'दर ५ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Metro to Shivajinagar Metro Station → Take Bus 100/103 to SPPU Main Gate (IUCAA campus inside).',
    specialTransitMr: 'शिवाजीनगर मेट्रो स्थानक → बस १००/१०३ ने पुणे विद्यापीठ मुख्य गेटवर उतरा, आत आयुका सायन्स पार्क आहे.',
  },

  // PARKS & NATURE
  'okayama-friendship-garden': {
    slug: 'okayama-friendship-garden',
    directBuses: ['Bus 50', 'Bus 51', 'Bus 52', 'Bus 53'],
    nearestStopEn: 'Pu La Deshpande Garden / Manik Baug Stop',
    nearestStopMr: 'पु. ल. देशपांडे उद्यान / माणिक बाग थांबा',
    busOriginEn: 'Swargate & Deccan',
    busOriginMr: 'स्वारगेट व डेक्कन',
    busFrequencyEn: 'Every 4 minutes',
    busFrequencyMr: 'दर ४ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Metro to Swargate Metro Station → Board Sinhagad Road bus (Bus 50/51/52) for 3 km directly to Pu La Deshpande gate.',
    specialTransitMr: 'स्वारगेट मेट्रो स्थानक → सिंहगड रोड बसने (बस ५०/५१/५२) ३ किमी अंतरावरील पु. ल. देशपांडे उद्यानाच्या प्रवेशद्वारापाशी उतरा.',
  },
  'sarasbaug': {
    slug: 'sarasbaug',
    directBuses: ['Bus 11', 'Bus 24', 'Bus 28', 'Bus 42'],
    nearestStopEn: 'Saras Baug Stop / Peshwe Park',
    nearestStopMr: 'सारसबाग थांबा / पेशवे पार्क',
    busOriginEn: 'Swargate, Pune Station & Deccan',
    busOriginMr: 'स्वारगेट, पुणे स्टेशन व डेक्कन',
    busFrequencyEn: 'Every 3 minutes',
    busFrequencyMr: 'दर ३ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 1 to Swargate Metro Station → Walk 700m west along Nehru Road directly into Saras Baug.',
    specialTransitMr: 'मेट्रो लाईन १ ने स्वारगेट स्थानकावर उतरा → नेहरू रोडने ७०० मीटर पश्चिमेकडे चालत थेट सारसबागेत पोहोचा.',
  },
  'sambhaji-park': {
    slug: 'sambhaji-park',
    directBuses: ['Bus 9', 'Bus 100', 'Bus 103'],
    nearestStopEn: 'Chhatrapati Sambhaji Udyan JM Road / Metro Exit',
    nearestStopMr: 'छत्रपती संभाजी महाराज उद्यान / मेट्रो एक्झिट',
    busOriginEn: 'Deccan, PMC & Swargate',
    busOriginMr: 'डेक्कन, मनपा व स्वारगेट',
    busFrequencyEn: 'Every 2 minutes',
    busFrequencyMr: 'दर २ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 2 directly to Chhatrapati Sambhaji Udyan Metro Station - stairs lead right into the botanical park gate!',
    specialTransitMr: 'मेट्रो लाईन २ ने थेट छत्रपती संभाजी महाराज उद्यान स्थानकावर उतरा - बाहेर पडताच उद्यानाचे मुख्य प्रवेशद्वार आहे!',
  },
  'empress-botanical-garden': {
    slug: 'empress-botanical-garden',
    directBuses: ['Bus 148', 'Bus 177'],
    nearestStopEn: 'Empress Garden Stop / Race Course',
    nearestStopMr: 'एम्प्रेस बॉटनिकल गार्डन थांबा / रेस कोर्स',
    busOriginEn: 'Pune Station & Swargate',
    busOriginMr: 'पुणे स्टेशन व स्वारगेट',
    busFrequencyEn: 'Every 15 minutes',
    busFrequencyMr: 'दर १५ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Metro to Pune Railway Station or Swargate → Board PMPML Bus 148/177 for 2.5 km directly to Empress Garden.',
    specialTransitMr: 'पुणे स्टेशन किंवा स्वारगेट मेट्रो स्थानक → तिथून पीएमपीएमएल बस क्र. १४८/१७७ ने २.५ किमी अंतरावरील एम्प्रेस गार्डन गेटवर पोहोचा.',
  },
  'rajiv-gandhi-zoological-park': {
    slug: 'rajiv-gandhi-zoological-park',
    directBuses: ['Bus 2', 'Bus 24', 'Bus 42', 'Bus 298'],
    nearestStopEn: 'Katraj Zoo / Katraj Depot Stop',
    nearestStopMr: 'कात्रज प्राणीसंग्रहालय / कात्रज डेपो थांबा',
    busOriginEn: 'Swargate & Pune Station',
    busOriginMr: 'स्वारगेट व पुणे स्टेशन',
    busFrequencyEn: 'Every 5 minutes',
    busFrequencyMr: 'दर ५ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Metro to Swargate Metro Station → Take direct high-frequency Bus 24 or 2 to Katraj Snake Park and Zoo.',
    specialTransitMr: 'स्वारगेट मेट्रो स्थानक → स्वारगेटवरून थेट बस क्र. २४ किंवा २ पकडून कात्रज सर्पोद्यान व प्राणीसंग्रहालयापाशी उतरा.',
  },
  'khadakwasla-dam': {
    slug: 'khadakwasla-dam',
    directBuses: ['Bus 50', 'Bus 51', 'Bus 52'],
    nearestStopEn: 'Khadakwasla Dam / Chowpati Stop',
    nearestStopMr: 'खडकवासला धरण / चौपाटी थांबा',
    busOriginEn: 'Swargate & PMC Bhavan',
    busOriginMr: 'स्वारगेट व मनपा भवन',
    busFrequencyEn: 'Every 15 minutes',
    busFrequencyMr: 'दर १५ मिनिटांनी',
    busFareInr: 20,
    metroAdvised: true,
    specialTransitEn: 'Metro to Swargate Metro Station → Board Sinhagad Road bus 50/51/52 to Khadakwasla Dam promenade.',
    specialTransitMr: 'स्वारगेट मेट्रो स्थानक → स्वारगेटवरून बस क्र. ५०/५१/५२ ने खडकवासला धरण चौपाटीवर पोहोचा.',
  },
  'pashan-lake': {
    slug: 'pashan-lake',
    directBuses: ['Bus 103', 'Bus 256'],
    nearestStopEn: 'Pashan Lake / Pashan Circle Stop',
    nearestStopMr: 'पाषाण तलाव / पाषाण सर्कल थांबा',
    busOriginEn: 'Deccan Gymkhana & Pune Station',
    busOriginMr: 'डेक्कन व पुणे स्टेशन',
    busFrequencyEn: 'Every 15 minutes',
    busFrequencyMr: 'दर १५ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Metro to Garware College or Shivajinagar → Take Bus 103 to Pashan Lake jogging track.',
    specialTransitMr: 'गरवारे कॉलेज किंवा शिवाजीनगर मेट्रो स्थानक → बस क्र. १०३ ने पाषाण तलावापाशी उतरा.',
  },
  'gram-sanskruti-udyan': {
    slug: 'gram-sanskruti-udyan',
    directBuses: ['Bus 100', 'Bus 103', 'Bus 256'],
    nearestStopEn: 'Someshwarwadi / Pashan Gram Sanskruti Udyan',
    nearestStopMr: 'सोमेश्वरवाडी / पाषाण ग्राम संस्कृती उद्यान थांबा',
    busOriginEn: 'Shivajinagar & Deccan',
    busOriginMr: 'शिवाजीनगर व डेक्कन',
    busFrequencyEn: 'Every 12 minutes',
    busFrequencyMr: 'दर १२ मिनिटांनी',
    busFareInr: 15,
    metroAdvised: true,
    specialTransitEn: 'Metro to Shivajinagar or Garware College → Take Bus 100/103 to Someshwarwadi (Pashan Village Culture Park).',
    specialTransitMr: 'शिवाजीनगर किंवा गरवारे कॉलेज मेट्रो स्थानक → बस क्र. १००/१०३ ने सोमेश्वरवाडी (पाषाण ग्राम संस्कृती उद्यान) पाशी उतरा.',
  },
  'vetal-tekdi': {
    slug: 'vetal-tekdi',
    directBuses: ['Bus 86', 'Bus 100', 'Bus 101'],
    nearestStopEn: 'Symbiosis SB Road Stop / Kothrud ARAI Base',
    nearestStopMr: 'सिम्बायोसिस एसबी रोड थांबा / कोथरूड एआरएआय पायथा',
    busOriginEn: 'Deccan & Shivajinagar',
    busOriginMr: 'डेक्कन व शिवाजीनगर',
    busFrequencyEn: 'Every 8 minutes',
    busFrequencyMr: 'दर ८ मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Metro Line 2 to Garware College or Nal Stop → 15-minute walk up the hill slope or ₹40 auto to ARAI entry.',
    specialTransitMr: 'मेट्रो लाईन २ ने गरवारे कॉलेज किंवा नल स्टॉप स्थानक → १५ मिनिटे चालून किंवा ₹४० रिक्षाने टेकडीच्या पायथ्याशी पोहोचा.',
  },
  'taljai-hills': {
    slug: 'taljai-hills',
    directBuses: ['Bus 24', 'Bus 28', 'Bus 42'],
    nearestStopEn: 'Padmavati / Sahakar Nagar 2 Stop',
    nearestStopMr: 'पद्मावती / सहकार नगर २ थांबा',
    busOriginEn: 'Swargate & Deccan',
    busOriginMr: 'स्वारगेट व डेक्कन',
    busFrequencyEn: 'Every 10 minutes',
    busFrequencyMr: 'दर १० मिनिटांनी',
    busFareInr: 10,
    metroAdvised: true,
    specialTransitEn: 'Take Metro Line 1 to Swargate Metro Station → Board Bus 24/28 to Sahakar Nagar (1.5 km), then stroll up the green Taljai hill road.',
    specialTransitMr: 'मेट्रो लाईन १ ने स्वारगेट स्थानकावर उतरा → बस २४/२८ ने सहकार नगर, तिथून निसर्गरम्य तळजाई टेकडीच्या वाटेने वर जा.',
  },
  'bhopdeo-ghat-viewpoint': {
    slug: 'bhopdeo-ghat-viewpoint',
    directBuses: ['PMPML Bus 208 (Swargate ↔ Saswad)', 'Bhopdeo Ghat Special'],
    nearestStopEn: 'Bhopdeo Ghat Top / Viewpoint Point',
    nearestStopMr: 'भोपदेव घाट माथा / व्ह्यूपॉईंट',
    busOriginEn: 'Swargate & Hadapsar',
    busOriginMr: 'स्वारगेट व हडपसर',
    busFrequencyEn: 'Every 30 minutes',
    busFrequencyMr: 'दर ३० मिनिटांनी',
    busFareInr: 25,
    metroAdvised: true,
    specialTransitEn: 'Metro Line 1 to Swargate Metro Station → Board Saswad bus via Kondhwa to Bhopdeo Ghat.',
    specialTransitMr: 'मेट्रो लाईन १ ने स्वारगेट स्थानक → स्वारगेटवरून कोंढवा मार्गे सासवडला जाणारी बस पकडून भोपदेव घाटात उतरा.',
  },
  'pawna-lake': {
    slug: 'pawna-lake',
    directBuses: ['Pune Local Train to Kamshet Station', 'Kamshet-Pawna Jeep/Bus'],
    nearestStopEn: 'Pawna Dam Base / Thakursai',
    nearestStopMr: 'पवना धरण परिसर / ठाकूरसाई',
    busOriginEn: 'Pune Station / Shivajinagar (Train) to Kamshet',
    busOriginMr: 'पुणे स्टेशन / शिवाजीनगर लोकल ट्रेन ते कामशेत',
    busFrequencyEn: 'Every hour',
    busFrequencyMr: 'दर तासाला लोकल ट्रेन',
    busFareInr: 30,
    metroAdvised: true,
    specialTransitEn: 'Suburban train to Kamshet Station (₹15) → Shared passenger Jeep or MSRTC mini bus to Pawna Lake campsites.',
    specialTransitMr: 'लोकल ट्रेनने कामशेत स्थानक (₹१५) → तिथून शेअर जीप किंवा मिनी बसने थेट पवना लेक कॅम्पिंग साईट्सवर पोहोचा.',
  },
  'bushi-dam': {
    slug: 'bushi-dam',
    directBuses: ['Pune Local Train to Lonavala', 'Lonavala-INS Shivaji Bus / Shared Auto'],
    nearestStopEn: 'Bushi Dam, INS Shivaji Road',
    nearestStopMr: 'भुशी धरण, आयएनएस शिवाजी रस्ता',
    busOriginEn: 'Pune Station & Shivajinagar Station',
    busOriginMr: 'पुणे स्टेशन व शिवाजीनगर',
    busFrequencyEn: 'Suburban local train every 45 mins',
    busFrequencyMr: 'लोकल ट्रेन दर ४५ मिनिटांनी',
    busFareInr: 35,
    metroAdvised: true,
    specialTransitEn: 'Local train to Lonavala Station (₹15) → Board local Bus or shared auto (₹20) directly to Bushi Dam waterfall steps.',
    specialTransitMr: 'लोकल ट्रेनने लोणावळा स्टेशन (₹१५) → तिथून स्थानिक बस किंवा शेअर ऑटोने (₹२०) भुशी धरणाच्या पायऱ्यांवर पोहोचा.',
  },
  'tiger-point-lonavala': {
    slug: 'tiger-point-lonavala',
    directBuses: ['Pune Local Train to Lonavala', 'Lonavala Shared Tourist Cab/Auto'],
    nearestStopEn: 'Tiger Point / Lions Point Cliff',
    nearestStopMr: 'टायगर पॉईंट / लायन्स पॉईंट कडा',
    busOriginEn: 'Pune Station to Lonavala',
    busOriginMr: 'पुणे स्टेशन ते लोणावळा',
    busFrequencyEn: 'Continuous from Lonavala Station',
    busFrequencyMr: 'लोणावळा स्टेशनवरून सतत उपलब्ध',
    busFareInr: 60,
    metroAdvised: true,
    specialTransitEn: 'Local train to Lonavala Station (₹15) → Shared tourist taxi/auto (₹50-70 per seat) along Aamby Valley Road to Tiger Point.',
    specialTransitMr: 'लोकल ट्रेनने लोणावळा स्टेशन (₹१५) → तिथून शेअर टॅक्सी किंवा रिक्षाने (₹५०-७०) अॅम्बी व्हॅली रोडने टायगर पॉईंटवर जा.',
  },
  'tamhini-ghat': {
    slug: 'tamhini-ghat',
    directBuses: ['PMPML Bus to Pirangut / Paud', 'MSRTC ST Bus (Swargate ↔ Mangaon/Konkan)'],
    nearestStopEn: 'Tamhini Ghat Viewpoint',
    nearestStopMr: 'ताम्हिणी घाट व्ह्यूपॉईंट',
    busOriginEn: 'Swargate ST Stand',
    busOriginMr: 'स्वारगेट एसटी स्टँड',
    busFrequencyEn: 'Regular morning ST buses',
    busFrequencyMr: 'नियमित एसटी बसेस',
    busFareInr: 85,
    metroAdvised: true,
    specialTransitEn: 'Metro to Swargate → Board MSRTC Konkan/Mangaon bus via Mulshi-Tamhini Ghat to enjoy roadside waterfall drops.',
    specialTransitMr: 'स्वारगेट मेट्रो स्थानक → स्वारगेटवरून मुळशी-ताम्हिणी मार्गे कोकणात जाणारी एसटी बस पकडा.',
  },
};

// =========================================================================
// ROUTE GENERATION LOGIC
// =========================================================================
export function getPublicTransitRoute(
  userLat: number,
  userLng: number,
  place: {
    id: string;
    slug?: string;
    name: string;
    name_mr?: string;
    latitude: number;
    longitude: number;
  },
  originName?: string
): TransitRouteInfo {
  const pSlug = place.slug || place.id;
  const directRule = PLACE_TRANSIT_RULES[pSlug];

  const nearestMetroFromUser = findNearestMetroStation(userLat, userLng);
  const nearestMetroToDest = findNearestMetroStation(place.latitude, place.longitude);

  const totalCrowKm = calculateDistanceKm(userLat, userLng, place.latitude, place.longitude);

  // If destination is within 2.2 km of a metro station and origin is within 2.8 km of a metro station
  const isMetroViable = nearestMetroToDest.distanceKm <= 2.2 && nearestMetroFromUser.distanceKm <= 2.8;

  const stepsEn: string[] = [];
  const stepsMr: string[] = [];
  const originLabelEn = originName || 'Your Location';
  const originLabelMr = originName || 'तुमचे स्थान';

  let transitType: TransitRouteInfo['transitType'] = 'bus_only';
  let estimatedCost = 15;
  const estimatedTime = Math.max(20, Math.round(totalCrowKm * 3.5));

  // Calculate realistic distance-based fares
  const metroDistanceKm = calculateDistanceKm(
    nearestMetroFromUser.station.latitude,
    nearestMetroFromUser.station.longitude,
    nearestMetroToDest.station.latitude,
    nearestMetroToDest.station.longitude
  );
  const metroFare = calculateMetroFare(metroDistanceKm);
  const busDistanceKm = totalCrowKm * 1.3;
  const busFare = directRule ? directRule.busFareInr : calculatePmpmlFare(busDistanceKm);

  if (isMetroViable) {
    transitType = nearestMetroToDest.distanceKm <= 0.8 ? 'metro_only' : 'metro_plus_bus';
    const feederCost = nearestMetroToDest.distanceKm > 0.8 ? 10 : 0;
    estimatedCost = metroFare + feederCost;

    // Step 1: Walk to origin metro
    stepsEn.push(`Start from ${originLabelEn}: Walk ${nearestMetroFromUser.distanceKm} km (~${nearestMetroFromUser.walkingMinutes} mins) to ${nearestMetroFromUser.station.nameEn} (${nearestMetroFromUser.station.lineNameEn}).`);
    stepsMr.push(`${originLabelMr} येथून सुरुवात: ${nearestMetroFromUser.station.nameMr} स्थानकापर्यंत जा (${nearestMetroFromUser.distanceKm} किमी, ~${nearestMetroFromUser.walkingMinutes} मिनिटे).`);

    // Step 2: Metro Journey & Interchange Check
    const isSameLine =
      nearestMetroFromUser.station.line === nearestMetroToDest.station.line ||
      nearestMetroFromUser.station.line === 'both' ||
      nearestMetroToDest.station.line === 'both' ||
      nearestMetroFromUser.station.isInterchange ||
      nearestMetroToDest.station.isInterchange;

    if (isSameLine) {
      stepsEn.push(`Board Metro towards ${nearestMetroToDest.station.nameEn}. Ride direct without transfers (Fare: ₹${metroFare}).`);
      stepsMr.push(`थेट ${nearestMetroToDest.station.nameMr} कडे जाणारी मेट्रो पकडा (कोणत्याही बदलाची गरज नाही, तिकीट: ₹${metroFare}).`);
    } else {
      stepsEn.push(`Board Metro towards Civil Court Interchange Station. At Civil Court, transfer between Purple Line and Aqua Line towards ${nearestMetroToDest.station.nameEn} (Single ticket ₹${metroFare} covers both lines).`);
      stepsMr.push(`सिव्हिल कोर्ट जंक्शनकडे जाणारी मेट्रो पकडा. सिव्हिल कोर्ट येथे जांभळी आणि अक्वा लाईनमध्ये बदल करा (एकाच तिकीटावर ₹${metroFare} मध्ये संपूर्ण प्रवास).`);
    }

    // Step 3: Exit and reach place
    if (nearestMetroToDest.distanceKm <= 0.6) {
      stepsEn.push(`Alight at ${nearestMetroToDest.station.nameEn}. Walk ${Math.round(nearestMetroToDest.distanceKm * 1000)}m directly into ${place.name}.`);
      stepsMr.push(`${nearestMetroToDest.station.nameMr} येथे उतरा. तिथून ${Math.round(nearestMetroToDest.distanceKm * 1000)} मीटर पायी चालून ${place.name_mr || place.name} मध्ये पोहोचा.`);
    } else {
      stepsEn.push(`Alight at ${nearestMetroToDest.station.nameEn}. Take a quick connecting PMPML feeder bus or auto (${nearestMetroToDest.distanceKm} km, ~${nearestMetroToDest.walkingMinutes} mins walk, ₹10).`);
      stepsMr.push(`${nearestMetroToDest.station.nameMr} येथे उतरा. तिथून फीडर बस किंवा रिक्षाने ${nearestMetroToDest.distanceKm} किमी अंतर पार करा (अंदाजे ₹१०).`);
    }
  } else if (directRule) {
    // Specific rule available
    transitType = directRule.specialTransitEn?.includes('train') ? 'train_plus_local' : 'intercity_bus';
    estimatedCost = directRule.busFareInr;

    if (directRule.metroAdvised && nearestMetroFromUser.distanceKm <= 2.5) {
      const hubStation = directRule.busOriginEn.includes('Swargate') ? 'Swargate Metro Station' : 'Shivajinagar Metro Station';
      const hubStationMr = directRule.busOriginMr.includes('स्वारगेट') ? 'स्वारगेट मेट्रो स्थानकावर' : 'शिवाजीनगर मेट्रो स्थानकावर';
      stepsEn.push(`Take Pune Metro from ${nearestMetroFromUser.station.nameEn} to ${hubStation} (₹15 - ₹20).`);
      stepsMr.push(`${nearestMetroFromUser.station.nameMr} वरून मेट्रो पकडून ${hubStationMr} या (₹१५ - ₹२०).`);
    }

    stepsEn.push(`Board ${directRule.directBuses ? directRule.directBuses.join(' or ') : 'direct transit'} from ${directRule.busOriginEn} (Fare: ₹${directRule.busFareInr}).`);
    stepsMr.push(`${directRule.busOriginMr} वरून ${directRule.directBuses ? directRule.directBuses.join(' किंवा ') : 'थेट बस'} पकडा (तिकीट: ₹${directRule.busFareInr}).`);

    stepsEn.push(`Alight at ${directRule.nearestStopEn} (${directRule.busFrequencyEn}).`);
    stepsMr.push(`${directRule.nearestStopMr} येथे उतरा (${directRule.busFrequencyMr}).`);
  } else {
    // Generic Bus Connection
    transitType = 'bus_only';
    estimatedCost = busFare;

    stepsEn.push(`From ${originLabelEn}, walk to nearest PMPML bus stop in your locality.`);
    stepsMr.push(`${originLabelMr} येथून तुमच्या परिसरातील जवळच्या पीएमपीएमएल बस थांब्यापाशी जा.`);
    stepsEn.push(`Take bus towards central transit hub (Swargate, PMC Bhavan, or Pune Station) and transfer to local destination route (Fare: ₹${busFare}).`);
    stepsMr.push(`स्वारगेट, मनपा भवन किंवा पुणे स्टेशनकडे जाणारी बस पकडून गंतव्य स्थानाच्या मार्गावर बदल करा (तिकीट: ₹${busFare}).`);
    stepsEn.push(`Alight within walking distance of ${place.name}.`);
    stepsMr.push(`${place.name_mr || place.name} च्या जवळच्या थांब्यावर उतरा.`);
  }

  const nearestBusInfo = directRule
    ? {
        stopNameEn: directRule.nearestStopEn,
        stopNameMr: directRule.nearestStopMr,
        routeNumbers: directRule.directBuses || ['PMPML Local Corridor'],
        distanceKm: 0.3,
        walkingMinutes: 4,
      }
    : {
        stopNameEn: `${place.name} PMPML Stop`,
        stopNameMr: `${place.name_mr || place.name} पीएमपीएमएल थांबा`,
        routeNumbers: [
          'Bus 149 (Hadapsar Gadital ↔ Nigdi Pradhikaran)',
          'Bus 100 (Hinjewadi ↔ Pune Station via Deccan)',
          'Bus 24 (Katraj ↔ Pune Station via Swargate)',
        ],
        distanceKm: 0.4,
        walkingMinutes: 5,
      };

  const minLat = Math.min(userLat, place.latitude) - 0.015;
  const maxLat = Math.max(userLat, place.latitude) + 0.015;
  const minLng = Math.min(userLng, place.longitude) - 0.015;
  const maxLng = Math.max(userLng, place.longitude) + 0.015;

  const gmapsTransitUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat.toFixed(5)},${userLng.toFixed(5)}&destination=${place.latitude.toFixed(5)},${place.longitude.toFixed(5)}&travelmode=transit`;

  return {
    hasTransit: true,
    transitType,
    originNameEn: originLabelEn,
    originNameMr: originLabelMr,
    summaryEn: isMetroViable
      ? `Pune Metro ${nearestMetroToDest.station.lineNameEn} via ${nearestMetroToDest.station.nameEn} (~${nearestMetroToDest.distanceKm} km from destination)`
      : directRule
      ? directRule.directBuses?.[0] || `Direct PMPML Bus from ${directRule.busOriginEn}`
      : `PMPML Bus network (~${totalCrowKm.toFixed(1)} km from ${originLabelEn})`,
    summaryMr: isMetroViable
      ? `पुणे मेट्रो ${nearestMetroToDest.station.lineNameMr} (${nearestMetroToDest.station.nameMr} स्थानकावरून ${nearestMetroToDest.distanceKm} किमी)`
      : directRule
      ? directRule.directBuses?.[0] || `${directRule.busOriginMr} वरून थेट बस`
      : `पीएमपीएमएल बस सेवा (${originLabelMr} पासून ~${totalCrowKm.toFixed(1)} किमी)`,
    nearestMetro: {
      stationNameEn: nearestMetroToDest.station.nameEn,
      stationNameMr: nearestMetroToDest.station.nameMr,
      lineNameEn: nearestMetroToDest.station.lineNameEn,
      lineNameMr: nearestMetroToDest.station.lineNameMr,
      distanceKm: nearestMetroToDest.distanceKm,
      walkingMinutes: nearestMetroToDest.walkingMinutes,
      lineColor: nearestMetroToDest.lineColor,
    },
    nearestBus: nearestBusInfo,
    stepByStepEn: stepsEn,
    stepByStepMr: stepsMr,
    estimatedMinutes: estimatedTime,
    estimatedCostInr: estimatedCost,
    ticketInfoEn: isMetroViable
      ? `Pune Metro fare: ₹${metroFare} (Official slabs: ₹10 - ₹35). WhatsApp QR ticket: text "Hi" to +91 94201 01990. Discounts: 30% off on weekends & students, 10% off with One Pune Card. PMPML Day Pass: ₹70 (PMC + PCMC limits) / ₹150 (all routes & rural network) for unlimited full-day travel!`
      : `PMPML Bus fare: ₹${estimatedCost}. Conductor accepts UPI QR (PhonePe/GPay) & Cash. Tip: Get the ₹70 PMPML Day Pass (PMC + PCMC limits) or ₹150 All-Routes Pass for unlimited travel all day!`,
    ticketInfoMr: isMetroViable
      ? `पुणे मेट्रो तिकीट: ₹${metroFare} (अधिकृत दर: ₹१० ते ₹३५). व्हॉट्सअॅपवर "Hi" पाठवून तिकीट घ्या: +91 94201 01990. सवलत: शनिवार-रविवार ३०% सूट, विद्यार्थ्यांना ३०% सवलत व वन पुणे कार्डवर १०% सूट. पीएमपीएमएलचा ₹७० चा दैनिक पास (मनपा + पिंपरी) किंवा ₹१५० चा ऑल-रूट पास दिवसभर अमर्याद प्रवासासाठी सर्वोत्तम आहे!`
      : `पीएमपीएमएल बस तिकीट: ₹${estimatedCost}. कंडक्टरकडे फोनपे/गुगलपे यूपीआय किंवा रोख रक्कम स्वीकारली जाते. टीप: दिवसभर फिरण्यासाठी ₹७० चा पीएमपीएमएल डे पास (PMC + PCMC) किंवा ₹१५० चा संपूर्ण ऑल-रूट पास अत्यंत फायदेशीर आहे!`,
    bookingOptions: {
      metroWhatsApp: 'https://wa.me/919420101990?text=Hi',
      busApp: 'Aapli PMPML (Google Play Store)',
      ticketType: isMetroViable ? `Pune Metro QR (₹${metroFare}) / PMPML ₹70 Day Pass` : `PMPML Bus (₹${estimatedCost}) / ₹70 Day Pass`,
      dayPassEligible: true,
    },
    gmapsTransitUrl,
    mapBounds: {
      minLat,
      minLng,
      maxLat,
      maxLng,
      centerLat: (userLat + place.latitude) / 2,
      centerLng: (userLng + place.longitude) / 2,
    },
  };
}

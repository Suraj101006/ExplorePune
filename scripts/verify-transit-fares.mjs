import {
  calculateMetroFare,
  calculatePmpmlFare,
  findNearestMetroStation,
  calculateDistanceKm,
  PUNE_METRO_STATIONS,
  getPublicTransitRoute,
} from '../lib/publicTransit.ts';

console.log('========================================================');
console.log('PUNE METRO & PMPML FARE & ROUTE VERIFICATION TEST');
console.log('========================================================\n');

let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName} - ${details}`);
    failedTests++;
  }
}

// 1. FARE CALCULATION TESTS
console.log('--- 1. Pune Metro Distance-Based Fare Slab Tests ---');
assert(calculateMetroFare(0.8) === 10, 'Metro Fare 0-2 km slab is ₹10 (tested 0.8 km)', `got ${calculateMetroFare(0.8)}`);
assert(calculateMetroFare(2.0) === 10, 'Metro Fare 2.0 km boundary is ₹10', `got ${calculateMetroFare(2.0)}`);
assert(calculateMetroFare(3.2) === 15, 'Metro Fare 2-4 km slab is ₹15 (tested 3.2 km)', `got ${calculateMetroFare(3.2)}`);
assert(calculateMetroFare(5.5) === 20, 'Metro Fare 4-8 km slab is ₹20 (tested 5.5 km)', `got ${calculateMetroFare(5.5)}`);
assert(calculateMetroFare(10.0) === 25, 'Metro Fare 8-12 km slab is ₹25 (tested 10.0 km)', `got ${calculateMetroFare(10.0)}`);
assert(calculateMetroFare(14.5) === 30, 'Metro Fare 12-18 km slab is ₹30 (tested 14.5 km)', `got ${calculateMetroFare(14.5)}`);
assert(calculateMetroFare(22.0) === 35, 'Metro Fare >18 km slab is ₹35 max terminal-to-terminal', `got ${calculateMetroFare(22.0)}`);

console.log('\n--- 2. PMPML Bus Stage-Based Fare Slab Tests ---');
assert(calculatePmpmlFare(1.2) === 5, 'PMPML Fare Stage 1 (0-2 km) is ₹5', `got ${calculatePmpmlFare(1.2)}`);
assert(calculatePmpmlFare(3.5) === 10, 'PMPML Fare Stage 2 (2-4 km) is ₹10', `got ${calculatePmpmlFare(3.5)}`);
assert(calculatePmpmlFare(5.0) === 15, 'PMPML Fare Stage 3 (4-6 km) is ₹15', `got ${calculatePmpmlFare(5.0)}`);
assert(calculatePmpmlFare(8.5) === 20, 'PMPML Fare Stage 4 (6-10 km) is ₹20', `got ${calculatePmpmlFare(8.5)}`);
assert(calculatePmpmlFare(12.0) === 25, 'PMPML Fare Stage 5 (10-14 km) is ₹25', `got ${calculatePmpmlFare(12.0)}`);
assert(calculatePmpmlFare(16.5) === 30, 'PMPML Fare Stage 6 (14-18 km) is ₹30', `got ${calculatePmpmlFare(16.5)}`);
assert(calculatePmpmlFare(20.0) === 35, 'PMPML Fare Stage 7 (18-22 km) is ₹35', `got ${calculatePmpmlFare(20.0)}`);
assert(calculatePmpmlFare(24.5) === 40, 'PMPML Fare Stage 8 (22-26 km) is ₹40', `got ${calculatePmpmlFare(24.5)}`);
assert(calculatePmpmlFare(29.0) === 45, 'PMPML Fare Stage 9 (26-32 km) is ₹45', `got ${calculatePmpmlFare(29.0)}`);
assert(calculatePmpmlFare(38.0) === 50, 'PMPML Fare Stage 10 (>32 km) is ₹50', `got ${calculatePmpmlFare(38.0)}`);

// 2. METRO STATION & INTERCHANGE TESTS
console.log('\n--- 3. Pune Metro Network & Civil Court Interchange Tests ---');
assert(PUNE_METRO_STATIONS.length >= 28, `All Phase 1 Metro Stations loaded (Total: ${PUNE_METRO_STATIONS.length})`);

const civilCourt = PUNE_METRO_STATIONS.find((s) => s.id === 'civil-court');
assert(!!civilCourt, 'Civil Court interchange station exists in station directory');
assert(civilCourt.line === 'both', 'Civil Court has line: "both"', `got ${civilCourt?.line}`);
assert(civilCourt.isInterchange === true, 'Civil Court is flagged as isInterchange: true');

const purpleStations = PUNE_METRO_STATIONS.filter((s) => s.line === 'purple' || s.line === 'both');
const aquaStations = PUNE_METRO_STATIONS.filter((s) => s.line === 'aqua' || s.line === 'both');
assert(purpleStations.length >= 14, `Purple Line has >= 14 stations (found: ${purpleStations.length})`);
assert(aquaStations.length >= 15, `Aqua Line has >= 15 stations (found: ${aquaStations.length})`);

// 3. ROUTE DIRECT VS INTERCHANGE LOGIC
console.log('\n--- 4. Direct Line vs Interchange Routing Tests ---');

// Test A: Direct Purple Line journey (Swargate to Shivajinagar)
const routeDirectPurple = getPublicTransitRoute(18.5018, 73.8576, {
  id: 'shivajinagar-station',
  slug: 'shivajinagar-station',
  name: 'Shivajinagar',
  name_mr: 'शिवाजीनगर',
  latitude: 18.5322,
  longitude: 73.8518,
});
assert(
  routeDirectPurple.stepByStepEn.some((s) => s.includes('direct without transfers')),
  'Direct Purple line route flags no transfer needed',
  JSON.stringify(routeDirectPurple.stepByStepEn)
);

// Test B: Direct Aqua Line journey (Deccan Gymkhana to Pune Railway Station)
const routeDirectAqua = getPublicTransitRoute(18.5175, 73.8423, {
  id: 'pune-railway-station-metro',
  slug: 'pune-railway-station-metro',
  name: 'Pune Railway Station',
  name_mr: 'पुणे रेल्वे स्टेशन',
  latitude: 18.5284,
  longitude: 73.8739,
});
assert(
  routeDirectAqua.stepByStepEn.some((s) => s.includes('direct without transfers')),
  'Direct Aqua line route flags no transfer needed',
  JSON.stringify(routeDirectAqua.stepByStepEn)
);

// Test C: Interchange journey across lines (PCMC on Line 1 to Deccan Gymkhana on Line 2)
const routeInterchange = getPublicTransitRoute(18.6279, 73.8009, {
  id: 'deccan-gymkhana',
  slug: 'deccan-gymkhana',
  name: 'Deccan Gymkhana',
  name_mr: 'डेक्कन जिमखाना',
  latitude: 18.5175,
  longitude: 73.8423,
});
assert(
  routeInterchange.stepByStepEn.some((s) => s.includes('Civil Court Interchange')),
  'Line 1 to Line 2 route directs through Civil Court Interchange concourse',
  JSON.stringify(routeInterchange.stepByStepEn)
);
assert(
  routeInterchange.stepByStepMr.some((s) => s.includes('सिव्हिल कोर्ट')),
  'Marathi step-by-step contains Civil Court interchange guidance'
);

// Test D: Starting from Civil Court itself
const routeFromCivilCourt = getPublicTransitRoute(18.5283, 73.8571, {
  id: 'ramwadi',
  slug: 'ramwadi',
  name: 'Ramwadi',
  name_mr: 'रामवाडी',
  latitude: 18.5521,
  longitude: 73.9184,
});
assert(
  routeFromCivilCourt.stepByStepEn.some((s) => s.includes('direct without transfers')),
  'Originating from Civil Court goes direct without false interchange prompt'
);

// 4. LANDMARK TRANSIT TESTS
console.log('\n--- 5. Landmark Public Transit Integration Tests ---');

const landmarkTestCases = [
  {
    slug: 'sinhagad-fort',
    name: 'Sinhagad Fort',
    name_mr: 'सिंहगड किल्ला',
    lat: 18.3663,
    lng: 73.7558,
    expectedBus: '50',
    expectedOrigin: 'Swargate',
  },
  {
    slug: 'shaniwar-wada',
    name: 'Shaniwar Wada',
    name_mr: 'शनिवार वाडा',
    lat: 18.5196,
    lng: 73.8553,
    expectedMetro: 'Budhwar Peth',
  },
  {
    slug: 'shreemant-dagdusheth-halwai-ganpati',
    name: 'Dagdusheth Ganpati',
    name_mr: 'श्रीमंत दगडूशेठ हलवाई गणपती',
    lat: 18.5165,
    lng: 73.8561,
    expectedMetro: 'Budhwar Peth',
  },
  {
    slug: 'aga-khan-palace',
    name: 'Aga Khan Palace',
    name_mr: 'आगा खान पॅलेस',
    lat: 18.5524,
    lng: 73.9015,
    expectedMetro: 'Kalyani Nagar',
  },
  {
    slug: 'raja-dinkar-kelkar-museum',
    name: 'Raja Dinkar Kelkar Museum',
    name_mr: 'राजा दिनकर केळकर वस्तुसंग्रहालय',
    lat: 18.5113,
    lng: 73.8543,
    expectedBus: 'Shanipar',
  },
  {
    slug: 'tulshibaug-temple',
    name: 'Tulshibaug Ram Mandir',
    name_mr: 'तुळशीबाग राम मंदिर',
    lat: 18.5147,
    lng: 73.8552,
    expectedMetro: 'Mandai',
  },
  {
    slug: 'rajiv-gandhi-zoological-park',
    name: 'Katraj Zoo',
    name_mr: 'कात्रज प्राणीसंग्रहालय',
    lat: 18.4556,
    lng: 73.8583,
    expectedBus: '24',
  },
  {
    slug: 'sambhaji-park',
    name: 'Chhatrapati Sambhaji Udyan',
    name_mr: 'छत्रपती संभाजी महाराज उद्यान',
    lat: 18.5212,
    lng: 73.8471,
    expectedMetro: 'Chhatrapati Sambhaji Udyan',
  },
];

for (const lm of landmarkTestCases) {
  // Origin from Pune central hub (18.5204, 73.8567)
  const transit = getPublicTransitRoute(18.5204, 73.8567, {
    id: lm.slug,
    slug: lm.slug,
    name: lm.name,
    name_mr: lm.name_mr,
    latitude: lm.lat,
    longitude: lm.lng,
  });

  assert(transit.hasTransit === true, `Transit resolved for ${lm.name}`);
  assert(transit.estimatedCostInr > 0, `Cost calculated for ${lm.name}: ₹${transit.estimatedCostInr}`);
  assert(transit.stepByStepEn.length >= 2, `Step by step directions provided for ${lm.name} (Steps: ${transit.stepByStepEn.length})`);
  assert(transit.bookingOptions.metroWhatsApp.includes('9420101990'), `Official WhatsApp Metro bot link present for ${lm.name}`);
  assert(transit.ticketInfoEn.includes('₹50'), `PMPML ₹50 Day Pass recommendation present for ${lm.name}`);
}

console.log('\n========================================================');
if (failedTests === 0) {
  console.log('🎉 ALL PUNE METRO & PMPML FARE AND ROUTE TESTS PASSED!');
} else {
  console.error(`⚠️ ${failedTests} TEST(S) FAILED. PLEASE REVIEW LOGS ABOVE.`);
}
console.log('========================================================');

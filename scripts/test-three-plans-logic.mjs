import { buildItinerary } from '../lib/planner.ts';

const mockPlaces = [
  { id: 'shaniwar-wada', name: 'Shaniwar Wada', name_mr: 'शनिवार वाडा', slug: 'shaniwar-wada', category_slug: 'heritage', score: 100, visitDurationMinutes: 45, entryCost: 25, isHoursVerified: true, tier: 'verified', lat: 18.5195, lng: 73.8553 },
  { id: 'lal-mahal', name: 'Lal Mahal', name_mr: 'लाल महाल', slug: 'lal-mahal', category_slug: 'heritage', score: 85, visitDurationMinutes: 30, entryCost: 0, isHoursVerified: true, tier: 'verified', lat: 18.5205, lng: 73.8562 },
  { id: 'raja-kelkar', name: 'Raja Dinkar Kelkar Museum', name_mr: 'राजा केळकर संग्रहालय', slug: 'raja-dinkar-kelkar-museum', category_slug: 'museums', score: 90, visitDurationMinutes: 60, entryCost: 100, isHoursVerified: true, tier: 'verified', lat: 18.5113, lng: 73.8543 },
  { id: 'parvati-hill', name: 'Parvati Hill', name_mr: 'पार्वती टेकडी', slug: 'parvati-hill', category_slug: 'nature', score: 92, visitDurationMinutes: 60, entryCost: 0, isHoursVerified: true, tier: 'verified', lat: 18.4988, lng: 73.8475 },
  { id: 'sarasbaug', name: 'Saras Baug', name_mr: 'सारसबाग', slug: 'sarasbaug', category_slug: 'parks', score: 88, visitDurationMinutes: 45, entryCost: 0, isHoursVerified: true, tier: 'verified', lat: 18.5015, lng: 73.8528 },
  { id: 'okayama-garden', name: 'Okayama Friendship Garden', name_mr: 'पु. ल. देशपांडे उद्यान', slug: 'okayama-friendship-garden', category_slug: 'parks', score: 87, visitDurationMinutes: 50, entryCost: 20, isHoursVerified: true, tier: 'verified', lat: 18.4925, lng: 73.8345 },
  { id: 'dagdusheth', name: 'Dagdusheth Halwai Ganpati', name_mr: 'दगडूशेठ गणपती', slug: 'shreemant-dagdusheth-halwai-ganpati', category_slug: 'temples', score: 98, visitDurationMinutes: 35, entryCost: 0, isHoursVerified: true, tier: 'verified', lat: 18.5165, lng: 73.8561 },
  { id: 'pataleshwar', name: 'Pataleshwar Cave Temple', name_mr: 'पाताळेश्वर लेणी', slug: 'pataleshwar-cave-temple', category_slug: 'temples', score: 89, visitDurationMinutes: 40, entryCost: 0, isHoursVerified: true, tier: 'verified', lat: 18.5283, lng: 73.8504 },
  { id: 'sambhaji-park', name: 'Chhatrapati Sambhaji Udyan', name_mr: 'संभाजी महाराज उद्यान', slug: 'sambhaji-park', category_slug: 'parks', score: 82, visitDurationMinutes: 40, entryCost: 10, isHoursVerified: true, tier: 'verified', lat: 18.5212, lng: 73.8471 },
  { id: 'aga-khan', name: 'Aga Khan Palace', name_mr: 'आगा खान पॅलेस', slug: 'aga-khan-palace', category_slug: 'heritage', score: 94, visitDurationMinutes: 60, entryCost: 25, isHoursVerified: true, tier: 'verified', lat: 18.5524, lng: 73.9015 },
];

const constantTravel = () => ({ durationMinutes: 12, isEstimate: true });

const baseInput = {
  startMinuteOfDay: 570,
  availableMinutes: 240, // 4 hours
  mode: 'public_transit',
  returnToStart: false,
  includeUnverified: true,
};

// Plan 1: Classic Heritage & Main City Highlights
const plan1 = buildItinerary(baseInput, [...mockPlaces], constantTravel);

// Plan 2: Nature, Parks & Scenic Views (boost nature & parks, exclude plan 1 top stop)
const naturePlaces = mockPlaces
  .filter((p) => p.id !== plan1.stops[0]?.placeId)
  .map((p) => ({
    ...p,
    score: p.score + (['nature', 'parks'].includes(p.category_slug) ? 50 : -25),
  }));
const plan2 = buildItinerary(baseInput, naturePlaces, constantTravel);

// Plan 3: Spiritual & Cultural Sanctuaries (boost temples & museums, exclude top stops of plan 1 & 2)
const spiritualPlaces = mockPlaces
  .filter((p) => p.id !== plan1.stops[0]?.placeId && p.id !== plan2.stops[0]?.placeId)
  .map((p) => ({
    ...p,
    score: p.score + (['temples', 'museums'].includes(p.category_slug) ? 50 : -25),
  }));
const plan3 = buildItinerary(baseInput, spiritualPlaces, constantTravel);

console.log('PLAN 1 STOPS:', plan1.stops.map((s) => s.placeName).join(' -> '));
console.log('PLAN 2 STOPS:', plan2.stops.map((s) => s.placeName).join(' -> '));
console.log('PLAN 3 STOPS:', plan3.stops.map((s) => s.placeName).join(' -> '));

const p1 = plan1.stops.map((s) => s.placeId).join(',');
const p2 = plan2.stops.map((s) => s.placeId).join(',');
const p3 = plan3.stops.map((s) => s.placeId).join(',');

console.log('\nVerification:');
console.log('Plan 1 != Plan 2:', p1 !== p2);
console.log('Plan 2 != Plan 3:', p2 !== p3);
console.log('Plan 1 != Plan 3:', p1 !== p3);

import { db } from '../lib/firebase.ts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { buildItinerary } from '../lib/planner.ts';
import { getPublicTransitRoute } from '../lib/publicTransit.ts';

const SPEED_KMH = {
  walking: 4.5,
  cycling: 12,
  driving: 20,
  public_transit: 18,
};
const DETOUR = 1.3;

function km(a, b) {
  const r = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(r(b.lat - a.lat) / 2) ** 2 +
    Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

function formatMinutesToTime(totalMin) {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

async function run() {
  const snap = await getDocs(query(collection(db, 'places'), where('status', '==', 'published')));
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  console.log('Total published places loaded:', data.length);

  const startCoord = { lat: 18.5195, lng: 73.8553 }; // Shaniwar Wada
  const coords = new Map([['START', startCoord]]);

  const allCandidates = data.map((p) => {
    coords.set(p.id, { lat: p.latitude, lng: p.longitude });
    const price = p.place_prices?.[0];
    const verified = p.data_tier === 'verified';
    const cat = Array.isArray(p.place_categories) ? p.place_categories[0]?.slug : p.place_categories?.slug || p.category_slug;
    return {
      id: p.id,
      name: p.name,
      name_mr: p.name_mr,
      slug: p.slug,
      category_slug: cat,
      score: (p.popularity_score || 50) + (verified ? 20 : 0),
      visitDurationMinutes: p.recommended_duration_minutes || 45,
      entryCost: price ? (price.is_free ? 0 : Number(price.amount)) : null,
      isHoursVerified: verified,
      tier: p.data_tier,
      latitude: p.latitude,
      longitude: p.longitude,
    };
  });

  const getTravel = (from, to) => {
    const a = coords.get(from);
    const b = coords.get(to);
    if (!a || !b) return null;
    const minutes = Math.ceil(((km(a, b) * DETOUR) / SPEED_KMH.public_transit) * 60);
    return { durationMinutes: minutes, isEstimate: true };
  };

  const baseInput = {
    startMinuteOfDay: 570, // 09:30 AM
    availableMinutes: 300, // 5 hours
    mode: 'public_transit',
    returnToStart: false,
    includeUnverified: true,
  };

  // Plan 1: Balanced Highlights & Classic Heritage
  const plan1 = buildItinerary(baseInput, [...allCandidates], getTravel);

  // Plan 2: Nature, Forts & Scenic Outdoor Views
  const natureCandidates = allCandidates.map((c) => {
    const isNatureOrFort = ['nature', 'forts', 'parks'].includes(c.category_slug || '');
    return { ...c, score: c.score + (isNatureOrFort ? 60 : -30) };
  });
  // Exclude Plan 1's top stop to force diversification
  const topStopId1 = plan1.stops[0]?.placeId;
  const filteredCandidates2 = natureCandidates.filter((c) => c.id !== topStopId1);
  const plan2 = buildItinerary(baseInput, filteredCandidates2, getTravel);

  // Plan 3: Spiritual Sanctuaries, Art & Cultural Walking
  const cultureCandidates = allCandidates.map((c) => {
    const isSpiritualOrMuseum = ['temples', 'museums', 'heritage'].includes(c.category_slug || '');
    return { ...c, score: c.score + (isSpiritualOrMuseum ? 50 : -20) };
  });
  // Exclude top stops from plan 1 and 2 if possible to ensure distinctiveness
  const topStopId2 = plan2.stops[0]?.placeId;
  const filteredCandidates3 = cultureCandidates.filter((c) => c.id !== topStopId1 && c.id !== topStopId2);
  const plan3 = buildItinerary(baseInput, filteredCandidates3, getTravel);

  console.log('\n--- PLAN 1: Classic Heritage ---');
  console.log('Stops:', plan1.stops.map((s) => s.placeName).join(' -> '));
  console.log('Total mins:', plan1.totalDurationMinutes, 'Cost: ₹', plan1.knownCost);

  console.log('\n--- PLAN 2: Scenic Nature ---');
  console.log('Stops:', plan2.stops.map((s) => s.placeName).join(' -> '));
  console.log('Total mins:', plan2.totalDurationMinutes, 'Cost: ₹', plan2.knownCost);

  console.log('\n--- PLAN 3: Spiritual & Culture ---');
  console.log('Stops:', plan3.stops.map((s) => s.placeName).join(' -> '));
  console.log('Total mins:', plan3.totalDurationMinutes, 'Cost: ₹', plan3.knownCost);

  // Check distinctiveness
  const set1 = new Set(plan1.stops.map((s) => s.placeId));
  const set2 = new Set(plan2.stops.map((s) => s.placeId));
  const set3 = new Set(plan3.stops.map((s) => s.placeId));

  const p1Names = plan1.stops.map((s) => s.placeName).join(',');
  const p2Names = plan2.stops.map((s) => s.placeName).join(',');
  const p3Names = plan3.stops.map((s) => s.placeName).join(',');

  console.log('\nAre all 3 plans distinct from each other?');
  console.log('Plan 1 != Plan 2:', p1Names !== p2Names);
  console.log('Plan 2 != Plan 3:', p2Names !== p3Names);
  console.log('Plan 1 != Plan 3:', p1Names !== p3Names);
}

run().catch(console.error);

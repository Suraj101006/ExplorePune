async function testLiveApi() {
  const res = await fetch('http://localhost:3000/api/v1/itineraries/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start: { lat: 18.5195, lng: 73.8553 },
      availableMinutes: 300,
      mode: 'public_transit',
    }),
  });

  const json = await res.json();
  console.log('Response Status:', res.status);
  console.log('Plans array exists:', Array.isArray(json.data?.plans));
  console.log('Number of plans returned:', json.data?.plans?.length);

  if (json.data?.plans) {
    json.data.plans.forEach((p, idx) => {
      console.log(`\n================== PLAN ${idx + 1} ==================`);
      console.log('Badge & Title:', p.badge, p.titleEn);
      console.log('Theme:', p.themeEn);
      console.log('Duration:', p.totalDurationMinutes, 'min | Buffer:', p.bufferMinutes, 'min | Cost: ₹' + p.knownCost);
      console.log('Stops count:', p.stops?.length);
      p.stops.forEach((s, sIdx) => {
        console.log(`  Stop ${sIdx + 1}: ${s.placeName} (${s.arrivalTime} - ${s.departureTime})`);
        console.log(`     🚇 Transit: ${s.transitDetails?.summaryEn || 'Direct'}`);
      });
    });

    // Check distinctiveness
    const p1 = json.data.plans[0]?.stops.map((s) => s.placeName).join(', ');
    const p2 = json.data.plans[1]?.stops.map((s) => s.placeName).join(', ');
    const p3 = json.data.plans[2]?.stops.map((s) => s.placeName).join(', ');

    console.log('\n--- DISTINCTIVENESS CHECK ---');
    console.log('Plan 1 != Plan 2:', p1 !== p2);
    console.log('Plan 2 != Plan 3:', p2 !== p3);
    console.log('Plan 1 != Plan 3:', p1 !== p3);
  }
}

testLiveApi().catch(console.error);

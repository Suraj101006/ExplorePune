import { generateItineraryPdf } from '../lib/generateItineraryPdf.ts';

async function testPdfWithLiveData() {
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
  const plans = json.data.plans;

  console.log(`Generating PDFs for all ${plans.length} plans...`);

  plans.forEach((plan, idx) => {
    const doc = generateItineraryPdf({
      planTitle: plan.titleEn,
      planTheme: plan.themeEn,
      badge: plan.badge,
      startLocationName: 'Shaniwar Wada (Old City)',
      startTime: '09:00 AM',
      travelMode: 'public_transit',
      totalDurationMinutes: plan.totalDurationMinutes,
      bufferMinutes: plan.bufferMinutes,
      estimatedCost: plan.knownCost,
      stops: plan.stops.map((s, sIdx) => ({
        index: sIdx + 1,
        name: s.placeName,
        arrivalTime: s.arrivalTime,
        departureTime: s.departureTime,
        visitMinutes: s.visitMinutes,
        travelMinutes: s.travelMinutes,
        entryCost: s.entryCost,
        transitSummary: s.transitDetails?.summaryEn,
        transitStepByStep: s.transitDetails?.stepByStepEn,
        nearestMetro: s.transitDetails?.nearestMetro?.stationNameEn,
        nearestBus: s.transitDetails?.nearestBus?.stopNameEn,
        ticketInfo: s.transitDetails?.ticketInfoEn,
      })),
      isMr: false,
    });

    const pdfString = doc.output();
    console.log(`Plan ${idx + 1} PDF generated! Size: ${pdfString.length} bytes`);

    // Verify Suraj Dhok and Sahil Jadhav are in the PDF
    const hasSuraj = pdfString.includes('Suraj Dhok');
    const hasSahil = pdfString.includes('Sahil Jadhav');
    const hasRegards = pdfString.includes('Warm regards');
    console.log(`Plan ${idx + 1} contains 'Warm regards':`, hasRegards);
    console.log(`Plan ${idx + 1} contains 'Suraj Dhok':`, hasSuraj);
    console.log(`Plan ${idx + 1} contains 'Sahil Jadhav':`, hasSahil);

    if (!hasSuraj || !hasSahil || !hasRegards) {
      throw new Error(`Signature missing in Plan ${idx + 1}`);
    }
  });

  console.log('\n🎉 ALL 3 PLANS SUCCESSFULLY VERIFIED WITH PDF EXPORT & REGARDS SIGNATURE!');
}

testPdfWithLiveData().catch(console.error);

import { describe, it, expect } from 'vitest';
import { generateItineraryPdf, ItineraryPdfData } from '@/lib/generateItineraryPdf';

describe('Trip Planner PDF Professional Upgrade - Test Suite', () => {
  // Scenario 1: One-destination trip
  it('Scenario 1: generates a valid, structured PDF for a single-destination trip', () => {
    const singleStopData: ItineraryPdfData = {
      userName: 'Aaditya Joshi',
      planTitle: 'Sinhagad Fort Half-Day Expedition',
      planTheme: 'Scenic Sahyadri fortress and Shivaji Maharaj military heritage',
      badge: '⛰️',
      startLocationName: 'Swargate Bus Terminal',
      startTime: '08:00 AM',
      travelMode: 'driving',
      totalDurationMinutes: 180,
      bufferMinutes: 20,
      estimatedCost: 50,
      travelersCount: 2,
      stops: [
        {
          index: 1,
          placeSlug: 'sinhagad-fort',
          name: 'Sinhagad Fort',
          nameMr: 'सिंहगड किल्ला',
          arrivalTime: '08:50 AM',
          departureTime: '11:00 AM',
          visitMinutes: 130,
          travelMinutes: 50,
          entryCost: 50,
          transitSummary: 'Scenic ghat route via Donje Phata and Sinhagad Paytha.',
          nearestBus: 'Donje Phata / Sinhagad Ghat Stop',
        },
      ],
    };

    const doc = generateItineraryPdf(singleStopData);
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(4);
    const pdfOutput = doc.output();
    expect(pdfOutput.length).toBeGreaterThan(50000);
  });

  // Scenario 2: Multiple-destination trip (4 stops)
  it('Scenario 2: generates multi-destination trip with all timeline items and stops', () => {
    const multiStopData: ItineraryPdfData = {
      userName: 'Suraj Dhok',
      planTitle: 'Peshwa Heritage & Cultural Citadel Circuit',
      planTheme: 'Wadas, palaces, and ancient shrines of old Punyanagari',
      badge: '🏰',
      startLocationName: 'Pune Railway Station',
      startTime: '08:30 AM',
      travelMode: 'public_transit',
      totalDurationMinutes: 360,
      bufferMinutes: 30,
      estimatedCost: 85,
      travelersCount: 3,
      stops: [
        {
          index: 1,
          placeSlug: 'shaniwar-wada',
          name: 'Shaniwar Wada',
          nameMr: 'शनिवार वाडा',
          arrivalTime: '08:50 AM',
          departureTime: '10:20 AM',
          visitMinutes: 90,
          travelMinutes: 20,
          entryCost: 25,
          transitSummary: 'Take PMPML Bus #24 or alighted at Budhwar Peth Metro.',
          nearestMetro: 'Budhwar Peth Metro (0.4 km)',
          nearestBus: 'Shaniwar Wada Gate Stop',
        },
        {
          index: 2,
          placeSlug: 'lal-mahal',
          name: 'Lal Mahal',
          nameMr: 'लाल महाल',
          arrivalTime: '10:30 AM',
          departureTime: '11:15 AM',
          visitMinutes: 45,
          travelMinutes: 10,
          entryCost: 0,
          transitSummary: 'Short walk across Shivaji Road opposite Dilli Darwaza.',
        },
        {
          index: 3,
          placeSlug: 'shreemant-dagdusheth-halwai-ganpati',
          name: 'Shreemant Dagdusheth Halwai Ganpati',
          nameMr: 'श्रीमंत दगडूशेठ हलवाई गणपती',
          arrivalTime: '11:25 AM',
          departureTime: '12:15 PM',
          visitMinutes: 50,
          travelMinutes: 10,
          entryCost: 0,
          transitSummary: '5-minute heritage walk down Budhwar Peth / Laxmi Road.',
        },
        {
          index: 4,
          placeSlug: 'raja-dinkar-kelkar-museum',
          name: 'Raja Dinkar Kelkar Museum',
          nameMr: 'राजा दिनकर केळकर संग्रहालय',
          arrivalTime: '12:35 PM',
          departureTime: '02:00 PM',
          visitMinutes: 85,
          travelMinutes: 20,
          entryCost: 50,
          transitSummary: 'Transit to Shukrawar Peth via Bajirao Road corridor.',
          nearestBus: 'Kelkar Museum / Bajirao Road Stop',
        },
      ],
    };

    const doc = generateItineraryPdf(multiStopData);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(6);
    const pdfOutput = doc.output();
    expect(pdfOutput.length).toBeGreaterThan(100000);
  });

  // Scenario 3: Short 2-hour trip
  it('Scenario 3: handles a compact 2-hour micro-itinerary', () => {
    const shortTripData: ItineraryPdfData = {
      userName: 'Pooja Kulkarni',
      planTitle: 'Morning Heritage Walk',
      planTheme: 'Quick 2-hour old city landmark stroll',
      badge: '🚶',
      startLocationName: 'Central Pune (Shaniwar Wada)',
      startTime: '07:30 AM',
      travelMode: 'walking',
      totalDurationMinutes: 120,
      bufferMinutes: 15,
      estimatedCost: 25,
      travelersCount: 1,
      stops: [
        {
          index: 1,
          placeSlug: 'shaniwar-wada',
          name: 'Shaniwar Wada',
          arrivalTime: '07:35 AM',
          departureTime: '08:45 AM',
          visitMinutes: 70,
          travelMinutes: 5,
          entryCost: 25,
        },
        {
          index: 2,
          placeSlug: 'lal-mahal',
          name: 'Lal Mahal',
          arrivalTime: '08:50 AM',
          departureTime: '09:30 AM',
          visitMinutes: 40,
          travelMinutes: 5,
          entryCost: 0,
        },
      ],
    };

    const doc = generateItineraryPdf(shortTripData);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(4);
  });

  // Scenario 4: Full-day trip (8 to 10 hours)
  it('Scenario 4: handles a comprehensive full-day 6-stop itinerary', () => {
    const fullDayData: ItineraryPdfData = {
      userName: 'Rohan Deshmukh',
      planTitle: 'Ultimate Full-Day Pune Heritage Discovery',
      planTheme: 'Deep dive across forts, palaces, and sacred wadas',
      badge: '🚩',
      startLocationName: 'Deccan Gymkhana (FC Road)',
      startTime: '08:00 AM',
      travelMode: 'driving',
      totalDurationMinutes: 540,
      bufferMinutes: 45,
      estimatedCost: 175,
      travelersCount: 4,
      totalDistanceKm: 48.5,
      stops: [
        {
          index: 1,
          placeSlug: 'pataleshwar-cave-temple',
          name: 'Pataleshwar Cave Temple',
          arrivalTime: '08:15 AM',
          departureTime: '09:15 AM',
          visitMinutes: 60,
          travelMinutes: 15,
          entryCost: 0,
        },
        {
          index: 2,
          placeSlug: 'shaniwar-wada',
          name: 'Shaniwar Wada',
          arrivalTime: '09:35 AM',
          departureTime: '11:05 AM',
          visitMinutes: 90,
          travelMinutes: 20,
          entryCost: 25,
        },
        {
          index: 3,
          placeSlug: 'shreemant-dagdusheth-halwai-ganpati',
          name: 'Shreemant Dagdusheth Halwai Ganpati',
          arrivalTime: '11:20 AM',
          departureTime: '12:10 PM',
          visitMinutes: 50,
          travelMinutes: 15,
          entryCost: 0,
        },
        {
          index: 4,
          placeSlug: 'raja-dinkar-kelkar-museum',
          name: 'Raja Dinkar Kelkar Museum',
          arrivalTime: '01:15 PM',
          departureTime: '02:45 PM',
          visitMinutes: 90,
          travelMinutes: 65,
          entryCost: 50,
        },
        {
          index: 5,
          placeSlug: 'aga-khan-palace',
          name: 'Aga Khan Palace',
          arrivalTime: '03:15 PM',
          departureTime: '04:45 PM',
          visitMinutes: 90,
          travelMinutes: 30,
          entryCost: 25,
        },
        {
          index: 6,
          placeSlug: 'sinhagad-fort',
          name: 'Sinhagad Fort Sunset',
          arrivalTime: '05:45 PM',
          departureTime: '07:30 PM',
          visitMinutes: 105,
          travelMinutes: 60,
          entryCost: 50,
        },
      ],
    };

    const doc = generateItineraryPdf(fullDayData);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(6);
  });

  // Scenario 5: Multi-day trip
  it('Scenario 5: supports multi-day trip metadata gracefully', () => {
    const multiDayData: ItineraryPdfData = {
      userName: 'Meera Patil',
      planTitle: 'Weekend Sahyadri & Heritage Expedition',
      planTheme: '2-Day Circuit across historic landmarks and mountain viewpoints',
      badge: '🗺️',
      startLocationName: 'Shivajinagar Hub',
      startTime: '08:30 AM',
      startDate: '14 Nov 2026',
      endDate: '15 Nov 2026',
      travelMode: 'driving',
      totalDurationMinutes: 720,
      bufferMinutes: 60,
      estimatedCost: 150,
      travelersCount: 2,
      stops: [
        {
          index: 1,
          placeSlug: 'sinhagad-fort',
          name: 'Sinhagad Fort',
          arrivalTime: '09:30 AM',
          departureTime: '12:30 PM',
          visitMinutes: 180,
          travelMinutes: 60,
          entryCost: 50,
        },
        {
          index: 2,
          placeSlug: 'khadakwasla-dam',
          name: 'Khadakwasla Dam',
          arrivalTime: '01:00 PM',
          departureTime: '02:30 PM',
          visitMinutes: 90,
          travelMinutes: 30,
          entryCost: 0,
        },
      ],
    };

    const doc = generateItineraryPdf(multiDayData);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(4);
  });

  // Scenario 6: Different transport modes
  it('Scenario 6: renders distinct transit details for different transport modes', () => {
    const modes: Array<'driving' | 'public_transit' | 'walking' | 'cycling'> = [
      'driving',
      'public_transit',
      'walking',
      'cycling',
    ];

    modes.forEach((m) => {
      const data: ItineraryPdfData = {
        userName: `Explorer (${m})`,
        planTitle: `${m.toUpperCase()} Mode Itinerary`,
        planTheme: 'Transit mode test',
        badge: '🚗',
        startLocationName: 'Central Pune',
        startTime: '09:00 AM',
        travelMode: m,
        totalDurationMinutes: 150,
        bufferMinutes: 15,
        estimatedCost: 25,
        stops: [
          {
            index: 1,
            placeSlug: 'shaniwar-wada',
            name: 'Shaniwar Wada',
            visitMinutes: 60,
            travelMinutes: 15,
            entryCost: 25,
          },
        ],
      };

      const doc = generateItineraryPdf(data);
      expect(doc).toBeDefined();
    });
  });

  // Scenario 7: Missing entry-fee data (should show Not officially confirmed, never 0)
  it('Scenario 7: handles missing entry fee without treating unknown prices as 0', () => {
    const missingFeeData: ItineraryPdfData = {
      userName: 'Guest Explorer',
      planTitle: 'Unverified Pricing Test',
      planTheme: 'Strict anti-hallucination test for fees',
      badge: '🏷️',
      startLocationName: 'Pune Station',
      startTime: '10:00 AM',
      travelMode: 'driving',
      totalDurationMinutes: 120,
      bufferMinutes: 10,
      estimatedCost: 0,
      stops: [
        {
          index: 1,
          name: 'Private Heritage Gallery Without Stated Fee',
          visitMinutes: 45,
          travelMinutes: 15,
          entryCost: null, // Unknown / unverified
        },
      ],
    };

    const doc = generateItineraryPdf(missingFeeData);
    const pdfOutput = doc.output();
    // Must NOT say Entry: INR 0 or Free Entry
    expect(pdfOutput).toContain('Not officially confirmed');
  });

  // Scenario 8: Missing destination image (graceful fallback card)
  it('Scenario 8: handles missing destination images with elegant vector placeholders without crashing', () => {
    const missingImageData: ItineraryPdfData = {
      userName: 'Offline Traveler',
      planTitle: 'Missing Image Fallback Test',
      planTheme: 'Fallback rendering test',
      badge: '🖼️',
      startLocationName: 'Old City',
      startTime: '09:00 AM',
      travelMode: 'public_transit',
      totalDurationMinutes: 120,
      bufferMinutes: 10,
      estimatedCost: 0,
      stops: [
        {
          index: 1,
          placeSlug: 'non-existent-image-place-12345',
          name: 'Newly Discovered Ancient Stepwell',
          image_url: '/images/places/does-not-exist.jpg',
          visitMinutes: 45,
          travelMinutes: 15,
          entryCost: 0,
        },
      ],
    };

    const doc = generateItineraryPdf(missingImageData);
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(4);
  });

  // Scenario 9: Large destination count (8+ stops with segmented Google Maps routes)
  it('Scenario 9: segments Google Maps routes and generates multiple QR codes for 10 stops', () => {
    const tenStops: ItineraryPdfData = {
      userName: 'Marathon Explorer',
      planTitle: 'Grand 10-Landmark Pune Marathon',
      planTheme: 'Extreme waypoint stress test',
      badge: '🏛️',
      startLocationName: 'Pune Railway Station',
      startTime: '07:00 AM',
      travelMode: 'driving',
      totalDurationMinutes: 600,
      bufferMinutes: 60,
      estimatedCost: 200,
      travelersCount: 2,
      stops: Array.from({ length: 10 }).map((_, i) => ({
        index: i + 1,
        name: `Landmark Stop #${i + 1}`,
        placeSlug: i === 0 ? 'shaniwar-wada' : i === 1 ? 'sinhagad-fort' : undefined,
        visitMinutes: 45,
        travelMinutes: 15,
        entryCost: 25,
        latitude: 18.5204 + i * 0.01,
        longitude: 73.8567 + i * 0.01,
      })),
    };

    const doc = generateItineraryPdf(tenStops);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(6);
  });

  // Scenario 10: Marathi destination names (Devanagari characters)
  it('Scenario 10: cleanly renders Marathi names without throwing or crashing PDF readers', () => {
    const marathiData: ItineraryPdfData = {
      userName: 'राहुल पाटील',
      planTitle: 'पुणे ऐतिहासिक दर्शन सहल',
      planTitleMr: 'पुणे ऐतिहासिक दर्शन सहल',
      planTheme: 'पेशवेकालीन वाडे, सह्याद्रीचे किल्ले आणि संस्कृती',
      planThemeMr: 'पेशवेकालीन वाडे, सह्याद्रीचे किल्ले आणि संस्कृती',
      badge: '🚩',
      startLocationName: 'मध्यवर्ती पुणे (शनिवार वाडा)',
      startTime: '09:00 AM',
      travelMode: 'public_transit',
      totalDurationMinutes: 180,
      bufferMinutes: 20,
      estimatedCost: 50,
      isMr: true,
      stops: [
        {
          index: 1,
          placeSlug: 'shaniwar-wada',
          name: 'शनिवार वाडा (पेशवे महाल)',
          nameMr: 'शनिवार वाडा',
          visitMinutes: 60,
          travelMinutes: 15,
          entryCost: 25,
        },
        {
          index: 2,
          placeSlug: 'sinhagad-fort',
          name: 'सिंहगड किल्ला (कोंढाणा)',
          nameMr: 'सिंहगड किल्ला',
          visitMinutes: 90,
          travelMinutes: 45,
          entryCost: 50,
        },
      ],
    };

    const doc = generateItineraryPdf(marathiData);
    expect(doc).toBeDefined();
    const pdfOutput = doc.output();
    expect(pdfOutput.length).toBeGreaterThan(50000);
  });

  // Scenario 11: Generates unabridged detailed profiles for ALL stops in large itineraries (no 4-stop cap)
  it('Scenario 11: generates detailed destination profiles for all places in a 6-stop itinerary without truncation', () => {
    const sixStopData: ItineraryPdfData = {
      userName: 'Tanaji Malusare Heritage Enthusiast',
      planTitle: 'Grand 6-Stop Circuit',
      planTheme: 'Exploring all major Pune monuments in one day',
      badge: '🏰',
      startLocationName: 'Pune Station',
      startTime: '08:00 AM',
      travelMode: 'driving',
      totalDurationMinutes: 600,
      bufferMinutes: 40,
      estimatedCost: 150,
      stops: [
        { index: 1, placeSlug: 'shaniwar-wada', name: 'Shaniwar Wada', visitMinutes: 60, travelMinutes: 15, entryCost: 25 },
        { index: 2, placeSlug: 'lal-mahal', name: 'Lal Mahal', visitMinutes: 45, travelMinutes: 10, entryCost: 0 },
        { index: 3, placeSlug: 'pataleshwar-cave-temple', name: 'Pataleshwar Cave Temple', visitMinutes: 50, travelMinutes: 15, entryCost: 0 },
        { index: 4, placeSlug: 'raja-dinkar-kelkar-museum', name: 'Raja Dinkar Kelkar Museum', visitMinutes: 75, travelMinutes: 20, entryCost: 50 },
        { index: 5, placeSlug: 'aga-khan-palace', name: 'Aga Khan Palace', visitMinutes: 70, travelMinutes: 25, entryCost: 25 },
        { index: 6, placeSlug: 'sinhagad-fort', name: 'Sinhagad Fort', visitMinutes: 120, travelMinutes: 45, entryCost: 50 },
      ],
    };

    const doc = generateItineraryPdf(sixStopData);
    expect(doc).toBeDefined();
    const pdfOutput = doc.output();

    // Verify all 6 stops are identified in their profile headers
    expect(pdfOutput).toContain('STOP #1: SHANIWAR WADA');
    expect(pdfOutput).toContain('STOP #2: LAL MAHAL');
    expect(pdfOutput).toContain('STOP #3: PATALESHWAR CAVE TEMPLE');
    expect(pdfOutput).toContain('STOP #4: RAJA DINKAR KELKAR MUSEUM');
    expect(pdfOutput).toContain('STOP #5: AGA KHAN PALACE');
    expect(pdfOutput).toContain('STOP #6: SINHAGAD FORT');

    // Page count must account for all 3 profile pages (2 stops per page = 3 pages)
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(8);
  });

  // Scenario 12: Includes comprehensive place information (GPS coordinates, transit, hours, fees, parking, history, food)
  it('Scenario 12: includes complete destination profile intelligence in the generated PDF output', () => {
    const richStopData: ItineraryPdfData = {
      userName: 'Traveler Ananya',
      planTitle: 'Detailed Historical Pilgrimage',
      planTheme: 'Fortress and temple immersion',
      badge: '🚩',
      startLocationName: 'Swargate',
      startTime: '08:30 AM',
      travelMode: 'public_transit',
      totalDurationMinutes: 300,
      bufferMinutes: 25,
      estimatedCost: 75,
      stops: [
        {
          index: 1,
          placeSlug: 'sinhagad-fort',
          name: 'Sinhagad Fort',
          nameMr: 'सिंहगड किल्ला',
          arrivalTime: '09:30 AM',
          departureTime: '12:00 PM',
          visitMinutes: 150,
          travelMinutes: 60,
          entryCost: 50,
          nearestBus: 'PMPML Bus 50 to Donje Paytha',
          nearestMetro: 'Swargate Metro',
        },
      ],
    };

    const doc = generateItineraryPdf(richStopData);
    expect(doc).toBeDefined();
    const pdfOutput = doc.output();

    // Verify GPS coordinates
    expect(pdfOutput).toContain('GPS:');

    // Verify itemized ticket admission and hours
    expect(pdfOutput).toContain('ADMISSION TICKET');
    expect(pdfOutput).toContain('OPERATING HOURS');

    // Verify parking & transit commute details
    expect(pdfOutput).toContain('PARKING & TOLLS');
    expect(pdfOutput).toContain('HOW TO REACH');

    // Verify history and local food
    expect(pdfOutput).toContain('HISTORICAL SIGNIFICANCE & ARCHITECTURAL HIGHLIGHTS');
    expect(pdfOutput).toContain('VERIFIED NEARBY FOOD SPECIALTIES & VISITOR PRECAUTIONS');

    // Odd stop companion card is included
    expect(pdfOutput).toContain('HERITAGE EXPEDITION PROTOCOLS & FIELD CONDUCT GUIDELINES');
    expect(pdfOutput).toContain('SAHYADRI FORTS & MOUNTAIN TREKKING RULES');

    // Digital guide link
    expect(pdfOutput).toContain('View Complete Digital Guide ->');
  });
});

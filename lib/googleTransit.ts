/**
 * Explore Pune - Google Maps Live Transit Service
 * Pulls and parses Pune Metro & PMPML Bus transit data from Google Maps Directions API.
 * Gracefully falls back to the comprehensive local Maha Metro & PMPML network model.
 */

import { getPublicTransitRoute, TransitRouteInfo, PUNE_COMMUTE_HUBS } from './publicTransit';

export interface GoogleTransitStep {
  travelMode: 'WALKING' | 'TRANSIT';
  instruction: string;
  distanceText: string;
  durationText: string;
  transitDetails?: {
    lineName: string;
    lineShortName: string;
    vehicleType: 'BUS' | 'SUBWAY' | 'TRAIN';
    agencyName: string; // e.g. "PMPML" or "Maha Metro"
    departureStop: string;
    arrivalStop: string;
    numStops: number;
    headsign?: string;
    lineColor?: string;
  };
}

export interface GoogleTransitResult {
  source: 'google_maps_api' | 'pune_transit_engine';
  hasTransit: boolean;
  transitType: TransitRouteInfo['transitType'];
  summaryEn: string;
  summaryMr: string;
  estimatedMinutes: number;
  estimatedCostInr: number;
  stepsEn: string[];
  stepsMr: string[];
  detailedSteps?: GoogleTransitStep[];
  googleMapsUrl: string;
  ticketInfoEn: string;
  ticketInfoMr: string;
  nearestMetro?: TransitRouteInfo['nearestMetro'];
  nearestBus?: TransitRouteInfo['nearestBus'];
  bookingOptions: TransitRouteInfo['bookingOptions'];
}

/**
 * Query Google Maps Directions API for live Pune Metro and PMPML bus routes.
 */
export async function getLiveGoogleTransitRoute({
  originLat,
  originLng,
  destLat,
  destLng,
  destPlace,
  originName,
  isMr = false,
}: {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  destPlace: {
    id: string;
    slug?: string;
    name: string;
    name_mr?: string;
    latitude: number;
    longitude: number;
  };
  originName?: string;
  isMr?: boolean;
}): Promise<GoogleTransitResult> {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_API_KEY;

  const defaultGmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat.toFixed(5)},${originLng.toFixed(5)}&destination=${destLat.toFixed(5)},${destLng.toFixed(5)}&travelmode=transit`;

  // Always compute fallback from comprehensive local network model
  const localFallback = getPublicTransitRoute(originLat, originLng, destPlace, originName);

  if (!apiKey) {
    return {
      source: 'pune_transit_engine',
      hasTransit: localFallback.hasTransit,
      transitType: localFallback.transitType,
      summaryEn: localFallback.summaryEn,
      summaryMr: localFallback.summaryMr,
      estimatedMinutes: localFallback.estimatedMinutes,
      estimatedCostInr: localFallback.estimatedCostInr,
      stepsEn: localFallback.stepByStepEn,
      stepsMr: localFallback.stepByStepMr,
      googleMapsUrl: localFallback.gmapsTransitUrl || defaultGmapsUrl,
      ticketInfoEn: localFallback.ticketInfoEn,
      ticketInfoMr: localFallback.ticketInfoMr,
      nearestMetro: localFallback.nearestMetro,
      nearestBus: localFallback.nearestBus,
      bookingOptions: localFallback.bookingOptions,
    };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=transit&transit_mode=bus|subway&transit_routing_preference=fewer_transfers&key=${apiKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Google Maps API error: ${res.status}`);
    }

    const data = await res.json();
    if (data.status === 'OK' && data.routes?.[0]?.legs?.[0]) {
      const leg = data.routes[0].legs[0];
      const durationMins = Math.round((leg.duration?.value || 1800) / 60);

      const detailedSteps: GoogleTransitStep[] = [];
      const stepsEn: string[] = [];
      const stepsMr: string[] = [];

      let hasMetro = false;
      let hasBus = false;

      for (const step of leg.steps || []) {
        const cleanInst = (step.html_instructions || '').replace(/<[^>]*>?/gm, '');

        if (step.travel_mode === 'TRANSIT' && step.transit_details) {
          const td = step.transit_details;
          const lineName = td.line?.name || td.line?.short_name || 'Transit Line';
          const vehicle = td.line?.vehicle?.type === 'SUBWAY' ? 'SUBWAY' : 'BUS';
          const agency = td.line?.agencies?.[0]?.name || (vehicle === 'SUBWAY' ? 'Maha Metro' : 'PMPML');

          if (vehicle === 'SUBWAY') hasMetro = true;
          if (vehicle === 'BUS') hasBus = true;

          detailedSteps.push({
            travelMode: 'TRANSIT',
            instruction: cleanInst,
            distanceText: step.distance?.text || '',
            durationText: step.duration?.text || '',
            transitDetails: {
              lineName,
              lineShortName: td.line?.short_name || lineName,
              vehicleType: vehicle,
              agencyName: agency,
              departureStop: td.departure_stop?.name || '',
              arrivalStop: td.arrival_stop?.name || '',
              numStops: td.num_stops || 1,
              headsign: td.headsign,
              lineColor: td.line?.color,
            },
          });

          if (vehicle === 'SUBWAY') {
            stepsEn.push(`Board ${lineName} at ${td.departure_stop?.name}. Ride ${td.num_stops || 1} stops to ${td.arrival_stop?.name} (~${step.duration?.text || '10 mins'}).`);
            stepsMr.push(`${td.departure_stop?.name} येथून ${lineName} मेट्रो पकडा. ${td.arrival_stop?.name} पर्यंत प्रवास करा (${td.num_stops || 1} थांबे).`);
          } else {
            stepsEn.push(`Board ${agency} (${lineName}) at ${td.departure_stop?.name} towards ${td.headsign || destPlace.name}. Alight at ${td.arrival_stop?.name}.`);
            stepsMr.push(`${td.departure_stop?.name} येथून ${agency} बस (${lineName}) पकडा आणि ${td.arrival_stop?.name} येथे उतरा.`);
          }
        } else {
          // Walking step
          detailedSteps.push({
            travelMode: 'WALKING',
            instruction: cleanInst || `Walk ${step.distance?.text || ''}`,
            distanceText: step.distance?.text || '',
            durationText: step.duration?.text || '',
          });

          stepsEn.push(`Walk ${step.distance?.text || 'a few meters'} (~${step.duration?.text || '3 mins'}) to ${cleanInst.split('to ')[1] || 'next transit point'}.`);
          stepsMr.push(`${cleanInst} (${step.distance?.text || ''}, ~${step.duration?.text || ''}).`);
        }
      }

      const transitType = hasMetro && hasBus ? 'metro_plus_bus' : hasMetro ? 'metro_only' : 'bus_only';

      return {
        source: 'google_maps_api',
        hasTransit: true,
        transitType,
        summaryEn: `${leg.duration?.text || `${durationMins} mins`} via Google Maps Transit (${hasMetro ? 'Pune Metro' : ''}${hasMetro && hasBus ? ' + ' : ''}${hasBus ? 'PMPML Bus' : ''})`,
        summaryMr: `गुगल मॅप्स थेट मार्ग: अंदाजे ${durationMins} मिनिटे (${hasMetro ? 'पुणे मेट्रो' : ''}${hasMetro && hasBus ? ' + ' : ''}${hasBus ? 'पीएमपीएमएल बस' : ''})`,
        estimatedMinutes: durationMins,
        estimatedCostInr: localFallback.estimatedCostInr,
        stepsEn: stepsEn.length ? stepsEn : localFallback.stepByStepEn,
        stepsMr: stepsMr.length ? stepsMr : localFallback.stepByStepMr,
        detailedSteps,
        googleMapsUrl: defaultGmapsUrl,
        ticketInfoEn: localFallback.ticketInfoEn,
        ticketInfoMr: localFallback.ticketInfoMr,
        nearestMetro: localFallback.nearestMetro,
        nearestBus: localFallback.nearestBus,
        bookingOptions: localFallback.bookingOptions,
      };
    }
  } catch (err: any) {
    console.warn('Google Maps Transit API query failed, utilizing verified local model:', err?.message || err);
  }

  // Graceful fallback to verified local model
  return {
    source: 'pune_transit_engine',
    hasTransit: localFallback.hasTransit,
    transitType: localFallback.transitType,
    summaryEn: localFallback.summaryEn,
    summaryMr: localFallback.summaryMr,
    estimatedMinutes: localFallback.estimatedMinutes,
    estimatedCostInr: localFallback.estimatedCostInr,
    stepsEn: localFallback.stepByStepEn,
    stepsMr: localFallback.stepByStepMr,
    googleMapsUrl: localFallback.gmapsTransitUrl || defaultGmapsUrl,
    ticketInfoEn: localFallback.ticketInfoEn,
    ticketInfoMr: localFallback.ticketInfoMr,
    nearestMetro: localFallback.nearestMetro,
    nearestBus: localFallback.nearestBus,
    bookingOptions: localFallback.bookingOptions,
  };
}

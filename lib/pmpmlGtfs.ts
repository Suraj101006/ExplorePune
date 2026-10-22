/**
 * Explore Pune - PMPML GTFS Transit Engine
 * Integrates official Pune Mahanagar Parivahan Mahamandal Limited (PMPML) GTFS routes and stops.
 * Covers 315 official bus routes, 6,745 real bus stops with GPS coordinates,
 * and direct corridor connections for Pune landmarks.
 */

import gtfsDataRaw from '@/data/pmpml-gtfs.json';
import timetableDataRaw from '@/data/pmpml-timetable.json';

export interface PmpmlStop {
  stopId: string;
  stopName: string;
  lat: number;
  lon: number;
  distanceKm: number;
  distanceMeters: number;
  walkMinutes: number;
  buses: string[];
}

export interface PmpmlLandmarkData {
  placeName: string;
  placeNameMr: string;
  lat: number;
  lng: number;
  nearestStops: PmpmlStop[];
}

export interface PmpmlDirectBus {
  busNo: string;
  routeName: string;
}

export interface PmpmlCorridorResult {
  hasDirectBus: boolean;
  buses: PmpmlDirectBus[];
  arrivalStop: string;
  walkFromStopMeters: number;
  walkMinutes: number;
  summaryEn: string;
  summaryMr: string;
}

export interface PmpmlDirectionSchedule {
  directionId: number;
  headsign: string;
  origin: string;
  destination: string;
  departures: string[];
}

export interface PmpmlTimetableRoute {
  routeNo: string;
  nameEn: string;
  terminalA: string;
  terminalB: string;
  category: string;
  categoryLabelEn: string;
  categoryLabelMr: string;
  badge: string;
  frequency: string;
  fare: string;
  firstBus: string;
  lastBus: string;
  totalDailyTrips: number;
  directions: PmpmlDirectionSchedule[];
}

export interface UpcomingDeparture {
  routeNo: string;
  destination: string;
  time24: string;
  timeFormatted: string;
  minutesUntil: number;
  isTomorrow?: boolean;
}

const timetableData = timetableDataRaw as {
  generatedAt: string;
  totalRoutes: number;
  landmarkRouteMap: Record<string, string[]>;
  routes: Record<string, PmpmlTimetableRoute>;
};

const gtfsData = gtfsDataRaw as {
  generatedAt: string;
  totalRoutes: number;
  totalStops: number;
  hubs: Array<{ id: string; name: string; nameMr: string; lat: number; lon: number }>;
  landmarkStops: Record<string, PmpmlLandmarkData>;
  hubCorridors: Record<
    string,
    {
      hubName: string;
      hubNameMr: string;
      destinations: Record<
        string,
        {
          directBuses: PmpmlDirectBus[];
          arrivalStop: string;
          walkFromStopMeters: number;
        }
      >;
    }
  >;
};

// Helper: Haversine distance
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Get nearest official PMPML bus stops for a specific landmark slug.
 */
export function getLandmarkPmpmlStops(slug: string): PmpmlLandmarkData | null {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  return gtfsData.landmarkStops[cleanSlug] || null;
}

/**
 * Determine the closest starting hub from coordinates or name.
 */
export function detectClosestHub(lat: number, lng: number, originName?: string): string {
  if (originName) {
    const lower = originName.toLowerCase();
    for (const hub of gtfsData.hubs) {
      if (lower.includes(hub.id) || lower.includes(hub.name.toLowerCase())) {
        return hub.id;
      }
    }
  }

  let closestHub = gtfsData.hubs[0].id;
  let minDistance = Infinity;

  for (const hub of gtfsData.hubs) {
    const d = haversineKm(lat, lng, hub.lat, hub.lon);
    if (d < minDistance) {
      minDistance = d;
      closestHub = hub.id;
    }
  }

  return closestHub;
}

/**
 * Find direct PMPML bus corridors connecting user/hub to a landmark.
 */
export function getPmpmlTransitCorridor(
  userLat: number,
  userLng: number,
  landmarkSlug: string,
  originName?: string
): PmpmlCorridorResult | null {
  const hubId = detectClosestHub(userLat, userLng, originName);
  const hubData = gtfsData.hubCorridors[hubId];
  const landmark = getLandmarkPmpmlStops(landmarkSlug);

  if (hubData && hubData.destinations && hubData.destinations[landmarkSlug]) {
    const dest = hubData.destinations[landmarkSlug];
    const buses = dest.directBuses || [];
    const busNumbers = buses.map((b) => b.busNo).join(', ');
    const walkMins = Math.max(1, Math.round((dest.walkFromStopMeters || 100) / 75));

    return {
      hasDirectBus: true,
      buses,
      arrivalStop: dest.arrivalStop,
      walkFromStopMeters: dest.walkFromStopMeters,
      walkMinutes: walkMins,
      summaryEn: `Take direct PMPML Bus ${busNumbers} from ${hubData.hubName} to ${dest.arrivalStop} stop (${dest.walkFromStopMeters}m walk).`,
      summaryMr: `${hubData.hubNameMr} वरून थेट पीएमपीएमएल बस क्र. ${busNumbers} पकडा व ${dest.arrivalStop} थांब्यावर उतरा (${dest.walkFromStopMeters} मी. अंतर).`,
    };
  }

  // If no precomputed hub direct route, check landmark's nearest stops
  if (landmark && landmark.nearestStops && landmark.nearestStops.length > 0) {
    const primaryStop = landmark.nearestStops[0];
    const buses = primaryStop.buses || [];
    const busList = buses.slice(0, 5).join(', ');

    return {
      hasDirectBus: buses.length > 0,
      buses: buses.slice(0, 5).map((bNo) => ({ busNo: bNo, routeName: `PMPML Bus ${bNo}` })),
      arrivalStop: primaryStop.stopName,
      walkFromStopMeters: primaryStop.distanceMeters,
      walkMinutes: primaryStop.walkMinutes,
      summaryEn: `Alight at official PMPML Stop: ${primaryStop.stopName} (Buses: ${busList || 'Local Routes'}, ${primaryStop.distanceMeters}m walk).`,
      summaryMr: `अधिकृत पीएमपीएमएल थांबा: ${primaryStop.stopName} (बसेस: ${busList || 'स्थानिक मार्ग'}, ${primaryStop.distanceMeters} मी. पायी चालणे).`,
    };
  }

  return null;
}

/**
 * Format HH:MM to 12-hour AM/PM string
 */
export function formatAmPm(hhmm: string): string {
  if (!hhmm) return '';
  const [hStr, mStr] = hhmm.split(':');
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${mStr} ${suffix}`;
}

/**
 * Get route schedule by route number (e.g., "50", "119", "149", "RATRANI 1")
 */
export function getPmpmlRouteSchedule(routeNo: string): PmpmlTimetableRoute | null {
  if (!routeNo) return null;
  const clean = routeNo.trim().toUpperCase();
  return (
    timetableData.routes[clean] ||
    timetableData.routes[clean.replace(/^BUS\s*/i, '')] ||
    null
  );
}

/**
 * Get all timetable routes associated with a landmark slug
 */
export function getLandmarkTimetables(landmarkSlug: string): PmpmlTimetableRoute[] {
  if (!landmarkSlug) return [];
  const cleanSlug = landmarkSlug.toLowerCase().trim();
  const routeNumbers = timetableData.landmarkRouteMap[cleanSlug] || [];
  const results: PmpmlTimetableRoute[] = [];

  for (const rNo of routeNumbers) {
    const rData = getPmpmlRouteSchedule(rNo);
    if (rData && !results.some((r) => r.routeNo === rData.routeNo)) {
      results.push(rData);
    }
  }

  // If place-specific authentic routes exist, return them immediately so schedules are strictly landmark-specific (not diluted with common area buses)
  if (results.length > 0) {
    return results;
  }

  // Fallback to nearest stops only if no specific mapped routes exist
  const landmarkStops = getLandmarkPmpmlStops(cleanSlug);
  if (landmarkStops && landmarkStops.nearestStops) {
    for (const stop of landmarkStops.nearestStops.slice(0, 2)) {
      for (const bNo of stop.buses || []) {
        const rData = getPmpmlRouteSchedule(bNo);
        if (rData && !results.some((r) => r.routeNo === rData.routeNo)) {
          results.push(rData);
        }
      }
    }
  }

  return results.slice(0, 6);
}

/**
 * Calculate upcoming bus departures for a route based on Indian Standard Time (IST)
 */
export function getUpcomingDepartures(
  routeNo: string,
  directionId: number = 0,
  maxCount: number = 4
): UpcomingDeparture[] {
  const schedule = getPmpmlRouteSchedule(routeNo);
  if (!schedule || !schedule.directions || schedule.directions.length === 0) return [];

  const dir = schedule.directions.find((d) => d.directionId === directionId) || schedule.directions[0];
  const departures = dir.departures || [];
  if (departures.length === 0) return [];

  // Current Pune time in minutes from midnight
  const now = new Date();
  const istTimeStr = now.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  const [nowH, nowM] = istTimeStr.split(':').map((s) => parseInt(s, 10));
  const currentMinutes = nowH * 60 + nowM;

  const upcoming: UpcomingDeparture[] = [];

  for (const dep of departures) {
    const [dH, dM] = dep.split(':').map((s) => parseInt(s, 10));
    const depMinutes = dH * 60 + dM;
    const diff = depMinutes - currentMinutes;

    if (diff >= 0) {
      upcoming.push({
        routeNo: schedule.routeNo,
        destination: dir.destination,
        time24: dep,
        timeFormatted: formatAmPm(dep),
        minutesUntil: diff,
        isTomorrow: false,
      });
      if (upcoming.length >= maxCount) break;
    }
  }

  // If no upcoming buses today (late night / service ended), show first departures tomorrow morning
  if (upcoming.length < maxCount && departures.length > 0) {
    for (const dep of departures) {
      const [dH, dM] = dep.split(':').map((s) => parseInt(s, 10));
      const depMinutes = dH * 60 + dM;
      const diffTomorrow = 24 * 60 - currentMinutes + depMinutes;

      upcoming.push({
        routeNo: schedule.routeNo,
        destination: dir.destination,
        time24: dep,
        timeFormatted: formatAmPm(dep),
        minutesUntil: diffTomorrow,
        isTomorrow: true,
      });
      if (upcoming.length >= maxCount) break;
    }
  }

  return upcoming;
}

/**
 * Search timetable routes by keyword or landmark name (e.g. "Shaniwar Wada", "Sinhagad", "Alandi", "50", "Katraj")
 */
export function searchPmpmlTimetable(query: string): PmpmlTimetableRoute[] {
  if (!query) return [];
  const q = query.toLowerCase().trim();

  // 1. Check if query matches any landmark slug or landmark keywords
  for (const [slug, rNos] of Object.entries(timetableData.landmarkRouteMap)) {
    const slugKeywords = slug.replace(/-/g, ' ').split(' ');
    const isLandmarkMatch =
      q.includes(slug.replace(/-/g, ' ')) ||
      slugKeywords.some((kw) => kw.length > 3 && q.includes(kw));

    if (isLandmarkMatch) {
      const landmarkRoutes: PmpmlTimetableRoute[] = [];
      for (const rNo of rNos) {
        const rData = getPmpmlRouteSchedule(rNo);
        if (rData && !landmarkRoutes.some((r) => r.routeNo === rData.routeNo)) {
          landmarkRoutes.push(rData);
        }
      }
      if (landmarkRoutes.length > 0) return landmarkRoutes;
    }
  }

  // 2. Direct route search across all 315 PMPML timetable routes
  const allRoutes = Object.values(timetableData.routes);

  return allRoutes
    .filter((r) => {
      return (
        r.routeNo.toLowerCase() === q ||
        r.routeNo.toLowerCase().includes(q) ||
        r.nameEn.toLowerCase().includes(q) ||
        r.terminalA.toLowerCase().includes(q) ||
        r.terminalB.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.categoryLabelEn.toLowerCase().includes(q)
      );
    })
    .slice(0, 10);
}


/**
 * Explore Pune - PMPML GTFS Transit Engine
 * Integrates official Pune Mahanagar Parivahan Mahamandal Limited (PMPML) GTFS routes and stops.
 * Covers 315 official bus routes, 6,745 real bus stops with GPS coordinates,
 * and direct corridor connections for Pune landmarks.
 */

import gtfsDataRaw from '@/data/pmpml-gtfs.json';

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

/**
 * Explore Pune - Professional GPS & Real Road Navigation Engine
 * Provides client-side real road routing, multi-stop itineraries,
 * browser geolocation management with permission handling, and arrival detection.
 */

import { ExperiencePlace } from './types';
import { calculateDistanceKm } from './puneDistrictData';
import { LocationAccuracyService, AccuracyEvaluation } from '../services/LocationAccuracyService';
import { LocationPermissionService, PermissionState } from '../services/LocationPermissionService';

export type NavigationTravelMode = 'driving' | 'walking' | 'bicycling';

export interface RouteManeuverStep {
  instruction: string;
  instructionMr?: string;
  distanceText: string;
  durationText: string;
  maneuver?: string;
}

export interface RouteAlternative {
  distanceKm: number;
  durationMinutes: number;
  distanceText: string;
  durationText: string;
  summary: string;
}

export interface NavigationRouteResult {
  success: boolean;
  distanceKm: number;
  durationMinutes: number;
  durationText: string;
  distanceText: string;
  travelMode: NavigationTravelMode;
  geometryCoordinates: Array<[number, number]>;
  steps?: RouteManeuverStep[];
  summary?: string;
  alternative?: RouteAlternative;
  gmapsUrl: string;
  appleMapsUrl: string;
  trafficNote?: string;
  source: 'osrm' | 'pune_transit_engine' | 'geodesic_road_estimate';
  isRealRoad: boolean;
  error?: string;
}

export interface DeviceGpsState {
  isActive: boolean;
  coords: { latitude: number; longitude: number } | null;
  accuracyMeters: number | null;
  accuracyTier: AccuracyEvaluation | null;
  heading: number | null;
  speedKmh: number | null;
  timestamp: number | null;
  isRealGPS: boolean;
  permissionState: PermissionState;
  errorMessage: string | null;
}

export const INITIAL_GPS_STATE: DeviceGpsState = {
  isActive: false,
  coords: null,
  accuracyMeters: null,
  accuracyTier: null,
  heading: null,
  speedKmh: null,
  timestamp: null,
  isRealGPS: false,
  permissionState: 'prompt',
  errorMessage: null,
};

/**
 * Fetch real road route from the /api/v1/directions backend proxy
 * Never exposes 3rd-party API keys to the browser.
 */
export async function fetchRealRoadRoute({
  originLat,
  originLng,
  originName,
  destLat,
  destLng,
  destName,
  travelMode = 'driving',
  lang = 'en',
}: {
  originLat: number;
  originLng: number;
  originName?: string;
  destLat: number;
  destLng: number;
  destName?: string;
  travelMode?: NavigationTravelMode;
  lang?: string;
}): Promise<NavigationRouteResult> {
  const isMr = lang === 'mr';

  // Sanity check coordinates
  if (
    typeof originLat !== 'number' ||
    typeof originLng !== 'number' ||
    typeof destLat !== 'number' ||
    typeof destLng !== 'number' ||
    isNaN(originLat) ||
    isNaN(originLng) ||
    isNaN(destLat) ||
    isNaN(destLng)
  ) {
    return {
      success: false,
      distanceKm: 0,
      durationMinutes: 0,
      durationText: '0 min',
      distanceText: '0 km',
      travelMode,
      geometryCoordinates: [],
      gmapsUrl: '',
      appleMapsUrl: '',
      source: 'geodesic_road_estimate',
      isRealRoad: false,
      error: isMr ? 'अवैध निर्देशांक' : 'Invalid navigation coordinates provided.',
    };
  }

  try {
    const res = await fetch('/api/v1/directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originLat,
        originLng,
        originName,
        destLat,
        destLng,
        destName,
        travelMode,
        lang,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.error?.message || `Routing server returned status ${res.status}`);
    }

    const data = await res.json();
    const isReal = data.source === 'osrm' && Array.isArray(data.geometryCoordinates) && data.geometryCoordinates.length > 2;

    return {
      success: true,
      distanceKm: data.distanceKm || 0,
      durationMinutes: data.durationMinutes || 0,
      durationText: data.durationText || `${data.durationMinutes} min`,
      distanceText: data.distanceText || `${data.distanceKm} km`,
      travelMode: data.travelMode || travelMode,
      geometryCoordinates: data.geometryCoordinates || [
        [originLng, originLat],
        [destLng, destLat],
      ],
      steps: data.steps,
      summary: data.summary,
      alternative: data.alternative,
      gmapsUrl: data.gmapsUrl || '',
      appleMapsUrl: data.appleMapsUrl || '',
      trafficNote: data.trafficNote,
      source: data.source || (isReal ? 'osrm' : 'geodesic_road_estimate'),
      isRealRoad: isReal,
    };
  } catch (err: any) {
    console.warn('[NavigationEngine] directions API call failed, generating fallback estimate:', err.message);

    // Compute geodesic distance with speed fallback
    const distKm = calculateDistanceKm(originLat, originLng, destLat, destLng);
    let speedKmh = 35; // driving
    if (travelMode === 'walking') speedKmh = 4.8;
    if (travelMode === 'bicycling') speedKmh = 14;

    const durationMinutes = Math.max(
      travelMode === 'walking' ? 5 : 3,
      Math.round((distKm / speedKmh) * 60)
    );

    const hrs = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const durationText = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;
    const distanceText = `${distKm} km`;

    // Explicitly labeled as geodesic estimate (never fake real road)
    return {
      success: true,
      distanceKm: distKm,
      durationMinutes,
      durationText,
      distanceText,
      travelMode,
      geometryCoordinates: [
        [originLng, originLat],
        [destLng, destLat],
      ],
      summary: isMr ? `थेट दिशा अंदाज: ${distanceText}` : `Direct Bearing Estimate: ${distanceText}`,
      gmapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=${travelMode}`,
      appleMapsUrl: `https://maps.apple.com/?saddr=${originLat},${originLng}&daddr=${destLat},${destLng}`,
      source: 'geodesic_road_estimate',
      isRealRoad: false, // Explicitly marked false
      error: err.message,
    };
  }
}

/**
 * Multi-stop itinerary routing
 * Computes road legs between consecutive destinations
 */
export async function fetchMultiStopRoute({
  places,
  originCoords,
  travelMode = 'driving',
  lang = 'en',
}: {
  places: ExperiencePlace[];
  originCoords?: { latitude: number; longitude: number };
  travelMode?: NavigationTravelMode;
  lang?: string;
}): Promise<{
  legs: NavigationRouteResult[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  allCoordinates: Array<[number, number]>;
  isAllRealRoad: boolean;
}> {
  if (places.length === 0) {
    return {
      legs: [],
      totalDistanceKm: 0,
      totalDurationMinutes: 0,
      allCoordinates: [],
      isAllRealRoad: false,
    };
  }

  const allPoints: Array<{ lat: number; lng: number; name: string }> = [];

  if (originCoords) {
    allPoints.push({
      lat: originCoords.latitude,
      lng: originCoords.longitude,
      name: 'Origin Location',
    });
  }

  places.forEach((p) => {
    allPoints.push({
      lat: p.latitude,
      lng: p.longitude,
      name: p.name,
    });
  });

  const legs: NavigationRouteResult[] = [];
  let totalDistanceKm = 0;
  let totalDurationMinutes = 0;
  const allCoordinates: Array<[number, number]> = [];
  let isAllRealRoad = true;

  for (let i = 0; i < allPoints.length - 1; i++) {
    const from = allPoints[i];
    const to = allPoints[i + 1];

    const leg = await fetchRealRoadRoute({
      originLat: from.lat,
      originLng: from.lng,
      originName: from.name,
      destLat: to.lat,
      destLng: to.lng,
      destName: to.name,
      travelMode,
      lang,
    });

    legs.push(leg);
    totalDistanceKm = Number((totalDistanceKm + leg.distanceKm).toFixed(1));
    totalDurationMinutes += leg.durationMinutes;

    if (leg.geometryCoordinates.length > 0) {
      if (allCoordinates.length > 0) {
        // Skip duplicate connecting point
        allCoordinates.push(...leg.geometryCoordinates.slice(1));
      } else {
        allCoordinates.push(...leg.geometryCoordinates);
      }
    }

    if (!leg.isRealRoad) {
      isAllRealRoad = false;
    }
  }

  return {
    legs,
    totalDistanceKm,
    totalDurationMinutes,
    allCoordinates,
    isAllRealRoad,
  };
}

/**
 * Destination Arrival Threshold Checker
 * Checks if current GPS position is within arrival distance (default 150m)
 */
export function checkArrivalThreshold(
  userCoords: { latitude: number; longitude: number } | null | undefined,
  targetCoords: { latitude: number; longitude: number } | null | undefined,
  thresholdMeters: number = 150
): { hasArrived: boolean; distanceMeters: number } {
  if (!userCoords || !targetCoords) {
    return { hasArrived: false, distanceMeters: Infinity };
  }

  const distKm = calculateDistanceKm(
    userCoords.latitude,
    userCoords.longitude,
    targetCoords.latitude,
    targetCoords.longitude
  );

  const distMeters = Math.round(distKm * 1000);
  return {
    hasArrived: distMeters <= thresholdMeters,
    distanceMeters: distMeters,
  };
}

/**
 * Generate a GeoJSON Polygon circle approximating location accuracy radius
 */
export function createAccuracyCircleGeoJson(
  centerLng: number,
  centerLat: number,
  accuracyMeters: number = 25,
  points: number = 32
): GeoJSON.Feature<GeoJSON.Polygon> {
  const radiusKm = accuracyMeters / 1000;
  const coords: Array<[number, number]> = [];

  const distanceX = radiusKm / (111.32 * Math.cos((centerLat * Math.PI) / 180));
  const distanceY = radiusKm / 110.574;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([centerLng + x, centerLat + y]);
  }

  return {
    type: 'Feature',
    properties: { accuracyMeters },
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
  };
}

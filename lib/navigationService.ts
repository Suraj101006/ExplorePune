/**
 * Explore Pune - Unified Navigation & Directions Service
 * Manages client-side GPS location acquisition, accuracy verification,
 * travel mode preferences, external navigation URL generation, and global directions modal state.
 */

export type TravelMode = 'driving' | 'transit' | 'walking' | 'bicycling';

export interface NavDestination {
  id?: string;
  name: string;
  nameMr?: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  addressMr?: string;
  slug?: string;
  imageUrl?: string;
  category?: string;
}

export interface NavOrigin {
  name: string;
  latitude: number;
  longitude: number;
  isGps?: boolean;
  accuracyMeters?: number;
  timestamp?: number;
}

export interface RouteStep {
  instruction: string;
  instructionMr?: string;
  distanceText: string;
  durationText: string;
  maneuver?: string;
}

export interface DirectionsResult {
  success: boolean;
  error?: string;
  distanceKm: number;
  durationMinutes: number;
  durationText: string;
  distanceText: string;
  travelMode: TravelMode;
  geometryCoordinates?: Array<[number, number]>; // [longitude, latitude]
  steps: RouteStep[];
  summary: string;
  alternative?: {
    distanceKm: number;
    durationMinutes: number;
    durationText: string;
    distanceText: string;
    summary: string;
  };
  gmapsUrl: string;
  appleMapsUrl?: string;
  trafficNote?: string;
  source: 'google_directions' | 'osrm' | 'pune_transit_engine' | 'geodesic_road_model';
}

const STORAGE_MODE_KEY = 'explore-pune-travel-mode';
export const DIRECTIONS_MODAL_EVENT = 'explore-pune-open-directions';

/**
 * Validates that the selected Pune destination has verified, non-null coordinates.
 */
export function validateDestination(dest: NavDestination): {
  valid: boolean;
  error?: string;
  errorMr?: string;
} {
  if (
    dest.latitude == null ||
    dest.longitude == null ||
    isNaN(dest.latitude) ||
    isNaN(dest.longitude) ||
    dest.latitude === 0 ||
    dest.longitude === 0
  ) {
    return {
      valid: false,
      error:
        'Directions are temporarily unavailable for this location because its verified coordinates are missing.',
      errorMr:
        'या ठिकाणाचे अधिकृत भौगोलिक निर्देशांक (GPS Coordinates) उपलब्ध नसल्याने मार्ग सध्या अनुपलब्ध आहे.',
    };
  }

  // Coordinates should be in reasonable latitude/longitude bounds
  if (
    dest.latitude < -90 ||
    dest.latitude > 90 ||
    dest.longitude < -180 ||
    dest.longitude > 180
  ) {
    return {
      valid: false,
      error: 'Invalid coordinates detected for this destination.',
      errorMr: 'या ठिकाणाचे GPS निर्देशांक अवैध आहेत.',
    };
  }

  return { valid: true };
}

/**
 * Checks GPS accuracy threshold and returns a health status.
 * Thresholds:
 * <= 150m: High accuracy
 * 150m - 1000m: Medium accuracy
 * > 1000m: Low accuracy (warning shown to user)
 */
export function evaluateGpsAccuracy(accuracyMeters?: number | null): {
  quality: 'high' | 'medium' | 'low';
  isLow: boolean;
  warning?: string;
  warningMr?: string;
} {
  if (accuracyMeters == null || isNaN(accuracyMeters)) {
    return { quality: 'medium', isLow: false };
  }

  if (accuracyMeters > 1000) {
    return {
      quality: 'low',
      isLow: true,
      warning:
        'Your location accuracy is currently low. Move to an open area and try again for a more accurate route.',
      warningMr:
        'तुमची GPS अचूकता कमी आहे. अधिक अचूक मार्गासाठी मोकळ्या जागेत जाऊन पुन्हा प्रयत्न करा.',
    };
  }

  if (accuracyMeters > 150) {
    return { quality: 'medium', isLow: false };
  }

  return { quality: 'high', isLow: false };
}

/**
 * Persists the user's selected travel mode in sessionStorage.
 */
export function getStoredTravelMode(): TravelMode {
  if (typeof window === 'undefined') return 'driving';
  try {
    const raw = sessionStorage.getItem(STORAGE_MODE_KEY);
    if (raw === 'driving' || raw === 'transit' || raw === 'walking' || raw === 'bicycling') {
      return raw;
    }
  } catch {
    // Ignore storage errors
  }
  return 'driving';
}

export function setStoredTravelMode(mode: TravelMode): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_MODE_KEY, mode);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Builds universal external navigation links (Google Maps & Apple Maps).
 * Uses exact latitude and longitude coordinates for origin and destination.
 */
export function buildExternalNavigationUrl({
  origin,
  destination,
  travelMode,
}: {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number; name?: string };
  travelMode: TravelMode;
}): { gmapsUrl: string; appleMapsUrl: string } {
  const oLat = origin.latitude.toFixed(5);
  const oLng = origin.longitude.toFixed(5);
  const dLat = destination.latitude.toFixed(5);
  const dLng = destination.longitude.toFixed(5);

  let gmode = 'driving';
  let amode = 'd';

  if (travelMode === 'transit') {
    gmode = 'transit';
    amode = 'r';
  } else if (travelMode === 'walking') {
    gmode = 'walking';
    amode = 'w';
  } else if (travelMode === 'bicycling') {
    gmode = 'bicycling';
    amode = 'c';
  }

  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${dLat},${dLng}&travelmode=${gmode}`;
  const appleMapsUrl = `https://maps.apple.com/?saddr=${oLat},${oLng}&daddr=${dLat},${dLng}&dirflg=${amode}`;

  return { gmapsUrl, appleMapsUrl };
}

/**
 * Triggers the global Directions Modal for a given destination.
 * Can be called from any component (Place Details, Place Cards, Chatbot, Trip Planner).
 */
export function openDirectionsModal(
  destination: NavDestination,
  initialOrigin?: NavOrigin
): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(DIRECTIONS_MODAL_EVENT, {
      detail: { destination, initialOrigin },
    })
  );
}

/**
 * Fetches directions from our secure server route `/api/v1/directions`.
 */
export async function fetchDirectionsRoute({
  origin,
  destination,
  travelMode,
  lang = 'en',
}: {
  origin: { lat: number; lng: number; name?: string };
  destination: { lat: number; lng: number; name?: string; address?: string };
  travelMode: TravelMode;
  lang?: 'en' | 'mr';
}): Promise<DirectionsResult> {
  const res = await fetch('/api/v1/directions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originLat: origin.lat,
      originLng: origin.lng,
      originName: origin.name,
      destLat: destination.lat,
      destLng: destination.lng,
      destName: destination.name,
      destAddress: destination.address,
      travelMode,
      lang,
    }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || `Failed to fetch directions (status: ${res.status})`
    );
  }

  return res.json();
}

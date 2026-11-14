/**
 * Explore Pune - Precision Distance & Spatial Utility
 * Implements high-precision Haversine distance, bearing, and proximity algorithms.
 */

export interface DistanceCalculationResult {
  straightKm: number;
  roadKm: number;
  meters: number;
  walkingMinutes: number;
  drivingMinutes: number;
}

/**
 * Calculates high-precision great-circle distance between two GPS coordinates using the Haversine formula.
 * Earth mean radius: 6371.0088 km (IUGG standard).
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371.0088; // Earth radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates initial compass bearing in degrees from point 1 to point 2 (0° - 360°).
 */
export function calculateBearingDegrees(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

/**
 * Converts straight-line distance to estimated road distance and travel times in Pune traffic.
 */
export function estimateRoadMetrics(straightKm: number): DistanceCalculationResult {
  // Road winding factor: 1.25x for urban plains, up to 1.45x for Sahyadri ghat routes
  const roadKm = Math.round(straightKm * 1.25 * 10) / 10;
  const meters = Math.round(straightKm * 1000);

  // Walking: ~5 km/h (12 mins/km)
  const walkingMinutes = Math.max(1, Math.round(roadKm * 12));
  // Driving: ~22 km/h average in Pune city traffic
  const drivingMinutes = Math.max(3, Math.round(roadKm * 2.6) + 3);

  return {
    straightKm: Math.round(straightKm * 100) / 100,
    roadKm,
    meters,
    walkingMinutes,
    drivingMinutes,
  };
}

/**
 * Calculates realistic road travel distance factoring in Pune urban grid and hill/ghat topography.
 */
export function calculateRoadTravelDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const straight = calculateHaversineDistanceKm(lat1, lon1, lat2, lon2);
  if (straight <= 0.05) return straight;
  const isGhatRegion = lat1 < 18.42 || lat2 < 18.42;
  const roadMultiplier = isGhatRegion ? 1.36 : 1.24;
  return Number((straight * roadMultiplier).toFixed(2));
}

/**
 * Formats distance with localized units.
 */
export function formatLocalizedDistance(km: number, isMr = false): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return isMr ? `${meters} मी` : `${meters} m`;
  }
  const formattedKm = Math.round(km * 10) / 10;
  return isMr ? `${formattedKm} किमी` : `${formattedKm} km`;
}

export const formatDistanceLocalized = formatLocalizedDistance;

/**
 * Verifies if coordinates are inside a bounding radius of a target point.
 */
export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusKm: number
): boolean {
  return calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) <= radiusKm;
}

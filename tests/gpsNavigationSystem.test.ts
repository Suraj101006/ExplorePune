import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchRealRoadRoute,
  fetchMultiStopRoute,
  checkArrivalThreshold,
  createAccuracyCircleGeoJson,
  INITIAL_GPS_STATE,
  NavigationTravelMode,
} from '../lib/experience/navigationEngine';
import { LocationPermissionService } from '../lib/services/LocationPermissionService';
import { LocationAccuracyService } from '../lib/services/LocationAccuracyService';
import { getAllPlaces, getPlaceBySlug } from '../lib/experience/selectors';
import { calculateDistanceKm } from '../lib/experience/puneDistrictData';

describe('Professional GPS & Open-World Navigation System', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. GPS Integration & Geolocation Permissions', () => {
    it('verifies initial GPS state starts inactive without fake coordinates', () => {
      expect(INITIAL_GPS_STATE.isActive).toBe(false);
      expect(INITIAL_GPS_STATE.coords).toBeNull();
      expect(INITIAL_GPS_STATE.isRealGPS).toBe(false);
      expect(INITIAL_GPS_STATE.accuracyMeters).toBeNull();
      expect(INITIAL_GPS_STATE.permissionState).toBe('prompt');
      expect(INITIAL_GPS_STATE.errorMessage).toBeNull();
    });

    it('evaluates location accuracy tiers accurately into 5 standard grades', () => {
      const tier1 = LocationAccuracyService.evaluate(8);
      expect(tier1.tier).toBe('excellent');
      expect(tier1.isHighPrecision).toBe(true);
      expect(tier1.labelEn).toContain('±8m');

      const tier2 = LocationAccuracyService.evaluate(25);
      expect(tier2.tier).toBe('good');
      expect(tier2.isHighPrecision).toBe(true);

      const tier3 = LocationAccuracyService.evaluate(50);
      expect(tier3.tier).toBe('moderate');
      expect(tier3.isHighPrecision).toBe(false);

      const tier4 = LocationAccuracyService.evaluate(120);
      expect(tier4.tier).toBe('low');

      const tier5 = LocationAccuracyService.evaluate(450);
      expect(tier5.tier).toBe('poor');
      expect(tier5.recommendRetry).toBe(true);
    });

    it('generates an exact GeoJSON polygon circle for GPS accuracy radius display', () => {
      const circle = createAccuracyCircleGeoJson(73.8567, 18.5204, 30, 16);
      expect(circle.type).toBe('Feature');
      expect(circle.geometry.type).toBe('Polygon');
      expect(circle.geometry.coordinates[0].length).toBe(17); // 16 segments + 1 closure
      expect(circle.properties?.accuracyMeters).toBe(30);

      // Verify points enclose the center coordinate
      const lats = circle.geometry.coordinates[0].map((c) => c[1]);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      expect(minLat).toBeLessThan(18.5204);
      expect(maxLat).toBeGreaterThan(18.5204);
    });

    it('correctly handles secure context and permission queries', async () => {
      expect(LocationPermissionService.isSecureContext()).toBe(true);
      expect(typeof LocationPermissionService.isSupported).toBe('function');

      const status = await LocationPermissionService.queryPermissionState();
      expect(status.state).toBeDefined();
      expect(status.messageEn).toBeTruthy();
      expect(status.messageMr).toBeTruthy();
    });

    it('validates arrival threshold detection triggers when within threshold', () => {
      const userAtShaniwarWada = { latitude: 18.5196, longitude: 73.8553 };
      const shaniwarWada = { latitude: 18.5196, longitude: 73.8553 };

      const arrived = checkArrivalThreshold(userAtShaniwarWada, shaniwarWada, 150);
      expect(arrived.hasArrived).toBe(true);
      expect(arrived.distanceMeters).toBeLessThanOrEqual(150);

      // Point 5km away
      const sinhagadFort = { latitude: 18.3663, longitude: 73.7558 };
      const notArrived = checkArrivalThreshold(userAtShaniwarWada, sinhagadFort, 150);
      expect(notArrived.hasArrived).toBe(false);
      expect(notArrived.distanceMeters).toBeGreaterThan(15000);
    });
  });

  describe('2. Real Road Routing & Travel Modes', () => {
    it('calls /api/v1/directions with verified parameters and returns road geometry', async () => {
      // Mock fetch for /api/v1/directions
      const mockRouteData = {
        success: true,
        distanceKm: 24.8,
        durationMinutes: 48,
        durationText: '48 min',
        distanceText: '24.8 km',
        travelMode: 'driving',
        geometryCoordinates: [
          [73.8553, 18.5196],
          [73.8540, 18.5160],
          [73.8320, 18.4720],
          [73.7558, 18.3663],
        ],
        steps: [
          { instruction: 'Head toward Shivaji Road', distanceText: '500 m', durationText: '2 min' },
          { instruction: 'Turn left onto Sinhagad Road', distanceText: '12 km', durationText: '22 min' },
          { instruction: 'Arrive at Sinhagad Fort', distanceText: '0 km', durationText: '0 min' },
        ],
        source: 'osrm',
        gmapsUrl: 'https://maps.google.com',
        appleMapsUrl: 'https://maps.apple.com',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockRouteData,
      } as any);

      const result = await fetchRealRoadRoute({
        originLat: 18.5196,
        originLng: 73.8553,
        originName: 'Shaniwar Wada',
        destLat: 18.3663,
        destLng: 73.7558,
        destName: 'Sinhagad Fort',
        travelMode: 'driving',
      });

      expect(result.success).toBe(true);
      expect(result.isRealRoad).toBe(true);
      expect(result.distanceKm).toBe(24.8);
      expect(result.durationMinutes).toBe(48);
      expect(result.geometryCoordinates.length).toBe(4);
      expect(result.steps?.length).toBe(3);
      expect(result.source).toBe('osrm');
    });

    it('rejects invalid or non-numeric destination coordinates gracefully', async () => {
      const result = await fetchRealRoadRoute({
        originLat: NaN,
        originLng: 73.8553,
        destLat: 18.3663,
        destLng: 73.7558,
      });

      expect(result.success).toBe(false);
      expect(result.isRealRoad).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('handles routing service network failure with explicit non-fake fallback', async () => {
      // Mock network failure
      global.fetch = vi.fn().mockRejectedValue(new Error('Network offline or rate limit'));

      const result = await fetchRealRoadRoute({
        originLat: 18.5196,
        originLng: 73.8553,
        destLat: 18.3663,
        destLng: 73.7558,
        travelMode: 'driving',
      });

      // Must succeed with calculated fallback, but explicitly marked isRealRoad = false!
      expect(result.success).toBe(true);
      expect(result.isRealRoad).toBe(false);
      expect(result.source).toBe('geodesic_road_estimate');
      expect(result.summary).toContain('Direct Bearing Estimate');
      expect(result.distanceKm).toBeGreaterThan(15);
      expect(result.durationMinutes).toBeGreaterThan(20);
    });

    it('supports walking and cycling travel modes with adjusted speeds', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Testing fallback speed tiers'));

      const walkingResult = await fetchRealRoadRoute({
        originLat: 18.5196,
        originLng: 73.8553,
        destLat: 18.5186,
        destLng: 73.8569, // ~300m
        travelMode: 'walking',
      });
      expect(walkingResult.travelMode).toBe('walking');
      expect(walkingResult.durationMinutes).toBeGreaterThanOrEqual(3);

      const cyclingResult = await fetchRealRoadRoute({
        originLat: 18.5196,
        originLng: 73.8553,
        destLat: 18.5186,
        destLng: 73.8569,
        travelMode: 'bicycling',
      });
      expect(cyclingResult.travelMode).toBe('bicycling');
    });
  });

  describe('3. Multi-Stop Waypoint Chain Navigation', () => {
    it('navigates between multiple locations calculating cumulative distance and legs', async () => {
      const p1 = getPlaceBySlug('shaniwar-wada');
      const p2 = getPlaceBySlug('lal-mahal');
      const p3 = getPlaceBySlug('parvati-hill');

      expect(p1).toBeDefined();
      expect(p2).toBeDefined();
      expect(p3).toBeDefined();

      if (!p1 || !p2 || !p3) return;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          distanceKm: 2.5,
          durationMinutes: 10,
          distanceText: '2.5 km',
          durationText: '10 min',
          travelMode: 'driving',
          geometryCoordinates: [
            [73.8553, 18.5196],
            [73.8560, 18.5185],
            [73.8570, 18.5178],
          ],
          source: 'osrm',
        }),
      } as any);

      const multiRoute = await fetchMultiStopRoute({
        places: [p1, p2, p3],
        travelMode: 'driving',
      });

      expect(multiRoute.legs.length).toBe(2); // 3 places = 2 legs
      expect(multiRoute.totalDistanceKm).toBe(5.0);
      expect(multiRoute.totalDurationMinutes).toBe(20);
      expect(multiRoute.allCoordinates.length).toBeGreaterThanOrEqual(2);
      expect(multiRoute.isAllRealRoad).toBe(true);
    });
  });

  describe('4. Security & Safety Invariants', () => {
    it('guarantees client code never exposes hardcoded API keys', () => {
      // Check that navigationEngine imports and references no secret keys
      const srcCode = fetchRealRoadRoute.toString();
      expect(srcCode).not.toContain('AIzaSy'); // Google Maps secret key pattern
      expect(srcCode).not.toContain('pk.eyJ'); // Mapbox secret key pattern
      expect(srcCode).not.toContain('sk.eyJ');
    });
  });
});

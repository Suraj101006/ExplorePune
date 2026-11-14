import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateHaversineDistanceKm,
  calculateRoadTravelDistanceKm,
  calculateBearingDegrees,
  formatDistanceLocalized,
} from '../lib/utils/distanceCalculator';
import {
  LocationAccuracyService,
  AccuracyTier,
} from '../lib/services/LocationAccuracyService';
import {
  LocationPermissionService,
  PermissionState,
} from '../lib/services/LocationPermissionService';
import {
  GeocodingService,
} from '../lib/services/GeocodingService';
import {
  LocationService,
  LocationRecord,
} from '../lib/services/LocationService';
import {
  detectBrowserGps,
  DEFAULT_PUNE_STATIC_LOCATION,
  findClosestPuneLocality,
} from '../lib/userLocation';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe('GPS Accuracy & Location Intelligence System', () => {
  const originalNavigator = global.navigator;
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('window', {
      ...globalThis.window,
      localStorage: localStorageMock,
      isSecureContext: true,
      location: { protocol: 'https:', hostname: 'localhost' },
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    global.fetch = originalFetch;
    LocationService.stopContinuousTracking();
  });

  // =========================================================================
  // 1. HIGH-PRECISION GEODESIC & DISTANCE CALCULATIONS
  // =========================================================================
  describe('Geodesic Distance & Proximity Engine', () => {
    it('calculates Haversine distance accurately between Shaniwar Wada and Pune Station', () => {
      // Shaniwar Wada: 18.5196, 73.8553 | Pune Station: 18.5284, 73.8739
      const dist = calculateHaversineDistanceKm(18.5196, 73.8553, 18.5284, 73.8739);
      expect(dist).toBeGreaterThan(2.0);
      expect(dist).toBeLessThan(2.3);
    });

    it('applies urban road multipliers and ghat terrain multipliers correctly', () => {
      // City flat route
      const cityDist = calculateRoadTravelDistanceKm(18.5204, 73.8567, 18.5590, 73.7868);
      // Sinhagad ghat ascent (lat < 18.42)
      const ghatDist = calculateRoadTravelDistanceKm(18.5204, 73.8567, 18.3663, 73.7558);

      expect(cityDist).toBeGreaterThan(calculateHaversineDistanceKm(18.5204, 73.8567, 18.5590, 73.7868));
      expect(ghatDist).toBeGreaterThan(calculateHaversineDistanceKm(18.5204, 73.8567, 18.3663, 73.7558) * 1.3);
    });

    it('calculates geographic bearing compass headings correctly', () => {
      // Due north
      const north = calculateBearingDegrees(18.50, 73.85, 18.60, 73.85);
      expect(north).toBeCloseTo(0, 0);

      // Due east
      const east = calculateBearingDegrees(18.50, 73.85, 18.50, 73.95);
      expect(east).toBeCloseTo(90, 0);
    });

    it('formats localized distance units for Marathi and English', () => {
      expect(formatDistanceLocalized(0.45, false)).toBe('450 m');
      expect(formatDistanceLocalized(0.45, true)).toBe('450 मी');
      expect(formatDistanceLocalized(4.8, false)).toBe('4.8 km');
      expect(formatDistanceLocalized(4.8, true)).toBe('4.8 किमी');
    });
  });

  // =========================================================================
  // 2. 5-TIER ACCURACY EVALUATION SYSTEM
  // =========================================================================
  describe('5-Tier Accuracy Classification', () => {
    it('classifies 0-15m as Excellent tier (hardware satellite GNSS)', () => {
      const eval10 = LocationAccuracyService.evaluate(10);
      expect(eval10.tier).toBe('excellent');
      expect(eval10.isHighPrecision).toBe(true);
      expect(eval10.recommendRetry).toBe(false);
      expect(eval10.color).toBe('#10b981');
    });

    it('classifies 16-30m as Good tier', () => {
      const eval25 = LocationAccuracyService.evaluate(25);
      expect(eval25.tier).toBe('good');
      expect(eval25.isHighPrecision).toBe(true);
      expect(eval25.recommendRetry).toBe(false);
    });

    it('classifies 31-75m as Moderate tier', () => {
      const eval50 = LocationAccuracyService.evaluate(50);
      expect(eval50.tier).toBe('moderate');
      expect(eval50.isHighPrecision).toBe(false);
      expect(eval50.recommendRetry).toBe(false);
    });

    it('classifies 76-150m as Low tier and flags retry', () => {
      const eval100 = LocationAccuracyService.evaluate(100);
      expect(eval100.tier).toBe('low');
      expect(eval100.recommendRetry).toBe(true);
    });

    it('classifies >150m as Poor/Coarse tier and flags retry', () => {
      const eval5000 = LocationAccuracyService.evaluate(5000);
      expect(eval5000.tier).toBe('poor');
      expect(eval5000.recommendRetry).toBe(true);
      expect(eval5000.labelEn).toContain('5km');
    });

    it('validates coordinate boundaries and detects invalid coordinates', () => {
      expect(LocationAccuracyService.isValidCoordinate(18.5204, 73.8567)).toBe(true);
      expect(LocationAccuracyService.isValidCoordinate(95.0, 73.8567)).toBe(false);
      expect(LocationAccuracyService.isValidCoordinate(18.5204, 200.0)).toBe(false);
      expect(LocationAccuracyService.isValidCoordinate(0, 0)).toBe(false); // Null island rejected
      expect(LocationAccuracyService.isValidCoordinate(NaN, 73.8567)).toBe(false);
    });

    it('detects impossible sudden teleportation jumps (>250 km/h)', () => {
      const now = Date.now();
      const prev = { lat: 18.5204, lng: 73.8567, timestamp: now - 5000 }; // 5 seconds ago
      const impossibleNext = { lat: 18.9000, lng: 74.5000, timestamp: now }; // ~75 km away in 5s
      const realisticNext = { lat: 18.5210, lng: 73.8570, timestamp: now }; // ~70 meters away in 5s

      expect(LocationAccuracyService.isSuddenUnrealisticJump(prev, impossibleNext)).toBe(true);
      expect(LocationAccuracyService.isSuddenUnrealisticJump(prev, realisticNext)).toBe(false);
    });
  });

  // =========================================================================
  // 3. PERMISSION & SECURE CONTEXT ENGINE
  // =========================================================================
  describe('Permission & Security Lifecycle', () => {
    it('detects secure context correctly', () => {
      expect(LocationPermissionService.isSecureContext()).toBe(true);
    });

    it('handles GeolocationPositionError codes gracefully with clear messages', () => {
      const permDeniedError = { code: 1, message: 'User denied' } as GeolocationPositionError;
      const posUnavailError = { code: 2, message: 'Satellite fix unavailable' } as GeolocationPositionError;
      const timeoutError = { code: 3, message: 'Timeout' } as GeolocationPositionError;

      expect(LocationPermissionService.handlePositionError(permDeniedError)).toContain('denied');
      expect(LocationPermissionService.handlePositionError(posUnavailError)).toContain('unavailable');
      expect(LocationPermissionService.handlePositionError(timeoutError)).toContain('timed out');
    });
  });

  // =========================================================================
  // 4. MULTI-TIER REVERSE GEOCODING PIPELINE
  // =========================================================================
  describe('Multi-Tier Geocoding Engine', () => {
    it('falls back to Regional Pune Spatial Engine when external APIs fail', async () => {
      // Mock fetch failure
      global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

      // Near Kothrud (18.5074, 73.8077)
      const res = await GeocodingService.reverseGeocode(18.5070, 73.8080);
      expect(res.success).toBe(true);
      expect(res.source).toBe('pune_spatial_engine');
      expect(res.nameEn).toContain('Kothrud');
      expect(res.address.city).toBe('Pune');
      expect(res.isOutsidePune).toBe(false);
    });

    it('retains raw coordinates for points outside Pune without faking Pune center', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

      // Coordinates in Lonavala (~65 km outside Pune: 18.7500, 73.4000)
      const res = await GeocodingService.reverseGeocode(18.7500, 73.4000);
      expect(res.success).toBe(true);
      expect(res.isOutsidePune).toBe(true);
      expect(res.distanceFromPuneCenterKm).toBeGreaterThan(50);
      expect(res.address.city).not.toBe('Pune');
    });

    it('generates standard Google Maps embed and search URLs without API key errors', () => {
      const embedUrl = GeocodingService.getEmbedUrl(18.5204, 73.8567);
      const searchUrl = GeocodingService.getSearchUrl(18.5204, 73.8567);

      expect(embedUrl).toContain('maps?q=18.520400,73.856700');
      expect(embedUrl).toContain('output=embed');
      expect(searchUrl).toContain('maps/search/?api=1&query=18.520400,73.856700');
    });
  });

  // =========================================================================
  // 5. HIGH-ACCURACY GPS FIX & TIMEOUT BEHAVIOR
  // =========================================================================
  describe('High-Accuracy GPS Fix (enableHighAccuracy & 20s Timeout)', () => {
    it('requests getCurrentPosition with enableHighAccuracy: true, timeout: 20000, maximumAge: 0', async () => {
      let passedOptions: PositionOptions | undefined;

      const mockGeolocation = {
        getCurrentPosition: vi.fn((success, _error, options) => {
          passedOptions = options;
          success({
            coords: {
              latitude: 18.5590,
              longitude: 73.7868,
              accuracy: 14.2,
              speed: 1.5,
              heading: 180,
              altitude: 570,
            },
            timestamp: Date.now(),
          });
        }),
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      };

      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true,
        writable: true,
      });

      const res = await detectBrowserGps();

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      expect(passedOptions?.enableHighAccuracy).toBe(true);
      expect(passedOptions?.timeout).toBe(20000); // 20s requirement
      expect(passedOptions?.maximumAge).toBe(0);

      expect(res.success).toBe(true);
      expect(res.source).toBe('gps');
      expect(res.location?.latitude).toBe(18.5590);
      expect(res.location?.accuracyRadiusMeters).toBe(14);
      expect(res.location?.accuracyTier?.tier).toBe('excellent');
    });

    it('does NOT silently overwrite existing stored location when GPS times out', async () => {
      // User previously had Kothrud stored
      const existingLoc: LocationRecord = {
        id: 'existing-loc',
        latitude: 18.5074,
        longitude: 73.8077,
        lat: 18.5074,
        lng: 73.8077,
        accuracyMeters: 12,
        accuracyTier: LocationAccuracyService.evaluate(12),
        source: 'gps',
        timestamp: Date.now(),
        nameEn: 'Kothrud',
        nameMr: 'कोथरूड',
        isOutsidePune: false,
        distanceFromPuneKm: 6.2,
        addressDetails: {
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          formattedAddress: 'Kothrud, Pune',
          googleMapsUrl: '',
          googleMapsEmbedUrl: '',
        },
      };
      localStorage.setItem('explore-pune-user-location', JSON.stringify(existingLoc));

      // GPS times out
      const mockGeolocation = {
        getCurrentPosition: vi.fn((_success, error) => {
          error({ code: 3, message: 'Timeout' });
        }),
      };

      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true,
        writable: true,
      });

      // Network offline
      global.fetch = vi.fn().mockRejectedValue(new Error('Offline'));

      await detectBrowserGps();

      // Verify that stored user location remains Kothrud and was NOT replaced by Shaniwar Wada
      const storedAfter = JSON.parse(localStorage.getItem('explore-pune-user-location') || '{}');
      expect(storedAfter.id).toBe('existing-loc');
      expect(storedAfter.latitude).toBe(18.5074);
    });
  });

  // =========================================================================
  // 6. CONTINUOUS TRACKING & MULTI-COMPONENT NOTIFICATIONS
  // =========================================================================
  describe('Continuous GPS Tracking and Subscriber Notifications', () => {
    it('notifies subscribers on live coordinate updates', async () => {
      let watchCallback: PositionCallback | undefined;

      const mockGeolocation = {
        getCurrentPosition: vi.fn(),
        watchPosition: vi.fn((success) => {
          watchCallback = success;
          return 101;
        }),
        clearWatch: vi.fn(),
      };

      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true,
        writable: true,
      });

      // Avoid waiting for network timeout during reverse geocoding
      global.fetch = vi.fn().mockRejectedValue(new Error('Test offline mock'));

      const subscriberFn = vi.fn();
      LocationService.startContinuousTracking(subscriberFn);

      expect(mockGeolocation.watchPosition).toHaveBeenCalled();

      // Trigger movement update
      if (watchCallback) {
        await watchCallback({
          coords: {
            latitude: 18.5314,
            longitude: 73.8446,
            accuracy: 18,
            speed: 5.5,
            heading: 45,
            altitude: 565,
          },
          timestamp: Date.now(),
        } as GeolocationPosition);
      }

      expect(subscriberFn).toHaveBeenCalled();
      const updated = subscriberFn.mock.calls[0][0];
      expect(updated.lat).toBe(18.5314);
      expect(updated.lng).toBe(73.8446);
      expect(updated.speedKmh).toBeCloseTo(19.8, 0); // 5.5 m/s * 3.6
    });
  });
});

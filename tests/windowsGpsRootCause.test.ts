import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  detectBrowserGps,
  DEFAULT_PUNE_STATIC_LOCATION,
} from '../lib/userLocation';
import { LocationService } from '../lib/services/LocationService';
import { LocationAccuracyService } from '../lib/services/LocationAccuracyService';
import { getGoogleMapsEmbedUrl, getGoogleMapsSearchUrl } from '../lib/googleMapsLocation';

describe('Windows GPS Wrong Marker — Root Cause & Diagnostic Telemetry Verification', () => {
  const originalNavigator = global.navigator;
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
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

  describe('1. Windows Laptop Network Geolocation vs True Hardware GNSS', () => {
    it('accurately identifies coarse network/ISP positioning (±3500m) without disguising it as high-precision GPS', async () => {
      // Simulate Windows Chrome on Wi-Fi/Ethernet returning regional ISP PoP in Hinjawadi
      const mockWindowsPosition = {
        coords: {
          latitude: 18.5913,
          longitude: 73.7389,
          accuracy: 3500, // Coarse network accuracy
          speed: null,
          heading: null,
          altitude: null,
        },
        timestamp: 1731600000000,
      };

      const mockGeolocation = {
        getCurrentPosition: vi.fn((success) => success(mockWindowsPosition)),
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      };

      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true,
        writable: true,
      });

      const result = await detectBrowserGps();

      expect(result.success).toBe(true);
      expect(result.source).toBe('network');
      expect(result.accuracyMeters).toBe(3500);
      expect(result.location?.latitude).toBe(18.5913);
      expect(result.location?.longitude).toBe(73.7389);
      expect(result.location?.nameEn).toContain('Estimated Area');
      expect(result.accuracyTier?.tier).toBe('poor');
      expect(result.accuracyTier?.recommendRetry).toBe(true);
    });

    it('identifies true hardware GNSS satellite lock (±10m) with high-precision badge', async () => {
      const mockGpsPosition = {
        coords: {
          latitude: 18.5074,
          longitude: 73.8077,
          accuracy: 9.5, // High precision satellite lock in Kothrud
          speed: 1.2,
          heading: 180,
          altitude: 560,
        },
        timestamp: 1731600000000,
      };

      const mockGeolocation = {
        getCurrentPosition: vi.fn((success) => success(mockGpsPosition)),
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      };

      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true,
        writable: true,
      });

      const result = await detectBrowserGps();

      expect(result.success).toBe(true);
      expect(result.source).toBe('gps');
      expect(result.accuracyMeters).toBe(10);
      expect(result.location?.latitude).toBe(18.5074);
      expect(result.location?.longitude).toBe(73.8077);
      expect(result.location?.nameEn).toContain('Live GPS');
      expect(result.accuracyTier?.tier).toBe('excellent');
      expect(result.accuracyTier?.isHighPrecision).toBe(true);
      expect(result.accuracyTier?.recommendRetry).toBe(false);
    });
  });

  describe('2. Telemetry and Diagnostic Logging Safeguards', () => {
    it('captures raw coordinates without mutating or swapping latitude/longitude', async () => {
      const lat = 18.5196;
      const lng = 73.8553;

      const embedUrl = getGoogleMapsEmbedUrl(lat, lng);
      const searchUrl = getGoogleMapsSearchUrl(lat, lng);

      // Coordinate order validation: lat followed by lng
      expect(embedUrl).toContain(`q=${lat.toFixed(6)},${lng.toFixed(6)}`);
      expect(searchUrl).toContain(`query=${lat.toFixed(6)},${lng.toFixed(6)}`);

      // Ensure latitude and longitude are never inverted (73.8553 is never latitude)
      expect(embedUrl).not.toContain(`q=${lng.toFixed(6)},${lat.toFixed(6)}`);
    });

    it('processes positions safely without throwing when console telemetry is enabled', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const mockPos = {
        coords: {
          latitude: 18.5204,
          longitude: 73.8567,
          accuracy: 25,
          speed: 0,
          heading: null,
          altitude: null,
        },
        timestamp: Date.now(),
      } as GeolocationPosition;

      const result = await LocationService.processPosition(mockPos);
      expect(result.success).toBe(true);
      expect(result.location?.latitude).toBe(18.5204);
      expect(result.location?.longitude).toBe(73.8567);

      consoleSpy.mockRestore();
    });
  });

  describe('3. Coordinate Boundaries and Fallback Integrity', () => {
    it('rejects invalid latitude/longitude and falls back safely', () => {
      expect(LocationAccuracyService.isValidCoordinate(18.5204, 73.8567)).toBe(true);
      expect(LocationAccuracyService.isValidCoordinate(91.0, 73.8567)).toBe(false);
      expect(LocationAccuracyService.isValidCoordinate(18.5204, 185.0)).toBe(false);
      expect(LocationAccuracyService.isValidCoordinate(0, 0)).toBe(false); // Null island rejection
    });

    it('ensures static Pune fallback preserves central coordinates', () => {
      expect(DEFAULT_PUNE_STATIC_LOCATION.lat).toBe(18.5204);
      expect(DEFAULT_PUNE_STATIC_LOCATION.lng).toBe(73.8567);
      expect(DEFAULT_PUNE_STATIC_LOCATION.isGps).toBeFalsy();
    });
  });
});

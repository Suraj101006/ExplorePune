import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  detectBrowserGps,
  getUserLocation,
  DEFAULT_PUNE_STATIC_LOCATION,
  calculateAccurateDistanceKm,
  getProximityToPlace,
} from '../lib/userLocation';

describe('Never-Fail Hybrid Geolocation Strategy', () => {
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
  });

  it('getUserLocation is an alias of detectBrowserGps', () => {
    expect(getUserLocation).toBe(detectBrowserGps);
  });

  it('Primary Layer: resolves hardware GPS coordinates when geolocation succeeds', async () => {
    const mockPosition = {
      coords: {
        latitude: 18.5204,
        longitude: 73.8567,
        accuracy: 12.5,
        speed: 4.2,
        heading: 90,
        altitude: 560,
      },
    };

    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) => success(mockPosition)),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    };

    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true,
      writable: true,
    });

    const result = await detectBrowserGps();

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.source).toBe('gps');
    expect(result.location?.latitude).toBe(18.5204);
    expect(result.location?.longitude).toBe(73.8567);
    expect(result.accuracyMeters).toBe(13); // rounded
    expect(result.isOutsidePune).toBe(false);
  });

  it('Secondary Fallback Layer: gracefully falls back to IP geolocation when GPS is denied', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((_success, error) => {
        // Code 1 = PERMISSION_DENIED
        error({ code: 1, message: 'User denied geolocation prompt' });
      }),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    };

    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });

    // Mock IP Geolocation API response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        latitude: 18.559,
        longitude: 73.7868,
        city: 'Pune',
        country_name: 'India',
      }),
    } as any);

    const result = await detectBrowserGps();

    expect(result.success).toBe(true);
    expect(result.source).toBe('ip');
    expect(result.location?.latitude).toBe(18.559);
    expect(result.location?.longitude).toBe(73.7868);
    expect(result.city).toBe('Pune');
    expect(result.country).toBe('India');
    expect(result.accuracyMeters).toBe(5000);
  });

  it('Safety Net: returns standard Central Pune location when offline and both layers fail', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((_success, error) => {
        error({ code: 3, message: 'Timeout' });
      }),
    };

    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });

    // Mock fetch error (offline / network error)
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await detectBrowserGps();

    expect(result.success).toBe(true);
    expect(result.source).toBe('default');
    expect(result.location?.lat).toBe(DEFAULT_PUNE_STATIC_LOCATION.lat);
    expect(result.location?.lng).toBe(DEFAULT_PUNE_STATIC_LOCATION.lng);
    expect(result.location?.nameEn).toContain('Central Pune');
  });

  it('calculates accurate distances and proximity correctly', () => {
    // Distance between Shaniwar Wada (18.5196, 73.8553) and Pune Station (18.5284, 73.8739)
    const dist = calculateAccurateDistanceKm(18.5196, 73.8553, 18.5284, 73.8739);
    expect(dist).toBeGreaterThan(1.8);
    expect(dist).toBeLessThan(2.5);

    const proximity = getProximityToPlace(18.5196, 73.8553, 18.5198, 73.8554);
    expect(proximity.isArrived).toBe(true);
  });
});

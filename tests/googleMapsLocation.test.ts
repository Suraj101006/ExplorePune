import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsSearchUrl,
  fallbackPuneLocalityMatch,
  reverseGeocodeGoogleMaps,
  searchPuneLocationsWithGoogleMaps,
} from '../lib/googleMapsLocation';
import { GET as getReverseRoute } from '../app/api/v1/location/reverse/route';
import { GET as getSearchRoute } from '../app/api/v1/location/search/route';

describe('Google Maps Precision Geolocation & Reverse Geocoding', () => {
  const originalFetch = global.fetch;
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.GOOGLE_MAPS_API_KEY = originalApiKey;
  });

  describe('URL Generators', () => {
    it('creates accurate Google Maps Universal Embed URLs with coordinates and zoom', () => {
      const url = getGoogleMapsEmbedUrl(18.5204, 73.8567, 16);
      expect(url).toContain('https://www.google.com/maps?');
      expect(url).toContain('q=18.520400,73.856700');
      expect(url).toContain('&z=16');
      expect(url).toContain('&output=embed');
    });

    it('creates accurate Google Maps Search URLs with coordinates', () => {
      const url = getGoogleMapsSearchUrl(18.5204, 73.8567);
      expect(url).toBe('https://www.google.com/maps/search/?api=1&query=18.520400,73.856700');
    });
  });

  describe('fallbackPuneLocalityMatch (Pune Spatial Engine)', () => {
    it('matches nearest Pune locality for Central Pune coordinates', () => {
      const result = fallbackPuneLocalityMatch(18.5204, 73.8567, false);
      expect(result.success).toBe(true);
      expect(result.source).toBe('pune_spatial_engine');
      expect(result.isOutsidePune).toBe(false);
      expect(result.distanceFromCenterKm).toBeLessThan(1);
      expect(result.addressDetails.googleMapsUrl).toContain('18.520400,73.856700');
      expect(result.addressDetails.googleMapsEmbedUrl).toContain('output=embed');
    });

    it('accurately identifies points outside Pune Metropolitan Region', () => {
      // Mumbai coordinates (~120 km from Pune)
      const result = fallbackPuneLocalityMatch(18.922, 72.8347, false);
      expect(result.isOutsidePune).toBe(true);
      expect(result.distanceFromCenterKm).toBeGreaterThan(90);
      expect(result.nameEn).toContain('Pune Region');
    });

    it('supports Marathi localization in fallback', () => {
      const result = fallbackPuneLocalityMatch(18.5204, 73.8567, true);
      expect(result.nameMr).toContain('पुणे');
    });
  });

  describe('reverseGeocodeGoogleMaps', () => {
    it('returns successful Google Maps API parsed result when geocoding response is OK', async () => {
      process.env.GOOGLE_MAPS_API_KEY = 'mock-google-maps-api-key';

      const mockApiResponse = {
        status: 'OK',
        results: [
          {
            formatted_address: 'Fergusson College Rd, Deccan Gymkhana, Pune, Maharashtra 411004, India',
            place_id: 'ChIJdeccan12345',
            address_components: [
              { long_name: 'Fergusson College Road', types: ['route'] },
              { long_name: 'Deccan Gymkhana', types: ['sublocality_level_1', 'sublocality'] },
              { long_name: 'Pune', types: ['locality'] },
              { long_name: '411004', types: ['postal_code'] },
              { long_name: 'India', types: ['country'] },
            ],
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      } as any);

      // Use unique coordinates so cached fallback from earlier test is not hit
      const result = await reverseGeocodeGoogleMaps(18.5188, 73.8422, 'en');
      expect(result.success).toBe(true);
      expect(result.source).toBe('google_maps_api');
      expect(result.addressDetails.sublocality).toBe('Deccan Gymkhana');
      expect(result.addressDetails.route).toBe('Fergusson College Road');
      expect(result.addressDetails.postalCode).toBe('411004');
      expect(result.addressDetails.formattedAddress).toContain('Fergusson College Rd');
    });

    it('falls back gracefully to Pune spatial engine if fetch rejects or fails', async () => {
      process.env.GOOGLE_MAPS_API_KEY = 'mock-google-maps-api-key';
      global.fetch = vi.fn().mockRejectedValue(new Error('Network timeout'));

      const result = await reverseGeocodeGoogleMaps(18.5074, 73.8077, 'en');
      expect(result.success).toBe(true);
      expect(result.source).toBe('pune_spatial_engine');
      expect(result.nameEn).toContain('Kothrud');
    });
  });

  describe('searchPuneLocationsWithGoogleMaps', () => {
    it('searches and finds matching locations across Pune', async () => {
      const results = await searchPuneLocationsWithGoogleMaps('Kothrud', 'en');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].latitude).toBeCloseTo(18.5074, 1);
      expect(results[0].addressDetails.googleMapsUrl).toBeDefined();
    });
  });

  describe('Next.js API Endpoints (/api/v1/location/reverse and /search)', () => {
    it('GET /api/v1/location/reverse validates parameters and returns reverse-geocoded location', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/location/reverse?lat=18.5204&lng=73.8567&lang=en');
      const res = await getReverseRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.latitude).toBeCloseTo(18.5204, 3);
      expect(json.data.longitude).toBeCloseTo(73.8567, 3);
      expect(json.data.addressDetails.googleMapsEmbedUrl).toContain('output=embed');
    });

    it('GET /api/v1/location/reverse returns 400 when lat or lng is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/location/reverse?lat=abc');
      const res = await getReverseRoute(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('INVALID_COORDINATES');
    });

    it('GET /api/v1/location/search finds Pune locations for valid query', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/location/search?q=Baner&lang=en');
      const res = await getSearchRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.data[0].nameEn).toContain('Baner');
    });

    it('GET /api/v1/location/search returns 400 when query is empty', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/location/search?q=');
      const res = await getSearchRoute(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('INVALID_QUERY');
    });
  });
});

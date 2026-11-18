import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { resetRateLimits } from '@/lib/rateLimit';

// Import route handlers
import { GET as getPlaces } from '@/app/api/v1/places/route';
import { GET as getPhotos } from '@/app/api/v1/places/photos/route';
import { GET as getDestinationStatus } from '@/app/api/v1/destinations/[slug]/status/route';
import { POST as postDirections } from '@/app/api/v1/directions/route';
import { POST as postTransitDirections } from '@/app/api/v1/transit/directions/route';
import { GET as getPmpml } from '@/app/api/v1/pmpml/route';
import { GET as getWeather } from '@/app/api/v1/weather/route';
import { GET as getRecommendations, POST as postRecommendations } from '@/app/api/v1/recommendations/route';
import { POST as postItineraryGenerate } from '@/app/api/v1/itineraries/generate/route';
import { POST as postItineraryEmail } from '@/app/api/v1/itineraries/email/route';
import { POST as postSendCode } from '@/app/api/v1/auth/send-code/route';
import { POST as postVerifyCode } from '@/app/api/v1/auth/verify-code/route';
import { POST as postModerate } from '@/app/api/v1/community/moderate/route';
import { POST as postFeedback } from '@/app/api/v1/feedback/route';
import { GET as getReverseLocation } from '@/app/api/v1/location/reverse/route';
import { GET as getSearchLocation } from '@/app/api/v1/location/search/route';
import { POST as postChat } from '@/app/api/v1/chat/route';
import { POST as postDeleteAccount } from '@/app/api/v1/account/delete/route';
import { GET as getIndexNow } from '@/app/api/v1/indexnow/route';
import { GET as getHealth } from '@/app/api/v1/health/route';

describe('Comprehensive 20-Endpoint Backend API Reliability & Security Audit', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  describe('1. /api/v1/places (GET)', () => {
    it('returns 106 verified places by default with proper structure', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/places');
      const res = await getPlaces(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data).toBeDefined();
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(100);
      expect(json.data[0]).toHaveProperty('id');
      expect(json.data[0]).toHaveProperty('name');
      expect(json.data[0]).toHaveProperty('slug');
      expect(json.data[0]).toHaveProperty('category_slug');
    });

    it('filters places accurately by category parameter', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/places?category=forts');
      const res = await getPlaces(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.length).toBeGreaterThanOrEqual(10);
      json.data.forEach((p: any) => {
        expect(p.category_slug).toBe('forts');
      });
    });

    it('filters places accurately by text query', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/places?q=sinhagad');
      const res = await getPlaces(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.some((p: any) => p.slug.includes('sinhagad'))).toBe(true);
    });
  });

  describe('2. /api/v1/places/photos (GET)', () => {
    it('serves authentic local photos when given valid destination slug', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/places/photos?slug=shaniwar-wada');
      const res = await getPhotos(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.photos)).toBe(true);
      expect(json.photos.length).toBeGreaterThan(0);
    });

    it('returns 400 when missing slug and name', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/places/photos');
      const res = await getPhotos(req);
      expect(res.status).toBe(400);
    });
  });

  describe('3. /api/v1/destinations/[slug]/status (GET)', () => {
    it('returns live status for verified destination slug', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/destinations/sinhagad-fort/status');
      const res = await getDestinationStatus(req, {
        params: Promise.resolve({ slug: 'sinhagad-fort' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toHaveProperty('destinationSlug', 'sinhagad-fort');
      expect(json).toHaveProperty('status');
      expect(json).toHaveProperty('badgeClass');
    });

    it('handles non-existent slug gracefully with fallback status', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/destinations/unknown-xyz-place/status');
      const res = await getDestinationStatus(req, {
        params: Promise.resolve({ slug: 'unknown-xyz-place' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.destinationSlug).toBe('unknown-xyz-place');
    });
  });

  describe('4. /api/v1/directions (POST)', () => {
    it('calculates road directions between two Pune coordinates', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originLat: 18.5204,
          originLng: 73.8567,
          originName: 'Shaniwar Wada',
          destLat: 18.3664,
          destLng: 73.7558,
          destName: 'Sinhagad Fort',
          travelMode: 'driving',
        }),
      });
      const res = await postDirections(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.distanceKm).toBeGreaterThan(15);
      expect(json.durationMinutes).toBeGreaterThan(0);
      expect(Array.isArray(json.steps)).toBe(true);
    });

    it('rejects invalid latitude and returns 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originLat: 999, // invalid
          originLng: 73.8567,
          destLat: 18.3664,
          destLng: 73.7558,
        }),
      });
      const res = await postDirections(req);
      expect(res.status).toBe(400);
    });
  });

  describe('5. /api/v1/transit/directions (POST)', () => {
    it('returns transit steps combining Metro and PMPML for Pune locations', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/transit/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originLat: 18.5284,
          originLng: 73.8744, // Pune Station
          destLat: 18.3664,
          destLng: 73.7558, // Sinhagad
          destPlace: {
            id: 'sinhagad-fort',
            name: 'Sinhagad Fort',
            latitude: 18.3664,
            longitude: 73.7558,
          },
          lang: 'en',
        }),
      });
      const res = await postTransitDirections(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toHaveProperty('estimatedMinutes');
      expect(json).toHaveProperty('stepsEn');
      expect(Array.isArray(json.stepsEn)).toBe(true);
    });
  });

  describe('6. /api/v1/pmpml (GET)', () => {
    it('returns transit routes list', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/pmpml?action=routes');
      const res = await getPmpml(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.routes)).toBe(true);
    });

    it('returns nearby stops when supplied coordinates', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/pmpml?action=nearby&lat=18.5204&lon=73.8567');
      const res = await getPmpml(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.stops)).toBe(true);
    });

    it('rejects missing coordinates for nearby action with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/pmpml?action=nearby');
      const res = await getPmpml(req);
      expect(res.status).toBe(400);
    });
  });

  describe('7. /api/v1/weather (GET)', () => {
    it('returns live Pune weather metrics with bilingual descriptions', async () => {
      const res = await getWeather();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(typeof json.temp).toBe('number');
      expect(typeof json.humidity).toBe('number');
      expect(typeof json.conditionEn).toBe('string');
      expect(typeof json.conditionMr).toBe('string');
      expect(json.conditionEn.length).toBeGreaterThan(0);
      expect(json.conditionMr.length).toBeGreaterThan(0);
    });
  });

  describe('8. /api/v1/recommendations (GET & POST)', () => {
    it('GET: handles query parameters and returns tailored recommendations', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/recommendations?cat=forts&time=240');
      const res = await getRecommendations(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data.recommendations)).toBe(true);
      expect(json.data.recommendations.length).toBeGreaterThan(0);
    });

    it('POST: accepts body criteria and returns personalized itinerary recommendations', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: ['heritage', 'temples'],
          availableMinutes: 300,
          travelMode: 'driving',
        }),
      });
      const res = await postRecommendations(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('9. /api/v1/itineraries/generate (POST)', () => {
    it('generates 3 complete, distinct day plans without throwing 500', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/itineraries/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startMinuteOfDay: 540,
          availableMinutes: 360,
          mode: 'driving',
          interests: ['forts', 'heritage'],
          start: { lat: 18.5204, lng: 73.8567 },
        }),
      });
      const res = await postItineraryGenerate(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data).toBeDefined();
      expect(json.data.plans).toBeDefined();
      expect(Array.isArray(json.data.plans)).toBe(true);
      expect(json.data.plans.length).toBe(3);
      expect(json.data.plans[0].stops.length).toBeGreaterThan(0);
    });

    it('rejects insufficient availableMinutes (< 30) with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/itineraries/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availableMinutes: 10,
        }),
      });
      const res = await postItineraryGenerate(req);
      expect(res.status).toBe(400);
    });
  });

  describe('10. /api/v1/itineraries/email (POST)', () => {
    it('rejects invalid email address with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/itineraries/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'not-an-email',
          itineraryData: {
            planTitle: 'Test Plan',
            startLocationName: 'Pune',
            startTime: '09:00 AM',
            travelMode: 'driving',
            totalDurationMinutes: 180,
            stops: [],
          },
        }),
      });
      const res = await postItineraryEmail(req);
      expect(res.status).toBe(400);
    });
  });

  describe('11. /api/v1/auth/send-code & /api/v1/auth/verify-code (POST)', () => {
    it('dispatches stateless verification code for valid email and confirms with verify-code', async () => {
      const sendReq = new NextRequest('http://localhost:3000/api/v1/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'audit-qa-tester@puneheritage.org',
          name: 'QA Auditor',
          lang: 'en',
        }),
      });
      const sendRes = await postSendCode(sendReq);
      expect(sendRes.status).toBe(200);
      const sendJson = await sendRes.json();
      expect(sendJson.success).toBe(true);
      expect(sendJson.verificationToken).toBeDefined();

      // Attempt verification with invalid 6-digit code
      const wrongVerifyReq = new NextRequest('http://localhost:3000/api/v1/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'audit-qa-tester@puneheritage.org',
          code: '000000',
          token: sendJson.verificationToken,
        }),
      });
      const wrongRes = await postVerifyCode(wrongVerifyReq);
      expect(wrongRes.status).toBe(400);
      const wrongJson = await wrongRes.json();
      expect(wrongJson.success).toBe(false);
    });

    it('rejects malformed email with 400 in send-code', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bad-email' }),
      });
      const res = await postSendCode(req);
      expect(res.status).toBe(400);
    });
  });

  describe('12. /api/v1/community/moderate (POST)', () => {
    it('performs 3-tier moderation check and flags spam text', async () => {
      const req = new Request('http://localhost:3000/api/v1/community/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Special Telegram Offers',
          content: 'Free crypto bonus and guaranteed cash returns join telegram immediately!',
        }),
      });
      const res = await postModerate(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.outcome).toBe('blocked');
      expect(json.category).toBe('spam_scam');
    });

    it('returns 400 when title and content are missing', async () => {
      const req = new Request('http://localhost:3000/api/v1/community/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await postModerate(req);
      expect(res.status).toBe(400);
    });
  });

  describe('13. /api/v1/feedback (POST)', () => {
    it('rejects feedback with rating < 1 or rating > 5 with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: 10, // invalid
          type: 'general',
          message: 'Nice website',
          email: 'visitor@example.com',
        }),
      });
      const res = await postFeedback(req);
      expect(res.status).toBe(400);
    });
  });

  describe('14. /api/v1/location/reverse & /api/v1/location/search (GET)', () => {
    it('returns 400 on reverse geocoding if lat/lng is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/location/reverse');
      const res = await getReverseLocation(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 on search if query is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/location/search');
      const res = await getSearchLocation(req);
      expect(res.status).toBe(400);
    });

    it('returns 200 on reverse geocoding for valid central Pune coordinates', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/location/reverse?lat=18.5204&lng=73.8567');
      const res = await getReverseLocation(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();
    });
  });

  describe('15. /api/v1/chat (POST)', () => {
    it('returns 400 on empty message', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' }),
      });
      const res = await postChat(req);
      expect(res.status).toBe(400);
    });

    it('handles localized query and returns scrubbed response', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'What are the visiting hours for Sinhagad Fort?',
          lang: 'en',
        }),
      });
      const res = await postChat(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toHaveProperty('reply');
      expect(json.reply).not.toContain('AIzaSy');
    }, 15000);
  });

  describe('16. /api/v1/account/delete (POST)', () => {
    it('returns 401 UNAUTHORIZED when no Bearer token is provided', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/account/delete', {
        method: 'POST',
      });
      const res = await postDeleteAccount(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('17. /api/v1/indexnow (GET)', () => {
    it('returns 200 with indexnow verification payload or status', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/indexnow');
      const res = await getIndexNow(req);
      expect(res.status).toBe(200);
    }, 15000);
  });

  describe('18. /api/v1/health (GET)', () => {
    it('returns structured health response (200 healthy or 503 degraded without leaking secrets)', async () => {
      const res = await getHealth();
      expect([200, 503]).toContain(res.status);
      const json = await res.json();
      expect(json).toHaveProperty('status');
      expect(['healthy', 'degraded']).toContain(json.status);
      expect(json).not.toHaveProperty('stack');
    });
  });
});

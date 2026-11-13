import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  recommendDestinations,
  parseRecommendationQuery,
  PUNE_REFERENCE_HUBS,
  PUNE_CULINARY_PITSTOPS,
  estimateTransitMinutes,
  isPlaceOpenAtHour,
} from '@/lib/recommendationEngine';
import { GET as recommendationsGet, POST as recommendationsPost } from '@/app/api/v1/recommendations/route';
import { NextRequest } from 'next/server';
import robots from '@/app/robots';

describe('Advanced SEO, GEO, AEO & AI-Powered Discovery Engine', () => {
  const rootDir = path.resolve(__dirname, '..');

  describe('1. GEO & AI Knowledge Discovery Files (llms.txt & llms-full.txt)', () => {
    it('verifies public/llms.txt exists with structured markdown specification', () => {
      const llmsPath = path.join(rootDir, 'public', 'llms.txt');
      expect(fs.existsSync(llmsPath)).toBe(true);
      const content = fs.readFileSync(llmsPath, 'utf8');

      expect(content).toContain('# Explore Pune');
      expect(content).toContain('https://explorepune-guide.vercel.app');
      expect(content).toContain('Sinhagad Fort');
      expect(content).toContain('Shaniwar Wada');
      expect(content).toContain('Pataleshwar Cave Temple');
      expect(content).toContain('Pune Metro');
      expect(content).toContain('llms-full.txt');
    });

    it('verifies public/llms-full.txt documents all 106+ verified destinations with exact coordinates', () => {
      const fullPath = path.join(rootDir, 'public', 'llms-full.txt');
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, 'utf8');

      expect(content).toContain('Total Destinations Documented: 106');
      expect(content).toContain('Sinhagad Fort');
      expect(content).toContain('Shaniwar Wada');
      expect(content).toContain('Aga Khan Palace');
      expect(content).toContain('Coordinates');
      expect(content).toContain('Visiting Hours');
      expect(content).toContain('Admission Fee');
      expect(content).toContain('Recommended Visit Duration');
    });

    it('verifies robots.txt explicitly allows llms.txt, llms-full.txt, and sitemaps for all AI crawlers', () => {
      const robotsData = robots();
      expect(robotsData.rules).toBeDefined();

      const rulesArray = Array.isArray(robotsData.rules) ? robotsData.rules : [robotsData.rules];
      const allowList = rulesArray[0].allow as string[];

      expect(allowList).toContain('/llms.txt');
      expect(allowList).toContain('/llms-full.txt');
      expect(allowList).toContain('/sitemap.xml');
    });
  });

  describe('2. AI Personalized Destination Recommendation Engine (PART 7)', () => {
    it('parses complex natural language intent: "I have two hours near FC Road. I want historical places and local food."', () => {
      const query = 'I have two hours near FC Road. I want historical places and local food.';
      const criteria = parseRecommendationQuery(query);

      expect(criteria.availableMinutes).toBe(120);
      expect(criteria.startingLocation).toBeDefined();
      expect(criteria.startingLocation?.lat).toBeCloseTo(PUNE_REFERENCE_HUBS['fc-road'].lat, 3);
      expect(criteria.interests).toContain('heritage');
      expect(criteria.interests).toContain('food');
    });

    it('generates ranked recommendations matching 2 hours near FC Road with transparent match reasons', () => {
      const result = recommendDestinations({
        startingLocation: PUNE_REFERENCE_HUBS['fc-road'],
        availableMinutes: 120,
        interests: ['heritage'],
        travelMode: 'driving',
      });

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.totalEstimatedMinutes).toBeLessThanOrEqual(150); // within realistic threshold

      const topPick = result.recommendations[0];
      expect(topPick.matchScore).toBeGreaterThanOrEqual(70);
      expect(topPick.matchReasons.length).toBeGreaterThanOrEqual(2);
      expect(topPick.distanceKm).toBeDefined();
      expect(topPick.visitDurationMinutes).toBeDefined();

      // Check for transparent explanation wording
      const reasonText = topPick.matchReasons.join(' ');
      expect(reasonText).toMatch(/(km|distance|interest|heritage|fits|budget|open)/i);
    });

    it('respects zero budget constraint (free entry only)', () => {
      const result = recommendDestinations({
        startingLocation: PUNE_REFERENCE_HUBS['deccan'],
        availableMinutes: 180,
        budgetInr: 0,
        interests: ['temples', 'heritage'],
      });

      expect(result.recommendations.length).toBeGreaterThan(0);
      result.recommendations.forEach((rec) => {
        expect(rec.estimatedCostInr).toBe(0);
        expect(rec.place.fee_status === 'free' || rec.place.entry_fee === 0).toBe(true);
      });
    });

    it('associates authentic local culinary stops near the recommended route', () => {
      const result = recommendDestinations({
        startingLocation: PUNE_REFERENCE_HUBS['fc-road'],
        availableMinutes: 120,
        interests: ['heritage', 'food'],
      });

      expect(result.foodSuggestions.length).toBeGreaterThan(0);
      const foodNames = result.foodSuggestions.map((f) => f.name).join(' ');
      expect(foodNames).toMatch(/(Vaishali|Rupali|Bedekar|Chitale|Sujata)/i);
    });

    it('calculates realistic travel times for different transportation modes', () => {
      // 3 km trip
      const walk = estimateTransitMinutes(18.52, 73.84, 18.54, 73.86, 'walking');
      const drive = estimateTransitMinutes(18.52, 73.84, 18.54, 73.86, 'driving');

      expect(walk.durationMinutes).toBeGreaterThan(drive.durationMinutes);
    });

    it('accurately verifies operating hours', () => {
      const placeWithHours: any = {
        name: 'Test Monument',
        place_hours: [{ opens_at: '9:00 AM', closes_at: '5:30 PM' }],
      };

      expect(isPlaceOpenAtHour(placeWithHours, 11)).toBe(true); // 11 AM is open
      expect(isPlaceOpenAtHour(placeWithHours, 21)).toBe(false); // 9 PM is closed
    });
  });

  describe('3. Recommendations API Route (/api/v1/recommendations)', () => {
    it('serves GET recommendations from natural language query parameter', async () => {
      const req = new NextRequest(
        'http://localhost:3000/api/v1/recommendations?q=2+hours+near+FC+Road+heritage',
        { method: 'GET' }
      );
      const res = await recommendationsGet(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.recommendations).toBeDefined();
      expect(json.data.recommendations.length).toBeGreaterThan(0);
    });

    it('serves POST recommendations with structured JSON constraints', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/recommendations', {
        method: 'POST',
        body: JSON.stringify({
          startingLocation: { lat: 18.5283, lng: 73.8407, name: 'FC Road' },
          availableMinutes: 120,
          budgetInr: 50,
          interests: ['heritage'],
          travelMode: 'driving',
        }),
      });
      const res = await recommendationsPost(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.recommendations.length).toBeGreaterThan(0);
    });
  });
});

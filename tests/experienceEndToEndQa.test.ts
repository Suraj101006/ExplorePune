import { describe, it, expect } from 'vitest';
import { getAllPlaces, getPlaceBySlug } from '../lib/experience/selectors';
import {
  PUNE_TALUKAS,
  calculateDistanceKm,
  formatCoordinatesDD,
  formatCoordinatesDMS,
  getElevationEstimate,
  getTalukaOrRegion,
} from '../lib/experience/puneDistrictData';
import { DISCOVERY_MISSIONS } from '../components/experience/DiscoveryMissionsModal';
import { MASTER_ACHIEVEMENTS } from '../lib/experience/achievements';
import { checkArrivalThreshold, createAccuracyCircleGeoJson } from '../lib/experience/navigationEngine';

describe('Explore Pune — Complete End-to-End QA & Verification Suite', () => {
  describe('1. Geographical Ground Truth & Integrity (106 Places & 15 Talukas)', () => {
    const allPlaces = getAllPlaces();

    it('verifies exact count of 106 unique destinations without duplicates or omissions', () => {
      expect(allPlaces.length).toBe(106);
      const slugs = new Set(allPlaces.map((p) => p.slug));
      expect(slugs.size).toBe(106);
    });

    it('confirms every destination has valid coordinates strictly inside Pune District boundaries', () => {
      allPlaces.forEach((p) => {
        expect(typeof p.latitude).toBe('number');
        expect(typeof p.longitude).toBe('number');
        expect(isNaN(p.latitude)).toBe(false);
        expect(isNaN(p.longitude)).toBe(false);

        // Pune District bounds: 17.8° - 19.4° N, 73.2° - 75.2° E
        expect(p.latitude).toBeGreaterThanOrEqual(17.8);
        expect(p.latitude).toBeLessThanOrEqual(19.4);
        expect(p.longitude).toBeGreaterThanOrEqual(73.2);
        expect(p.longitude).toBeLessThanOrEqual(75.2);
      });
    });

    it('verifies all 15 official Pune Talukas have non-null geographic centroids and bounds', () => {
      expect(PUNE_TALUKAS.length).toBe(15);

      const expectedTalukas = [
        'pune-city',
        'haveli',
        'pcmc',
        'maval',
        'mulshi',
        'bhor',
        'velhe',
        'purandar',
        'baramati',
        'indapur',
        'daund',
        'shirur',
        'khed',
        'junnar',
        'ambegaon',
      ];

      expectedTalukas.forEach((id) => {
        const taluka = PUNE_TALUKAS.find((t) => t.id === id);
        expect(taluka, `Taluka ${id} must exist`).toBeDefined();
        expect(taluka?.nameEn).toBeTruthy();
        expect(taluka?.nameMr).toBeTruthy();
        expect(taluka?.centroid.length).toBe(2);
        expect(taluka?.bounds.length).toBe(2);
      });
    });

    it('validates every landmark maps cleanly to one of the 7 official categories', () => {
      const allowedCategories = new Set([
        'forts',
        'heritage',
        'temples',
        'museums',
        'parks',
        'nature',
        'food',
      ]);

      allPlaces.forEach((p) => {
        expect(allowedCategories.has(p.category_slug), `Category ${p.category_slug} must be valid`).toBe(true);
      });
    });
  });

  describe('2. Open-World Gameplay & Discovery Systems', () => {
    it('verifies all 7 Discovery Missions contain valid stops in the 106 database', () => {
      expect(DISCOVERY_MISSIONS.length).toBe(7);

      DISCOVERY_MISSIONS.forEach((mission) => {
        expect(mission.id).toBeTruthy();
        expect(mission.code).toMatch(/^MSN-0[1-7]$/);
        expect(mission.stopSlugs.length).toBeGreaterThanOrEqual(5);

        mission.stopSlugs.forEach((slug) => {
          const place = getPlaceBySlug(slug);
          expect(place, `Mission ${mission.code} references missing place: ${slug}`).toBeDefined();
        });
      });
    });

    it('verifies all Master Exploration Trophies have unique IDs, XP values, and icons', () => {
      expect(MASTER_ACHIEVEMENTS.length).toBeGreaterThanOrEqual(10);

      const ids = new Set<string>();
      let totalXp = 0;

      MASTER_ACHIEVEMENTS.forEach((a) => {
        expect(ids.has(a.id), `Trophy ID ${a.id} must be unique`).toBe(false);
        ids.add(a.id);
        expect(a.titleEn).toBeTruthy();
        expect(a.titleMr).toBeTruthy();
        expect(a.xp).toBeGreaterThan(0);
        totalXp += a.xp;
      });

      expect(totalXp).toBeGreaterThanOrEqual(500);
    });

    it('verifies GPS arrival threshold triggers reliably at 150m boundary', () => {
      const targetCoords = { latitude: 18.5196, longitude: 73.8553 }; // Shaniwar Wada

      // User 50 meters away (arrived)
      const userNearby = { latitude: 18.5198, longitude: 73.8555 };
      expect(checkArrivalThreshold(userNearby, targetCoords).hasArrived).toBe(true);

      // User 800 meters away (not arrived)
      const userFar = { latitude: 18.5268, longitude: 73.8553 };
      expect(checkArrivalThreshold(userFar, targetCoords).hasArrived).toBe(false);
    });
  });

  describe('3. Coordinate Formatting & Spatial Calculations', () => {
    it('formats Decimal Degrees (DD) and DMS accurately', () => {
      const lat = 18.520433;
      const lng = 73.856744;

      const dd = formatCoordinatesDD(lat, lng, 4);
      expect(dd).toBe('18.5204° N, 73.8567° E');

      const dms = formatCoordinatesDMS(lat, lng);
      expect(dms.latDMS).toContain("18° 31' 14\" N");
      expect(dms.lngDMS).toContain("73° 51' 24\" E");
    });

    it('estimates Sahyadri fort elevations higher than river basin plains', () => {
      const sinhagadElev = getElevationEstimate(18.3664, 73.7558, 'forts');
      const shaniwarElev = getElevationEstimate(18.5196, 73.8553, 'heritage');

      expect(sinhagadElev).toBeGreaterThan(1200);
      expect(shaniwarElev).toBeLessThan(650);
      expect(sinhagadElev - shaniwarElev).toBeGreaterThan(600);
    });

    it('generates an exact GeoJSON circle polygon for GPS accuracy radius display', () => {
      const accuracyMeters = 30;
      const circle = createAccuracyCircleGeoJson(18.5204, 73.8567, accuracyMeters);

      expect(circle.type).toBe('Feature');
      expect(circle.geometry.type).toBe('Polygon');
      expect(circle.geometry.coordinates[0].length).toBe(33); // 32 segments + 1 closing point
    });
  });

  describe('4. Regression Safety & Component Integrity', () => {
    it('verifies flagship landmark slugs match existing places in database', () => {
      const flagships = [
        'shaniwar-wada',
        'sinhagad-fort',
        'rajgad-fort',
        'shivneri-fort',
        'tiger-point-lonavala',
        'shreemant-dagdusheth-halwai-ganpati',
        'aga-khan-palace',
        'bhimashankar-temple',
        'karla-caves',
        'khadakwasla-dam',
      ];

      flagships.forEach((slug) => {
        const p = getPlaceBySlug(slug);
        expect(p, `Flagship ${slug} must exist in places DB`).toBeDefined();
      });
    });
  });
});

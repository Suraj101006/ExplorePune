import { describe, it, expect } from 'vitest';
import { getPublicTransitRoute } from '../lib/publicTransit';
import { ALL_STRUCTURED_PLACES } from '../lib/chatKnowledgeEngine';
import * as fs from 'fs';
import * as path from 'path';

describe('Sinhagad Transit Multimodal Routing & Loading States Verification', () => {
  const sinhagadPlace = ALL_STRUCTURED_PLACES.find((p) => p.slug === 'sinhagad-fort');

  it('verifies Sinhagad Fort exists in PLACES registry', () => {
    expect(sinhagadPlace).toBeDefined();
    expect(sinhagadPlace?.latitude).toBeCloseTo(18.3663, 3);
    expect(sinhagadPlace?.longitude).toBeCloseTo(73.7558, 3);
  });

  it('calculates multimodal transit to Sinhagad from Pune Station without absurd 204 min walk from Vanaz', () => {
    expect(sinhagadPlace).toBeDefined();
    if (!sinhagadPlace) return;

    // Origin: Pune Station
    const route = getPublicTransitRoute(18.5284, 73.8739, sinhagadPlace, 'en');

    // Nearest metro should NOT suggest walking 17km / 204 minutes from Vanaz
    expect(route.nearestMetro).toBeDefined();
    expect(route.nearestMetro?.stationNameEn).toContain('Swargate');
    expect(route.nearestMetro?.isDirectWalk).toBe(false);
    expect(route.nearestMetro?.transferNoteEn).toBeDefined();
    expect(route.nearestMetro?.transferNoteEn).toContain('Swargate');
    expect(route.nearestMetro?.transferNoteEn).toContain('Bus 50');

    // Walking minutes should be concourse transfer time (<= 5 min), NOT 204 min!
    expect(route.nearestMetro?.walkingMinutes).toBeLessThanOrEqual(5);

    // Summary and step-by-step instructions should explicitly cite Bus 50 to Donje
    expect(route.summaryEn).toContain('Bus 50');
    expect(route.summaryEn).toContain('Donje');

    const allSteps = route.stepByStepEn.join(' ');
    expect(allSteps).toContain('Bus 50');
    expect(allSteps).toContain('Donje');
    expect(allSteps).toContain('51 & 52');
  });

  it('validates metro viability cutoff for distant destination without direct rule', () => {
    // Artificial destination > 2.2 km away from any metro and without metroAdvised rule
    const mockFarPlace = {
      ...sinhagadPlace!,
      slug: 'mock-far-place',
      latitude: 18.2, // ~35 km south
      longitude: 73.8,
    };

    const route = getPublicTransitRoute(18.5284, 73.8739, mockFarPlace, 'en');
    // Should be undefined because it is > 2.2km and has no direct multimodal rule
    expect(route.nearestMetro).toBeUndefined();
  });

  it('validates metro viability for near landmark (e.g. Shaniwar Wada)', () => {
    const shaniwarPlace = ALL_STRUCTURED_PLACES.find((p) => p.slug === 'shaniwar-wada');
    expect(shaniwarPlace).toBeDefined();
    if (!shaniwarPlace) return;

    const route = getPublicTransitRoute(18.5284, 73.8739, shaniwarPlace, 'en');
    expect(route.nearestMetro).toBeDefined();
    expect(route.nearestMetro?.isDirectWalk).toBe(true);
    expect(route.nearestMetro?.distanceKm).toBeLessThanOrEqual(2.2);
  });

  it('verifies WebsiteGuideClient verification claims are harmonized with Data Methodology', () => {
    const guideFile = fs.readFileSync(
      path.resolve(__dirname, '../components/WebsiteGuideClient.tsx'),
      'utf-8'
    );

    // Should not contain absolute "100% verified archival & field data"
    expect(guideFile).not.toContain('100% verified archival & field data');
    // Should contain multi-tier verification terminology
    expect(guideFile).toContain('Multi-tier verified archival provenance & physical coordinates');
    expect(guideFile).toContain('त्रिस्तरीय पडताळणी');
  });

  it('verifies PlaceDetailClient provides accessible rich loading states for Map and TransitRouteMap', () => {
    const detailFile = fs.readFileSync(
      path.resolve(__dirname, '../components/PlaceDetailClient.tsx'),
      'utf-8'
    );

    // Bare text placeholders must NOT be present
    expect(detailFile).not.toContain('<span>🗺️ Loading Interactive Map…</span>');
    expect(detailFile).not.toContain('<span>🚍 Loading Transit Route…</span>');

    // Rich region placeholders must be present
    expect(detailFile).toContain('role="region"');
    expect(detailFile).toContain('aria-label="Loading interactive landmark map"');
    expect(detailFile).toContain('aria-label="Loading public transit route map"');
    expect(detailFile).toContain('Interactive Map &amp; GPS Coordinates');
  });
});

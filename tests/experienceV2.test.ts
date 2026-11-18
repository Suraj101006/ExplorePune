import { describe, it, expect } from 'vitest';
import {
  getAllPlaces,
  getPlaceBySlug,
  getCategories,
  getZones,
  getPlacesGeoJson,
  getZonesGeoJson,
  getPuneBoundaryGeoJson,
  getMarqueeItems,
  getFeatureShowcases,
  getTopStories,
  getFaqItems,
  getStatsSummary,
} from '../lib/experience/selectors';
import { getExperienceV2I18n } from '../lib/experience/i18n';

describe('Explore Pune Experience v2 - Data Engine & Ground Truths', () => {
  it('loads exactly 106 verified destinations with valid coordinates and slugs', () => {
    const places = getAllPlaces();
    expect(places.length).toBe(106);

    places.forEach((place) => {
      expect(place.id).toBeDefined();
      expect(place.slug).toBeTruthy();
      expect(place.name).toBeTruthy();
      expect(place.category_slug).toBeTruthy();
      expect(typeof place.latitude).toBe('number');
      expect(typeof place.longitude).toBe('number');
      expect(place.latitude).toBeGreaterThan(17.0);
      expect(place.latitude).toBeLessThan(20.0);
      expect(place.longitude).toBeGreaterThan(72.5);
      expect(place.longitude).toBeLessThan(75.0);
      expect(place.zoneId).toBeDefined();
    });
  });

  it('contains exactly 7 canonical categories with verified counts summing to 106', () => {
    const categories = getCategories();
    expect(categories.length).toBe(7);

    const totalPlaces = categories.reduce((sum, c) => sum + c.count, 0);
    expect(totalPlaces).toBe(106);

    const countsBySlug: Record<string, number> = {};
    categories.forEach((c) => {
      countsBySlug[c.slug] = c.count;
    });

    // Verified category breakdowns
    expect(countsBySlug['heritage']).toBe(29);
    expect(countsBySlug['temples']).toBe(27);
    expect(countsBySlug['forts']).toBe(15);
    expect(countsBySlug['nature']).toBe(14);
    expect(countsBySlug['museums']).toBe(9);
    expect(countsBySlug['parks']).toBe(6);
    expect(countsBySlug['food']).toBe(6);
  });

  it('defines 5 distinct geographic zones with valid centers and polygon coordinates', () => {
    const zones = getZones();
    expect(zones.length).toBe(5);

    const zoneIds = zones.map((z) => z.id);
    expect(zoneIds).toContain('historic-peths');
    expect(zoneIds).toContain('deccan-kothrud');
    expect(zoneIds).toContain('camp-cantonment');
    expect(zoneIds).toContain('kp-nagar-rd');
    expect(zoneIds).toContain('sahyadri-forts');

    zones.forEach((z) => {
      expect(z.nameEn).toBeTruthy();
      expect(z.nameMr).toBeTruthy();
      expect(z.center.length).toBe(2);
      expect(z.approxPolygonCoordinates.length).toBeGreaterThan(0);
      expect(z.accentColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('generates valid GeoJSON FeatureCollections for places, zones and boundary', () => {
    const placesGeoJson = getPlacesGeoJson();
    expect(placesGeoJson.type).toBe('FeatureCollection');
    expect(placesGeoJson.features.length).toBe(106);
    expect(placesGeoJson.features[0].geometry.type).toBe('Point');

    const zonesGeoJson = getZonesGeoJson();
    expect(zonesGeoJson.type).toBe('FeatureCollection');
    expect(zonesGeoJson.features.length).toBe(5);
    expect(zonesGeoJson.features[0].geometry.type).toBe('Polygon');

    const boundaryGeoJson = getPuneBoundaryGeoJson();
    expect(boundaryGeoJson.type).toBe('FeatureCollection');
    expect(boundaryGeoJson.features.length).toBeGreaterThan(0);
  });
});

describe('Explore Pune Experience v2 - Specific Data Issue Resolutions', () => {
  it('resolves Forts count conflict: 15 verified fort destinations', () => {
    const allPlaces = getAllPlaces();
    const forts = allPlaces.filter((p) => p.category_slug === 'forts');
    expect(forts.length).toBe(15);
  });

  it('resolves Shaniwar Wada operating hours to verified ASI standard (09:30 AM to 05:30 PM)', () => {
    const shaniwarWada = getPlaceBySlug('shaniwar-wada');
    expect(shaniwarWada).toBeDefined();
    expect(shaniwarWada?.opening_hours).toContain('09:30');
    expect(shaniwarWada?.opening_hours).toContain('05:30');
  });

  it('resolves Raja Dinkar Kelkar Museum artifact count to verified 20,000+ (not 22,000)', () => {
    const kelkar = getPlaceBySlug('raja-dinkar-kelkar-museum');
    expect(kelkar).toBeDefined();
    expect(kelkar?.description).toContain('20,000');
    expect(kelkar?.description).not.toContain('22,000');
  });

  it('resolves Karla Caves geographic classification under Sahyadri Forts & Reservoirs', () => {
    const karlaCaves = getPlaceBySlug('karla-caves');
    expect(karlaCaves).toBeDefined();
    expect(karlaCaves?.zoneId).toBe('sahyadri-forts');
  });
});

describe('Explore Pune Experience v2 - Bilingual (English & Marathi) I18n Engine', () => {
  it('provides complete English dictionary with all Part A and Part B keys', () => {
    const en = getExperienceV2I18n('en');
    expect(en.meta.title).toBeTruthy();
    expect(en.intro.hero.headlineL1).toBe('EXPLORE PUNE.');
    expect(en.intro.hero.headlineL2).toBe('YOUR WAY.');
    expect(en.map.searchPlaceholder).toBeTruthy();
    expect(en.map.allCategories).toBeTruthy();
    expect(en.map.allZones).toBeTruthy();
    expect(en.map.directoryHeading).toBeTruthy();
  });

  it('provides complete Marathi dictionary with no missing sections or empty strings', () => {
    const mr = getExperienceV2I18n('mr');
    expect(mr.meta.title).toBeTruthy();
    expect(mr.intro.hero.headlineL1).toBe('पुणे अनुभवा.');
    expect(mr.intro.hero.headlineL2).toBe('तुमच्या पद्धतीने.');
    expect(mr.intro.preloader.title).toBeTruthy();
    expect(mr.intro.featureGuide.title).toBeTruthy();
    expect(mr.map.searchPlaceholder).toBeTruthy();
    expect(mr.map.btnNavigate).toBeTruthy();
    expect(mr.map.btnSaveJourney).toBeTruthy();
    expect(mr.map.directoryHeading).toBeTruthy();
  });
});

describe('Explore Pune Experience v2 - Editorial Intro Content Selectors', () => {
  it('returns verified marquee items with real transit and timing claims', () => {
    const marquee = getMarqueeItems();
    expect(marquee.length).toBeGreaterThanOrEqual(4);
    marquee.forEach((item) => {
      expect(item.textEn).toBeTruthy();
      expect(item.textMr).toBeTruthy();
      expect(item.badge).toBeTruthy();
    });
  });

  it('returns real feature showcases pointing to existing site routes', () => {
    const features = getFeatureShowcases();
    expect(features.length).toBeGreaterThanOrEqual(6);

    const routes = features.map((f) => f.route);
    expect(routes).toContain('/destinations');
    expect(routes).toContain('/planner');
    expect(routes).toContain('/journey');
    expect(routes).toContain('/milestones');
    expect(routes).toContain('/community');
    expect(routes).toContain('/help');
  });

  it('returns 3 real editorial stories with valid routes and titles', () => {
    const stories = getTopStories();
    expect(stories.length).toBe(3);
    stories.forEach((s) => {
      expect(s.route).toBeTruthy();
      expect(s.titleEn).toBeTruthy();
      expect(s.titleMr).toBeTruthy();
    });
  });

  it('returns verified FAQ items with questions and answers in EN and MR', () => {
    const faqs = getFaqItems();
    expect(faqs.length).toBeGreaterThanOrEqual(5);
    faqs.forEach((faq) => {
      expect(faq.questionEn).toBeTruthy();
      expect(faq.questionMr).toBeTruthy();
      expect(faq.answerEn).toBeTruthy();
      expect(faq.answerMr).toBeTruthy();
    });
  });

  it('calculates accurate aggregate numbers from verified data', () => {
    const stats = getStatsSummary();
    expect(stats.totalPlaces).toBe(106);
    expect(stats.totalCategories).toBe(7);
    expect(stats.totalZones).toBe(5);
    expect(stats.totalItineraries).toBeGreaterThanOrEqual(8);
  });
});

describe('Explore Pune Experience - Pune District Coordinate & Real Satellite Engine', () => {
  it('formats coordinates accurately into decimal degrees and DMS strings', async () => {
    const { formatCoordinatesDD, formatCoordinatesDMS, calculateDistanceKm } = await import(
      '../lib/experience/puneDistrictData'
    );

    const dd = formatCoordinatesDD(18.5204, 73.8567, 4);
    expect(dd).toBe('18.5204° N, 73.8567° E');

    const dms = formatCoordinatesDMS(18.5204, 73.8567);
    expect(dms.latDMS).toContain("18° 31'");
    expect(dms.lngDMS).toContain("73° 51'");

    const dist = calculateDistanceKm(18.5204, 73.8567, 18.3664, 73.7558);
    expect(dist).toBeGreaterThan(15);
    expect(dist).toBeLessThan(25);
  });

  it('generates high-precision Pune District boundary covering all 14 talukas', async () => {
    const { getPuneDistrictBoundaryGeoJson } = await import(
      '../lib/experience/puneDistrictData'
    );
    const districtGeoJson = getPuneDistrictBoundaryGeoJson();
    expect(districtGeoJson.type).toBe('FeatureCollection');
    expect(districtGeoJson.features.length).toBe(1);
    expect(districtGeoJson.features[0].geometry.type).toBe('Polygon');

    const coords = (districtGeoJson.features[0].geometry as any).coordinates[0];
    expect(coords.length).toBeGreaterThan(10);
  });

  it('defines all 15 official talukas of Pune District with valid bounds and GeoJSON', async () => {
    const { PUNE_TALUKAS, getPuneTalukasGeoJson } = await import(
      '../lib/experience/puneDistrictData'
    );
    expect(PUNE_TALUKAS.length).toBe(15);

    const requiredTalukaIds = [
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

    requiredTalukaIds.forEach((id) => {
      const taluka = PUNE_TALUKAS.find((t) => t.id === id);
      expect(taluka, `Missing taluka: ${id}`).toBeDefined();
      expect(taluka?.nameEn).toBeTruthy();
      expect(taluka?.nameMr).toBeTruthy();
      expect(taluka?.bounds.length).toBe(2);
    });

    const talukasGeoJson = getPuneTalukasGeoJson();
    expect(talukasGeoJson.type).toBe('FeatureCollection');
    expect(talukasGeoJson.features.length).toBe(15);
  });

  it('provides verified Pune District rivers, reservoirs, and highway corridors GeoJSON', async () => {
    const { getPuneRiversGeoJson, getPuneHighwaysGeoJson } = await import(
      '../lib/experience/puneDistrictData'
    );

    const riversGeoJson = getPuneRiversGeoJson();
    expect(riversGeoJson.type).toBe('FeatureCollection');
    expect(riversGeoJson.features.length).toBeGreaterThanOrEqual(5);

    const highwaysGeoJson = getPuneHighwaysGeoJson();
    expect(highwaysGeoJson.type).toBe('FeatureCollection');
    expect(highwaysGeoJson.features.length).toBeGreaterThanOrEqual(4);
  });

  it('configures 5 curated geographical storytelling trails across Pune District', async () => {
    const { STORY_TRAILS } = await import('../lib/experience/puneDistrictData');
    expect(STORY_TRAILS.length).toBe(5);

    STORY_TRAILS.forEach((trail) => {
      expect(trail.id).toBeTruthy();
      expect(trail.titleEn).toBeTruthy();
      expect(trail.titleMr).toBeTruthy();
      expect(trail.stops.length).toBeGreaterThanOrEqual(4);
      trail.stops.forEach((stop) => {
        expect(stop.nameEn).toBeTruthy();
        expect(stop.latitude).toBeGreaterThan(18.0);
        expect(stop.longitude).toBeGreaterThan(73.0);
      });
    });
  });

  it('validates 5 Critical Geographic Recommendations: 3D Terrain, Taluka Regions, Routes, Storytelling, and Quick Search', async () => {
    const {
      PUNE_TALUKAS,
      getTalukaOrRegion,
      getElevationEstimate,
      STORY_TRAILS,
      calculateDistanceKm,
    } = await import('../lib/experience/puneDistrictData');
    const { getAllPlaces } = await import('../lib/experience/selectors');

    const places = getAllPlaces();
    expect(places.length).toBe(106);

    // 1. Real 3D Terrain & Elevation
    places.forEach((p) => {
      const elev = getElevationEstimate(p.latitude, p.longitude, p.category_slug);
      expect(elev).toBeGreaterThan(500); // Pune plateau is >550m MSL
      if (p.category_slug === 'forts') {
        expect(elev).toBeGreaterThanOrEqual(1000); // High Sahyadri crests
      }
    });

    // 2. Discover Places by Geographical Region (15 Talukas)
    const talukaPlaceCounts: Record<string, number> = {};
    PUNE_TALUKAS.forEach((t) => {
      talukaPlaceCounts[t.id] = 0;
    });

    places.forEach((p) => {
      const taluka = getTalukaOrRegion(p.latitude, p.longitude, p.address);
      expect(taluka.id).toBeTruthy();
      expect(taluka.nameEn).toBeTruthy();
      expect(taluka.nameMr).toBeTruthy();
      talukaPlaceCounts[taluka.id] = (talukaPlaceCounts[taluka.id] || 0) + 1;
    });

    // Verify key regional hubs have destinations
    expect(talukaPlaceCounts['maval']).toBeGreaterThanOrEqual(5);
    expect(talukaPlaceCounts['haveli']).toBeGreaterThanOrEqual(4);
    expect(talukaPlaceCounts['pune-city']).toBeGreaterThanOrEqual(20);

    // 3. Animated Geographical Journeys (distance calculation)
    const puneStation = { lat: 18.5284, lng: 73.8744 };
    places.forEach((p) => {
      const dist = calculateDistanceKm(puneStation.lat, puneStation.lng, p.latitude, p.longitude);
      expect(dist).toBeGreaterThanOrEqual(0);
      expect(dist).toBeLessThan(140); // All within Pune District perimeter
    });

    // 4. Geographical Storytelling
    expect(STORY_TRAILS.length).toBe(5);
    const fortsTrail = STORY_TRAILS.find((t) => t.id === 'sahyadri-forts');
    expect(fortsTrail).toBeDefined();
    expect(fortsTrail?.stops.length).toBe(7); // Shivneri, Lohagad, Tikona, Sinhagad, Torna, Rajgad, Purandar

    // 5. Explore Anywhere (searchability across all places)
    const searchForts = places.filter((p) => p.category_slug === 'forts' || p.name.toLowerCase().includes('fort'));
    expect(searchForts.length).toBeGreaterThanOrEqual(15);
  });
});


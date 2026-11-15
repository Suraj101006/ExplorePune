import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  getAllPlaces,
  getPlaceBySlug,
  getCatalogedForts,
  getFeaturedForts,
  getTodaysPeth,
  getAllPeths,
  getHistoricalEpochs,
  getPathwayCategories,
  getMapPlacePins,
  getPlaygroundGameData,
  getSeasonalExperiences,
  filterPlacesForFinder,
  getExperienceCatalogSummary,
  getPreloaderStats,
  calculateDistanceKm,
} from '@/lib/experience/selectors';
import { getExperienceI18n, EXPERIENCE_I18N } from '@/lib/experience/i18n';

describe('Experience Data Selectors & Consistency Verification', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('1. Fort Counts: Standardized on 15 total cataloged forts & 7 featured high-altitude forts', () => {
    const catalogedForts = getCatalogedForts();
    const featuredForts = getFeaturedForts();

    expect(catalogedForts.length).toBe(15);
    expect(featuredForts.length).toBe(7);

    // Verify all 15 have valid slugs
    catalogedForts.forEach((fort) => {
      expect(fort.category_slug).toBe('forts');
      expect(fort.slug).toBeTruthy();
    });

    // Check HomeExplorer.tsx legacy count is updated to 15 Forts / १५ गड-किल्ले
    const homeExplorerContent = fs.readFileSync(
      path.join(rootDir, 'components/HomeExplorer.tsx'),
      'utf8'
    );
    expect(homeExplorerContent).toContain("'१५ गड-किल्ले' : '15 Forts'");
    expect(homeExplorerContent).not.toContain("'१२ गड-किल्ले' : '12 Forts'");
  });

  it('2. Shaniwar Wada Hours: Verified 09:30 AM – 05:30 PM (ASI Verified)', () => {
    const shaniwarWada = getPlaceBySlug('shaniwar-wada');
    expect(shaniwarWada).toBeDefined();
    expect(shaniwarWada?.opening_hours).toContain('09:30 AM');
    expect(shaniwarWada?.opening_hours).toContain('05:30 PM');

    const heritageSectionContent = fs.readFileSync(
      path.join(rootDir, 'components/experience/HeritageStorySection.tsx'),
      'utf8'
    );
    expect(heritageSectionContent).toContain('09:30 AM – 05:30 PM');
    expect(heritageSectionContent).not.toContain("visitingNote: '09:00 AM – 05:30 PM • Sound & Light");

    const summary = getExperienceCatalogSummary();
    expect(summary.shaniwarWadaHours).toBe('09:30 AM – 05:30 PM');
  });

  it('3. Kelkar Museum: Verified 20,000+ Indian artifacts', () => {
    const kelkar = getPlaceBySlug('raja-dinkar-kelkar-museum');
    expect(kelkar).toBeDefined();

    const heritageSectionContent = fs.readFileSync(
      path.join(rootDir, 'components/experience/HeritageStorySection.tsx'),
      'utf8'
    );
    expect(heritageSectionContent).toContain('20,000+ priceless artifacts');
    expect(heritageSectionContent).not.toContain('22,000 priceless artifacts');

    const playground = getPlaygroundGameData();
    expect(playground.relicGame.artifactCount).toBe(20000);
  });

  it('4. Realistic Itinerary Timing: Preset duration respected in ItineraryBuilderSection', () => {
    const builderContent = fs.readFileSync(
      path.join(rootDir, 'components/experience/ItineraryBuilderSection.tsx'),
      'utf8'
    );
    expect(builderContent).toContain('isMatchingPreset');
    expect(builderContent).toContain('activeTemplate.estimatedHours');
    expect(builderContent).not.toContain('(customStops.length * 1.25)');
  });

  it('5. Karla Caves Radius Gating: Gated to >25km (FullDay / Weekend only)', () => {
    const karlaCaves = getPlaceBySlug('karla-caves');
    expect(karlaCaves).toBeDefined();

    const distFromCenter = calculateDistanceKm(karlaCaves!.latitude, karlaCaves!.longitude);
    expect(distFromCenter).toBeGreaterThan(25); // ~50 km away

    // Short trip (2hr) should exclude Karla Caves even with passion 'heritage'
    const shortTripPlaces = filterPlacesForFinder({
      selectedTime: '2hr',
      selectedPassion: 'heritage',
    });
    expect(shortTripPlaces.some((p) => p.slug === 'karla-caves')).toBe(false);

    // Half day trip should also exclude Karla Caves
    const halfDayTripPlaces = filterPlacesForFinder({
      selectedTime: 'halfDay',
      selectedPassion: 'heritage',
    });
    expect(halfDayTripPlaces.some((p) => p.slug === 'karla-caves')).toBe(false);

    // PersonalizedFinder.tsx contains distance radius gating
    const finderContent = fs.readFileSync(
      path.join(rootDir, 'components/experience/PersonalizedFinder.tsx'),
      'utf8'
    );
    expect(finderContent).toContain('getDistanceFromPuneCenterKm');
    expect(finderContent).toContain('distKm <= 25');
  });

  it('6. getTodaysPeth() returns accurate historic Peth for all 7 days of the week', () => {
    const days = [
      { day: 0, pethEn: 'Raviwar Peth', pethMr: 'रविवार पेठ' },
      { day: 1, pethEn: 'Somwar Peth', pethMr: 'सोमवार पेठ' },
      { day: 2, pethEn: 'Mangalwar Peth', pethMr: 'मंगळवार पेठ' },
      { day: 3, pethEn: 'Budhwar Peth', pethMr: 'बुधवार पेठ' },
      { day: 4, pethEn: 'Guruwar Peth', pethMr: 'गुरुवार पेठ' },
      { day: 5, pethEn: 'Shukrawar Peth', pethMr: 'शुक्रवार पेठ' },
      { day: 6, pethEn: 'Shaniwar Peth / Wada', pethMr: 'शनिवार पेठ / वाडा' },
    ];

    days.forEach(({ day, pethEn, pethMr }) => {
      // Create a date corresponding to that day of week (2026-11-15 is Sunday = 0)
      const testDate = new Date(2026, 10, 15 + day);
      expect(testDate.getDay()).toBe(day);

      const peth = getTodaysPeth(testDate);
      expect(peth.dayOfWeek).toBe(day);
      expect(peth.pethNameEn).toBe(pethEn);
      expect(peth.pethNameMr).toBe(pethMr);
      expect(peth.associatedPlaces.length).toBeGreaterThan(0);
      expect(peth.specialtyBazaarEn).toBeTruthy();
      expect(peth.visitorTipEn).toBeTruthy();
    });

    const allPeths = getAllPeths();
    expect(allPeths.length).toBe(7);
  });

  it('7. Historical Epochs: Resolves 4 core eras with linked places from pune_places_106.json', () => {
    const epochs = getHistoricalEpochs();
    expect(epochs.length).toBe(4);

    epochs.forEach((epoch) => {
      expect(epoch.focalPlace).toBeDefined();
      expect(epoch.associatedPlaces.length).toBeGreaterThan(0);
      expect(epoch.headlineEn).toBeTruthy();
      expect(epoch.headlineMr).toBeTruthy();
    });
  });

  it('8. 16 Pathways: All pathways resolve place counts and covers', () => {
    const pathways = getPathwayCategories();
    expect(pathways.length).toBe(16);

    pathways.forEach((pathway) => {
      expect(pathway.placeCount).toBeGreaterThan(0);
      expect(pathway.featuredPlaces.length).toBeGreaterThan(0);
      expect(pathway.coverImage).toBeTruthy();
    });
  });

  it('9. Preloader & Catalog Summaries: Reflect verified catalog statistics', () => {
    const preloader = getPreloaderStats();
    expect(preloader.totalDestinations).toBe(106);
    expect(preloader.catalogedForts).toBe(15);
    expect(preloader.featuredForts).toBe(7);
    expect(preloader.centuriesOfHistory).toBe(13);
    expect(preloader.verifiedDataRate).toBe(100);

    const summary = getExperienceCatalogSummary();
    expect(summary.totalPlaces).toBe(106);
    expect(summary.totalCatalogedForts).toBe(15);
    expect(summary.totalFeaturedForts).toBe(7);
    expect(summary.totalTemples).toBe(27);
    expect(summary.totalHeritage).toBe(29);
    expect(summary.totalFoodStops).toBe(6);
  });

  it('10. i18n Dictionary: Complete bilingual English & Marathi coverage for all 9 chapters', () => {
    const en = getExperienceI18n('en');
    const mr = getExperienceI18n('mr');

    expect(en.meta.title).toBeTruthy();
    expect(mr.meta.title).toBeTruthy();

    const chapters = ['ch0_preloader', 'ch1_arrival', 'ch2_epochs', 'ch3_pathways', 'ch4_map', 'ch5_playground', 'ch6_seasons', 'ch7_plan', 'ch8_outro'] as const;

    chapters.forEach((chKey) => {
      expect(en.chapters[chKey]).toBeDefined();
      expect(mr.chapters[chKey]).toBeDefined();
      expect(en.chapters[chKey].title).toBeTruthy();
      expect(mr.chapters[chKey].title).toBeTruthy();
    });

    // Hard Rule #3 audio muting verification in i18n
    expect(en.common.audioMutedNotice).toContain('Audio muted by default');
    expect(mr.common.audioMutedNotice).toContain('आवाज सुरुवातीला बंद आहे');
  });
});

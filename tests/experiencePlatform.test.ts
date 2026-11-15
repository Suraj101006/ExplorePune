import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  ALL_106_PLACES,
  EXPERIENCE_CATEGORIES,
  ITINERARY_TEMPLATES,
  EXPERIENCE_STORIES_DATA,
  FORTS_ADVENTURE_DATA,
  TASTE_OF_PUNE_DATA,
  SEASONS_DATA,
  HIDDEN_GEMS_DATA,
  CULTURE_TRADITIONS_DATA,
  NATURE_ESCAPES_DATA,
} from '@/lib/experienceData';

describe('Experience Pune — Platform Comprehensive Verification Suite', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('1. All 106 destinations exist in the catalog with valid properties and non-empty images', () => {
    expect(ALL_106_PLACES.length).toBe(106);

    ALL_106_PLACES.forEach((place) => {
      expect(place.id).toBeDefined();
      expect(place.slug).toBeDefined();
      expect(place.name.length).toBeGreaterThan(0);
      expect(place.category_slug).toBeDefined();
      expect(place.category).toBeDefined();
      expect(place.latitude).toBeGreaterThan(18.0);
      expect(place.longitude).toBeGreaterThan(73.0);

      // Verify authentic image path
      expect(place.image_url.startsWith('/images/places/')).toBe(true);
      const absImgPath = path.join(rootDir, 'public', place.image_url);
      expect(fs.existsSync(absImgPath)).toBe(true);
    });
  });

  it('2. All 16 Experience Categories map cleanly to real places without empty results', () => {
    expect(EXPERIENCE_CATEGORIES.length).toBe(16);

    const categoryCounts: Record<string, number> = {};
    EXPERIENCE_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.title.length).toBeGreaterThan(0);
      expect(cat.titleMr.length).toBeGreaterThan(0);
      expect(cat.coverImage.startsWith('/images/places/')).toBe(true);

      const matching = ALL_106_PLACES.filter(cat.slugFilter);
      categoryCounts[cat.id] = matching.length;
      expect(matching.length).toBeGreaterThan(0);
    });

    // Check specific critical categories
    expect(categoryCounts['heritage-history']).toBeGreaterThanOrEqual(15);
    expect(categoryCounts['forts-adventure']).toBe(15);
    expect(categoryCounts['spiritual-experiences']).toBe(27);
    expect(categoryCounts['food-culinary']).toBe(6);
    expect(categoryCounts['nature-outdoors']).toBe(20);
    expect(categoryCounts['hidden-gems']).toBe(6);
  });

  it('3. All 8 Curated Itinerary Templates have valid sequenced stops and realistic distances', () => {
    expect(ITINERARY_TEMPLATES.length).toBe(8);

    ITINERARY_TEMPLATES.forEach((tmpl) => {
      expect(tmpl.id).toBeDefined();
      expect(tmpl.title.length).toBeGreaterThan(0);
      expect(tmpl.estimatedHours).toBeGreaterThan(0);
      expect(tmpl.totalDistanceKm).toBeGreaterThan(0);
      expect(tmpl.stops.length).toBeGreaterThanOrEqual(3);

      // Verify every stop references a verified place
      tmpl.stops.forEach((slug) => {
        const place = ALL_106_PLACES.find((p) => p.slug === slug);
        expect(place).toBeDefined();
      });
    });
  });

  it('4. Forts & Adventure catalog provides complete safety advisories, elevation, and base villages', () => {
    expect(FORTS_ADVENTURE_DATA.length).toBe(7);

    FORTS_ADVENTURE_DATA.forEach((fort) => {
      expect(fort.name).toBeDefined();
      expect(fort.elevationMeters).toBeGreaterThan(900);
      expect(fort.trekDurationHours.length).toBeGreaterThan(0);
      expect(fort.baseVillage.length).toBeGreaterThan(0);
      expect(fort.safetyAdvisory.length).toBeGreaterThan(20);
      expect(fort.highlights.length).toBeGreaterThanOrEqual(3);

      // Verify place exists in 106 places
      const p = ALL_106_PLACES.find((x) => x.slug === fort.slug);
      expect(p).toBeDefined();
    });

    // Verify Sinhagad has forest curfew notice
    const sinhagad = FORTS_ADVENTURE_DATA.find((f) => f.slug === 'sinhagad-fort');
    expect(sinhagad?.safetyAdvisory).toContain('curfew');
    expect(sinhagad?.safetyAdvisory).toContain('06:00 PM');
  });

  it('5. Taste of Pune culinary catalog contains verified addresses and price ranges', () => {
    expect(TASTE_OF_PUNE_DATA.length).toBe(6);

    TASTE_OF_PUNE_DATA.forEach((dish) => {
      expect(dish.dishName).toBeDefined();
      expect(dish.verifiedAddress.length).toBeGreaterThan(5);
      expect(dish.priceRange).toContain('₹');
      expect(dish.timings.length).toBeGreaterThan(5);
      expect(dish.culturalBackground.length).toBeGreaterThan(20);
    });
  });

  it('6. Culture & Traditions section represents historic living crafts and institutions', () => {
    expect(CULTURE_TRADITIONS_DATA.length).toBe(5);

    const titles = CULTURE_TRADITIONS_DATA.map((c) => c.title);
    expect(titles.some((t) => t.includes('Ganpati'))).toBe(true);
    expect(titles.some((t) => t.includes('Dhol-Tasha'))).toBe(true);
    expect(titles.some((t) => t.includes('Tambat Ali'))).toBe(true);
    expect(titles.some((t) => t.includes('Marathi Theatre'))).toBe(true);
    expect(titles.some((t) => t.includes('Palkhi Wari'))).toBe(true);
  });

  it('7. Nature and Peaceful Escapes correctly labels city tekdis versus regional getaways', () => {
    expect(NATURE_ESCAPES_DATA.length).toBe(6);

    const citySpots = NATURE_ESCAPES_DATA.filter((n) => n.locationScope === 'Within Pune City');
    const regionalSpots = NATURE_ESCAPES_DATA.filter((n) => n.locationScope === 'Regional Scenic Getaway');

    expect(citySpots.length).toBeGreaterThanOrEqual(3);
    expect(regionalSpots.length).toBeGreaterThanOrEqual(2);
  });

  it('8. Hidden Gems catalog features authenticated lesser-known treasures with verified locations', () => {
    expect(HIDDEN_GEMS_DATA.length).toBe(6);

    HIDDEN_GEMS_DATA.forEach((gem) => {
      expect(gem.whyItsUnique.length).toBeGreaterThan(15);
      expect(gem.locality.length).toBeGreaterThan(0);

      const place = ALL_106_PLACES.find((p) => p.slug === gem.slug);
      expect(place).toBeDefined();
    });
  });

  it('9. 4-Season experience covers summer, monsoon, winter, and festival with climate tips', () => {
    expect(SEASONS_DATA.length).toBe(4);

    const seasons = ['summer', 'monsoon', 'winter', 'festival'];
    seasons.forEach((s) => {
      const found = SEASONS_DATA.find((item) => item.id === s);
      expect(found).toBeDefined();
      expect(found!.bestActivities.length).toBeGreaterThanOrEqual(3);
      expect(found!.safetyAndTravelTips.length).toBeGreaterThanOrEqual(2);
      expect(found!.featuredPlaces.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('10. 6 Editorial stories include rich narratives and valid linked destination slugs', () => {
    expect(EXPERIENCE_STORIES_DATA.length).toBe(6);

    EXPERIENCE_STORIES_DATA.forEach((story) => {
      expect(story.readingMinutes).toBeGreaterThanOrEqual(3);
      expect(story.narrativeHtml).toContain('<p>');
      expect(story.featuredSlugs.length).toBeGreaterThanOrEqual(2);

      story.featuredSlugs.forEach((slug) => {
        const place = ALL_106_PLACES.find((p) => p.slug === slug);
        expect(place).toBeDefined();
      });
    });
  });
});

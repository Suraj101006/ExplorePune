import { describe, it, expect } from 'vitest';
import {
  REEL_TEMPLATES_106,
  getAllReelTemplates106,
  getReelTemplatesByCategory,
  getReelTemplateForPlace,
  validateReelTemplates106,
} from '@/lib/reelTemplates106';
import { getDestinationProfile } from '@/lib/destinationIntelligence';
import { getRecommendedMusic } from '@/lib/journeyReel';

describe('106 Unique Cinematic Journey Reel Templates Master Suite', () => {
  it('validates the entire 106-template catalogue with zero errors', () => {
    const report = validateReelTemplates106();
    if (!report.valid) {
      console.error('Validation errors found:', report.errors);
    }
    expect(report.valid).toBe(true);
    expect(report.errors).toHaveLength(0);
    expect(report.count).toBe(106);
  });

  it('contains exactly 106 uniquely authored templates with no duplicates', () => {
    const all = getAllReelTemplates106();
    expect(all).toHaveLength(106);

    const keys = Object.keys(REEL_TEMPLATES_106);
    expect(keys).toHaveLength(106);

    const titles = new Set(all.map((t) => t.templateTitle));
    expect(titles.size).toBe(106);

    const titlesMr = new Set(all.map((t) => t.templateTitleMr));
    expect(titlesMr.size).toBe(106);
  });

  it('verifies exact category counts matching the verified published places audit', () => {
    const forts = getReelTemplatesByCategory('forts');
    const temples = getReelTemplatesByCategory('temples');
    const heritage = getReelTemplatesByCategory('heritage');
    const nature = getReelTemplatesByCategory('nature');
    const museums = getReelTemplatesByCategory('museums');
    const parks = getReelTemplatesByCategory('parks');
    const food = getReelTemplatesByCategory('food');

    expect(forts).toHaveLength(15);
    expect(temples).toHaveLength(27);
    expect(heritage).toHaveLength(29);
    expect(nature).toHaveLength(14);
    expect(museums).toHaveLength(9);
    expect(parks).toHaveLength(6);
    expect(food).toHaveLength(6);

    expect(
      forts.length +
        temples.length +
        heritage.length +
        nature.length +
        museums.length +
        parks.length +
        food.length
    ).toBe(106);
  });

  it('verifies that every template has valid 5-act narrative structures', () => {
    const all = getAllReelTemplates106();

    for (const t of all) {
      expect(t.acts).toHaveLength(5);
      expect(t.acts[0].actName).toBe('hook');
      expect(t.acts[1].actName).toBe('establishing');
      expect(t.acts[2].actName).toBe('immersion');
      expect(t.acts[3].actName).toBe('climax');
      expect(t.acts[4].actName).toBe('heroEnding');

      // Verify each act has English and Marathi titles
      for (const act of t.acts) {
        expect(act.titleEn.length).toBeGreaterThan(0);
        expect(act.titleMr.length).toBeGreaterThan(0);
        expect(act.durationSec).toBeGreaterThan(0);
        expect(act.motionPreset).toBeDefined();
      }

      // Verify total duration is within the short-form reel sweet spot (25-45 seconds)
      const totalSec = t.acts.reduce((acc, act) => acc + act.durationSec, 0);
      expect(totalSec).toBeGreaterThanOrEqual(25);
      expect(totalSec).toBeLessThanOrEqual(45);
    }
  });

  it('verifies color palettes, typography, and motion presets are fully defined', () => {
    const all = getAllReelTemplates106();

    for (const t of all) {
      // Palette
      expect(t.palette.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(t.palette.canvasFilter.length).toBeGreaterThan(5);

      // Typography
      expect(t.typography.headerFont.length).toBeGreaterThan(0);
      expect(t.typography.bodyFont.length).toBeGreaterThan(0);

      // Motion
      expect(t.motionPresets.pacingSpeed).toBeDefined();
      expect(t.motionPresets.kenBurnsScale).toBeGreaterThanOrEqual(1.05);
      expect(t.motionPresets.transitionEffect).toBeDefined();

      // Social audio query
      expect(t.musicMapping.socialAudioAttribution.instagramQuery.length).toBeGreaterThan(0);
      expect(t.musicMapping.socialAudioAttribution.youtubeQuery.length).toBeGreaterThan(0);
      expect(t.musicMapping.socialAudioAttribution.recommendedSoundName.length).toBeGreaterThan(0);

      // Fallback rules for 1 to 5+ photos
      expect(t.photoFallbackRules.onePhoto.length).toBeGreaterThan(10);
      expect(t.photoFallbackRules.twoPhotos.length).toBeGreaterThan(10);
      expect(t.photoFallbackRules.threePhotos.length).toBeGreaterThan(10);
      expect(t.photoFallbackRules.fourPhotos.length).toBeGreaterThan(10);
      expect(t.photoFallbackRules.fivePlusPhotos.length).toBeGreaterThan(10);
    }
  });

  it('resolves destination templates through direct slug, placeId, and aliases', () => {
    // Direct slug
    const sinhagad = getReelTemplateForPlace('sinhagad-fort');
    expect(sinhagad.slug).toBe('sinhagad-fort');
    expect(sinhagad.category).toBe('forts');

    // Direct place ID
    const dagdusheth = getReelTemplateForPlace('shreemant-dagdusheth-halwai-ganpati');
    expect(dagdusheth.slug).toBe('shreemant-dagdusheth-halwai-ganpati');
    expect(dagdusheth.category).toBe('temples');

    // Known Aliases
    const fcRoad = getReelTemplateForPlace('fc-road');
    expect(fcRoad.slug).toBe('fc-road-culinary-trail');

    const bori = getReelTemplateForPlace('bori');
    expect(bori.slug).toBe('bhandarkar-oriental-research-institute');

    const bism = getReelTemplateForPlace('bism');
    expect(bism.slug).toBe('bharat-itihas-sanshodhak-mandal');

    const blades = getReelTemplateForPlace('blades-of-glory');
    expect(blades.slug).toBe('blades-of-glory-cricket-museum');

    // Safe fallback for null/empty/unknown
    const fallback = getReelTemplateForPlace(null);
    expect(fallback).toBeDefined();
    expect(fallback.slug).toBe('sinhagad-fort');
  });

  it('integrates seamlessly with getDestinationProfile for all categories', () => {
    const fortProfile = getDestinationProfile({ placeSlug: 'sinhagad-fort' });
    expect(fortProfile.categoryKey).toBe('forts');
    expect(fortProfile.themeNameEn).toContain('Sahyadri Bastion');
    expect(fortProfile.template106?.templateTitle).toContain('Sinhagad');
    expect(fortProfile.palette.canvasFilter).toBeDefined();
    expect(fortProfile.template106).toBeDefined();
    expect(fortProfile.template106?.acts).toHaveLength(5);

    const templeProfile = getDestinationProfile({ placeSlug: 'shreemant-dagdusheth-halwai-ganpati' });
    expect(templeProfile.categoryKey).toBe('temples');
    expect(templeProfile.recommendedMusicMood).toBe('spiritual');

    const foodProfile = getDestinationProfile({ placeSlug: 'bedekar-tea-stall' });
    expect(foodProfile.categoryKey).toBe('food');
    expect(foodProfile.themeNameEn).toContain('Bedekar');

    const museumProfile = getDestinationProfile({ placeSlug: 'raja-dinkar-kelkar-museum' });
    expect(museumProfile.categoryKey).toBe('museums');
    expect(museumProfile.themeNameEn).toContain('Kelkar');
  });

  it('recommends authentic music matching the place template', () => {
    const { recommended: fortMusic } = getRecommendedMusic([{ category: 'forts', placeSlug: 'sinhagad-fort' }]);
    expect(fortMusic.id).toBe('song-sahyadri-powada');

    const { recommended: templeMusic } = getRecommendedMusic([{ category: 'temples', placeSlug: 'shreemant-dagdusheth-halwai-ganpati' }]);
    expect(templeMusic.id).toBe('song-dagdusheth-aarti');

    const { recommended: heritageMusic } = getRecommendedMusic([{ category: 'heritage', placeSlug: 'shaniwar-wada' }]);
    expect(heritageMusic.id).toBe('song-peshwa-tarana');

    const { recommended: foodMusic } = getRecommendedMusic([{ category: 'food', placeSlug: 'bedekar-tea-stall' }]);
    expect(foodMusic.id).toBe('song-puneri-khadya-jingle');

    const { recommended: natureMusic } = getRecommendedMusic([{ category: 'nature', placeSlug: 'khadakwasla-dam' }]);
    expect(natureMusic.id).toBe('song-sahyadri-breeze');
  });
});

import { describe, it, expect } from 'vitest';
import { getDestinationProfile } from '@/lib/destinationIntelligence';

describe('Universal Destination Intelligence Engine', () => {
  it('correctly profiles iconic fort destinations (Sinhagad Fort)', () => {
    const profile = getDestinationProfile({
      placeId: 'sinhagad-fort',
      placeSlug: 'sinhagad-fort',
      name: 'Sinhagad Fort',
      category: 'forts',
    });

    expect(profile.categoryKey).toBe('forts');
    expect(profile.themeNameEn).toContain('Sahyadri Bastion');
    expect(profile.palette.primary).toBe('#d97706');
    expect(profile.motionStyle.pacingSpeed).toBe('heroic');
    expect(profile.recommendedMusicMood).toBe('adventure');

    // 5-act narrative checks
    expect(profile.narrativeCurve.hookTextEn).toContain('1,312 Metres High');
    expect(profile.narrativeCurve.climaxQuoteMr).toContain('सह्याद्री');
    expect(profile.narrativeCurve.outroSignatureEn).toContain('Sinhagad');
  });

  it('correctly profiles heritage wadas (Shaniwar Wada)', () => {
    const profile = getDestinationProfile({
      placeId: 'shaniwar-wada',
      placeSlug: 'shaniwar-wada',
      name: 'Shaniwar Wada',
      category: 'heritage',
    });

    expect(profile.categoryKey).toBe('heritage');
    expect(profile.themeNameEn).toContain('Maratha Empire');
    expect(profile.palette.primary).toBe('#b45309');
    expect(profile.motionStyle.pacingSpeed).toBe('regal');
    expect(profile.recommendedMusicMood).toBe('heritage');
    expect(profile.narrativeCurve.hookTextEn).toContain('1732');
  });

  it('correctly profiles sacred temple destinations (Dagdusheth Halwai Ganpati)', () => {
    const profile = getDestinationProfile({
      placeId: 'shreemant-dagdusheth-halwai-ganpati',
      placeSlug: 'shreemant-dagdusheth-halwai-ganpati',
      name: 'Shreemant Dagdusheth Halwai Ganpati',
      category: 'temples',
    });

    expect(profile.categoryKey).toBe('temples');
    expect(profile.palette.primary).toBe('#ea580c');
    expect(profile.motionStyle.pacingSpeed).toBe('meditative');
    expect(profile.recommendedMusicMood).toBe('spiritual');
    expect(profile.narrativeCurve.climaxQuoteMr).toContain('मंगलमूर्ती');
  });

  it('correctly profiles food & culinary destinations (FC Road Food Trail)', () => {
    const profile = getDestinationProfile({
      placeId: 'fc-road-culinary-trail',
      placeSlug: 'fc-road-culinary-trail',
      name: 'FC Road Culinary Trail',
      category: 'food',
    });

    expect(profile.categoryKey).toBe('food');
    expect(profile.themeNameEn).toContain('Food Walk');
    expect(profile.palette.primary).toBe('#e11d48');
    expect(profile.motionStyle.pacingSpeed).toBe('punchy');
    expect(profile.recommendedMusicMood).toBe('food');
    expect(profile.narrativeCurve.discoveryTitleEn).toContain('Vaishali');
  });

  it('gracefully handles future/unknown destinations without crashing', () => {
    const profile = getDestinationProfile({
      placeId: 'custom-future-trek-route-xyz',
      name: 'Torna to Rajgad Ridge Trek',
      name_mr: 'तोरणा ते राजगड ट्रेक',
      category: 'forts',
    });

    expect(profile.categoryKey).toBe('forts');
    expect(profile.palette.primary).toBeDefined();
    expect(profile.narrativeCurve.hookTextEn).toContain('Torna to Rajgad Ridge Trek');
    expect(profile.narrativeCurve.climaxQuoteMr).toBeDefined();
  });
});

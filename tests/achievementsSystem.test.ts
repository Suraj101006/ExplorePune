import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENT_DEFINITIONS,
  buildEvaluationContext,
  evaluateUserAchievements,
  computeAchievementsSummary,
  EXPLORER_RANKS,
  getCelebratedBadgeIds,
  markBadgeAsCelebrated,
} from '@/lib/achievements';

describe('Milestones & Achievements System', () => {
  describe('1. Definitions Catalog & Configurations', () => {
    it('defines all required achievements with configurable thresholds and rarities', () => {
      expect(ACHIEVEMENT_DEFINITIONS.length).toBeGreaterThanOrEqual(16);

      const requiredIds = [
        'first-footstep',
        'pune-explorer',
        'local-adventurer',
        'pune-legend',
        'ultimate-punekar',
        'fort-beginner',
        'fort-conqueror',
        'fort-master',
        'temple-trail',
        'heritage-guardian',
        'history-hunter',
        'trek-beginner',
        'trek-master',
        'hidden-gem-finder',
        'weekend-wanderer',
        'district-discoverer',
        'memory-collector',
      ];

      for (const id of requiredIds) {
        const found = ACHIEVEMENT_DEFINITIONS.find((def) => def.id === id);
        expect(found).toBeDefined();
        expect(found?.target).toBeGreaterThan(0);
        expect(['common', 'rare', 'epic', 'legendary']).toContain(found?.rarity);
        expect(found?.medalDesign).toBeDefined();
        expect(found?.medalDesign.metal).toBeDefined();
        expect(found?.nameEn).toBeDefined();
        expect(found?.nameMr).toBeDefined();
      }
    });

    it('has properly structured explorer levels (1 to 5)', () => {
      expect(EXPLORER_RANKS.length).toBe(5);
      expect(EXPLORER_RANKS[0].titleEn).toBe('Novice Explorer');
      expect(EXPLORER_RANKS[4].titleEn).toBe('Grandmaster Punekar');
    });
  });

  describe('2. Getting Started Category & Deduplication', () => {
    it('awards First Footstep on first visit and prevents duplicate place inflation', () => {
      // User checks into Shaniwar Wada 3 times on different dates
      const mockVisits = [
        { place_id: 'shaniwar-wada', visited_at: '2026-10-01' },
        { place_id: 'shaniwar-wada', visited_at: '2026-10-05' },
        { place_id: 'shaniwar-wada', visited_at: '2026-10-10' },
      ];

      const states = evaluateUserAchievements(mockVisits);
      const firstFootstep = states.find((s) => s.id === 'first-footstep');
      const puneExplorer = states.find((s) => s.id === 'pune-explorer');

      expect(firstFootstep?.isUnlocked).toBe(true);
      expect(firstFootstep?.current).toBe(1);

      // Shaniwar Wada 3 times must only count as 1 distinct place for Pune Explorer (needs 5)
      expect(puneExplorer?.isUnlocked).toBe(false);
      expect(puneExplorer?.current).toBe(1);
    });

    it('unlocks Pune Explorer when 5 distinct destinations are visited', () => {
      const mockVisits = [
        { place_id: 'shaniwar-wada', visited_at: '2026-10-01' },
        { place_id: 'sinhagad-fort', visited_at: '2026-10-02' },
        { place_id: 'shreemant-dagdusheth-halwai-ganpati', visited_at: '2026-10-03' },
        { place_id: 'aga-khan-palace', visited_at: '2026-10-04' },
        { place_id: 'vetal-tekdi', visited_at: '2026-10-05' },
      ];

      const states = evaluateUserAchievements(mockVisits);
      const puneExplorer = states.find((s) => s.id === 'pune-explorer');
      expect(puneExplorer?.isUnlocked).toBe(true);
      expect(puneExplorer?.current).toBe(5);
      expect(puneExplorer?.percentage).toBe(100);
    });
  });

  describe('3. Fort Explorer Category', () => {
    it('evaluates fort achievements accurately', () => {
      const mockVisits = [
        { place_id: 'sinhagad-fort', visited_at: '2026-10-01' },
        { place_id: 'rajgad-fort', visited_at: '2026-10-02' },
        { place_id: 'torna-fort', visited_at: '2026-10-03' },
        { place_id: 'lohagad-fort', visited_at: '2026-10-04' },
        { place_id: 'shivneri-fort', visited_at: '2026-10-05' },
      ];

      const states = evaluateUserAchievements(mockVisits);

      const fortBeginner = states.find((s) => s.id === 'fort-beginner');
      const fortConqueror = states.find((s) => s.id === 'fort-conqueror');
      const fortMaster = states.find((s) => s.id === 'fort-master');

      expect(fortBeginner?.isUnlocked).toBe(true);
      expect(fortConqueror?.isUnlocked).toBe(true);
      expect(fortMaster?.isUnlocked).toBe(false);
      expect(fortMaster?.current).toBe(5);
      expect(fortMaster?.target).toBe(10);
      expect(fortMaster?.nextStepHintEn).toContain('5 more forts');
    });
  });

  describe('4. Heritage, Temples & Adventure', () => {
    it('evaluates temple trail for sacred shrines', () => {
      const mockVisits = [
        { place_id: 'shreemant-dagdusheth-halwai-ganpati', visited_at: '2026-10-01' },
        { place_id: 'pataleshwar-cave-temple', visited_at: '2026-10-02' },
        { place_id: 'alandi-dnyaneshwar-mandir', visited_at: '2026-10-03' },
        { place_id: 'jejuri-khandoba-temple', visited_at: '2026-10-04' },
        { place_id: 'bhimashankar-temple', visited_at: '2026-10-05' },
      ];

      const states = evaluateUserAchievements(mockVisits);
      const templeTrail = states.find((s) => s.id === 'temple-trail');

      expect(templeTrail?.isUnlocked).toBe(true);
      expect(templeTrail?.current).toBe(5);
    });

    it('identifies hidden gems correctly', () => {
      const mockVisits = [
        { place_id: 'pataleshwar-cave-temple' },
        { place_id: 'trishund-ganpati-temple' },
        { place_id: 'bedse-caves' },
        { place_id: 'banneshwar-temple-nasrapur' },
        { place_id: 'malhargad-fort' },
      ];

      const states = evaluateUserAchievements(mockVisits);
      const hiddenGem = states.find((s) => s.id === 'hidden-gem-finder');

      expect(hiddenGem?.isUnlocked).toBe(true);
      expect(hiddenGem?.current).toBe(5);
    });
  });

  describe('5. Special Challenges (Weekends, Districts, Memories)', () => {
    it('calculates weekend wanderer across distinct calendar weekends', () => {
      // 4 different weekends: Saturdays and Sundays
      const mockVisits = [
        { place_id: 'sinhagad-fort', visited_at: '2026-10-03' }, // Saturday W40
        { place_id: 'rajgad-fort', visited_at: '2026-10-10' },   // Saturday W41
        { place_id: 'torna-fort', visited_at: '2026-10-18' },    // Sunday W42
        { place_id: 'lohagad-fort', visited_at: '2026-10-24' },  // Saturday W43
      ];

      const states = evaluateUserAchievements(mockVisits);
      const weekendWanderer = states.find((s) => s.id === 'weekend-wanderer');

      expect(weekendWanderer?.isUnlocked).toBe(true);
      expect(weekendWanderer?.current).toBe(4);
    });

    it('evaluates district discoverer across multiple Pune tehsils', () => {
      const mockVisits = [
        { place_id: 'sinhagad-fort' }, // Haveli
        { place_id: 'rajgad-fort' },   // Velhe
        { place_id: 'tamhini-ghat' },  // Mulshi
        { place_id: 'shivneri-fort' }, // Junnar
      ];

      const states = evaluateUserAchievements(mockVisits);
      const districtDiscoverer = states.find((s) => s.id === 'district-discoverer');

      expect(districtDiscoverer?.isUnlocked).toBe(true);
      expect(districtDiscoverer?.current).toBe(4);
    });

    it('requires verified photo and notes for memory collector', () => {
      const mockVisits = [
        { place_id: 'p1', image_url: 'data:image/jpeg;base64,sample1234567890', notes: 'Great trek' },
        { place_id: 'p2', image_url: 'data:image/jpeg;base64,sample1234567890', notes: 'Visited morning' },
        { place_id: 'p3', image_url: '', notes: 'No photo' }, // should not count as photo memory
      ];

      const ctx = buildEvaluationContext(mockVisits);
      expect(ctx.memoriesWithPhotosCount).toBe(2);
    });
  });

  describe('6. Achievements Summary & Explorer Level Progression', () => {
    it('computes level progression and next rank requirements', () => {
      // Simulate user who unlocked 4 badges
      const mockVisits = [
        { place_id: 'sinhagad-fort', visited_at: '2026-10-03', image_url: 'http://img.jpg', notes: 'visit' },
        { place_id: 'rajgad-fort', visited_at: '2026-10-10' },
        { place_id: 'torna-fort', visited_at: '2026-10-17' },
        { place_id: 'lohagad-fort', visited_at: '2026-10-24' },
        { place_id: 'shivneri-fort', visited_at: '2026-10-31' },
      ];

      const states = evaluateUserAchievements(mockVisits);
      const summary = computeAchievementsSummary(states);

      expect(summary.unlockedCount).toBeGreaterThanOrEqual(3);
      expect(summary.currentRank.level).toBeGreaterThanOrEqual(2);
      expect(summary.currentRank.titleEn).toBeDefined();
      expect(summary.completionPercentage).toBeGreaterThan(0);
      expect(summary.totalRarityUnlocked.common).toBeGreaterThanOrEqual(1);
    });

    it('respects favorite badges showcase selection', () => {
      const mockVisits = [
        { place_id: 'sinhagad-fort' },
        { place_id: 'rajgad-fort' },
        { place_id: 'torna-fort' },
      ];

      const favIds = ['first-footstep', 'fort-beginner'];
      const states = evaluateUserAchievements(mockVisits, 0, undefined, favIds);
      const summary = computeAchievementsSummary(states);

      expect(summary.favoriteBadges.length).toBe(2);
      expect(summary.favoriteBadges.map((b) => b.id)).toEqual(
        expect.arrayContaining(['first-footstep', 'fort-beginner'])
      );
    });
  });

  describe('7. Social Share Captions', () => {
    it('generates rich, engaging captions for social sharing', () => {
      const fortConqueror = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === 'fort-conqueror');
      expect(fortConqueror).toBeDefined();

      const caption = fortConqueror?.shareCaption('Suraj', 12);
      expect(caption).toContain('Fort Conqueror');
      expect(caption).toContain('#ExplorePune');
      expect(caption).toContain('#TravelAchievements');
    });
  });
});

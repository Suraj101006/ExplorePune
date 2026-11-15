import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPlaygroundProgress,
  markGameCompleted,
  getCompletedGameCount,
  PLAYGROUND_STAMPS,
} from '@/components/experience/chapters/playground/playgroundMilestone';
import { getPlaygroundGameData } from '@/lib/experience/selectors';
import { playgroundAudio } from '@/components/experience/chapters/playground/playgroundAudio';

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe('Chapter 5 Tactile Playground Mini-Games Suite', () => {
  let dispatchedEvents: any[] = [];

  beforeEach(() => {
    mockStorage.clear();
    dispatchedEvents = [];

    vi.stubGlobal('localStorage', mockStorage);
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn((e: any) => {
        dispatchedEvents.push(e);
      }),
      localStorage: mockStorage,
    });
  });

  it('1. Verifies initial playground progress is completely uncompleted', () => {
    const prog = getPlaygroundProgress();
    expect(prog.misal).toBe(false);
    expect(prog.tambat).toBe(false);
    expect(prog.tanaji).toBe(false);
    expect(prog.relic).toBe(false);
    expect(prog.ganeshotsav).toBe(false);
    expect(getCompletedGameCount(prog)).toBe(0);
  });

  it('2. Completing Misal game marks progress, awards stamp, and dispatches custom events', () => {
    const result = markGameCompleted('misal');
    expect(result.progress.misal).toBe(true);
    expect(result.isFirstCompletion).toBe(true);
    expect(result.stamp.id).toBe('stamp-misal-master');
    expect(result.stamp.placeSlug).toBe('bedekar-tea-stall-misal');
    expect(result.stamp.titleMr).toContain('मिसळ');

    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  it('3. Completing all 5 games records 5 verified passport stamps', () => {
    markGameCompleted('misal');
    markGameCompleted('tambat');
    markGameCompleted('tanaji');
    markGameCompleted('relic');
    markGameCompleted('ganeshotsav');

    const finalProg = getPlaygroundProgress();
    expect(getCompletedGameCount(finalProg)).toBe(5);

    const rawStamps = mockStorage.getItem('explore_pune_passport_stamps');
    expect(rawStamps).toBeDefined();
    const parsed = JSON.parse(rawStamps!);
    expect(parsed.length).toBe(5);

    const slugs = parsed.map((s: any) => s.placeSlug);
    expect(slugs).toContain('bedekar-tea-stall-misal');
    expect(slugs).toContain('tambat-ali-craft-quarter');
    expect(slugs).toContain('sinhagad-fort');
    expect(slugs).toContain('raja-dinkar-kelkar-museum');
    expect(slugs).toContain('kasba-ganpati');
  });

  it('4. Playground data selectors provide all required game data', () => {
    const data = getPlaygroundGameData();

    // Misal Game data
    expect(data.misalGame.spiceLevels.length).toBe(3);
    expect(data.misalGame.ingredients.length).toBeGreaterThanOrEqual(6);

    // Tambat Game data
    expect(data.tambatGame.titleEn).toBeDefined();
    expect(data.tambatGame.techniqueMr).toContain('माथारकाम');

    // Tanaji Game data
    expect(data.tanajiGame.climbYear).toBe(1670);
    expect(data.tanajiGame.cliffNameMr).toContain('द्रोणागिरी');

    // Relic Game data
    expect(data.relicGame.artifactCount).toBe(20000);

    // Dhol Tasha Game data
    expect(data.dholTashaGame.manacheGanpati.length).toBe(5);
    expect(data.dholTashaGame.manacheGanpati[0].rank).toBe(1);
    expect(data.dholTashaGame.manacheGanpati[0].slug).toBe('kasba-ganpati');
  });

  it('5. Procedural audio synthesizer methods execute safely without errors', () => {
    expect(() => playgroundAudio.setMuted(true)).not.toThrow();
    expect(() => playgroundAudio.playCopperHammer(1.0)).not.toThrow();
    expect(() => playgroundAudio.playMisalSizzle()).not.toThrow();
    expect(() => playgroundAudio.playZanzanitChime()).not.toThrow();
    expect(() => playgroundAudio.playWindGust()).not.toThrow();
    expect(() => playgroundAudio.playRopeCreak()).not.toThrow();
    expect(() => playgroundAudio.playTutariFanfare()).not.toThrow();
    expect(() => playgroundAudio.playDholBeat()).not.toThrow();
    expect(() => playgroundAudio.playTashaBeat()).not.toThrow();
    expect(() => playgroundAudio.playJhanjBeat()).not.toThrow();
    expect(() => playgroundAudio.playShankhFanfare()).not.toThrow();
    expect(() => playgroundAudio.playRelicChime()).not.toThrow();
    expect(() => playgroundAudio.playSuccessChime()).not.toThrow();
  });
});

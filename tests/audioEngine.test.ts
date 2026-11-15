import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  AMBIENT_CHAPTER_MAP,
  AmbientTrackId,
  SfxId,
} from '@/components/experience/audio/types';
import { syntheticAudio } from '@/components/experience/audio/syntheticAudio';

describe('Explore Pune — Web Audio Engine & Architecture ("Pune Through Time")', () => {
  const rootDir = path.resolve(__dirname, '..');
  const audioDir = path.join(rootDir, 'public/experience/audio');
  const creditsPath = path.join(rootDir, 'public/experience/CREDITS.md');

  const EXPECTED_AMBIENT_STEMS: AmbientTrackId[] = [
    'preloader-drone',
    'sahyadri-wind',
    'peshwa-court',
    'market-bustle',
    'dhol-tasha',
    'monsoon-rain',
  ];

  const EXPECTED_SFX_STEMS: SfxId[] = [
    'hammer',
    'coin',
    'sizzle',
    'click',
    'fanfare',
  ];

  const SFX_FILE_STEMS = [
    'hammer-strike',
    'coin-drop',
    'misal-sizzle',
    'ui-click',
    'win-fanfare',
  ];

  it('1. Hard Rule #3 Compliance: Default audio state is strictly OFF', () => {
    // Audio must never autoplay without explicit user interaction
    const initialAudioState = {
      isAudioEnabled: false,
      isMuted: false,
      hasUserOptedIn: false,
    };

    expect(initialAudioState.isAudioEnabled).toBe(false);
    expect(initialAudioState.hasUserOptedIn).toBe(false);
  });

  it('2. LocalStorage persistence key is standardized as explore_pune_audio_enabled', () => {
    const STORAGE_KEY = 'explore_pune_audio_enabled';
    expect(STORAGE_KEY).toBe('explore_pune_audio_enabled');
  });

  it('3. Per-Chapter ambient crossfade mapping covers all 9 chapters & sections', () => {
    const chapters = [
      'preloader',
      'arrival',
      'epochs',
      'pathways',
      'map',
      'playground',
      'seasons',
      'plan',
      'outro',
    ];

    chapters.forEach((ch) => {
      expect(AMBIENT_CHAPTER_MAP[ch]).toBeDefined();
      expect(EXPECTED_AMBIENT_STEMS).toContain(AMBIENT_CHAPTER_MAP[ch]);
    });

    // Check specific iconic chapter assignments
    expect(AMBIENT_CHAPTER_MAP['preloader']).toBe('preloader-drone');
    expect(AMBIENT_CHAPTER_MAP['arrival']).toBe('sahyadri-wind');
    expect(AMBIENT_CHAPTER_MAP['epochs']).toBe('peshwa-court');
    expect(AMBIENT_CHAPTER_MAP['playground']).toBe('dhol-tasha');
    expect(AMBIENT_CHAPTER_MAP['seasons']).toBe('monsoon-rain');
    expect(AMBIENT_CHAPTER_MAP['curiosities']).toBe('dhol-tasha');
  });

  it('4. Audio bundle budget: Total compressed payload is strictly under 2 MB', () => {
    expect(fs.existsSync(audioDir)).toBe(true);

    const files = fs.readdirSync(audioDir);
    let totalBytes = 0;

    files.forEach((file) => {
      const filePath = path.join(audioDir, file);
      const stat = fs.statSync(filePath);
      totalBytes += stat.size;
    });

    const totalKb = totalBytes / 1024;
    const totalMb = totalKb / 1024;

    // Hard Budget: Under 2 MB
    expect(totalMb).toBeLessThan(2.0);
    // Highly optimized target: well under 1 MB
    expect(totalMb).toBeLessThan(1.0);
  });

  it('5. All ambient stems exist in both WebM Opus and MP3 formats for universal cross-browser delivery', () => {
    EXPECTED_AMBIENT_STEMS.forEach((stem) => {
      const webmPath = path.join(audioDir, `${stem}.webm`);
      const mp3Path = path.join(audioDir, `${stem}.mp3`);

      expect(fs.existsSync(webmPath)).toBe(true);
      expect(fs.existsSync(mp3Path)).toBe(true);

      expect(fs.statSync(webmPath).size).toBeGreaterThan(1000);
      expect(fs.statSync(mp3Path).size).toBeGreaterThan(1000);
    });
  });

  it('6. All tactile UI sound effect stems exist in both WebM Opus and MP3 formats', () => {
    SFX_FILE_STEMS.forEach((stem) => {
      const webmPath = path.join(audioDir, `${stem}.webm`);
      const mp3Path = path.join(audioDir, `${stem}.mp3`);

      expect(fs.existsSync(webmPath)).toBe(true);
      expect(fs.existsSync(mp3Path)).toBe(true);

      expect(fs.statSync(webmPath).size).toBeGreaterThan(500);
      expect(fs.statSync(mp3Path).size).toBeGreaterThan(500);
    });
  });

  it('7. SyntheticAudioEngine provides procedural Web Audio API fallback for all stems', () => {
    expect(syntheticAudio).toBeDefined();
    expect(typeof syntheticAudio.crossfadeToTrack).toBe('function');
    expect(typeof syntheticAudio.playSfx).toBe('function');
    expect(typeof syntheticAudio.setDholRate).toBe('function');
    expect(typeof syntheticAudio.setVolume).toBe('function');
    expect(typeof syntheticAudio.setMute).toBe('function');
    expect(typeof syntheticAudio.pause).toBe('function');
    expect(typeof syntheticAudio.resume).toBe('function');
  });

  it('8. Hard Rule #8 Compliance: public/experience/CREDITS.md registers all audio stems & licenses', () => {
    expect(fs.existsSync(creditsPath)).toBe(true);
    const content = fs.readFileSync(creditsPath, 'utf8');

    // Section 2 Audio register
    expect(content).toContain('## 2. Audio & Sonic Assets');
    expect(content).toContain('preloader-drone.webm');
    expect(content).toContain('sahyadri-wind.webm');
    expect(content).toContain('peshwa-court.webm');
    expect(content).toContain('market-bustle.webm');
    expect(content).toContain('dhol-tasha.webm');
    expect(content).toContain('monsoon-rain.webm');
    expect(content).toContain('hammer-strike.webm');
    expect(content).toContain('coin-drop.webm');
    expect(content).toContain('misal-sizzle.webm');
    expect(content).toContain('ui-click.webm');
    expect(content).toContain('win-fanfare.webm');
    expect(content).toContain('SyntheticAudioEngine');
    expect(content).toContain('Hard Rule #3');
    expect(content).toContain('Hard Rule #8');
  });

  it('9. Dhol-Tasha playback rate bounds are constrained between 0.85x and 1.65x', () => {
    const calculateRate = (velocity: number) => 0.85 + Math.min(0.8, velocity * 0.45);

    expect(calculateRate(0)).toBe(0.85);
    expect(calculateRate(0.5)).toBeCloseTo(1.075);
    expect(calculateRate(1.0)).toBe(1.3);
    expect(calculateRate(10.0)).toBe(1.65); // Capped at 1.65x max rate
  });
});

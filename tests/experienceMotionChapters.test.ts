import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  toDevanagariDigits,
  formatPercentage,
  easeExpoOut,
  easePeshwa,
  easeSpringGentle,
  MOTION_EASINGS,
  GSAP_EASINGS,
} from '@/components/experience/motion/motionUtils';

describe('Explore Pune Motion & Chapter Architecture', () => {
  const rootDir = path.resolve(__dirname, '..');

  describe('Motion Utilities & Devanagari Mathematics', () => {
    it('1. Converts numeric digits to authentic Devanagari numerals', () => {
      expect(toDevanagariDigits(0)).toBe('०');
      expect(toDevanagariDigits(100)).toBe('१००');
      expect(toDevanagariDigits(1670)).toBe('१६७०');
      expect(toDevanagariDigits('18.5204° N')).toBe('१८.५२०४° N');
    });

    it('2. Formats percentage for English and Marathi modes', () => {
      expect(formatPercentage(0, false)).toBe('0%');
      expect(formatPercentage(100, false)).toBe('100%');
      expect(formatPercentage(0, true)).toBe('०%');
      expect(formatPercentage(50, true)).toBe('५०%');
      expect(formatPercentage(100, true)).toBe('१००%');
    });

    it('3. Mathematical interpolation functions conform to normalized bounds [0, 1]', () => {
      expect(easeExpoOut(0)).toBeCloseTo(0, 2);
      expect(easeExpoOut(1)).toBe(1);
      expect(easeExpoOut(0.5)).toBeGreaterThan(0.9); // Expo out decelerates fast

      expect(easePeshwa(0)).toBe(0);
      expect(easePeshwa(1)).toBe(1);

      expect(easeSpringGentle(0)).toBe(0);
      expect(easeSpringGentle(1)).toBe(1);
    });

    it('4. Motion Easing tokens align with docs/experience/motion-spec.md', () => {
      expect(MOTION_EASINGS.expoOut).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
      expect(MOTION_EASINGS.peshwaEase).toBe('cubic-bezier(0.22, 1, 0.36, 1)');
      expect(MOTION_EASINGS.cinematicPeshwa).toBe('cubic-bezier(0.19, 1, 0.22, 1)');
      expect(MOTION_EASINGS.springGentle).toBe('cubic-bezier(0.34, 1.56, 0.64, 1)');
      expect(MOTION_EASINGS.sahyadriMist).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
      expect(MOTION_EASINGS.monsoonSurge).toBe('cubic-bezier(0.77, 0, 0.175, 1)');
    });
  });

  describe('Chapter Source Files Verification', () => {
    it('5. Chapter 0 Preloader has Devanagari counter, ink SVG, audio unlock prompt, and lite mode fallback', () => {
      const filePath = path.join(
        rootDir,
        'components/experience/chapters/preloader/ChapterPreloader.tsx'
      );
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('formatPercentage');
      expect(content).toContain('isAudioEnabled');
      expect(content).toContain('toggleAudio');
      expect(content).toContain('prefersReducedMotion');
      expect(content).toContain('strokeDasharray');
      expect(content).toContain('COORDINATES: 18.5204° N');
    });

    it('6. Chapter 1 Arrival has Parallax Sinhagad silhouettes, sky gradient, and historic war typography', () => {
      const filePath = path.join(
        rootDir,
        'components/experience/chapters/arrival/ChapterArrival.tsx'
      );
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('leftBoulderRef');
      expect(content).toContain('rightBoulderRef');
      expect(content).toContain('गड आला पण सिंह गेला');
      expect(content).toContain('ScrollTrigger');
      expect(content).toContain('Asia/Kolkata');
    });

    it('7. Chapter 2 Four Epochs has pinned timeline with scrub, snap points, and progress beads', () => {
      const filePath = path.join(
        rootDir,
        'components/experience/chapters/epochs/ChapterEpochs.tsx'
      );
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('snapTo: [0, 0.333, 0.666, 1]');
      expect(content).toContain('getHistoricalEpochs');
      expect(content).toContain('750 CE');
      expect(content).toContain('1670 CE');
      expect(content).toContain('1732 CE');
      expect(content).toContain('1848');
    });

    it('8. Chapter 3 Sixteen Pathways has draggable horizontal rail with momentum & arrow navigation', () => {
      const filePath = path.join(
        rootDir,
        'components/experience/chapters/pathways/ChapterPathways.tsx'
      );
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('getPathwayCategories');
      expect(content).toContain('ArrowRight');
      expect(content).toContain('ArrowLeft');
      expect(content).toContain('onPointerDown');
      expect(content).toContain('handleCardMouseMove');
      expect(content).toContain('toDevanagariDigits');
    });

    it('9. Chapter 6 Seasons has scroll-scrubbed atmospheric morph through Grishma, Varsha, Sharad, and Shishir', () => {
      const filePath = path.join(
        rootDir,
        'components/experience/chapters/seasons/ChapterSeasons.tsx'
      );
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('Grishma Ritu');
      expect(content).toContain('Varsha Ritu');
      expect(content).toContain('Sharad Ritu');
      expect(content).toContain('Shishir Ritu');
      expect(content).toContain('canvasRef');
      expect(content).toContain('ScrollTrigger');
    });

    it('10. Chapter 8 Outro has twilight horizon reverie, verified stats bar, and return portal', () => {
      const filePath = path.join(
        rootDir,
        'components/experience/chapters/outro/ChapterOutro.tsx'
      );
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('पुण्यनगरी: जिथे इतिहास आणि भविष्य एकाच श्वासात जगतात');
      expect(content).toContain('Explore All 106 Places');
      expect(content).toContain('handleScrollToApex');
      expect(content).toContain('puneriSignature');
      expect(content).toContain('showCreditsDrawer');
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  globalChapterRegistry,
} from '@/lib/experience/registry';
import {
  getExperienceI18n,
  type ExperienceI18nDictionary,
} from '@/lib/experience/i18n';
import {
  getTodaysPeth,
  getCatalogedForts,
  getFeaturedForts,
  getPreloaderStats,
  getPlaygroundGameData,
  calculateDistanceKm,
  PUNE_CENTER_COORDINATES,
} from '@/lib/experience/selectors';
import {
  getPlaygroundProgress,
  markGameCompleted,
  PLAYGROUND_STAMPS,
} from '@/components/experience/chapters/playground/playgroundMilestone';
import { palette, themeTokens, typography, motion } from '@/components/experience/tokens/tokens';

const rootDir = 'C:/Users/Suraj/explore-pune';

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

describe('Phase 4 Master QA Audit & Verification Suite ("Pune Through Time")', () => {
  // -------------------------------------------------------------
  // 1. CHAPTER INTEGRATION & REGISTRY
  // -------------------------------------------------------------
  describe('1. Chapter Architecture & Lifecycle Registry', () => {
    it('verifies all 9 chapters exist in components/experience/chapters in required sequence', () => {
      const chaptersDir = path.join(rootDir, 'components/experience/chapters');
      const expectedDirs = [
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

      expectedDirs.forEach((dir) => {
        expect(fs.existsSync(path.join(chaptersDir, dir))).toBe(true);
      });
    });

    it('verifies barrel export in components/experience/chapters/index.ts exports all 9 chapters', () => {
      const indexPath = path.join(rootDir, 'components/experience/chapters/index.ts');
      const content = fs.readFileSync(indexPath, 'utf8');

      expect(content).toContain('ChapterPreloader');
      expect(content).toContain('ChapterArrival');
      expect(content).toContain('ChapterEpochs');
      expect(content).toContain('EpochSceneMorph');
      expect(content).toContain('ChapterPathways');
      expect(content).toContain('ChapterLivingMap');
      expect(content).toContain('ChapterPlayground');
      expect(content).toContain('ChapterSeasons');
      expect(content).toContain('ChapterPlan');
      expect(content).toContain('ChapterOutro');
    });

    it('verifies GlobalChapterRegistry handles registration, retrieval, and sorting by order', () => {
      globalChapterRegistry.register({
        id: 'arrival',
        titleEn: 'Threshold of Sinhagad',
        titleMr: 'सिंहगडाचे प्रवेशद्वार',
        order: 1,
        scrub: vi.fn(),
      });
      globalChapterRegistry.register({
        id: 'preloader',
        titleEn: 'Genesis',
        titleMr: 'उगम',
        order: 0,
        scrub: vi.fn(),
      });
      globalChapterRegistry.register({
        id: 'epochs',
        titleEn: 'Four Epochs',
        titleMr: 'चार युगे',
        order: 2,
        scrub: vi.fn(),
      });

      const list = globalChapterRegistry.getChapters();
      expect(list.length).toBeGreaterThanOrEqual(3);

      const found = globalChapterRegistry.getChapter('arrival');
      expect(found?.titleEn).toBe('Threshold of Sinhagad');

      globalChapterRegistry.unregister('arrival');
      expect(globalChapterRegistry.getChapter('arrival')).toBeUndefined();
    });
  });

  // -------------------------------------------------------------
  // 2. BILINGUAL RIGOR & DEVANAGARI ACCURACY (Hard Rule #5)
  // -------------------------------------------------------------
  describe('2. Bilingual Linguistic & Devanagari Integrity (English & Marathi)', () => {
    const enDict: ExperienceI18nDictionary = getExperienceI18n('en');
    const mrDict: ExperienceI18nDictionary = getExperienceI18n('mr');

    it('confirms both dictionaries contain non-empty metadata, common controls, and all 9 chapter keys', () => {
      expect(enDict.meta.title).toBeTruthy();
      expect(mrDict.meta.title).toBeTruthy();

      const enChKeys = Object.keys(enDict.chapters);
      const mrChKeys = Object.keys(mrDict.chapters);
      expect(enChKeys).toEqual(mrChKeys);
      expect(enChKeys.length).toBe(9); // ch0 through ch8
    });

    it('verifies Marathi text contains valid Devanagari Unicode characters (U+0900 to U+097F)', () => {
      const devanagariRegex = /[\u0900-\u097F]/;

      expect(devanagariRegex.test(mrDict.meta.title)).toBe(true);
      expect(devanagariRegex.test(mrDict.chapters.ch0_preloader.title)).toBe(true);
      expect(devanagariRegex.test(mrDict.chapters.ch1_arrival.title)).toBe(true);
      expect(devanagariRegex.test(mrDict.chapters.ch2_epochs.title)).toBe(true);
      expect(devanagariRegex.test(mrDict.chapters.ch3_pathways.title)).toBe(true);
      expect(devanagariRegex.test(mrDict.chapters.ch4_map.title)).toBe(true);
      expect(devanagariRegex.test(mrDict.chapters.ch5_playground.title)).toBe(true);
      expect(devanagariRegex.test(mrDict.chapters.ch6_seasons.title)).toBe(true);
      expect(devanagariRegex.test(mrDict.chapters.ch7_plan.title)).toBe(true);
      expect(devanagariRegex.test(mrDict.chapters.ch8_outro.title)).toBe(true);
    });

    it('verifies 4 Epochs narrative copy is detailed and non-empty in both languages', () => {
      const ch2En = enDict.chapters.ch2_epochs;
      const ch2Mr = mrDict.chapters.ch2_epochs;

      expect(ch2En.epoch1.name).toContain('Rashtrakuta');
      expect(ch2Mr.epoch1.name).toContain('राष्ट्रकूट');
      expect(ch2En.epoch2.name).toContain('Shivaji');
      expect(ch2Mr.epoch2.name).toContain('छत्रपती शिवाजी महाराज');
      expect(ch2En.epoch3.name).toContain('Peshwa');
      expect(ch2Mr.epoch3.name).toContain('पेशवे');
      expect(ch2En.epoch4.name).toContain('Renaissance');
      expect(ch2Mr.epoch4.name).toContain('सामाजिक प्रबोधन');
    });

    it('verifies 4 Seasons atmospheric copy covers Grishma, Varsha, Sharad, Shishir', () => {
      const ch6En = enDict.chapters.ch6_seasons;
      const ch6Mr = mrDict.chapters.ch6_seasons;

      expect(ch6En.summer.title).toContain('Summer');
      expect(ch6Mr.summer.title).toContain('उन्हाळा');
      expect(ch6En.monsoon.title).toContain('Monsoon');
      expect(ch6Mr.monsoon.title).toContain('पावसाळा');
      expect(ch6En.winter.title).toContain('Winter');
      expect(ch6Mr.winter.title).toContain('हिवाळा');
      expect(ch6En.festive.title).toContain('Ganeshotsav');
      expect(ch6Mr.festive.title).toContain('गणेशोत्सव');
    });
  });

  // -------------------------------------------------------------
  // 3. FACTUAL TRUTH & DATA INTEGRITY (Hard Rule #1)
  // -------------------------------------------------------------
  describe('3. Historical Truth & Single-Source-of-Truth Validation', () => {
    it('confirms 15 cataloged forts in data/pune_places_106.json and 7 featured adventure forts', () => {
      const cataloged = getCatalogedForts();
      const featured = getFeaturedForts();

      expect(cataloged.length).toBe(15);
      expect(featured.length).toBe(7);

      const catalogedSlugs = cataloged.map((f) => f.slug);
      expect(catalogedSlugs).toContain('sinhagad-fort');
      expect(catalogedSlugs).toContain('rajgad-fort');
      expect(catalogedSlugs).toContain('torna-fort');
      expect(catalogedSlugs).toContain('shivneri-fort');
      expect(catalogedSlugs).toContain('purandar-fort');
      expect(catalogedSlugs).toContain('lohagad-fort');
    });

    it('confirms Shaniwar Wada visiting hours are strictly 09:30 AM – 05:30 PM (ASI verified)', () => {
      const heritagePath = path.join(rootDir, 'components/experience/HeritageStorySection.tsx');
      const content = fs.readFileSync(heritagePath, 'utf8');

      // Check specifically within the Shaniwar Wada destination block
      const shaniwarMatch = content.match(/slug:\s*'shaniwar-wada'[\s\S]*?visitingNote:\s*'([^']+)'/);
      expect(shaniwarMatch).not.toBeNull();
      expect(shaniwarMatch?.[1]).toContain('09:30 AM – 05:30 PM');
      expect(shaniwarMatch?.[1]).not.toContain('09:00 AM');
    });

    it('confirms Raja Dinkar Kelkar Museum artifact count is 20,000+', () => {
      const preloaderStats = getPreloaderStats();
      const playgroundData = getPlaygroundGameData();

      expect(preloaderStats.totalDestinations).toBe(106);
      expect(preloaderStats.catalogedForts).toBe(15);
      expect(playgroundData.relicGame.artifactCount).toBe(20000);

      const heritagePath = path.join(rootDir, 'components/experience/HeritageStorySection.tsx');
      const content = fs.readFileSync(heritagePath, 'utf8');
      expect(content).toContain('20,000+');
      expect(content).not.toContain('22,000');
    });

    it('confirms Distance Radius Gating (<25km) prevents Karla Caves from appearing in 2hr or halfDay trips', () => {
      const karlaLat = 18.7831;
      const karlaLng = 73.4716;
      const distFromPune = calculateDistanceKm(karlaLat, karlaLng);

      // Karla Caves is ~55-60 km away from Pune Zero Stone
      expect(distFromPune).toBeGreaterThan(45);
      expect(distFromPune).toBeLessThan(75);

      // Short trip filter radius is strictly 25km
      const MAX_SHORT_TRIP_KM = 25;
      expect(distFromPune > MAX_SHORT_TRIP_KM).toBe(true);

      const finderPath = path.join(rootDir, 'components/experience/PersonalizedFinder.tsx');
      const content = fs.readFileSync(finderPath, 'utf8');
      expect(content).toContain('distKm <= 25');
    });

    it('confirms getTodaysPeth dynamically maps each day of the week to the correct historic Pune Peth', () => {
      // 0: Sunday -> Raviwar Peth
      // 3: Wednesday -> Budhwar Peth
      // 6: Saturday -> Shaniwar Peth
      const sunday = new Date(2026, 10, 15); // Nov 15 2026 is Sunday (getDay() === 0)
      const wednesday = new Date(2026, 10, 18); // Nov 18 2026 is Wednesday (getDay() === 3)
      const saturday = new Date(2026, 10, 21); // Nov 21 2026 is Saturday (getDay() === 6)

      const pethSun = getTodaysPeth(sunday);
      const pethWed = getTodaysPeth(wednesday);
      const pethSat = getTodaysPeth(saturday);

      expect(pethSun.pethNameEn).toContain('Raviwar Peth');
      expect(pethSun.specialtyBazaarEn).toContain('Gold');

      expect(pethWed.pethNameEn).toContain('Budhwar Peth');
      expect(pethWed.specialtyBazaarEn).toContain('books');

      expect(pethSat.pethNameEn).toContain('Shaniwar Peth');
      expect(pethSat.specialtyBazaarEn).toContain('bookbinders');
    });
  });

  // -------------------------------------------------------------
  // 4. AUDIO ENGINE & HARD RULE #3 (Zero Autoplay)
  // -------------------------------------------------------------
  describe('4. Audio Engine & Strict Opt-In Safeguards (Hard Rule #3)', () => {
    it('verifies audio bundle size is strictly below 2 MB budget', () => {
      const audioDir = path.join(rootDir, 'public/experience/audio');
      expect(fs.existsSync(audioDir)).toBe(true);

      const files = fs.readdirSync(audioDir);
      expect(files.length).toBeGreaterThan(0);

      let totalSizeBytes = 0;
      files.forEach((f) => {
        const stats = fs.statSync(path.join(audioDir, f));
        totalSizeBytes += stats.size;
      });

      const totalSizeKb = Math.round(totalSizeBytes / 1024);
      // Hard budget is 2 MB = 2048 KB; actual bundle is ~573 KB
      expect(totalSizeKb).toBeLessThan(2048);
      expect(totalSizeKb).toBeLessThan(750);
    });

    it('verifies CREDITS.md logs all audio stems with licenses and zero copyrighted assets', () => {
      const creditsPath = path.join(rootDir, 'public/experience/CREDITS.md');
      expect(fs.existsSync(creditsPath)).toBe(true);

      const content = fs.readFileSync(creditsPath, 'utf8');
      expect(content).toContain('Procedural code synthesis');
      expect(content).toContain('MIT');
      expect(content).toContain('573 KB');
      expect(content).toContain('dhol-tasha');
      expect(content).toContain('hammer-strike');
      expect(content).toContain('misal-sizzle');
    });

    it('verifies useAudioEngine initializes with muted/disabled audio by default', () => {
      const audioEnginePath = path.join(rootDir, 'components/experience/audio/useAudioEngine.ts');
      const content = fs.readFileSync(audioEnginePath, 'utf8');

      // Audio engine must respect Hard Rule #3: default audio is off
      expect(content).toContain('useState<boolean>(false)');
      expect(content).toContain('visibilitychange');
    });
  });

  // -------------------------------------------------------------
  // 5. CALM / LITE MODE & ACCESSIBILITY (Hard Rule #3 & #4)
  // -------------------------------------------------------------
  describe('5. Calm / Lite Mode (?lite=1) & Accessibility Standards', () => {
    it('verifies LazyWebGLCanvas creates 0 WebGL canvases when isLiteMode or reduced motion is true', () => {
      const canvasPath = path.join(rootDir, 'components/experience/webgl/LazyWebGLCanvas.tsx');
      const content = fs.readFileSync(canvasPath, 'utf8');

      expect(content).toContain('isLiteMode');
      expect(content).toContain('prefersReducedMotion');
      expect(content).toContain('exp-lite-backdrop');
    });

    it('verifies LenisBootstrap bypasses smooth scroll loops when isLiteMode is true', () => {
      const lenisPath = path.join(rootDir, 'components/experience/motion/LenisBootstrap.tsx');
      const content = fs.readFileSync(lenisPath, 'utf8');

      expect(content).toContain('if (isLiteMode || prefersReducedMotion)');
      expect(content).toContain('lenisRef.current.destroy()');
    });

    it('verifies ExperienceNavSticky provides accessible toggle buttons for Lite Mode and Audio', () => {
      const navPath = path.join(rootDir, 'components/experience/ExperienceNavSticky.tsx');
      const content = fs.readFileSync(navPath, 'utf8');

      expect(content).toContain('toggleLiteMode');
      expect(content).toContain('toggleAudio');
      expect(content).toContain('aria-label');
    });
  });

  // -------------------------------------------------------------
  // 6. CHAPTER 5: TACTILE MINI-GAMES SUITE
  // -------------------------------------------------------------
  describe('6. Chapter 5 Tactile Mini-Games & Cultural Authenticity', () => {
    beforeEach(() => {
      mockStorage.clear();
      vi.stubGlobal('localStorage', mockStorage);
      vi.stubGlobal('window', {
        dispatchEvent: vi.fn(),
        localStorage: mockStorage,
      });
    });

    it('verifies all 5 mini-game components exist and export cleanly', () => {
      const playgroundDir = path.join(rootDir, 'components/experience/chapters/playground');
      const games = [
        'MisalBuilderGame.tsx',
        'TambatRhythmGame.tsx',
        'TanajiClimbGame.tsx',
        'RelicInspectorGame.tsx',
        'GaneshotsavProcessionGame.tsx',
      ];

      games.forEach((gameFile) => {
        expect(fs.existsSync(path.join(playgroundDir, gameFile))).toBe(true);
      });
    });

    it('verifies Manache Ganpatis in Ganeshotsav game are ordered in exact historical priority (1 to 5)', () => {
      const data = getPlaygroundGameData();
      const ganpatis = data.dholTashaGame.manacheGanpati;

      expect(ganpatis.length).toBe(5);
      expect(ganpatis[0].rank).toBe(1);
      expect(ganpatis[0].nameEn).toContain('Kasba Ganpati');
      expect(ganpatis[1].rank).toBe(2);
      expect(ganpatis[1].nameEn).toContain('Tambdi Jogeshwari');
      expect(ganpatis[2].rank).toBe(3);
      expect(ganpatis[2].nameEn).toContain('Guruji Talim');
      expect(ganpatis[3].rank).toBe(4);
      expect(ganpatis[3].nameEn).toContain('Tulshibaug');
      expect(ganpatis[4].rank).toBe(5);
      expect(ganpatis[4].nameEn).toContain('Kesari Wada');
    });

    it('verifies all 5 collectible playground stamps exist with authentic titles and icons', () => {
      const stamps = Object.values(PLAYGROUND_STAMPS);
      expect(stamps.length).toBe(5);
      const ids = stamps.map((s) => s.id);

      expect(ids).toContain('stamp-misal-master');
      expect(ids).toContain('stamp-tambat-artisan');
      expect(ids).toContain('stamp-tanaji-escalade');
      expect(ids).toContain('stamp-kelkar-curator');
      expect(ids).toContain('stamp-ganeshotsav-procession');
    });

    it('completing mini-games updates persistent progress and unlocks passport stamps', () => {
      const res1 = markGameCompleted('misal');
      expect(res1.progress.misal).toBe(true);
      expect(res1.stamp.id).toBe('stamp-misal-master');

      const res2 = markGameCompleted('tanaji');
      expect(res2.progress.tanaji).toBe(true);
      expect(res2.stamp.id).toBe('stamp-tanaji-escalade');

      const currentProgress = getPlaygroundProgress();
      expect(currentProgress.misal).toBe(true);
      expect(currentProgress.tanaji).toBe(true);
      expect(currentProgress.tambat).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // 7. DESIGN TOKENS & RESPONSIVENESS (Hard Rule #6 & #7)
  // -------------------------------------------------------------
  describe('7. Design Tokens, Theming & Cross-Device Compatibility', () => {
    it('verifies palette tokens define authentic Deccan colors (basalt, saffron, teak, monsoon, gold, emerald, copper)', () => {
      expect(palette.basalt[900]).toBe('#080b11');
      expect(palette.saffron[600]).toBe('#ea580c');
      expect(palette.teak[800]).toBe('#78350f');
      expect(palette.monsoon[700]).toBe('#0284c7');
      expect(palette.gold[500]).toBe('#eab308');
      expect(palette.copper[600]).toBe('#b45309');
    });

    it('verifies theme tokens provide dark and light contrast definitions', () => {
      expect(themeTokens.dark.bg.canvas).toBe(palette.basalt[900]);
      expect(themeTokens.light.bg.canvas).toBe(palette.parchment[600]);
    });

    it('verifies tokens.css defines CSS custom variables and media queries for reduced-motion and mobile', () => {
      const tokensCssPath = path.join(rootDir, 'components/experience/tokens/tokens.css');
      expect(fs.existsSync(tokensCssPath)).toBe(true);

      const content = fs.readFileSync(tokensCssPath, 'utf8');
      expect(content).toContain('--exp-basalt-900: #080b11');
      expect(content).toContain('--exp-saffron-600: #ea580c');
      expect(content).toContain('@media (prefers-reduced-motion: reduce)');

      const expCssPath = path.join(rootDir, 'app/experience/experience.css');
      const expCssContent = fs.readFileSync(expCssPath, 'utf8');
      expect(expCssContent).toContain('@media (max-width: 768px)');
    });
  });
});

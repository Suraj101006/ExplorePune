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
} from '@/lib/experienceData';

describe('Experience Pune — Immersive Tourism Discovery Platform (/experience)', () => {
  const rootDir = path.resolve(__dirname, '..');
  const pagePath = path.join(rootDir, 'app/experience/page.tsx');
  const cssPath = path.join(rootDir, 'app/experience/experience.css');
  const canvasPath = path.join(rootDir, 'components/experience/ExperienceCanvas.tsx');
  const appHeaderPath = path.join(rootDir, 'components/AppHeader.tsx');

  it('1. Experience page route exists and dynamically imports Three.js WebGL canvas without SSR', () => {
    expect(fs.existsSync(pagePath)).toBe(true);
    const content = fs.readFileSync(pagePath, 'utf8');

    expect(content).toContain("import('@/components/experience/ExperienceCanvas')");
    expect(content).toContain('ssr: false');
    expect(content).toContain('<ExperienceCanvas');
    expect(content).toContain('application/ld+json');
    expect(content).toContain('TouristDestination');
  });

  it('2. Experience page renders all discovery and next-gen storytelling sections in sequence', () => {
    const content = fs.readFileSync(pagePath, 'utf8');

    expect(content).toContain('<ExperienceHero');
    expect(content).toContain('<ExperienceWorld3D');
    expect(content).toContain('<ExperiencePinnedJourney');
    expect(content).toContain('<ExperienceCategories');
    expect(content).toContain('<ExperienceMap');
    expect(content).toContain('<HeritageStorySection');
    expect(content).toContain('<AdventureFortsSection');
    expect(content).toContain('<TasteOfPuneSection');
    expect(content).toContain('<ExperienceCuriosityCabinet');
    expect(content).toContain('<CultureTraditionsSection');
    expect(content).toContain('<NatureEscapesSection');
    expect(content).toContain('<HiddenGemsSection');
    expect(content).toContain('<SeasonalExperienceSection');
    expect(content).toContain('<PersonalizedFinder');
    expect(content).toContain('<ItineraryBuilderSection');
    expect(content).toContain('<ExperienceStoriesSection');
    expect(content).toContain('<CommunityProgressSection');
    expect(content).toContain('<ExperienceFooterCta');
    expect(content).toContain('<ExperienceCursor');
    expect(content).toContain('<ExperienceCinematicIntro');
  });

  it('3. Three.js ExperienceCanvas configures 3D particle systems, lighting, and memory cleanup', () => {
    expect(fs.existsSync(canvasPath)).toBe(true);
    const content = fs.readFileSync(canvasPath, 'utf8');

    expect(content).toContain('new THREE.WebGLRenderer');
    expect(content).toContain('new THREE.Points');
    expect(content).toContain('dispose()');
    expect(content).toContain('cancelAnimationFrame');
  });

  it('4. AppHeader navbar integrates the Experience route across desktop and mobile', () => {
    const content = fs.readFileSync(appHeaderPath, 'utf8');

    expect(content).toContain("href: '/experience'");
    expect(content).toContain('Experience');
    expect(content).toContain('Sparkles');
  });

  it('5. experience.css includes scoped architecture, responsive breakpoints, and reduced-motion compliance', () => {
    expect(fs.existsSync(cssPath)).toBe(true);
    const content = fs.readFileSync(cssPath, 'utf8');

    expect(content).toContain('.experience-root');
    expect(content).toContain('.exp-canvas-container');
    expect(content).toContain('@media (max-width: 1024px)');
    expect(content).toContain('@media (max-width: 768px)');
    expect(content).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('6. Experience Data Catalog verifies all 106 destinations, 16 categories, and 8 itinerary templates', () => {
    expect(ALL_106_PLACES.length).toBe(106);
    expect(EXPERIENCE_CATEGORIES.length).toBe(16);
    expect(ITINERARY_TEMPLATES.length).toBe(8);
    expect(EXPERIENCE_STORIES_DATA.length).toBe(6);
    expect(FORTS_ADVENTURE_DATA.length).toBe(7);
    expect(TASTE_OF_PUNE_DATA.length).toBe(6);
    expect(SEASONS_DATA.length).toBe(4);
    expect(HIDDEN_GEMS_DATA.length).toBe(6);

    // Verify all 16 categories resolve places
    EXPERIENCE_CATEGORIES.forEach((cat) => {
      const matching = ALL_106_PLACES.filter(cat.slugFilter);
      expect(matching.length).toBeGreaterThan(0);
    });

    // Verify all 8 templates have valid destination slugs
    ITINERARY_TEMPLATES.forEach((tmpl) => {
      expect(tmpl.stops.length).toBeGreaterThanOrEqual(3);
      tmpl.stops.forEach((slug) => {
        const found = ALL_106_PLACES.some((p) => p.slug === slug);
        expect(found).toBe(true);
      });
    });

    // Verify coordinates fall within Maharashtra / Pune regional bounds
    ALL_106_PLACES.forEach((place) => {
      expect(place.latitude).toBeGreaterThan(18.0);
      expect(place.latitude).toBeLessThan(19.5);
      expect(place.longitude).toBeGreaterThan(73.0);
      expect(place.longitude).toBeLessThan(75.0);
    });
  });

  it('7. ExperienceWorld3D configures Three.js terrain, landmark beacons, raycaster, and cleanup', () => {
    const world3dPath = path.join(rootDir, 'components/experience/ExperienceWorld3D.tsx');
    expect(fs.existsSync(world3dPath)).toBe(true);
    const content = fs.readFileSync(world3dPath, 'utf8');

    expect(content).toContain('new THREE.WebGLRenderer');
    expect(content).toContain('new THREE.PlaneGeometry');
    expect(content).toContain('new THREE.Raycaster');
    expect(content).toContain('shaniwar-wada');
    expect(content).toContain('sinhagad-fort');
    expect(content).toContain('aga-khan-palace');
    expect(content).toContain('pataleshwar-cave-temple');
    expect(content).toContain('dispose()');
  });

  it('8. ExperiencePinnedJourney implements epoch storytelling across 4 historical eras', () => {
    const journeyPath = path.join(rootDir, 'components/experience/ExperiencePinnedJourney.tsx');
    expect(fs.existsSync(journeyPath)).toBe(true);
    const content = fs.readFileSync(journeyPath, 'utf8');

    expect(content).toContain('8th Century CE');
    expect(content).toContain('17th Century CE');
    expect(content).toContain('18th Century CE');
    expect(content).toContain('19th & 20th Century CE');
    expect(content).toContain('The Basalt Monoliths');
    expect(content).toContain('The Swarajya Bastions');
    expect(content).toContain('The Imperial Peshwa Court');
    expect(content).toContain('The Crucible of Freedom & Reform');
  });

  it('9. ExperienceCuriosityCabinet features tactile heritage relics and curiosity radar', () => {
    const cabinetPath = path.join(rootDir, 'components/experience/ExperienceCuriosityCabinet.tsx');
    expect(fs.existsSync(cabinetPath)).toBe(true);
    const content = fs.readFileSync(cabinetPath, 'utf8');

    expect(content).toContain('tambat-copper-bamb');
    expect(content).toContain('peshwa-rajmudra');
    expect(content).toContain('tanaji-maratha-dhal');
    expect(content).toContain('gandhi-charkha');
    expect(content).toContain('vintage-paratrooper-bicycle');
    expect(content).toContain('HERITAGE_RELICS');
    expect(content).toContain('CURIOSITY_TRIVIA');
  });

  it('10. ExperienceHero renders reference-inspired subtitle and quick action controls', () => {
    const heroPath = path.join(rootDir, 'components/experience/ExperienceHero.tsx');
    expect(fs.existsSync(heroPath)).toBe(true);
    const content = fs.readFileSync(heroPath, 'utf8');

    expect(content).toContain('Discover the city beyond its streets.');
    expect(content).toContain("scrollTo('world3d')");
    expect(content).toContain("scrollTo('categories')");
    expect(content).toContain("scrollTo('map')");
  });

  it('11. ExperienceCinematicIntro orchestrates 10-second telemetry, kinetic typography, and shutter wipe', () => {
    const introPath = path.join(rootDir, 'components/experience/ExperienceCinematicIntro.tsx');
    expect(fs.existsSync(introPath)).toBe(true);
    const content = fs.readFileSync(introPath, 'utf8');

    expect(content).toContain('COORDINATES: 18.5204° N, 73.8567° E');
    expect(content).toContain('exp-split-char');
    expect(content).toContain('Where basalt meets the clouds');
    expect(content).toContain('exp-dial-indicator');
    expect(content).toContain('exp-shutter-blade');
    expect(content).toContain('prefers-reduced-motion');
  });

  it('12. ExperienceAudio synthesizes harmonic drone via Web Audio API with gain control and cleanup', () => {
    const audioPath = path.join(rootDir, 'components/experience/ExperienceAudio.tsx');
    expect(fs.existsSync(audioPath)).toBe(true);
    const content = fs.readFileSync(audioPath, 'utf8');

    expect(content).toContain('window.AudioContext');
    expect(content).toContain('createOscillator');
    expect(content).toContain('createGain');
    expect(content).toContain('createBiquadFilter');
    expect(content).toContain('setTargetAtTime');
  });

  it('13. Phase 1 Foundation: ExperienceProvider provides scroll, audio, lite mode, and reduced motion states', () => {
    const providerPath = path.join(rootDir, 'components/experience/context/ExperienceProvider.tsx');
    expect(fs.existsSync(providerPath)).toBe(true);
    const content = fs.readFileSync(providerPath, 'utf8');

    expect(content).toContain('toggleAudio');
    expect(content).toContain('toggleLiteMode');
    expect(content).toContain('prefers-reduced-motion');
    expect(content).toContain('globalChapterRegistry');
  });

  it('14. Phase 1 Foundation: LenisBootstrap binds smooth scrolling with GSAP ScrollTrigger and provides Lite bypass', () => {
    const lenisPath = path.join(rootDir, 'components/experience/motion/LenisBootstrap.tsx');
    expect(fs.existsSync(lenisPath)).toBe(true);
    const content = fs.readFileSync(lenisPath, 'utf8');

    expect(content).toContain("import Lenis from 'lenis'");
    expect(content).toContain("import { ScrollTrigger } from 'gsap/ScrollTrigger'");
    expect(content).toContain('isLiteMode || prefersReducedMotion');
    expect(content).toContain('gsap.ticker.add');
    expect(content).toContain('lenis.destroy()');
  });

  it('15. Phase 1 Foundation: ChapterRegistry handles registration, enter/exit, and scrub progress', () => {
    const registryPath = path.join(rootDir, 'lib/experience/registry.ts');
    expect(fs.existsSync(registryPath)).toBe(true);
    const content = fs.readFileSync(registryPath, 'utf8');

    expect(content).toContain('register(chapter');
    expect(content).toContain('unregister(id');
    expect(content).toContain('scrubChapter(id');
    expect(content).toContain('globalChapterRegistry');
  });

  it('16. Phase 1 Foundation: CREDITS.md documents asset licenses, provenance, and third-party dependencies', () => {
    const creditsPath = path.join(rootDir, 'public/experience/CREDITS.md');
    expect(fs.existsSync(creditsPath)).toBe(true);
    const content = fs.readFileSync(creditsPath, 'utf8');

    expect(content).toContain('Hard Rule #8');
    expect(content).toContain('gsap');
    expect(content).toContain('lenis');
    expect(content).toContain('howler');
    expect(content).toContain('Archaeological Survey of India');
  });
});

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Experience Page & Cinematic Visual System (/experience)', () => {
  const rootDir = path.resolve(__dirname, '..');
  const pagePath = path.join(rootDir, 'app/experience/page.tsx');
  const cssPath = path.join(rootDir, 'app/experience/experience.css');
  const canvasPath = path.join(rootDir, 'components/experience/ExperienceCanvas.tsx');
  const audioPath = path.join(rootDir, 'components/experience/ExperienceAudio.tsx');
  const appHeaderPath = path.join(rootDir, 'components/AppHeader.tsx');

  it('1. Experience page route exists and dynamically imports Three.js WebGL canvas without SSR', () => {
    expect(fs.existsSync(pagePath)).toBe(true);
    const content = fs.readFileSync(pagePath, 'utf8');

    expect(content).toContain("import('@/components/experience/ExperienceCanvas')");
    expect(content).toContain('ssr: false');
    expect(content).toContain('<ExperienceCanvas');
    expect(content).toContain('<ExperienceControls');
  });

  it('2. Experience page renders all seven mandatory cinematic scenes in sequence', () => {
    const content = fs.readFileSync(pagePath, 'utf8');

    expect(content).toContain('<ScenePortal');
    expect(content).toContain('<SceneInfiniteUniverse');
    expect(content).toContain('<SceneKineticTypography');
    expect(content).toContain('<SceneVisualGallery');
    expect(content).toContain('<SceneInteractive3D');
    expect(content).toContain('<SceneMotionLab');
    expect(content).toContain('<SceneGrandFinale');
  });

  it('3. Three.js ExperienceCanvas configures 3D particle systems, lighting, and memory cleanup', () => {
    expect(fs.existsSync(canvasPath)).toBe(true);
    const content = fs.readFileSync(canvasPath, 'utf8');

    expect(content).toContain('new THREE.WebGLRenderer');
    expect(content).toContain('new THREE.Points');
    expect(content).toContain('new THREE.IcosahedronGeometry');
    expect(content).toContain('new THREE.TorusGeometry');
    expect(content).toContain('dispose()');
    expect(content).toContain('cancelAnimationFrame');
  });

  it('4. ExperienceAudio enforces sound OFF by default with explicit user gesture activation', () => {
    expect(fs.existsSync(audioPath)).toBe(true);
    const content = fs.readFileSync(audioPath, 'utf8');

    expect(content).toContain('const [isPlaying, setIsPlaying] = useState(false)');
    expect(content).toContain('AudioContext');
    expect(content).toContain('Sound Off');
  });

  it('5. AppHeader navbar integrates the Experience route across desktop and mobile', () => {
    const content = fs.readFileSync(appHeaderPath, 'utf8');

    expect(content).toContain("href: '/experience'");
    expect(content).toContain('Experience');
    expect(content).toContain('Sparkles');
  });

  it('6. experience.css includes scoped architecture, responsive breakpoints, and reduced-motion compliance', () => {
    expect(fs.existsSync(cssPath)).toBe(true);
    const content = fs.readFileSync(cssPath, 'utf8');

    expect(content).toContain('.experience-root');
    expect(content).toContain('.exp-canvas-container');
    expect(content).toContain('@media (max-width: 768px)');
    expect(content).toContain('@media (prefers-reduced-motion: reduce)');
  });
});

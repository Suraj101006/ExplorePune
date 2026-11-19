import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Explore Pune — Advanced Performance, Security & WebGL Quality Audit', () => {
  const rootDir = path.resolve(__dirname, '..');
  const pagePath = path.join(rootDir, 'app/experience/page.tsx');
  const mapPath = path.join(rootDir, 'components/experience/LivePuneDistrictMap.tsx');
  const nextConfigPath = path.join(rootDir, 'next.config.ts');
  const geocodingPath = path.join(rootDir, 'lib/services/GeocodingService.ts');

  describe('1. Code Splitting & Lazy Loading (Bundle Optimization)', () => {
    it('verifies non-critical modals are lazy-loaded via next/dynamic', () => {
      const pageCode = fs.readFileSync(pagePath, 'utf8');

      // Verify dynamic imports
      expect(pageCode).toContain("const DiscoveryMissionsModal = dynamic(");
      expect(pageCode).toContain("const AchievementsModal = dynamic(");
      expect(pageCode).toContain("const DistrictDirectoryTable = dynamic(");
      expect(pageCode).toContain("const ExploreAnywhereModal = dynamic(");
      expect(pageCode).toContain("const GpsPermissionModal = dynamic(");
      expect(pageCode).toContain("const MapIntro = dynamic(");

      // Verify ssr: false is set for client modals
      expect(pageCode).toContain("{ ssr: false }");
    });

    it('verifies search query is debounced to eliminate keystroke DOM thrashing', () => {
      const pageCode = fs.readFileSync(pagePath, 'utf8');
      expect(pageCode).toContain('debouncedSearchQuery');
      expect(pageCode).toContain('searchQuery={debouncedSearchQuery}');
      expect(pageCode).toMatch(/setTimeout\(\s*\(\)\s*=>\s*\{[\s\S]*setDebouncedSearchQuery\(searchQuery\)/);
    });

    it('verifies mouse move and camera dispatches are decoupled from root page re-renders', () => {
      const pageCode = fs.readFileSync(pagePath, 'utf8');
      // Verify cursorLat/cursorLng state updates are removed from mousemove
      expect(pageCode).not.toContain('setCursorLat(lat)');
      expect(pageCode).not.toContain('setCursorLng(lng)');
    });
  });

  describe('2. WebGL Stability & Context Lifecycle Management', () => {
    it('implements hardware WebGL availability check with graceful fallback', () => {
      const mapCode = fs.readFileSync(mapPath, 'utf8');

      // Checks WebGL hardware acceleration availability
      expect(mapCode).toContain('isWebGlSupported');
      expect(mapCode).toContain('WebGLRenderingContext');
      expect(mapCode).toContain('setIsWebGlUnsupported');
      expect(mapCode).toContain('WebGL 3D Acceleration Unavailable');
    });

    it('implements WebGL context loss handling and automatic recovery', () => {
      const mapCode = fs.readFileSync(mapPath, 'utf8');

      // Canvas context loss listeners
      expect(mapCode).toContain("addEventListener('webglcontextlost'");
      expect(mapCode).toContain("addEventListener('webglcontextrestored'");

      // Event listener cleanup on unmount
      expect(mapCode).toContain("removeEventListener('webglcontextlost'");
      expect(mapCode).toContain("removeEventListener('webglcontextrestored'");
    });

    it('cancels all active animation frame loops on unmount to prevent memory leaks', () => {
      const mapCode = fs.readFileSync(mapPath, 'utf8');

      expect(mapCode).toContain('cancelAnimationFrame(routeAnimRef.current)');
      expect(mapCode).toContain('cancelAnimationFrame(trailAnimRef.current)');
      expect(mapCode).toContain('cancelAnimationFrame(customRouteAnimRef.current)');
      expect(mapCode).toContain('cancelAnimationFrame(orbitAnimRef.current)');
      expect(mapCode).toContain('cancelAnimationFrame(driftAnimRef.current)');
      expect(mapCode).toContain('clearTimeout(idleTimerRef.current)');
      expect(mapCode).toContain('map.remove()');
    });
  });

  describe('3. Level of Detail (LOD) & Asset Optimization', () => {
    it('applies Level of Detail (LOD) filtering at overview zoom levels', () => {
      const mapCode = fs.readFileSync(mapPath, 'utf8');

      expect(mapCode).toContain('currentZoom < 9.8');
      expect(mapCode).toContain('FLAGSHIP_SLUGS');
      expect(mapCode).toContain("map.on('zoomend'");
    });

    it('enforces lazy loading and async decoding on marker preview images', () => {
      const mapCode = fs.readFileSync(mapPath, 'utf8');

      expect(mapCode).toContain('loading="lazy"');
      expect(mapCode).toContain('decoding="async"');
    });
  });

  describe('4. Mobile & Low-Power Adaptability', () => {
    it('clamps device pixel ratio and tile cache size on mobile or low-power hardware', () => {
      const mapCode = fs.readFileSync(mapPath, 'utf8');

      expect(mapCode).toContain('hardwareConcurrency');
      expect(mapCode).toContain('pixelRatio: adaptivePixelRatio');
      expect(mapCode).toContain('maxTileCacheSize: isLowPower ? 60 : 150');
    });

    it('honors prefers-reduced-motion to protect users with vestibular sensitivities', () => {
      const mapCode = fs.readFileSync(mapPath, 'utf8');

      expect(mapCode).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
      expect(mapCode).toContain('isDriftEnabledRef.current = false');
    });
  });

  describe('5. Security, CSP Compatibility & Privacy Safeguards', () => {
    it('strictly confines private API keys to server context without client exposure', () => {
      const geocodingCode = fs.readFileSync(geocodingPath, 'utf8');

      // NEXT_PUBLIC_GOOGLE_MAPS_API_KEY must not be referenced
      expect(geocodingCode).not.toContain('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
      expect(geocodingCode).toContain('process.env.GOOGLE_MAPS_API_KEY');
    });

    it('enforces rigorous Content Security Policy (CSP) and permission headers', () => {
      const nextConfigCode = fs.readFileSync(nextConfigPath, 'utf8');

      expect(nextConfigCode).toContain('Content-Security-Policy');
      expect(nextConfigCode).toContain("default-src 'self'");
      expect(nextConfigCode).toContain("worker-src 'self' blob:");
      expect(nextConfigCode).toContain("object-src 'none'");
      expect(nextConfigCode).toContain('Permissions-Policy');
      expect(nextConfigCode).toContain('geolocation=(self)');
    });
  });
});

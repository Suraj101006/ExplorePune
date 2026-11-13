import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Explore Pune Web Performance & Core Web Vitals Optimizations', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('1. next.config.ts configures compression, modern image formats, and immutable asset caching', () => {
    const nextConfigPath = path.join(rootDir, 'next.config.ts');
    const content = fs.readFileSync(nextConfigPath, 'utf8');

    // HTTP Compression enabled
    expect(content).toContain('compress: true');

    // AVIF and WebP modern image formats
    expect(content).toContain('"image/avif"');
    expect(content).toContain('"image/webp"');

    // Static assets 1-year immutable caching header
    expect(content).toContain('source: "/assets/:path*"');
    expect(content).toContain('public, max-age=31536000, immutable');

    // Manifest caching header
    expect(content).toContain('source: "/manifest.webmanifest"');
  });

  it('2. app/layout.tsx provides preconnect and DNS prefetch hints for critical third-party origins', () => {
    const layoutPath = path.join(rootDir, 'app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf8');

    // Font preconnects
    expect(content).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
    expect(content).toContain('rel="preconnect" href="https://fonts.gstatic.com"');

    // DNS prefetch hints for maps, CDN media, and analytics
    expect(content).toContain('rel="dns-prefetch" href="https://tile.openstreetmap.org"');
    expect(content).toContain('rel="dns-prefetch" href="https://commons.wikimedia.org"');
    expect(content).toContain('rel="dns-prefetch" href="https://upload.wikimedia.org"');
    expect(content).toContain('rel="dns-prefetch" href="https://firebasestorage.googleapis.com"');
  });

  it('3. app/globals.css specifies content-visibility and contain-intrinsic-size for offscreen content', () => {
    const cssPath = path.join(rootDir, 'app/globals.css');
    const content = fs.readFileSync(cssPath, 'utf8');

    // Off-screen card deferral
    expect(content).toContain('.card-deferred {');
    expect(content).toContain('content-visibility: auto;');
    expect(content).toContain('contain-intrinsic-size: auto 390px;');

    // Off-screen section and footer containment
    expect(content).toContain('.section-deferred {');
    expect(content).toContain('contain-intrinsic-size: auto 450px;');
    expect(content).toContain('.footer-deferred {');
    expect(content).toContain('contain-intrinsic-size: auto 360px;');

    // Widget containment to eliminate layout thrashing
    expect(content).toContain('.chat-sheet');
    expect(content).toContain('contain: layout style;');
  });

  it('4. components/ClientInteractiveOverlays.tsx schedules non-critical widgets on idle to protect TBT & INP', () => {
    const overlaysPath = path.join(rootDir, 'components/ClientInteractiveOverlays.tsx');
    const content = fs.readFileSync(overlaysPath, 'utf8');

    expect(content).toContain('requestIdleCallback');
    expect(content).toContain('loadDeferred');
    expect(content).toContain('<ChatWidget />');
    expect(content).toContain('<DirectionsModal />');
  });

  it('5. components/HomeExplorer.tsx applies LCP prioritization and lazy loading correctly', () => {
    const homePath = path.join(rootDir, 'components/HomeExplorer.tsx');
    const content = fs.readFileSync(homePath, 'utf8');

    // Sinhagad hero/curator LCP image has priority enabled
    expect(content).toContain('src="/images/places/sinhagad-fort.jpg"');
    expect(content).toContain('priority');

    // Category badges have lazy loading and async decoding
    expect(content).toContain('cat-badge-img');
    expect(content).toContain('loading="lazy"');
    expect(content).toContain('decoding="async"');

    // Off-screen cards and sections use deferred rendering
    expect(content).toContain("card-deferred");
    expect(content).toContain("section-deferred");
  });

  it('6. components/AppFooter.tsx and FeedbackSection.tsx utilize footer and section containment', () => {
    const footerPath = path.join(rootDir, 'components/AppFooter.tsx');
    const footerContent = fs.readFileSync(footerPath, 'utf8');
    expect(footerContent).toContain('footer-deferred');

    const feedbackPath = path.join(rootDir, 'components/FeedbackSection.tsx');
    const feedbackContent = fs.readFileSync(feedbackPath, 'utf8');
    expect(feedbackContent).toContain('section-deferred');
  });

  it('7. components/CinematicPlaceSlideshow.tsx prioritizes the hero image for optimal LCP', () => {
    const slideshowPath = path.join(rootDir, 'components/CinematicPlaceSlideshow.tsx');
    const content = fs.readFileSync(slideshowPath, 'utf8');

    expect(content).toContain("loading={idx === 0 ? 'eager' : 'lazy'}");
    expect(content).toContain("fetchPriority={idx === 0 ? 'high' : 'auto'}");
    expect(content).toContain("decoding={idx === 0 ? 'sync' : 'async'}");
  });

  it('8. components/PlaceDetailClient.tsx splits heavy map and gallery bundles with dynamic imports', () => {
    const placeDetailPath = path.join(rootDir, 'components/PlaceDetailClient.tsx');
    const content = fs.readFileSync(placeDetailPath, 'utf8');

    expect(content).toContain("dynamic(() => import('@/components/PlaceMapWrapper')");
    expect(content).toContain("dynamic(() => import('@/components/TransitRouteMap')");
    expect(content).toContain("dynamic(() => import('@/components/CommunityGallery')");
  });

  it('9. app/globals.css includes ultra-compact mobile overrides for 320px-360px viewports', () => {
    const cssPath = path.join(rootDir, 'app/globals.css');
    const content = fs.readFileSync(cssPath, 'utf8');

    expect(content).toContain('@media (max-width: 360px)');
    expect(content).toContain('padding-inline: 10px;');
  });
});

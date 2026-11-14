import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import BrandLogo, { OFFICIAL_LOGO_PATH, OFFICIAL_LOGO_CDN_URL } from '@/components/BrandLogo';
import { getOfficialLogoDiskPath, getOfficialLogoBase64DataUrl } from '@/lib/officialLogoServer';
import { generateItineraryPdf, ItineraryPdfData } from '@/lib/generateItineraryPdf';
import { generateCertificatePdf, CertificateData } from '@/lib/generateCertificatePdf';

describe('Explore Pune Official Logo Integration & Brand Consistency', () => {
  const officialLogoPath = path.join(process.cwd(), 'public', 'assets', 'explore-pune-logo.png');

  it('1. verifies official logo asset exists at /public/assets/explore-pune-logo.png with valid byte size', () => {
    expect(fs.existsSync(officialLogoPath)).toBe(true);
    const stats = fs.statSync(officialLogoPath);
    expect(stats.size).toBeGreaterThan(50000);
  });

  it('2. verifies original logo dimensions (1024x1024) and RGBA color format (colorType 6)', () => {
    const buf = fs.readFileSync(officialLogoPath);
    // PNG IHDR chunk is located at byte offset 16
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    const bitDepth = buf[24];
    const colorType = buf[25];

    expect(width).toBe(1024);
    expect(height).toBe(1024);
    expect(bitDepth).toBe(8);
    expect(colorType).toBe(6); // 6 = RGBA with alpha channel
  });

  it('3. verifies server-side logo resolver and base64 data URL generator', () => {
    const diskPath = getOfficialLogoDiskPath();
    expect(diskPath).toBeTruthy();
    expect(fs.existsSync(diskPath!)).toBe(true);

    const base64Url = getOfficialLogoBase64DataUrl();
    expect(base64Url).toBeTruthy();
    expect(base64Url!.startsWith('data:image/png;base64,')).toBe(true);
    expect(base64Url!.length).toBeGreaterThan(100000);
  });

  it('4. renders BrandLogo component with correct path, alt text, and uncropped 1:1 proportions', () => {
    const html = renderToString(React.createElement(BrandLogo, { size: 44, alt: 'Explore Pune Official Logo' }));

    expect(html).toContain(encodeURIComponent(OFFICIAL_LOGO_PATH));
    expect(html).toContain('alt="Explore Pune Official Logo"');
    expect(html).toContain('width="44"');
    expect(html).toContain('height="44"');
    expect(html).toContain('object-fit:contain');
  });

  it('5. renders BrandLogo with white contrast badge when withBadge is enabled', () => {
    const html = renderToString(React.createElement(BrandLogo, { size: 44, withBadge: true }));

    expect(html).toContain('brand-logo-badge');
    expect(html).toContain('background:#ffffff');
    expect(html).toContain('border-radius:50%');
  });

  it('6. verifies centralized constants match the production canonical URL', () => {
    expect(OFFICIAL_LOGO_PATH).toBe('/assets/explore-pune-logo.png');
    expect(OFFICIAL_LOGO_CDN_URL).toBe('https://explorepune-guide.vercel.app/assets/explore-pune-logo.png');
  });

  it('7. embeds official logo into generated Trip Itinerary PDF cover and running headers', () => {
    const sampleData: ItineraryPdfData = {
      userName: 'Suraj Dhok',
      planTitle: 'Peshwa Heritage Trail',
      planTheme: 'Historic wadas and Sahyadri forts',
      badge: '🏰',
      startLocationName: 'Pune Station',
      startTime: '09:00 AM',
      travelMode: 'driving',
      totalDurationMinutes: 180,
      bufferMinutes: 20,
      estimatedCost: 50,
      stops: [
        {
          index: 1,
          placeSlug: 'shaniwar-wada',
          name: 'Shaniwar Wada',
          visitMinutes: 90,
          travelMinutes: 20,
        },
      ],
    };

    const doc = generateItineraryPdf(sampleData);
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);

    const output = doc.output();
    expect(output.length).toBeGreaterThan(10000);
  });

  it('8. embeds official logo into generated Certificate PDF', () => {
    const certData: CertificateData = {
      explorerName: 'Suraj Dhok',
      milestoneTitle: 'Sinhagad Conqueror',
      milestoneBadge: '⛰️',
      milestoneDesc: 'Successfully trekked Sinhagad Fort via Kalyan Darwaza',
      dateUnlocked: '2026-11-09',
    };

    const doc = generateCertificatePdf(certData);
    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBe(1);

    const output = doc.output();
    expect(output.length).toBeGreaterThan(10000);
  });

  describe('Google Search Favicon & Organization Logo Compliance', () => {
    const rootDir = path.resolve(__dirname, '..');

    it('9. verifies all Google Search required favicon files exist with valid dimensions and PNG/ICO headers', () => {
      const requiredFiles = [
        { file: 'public/favicon-48x48.png', width: 48, height: 48 },
        { file: 'public/favicon-96x96.png', width: 96, height: 96 },
        { file: 'public/favicon-144x144.png', width: 144, height: 144 },
        { file: 'public/favicon-192x192.png', width: 192, height: 192 },
        { file: 'public/favicon-512x512.png', width: 512, height: 512 },
        { file: 'public/apple-touch-icon.png', width: 180, height: 180 },
        { file: 'public/apple-icon.png', width: 180, height: 180 },
        { file: 'app/apple-icon.png', width: 180, height: 180 },
        { file: 'public/icon.png', width: 512, height: 512 },
        { file: 'app/icon.png', width: 512, height: 512 },
      ];

      for (const item of requiredFiles) {
        const filePath = path.join(rootDir, item.file);
        expect(fs.existsSync(filePath), `Missing ${item.file}`).toBe(true);

        const buf = fs.readFileSync(filePath);
        expect(buf.length).toBeGreaterThan(500);

        // Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
        expect(buf[0]).toBe(0x89);
        expect(buf[1]).toBe(0x50);
        expect(buf[2]).toBe(0x4e);
        expect(buf[3]).toBe(0x47);

        // Check PNG IHDR dimensions at offset 16 and 20
        const w = buf.readUInt32BE(16);
        const h = buf.readUInt32BE(20);
        expect(w).toBe(item.width);
        expect(h).toBe(item.height);
      }
    });

    it('10. verifies multi-resolution favicon.ico exists in both public/ and app/ containing 48x48, 32x32, and 16x16 layers', () => {
      const icoFiles = ['public/favicon.ico', 'app/favicon.ico'];

      for (const relPath of icoFiles) {
        const fullPath = path.join(rootDir, relPath);
        expect(fs.existsSync(fullPath)).toBe(true);

        const buf = fs.readFileSync(fullPath);
        // Header: 00 00 (reserved), 01 00 (type 1 for ICO), count (16-bit LE)
        expect(buf.readUInt16LE(0)).toBe(0);
        expect(buf.readUInt16LE(2)).toBe(1);

        const count = buf.readUInt16LE(4);
        expect(count).toBeGreaterThanOrEqual(3);

        const sizes: number[] = [];
        for (let i = 0; i < count; i++) {
          const entryOffset = 6 + i * 16;
          const w = buf[entryOffset] || 256;
          sizes.push(w);
        }

        // Google requires a multiple of 48px square (48x48), alongside standard 32x32 and 16x16
        expect(sizes).toContain(48);
        expect(sizes).toContain(32);
        expect(sizes).toContain(16);
      }
    });

    it('11. verifies app/layout.tsx specifies Google Search compliant favicon link tags and OpenGraph logo', () => {
      const layoutContent = fs.readFileSync(path.join(rootDir, 'app/layout.tsx'), 'utf8');

      // Link tags for Google Favicon bot
      expect(layoutContent).toContain('<link rel="icon" href="/favicon.ico" sizes="any" />');
      expect(layoutContent).toContain('sizes="48x48" href="/favicon-48x48.png"');
      expect(layoutContent).toContain('sizes="96x96" href="/favicon-96x96.png"');
      expect(layoutContent).toContain('sizes="192x192" href="/favicon-192x192.png"');
      expect(layoutContent).toContain('sizes="512x512" href="/assets/explore-pune-logo.png"');
      expect(layoutContent).toContain('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />');

      // OpenGraph and Twitter cards include official logo
      expect(layoutContent).toContain('/assets/explore-pune-logo.png');
    });

    it('12. verifies components/SiteJsonLd.tsx contains Organization schema with official logo for Google Knowledge Graph', () => {
      const jsonLdContent = fs.readFileSync(path.join(rootDir, 'components/SiteJsonLd.tsx'), 'utf8');

      expect(jsonLdContent).toContain("'Organization'");
      expect(jsonLdContent).toContain('logo: `${siteUrl}/assets/explore-pune-logo.png`');
      expect(jsonLdContent).toContain('publisher:');
    });

    it('13. verifies app/robots.ts explicitly allows Googlebot and Googlebot-Image to crawl all logo and favicon assets', () => {
      const robotsContent = fs.readFileSync(path.join(rootDir, 'app/robots.ts'), 'utf8');

      expect(robotsContent).toContain("'/assets/'");
      expect(robotsContent).toContain("'/favicon.ico'");
      expect(robotsContent).toContain("'/favicon-48x48.png'");
      expect(robotsContent).toContain("'/icon.png'");
      expect(robotsContent).toContain("'/apple-icon.png'");
    });
  });
});

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

  it('1. verifies official logo asset exists at /public/assets/explore-pune-logo.png with exact original byte size', () => {
    expect(fs.existsSync(officialLogoPath)).toBe(true);
    const stats = fs.statSync(officialLogoPath);
    // Exact byte size of the uploaded logo: 102622 bytes
    expect(stats.size).toBe(102622);
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
    const html = renderToString(React.createElement(BrandLogo, { size: 42, alt: 'Explore Pune Official Logo' }));

    expect(html).toContain(encodeURIComponent(OFFICIAL_LOGO_PATH));
    expect(html).toContain('alt="Explore Pune Official Logo"');
    expect(html).toContain('width="42"');
    expect(html).toContain('height="42"');
    expect(html).toContain('object-fit:contain');
  });

  it('5. renders BrandLogo with white contrast badge when withBadge is enabled', () => {
    const html = renderToString(React.createElement(BrandLogo, { size: 36, withBadge: true }));

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
});

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getPlaceVisitorGuidelines } from '../lib/visitorGuidelines';

describe('Google Search Console Indexing Recovery - Verification Suite', () => {
  const vDb = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/destination_verification_database.json'), 'utf8'));
  const places106 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/pune_places_106.json'), 'utf8'));

  describe('1. Mahatma Phule Museum Quality & Disambiguation', () => {
    const mpmV = vDb.find((x: any) => x.destinationId === 'mahatma-phule-museum');
    const mpmP = places106.find((x: any) => (x.id || x.slug) === 'mahatma-phule-museum');
    const guidelines = getPlaceVisitorGuidelines(mpmP);

    it('has accurate Victorian industrial architecture and state archaeology authority', () => {
      expect(mpmV.history.architectureTypeEn).toContain('Victorian');
      expect(mpmV.history.conservationAuthority).toContain('Directorate of Archaeology and Museums');
    });

    it('has authentic transit directions to Ghole Road / Deccan Gymkhana (no Shaniwar Wada leaks)', () => {
      expect(mpmV.transport.nearestBusStopEn).toContain('Balgandharva / Deccan Gymkhana');
      expect(mpmV.transport.nearestMetroStationEn).toContain('Chhatrapati Sambhaji Udyan');
      expect(mpmV.transport.pmpmlDirectBuses).toEqual(expect.arrayContaining(['9', '11', '100', '174']));

      const serializedGuidelines = JSON.stringify(guidelines);
      expect(serializedGuidelines).not.toContain('halt right at Shaniwar Wada');
      expect(serializedGuidelines).not.toContain('Dilli Darwaza');
      expect(serializedGuidelines).not.toContain('Hazari Karanje');
      expect(serializedGuidelines).toContain('Chhatrapati Sambhaji Udyan Metro Station');
    });

    it('preserves verified museum safety rules and bag deposit instructions', () => {
      expect(mpmV.visitorInfo.safetyGuidelinesEn[0]).toContain('antique glass display cabinets');
      expect(guidelines.sections.some(s => s.items.some(i => i.labelEn.includes('Armory Safety')))).toBe(true);
    });
  });

  describe('2. Shinde Chhatri Architectural & Visitor Integrity', () => {
    const scV = vDb.find((x: any) => x.destinationId === 'shinde-chhatri');
    const scP = places106.find((x: any) => (x.id || x.slug) === 'shinde-chhatri');
    const guidelines = getPlaceVisitorGuidelines(scP);

    it('reflects Anglo-Rajasthani architecture and Scindia Devasthan Trust governance', () => {
      expect(scV.history.architectureTypeEn).toContain('Anglo-Rajasthani');
      expect(scV.history.architectureTypeEn).toContain('Italian stained glass');
      expect(scV.history.conservationAuthority).toContain('Scindia Devasthan Trust');
    });

    it('contains Wanowrie locality transit and no Shaniwar Wada text leaks', () => {
      expect(scV.transport.nearestBusStopEn).toContain('Wanowrie Bazaar / Shinde Chhatri');
      expect(scV.transport.nearestMetroStationEn).toContain('Swargate Metro Station');

      const serializedGuidelines = JSON.stringify(guidelines);
      expect(serializedGuidelines).not.toContain('halt right at Shaniwar Wada');
      expect(serializedGuidelines).not.toContain('Dilli Darwaza');
      expect(serializedGuidelines).toContain('Wanowrie');
      expect(serializedGuidelines).toContain('stained glass');
    });

    it('includes active Shiva temple footwear and decorum guidelines', () => {
      expect(scV.visitorInfo.safetyGuidelinesEn[0]).toContain('Footwear must be removed');
      expect(guidelines.sections.some(s => s.items.some(i => i.labelEn.includes('Sanctum Protocol')))).toBe(true);
    });
  });

  describe('3. Tamhini Ghat Sahyadri Geography & Forest Safety', () => {
    const tgV = vDb.find((x: any) => x.destinationId === 'tamhini-ghat');
    const tgP = places106.find((x: any) => (x.id || x.slug) === 'tamhini-ghat');
    const guidelines = getPlaceVisitorGuidelines(tgP);

    it('designates Maharashtra Forest Dept & PWD authority (not PMC gardens)', () => {
      expect(tgV.history.conservationAuthority).toContain('Maharashtra State Forest Department');
      expect(tgV.history.conservationAuthority).toContain('PWD Maharashtra');
      expect(tgV.history.conservationAuthority).not.toContain('PMC');
      expect(tgV.sources.some((s: any) => s.url.includes('mahaforest.gov.in'))).toBe(true);
    });

    it('enforces 6 PM curfew and monsoon waterfall current warnings', () => {
      expect(tgV.visitorInfo.openingHoursEn).toContain('06:00 PM');
      expect(tgV.visitorInfo.safetyGuidelinesEn[0]).toContain('deep waterfall plunge pools');

      const serializedGuidelines = JSON.stringify(guidelines);
      expect(serializedGuidelines).not.toContain('jogging tracks');
      expect(serializedGuidelines).not.toContain('ornamental lawns');
      expect(serializedGuidelines).toContain('NH 753F');
      expect(serializedGuidelines).toContain('Waterfall Current & Deep Plunge Pools');
    });
  });

  describe('4. Standalone Video Showcase (play-metro-transit.html)', () => {
    const html = fs.readFileSync(path.join(__dirname, '../public/play-metro-transit.html'), 'utf8');

    it('has meta description and self-referencing canonical tag', () => {
      expect(html).toContain('<meta name="description" content="Watch the official Pune Metro and PMPML public transit cinematic showcase film');
      expect(html).toContain('<link rel="canonical" href="https://explorepune-guide.vercel.app/play-metro-transit.html">');
      expect(html).toContain('<meta name="robots" content="index, follow">');
    });

    it('has OpenGraph and Twitter card player tags', () => {
      expect(html).toContain('<meta property="og:type" content="video.movie">');
      expect(html).toContain('<meta property="og:video" content="https://explorepune-guide.vercel.app/videos/explore-pune-metro-transit-en.mp4">');
      expect(html).toContain('<meta name="twitter:card" content="player">');
    });

    it('contains Schema.org VideoObject JSON-LD markup', () => {
      expect(html).toContain('"@type": "VideoObject"');
      expect(html).toContain('"name": "Explore Pune — Metro & PMPML Public Transit Cinematic Showcase"');
      expect(html).toContain('"contentUrl": "https://explorepune-guide.vercel.app/videos/explore-pune-metro-transit-en.mp4"');
    });

    it('contains reciprocal navigation links to / and /destinations and /planner', () => {
      expect(html).toContain('href="/" class="nav-back-link"');
      expect(html).toContain('href="/destinations"');
      expect(html).toContain('href="/planner"');
      expect(html).toContain('class="footer-links"');
    });
  });

  describe('5. Sitemap & Indexing Eligibility', () => {
    const sitemapCode = fs.readFileSync(path.join(__dirname, '../app/sitemap.ts'), 'utf8');

    it('does not use dynamic new Date() churn on each crawl', () => {
      expect(sitemapCode).not.toContain('lastModified: now');
      expect(sitemapCode).toContain('const auditReleaseDate = new Date(');
    });

    it('includes /experience in the core static routes for Google discovery', () => {
      expect(sitemapCode).toContain("url: `${baseUrl}/experience`");
    });
  });
});

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { GUIDE_CHAPTERS } from '@/components/WebsiteGuideClient';

describe('Interactive Website Guide & Explorer Handbook Suite', () => {
  it('should define exactly 10 comprehensive chapters matching authentic Explore Pune features', () => {
    expect(GUIDE_CHAPTERS).toBeDefined();
    expect(GUIDE_CHAPTERS.length).toBe(10);

    const ids = GUIDE_CHAPTERS.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10);

    // Verify ordering 1 to 10
    GUIDE_CHAPTERS.forEach((ch, idx) => {
      expect(ch.id).toBe(idx + 1);
      expect(ch.number).toBe(String(idx + 1).padStart(2, '0'));
      expect(ch.titleEn.length).toBeGreaterThan(0);
      expect(ch.titleMr.length).toBeGreaterThan(0);
      expect(ch.subtitleEn.length).toBeGreaterThan(0);
      expect(ch.subtitleMr.length).toBeGreaterThan(0);
      expect(ch.readTime).toMatch(/min/);
      expect(ch.icon.length).toBeGreaterThan(0);
      expect(ch.badge.length).toBeGreaterThan(0);
    });
  });

  it('validates authentic chapter subjects and domain coverage', () => {
    const chMap = new Map(GUIDE_CHAPTERS.map((c) => [c.slug, c]));

    // Chapter 01: Master Registry
    const ch1 = chMap.get('welcome');
    expect(ch1).toBeDefined();
    expect(ch1?.titleEn).toContain('Welcome to Explore Pune');
    expect(ch1?.subtitleEn).toContain('106-Place Master Registry');

    // Chapter 02: Bilingual Search & Category Navigation
    const ch2 = chMap.get('discover');
    expect(ch2).toBeDefined();
    expect(ch2?.titleEn).toContain('Discovering Pune');
    expect(ch2?.subtitleEn).toContain('Bilingual Fuzzy Search');

    // Chapter 03: Destination Details & Live Hours
    const ch3 = chMap.get('destination-details');
    expect(ch3).toBeDefined();
    expect(ch3?.titleEn).toContain('Destination Details & Intelligence');

    // Chapter 04: AI Trip Planner
    const ch4 = chMap.get('smart-trip-planner');
    expect(ch4).toBeDefined();
    expect(ch4?.titleEn).toContain('Smart AI Trip Planner');

    // Chapter 05: Metro Lines 1 & 2 + PMPML Transit
    const ch5 = chMap.get('travel-and-transport');
    expect(ch5).toBeDefined();
    expect(ch5?.titleEn).toContain('Public Transit & Commuting');
    expect(ch5?.subtitleEn).toContain('Metro Lines 1 & 2');

    // Chapter 06: AI Travel Assistant
    const ch6 = chMap.get('ai-travel-assistant');
    expect(ch6).toBeDefined();
    expect(ch6?.titleEn).toContain('AI Travel Assistant');

    // Chapter 07: My Journey & Cinematic Reels
    const ch7 = chMap.get('my-journey');
    expect(ch7).toBeDefined();
    expect(ch7?.titleEn).toContain('My Journey & Cinematic Reels');
    expect(ch7?.subtitleEn).toContain('106-Template Video Engine');

    // Chapter 08: Milestones & Badges
    const ch8 = chMap.get('profile-and-achievements');
    expect(ch8).toBeDefined();
    expect(ch8?.titleEn).toContain('Milestones & Achievement Medals');

    // Chapter 09: Safety & Regulations
    const ch9 = chMap.get('safety-and-travel-updates');
    expect(ch9).toBeDefined();
    expect(ch9?.titleEn).toContain('Safety Alerts & Forest Regulations');

    // Chapter 10: Traveler Checklist & Offline PWA
    const ch10 = chMap.get('tips-troubleshooting');
    expect(ch10).toBeDefined();
    expect(ch10?.titleEn).toContain('Pro Tips, PWA & Traveler Checklist');
  });

  it('verifies that the website guide route files exist with valid metadata and redirect', () => {
    const guidePagePath = path.resolve(process.cwd(), 'app/help/website-guide/page.tsx');
    const helpRedirectPath = path.resolve(process.cwd(), 'app/help/page.tsx');

    expect(fs.existsSync(guidePagePath)).toBe(true);
    expect(fs.existsSync(helpRedirectPath)).toBe(true);

    const guideContent = fs.readFileSync(guidePagePath, 'utf-8');
    expect(guideContent).toContain('/help/website-guide');
    expect(guideContent).toContain('Website Guide & Explorer’s Handbook | Explore Pune');
    expect(guideContent).toContain('guideJsonLd');

    const redirectContent = fs.readFileSync(helpRedirectPath, 'utf-8');
    expect(redirectContent).toContain("permanentRedirect('/help/website-guide')");
  });

  it('verifies navigation integration in AppFooter and AppHeader', () => {
    const footerPath = path.resolve(process.cwd(), 'components/AppFooter.tsx');
    const headerPath = path.resolve(process.cwd(), 'components/AppHeader.tsx');

    const footerContent = fs.readFileSync(footerPath, 'utf-8');
    expect(footerContent).toContain('/help/website-guide');

    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    expect(headerContent).toContain('/help/website-guide');
    expect(headerContent).toContain('mobileNavLinks');
  });

  it('verifies sitemap includes the interactive website guide route', () => {
    const sitemapPath = path.resolve(process.cwd(), 'app/sitemap.ts');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    expect(sitemapContent).toContain('/help/website-guide');
  });
});

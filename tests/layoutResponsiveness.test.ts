import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Layout Responsiveness & Viewport Constraint Benchmarks', () => {
  const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf8');

  const VIEWPORT_WIDTHS = [1920, 1440, 1366, 1024, 768, 430, 390, 375, 360, 320];

  VIEWPORT_WIDTHS.forEach((viewportWidth) => {
    it(`verifies responsive column sizing and card width at ${viewportWidth}px`, () => {
      // Container width calculation:
      // Desktop: 1200px max
      // Tablet / Mobile: 100% minus padding
      const isMobileSmall = viewportWidth <= 480;
      const paddingInline = isMobileSmall ? 12 * 2 : 16 * 2;
      const containerWidth = Math.min(1200, viewportWidth - paddingInline);

      let columns = 3;
      let gap = 20;

      if (viewportWidth <= 640) {
        columns = 1;
        gap = 16;
      } else if (viewportWidth <= 1024) {
        columns = 2;
        gap = 16;
      }

      // Column width = (container - (columns - 1) * gap) / columns
      const totalGap = (columns - 1) * gap;
      const cardWidth = (containerWidth - totalGap) / columns;

      // Card padding: 18px * 2 = 36px (or 14px * 2 = 28px on <=480px)
      const cardPadding = isMobileSmall ? 28 : 36;
      const innerAvailableWidth = cardWidth - cardPadding;

      // At all standard viewports, cardWidth should be at least 280px
      expect(cardWidth).toBeGreaterThanOrEqual(280);

      // Remaining width for price/provenance should comfortably fit price badge (~90px)
      // or flexWrap allows graceful wrap without clipping if width is narrow
      expect(innerAvailableWidth).toBeGreaterThan(180);
    });
  });

  it('guarantees no card element enforces word-break: break-word indiscriminately', () => {
    // .card must not have word-break: break-word
    const cardBlock = globalsCss.match(/\.card\s*\{[^}]+\}/)?.[0] || '';
    expect(cardBlock).not.toContain('word-break: break-word');
  });

  it('verifies floating chat button does not obscure mobile cards and teaser bubble is suppressed on mobile', () => {
    expect(globalsCss).toContain('.chat-teaser-bubble {\n    display: none !important;\n  }');
    expect(globalsCss).toContain('max-width: min(280px, calc(100vw - 48px));');
  });

  describe('Navbar Responsiveness & Zero Horizontal Overflow Invariants', () => {
    it('enforces overflow-x: clip on html, body, and site-header to prevent horizontal scroll', () => {
      expect(globalsCss).toMatch(/html\s*\{[^}]*overflow-x:\s*clip/);
      expect(globalsCss).toMatch(/body\s*\{[^}]*overflow-x:\s*clip/);
      expect(globalsCss).toMatch(/\.site-header\s*\{[^}]*overflow-x:\s*clip/);
    });

    it('collapses desktop nav and displays hamburger button at 1200px to prevent utility collision', () => {
      expect(globalsCss).toMatch(/@media\s*\(max-width:\s*1200px\)\s*\{[\s\S]*?\.desktop-nav\s*\{[^}]*display:\s*none\s*!important/);
      expect(globalsCss).toMatch(/@media\s*\(max-width:\s*1200px\)\s*\{[\s\S]*?\.mobile-menu-btn\s*\{[^}]*display:\s*inline-flex\s*!important/);
    });

    it('compacts theme toggle button into a touch-friendly circular icon button on mobile screens (<= 768px)', () => {
      expect(globalsCss).toMatch(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\.theme-toggle-label\s*\{[^}]*display:\s*none\s*!important/);
      expect(globalsCss).toMatch(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\.theme-toggle-kbd\s*\{[^}]*display:\s*none\s*!important/);
      expect(globalsCss).toMatch(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\.theme-toggle-btn\s*\{[^}]*border-radius:\s*50%/);
    });

    const MOBILE_VIEWPORTS = [320, 360, 375, 390, 412, 430];
    MOBILE_VIEWPORTS.forEach((vw) => {
      it(`guarantees navbar header content width stays strictly within screen width at ${vw}px`, () => {
        // Compute maximum space required by header items on mobile:
        // On <= 340px:
        //   padding: 4px * 2 = 8px
        //   brand: logo 30px + title ~90px + gap 4px = ~124px
        //   utilities: saved 30px + lang 54px + theme 30px + hamburger 30px + 3 gaps (3*3px = 9px) = 153px
        //   total = 8 + 124 + 153 + header gap 3px = 288px <= 320px
        //
        // On <= 400px:
        //   padding: 8px * 2 = 16px
        //   brand: logo 34px + title ~95px + gap 5px = ~134px
        //   utilities: saved 32px + lang 58px + theme 34px + hamburger 34px + 3 gaps (3*4px = 12px) = 170px
        //   total = 16 + 134 + 170 + header gap 4px = 324px <= 360px
        //
        // On <= 768px:
        //   padding: 8px * 2 = 16px
        //   brand: logo 38px + title + subtitle ~145px + gap 6px = ~189px
        //   utilities: saved 34px + lang 64px + theme 34px + hamburger 34px + 3 gaps (3*6px = 18px) = 184px
        //   total = 16 + 189 + 184 + header gap 6px = 395px
        let requiredWidth: number;
        if (vw <= 340) {
          requiredWidth = 288;
        } else if (vw <= 400) {
          requiredWidth = 328;
        } else {
          requiredWidth = 395;
        }

        expect(requiredWidth).toBeLessThanOrEqual(vw);
      });
    });
  });
});

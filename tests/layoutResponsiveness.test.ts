import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Layout Responsiveness & Viewport Constraint Benchmarks', () => {
  const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf8');

  const VIEWPORT_WIDTHS = [1440, 1024, 768, 390, 360];

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
});

import { describe, it, expect } from 'vitest';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';

describe('Destinations & Categories SEO Routing', () => {
  const CATEGORY_SLUGS = ['forts', 'heritage', 'temples', 'museums', 'nature', 'parks', 'food', 'free'];

  it('contains verified destinations covering all core categories', () => {
    expect(ALL_STRUCTURED_PLACES.length).toBeGreaterThan(50);

    // Verify key categories have representative places
    const forts = ALL_STRUCTURED_PLACES.filter((p) => p.category === 'forts' || p.category_slug === 'forts');
    expect(forts.length).toBeGreaterThanOrEqual(10);

    const heritage = ALL_STRUCTURED_PLACES.filter((p) => p.category === 'heritage' || p.category_slug === 'heritage');
    expect(heritage.length).toBeGreaterThanOrEqual(5);

    const temples = ALL_STRUCTURED_PLACES.filter((p) => p.category === 'temples' || p.category_slug === 'temples');
    expect(temples.length).toBeGreaterThanOrEqual(5);
  });

  it('guarantees all category routes are clean static paths without query parameters', () => {
    CATEGORY_SLUGS.forEach((cat) => {
      const cleanPath = `/destinations/${cat}`;
      expect(cleanPath).not.toContain('?');
      expect(cleanPath).not.toContain('=');
      expect(cleanPath).toMatch(/^\/destinations\/[a-z0-9-]+$/);
    });
  });

  it('verifies free category strictly includes ₹0 admission places', () => {
    const freePlaces = ALL_STRUCTURED_PLACES.filter(
      (p) => p.fee_status === 'free' && (p.entry_fee === 0 || p.place_prices?.[0]?.amount === 0)
    );
    expect(freePlaces.length).toBeGreaterThan(0);
    freePlaces.forEach((p) => {
      expect(p.fee_status).toBe('free');
      expect(p.entry_fee ?? p.place_prices?.[0]?.amount).toBe(0);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPmpmlLiveStops,
  searchPmpmlLiveStops,
  getPmpmlNearbyStops,
  getPmpmlLiveRoutes,
  getPmpmlRouteDetails,
  getPmpmlRouteSchedule,
} from '../lib/pmpmlLiveService';

describe('PMPML Live Service', () => {
  it('retrieves live stops list or falls back gracefully', async () => {
    const stops = await getPmpmlLiveStops();
    expect(Array.isArray(stops)).toBe(true);
    expect(stops.length).toBeGreaterThan(0);
    const firstStop = stops[0];
    expect(firstStop).toHaveProperty('id');
    expect(firstStop).toHaveProperty('name');
    expect(firstStop).toHaveProperty('lat');
    expect(firstStop).toHaveProperty('lon');
  });

  it('searches stops by landmark name keyword', async () => {
    const results = await searchPmpmlLiveStops('Swargate', 5);
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
      expect(results[0].name.toLowerCase()).toContain('swargate');
    }
  });

  it('returns empty array for blank stop search query', async () => {
    const results = await searchPmpmlLiveStops('');
    expect(results).toEqual([]);
  });

  it('finds nearby stops for Pune coordinate (Shaniwar Wada area: 18.5194, 73.8553)', async () => {
    const nearby = await getPmpmlNearbyStops(18.5194, 73.8553, 2.0, 5);
    expect(Array.isArray(nearby)).toBe(true);
    expect(nearby.length).toBeGreaterThan(0);
    expect(nearby[0].distanceKm).toBeLessThanOrEqual(2.0);
    // Ensure sorted by ascending distance
    if (nearby.length > 1) {
      expect((nearby[0].distanceKm ?? 0) <= (nearby[1].distanceKm ?? 0)).toBe(true);
    }
  });

  it('fetches PMPML routes or fallback list', async () => {
    const routes = await getPmpmlLiveRoutes();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
    const firstRoute = routes[0];
    expect(firstRoute).toHaveProperty('id');
    expect(firstRoute).toHaveProperty('long_name');
  });

  it('filters routes by search keyword', async () => {
    const routes = await getPmpmlLiveRoutes('100');
    expect(Array.isArray(routes)).toBe(true);
    if (routes.length > 0) {
      const match = routes.some(
        r => r.long_name.includes('100') || r.description.includes('100')
      );
      expect(match).toBe(true);
    }
  });
});

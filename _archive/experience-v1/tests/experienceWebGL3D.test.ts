import { describe, it, expect } from 'vitest';
import {
  geoToWorld,
  getTerrainHeightAt,
  PUNE_CENTER_GEO,
} from '@/components/experience/webgl/DeccanTerrain';
import { PerformanceMonitor } from '@/components/experience/webgl/PerformanceMonitor';
import { getMapPlacePins, getTodaysPeth } from '@/lib/experience/selectors';

describe('Experience WebGL & 3D Engine Verification Suite', () => {
  it('1. geoToWorld correctly maps Pune Zero Stone coordinates to origin (0, Y, 0)', () => {
    const [x, y, z] = geoToWorld(PUNE_CENTER_GEO.lat, PUNE_CENTER_GEO.lng);
    expect(x).toBeCloseTo(0, 1);
    expect(z).toBeCloseTo(0, 1);
    expect(y).toBeGreaterThan(0);
  });

  it('2. Sinhagad Fort maps south-west with prominent elevation peak', () => {
    // Sinhagad: ~18.3664 N, 73.7558 E (South-West)
    const [x, y, z] = geoToWorld(18.3664, 73.7558);
    expect(x).toBeLessThan(0); // West
    expect(z).toBeGreaterThan(0); // South (inverted Z in world space)
    expect(y).toBeGreaterThan(10); // Elevated summit on Deccan plateau
  });

  it('3. Mula-Mutha river trough depresses terrain locally', () => {
    const nearRiverHeight = getTerrainHeightAt(0, 0.5);
    const highlandHeight = getTerrainHeightAt(-31, 47);
    expect(highlandHeight).toBeGreaterThan(nearRiverHeight);
  });

  it('4. PerformanceMonitor caps DPR on mobile and computes rolling FPS', () => {
    const perf = new PerformanceMonitor();
    expect(perf.dprCap).toBeLessThanOrEqual(2.0);
    expect(perf.dprCap).toBeGreaterThanOrEqual(1.0);

    // Simulate 60 ticks
    let time = 1000;
    for (let i = 0; i < 60; i++) {
      time += 16.6; // ~60fps
      perf.tick(time);
    }
    expect(perf.avgFps).toBeGreaterThan(50);
    expect(perf.isLowPerf).toBe(false);
  });

  it('5. getMapPlacePins returns all 106 verified places with valid GPS and categories', () => {
    const pins = getMapPlacePins();
    expect(pins.length).toBe(106);

    pins.forEach((pin) => {
      expect(pin.id).toBeDefined();
      expect(pin.slug).toBeDefined();
      expect(pin.name.length).toBeGreaterThan(0);
      expect(pin.latitude).toBeGreaterThan(18.0);
      expect(pin.longitude).toBeGreaterThan(73.0);
      expect(typeof pin.distanceFromCenterKm).toBe('number');
      expect(pin.categorySlug).toBeDefined();
    });
  });

  it('6. getTodaysPeth returns verified historic Peth according to day of week', () => {
    // Test known Monday (2026-11-16)
    const monday = new Date(2026, 10, 16);
    const mondayPeth = getTodaysPeth(monday);
    expect(mondayPeth.dayOfWeek).toBe(1);
    expect(mondayPeth.pethNameEn).toContain('Somwar');

    // Test known Sunday (2026-11-15)
    const sunday = new Date(2026, 10, 15);
    const sundayPeth = getTodaysPeth(sunday);
    expect(sundayPeth.dayOfWeek).toBe(0);
    expect(sundayPeth.pethNameEn).toContain('Raviwar');

    // Test known Saturday (2026-11-21)
    const saturday = new Date(2026, 10, 21);
    const satPeth = getTodaysPeth(saturday);
    expect(satPeth.dayOfWeek).toBe(6);
    expect(satPeth.pethNameEn).toContain('Shaniwar');
  });
});

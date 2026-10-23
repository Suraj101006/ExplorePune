import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateDestination,
  evaluateGpsAccuracy,
  buildExternalNavigationUrl,
  getStoredTravelMode,
  setStoredTravelMode,
  NavDestination,
} from '../lib/navigationService';

describe('navigationService', () => {
  describe('validateDestination', () => {
    it('approves places with verified valid latitude and longitude', () => {
      const dest: NavDestination = {
        name: 'Sinhagad Fort',
        latitude: 18.3663,
        longitude: 73.7558,
      };
      const res = validateDestination(dest);
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    });

    it('rejects places with null or missing coordinates with clear error', () => {
      const dest: NavDestination = {
        name: 'Unverified Unknown Spot',
        latitude: null,
        longitude: null,
      };
      const res = validateDestination(dest);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('Directions are temporarily unavailable');
      expect(res.errorMr).toContain('मार्ग सध्या अनुपलब्ध आहे');
    });

    it('rejects places with coordinates set to zero (0, 0)', () => {
      const dest: NavDestination = {
        name: 'Null Island Place',
        latitude: 0,
        longitude: 0,
      };
      const res = validateDestination(dest);
      expect(res.valid).toBe(false);
    });

    it('rejects out of bounds coordinates', () => {
      const dest: NavDestination = {
        name: 'Invalid Place',
        latitude: 195.5,
        longitude: 250.3,
      };
      const res = validateDestination(dest);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('Invalid coordinates');
    });
  });

  describe('evaluateGpsAccuracy', () => {
    it('classifies accuracy <= 150m as high quality', () => {
      const evalResult = evaluateGpsAccuracy(25);
      expect(evalResult.quality).toBe('high');
      expect(evalResult.isLow).toBe(false);
      expect(evalResult.warning).toBeUndefined();
    });

    it('classifies accuracy between 150m and 1000m as medium quality', () => {
      const evalResult = evaluateGpsAccuracy(450);
      expect(evalResult.quality).toBe('medium');
      expect(evalResult.isLow).toBe(false);
      expect(evalResult.warning).toBeUndefined();
    });

    it('warns user when accuracy is poor (> 1000m)', () => {
      const evalResult = evaluateGpsAccuracy(1800);
      expect(evalResult.quality).toBe('low');
      expect(evalResult.isLow).toBe(true);
      expect(evalResult.warning).toContain('location accuracy is currently low');
      expect(evalResult.warningMr).toContain('GPS अचूकता कमी आहे');
    });

    it('handles undefined or null accuracy safely', () => {
      const evalResult = evaluateGpsAccuracy(null);
      expect(evalResult.quality).toBe('medium');
      expect(evalResult.isLow).toBe(false);
    });
  });

  describe('buildExternalNavigationUrl', () => {
    const origin = { latitude: 18.52043, longitude: 73.85674 };
    const destination = { latitude: 18.36631, longitude: 73.75582, name: 'Sinhagad Fort' };

    it('builds driving navigation url with exact coordinates', () => {
      const urls = buildExternalNavigationUrl({
        origin,
        destination,
        travelMode: 'driving',
      });

      expect(urls.gmapsUrl).toContain('origin=18.52043,73.85674');
      expect(urls.gmapsUrl).toContain('destination=18.36631,73.75582');
      expect(urls.gmapsUrl).toContain('travelmode=driving');
      expect(urls.appleMapsUrl).toContain('dirflg=d');
    });

    it('builds transit navigation url with transit mode flag', () => {
      const urls = buildExternalNavigationUrl({
        origin,
        destination,
        travelMode: 'transit',
      });

      expect(urls.gmapsUrl).toContain('travelmode=transit');
      expect(urls.appleMapsUrl).toContain('dirflg=r');
    });

    it('builds walking navigation url', () => {
      const urls = buildExternalNavigationUrl({
        origin,
        destination,
        travelMode: 'walking',
      });

      expect(urls.gmapsUrl).toContain('travelmode=walking');
      expect(urls.appleMapsUrl).toContain('dirflg=w');
    });

    it('builds bicycling navigation url', () => {
      const urls = buildExternalNavigationUrl({
        origin,
        destination,
        travelMode: 'bicycling',
      });

      expect(urls.gmapsUrl).toContain('travelmode=bicycling');
      expect(urls.appleMapsUrl).toContain('dirflg=c');
    });
  });

  describe('Travel Mode Session Storage', () => {
    beforeEach(() => {
      // Mock window and sessionStorage in node test environment
      const storage = new Map<string, string>();
      const mockSessionStorage = {
        getItem: (k: string) => storage.get(k) || null,
        setItem: (k: string, v: string) => storage.set(k, v),
        removeItem: (k: string) => storage.delete(k),
        clear: () => storage.clear(),
        key: (i: number) => Array.from(storage.keys())[i] || null,
        length: storage.size,
      };

      (globalThis as any).window = globalThis;
      (globalThis as any).sessionStorage = mockSessionStorage;
      mockSessionStorage.clear();
    });

    it('defaults to driving when nothing is saved', () => {
      globalThis.sessionStorage.clear();
      expect(getStoredTravelMode()).toBe('driving');
    });

    it('persists and retrieves user selected mode across current session', () => {
      setStoredTravelMode('transit');
      expect(getStoredTravelMode()).toBe('transit');

      setStoredTravelMode('walking');
      expect(getStoredTravelMode()).toBe('walking');
    });
  });
});

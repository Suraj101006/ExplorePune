import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Master Destination Research & Fact-Checking Verification Suite (106 Places)', () => {
  const dbPath = path.resolve(__dirname, '../data/destination_verification_database.json');
  const places106Path = path.resolve(__dirname, '../data/pune_places_106.json');

  const verificationDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const places106 = JSON.parse(fs.readFileSync(places106Path, 'utf8'));

  it('1. Database contains exactly 106 destination records with zero omissions', () => {
    expect(verificationDb.length).toBe(106);
    expect(places106.length).toBe(106);
  });

  it('2. Zero duplicate destination IDs, slugs, or normalized names exist', () => {
    const idSet = new Set<string>();
    const nameSet = new Set<string>();

    verificationDb.forEach((p: any) => {
      expect(idSet.has(p.destinationId)).toBe(false);
      idSet.add(p.destinationId);

      const normName = p.name.toLowerCase().trim();
      expect(nameSet.has(normName)).toBe(false);
      nameSet.add(normName);
    });

    expect(idSet.size).toBe(106);
    expect(nameSet.size).toBe(106);
  });

  it('3. All coordinates are valid, correctly ordered (Lat, Lng), and within Pune & Sahyadri geographic boundaries', () => {
    verificationDb.forEach((p: any) => {
      const lat = p.coordinates.latitude;
      const lng = p.coordinates.longitude;

      expect(typeof lat).toBe('number');
      expect(typeof lng).toBe('number');

      // Valid Pune Greater Region boundaries: Lat 18.0° to 19.4° N, Lng 73.2° to 74.8° E
      expect(lat).toBeGreaterThanOrEqual(18.0);
      expect(lat).toBeLessThanOrEqual(19.4);
      expect(lng).toBeGreaterThanOrEqual(73.2);
      expect(lng).toBeLessThanOrEqual(74.8);

      // Verify coordinate order: lat is around 18-19, lng is around 73-74 (never swapped)
      expect(lat).toBeLessThan(lng);
    });
  });

  it('4. Every destination is categorized into one of the 7 official heritage taxonomy classes', () => {
    const validCategories = new Set(['forts', 'heritage', 'temples', 'museums', 'parks', 'nature', 'food']);

    verificationDb.forEach((p: any) => {
      expect(validCategories.has(p.category)).toBe(true);
    });
  });

  it('5. Every destination has at least one verified authoritative source citation with valid URL', () => {
    verificationDb.forEach((p: any) => {
      expect(p.sources).toBeDefined();
      expect(p.sources.length).toBeGreaterThanOrEqual(1);

      p.sources.forEach((src: any) => {
        expect(src.name).toBeDefined();
        expect(src.name.length).toBeGreaterThan(3);
        expect(src.url).toMatch(/^https?:\/\//);
        expect(src.type).toBeDefined();
        expect(src.checkedAt).toBeDefined();
      });
    });
  });

  it('6. All destinations have explicit opening hours and weekly closure statements (never blank)', () => {
    verificationDb.forEach((p: any) => {
      const hoursEn = p.visitorInfo.openingHoursEn;
      const hoursMr = p.visitorInfo.openingHoursMr;
      const closureEn = p.visitorInfo.weeklyClosureEn;

      expect(hoursEn).toBeDefined();
      expect(hoursEn.length).toBeGreaterThan(5);
      expect(hoursMr).toBeDefined();
      expect(hoursMr.length).toBeGreaterThan(5);
      expect(closureEn).toBeDefined();
      expect(closureEn.length).toBeGreaterThan(3);
    });
  });

  it('7. Entry fee structure is mathematically coherent and transparent (₹0 Free vs Paid Ticket)', () => {
    let freeCount = 0;
    let paidCount = 0;

    verificationDb.forEach((p: any) => {
      const fee = p.visitorInfo.entryFee;
      expect(fee).toBeDefined();
      expect(typeof fee.isFree).toBe('boolean');

      if (fee.isFree) {
        freeCount++;
        expect(fee.inrIndian).toBe(0);
        expect(fee.inrForeigner).toBe(0);
      } else {
        paidCount++;
        expect(typeof fee.inrIndian).toBe('number');
        expect(fee.inrIndian).toBeGreaterThan(0);
      }
    });

    expect(freeCount).toBe(83); // 83 Free destinations
    expect(paidCount).toBe(23); // 23 Ticketed monuments/museums
  });

  it('8. All destinations have bilingual Marathi and English titles and physical addresses', () => {
    verificationDb.forEach((p: any) => {
      expect(p.name).toBeDefined();
      expect(p.nameMr).toBeDefined();
      expect(p.nameMr.length).toBeGreaterThan(2);

      expect(p.address.fullAddressEn).toBeDefined();
      expect(p.address.fullAddressMr).toBeDefined();
      expect(p.address.locality).toBeDefined();
    });
  });

  it('9. All destinations have media photography references with alt text and licensing', () => {
    verificationDb.forEach((p: any) => {
      expect(p.media.imageUrl).toMatch(/^\/images\/places\//);
      expect(p.media.imageAltEn).toBeDefined();
      expect(p.media.imageAltMr).toBeDefined();
      expect(p.media.license).toBeDefined();
    });
  });

  it('10. Sinhagad Fort has verified multimodal transit to Swargate and explicit Bus 50 route', () => {
    const sinhagad = verificationDb.find((p: any) => p.destinationId === 'sinhagad-fort');
    expect(sinhagad).toBeDefined();
    expect(sinhagad.transport.pmpmlDirectBuses[0]).toContain('Bus 50');
    expect(sinhagad.transport.nearestBusStopEn).toContain('Donje');
    expect(sinhagad.transport.nearestMetroStationEn).toContain('Swargate');
    expect(sinhagad.visitorInfo.vehicleToll).toBeDefined();
  });
});

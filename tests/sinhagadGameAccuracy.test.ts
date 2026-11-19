import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Sinhagad Fort 2D Game Historical & Architectural Accuracy', () => {
  const rootDir = path.resolve(__dirname, '..');
  const structuresPath = path.join(rootDir, 'data', 'sinhagad_structures.json');
  const tmjMapPath = path.join(rootDir, 'data', 'sinhagad_playable_area_tmj.json');

  it('verifies sinhagad_structures.json exists and contains comprehensive authentic structures', () => {
    expect(fs.existsSync(structuresPath)).toBe(true);
    const structures = JSON.parse(fs.readFileSync(structuresPath, 'utf8'));
    expect(Array.isArray(structures)).toBe(true);
    expect(structures.length).toBeGreaterThanOrEqual(15);

    const ids = structures.map((s: any) => s.id);
    expect(ids).toContain('STR-DARU-01');
    expect(ids).toContain('STR-GATE-01');
    expect(ids).toContain('STR-GATE-02');
    expect(ids).toContain('STR-BURUJ-01');
    expect(ids).toContain('STR-BURUJ-02');
    expect(ids).toContain('STR-CLIFF-01');
    expect(ids).toContain('STR-TANK-01');
    expect(ids).toContain('STR-TANK-02');
    expect(ids).toContain('STR-DEV-01');
    expect(ids).toContain('STR-MEM-01');
    expect(ids).toContain('STR-SAM-01');
    expect(ids).toContain('STR-TMPL-01');
  });

  it('strictly validates Daru Kothar measured dimensions against Kimaya Architects 2017 Survey (Drg W-4 & W-10)', () => {
    const structures = JSON.parse(fs.readFileSync(structuresPath, 'utf8'));
    const daru = structures.find((s: any) => s.id === 'STR-DARU-01');

    expect(daru).toBeDefined();
    expect(daru.measurement_status).toBe('VERIFIED');
    expect(daru.confidence_level).toBe('HIGH');
    expect(daru.source_document).toContain('Kimaya Architects');
    expect(daru.drawing_number).toContain('W-4');

    // Strict survey dimensions
    expect(daru.dimensions.length_m).toBe(8.50);
    expect(daru.dimensions.width_m).toBe(3.77);
    expect(daru.dimensions.height_m).toBe(4.55);
    expect(daru.dimensions.wall_thickness_m).toBe(0.80);
    expect(daru.dimensions.floor_area_sqm).toBeCloseTo(32.04, 1);

    // Architectural features
    expect(daru.features.some((f: string) => f.includes('vaulted'))).toBe(true);
    expect(daru.features.some((f: string) => f.includes('ribs'))).toBe(true);
    expect(daru.features.some((f: string) => f.includes('western entrance'))).toBe(true);

    // Clarification of later alterations
    expect(daru.notes_and_uncertainties).toMatch(/fireplace niche/i);
    expect(daru.notes_and_uncertainties).toMatch(/colonial/i);
  });

  it('strictly validates Pune Darwaza triple gateway and 90-degree tactical bend', () => {
    const structures = JSON.parse(fs.readFileSync(structuresPath, 'utf8'));
    const gate = structures.find((s: any) => s.id === 'STR-GATE-01');

    expect(gate).toBeDefined();
    expect(gate.measurement_status).toBe('VERIFIED');
    expect(gate.confidence_level).toBe('HIGH');
    expect(gate.latitude).toBeCloseTo(18.3695, 3);
    expect(gate.longitude).toBeCloseTo(73.7570, 3);

    expect(gate.features.some((f: string) => f.includes('Three successive defensive gateways'))).toBe(true);
    expect(gate.features.some((f: string) => f.includes('90-degree'))).toBe(true);
    expect(gate.features.some((f: string) => f.includes('bastions'))).toBe(true);
    expect(gate.features.some((f: string) => f.includes('devdis'))).toBe(true);
  });

  it('strictly validates Zunjar Buruj and Kalyan Darwaza specifications', () => {
    const structures = JSON.parse(fs.readFileSync(structuresPath, 'utf8'));
    
    // Zunjar Buruj
    const zunjar = structures.find((s: any) => s.id === 'STR-BURUJ-02');
    expect(zunjar).toBeDefined();
    expect(zunjar.dimensions.length_m).toBe(45.00);
    expect(zunjar.dimensions.width_m).toBe(12.00);
    expect(zunjar.dimensions.height_m).toBe(14.20);
    expect(zunjar.features.some((f: string) => f.includes('cannon embrasures'))).toBe(true);
    expect(zunjar.features.some((f: string) => f.includes('Bhagwa Jhenda'))).toBe(true);

    // Kalyan Darwaza
    const kalyan = structures.find((s: any) => s.id === 'STR-GATE-02');
    expect(kalyan).toBeDefined();
    expect(kalyan.dimensions.length_m).toBe(22.00);
    expect(kalyan.dimensions.width_m).toBe(9.20);
    expect(kalyan.dimensions.wall_thickness_m).toBe(2.80);
    expect(kalyan.features.some((f: string) => f.includes('32-degree'))).toBe(true);
  });

  it('validates Dev Taki and Tanaji Memorial historical accuracy', () => {
    const structures = JSON.parse(fs.readFileSync(structuresPath, 'utf8'));

    // Dev Taki
    const devTaki = structures.find((s: any) => s.id === 'STR-DEV-01');
    expect(devTaki).toBeDefined();
    expect(devTaki.dimensions.length_m).toBe(14.00);
    expect(devTaki.dimensions.width_m).toBe(9.50);
    expect(devTaki.dimensions.height_m).toBe(6.80);
    expect(devTaki.features.some((f: string) => f.includes('450,000 Liters'))).toBe(true);

    // Tanaji Kada / Donagiri
    const kada = structures.find((s: any) => s.id === 'STR-CLIFF-01');
    expect(kada).toBeDefined();
    expect(kada.features.some((f: string) => f.includes('1670'))).toBe(true);
    expect(kada.features.some((f: string) => f.includes('300m'))).toBe(true);
  });

  it('validates Tiled JSON (.tmj) playable map geometry and metric scaling', () => {
    expect(fs.existsSync(tmjMapPath)).toBe(true);
    const tmj = JSON.parse(fs.readFileSync(tmjMapPath, 'utf8'));

    expect(tmj.type).toBe('map');
    expect(tmj.tilewidth).toBe(32);
    expect(tmj.tileheight).toBe(32);

    const scaleProp = tmj.properties.find((p: any) => p.name === 'scale_pixels_per_meter');
    expect(scaleProp).toBeDefined();
    expect(scaleProp.value).toBe(32.0); // 32 pixels = 1 meter

    // Check objects layer
    const structLayer = tmj.layers.find((l: any) => l.name === 'Historical_Structures');
    expect(structLayer).toBeDefined();

    // Check Daru Kothar object dimensions in Tiled map (8.5m * 32 = 272px, 3.77m * 32 = ~121px)
    const daruObj = structLayer.objects.find((o: any) => o.id === 201);
    expect(daruObj).toBeDefined();
    expect(daruObj.width).toBe(272);
    expect(daruObj.height).toBe(121);

    // Check Zunjar Buruj in Tiled map
    const zunjarObj = structLayer.objects.find((o: any) => o.id === 203);
    expect(zunjarObj).toBeDefined();
    expect(zunjarObj.name).toContain('Zunjar Buruj');

    // Check Solid Colliders layer
    const colliderLayer = tmj.layers.find((l: any) => l.name === 'Solid_Colliders');
    expect(colliderLayer).toBeDefined();

    // Ensure walls have 26px (~0.80m) thickness
    const northWall = colliderLayer.objects.find((o: any) => o.name === 'Daru_Kothar_North_Wall');
    expect(northWall).toBeDefined();
    expect(northWall.height).toBe(26); // 26px / 32px/m = ~0.81m
  });
});

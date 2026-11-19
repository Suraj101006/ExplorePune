import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Sinhagad Fort 2D Game Historical & Architectural Accuracy', () => {
  const rootDir = path.resolve(__dirname, '..');
  const structuresPath = path.join(rootDir, 'data', 'sinhagad_structures.json');
  const tmjMapPath = path.join(rootDir, 'data', 'sinhagad_playable_area_tmj.json');

  it('verifies sinhagad_structures.json exists and contains required structures', () => {
    expect(fs.existsSync(structuresPath)).toBe(true);
    const structures = JSON.parse(fs.readFileSync(structuresPath, 'utf8'));
    expect(Array.isArray(structures)).toBe(true);
    expect(structures.length).toBeGreaterThanOrEqual(10);

    const ids = structures.map((s: any) => s.id);
    expect(ids).toContain('STR-DARU-01');
    expect(ids).toContain('STR-GATE-01');
    expect(ids).toContain('STR-GATE-02');
    expect(ids).toContain('STR-BURUJ-01');
    expect(ids).toContain('STR-TANK-01');
    expect(ids).toContain('STR-DEV-01');
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
    expect(daru.features).toContain('Pointed barrel vaulted ceiling');
    expect(daru.features).toContain('Four structural ribs');
    expect(daru.features).toContain('Original western entrance doorway');

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

    expect(gate.features).toContain('Three successive defensive gateways');
    expect(gate.features).toContain('Tactical 90-degree right angle bend to negate war elephant battering rams');
    expect(gate.features).toContain('Flanking semicircular watch bastions');
    expect(gate.features).toContain('Internal guard rooms (devdis)');
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

    // Check Solid Colliders layer
    const colliderLayer = tmj.layers.find((l: any) => l.name === 'Solid_Colliders');
    expect(colliderLayer).toBeDefined();

    // Ensure walls have 26px (~0.80m) thickness
    const northWall = colliderLayer.objects.find((o: any) => o.name === 'Daru_Kothar_North_Wall');
    expect(northWall).toBeDefined();
    expect(northWall.height).toBe(26); // 26px / 32px/m = ~0.81m
  });
});

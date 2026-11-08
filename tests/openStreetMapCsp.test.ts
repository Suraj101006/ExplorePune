import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('OpenStreetMap Security Headers & Map Integration', () => {
  const middlewarePath = path.resolve(__dirname, '../middleware.ts');
  const nextConfigPath = path.resolve(__dirname, '../next.config.ts');
  const placeMapPath = path.resolve(__dirname, '../components/PlaceMap.tsx');

  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  const placeMapContent = fs.readFileSync(placeMapPath, 'utf8');

  it('permits openstreetmap.org in middleware.ts frame-src and child-src', () => {
    expect(middlewareContent).toMatch(/frame-src[^;]*https:\/\/\*\.openstreetmap\.org/);
    expect(middlewareContent).toMatch(/frame-src[^;]*https:\/\/www\.openstreetmap\.org/);
    expect(middlewareContent).toMatch(/child-src[^;]*https:\/\/\*\.openstreetmap\.org/);
  });

  it('permits openstreetmap.org in next.config.ts frame-src and child-src', () => {
    expect(nextConfigContent).toMatch(/frame-src[^;]*https:\/\/\*\.openstreetmap\.org/);
    expect(nextConfigContent).toMatch(/frame-src[^;]*https:\/\/www\.openstreetmap\.org/);
    expect(nextConfigContent).toMatch(/child-src[^;]*https:\/\/\*\.openstreetmap\.org/);
  });

  it('permits OpenStreetMap tile and Nominatim APIs in connect-src and img-src', () => {
    expect(middlewareContent).toMatch(/connect-src[^;]*https:\/\/nominatim\.openstreetmap\.org/);
    expect(middlewareContent).toMatch(/img-src[^;]*https:\/\/\*\.tile\.openstreetmap\.org/);
    expect(nextConfigContent).toMatch(/connect-src[^;]*https:\/\/nominatim\.openstreetmap\.org/);
    expect(nextConfigContent).toMatch(/img-src[^;]*https:\/\/\*\.tile\.openstreetmap\.org/);
  });

  it('constructs valid OpenStreetMap export embed URL in PlaceMap component', () => {
    expect(placeMapContent).toContain('https://www.openstreetmap.org/export/embed.html');
    expect(placeMapContent).toContain('layer=mapnik');
    expect(placeMapContent).toContain('marker=');
    expect(placeMapContent).toContain('setMapEngine(\'osm\')');
  });

  it('ensures iframe title dynamically reflects OpenStreetMap when active', () => {
    expect(placeMapContent).toMatch(/title=\{mapEngine === 'osm' \? `OpenStreetMap of \$\{name\}` : `Google Maps of \$\{name\}`\}/);
  });
});

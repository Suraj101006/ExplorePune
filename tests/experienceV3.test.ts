import { describe, it, expect } from 'vitest';
import {
  PUNE_TALUKAS,
  getPuneDistrictBoundaryGeoJson,
  getPuneTalukasGeoJson,
  getPuneRiversGeoJson,
  getPuneHighwaysGeoJson,
  calculateDistanceKm,
  formatCoordinatesDD,
  formatCoordinatesDMS,
  getTalukaOrRegion,
  getElevationEstimate,
} from '../lib/experience/puneDistrictData';
import { getAllPlaces } from '../lib/experience/selectors';
import { ambientAudio } from '../lib/experience/ambientAudio';

describe('Explore Pune Experience v3 - Advanced Interactive District Atlas', () => {
  const allPlaces = getAllPlaces();

  it('validates all 15 Pune District talukas have valid headquarters and boundaries', () => {
    expect(PUNE_TALUKAS.length).toBe(15);
    PUNE_TALUKAS.forEach((taluka) => {
      expect(taluka.id).toBeTruthy();
      expect(taluka.nameEn).toBeTruthy();
      expect(taluka.nameMr).toBeTruthy();
      expect(taluka.headquartersEn).toBeTruthy();
      expect(taluka.headquartersMr).toBeTruthy();
      expect(taluka.areaSqKm).toBeGreaterThan(0);
      expect(taluka.centroid[0]).toBeGreaterThan(73.0);
      expect(taluka.centroid[0]).toBeLessThan(75.5);
      expect(taluka.centroid[1]).toBeGreaterThan(17.8);
      expect(taluka.centroid[1]).toBeLessThan(19.6);
    });

    const talukaGeo = getPuneTalukasGeoJson();
    expect(talukaGeo.type).toBe('FeatureCollection');
    expect(talukaGeo.features.length).toBe(15);
  });

  it('validates district boundary GeoJSON encompasses the entire district', () => {
    const districtGeo = getPuneDistrictBoundaryGeoJson();
    expect(districtGeo.type).toBe('FeatureCollection');
    expect(districtGeo.features.length).toBeGreaterThan(0);
    const feature = districtGeo.features[0];
    if (feature.geometry.type === 'Polygon') {
      const coords = feature.geometry.coordinates[0];
      expect(coords.length).toBeGreaterThan(15);
    }
  });

  it('verifies all 106 destinations have realistic elevation and taluka mappings', () => {
    expect(allPlaces.length).toBe(106);
    allPlaces.forEach((place) => {
      const elevation = getElevationEstimate(place.latitude, place.longitude, place.category_slug);
      expect(elevation).toBeGreaterThanOrEqual(450);
      expect(elevation).toBeLessThanOrEqual(1500);

      const taluka = getTalukaOrRegion(place.latitude, place.longitude, place.address);
      expect(taluka.nameEn).toBeTruthy();
      expect(taluka.nameMr).toBeTruthy();

      const dd = formatCoordinatesDD(place.latitude, place.longitude, 4);
      expect(dd).toContain('° N');
      expect(dd).toContain('° E');

      const dms = formatCoordinatesDMS(place.latitude, place.longitude);
      expect(dms.latDMS).toContain('N');
      expect(dms.lngDMS).toContain('E');
      expect(dms.fullDMS).toBeTruthy();
    });
  });

  it('calculates realistic distance matrices between major Pune landmark clusters', () => {
    // Shaniwar Wada to Sinhagad Fort (~28-32 km)
    const sinhagadDist = calculateDistanceKm(18.5196, 73.8553, 18.3663, 73.7558);
    expect(sinhagadDist).toBeGreaterThan(15);
    expect(sinhagadDist).toBeLessThan(35);

    // Shaniwar Wada to Shivneri Fort Junnar (~85-95 km)
    const shivneriDist = calculateDistanceKm(18.5196, 73.8553, 19.1983, 73.8617);
    expect(shivneriDist).toBeGreaterThan(70);
    expect(shivneriDist).toBeLessThan(110);
  });

  it('verifies rivers and highway network GeoJSON layers are non-empty and well-formed', () => {
    const rivers = getPuneRiversGeoJson();
    expect(rivers.type).toBe('FeatureCollection');
    expect(rivers.features.length).toBeGreaterThan(2);

    const highways = getPuneHighwaysGeoJson();
    expect(highways.type).toBe('FeatureCollection');
    expect(highways.features.length).toBeGreaterThan(2);
  });

  it('verifies Web Audio soundscape engine initializes in muted/idle state', () => {
    expect(ambientAudio.getIsPlaying()).toBe(false);
  });
});

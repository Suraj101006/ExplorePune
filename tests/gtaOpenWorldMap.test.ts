import { describe, it, expect, beforeEach } from 'vitest';
import { DISCOVERY_MISSIONS } from '../components/experience/DiscoveryMissionsModal';
import { getPlaceBySlug, getAllPlaces } from '../lib/experience/selectors';
import { calculateDistanceKm, getElevationEstimate, getTalukaOrRegion } from '../lib/experience/puneDistrictData';
import {
  MASTER_ACHIEVEMENTS,
  recordPlaceVisit,
  recordMissionCompleted,
  recordMissionStopProgress,
  loadExplorationProfile,
  resetExplorationProfile,
  getInitialProfile,
  getExplorerRank,
} from '../lib/experience/achievements';

describe('GTA-Inspired Open-World 3D Map & Navigation System', () => {
  beforeEach(() => {
    resetExplorationProfile();
  });

  it('validates all 7 GTA Discovery Missions have verified stops in the 106 destination database', () => {
    expect(DISCOVERY_MISSIONS.length).toBe(7);

    const requiredMissionIds = [
      'fort-explorer',
      'historical-pune',
      'temple-trail',
      'nature-explorer',
      'heritage-explorer',
      'pune-district-explorer',
      'hidden-destinations',
    ];

    requiredMissionIds.forEach((id) => {
      expect(DISCOVERY_MISSIONS.some((m) => m.id === id), `Mission ${id} must exist`).toBe(true);
    });

    DISCOVERY_MISSIONS.forEach((mission) => {
      expect(mission.id).toBeTruthy();
      expect(mission.code).toMatch(/^MSN-\d{2}$/);
      expect(mission.titleEn).toBeTruthy();
      expect(mission.titleMr).toBeTruthy();
      expect(mission.stopSlugs.length).toBeGreaterThanOrEqual(4);

      mission.stopSlugs.forEach((slug) => {
        const place = getPlaceBySlug(slug);
        expect(place, `Mission ${mission.code} stop ${slug} must exist in places DB`).toBeDefined();
        expect(place?.latitude).toBeGreaterThan(17.5);
        expect(place?.longitude).toBeGreaterThan(73.0);
      });
    });
  });

  it('calculates realistic travel times and distances for GPS Waypoint navigation', () => {
    // Pune Railway Station to Sinhagad Fort
    const distToSinhagad = calculateDistanceKm(18.5284, 73.8744, 18.3664, 73.7558);
    expect(distToSinhagad).toBeGreaterThan(18);
    expect(distToSinhagad).toBeLessThan(26);

    // Ghat speed: 28 km/h
    const ghatDriveTimeMinutes = Math.round((distToSinhagad / 28) * 60);
    expect(ghatDriveTimeMinutes).toBeGreaterThan(35);
    expect(ghatDriveTimeMinutes).toBeLessThan(60);

    // City route: Shaniwar Wada to Aga Khan Palace
    const distToAgaKhan = calculateDistanceKm(18.5196, 73.8553, 18.5524, 73.9015);
    expect(distToAgaKhan).toBeGreaterThan(5);
    expect(distToAgaKhan).toBeLessThan(12);

    const cityDriveTimeMinutes = Math.round((distToAgaKhan / 35) * 60);
    expect(cityDriveTimeMinutes).toBeGreaterThan(8);
    expect(cityDriveTimeMinutes).toBeLessThan(25);
  });

  it('verifies compass heading normalization and cardinal sectors', () => {
    const getHeadingName = (deg: number) => {
      const norm = Math.round(((deg % 360) + 360) % 360);
      if (norm >= 337.5 || norm < 22.5) return 'N';
      if (norm >= 22.5 && norm < 67.5) return 'NE';
      if (norm >= 67.5 && norm < 112.5) return 'E';
      if (norm >= 112.5 && norm < 157.5) return 'SE';
      if (norm >= 157.5 && norm < 202.5) return 'S';
      if (norm >= 202.5 && norm < 247.5) return 'SW';
      if (norm >= 247.5 && norm < 292.5) return 'W';
      return 'NW';
    };

    expect(getHeadingName(0)).toBe('N');
    expect(getHeadingName(360)).toBe('N');
    expect(getHeadingName(-15)).toBe('N');
    expect(getHeadingName(315)).toBe('NW');
    expect(getHeadingName(45)).toBe('NE');
    expect(getHeadingName(90)).toBe('E');
    expect(getHeadingName(180)).toBe('S');
    expect(getHeadingName(270)).toBe('W');
  });

  it('validates minimap polar projection coordinates remain within radar radius boundary', () => {
    const centerLat = 18.5204;
    const centerLng = 73.8567;
    const radarRadiusKm = 20;
    const bearing = 0; // North

    // Test a point 10km North
    const targetLat = centerLat + 10 / 111; // ~10km
    const targetLng = centerLng;

    const dist = calculateDistanceKm(centerLat, centerLng, targetLat, targetLng);
    expect(dist).toBeLessThanOrEqual(radarRadiusKm);

    const dLat = targetLat - centerLat;
    const dLng = (targetLng - centerLng) * Math.cos((centerLat * Math.PI) / 180);
    const angleRad = Math.atan2(dLng, dLat);
    const relAngleRad = angleRad - (bearing * Math.PI) / 180;

    const radiusPercent = (dist / radarRadiusKm) * 44;
    const x = 50 + radiusPercent * Math.sin(relAngleRad);
    const y = 50 - radiusPercent * Math.cos(relAngleRad);

    expect(x).toBeCloseTo(50, 0);
    expect(y).toBeLessThan(50); // North is up
    expect(y).toBeGreaterThan(15);
  });

  it('verifies realistic mountain elevation estimates for Sahyadri forts vs lowlands', () => {
    const sinhagad = getPlaceBySlug('sinhagad-fort');
    expect(sinhagad).toBeDefined();
    if (sinhagad) {
      const elev = getElevationEstimate(sinhagad.latitude, sinhagad.longitude, sinhagad.category_slug);
      expect(elev).toBeGreaterThanOrEqual(1200);
      expect(elev).toBeLessThanOrEqual(1400);
    }

    const rajgad = getPlaceBySlug('rajgad-fort');
    expect(rajgad).toBeDefined();
    if (rajgad) {
      const elev = getElevationEstimate(rajgad.latitude, rajgad.longitude, rajgad.category_slug);
      expect(elev).toBeGreaterThanOrEqual(1250);
      expect(elev).toBeLessThanOrEqual(1450);
    }

    const shaniwarWada = getPlaceBySlug('shaniwar-wada');
    expect(shaniwarWada).toBeDefined();
    if (shaniwarWada) {
      const elev = getElevationEstimate(shaniwarWada.latitude, shaniwarWada.longitude, shaniwarWada.category_slug);
      expect(elev).toBeGreaterThanOrEqual(520);
      expect(elev).toBeLessThanOrEqual(620);
    }
  });

  it('validates Exploration Achievements and unlocks correctly based on user visits', () => {
    expect(MASTER_ACHIEVEMENTS.length).toBe(11);

    const allPlaces = getAllPlaces();
    const shaniwarWada = getPlaceBySlug('shaniwar-wada')!;
    const sinhagad = getPlaceBySlug('sinhagad-fort')!;
    const rajgad = getPlaceBySlug('rajgad-fort')!;
    const shivneri = getPlaceBySlug('shivneri-fort')!;
    const lalMahal = getPlaceBySlug('lal-mahal')!;
    const vishrambaug = getPlaceBySlug('vishrambaug-wada')!;

    // 1. First Visit -> unlocks first_discovery & first_heritage
    const res1 = recordPlaceVisit(shaniwarWada, allPlaces);
    expect(res1.profile.visitedSlugs).toContain('shaniwar-wada');
    expect(res1.profile.unlockedAchievementIds).toContain('first_discovery');
    expect(res1.profile.unlockedAchievementIds).toContain('first_heritage');

    // 2. Visit Fort -> unlocks first_fort
    const res2 = recordPlaceVisit(sinhagad, allPlaces);
    expect(res2.profile.unlockedAchievementIds).toContain('first_fort');

    // 3. Visit 3 forts -> unlocks fort_explorer
    recordPlaceVisit(rajgad, allPlaces);
    const resForts = recordPlaceVisit(shivneri, allPlaces);
    expect(resForts.profile.unlockedAchievementIds).toContain('fort_explorer');

    // 4. Visit 5 places -> unlocks five_locations
    const res5 = recordPlaceVisit(lalMahal, allPlaces);
    expect(res5.profile.unlockedAchievementIds).toContain('five_locations');

    // 5. Test authentic GPS proximity verification (distance <= 1.5km)
    const onSiteGpsCoords = { latitude: 18.5196, longitude: 73.8553 }; // exactly Shaniwar Wada
    const resOnSite = recordPlaceVisit(shaniwarWada, allPlaces, onSiteGpsCoords);
    expect(resOnSite.isProximityDiscovery).toBe(true);
    expect(resOnSite.profile.proximityDiscoveredSlugs).toContain('shaniwar-wada');

    // Distant GPS coords (> 1.5km)
    const distantGpsCoords = { latitude: 19.1234, longitude: 74.5678 };
    const resDistant = recordPlaceVisit(vishrambaug, allPlaces, distantGpsCoords);
    expect(resDistant.isProximityDiscovery).toBe(false);

    // 6. Complete Mission Progressively -> unlocks trail_master
    const stops = ['stop-1', 'stop-2', 'stop-3'];
    recordMissionStopProgress('test-mission', 'stop-1', stops);
    recordMissionStopProgress('test-mission', 'stop-2', stops);
    const resDone = recordMissionStopProgress('test-mission', 'stop-3', stops);
    expect(resDone.newlyCompleted).toBe(true);
    expect(resDone.profile.completedMissions).toContain('test-mission');
    expect(resDone.profile.unlockedAchievementIds).toContain('trail_master');

    // 7. Rank calculation
    const rank = getExplorerRank(resDone.profile.totalXp);
    expect(rank.level).toBeGreaterThanOrEqual(1);
    expect(rank.titleEn).toBeTruthy();
    expect(rank.badge).toBeTruthy();
  });

  it('validates authentic Pune District geographical data and boundary constraints', async () => {
    const {
      getPuneDistrictBoundaryGeoJson,
      getPuneTalukasGeoJson,
      getPuneRiversGeoJson,
      getPuneHighwaysGeoJson,
      getPuneRailwaysGeoJson,
      getPuneForestReservesGeoJson,
      getPuneMountainRangesGeoJson,
      getPuneBridgesGeoJson,
      PUNE_TALUKAS,
    } = await import('../lib/experience/puneDistrictData');

    // 1. All 15 talukas verified
    expect(PUNE_TALUKAS.length).toBe(15);
    PUNE_TALUKAS.forEach((taluka) => {
      expect(taluka.id).toBeTruthy();
      expect(taluka.nameEn).toBeTruthy();
      expect(taluka.nameMr).toBeTruthy();
      expect(taluka.centroid[0]).toBeGreaterThan(73.2);
      expect(taluka.centroid[0]).toBeLessThan(75.2);
      expect(taluka.centroid[1]).toBeGreaterThan(17.9);
      expect(taluka.centroid[1]).toBeLessThan(19.4);
    });

    // 2. District & Taluka GeoJSON
    const districtGeo = getPuneDistrictBoundaryGeoJson();
    expect(districtGeo.type).toBe('FeatureCollection');
    expect(districtGeo.features.length).toBeGreaterThan(0);

    const talukasGeo = getPuneTalukasGeoJson();
    expect(talukasGeo.features.length).toBe(15);

    // 3. Rivers & Highways GeoJSON
    const riversGeo = getPuneRiversGeoJson();
    expect(riversGeo.features.length).toBeGreaterThan(5);

    const highwaysGeo = getPuneHighwaysGeoJson();
    expect(highwaysGeo.features.length).toBeGreaterThanOrEqual(4);

    // 4. Railways, Forests, Mountains & Bridges GeoJSON
    const railwaysGeo = getPuneRailwaysGeoJson();
    expect(railwaysGeo.features.length).toBe(3); // Mumbai Mainline, Daund Trunk, Miraj Line
    railwaysGeo.features.forEach((f) => {
      expect(f.geometry.type).toBe('LineString');
    });

    const forestsGeo = getPuneForestReservesGeoJson();
    expect(forestsGeo.features.length).toBeGreaterThanOrEqual(4); // Bhimashankar, Tamhini, Sinhagad, Rajgad-Torna
    forestsGeo.features.forEach((f) => {
      expect(f.geometry.type).toBe('Polygon');
    });

    const mountainsGeo = getPuneMountainRangesGeoJson();
    expect(mountainsGeo.features.length).toBe(3); // Sahyadri crest, Katraj-Sinhagad, Purandar-Vajragad
    mountainsGeo.features.forEach((f) => {
      expect(f.geometry.type).toBe('LineString');
    });

    const bridgesGeo = getPuneBridgesGeoJson();
    expect(bridgesGeo.features.length).toBe(5); // Lakdi Pul, Z-Bridge, Shivaji Bridge, Sangam Bridge, Bund Garden
    bridgesGeo.features.forEach((f) => {
      expect(f.geometry.type).toBe('Point');
    });

    // 5. All 106 destinations coordinates sanity check
    const allPlaces = getAllPlaces();
    expect(allPlaces.length).toBe(106);
    allPlaces.forEach((p) => {
      expect(p.latitude, `Place ${p.slug} latitude`).toBeGreaterThan(17.9);
      expect(p.latitude, `Place ${p.slug} latitude`).toBeLessThan(19.4);
      expect(p.longitude, `Place ${p.slug} longitude`).toBeGreaterThan(73.2);
      expect(p.longitude, `Place ${p.slug} longitude`).toBeLessThan(75.2);
    });
  });
});

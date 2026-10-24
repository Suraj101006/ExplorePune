import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  REEL_MUSIC_TRACKS,
  getRecommendedMusic,
  buildReelPlacesFromJourney,
  buildOneReelSceneSequence,
  saveGeneratedReel,
  getSavedReels,
  JourneyReelData,
} from '@/lib/journeyReel';
import { DayJourney } from '@/lib/journeyStorage';

// In-memory localStorage mock for node test environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe('Journey Reel Enhancement & One-Reel Engine', () => {
  const mockDayJourney: DayJourney = {
    id: 'journey-mock-01',
    date: '2026-10-24',
    dateLabelEn: '24 October 2026',
    dateLabelMr: '२४ ऑक्टोबर २०२६',
    title: "Suraj's Pune Heritage Trail",
    titleMr: 'पुणे ऐतिहासिक मोहीम',
    startLocation: 'Swargate',
    travelMode: 'public_transit',
    status: 'completed',
    totalDistanceKm: 18.5,
    totalDurationMinutes: 240,
    places: [
      {
        placeId: 'sinhagad-fort',
        placeSlug: 'sinhagad-fort',
        placeName: 'Sinhagad Fort',
        category: 'forts',
        categoryName: 'Sahyadri Forts',
        image_url: '/images/places/sinhagad-fort.jpg',
        latitude: 18.3663,
        longitude: 73.7558,
        isVisited: true,
        order: 1,
      },
      {
        placeId: 'shaniwar-wada',
        placeSlug: 'shaniwar-wada',
        placeName: 'Shaniwar Wada',
        category: 'heritage',
        categoryName: 'Heritage Palaces',
        image_url: '/images/places/shaniwar-wada.jpg',
        latitude: 18.5195,
        longitude: 73.8553,
        isVisited: true,
        order: 2,
      },
      {
        placeId: 'pataleshwar-cave-temple',
        placeSlug: 'pataleshwar-cave-temple',
        placeName: 'Pataleshwar Cave Temple',
        category: 'temples',
        categoryName: 'Sacred Temples',
        image_url: '/images/places/pataleshwar-cave-temple.jpg',
        latitude: 18.5283,
        longitude: 73.8519,
        isVisited: true,
        order: 3,
      },
    ],
  };

  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      localStorage: localStorageMock,
    });
  });

  it('provides 100% royalty-free music presets with required copyright metadata', () => {
    expect(REEL_MUSIC_TRACKS.length).toBeGreaterThanOrEqual(4);
    for (const track of REEL_MUSIC_TRACKS) {
      expect(track.id).toBeDefined();
      expect(track.title).toBeDefined();
      expect(track.artist).toBeDefined();
      expect(track.license).toContain('Royalty-Free');
      expect(track.source).toBeDefined();
      expect(track.audioGeneratorType).toBeDefined();
      expect(typeof track.attributionRequired).toBe('boolean');
    }
  });

  it('accurately scores place categories to recommend location-appropriate music', () => {
    // 1. Forts -> Sahyadri adventure
    const fortResult = getRecommendedMusic([{ category: 'forts', placeId: 'sinhagad-fort' }]);
    expect(fortResult.recommended.mood).toBe('adventure');
    expect(fortResult.recommended.audioGeneratorType).toBe('fort_adventure');

    // 2. Heritage -> Peshwa heritage
    const heritageResult = getRecommendedMusic([{ category: 'heritage', placeSlug: 'shaniwar-wada' }]);
    expect(heritageResult.recommended.mood).toBe('heritage');
    expect(heritageResult.recommended.audioGeneratorType).toBe('heritage_classical');

    // 3. Sacred Temples -> Peaceful bansuri flute
    const templeResult = getRecommendedMusic([{ category: 'temples', placeId: 'dagdusheth' }]);
    expect(templeResult.recommended.mood).toBe('spiritual');
    expect(templeResult.recommended.audioGeneratorType).toBe('peaceful_flute');

    // 4. Nature / Lakes -> Lakeside chill
    const natureResult = getRecommendedMusic([{ category: 'nature', placeId: 'khadakwasla-dam' }]);
    expect(natureResult.recommended.mood).toBe('nature');
    expect(natureResult.recommended.audioGeneratorType).toBe('lakeside_chill');
  });

  it('builds reel places from a DayJourney with authentic location subtitles and poetic quotes', () => {
    const reelPlaces = buildReelPlacesFromJourney(mockDayJourney);
    expect(reelPlaces.length).toBe(3);

    const sinhagad = reelPlaces.find((p) => p.placeId === 'sinhagad-fort');
    expect(sinhagad).toBeDefined();
    expect(sinhagad?.placeName).toBe('Sinhagad Fort');
    expect(sinhagad?.locationSubtitle).toContain('Sahyadri Fortress');
    expect(sinhagad?.elevation).toBeDefined();
    expect(sinhagad?.photos.length).toBeGreaterThanOrEqual(1);
    expect(sinhagad?.photos[0]).toContain('sinhagad');

    const shaniwar = reelPlaces.find((p) => p.placeId === 'shaniwar-wada');
    expect(shaniwar).toBeDefined();
    expect(shaniwar?.locationSubtitle).toContain('Peshwa');
  });

  it('constructs ONE unified sequential reel without skipping visited places', () => {
    const reelPlaces = buildReelPlacesFromJourney(mockDayJourney);
    const mockReelData: JourneyReelData = {
      id: 'test-reel-01',
      journeyId: mockDayJourney.id,
      title: "Suraj's Pune Journey",
      type: 'today',
      date: '2026-10-24',
      places: reelPlaces,
      reel: {
        duration: 30,
        music: REEL_MUSIC_TRACKS[0],
        style: 'cinematic',
        generatedAt: new Date().toISOString(),
      },
    };

    const { scenes, totalScenes, estimatedDurationSeconds } = buildOneReelSceneSequence(mockReelData);

    expect(totalScenes).toBeGreaterThanOrEqual(5); // Intro + 3x(intro+photo) + Outro = at least 8 scenes
    expect(scenes[0].type).toBe('intro');
    if (scenes[0].type === 'intro') {
      expect(scenes[0].title).toBe("Suraj's Pune Journey");
      expect(scenes[0].placesCount).toBe(3);
    }

    // Verify all 3 places have dedicated place_intro and place_photo scenes in order
    const placeIntroScenes = scenes.filter((s) => s.type === 'place_intro');
    expect(placeIntroScenes.length).toBe(3);

    const placePhotoScenes = scenes.filter((s) => s.type === 'place_photo');
    expect(placePhotoScenes.length).toBeGreaterThanOrEqual(3);

    // Verify final scene is the outro recap
    const lastScene = scenes[scenes.length - 1];
    expect(lastScene.type).toBe('outro');
    if (lastScene.type === 'outro') {
      expect(lastScene.placesCount).toBe(3);
      expect(lastScene.placesSummary).toEqual(['Sinhagad Fort', 'Shaniwar Wada', 'Pataleshwar Cave Temple']);
    }

    expect(estimatedDurationSeconds).toBeGreaterThan(15);
  });

  it('stores and retrieves generated reels in localStorage', () => {
    const mockReel: JourneyReelData = {
      id: 'stored-reel-01',
      journeyId: 'journey-mock-01',
      title: "Suraj's Pune Journey",
      type: 'today',
      date: '2026-10-24',
      places: [],
      reel: {
        duration: 25,
        music: REEL_MUSIC_TRACKS[0],
        style: 'cinematic',
        generatedAt: new Date().toISOString(),
      },
    };

    saveGeneratedReel(mockReel, 'user-123');
    const saved = getSavedReels('user-123');
    expect(saved.length).toBe(1);
    expect(saved[0].id).toBe('stored-reel-01');
    expect(saved[0].title).toBe("Suraj's Pune Journey");
  });
});

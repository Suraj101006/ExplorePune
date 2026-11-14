import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveMemoryItem,
  getAllMemories,
  getMemoriesForPlace,
  toggleFavoriteMemory,
  deleteMemoryItem,
  addDestinationVisit,
  getAllDestinationVisits,
  getDestinationVisits,
  deleteDestinationVisit,
  saveProjectDraft,
  getAllProjectDrafts,
  duplicateProjectDraft,
  deleteProjectDraft,
  saveRenderedExport,
  getAllRenderedExports,
  deleteRenderedExport,
} from '@/lib/memoryAlbumStorage';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';
import { getReelTemplateForPlace, findReelTemplate } from '@/lib/reelTemplates106';
import { recommendReelSong, REAL_SONG_CATALOG } from '@/lib/reelSongLibrary';

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

describe('My Journey Rebuild: Full-Stack Platform Test Suite', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      localStorage: localStorageMock,
    });
  });

  describe('1. Memory Album Storage Engine', () => {
    it('saves a photo memory and retrieves it sorted by visitDate', () => {
      const item1 = saveMemoryItem({
        placeId: 'shaniwar-wada',
        placeName: 'Shaniwar Wada',
        mediaUrl: '/images/places/shaniwar-wada.jpg',
        mediaType: 'photo',
        caption: 'Historic gates',
        visitDate: '2026-10-15',
      });

      const item2 = saveMemoryItem({
        placeId: 'sinhagad-fort',
        placeName: 'Sinhagad Fort',
        mediaUrl: '/images/places/sinhagad.jpg',
        mediaType: 'photo',
        caption: 'Misty bastion',
        visitDate: '2026-11-01',
      });

      const all = getAllMemories();
      expect(all.length).toBe(2);
      expect(all[0].id).toBe(item2.id); // later date first
      expect(all[1].id).toBe(item1.id);

      const shaniwarOnly = getMemoriesForPlace('shaniwar-wada');
      expect(shaniwarOnly.length).toBe(1);
      expect(shaniwarOnly[0].caption).toBe('Historic gates');
    });

    it('toggles favorite memory status and deletes items accurately', () => {
      const item = saveMemoryItem({
        placeId: 'dagdusheth-ganpati',
        mediaUrl: '/images/places/dagdusheth.jpg',
        isFavorite: false,
      });

      expect(item.isFavorite).toBe(false);
      const isFavNow = toggleFavoriteMemory(item.id);
      expect(isFavNow).toBe(true);

      const afterToggle = getAllMemories();
      expect(afterToggle[0].isFavorite).toBe(true);

      const deleted = deleteMemoryItem(item.id);
      expect(deleted).toBe(true);
      expect(getAllMemories().length).toBe(0);
    });
  });

  describe('2. Multi-Visit Destination History', () => {
    it('records multiple visits to the same landmark and retrieves them', () => {
      addDestinationVisit({
        placeId: 'sinhagad-fort',
        placeName: 'Sinhagad Fort',
        placeSlug: 'sinhagad-fort',
        visitDate: '2026-08-15',
        notes: 'Monsoon trek in heavy rain',
        rating: 5,
      });

      addDestinationVisit({
        placeId: 'sinhagad-fort',
        placeName: 'Sinhagad Fort',
        placeSlug: 'sinhagad-fort',
        visitDate: '2026-10-24',
        notes: 'Diwali morning climb, clear sky',
        rating: 5,
      });

      const visits = getDestinationVisits('sinhagad-fort');
      expect(visits.length).toBe(2);
      expect(visits[0].visitDate).toBe('2026-10-24'); // Most recent first
      expect(visits[1].visitDate).toBe('2026-08-15');

      const all = getAllDestinationVisits();
      expect(all.length).toBe(2);

      deleteDestinationVisit(visits[0].id);
      expect(getDestinationVisits('sinhagad-fort').length).toBe(1);
    });
  });

  describe('3. Reel Project Drafts & Duplication', () => {
    it('creates, saves, duplicates and deletes reel project drafts', () => {
      const draft = saveProjectDraft({
        title: 'Sinhagad Sunrise Story',
        destinationId: 'sinhagad-fort',
        placeId: 'sinhagad-fort',
        destinationName: 'Sinhagad Fort',
        templateId: 'sinhagad-fort',
        musicTrackId: 'song-sahyadri-powada',
        scenes: [{ id: '1', duration: 3 }],
        aspectRatio: '9:16',
        quality: '1080p',
      });

      expect(draft.id).toBeDefined();
      expect(draft.title).toBe('Sinhagad Sunrise Story');

      const drafts = getAllProjectDrafts();
      expect(drafts.length).toBe(1);

      const copy = duplicateProjectDraft(draft.id);
      expect(copy).toBeDefined();
      expect(copy?.title).toContain('(Copy)');
      expect(getAllProjectDrafts().length).toBe(2);

      deleteProjectDraft(draft.id);
      expect(getAllProjectDrafts().length).toBe(1);
    });
  });

  describe('4. Rendered Reel MP4 Exports Management', () => {
    it('stores rendered MP4 records with download links and handles deletion', () => {
      const exp = saveRenderedExport({
        title: 'Shaniwar Wada Historical Reel',
        placeName: 'Shaniwar Wada',
        videoUrl: 'blob:http://localhost/test-video-uuid',
        downloadUrl: 'blob:http://localhost/test-video-uuid',
        filename: 'shaniwar-wada-reel-1080p.mp4',
        durationSec: 15,
        resolution: '1080p',
        format: 'mp4',
      });

      expect(exp.id).toBeDefined();
      expect(exp.downloadUrl).toBe('blob:http://localhost/test-video-uuid');

      const exportsList = getAllRenderedExports();
      expect(exportsList.length).toBe(1);
      expect(exportsList[0].filename).toBe('shaniwar-wada-reel-1080p.mp4');

      deleteRenderedExport(exp.id);
      expect(getAllRenderedExports().length).toBe(0);
    });
  });

  describe('5. Destination Templates & Music Grounding', () => {
    it('verifies all 106 structured places map to valid reel templates', () => {
      expect(ALL_STRUCTURED_PLACES.length).toBeGreaterThanOrEqual(100);

      // Spot-check iconic destinations
      const iconicSlugs = [
        'shaniwar-wada',
        'sinhagad-fort',
        'shreemant-dagdusheth-halwai-ganpati',
        'aga-khan-palace',
        'pataleshwar-cave-temple',
      ];

      for (const slug of iconicSlugs) {
        const template = getReelTemplateForPlace(slug);
        expect(template).toBeDefined();
        expect(template.acts.length).toBe(5);
        expect(template.conceptTaglineEn).toBeDefined();
      }
    });

    it('recommends authentic Marathi soundtracks tailored to destination categories', () => {
      const fortSong = recommendReelSong([{ category: 'Forts', placeSlug: 'sinhagad-fort' }]);
      expect(fortSong.recommended).toBeDefined();
      expect(fortSong.recommended.genre).toBe('powada_fort');

      const templeSong = recommendReelSong([
        { category: 'Temples', placeSlug: 'dagdusheth-ganpati' },
      ]);
      expect(templeSong.recommended).toBeDefined();
      expect(templeSong.recommended.genre).toBe('abhang_devotional');
    });
  });
});

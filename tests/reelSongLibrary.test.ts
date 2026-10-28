import { describe, it, expect } from 'vitest';
import { REAL_SONG_CATALOG, recommendReelSong } from '@/lib/reelSongLibrary';

describe('Real Vocal Songs & Song Engine', () => {
  it('contains authentic Marathi and Hindi vocal songs with required metadata', () => {
    expect(REAL_SONG_CATALOG.length).toBeGreaterThanOrEqual(5);

    for (const song of REAL_SONG_CATALOG) {
      expect(song.id).toBeDefined();
      expect(song.title).toBeDefined();
      expect(song.titleMr).toBeDefined();
      expect(song.artist).toBeDefined();
      expect(song.bpm).toBeGreaterThan(60);
      expect(song.beatIntervalSec).toBeCloseTo(60 / song.bpm);
      expect(song.sections.length).toBeGreaterThanOrEqual(3);
      expect(song.socialAudioTag.recommendedSoundName).toBeDefined();
      expect(song.socialAudioTag.instagramQuery).toBeDefined();
    }
  });

  it('recommends Garja Sahyadri Powada for fort stops', () => {
    const { recommended } = recommendReelSong([
      { category: 'forts', placeId: 'sinhagad-fort' },
      { category: 'forts', placeId: 'rajgad-fort' },
    ]);

    expect(recommended.id).toBe('song-sahyadri-powada');
    expect(recommended.language).toBe('marathi');
    expect(recommended.mood).toBe('adventure');
    expect(recommended.bpm).toBe(116);
  });

  it('recommends Majha Ganaraya Abhang for temple stops', () => {
    const { recommended } = recommendReelSong([
      { category: 'temples', placeId: 'shreemant-dagdusheth-halwai-ganpati' },
    ]);

    expect(recommended.id).toBe('song-dagdusheth-aarti');
    expect(recommended.mood).toBe('spiritual');
    expect(recommended.vocalType).toBe('female_abhang');
  });

  it('recommends Puneri Chawad for food & culinary stops', () => {
    const { recommended } = recommendReelSong([
      { category: 'food', placeId: 'fc-road-culinary-trail' },
    ]);

    expect(recommended.id).toBe('song-puneri-khadya-jingle');
    expect(recommended.mood).toBe('food');
    expect(recommended.bpm).toBe(124);
  });

  it('recommends Peshwa Tarana for historic wadas & heritage stops', () => {
    const { recommended } = recommendReelSong([
      { category: 'heritage', placeId: 'shaniwar-wada' },
    ]);

    expect(recommended.id).toBe('song-peshwa-tarana');
    expect(recommended.mood).toBe('heritage');
  });
});

'use client';

/**
 * Explore Pune: Chapter 5 Tactile Playground Milestone & Passport Integration
 * Handles local storage persistence, custom events, and digital passport stamping.
 */

export interface PlaygroundProgress {
  misal: boolean;
  tambat: boolean;
  tanaji: boolean;
  relic: boolean;
  ganeshotsav: boolean;
}

export interface PlaygroundPassportStamp {
  id: string;
  gameId: keyof PlaygroundProgress;
  titleEn: string;
  titleMr: string;
  placeSlug: string;
  category: string;
  icon: string;
  sealTextEn: string;
  sealTextMr: string;
  unlockedAt: string;
}

const STORAGE_KEY_PROGRESS = 'explore_pune_playground_progress_v1';
const STORAGE_KEY_PASSPORT_STAMPS = 'explore_pune_passport_stamps';

export const PLAYGROUND_STAMPS: Record<keyof PlaygroundProgress, PlaygroundPassportStamp> = {
  misal: {
    id: 'stamp-misal-master',
    gameId: 'misal',
    titleEn: 'Puneri Misal Master',
    titleMr: 'अस्सल पुणेरी मिसळ मेकर',
    placeSlug: 'bedekar-tea-stall-misal',
    category: 'Culinary Heritage',
    icon: '🥣',
    sealTextEn: 'Zanzanit Tarri & Crunchy Farsan Balanced • Narayan Peth',
    sealTextMr: 'झणझणीत कट व कुरकुरीत फरसाण • नारायण पेठ',
    unlockedAt: '',
  },
  tambat: {
    id: 'stamp-tambat-artisan',
    gameId: 'tambat',
    titleEn: 'Matharkaam Copper Beater',
    titleMr: 'तांबट आळी माथारकाम कारागीर',
    placeSlug: 'tambat-ali-craft-quarter',
    category: 'Artisanal Guild',
    icon: '🔨',
    sealTextEn: '400-Year Hand-Hammered Coppersmith Guild • Kasba Peth',
    sealTextMr: '४०० वर्षे जुनी तांबट कारागिरी • कसबा पेठ',
    unlockedAt: '',
  },
  tanaji: {
    id: 'stamp-tanaji-escalade',
    gameId: 'tanaji',
    titleEn: 'Tanaji’s Sinhagad Bastion',
    titleMr: 'नरवीर तानाजी सिंहगड मोहीम',
    placeSlug: 'sinhagad-fort',
    category: 'Maratha Fort',
    icon: '⛰️',
    sealTextEn: '1670 CE • Dronagiri Cliff Night Escalade Verified',
    sealTextMr: 'इ.स. १६७० • द्रोणागिरी कड्याची ऐतिहासिक चढाई',
    unlockedAt: '',
  },
  relic: {
    id: 'stamp-kelkar-curator',
    gameId: 'relic',
    titleEn: 'Kelkar Relic Vault Curator',
    titleMr: 'राजा केळकर संग्रहालय अभिरक्षक',
    placeSlug: 'raja-dinkar-kelkar-museum',
    category: 'Archival Vault',
    icon: '🏺',
    sealTextEn: '20,000+ Indian Heritage Masterpieces Inspected',
    sealTextMr: '२०,०००+ भारतीय ऐतिहासिक वस्तूंचे सूक्ष्म निरीक्षण',
    unlockedAt: '',
  },
  ganeshotsav: {
    id: 'stamp-ganeshotsav-procession',
    gameId: 'ganeshotsav',
    titleEn: '5 Manache Ganpati Procession',
    titleMr: 'पाच मानाचे गणपती मिरवणूक',
    placeSlug: 'kasba-ganpati',
    category: 'Sacred Tradition',
    icon: '🥁',
    sealTextEn: 'Sacred Order Traversed with Dhol-Tasha Resonance',
    sealTextMr: '५ मानाच्या गणपतींचा पावन गजर व मिरवणूक पूर्ण',
    unlockedAt: '',
  },
};

export function getPlaygroundProgress(): PlaygroundProgress {
  if (typeof window === 'undefined') {
    return { misal: false, tambat: false, tanaji: false, relic: false, ganeshotsav: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) {
      return { misal: false, tambat: false, tanaji: false, relic: false, ganeshotsav: false };
    }
    const parsed = JSON.parse(raw);
    return {
      misal: Boolean(parsed.misal),
      tambat: Boolean(parsed.tambat),
      tanaji: Boolean(parsed.tanaji),
      relic: Boolean(parsed.relic),
      ganeshotsav: Boolean(parsed.ganeshotsav),
    };
  } catch (e) {
    return { misal: false, tambat: false, tanaji: false, relic: false, ganeshotsav: false };
  }
}

export function markGameCompleted(gameId: keyof PlaygroundProgress): {
  progress: PlaygroundProgress;
  stamp: PlaygroundPassportStamp;
  isFirstCompletion: boolean;
} {
  const current = getPlaygroundProgress();
  const isFirstCompletion = !current[gameId];
  const updatedProgress: PlaygroundProgress = {
    ...current,
    [gameId]: true,
  };

  const stampTemplate = PLAYGROUND_STAMPS[gameId];
  const stamp: PlaygroundPassportStamp = {
    ...stampTemplate,
    unlockedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      // 1. Save progress in localStorage
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updatedProgress));

      // 2. Save passport stamp
      const rawStamps = localStorage.getItem(STORAGE_KEY_PASSPORT_STAMPS);
      const existingStamps: PlaygroundPassportStamp[] = rawStamps ? JSON.parse(rawStamps) : [];
      const filtered = existingStamps.filter((s) => s.id !== stamp.id);
      filtered.push(stamp);
      localStorage.setItem(STORAGE_KEY_PASSPORT_STAMPS, JSON.stringify(filtered));

      // 3. Emit compatible custom events
      window.dispatchEvent(
        new CustomEvent('explore-pune-milestone-unlocked', {
          detail: {
            id: stamp.id,
            gameId,
            titleEn: stamp.titleEn,
            titleMr: stamp.titleMr,
            placeSlug: stamp.placeSlug,
            timestamp: stamp.unlockedAt,
          },
        })
      );

      window.dispatchEvent(
        new CustomEvent('explore-pune-passport-stamp', {
          detail: stamp,
        })
      );

      window.dispatchEvent(
        new CustomEvent('explore-pune-activity-recorded', {
          detail: {
            id: `act_${stamp.id}_${Date.now()}`,
            type: 'playground_completed',
            placeSlug: stamp.placeSlug,
            title: stamp.titleEn,
            title_mr: stamp.titleMr,
            timestamp: stamp.unlockedAt,
          },
        })
      );

      window.dispatchEvent(
        new CustomEvent('explore-pune-playground-progress', {
          detail: updatedProgress,
        })
      );
    } catch (e) {
      console.warn('[PlaygroundMilestone] Failed to write localStorage:', e);
    }
  }

  return { progress: updatedProgress, stamp, isFirstCompletion };
}

export function getCompletedGameCount(progress: PlaygroundProgress): number {
  return Object.values(progress).filter(Boolean).length;
}

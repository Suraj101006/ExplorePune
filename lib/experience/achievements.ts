'use client';

import { ExperiencePlace } from './types';
import { getTalukaOrRegion } from './puneDistrictData';

export interface ExplorationAchievement {
  id: string;
  code: string;
  titleEn: string;
  titleMr: string;
  descriptionEn: string;
  descriptionMr: string;
  icon: string;
  xp: number;
  unlockedAt?: string | null;
}

export interface UserExplorationProfile {
  visitedSlugs: string[];
  visitedTalukas: string[];
  completedMissions: string[];
  unlockedAchievementIds: string[];
  totalXp: number;
}

const STORAGE_KEY = 'explore_pune_gta_achievements_v1';

export const MASTER_ACHIEVEMENTS: ExplorationAchievement[] = [
  {
    id: 'first_discovery',
    code: 'ACH-01',
    titleEn: 'First Footsteps in Pune',
    titleMr: 'पुण्यात पहिले पाऊल',
    descriptionEn: 'Discovered your first destination in the Pune District Atlas.',
    descriptionMr: 'पुणे जिल्हा अ‍ॅटलसमध्ये तुमचे पहिले ठिकाण शोधले.',
    icon: '🧭',
    xp: 100,
  },
  {
    id: 'fort_explorer',
    code: 'ACH-02',
    titleEn: 'Swarajya Fort Master',
    titleMr: 'स्वराज्य दुर्गवीर',
    descriptionEn: 'Inspected 3 historic mountain fortresses of the Sahyadri.',
    descriptionMr: 'सह्याद्रीतील ३ ऐतिहासिक डोंगरी किल्ल्यांचे अन्वेषण केले.',
    icon: '🏰',
    xp: 350,
  },
  {
    id: 'heritage_explorer',
    code: 'ACH-03',
    titleEn: 'Peshwa Heritage Scholar',
    titleMr: 'पेशवे वारसा अभ्यासक',
    descriptionEn: 'Explored 3 historic palaces, wadas, or cultural marvels.',
    descriptionMr: '३ ऐतिहासिक वाडे, राजवाडे किंवा सांस्कृतिक वास्तूंचा शोध घेतला.',
    icon: '🏛️',
    xp: 350,
  },
  {
    id: 'nature_explorer',
    code: 'ACH-04',
    titleEn: 'Sahyadri Nature Wanderer',
    titleMr: 'सह्याद्री निसर्ग भ्रमंती',
    descriptionEn: 'Visited 3 reservoirs, waterfalls, or serene hill retreats.',
    descriptionMr: '३ धरणे, धबधबे किंवा निसर्गरम्य पर्यटन स्थळांची सफर केली.',
    icon: '🌊',
    xp: 350,
  },
  {
    id: 'taluka_explorer',
    code: 'ACH-05',
    titleEn: 'District Atlas Pioneer',
    titleMr: 'जिल्हा प्रदक्षिणा नायक',
    descriptionEn: 'Discovered landmarks across 5 different talukas of Pune District.',
    descriptionMr: 'पुणे जिल्ह्यातील ५ वेगवेगळ्या तालुक्यांमधील स्थळांचा शोध घेतला.',
    icon: '🗺️',
    xp: 500,
  },
  {
    id: 'trail_master',
    code: 'ACH-06',
    titleEn: 'Mission Trail Elite',
    titleMr: 'मोहीम शिखरवीर',
    descriptionEn: 'Completed all stops of an open-world GTA discovery mission.',
    descriptionMr: 'ओपन-वर्ल्ड मोहिमेतील सर्व मार्ग ठिकाणे यशस्वीपणे पूर्ण केली.',
    icon: '🏆',
    xp: 750,
  },
];

let memoryProfile: UserExplorationProfile = getInitialProfile();

export function getInitialProfile(): UserExplorationProfile {
  return {
    visitedSlugs: [],
    visitedTalukas: [],
    completedMissions: [],
    unlockedAchievementIds: [],
    totalXp: 0,
  };
}

export function resetExplorationProfile(): void {
  memoryProfile = getInitialProfile();
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}

export function loadExplorationProfile(): UserExplorationProfile {
  if (typeof window === 'undefined') {
    return {
      visitedSlugs: [...memoryProfile.visitedSlugs],
      visitedTalukas: [...memoryProfile.visitedTalukas],
      completedMissions: [...memoryProfile.completedMissions],
      unlockedAchievementIds: [...memoryProfile.unlockedAchievementIds],
      totalXp: memoryProfile.totalXp,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialProfile();
    const parsed = JSON.parse(raw);
    return {
      visitedSlugs: Array.isArray(parsed.visitedSlugs) ? parsed.visitedSlugs : [],
      visitedTalukas: Array.isArray(parsed.visitedTalukas) ? parsed.visitedTalukas : [],
      completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
      unlockedAchievementIds: Array.isArray(parsed.unlockedAchievementIds) ? parsed.unlockedAchievementIds : [],
      totalXp: typeof parsed.totalXp === 'number' ? parsed.totalXp : 0,
    };
  } catch {
    return getInitialProfile();
  }
}

export function saveExplorationProfile(profile: UserExplorationProfile): void {
  memoryProfile = {
    visitedSlugs: [...profile.visitedSlugs],
    visitedTalukas: [...profile.visitedTalukas],
    completedMissions: [...profile.completedMissions],
    unlockedAchievementIds: [...profile.unlockedAchievementIds],
    totalXp: profile.totalXp,
  };
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

/**
 * Record a visit to a place. Evaluates achievements and returns newly unlocked ones.
 */
export function recordPlaceVisit(
  place: ExperiencePlace,
  allPlaces: ExperiencePlace[]
): { profile: UserExplorationProfile; newlyUnlocked: ExplorationAchievement[] } {
  const profile = loadExplorationProfile();
  const newlyUnlocked: ExplorationAchievement[] = [];

  if (!profile.visitedSlugs.includes(place.slug)) {
    profile.visitedSlugs.push(place.slug);
  }

  const talukaInfo = getTalukaOrRegion(place.latitude, place.longitude, place.address);
  if (talukaInfo?.id && !profile.visitedTalukas.includes(talukaInfo.id)) {
    profile.visitedTalukas.push(talukaInfo.id);
  }

  const unlock = (achId: string) => {
    if (!profile.unlockedAchievementIds.includes(achId)) {
      profile.unlockedAchievementIds.push(achId);
      const ach = MASTER_ACHIEVEMENTS.find((a) => a.id === achId);
      if (ach) {
        newlyUnlocked.push({ ...ach, unlockedAt: new Date().toISOString() });
        profile.totalXp += ach.xp;
      }
    }
  };

  // 1. First Discovery
  if (profile.visitedSlugs.length >= 1) {
    unlock('first_discovery');
  }

  // 2. Fort Explorer (3+ forts)
  const visitedPlaces = allPlaces.filter((p) => profile.visitedSlugs.includes(p.slug));
  const visitedForts = visitedPlaces.filter(
    (p) => p.category_slug === 'forts' || p.category_slug === 'fort' || p.slug.includes('fort')
  );
  if (visitedForts.length >= 3) {
    unlock('fort_explorer');
  }

  // 3. Heritage Explorer (3+ heritage)
  const visitedHeritage = visitedPlaces.filter(
    (p) => p.category_slug === 'heritage' || p.category_slug === 'palaces' || p.category_slug === 'museums'
  );
  if (visitedHeritage.length >= 3) {
    unlock('heritage_explorer');
  }

  // 4. Nature Explorer (3+ nature / waterfalls / lakes / hill-stations)
  const visitedNature = visitedPlaces.filter(
    (p) =>
      p.category_slug === 'nature' ||
      p.category_slug === 'waterfalls' ||
      p.category_slug === 'lakes' ||
      p.category_slug === 'hill-stations'
  );
  if (visitedNature.length >= 3) {
    unlock('nature_explorer');
  }

  // 5. Taluka Explorer (5+ distinct talukas)
  if (profile.visitedTalukas.length >= 5) {
    unlock('taluka_explorer');
  }

  saveExplorationProfile(profile);
  return { profile, newlyUnlocked };
}

/**
 * Record a completed mission trail.
 */
export function recordMissionCompleted(
  missionId: string
): { profile: UserExplorationProfile; newlyUnlocked: ExplorationAchievement[] } {
  const profile = loadExplorationProfile();
  const newlyUnlocked: ExplorationAchievement[] = [];

  if (!profile.completedMissions.includes(missionId)) {
    profile.completedMissions.push(missionId);
  }

  if (!profile.unlockedAchievementIds.includes('trail_master')) {
    profile.unlockedAchievementIds.push('trail_master');
    const ach = MASTER_ACHIEVEMENTS.find((a) => a.id === 'trail_master');
    if (ach) {
      newlyUnlocked.push({ ...ach, unlockedAt: new Date().toISOString() });
      profile.totalXp += ach.xp;
    }
  }

  saveExplorationProfile(profile);
  return { profile, newlyUnlocked };
}

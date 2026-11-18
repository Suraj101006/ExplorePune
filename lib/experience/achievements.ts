'use client';

import { ExperiencePlace } from './types';
import { getTalukaOrRegion, calculateDistanceKm } from './puneDistrictData';

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
  missionProgress: Record<string, string[]>;
  unlockedAchievementIds: string[];
  totalXp: number;
  proximityDiscoveredSlugs: string[];
}

export interface ExplorerRank {
  titleEn: string;
  titleMr: string;
  level: number;
  minXp: number;
  maxXp: number;
  badge: string;
}

const STORAGE_KEY = 'explore_pune_gta_achievements_v2';

export const MASTER_ACHIEVEMENTS: ExplorationAchievement[] = [
  {
    id: 'first_discovery',
    code: 'ACH-01',
    titleEn: 'First Discovery',
    titleMr: 'पहिले पाऊल',
    descriptionEn: 'Discovered your first destination in the Pune District Atlas.',
    descriptionMr: 'पुणे जिल्हा अ‍ॅटलसमध्ये तुमचे पहिले ठिकाण शोधले.',
    icon: '🧭',
    xp: 100,
  },
  {
    id: 'first_fort',
    code: 'ACH-02',
    titleEn: 'First Fort Explored',
    titleMr: 'पहिले दुर्ग दर्शन',
    descriptionEn: 'Inspected your first historic mountain fortress of the Sahyadri.',
    descriptionMr: 'सह्याद्रीतील तुमच्या पहिल्या ऐतिहासिक किल्ल्याचे अन्वेषण केले.',
    icon: '⛰️',
    xp: 150,
  },
  {
    id: 'first_heritage',
    code: 'ACH-03',
    titleEn: 'First Heritage Destination',
    titleMr: 'पहिला वारसा शोध',
    descriptionEn: 'Explored your first historic palace, wada, or cultural landmark.',
    descriptionMr: 'पुण्यातील पहिला ऐतिहासिक वाडा, राजवाडा किंवा वारसा स्थळ पाहिले.',
    icon: '🏛️',
    xp: 150,
  },
  {
    id: 'five_locations',
    code: 'ACH-04',
    titleEn: 'Five Locations Discovered',
    titleMr: 'पाच स्थळांचे अन्वेषण',
    descriptionEn: 'Discovered 5 verified locations across Pune District.',
    descriptionMr: 'पुणे जिल्ह्यातील ५ नामांकित स्थळांची माहिती मिळवली.',
    icon: '📍',
    xp: 250,
  },
  {
    id: 'ten_destinations',
    code: 'ACH-05',
    titleEn: 'Ten Destinations Explored',
    titleMr: 'दहा स्थळांची सफर',
    descriptionEn: 'Explored 10 verified destinations in the interactive atlas.',
    descriptionMr: 'परस्परसंवादी नकाशामध्ये १० विविध पर्यटन स्थळांचा शोध घेतला.',
    icon: '🗺️',
    xp: 500,
  },
  {
    id: 'taluka_explorer',
    code: 'ACH-06',
    titleEn: 'Complete a Taluka Exploration',
    titleMr: 'तालुका प्रदक्षिणा',
    descriptionEn: 'Explored 3 or more landmarks within a single Pune taluka.',
    descriptionMr: 'एकाच तालुक्यातील ३ किंवा अधिक पर्यटन स्थळांची सफर पूर्ण केली.',
    icon: '🚩',
    xp: 300,
  },
  {
    id: 'trail_master',
    code: 'ACH-07',
    titleEn: 'Complete a Discovery Trail',
    titleMr: 'मोहीम शिखरवीर',
    descriptionEn: 'Completed all stops of an open-world GTA discovery mission trail.',
    descriptionMr: 'ओपन-वर्ल्ड मोहिमेतील सर्व मार्ग ठिकाणे यशस्वीपणे पूर्ण केली.',
    icon: '🏆',
    xp: 750,
  },
  {
    id: 'fort_explorer',
    code: 'ACH-08',
    titleEn: 'Swarajya Fort Master',
    titleMr: 'स्वराज्य दुर्गवीर',
    descriptionEn: 'Inspected 3 historic mountain fortresses of the Sahyadri.',
    descriptionMr: 'सह्याद्रीतील ३ ऐतिहासिक डोंगरी किल्ल्यांचे अन्वेषण केले.',
    icon: '🏰',
    xp: 350,
  },
  {
    id: 'nature_explorer',
    code: 'ACH-09',
    titleEn: 'Sahyadri Nature Wanderer',
    titleMr: 'सह्याद्री निसर्ग भ्रमंती',
    descriptionEn: 'Visited 3 reservoirs, waterfalls, or scenic mountain retreats.',
    descriptionMr: '३ धरणे, धबधबे किंवा निसर्गरम्य पर्यटन स्थळांची सफर केली.',
    icon: '🌊',
    xp: 350,
  },
  {
    id: 'temple_trail',
    code: 'ACH-10',
    titleEn: 'Sacred Temple Trail Pilgrim',
    titleMr: 'तीर्थक्षेत्र पदयात्रा',
    descriptionEn: 'Visited 3 sacred shrines or Ashtavinayak temples of Pune.',
    descriptionMr: 'पुण्यातील ३ जागृत देवस्थाने किंवा तीर्थक्षेत्रांना भेट दिली.',
    icon: '🛕',
    xp: 350,
  },
  {
    id: 'district_conqueror',
    code: 'ACH-11',
    titleEn: 'Pune District Master',
    titleMr: 'पुणे जिल्हा महानायक',
    descriptionEn: 'Explored 20+ destinations across 5+ different talukas of Pune.',
    descriptionMr: '५ पेक्षा जास्त तालुक्यांमधील २० हून अधिक स्थळांचे अन्वेषण केले.',
    icon: '👑',
    xp: 1000,
  },
];

export const EXPLORER_RANKS: ExplorerRank[] = [
  {
    titleEn: 'Novice Explorer',
    titleMr: 'नवा शोधक',
    level: 1,
    minXp: 0,
    maxXp: 300,
    badge: 'ROOKIE',
  },
  {
    titleEn: 'Taluka Scout',
    titleMr: 'तालुका शोधक',
    level: 2,
    minXp: 301,
    maxXp: 800,
    badge: 'SCOUT',
  },
  {
    titleEn: 'Sahyadri Pioneer',
    titleMr: 'सह्याद्री शिलेदार',
    level: 3,
    minXp: 801,
    maxXp: 1800,
    badge: 'PIONEER',
  },
  {
    titleEn: 'Swarajya Trailblazer',
    titleMr: 'स्वराज्य मार्गदर्शक',
    level: 4,
    minXp: 1801,
    maxXp: 3200,
    badge: 'TRAILBLAZER',
  },
  {
    titleEn: 'Pune District Legend',
    titleMr: 'पुणे जिल्हा महानायक',
    level: 5,
    minXp: 3201,
    maxXp: 10000,
    badge: 'LEGEND',
  },
];

export function getExplorerRank(xp: number): ExplorerRank {
  for (let i = EXPLORER_RANKS.length - 1; i >= 0; i--) {
    if (xp >= EXPLORER_RANKS[i].minXp) {
      return EXPLORER_RANKS[i];
    }
  }
  return EXPLORER_RANKS[0];
}

let memoryProfile: UserExplorationProfile = getInitialProfile();

export function getInitialProfile(): UserExplorationProfile {
  return {
    visitedSlugs: [],
    visitedTalukas: [],
    completedMissions: [],
    missionProgress: {},
    unlockedAchievementIds: [],
    totalXp: 0,
    proximityDiscoveredSlugs: [],
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
      missionProgress: { ...memoryProfile.missionProgress },
      unlockedAchievementIds: [...memoryProfile.unlockedAchievementIds],
      totalXp: memoryProfile.totalXp,
      proximityDiscoveredSlugs: [...memoryProfile.proximityDiscoveredSlugs],
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
      missionProgress: parsed.missionProgress && typeof parsed.missionProgress === 'object' ? parsed.missionProgress : {},
      unlockedAchievementIds: Array.isArray(parsed.unlockedAchievementIds) ? parsed.unlockedAchievementIds : [],
      totalXp: typeof parsed.totalXp === 'number' ? parsed.totalXp : 0,
      proximityDiscoveredSlugs: Array.isArray(parsed.proximityDiscoveredSlugs) ? parsed.proximityDiscoveredSlugs : [],
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
    missionProgress: { ...profile.missionProgress },
    unlockedAchievementIds: [...profile.unlockedAchievementIds],
    totalXp: profile.totalXp,
    proximityDiscoveredSlugs: [...profile.proximityDiscoveredSlugs],
  };
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

export interface PlaceVisitResult {
  profile: UserExplorationProfile;
  newlyUnlocked: ExplorationAchievement[];
  isFirstDiscovery: boolean;
  isProximityDiscovery: boolean;
  talukaName?: string;
}

/**
 * Record a visit to a place. Evaluates achievements and returns newly unlocked ones.
 * Supports optional user GPS coordinates for authentic physical proximity verification.
 */
export function recordPlaceVisit(
  place: ExperiencePlace,
  allPlaces: ExperiencePlace[],
  userGpsCoords?: { latitude: number; longitude: number }
): PlaceVisitResult {
  const profile = loadExplorationProfile();
  const newlyUnlocked: ExplorationAchievement[] = [];
  const isFirstDiscovery = !profile.visitedSlugs.includes(place.slug);

  if (isFirstDiscovery) {
    profile.visitedSlugs.push(place.slug);
    profile.totalXp += 50; // +50 XP base for discovering any verified location!
  }

  // Real-world physical proximity check (<= 1.5km from device GPS)
  let isProximityDiscovery = false;
  if (userGpsCoords && typeof userGpsCoords.latitude === 'number') {
    const dist = calculateDistanceKm(
      userGpsCoords.latitude,
      userGpsCoords.longitude,
      place.latitude,
      place.longitude
    );
    if (dist <= 1.5) {
      isProximityDiscovery = true;
      if (!profile.proximityDiscoveredSlugs.includes(place.slug)) {
        profile.proximityDiscoveredSlugs.push(place.slug);
        profile.totalXp += 100; // Bonus +100 XP for physically visiting!
      }
    }
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

  // 1. First Discovery (1+ place)
  if (profile.visitedSlugs.length >= 1) {
    unlock('first_discovery');
  }

  const visitedPlaces = allPlaces.filter((p) => profile.visitedSlugs.includes(p.slug));

  // 2. First Fort Explored
  const isFort = place.category_slug === 'forts' || place.slug.includes('fort');
  if (isFort) {
    unlock('first_fort');
  }

  // 3. First Heritage Destination
  const isHeritage =
    place.category_slug === 'heritage' ||
    place.slug.includes('wada') ||
    place.slug.includes('palace') ||
    place.slug.includes('caves');
  if (isHeritage) {
    unlock('first_heritage');
  }

  // 4. Five Locations Discovered
  if (profile.visitedSlugs.length >= 5) {
    unlock('five_locations');
  }

  // 5. Ten Destinations Explored
  if (profile.visitedSlugs.length >= 10) {
    unlock('ten_destinations');
  }

  // 6. Complete a Taluka Exploration (3+ in single taluka)
  const talukaCounts: Record<string, number> = {};
  visitedPlaces.forEach((p) => {
    const t = getTalukaOrRegion(p.latitude, p.longitude, p.address);
    if (t?.id) {
      talukaCounts[t.id] = (talukaCounts[t.id] || 0) + 1;
    }
  });
  if (Object.values(talukaCounts).some((count) => count >= 3)) {
    unlock('taluka_explorer');
  }

  // 8. Swarajya Fort Master (3+ forts)
  const visitedForts = visitedPlaces.filter(
    (p) => p.category_slug === 'forts' || p.category_slug === 'fort' || p.slug.includes('fort')
  );
  if (visitedForts.length >= 3) {
    unlock('fort_explorer');
  }

  // 9. Sahyadri Nature Wanderer (3+ nature / waterfalls / lakes)
  const visitedNature = visitedPlaces.filter(
    (p) =>
      p.category_slug === 'nature' ||
      p.category_slug === 'waterfalls' ||
      p.category_slug === 'lakes' ||
      p.slug.includes('dam') ||
      p.slug.includes('lake') ||
      p.slug.includes('ghat')
  );
  if (visitedNature.length >= 3) {
    unlock('nature_explorer');
  }

  // 10. Sacred Temple Trail Pilgrim (3+ temples)
  const visitedTemples = visitedPlaces.filter(
    (p) =>
      p.category_slug === 'temples' ||
      p.slug.includes('mandir') ||
      p.slug.includes('temple') ||
      p.slug.includes('ganpati')
  );
  if (visitedTemples.length >= 3) {
    unlock('temple_trail');
  }

  // 11. Pune District Master (20+ destinations across 5+ talukas)
  if (profile.visitedSlugs.length >= 20 && profile.visitedTalukas.length >= 5) {
    unlock('district_conqueror');
  }

  saveExplorationProfile(profile);
  return {
    profile,
    newlyUnlocked,
    isFirstDiscovery,
    isProximityDiscovery,
    talukaName: talukaInfo?.nameEn,
  };
}

/**
 * Record progress on an active mission stop.
 * When all stops are completed, the mission is marked completed and awards trail_master!
 */
export function recordMissionStopProgress(
  missionId: string,
  placeSlug: string,
  allMissionStopSlugs: string[]
): { profile: UserExplorationProfile; newlyCompleted: boolean; newlyUnlocked: ExplorationAchievement[] } {
  const profile = loadExplorationProfile();
  const newlyUnlocked: ExplorationAchievement[] = [];
  let newlyCompleted = false;

  const currentStops = profile.missionProgress[missionId] || [];
  if (!currentStops.includes(placeSlug)) {
    currentStops.push(placeSlug);
    profile.missionProgress[missionId] = currentStops;
  }

  // Check if all stops of this mission are visited
  const allCompleted = allMissionStopSlugs.every((slug) =>
    profile.visitedSlugs.includes(slug) || currentStops.includes(slug)
  );

  if (allCompleted && !profile.completedMissions.includes(missionId)) {
    profile.completedMissions.push(missionId);
    newlyCompleted = true;
    profile.totalXp += 250; // +250 XP bonus for mission completion

    if (!profile.unlockedAchievementIds.includes('trail_master')) {
      profile.unlockedAchievementIds.push('trail_master');
      const ach = MASTER_ACHIEVEMENTS.find((a) => a.id === 'trail_master');
      if (ach) {
        newlyUnlocked.push({ ...ach, unlockedAt: new Date().toISOString() });
        profile.totalXp += ach.xp;
      }
    }
  }

  saveExplorationProfile(profile);
  return { profile, newlyCompleted, newlyUnlocked };
}

/**
 * Record a completed mission trail directly.
 */
export function recordMissionCompleted(
  missionId: string
): { profile: UserExplorationProfile; newlyUnlocked: ExplorationAchievement[] } {
  const profile = loadExplorationProfile();
  const newlyUnlocked: ExplorationAchievement[] = [];

  if (!profile.completedMissions.includes(missionId)) {
    profile.completedMissions.push(missionId);
    profile.totalXp += 250;
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

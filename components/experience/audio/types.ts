/**
 * Explore Pune - Web Audio Engine Types
 * "Pune Through Time" Sonic Architecture
 */

import { ChapterId } from '@/lib/experience/types';

export type AmbientTrackId =
  | 'preloader-drone'
  | 'sahyadri-wind'
  | 'peshwa-court'
  | 'market-bustle'
  | 'dhol-tasha'
  | 'monsoon-rain';

export type SfxId =
  | 'hammer'
  | 'coin'
  | 'sizzle'
  | 'click'
  | 'fanfare';

export interface AudioEngineState {
  isAudioEnabled: boolean;     // Hard Rule #3: Strictly OFF by default
  isMuted: boolean;
  volume: number;              // Master volume 0.0 to 1.0
  activeTrack: AmbientTrackId | null;
  currentChapter: ChapterId | string;
  scrollVelocity: number;
  dholPlaybackRate: number;    // Dynamic tempo linked to scroll velocity (0.85x to 1.65x)
  isFallbackActive: boolean;   // True if Web Audio API synthetic fallback is active
  isPageVisible: boolean;      // document.visibilityState === 'visible'
  hasUserOptedIn: boolean;     // Confirms user explicitly interacted to opt in
  showOptInPrompt: boolean;    // Banner / prompt visibility
}

export interface AudioEngineContextValue extends AudioEngineState {
  toggleAudio: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playSfx: (id: SfxId) => void;
  transitionToChapter: (chapter: ChapterId | string) => void;
  setScrollVelocity: (velocity: number) => void;
  dismissOptInPrompt: () => void;
  optInAudio: () => void;
}

export const AMBIENT_CHAPTER_MAP: Record<string, AmbientTrackId> = {
  // Formal ChapterIds
  preloader: 'preloader-drone',
  arrival: 'sahyadri-wind',
  epochs: 'peshwa-court',
  pathways: 'market-bustle',
  map: 'market-bustle',
  playground: 'dhol-tasha',
  seasons: 'monsoon-rain',
  plan: 'sahyadri-wind',
  outro: 'preloader-drone',

  // DOM Section IDs in Experience Page
  hero: 'preloader-drone',
  world3d: 'sahyadri-wind',
  'pinned-journey': 'peshwa-court',
  categories: 'market-bustle',
  heritage: 'peshwa-court',
  forts: 'sahyadri-wind',
  food: 'market-bustle',
  curiosities: 'dhol-tasha',
  culture: 'dhol-tasha',
  nature: 'sahyadri-wind',
  gems: 'market-bustle',
  finder: 'sahyadri-wind',
  planner: 'preloader-drone',
  stories: 'peshwa-court',
  community: 'dhol-tasha',
};

/**
 * Explore Pune - Experience Platform Types & Chapter API
 * Concept: "Pune Through Time"
 */

export type ChapterId =
  | 'preloader'   // Chapter 0: Devanagari numeral counter + "पुणे" ink-draw
  | 'arrival'     // Chapter 1: Parallax Sinhagad, live weather/time sky
  | 'epochs'      // Chapter 2: Pinned morph: Pataleshwar -> Sinhagad -> Shaniwar Wada -> Reform
  | 'pathways'    // Chapter 3: Draggable rail of 16 pathways with hover distortion
  | 'map'         // Chapter 4: Living Map low-poly flight + 106 place pins + Today's Peth
  | 'playground'  // Chapter 5: 5 tactile mini-games (Misal, Tambat, Tanaji, Relic, Ganeshotsav)
  | 'seasons'     // Chapter 6: Scroll-scrubbed 4-season atmosphere
  | 'plan'        // Chapter 7: Low-motion trip builder, finder, & passport
  | 'outro';      // Chapter 8: Final cinematic curtain, credits, & return

export interface ChapterRegistration {
  id: ChapterId;
  titleEn: string;
  titleMr: string;
  order: number;
  enter?: (direction: 'forward' | 'backward') => void;
  exit?: (direction: 'forward' | 'backward') => void;
  scrub?: (progress: number) => void;
}

export interface ExperienceState {
  scrollProgress: number;          // 0 to 1 across full page
  activeChapter: ChapterId;
  isAudioEnabled: boolean;         // Audio OFF by default (Hard Rule #3)
  isLiteMode: boolean;             // Calm/Lite mode (?lite=1, no WebGL/audio, CSS only)
  prefersReducedMotion: boolean;   // System accessibility preference
  isLoaded: boolean;               // Preloader completed
  chapters: ChapterRegistration[];
}

export interface ExperienceContextValue extends ExperienceState {
  toggleAudio: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  toggleLiteMode: () => void;
  setLiteMode: (enabled: boolean) => void;
  setIsLoaded: (loaded: boolean) => void;
  registerChapter: (chapter: ChapterRegistration) => void;
  unregisterChapter: (id: ChapterId) => void;
  scrubChapter: (id: ChapterId, progress: number) => void;
  scrollToChapter: (id: ChapterId) => void;
  theme: 'light' | 'dark';
  isDark: boolean;
  lang: 'en' | 'mr';
  isMr: boolean;
}

/**
 * Explore Pune - useAudioEngine Hook & Core Audio Controller
 * Manages Howler instances, synthetic fallback, scroll velocity modulation,
 * and user opt-in compliance with Hard Rule #3.
 */

'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import {
  AmbientTrackId,
  SfxId,
  AudioEngineContextValue,
  AMBIENT_CHAPTER_MAP,
} from './types';
import { syntheticAudio } from './syntheticAudio';

export const AudioContext = createContext<AudioEngineContextValue | null>(null);

export function useAudioEngine(): AudioEngineContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioEngine must be used within an <AudioManager>');
  }
  return context;
}

const AMBIENT_SOURCES: Record<AmbientTrackId, string[]> = {
  'preloader-drone': ['/experience/audio/preloader-drone.webm', '/experience/audio/preloader-drone.mp3'],
  'sahyadri-wind': ['/experience/audio/sahyadri-wind.webm', '/experience/audio/sahyadri-wind.mp3'],
  'peshwa-court': ['/experience/audio/peshwa-court.webm', '/experience/audio/peshwa-court.mp3'],
  'market-bustle': ['/experience/audio/market-bustle.webm', '/experience/audio/market-bustle.mp3'],
  'dhol-tasha': ['/experience/audio/dhol-tasha.webm', '/experience/audio/dhol-tasha.mp3'],
  'monsoon-rain': ['/experience/audio/monsoon-rain.webm', '/experience/audio/monsoon-rain.mp3'],
};

const SFX_SOURCES: Record<SfxId, string[]> = {
  hammer: ['/experience/audio/hammer-strike.webm', '/experience/audio/hammer-strike.mp3'],
  coin: ['/experience/audio/coin-drop.webm', '/experience/audio/coin-drop.mp3'],
  sizzle: ['/experience/audio/misal-sizzle.webm', '/experience/audio/misal-sizzle.mp3'],
  click: ['/experience/audio/ui-click.webm', '/experience/audio/ui-click.mp3'],
  fanfare: ['/experience/audio/win-fanfare.webm', '/experience/audio/win-fanfare.mp3'],
};

export function useAudioController() {
  // Hard Rule #3: Audio is strictly OFF by default
  const [isAudioEnabled, setIsAudioEnabledState] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.7);
  const [activeTrack, setActiveTrack] = useState<AmbientTrackId | null>(null);
  const [currentChapter, setCurrentChapter] = useState<string>('preloader');
  const [scrollVelocity, setScrollVelocityState] = useState<number>(0);
  const [dholPlaybackRate, setDholPlaybackRate] = useState<number>(1.0);
  const [isFallbackActive, setIsFallbackActive] = useState<boolean>(false);
  const [isPageVisible, setIsPageVisible] = useState<boolean>(true);
  const [hasUserOptedIn, setHasUserOptedIn] = useState<boolean>(false);
  const [showOptInPrompt, setShowOptInPrompt] = useState<boolean>(true);

  // Howl instances cache
  const ambientHowlsRef = useRef<Map<AmbientTrackId, Howl>>(new Map());
  const sfxHowlsRef = useRef<Map<SfxId, Howl>>(new Map());

  // Refs for tracking animation loops and rates without re-render cascades
  const currentRateRef = useRef<number>(1.0);
  const targetRateRef = useRef<number>(1.0);
  const animFrameRef = useRef<number | null>(null);
  const lastScrollYRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);
  const isEnabledRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);
  const activeTrackRef = useRef<AmbientTrackId | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    isEnabledRef.current = isAudioEnabled;
  }, [isAudioEnabled]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    activeTrackRef.current = activeTrack;
  }, [activeTrack]);

  // Read stored preference on client mount without autoplaying (Hard Rule #3)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('explore_pune_audio_enabled');
      const dismissed = sessionStorage.getItem('ep_audio_prompt_dismissed');
      if (dismissed === 'true') {
        setShowOptInPrompt(false);
      }
      if (stored === 'true') {
        // Preference was true previously, but audio still stays OFF until user gesture
        setHasUserOptedIn(true);
      }
    } catch (e) {
      // Storage unavailable
    }
  }, []);

  // Initialize a Howl instance with graceful synthetic fallback
  const getAmbientHowl = useCallback((trackId: AmbientTrackId): Howl | null => {
    if (typeof window === 'undefined') return null;

    if (ambientHowlsRef.current.has(trackId)) {
      return ambientHowlsRef.current.get(trackId)!;
    }

    try {
      const sources = AMBIENT_SOURCES[trackId];
      const howl = new Howl({
        src: sources,
        loop: true,
        volume: 0,
        html5: false, // Use Web Audio API backend within Howler for real-time rate control
        onloaderror: (_id, err) => {
          console.warn(`[Howler] Asset load notice for ${trackId}, using synthetic fallback:`, err);
          setIsFallbackActive(true);
        },
      });

      ambientHowlsRef.current.set(trackId, howl);
      return howl;
    } catch (e) {
      setIsFallbackActive(true);
      return null;
    }
  }, []);

  const getSfxHowl = useCallback((sfxId: SfxId): Howl | null => {
    if (typeof window === 'undefined') return null;

    if (sfxHowlsRef.current.has(sfxId)) {
      return sfxHowlsRef.current.get(sfxId)!;
    }

    try {
      const sources = SFX_SOURCES[sfxId];
      const howl = new Howl({
        src: sources,
        volume: volume,
        onloaderror: () => {
          setIsFallbackActive(true);
        },
      });

      sfxHowlsRef.current.set(sfxId, howl);
      return howl;
    } catch (e) {
      setIsFallbackActive(true);
      return null;
    }
  }, [volume]);

  // Smooth Crossfade Between Ambient Chapters
  const crossfadeToTrack = useCallback((newTrackId: AmbientTrackId, durationMs = 1200) => {
    const prevTrackId = activeTrackRef.current;
    if (prevTrackId === newTrackId && ambientHowlsRef.current.get(newTrackId)?.playing()) {
      return;
    }

    setActiveTrack(newTrackId);
    activeTrackRef.current = newTrackId;

    if (!isEnabledRef.current || isMutedRef.current) {
      return;
    }

    const targetVol = volume * 0.65;

    // 1. Fade out previous track
    if (prevTrackId && prevTrackId !== newTrackId) {
      const prevHowl = ambientHowlsRef.current.get(prevTrackId);
      if (prevHowl && prevHowl.playing()) {
        prevHowl.fade(prevHowl.volume(), 0, durationMs);
        setTimeout(() => {
          if (activeTrackRef.current !== prevTrackId) {
            prevHowl.pause();
          }
        }, durationMs);
      }
    }

    // 2. Fade in new track
    const newHowl = getAmbientHowl(newTrackId);
    if (newHowl) {
      if (!newHowl.playing()) {
        newHowl.volume(0);
        newHowl.play();
      }
      newHowl.fade(newHowl.volume(), targetVol, durationMs);
    } else {
      // Fallback
      syntheticAudio.crossfadeToTrack(newTrackId, durationMs / 1000);
    }
  }, [volume, getAmbientHowl]);

  // Transition to chapter by ID
  const transitionToChapter = useCallback((chapterIdOrSection: string) => {
    setCurrentChapter(chapterIdOrSection);
    const targetTrack = AMBIENT_CHAPTER_MAP[chapterIdOrSection] || 'preloader-drone';
    crossfadeToTrack(targetTrack);
  }, [crossfadeToTrack]);

  // Play Sound Effects (Tactile Feedback)
  const playSfx = useCallback((sfxId: SfxId) => {
    if (!isEnabledRef.current || isMutedRef.current) return;

    const howl = getSfxHowl(sfxId);
    if (howl) {
      howl.volume(volume * 0.85);
      howl.play();
    } else {
      syntheticAudio.playSfx(sfxId);
    }
  }, [volume, getSfxHowl]);

  // Toggle Audio (Hard Rule #3: Starts strictly on user click)
  const setAudioEnabled = useCallback((enabled: boolean) => {
    setIsAudioEnabledState(enabled);
    isEnabledRef.current = enabled;

    try {
      localStorage.setItem('explore_pune_audio_enabled', String(enabled));
    } catch (e) {}

    if (enabled) {
      setHasUserOptedIn(true);
      setShowOptInPrompt(false);
      try {
        sessionStorage.setItem('ep_audio_prompt_dismissed', 'true');
      } catch (e) {}

      // Resume Howler & Web Audio contexts
      if (typeof Howler !== 'undefined') {
        Howler.mute(isMutedRef.current);
      }
      syntheticAudio.initContext();

      // Start current chapter ambient
      const currentTrackId = activeTrackRef.current || AMBIENT_CHAPTER_MAP[currentChapter] || 'preloader-drone';
      crossfadeToTrack(currentTrackId, 800);
      playSfx('click');
    } else {
      // Stop/pause all active tracks
      ambientHowlsRef.current.forEach((howl) => {
        howl.fade(howl.volume(), 0, 400);
        setTimeout(() => howl.pause(), 400);
      });
      syntheticAudio.stopAmbient(0.4);
    }
  }, [currentChapter, crossfadeToTrack, playSfx]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(!isEnabledRef.current);
  }, [setAudioEnabled]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (typeof Howler !== 'undefined') {
        Howler.mute(next);
      }
      syntheticAudio.setMute(next);
      return next;
    });
  }, []);

  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (typeof Howler !== 'undefined') {
      Howler.volume(clamped);
    }
    syntheticAudio.setVolume(clamped);
  }, []);

  const dismissOptInPrompt = useCallback(() => {
    setShowOptInPrompt(false);
    try {
      sessionStorage.setItem('ep_audio_prompt_dismissed', 'true');
    } catch (e) {}
  }, []);

  const optInAudio = useCallback(() => {
    setAudioEnabled(true);
  }, [setAudioEnabled]);

  // Dynamic Dhol-Tasha Scroll Velocity Linkage
  const updateScrollVelocity = useCallback((vel: number) => {
    setScrollVelocityState(vel);
    // Map scroll velocity to playback rate [0.85x to 1.65x]
    const target = 0.85 + Math.min(0.8, vel * 0.45);
    targetRateRef.current = target;
  }, []);

  // Animation frame loop for smooth rate lerping without jitter
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lerpRate = () => {
      // Smooth interpolation toward targetRate
      currentRateRef.current += (targetRateRef.current - currentRateRef.current) * 0.08;
      const rounded = Math.round(currentRateRef.current * 100) / 100;
      setDholPlaybackRate(rounded);

      // Apply rate to active Dhol-Tasha Howl
      const dholHowl = ambientHowlsRef.current.get('dhol-tasha');
      if (dholHowl && dholHowl.playing()) {
        dholHowl.rate(rounded);
      }
      syntheticAudio.setDholRate(rounded);

      // Decelerate target rate back to 1.0 when scrolling ceases
      targetRateRef.current += (1.0 - targetRateRef.current) * 0.04;

      animFrameRef.current = requestAnimationFrame(lerpRate);
    };

    animFrameRef.current = requestAnimationFrame(lerpRate);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Window scroll velocity tracker
  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTimeRef.current);
      const dy = Math.abs(window.scrollY - lastScrollYRef.current);
      const velocity = dy / dt; // px per ms

      lastScrollYRef.current = window.scrollY;
      lastScrollTimeRef.current = now;

      updateScrollVelocity(velocity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollVelocity]);

  // Page Visibility Change (Auto-pause on hidden, auto-resume on visible)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibility = () => {
      const visible = document.visibilityState === 'visible';
      setIsPageVisible(visible);

      if (!visible) {
        // Auto-pause when page hidden
        if (typeof Howler !== 'undefined') {
          Howler.mute(true);
        }
        syntheticAudio.pause();
      } else {
        // Auto-resume if enabled and not user-muted
        if (isEnabledRef.current && !isMutedRef.current) {
          if (typeof Howler !== 'undefined') {
            Howler.mute(false);
          }
          syntheticAudio.resume();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ambientHowlsRef.current.forEach((howl) => howl.unload());
      sfxHowlsRef.current.forEach((howl) => howl.unload());
      ambientHowlsRef.current.clear();
      sfxHowlsRef.current.clear();
      syntheticAudio.destroy();
    };
  }, []);

  return {
    isAudioEnabled,
    isMuted,
    volume,
    activeTrack,
    currentChapter,
    scrollVelocity,
    dholPlaybackRate,
    isFallbackActive,
    isPageVisible,
    hasUserOptedIn,
    showOptInPrompt,
    toggleAudio,
    setAudioEnabled,
    toggleMute,
    setVolume,
    playSfx,
    transitionToChapter,
    setScrollVelocity: updateScrollVelocity,
    dismissOptInPrompt,
    optInAudio,
  };
}

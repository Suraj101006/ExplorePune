'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { ExperienceContext } from './ExperienceContext';
import {
  ChapterId,
  ChapterRegistration,
  ExperienceContextValue,
} from '@/lib/experience/types';
import { globalChapterRegistry } from '@/lib/experience/registry';
import { resolveExperienceFlags } from '@/lib/experience/featureFlags';

interface ExperienceProviderProps {
  children: React.ReactNode;
}

export default function ExperienceProvider({ children }: ExperienceProviderProps) {
  const { lang, isMr } = useLanguage();
  const { theme, isDark } = useTheme();

  // Core Experience States
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeChapter, setActiveChapter] = useState<ChapterId>('preloader');
  const [chapters, setChapters] = useState<ChapterRegistration[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Hard Rule #3 & #4: Audio & Calm/Lite Mode States
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isLiteMode, setIsLiteMode] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Initialize flags and client-only settings
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const flags = resolveExperienceFlags();
    if (flags.enableLiteModeByDefault) {
      setIsLiteMode(true);
    }

    // Check system prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);

    // Subscribe to chapter registry changes
    const unsubscribeRegistry = globalChapterRegistry.subscribe((currActive, registered) => {
      setActiveChapter(currActive);
      setChapters(registered);
    });

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      unsubscribeRegistry();
    };
  }, []);

  // Audio Toggle Handler
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('explore_pune_audio_enabled', String(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const setAudioEnabled = useCallback((enabled: boolean) => {
    setIsAudioEnabled(enabled);
    try {
      localStorage.setItem('explore_pune_audio_enabled', String(enabled));
    } catch (e) {}
  }, []);

  // Lite Mode Toggle Handler
  const toggleLiteMode = useCallback(() => {
    setIsLiteMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('explore_pune_lite_mode', String(next));
      } catch (e) {}
      // Update URL query parameter without full page reload
      const url = new URL(window.location.href);
      if (next) {
        url.searchParams.set('lite', '1');
      } else {
        url.searchParams.delete('lite');
      }
      window.history.replaceState({}, '', url.toString());
      return next;
    });
  }, []);

  const setLiteMode = useCallback((enabled: boolean) => {
    setIsLiteMode(enabled);
    try {
      localStorage.setItem('explore_pune_lite_mode', String(enabled));
    } catch (e) {}
  }, []);

  // Chapter Registration API
  const registerChapter = useCallback((chapter: ChapterRegistration) => {
    globalChapterRegistry.register(chapter);
  }, []);

  const unregisterChapter = useCallback((id: ChapterId) => {
    globalChapterRegistry.unregister(id);
  }, []);

  const scrubChapter = useCallback((id: ChapterId, progress: number) => {
    globalChapterRegistry.scrubChapter(id, progress);
  }, []);

  const scrollToChapter = useCallback((id: ChapterId) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const value: ExperienceContextValue = useMemo(
    () => ({
      scrollProgress,
      activeChapter,
      isAudioEnabled,
      isLiteMode,
      prefersReducedMotion,
      isLoaded,
      chapters,
      toggleAudio,
      setAudioEnabled,
      toggleLiteMode,
      setLiteMode,
      setIsLoaded,
      registerChapter,
      unregisterChapter,
      scrubChapter,
      scrollToChapter,
      theme,
      isDark,
      lang,
      isMr,
    }),
    [
      scrollProgress,
      activeChapter,
      isAudioEnabled,
      isLiteMode,
      prefersReducedMotion,
      isLoaded,
      chapters,
      toggleAudio,
      setAudioEnabled,
      toggleLiteMode,
      setLiteMode,
      registerChapter,
      unregisterChapter,
      scrubChapter,
      scrollToChapter,
      theme,
      isDark,
      lang,
      isMr,
    ]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

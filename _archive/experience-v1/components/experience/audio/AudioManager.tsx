/**
 * Explore Pune - AudioManager Component
 * Orchestrates chapter-based audio transitions, ExperienceContext synchronization,
 * and exposes the AudioContext provider to the entire experience tree.
 */

'use client';

import React, { useEffect } from 'react';
import { AudioContext, useAudioController } from './useAudioEngine';
import { useExperience } from '../context/ExperienceContext';
import AudioControls from './AudioControls';

interface AudioManagerProps {
  children?: React.ReactNode;
  showFloatingControls?: boolean;
}

export default function AudioManager({
  children,
  showFloatingControls = true,
}: AudioManagerProps) {
  const controller = useAudioController();

  // Safely hook into ExperienceContext if available
  let expContext: ReturnType<typeof useExperience> | null = null;
  try {
    expContext = useExperience();
  } catch (e) {
    // Graceful fallback if rendered outside ExperienceProvider
    expContext = null;
  }

  // Synchronize chapter transitions from ExperienceContext
  useEffect(() => {
    if (expContext?.activeChapter) {
      controller.transitionToChapter(expContext.activeChapter);
    }
  }, [expContext?.activeChapter, controller.transitionToChapter]);

  // Synchronize audio toggle from ExperienceContext (e.g. NavSticky toggle)
  useEffect(() => {
    if (expContext && expContext.isAudioEnabled !== controller.isAudioEnabled) {
      controller.setAudioEnabled(expContext.isAudioEnabled);
    }
  }, [expContext?.isAudioEnabled]);

  // When audio enabled state changes in controller, sync back to ExperienceContext
  useEffect(() => {
    if (expContext && expContext.isAudioEnabled !== controller.isAudioEnabled) {
      expContext.setAudioEnabled(controller.isAudioEnabled);
    }
  }, [controller.isAudioEnabled]);

  return (
    <AudioContext.Provider value={controller}>
      {children}
      {showFloatingControls && <AudioControls />}
    </AudioContext.Provider>
  );
}

// Re-export hook for convenience
export { useAudioEngine } from './useAudioEngine';

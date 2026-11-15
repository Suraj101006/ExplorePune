'use client';

import React, { createContext, useContext } from 'react';
import { ExperienceContextValue } from '@/lib/experience/types';

export const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function useExperience(): ExperienceContextValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error('useExperience must be used within an <ExperienceProvider>');
  }
  return ctx;
}

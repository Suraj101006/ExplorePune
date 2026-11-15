'use client';

import React, { useEffect, useState } from 'react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import ExperienceWebGLScene from './ExperienceWebGLScene';

interface LazyWebGLCanvasProps {
  sceneId?: string;
}

export default function LazyWebGLCanvas({ sceneId = 'world' }: LazyWebGLCanvasProps) {
  const { isLiteMode, prefersReducedMotion, activeChapter } = useExperience();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hard Rule #4: In Calm/Lite mode or reduced-motion, DO NOT load WebGL canvas
  if (!isClient || isLiteMode || prefersReducedMotion) {
    return (
      <div
        className="exp-lite-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      id="experience-webgl-root"
      className="exp-webgl-container"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <ExperienceWebGLScene
        activeChapter={activeChapter}
        isInteractive={false}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
}

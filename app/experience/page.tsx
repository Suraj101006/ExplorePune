'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './experience.css';

// Dynamic client import for WebGL Three.js canvas
const ExperienceCanvas = dynamic(
  () => import('@/components/experience/ExperienceCanvas'),
  {
    ssr: false,
    loading: () => <div className="exp-canvas-container" aria-hidden="true" />,
  }
);

import ScenePortal from '@/components/experience/ScenePortal';
import SceneInfiniteUniverse from '@/components/experience/SceneInfiniteUniverse';
import SceneKineticTypography from '@/components/experience/SceneKineticTypography';
import SceneVisualGallery from '@/components/experience/SceneVisualGallery';
import SceneInteractive3D from '@/components/experience/SceneInteractive3D';
import SceneMotionLab from '@/components/experience/SceneMotionLab';
import SceneGrandFinale from '@/components/experience/SceneGrandFinale';
import ExperienceCursor from '@/components/experience/ExperienceCursor';
import ExperienceControls from '@/components/experience/ExperienceControls';

export default function ExperiencePage() {
  const [currentScene, setCurrentScene] = useState<number>(1);

  // Track active scene on scroll
  useEffect(() => {
    const sceneIds = [
      'scene-portal',
      'scene-universe',
      'scene-typography',
      'scene-gallery',
      'scene-3d',
      'scene-motion-lab',
      'scene-finale',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sceneIds.indexOf(entry.target.id);
            if (idx !== -1) {
              setCurrentScene(idx + 1);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    sceneIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="experience-root">
      {/* Three.js Fixed Background WebGL Canvas */}
      <ExperienceCanvas currentScene={currentScene} />

      {/* Atmospheric Overlays */}
      <div className="exp-vignette" aria-hidden="true" />
      <div className="exp-grid-overlay" aria-hidden="true" />

      {/* Custom Trailing Interactive Cursor */}
      <ExperienceCursor />

      {/* 7 Cinematic Narrative Scenes */}
      <div className="exp-content-wrapper">
        <ScenePortal />
        <SceneInfiniteUniverse />
        <SceneKineticTypography />
        <SceneVisualGallery />
        <SceneInteractive3D />
        <SceneMotionLab />
        <SceneGrandFinale />
      </div>

      {/* Interactive Controls & Audio Dock */}
      <ExperienceControls
        currentScene={currentScene}
        onSelectScene={setCurrentScene}
      />
    </main>
  );
}

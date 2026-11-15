'use client';

import React from 'react';
import ExperienceAudio from './ExperienceAudio';

interface ExperienceControlsProps {
  currentScene: number;
  onSelectScene: (index: number) => void;
}

export default function ExperienceControls({ currentScene, onSelectScene }: ExperienceControlsProps) {
  const sceneIds = [
    'scene-portal',
    'scene-universe',
    'scene-typography',
    'scene-gallery',
    'scene-3d',
    'scene-motion-lab',
    'scene-finale',
  ];

  const handleJump = (index: number) => {
    onSelectScene(index);
    const id = sceneIds[index - 1];
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="exp-controls-dock" aria-label="Experience scene navigation">
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleJump(num)}
            className={`exp-control-btn ${currentScene === num ? 'active' : ''}`}
            aria-label={`Jump to Scene 0${num}`}
          >
            0{num}
          </button>
        ))}
      </div>

      <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.2)' }} />

      <ExperienceAudio />
    </nav>
  );
}

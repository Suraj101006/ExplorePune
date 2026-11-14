'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, Wand2, Disc } from 'lucide-react';

export default function SceneMotionLab() {
  const [activeEffect, setActiveEffect] = useState<string>('quantum');
  const [clickCount, setClickCount] = useState<number>(0);

  const labNodes = [
    {
      id: 'quantum',
      title: 'Quantum Gravitational Lensing',
      desc: 'Simulate high-density curvature warping surrounding particle trajectories.',
      icon: <Sparkles size={24} color="#d4af37" />,
    },
    {
      id: 'chroma',
      title: 'Chromatic Wave Dispersion',
      desc: 'Decompose incoming optical rays into high-frequency RGB spectrum shifts.',
      icon: <Wand2 size={24} color="#f59e0b" />,
    },
    {
      id: 'magnetic',
      title: 'Magnetic Dipole Convergence',
      desc: 'Attract surrounding kinetic typography towards the cursor epicenter.',
      icon: <Compass size={24} color="#38bdf8" />,
    },
    {
      id: 'kinetic',
      title: 'Zero-Gravity Gyroscopic Spin',
      desc: 'Inject kinetic momentum into 3D polyhedra via cursor velocity drag.',
      icon: <Disc size={24} color="#10b981" />,
    },
  ];

  return (
    <section id="scene-motion-lab" className="exp-scene" aria-label="Scene 06: Interactive Motion Lab">
      <div className="exp-portal-tag">
        <Compass size={12} />
        <span>Dimension 06 • Motion Playground</span>
      </div>

      <h2
        style={{
          fontSize: 'clamp(2.4rem, 6vw, 5rem)',
          fontWeight: 850,
          textTransform: 'uppercase',
          letterSpacing: '-0.03em',
          textAlign: 'center',
          margin: '0 0 16px',
        }}
      >
        Interactive Motion Lab
      </h2>

      <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '650px', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.6 }}>
        Interact with real-time physics nodes. Click any module to trigger immediate harmonic ripple waveforms across the experience canvas.
      </p>

      <div style={{ fontSize: '12px', color: '#d4af37', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        Active Waveform Trigger Count: {clickCount}
      </div>

      <div className="exp-lab-grid">
        {labNodes.map((node) => {
          const isActive = activeEffect === node.id;
          return (
            <div
              key={node.id}
              className="exp-lab-node"
              onClick={() => {
                setActiveEffect(node.id);
                setClickCount((c) => c + 1);
              }}
              style={{
                borderColor: isActive ? '#d4af37' : 'rgba(255, 255, 255, 0.08)',
                background: isActive ? 'rgba(212, 175, 55, 0.12)' : 'rgba(15, 23, 42, 0.45)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {node.icon}
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: isActive ? '#d4af37' : '#94a3b8',
                  }}
                >
                  {isActive ? 'Engaged' : 'Ready'}
                </span>
              </div>

              <strong style={{ fontSize: '16px', color: '#f8fafc', lineHeight: 1.3 }}>
                {node.title}
              </strong>

              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                {node.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

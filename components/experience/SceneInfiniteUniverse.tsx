'use client';

import React from 'react';
import { Compass, Orbit, Activity } from 'lucide-react';

export default function SceneInfiniteUniverse() {
  return (
    <section id="scene-universe" className="exp-scene" aria-label="Scene 02: Infinite Motion Universe">
      <div className="exp-portal-tag">
        <Orbit size={12} />
        <span>Dimension 02 • Particle Dynamics</span>
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
        Infinite Motion Universe
      </h2>

      <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '650px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
        Thousands of luminous particles floating through volumetric space, reacting fluidly to your cursor position and gyroscopic motion.
      </p>

      <div className="exp-universe-grid">
        <div className="exp-universe-card">
          <div style={{ color: '#d4af37', marginBottom: 12 }}>
            <Orbit size={28} />
          </div>
          <strong style={{ fontSize: '16px', display: 'block', color: '#f8fafc', marginBottom: 6 }}>
            Particulate Swarm
          </strong>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            2,500 active vertices synthesized in real-time with ACES Filmic tone mapping and dynamic depth fog.
          </p>
        </div>

        <div className="exp-universe-card">
          <div style={{ color: '#f59e0b', marginBottom: 12 }}>
            <Compass size={28} />
          </div>
          <strong style={{ fontSize: '16px', display: 'block', color: '#f8fafc', marginBottom: 6 }}>
            Spatial Parallax
          </strong>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            Three depth tiers modulating velocity curves according to cursor acceleration vectors.
          </p>
        </div>

        <div className="exp-universe-card">
          <div style={{ color: '#38bdf8', marginBottom: 12 }}>
            <Activity size={28} />
          </div>
          <strong style={{ fontSize: '16px', display: 'block', color: '#f8fafc', marginBottom: 6 }}>
            60 FPS Budget
          </strong>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            Hardware-accelerated WebGL pipeline engineered with zero memory leaks and adaptive mobile LOD.
          </p>
        </div>
      </div>
    </section>
  );
}

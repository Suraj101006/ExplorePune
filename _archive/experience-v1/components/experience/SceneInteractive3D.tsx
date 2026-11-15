'use client';

import React from 'react';
import { Box, Layers, RotateCw } from 'lucide-react';

export default function SceneInteractive3D() {
  return (
    <section id="scene-3d" className="exp-scene" aria-label="Scene 05: Interactive 3D Universe">
      <div className="exp-portal-tag">
        <Box size={12} />
        <span>Dimension 05 • 3D Polyhedral Sculpture</span>
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
        Interactive 3D Universe
      </h2>

      <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '650px', textAlign: 'center', margin: '0 0 36px', lineHeight: 1.6 }}>
        Real-time Three.js metallic icosahedron and orbital torus knot rotating within a dual-point-light illumination field. Move your cursor to orbit the geometry in real-time.
      </p>

      {/* Floating 3D Interaction Control HUD */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '750px',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ color: '#d4af37' }}>
            <RotateCw size={26} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '14px', color: '#f8fafc' }}>
              6-Axis Orbital Euler Rotation
            </strong>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Continuous delta rotation driven by WebGL requestAnimationFrame clock
            </span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ color: '#38bdf8' }}>
            <Layers size={26} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '14px', color: '#f8fafc' }}>
              PBR Metallic Materials
            </strong>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              MeshStandardMaterial with 0.85 metalness and amber/cyan illumination
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

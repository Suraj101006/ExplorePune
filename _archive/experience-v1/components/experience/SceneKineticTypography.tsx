'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export default function SceneKineticTypography() {
  return (
    <section id="scene-typography" className="exp-scene" aria-label="Scene 03: Kinetic Typography">
      <div className="exp-portal-tag">
        <Zap size={12} />
        <span>Dimension 03 • Kinetic Typography</span>
      </div>

      <div className="exp-kinetic-container">
        <div className="exp-kinetic-row">
          <span className="exp-kinetic-highlight">Feel</span>
          <span className="exp-kinetic-outline">The Motion</span>
          <span style={{ fontSize: '1.2rem', color: '#94a3b8', letterSpacing: '0.2em' }}>[01]</span>
        </div>

        <div className="exp-kinetic-row" style={{ justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '1.2rem', color: '#94a3b8', letterSpacing: '0.2em' }}>[02]</span>
          <span className="exp-kinetic-outline">Beyond</span>
          <span className="exp-kinetic-highlight">Limits</span>
        </div>

        <div className="exp-kinetic-row">
          <span className="exp-kinetic-highlight">Imagine</span>
          <span className="exp-kinetic-outline">More</span>
          <span style={{ fontSize: '1.2rem', color: '#94a3b8', letterSpacing: '0.2em' }}>[03]</span>
        </div>

        <div className="exp-kinetic-row" style={{ justifyContent: 'center' }}>
          <span className="exp-kinetic-outline">Enter</span>
          <span className="exp-kinetic-highlight">The Unknown</span>
        </div>
      </div>
    </section>
  );
}

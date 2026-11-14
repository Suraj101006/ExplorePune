'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ScenePortal() {
  return (
    <section id="scene-portal" className="exp-scene" aria-label="Scene 01: The Portal">
      <div className="exp-portal-glow" aria-hidden="true" />

      <div className="exp-portal-tag">
        <Sparkles size={12} />
        <span>Dimension 01 • The Opening</span>
      </div>

      <h1 className="exp-hero-title">
        Beyond
        <br />
        The Ordinary
      </h1>

      <p className="exp-hero-sub">
        Enter a different dimension of Pune — an immersive visual convergence of heritage, light, and infinite motion.
      </p>

      <div className="exp-scroll-pill" aria-hidden="true">
        <div className="exp-scroll-mouse">
          <div className="exp-scroll-dot" />
        </div>
        <span>Scroll into the cosmos</span>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

export default function SceneGrandFinale() {
  return (
    <section id="scene-finale" className="exp-scene" aria-label="Scene 07: The Grand Finale">
      <div className="exp-portal-glow" style={{ width: '600px', height: '600px' }} aria-hidden="true" />

      <div className="exp-portal-tag">
        <Sparkles size={12} />
        <span>Dimension 07 • The Infinite Horizon</span>
      </div>

      <h2 className="exp-finale-title">
        The Experience
        <br />
        Never Ends
      </h2>

      <p style={{ color: '#cbd5e1', fontSize: 'clamp(1rem, 2vw, 1.3rem)', maxWidth: '680px', textAlign: 'center', margin: '0 0 40px', lineHeight: 1.6 }}>
        Pune is an infinite living tapestry of ancient stone, monsoon waterfalls, and timeless Sahyadri sky. Journey from the digital cosmos into the physical world.
      </p>

      {/* Action Navigation Buttons */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', zIndex: 10 }}>
        <Link
          href="/destinations"
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
            color: '#040406',
            fontWeight: 850,
            fontSize: '14px',
            padding: '14px 28px',
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            boxShadow: '0 10px 25px rgba(212, 175, 55, 0.4)',
            transition: 'all 0.25s ease',
          }}
        >
          <span>Explore 106 Master Landmarks</span>
          <ArrowRight size={16} />
        </Link>

        <Link
          href="/journey"
          className="btn outline"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(212, 175, 55, 0.4)',
            color: '#f8fafc',
            fontWeight: 700,
            fontSize: '14px',
            padding: '14px 28px',
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Compass size={16} color="#d4af37" />
          <span>My Journey Reel Studio</span>
        </Link>
      </div>

      {/* Signature Brand Footnote */}
      <div
        style={{
          marginTop: 80,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: '#64748b',
          fontSize: '12px',
        }}
      >
        <span style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8' }}>
          Explore Pune • Creative Digital Lab
        </span>
        <span>Curated with Three.js WebGL, Kinetic Typography &amp; Atmospheric Sound</span>
      </div>
    </section>
  );
}

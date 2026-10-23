'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { DayJourney } from '@/lib/journeyStorage';
import { Play, Sparkles, MapPin, Compass, Navigation } from 'lucide-react';

interface TodayHeroAnimationProps {
  journey: DayJourney | null;
  isMr?: boolean;
  onPlayReel?: () => void;
  onShare?: () => void;
}

export default function TodayHeroAnimation({
  journey,
  isMr = false,
  onPlayReel,
  onShare,
}: TodayHeroAnimationProps) {
  const [animStep, setAnimStep] = useState<number>(1);
  const [hasPlayed, setHasPlayed] = useState<boolean>(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnimStep(5);
      setHasPlayed(true);
      return;
    }

    // Step sequence under 1.8 seconds:
    // Step 1: Map bg appears (0ms)
    // Step 2: Marker 1 appears (400ms)
    // Step 3: Route line draws (850ms)
    // Step 4: Next place appears (1300ms)
    // Step 5: Complete (1750ms)
    setAnimStep(1);
    const t2 = setTimeout(() => setAnimStep(2), 400);
    const t3 = setTimeout(() => setAnimStep(3), 850);
    const t4 = setTimeout(() => setAnimStep(4), 1300);
    const t5 = setTimeout(() => {
      setAnimStep(5);
      setHasPlayed(true);
    }, 1750);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [journey?.id]);

  if (!journey) return null;

  const places = journey.places || [];
  const firstStop = places[0];
  const secondStop = places[1] || places[0];
  const totalKm = journey.totalDistanceKm || 12.4;

  const handleReplay = () => {
    setAnimStep(1);
    setTimeout(() => setAnimStep(2), 400);
    setTimeout(() => setAnimStep(3), 850);
    setTimeout(() => setAnimStep(4), 1300);
    setTimeout(() => setAnimStep(5), 1750);
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #064e3b 0%, #022c22 60%, #01140e 100%)',
        color: '#ffffff',
        padding: '28px 24px',
        marginBottom: 32,
        boxShadow: '0 12px 32px -4px rgba(6, 95, 70, 0.25)',
      }}
    >
      {/* Step 1: Subtle Pune Map / Topo Grid Background */}
      <div
        className={animStep >= 1 ? 'today-hero-map-bg' : ''}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.16,
          backgroundImage:
            'radial-gradient(#34d399 1.5px, transparent 1.5px), radial-gradient(#34d399 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative Compass watermark */}
      <div
        style={{
          position: 'absolute',
          right: -20,
          bottom: -20,
          opacity: 0.08,
          pointerEvents: 'none',
          fontSize: 220,
          lineHeight: 1,
        }}
      >
        🧭
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Top Meta Line */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(52, 211, 153, 0.2)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#6ee7b7',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '4px 12px',
                borderRadius: 20,
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={13} />
              {isMr ? 'आजचा जिवंत प्रवास' : "TODAY'S LIVE STORY"}
            </span>
            <span style={{ fontSize: 13, color: '#a7f3d0' }}>
              {journey.dateLabelEn}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={handleReplay}
              title="Replay cinematic intro"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                color: '#e2e8f0',
                padding: '6px 12px',
                borderRadius: 14,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              ↺ {isMr ? 'पुन्हा पहा' : 'Replay Intro'}
            </button>
            {onPlayReel && (
              <button
                type="button"
                onClick={onPlayReel}
                style={{
                  background: '#10b981',
                  border: 'none',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: 14,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Play size={13} fill="#ffffff" />
                {isMr ? 'रील्स सुरू करा' : 'Play Story Reel'}
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
          {isMr ? (journey.titleMr || journey.title) : journey.title}
        </h2>
        <p style={{ fontSize: 14.5, color: '#a7f3d0', margin: '0 0 20px', maxWidth: 640 }}>
          {isMr
            ? '“आज तुम्ही पुण्यात काय अनुभवले? प्रत्येक पाऊल तुमच्या प्रवासाच्या कथेत कोरले जात आहे.”'
            : '“This is the story of your day in Pune — tracing each step from morning mist to sunset ramparts.”'}
        </p>

        {/* Interactive Cinematic Map Sequence (Steps 2, 3, 4) */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 18,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          {/* Step 2: First location marker */}
          <div
            className={animStep >= 2 ? 'today-hero-marker' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: animStep >= 2 ? 1 : 0.2,
              transition: 'opacity 300ms ease',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 16,
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.6)',
                flexShrink: 0,
              }}
            >
              1
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>
                {firstStop?.arrivalTime || '10:00 AM'}
              </span>
              <strong style={{ display: 'block', fontSize: 16, color: '#ffffff' }}>
                {firstStop?.placeName || 'Shaniwar Wada'}
              </strong>
            </div>
          </div>

          {/* Step 3: Animated SVG Route line */}
          <div style={{ flex: '1 1 120px', minWidth: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100%" height="28" viewBox="0 0 160 28" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <path
                d="M 10 14 Q 80 4 150 14"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
                strokeDasharray="4 4"
              />
              <path
                d="M 10 14 Q 80 4 150 14"
                fill="none"
                stroke="#34d399"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="200"
                className={animStep >= 3 ? 'today-hero-route-line' : ''}
                style={{ opacity: animStep >= 3 ? 1 : 0 }}
              />
            </svg>
          </div>

          {/* Step 4: Next Place marker */}
          <div
            className={animStep >= 4 ? 'today-hero-card' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: animStep >= 4 ? 1 : 0.2,
              transition: 'opacity 300ms ease',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#06b6d4',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 16,
                boxShadow: '0 0 16px rgba(6, 182, 212, 0.6)',
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#67e8f9', textTransform: 'uppercase', fontWeight: 700 }}>
                {secondStop?.arrivalTime || '11:30 AM'}
              </span>
              <strong style={{ display: 'block', fontSize: 16, color: '#ffffff' }}>
                {secondStop?.placeName || 'Lal Mahal'}
              </strong>
            </div>
          </div>

          {/* Quick Distance Pill */}
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: 13,
              fontWeight: 700,
              color: '#34d399',
            }}
          >
            {totalKm} km
          </div>
        </div>
      </div>
    </div>
  );
}

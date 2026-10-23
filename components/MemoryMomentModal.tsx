'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { DayJourney } from '@/lib/journeyStorage';
import { X, Play, MapPin, Compass, ArrowRight, Share2 } from 'lucide-react';

interface MemoryMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: DayJourney | null;
  isMr?: boolean;
  onPlayReel?: () => void;
  onShare?: () => void;
}

export default function MemoryMomentModal({
  isOpen,
  onClose,
  journey,
  isMr = false,
  onPlayReel,
  onShare,
}: MemoryMomentModalProps) {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || !journey) {
      setStage(0);
      return;
    }

    // Sequence stages:
    // 0: Initial date header (0ms)
    // 1: Place image slowly appears (300ms)
    // 2: Place title & quote appear (700ms)
    // 3: Route line draws (1100ms)
    // 4: "You explored X places that day" summary (1500ms)
    setStage(0);
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 700);
    const t3 = setTimeout(() => setStage(3), 1100);
    const t4 = setTimeout(() => setStage(4), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, journey]);

  if (!isOpen || !journey) return null;

  const places = journey.places || [];
  const visitedStops = places.filter((p) => p.isVisited);
  const heroPlace = visitedStops[0] || places[0];
  const placeCount = visitedStops.length > 0 ? visitedStops.length : places.length;
  const totalKm = journey.totalDistanceKm || 12.4;

  return (
    <div className="journey-reel-backdrop" role="dialog" aria-modal="true" aria-label="Travel Memory Moment">
      <div
        className="memory-reveal-animate"
        style={{
          position: 'relative',
          width: 'min(92vw, 520px)',
          borderRadius: 24,
          background: 'linear-gradient(165deg, #0f172a 0%, #064e3b 100%)',
          color: '#ffffff',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          padding: '36px 28px 28px',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#ffffff',
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 30,
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Stage 0: Date Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: '#34d399',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: 4,
            }}
          >
            {isMr ? 'पुणे प्रवास आठवण' : 'A PUNE TRAVEL MEMORY'}
          </span>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#ffffff' }}>
            {journey.dateLabelEn}
          </h2>
        </div>

        {/* Stage 1 & 2: Place Image & Title */}
        <div
          style={{
            position: 'relative',
            borderRadius: 18,
            overflow: 'hidden',
            aspectRatio: '16/10',
            marginBottom: 20,
            background: '#022c22',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            transition: 'opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)',
            opacity: stage >= 1 ? 1 : 0,
          }}
        >
          <img
            src={heroPlace?.image_url || '/images/places/shaniwar-wada.jpg'}
            alt={heroPlace?.placeName || 'Pune Spot'}
            className={stage >= 1 ? 'ken-burns-slow' : ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 60%, rgba(15, 23, 42, 0.6) 100%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              transition: 'all 500ms cubic-bezier(0.22, 1, 0.36, 1)',
              opacity: stage >= 2 ? 1 : 0,
              transform: stage >= 2 ? 'translateY(0)' : 'translateY(10px)',
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6ee7b7',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 2,
              }}
            >
              📍 {heroPlace?.categoryName || 'Heritage Landmark'}
            </span>
            <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#ffffff' }}>
              {isMr ? (heroPlace?.placeNameMr || heroPlace?.placeName) : heroPlace?.placeName}
            </h3>
            <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, fontStyle: 'italic', opacity: 0.9 }}>
              {isMr ? (journey.themeMr || journey.theme) : journey.theme}
            </p>
          </div>
        </div>

        {/* Stage 3: Animated Route Stem */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 20,
            transition: 'opacity 500ms ease',
            opacity: stage >= 3 ? 1 : 0,
          }}
        >
          <div style={{ height: 2, flex: 1, background: 'linear-gradient(90deg, transparent, #10b981)' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              fontSize: 12.5,
              fontWeight: 700,
              color: '#6ee7b7',
            }}
          >
            <span>🧭</span> {totalKm} km {isMr ? 'सफर' : 'journey'}
          </div>
          <div style={{ height: 2, flex: 1, background: 'linear-gradient(90deg, #10b981, transparent)' }} />
        </div>

        {/* Stage 4: "You explored X places that day" */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 24,
            transition: 'all 500ms cubic-bezier(0.22, 1, 0.36, 1)',
            opacity: stage >= 4 ? 1 : 0,
            transform: stage >= 4 ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <h4 style={{ fontSize: 18, fontWeight: 800, color: '#34d399', margin: '0 0 6px' }}>
            {isMr
              ? `त्या दिवशी तुम्ही पुण्यात ${placeCount} ठिकाणे अनुभवली.`
              : `You explored ${placeCount} places that day.`}
          </h4>
          <p style={{ fontSize: 13.5, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            {isMr
              ? 'हे ऐतिहासिक क्षण तुमच्या डिजिटल प्रवासाच्या पानावर कायमचे कोरले गेले आहेत.'
              : 'Cherished memories preserved forever in your Explore Pune travel journal.'}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: 10 }}>
          {onPlayReel && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onPlayReel();
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 14,
                background: '#10b981',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Play size={16} /> {isMr ? 'रील्स पहा' : 'Watch Story Reel'}
            </button>
          )}

          {onShare && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onShare();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Share2 size={16} /> {isMr ? 'शेअर' : 'Share'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

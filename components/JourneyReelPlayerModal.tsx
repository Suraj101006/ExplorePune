'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef } from 'react';
import { DayJourney } from '@/lib/journeyStorage';
import { X, Play, Pause, ChevronLeft, ChevronRight, Share2, Sparkles, Trophy, MapPin } from 'lucide-react';

interface JourneyReelPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: DayJourney | null;
  isMr?: boolean;
  milestoneTitle?: string;
  onShare?: () => void;
}

export default function JourneyReelPlayerModal({
  isOpen,
  onClose,
  journey,
  isMr = false,
  milestoneTitle,
  onShare,
}: JourneyReelPlayerModalProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const places = journey?.places || [];
  const firstPlace = places[0];
  const secondPlace = places[1] || places[0];
  const totalDistance = journey?.totalDistanceKm || 12.4;
  const totalPlaces = places.length;

  const totalScenes = 6;
  const SCENE_DURATION_MS = 2800; // ~16.8 seconds total

  // Scene transition timer
  useEffect(() => {
    if (!isOpen || !journey) {
      setCurrentScene(0);
      setSceneProgress(0);
      return;
    }

    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalStep = 50;
    const increment = (intervalStep / SCENE_DURATION_MS) * 100;

    timerRef.current = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev + increment >= 100) {
          setCurrentScene((s) => {
            if (s + 1 >= totalScenes) {
              setIsPaused(true);
              return s;
            }
            return s + 1;
          });
          return 0;
        }
        return prev + increment;
      });
    }, intervalStep);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, journey, isPaused, totalScenes, SCENE_DURATION_MS]);

  // Keyboard navigation (Space = pause/play, Escape = close, ArrowLeft/Right = prev/next)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
      if (e.key === 'ArrowRight') {
        goToNextScene();
      }
      if (e.key === 'ArrowLeft') {
        goToPrevScene();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const goToNextScene = () => {
    setSceneProgress(0);
    setCurrentScene((s) => Math.min(totalScenes - 1, s + 1));
  };

  const goToPrevScene = () => {
    setSceneProgress(0);
    setCurrentScene((s) => Math.max(0, s - 1));
  };

  if (!isOpen || !journey) return null;

  return (
    <div className="journey-reel-backdrop" role="dialog" aria-modal="true" aria-label="Journey Reel">
      <div className="journey-reel-player">
        {/* Top Story Progress Bars */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            right: 14,
            display: 'flex',
            gap: 6,
            zIndex: 30,
          }}
        >
          {Array.from({ length: totalScenes }).map((_, i) => (
            <div key={i} className="reel-progress-segment">
              <div
                className="reel-progress-fill"
                style={{
                  width:
                    i < currentScene
                      ? '100%'
                      : i === currentScene
                      ? `${sceneProgress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Bar Header & Controls */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 30,
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.08em',
                background: 'rgba(255,255,255,0.2)',
                padding: '3px 8px',
                borderRadius: 12,
                backdropFilter: 'blur(8px)',
                textTransform: 'uppercase',
              }}
            >
              {isMr ? 'पुणे प्रवास रील्स' : 'Pune Journey Reel'}
            </span>
            <span style={{ fontSize: 12, opacity: 0.85, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
              {journey.dateLabelEn}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: 'none',
                color: '#ffffff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: 'none',
                color: '#ffffff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tap areas for Prev / Next */}
        <div
          onClick={goToPrevScene}
          style={{
            position: 'absolute',
            top: 70,
            bottom: 80,
            left: 0,
            width: '30%',
            zIndex: 20,
            cursor: 'pointer',
          }}
          aria-label="Previous scene"
        />
        <div
          onClick={goToNextScene}
          style={{
            position: 'absolute',
            top: 70,
            bottom: 80,
            right: 0,
            width: '70%',
            zIndex: 20,
            cursor: 'pointer',
          }}
          aria-label="Next scene"
        />

        {/* 🎬 SCENE 1: OPENING TITLE & SUBTLE MAP */}
        {currentScene === 0 && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: 32,
              background: 'radial-gradient(circle at center, #064e3b 0%, #022c22 70%, #01140e 100%)',
              color: '#ffffff',
            }}
          >
            {/* Subtle Pune topographic grid animation */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.18,
                backgroundImage:
                  'radial-gradient(#34d399 1px, transparent 1px), radial-gradient(#34d399 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            <div style={{ position: 'relative', zIndex: 10 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1.5px solid rgba(52, 211, 153, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                }}
              >
                🧭
              </div>
              <span
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  color: '#6ee7b7',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {isMr ? 'तुमची पुणे सफर' : 'YOUR PUNE JOURNEY'}
              </span>
              <h2
                style={{
                  fontSize: 'clamp(28px, 6vw, 36px)',
                  fontWeight: 800,
                  margin: '0 0 12px',
                  color: '#ffffff',
                  lineHeight: 1.2,
                }}
              >
                {isMr ? (journey.titleMr || journey.title) : journey.title}
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: '#a7f3d0',
                  margin: '0 auto 24px',
                  maxWidth: 320,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                {isMr
                  ? '“तुमचा पुणे प्रवास, आठवणींत चिरंतन.”'
                  : '“Your Pune journey, beautifully remembered.”'}
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <span>📅</span> {journey.dateLabelEn}
              </div>
            </div>
          </div>
        )}

        {/* 🎬 SCENE 2: FIRST DISCOVERY (KEN BURNS ZOOM) */}
        {currentScene === 1 && (
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <img
              src={firstPlace?.image_url || '/images/places/sinhagad-fort.jpg'}
              alt={firstPlace?.placeName || 'Pune Spot'}
              className="ken-burns-slow"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Cinematic gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 50%, rgba(15, 23, 42, 0.6) 100%)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: 40,
                left: 24,
                right: 24,
                color: '#ffffff',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  {isMr ? 'पहिले ठिकाण' : 'First Discovery'}
                </span>
                <span style={{ fontSize: 13, color: '#e2e8f0' }}>
                  ⏰ {firstPlace?.arrivalTime || '10:02 AM'}
                </span>
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: '#ffffff' }}>
                {isMr ? (firstPlace?.placeNameMr || firstPlace?.placeName) : firstPlace?.placeName}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: '#cbd5e1',
                  margin: 0,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                {isMr
                  ? '“सह्याद्रीच्या कड्यांवर धुक्याची चादर आणि असीम पराक्रमाची साक्ष.”'
                  : '“A morning above Pune, where history whispers in the mountain winds.”'}
              </p>
            </div>
          </div>
        )}

        {/* 🎬 SCENE 3: JOURNEY MOVEMENT & ROUTE LINE */}
        {currentScene === 2 && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 32,
              background: '#0a0f1d',
              color: '#ffffff',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#34d399',
                  textTransform: 'uppercase',
                }}
              >
                {isMr ? 'पुणे मार्ग प्रगती' : 'TRAVEL TRANSIT'}
              </span>
              <h3 style={{ fontSize: 24, fontWeight: 700, margin: '6px 0 0' }}>
                {isMr ? 'मार्गावरील प्रवास' : 'Traversing Pune'}
              </h3>
            </div>

            {/* Animated SVG Path connecting points */}
            <svg width="240" height="180" viewBox="0 0 240 180" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="reelLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Background faint path */}
              <path
                d="M 40 40 Q 120 20 200 140"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="4"
                strokeDasharray="6 6"
              />

              {/* Animated Drawing Path */}
              <path
                d="M 40 40 Q 120 20 200 140"
                fill="none"
                stroke="url(#reelLineGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="300"
                className="today-hero-route-line"
              />

              {/* Origin Marker */}
              <circle cx="40" cy="40" r="10" fill="#10b981" />
              <circle cx="40" cy="40" r="4" fill="#ffffff" />
              <text x="40" y="20" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">
                1
              </text>

              {/* Destination Marker */}
              <circle cx="200" cy="140" r="10" fill="#06b6d4" />
              <circle cx="200" cy="140" r="4" fill="#ffffff" />
              <text x="200" y="165" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">
                2
              </text>
            </svg>

            {/* Distance Callout */}
            <div
              style={{
                marginTop: 28,
                padding: '12px 24px',
                borderRadius: 16,
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1.5px solid rgba(52, 211, 153, 0.3)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: '#34d399', letterSpacing: '-0.02em' }}>
                {totalDistance} km
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>
                {isMr ? 'एकूण कापलेले अंतर' : 'Total Exploration Distance'}
              </div>
            </div>
          </div>
        )}

        {/* 🎬 SCENE 4: NEXT DISCOVERY (CROSSFADE) */}
        {currentScene === 3 && (
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <img
              src={secondPlace?.image_url || '/images/places/aga-khan-palace.jpg'}
              alt={secondPlace?.placeName || 'Heritage Explorer'}
              className="ken-burns-slow"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 50%, rgba(15, 23, 42, 0.6) 100%)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: 40,
                left: 24,
                right: 24,
                color: '#ffffff',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    background: '#06b6d4',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  {isMr ? 'पुढील अनुभव' : 'Next Discovery'}
                </span>
                <span style={{ fontSize: 13, color: '#e2e8f0' }}>
                  🏛️ {secondPlace?.categoryName || 'Heritage Landmark'}
                </span>
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: '#ffffff' }}>
                {isMr ? (secondPlace?.placeNameMr || secondPlace?.placeName) : secondPlace?.placeName}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: '#cbd5e1',
                  margin: 0,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                {isMr
                  ? '“पुण्याच्या समृद्ध संस्कृती व वारशातील एक सुंदर आणि अविस्मरणीय अनुभव.”'
                  : '“Where historic stone courtyards echo with memories of the Peshwa capital.”'}
              </p>
            </div>
          </div>
        )}

        {/* 🎬 SCENE 5: ACHIEVEMENT / MILESTONE UNLOCKED */}
        {currentScene === 4 && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: 32,
              background: 'radial-gradient(circle at center, #78350f 0%, #451a03 60%, #1f0c02 100%)',
              color: '#ffffff',
            }}
          >
            <div
              className="special-badge-pulse"
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 44,
                marginBottom: 20,
              }}
            >
              🏆
            </div>

            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: '#fde68a',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              {isMr ? 'यशोगाथा संपादन' : 'MILESTONE COMPLETED'}
            </span>
            <h3 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
              {milestoneTitle || (isMr ? 'सह्याद्री दुर्गवीर' : 'Sahyadri Fort Hunter')}
            </h3>
            <p
              style={{
                fontSize: 15,
                color: '#fef3c7',
                margin: '0 auto 20px',
                maxWidth: 280,
                lineHeight: 1.5,
              }}
            >
              {isMr
                ? 'पुण्याभोवतीचे ऐतिहासिक गड आणि वास्तू सर करून तुम्ही नवीन टप्पा गाठला.'
                : 'Recognized for authentic exploration across Pune’s historical bastions.'}
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 20,
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                fontSize: 13,
                fontWeight: 700,
                color: '#fde68a',
              }}
            >
              <Sparkles size={16} /> {isMr ? 'अभिमान वाटावा असा प्रवास!' : 'Achievement Recorded'}
            </div>
          </div>
        )}

        {/* 🎬 SCENE 6: ENDING RECAP & EXPLORE PUNE BRANDING */}
        {currentScene === 5 && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '80px 28px 40px',
              background: 'linear-gradient(180deg, #0f172a 0%, #064e3b 100%)',
              color: '#ffffff',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  color: '#6ee7b7',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {isMr ? 'सहल सारांश' : "TODAY'S JOURNEY SUMMARY"}
              </span>
              <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 18px', color: '#ffffff' }}>
                {isMr ? 'पुणे नेहमीच अद्भुत.' : 'Keep exploring Pune.'}
              </h2>

              {/* 3 Pillars Summary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  padding: '16px 12px',
                  borderRadius: 16,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  marginBottom: 24,
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#34d399' }}>{totalPlaces}</div>
                  <div style={{ fontSize: 11.5, color: '#cbd5e1' }}>{isMr ? 'ठिकाणे' : 'Places'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#38bdf8' }}>{totalDistance}</div>
                  <div style={{ fontSize: 11.5, color: '#cbd5e1' }}>km</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#fbbf24' }}>1</div>
                  <div style={{ fontSize: 11.5, color: '#cbd5e1' }}>{isMr ? 'यशोगाथा' : 'Milestone'}</div>
                </div>
              </div>
            </div>

            <div>
              <p
                style={{
                  fontSize: 15,
                  color: '#e2e8f0',
                  margin: '0 0 24px',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}
              >
                {isMr
                  ? '“पुणे हे केवळ ठिकाणांची यादी नाही. हा तुमचा स्वतः निर्माण केलेला प्रवास आहे.”'
                  : '“Pune isn’t just a list of places you’ve visited. It’s a journey you’ve created.”'}
              </p>

              <div style={{ display: 'flex', gap: 10 }}>
                {onShare && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onShare();
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
                    <Share2 size={16} /> {isMr ? 'सफर शेअर करा' : 'Share Journey'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentScene(0);
                    setSceneProgress(0);
                    setIsPaused(false);
                  }}
                  style={{
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
                  ↺ {isMr ? 'पुन्हा पहा' : 'Replay'}
                </button>
              </div>

              {/* Branding Footer */}
              <div
                style={{
                  marginTop: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: '#94a3b8',
                }}
              >
                <span>🏛️</span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>Explore Pune</span>
                <span>• punetrail.web.app</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Dots Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
            zIndex: 30,
          }}
        >
          {Array.from({ length: totalScenes }).map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setCurrentScene(i);
                setSceneProgress(0);
              }}
              style={{
                width: i === currentScene ? 16 : 6,
                height: 6,
                borderRadius: 4,
                background: i === currentScene ? '#10b981' : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

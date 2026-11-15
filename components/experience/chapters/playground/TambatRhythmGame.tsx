'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getPlaygroundGameData } from '@/lib/experience/selectors';
import { playgroundAudio } from './playgroundAudio';
import { markGameCompleted, PLAYGROUND_STAMPS } from './playgroundMilestone';
import {
  Hammer,
  Sparkles,
  RotateCcw,
  FastForward,
  Award,
  Info,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface TambatRhythmGameProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

interface SparkParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface Dimple {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
}

const TOTAL_STRIKES_NEEDED = 10;

export default function TambatRhythmGame({ onComplete, onSkip }: TambatRhythmGameProps) {
  const { isMr, isLiteMode, isAudioEnabled } = useExperience();
  const gameData = getPlaygroundGameData().tambatGame;

  // Sync audio mute state
  useEffect(() => {
    playgroundAudio.setMuted(!isAudioEnabled);
  }, [isAudioEnabled]);

  // Rhythm tracking
  const [successfulHits, setSuccessfulHits] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<'perfect' | 'great' | 'miss' | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [dimples, setDimples] = useState<Dimple[]>([]);
  const [sparks, setSparks] = useState<SparkParticle[]>([]);
  const [isHammerSwinging, setIsHammerSwinging] = useState<boolean>(false);

  // Moving beat tracker state (0 to 100% position on rhythm track)
  const [beatProgress, setBeatProgress] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Beat interval in ms (e.g. 1000ms per cycle)
  const BEAT_CYCLE_MS = 1000;
  // Hit window: Perfect is 45-55% (center 50%), Great is 35-65%
  const HIT_TARGET = 50;

  // Running rhythm cycle
  useEffect(() => {
    if (isCompleted || isLiteMode) return;

    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const elapsed = time - lastTimeRef.current;
      const progress = ((elapsed % BEAT_CYCLE_MS) / BEAT_CYCLE_MS) * 100;
      setBeatProgress(progress);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCompleted, isLiteMode]);

  // Spawn visual spark particles
  const spawnSparks = useCallback((count: number = 8) => {
    if (isLiteMode) return;
    const newSparks: SparkParticle[] = [];
    const colors = ['#f59e0b', '#fb923c', '#ea580c', '#fef08a'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 3.5;
      newSparks.push({
        id: Math.random(),
        x: 50,
        y: 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 3,
      });
    }

    setSparks(newSparks);
    setTimeout(() => setSparks([]), 450);
  }, [isLiteMode]);

  // Strike Hammer Action
  const handleStrike = useCallback(() => {
    if (isCompleted) return;

    setIsHammerSwinging(true);
    setTimeout(() => setIsHammerSwinging(false), 200);

    // Lite mode simply counts hits without timing constraints
    if (isLiteMode) {
      const nextHits = successfulHits + 1;
      setSuccessfulHits(nextHits);
      setLastFeedback('perfect');
      playgroundAudio.playCopperHammer(1.0 + (nextHits / TOTAL_STRIKES_NEEDED) * 0.4);

      // Add a dimple
      setDimples((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          size: 14 + Math.random() * 8,
        },
      ]);

      if (nextHits >= TOTAL_STRIKES_NEEDED) {
        setIsCompleted(true);
        playgroundAudio.playSuccessChime();
        markGameCompleted('tambat');
        if (onComplete) setTimeout(onComplete, 1200);
      }
      return;
    }

    // Interactive rhythm timing evaluation
    const distanceToTarget = Math.abs(beatProgress - HIT_TARGET);

    if (distanceToTarget <= 9) {
      // Perfect hit!
      const nextHits = successfulHits + 1;
      setSuccessfulHits(nextHits);
      setCombo((prev) => prev + 1);
      setLastFeedback('perfect');
      spawnSparks(12);
      playgroundAudio.playCopperHammer(1.0 + (nextHits / TOTAL_STRIKES_NEEDED) * 0.5);

      // Add dimple
      setDimples((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: 18 + Math.random() * 64,
          y: 18 + Math.random() * 64,
          size: 16 + Math.random() * 8,
        },
      ]);

      if (nextHits >= TOTAL_STRIKES_NEEDED) {
        setIsCompleted(true);
        playgroundAudio.playSuccessChime();
        markGameCompleted('tambat');
        if (onComplete) setTimeout(onComplete, 1200);
      }
    } else if (distanceToTarget <= 20) {
      // Great hit!
      const nextHits = successfulHits + 1;
      setSuccessfulHits(nextHits);
      setCombo((prev) => prev + 1);
      setLastFeedback('great');
      spawnSparks(6);
      playgroundAudio.playCopperHammer(0.95);

      setDimples((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: 22 + Math.random() * 56,
          y: 22 + Math.random() * 56,
          size: 14 + Math.random() * 6,
        },
      ]);

      if (nextHits >= TOTAL_STRIKES_NEEDED) {
        setIsCompleted(true);
        playgroundAudio.playSuccessChime();
        markGameCompleted('tambat');
        if (onComplete) setTimeout(onComplete, 1200);
      }
    } else {
      // Missed timing
      setCombo(0);
      setLastFeedback('miss');
      playgroundAudio.playCopperHammer(0.6); // Damped dull thud
    }

    setTimeout(() => setLastFeedback(null), 500);
  }, [
    isCompleted,
    isLiteMode,
    successfulHits,
    beatProgress,
    spawnSparks,
    onComplete,
  ]);

  // Reset Game
  const handleReset = useCallback(() => {
    setSuccessfulHits(0);
    setCombo(0);
    setDimples([]);
    setLastFeedback(null);
    setIsCompleted(false);
  }, []);

  // Skip Game
  const handleSkip = useCallback(() => {
    markGameCompleted('tambat');
    setIsCompleted(true);
    setSuccessfulHits(TOTAL_STRIKES_NEEDED);
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete();
    }
  }, [onSkip, onComplete]);

  // Keyboard accessibility: Space or Enter to strike
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleStrike();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStrike, handleReset]);

  const progressPercent = Math.min(100, Math.round((successfulHits / TOTAL_STRIKES_NEEDED) * 100));
  const completedStamp = PLAYGROUND_STAMPS.tambat;

  return (
    <div
      className="exp-tambat-game"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        padding: '1.5rem',
        borderRadius: '1.25rem',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(8, 11, 17, 0.98))',
        border: '1px solid rgba(217, 119, 6, 0.25)',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6), 0 0 25px rgba(180, 83, 9, 0.12)',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(217, 119, 6, 0.15)',
              border: '1px solid rgba(217, 119, 6, 0.35)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#f59e0b',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            <Hammer size={12} />
            <span>{isMr ? 'खेळ २: तांबट आळी माथारकाम' : 'GAME 2: TAMBAT ALI CRAFT RHYTHM'}</span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: isMr ? 'var(--exp-font-display-mr)' : 'var(--exp-font-display-en)',
              color: '#f8fafc',
            }}
          >
            {isMr ? gameData.titleMr : gameData.titleEn}
          </h3>
          <p
            style={{
              margin: '0.35rem 0 0 0',
              fontSize: '0.875rem',
              color: '#94a3b8',
              maxWidth: '650px',
              lineHeight: 1.5,
            }}
          >
            {isMr ? gameData.techniqueMr : gameData.techniqueEn}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleReset}
            className="exp-btn-subtle"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
              borderRadius: '0.5rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              fontSize: '0.8rem',
              cursor: 'pointer',
              minHeight: '44px',
            }}
            title={isMr ? 'पुन्हा सुरुवात करा (R)' : 'Reset (R)'}
            aria-label={isMr ? 'खेळ रीसेट करा' : 'Reset Tambat rhythm game'}
          >
            <RotateCcw size={14} />
            <span>{isMr ? 'रीसेट' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="exp-btn-skip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
              borderRadius: '0.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '44px',
            }}
            aria-label={isMr ? 'हा खेळ वगळा' : 'Skip this game'}
          >
            <FastForward size={14} />
            <span>{isMr ? 'वगळा (Skip)' : 'Skip Game'}</span>
          </button>
        </div>
      </div>

      {/* Main Game Arena: Copper Pot Viewport & Rhythm Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.75rem',
          alignItems: 'center',
        }}
      >
        {/* Left: The Beaten Copper Pot Simulation */}
        <div
          style={{
            position: 'relative',
            height: '320px',
            borderRadius: '1rem',
            background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.5) 0%, rgba(4, 6, 10, 0.95) 85%)',
            border: '1px solid rgba(217, 119, 6, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Authentic Red Copper Vessel (Handa / Kalash) */}
          <div
            style={{
              position: 'relative',
              width: '210px',
              height: '210px',
              borderRadius: '45% 45% 48% 48%',
              background:
                'radial-gradient(circle at 35% 35%, #f59e0b 0%, #d97706 28%, #b45309 60%, #7c2d12 90%, #451a03 100%)',
              border: '2px solid rgba(245, 158, 11, 0.6)',
              boxShadow: `0 20px 45px rgba(0, 0, 0, 0.8), 0 0 ${20 + progressPercent / 3}px rgba(217, 119, 6, 0.35)`,
              transform: isHammerSwinging ? 'scale(0.97)' : 'scale(1)',
              transition: 'transform 0.15s ease',
              overflow: 'hidden',
            }}
          >
            {/* Narrow Copper Rim at Top */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '20%',
                right: '20%',
                height: '18px',
                borderRadius: '50%',
                background: 'linear-gradient(90deg, #b45309, #fde68a, #78350f)',
                border: '1px solid #f59e0b',
                boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.7)',
              }}
            />

            {/* Hammered Matharkaam Dimple Imprints */}
            {dimples.map((dimple) => (
              <div
                key={dimple.id}
                style={{
                  position: 'absolute',
                  left: `${dimple.x}%`,
                  top: `${dimple.y}%`,
                  width: `${dimple.size}px`,
                  height: `${dimple.size}px`,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 35% 35%, rgba(254, 240, 138, 0.7) 0%, rgba(180, 83, 9, 0.8) 60%, rgba(69, 26, 3, 0.95) 100%)',
                  boxShadow:
                    'inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -1px -1px 3px rgba(0, 0, 0, 0.8)',
                  animation: 'popDimple 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Specular Light Reflection Sweep */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Spark Particles Layer */}
          {sparks.map((spark) => (
            <div
              key={spark.id}
              style={{
                position: 'absolute',
                left: `calc(50% + ${spark.vx * 15}px)`,
                top: `calc(50% + ${spark.vy * 15}px)`,
                width: `${spark.size}px`,
                height: `${spark.size}px`,
                borderRadius: '50%',
                background: spark.color,
                boxShadow: `0 0 10px ${spark.color}`,
                pointerEvents: 'none',
                animation: 'sparkFade 0.4s ease-out forwards',
              }}
            />
          ))}

          {/* Hit Timing Text Feedback */}
          {lastFeedback && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                background:
                  lastFeedback === 'perfect'
                    ? 'rgba(16, 185, 129, 0.9)'
                    : lastFeedback === 'great'
                    ? 'rgba(234, 88, 12, 0.9)'
                    : 'rgba(239, 68, 68, 0.85)',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                animation: 'scaleIn 0.2s ease',
              }}
            >
              {lastFeedback === 'perfect'
                ? isMr
                  ? '🎯 अचूक फटका! (PERFECT)'
                  : '🎯 PERFECT STRIKE!'
                : lastFeedback === 'great'
                ? isMr
                  ? '✨ छान! (GREAT)'
                  : '✨ GREAT HIT!'
                : isMr
                ? '⚠️ ताल चुकला (OFF BEAT)'
                : '⚠️ OFF BEAT'}
            </div>
          )}
        </div>

        {/* Right: Rhythm Tracker & Strike Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Progress & Dimple Count */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '0.85rem',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}
            >
              <span>{isMr ? 'माथारकाम प्रगती (Vessel Shaping):' : 'Hand-Hammering Progress:'}</span>
              <span style={{ color: '#f59e0b', fontFamily: 'var(--exp-font-mono)' }}>
                {successfulHits} / {TOTAL_STRIKES_NEEDED} {isMr ? 'घाव' : 'Strikes'}
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: '10px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {combo > 1 && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#34d399',
                  fontWeight: 700,
                }}
              >
                🔥 {combo} {isMr ? 'सलग अचूक ताल (Combo)' : 'Strike Combo!'}
              </div>
            )}
          </div>

          {/* Interactive Rhythm Track (Scrubber Line with Strike Zone) */}
          {!isLiteMode && !isCompleted && (
            <div
              style={{
                position: 'relative',
                height: '56px',
                borderRadius: '0.75rem',
                background: 'rgba(4, 6, 10, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.5rem',
                overflow: 'hidden',
              }}
            >
              {/* Target Hit Zone in Center (40% to 60%) */}
              <div
                style={{
                  position: 'absolute',
                  left: '40%',
                  width: '20%',
                  height: '100%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  borderLeft: '2px solid rgba(245, 158, 11, 0.8)',
                  borderRight: '2px solid rgba(245, 158, 11, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  color: '#fef08a',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {isMr ? 'ताल केंद्र' : 'HIT ZONE'}
              </div>

              {/* Moving Pulse Marker */}
              <div
                style={{
                  position: 'absolute',
                  left: `${beatProgress}%`,
                  width: '12px',
                  height: '38px',
                  borderRadius: '4px',
                  background: '#f8fafc',
                  boxShadow: '0 0 12px #38bdf8',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )}

          {/* Large Big Strike Button */}
          <button
            type="button"
            onClick={handleStrike}
            disabled={isCompleted}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '1.1rem',
              borderRadius: '0.75rem',
              background: isCompleted
                ? 'rgba(16, 185, 129, 0.2)'
                : 'linear-gradient(135deg, #d97706 0%, #b45309 60%, #78350f 100%)',
              border: isCompleted
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : '2px solid rgba(245, 158, 11, 0.7)',
              color: '#fff',
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              cursor: isCompleted ? 'default' : 'pointer',
              boxShadow: isCompleted
                ? 'none'
                : '0 8px 24px rgba(180, 83, 9, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
              minHeight: '60px',
              transition: 'transform 0.1s ease',
            }}
            aria-label={
              isMr
                ? 'तांब्यावर घण मारा (Spacebar किंवा Enter)'
                : 'Strike Copper Vessel (Spacebar or Enter)'
            }
          >
            <Hammer size={22} />
            <span>
              {isCompleted
                ? isMr
                  ? '✓ माथारकाम पूर्ण झाले'
                  : '✓ Vessel Dimpling Complete'
                : isMr
                ? 'तांब्यावर घण मारा (Strike)'
                : 'Strike Copper (Spacebar / Enter)'}
            </span>
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '1.25rem',
            borderRadius: '0.85rem',
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(217, 119, 6, 0.15))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            animation: 'fadeInUp 0.4s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={22} color="#facc15" />
            <strong style={{ fontSize: '1.05rem', color: '#fef08a' }}>
              {isMr
                ? 'उत्कृष्ट! सुंदर माथारकाम नक्षी कोरली गेली!'
                : 'Flawless dimple pattern hand-hammered!'}
            </strong>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: '#cbd5e1',
              lineHeight: 1.5,
            }}
          >
            <Info size={16} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              {isMr ? (
                <>
                  <strong>कसबा पेठेतील तांबट आळी (४०० वर्षांची परंपरा):</strong> पेशवे काळापासून
                  चालत आलेल्या या माथारकामामुळे तांब्याची भांडी अधिक मजबूत होतात व पाणी अधिक काळ
                  शुद्ध राहते. तुमचा डिजिटल पासपोर्ट शिक्का अनलॉक झाला आहे!
                </>
              ) : (
                <>
                  <strong>Tambat Ali Heritage (Kasba Peth • 400 Years):</strong> The traditional
                  dimpling (Matharkaam) strengthens copper vessels and enhances thermal properties.
                  Your verified artisan digital passport stamp is awarded!
                </>
              )}
            </div>
          </div>

          <div
            style={{
              alignSelf: 'flex-start',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: 'rgba(250, 204, 21, 0.15)',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              fontSize: '0.75rem',
              color: '#fef08a',
              fontWeight: 600,
            }}
          >
            {completedStamp.icon} {isMr ? completedStamp.titleMr : completedStamp.titleEn} •{' '}
            {isMr ? completedStamp.sealTextMr : completedStamp.sealTextEn}
          </div>
        </div>
      )}

      {/* Embedded Keyframes */}
      <style jsx>{`
        @keyframes popDimple {
          0% {
            transform: scale(0.2);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes sparkFade {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.2);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.85);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

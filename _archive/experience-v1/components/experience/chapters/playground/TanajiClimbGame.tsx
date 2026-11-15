'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getPlaygroundGameData } from '@/lib/experience/selectors';
import { playgroundAudio } from './playgroundAudio';
import { markGameCompleted, PLAYGROUND_STAMPS } from './playgroundMilestone';
import {
  Mountain,
  Wind,
  Shield,
  RotateCcw,
  FastForward,
  Award,
  Info,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface TanajiClimbGameProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

interface ScreeStone {
  id: number;
  lane: 'left' | 'center' | 'right';
  y: number; // 0 to 100%
}

export default function TanajiClimbGame({ onComplete, onSkip }: TanajiClimbGameProps) {
  const { isMr, isLiteMode, isAudioEnabled } = useExperience();
  const gameData = getPlaygroundGameData().tanajiGame;

  // Sync audio mute state
  useEffect(() => {
    playgroundAudio.setMuted(!isAudioEnabled);
  }, [isAudioEnabled]);

  // Elevation: 0 to 100 meters
  const [elevation, setElevation] = useState<number>(0);
  const [lane, setLane] = useState<'left' | 'center' | 'right'>('center');
  const [isBraced, setIsBraced] = useState<boolean>(false);
  const [windActive, setWindActive] = useState<boolean>(false);
  const [screeList, setScreeList] = useState<ScreeStone[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [stumbleWarning, setStumbleWarning] = useState<string | null>(null);

  // Active milestone quote based on elevation
  const activeQuote =
    elevation >= 100
      ? isMr
        ? '“गड आला पण सिंह गेला!” — छत्रपती शिवाजी महाराज'
        : '“The fort is won, but the Lion has fallen!” — Chhatrapati Shivaji Maharaj'
      : elevation >= 60
      ? isMr
        ? 'मावळ्यांची दोरीवरून शांत व धाडसी चढाई सुरू...'
        : 'Mawalas scaling the 300-foot sheer vertical precipice in silence...'
      : elevation >= 25
      ? isMr
        ? '“आधी लग्न कोंढाण्याचे, मग माझ्या रायबाचे!”'
        : '“First Kondhana’s victory, then my son Rayaba’s wedding!”'
      : isMr
      ? 'माघ वद्य नवमी, १६७० • रात्रीचा अंधार'
      : 'February 1670 • The sheer western face of Sinhagad';

  // Spawn falling scree and periodic wind gusts
  useEffect(() => {
    if (isCompleted || isLiteMode) return;

    // Periodic wind gust generator
    const windTimer = setInterval(() => {
      if (Math.random() > 0.45) {
        setWindActive(true);
        playgroundAudio.playWindGust();
        setTimeout(() => setWindActive(false), 2400);
      }
    }, 4500);

    // Periodic falling scree generator
    const screeTimer = setInterval(() => {
      const lanes: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
      setScreeList((prev) => [
        ...prev.slice(-3),
        {
          id: Date.now(),
          lane: randomLane,
          y: 0,
        },
      ]);
    }, 2800);

    return () => {
      clearInterval(windTimer);
      clearInterval(screeTimer);
    };
  }, [isCompleted, isLiteMode]);

  // Animate scree falling down the cliff
  useEffect(() => {
    if (isCompleted || isLiteMode || screeList.length === 0) return;

    const interval = setInterval(() => {
      setScreeList((prev) =>
        prev
          .map((s) => ({ ...s, y: s.y + 12 }))
          .filter((s) => s.y <= 100)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [screeList.length, isCompleted, isLiteMode]);

  // Scree collision detection with climber (at y=60-75%)
  useEffect(() => {
    if (isCompleted || isLiteMode) return;

    screeList.forEach((scree) => {
      if (scree.lane === lane && scree.y >= 55 && scree.y <= 75) {
        if (!isBraced) {
          // Stumbled
          setElevation((prev) => Math.max(0, prev - 8));
          setStumbleWarning(isMr ? 'पडणाऱ्या दगडाचा धक्का! सावध व्हा!' : 'Hit by loose scree! -8m');
          playgroundAudio.playCopperHammer(0.7);
          setTimeout(() => setStumbleWarning(null), 1200);
        }
      }
    });
  }, [screeList, lane, isBraced, isCompleted, isLiteMode, isMr]);

  // Pull Rope / Climb Action
  const handlePullRope = useCallback(() => {
    if (isCompleted) return;

    // If wind is active and not braced, climbing is penalized
    if (windActive && !isBraced) {
      setStumbleWarning(isMr ? 'सह्याद्रीच्या जोरदार वाऱ्याने तोल गेला! दोरी घट्ट धरा!' : 'Wind gust blew you back! Hold tight!');
      setElevation((prev) => Math.max(0, prev - 5));
      setTimeout(() => setStumbleWarning(null), 1200);
      return;
    }

    playgroundAudio.playRopeCreak();

    setElevation((prev) => {
      const step = isLiteMode ? 20 : 10;
      const next = Math.min(100, prev + step);

      if (next >= 100 && !isCompleted) {
        setIsCompleted(true);
        playgroundAudio.playTutariFanfare();
        playgroundAudio.playSuccessChime();
        markGameCompleted('tanaji');
        if (onComplete) {
          setTimeout(onComplete, 1600);
        }
      }
      return next;
    });
  }, [isCompleted, windActive, isBraced, isLiteMode, isMr, onComplete]);

  // Move lanes to dodge
  const handleMoveLeft = useCallback(() => {
    setLane((prev) => (prev === 'right' ? 'center' : 'left'));
  }, []);

  const handleMoveRight = useCallback(() => {
    setLane((prev) => (prev === 'left' ? 'center' : 'right'));
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setElevation(0);
    setLane('center');
    setIsBraced(false);
    setIsCompleted(false);
    setScreeList([]);
  }, []);

  // Skip
  const handleSkip = useCallback(() => {
    markGameCompleted('tanaji');
    setIsCompleted(true);
    setElevation(100);
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete();
    }
  }, [onSkip, onComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowUp' || e.code === 'Space') {
        e.preventDefault();
        handlePullRope();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMoveLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleMoveRight();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsBraced(true);
        setTimeout(() => setIsBraced(false), 800);
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePullRope, handleMoveLeft, handleMoveRight, handleReset]);

  const completedStamp = PLAYGROUND_STAMPS.tanaji;

  return (
    <div
      className="exp-tanaji-game"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        padding: '1.5rem',
        borderRadius: '1.25rem',
        background: 'linear-gradient(145deg, rgba(8, 11, 17, 0.98), rgba(4, 6, 10, 0.99))',
        border: '1px solid rgba(234, 88, 12, 0.25)',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.7), 0 0 25px rgba(234, 88, 12, 0.1)',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
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
              background: 'rgba(234, 88, 12, 0.15)',
              border: '1px solid rgba(234, 88, 12, 0.35)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#fb923c',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            <Mountain size={12} />
            <span>{isMr ? 'खेळ ३: नरवीर तानाजी सिंहगड मोहीम' : 'GAME 3: TANAJI’S NIGHT ESCALADE'}</span>
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
            {isMr
              ? 'द्रोणागिरी कड्यावरून रात्रीच्या अंधारात मावळ्यांची चढाई: दोरी ओढा, पडणारे दगड चुकवा आणि वाऱ्यापासून बचाव करा.'
              : 'Scale the vertical basalt Dronagiri precipice of Sinhagad (1670 CE). Pull the climbing rope, dodge scree, and brace against Sahyadri wind.'}
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
            aria-label={isMr ? 'खेळ रीसेट करा' : 'Reset cliff climb'}
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

      {/* Main Game Stage: Cliff Wall Simulation + Control Deck */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.75rem',
          alignItems: 'center',
        }}
      >
        {/* Left: Sheer Basalt Cliff Simulation */}
        <div
          style={{
            position: 'relative',
            height: '350px',
            borderRadius: '1rem',
            background:
              'linear-gradient(180deg, #0f172a 0%, #1c1917 50%, #080b11 100%)',
            border: '2px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Sahyadri Ridge Night Stars */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              height: '60px',
              display: 'flex',
              justifyContent: 'space-between',
              opacity: 0.7,
              pointerEvents: 'none',
            }}
          >
            <span>✨</span>
            <span style={{ fontSize: '0.7rem' }}>⭐</span>
            <span>✨</span>
          </div>

          {/* Saffron Flag at Fort Summit */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              background: 'rgba(234, 88, 12, 0.25)',
              border: '1px solid rgba(234, 88, 12, 0.5)',
              fontSize: '0.72rem',
              color: '#fdba74',
              fontWeight: 700,
            }}
          >
            <span>🚩</span>
            <span>{isMr ? 'कल्याण दरवाजा बुरुज (१०० मी)' : 'Kalyan Bastion (100m)'}</span>
          </div>

          {/* Vertical Ropes across the 3 Lanes */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              bottom: 0,
              width: '80%',
              display: 'flex',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}
          >
            {['left', 'center', 'right'].map((l) => (
              <div
                key={l}
                style={{
                  width: '3px',
                  height: '100%',
                  background:
                    'repeating-linear-gradient(180deg, #d97706, #d97706 8px, #78350f 8px, #78350f 16px)',
                  boxShadow: '0 0 4px rgba(0,0,0,0.8)',
                  opacity: lane === l ? 1 : 0.45,
                }}
              />
            ))}
          </div>

          {/* Falling Scree Rocks */}
          {screeList.map((scree) => {
            const laneLeft =
              scree.lane === 'left' ? '18%' : scree.lane === 'center' ? '50%' : '82%';
            return (
              <div
                key={scree.id}
                style={{
                  position: 'absolute',
                  top: `${scree.y}%`,
                  left: laneLeft,
                  transform: 'translateX(-50%)',
                  fontSize: '1rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
                  pointerEvents: 'none',
                }}
                title={isMr ? 'पडणारा दगड' : 'Falling scree'}
              >
                🪨
              </div>
            );
          })}

          {/* Climber Mawala Representation */}
          <div
            style={{
              position: 'absolute',
              bottom: `${15 + (elevation / 100) * 65}%`,
              left: lane === 'left' ? '18%' : lane === 'center' ? '50%' : '82%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'bottom 0.25s ease, left 0.2s ease',
              zIndex: 3,
            }}
          >
            {/* Saffron Turban / Mawala Marker */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isBraced
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : 'linear-gradient(135deg, #ea580c, #c2410c)',
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
                fontSize: '1rem',
              }}
            >
              {isBraced ? '🛡️' : '🧗'}
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                color: '#fed7aa',
                fontWeight: 700,
                marginTop: '2px',
                textShadow: '0 1px 3px rgba(0,0,0,0.9)',
              }}
            >
              {elevation}m
            </span>
          </div>

          {/* Wind Gust Alert Overlay */}
          {windActive && (
            <div
              style={{
                position: 'absolute',
                top: '70px',
                left: '10px',
                right: '10px',
                padding: '0.45rem',
                borderRadius: '0.5rem',
                background: 'rgba(239, 68, 68, 0.85)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                animation: 'pulse 0.5s infinite alternate',
                zIndex: 4,
              }}
            >
              <Wind size={16} />
              <span>
                {isMr
                  ? '💨 सह्याद्रीचे वादळ! दोरी घट्ट धरा (Hold Down)!'
                  : '💨 Sahyadri Wind Gust! Hold Tight / Brace!'}
              </span>
            </div>
          )}

          {/* Stumble Warning Notice */}
          {stumbleWarning && (
            <div
              style={{
                position: 'absolute',
                top: '110px',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(234, 88, 12, 0.95)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(0,0,0,0.8)',
                zIndex: 5,
              }}
            >
              {stumbleWarning}
            </div>
          )}
        </div>

        {/* Right: Elevation Progress & Control Deck */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Elevation Bar & Historical Quote */}
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
              <span>{isMr ? 'द्रोणागिरी कडा उंची (Elevation):' : 'Elevation Milestone:'}</span>
              <span style={{ color: '#ea580c', fontFamily: 'var(--exp-font-mono)' }}>
                {elevation} / 100 Meters
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
                  width: `${elevation}%`,
                  background: 'linear-gradient(90deg, #ea580c, #f97316, #fde047)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>

            {/* Historical Milestone Quote */}
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.65rem',
                borderRadius: '0.5rem',
                background: 'rgba(234, 88, 12, 0.1)',
                border: '1px solid rgba(234, 88, 12, 0.25)',
                fontSize: '0.8rem',
                fontStyle: 'italic',
                color: '#fed7aa',
                lineHeight: 1.4,
              }}
            >
              📜 {activeQuote}
            </div>
          </div>

          {/* Primary Action Button: Pull Rope / Ascend */}
          <button
            type="button"
            onClick={handlePullRope}
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
                : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              border: isCompleted
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : '2px solid rgba(251, 146, 60, 0.7)',
              color: '#fff',
              fontSize: '1.05rem',
              fontWeight: 800,
              cursor: isCompleted ? 'default' : 'pointer',
              boxShadow: isCompleted ? 'none' : '0 8px 24px rgba(234, 88, 12, 0.45)',
              minHeight: '60px',
            }}
            aria-label={
              isMr
                ? 'दोरी ओढून कडा चढा (Up Arrow किंवा Space)'
                : 'Pull Climbing Rope (Up Arrow or Space)'
            }
          >
            <ArrowUp size={22} />
            <span>
              {isCompleted
                ? isMr
                  ? '✓ सिंहगड सर झाला!'
                  : '✓ Sinhagad Summit Reached!'
                : isMr
                ? 'दोरी ओढा — कडा चढा (Pull Rope)'
                : 'Pull Rope (Up Arrow / Space)'}
            </span>
          </button>

          {/* Dodge & Brace Controls (Touch-First) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr 1fr',
              gap: '0.5rem',
            }}
          >
            <button
              type="button"
              onClick={handleMoveLeft}
              disabled={lane === 'left' || isCompleted}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                padding: '0.65rem 0.5rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: lane === 'left' || isCompleted ? 'default' : 'pointer',
                opacity: lane === 'left' ? 0.4 : 1,
                minHeight: '44px',
              }}
              aria-label={isMr ? 'डाव्या बाजूला जा' : 'Move left'}
            >
              <ArrowLeft size={14} />
              <span>{isMr ? 'डावीकडे' : 'Left'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsBraced(true);
                setTimeout(() => setIsBraced(false), 900);
              }}
              disabled={isCompleted}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                padding: '0.65rem 0.5rem',
                borderRadius: '0.5rem',
                background: isBraced
                  ? 'rgba(59, 130, 246, 0.4)'
                  : 'rgba(255, 255, 255, 0.06)',
                border: isBraced
                  ? '1px solid #3b82f6'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                color: isBraced ? '#93c5fd' : '#f8fafc',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: isCompleted ? 'default' : 'pointer',
                minHeight: '44px',
              }}
              aria-label={isMr ? 'दोरी घट्ट धरा (Brace)' : 'Brace against wind'}
            >
              <Shield size={14} />
              <span>{isMr ? 'सावध (Brace)' : 'Brace (Down)'}</span>
            </button>

            <button
              type="button"
              onClick={handleMoveRight}
              disabled={lane === 'right' || isCompleted}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                padding: '0.65rem 0.5rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: lane === 'right' || isCompleted ? 'default' : 'pointer',
                opacity: lane === 'right' ? 0.4 : 1,
                minHeight: '44px',
              }}
              aria-label={isMr ? 'उजव्या बाजूला जा' : 'Move right'}
            >
              <span>{isMr ? 'उजवीकडे' : 'Right'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
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
              'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(234, 88, 12, 0.15))',
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
                ? 'गड आला पण सिंह गेला! सिंहगडावर स्वराज्याचा भगवा फडकला!'
                : 'The bastion is taken: “Gad aala, pan Sinha gela!”'}
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
                  <strong>सिंहगड — द्रोणागिरी कडा (इ.स. १६७०):</strong> छत्रपती शिवाजी महाराजांचे
                  बालपणीचे सवंगडी नरवीर तानाजी मालुसरे यांनी ३०० मावळ्यांसह सरळसोट कडा चढून
                  उदयभान राठोडच्या सैन्याला पराभूत केले. तुमचा अधिकृत डिजिटल पासपोर्ट शिक्का अनलॉक
                  झाला आहे!
                </>
              ) : (
                <>
                  <strong>Sinhagad Fort • Dronagiri Precipice (1670 CE):</strong> Subedar Tanaji
                  Malusare scaled the sheer cliff at night with 300 Mawalas, liberating Kondhana.
                  Your verified Sinhagad Bastion digital passport stamp is awarded!
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
    </div>
  );
}

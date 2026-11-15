'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getPlaygroundGameData } from '@/lib/experience/selectors';
import { playgroundAudio } from './playgroundAudio';
import { markGameCompleted, PLAYGROUND_STAMPS } from './playgroundMilestone';
import {
  Sparkles,
  RotateCcw,
  FastForward,
  Award,
  Info,
  ChevronRight,
  Music,
  CheckCircle2,
} from 'lucide-react';

interface GaneshotsavProcessionGameProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

interface ManacheGanpatiInfo {
  rank: number;
  nameEn: string;
  nameMr: string;
  slug: string;
  significanceEn: string;
  significanceMr: string;
  establishedYear: number;
  icon: string;
}

const MANACHE_GANPATIS: ManacheGanpatiInfo[] = [
  {
    rank: 1,
    nameEn: 'Shri Kasba Ganpati (City Deity)',
    nameMr: 'श्री कसबा गणपती (पुण्याचे ग्रामदैवत)',
    slug: 'kasba-ganpati',
    significanceEn: 'Consecrated in 1630 CE by Rajmata Jijabai; traditionally leads every royal and civic procession in Pune.',
    significanceMr: 'इ.स. १६३० मध्ये राजमाता जिजाऊंनी स्थापन केलेले पुण्याचे ग्रामदैवत; सर्व सार्वजनिक मिरवणुकांमध्ये पहिला मान.',
    establishedYear: 1630,
    icon: '🌺',
  },
  {
    rank: 2,
    nameEn: 'Shri Tambdi Jogeshwari (Presiding Goddess)',
    nameMr: 'श्री तांबडी जोगेश्वरी (पुण्याची ग्रामदेवता)',
    slug: 'tambdi-jogeshwari',
    significanceEn: 'Historic silver and brass palanquin procession honoring Pune’s guardian mother deity.',
    significanceMr: 'पुण्याची रक्षणकर्ती ग्रामदेवता; चांदीच्या व पितळी पालखीतून निघणारी पारंपरिक मिरवणूक.',
    establishedYear: 1705,
    icon: '🚩',
  },
  {
    rank: 3,
    nameEn: 'Shri Guruji Talim',
    nameMr: 'श्री गुरुजी तालीम',
    slug: 'guruji-talim',
    significanceEn: 'Founded in 1887 by Hindu and Muslim wrestlers together as a lasting symbol of communal brotherhood.',
    significanceMr: 'इ.स. १८८७ मध्ये हिंदू व मुस्लिम पैलवानांनी एकत्र येऊन सुरू केलेले सर्वधर्मसमभावाचे प्रतीक.',
    establishedYear: 1887,
    icon: '🤝',
  },
  {
    rank: 4,
    nameEn: 'Shri Tulshibaug Ganpati',
    nameMr: 'श्री तुळशीबाग गणपती',
    slug: 'tulshibaug-temple',
    significanceEn: 'Famous for its magnificent 13-foot historic idol established in 1901, adorned with exquisite traditional jewelry.',
    significanceMr: 'इ.स. १९०१ मध्ये स्थापन झालेली १३ फूट भव्य देखणी मूर्ती व तुळशीबाग बाजारपेठेचा मध्यवर्ती उत्सव.',
    establishedYear: 1901,
    icon: '🐘',
  },
  {
    rank: 5,
    nameEn: 'Shri Kesari Wada Ganpati (Tilak Mandir)',
    nameMr: 'श्री केसरी वाडा गणपती (लोकमान्य टिळक वाडा)',
    slug: 'kesari-wada',
    significanceEn: 'Lokmanya Bal Gangadhar Tilak transformed Ganeshotsav into a national public movement here in 1893.',
    significanceMr: 'इ.स. १८९३ मध्ये लोकमान्य बाळ गंगाधर टिळकांनी स्वातंत्र्यलढ्यासाठी सार्वजनिक गणेशोत्सवाची मुहूर्तमेढ रोवलेले पावन स्थळ.',
    establishedYear: 1893,
    icon: '🏛️',
  },
];

interface FlowerPetal {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function GaneshotsavProcessionGame({
  onComplete,
  onSkip,
}: GaneshotsavProcessionGameProps) {
  const { isMr, isLiteMode, isAudioEnabled } = useExperience();
  const gameData = getPlaygroundGameData().dholTashaGame;

  // Sync audio mute state
  useEffect(() => {
    playgroundAudio.setMuted(!isAudioEnabled);
  }, [isAudioEnabled]);

  // Procession stage: 0 to 4 (representing 1st to 5th Manache Ganpati)
  const [currentGanpatiIdx, setCurrentGanpatiIdx] = useState<number>(0);
  const [beatsPlayedCount, setBeatsPlayedCount] = useState<number>(0);
  const [activePadAnimation, setActivePadAnimation] = useState<string | null>(null);
  const [flowerPetals, setFlowerPetals] = useState<FlowerPetal[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const activeGanpati = MANACHE_GANPATIS[currentGanpatiIdx];

  // Spawn flower petals on pad hits
  const triggerFlowerShower = useCallback(() => {
    if (isLiteMode) return;
    const colors = ['#ea580c', '#f59e0b', '#fb923c', '#fde047', '#e11d48'];
    const newPetals: FlowerPetal[] = [];
    for (let i = 0; i < 8; i++) {
      newPetals.push({
        id: Math.random(),
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setFlowerPetals(newPetals);
    setTimeout(() => setFlowerPetals([]), 700);
  }, [isLiteMode]);

  // Instrument Pad Hits
  const handlePlayPad = useCallback(
    (instrument: 'dhol' | 'tasha' | 'jhanj' | 'shankh') => {
      setActivePadAnimation(instrument);
      setTimeout(() => setActivePadAnimation(null), 180);

      if (instrument === 'dhol') {
        playgroundAudio.playDholBeat();
      } else if (instrument === 'tasha') {
        playgroundAudio.playTashaBeat();
      } else if (instrument === 'jhanj') {
        playgroundAudio.playJhanjBeat();
      } else if (instrument === 'shankh') {
        playgroundAudio.playShankhFanfare();
      }

      setBeatsPlayedCount((prev) => prev + 1);
      triggerFlowerShower();
    },
    [triggerFlowerShower]
  );

  // Advance procession to next Ganpati in sacred order
  const handleStepForward = useCallback(() => {
    if (isCompleted) return;

    if (currentGanpatiIdx < MANACHE_GANPATIS.length - 1) {
      const nextIdx = currentGanpatiIdx + 1;
      setCurrentGanpatiIdx(nextIdx);
      playgroundAudio.playDholBeat();
      playgroundAudio.playTashaBeat();
      triggerFlowerShower();

      // Check if arrived at Kesari Wada (final 5th Mana)
      if (nextIdx === MANACHE_GANPATIS.length - 1 && !isCompleted) {
        setIsCompleted(true);
        playgroundAudio.playShankhFanfare();
        playgroundAudio.playSuccessChime();
        markGameCompleted('ganeshotsav');
        if (onComplete) setTimeout(onComplete, 1500);
      }
    } else {
      if (!isCompleted) {
        setIsCompleted(true);
        playgroundAudio.playShankhFanfare();
        playgroundAudio.playSuccessChime();
        markGameCompleted('ganeshotsav');
        if (onComplete) setTimeout(onComplete, 1500);
      }
    }
  }, [currentGanpatiIdx, isCompleted, onComplete, triggerFlowerShower]);

  // Reset
  const handleReset = useCallback(() => {
    setCurrentGanpatiIdx(0);
    setBeatsPlayedCount(0);
    setIsCompleted(false);
  }, []);

  // Skip
  const handleSkip = useCallback(() => {
    markGameCompleted('ganeshotsav');
    setIsCompleted(true);
    setCurrentGanpatiIdx(MANACHE_GANPATIS.length - 1);
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete();
    }
  }, [onSkip, onComplete]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1' || e.key === 'd' || e.key === 'D') {
        handlePlayPad('dhol');
      } else if (e.key === '2' || e.key === 't' || e.key === 'T') {
        handlePlayPad('tasha');
      } else if (e.key === '3' || e.key === 'j' || e.key === 'J') {
        handlePlayPad('jhanj');
      } else if (e.key === '4' || e.key === 's' || e.key === 'S') {
        handlePlayPad('shankh');
      } else if (e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        handleStepForward();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPad, handleStepForward, handleReset]);

  const completedStamp = PLAYGROUND_STAMPS.ganeshotsav;

  return (
    <div
      className="exp-ganeshotsav-game"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        padding: '1.5rem',
        borderRadius: '1.25rem',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(8, 11, 17, 0.98))',
        border: '1px solid rgba(234, 88, 12, 0.25)',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6), 0 0 25px rgba(234, 88, 12, 0.12)',
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
            <Music size={12} />
            <span>{isMr ? 'खेळ ५: पाच मानाचे गणपती व ढोल-ताशा' : 'GAME 5: 5 MANACHE GANPATI PROCESSION'}</span>
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
              ? 'पुण्याच्या ५ मानाच्या गणपतींच्या पवित्र क्रमाने मिरवणूक पूर्ण करा: कसबा, तांबडी जोगेश्वरी, गुरुजी तालीम, तुळशीबाग व केसरी वाडा. ढोल-ताशांच्या गजरावर ठेका धरा!'
              : 'Pass the 5 Manache Ganpatis in sacred historical order (Kasba, Tambdi Jogeshwari, Guruji Talim, Tulshibaug, Kesari Wada) with live Dhol-Tasha pathak rhythm.'}
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
            aria-label={isMr ? 'खेळ रीसेट करा' : 'Reset Ganeshotsav procession'}
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

      {/* Sacred Order Stepper Bar across 5 Manache Ganpatis */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.5rem',
        }}
      >
        {MANACHE_GANPATIS.map((ganpati, idx) => {
          const isReached = idx <= currentGanpatiIdx;
          const isCurrent = idx === currentGanpatiIdx;
          return (
            <div
              key={ganpati.rank}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.25rem',
                borderRadius: '0.6rem',
                background: isCurrent
                  ? 'rgba(234, 88, 12, 0.25)'
                  : isReached
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isCurrent
                  ? '2px solid #ea580c'
                  : isReached
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '1.15rem' }}>{ganpati.icon}</div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: isCurrent ? '#fef08a' : isReached ? '#a7f3d0' : '#64748b',
                  lineHeight: 1.2,
                }}
              >
                {idx + 1}. {isMr ? ganpati.nameMr.split(' ')[1] : ganpati.nameEn.split(' ')[1]}
              </div>
              {isReached && <CheckCircle2 size={12} color={isCurrent ? '#ea580c' : '#10b981'} />}
            </div>
          );
        })}
      </div>

      {/* Main Procession Arena: Temple Stage & Dhol-Tasha 4-Pad Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.75rem',
          alignItems: 'center',
        }}
      >
        {/* Left: Active Manache Ganpati Temple Visual & Sacred Order Citation */}
        <div
          style={{
            position: 'relative',
            height: '340px',
            borderRadius: '1rem',
            background:
              'radial-gradient(circle at 50% 40%, rgba(234, 88, 12, 0.2) 0%, rgba(8, 11, 17, 0.98) 85%)',
            border: '2px solid rgba(234, 88, 12, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem',
            overflow: 'hidden',
          }}
        >
          {/* Flower Petal Particle Shower */}
          {flowerPetals.map((petal) => (
            <div
              key={petal.id}
              style={{
                position: 'absolute',
                top: `${petal.y}%`,
                left: `${petal.x}%`,
                width: '10px',
                height: '10px',
                borderRadius: '50% 0 50% 0',
                background: petal.color,
                boxShadow: `0 0 8px ${petal.color}`,
                transform: 'rotate(45deg)',
                animation: 'petalFall 0.7s ease-out forwards',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Top Badge: Rank & Consecration Year */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                background: 'rgba(234, 88, 12, 0.3)',
                border: '1px solid rgba(234, 88, 12, 0.6)',
                fontSize: '0.72rem',
                color: '#fef08a',
                fontWeight: 700,
              }}
            >
              {isMr ? `मानाचा ${activeGanpati.rank} ला गणपती` : `${activeGanpati.rank}${activeGanpati.rank === 1 ? 'st' : activeGanpati.rank === 2 ? 'nd' : activeGanpati.rank === 3 ? 'rd' : 'th'} Mana`}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#fdba74',
                fontFamily: 'var(--exp-font-mono)',
              }}
            >
              इ.स. {activeGanpati.establishedYear} CE
            </span>
          </div>

          {/* Central Idol & Sacred Resonance Aura */}
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '4.5rem',
                filter: 'drop-shadow(0 10px 20px rgba(234, 88, 12, 0.6))',
                animation: 'floatGently 2.5s infinite ease-in-out',
              }}
            >
              {activeGanpati.icon}
            </div>
            <h4
              style={{
                margin: '0.5rem 0 0 0',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#fff',
                fontFamily: isMr ? 'var(--exp-font-display-mr)' : 'var(--exp-font-display-en)',
              }}
            >
              {isMr ? activeGanpati.nameMr : activeGanpati.nameEn}
            </h4>
          </div>

          {/* Sacred Significance Description */}
          <div
            style={{
              padding: '0.65rem',
              borderRadius: '0.5rem',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.78rem',
              color: '#fed7aa',
              lineHeight: 1.4,
            }}
          >
            {isMr ? activeGanpati.significanceMr : activeGanpati.significanceEn}
          </div>
        </div>

        {/* Right: Dhol-Tasha 4-Pad Matrix & March Forward Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Beat Stats & Guidance */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#cbd5e1',
            }}
          >
            <span>{isMr ? 'ढोल-ताशा ताल वाद्ये (Rhythm Pads):' : 'Pathak Rhythm Pads:'}</span>
            <span style={{ color: '#ea580c', fontFamily: 'var(--exp-font-mono)' }}>
              {beatsPlayedCount} {isMr ? 'ठेके' : 'Beats Played'}
            </span>
          </div>

          {/* 4 Interactive Percussion Pads */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
            }}
          >
            {/* Pad A: Pune Dhol (धूम) */}
            <button
              type="button"
              onClick={() => handlePlayPad('dhol')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRadius: '0.75rem',
                background:
                  activePadAnimation === 'dhol'
                    ? '#ea580c'
                    : 'linear-gradient(135deg, rgba(234, 88, 12, 0.25), rgba(124, 45, 18, 0.4))',
                border: '2px solid rgba(234, 88, 12, 0.7)',
                color: '#fff',
                cursor: 'pointer',
                minHeight: '75px',
                transform: activePadAnimation === 'dhol' ? 'scale(0.96)' : 'scale(1)',
                transition: 'transform 0.1s ease, background 0.1s ease',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)',
              }}
              aria-label={isMr ? 'पुणे ढोल (धूम - की १ किंवा D)' : 'Pune Dhol (Press 1 or D)'}
            >
              <span style={{ fontSize: '1.35rem' }}>🥁</span>
              <strong style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {isMr ? 'पुणे ढोल (धूम)' : 'Pune Dhol (Bass)'}
              </strong>
              <span style={{ fontSize: '0.68rem', color: '#fed7aa' }}>
                {isMr ? 'दाबा: १ किंवा D' : 'Key: 1 / D'}
              </span>
            </button>

            {/* Pad B: Tasha (ताशा) */}
            <button
              type="button"
              onClick={() => handlePlayPad('tasha')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRadius: '0.75rem',
                background:
                  activePadAnimation === 'tasha'
                    ? '#d97706'
                    : 'linear-gradient(135deg, rgba(217, 119, 6, 0.25), rgba(180, 83, 9, 0.4))',
                border: '2px solid rgba(217, 119, 6, 0.7)',
                color: '#fff',
                cursor: 'pointer',
                minHeight: '75px',
                transform: activePadAnimation === 'tasha' ? 'scale(0.96)' : 'scale(1)',
                transition: 'transform 0.1s ease, background 0.1s ease',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
              }}
              aria-label={isMr ? 'ताशा (ताड - की २ किंवा T)' : 'Tasha (Press 2 or T)'}
            >
              <span style={{ fontSize: '1.35rem' }}>🪘</span>
              <strong style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {isMr ? 'ताशा (ताड-ताड)' : 'Tasha (Snare)'}
              </strong>
              <span style={{ fontSize: '0.68rem', color: '#fef08a' }}>
                {isMr ? 'दाबा: २ किंवा T' : 'Key: 2 / T'}
              </span>
            </button>

            {/* Pad C: Jhanj (झांज) */}
            <button
              type="button"
              onClick={() => handlePlayPad('jhanj')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRadius: '0.75rem',
                background:
                  activePadAnimation === 'jhanj'
                    ? '#ca8a04'
                    : 'linear-gradient(135deg, rgba(202, 138, 4, 0.25), rgba(133, 77, 14, 0.4))',
                border: '2px solid rgba(202, 138, 4, 0.7)',
                color: '#fff',
                cursor: 'pointer',
                minHeight: '75px',
                transform: activePadAnimation === 'jhanj' ? 'scale(0.96)' : 'scale(1)',
                transition: 'transform 0.1s ease, background 0.1s ease',
                boxShadow: '0 4px 14px rgba(202, 138, 4, 0.3)',
              }}
              aria-label={isMr ? 'झांज (की ३ किंवा J)' : 'Jhanj Cymbal (Press 3 or J)'}
            >
              <span style={{ fontSize: '1.35rem' }}>🔔</span>
              <strong style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {isMr ? 'झांज (झंकार)' : 'Jhanj (Cymbal)'}
              </strong>
              <span style={{ fontSize: '0.68rem', color: '#fef9c3' }}>
                {isMr ? 'दाबा: ३ किंवा J' : 'Key: 3 / J'}
              </span>
            </button>

            {/* Pad D: Shankh (शंख) */}
            <button
              type="button"
              onClick={() => handlePlayPad('shankh')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRadius: '0.75rem',
                background:
                  activePadAnimation === 'shankh'
                    ? '#0284c7'
                    : 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(3, 105, 161, 0.4))',
                border: '2px solid rgba(2, 132, 199, 0.7)',
                color: '#fff',
                cursor: 'pointer',
                minHeight: '75px',
                transform: activePadAnimation === 'shankh' ? 'scale(0.96)' : 'scale(1)',
                transition: 'transform 0.1s ease, background 0.1s ease',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              }}
              aria-label={isMr ? 'पवित्र शंख (की ४ किंवा S)' : 'Sacred Shankh (Press 4 or S)'}
            >
              <span style={{ fontSize: '1.35rem' }}>🐚</span>
              <strong style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {isMr ? 'पवित्र शंख (नाद)' : 'Shankh (Conch)'}
              </strong>
              <span style={{ fontSize: '0.68rem', color: '#bae6fd' }}>
                {isMr ? 'दाबा: ४ किंवा S' : 'Key: 4 / S'}
              </span>
            </button>
          </div>

          {/* March Forward Button */}
          <button
            type="button"
            onClick={handleStepForward}
            disabled={isCompleted}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              background: isCompleted
                ? 'rgba(16, 185, 129, 0.2)'
                : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              border: isCompleted
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : '2px solid rgba(251, 146, 60, 0.7)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: isCompleted ? 'default' : 'pointer',
              boxShadow: isCompleted ? 'none' : '0 8px 24px rgba(234, 88, 12, 0.45)',
              minHeight: '56px',
            }}
            aria-label={
              isMr
                ? 'मिरवणुकीत पुढील गणपतीकडे चला (Space किंवा Right Arrow)'
                : 'March forward in procession (Space or Right Arrow)'
            }
          >
            <span>
              {isCompleted
                ? isMr
                  ? '✓ ५ मानाच्या गणपतींची मिरवणूक पूर्ण!'
                  : '✓ Procession Completed at Kesari Wada!'
                : isMr
                ? `मिरवणुकीत पुढे चला (${currentGanpatiIdx + 1}/5) — Space दाबा`
                : `March to Next Mana (${currentGanpatiIdx + 1}/5) — Press Space`}
            </span>
            {!isCompleted && <ChevronRight size={18} />}
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
                ? 'गणपती बाप्पा मोरया! पाचही मानाच्या गणपतींची मिरवणूक संपन्न!'
                : 'Ganpati Bappa Morya! Sacred Procession Completed!'}
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
                  <strong>पुण्यातील मानाच्या गणपतींची परंपरा:</strong> कसबा गणपती, तांबडी जोगेश्वरी,
                  गुरुजी तालीम, तुळशीबाग आणि केसरी वाडा — या ऐतिहासिक क्रमानेच अनंत चतुर्दशीला
                  विसर्जन मिरवणूक निघते. तुमचा मानाचा डिजिटल पासपोर्ट शिक्का अनलॉक झाला आहे!
                </>
              ) : (
                <>
                  <strong>Historic 5 Manache Ganpatis of Pune:</strong> Consecrated in strict
                  sacred order (Kasba, Tambdi Jogeshwari, Guruji Talim, Tulshibaug, Kesari Wada),
                  this 130-year civic festival binds the city together. Your Manache Ganpati digital
                  stamp has been awarded!
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
        @keyframes petalFall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(60px) rotate(180deg);
          }
        }
        @keyframes floatGently {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}

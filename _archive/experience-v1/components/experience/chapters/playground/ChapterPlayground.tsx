'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getPlaygroundGameData } from '@/lib/experience/selectors';
import {
  getPlaygroundProgress,
  getCompletedGameCount,
  PlaygroundProgress,
  PLAYGROUND_STAMPS,
} from './playgroundMilestone';
import MisalBuilderGame from './MisalBuilderGame';
import TambatRhythmGame from './TambatRhythmGame';
import TanajiClimbGame from './TanajiClimbGame';
import RelicInspectorGame from './RelicInspectorGame';
import GaneshotsavProcessionGame from './GaneshotsavProcessionGame';
import {
  Gamepad2,
  UtensilsCrossed,
  Hammer,
  Mountain,
  Compass,
  Music,
  CheckCircle2,
  Trophy,
  FastForward,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export type GameKey = 'misal' | 'tambat' | 'tanaji' | 'relic' | 'ganeshotsav';

interface GameTabMeta {
  key: GameKey;
  num: number;
  icon: React.ReactNode;
  titleEn: string;
  titleMr: string;
  subtitleEn: string;
  subtitleMr: string;
}

const GAME_TABS: GameTabMeta[] = [
  {
    key: 'misal',
    num: 1,
    icon: <UtensilsCrossed size={18} />,
    titleEn: 'Puneri Misal',
    titleMr: 'पुणेरी मिसळ',
    subtitleEn: 'Layering & Heat Gauge',
    subtitleMr: 'झणझणीत कट व थर',
  },
  {
    key: 'tambat',
    num: 2,
    icon: <Hammer size={18} />,
    titleEn: 'Tambat Matharkaam',
    titleMr: 'तांबट माथारकाम',
    subtitleEn: 'Copper Beat Rhythm',
    subtitleMr: 'तांब्यावर घण व ताल',
  },
  {
    key: 'tanaji',
    num: 3,
    icon: <Mountain size={18} />,
    titleEn: 'Tanaji’s Climb',
    titleMr: 'सिंहगड चढाई',
    subtitleEn: '1670 Cliff Escalade',
    subtitleMr: 'द्रोणागिरी कडा मोहीम',
  },
  {
    key: 'relic',
    num: 4,
    icon: <Compass size={18} />,
    titleEn: 'Relic Inspector',
    titleMr: 'अमूल्य खजिना',
    subtitleEn: '3D Card Examination',
    subtitleMr: '५ दुर्मिळ ऐतिहासिक वस्तू',
  },
  {
    key: 'ganeshotsav',
    num: 5,
    icon: <Music size={18} />,
    titleEn: 'Ganeshotsav',
    titleMr: '५ मानाचे गणपती',
    subtitleEn: 'Dhol-Tasha Procession',
    subtitleMr: 'ढोल-ताशा व मिरवणूक',
  },
];

export default function ChapterPlayground() {
  const { isMr, isLiteMode, registerChapter, unregisterChapter } = useExperience();
  const gameData = getPlaygroundGameData();

  // Active mini-game tab
  const [activeTab, setActiveTab] = useState<GameKey>('misal');
  const [progress, setProgress] = useState<PlaygroundProgress>({
    misal: false,
    tambat: false,
    tanaji: false,
    relic: false,
    ganeshotsav: false,
  });

  // Chapter registration with lifecycle API
  useEffect(() => {
    registerChapter({
      id: 'playground',
      order: 5,
      titleEn: 'Chapter 5: Tactile Playground',
      titleMr: 'प्रकरण ५: परस्परसंवादी खेळघर',
      enter: () => {},
      exit: () => {},
      scrub: () => {},
    });

    return () => {
      unregisterChapter('playground');
    };
  }, [registerChapter, unregisterChapter]);

  // Read progress from storage and listen for updates
  useEffect(() => {
    setProgress(getPlaygroundProgress());

    const handleProgressUpdate = (e: Event) => {
      const custom = e as CustomEvent<PlaygroundProgress>;
      if (custom.detail) {
        setProgress(custom.detail);
      } else {
        setProgress(getPlaygroundProgress());
      }
    };

    window.addEventListener('explore-pune-playground-progress', handleProgressUpdate);
    window.addEventListener('explore-pune-milestone-unlocked', handleProgressUpdate);

    return () => {
      window.removeEventListener('explore-pune-playground-progress', handleProgressUpdate);
      window.removeEventListener('explore-pune-milestone-unlocked', handleProgressUpdate);
    };
  }, []);

  const completedCount = getCompletedGameCount(progress);
  const completionPercentage = Math.round((completedCount / GAME_TABS.length) * 100);
  const isAllCompleted = completedCount === GAME_TABS.length;

  const currentIdx = GAME_TABS.findIndex((g) => g.key === activeTab);

  // Navigate to next game
  const handleNextGame = useCallback(() => {
    const nextIdx = (currentIdx + 1) % GAME_TABS.length;
    setActiveTab(GAME_TABS[nextIdx].key);
  }, [currentIdx]);

  // Navigate to prev game
  const handlePrevGame = useCallback(() => {
    const prevIdx = (currentIdx - 1 + GAME_TABS.length) % GAME_TABS.length;
    setActiveTab(GAME_TABS[prevIdx].key);
  }, [currentIdx]);

  return (
    <section
      id="playground"
      className="exp-section exp-chapter-playground"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '5rem 1.5rem 6rem 1.5rem',
        boxSizing: 'border-box',
      }}
      aria-labelledby="ch5-heading"
    >
      {/* Chapter 5 Banner & Title */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            background: 'rgba(234, 88, 12, 0.12)',
            border: '1px solid rgba(234, 88, 12, 0.35)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fb923c',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <Gamepad2 size={14} />
          <span>{isMr ? 'प्रकरण ५ • परस्परसंवादी खेळघर' : 'CHAPTER 5 • TACTILE PLAYGROUND'}</span>
        </div>

        <h2
          id="ch5-heading"
          style={{
            margin: '0 0 0.65rem 0',
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: 800,
            fontFamily: isMr ? 'var(--exp-font-display-mr)' : 'var(--exp-font-display-en)',
            color: '#f8fafc',
            letterSpacing: '-0.02em',
          }}
        >
          {isMr ? 'पुण्याशी नाते जोडणारे ५ खेळ' : 'Tactile Workshop & Living Traditions'}
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
            color: '#94a3b8',
            maxWidth: '720px',
            lineHeight: 1.6,
          }}
        >
          {isMr
            ? 'पुण्याच्या जिवंत संस्कृतीचा थेट अनुभव घ्या: मिसळ बनवणे, तांबट काम, सिंहगड चढाई, अमूल्य वस्तूंची तपासणी आणि ढोल-ताशा ताल.'
            : 'Explore Pune through touch and sound: layer fiery Misal, strike Kasba copper vessels, climb Sinhagad at night, inspect 3D relics, and play the sacred Dhol-Tasha.'}
        </p>

        {/* Overall Completion Progress Gauge */}
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            marginTop: '1.5rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '1rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <span style={{ color: '#cbd5e1' }}>
              {isMr ? 'खेळघर प्रगती (Completed Games):' : 'Playground Completion:'}
            </span>
            <span
              style={{
                color: isAllCompleted ? '#34d399' : '#f59e0b',
                fontFamily: 'var(--exp-font-mono)',
              }}
            >
              {completedCount} / {GAME_TABS.length} ({completionPercentage}%)
            </span>
          </div>

          <div
            style={{
              height: '8px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${completionPercentage}%`,
                background: isAllCompleted
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #ea580c, #f59e0b, #38bdf8)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Grand Master Completion Trophy Banner (when all 5 completed) */}
      {isAllCompleted && (
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.25rem 1.5rem',
            borderRadius: '1rem',
            background:
              'linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(245, 158, 11, 0.25), rgba(16, 185, 129, 0.2))',
            border: '2px solid rgba(245, 158, 11, 0.6)',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            animation: 'fadeInUp 0.5s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(234, 179, 8, 0.5)',
              }}
            >
              <Trophy size={24} color="#080b11" />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#fef08a',
                }}
              >
                {isMr
                  ? 'सर्व ५ खेळ पूर्ण! तुम्ही अस्सल पुणेकर आहात!'
                  : 'Grand Master! All 5 Tactile Experiences Mastered!'}
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#f8fafc' }}>
                {isMr
                  ? '५ अधिकृत डिजिटल पासपोर्ट शिक्के तुमच्या प्रोफाइलमध्ये जोडले गेले आहेत.'
                  : '5 verified cultural passport stamps have been recorded in your journey passport.'}
              </p>
            </div>
          </div>

          <div
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#34d399',
            }}
          >
            ✓ 5 / 5 Stamps Unlocked
          </div>
        </div>
      )}

      {/* 5-Tab Game Selector Dock */}
      <div
        role="tablist"
        aria-label={isMr ? 'खेळ निवडा' : 'Mini-game switcher'}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        {GAME_TABS.map((tab) => {
          const isSelected = activeTab === tab.key;
          const isDone = progress[tab.key];

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.9rem 1rem',
                borderRadius: '0.85rem',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'
                  : 'rgba(15, 23, 42, 0.6)',
                border: isSelected
                  ? '2px solid #ea580c'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isSelected
                  ? '0 8px 24px rgba(234, 88, 12, 0.25)'
                  : 'none',
                color: isSelected ? '#f8fafc' : '#94a3b8',
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: '64px',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.5rem',
                  background: isSelected
                    ? 'rgba(234, 88, 12, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#fb923c' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {tab.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: isSelected ? '#f8fafc' : '#cbd5e1',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tab.num}. {isMr ? tab.titleMr : tab.titleEn}
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: isSelected ? '#fdba74' : '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {isMr ? tab.subtitleMr : tab.subtitleEn}
                </div>
              </div>

              {isDone && (
                <CheckCircle2
                  size={18}
                  color="#10b981"
                  style={{ flexShrink: 0 }}
                  aria-label={isMr ? 'पूर्ण झाले' : 'Completed'}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Game Stage Container */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        style={{
          width: '100%',
          position: 'relative',
        }}
      >
        {activeTab === 'misal' && (
          <MisalBuilderGame
            onComplete={handleNextGame}
            onSkip={handleNextGame}
          />
        )}
        {activeTab === 'tambat' && (
          <TambatRhythmGame
            onComplete={handleNextGame}
            onSkip={handleNextGame}
          />
        )}
        {activeTab === 'tanaji' && (
          <TanajiClimbGame
            onComplete={handleNextGame}
            onSkip={handleNextGame}
          />
        )}
        {activeTab === 'relic' && (
          <RelicInspectorGame
            onComplete={handleNextGame}
            onSkip={handleNextGame}
          />
        )}
        {activeTab === 'ganeshotsav' && (
          <GaneshotsavProcessionGame
            onComplete={handleNextGame}
            onSkip={handleNextGame}
          />
        )}
      </div>

      {/* Bottom Switcher Navigation Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '2rem',
          padding: '1rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <button
          type="button"
          onClick={handlePrevGame}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.1rem',
            borderRadius: '0.5rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: '44px',
          }}
          aria-label={isMr ? 'मागील खेळ खेळा' : 'Play previous game'}
        >
          <ChevronLeft size={16} />
          <span>{isMr ? 'मागील खेळ' : 'Previous Game'}</span>
        </button>

        <div
          style={{
            fontSize: '0.8rem',
            color: '#94a3b8',
            fontFamily: 'var(--exp-font-mono)',
          }}
        >
          {currentIdx + 1} / {GAME_TABS.length}
        </div>

        <button
          type="button"
          onClick={handleNextGame}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.1rem',
            borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #ea580c, #c2410c)',
            border: 'none',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            minHeight: '44px',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)',
          }}
          aria-label={isMr ? 'पुढील खेळ खेळा' : 'Play next game'}
        >
          <span>{isMr ? 'पुढील खेळ' : 'Next Game'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}

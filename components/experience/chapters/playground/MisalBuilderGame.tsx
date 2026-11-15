'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getPlaygroundGameData } from '@/lib/experience/selectors';
import { playgroundAudio } from './playgroundAudio';
import { markGameCompleted, PLAYGROUND_STAMPS } from './playgroundMilestone';
import {
  Flame,
  CheckCircle2,
  RotateCcw,
  FastForward,
  Award,
  Sparkles,
  Info,
  UtensilsCrossed,
} from 'lucide-react';

interface MisalBuilderGameProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function MisalBuilderGame({ onComplete, onSkip }: MisalBuilderGameProps) {
  const { isMr, isLiteMode, isAudioEnabled } = useExperience();
  const gameData = getPlaygroundGameData().misalGame;

  // Sync audio mute state
  useEffect(() => {
    playgroundAudio.setMuted(!isAudioEnabled);
  }, [isAudioEnabled]);

  // Spice level state: 'mild' | 'spicy' | 'zanzanit'
  const [selectedSpice, setSelectedSpice] = useState<'mild' | 'spicy' | 'zanzanit'>('zanzanit');

  // Layer tracking: set of added ingredient IDs
  const [addedLayers, setAddedLayers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  const steamCanvasId = useId();

  // Essential ingredients that must be in the bowl
  const essentialIds = gameData.ingredients.filter((i) => i.essential).map((i) => i.id);
  const isBowlReady = essentialIds.every((id) => addedLayers.includes(id));

  // Add ingredient handler
  const handleAddIngredient = useCallback(
    (id: string) => {
      if (addedLayers.includes(id)) return;

      const next = [...addedLayers, id];
      setAddedLayers(next);
      setRecentlyAdded(id);

      // Play audio feedback
      if (id === 'tarri') {
        playgroundAudio.playMisalSizzle();
      } else {
        playgroundAudio.playCopperHammer(1.4);
      }

      setTimeout(() => setRecentlyAdded(null), 600);

      // Check if all essential layers are present
      const allEssentialPresent = essentialIds.every((eid) => next.includes(eid));
      if (allEssentialPresent && !isCompleted) {
        setIsCompleted(true);
        playgroundAudio.playZanzanitChime();
        markGameCompleted('misal');
        if (onComplete) {
          setTimeout(onComplete, 1200);
        }
      }
    },
    [addedLayers, essentialIds, isCompleted, onComplete]
  );

  // Auto assemble / quick add
  const handleAutoAssemble = useCallback(() => {
    const all = gameData.ingredients.map((i) => i.id);
    setAddedLayers(all);
    setIsCompleted(true);
    playgroundAudio.playMisalSizzle();
    playgroundAudio.playZanzanitChime();
    markGameCompleted('misal');
    if (onComplete) {
      setTimeout(onComplete, 1200);
    }
  }, [gameData.ingredients, onComplete]);

  // Reset bowl
  const handleReset = useCallback(() => {
    setAddedLayers([]);
    setIsCompleted(false);
  }, []);

  // Skip game
  const handleSkip = useCallback(() => {
    markGameCompleted('misal');
    setIsCompleted(true);
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete();
    }
  }, [onSkip, onComplete]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= '1' && e.key <= '7') {
        const idx = parseInt(e.key, 10) - 1;
        if (gameData.ingredients[idx]) {
          handleAddIngredient(gameData.ingredients[idx].id);
        }
      } else if (e.key === 'a' || e.key === 'A') {
        handleAutoAssemble();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setSelectedSpice((prev) => (prev === 'mild' ? 'spicy' : 'zanzanit'));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setSelectedSpice((prev) => (prev === 'zanzanit' ? 'spicy' : 'mild'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameData.ingredients, handleAddIngredient, handleAutoAssemble, handleReset]);

  // Heat color and steam metrics
  const spiceColor =
    selectedSpice === 'mild'
      ? '#f59e0b'
      : selectedSpice === 'spicy'
      ? '#ea580c'
      : '#dc2626';

  const spiceScoville =
    gameData.spiceLevels.find((s) => s.id === selectedSpice)?.scoville || '75,000 SHU';

  const completedStamp = PLAYGROUND_STAMPS.misal;

  return (
    <div
      className="exp-misal-builder"
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
      {/* Top Header & Actions Bar */}
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
            <UtensilsCrossed size={12} />
            <span>{isMr ? 'खेळ १: अस्सल पुणेरी चव' : 'GAME 1: PUNERI CULINARY ART'}</span>
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
            {isMr ? gameData.descriptionMr : gameData.descriptionEn}
          </p>
        </div>

        {/* Control Buttons */}
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
            title={isMr ? 'पुन्हा सुरुवात करा (R)' : 'Reset Bowl (R)'}
            aria-label={isMr ? 'पुन्हा सुरुवात करा' : 'Reset Misal Bowl'}
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

      {/* Main Interactive Stage: 2-Column Split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.75rem',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Visual Misal Bowl Representation */}
        <div
          style={{
            position: 'relative',
            height: '340px',
            borderRadius: '1rem',
            background: 'radial-gradient(circle at 50% 60%, rgba(30, 41, 59, 0.6) 0%, rgba(4, 6, 10, 0.95) 85%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Animated Steam Plumes */}
          {!isLiteMode && (
            <div
              style={{
                position: 'absolute',
                top: '25px',
                width: '180px',
                height: '90px',
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'space-around',
                opacity: selectedSpice === 'zanzanit' ? 0.85 : selectedSpice === 'spicy' ? 0.55 : 0.3,
                transition: 'opacity 0.4s ease',
              }}
              aria-hidden="true"
            >
              {[1, 2, 3].map((plume) => (
                <div
                  key={plume}
                  style={{
                    width: '18px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.4), transparent 70%)',
                    filter: 'blur(6px)',
                    animation: `misalSteam 2.${plume}s infinite ease-out`,
                    animationDelay: `${plume * 0.4}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Sizzle Soundwave Ring Indicator */}
          {recentlyAdded === 'tarri' && (
            <div
              style={{
                position: 'absolute',
                width: '260px',
                height: '180px',
                borderRadius: '50%',
                border: `2px solid ${spiceColor}`,
                animation: 'misalRipples 0.8s ease-out forwards',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />
          )}

          {/* Stainless Steel / Brass Puneri Misal Bowl */}
          <div
            style={{
              position: 'relative',
              width: '240px',
              height: '140px',
              borderRadius: '0 0 120px 120px',
              background: 'linear-gradient(180deg, #94a3b8 0%, #475569 40%, #1e293b 100%)',
              border: '3px solid #cbd5e1',
              boxShadow: `0 16px 36px rgba(0, 0, 0, 0.8), 0 0 30px ${spiceColor}44`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              paddingTop: '6px',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* Bowl Rim Highlight */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '14px',
                borderRadius: '50%',
                background: 'linear-gradient(90deg, #cbd5e1 0%, #f8fafc 50%, #94a3b8 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8)',
              }}
            />

            {/* Empty Bowl State Notice */}
            {addedLayers.length === 0 && (
              <div
                style={{
                  margin: 'auto',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  padding: '0 1rem',
                }}
              >
                {isMr ? 'खालील घटक निवडून वाटी भरा' : 'Select ingredients below to build bowl'}
              </div>
            )}

            {/* Layer 1: Boiled Matki Usal (Base) */}
            {addedLayers.includes('matki') && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '38px',
                  background: 'linear-gradient(180deg, #b45309 0%, #78350f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#fef3c7',
                  borderTop: '1px dashed #f59e0b',
                  animation: 'fadeInUp 0.3s ease',
                }}
              >
                🌱 {isMr ? 'मोड आलेली मटकी उसळ' : 'Sprouted Matki Usal'}
              </div>
            )}

            {/* Layer 2: Crispy Puneri Farsan */}
            {addedLayers.includes('farsan') && (
              <div
                style={{
                  position: 'absolute',
                  bottom: addedLayers.includes('matki') ? '35px' : '0px',
                  left: 0,
                  right: 0,
                  height: '35px',
                  background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#fff',
                  borderTop: '1px solid #fde68a',
                  animation: 'fadeInUp 0.3s ease',
                }}
              >
                🥨 {isMr ? 'कुरकुरीत पुणेरी फरसाण' : 'Crispy Farsan'}
              </div>
            )}

            {/* Layer 3: Fiery Kat / Tarri Rassa */}
            {addedLayers.includes('tarri') && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: 0,
                  right: 0,
                  height: '55px',
                  background: `linear-gradient(180deg, ${spiceColor}ee 0%, #9a3412cc 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  boxShadow: `inset 0 2px 6px ${spiceColor}`,
                  animation: 'fadeInUp 0.3s ease',
                }}
              >
                🥣 {isMr ? 'झणझणीत कट / तर्री' : 'Fiery Tarri Rassa'}
              </div>
            )}

            {/* Layer 4: Fine Chopped Onions & Coriander */}
            {addedLayers.includes('onion') && (
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '25px',
                  right: '25px',
                  height: '24px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  zIndex: 2,
                  animation: 'fadeInUp 0.3s ease',
                }}
              >
                🧅🌿 {isMr ? 'कांदा-कोथिंबीर' : 'Onions & Coriander'}
              </div>
            )}

            {/* Layer 5: Fresh Lemon Slice Squeezed */}
            {addedLayers.includes('lemon') && (
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '18px',
                  fontSize: '1.25rem',
                  zIndex: 3,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                  animation: 'bounceIn 0.4s ease',
                }}
                title={isMr ? 'लिंबाचा रस' : 'Lemon Squeezed'}
              >
                🍋
              </div>
            )}
          </div>

          {/* Ladi Pav Plate on the Side */}
          {addedLayers.includes('pav') && (
            <div
              style={{
                marginTop: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(253, 230, 138, 0.15)',
                border: '1px solid rgba(253, 230, 138, 0.35)',
                fontSize: '0.75rem',
                color: '#fef08a',
                animation: 'fadeInUp 0.3s ease',
              }}
            >
              🍞 {isMr ? 'गरमागरम बटर लादी पाव सोबत' : 'Buttered Ladi Pav Ready'}
            </div>
          )}

          {/* Cooling Curd / Dahi Cup if chosen */}
          {addedLayers.includes('curd') && (
            <div
              style={{
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                fontSize: '0.75rem',
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.5rem',
                color: '#e2e8f0',
              }}
            >
              🥛 {isMr ? 'दही वाटी' : 'Dahi Cup'}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Ingredient Pantry & Heat Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Spice Heat Gauge Slider & Preset Buttons */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '0.85rem',
              background: 'rgba(15, 23, 42, 0.7)',
              border: `1px solid ${spiceColor}44`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.6rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: spiceColor,
                }}
              >
                <Flame size={16} />
                {isMr ? 'कट/रस्सा तिखटपणा (Spice Gauge):' : 'Kat / Tarri Spice Gauge:'}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--exp-font-mono)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: 'rgba(0,0,0,0.4)',
                  color: '#fdba74',
                }}
              >
                {spiceScoville}
              </span>
            </div>

            {/* 3 Spice Buttons */}
            <div
              role="radiogroup"
              aria-label={isMr ? 'तिखटपणा पातळी निवडा' : 'Select misal spice level'}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}
            >
              {gameData.spiceLevels.map((lvl) => {
                const isSelected = selectedSpice === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setSelectedSpice(lvl.id as any);
                      playgroundAudio.playCopperHammer(1.8);
                    }}
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: '0.5rem',
                      border: isSelected
                        ? `2px solid ${spiceColor}`
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      background: isSelected
                        ? `${spiceColor}22`
                        : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#fff' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      minHeight: '44px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>{isMr ? lvl.labelMr : lvl.labelEn.split('(')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredient Selector Chips */}
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '0.6rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{isMr ? 'मिसळ घटक (Add Layers):' : 'Misal Ingredients (Add Layers):'}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {addedLayers.length} / {gameData.ingredients.length}{' '}
                {isMr ? 'घटक टाकले' : 'added'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {gameData.ingredients.map((ing, idx) => {
                const isAdded = addedLayers.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => handleAddIngredient(ing.id)}
                    disabled={isAdded}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.65rem 0.6rem',
                      borderRadius: '0.6rem',
                      border: isAdded
                        ? '1px solid rgba(16, 185, 129, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      background: isAdded
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: isAdded ? '#a7f3d0' : '#f8fafc',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: isAdded ? 'default' : 'pointer',
                      opacity: isAdded ? 0.85 : 1,
                      minHeight: '48px',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    aria-label={`${isMr ? ing.nameMr : ing.nameEn} ${
                      isAdded ? (isMr ? 'टाकले' : 'added') : ''
                    }`}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{ing.icon}</span>
                    <span style={{ flex: 1, lineHeight: 1.2 }}>
                      {isMr ? ing.nameMr : ing.nameEn}
                    </span>
                    {isAdded && <CheckCircle2 size={14} color="#10b981" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Assemble CTA */}
          <button
            type="button"
            onClick={handleAutoAssemble}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '0.6rem',
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              border: 'none',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              minHeight: '46px',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)',
            }}
          >
            <Sparkles size={16} />
            <span>
              {isMr
                ? 'एका क्लिकवर अस्सल पुणेरी मिसळ बनवा'
                : 'Auto Assemble Authentic Misal (Press A)'}
            </span>
          </button>
        </div>
      </div>

      {/* Completion Banner with Bedekar Tea Stall verified heritage citation */}
      {isCompleted && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '1.25rem',
            borderRadius: '0.85rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(234, 88, 12, 0.15))',
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
                ? 'झणझणीत! अस्सल पुणेरी मिसळ तयार झाली!'
                : 'Zanzanit! Authentic Puneri Misal Perfected!'}
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
                  <strong>नारायण पेठेतील बेडेकर टी स्टॉल (१९४६):</strong> पुण्यात मिसळीसोबत पोहे
                  किंवा पावाचा समतोल आणि खास गरम तर्री देणे ही बेडेकर कुटुंबाने सुरू केलेली ८०
                  वर्षांची परंपरा आहे. तुमचा डिजिटल पासपोर्ट शिक्का अनलॉक झाला आहे!
                </>
              ) : (
                <>
                  <strong>Bedekar Tea Stall Heritage (Est. 1946, Narayan Peth):</strong> Puneri
                  misal balances sprouted moth beans, house-made farsan, and spiced tamarind-jaggery
                  tarri. Your verified digital passport stamp has been awarded!
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

      {/* Embedded Keyframe CSS styles for animations */}
      <style jsx>{`
        @keyframes misalSteam {
          0% {
            transform: translateY(0) scaleX(0.8);
            opacity: 0.1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-50px) scaleX(1.4);
            opacity: 0;
          }
        }
        @keyframes misalRipples {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

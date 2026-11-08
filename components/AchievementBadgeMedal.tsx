'use client';

import React from 'react';
import { MedalDesign, BadgeRarity } from '@/lib/achievements';

interface AchievementBadgeMedalProps {
  design: MedalDesign;
  rarity: BadgeRarity;
  isUnlocked?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
  title?: string;
}

const SIZE_CONFIGS = {
  sm: { dimension: 44, strokeWidth: 1.5, starSize: 3 },
  md: { dimension: 74, strokeWidth: 2, starSize: 5 },
  lg: { dimension: 112, strokeWidth: 3, starSize: 7 },
  xl: { dimension: 180, strokeWidth: 4, starSize: 11 },
};

export default function AchievementBadgeMedal({
  design,
  rarity,
  isUnlocked = true,
  size = 'md',
  className = '',
  showGlow = true,
  title,
}: AchievementBadgeMedalProps) {
  const cfg = SIZE_CONFIGS[size];
  const uniqueId = `medal-${design.metal}-${design.symbol}-${size}-${isUnlocked ? 'u' : 'l'}`;

  // Metallic Finishes Color Palettes
  const palettes = {
    bronze: {
      rimLight: '#fed7aa',
      rimDark: '#78350f',
      rimMid: '#c2410c',
      plateGradient: ['#431407', '#7c2d12', '#2a0800'],
      symbolColor: '#f97316',
      starColor: '#ea580c',
      glow: 'rgba(234, 88, 12, 0.45)',
    },
    silver: {
      rimLight: '#ffffff',
      rimDark: '#334155',
      rimMid: '#94a3b8',
      plateGradient: ['#0f172a', '#1e293b', '#090d16'],
      symbolColor: '#38bdf8',
      starColor: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.45)',
    },
    gold: {
      rimLight: '#fef08a',
      rimDark: '#713f12',
      rimMid: '#eab308',
      plateGradient: ['#1c1917', '#422006', '#120d08'],
      symbolColor: '#fbbf24',
      starColor: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.5)',
    },
    platinum: {
      rimLight: '#cffafe',
      rimDark: '#164e63',
      rimMid: '#06b6d4',
      plateGradient: ['#042f2e', '#111827', '#021e25'],
      symbolColor: '#2dd4bf',
      starColor: '#2dd4bf',
      glow: 'rgba(45, 212, 191, 0.55)',
    },
  };

  const pal = palettes[design.metal] || palettes.gold;

  // Star count by rarity
  const starCount =
    rarity === 'common' ? 1 : rarity === 'rare' ? 2 : rarity === 'epic' ? 3 : 4;

  const renderSymbol = () => {
    switch (design.symbol) {
      case 'footstep':
        return (
          <path
            d="M50 25 C45 25, 41 29, 41 35 C41 41, 44 47, 44 54 C44 59, 42 63, 42 68 C42 75, 46 80, 50 80 C54 80, 58 75, 58 68 C58 63, 56 59, 56 54 C56 47, 59 41, 59 35 C59 29, 55 25, 50 25 Z M45 20 C43 20, 42 18, 43 16 C44 14, 46 14, 47 16 C48 18, 47 20, 45 20 Z M52 18 C50 18, 49 16, 50 14 C51 12, 53 12, 54 14 C55 16, 54 18, 52 18 Z M58 20 C56 20, 55 18, 56 16 C57 14, 59 14, 60 16 C61 18, 60 20, 58 20 Z"
            fill="currentColor"
          />
        );
      case 'compass':
        return (
          <g fill="currentColor">
            <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
            <polygon points="50,22 55,46 50,50 45,46" fill="#ef4444" />
            <polygon points="50,78 55,54 50,50 45,54" fill="currentColor" opacity="0.8" />
            <polygon points="22,50 46,45 50,50 46,55" fill="currentColor" opacity="0.7" />
            <polygon points="78,50 54,45 50,50 54,55" fill="currentColor" opacity="0.7" />
            <circle cx="50" cy="50" r="4.5" fill="#f8fafc" />
          </g>
        );
      case 'map':
        return (
          <g fill="currentColor">
            <path
              d="M26 30 L42 24 L58 30 L74 24 L74 70 L58 76 L42 70 L26 76 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M42 24 L42 70" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
            <path d="M58 30 L58 76" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
            <circle cx="50" cy="48" r="4" fill="#ef4444" />
          </g>
        );
      case 'crown':
        return (
          <path
            d="M26 66 L28 42 L40 54 L50 30 L60 54 L72 42 L74 66 Z M30 70 L70 70 L70 74 L30 74 Z"
            fill="currentColor"
          />
        );
      case 'fortress':
      case 'rampart':
        return (
          <g fill="currentColor">
            <path
              d="M26 72 L26 44 L32 44 L32 48 L38 48 L38 44 L44 44 L44 48 L50 48 L50 44 L56 44 L56 48 L62 48 L62 44 L68 44 L68 48 L74 48 L74 72 Z"
              fill="currentColor"
            />
            <path d="M44 72 L44 58 C44 55, 56 55, 56 58 L56 72 Z" fill="#0f172a" />
            <polygon points="50,22 47,38 53,38" fill="#e11d48" />
            <line x1="47" y1="22" x2="47" y2="44" stroke="currentColor" strokeWidth="2" />
          </g>
        );
      case 'crossed_swords':
        return (
          <g fill="currentColor">
            {/* Sword 1 */}
            <path d="M30 70 L34 74 L42 66 L70 38 C74 34, 76 26, 72 24 C70 20, 62 22, 58 26 L30 54 Z" />
            {/* Sword 2 */}
            <path d="M70 70 L66 74 L58 66 L30 38 C26 34, 24 26, 28 24 C30 20, 38 22, 42 26 L70 54 Z" opacity="0.85" />
            <circle cx="50" cy="50" r="5" fill="#f59e0b" />
          </g>
        );
      case 'temple':
        return (
          <g fill="currentColor">
            {/* Kalash Flag */}
            <path d="M50 20 L58 24 L50 28 Z" fill="#ea580c" />
            <line x1="50" y1="18" x2="50" y2="30" stroke="currentColor" strokeWidth="2" />
            {/* Shikhara Pyramid */}
            <path d="M50 30 L34 56 L66 56 Z" fill="currentColor" />
            {/* Pillars & Base */}
            <rect x="36" y="56" width="28" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <rect x="46" y="60" width="8" height="14" fill="#f8fafc" />
            <line x1="30" y1="74" x2="70" y2="74" stroke="currentColor" strokeWidth="3" />
          </g>
        );
      case 'wada':
        return (
          <g fill="currentColor">
            <path d="M26 38 L50 24 L74 38 L74 74 L26 74 Z" fill="none" stroke="currentColor" strokeWidth="3" />
            {/* Iconic Peshwa Wood Arch */}
            <path d="M40 74 L40 56 C40 48, 60 48, 60 56 L60 74 Z" fill="currentColor" />
            <rect x="34" y="42" width="8" height="8" fill="currentColor" opacity="0.7" />
            <rect x="58" y="42" width="8" height="8" fill="currentColor" opacity="0.7" />
          </g>
        );
      case 'scroll':
        return (
          <g fill="currentColor">
            <path
              d="M32 26 C28 26, 26 29, 26 32 C26 35, 28 38, 32 38 L68 38 C72 38, 74 35, 74 32 C74 29, 72 26, 68 26 Z"
              fill="currentColor"
            />
            <rect x="28" y="34" width="44" height="38" fill="currentColor" opacity="0.7" />
            <path
              d="M32 74 C28 74, 26 71, 26 68 C26 65, 28 62, 32 62 L68 62 C72 62, 74 65, 74 68 C74 71, 72 74, 68 74 Z"
              fill="currentColor"
            />
            <line x1="34" y1="44" x2="62" y2="44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="34" y1="52" x2="56" y2="52" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="34" y1="60" x2="64" y2="60" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'boot':
        return (
          <path
            d="M34 26 L46 26 L46 48 L64 54 C70 56, 74 60, 74 66 L74 70 L28 70 C26 70, 24 68, 24 66 L24 40 C24 34, 28 30, 34 26 Z M30 74 L72 74 L72 78 L30 78 Z"
            fill="currentColor"
          />
        );
      case 'mountain':
        return (
          <g fill="currentColor">
            {/* Sun */}
            <circle cx="50" cy="34" r="8" fill="#f59e0b" />
            {/* Peaks */}
            <polygon points="52,32 74,68 30,68" fill="currentColor" />
            <polygon points="34,44 54,72 14,72" fill="currentColor" opacity="0.8" />
            <line x1="20" y1="74" x2="80" y2="74" stroke="currentColor" strokeWidth="3" />
          </g>
        );
      case 'gem':
        return (
          <polygon
            points="50,22 68,36 60,74 40,74 32,36"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        );
      case 'calendar':
        return (
          <g fill="currentColor">
            <rect x="28" y="28" width="44" height="46" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
            <line x1="28" y1="40" x2="72" y2="40" stroke="currentColor" strokeWidth="3" />
            <rect x="36" y="22" width="4" height="10" rx="2" fill="currentColor" />
            <rect x="60" y="22" width="4" height="10" rx="2" fill="currentColor" />
            <circle cx="42" cy="50" r="3" fill="#f97316" />
            <circle cx="58" cy="50" r="3" fill="#f97316" />
            <circle cx="50" cy="62" r="3" fill="#f97316" />
          </g>
        );
      case 'globe':
        return (
          <g stroke="currentColor" strokeWidth="2.5" fill="none">
            <circle cx="50" cy="50" r="26" />
            <ellipse cx="50" cy="50" rx="14" ry="26" />
            <line x1="24" y1="50" x2="76" y2="50" />
            <line x1="28" y1="36" x2="72" y2="36" />
            <line x1="28" y1="64" x2="72" y2="64" />
          </g>
        );
      case 'camera':
        return (
          <g fill="currentColor">
            <path
              d="M26 38 L34 38 L38 32 L62 32 L66 38 L74 38 C77 38, 80 41, 80 44 L80 70 C80 73, 77 76, 74 76 L26 76 C23 76, 20 73, 20 70 L20 44 C20 41, 23 38, 26 38 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle cx="50" cy="56" r="12" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="50" cy="56" r="5" fill="#f97316" />
            <circle cx="68" cy="44" r="3" fill="#ef4444" />
          </g>
        );
      default:
        return (
          <path
            d="M50 24 L58 40 L76 43 L63 56 L66 74 L50 65 L34 74 L37 56 L24 43 L42 40 Z"
            fill="currentColor"
          />
        );
    }
  };

  return (
    <div
      className={`achievement-medal-wrap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: isUnlocked && showGlow ? `drop-shadow(0 6px 14px ${pal.glow})` : 'none',
        transition: 'transform 0.25s ease, filter 0.25s ease',
      }}
      title={title}
    >
      <svg
        width={cfg.dimension}
        height={cfg.dimension}
        viewBox="0 0 100 100"
        style={{
          display: 'block',
          overflow: 'visible',
          opacity: isUnlocked ? 1 : 0.42,
          filter: isUnlocked ? 'none' : 'grayscale(100%) brightness(0.65)',
        }}
      >
        <defs>
          {/* Metallic Rim Gradient */}
          <linearGradient id={`${uniqueId}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={pal.rimLight} />
            <stop offset="35%" stopColor={pal.rimMid} />
            <stop offset="70%" stopColor={pal.rimDark} />
            <stop offset="100%" stopColor={pal.rimLight} />
          </linearGradient>

          {/* Inner Plate Radial Gradient */}
          <radialGradient id={`${uniqueId}-plate`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={pal.plateGradient[1]} />
            <stop offset="70%" stopColor={pal.plateGradient[0]} />
            <stop offset="100%" stopColor={pal.plateGradient[2]} />
          </radialGradient>

          {/* Polished Sheen Angle */}
          <linearGradient id={`${uniqueId}-sheen`} x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Heavy Metallic Rim */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill={`url(#${uniqueId}-rim)`}
          stroke="#000000"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />

        {/* Ribbed Engraved Laurel Notch Ring */}
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke={pal.rimDark}
          strokeWidth="1.2"
          strokeDasharray="2.5 2"
        />

        {/* Inner Sunken Enamel Plate */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill={`url(#${uniqueId}-plate)`}
          stroke={pal.rimLight}
          strokeWidth="1"
          strokeOpacity="0.6"
        />

        {/* Subtle Sheen Arc Overlay */}
        <path
          d="M16 46 A38 38 0 0 1 84 46 Z"
          fill={`url(#${uniqueId}-sheen)`}
          pointerEvents="none"
        />

        {/* Emblem Symbol Artwork */}
        <g
          color={isUnlocked ? pal.symbolColor : '#94a3b8'}
          style={{
            transformOrigin: 'center',
            filter: isUnlocked ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' : 'none',
          }}
        >
          {renderSymbol()}
        </g>

        {/* Locked Padlock Indicator Overlay if Locked */}
        {!isUnlocked && (
          <g transform="translate(36, 36) scale(0.28)">
            <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#cbd5e1" strokeWidth="4" />
            <path
              d="M34 46 L34 32 C34 23, 66 23, 66 32 L66 46 Z"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="7"
            />
            <rect x="26" y="44" width="48" height="34" rx="5" fill="#f1f5f9" />
            <circle cx="50" cy="58" r="4" fill="#0f172a" />
            <line x1="50" y1="60" x2="50" y2="68" stroke="#0f172a" strokeWidth="3" />
          </g>
        )}

        {/* Bottom Rarity Stars Wreath Notch */}
        {isUnlocked && (
          <g transform="translate(50, 81)">
            {Array.from({ length: starCount }).map((_, idx) => {
              const offset = (idx - (starCount - 1) / 2) * (cfg.starSize * 1.6);
              return (
                <polygon
                  key={idx}
                  points="0,-4 1.2,-1.2 4,-1.2 1.8,0.6 2.6,3.4 0,1.8 -2.6,3.4 -1.8,0.6 -4,-1.2 -1.2,-1.2"
                  fill={pal.starColor}
                  stroke="#000000"
                  strokeWidth="0.5"
                  transform={`translate(${offset}, 0) scale(${cfg.starSize / 4})`}
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}

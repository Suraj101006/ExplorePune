'use client';

import React from 'react';
import { getExperienceDictionary } from '@/lib/experience/i18n';
import { ExperiencePlace } from '@/lib/experience/types';

interface TourHudProps {
  isActive: boolean;
  isPaused: boolean;
  currentLeg: number;
  totalLegs: number;
  startPlace?: ExperiencePlace | null;
  endPlace?: ExperiencePlace | null;
  onPauseToggle: () => void;
  onSkip: () => void;
  onStop: () => void;
  lang?: string;
  className?: string;
}

export default function TourHud({
  isActive,
  isPaused,
  currentLeg,
  totalLegs,
  startPlace,
  endPlace,
  onPauseToggle,
  onSkip,
  onStop,
  lang = 'en',
  className = '',
}: TourHudProps) {
  const dict = getExperienceDictionary(lang);
  const isMr = lang === 'mr';

  if (!isActive) return null;

  const startName = startPlace
    ? isMr
      ? startPlace.name_mr || startPlace.name
      : startPlace.name
    : 'Pune Center';
  const endName = endPlace
    ? isMr
      ? endPlace.name_mr || endPlace.name
      : endPlace.name
    : 'Next Stop';

  const progressPercent = Math.min(100, Math.round(((currentLeg + 1) / totalLegs) * 100));

  return (
    <div
      className={`absolute top-20 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-md p-4 rounded-3xl bg-[#1F242D]/95 backdrop-blur-2xl border border-white/15 shadow-2xl animate-in fade-in slide-in-from-top-4 ${className}`}
      role="region"
      aria-label={dict.map.tourHeading}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#F1293A] text-white flex items-center justify-center animate-pulse">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              {dict.map.tourHeading}
            </h3>
            <p className="text-[10px] text-white/50">
              {dict.map.tourProgress
                .replace('{current}', (currentLeg + 1).toString())
                .replace('{total}', totalLegs.toString())}
            </p>
          </div>
        </div>

        {/* Stop / Close Button */}
        <button
          type="button"
          onClick={onStop}
          aria-label={dict.map.stopTour}
          className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Origin -> Destination Banner */}
      <div className="py-2 px-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-bold text-white mb-3">
        <span className="truncate max-w-[42%] text-[#3880FF]">{startName}</span>
        <svg className="w-3.5 h-3.5 text-[#F1293A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        <span className="truncate max-w-[42%] text-[#00B77F]">{endName}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-[#F1293A] h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-end gap-2 text-xs">
        <button
          type="button"
          onClick={onPauseToggle}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
        >
          {isPaused ? dict.map.resumeTour : dict.map.pauseTour}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
        >
          {dict.map.skipStop}
        </button>
      </div>
    </div>
  );
}

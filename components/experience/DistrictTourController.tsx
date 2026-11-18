'use client';

import React, { useState } from 'react';
import {
  DISTRICT_TOUR_STOPS,
  STORY_TRAILS,
  StoryTrail,
  DistrictTourStop,
  formatCoordinatesDD,
} from '@/lib/experience/puneDistrictData';

interface DistrictTourControllerProps {
  isTouring: boolean;
  isPaused: boolean;
  currentStopIndex: number;
  activeStoryTrailId: string | null;
  onStartTour: () => void;
  onSelectStoryTrail: (trail: StoryTrail) => void;
  onPauseToggle: () => void;
  onSkipNext: () => void;
  onSkipPrev?: () => void;
  onStopTour: () => void;
  lang?: string;
  className?: string;
}

export default function DistrictTourController({
  isTouring,
  isPaused,
  currentStopIndex,
  activeStoryTrailId,
  onStartTour,
  onSelectStoryTrail,
  onPauseToggle,
  onSkipNext,
  onSkipPrev,
  onStopTour,
  lang = 'en',
  className = '',
}: DistrictTourControllerProps) {
  const isMr = lang === 'mr';
  const [showStoryMenu, setShowStoryMenu] = useState<boolean>(false);

  // Active Story Trail or Default District Tour
  const activeTrail = STORY_TRAILS.find((t) => t.id === activeStoryTrailId);

  // Active stop calculation
  let totalStops = DISTRICT_TOUR_STOPS.length;
  let currentStopName = '';
  let currentStopTaluka = '';
  let currentStopSignificance = '';
  let currentCoords = '';

  if (activeTrail) {
    totalStops = activeTrail.stops.length;
    const stop = activeTrail.stops[currentStopIndex] || activeTrail.stops[0];
    if (stop) {
      currentStopName = isMr ? stop.nameMr : stop.nameEn;
      currentStopSignificance = isMr ? stop.significanceMr : stop.significanceEn;
      currentCoords = formatCoordinatesDD(stop.latitude, stop.longitude, 4);
      currentStopTaluka = activeTrail.titleEn;
    }
  } else {
    const stop: DistrictTourStop | undefined = DISTRICT_TOUR_STOPS[currentStopIndex];
    if (stop) {
      currentStopName = isMr ? stop.nameMr : stop.nameEn;
      currentStopTaluka = isMr ? stop.talukaMr : stop.talukaEn;
      currentStopSignificance = isMr ? stop.significanceMr : stop.significanceEn;
      currentCoords = formatCoordinatesDD(stop.latitude, stop.longitude, 4);
    }
  }

  // If idle: show Launcher Pills (Aerial Tour + 5 Curated Story Trails)
  if (!isTouring) {
    return (
      <div className={`absolute top-16 right-4 z-20 flex flex-col items-end gap-2 ${className}`}>
        {/* Story Trails Popover Menu */}
        {showStoryMenu && (
          <div className="p-3 rounded-3xl bg-black/95 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl text-xs space-y-2 w-72 mb-1 animate-in fade-in slide-in-from-top-2 text-white">
            <div className="flex items-center justify-between px-1 pb-1 border-b border-white/10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                {isMr ? 'भौगोलिक कथा मार्ग' : 'GEOGRAPHICAL STORY TRAILS'}
              </span>
              <button
                type="button"
                onClick={() => setShowStoryMenu(false)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 max-h-[320px] overflow-y-auto custom-scrollbar">
              {STORY_TRAILS.map((trail) => (
                <button
                  key={trail.id}
                  type="button"
                  onClick={() => {
                    onSelectStoryTrail(trail);
                    setShowStoryMenu(false);
                  }}
                  className="w-full flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/5 text-left transition-all hover:scale-[1.02]"
                >
                  <span className="text-xl p-1 rounded-xl bg-black/50">{trail.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-xs truncate">
                      {isMr ? trail.titleMr : trail.titleEn}
                    </div>
                    <div className="text-[10px] text-white/50 line-clamp-1 mt-0.5">
                      {isMr ? trail.subtitleMr : trail.subtitleEn}
                    </div>
                    <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {trail.stops.length} {isMr ? 'थांबे' : 'Stops'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          {/* 1. Curated Story Trails Button */}
          <button
            type="button"
            onClick={() => setShowStoryMenu(!showStoryMenu)}
            aria-expanded={showStoryMenu}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-black/85 hover:bg-black text-white shadow-2xl backdrop-blur-md border border-amber-500/40 transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-sm">🧭</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              {isMr ? 'कथा मार्ग' : 'STORY TRAILS'}
            </span>
          </button>

          {/* 2. Autonomous Flyover Launcher Pill */}
          <button
            type="button"
            onClick={onStartTour}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-2xl backdrop-blur-md border border-emerald-400 transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-3 h-3 fill-white text-white translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs font-mono font-black uppercase tracking-wider">
                {isMr ? 'हवाई सफर' : 'FLY OVER DISTRICT'}
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Active Tour HUD
  const progressPercent = Math.round(((currentStopIndex + 1) / totalStops) * 100);

  return (
    <div
      className={`absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-lg p-4 rounded-3xl bg-black/95 backdrop-blur-2xl border border-emerald-400/50 shadow-2xl animate-in fade-in slide-in-from-top-4 text-white ${className}`}
      role="region"
      aria-label="Pune District Aerial Tour Controller"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold animate-pulse">
            <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-emerald-400">
                {activeTrail
                  ? (isMr ? activeTrail.titleMr : activeTrail.titleEn)
                  : (isMr ? 'थेट हवाई सफर सुरू' : 'DISTRICT GEOGRAPHICAL TOUR')}
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                {currentStopIndex + 1} / {totalStops}
              </span>
            </div>
            <p className="text-[10px] font-mono text-white/50 truncate max-w-[280px]">
              {currentStopTaluka}
            </p>
          </div>
        </div>

        {/* Exit Tour Button */}
        <button
          type="button"
          onClick={onStopTour}
          aria-label="Exit tour"
          className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Target Landmark & Coordinates Box */}
      <div className="p-3 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-black text-white truncate max-w-[70%]">
            {currentStopName}
          </span>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
            {currentCoords}
          </span>
        </div>
        <p className="text-[11px] text-white/70 line-clamp-1 leading-snug">
          {currentStopSignificance}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Flight Controls Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {/* Prev Stop Button */}
          {onSkipPrev && (
            <button
              type="button"
              onClick={onSkipPrev}
              disabled={currentStopIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-mono transition-colors"
            >
              <span>⏮</span>
              <span>{isMr ? 'मागे' : 'PREV'}</span>
            </button>
          )}

          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={onPauseToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <span>{isPaused ? '▶ RESUME' : '⏸ PAUSE'}</span>
          </button>
        </div>

        {/* Skip / Next Stop Button */}
        <button
          type="button"
          onClick={onSkipNext}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-lg"
        >
          <span>{currentStopIndex + 1 === totalStops ? (isMr ? 'पूर्ण करा' : 'FINISH') : (isMr ? 'पुढील स्थान' : 'NEXT STOP')}</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

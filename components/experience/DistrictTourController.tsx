'use client';

import React from 'react';
import { DISTRICT_TOUR_STOPS, DistrictTourStop, formatCoordinatesDD } from '@/lib/experience/puneDistrictData';

interface DistrictTourControllerProps {
  isTouring: boolean;
  isPaused: boolean;
  currentStopIndex: number;
  onStartTour: () => void;
  onPauseToggle: () => void;
  onSkipNext: () => void;
  onStopTour: () => void;
  lang?: string;
  className?: string;
}

export default function DistrictTourController({
  isTouring,
  isPaused,
  currentStopIndex,
  onStartTour,
  onPauseToggle,
  onSkipNext,
  onStopTour,
  lang = 'en',
  className = '',
}: DistrictTourControllerProps) {
  const isMr = lang === 'mr';
  const totalStops = DISTRICT_TOUR_STOPS.length;
  const currentStop: DistrictTourStop | undefined = DISTRICT_TOUR_STOPS[currentStopIndex];

  // If tour is idle, show "▶ Start Aerial Tour" floating launcher pill
  if (!isTouring) {
    return (
      <div className={`absolute top-16 right-4 z-20 ${className}`}>
        <button
          type="button"
          onClick={onStartTour}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-2xl backdrop-blur-md border border-emerald-400 transition-all hover:scale-105 active:scale-95 focus:outline-none"
        >
          <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-xs font-mono font-black uppercase tracking-wider">
              {isMr ? 'पुणे जिल्हा हवाई सफर' : 'FLY OVER PUNE DISTRICT'}
            </div>
            <div className="text-[10px] text-emerald-100 font-mono">
              8 Coordinates • Sahyadri to Plains
            </div>
          </div>
        </button>
      </div>
    );
  }

  // Active Tour HUD
  const progressPercent = Math.round(((currentStopIndex + 1) / totalStops) * 100);
  const coords = currentStop
    ? formatCoordinatesDD(currentStop.latitude, currentStop.longitude, 4)
    : '';

  return (
    <div
      className={`absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-lg p-4 rounded-3xl bg-black/90 backdrop-blur-2xl border border-emerald-400/50 shadow-2xl animate-in fade-in slide-in-from-top-4 text-white ${className}`}
      role="region"
      aria-label="Pune District Aerial Tour Controller"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold animate-pulse">
            <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-emerald-400">
                {isMr ? 'थेट हवाई सफर सुरू' : 'AUTONOMOUS DISTRICT FLYOVER'}
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                STOP {currentStopIndex + 1}/{totalStops}
              </span>
            </div>
            <p className="text-[10px] font-mono text-white/50">
              {currentStop ? (isMr ? currentStop.talukaMr : currentStop.talukaEn) : ''}
            </p>
          </div>
        </div>

        {/* Stop Button */}
        <button
          type="button"
          onClick={onStopTour}
          aria-label="Stop tour"
          className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Target Landmark & Coordinates Box */}
      <div className="p-3 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-black text-white truncate max-w-[70%]">
            {currentStop ? (isMr ? currentStop.nameMr : currentStop.nameEn) : ''}
          </span>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
            {coords}
          </span>
        </div>
        <p className="text-[11px] text-white/70 line-clamp-1 leading-snug">
          {currentStop ? (isMr ? currentStop.significanceMr : currentStop.significanceEn) : ''}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[10px] text-white/50">
          ALT: ~{currentStop?.elevationMeters}m MSL
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPauseToggle}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
          >
            {isPaused ? 'RESUME ▶' : 'PAUSE ⏸'}
          </button>
          <button
            type="button"
            onClick={onSkipNext}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
          >
            NEXT STOP ⏭
          </button>
        </div>
      </div>
    </div>
  );
}

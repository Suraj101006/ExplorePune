'use client';

import React, { useState, useEffect } from 'react';
import { formatCoordinatesDD, formatCoordinatesDMS, getTalukaOrRegion } from '@/lib/experience/puneDistrictData';

interface LiveDistrictTelemetryProps {
  cursorLat: number | null;
  cursorLng: number | null;
  pitch: number;
  bearing: number;
  totalLocations: number;
  activePlaceCount: number;
  selectedCategoryName: string;
  onOpenExploreAnywhere?: () => void;
  lang?: string;
  className?: string;
}

export default function LiveDistrictTelemetry({
  cursorLat,
  cursorLng,
  pitch,
  bearing,
  totalLocations,
  activePlaceCount,
  selectedCategoryName,
  onOpenExploreAnywhere,
  lang = 'en',
  className = '',
}: LiveDistrictTelemetryProps) {
  const isMr = lang === 'mr';
  const [istTime, setIstTime] = useState<string>('');
  const [useDms, setUseDms] = useState<boolean>(false);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setIstTime(new Intl.DateTimeFormat('en-IN', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Display coordinates (default to Pune Zero Stone if cursor outside)
  const currentLat = cursorLat ?? 18.5204;
  const currentLng = cursorLng ?? 73.8567;
  const talukaInfo = getTalukaOrRegion(currentLat, currentLng);

  const formattedCoords = useDms
    ? formatCoordinatesDMS(currentLat, currentLng).fullDMS
    : formatCoordinatesDD(currentLat, currentLng, 5);

  return (
    <header
      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-emerald-500/30 text-white shadow-2xl transition-all ${className}`}
      role="banner"
      aria-label="Live Pune District GPS Telemetry"
    >
      {/* District & Status Indicator */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-black uppercase tracking-widest text-emerald-400">
              {isMr ? 'पुणे जिल्हा थेट नकाशा' : 'PUNE DISTRICT • LIVE MAP'}
            </h1>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 font-mono">
              15 TALUKAS
            </span>
          </div>
          <p className="text-[10px] text-white/60 truncate max-w-[180px] sm:max-w-xs">
            {isMr ? talukaInfo.nameMr : talukaInfo.nameEn}
          </p>
        </div>
      </div>

      {/* Center Live Coordinates Display */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 font-mono text-xs">
        <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
          GPS RETICLE:
        </span>
        <span className="text-white font-bold tracking-tight">
          {formattedCoords}
        </span>
        <button
          type="button"
          onClick={() => setUseDms(!useDms)}
          title="Toggle Decimal / DMS format"
          className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 hover:text-white uppercase font-sans hover:bg-white/20 transition-colors ml-1"
        >
          {useDms ? 'DD' : 'DMS'}
        </button>
      </div>

      {/* Right Stats, Quick Search & Camera Pitch */}
      <div className="flex items-center gap-2.5 text-[11px] font-mono">
        {/* Quick Search Shortcut Pill */}
        {onOpenExploreAnywhere && (
          <button
            type="button"
            onClick={onOpenExploreAnywhere}
            title="Explore Anywhere & Jump to GPS Coordinates (Press /)"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all hover:scale-105 active:scale-95"
          >
            <span>🔍</span>
            <span className="hidden sm:inline">{isMr ? 'कुठेही शोधा' : 'EXPLORE'}</span>
            <kbd className="px-1.5 py-0.2 rounded bg-black/50 text-[10px] text-white/60 border border-white/10 font-mono">
              /
            </kbd>
          </button>
        )}

        <div className="hidden sm:flex items-center gap-2 text-white/70">
          <span className="text-white/40">ONLINE:</span>
          <span className="text-emerald-400 font-bold">
            {activePlaceCount}/{totalLocations}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-white/50 text-[10px]">
          <span>PITCH: {Math.round(pitch)}°</span>
          <span>•</span>
          <span>BEARING: {Math.round(bearing)}°</span>
        </div>

        {/* Live IST Clock */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
          <svg className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth={2} strokeDasharray="4 2" />
          </svg>
          <span>{istTime || 'IST'}</span>
        </div>
      </div>
    </header>
  );
}

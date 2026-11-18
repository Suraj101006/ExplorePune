'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Navigation, Search, Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { formatCoordinatesDD, formatCoordinatesDMS, getTalukaOrRegion } from '@/lib/experience/puneDistrictData';
import { TimeOfDayKey } from './DistrictMapControls';

interface LiveDistrictTelemetryProps {
  cursorLat: number | null;
  cursorLng: number | null;
  pitch: number;
  bearing: number;
  totalLocations: number;
  activePlaceCount: number;
  selectedCategoryName: string;
  timeOfDay?: TimeOfDayKey;
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
  timeOfDay = 'afternoon',
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
      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/15 text-white shadow-2xl transition-all select-none ${className}`}
      role="banner"
      aria-label="Live Pune District Map Status"
    >
      {/* 1. District & Real-time Compass Needle */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex items-center justify-center p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 transition-transform duration-300"
          title={`Camera Heading: ${Math.round(bearing)}°`}
        >
          <Compass
            size={18}
            className="transition-transform duration-300"
            style={{ transform: `rotate(${-Math.round(bearing)}deg)` }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-black uppercase tracking-wider text-white truncate">
              {isMr ? 'पुणे जिल्हा थेट नकाशा' : 'EXPLORE PUNE DISTRICT'}
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex-shrink-0">
              15 TALUKAS
            </span>
          </div>
          <p className="text-[10px] text-white/60 truncate font-mono">
            {isMr ? talukaInfo.nameMr : talukaInfo.nameEn}
          </p>
        </div>
      </div>

      {/* 2. Center Live Coordinates Display (Strictly Non-Wrapping) */}
      <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs flex-shrink-0">
        <Navigation
          size={13}
          className="text-amber-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: `rotate(${-Math.round(bearing)}deg)` }}
        />
        <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
          COORDINATES:
        </span>
        <span className="text-white font-black tracking-tight whitespace-nowrap">
          {formattedCoords}
        </span>
        <button
          type="button"
          onClick={() => setUseDms(!useDms)}
          title="Toggle Decimal Degrees / DMS format"
          className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 hover:text-white uppercase font-sans hover:bg-white/20 transition-colors ml-1 font-bold"
        >
          {useDms ? 'DD' : 'DMS'}
        </button>
      </div>

      {/* 3. Right Stats, Quick Search & Live Clock */}
      <div className="flex items-center gap-2.5 text-[11px] font-mono flex-shrink-0">
        {/* Quick Search Shortcut Pill */}
        {onOpenExploreAnywhere && (
          <button
            type="button"
            onClick={onOpenExploreAnywhere}
            title="Explore Anywhere & Jump to GPS Coordinates (Press /)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all hover:scale-105 active:scale-95"
          >
            <Search size={13} />
            <span className="hidden sm:inline">{isMr ? 'कुठेही शोधा' : 'EXPLORE'}</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white/70 border border-white/10 font-mono">
              /
            </kbd>
          </button>
        )}

        {/* Places Count */}
        <div className="hidden sm:flex items-center gap-1.5 text-white/70 text-xs">
          <span className="text-white/40">Places:</span>
          <span className="text-emerald-400 font-black">
            {activePlaceCount}/{totalLocations}
          </span>
        </div>

        {/* Pitch / Bearing Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-white/50 text-[10px]">
          <span>{Math.round(pitch)}° TILT</span>
        </div>

        {/* Live IST Clock & Atmosphere Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-emerald-300 font-bold text-xs whitespace-nowrap">
          <Clock size={12} className="text-emerald-400 flex-shrink-0" />
          <span>{istTime || 'IST'}</span>
        </div>
      </div>
    </header>
  );
}

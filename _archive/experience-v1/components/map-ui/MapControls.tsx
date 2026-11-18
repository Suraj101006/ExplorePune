'use client';

import React from 'react';
import { getExperienceDictionary } from '@/lib/experience/i18n';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleTilt: () => void;
  onLocateUser: () => void;
  lang?: string;
  is3d?: boolean;
  className?: string;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleTilt,
  onLocateUser,
  lang = 'en',
  is3d = true,
  className = '',
}: MapControlsProps) {
  const dict = getExperienceDictionary(lang);

  return (
    <div
      className={`absolute bottom-6 right-4 z-20 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-[#1F242D]/90 backdrop-blur-md border border-white/10 shadow-2xl ${className}`}
      role="group"
      aria-label="Map Navigation Controls"
    >
      {/* Zoom In */}
      <button
        type="button"
        onClick={onZoomIn}
        aria-label={dict.map.ctrlZoomIn}
        title={dict.map.ctrlZoomIn}
        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Zoom Out */}
      <button
        type="button"
        onClick={onZoomOut}
        aria-label={dict.map.ctrlZoomOut}
        title={dict.map.ctrlZoomOut}
        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <div className="w-6 h-px bg-white/10 my-0.5" />

      {/* Reset Center / Compass */}
      <button
        type="button"
        onClick={onResetView}
        aria-label={dict.map.ctrlReset}
        title={dict.map.ctrlReset}
        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v3m0 12v3m-9-9h3m12 0h3"
          />
        </svg>
      </button>

      {/* 2D / 3D Tilt Toggle */}
      <button
        type="button"
        onClick={onToggleTilt}
        aria-label={is3d ? dict.map.ctrlTilt2d : dict.map.ctrlTilt3d}
        title={is3d ? dict.map.ctrlTilt2d : dict.map.ctrlTilt3d}
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
          is3d ? 'bg-[#3880FF] text-white shadow-md' : 'bg-white/5 hover:bg-white/15 text-white/70'
        }`}
      >
        {is3d ? '3D' : '2D'}
      </button>

      {/* Locate User */}
      <button
        type="button"
        onClick={onLocateUser}
        aria-label={dict.map.ctrlLocation}
        title={dict.map.ctrlLocation}
        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );
}

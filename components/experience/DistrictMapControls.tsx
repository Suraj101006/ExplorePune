'use client';

import React, { useState } from 'react';
import { MapStyleKey, MAP_STYLE_OPTIONS } from '@/lib/experience/puneDistrictData';

interface DistrictMapControlsProps {
  currentStyle: MapStyleKey;
  onSelectStyle: (style: MapStyleKey) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetDistrictView: () => void;
  onToggleTilt: () => void;
  onLocateUser: () => void;
  is3d: boolean;
  lang?: string;
  className?: string;
}

export default function DistrictMapControls({
  currentStyle,
  onSelectStyle,
  onZoomIn,
  onZoomOut,
  onResetDistrictView,
  onToggleTilt,
  onLocateUser,
  is3d,
  lang = 'en',
  className = '',
}: DistrictMapControlsProps) {
  const isMr = lang === 'mr';
  const [showStyleMenu, setShowStyleMenu] = useState<boolean>(false);

  return (
    <div
      className={`absolute bottom-6 right-4 z-20 flex flex-col items-end gap-2 ${className}`}
      role="group"
      aria-label="Map Visuals & Navigation Controls"
    >
      {/* Style Switcher Popover */}
      {showStyleMenu && (
        <div className="p-2.5 rounded-2xl bg-black/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl text-xs space-y-1 mb-1 w-52 animate-in fade-in slide-in-from-bottom-2 text-white">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 py-1 border-b border-white/10">
            {isMr ? 'नकाशा प्रकार निवडा' : 'SELECT REAL MAP STYLE'}
          </div>

          {MAP_STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                onSelectStyle(opt.key);
                setShowStyleMenu(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors font-mono text-xs ${
                currentStyle === opt.key
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <span className="text-base">{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{isMr ? opt.labelMr : opt.labelEn}</div>
                <div className="text-[9px] text-white/40 truncate">{opt.descriptionEn}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Buttons Bar */}
      <div className="flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-black/85 backdrop-blur-md border border-emerald-500/30 shadow-2xl">
        {/* Style Switcher Toggle Button */}
        <button
          type="button"
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          aria-expanded={showStyleMenu}
          title="Switch Map Layers (Real Satellite / Topo / Dark)"
          className="w-9 h-9 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 flex items-center justify-center border border-emerald-500/40 transition-colors"
        >
          <span className="text-sm">🛰️</span>
        </button>

        <div className="w-6 h-px bg-white/10 my-0.5" />

        {/* Zoom In */}
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom In"
          aria-label="Zoom in"
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom Out"
          aria-label="Zoom out"
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <div className="w-6 h-px bg-white/10 my-0.5" />

        {/* Reset District View (Compass) */}
        <button
          type="button"
          onClick={onResetDistrictView}
          title="Reset to Full Pune District Extent"
          aria-label="Reset to full Pune district view"
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v3m0 12v3m-9-9h3m12 0h3" />
          </svg>
        </button>

        {/* 2D / 3D Tilt Toggle */}
        <button
          type="button"
          onClick={onToggleTilt}
          title={is3d ? 'Switch to Flat 2D View' : 'Switch to 3D Tilted Perspective'}
          aria-label="Toggle 2D/3D perspective"
          className={`w-9 h-9 rounded-xl font-mono text-xs font-black transition-colors ${
            is3d
              ? 'bg-emerald-500 text-black shadow-md'
              : 'bg-white/5 hover:bg-white/15 text-white/70'
          }`}
        >
          {is3d ? '3D' : '2D'}
        </button>

        {/* Locate User GPS */}
        <button
          type="button"
          onClick={onLocateUser}
          title="Locate My GPS Position"
          aria-label="Locate my position on district map"
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Map,
  Landmark,
  Droplets,
  Route,
  MapPin,
  Layers,
  Satellite,
  Mountain,
  Moon,
} from 'lucide-react';
import { MapStyleKey, MAP_STYLE_OPTIONS } from '@/lib/experience/puneDistrictData';

export interface MapLayerState {
  districtBoundary: boolean;
  talukaBoundaries: boolean;
  rivers: boolean;
  highways: boolean;
  markers: boolean;
}

interface DistrictMapControlsProps {
  currentStyle: MapStyleKey;
  layerState: MapLayerState;
  onSelectStyle: (style: MapStyleKey) => void;
  onToggleLayer: (layerKey: keyof MapLayerState) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetDistrictView: () => void;
  onToggleTilt: () => void;
  onLocateUser: () => void;
  onReplayIntro?: () => void;
  is3d: boolean;
  lang?: string;
  className?: string;
}

export default function DistrictMapControls({
  currentStyle,
  layerState,
  onSelectStyle,
  onToggleLayer,
  onZoomIn,
  onZoomOut,
  onResetDistrictView,
  onToggleTilt,
  onLocateUser,
  onReplayIntro,
  is3d,
  lang = 'en',
  className = '',
}: DistrictMapControlsProps) {
  const isMr = lang === 'mr';
  const [showStyleMenu, setShowStyleMenu] = useState<boolean>(false);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  return (
    <div
      className={`absolute bottom-6 right-4 z-20 flex flex-col items-end gap-2 ${className}`}
      role="group"
      aria-label="Map Visuals & Navigation Controls"
    >
      {/* Layer Toggles Popover */}
      {showLayerMenu && (
        <div className="p-3 rounded-2xl bg-black/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl text-xs space-y-2 mb-1 w-64 animate-in fade-in slide-in-from-bottom-2 text-white select-none">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-1 pb-1 border-b border-white/10 flex items-center justify-between">
            <span>{isMr ? 'भौगोलिक स्तर (LAYERS)' : 'GEOGRAPHIC LAYERS'}</span>
            <button
              type="button"
              onClick={() => setShowLayerMenu(false)}
              className="text-white/40 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5">
            {/* 1. District Boundary */}
            <label className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-xs font-mono">
                <Map size={14} className="text-emerald-400" />
                <span>{isMr ? 'जिल्हा सीमा' : 'District Boundary'}</span>
              </span>
              <input
                type="checkbox"
                checked={layerState.districtBoundary}
                onChange={() => onToggleLayer('districtBoundary')}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </label>

            {/* 2. Taluka Boundaries */}
            <label className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-xs font-mono">
                <Landmark size={14} className="text-amber-400" />
                <span>{isMr ? '१५ तालुके सीमा' : '15 Taluka Boundaries'}</span>
              </span>
              <input
                type="checkbox"
                checked={layerState.talukaBoundaries}
                onChange={() => onToggleLayer('talukaBoundaries')}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </label>

            {/* 3. Rivers & Reservoirs */}
            <label className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-xs font-mono">
                <Droplets size={14} className="text-cyan-400" />
                <span>{isMr ? 'नद्या व जलाशय' : 'Rivers & Reservoirs'}</span>
              </span>
              <input
                type="checkbox"
                checked={layerState.rivers}
                onChange={() => onToggleLayer('rivers')}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </label>

            {/* 4. Major Highways */}
            <label className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-xs font-mono">
                <Route size={14} className="text-indigo-400" />
                <span>{isMr ? 'प्रमुख महामार्ग' : 'Major Highways'}</span>
              </span>
              <input
                type="checkbox"
                checked={layerState.highways}
                onChange={() => onToggleLayer('highways')}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </label>

            {/* 5. Destination Markers */}
            <label className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-xs font-mono">
                <MapPin size={14} className="text-rose-400" />
                <span>{isMr ? '१०६ जीपीएस स्थाने' : '106 GPS Landmarks'}</span>
              </span>
              <input
                type="checkbox"
                checked={layerState.markers}
                onChange={() => onToggleLayer('markers')}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* Style Switcher Popover */}
      {showStyleMenu && (
        <div className="p-2.5 rounded-2xl bg-black/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl text-xs space-y-1 mb-1 w-56 animate-in fade-in slide-in-from-bottom-2 text-white">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 py-1 border-b border-white/10 flex items-center justify-between">
            <span>{isMr ? 'नकाशा प्रकार निवडा' : 'SELECT MAP STYLE'}</span>
            <button
              type="button"
              onClick={() => setShowStyleMenu(false)}
              className="text-white/40 hover:text-white"
            >
              ✕
            </button>
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
              <span className="flex-shrink-0 text-emerald-400">
                {opt.key === 'satellite' && <Satellite size={16} />}
                {opt.key === 'topo' && <Mountain size={16} />}
                {opt.key === 'dark' && <Moon size={16} />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{isMr ? opt.labelMr : opt.labelEn}</div>
                <div className="text-[9px] text-white/40 truncate">{opt.descriptionEn}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Controls Dock */}
      <div className="flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-black/85 backdrop-blur-md border border-emerald-500/30 shadow-2xl">
        {/* Style Switcher Button */}
        <button
          type="button"
          onClick={() => {
            setShowStyleMenu(!showStyleMenu);
            setShowLayerMenu(false);
          }}
          aria-expanded={showStyleMenu}
          title="Switch Map Layers (Satellite / Topo / Dark)"
          className="w-9 h-9 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 flex items-center justify-center border border-emerald-500/40 transition-colors"
        >
          <Layers size={16} />
        </button>

        {/* Geographic Layers Toggle Menu Button */}
        <button
          type="button"
          onClick={() => {
            setShowLayerMenu(!showLayerMenu);
            setShowStyleMenu(false);
          }}
          aria-expanded={showLayerMenu}
          title="Toggle Geographic Layers (District, Talukas, Rivers, Roads)"
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-emerald-400 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
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

        {/* Reset District View */}
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

        {/* Locate User via Browser Geolocation */}
        <button
          type="button"
          onClick={onLocateUser}
          title="Locate My Position on Pune District Map"
          aria-label="Locate my position on map"
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-cyan-400 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Replay Intro Calibration Button */}
        {onReplayIntro && (
          <button
            type="button"
            onClick={onReplayIntro}
            title="Replay Opening Geographical Calibration"
            aria-label="Replay intro"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white/50 hover:text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

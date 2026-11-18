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
  Sun,
  Sunset,
  Sunrise,
  Compass,
  Volume2,
  VolumeX,
  Maximize2,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { MapStyleKey, MAP_STYLE_OPTIONS } from '@/lib/experience/puneDistrictData';

export type TimeOfDayKey = 'morning' | 'afternoon' | 'golden' | 'night' | 'auto';

export interface MapLayerState {
  districtBoundary: boolean;
  talukaBoundaries: boolean;
  rivers: boolean;
  highways: boolean;
  markers: boolean;
}

interface DistrictMapControlsProps {
  currentStyle: MapStyleKey;
  timeOfDay?: TimeOfDayKey;
  layerState: MapLayerState;
  onSelectStyle: (style: MapStyleKey) => void;
  onSelectTimeOfDay?: (tod: TimeOfDayKey) => void;
  onToggleLayer: (layerKey: keyof MapLayerState) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetDistrictView: () => void;
  onToggleTilt: () => void;
  onLocateUser: () => void;
  onToggleDrift?: () => void;
  onToggleSound?: () => void;
  onToggleFullscreen?: () => void;
  onReplayIntro?: () => void;
  is3d: boolean;
  isDrifting?: boolean;
  isSoundActive?: boolean;
  lang?: string;
  className?: string;
}

export default function DistrictMapControls({
  currentStyle,
  timeOfDay = 'afternoon',
  layerState,
  onSelectStyle,
  onSelectTimeOfDay,
  onToggleLayer,
  onZoomIn,
  onZoomOut,
  onResetDistrictView,
  onToggleTilt,
  onLocateUser,
  onToggleDrift,
  onToggleSound,
  onToggleFullscreen,
  onReplayIntro,
  is3d,
  isDrifting = false,
  isSoundActive = false,
  lang = 'en',
  className = '',
}: DistrictMapControlsProps) {
  const isMr = lang === 'mr';
  const [showStyleMenu, setShowStyleMenu] = useState<boolean>(false);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  return (
    <div
      className={`absolute bottom-6 right-4 z-20 flex flex-col items-end gap-2.5 ${className}`}
      role="group"
      aria-label="Map Visuals & Navigation Controls"
    >
      {/* 1. Layer Toggles Popover */}
      {showLayerMenu && (
        <div className="p-3.5 rounded-3xl bg-black/95 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl text-xs space-y-2 mb-1 w-64 animate-in fade-in slide-in-from-bottom-2 text-white select-none">
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
            <label className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
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
            <label className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
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
            <label className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
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
            <label className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-xs font-mono">
                <Route size={14} className="text-amber-300" />
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
            <label className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors">
              <span className="flex items-center gap-2 text-xs font-mono">
                <MapPin size={14} className="text-rose-400" />
                <span>{isMr ? '१०६ स्थळ निर्देशक' : '106 Landmark Pins'}</span>
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

      {/* 2. Basemap Style & Atmosphere Popover */}
      {showStyleMenu && (
        <div className="p-3.5 rounded-3xl bg-black/95 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl text-xs space-y-3 mb-1 w-64 animate-in fade-in slide-in-from-bottom-2 text-white select-none">
          {/* Basemaps Section */}
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 pb-1 border-b border-white/10 flex items-center justify-between mb-2">
              <span>{isMr ? 'नकाशा प्रकार' : 'BASEMAP CARTOGRAPHY'}</span>
              <button
                type="button"
                onClick={() => setShowStyleMenu(false)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  onSelectStyle('satellite');
                  setShowStyleMenu(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all ${
                  currentStyle === 'satellite'
                    ? 'bg-emerald-500/20 border border-emerald-400 text-white font-bold'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80'
                }`}
              >
                <Satellite size={15} className="text-emerald-400" />
                <div>
                  <div className="text-xs font-mono">{isMr ? 'उपग्रह छायाचित्र' : 'Satellite Imagery'}</div>
                  <div className="text-[9px] text-white/40">Esri World High-Res</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectStyle('topo');
                  setShowStyleMenu(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all ${
                  currentStyle === 'topo'
                    ? 'bg-emerald-500/20 border border-emerald-400 text-white font-bold'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80'
                }`}
              >
                <Mountain size={15} className="text-amber-400" />
                <div>
                  <div className="text-xs font-mono">{isMr ? 'भूरूप (टोपोग्राफी)' : 'Topographic Relief'}</div>
                  <div className="text-[9px] text-white/40">Sahyadri elevation ridges</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectStyle('dark');
                  setShowStyleMenu(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all ${
                  currentStyle === 'dark'
                    ? 'bg-emerald-500/20 border border-emerald-400 text-white font-bold'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80'
                }`}
              >
                <Moon size={15} className="text-cyan-400" />
                <div>
                  <div className="text-xs font-mono">{isMr ? 'डार्क टॅक्टिकल' : 'Dark Tactical GIS'}</div>
                  <div className="text-[9px] text-white/40">Luminous neon vector</div>
                </div>
              </button>
            </div>
          </div>

          {/* Time of Day Lighting Section */}
          {onSelectTimeOfDay && (
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1.5">
                {isMr ? 'वेळ व वातावरण प्रकाश' : 'ATMOSPHERIC LIGHTING'}
              </span>
              <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => onSelectTimeOfDay('morning')}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-colors ${
                    timeOfDay === 'morning'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Sunrise size={12} className="text-amber-400" />
                  <span>Morning</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTimeOfDay('afternoon')}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-colors ${
                    timeOfDay === 'afternoon'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                      : 'bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Sun size={12} className="text-sky-400" />
                  <span>Daylight</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTimeOfDay('golden')}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-colors ${
                    timeOfDay === 'golden'
                      ? 'bg-orange-500/20 border-orange-400 text-orange-300 font-bold'
                      : 'bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Sunset size={12} className="text-orange-400" />
                  <span>Sunset</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTimeOfDay('night')}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-colors ${
                    timeOfDay === 'night'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Moon size={12} className="text-cyan-400" />
                  <span>Night</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Floating Tool Column */}
      <div className="flex flex-col gap-1.5 p-1.5 rounded-3xl bg-black/90 backdrop-blur-2xl border border-white/15 shadow-2xl text-white select-none">
        {/* Layer Toggles Button */}
        <button
          type="button"
          onClick={() => {
            setShowLayerMenu(!showLayerMenu);
            setShowStyleMenu(false);
          }}
          title={isMr ? 'भौगोलिक स्तर' : 'Geographic Layers'}
          aria-label="Toggle map layers"
          className={`p-2.5 rounded-2xl transition-all ${
            showLayerMenu ? 'bg-emerald-500 text-black font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'
          }`}
        >
          <Layers size={18} />
        </button>

        {/* Style & Atmosphere Button */}
        <button
          type="button"
          onClick={() => {
            setShowStyleMenu(!showStyleMenu);
            setShowLayerMenu(false);
          }}
          title={isMr ? 'नकाशा व वातावरण' : 'Map Style & Atmosphere'}
          aria-label="Toggle map styles and atmosphere"
          className={`p-2.5 rounded-2xl transition-all ${
            showStyleMenu ? 'bg-emerald-500 text-black font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'
          }`}
        >
          <Satellite size={18} />
        </button>

        {/* 3D Tilt Perspective Toggle */}
        <button
          type="button"
          onClick={onToggleTilt}
          title={is3d ? 'Switch to 2D Flat View' : 'Switch to 3D Perspective View'}
          aria-label="Toggle 2D or 3D terrain pitch"
          className="p-2.5 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all font-mono text-xs font-black"
        >
          <span className={`px-1 py-0.5 rounded text-[10px] ${is3d ? 'bg-emerald-500 text-black font-bold' : 'bg-white/10 text-white/60'}`}>
            {is3d ? '3D' : '2D'}
          </span>
        </button>

        {/* Ambient 3D Camera Drift Toggle */}
        {onToggleDrift && (
          <button
            type="button"
            onClick={onToggleDrift}
            title={isDrifting ? 'Pause Cinematic Drift' : 'Enable Cinematic 3D Drift'}
            aria-label="Toggle idle camera drift"
            className={`p-2.5 rounded-2xl transition-all ${
              isDrifting ? 'bg-emerald-500/30 text-emerald-300' : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Compass size={18} className={isDrifting ? 'animate-spin' : ''} style={{ animationDuration: '8s' }} />
          </button>
        )}

        {/* Sound Atmosphere Toggle */}
        {onToggleSound && (
          <button
            type="button"
            onClick={onToggleSound}
            title={isSoundActive ? 'Mute Ambient Audio' : 'Play Sahyadri Nature Breeze Audio'}
            aria-label="Toggle ambient nature sound"
            className={`p-2.5 rounded-2xl transition-all ${
              isSoundActive ? 'bg-emerald-500 text-black font-bold' : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            {isSoundActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        )}

        {/* Fullscreen Mode Toggle */}
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            title="Toggle Edge-to-Edge Fullscreen"
            aria-label="Fullscreen map view"
            className="p-2.5 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all"
          >
            <Maximize2 size={17} />
          </button>
        )}

        {/* Divider */}
        <div className="w-5 h-px bg-white/15 mx-auto my-0.5" />

        {/* Zoom In */}
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom In"
          aria-label="Zoom in on map"
          className="p-2.5 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all font-mono font-bold text-sm"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom Out"
          aria-label="Zoom out on map"
          className="p-2.5 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all font-mono font-bold text-sm"
        >
          −
        </button>

        {/* Reset District View */}
        <button
          type="button"
          onClick={onResetDistrictView}
          title={isMr ? 'संपूर्ण जिल्हा केंद्र' : 'Reset to Full Pune District Extent'}
          aria-label="Reset map bounds to entire Pune district"
          className="p-2.5 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all"
        >
          <RotateCcw size={16} />
        </button>

        {/* Locate User */}
        <button
          type="button"
          onClick={onLocateUser}
          title={isMr ? 'माझे स्थान शोधा' : 'Locate My Position'}
          aria-label="Find and center on my location"
          className="p-2.5 rounded-2xl hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-all"
        >
          <MapPin size={17} />
        </button>
      </div>
    </div>
  );
}

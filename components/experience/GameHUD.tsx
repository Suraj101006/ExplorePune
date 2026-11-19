'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  Flag,
  Sun,
  Sunset,
  Sunrise,
  Moon,
  Trophy,
  Globe2,
  Eye,
  Camera,
  Navigation,
  Layers,
  Mountain,
  Map,
  BookOpen,
  MapPin,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { TimeOfDayKey } from './DistrictMapControls';
import { getTalukaOrRegion } from '@/lib/experience/puneDistrictData';
import { ambientAudio } from '@/lib/experience/ambientAudio';

export type GameMapMode = 'open-world' | 'satellite' | 'classic';
export type CameraModeKey = 'world' | 'explorer' | 'destination' | 'cinematic' | 'navigation';

interface GameHUDProps {
  bearing: number;
  pitch: number;
  zoom: number;
  centerLat: number;
  centerLng: number;
  mapMode: GameMapMode;
  cameraMode: CameraModeKey;
  timeOfDay: TimeOfDayKey;
  onSelectMapMode: (mode: GameMapMode) => void;
  onSelectCameraMode: (mode: CameraModeKey) => void;
  onSelectTimeOfDay: (tod: TimeOfDayKey) => void;
  onOpenMissions: () => void;
  onOpenAchievements: () => void;
  onOpenSearch: () => void;
  onToggleAtlas: () => void;
  isAtlasOpen: boolean;
  onToggleRegions: () => void;
  isRegionsOpen: boolean;
  totalLocations: number;
  unlockedTrophiesCount?: number;
  totalTrophiesCount?: number;
  onPlayCityFlyover?: () => void;
  onPlayDistrictIntro?: () => void;
  isRealGpsActive?: boolean;
  gpsAccuracyMeters?: number | null;
  onToggleGps?: () => void;
  lang?: string;
  className?: string;
}

function GameHUD({
  bearing,
  pitch,
  zoom,
  centerLat,
  centerLng,
  mapMode,
  cameraMode,
  timeOfDay,
  onSelectMapMode,
  onSelectCameraMode,
  onSelectTimeOfDay,
  onOpenMissions,
  onOpenAchievements,
  onOpenSearch,
  onToggleAtlas,
  isAtlasOpen,
  onToggleRegions,
  isRegionsOpen,
  totalLocations,
  unlockedTrophiesCount = 0,
  totalTrophiesCount = 6,
  onPlayCityFlyover,
  onPlayDistrictIntro,
  isRealGpsActive = false,
  gpsAccuracyMeters,
  onToggleGps,
  lang = 'en',
  className = '',
}: GameHUDProps) {
  const isMr = lang === 'mr';
  const taluka = useMemo(() => getTalukaOrRegion(centerLat, centerLng), [centerLat, centerLng]);

  // Normalized bearing [0, 360)
  const normBearing = Math.round(((bearing % 360) + 360) % 360);

  // Compass Heading Name
  const headingName = useMemo(() => {
    const deg = normBearing;
    if (deg >= 337.5 || deg < 22.5) return 'N';
    if (deg >= 22.5 && deg < 67.5) return 'NE';
    if (deg >= 67.5 && deg < 112.5) return 'E';
    if (deg >= 112.5 && deg < 157.5) return 'SE';
    if (deg >= 157.5 && deg < 202.5) return 'S';
    if (deg >= 202.5 && deg < 247.5) return 'SW';
    if (deg >= 247.5 && deg < 292.5) return 'W';
    return 'NW';
  }, [normBearing]);

  // Next time of day toggle
  const nextTimeOfDay = () => {
    const list: TimeOfDayKey[] = ['day', 'golden', 'sunset', 'night'];
    const current = (timeOfDay === 'morning' || timeOfDay === 'afternoon') ? 'day' : timeOfDay;
    const idx = list.indexOf(current as TimeOfDayKey);
    const next = list[(idx + 1) % list.length];
    onSelectTimeOfDay(next);
    ambientAudio.playUiBlip(760, 0.04);
  };

  return (
    <header
      className={`select-none pointer-events-none ${className}`}
      aria-label="GTA Game Navigation HUD"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 px-3 py-2 pointer-events-auto">
        {/* Left: Brand Crest & Region Banner */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 hover:border-emerald-500/50 shadow-2xl transition-all hover:scale-105"
            title="Explore Pune Homepage"
          >
            <BrandLogo size={36} withBadge alt="Explore Pune" />
          </Link>

          {/* Current Taluka Indicator */}
          <div className="hidden sm:flex flex-col px-3 py-1 rounded-2xl bg-black/85 backdrop-blur-xl border border-emerald-500/30 text-white font-mono shadow-xl">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isMr ? 'पुणे ओपन-वर्ल्ड' : 'PUNE OPEN WORLD'}</span>
              <span className="text-white/40">•</span>
              <span className="text-amber-300 truncate max-w-[110px]">
                {isMr ? taluka.nameMr : taluka.nameEn}
              </span>
            </div>
            <div className="text-[9px] text-white/50 tracking-tight flex items-center gap-2">
              <span>{centerLat.toFixed(3)}°N, {centerLng.toFixed(3)}°E</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{totalLocations} LOCS</span>
            </div>
          </div>

          {/* Pune Atlas Sidebar Trigger */}
          <button
            type="button"
            onClick={() => {
              onToggleAtlas();
              ambientAudio.playUiBlip(820, 0.04);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border font-mono text-xs font-bold transition-all shadow-xl ${
              isAtlasOpen
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-emerald-950/50'
                : 'bg-black/80 hover:bg-black text-white/80 hover:text-white border-white/15'
            }`}
            title="Toggle Pune Atlas Directory"
          >
            <BookOpen size={13} />
            <span className="hidden md:inline">{isMr ? 'सूची' : 'ATLAS'}</span>
          </button>

          {/* GPS Live Location Toggle */}
          {onToggleGps && (
            <button
              type="button"
              onClick={() => {
                onToggleGps();
                ambientAudio.playUiBlip(880, 0.04);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border font-mono text-xs font-bold transition-all shadow-xl ${
                isRealGpsActive
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400/60 shadow-sky-950/50'
                  : 'bg-black/80 hover:bg-black text-white/70 hover:text-white border-white/15'
              }`}
              title={isRealGpsActive ? `Live GPS Locked (±${gpsAccuracyMeters || 15}m)` : 'Detect My Live Location'}
            >
              <Navigation
                size={12}
                className={isRealGpsActive ? 'text-sky-400 animate-pulse' : 'text-white/60'}
              />
              <span className="hidden sm:inline">
                {isRealGpsActive ? `GPS ±${gpsAccuracyMeters || 15}m` : (isMr ? 'स्थान' : 'GPS')}
              </span>
            </button>
          )}

          {/* 15 Talukas Quick Toggle */}
          <button
            type="button"
            onClick={() => {
              onToggleRegions();
              ambientAudio.playUiBlip(780, 0.04);
            }}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border font-mono text-xs font-bold transition-all shadow-xl ${
              isRegionsOpen
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-black/80 hover:bg-black text-white/70 hover:text-white border-white/15'
            }`}
            title="Toggle 15 Talukas Region Navigator"
          >
            <MapPin size={12} />
            <span>{isMr ? 'तालुके (१५)' : 'REGIONS (15)'}</span>
          </button>
        </div>

        {/* Center: Dynamic Game Compass Tape & Camera Modes */}
        <div className="flex-1 max-w-sm hidden md:flex flex-col items-center gap-1">
          {/* Compass Ribbon Strip */}
          <div className="w-full relative px-4 py-1 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden text-white font-mono flex items-center justify-between">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-amber-400 z-10" />
            <span className="text-white/40 text-[10px]">
              {Math.round(((normBearing - 45 + 360) % 360))}°
            </span>
            <span className="text-amber-400 font-black text-xs px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
              {normBearing.toString().padStart(3, '0')}° {headingName}
            </span>
            <span className="text-white/40 text-[10px]">
              {Math.round(((normBearing + 45) % 360))}°
            </span>
          </div>

          {/* 5 GTA Camera Modes Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white">
            <button
              type="button"
              onClick={() => {
                onSelectCameraMode('world');
                ambientAudio.playUiBlip(800, 0.04);
              }}
              className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
                cameraMode === 'world' ? 'bg-emerald-500 text-black font-black' : 'text-white/60 hover:text-white'
              }`}
              title="World View: Wide aerial overview of Pune District"
            >
              <Globe2 size={10} />
              <span>WORLD</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectCameraMode('explorer');
                ambientAudio.playUiBlip(840, 0.04);
              }}
              className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
                cameraMode === 'explorer' ? 'bg-emerald-500 text-black font-black' : 'text-white/60 hover:text-white'
              }`}
              title="Explorer View: 3D angled terrain & towns"
            >
              <Eye size={10} />
              <span>EXPLORER</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectCameraMode('destination');
                ambientAudio.playUiBlip(880, 0.04);
              }}
              className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
                cameraMode === 'destination' ? 'bg-emerald-500 text-black font-black' : 'text-white/60 hover:text-white'
              }`}
              title="Destination View: Close 3D camera focused on landmark"
            >
              <MapPin size={10} />
              <span>DEST</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectCameraMode('cinematic');
                ambientAudio.playUiBlip(920, 0.04);
              }}
              className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
                cameraMode === 'cinematic' ? 'bg-amber-400 text-black font-black animate-pulse' : 'text-white/60 hover:text-white'
              }`}
              title="Cinematic View: Continuous 360° circular orbit flyover"
            >
              <Camera size={10} />
              <span>ORBIT</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectCameraMode('navigation');
                ambientAudio.playUiBlip(960, 0.04);
              }}
              className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
                cameraMode === 'navigation' ? 'bg-cyan-400 text-black font-black' : 'text-white/60 hover:text-white'
              }`}
              title="Navigation View: Route-following camera"
            >
              <Navigation size={10} />
              <span>GPS</span>
            </button>
          </div>
        </div>

        {/* Right: Trophies, Missions, Flyover, Time-of-Day, Search */}
        <div className="flex items-center gap-1.5">
          {/* Achievements / Trophies Button */}
          <button
            type="button"
            onClick={() => {
              onOpenAchievements();
              ambientAudio.playUiBlip(1040, 0.05);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-amber-950/40"
            title="Exploration Trophies & Milestones"
          >
            <Trophy size={13} className="text-amber-400" />
            <span className="hidden sm:inline font-bold">
              {unlockedTrophiesCount}/{totalTrophiesCount}
            </span>
          </button>

          {/* Discovery Missions Button */}
          <button
            type="button"
            onClick={() => {
              onOpenMissions();
              ambientAudio.playUiBlip(960, 0.06);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-950/40"
          >
            <Flag size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">{isMr ? 'मोहिमा' : 'MISSIONS'}</span>
          </button>

          {/* Cinematic City Flyover Button */}
          {onPlayCityFlyover && (
            <button
              type="button"
              onClick={() => {
                onPlayCityFlyover();
                ambientAudio.playUiBlip(880, 0.05);
              }}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-cyan-950/40"
              title="Play Cinematic Pune City Flyover (Sangam Bridge -> Shaniwar Wada -> Lal Mahal -> Parvati)"
            >
              <Compass size={13} className="text-cyan-400 animate-spin-slow" />
              <span>{isMr ? 'फ्लायओव्हर' : 'FLYOVER'}</span>
            </button>
          )}

          {/* Time of Day Cycle Switcher */}
          <button
            type="button"
            onClick={nextTimeOfDay}
            className="p-2 rounded-2xl bg-black/80 hover:bg-black text-amber-300 hover:text-amber-200 border border-white/15 transition-all hover:scale-105 shadow-xl"
            title={`Time of Day: ${timeOfDay.toUpperCase()} (Click to toggle)`}
            aria-label="Toggle Time of Day Lighting"
          >
            {(timeOfDay === 'day' || timeOfDay === 'afternoon') && <Sun size={14} className="text-amber-400" />}
            {timeOfDay === 'morning' && <Sunrise size={14} className="text-pink-300" />}
            {timeOfDay === 'golden' && <Sunset size={14} className="text-orange-400" />}
            {timeOfDay === 'sunset' && <Sunset size={14} className="text-pink-400" />}
            {timeOfDay === 'night' && <Moon size={14} className="text-cyan-300" />}
            {timeOfDay === 'auto' && <Sun size={14} className="text-emerald-400" />}
          </button>

          {/* Quick Search Spotlight Button */}
          <button
            type="button"
            onClick={() => {
              onOpenSearch();
              ambientAudio.playUiBlip(760, 0.04);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-black/80 hover:bg-black text-white/80 hover:text-white border border-white/15 font-mono text-xs font-medium transition-colors shadow-xl"
            title="Search Places (Press / or Ctrl+K)"
          >
            <Search size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">Jump</span>
            <kbd className="hidden md:inline px-1 py-0.5 rounded bg-white/10 text-[9px] text-white/60">
              /
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}

export default React.memo(GameHUD);

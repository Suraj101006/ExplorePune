'use client';

import React from 'react';
import { Target, Navigation, Clock, Eye, Trash2, ArrowUpRight } from 'lucide-react';
import { ExperiencePlace } from '@/lib/experience/types';
import { calculateDistanceKm, getElevationEstimate, formatCoordinatesDD } from '@/lib/experience/puneDistrictData';
import { ambientAudio } from '@/lib/experience/ambientAudio';

interface GameWaypointBarProps {
  waypointPlace: ExperiencePlace | null;
  playerCoords: { latitude: number; longitude: number };
  onClearWaypoint: () => void;
  onFlyToWaypoint: (place: ExperiencePlace) => void;
  onInspectWaypoint: (place: ExperiencePlace) => void;
  lang?: string;
  className?: string;
}

export default function GameWaypointBar({
  waypointPlace,
  playerCoords,
  onClearWaypoint,
  onFlyToWaypoint,
  onInspectWaypoint,
  lang = 'en',
  className = '',
}: GameWaypointBarProps) {
  if (!waypointPlace) return null;

  const isMr = lang === 'mr';
  const name = isMr ? waypointPlace.name_mr || waypointPlace.name : waypointPlace.name;
  const distKm = calculateDistanceKm(
    playerCoords.latitude,
    playerCoords.longitude,
    waypointPlace.latitude,
    waypointPlace.longitude
  );

  // Speed estimates: ghats (25 km/h), city/highways (42 km/h)
  const isFortOrGhat = waypointPlace.category_slug === 'forts' || distKm > 30;
  const avgSpeedKmh = isFortOrGhat ? 28 : 40;
  const driveMinutes = Math.max(8, Math.round((distKm / avgSpeedKmh) * 60));
  const driveHours = Math.floor(driveMinutes / 60);
  const remMinutes = driveMinutes % 60;
  const timeStr = driveHours > 0 ? `${driveHours}h ${remMinutes}m` : `${driveMinutes} mins`;

  const elevation = getElevationEstimate(waypointPlace.latitude, waypointPlace.longitude, waypointPlace.category_slug);

  return (
    <div
      className={`select-none pointer-events-auto animate-in slide-in-from-bottom duration-300 ${className}`}
      aria-label="GTA GPS Waypoint Banner"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-4 sm:py-2.5 rounded-3xl bg-black/95 backdrop-blur-2xl border-2 border-cyan-400/80 text-white font-mono shadow-[0_0_30px_rgba(6,182,212,0.35)]">
        {/* Left: Waypoint Destination Details */}
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center flex-shrink-0 text-cyan-300 waypoint-pulse-anim">
            <Target size={20} className="text-cyan-400" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                GPS WAYPOINT LOCKED
              </span>
              <span className="text-[10px] text-white/50 hidden md:inline">
                ⛰️ ~{elevation}m
              </span>
            </div>
            <h4 className="text-sm font-black text-white truncate leading-tight mt-0.5">
              {name}
            </h4>
          </div>
        </div>

        {/* Center: Distance & Estimated Travel Time */}
        <div className="flex items-center justify-center gap-4 py-1 px-3 rounded-2xl bg-white/[0.04] border border-white/10 w-full sm:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <Navigation size={13} className="text-emerald-400" />
            <span className="font-black text-emerald-400 text-sm">{distKm}</span>
            <span className="text-white/50 text-[10px]">KM</span>
          </div>

          <div className="w-[1px] h-4 bg-white/10" />

          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-amber-400" />
            <span className="font-black text-amber-300 text-sm">{timeStr}</span>
            <span className="text-white/50 text-[10px]">EST DRIVE</span>
          </div>
        </div>

        {/* Right: Actions (Orbit Flyover, Details, Clear) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              onFlyToWaypoint(waypointPlace);
              ambientAudio.playUiBlip(880, 0.05);
            }}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black flex items-center justify-center gap-1.5 shadow-lg transition-all hover:scale-105 active:scale-95"
            title="3D Orbit Camera Flyover"
          >
            <Eye size={13} />
            <span>3D FLYOVER</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onInspectWaypoint(waypointPlace);
              ambientAudio.playUiBlip(780, 0.04);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs transition-colors"
            title="Inspect Destination Details"
          >
            <ArrowUpRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              onClearWaypoint();
              ambientAudio.playUiBlip(640, 0.04);
            }}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 transition-colors"
            title="Clear GPS Waypoint"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

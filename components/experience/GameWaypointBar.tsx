'use client';

import React, { useState } from 'react';
import {
  Target,
  Navigation,
  Clock,
  Eye,
  Trash2,
  ArrowUpRight,
  Car,
  Footprints,
  Bike,
  Maximize2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { ExperiencePlace } from '@/lib/experience/types';
import {
  NavigationTravelMode,
  NavigationRouteResult,
  RouteManeuverStep,
} from '@/lib/experience/navigationEngine';
import { ambientAudio } from '@/lib/experience/ambientAudio';

interface GameWaypointBarProps {
  waypointPlace: ExperiencePlace | null;
  multiStopPlaces?: ExperiencePlace[];
  playerCoords: { latitude: number; longitude: number };
  isRealGpsActive?: boolean;
  gpsAccuracyMeters?: number | null;
  travelMode: NavigationTravelMode;
  onSelectTravelMode: (mode: NavigationTravelMode) => void;
  routeResult: NavigationRouteResult | null;
  isRoutingLoading?: boolean;
  onRetryRoute?: () => void;
  onFitRouteBounds?: () => void;
  onClearWaypoint: () => void;
  onFlyToWaypoint: (place: ExperiencePlace) => void;
  onInspectWaypoint: (place: ExperiencePlace) => void;
  onSelectAlternativeRoute?: (altIndex: number) => void;
  isArrived?: boolean;
  lang?: string;
  className?: string;
}

function GameWaypointBar({
  waypointPlace,
  multiStopPlaces = [],
  playerCoords,
  isRealGpsActive = false,
  gpsAccuracyMeters,
  travelMode,
  onSelectTravelMode,
  routeResult,
  isRoutingLoading = false,
  onRetryRoute,
  onFitRouteBounds,
  onClearWaypoint,
  onFlyToWaypoint,
  onInspectWaypoint,
  isArrived = false,
  lang = 'en',
  className = '',
}: GameWaypointBarProps) {
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const isMr = lang === 'mr';

  if (!waypointPlace && multiStopPlaces.length === 0) return null;

  const currentTarget = waypointPlace || multiStopPlaces[0];
  const name = isMr ? currentTarget.name_mr || currentTarget.name : currentTarget.name;

  const distanceText = routeResult?.distanceText || `${routeResult?.distanceKm || 0} km`;
  const durationText = routeResult?.durationText || `${routeResult?.durationMinutes || 0} min`;
  const isRealRoad = routeResult?.isRealRoad === true;

  return (
    <div
      className={`select-none pointer-events-auto animate-in slide-in-from-bottom duration-300 ${className}`}
      aria-label="Professional GPS Waypoint Navigation Bar"
    >
      <div className="flex flex-col gap-2 p-3 sm:px-4 sm:py-3 rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border-2 border-cyan-400/80 text-white font-mono shadow-[0_0_35px_rgba(6,182,212,0.4)]">
        {/* Top Status Bar: Arrival / Locked Destination & Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
          {/* Left: Lock Indicator / Arrival Banner */}
          <div className="flex items-center gap-2">
            {isArrived ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-black text-[10px] uppercase tracking-wider animate-bounce">
                <CheckCircle2 size={13} />
                <span>{isMr ? 'गंतव्यस्थानी पोहोचलात!' : 'DESTINATION ARRIVED!'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/50 text-cyan-300 font-black text-[10px] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>{isMr ? 'GPS वेपॉईंट लॉक' : 'GPS LOCKED'}</span>
              </span>
            )}

            {/* GPS Source Badge */}
            <span
              className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                isRealGpsActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/10 text-white/60 border border-white/10'
              }`}
            >
              {isRealGpsActive
                ? `DEVICE GPS (±${gpsAccuracyMeters || 15}m)`
                : 'VIRTUAL EXPLORER'}
            </span>

            {/* Road Source Badge (Never fake real road) */}
            <span
              className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                isRealRoad
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
              title={
                isRealRoad
                  ? 'Calculated via OpenStreetMap / OSRM Road Geometry'
                  : 'Direct bearing line estimate (road geometry unavailable)'
              }
            >
              {isRealRoad
                ? (isMr ? 'थेट रस्ता मार्ग' : 'REAL ROAD ROUTE')
                : (isMr ? 'दिशा अंदाज' : 'BEARING LINE')}
            </span>
          </div>

          {/* Right: Navigation Travel Modes (Driving, Walking, Cycling) */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/60 border border-white/15">
            <button
              type="button"
              onClick={() => {
                onSelectTravelMode('driving');
                ambientAudio.playUiBlip(800, 0.04);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                travelMode === 'driving'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Driving Mode (Automobile)"
            >
              <Car size={13} />
              <span className="hidden sm:inline">Drive</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTravelMode('walking');
                ambientAudio.playUiBlip(840, 0.04);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                travelMode === 'walking'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Walking Mode (Pedestrian Trail)"
            >
              <Footprints size={13} />
              <span className="hidden sm:inline">Walk</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTravelMode('bicycling');
                ambientAudio.playUiBlip(880, 0.04);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                travelMode === 'bicycling'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Cycling Mode (Bicycle)"
            >
              <Bike size={13} />
              <span className="hidden sm:inline">Cycle</span>
            </button>
          </div>
        </div>

        {/* Main Waypoint Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Target Name */}
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center flex-shrink-0 text-cyan-300 waypoint-pulse-anim">
              <Target size={20} className="text-cyan-400" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-white truncate leading-tight">
                {name}
              </h4>
              <p className="text-[10px] text-white/50 truncate mt-0.5">
                {multiStopPlaces.length > 1
                  ? `${multiStopPlaces.length} Multi-Stop Waypoint Chain`
                  : currentTarget.category || currentTarget.category_slug}
              </p>
            </div>
          </div>

          {/* Real Road Stats: Distance, Time, Loading Indicator */}
          <div className="flex items-center justify-center gap-4 py-1.5 px-3.5 rounded-2xl bg-white/[0.04] border border-white/10 w-full sm:w-auto text-xs">
            {isRoutingLoading ? (
              <div className="flex items-center gap-2 py-0.5 text-cyan-400">
                <RefreshCw size={13} className="animate-spin" />
                <span className="text-[11px] font-bold">Calculating Road Route...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <Navigation size={13} className="text-emerald-400" />
                  <span className="font-black text-emerald-400 text-sm">
                    {distanceText}
                  </span>
                </div>

                <div className="w-[1px] h-4 bg-white/15" />

                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-400" />
                  <span className="font-black text-amber-300 text-sm">
                    {durationText}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons: Fit Bounds, Turn Steps Toggle, Inspect, Clear */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            {onFitRouteBounds && (
              <button
                type="button"
                onClick={() => {
                  onFitRouteBounds();
                  ambientAudio.playUiBlip(860, 0.04);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
                title="Fit Route Overview on Map"
              >
                <Maximize2 size={13} />
              </button>
            )}

            {routeResult?.steps && routeResult.steps.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowSteps(!showSteps);
                  ambientAudio.playUiBlip(750, 0.04);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  showSteps
                    ? 'bg-cyan-500 text-black border-cyan-400'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                }`}
                title="Toggle Turn-by-Turn Maneuvers"
              >
                <Layers size={13} />
                <span className="text-[11px]">{routeResult.steps.length} Steps</span>
                {showSteps ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onFlyToWaypoint(currentTarget);
                ambientAudio.playUiBlip(880, 0.05);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black flex items-center justify-center gap-1 shadow-lg transition-all hover:scale-105 active:scale-95"
              title="3D Orbit Camera Flyover"
            >
              <Eye size={13} />
              <span className="hidden md:inline">FLY</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onInspectWaypoint(currentTarget);
                ambientAudio.playUiBlip(780, 0.04);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
              title="Inspect Destination Details"
            >
              <ArrowUpRight size={13} />
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

        {/* Turn-by-Turn Maneuvers Drawer */}
        {showSteps && routeResult?.steps && (
          <div className="mt-2 pt-2 border-t border-white/10 max-h-48 overflow-y-auto custom-scrollbar pr-1 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                {isMr ? 'मार्ग वळणे व सूचना' : 'TURN-BY-TURN ROAD DIRECTIONS'}
              </span>
              <span className="text-[9px] text-white/40">
                {routeResult.steps.length} {isMr ? 'टप्पे' : 'legs'}
              </span>
            </div>

            <div className="space-y-1.5">
              {routeResult.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-white/90 truncate font-sans text-xs">
                      {isMr ? step.instructionMr || step.instruction : step.instruction}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 flex-shrink-0">
                    {step.distanceText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternative Route Strip (if available) */}
        {routeResult?.alternative && (
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
            <span>
              {isMr ? 'पर्यायी मार्ग उपलब्ध:' : 'Alternative Route:'}{' '}
              <strong className="text-white font-bold">{routeResult.alternative.distanceText}</strong> ·{' '}
              {routeResult.alternative.durationText}
            </span>
            <span className="text-cyan-400 font-mono">VIA OSRM</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(GameWaypointBar);

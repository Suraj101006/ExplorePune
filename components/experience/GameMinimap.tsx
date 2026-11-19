'use client';

import React, { useMemo, useState } from 'react';
import { Maximize2, Minimize2, Navigation, Target, Compass } from 'lucide-react';
import { ExperiencePlace } from '@/lib/experience/types';
import { calculateDistanceKm, getTalukaOrRegion } from '@/lib/experience/puneDistrictData';
import { ambientAudio } from '@/lib/experience/ambientAudio';

interface GameMinimapProps {
  centerLat: number;
  centerLng: number;
  bearing: number;
  pitch: number;
  zoom: number;
  allPlaces: ExperiencePlace[];
  selectedPlace: ExperiencePlace | null;
  waypointPlace: ExperiencePlace | null;
  onSelectPlace: (place: ExperiencePlace) => void;
  onResetBearing: () => void;
  isRealGpsActive?: boolean;
  routeCoords?: [number, number][];
  lang?: string;
  className?: string;
}

function GameMinimap({
  centerLat,
  centerLng,
  bearing,
  pitch,
  zoom,
  allPlaces,
  selectedPlace,
  waypointPlace,
  onSelectPlace,
  onResetBearing,
  isRealGpsActive = false,
  routeCoords = [],
  lang = 'en',
  className = '',
}: GameMinimapProps) {
  const isMr = lang === 'mr';
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const taluka = useMemo(
    () => getTalukaOrRegion(centerLat, centerLng),
    [centerLat, centerLng]
  );

  // Radar detection radius scales with zoom level (at zoom 10 ~ 25km, at zoom 14 ~ 5km)
  const radarRadiusKm = Math.max(3, 40 / Math.pow(1.5, Math.max(8, zoom) - 8));

  // Compute nearby destination blips on the radar screen
  const nearbyBlips = useMemo(() => {
    return allPlaces
      .map((place) => {
        const dist = calculateDistanceKm(centerLat, centerLng, place.latitude, place.longitude);
        if (dist > radarRadiusKm) return null;

        // Angle from center in radians
        const dLat = place.latitude - centerLat;
        const dLng = (place.longitude - centerLng) * Math.cos((centerLat * Math.PI) / 180);
        const angleRad = Math.atan2(dLng, dLat); // 0 = North, PI/2 = East

        // Adjust for current map camera bearing
        const relAngleRad = angleRad - (bearing * Math.PI) / 180;

        // Normalized radius on minimap (0 center to 44% border)
        const radiusPercent = (dist / radarRadiusKm) * 44;
        const x = 50 + radiusPercent * Math.sin(relAngleRad);
        const y = 50 - radiusPercent * Math.cos(relAngleRad);

        let color = '#10b981';
        if (place.category_slug === 'forts') color = '#ef4444';
        else if (place.category_slug === 'heritage') color = '#f59e0b';
        else if (place.category_slug === 'temples') color = '#f97316';
        else if (place.category_slug === 'museums') color = '#8b5cf6';
        else if (place.category_slug === 'parks' || place.category_slug === 'nature') color = '#06b6d4';

        const isWaypoint = waypointPlace?.slug === place.slug;
        const isSelected = selectedPlace?.slug === place.slug;

        return {
          place,
          x,
          y,
          dist,
          color,
          isWaypoint,
          isSelected,
        };
      })
      .filter(Boolean) as {
        place: ExperiencePlace;
        x: number;
        y: number;
        dist: number;
        color: string;
        isWaypoint: boolean;
        isSelected: boolean;
      }[];
  }, [allPlaces, centerLat, centerLng, radarRadiusKm, bearing, waypointPlace, selectedPlace]);

  // Waypoint direction angle relative to player if waypoint is outside radar radius
  const waypointVector = useMemo(() => {
    if (!waypointPlace) return null;
    const dist = calculateDistanceKm(centerLat, centerLng, waypointPlace.latitude, waypointPlace.longitude);
    const dLat = waypointPlace.latitude - centerLat;
    const dLng = (waypointPlace.longitude - centerLng) * Math.cos((centerLat * Math.PI) / 180);
    const angleRad = Math.atan2(dLng, dLat);
    const relAngleRad = angleRad - (bearing * Math.PI) / 180;
    const deg = (relAngleRad * 180) / Math.PI;

    return {
      dist,
      deg,
      insideRadar: dist <= radarRadiusKm,
    };
  }, [waypointPlace, centerLat, centerLng, bearing, radarRadiusKm]);

  // Projected SVG coordinates for active road route on radar
  const minimapRouteSvgPoints = useMemo(() => {
    if (!routeCoords || routeCoords.length < 2) return '';
    const step = Math.max(1, Math.floor(routeCoords.length / 30));
    const pts: string[] = [];
    for (let i = 0; i < routeCoords.length; i += step) {
      const [lng, lat] = routeCoords[i];
      const dist = calculateDistanceKm(centerLat, centerLng, lat, lng);
      if (dist <= radarRadiusKm * 1.15) {
        const dLat = lat - centerLat;
        const dLng = (lng - centerLng) * Math.cos((centerLat * Math.PI) / 180);
        const angleRad = Math.atan2(dLng, dLat);
        const relAngleRad = angleRad - (bearing * Math.PI) / 180;
        const radiusPercent = (dist / radarRadiusKm) * 44;
        const x = 50 + radiusPercent * Math.sin(relAngleRad);
        const y = 50 - radiusPercent * Math.cos(relAngleRad);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
    }
    return pts.join(' ');
  }, [routeCoords, centerLat, centerLng, radarRadiusKm, bearing]);

  return (
    <div
      className={`relative select-none transition-all duration-300 pointer-events-auto ${className}`}
      aria-label="GTA Radar Minimap"
    >
      {/* Top Location Header Pill */}
      <div className="mb-1.5 flex items-center justify-between gap-1.5 px-3 py-1 rounded-xl bg-black/90 backdrop-blur-xl border border-emerald-500/40 text-[10px] font-mono shadow-xl">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          <span className="font-black text-emerald-300 truncate uppercase tracking-wider">
            {isMr ? taluka.nameMr : taluka.nameEn}
          </span>
        </div>
        <span className="text-white/40 flex-shrink-0">
          Z{zoom.toFixed(1)}
        </span>
      </div>

      {/* Main Circular Radar Frame */}
      <div
        className={`relative rounded-full gta-minimap-frame overflow-hidden bg-slate-950/95 border-2 border-emerald-500/60 shadow-2xl transition-all duration-300 ${
          isExpanded ? 'w-64 h-64 md:w-72 md:h-72' : 'w-44 h-44 md:w-52 md:h-52'
        }`}
      >
        {/* Radar Background Range Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[33%] h-[33%] rounded-full border border-emerald-500/20" />
          <div className="w-[66%] h-[66%] rounded-full border border-emerald-500/20" />
          <div className="w-[96%] h-[96%] rounded-full border border-emerald-500/30" />

          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-emerald-500/20" />
          <div className="absolute h-full w-[1px] bg-emerald-500/20" />
        </div>

        {/* Rotating Radar Sweep Beam */}
        <div
          className="absolute inset-0 pointer-events-none radar-sweep-anim origin-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.28) 0deg, transparent 55deg)',
          }}
        />

        {/* Compass Cardinal Points on Rim (Oriented to bearing) */}
        <div
          className="absolute inset-2 pointer-events-none transition-transform duration-100 ease-out"
          style={{ transform: `rotate(${-bearing}deg)` }}
        >
          <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black text-amber-400 tracking-tighter">
            N
          </span>
          <span className="absolute right-0.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-white/50">
            E
          </span>
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-white/50">
            S
          </span>
          <span className="absolute left-0.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-white/50">
            W
          </span>
        </div>

        {/* Real Road Route Polyline on Radar Screen */}
        {minimapRouteSvgPoints && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-15" viewBox="0 0 100 100">
            <polyline
              points={minimapRouteSvgPoints}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </svg>
        )}

        {/* Destination Radar Blips */}
        {nearbyBlips.map((blip) => (
          <button
            key={blip.place.id}
            type="button"
            onClick={() => {
              onSelectPlace(blip.place);
              ambientAudio.playUiBlip(920, 0.05);
            }}
            title={`${blip.place.name} (~${blip.dist.toFixed(1)} km)`}
            className="absolute -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-150 z-20 focus:outline-none"
            style={{
              left: `${blip.x}%`,
              top: `${blip.y}%`,
            }}
          >
            {blip.isWaypoint ? (
              <span className="block w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white shadow-lg animate-ping" />
            ) : blip.isSelected ? (
              <span className="block w-3 h-3 rounded-full bg-amber-400 border border-white shadow-md animate-pulse" />
            ) : (
              <span
                className="block w-2 h-2 rounded-full border border-black/80 shadow-sm"
                style={{ backgroundColor: blip.color }}
              />
            )}
          </button>
        ))}

        {/* Off-Screen Waypoint Edge Indicator Arrow */}
        {waypointVector && !waypointVector.insideRadar && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-30"
            style={{ transform: `rotate(${waypointVector.deg}deg)` }}
          >
            <div className="absolute top-2 flex flex-col items-center animate-bounce">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
              <span className="text-[8px] font-mono font-black text-cyan-300 bg-black/90 px-1 rounded -mt-0.5">
                {waypointVector.dist.toFixed(0)}k
              </span>
            </div>
          </div>
        )}

        {/* Player Center Cursor with Vision FOV Cone */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          {/* Translucent 60-degree Vision Cone pointing forward in player view */}
          <div
            className="absolute w-28 h-28 -translate-y-7 pointer-events-none opacity-25"
            style={{
              background: 'conic-gradient(from -30deg at 50% 100%, rgba(16,185,129,0.8) 0deg, rgba(16,185,129,0.8) 60deg, transparent 60deg)',
              clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
            }}
          />
          <div
            className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[14px] -translate-y-1 ${
              isRealGpsActive
                ? 'border-b-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.95)]'
                : 'border-b-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.9)]'
            }`}
          />
          <div
            className={`w-1.5 h-1.5 rounded-full absolute shadow-sm ${
              isRealGpsActive ? 'bg-sky-200' : 'bg-white'
            }`}
          />
        </div>

        {/* Expand / Minimize Minimap Button */}
        <button
          type="button"
          onClick={() => {
            setIsExpanded(!isExpanded);
            ambientAudio.playUiBlip(720, 0.04);
          }}
          aria-label={isExpanded ? 'Minimize radar minimap' : 'Expand radar minimap'}
          className="absolute top-2 right-2 z-30 p-1 rounded-full bg-black/75 hover:bg-black text-white/70 hover:text-white border border-white/20 transition-colors"
        >
          {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        </button>

        {/* Reset North Button */}
        <button
          type="button"
          onClick={() => {
            onResetBearing();
            ambientAudio.playUiBlip(880, 0.04);
          }}
          aria-label="Align North"
          className="absolute bottom-2 right-2 z-30 p-1 rounded-full bg-black/75 hover:bg-black text-amber-400 hover:text-amber-300 border border-white/20 text-[10px] font-mono font-black transition-colors"
          title="Reset Camera North"
        >
          N
        </button>
      </div>
    </div>
  );
}

export default React.memo(GameMinimap);

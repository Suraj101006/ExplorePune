'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Route, Navigation, ExternalLink, Eye, Plus, Check, Target, Compass, Flag } from 'lucide-react';
import { ExperiencePlace } from '@/lib/experience/types';
import { getAllPlaces } from '@/lib/experience/selectors';
import { DISCOVERY_MISSIONS, DiscoveryMission } from './DiscoveryMissionsModal';
import {
  formatCoordinatesDD,
  formatCoordinatesDMS,
  getTalukaOrRegion,
  getElevationEstimate,
  calculateDistanceKm,
} from '@/lib/experience/puneDistrictData';
import { ambientAudio } from '@/lib/experience/ambientAudio';

interface DistrictLocationDrawerProps {
  place: ExperiencePlace | null;
  onClose: () => void;
  onFocusSatellite: (place: ExperiencePlace) => void;
  onOrbit?: (place: ExperiencePlace) => void;
  onShowRoute?: (place: ExperiencePlace) => void;
  onClearRoute?: () => void;
  onAddToTrail?: (place: ExperiencePlace) => void;
  onSetWaypoint?: (place: ExperiencePlace) => void;
  onStartMissionTrail?: (mission: DiscoveryMission) => void;
  isPlaceInTrail?: boolean;
  isRouteActive?: boolean;
  userCoords?: { latitude: number; longitude: number } | null;
  lang?: string;
}

export default function DistrictLocationDrawer({
  place,
  onClose,
  onFocusSatellite,
  onOrbit,
  onShowRoute,
  onClearRoute,
  onAddToTrail,
  onSetWaypoint,
  onStartMissionTrail,
  isPlaceInTrail = false,
  isRouteActive = false,
  userCoords,
  lang = 'en',
}: DistrictLocationDrawerProps) {
  const isMr = lang === 'mr';
  const [copied, setCopied] = useState<boolean>(false);

  // Find 3 nearest destinations for seamless open-world exploration (Hook declared before conditional return)
  const nearbyPlaces = React.useMemo(() => {
    if (!place) return [];
    const pLat = place.latitude;
    const pLng = place.longitude;
    const all = getAllPlaces();
    return all
      .filter((p) => p.slug !== place.slug)
      .map((p) => ({
        place: p,
        distanceKm: calculateDistanceKm(pLat, pLng, p.latitude, p.longitude),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
  }, [place]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!place) return null;

  const lat = place.latitude;
  const lng = place.longitude;
  const coordsDD = formatCoordinatesDD(lat, lng, 6);
  const coordsDMS = formatCoordinatesDMS(lat, lng).fullDMS;
  const taluka = getTalukaOrRegion(lat, lng, place.address);
  const elevation = getElevationEstimate(lat, lng, place.category_slug);

  // Distance from Zero Stone (GPO, Central Pune 18.5204, 73.8567)
  const distFromCenter = calculateDistanceKm(18.5204, 73.8567, lat, lng);
  const distFromUser = userCoords
    ? calculateDistanceKm(userCoords.latitude, userCoords.longitude, lat, lng)
    : null;

  const placeName = isMr ? place.name_mr || place.name : place.name;
  const placeAltName = isMr ? place.name : place.name_mr;
  const hours = isMr ? place.opening_hours_mr || place.opening_hours : place.opening_hours;
  const address = isMr ? place.address_mr || place.address : place.address;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const handleCopyCoords = async () => {
    try {
      await navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      setCopied(true);
      ambientAudio.playUiBlip(1040, 0.05);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <aside
      style={{ maxHeight: 'calc(100% - 2rem)' }}
      className="fixed md:absolute top-auto bottom-0 md:top-4 md:bottom-4 right-0 md:right-4 z-30 w-full md:w-[420px] max-h-[85vh] md:max-h-none flex flex-col bg-black/95 backdrop-blur-2xl border-t md:border border-emerald-500/40 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom md:slide-in-from-right text-white select-none"
      aria-label={`${placeName} Coordinates & Geographical Details`}
    >
      {/* Top Image Banner */}
      <div
        className="relative h-44 md:h-52 w-full flex-shrink-0 bg-zinc-950"
        style={{ position: 'relative', width: '100%', height: '176px', overflow: 'hidden' }}
      >
        <Image
          src={place.image_url || '/images/hero-shaniwar-wada.webp'}
          alt={placeName}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

        {/* Top Header Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
            {place.category_slug}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close coordinate inspector"
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Taluka / Region Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-mono text-emerald-400 bg-black/80 px-2.5 py-1 rounded-lg border border-emerald-500/30 inline-flex items-center gap-1">
            <MapPin size={11} />
            <span>{isMr ? taluka.nameMr : taluka.nameEn}</span>
          </span>
          <span className="text-[10px] font-mono text-white/80 bg-black/80 px-2 py-1 rounded-lg border border-white/10">
            ⛰️ ALT: ~{elevation}m MSL
          </span>
        </div>
      </div>

      {/* Main Coordinate Inspector Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5 space-y-3.5 custom-scrollbar">
        {/* Name & Alternative Name */}
        <div>
          <h2 className="text-xl font-black text-white tracking-tight leading-tight">
            {placeName}
          </h2>
          {placeAltName && (
            <p className="text-xs font-medium text-white/50 mt-0.5 font-sans">
              {placeAltName}
            </p>
          )}
        </div>

        {/* PROMINENT GPS COORDINATES CARD */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-emerald-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              VERIFIED GPS COORDINATES
            </span>
            <button
              type="button"
              onClick={handleCopyCoords}
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{copied ? 'COPIED!' : 'COPY GPS'}</span>
            </button>
          </div>

          {/* Decimal Degrees */}
          <div className="text-sm font-mono font-black text-white tracking-tight">
            {coordsDD}
          </div>

          {/* DMS */}
          <div className="text-[11px] font-mono text-white/60 mt-0.5">
            {coordsDMS}
          </div>

          {/* Spatial Distances */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/70">
            <span>
              Pune Zero Stone: <strong className="text-amber-400">{distFromCenter} km</strong>
            </span>
            {distFromUser !== null && (
              <span>
                From You: <strong className="text-cyan-400">{distFromUser} km</strong>
              </span>
            )}
          </div>
        </div>

        {/* Visiting Hours & Entry Fee */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block mb-0.5">
              Official Hours
            </span>
            <p className="font-semibold text-white truncate">
              {hours || 'Daylight / Open'}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block mb-0.5">
              Admission Fee
            </span>
            <p className="font-semibold text-emerald-400">
              {place.entry_fee === 0 ? 'Free Entry (₹0)' : `₹${place.entry_fee}`}
            </p>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-white/80 leading-relaxed font-light">
          {isMr ? place.description_mr || place.description : place.description}
        </p>

        {/* Verified Address */}
        {address && (
          <div className="text-[11px] text-white/60 pt-1 border-t border-white/10">
            <span className="text-white/40 font-mono text-[10px] block mb-0.5">VERIFIED ADDRESS</span>
            <p className="leading-snug">{address}</p>
          </div>
        )}

        {/* Discovery Mission Affiliation Banner */}
        {(() => {
          const matchingMission = place ? DISCOVERY_MISSIONS.find((m) => m.stopSlugs.includes(place.slug)) : null;
          if (!matchingMission) return null;
          return (
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-sm flex-shrink-0">
                  {matchingMission.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-mono font-black text-amber-300 uppercase tracking-wider block">
                    {isMr ? 'शोध मोहिमेचा भाग' : 'DISCOVERY MISSION TRAIL'}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">
                    {isMr ? matchingMission.titleMr : matchingMission.titleEn}
                  </h4>
                </div>
              </div>
              {onStartMissionTrail && (
                <button
                  type="button"
                  onClick={() => onStartMissionTrail(matchingMission)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider transition-all shadow-md flex-shrink-0"
                >
                  {isMr ? 'मोहीम सुरू करा' : 'START TRAIL'}
                </button>
              )}
            </div>
          );
        })()}

        {/* Nearby Discoveries (Open-World Continuous Exploration) */}
        {nearbyPlaces.length > 0 && (
          <div className="pt-2.5 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                <Compass size={11} />
                <span>{isMr ? 'जवळपासची शोधस्थळे' : 'NEARBY DISCOVERIES'}</span>
              </span>
              <span className="text-[9px] font-mono text-white/40">Within Pune District</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {nearbyPlaces.map(({ place: np, distanceKm }) => (
                <div
                  key={np.slug}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden relative flex-shrink-0 bg-zinc-800">
                      <Image
                        src={np.image_url || '/images/hero-shaniwar-wada.webp'}
                        alt={np.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {isMr ? np.name_mr || np.name : np.name}
                      </p>
                      <p className="text-[10px] font-mono text-emerald-400">
                        {distanceKm} km away
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onFocusSatellite(np)}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-emerald-500 hover:text-black text-white text-[10px] font-mono font-bold transition-all"
                      title="Fly to this destination"
                    >
                      FLY
                    </button>
                    {onSetWaypoint && (
                      <button
                        type="button"
                        onClick={() => onSetWaypoint(np)}
                        className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-400 hover:text-black text-cyan-300 text-[10px] font-mono font-bold transition-all"
                        title="Set as GPS Waypoint"
                      >
                        GPS
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 border-t border-white/10 bg-zinc-950 flex flex-col gap-2 flex-shrink-0">
        {/* Set GPS Waypoint Action */}
        {onSetWaypoint && (
          <button
            type="button"
            onClick={() => {
              onSetWaypoint(place);
              ambientAudio.playUiBlip(940, 0.06);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-98"
          >
            <Target size={14} />
            <span>{isMr ? 'GPS वेपॉईंट निश्चित करा' : 'SET AS GPS WAYPOINT'}</span>
          </button>
        )}

        <div className="grid grid-cols-3 gap-2">
          {/* 1. Show on Map */}
          <button
            type="button"
            onClick={() => onFocusSatellite(place)}
            className="flex items-center justify-center gap-1 px-2.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg"
          >
            <span>{isMr ? 'शोध' : 'FLY TO'}</span>
          </button>

          {/* 2. Orbit 3D */}
          {onOrbit && (
            <button
              type="button"
              onClick={() => onOrbit(place)}
              className="flex items-center justify-center gap-1 px-2.5 py-2.5 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-bold transition-all border border-amber-400/40"
            >
              <Eye size={13} />
              <span>{isMr ? '३D प्रदक्षिणा' : '3D ORBIT'}</span>
            </button>
          )}

          {/* 3. Add to Custom Route */}
          {onAddToTrail && (
            <button
              type="button"
              onClick={() => onAddToTrail(place)}
              className={`flex items-center justify-center gap-1 px-2.5 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                isPlaceInTrail
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
              }`}
            >
              {isPlaceInTrail ? <Check size={13} /> : <Plus size={13} />}
              <span>{isPlaceInTrail ? 'ADDED' : '+ TRAIL'}</span>
            </button>
          )}
        </div>

        {/* Show Route from Pune Station */}
        {onShowRoute && (
          <button
            type="button"
            onClick={() => {
              if (isRouteActive && onClearRoute) onClearRoute();
              else onShowRoute(place);
            }}
            className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
              isRouteActive
                ? 'bg-cyan-900/40 border-cyan-400 text-cyan-300'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
            }`}
          >
            <Route size={13} />
            <span>{isRouteActive ? 'CLEAR ROAD ROUTE' : 'DRAW ROUTE FROM PUNE STATION'}</span>
          </button>
        )}

        {/* Special 2D Historical Game for Sinhagad Fort */}
        {(place.slug === 'sinhagad-fort' || place.id === 'sinhagad-fort') && (
          <Link
            href="/experience/sinhagad"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 border border-amber-300 transition-all transform hover:scale-[1.01]"
          >
            <Compass size={14} className="animate-spin text-slate-950" style={{ animationDuration: '6s' }} />
            <span>{isMr ? '🎮 ऐतिहासिक २D किल्ला खेळा (पुणे दरवाजा व दारू कोठार)' : '🎮 PLAY 2D HISTORIC FORT GAME'}</span>
          </Link>
        )}

        {/* Explore Destination Detail Page */}
        <Link
          href={`/places/${place.slug}`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-colors"
        >
          <span>{isMr ? 'संपूर्ण माहिती वाचा (EXPLORE DESTINATION)' : 'EXPLORE DESTINATION'}</span>
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

        {/* Google Maps External Link */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-[10px] font-mono text-white/50 hover:text-white transition-colors"
        >
          {isMr ? 'गुगल मॅप्सवर नेव्हिगेट करा ↗' : 'Navigate via Google Maps ↗'}
        </a>
      </div>
    </aside>
  );
}

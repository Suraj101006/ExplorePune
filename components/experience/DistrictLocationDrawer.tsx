'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Route, Navigation, ExternalLink, ArrowRight } from 'lucide-react';
import { ExperiencePlace } from '@/lib/experience/types';
import {
  formatCoordinatesDD,
  formatCoordinatesDMS,
  getTalukaOrRegion,
  getElevationEstimate,
  calculateDistanceKm,
} from '@/lib/experience/puneDistrictData';

interface DistrictLocationDrawerProps {
  place: ExperiencePlace | null;
  onClose: () => void;
  onFocusSatellite: (place: ExperiencePlace) => void;
  onShowRoute?: (place: ExperiencePlace) => void;
  onClearRoute?: () => void;
  isRouteActive?: boolean;
  userCoords?: { latitude: number; longitude: number } | null;
  lang?: string;
}

export default function DistrictLocationDrawer({
  place,
  onClose,
  onFocusSatellite,
  onShowRoute,
  onClearRoute,
  isRouteActive = false,
  userCoords,
  lang = 'en',
}: DistrictLocationDrawerProps) {
  const isMr = lang === 'mr';
  const [copied, setCopied] = useState<boolean>(false);

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
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <aside
      style={{ maxHeight: 'calc(100% - 2rem)' }}
      className="fixed md:absolute top-auto bottom-0 md:top-4 md:bottom-4 right-0 md:right-4 z-30 w-full md:w-[420px] max-h-[85vh] md:max-h-none flex flex-col bg-black/95 backdrop-blur-2xl border-t md:border border-emerald-500/30 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom md:slide-in-from-right text-white select-none"
      aria-label={`${placeName} Coordinates & Geographical Details`}
    >
      {/* Top Image Banner */}
      <div className="relative h-44 md:h-52 w-full flex-shrink-0 bg-zinc-950">
        <Image
          src={place.image_url || '/images/hero-shaniwar-wada.webp'}
          alt={placeName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
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
            ALT: ~{elevation}m MSL
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

        {/* Municipal Hours & Entry Fee */}
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
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 border-t border-white/10 bg-zinc-950 flex flex-col gap-2 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2">
          {/* 1. Focus on Map (Fly Drone) */}
          <button
            type="button"
            onClick={() => onFocusSatellite(place)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/30"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="3" strokeWidth={2} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v3m0 14v3m-10-10h3m14 0h3" />
            </svg>
            <span>{isMr ? 'नकाशावर दाखवा' : 'SHOW ON MAP'}</span>
          </button>

          {/* 2. Toggle Driving Route Line */}
          {onShowRoute && (
            <button
              type="button"
              onClick={() => {
                if (isRouteActive && onClearRoute) onClearRoute();
                else onShowRoute(place);
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                isRouteActive
                  ? 'bg-cyan-900/40 border-cyan-400 text-cyan-300'
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
              }`}
            >
              <Route size={14} />
              <span>{isRouteActive ? (isMr ? 'मार्ग काढा' : 'CLEAR ROUTE') : (isMr ? 'रस्ता मार्ग' : 'VIEW ROUTE')}</span>
            </button>
          )}
        </div>

        {/* 3. Explore Destination Detail Page */}
        <Link
          href={`/places/${place.slug}`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-colors"
        >
          <span>{isMr ? 'संपूर्ण माहिती वाचा (EXPLORE DESTINATION)' : 'EXPLORE DESTINATION'}</span>
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

        {/* 4. Google Maps External Link */}
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

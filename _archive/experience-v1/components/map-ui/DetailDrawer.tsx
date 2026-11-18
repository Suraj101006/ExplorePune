'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExperiencePlace } from '@/lib/experience/types';
import { getZones } from '@/lib/experience/selectors';
import { getExperienceDictionary } from '@/lib/experience/i18n';

interface DetailDrawerProps {
  place: ExperiencePlace | null;
  onClose: () => void;
  lang?: string;
}

export default function DetailDrawer({ place, onClose, lang = 'en' }: DetailDrawerProps) {
  const dict = getExperienceDictionary(lang);
  const isMr = lang === 'mr';
  const zones = getZones();
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Sync saved status from localStorage
  useEffect(() => {
    if (!place) return;
    try {
      const saved = JSON.parse(localStorage.getItem('explore_pune_saved_places') || '[]');
      setIsSaved(saved.includes(place.slug));
    } catch (e) {
      setIsSaved(false);
    }
  }, [place]);

  const toggleSave = () => {
    if (!place) return;
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('explore_pune_saved_places') || '[]');
      let updated: string[];
      if (saved.includes(place.slug)) {
        updated = saved.filter((s) => s !== place.slug);
        setIsSaved(false);
      } else {
        updated = [...saved, place.slug];
        setIsSaved(true);
      }
      localStorage.setItem('explore_pune_saved_places', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save place to localStorage', e);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!place) return null;

  const currentZone = zones.find((z) => z.id === place.zoneId);
  const placeName = isMr ? place.name_mr || place.name : place.name;
  const placeAltName = isMr ? place.name : place.name_mr;
  const description = isMr ? place.description_mr || place.description : place.description;
  const hours = isMr ? place.opening_hours_mr || place.opening_hours : place.opening_hours;
  const address = isMr ? place.address_mr || place.address : place.address;
  const bestTime = isMr ? place.best_time_mr || place.best_time : place.best_time;
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;

  return (
    <aside
      className="absolute top-4 right-4 bottom-4 z-30 w-[380px] md:w-[420px] max-w-[calc(100vw-32px)] flex flex-col bg-[#1F242D]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-right"
      aria-label={placeName}
    >
      {/* Header Image */}
      <div className="relative h-56 w-full flex-shrink-0 bg-black/50">
        <Image
          src={place.image_url || '/images/hero-shaniwar-wada.webp'}
          alt={placeName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F242D] via-transparent to-black/60" />

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/60 text-white backdrop-blur-md border border-white/20">
            {place.category_slug}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.map.closeDrawer}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Zone Badge Bottom of Image */}
        {currentZone && (
          <div className="absolute bottom-3 left-4">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border"
              style={{
                backgroundColor: `${currentZone.accentColor}33`,
                borderColor: currentZone.accentColor,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: currentZone.accentColor }}
              />
              {isMr ? currentZone.nameMr : currentZone.nameEn}
            </span>
          </div>
        )}
      </div>

      {/* Place Details Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-xl font-black text-white tracking-tight leading-tight">
            {placeName}
          </h2>
          {placeAltName && (
            <p className="text-xs font-semibold text-white/50 mt-0.5">
              {placeAltName}
            </p>
          )}
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Hours Card */}
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">
              {dict.map.hoursLabel}
            </span>
            <p className="text-xs font-semibold text-white leading-snug">
              {hours || 'Daylight / Open'}
            </p>
          </div>

          {/* Fee Card */}
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">
              {dict.map.entryFeeLabel}
            </span>
            <p className="text-xs font-semibold text-emerald-400 leading-snug">
              {place.entry_fee === 0
                ? dict.map.freeEntry
                : `₹${place.entry_fee || '—'}`}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-xs text-white/80 leading-relaxed font-light">
            {description}
          </p>
        </div>

        {/* Transit & Address */}
        <div className="space-y-2 text-xs">
          {place.location?.nearby_metro && (
            <div className="flex items-start gap-2 text-white/70">
              <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                Metro
              </span>
              <span>{place.location.nearby_metro}</span>
            </div>
          )}
          {place.location?.nearest_bus_stop && (
            <div className="flex items-start gap-2 text-white/70">
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50">
                PMPML
              </span>
              <span>{place.location.nearest_bus_stop}</span>
            </div>
          )}
          {bestTime && (
            <div className="flex items-start gap-2 text-white/60 text-[11px] pt-1">
              <span className="text-white/40">{dict.map.bestTimeLabel}:</span>
              <span>{bestTime}</span>
            </div>
          )}
          {address && (
            <div className="flex items-start gap-2 text-white/50 text-[11px] pt-1">
              <span className="text-white/40">{dict.map.addressLabel}:</span>
              <span className="line-clamp-2">{address}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Action Buttons Footer */}
      <div className="p-4 border-t border-white/10 bg-black/60 flex flex-col gap-2 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2">
          {/* 1. Navigate via Google Maps */}
          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#F1293A] hover:bg-[#D41E2E] text-white text-xs font-bold transition-all shadow-lg hover:shadow-[#F1293A]/30 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{dict.map.btnNavigate}</span>
          </a>

          {/* 2. Save to My Journey */}
          <button
            type="button"
            onClick={toggleSave}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-white ${
              isSaved
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-white/5 hover:bg-white/15 text-white border-white/10'
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-white'}`}
              fill={isSaved ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>{isSaved ? dict.map.btnSaved : dict.map.btnSaveJourney}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* 3. Full Guide Page */}
          <Link
            href={`/places/${place.slug}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <span>{dict.map.btnFullGuide}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>

          {/* 4. Add to Trip Planner */}
          <Link
            href={`/planner?add=${place.slug}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <span>{dict.map.btnAddTrip}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}

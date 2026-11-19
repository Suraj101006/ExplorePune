'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { MapPin, Navigation, Route, Plus, Trash2, Sparkles, Compass } from 'lucide-react';
import { ExperiencePlace } from '@/lib/experience/types';
import { getAllPlaces, getCategories } from '@/lib/experience/selectors';
import {
  formatCoordinatesDD,
  getTalukaOrRegion,
  calculateDistanceKm,
  getElevationEstimate,
  PUNE_TALUKAS,
} from '@/lib/experience/puneDistrictData';
import { ambientAudio } from '@/lib/experience/ambientAudio';

interface DistrictControlPanelProps {
  selectedPlace: ExperiencePlace | null;
  selectedCategory: string;
  selectedTaluka: string;
  searchQuery: string;
  customTrailPlaces: ExperiencePlace[];
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: string) => void;
  onSelectTaluka: (talukaId: string) => void;
  onSelectPlace: (place: ExperiencePlace) => void;
  onAddToCustomTrail: (place: ExperiencePlace) => void;
  onRemoveFromCustomTrail: (slug: string) => void;
  onDrawCustomTrail: (places: ExperiencePlace[]) => void;
  onClearCustomTrail: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  lang?: string;
}

function DistrictControlPanel({
  selectedPlace,
  selectedCategory,
  selectedTaluka,
  searchQuery,
  customTrailPlaces,
  onSearchChange,
  onSelectCategory,
  onSelectTaluka,
  onSelectPlace,
  onAddToCustomTrail,
  onRemoveFromCustomTrail,
  onDrawCustomTrail,
  onClearCustomTrail,
  isCollapsed,
  onToggleCollapse,
  lang = 'en',
}: DistrictControlPanelProps) {
  const isMr = lang === 'mr';
  const allPlaces = getAllPlaces();
  const categories = getCategories();
  const [activeTab, setActiveTab] = useState<'directory' | 'trail'>('directory');

  // Filter places
  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPlaces.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category_slug !== selectedCategory) {
        return false;
      }

      // Taluka filter
      if (selectedTaluka !== 'all') {
        const taluka = getTalukaOrRegion(p.latitude, p.longitude, p.address);
        if (taluka.id !== selectedTaluka && !taluka.nameEn.toLowerCase().includes(selectedTaluka.toLowerCase())) {
          return false;
        }
      }

      // Search filter
      if (q) {
        const nameEn = (p.name || '').toLowerCase();
        const nameMr = (p.name_mr || '').toLowerCase();
        const latStr = p.latitude.toString();
        const lngStr = p.longitude.toString();
        const addr = (p.address || '').toLowerCase();
        const cat = (p.category_slug || '').toLowerCase();
        return (
          nameEn.includes(q) ||
          nameMr.includes(q) ||
          latStr.includes(q) ||
          lngStr.includes(q) ||
          addr.includes(q) ||
          cat.includes(q)
        );
      }
      return true;
    });
  }, [allPlaces, selectedCategory, selectedTaluka, searchQuery]);

  // Total road distance for custom trail
  const customTrailDistanceKm = useMemo(() => {
    if (customTrailPlaces.length < 2) return 0;
    let dist = 0;
    for (let i = 0; i < customTrailPlaces.length - 1; i++) {
      dist += calculateDistanceKm(
        customTrailPlaces[i].latitude,
        customTrailPlaces[i].longitude,
        customTrailPlaces[i + 1].latitude,
        customTrailPlaces[i + 1].longitude
      );
    }
    return Math.round(dist * 10) / 10;
  }, [customTrailPlaces]);

  // Pre-set Trail loaders
  const loadPresetTrail = (slugs: string[]) => {
    const places = slugs
      .map((s) => allPlaces.find((p) => p.slug === s))
      .filter((p): p is ExperiencePlace => Boolean(p));
    onDrawCustomTrail(places);
    ambientAudio.playUiBlip(880, 0.08);
  };

  return (
    <>
      {/* Floating Toggle Button when collapsed */}
      {isCollapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expand Pune District landmark directory"
          className="absolute top-16 left-4 z-20 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-emerald-500/40 text-white shadow-2xl hover:bg-black transition-transform hover:scale-105 active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            {filteredPlaces.length} {isMr ? 'स्थाने' : 'Locations'}
          </span>
          <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Panel Drawer */}
      <aside
        style={{ maxHeight: 'calc(100% - 5rem)' }}
        className={`absolute top-16 left-4 bottom-4 z-20 w-[340px] md:w-[390px] max-w-[calc(100vw-32px)] flex flex-col bg-black/95 backdrop-blur-2xl border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 text-white select-none ${
          isCollapsed ? '-translate-x-[120%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
        }`}
        aria-label="Pune District Landmark Explorer"
      >
        {/* Panel Header & Navigation Tabs */}
        <div className="p-3.5 border-b border-white/10 flex-shrink-0 bg-zinc-950/80">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('directory');
                  ambientAudio.playUiBlip(780, 0.04);
                }}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'directory'
                    ? 'bg-emerald-500 text-black font-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isMr ? 'स्थान सूची' : 'DIRECTORY'} ({filteredPlaces.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('trail');
                  ambientAudio.playUiBlip(880, 0.04);
                }}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'trail'
                    ? 'bg-emerald-500 text-black font-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>{isMr ? 'माझा मार्ग' : 'MY TRAIL'}</span>
                {customTrailPlaces.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center">
                    {customTrailPlaces.length}
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse directory"
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* TAB 1: DIRECTORY CONTROLS */}
          {activeTab === 'directory' && (
            <div className="space-y-2">
              {/* Real-time Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={isMr ? 'नाव, किल्ला, मंदिर किंवा निर्देशांक शोधा...' : 'Search fort, temple, lake, coordinates...'}
                  className="w-full px-3 py-1.5 pl-8 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white placeholder-white/40 font-mono transition-colors"
                />
                <svg
                  className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 15 Taluka Selector Dropdown */}
              <div>
                <select
                  value={selectedTaluka}
                  onChange={(e) => onSelectTaluka(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/30 text-xs font-mono text-emerald-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">
                    {isMr ? 'सर्व १५ तालुके (संपूर्ण जिल्हा)' : 'All 15 Talukas (Whole District)'}
                  </option>
                  {PUNE_TALUKAS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {isMr ? t.nameMr : t.nameEn} ({isMr ? t.headquartersMr : t.headquartersEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Horizontal Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-0.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-white/70'
                  }`}
                >
                  All ({allPlaces.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                      selectedCategory === cat.slug
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {isMr ? cat.nameMr : cat.nameEn} ({cat.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM MULTI-STOP ROUTE HEADER */}
          {activeTab === 'trail' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px] text-white/70">
                <span>{customTrailPlaces.length} Destinations Selected</span>
                <span className="text-emerald-400 font-bold">~{customTrailDistanceKm} km total</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={customTrailPlaces.length < 2}
                  onClick={() => onDrawCustomTrail(customTrailPlaces)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-mono font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
                >
                  <Route size={13} />
                  <span>DRAW ROUTE</span>
                </button>

                <button
                  type="button"
                  onClick={onClearCustomTrail}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-mono text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>CLEAR</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1 CONTENT: SCROLLABLE LANDMARK CARDS */}
        {activeTab === 'directory' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredPlaces.length === 0 ? (
              <div className="py-12 text-center text-white/40 text-xs font-mono">
                <p>No landmarks found matching query.</p>
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    onSelectCategory('all');
                    onSelectTaluka('all');
                  }}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs hover:bg-emerald-500/30"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected = selectedPlace?.slug === place.slug;
                const coords = formatCoordinatesDD(place.latitude, place.longitude, 4);
                const taluka = getTalukaOrRegion(place.latitude, place.longitude, place.address);
                const dist = calculateDistanceKm(18.5204, 73.8567, place.latitude, place.longitude);
                const elevation = getElevationEstimate(place.latitude, place.longitude, place.category_slug);
                const name = isMr ? place.name_mr || place.name : place.name;
                const isInTrail = customTrailPlaces.some((p) => p.slug === place.slug);

                return (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') onSelectPlace(place);
                    }}
                    className={`p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all border card-shimmer-hover ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-400 shadow-xl shadow-emerald-950/60 scale-[1.01]'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-white/15'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10"
                      style={{ position: 'relative', width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', flexShrink: 0, overflow: 'hidden' }}
                    >
                      <Image
                        src={place.image_url || '/images/hero-shaniwar-wada.webp'}
                        alt={name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Place Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-mono text-emerald-400 truncate font-semibold">
                          {taluka.nameEn.split(' ')[0]} • {place.category_slug}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 font-bold flex-shrink-0">
                          {dist} km
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white truncate leading-snug">
                        {name}
                      </h3>

                      <div className="flex items-center justify-between text-[9px] font-mono text-white/50 mt-1">
                        <span>{coords}</span>
                        <span className="text-cyan-300">⛰️ ~{elevation}m</span>
                      </div>
                    </div>

                    {/* Add to Custom Trail Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isInTrail) onRemoveFromCustomTrail(place.slug);
                        else onAddToCustomTrail(place);
                        ambientAudio.playUiBlip(920, 0.05);
                      }}
                      title={isInTrail ? 'Remove from custom route' : 'Add to custom route'}
                      className={`p-1.5 rounded-xl border transition-colors flex-shrink-0 ${
                        isInTrail
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-white/5 hover:bg-white/15 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {isInTrail ? <Trash2 size={12} /> : <Plus size={12} />}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2 CONTENT: CUSTOM TRAIL STOPS & PRESETS */}
        {activeTab === 'trail' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {customTrailPlaces.length === 0 ? (
              <div className="py-6 text-center text-white/60 text-xs font-mono space-y-4">
                <p>No stops added yet.</p>
                <p className="text-[11px] text-white/40">
                  Click the <strong>+</strong> button on any landmark in the Directory, or choose a curated Pune route below:
                </p>

                {/* Preset Trail Cards */}
                <div className="space-y-2 text-left pt-2 border-t border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                    POPULAR PUNE EXPEDITIONS
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      loadPresetTrail([
                        'sinhagad-fort',
                        'rajgad-fort',
                        'torna-fort',
                        'purandar-fort',
                      ])
                    }
                    className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono transition-colors"
                  >
                    <div className="font-bold text-amber-300">🏰 Sahyadri Four Great Forts</div>
                    <div className="text-[10px] text-white/50">Sinhagad → Rajgad → Torna → Purandar</div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      loadPresetTrail([
                        'shaniwar-wada',
                        'vishrambaug-wada',
                        'lal-mahal',
                        'shinde-chhatri',
                      ])
                    }
                    className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono transition-colors"
                  >
                    <div className="font-bold text-emerald-300">🏛️ Peshwa Royal Wadas Trail</div>
                    <div className="text-[10px] text-white/50">Shaniwar Wada → Vishrambaug → Lal Mahal</div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      loadPresetTrail([
                        'shreemant-dagdusheth-halwai-ganpati',
                        'alandi-dnyaneshwar-mandir',
                        'dehu-gatha-mandir',
                        'jejuri-khandoba-temple',
                      ])
                    }
                    className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono transition-colors"
                  >
                    <div className="font-bold text-orange-300">🛕 Sacred Shrines Trail</div>
                    <div className="text-[10px] text-white/50">Dagdusheth → Alandi → Dehu → Jejuri</div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {customTrailPlaces.map((place, idx) => (
                  <div
                    key={place.id}
                    className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-black font-mono font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">{place.name}</div>
                        <div className="text-[9px] font-mono text-white/40">
                          {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveFromCustomTrail(place.slug)}
                      className="p-1 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

export default React.memo(DistrictControlPanel);

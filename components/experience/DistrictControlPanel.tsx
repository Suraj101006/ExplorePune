'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { ExperiencePlace } from '@/lib/experience/types';
import { getAllPlaces, getCategories } from '@/lib/experience/selectors';
import {
  formatCoordinatesDD,
  getTalukaOrRegion,
  calculateDistanceKm,
  PUNE_TALUKAS,
} from '@/lib/experience/puneDistrictData';

interface DistrictControlPanelProps {
  selectedPlace: ExperiencePlace | null;
  selectedCategory: string;
  selectedTaluka: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: string) => void;
  onSelectTaluka: (talukaId: string) => void;
  onSelectPlace: (place: ExperiencePlace) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  lang?: string;
}

export default function DistrictControlPanel({
  selectedPlace,
  selectedCategory,
  selectedTaluka,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onSelectTaluka,
  onSelectPlace,
  isCollapsed,
  onToggleCollapse,
  lang = 'en',
}: DistrictControlPanelProps) {
  const isMr = lang === 'mr';
  const allPlaces = getAllPlaces();
  const categories = getCategories();

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

      // Search filter (name, address, category, or coordinates)
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
        className={`absolute top-16 left-4 bottom-4 z-20 w-[340px] md:w-[380px] max-w-[calc(100vw-32px)] flex flex-col bg-black/95 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 text-white select-none ${
          isCollapsed ? '-translate-x-[120%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
        }`}
        aria-label="Pune District Landmark Explorer"
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-white/10 flex-shrink-0 bg-zinc-950/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-xs font-mono font-black uppercase tracking-widest text-emerald-400">
                {isMr ? 'पुणे जिल्हा स्थान निर्देशांक' : 'DISTRICT DIRECTORY'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse directory"
              className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Real-time Search Input */}
          <div className="relative mb-2.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isMr ? 'नाव, किल्ला, मंदिर किंवा निर्देशांक शोधा...' : 'Search fort, temple, lake, coordinates...'}
              className="w-full px-3.5 py-2 pl-9 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white placeholder-white/40 font-mono transition-colors"
            />
            <svg
              className="w-4 h-4 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2"
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
          <div className="mb-2">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
              {isMr ? 'तालुका निवडा (१५ तालुके)' : 'SELECT TALUKA (15 REGIONS)'}
            </label>
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
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-[11px] font-mono">
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

        {/* Results Counter Bar */}
        <div className="px-4 py-1.5 bg-zinc-950/60 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-white/50 flex-shrink-0">
          <span>{filteredPlaces.length} {isMr ? 'स्थाने आढळली' : 'Landmarks Found'}</span>
          <span>Pune Datum: WGS 84</span>
        </div>

        {/* Scrollable Landmark Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
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
              const name = isMr ? place.name_mr || place.name : place.name;

              return (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelectPlace(place);
                  }}
                  className={`p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-lg shadow-emerald-950/50 scale-[1.01]'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900">
                    <Image
                      src={place.image_url || '/images/hero-shaniwar-wada.webp'}
                      alt={name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  {/* Place Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-white truncate max-w-[170px]">
                        {name}
                      </h4>
                      <span className="text-[9px] font-mono text-amber-300 font-semibold">
                        {dist} km
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 mb-1">
                      <span className="text-emerald-400">📍 {isMr ? taluka.nameMr : taluka.nameEn}</span>
                      <span>•</span>
                      <span className="truncate">{place.category_slug}</span>
                    </div>

                    <div className="text-[9px] font-mono text-white/40 truncate">
                      {coords}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}

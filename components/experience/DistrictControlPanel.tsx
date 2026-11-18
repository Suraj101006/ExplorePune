'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { ExperiencePlace } from '@/lib/experience/types';
import { getAllPlaces, getCategories } from '@/lib/experience/selectors';
import { formatCoordinatesDD, getTalukaOrRegion } from '@/lib/experience/puneDistrictData';

interface DistrictControlPanelProps {
  selectedPlace: ExperiencePlace | null;
  selectedCategory: string;
  selectedTaluka: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: string) => void;
  onSelectTaluka: (taluka: string) => void;
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
        if (!taluka.nameEn.toLowerCase().includes(selectedTaluka.toLowerCase())) {
          return false;
        }
      }

      // Search filter (handles place name, category, or lat/lng numbers!)
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
          aria-label="Expand Pune District directory"
          className="absolute top-16 left-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/85 backdrop-blur-md border border-emerald-500/40 text-white shadow-2xl hover:bg-black transition-transform hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            {filteredPlaces.length} Locations
          </span>
          <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Panel Drawer */}
      <aside
        className={`absolute top-16 left-4 bottom-4 z-20 w-[350px] md:w-[380px] max-w-[calc(100vw-32px)] flex flex-col bg-black/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 text-white ${
          isCollapsed ? '-translate-x-[120%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
        }`}
        aria-label="Pune District Landmark Explorer"
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-white/10 flex-shrink-0 bg-zinc-950/70">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-xs font-mono font-black uppercase tracking-widest text-emerald-400">
                {isMr ? 'पुणे जिल्हा स्थान निर्देशांक' : 'DISTRICT COORDINATES'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse directory"
              className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mb-2.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isMr ? 'नाव किंवा GPS निर्देशांक शोधा (उदा. 18.36)...' : 'Search by name or coordinates (e.g. 18.36)...'}
              className="w-full pl-9 pr-8 py-2 text-xs font-mono text-white bg-zinc-900 border border-emerald-500/30 rounded-xl placeholder:text-white/40 focus:outline-none focus:border-emerald-400"
            />
            <svg
              className="w-4 h-4 text-emerald-400/60 absolute left-2.5 top-1/2 -translate-y-1/2"
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              All (106)
            </button>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? 'text-white bg-white/20 border border-emerald-400 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-transparent'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{isMr ? cat.nameMr : cat.nameEn}</span>
                  <span className="text-[9px] opacity-70">({cat.count})</span>
                </button>
              );
            })}
          </div>

          {/* Taluka Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-white/5 text-[10px] font-mono">
            <span className="text-white/40 flex-shrink-0">TALUKA:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'junnar', label: 'Junnar' },
              { id: 'maval', label: 'Maval' },
              { id: 'mulshi', label: 'Mulshi' },
              { id: 'velhe', label: 'Velhe' },
              { id: 'pune', label: 'City Core' },
              { id: 'purandar', label: 'Purandar' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTaluka(t.id)}
                className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                  selectedTaluka === t.id
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Locations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 custom-scrollbar">
          {filteredPlaces.length === 0 ? (
            <div className="py-12 text-center text-white/40 font-mono text-xs">
              <p>NO LOCATIONS MATCH QUERY</p>
            </div>
          ) : (
            filteredPlaces.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              const placeName = isMr ? place.name_mr || place.name : place.name;
              const coords = formatCoordinatesDD(place.latitude, place.longitude, 4);
              const taluka = getTalukaOrRegion(place.latitude, place.longitude, place.address);

              return (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  className={`p-2.5 rounded-2xl cursor-pointer transition-all border flex gap-3 items-center group ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-xl'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-emerald-500/30'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/10">
                    <Image
                      src={place.image_url || '/images/hero-shaniwar-wada.webp'}
                      alt={placeName}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 truncate">
                        {place.category_slug}
                      </span>
                      <span className="text-[9px] font-mono text-white/40 truncate">
                        {taluka.nameEn.split(' ')[0]}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {placeName}
                    </h3>

                    {/* Coordinates Chip */}
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-amber-300/90 bg-black/40 px-2 py-0.5 rounded-md border border-white/5 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{coords}</span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="text-white/20 group-hover:text-emerald-400 transition-colors pr-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Status */}
        <div className="p-3 border-t border-white/10 bg-zinc-950 flex items-center justify-between text-[11px] font-mono text-white/50 flex-shrink-0">
          <span>{filteredPlaces.length} LOCATIONS PINNED</span>
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            100% REAL GPS
          </span>
        </div>
      </aside>
    </>
  );
}

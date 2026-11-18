'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { ExperiencePlace, ZoneId } from '@/lib/experience/types';
import { getAllPlaces, getCategories } from '@/lib/experience/selectors';
import { getExperienceDictionary } from '@/lib/experience/i18n';

interface LeftPanelProps {
  selectedPlace: ExperiencePlace | null;
  selectedCategory: string;
  selectedZone: ZoneId | 'all';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (catSlug: string) => void;
  onSelectPlace: (place: ExperiencePlace) => void;
  lang?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function LeftPanel({
  selectedPlace,
  selectedCategory,
  selectedZone,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onSelectPlace,
  lang = 'en',
  isCollapsed = false,
  onToggleCollapse,
}: LeftPanelProps) {
  const dict = getExperienceDictionary(lang);
  const isMr = lang === 'mr';
  const allPlaces = getAllPlaces();
  const categories = getCategories();

  // Filter places based on search, category, zone
  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPlaces.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category_slug !== selectedCategory) {
        return false;
      }
      // Zone filter
      if (selectedZone !== 'all' && p.zoneId !== selectedZone) {
        return false;
      }
      // Search filter
      if (q) {
        const nameEn = (p.name || '').toLowerCase();
        const nameMr = (p.name_mr || '').toLowerCase();
        const descEn = (p.description || '').toLowerCase();
        const descMr = (p.description_mr || '').toLowerCase();
        const addr = (p.address || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        return (
          nameEn.includes(q) ||
          nameMr.includes(q) ||
          descEn.includes(q) ||
          descMr.includes(q) ||
          addr.includes(q) ||
          cat.includes(q)
        );
      }
      return true;
    });
  }, [allPlaces, selectedCategory, selectedZone, searchQuery]);

  return (
    <>
      {/* Floating Toggle Button when collapsed */}
      {isCollapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expand destinations list"
          className="absolute top-20 left-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1F242D]/90 backdrop-blur-md border border-white/15 text-white shadow-2xl hover:bg-[#1F242D] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <svg className="w-4 h-4 text-[#F1293A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">
            {dict.map.placesCount.replace('{count}', filteredPlaces.length.toString())}
          </span>
        </button>
      )}

      {/* Main Drawer Panel */}
      <aside
        className={`absolute top-4 left-4 bottom-4 z-20 w-[360px] md:w-[380px] max-w-[calc(100vw-32px)] flex flex-col bg-[#1F242D]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isCollapsed ? '-translate-x-[120%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
        }`}
        aria-label="Explore Pune Destinations Directory"
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F1293A] animate-pulse" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Explore Pune <span className="text-white/40 font-normal">| 106 Places</span>
              </h2>
            </div>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse panel"
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={dict.map.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 text-xs text-white bg-black/40 border border-white/10 rounded-xl placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors"
            />
            <svg
              className="w-4 h-4 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5"
                aria-label="Clear search"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Category Tabs Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              {dict.map.allCategories} ({allPlaces.length})
            </button>
            {categories.map((cat) => {
              const isCatActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider transition-all whitespace-nowrap ${
                    isCatActive
                      ? 'text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isCatActive ? `${cat.color}33` : undefined,
                    border: isCatActive ? `1px solid ${cat.color}` : '1px solid transparent',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{isMr ? cat.nameMr : cat.nameEn}</span>
                  <span className="text-[10px] opacity-60">({cat.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Places List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 custom-scrollbar">
          {filteredPlaces.length === 0 ? (
            <div className="py-12 text-center text-white/40">
              <svg
                className="w-8 h-8 mx-auto mb-2 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs">{dict.map.noResults}</p>
            </div>
          ) : (
            filteredPlaces.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              const placeName = isMr ? place.name_mr || place.name : place.name;
              const placeHours = isMr
                ? place.opening_hours_mr || place.opening_hours
                : place.opening_hours;

              return (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPlace(place);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  className={`group relative p-2.5 rounded-2xl cursor-pointer transition-all border flex gap-3 items-center focus:outline-none focus:ring-2 focus:ring-white ${
                    isSelected
                      ? 'bg-white/15 border-[#F1293A] shadow-xl'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                    <Image
                      src={place.image_url || '/images/hero-shaniwar-wada.webp'}
                      alt={placeName}
                      fill
                      sizes="56px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#F1293A]">
                        {place.category_slug}
                      </span>
                      {place.entry_fee === 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          {dict.map.freeEntry}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                      {placeName}
                    </h3>
                    {placeHours && (
                      <p className="text-[10px] text-white/50 truncate mt-0.5">
                        {placeHours}
                      </p>
                    )}
                  </div>

                  {/* Arrow Indicator */}
                  <div className="text-white/20 group-hover:text-white/80 transition-colors pr-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-white/50 flex-shrink-0">
          <span>
            {dict.map.placesCount.replace('{count}', filteredPlaces.length.toString())}
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Verified
          </span>
        </div>
      </aside>
    </>
  );
}

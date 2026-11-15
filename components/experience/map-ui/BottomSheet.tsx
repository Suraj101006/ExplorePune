'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExperiencePlace, ZoneId } from '@/lib/experience/types';
import { getAllPlaces, getCategories, getZones } from '@/lib/experience/selectors';
import { getExperienceDictionary } from '@/lib/experience/i18n';

interface BottomSheetProps {
  selectedPlace: ExperiencePlace | null;
  selectedCategory: string;
  selectedZone: ZoneId | 'all';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: string) => void;
  onSelectPlace: (place: ExperiencePlace) => void;
  onClosePlace: () => void;
  lang?: string;
}

type SnapState = 'peek' | 'half' | 'full';

export default function BottomSheet({
  selectedPlace,
  selectedCategory,
  selectedZone,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onSelectPlace,
  onClosePlace,
  lang = 'en',
}: BottomSheetProps) {
  const dict = getExperienceDictionary(lang);
  const isMr = lang === 'mr';
  const allPlaces = getAllPlaces();
  const categories = getCategories();
  const zones = getZones();

  const [snap, setSnap] = useState<SnapState>('peek');

  // Auto-expand to half when place is selected
  useEffect(() => {
    if (selectedPlace) {
      setSnap('half');
    }
  }, [selectedPlace]);

  // Filtered places
  const filteredPlaces = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPlaces.filter((p) => {
      if (selectedCategory !== 'all' && p.category_slug !== selectedCategory) return false;
      if (selectedZone !== 'all' && p.zoneId !== selectedZone) return false;
      if (q) {
        const nameEn = (p.name || '').toLowerCase();
        const nameMr = (p.name_mr || '').toLowerCase();
        return nameEn.includes(q) || nameMr.includes(q);
      }
      return true;
    });
  }, [allPlaces, selectedCategory, selectedZone, searchQuery]);

  const snapHeights: Record<SnapState, string> = {
    peek: 'h-24',
    half: 'h-[50vh]',
    full: 'h-[85vh]',
  };

  const navUrl = selectedPlace
    ? `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.latitude},${selectedPlace.longitude}`
    : '#';

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-30 bg-[#1F242D]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl shadow-2xl transition-all duration-300 flex flex-col ${snapHeights[snap]}`}
    >
      {/* Top Handle / Pill */}
      <div
        className="w-full pt-3 pb-2 flex flex-col items-center cursor-pointer flex-shrink-0 touch-none"
        onClick={() => {
          if (snap === 'peek') setSnap('half');
          else if (snap === 'half') setSnap('full');
          else setSnap('peek');
        }}
      >
        <div className="w-12 h-1.5 rounded-full bg-white/20 mb-1" />
      </div>

      {/* Snap Controls Bar */}
      <div className="px-4 pb-2 flex items-center justify-between border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F1293A]" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {selectedPlace
              ? (isMr ? selectedPlace.name_mr || selectedPlace.name : selectedPlace.name)
              : `${filteredPlaces.length} Destinations`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {selectedPlace && (
            <button
              type="button"
              onClick={onClosePlace}
              aria-label="Back to destinations list"
              className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/70"
            >
              List
            </button>
          )}
          <button
            type="button"
            onClick={() => setSnap(snap === 'full' ? 'half' : 'full')}
            className="p-1 rounded text-white/50 hover:text-white"
            aria-label="Toggle expand"
          >
            <svg
              className={`w-4 h-4 transition-transform ${snap === 'full' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {selectedPlace ? (
          /* Selected Place View */
          <div className="space-y-4">
            <div className="relative h-44 rounded-2xl overflow-hidden bg-black/40">
              <Image
                src={selectedPlace.image_url || '/images/hero-shaniwar-wada.webp'}
                alt={selectedPlace.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-black/60 text-white border border-white/20">
                  {selectedPlace.category_slug}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                  {selectedPlace.entry_fee === 0 ? dict.map.freeEntry : `₹${selectedPlace.entry_fee}`}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                {isMr ? selectedPlace.name_mr || selectedPlace.name : selectedPlace.name}
              </h3>
              <p className="text-xs text-white/60 line-clamp-3 mt-1">
                {isMr ? selectedPlace.description_mr || selectedPlace.description : selectedPlace.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={navUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#F1293A] text-white text-xs font-bold shadow-lg"
              >
                <span>{dict.map.btnNavigate}</span>
              </a>
              <Link
                href={`/places/${selectedPlace.slug}`}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/10"
              >
                <span>{dict.map.btnFullGuide}</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Place List View */
          <div className="space-y-3">
            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={dict.map.searchPlaceholder}
              className="w-full px-3 py-2 text-xs text-white bg-black/40 border border-white/10 rounded-xl placeholder:text-white/40 focus:outline-none"
            />

            {/* Category horizontal scroll */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60'
                }`}
              >
                {dict.map.allCategories}
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => onSelectCategory(c.slug)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    selectedCategory === c.slug
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/60'
                  }`}
                >
                  {isMr ? c.nameMr : c.nameEn}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredPlaces.slice(0, 30).map((place) => (
                <div
                  key={place.id}
                  onClick={() => {
                    onSelectPlace(place);
                    setSnap('half');
                  }}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3 cursor-pointer"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    <Image
                      src={place.image_url || '/images/hero-shaniwar-wada.webp'}
                      alt={place.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {isMr ? place.name_mr || place.name : place.name}
                    </h4>
                    <p className="text-[10px] text-white/50 truncate">
                      {place.category_slug} • {place.opening_hours || 'Open'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

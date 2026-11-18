'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  Navigation,
  ExternalLink,
  Landmark,
  TreePine,
  Droplets,
  BookOpen,
  Compass,
  X,
} from 'lucide-react';
import { getAllPlaces } from '@/lib/experience/selectors';
import { ExperiencePlace } from '@/lib/experience/types';
import {
  formatCoordinatesDD,
  formatCoordinatesDMS,
  getTalukaOrRegion,
  getElevationEstimate,
  calculateDistanceKm,
} from '@/lib/experience/puneDistrictData';

interface ExploreAnywhereModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndFly: (place: ExperiencePlace) => void;
  lang?: string;
}

export default function ExploreAnywhereModal({
  isOpen,
  onClose,
  onSelectAndFly,
  lang = 'en',
}: ExploreAnywhereModalProps) {
  const isMr = lang === 'mr';
  const allPlaces = useMemo(() => getAllPlaces(), []);
  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewPlace, setPreviewPlace] = useState<ExperiencePlace | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      if (allPlaces.length > 0 && !previewPlace) {
        setPreviewPlace(allPlaces[0]);
      }
    }
  }, [isOpen, allPlaces, previewPlace]);

  // Keyboard shortcut listener (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter places
  const filteredPlaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPlaces.filter((p) => {
      if (selectedCategory !== 'all' && p.category_slug !== selectedCategory) {
        return false;
      }
      if (!q) return true;

      const nameEn = (p.name || '').toLowerCase();
      const nameMr = (p.name_mr || '').toLowerCase();
      const addr = (p.address || '').toLowerCase();
      const cat = (p.category_slug || '').toLowerCase();
      const taluka = getTalukaOrRegion(p.latitude, p.longitude, p.address);
      const talukaMatch = taluka.nameEn.toLowerCase().includes(q) || taluka.nameMr.includes(q);
      const latStr = p.latitude.toFixed(4);
      const lngStr = p.longitude.toFixed(4);

      return (
        nameEn.includes(q) ||
        nameMr.includes(q) ||
        addr.includes(q) ||
        cat.includes(q) ||
        talukaMatch ||
        latStr.includes(q) ||
        lngStr.includes(q)
      );
    });
  }, [allPlaces, query, selectedCategory]);

  // Update preview place if list updates and current preview is not in list
  useEffect(() => {
    if (filteredPlaces.length > 0) {
      if (!previewPlace || !filteredPlaces.some((p) => p.slug === previewPlace.slug)) {
        setPreviewPlace(filteredPlaces[0]);
      }
    }
  }, [filteredPlaces, previewPlace]);

  if (!isOpen) return null;

  const currentPreview = previewPlace || (filteredPlaces.length > 0 ? filteredPlaces[0] : null);

  const previewName = currentPreview
    ? isMr
      ? currentPreview.name_mr || currentPreview.name
      : currentPreview.name
    : '';
  const previewTaluka = currentPreview
    ? getTalukaOrRegion(currentPreview.latitude, currentPreview.longitude, currentPreview.address)
    : null;
  const previewCoordsDD = currentPreview
    ? formatCoordinatesDD(currentPreview.latitude, currentPreview.longitude, 5)
    : '';
  const previewCoordsDMS = currentPreview
    ? formatCoordinatesDMS(currentPreview.latitude, currentPreview.longitude).fullDMS
    : '';
  const previewDist = currentPreview
    ? calculateDistanceKm(18.5204, 73.8567, currentPreview.latitude, currentPreview.longitude)
    : 0;
  const previewElevation = currentPreview
    ? getElevationEstimate(currentPreview.latitude, currentPreview.longitude, currentPreview.category_slug)
    : 560;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Explore Anywhere GPS Destination Finder"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-950 border border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Top Header & Search Input */}
        <div className="p-4 border-b border-white/10 bg-black/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-mono font-black uppercase tracking-wider text-emerald-400">
                {isMr ? 'कुठेही शोधा — अचूक GPS निर्देशांक व ३D उड्डाण' : 'EXPLORE ANYWHERE — DIRECT GPS JUMP & 3D FLY-TO'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-emerald-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isMr
                  ? 'स्थानाचे नाव, तालुका (उदा. मावळ, जुन्नर) किंवा GPS अक्षांश टाका...'
                  : 'Search by landmark, taluka (e.g. Maval, Junnar), fort name, or GPS coordinates...'
              }
              className="w-full pl-10 pr-24 py-3 rounded-2xl bg-white/[0.06] border border-emerald-500/30 text-white placeholder-white/40 text-sm focus:outline-none focus:border-emerald-400 focus:bg-white/[0.1] font-mono transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-white/50">
                ESC
              </span>
            </div>
          </div>

          {/* Quick Filter Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 custom-scrollbar scrollbar-none text-xs font-mono">
            {[
              { id: 'all', labelEn: 'All (106)', labelMr: 'सर्व (१०६)' },
              { id: 'forts', labelEn: 'Forts', labelMr: 'किल्ले' },
              { id: 'temples', labelEn: 'Temples', labelMr: 'मंदिरे' },
              { id: 'heritage', labelEn: 'Heritage', labelMr: 'वारसा' },
              { id: 'nature', labelEn: 'Nature', labelMr: 'निसर्ग' },
              { id: 'parks', labelEn: 'Lakes & Dams', labelMr: 'जलाशय' },
              { id: 'museums', labelEn: 'Museums', labelMr: 'संग्रहालये' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1 rounded-full transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-white/5 hover:bg-white/15 text-white/70'
                }`}
              >
                {isMr ? cat.labelMr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Split View (List on left, Preview on right) */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          {/* Results List */}
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto custom-scrollbar p-3 space-y-2 max-h-[380px] md:max-h-none">
            {filteredPlaces.length === 0 ? (
              <div className="py-12 text-center text-white/40 font-mono text-xs">
                {isMr ? 'कोणतेही स्थान आढळले नाही.' : 'No destinations match your search.'}
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected = currentPreview?.slug === place.slug;
                const taluka = getTalukaOrRegion(place.latitude, place.longitude, place.address);
                const coords = formatCoordinatesDD(place.latitude, place.longitude, 4);
                const dist = calculateDistanceKm(18.5204, 73.8567, place.latitude, place.longitude);
                const name = isMr ? place.name_mr || place.name : place.name;

                return (
                  <div
                    key={place.slug}
                    onClick={() => setPreviewPlace(place)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSelectAndFly(place);
                        onClose();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all border text-left ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-400 shadow-lg'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5'
                    }`}
                  >
                    <div
                      className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900"
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

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-white truncate">{name}</span>
                        <span className="text-[10px] font-mono text-emerald-400 flex-shrink-0 font-bold">
                          {dist} km
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-white/50">
                        <span className="truncate">{isMr ? taluka.nameMr : taluka.nameEn}</span>
                        <span>•</span>
                        <span className="text-amber-300 truncate">{coords}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Destination Preview Pane */}
          {currentPreview && (
            <div className="w-full md:w-1/2 p-5 flex flex-col justify-between bg-zinc-950 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {/* Photo Preview */}
                <div
                  className="relative h-44 w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-xl"
                  style={{ position: 'relative', width: '100%', height: '176px', overflow: 'hidden' }}
                >
                  <Image
                    src={currentPreview.image_url || '/images/hero-shaniwar-wada.webp'}
                    alt={previewName}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                      {currentPreview.category_slug}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/80 text-amber-300 border border-white/20">
                      ⛰️ {previewElevation}m MSL
                    </span>
                  </div>
                </div>

                {/* Title & Taluka */}
                <div>
                  <h3 className="text-lg font-black text-white">{previewName}</h3>
                  <p className="text-xs font-mono text-emerald-400 mt-0.5">
                    {previewTaluka ? (isMr ? previewTaluka.nameMr : previewTaluka.nameEn) : ''} •{' '}
                    <span className="text-white/60">{previewDist} km from Pune Zero Stone</span>
                  </p>
                </div>

                {/* Verified GPS Grid */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5 font-mono text-xs">
                  <div className="text-[10px] font-bold uppercase text-white/50 tracking-wider">
                    {isMr ? 'तपासलेले GPS निर्देशांक' : 'VERIFIED GEODETIC COORDINATES'}
                  </div>
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span>Decimal (DD):</span>
                    <span>{previewCoordsDD}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80 text-[11px]">
                    <span>DMS:</span>
                    <span>{previewCoordsDMS}</span>
                  </div>
                </div>

                {/* Address */}
                <p className="text-xs text-white/70 line-clamp-2">
                  {currentPreview.address}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectAndFly(currentPreview);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs uppercase tracking-wider shadow-xl transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Navigation size={14} />
                  <span>{isMr ? '३D उड्डाण करा' : 'Fly to Location (3D)'}</span>
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${currentPreview.latitude},${currentPreview.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-white/15"
                >
                  <ExternalLink size={14} />
                  <span>{isMr ? 'गुगल मॅप्स' : 'Google Maps'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

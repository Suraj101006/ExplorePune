'use client';

import React, { useMemo } from 'react';
import { Compass, Landmark } from 'lucide-react';
import { PUNE_TALUKAS, TalukaDefinition, getTalukaOrRegion } from '@/lib/experience/puneDistrictData';
import { ExperiencePlace } from '@/lib/experience/types';

interface DistrictRegionBarProps {
  selectedTaluka: string;
  onSelectTaluka: (talukaId: string) => void;
  allPlaces: ExperiencePlace[];
  lang?: string;
  className?: string;
}

export default function DistrictRegionBar({
  selectedTaluka,
  onSelectTaluka,
  allPlaces,
  lang = 'en',
  className = '',
}: DistrictRegionBarProps) {
  const isMr = lang === 'mr';

  // Calculate destination counts per taluka
  const talukaCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allPlaces.length };
    PUNE_TALUKAS.forEach((t) => {
      counts[t.id] = 0;
    });

    allPlaces.forEach((p) => {
      const reg = getTalukaOrRegion(p.latitude, p.longitude, p.address);
      if (counts[reg.id] !== undefined) {
        counts[reg.id] += 1;
      }
    });

    return counts;
  }, [allPlaces]);

  // Selected taluka object
  const activeTaluka: TalukaDefinition | undefined = PUNE_TALUKAS.find((t) => t.id === selectedTaluka);

  return (
    <div className={`flex flex-col gap-1.5 select-none ${className}`}>
      {/* Horizontal Scrollable Taluka Chips */}
      <nav
        aria-label="Pune District Taluka Regions"
        className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 custom-scrollbar scrollbar-none"
      >
        {/* All District Chip */}
        <button
          type="button"
          onClick={() => onSelectTaluka('all')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-md ${
            selectedTaluka === 'all'
              ? 'bg-emerald-500 text-black border border-emerald-400 scale-105'
              : 'bg-black/80 hover:bg-black/95 text-white/80 hover:text-white border border-white/10 hover:border-white/30 backdrop-blur-md'
          }`}
        >
          <Compass size={13} className={selectedTaluka === 'all' ? 'text-black' : 'text-emerald-400'} />
          <span>{isMr ? 'संपूर्ण जिल्हा' : 'All District'}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedTaluka === 'all' ? 'bg-black/30 text-black' : 'bg-white/10 text-emerald-400'
            }`}
          >
            {talukaCounts.all || 106}
          </span>
        </button>

        {/* 15 Taluka Chips */}
        {PUNE_TALUKAS.map((taluka) => {
          const isSelected = selectedTaluka === taluka.id;
          const count = talukaCounts[taluka.id] || 0;

          return (
            <button
              key={taluka.id}
              type="button"
              onClick={() => onSelectTaluka(taluka.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all shadow-md ${
                isSelected
                  ? 'bg-amber-400 text-black font-black border border-amber-300 scale-105 shadow-amber-500/20'
                  : 'bg-black/80 hover:bg-black/95 text-white/80 hover:text-white border border-white/10 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              <span>{isMr ? taluka.nameMr : taluka.nameEn}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-black/30 text-black' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Selected Taluka Floating Mini-Card */}
      {activeTaluka && (
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-black/90 backdrop-blur-xl border border-amber-500/40 shadow-2xl animate-in fade-in slide-in-from-top-1 text-white">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
              <Landmark size={15} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-amber-300 truncate">
                  {isMr ? activeTaluka.nameMr : activeTaluka.nameEn}
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  HQ: {isMr ? activeTaluka.headquartersMr : activeTaluka.headquartersEn} • {activeTaluka.areaSqKm} km²
                </span>
              </div>
              <p className="text-[10px] text-white/60 truncate max-w-xl">
                {isMr ? activeTaluka.significanceMr : activeTaluka.significanceEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              {talukaCounts[activeTaluka.id] || 0} {isMr ? 'स्थाने' : 'Places'}
            </span>
            <button
              type="button"
              onClick={() => onSelectTaluka('all')}
              title={isMr ? 'सर्व तालुके दाखवा' : 'Show All Talukas'}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

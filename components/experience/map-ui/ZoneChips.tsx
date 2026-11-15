'use client';

import React from 'react';
import { ZoneId, ZoneDefinition } from '@/lib/experience/types';
import { getZones, getAllPlaces } from '@/lib/experience/selectors';
import { getExperienceDictionary } from '@/lib/experience/i18n';

interface ZoneChipsProps {
  selectedZone: ZoneId | 'all';
  onSelectZone: (zoneId: ZoneId | 'all') => void;
  lang?: string;
  className?: string;
}

export default function ZoneChips({
  selectedZone,
  onSelectZone,
  lang = 'en',
  className = '',
}: ZoneChipsProps) {
  const dict = getExperienceDictionary(lang);
  const isMr = lang === 'mr';
  const zones = getZones();
  const allPlaces = getAllPlaces();

  // Compute count per zone
  const zoneCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: allPlaces.length };
    zones.forEach((z) => {
      counts[z.id] = allPlaces.filter((p) => p.zoneId === z.id).length;
    });
    return counts;
  }, [allPlaces, zones]);

  return (
    <div
      className={`relative z-20 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-3 sm:px-4 backdrop-blur-md bg-[#1F242D]/85 border border-white/10 rounded-full shadow-2xl ${className}`}
      role="toolbar"
      aria-label={dict.map.zonesHeading}
    >
      {/* All Zones Pill */}
      <button
        type="button"
        onClick={() => onSelectZone('all')}
        aria-pressed={selectedZone === 'all'}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white/50 ${
          selectedZone === 'all'
            ? 'bg-white text-black shadow-lg scale-105'
            : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
        }`}
      >
        <span>{dict.map.allZones}</span>
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${
            selectedZone === 'all' ? 'bg-black text-white' : 'bg-white/10 text-white/60'
          }`}
        >
          {zoneCounts.all}
        </span>
      </button>

      {/* 5 Geographic Zones */}
      {zones.map((zone: ZoneDefinition) => {
        const isSelected = selectedZone === zone.id;
        const count = zoneCounts[zone.id] || 0;

        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelectZone(zone.id)}
            aria-pressed={isSelected}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white/50 ${
              isSelected
                ? 'text-white shadow-xl scale-105 border'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-transparent'
            }`}
            style={{
              backgroundColor: isSelected ? `${zone.accentColor}33` : undefined,
              borderColor: isSelected ? zone.accentColor : 'transparent',
              boxShadow: isSelected ? `0 0 16px ${zone.accentColor}40` : undefined,
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: zone.accentColor }}
            />
            <span>{isMr ? zone.nameMr : zone.nameEn}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${
                isSelected
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

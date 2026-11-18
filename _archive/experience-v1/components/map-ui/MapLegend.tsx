'use client';

import React, { useState } from 'react';
import { getCategories } from '@/lib/experience/selectors';
import { getExperienceDictionary } from '@/lib/experience/i18n';

interface MapLegendProps {
  lang?: string;
  className?: string;
}

export default function MapLegend({ lang = 'en', className = '' }: MapLegendProps) {
  const dict = getExperienceDictionary(lang);
  const isMr = lang === 'mr';
  const categories = getCategories();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`absolute bottom-6 left-4 md:left-[404px] z-20 flex flex-col items-start gap-2 ${className}`}
    >
      {/* Expanded Legend Popover */}
      {isOpen && (
        <div className="p-3.5 rounded-2xl bg-[#1F242D]/95 backdrop-blur-xl border border-white/10 shadow-2xl text-xs space-y-2 mb-1 w-64 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white text-[11px] uppercase tracking-wider">
              {dict.map.categoriesHeading}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white"
              aria-label="Close legend"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {categories.map((c) => (
              <div key={c.slug} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-[11px] text-white/80 truncate">
                  {isMr ? c.nameMr : c.nameEn}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] text-white/40 leading-relaxed">
            <span>© </span>
            <a
              href="https://openfreemap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70"
            >
              OpenFreeMap
            </a>
            <span> • © </span>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70"
            >
              OpenStreetMap contributors (ODbL)
            </a>
            <span> • © </span>
            <a
              href="https://carto.com/attributions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70"
            >
              CARTO
            </a>
          </div>
        </div>
      )}

      {/* Pill Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Map Legend and Attribution"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F242D]/85 hover:bg-[#1F242D] backdrop-blur-md border border-white/10 text-white/70 hover:text-white text-[11px] font-bold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-white"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span>Legend & Attribution</span>
      </button>
    </div>
  );
}

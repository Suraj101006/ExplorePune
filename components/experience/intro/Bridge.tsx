'use client';

import React from 'react';
import { getExperienceV2I18n } from '@/lib/experience/i18n';
import { Plane, ChevronDown } from 'lucide-react';

interface BridgeProps {
  lang?: string;
  onEnterMap?: () => void;
}

export default function Bridge({ lang = 'en', onEnterMap }: BridgeProps) {
  const dict = getExperienceV2I18n(lang);

  const handleScrollToMap = () => {
    if (onEnterMap) {
      onEnterMap();
    } else {
      const mapEl = document.getElementById('map');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative py-28 md:py-44 px-4 text-center bg-gradient-to-b from-transparent via-[#20232c] to-[#30333E] text-white overflow-hidden">
      {/* Decorative radial blur */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[150px]"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-6">
          <Plane size={13} className="rotate-45" />
          <span>{dict.intro.bridge.badge}</span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6">
          {dict.intro.bridge.headline}
        </h2>

        <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          {dict.intro.bridge.subtext}
        </p>

        <div>
          <button
            type="button"
            onClick={handleScrollToMap}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-black uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-2xl shadow-amber-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>{dict.intro.bridge.enterMapBtn}</span>
            <ChevronDown size={22} className="transition-transform group-hover:translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

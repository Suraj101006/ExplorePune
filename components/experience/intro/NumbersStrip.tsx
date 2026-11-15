'use client';

import React from 'react';
import { getStatsSummary } from '@/lib/experience/selectors';
import { getExperienceV2I18n } from '@/lib/experience/i18n';

interface NumbersStripProps {
  lang?: string;
}

export default function NumbersStrip({ lang = 'en' }: NumbersStripProps) {
  const dict = getExperienceV2I18n(lang);
  const stats = getStatsSummary();

  const metrics = [
    { value: stats.totalPlaces, label: dict.intro.numbers.placesLabel, suffix: '' },
    { value: stats.totalCategories, label: dict.intro.numbers.categoriesLabel, suffix: '' },
    { value: stats.totalZones, label: dict.intro.numbers.zonesLabel, suffix: '' },
    { value: stats.totalItineraries, label: dict.intro.numbers.itinerariesLabel, suffix: '' },
  ];

  return (
    <section className="py-16 md:py-24 border-y border-slate-300 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-4xl sm:text-6xl md:text-7xl font-black tabular-nums tracking-tighter text-amber-600 dark:text-amber-400">
                {m.value}
                {m.suffix}
              </div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mt-2">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8 font-mono">
          {dict.intro.numbers.statSubtext}
        </p>
      </div>
    </section>
  );
}

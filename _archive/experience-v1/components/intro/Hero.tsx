'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getExperienceV2I18n } from '@/lib/experience/i18n';
import { Plane, ChevronDown, Sparkles, MapPin, ArrowRight } from 'lucide-react';

interface HeroProps {
  lang?: string;
  onFlyToMap?: () => void;
}

interface ShowcaseCard {
  slug: string;
  nameEn: string;
  nameMr: string;
  categoryEn: string;
  categoryMr: string;
  image: string;
  stat: string;
}

const SHOWCASE_PLACES: ShowcaseCard[] = [
  {
    slug: 'sinhagad-fort',
    nameEn: 'Sinhagad Fort',
    nameMr: 'सिंहगड किल्ला',
    categoryEn: 'Sahyadri Fortress • 1,312m',
    categoryMr: 'सह्याद्रीचा डोंगरी बालेकिल्ला',
    image: '/images/places/sinhagad-fort.jpg',
    stat: '1670 CE Battle',
  },
  {
    slug: 'shaniwar-wada',
    nameEn: 'Shaniwar Wada',
    nameMr: 'शनिवार वाडा',
    categoryEn: 'Peshwa Imperial Seat',
    categoryMr: 'पेशवेकालीन ऐतिहासिक राजवाडा',
    image: '/images/places/shaniwar-wada.jpg',
    stat: '1732 CE Dilli Darwaza',
  },
  {
    slug: 'vetal-tekdi',
    nameEn: 'Vetal Tekdi',
    nameMr: 'वेताळ टेकडी',
    categoryEn: 'Urban Sunrise Tekdi • 792m',
    categoryMr: 'पुण्यातील सर्वोच्च नैसर्गिक टेकडी',
    image: '/images/places/vetal-tekdi.jpg',
    stat: 'Highest City Peak',
  },
];

export default function Hero({ lang = 'en', onFlyToMap }: HeroProps) {
  const dict = getExperienceV2I18n(lang);
  const isMr = lang === 'mr';
  const [activeCard, setActiveCard] = useState<ShowcaseCard>(SHOWCASE_PLACES[0]);

  const scrollToMap = () => {
    if (onFlyToMap) {
      onFlyToMap();
    } else {
      const mapEl = document.getElementById('map');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('feature-guide');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center px-4 md:px-8 py-16 md:py-24 overflow-hidden">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full">
        {/* Top Tagline Pill */}
        <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Sparkles size={13} className="animate-pulse" />
          <span>{dict.intro.hero.badge}</span>
        </div>

        {/* Two-Line Oversized Headline (Dialed Style) */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.92] text-slate-900 dark:text-white mb-6">
          <span className="block">{dict.intro.hero.headlineL1}</span>
          <span className="block text-amber-600 dark:text-amber-400">{dict.intro.hero.headlineL2}</span>
        </h1>

        {/* Subtitle & Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-7">
            <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
              {dict.intro.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToMap}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-extrabold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-xl shadow-amber-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plane size={18} className="transition-transform group-hover:rotate-12" />
                <span>{dict.intro.hero.ctaFly}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-base font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-300 dark:border-slate-700"
              >
                <span>{dict.intro.hero.ctaBrowse}</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Verified Counter Badge */}
          <div className="lg:col-span-5 flex lg:justify-end">
            <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 backdrop-blur-md">
              <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                106
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {dict.intro.hero.verifiedTag}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ASI • Maharashtra Forest Dept • PMC
              </div>
            </div>
          </div>
        </div>

        {/* Large Framed Photo + 3 Floating Interactive Cards */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-slate-950 shadow-2xl">
          {/* Main Photo Showcase */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
            <Image
              src={activeCard.image}
              alt={isMr ? activeCard.nameMr : activeCard.nameEn}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover transition-opacity duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Bottom-Left Overlaid Place Tag */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-white/10 mb-2">
                <MapPin size={12} />
                <span>{isMr ? activeCard.categoryMr : activeCard.categoryEn}</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                {isMr ? activeCard.nameMr : activeCard.nameEn}
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-1 font-mono">
                {activeCard.stat}
              </p>
            </div>
          </div>

          {/* 3 Floating Cards (Bottom-Right Deck) */}
          <div className="p-4 md:p-6 bg-slate-900/95 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3 justify-end">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-auto hidden md:inline">
              Hover to preview:
            </span>

            {SHOWCASE_PLACES.map((card) => {
              const isActive = activeCard.slug === card.slug;
              return (
                <button
                  key={card.slug}
                  type="button"
                  onMouseEnter={() => setActiveCard(card)}
                  onClick={() => setActiveCard(card)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-left w-full sm:w-auto cursor-pointer ${
                    isActive
                      ? 'bg-amber-600/20 border-amber-500 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <Image src={card.image} alt={card.nameEn} fill sizes="32px" className="object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight text-slate-100">
                      {isMr ? card.nameMr : card.nameEn}
                    </div>
                    <div className="text-[10px] text-amber-400 font-mono">
                      {card.stat}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

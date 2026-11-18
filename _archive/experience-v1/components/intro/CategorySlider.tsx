'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/lib/experience/selectors';
import { getExperienceV2I18n } from '@/lib/experience/i18n';
import { ChevronLeft, ChevronRight, ArrowUpRight, Compass } from 'lucide-react';

interface CategorySliderProps {
  lang?: string;
  onSelectCategory?: (slug: string) => void;
}

export default function CategorySlider({ lang = 'en', onSelectCategory }: CategorySliderProps) {
  const dict = getExperienceV2I18n(lang);
  const isMr = lang === 'mr';
  const allCats = getCategories();

  // 4 Largest categories sorted by count
  const topCategories = [...allCats].sort((a, b) => b.count - a.count).slice(0, 4);

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : topCategories.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < topCategories.length - 1 ? prev + 1 : 0));
  };

  const activeCategory = topCategories[activeIndex];

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
  };

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header with Navigation Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <Compass size={12} />
            <span>{dict.intro.categoriesSlider.badge}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            {dict.intro.categoriesSlider.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xl text-base md:text-lg">
            {dict.intro.categoriesSlider.subtitle}
          </p>
        </div>

        {/* Prev / Next Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={dict.intro.categoriesSlider.prevBtn}
            className="p-3.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label={dict.intro.categoriesSlider.nextBtn}
            className="p-3.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Featured Big Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-100 dark:bg-slate-900/90 rounded-3xl p-6 md:p-10 border border-slate-300 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Left: Active Category Details */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block"
              style={{ backgroundColor: activeCategory.color }}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {activeCategory.count} {dict.intro.categoriesSlider.destinationsCount}
            </span>
          </div>

          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {isMr ? activeCategory.nameMr : activeCategory.nameEn}
          </h3>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {isMr ? activeCategory.descriptionMr : activeCategory.descriptionEn}
          </p>

          <div>
            <Link
              href={`/experience?category=${activeCategory.slug}#map`}
              onClick={() => handleCategoryClick(activeCategory.slug)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider bg-slate-900 hover:bg-amber-600 dark:bg-white dark:text-slate-950 dark:hover:bg-amber-400 text-white transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <span>{dict.intro.categoriesSlider.exploreInMap}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right: Framed Category Image */}
        <div className="lg:col-span-7 relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-2xl">
          <Image
            src={activeCategory.coverImage}
            alt={isMr ? activeCategory.nameMr : activeCategory.nameEn}
            fill
            sizes="(max-width: 1024px) 100vw, 700px"
            className="object-cover transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md">
              {activeCategory.slug.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-600 font-bold">
              {activeCategory.count} PLACES
            </span>
          </div>
        </div>
      </div>

      {/* 4 Bottom Category Selection Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {topCategories.map((cat, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={cat.slug}
              type="button"
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => setActiveIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                  : 'bg-slate-100/80 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {cat.count}
                </span>
              </div>
              <div className="text-sm md:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                {isMr ? cat.nameMr : cat.nameEn}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

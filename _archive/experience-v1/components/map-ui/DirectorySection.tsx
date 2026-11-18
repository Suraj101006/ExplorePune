import React from 'react';
import Link from 'next/link';
import { getAllPlaces, getCategories } from '@/lib/experience/selectors';
import { getExperienceDictionary } from '@/lib/experience/i18n';

interface DirectorySectionProps {
  lang?: string;
  onSelectPlace?: (slug: string) => void;
}

export default function DirectorySection({ lang = 'en', onSelectPlace }: DirectorySectionProps) {
  const dict = getExperienceDictionary(lang);
  const isMr = lang === 'mr';
  const allPlaces = getAllPlaces();
  const categories = getCategories();

  return (
    <section
      id="directory"
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 text-white"
      aria-label={dict.map.directoryHeading}
    >
      <div className="mb-12">
        <span className="text-xs font-black uppercase tracking-widest text-[#F1293A] block mb-2">
          SEO & Accessible Directory
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
          {dict.map.directoryHeading}
        </h2>
        <p className="text-base text-white/60 max-w-3xl leading-relaxed">
          {dict.map.directorySubtext}
        </p>
      </div>

      {/* Category Groups */}
      <div className="space-y-16">
        {categories.map((category) => {
          const categoryPlaces = allPlaces.filter((p) => p.category_slug === category.slug);

          return (
            <div key={category.slug} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full shadow-lg"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    {isMr ? category.nameMr : category.nameEn}
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70 font-bold">
                    {categoryPlaces.length} places
                  </span>
                </div>

                <Link
                  href={`/destinations?category=${category.slug}`}
                  className="text-xs font-bold text-white/60 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Explore category</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Grid of Places */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPlaces.map((place) => {
                  const placeName = isMr ? place.name_mr || place.name : place.name;
                  const hours = isMr ? place.opening_hours_mr || place.opening_hours : place.opening_hours;

                  return (
                    <article
                      key={place.id}
                      className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#F1293A]">
                            {place.zoneId}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">
                            {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1">
                          <Link
                            href={`/places/${place.slug}`}
                            className="hover:text-amber-400 transition-colors"
                          >
                            {placeName}
                          </Link>
                        </h4>

                        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-3">
                          {isMr ? place.description_mr || place.description : place.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-white/40 truncate max-w-[55%]">
                          {hours || 'Daylight Hours'}
                        </span>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`#map`}
                            onClick={() => onSelectPlace?.(place.slug)}
                            className="text-[11px] font-bold text-[#3880FF] hover:underline"
                          >
                            {dict.map.showOnMap}
                          </Link>
                          <span className="text-white/20">•</span>
                          <Link
                            href={`/places/${place.slug}`}
                            className="text-[11px] font-bold text-white/70 hover:text-white"
                          >
                            Guide
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

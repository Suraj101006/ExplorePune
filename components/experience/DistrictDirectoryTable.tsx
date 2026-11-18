import React from 'react';
import Link from 'next/link';
import { getAllPlaces, getCategories } from '@/lib/experience/selectors';
import { formatCoordinatesDD, getTalukaOrRegion, getElevationEstimate } from '@/lib/experience/puneDistrictData';

interface DistrictDirectoryTableProps {
  lang?: string;
  onFocusPlace?: (slug: string) => void;
}

export default function DistrictDirectoryTable({ lang = 'en', onFocusPlace }: DistrictDirectoryTableProps) {
  const isMr = lang === 'mr';
  const places = getAllPlaces();
  const categories = getCategories();

  return (
    <section
      id="district-directory"
      className="py-16 px-4 md:px-8 max-w-7xl mx-auto border-t border-emerald-500/20 text-white"
      aria-label="Pune District Landmark and GPS Coordinates Directory"
    >
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>106 Locations • 14 Talukas • Real Satellite Ground Truth</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-2">
          {isMr ? 'पुणे जिल्हा सर्व पर्यटन स्थळे व GPS निर्देशांक' : 'Pune District Complete Landmark & GPS Coordinates Catalog'}
        </h2>
        <p className="text-sm text-white/60 max-w-3xl leading-relaxed">
          {isMr
            ? 'पुणे जिल्ह्यातील सर्व १०६ अधिकृत ऐतिहासिक, नैसर्गिक, धार्मिक आणि सांस्कृतिक स्थळांचे अक्षांश-रेखांश (GPS), तालुका आणि समुद्रसपाटीपासून उंचीची प्रमाणित माहिती.'
            : 'Verified spatial coordinates, administrative talukas, and elevation data for all 106 heritage forts, Peshwa monuments, sacred shrines, and scenic destinations across Pune District.'}
        </p>
      </div>

      {/* Structured Category Groups */}
      <div className="space-y-12">
        {categories.map((cat) => {
          const catPlaces = places.filter((p) => p.category_slug === cat.slug);

          return (
            <div key={cat.slug} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {isMr ? cat.nameMr : cat.nameEn}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                    {catPlaces.length} destinations
                  </span>
                </div>

                <Link
                  href={`/destinations?category=${cat.slug}`}
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>Category view</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Grid of Place Cards with Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catPlaces.map((p) => {
                  const placeName = isMr ? p.name_mr || p.name : p.name;
                  const coords = formatCoordinatesDD(p.latitude, p.longitude, 4);
                  const taluka = getTalukaOrRegion(p.latitude, p.longitude, p.address);
                  const elevation = getElevationEstimate(p.latitude, p.longitude, p.category_slug);

                  return (
                    <article
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5 text-[10px] font-mono">
                          <span className="text-emerald-400 font-bold uppercase truncate max-w-[50%]">
                            {taluka.nameEn.split(' ')[0]} Taluka
                          </span>
                          <span className="text-white/40">~{elevation}m MSL</span>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1">
                          <Link href={`/places/${p.slug}`} className="hover:text-emerald-300 transition-colors">
                            {placeName}
                          </Link>
                        </h4>

                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 bg-black/60 px-2 py-1 rounded-lg border border-white/5 mb-2 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{coords}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <span>Google Maps</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>

                        <Link
                          href={`/places/${p.slug}`}
                          className="text-white/60 hover:text-white text-[11px]"
                        >
                          Full Details →
                        </Link>
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

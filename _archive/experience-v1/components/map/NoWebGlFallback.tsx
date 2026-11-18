'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPlaces } from '@/lib/experience/selectors';
import { getExperienceV2I18n } from '@/lib/experience/i18n';
import { MapPin, Navigation, ArrowUpRight, AlertCircle } from 'lucide-react';

interface NoWebGlFallbackProps {
  lang?: string;
  onSelectPlace?: (slug: string) => void;
}

export default function NoWebGlFallback({ lang = 'en', onSelectPlace }: NoWebGlFallbackProps) {
  const dict = getExperienceV2I18n(lang);
  const isMr = lang === 'mr';
  const places = getAllPlaces();

  return (
    <div className="w-full min-h-[600px] p-6 md:p-12 bg-[#181a20] text-white rounded-3xl border border-slate-800 shadow-2xl">
      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 mb-8 text-amber-300 text-sm">
        <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-400" />
        <div>
          <p className="font-bold text-amber-200">
            {dict.map.noWebGlNotice}
          </p>
          <p className="text-xs text-amber-300/80 mt-1">
            All 106 destinations are fully accessible below with verified addresses, timings, and direct Google Maps navigation.
          </p>
        </div>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <div
            key={place.slug}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                <Image
                  src={place.image_url}
                  alt={isMr ? place.name_mr || place.name : place.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-400">
                  {place.category_slug}
                </div>
              </div>

              <h4 className="text-lg font-bold text-white mb-1">
                {isMr ? place.name_mr || place.name : place.name}
              </h4>
              <p className="text-xs text-slate-400 mb-2 line-clamp-1">
                {isMr ? place.address_mr || place.address : place.address}
              </p>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                {isMr ? place.description_mr || place.description : place.description}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors"
              >
                <Navigation size={12} />
                <span>Navigate</span>
              </a>

              <Link
                href={`/places/${place.slug}`}
                className="inline-flex items-center justify-center p-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="View full guide"
              >
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

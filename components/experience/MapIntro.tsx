'use client';

import React from 'react';
import BrandLogo from '@/components/BrandLogo';
import { Compass, MapPin, Layers, Route, ArrowRight, X } from 'lucide-react';

interface MapIntroProps {
  isOpen: boolean;
  onComplete: () => void;
  lang?: string;
}

export default function MapIntro({
  isOpen,
  onComplete,
  lang = 'en',
}: MapIntroProps) {
  const isMr = lang === 'mr';

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md text-white select-none overflow-y-auto p-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Pune District Map Guide"
    >
      {/* Center Editorial Card */}
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950 border border-white/15 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={onComplete}
          aria-label="Close"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>

        {/* Brand Crest with White Badge */}
        <div className="mb-4 inline-flex items-center justify-center">
          <BrandLogo size={58} withBadge priority alt="Explore Pune Official" />
        </div>

        {/* Identity Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Compass size={13} className="text-emerald-400" />
          <span>{isMr ? 'पुणे जिल्हा नकाशा अनुभव' : 'Pune District Interactive Map'}</span>
        </div>

        {/* Main Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight mb-2">
          {isMr ? (
            <>
              एक जिल्हा • शेकडो ऐतिहासिक गाथा <br />
              <span className="text-emerald-400">थेट संवादी नकाशा</span>
            </>
          ) : (
            <>
              One Historic District. Hundreds of Stories. <br />
              <span className="text-emerald-400">Interactive Cartographic Guide.</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6 font-sans">
          {isMr
            ? 'सह्याद्रीच्या उत्तुंग गड-किल्ल्यांपासून ते पुणे शहरातील ऐतिहासिक वाडे आणि १५ तालुक्यांमधील १०६ पडताळलेली पर्यटन स्थाने थेट नकाशावर शोधा.'
            : 'Explore 106 verified heritage forts, Peshwa wadas, temples, and natural reservoirs across all 15 talukas with multi-layer geospatial cartography.'}
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-left mb-6 font-sans">
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <MapPin size={16} className="text-emerald-400 mb-1.5" />
            <div className="text-xs font-bold text-white">{isMr ? '१५ तालुके' : '15 Talukas'}</div>
            <div className="text-[10px] text-white/50">{isMr ? 'प्रशासकीय सीमा' : 'All Regions'}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <Layers size={16} className="text-cyan-400 mb-1.5" />
            <div className="text-xs font-bold text-white">{isMr ? '३D स्तर' : '3D Layers'}</div>
            <div className="text-[10px] text-white/50">{isMr ? 'सॅटेलाइट व भूरूप' : 'Satellite & Topo'}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <Route size={16} className="text-amber-400 mb-1.5" />
            <div className="text-xs font-bold text-white">{isMr ? 'कथा मार्ग' : 'Story Trails'}</div>
            <div className="text-[10px] text-white/50">{isMr ? 'मार्ग व ड्रोन फ्लाई' : 'Curated Tours'}</div>
          </div>
        </div>

        {/* Start Exploring Button */}
        <button
          type="button"
          onClick={onComplete}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
        >
          <span>{isMr ? 'नकाशा पाहा' : 'Start Exploring Map'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

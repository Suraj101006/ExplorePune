'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getFeatureShowcases } from '@/lib/experience/selectors';
import { getExperienceV2I18n } from '@/lib/experience/i18n';
import {
  Sparkles,
  ArrowUpRight,
  Compass,
  CalendarCheck2,
  BookmarkCheck,
  Award,
  Users,
  ShieldAlert,
} from 'lucide-react';

interface FeatureGuidePinnedProps {
  lang?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Compass: <Compass size={20} />,
  CalendarCheck2: <CalendarCheck2 size={20} />,
  BookmarkCheck: <BookmarkCheck size={20} />,
  Award: <Award size={20} />,
  Users: <Users size={20} />,
  ShieldAlert: <ShieldAlert size={20} />,
};

export default function FeatureGuidePinned({ lang = 'en' }: FeatureGuidePinnedProps) {
  const dict = getExperienceV2I18n(lang);
  const isMr = lang === 'mr';
  const features = getFeatureShowcases();
  const [activeIdx, setActiveIdx] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportCenter = scrollY + window.innerHeight * 0.45;

      stepRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        const bottom = top + rect.height;

        if (viewportCenter >= top && viewportCenter <= bottom) {
          setActiveIdx(idx);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeFeature = features[activeIdx] || features[0];

  return (
    <section id="feature-guide" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
          <Sparkles size={12} className="animate-pulse" />
          <span>{dict.intro.featureGuide.badge}</span>
        </div>

        <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">
          {dict.intro.featureGuide.title}
        </h2>

        <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
          {dict.intro.featureGuide.subtitle}
        </p>
      </div>

      {/* Two-Column Pinned Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
        {/* Left: Sticky Visual Box (Desktop) */}
        <div className="lg:col-span-6 lg:sticky lg:top-28 w-full">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-slate-950 shadow-2xl">
            <Image
              src={activeFeature.imageUrl}
              alt={isMr ? activeFeature.titleMr : activeFeature.titleEn}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Overlaid Telemetry Card */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 uppercase tracking-widest text-amber-400 font-bold">
                {isMr ? activeFeature.badgeMr : activeFeature.badgeEn}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md font-bold">
                STEP {activeIdx + 1} OF {features.length}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-3xl md:text-5xl font-black tabular-nums text-amber-400 mb-1">
                {activeFeature.statNumber}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                {isMr ? activeFeature.statLabelMr : activeFeature.statLabelEn}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scrollable Step Cards */}
        <div className="lg:col-span-6 space-y-12 md:space-y-24 py-4 md:py-8">
          {features.map((feat, idx) => {
            const isActive = idx === activeIdx;

            return (
              <div
                key={feat.id}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                className={`p-6 md:p-10 rounded-3xl border transition-all duration-500 ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/80 shadow-2xl ring-1 ring-amber-500/30'
                    : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 opacity-60 hover:opacity-90'
                }`}
              >
                {/* Step indicator */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white text-xs font-black">
                    0{idx + 1}
                  </span>
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    {ICON_MAP[feat.iconName] || <Sparkles size={18} />}
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {isMr ? feat.badgeMr : feat.badgeEn}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                  {isMr ? feat.titleMr : feat.titleEn}
                </h3>

                {/* Subtitle */}
                <p className="text-sm md:text-base font-semibold text-amber-600 dark:text-amber-400 mb-3">
                  {isMr ? feat.subtitleMr : feat.subtitleEn}
                </p>

                {/* Description */}
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {isMr ? feat.descriptionMr : feat.descriptionEn}
                </p>

                {/* Action Link to Real Route */}
                <div>
                  <Link
                    href={feat.route}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-amber-600 dark:bg-white dark:text-slate-950 dark:hover:bg-amber-400 transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    <span>{isMr ? feat.actionTextMr : feat.actionTextEn}</span>
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

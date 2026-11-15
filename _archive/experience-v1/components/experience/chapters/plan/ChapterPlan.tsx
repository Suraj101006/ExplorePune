'use client';

import React, { useState, useEffect } from 'react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getExperienceI18n } from '@/lib/experience/i18n';
import { globalChapterRegistry } from '@/lib/experience/registry';
import PersonalizedFinder from '@/components/experience/PersonalizedFinder';
import ItineraryBuilderSection from '@/components/experience/ItineraryBuilderSection';
import CommunityProgressSection from '@/components/experience/CommunityProgressSection';
import { Compass, CalendarDays, Award, Info, Sparkles } from 'lucide-react';

interface ChapterPlanProps {
  initialTab?: 'finder' | 'builder' | 'passport';
}

export default function ChapterPlan({ initialTab = 'finder' }: ChapterPlanProps) {
  const { lang, isLiteMode } = useExperience();
  const isMr = lang === 'mr';
  const dict = getExperienceI18n(lang);
  const ch7 = dict.chapters.ch7_plan;

  const [activeTab, setActiveTab] = useState<'finder' | 'builder' | 'passport'>(initialTab);

  // Register Chapter 7 in the Global Chapter Registry
  useEffect(() => {
    globalChapterRegistry.register({
      id: 'plan',
      titleEn: dict.chapters.ch7_plan.title,
      titleMr: dict.chapters.ch7_plan.title,
      order: 7,
      scrub: () => {},
    });

    return () => {
      globalChapterRegistry.unregister('plan');
    };
  }, [dict.chapters.ch7_plan.title]);

  return (
    <section
      id="plan"
      className="exp-chapter-section exp-plan-section relative py-20 px-4 md:px-8 border-t border-amber-950/20 dark:border-amber-500/10"
      aria-labelledby="ch7-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Chapter Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-4">
            <Sparkles size={13} className="animate-pulse" />
            <span>{ch7.badge}</span>
          </div>

          <h2
            id="ch7-title"
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-4"
            style={{ fontFamily: isMr ? 'var(--exp-font-display-mr)' : 'var(--exp-font-display-en)' }}
          >
            {ch7.title}
          </h2>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {ch7.subtitle}
          </p>
        </div>

        {/* Tab Controls */}
        <div
          role="tablist"
          aria-label={isMr ? 'योजना पर्याय' : 'Plan Modes'}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-10"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'finder'}
            onClick={() => setActiveTab('finder')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'finder'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400'
                : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Compass size={16} />
            <span>{ch7.finderTitle}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'builder'}
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'builder'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400'
                : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <CalendarDays size={16} />
            <span>{ch7.customBuilderTitle}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'passport'}
            onClick={() => setActiveTab('passport')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'passport'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400'
                : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Award size={16} />
            <span>{isMr ? 'सांस्कृतिक पासपोर्ट व स्टॅम्प्स' : 'Cultural Passport & Stamps'}</span>
          </button>
        </div>

        {/* Tab Panel Content */}
        <div className="tab-panel-container">
          {activeTab === 'finder' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs md:text-sm text-blue-800 dark:text-blue-300 flex items-start gap-3 max-w-4xl mx-auto">
                <Info size={18} className="shrink-0 mt-0.5" />
                <span>{ch7.gatingNotice}</span>
              </div>
              <PersonalizedFinder isMr={isMr} />
            </div>
          )}

          {activeTab === 'builder' && (
            <div>
              <ItineraryBuilderSection isMr={isMr} />
            </div>
          )}

          {activeTab === 'passport' && (
            <div>
              <CommunityProgressSection isMr={isMr} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

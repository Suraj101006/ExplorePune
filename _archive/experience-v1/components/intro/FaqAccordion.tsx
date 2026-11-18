'use client';

import React, { useState } from 'react';
import { getFaqItems } from '@/lib/experience/selectors';
import { getExperienceV2I18n } from '@/lib/experience/i18n';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqAccordionProps {
  lang?: string;
}

export default function FaqAccordion({ lang = 'en' }: FaqAccordionProps) {
  const dict = getExperienceV2I18n(lang);
  const isMr = lang === 'mr';
  const faqs = getFaqItems();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
          <HelpCircle size={12} />
          <span>{dict.intro.faq.badge}</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-3">
          {dict.intro.faq.title}
        </h2>

        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg">
          {dict.intro.faq.subtitle}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-slate-100 dark:bg-slate-900/90 border-amber-500/60 shadow-lg'
                  : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <button
                type="button"
                id={`faq-btn-${faq.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${faq.id}`}
                onClick={() => toggle(faq.id)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-base md:text-xl font-bold text-slate-900 dark:text-white">
                  {isMr ? faq.questionMr : faq.questionEn}
                </span>
                <span
                  className={`p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-amber-600 text-white' : ''
                  }`}
                >
                  <ChevronDown size={18} />
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  className="px-6 pb-6 pt-2 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/80"
                >
                  {isMr ? faq.answerMr : faq.answerEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

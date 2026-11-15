'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  ArrowUp,
  MapPin,
  Mountain,
  Sparkles,
  BookOpen,
  Share2,
  Download,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getExperienceI18n } from '@/lib/experience/i18n';
import { getPreloaderStats, getCuratedPassportStamps } from '@/lib/experience/selectors';
import { globalChapterRegistry } from '@/lib/experience/registry';
import { toDevanagariDigits } from '@/components/experience/motion/motionUtils';
import gsap from 'gsap';

export default function ChapterOutro() {
  const { isLiteMode, prefersReducedMotion, lang, isMr, scrollToChapter } = useExperience();
  const dict = getExperienceI18n(lang);
  const ch8 = dict.chapters.ch8_outro;
  const stats = getPreloaderStats();
  const stamps = getCuratedPassportStamps();

  const isReduced = prefersReducedMotion || isLiteMode;

  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showCreditsDrawer, setShowCreditsDrawer] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Register Chapter 8 in global registry
  useEffect(() => {
    globalChapterRegistry.register({
      id: 'outro',
      titleEn: ch8.title,
      titleMr: ch8.title,
      order: 8,
    });

    return () => {
      globalChapterRegistry.unregister('outro');
    };
  }, [ch8.title]);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: dict.meta.title,
          text: dict.meta.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch (e) {
      // User cancelled or clipboard fallback
    }
  };

  const handleScrollToApex = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: isReduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="outro"
      className="relative w-full min-h-screen bg-[#04060a] text-slate-100 flex flex-col justify-between overflow-hidden select-none py-16"
      aria-label={ch8.title}
    >
      {/* Background Twilight Silhouette & Horizon Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#080b11] via-[#0f172a] to-[#04060a] opacity-95 z-0"
        aria-hidden="true"
      />

      {/* Ambient Starlight (Subtle Pulse unless reduced motion) */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-20 z-0 ${
          !isReduced ? 'animate-pulse' : ''
        }`}
        aria-hidden="true"
      />

      {/* Decorative Shaniwar Wada Silhouette Ridge (SVG) */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-44 sm:h-64 pointer-events-none z-0 opacity-40"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0,320 L0,240 L160,240 L160,200 L240,200 L240,240 L480,240 L520,160 L620,160 L640,240 L800,240 L840,180 L920,180 L960,240 L1200,240 L1240,150 L1340,150 L1380,240 L1440,240 L1440,320 Z"
          fill="#080b11"
        />
      </svg>

      {/* Top Header: Badge & Return Button */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-saffron-600/20 border border-saffron-500/40 px-3.5 py-1 text-xs font-semibold text-saffron-300 font-mono uppercase tracking-wider">
            {ch8.badge}
          </span>
          <span className="text-xs text-amber-400 font-display-mr">
            {ch8.puneriSignature}
          </span>
        </div>

        {/* Return to Apex Floating Button */}
        <button
          type="button"
          onClick={handleScrollToApex}
          className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1.5 text-xs font-mono text-slate-300 hover:text-amber-400 hover:border-amber-400 transition-all shadow-lg"
          aria-label={dict.common.backToTop}
        >
          <Compass className="h-3.5 w-3.5 text-amber-400" />
          <span>{dict.common.backToTop}</span>
          <ArrowUp className="h-3 w-3" />
        </button>
      </header>

      {/* Centerpiece: Grand Marathi Quote & Narrative Reverie */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto my-auto py-12">
        {/* Subtle decorative emblem */}
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          <Sparkles className="h-6 w-6 text-slate-950" />
        </div>

        {/* Grand Marathi Horizon Quote */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-100 font-display-pune tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-snug mb-4">
          {isMr
            ? 'पुण्यनगरी: जिथे इतिहास आणि भविष्य एकाच श्वासात जगतात.'
            : 'Pune: Where six centuries of valour meet the architects of tomorrow.'}
        </h2>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-body-pune leading-relaxed mb-8">
          {ch8.subtitle}
        </p>

        {/* Verified Provenance Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl mb-10 text-xs font-mono">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 flex flex-col items-center">
            <span className="text-slate-400">{isMr ? 'एकूण ठिकाणे' : 'Verified Places'}</span>
            <strong className="text-base text-amber-400 mt-1">
              {toDevanagariDigits(106)}
            </strong>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 flex flex-col items-center">
            <span className="text-slate-400">{isMr ? 'सह्याद्री किल्ले' : 'Historic Forts'}</span>
            <strong className="text-base text-orange-400 mt-1">
              {toDevanagariDigits(15)}
            </strong>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 flex flex-col items-center">
            <span className="text-slate-400">{isMr ? 'केळकर वस्तू' : 'Museum Relics'}</span>
            <strong className="text-base text-yellow-400 mt-1">
              २०,०००+
            </strong>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 flex flex-col items-center">
            <span className="text-slate-400">{isMr ? 'शनिवार वाडा वेळ' : 'ASI Hours'}</span>
            <strong className="text-xs text-sky-400 mt-1 font-sans font-semibold">
              09:30 – 17:30
            </strong>
          </div>
        </div>

        {/* Expedition Portal Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          {/* Primary Button: Explore All 106 Places */}
          <a
            href="/destinations"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-saffron-600 px-8 py-3.5 text-sm sm:text-base font-bold text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <MapPin className="h-4 w-4" />
            <span>{isMr ? 'संपूर्ण १०६ ठिकाणे पाहा' : 'Explore All 106 Places'}</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Secondary Button: Share Experience */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 hover:border-amber-400 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-amber-300 transition-all shadow-lg"
          >
            <Share2 className="h-4 w-4" />
            <span>{copiedLink ? dict.common.linkCopied : dict.common.shareExperience}</span>
          </button>

          {/* Tertiary Button: Credits & Provenance Toggle */}
          <button
            type="button"
            onClick={() => setShowCreditsDrawer((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-5 py-3.5 text-sm font-mono text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Info className="h-4 w-4" />
            <span>{isMr ? 'प्रकल्प माहिती व संदर्भ' : 'Provenance & Credits'}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showCreditsDrawer ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </main>

      {/* Credits & Historical Provenance Expandable Drawer */}
      {showCreditsDrawer && (
        <div className="relative z-20 max-w-3xl mx-auto px-6 mb-8 w-full animate-fadeIn">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/95 p-6 text-left shadow-2xl">
            <h4 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider mb-2">
              {ch8.catalogSummaryTitle}
            </h4>
            <p className="text-xs text-slate-400 font-body-pune leading-relaxed mb-4">
              {ch8.credits} Grounded in archaeological records from Archaeological Survey of India (ASI),
              Pune Municipal Corporation heritage cell, Bharat Itihas Sanshodhak Mandal (BISM), and authenticated
              by the Explore Pune Open Heritage Collective.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-slate-800 flex flex-wrap justify-between gap-2">
              <span>EXPLORE PUNE EXPERIENCE PLATFORM • OPEN ACCESS</span>
              <span>WCAG 2.1 AA COMPLIANT • BILINGUAL</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar: Copyright & Puneri Signature */}
      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 sm:px-12 max-w-7xl mx-auto w-full border-t border-slate-800/60 pt-6">
        <div className="text-xs font-mono text-slate-500">
          © {new Date().getFullYear()} Explore Pune • Pune Through Time
        </div>
        <div className="text-xs font-display-mr text-amber-400 font-bold">
          {ch8.puneriSignature}
        </div>
      </footer>
    </section>
  );
}

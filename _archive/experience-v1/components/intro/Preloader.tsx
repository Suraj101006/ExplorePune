'use client';

import React, { useState, useEffect } from 'react';
import { getExperienceV2I18n } from '@/lib/experience/i18n';
import { Compass, X } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
  lang?: string;
}

export default function Preloader({ onComplete, lang = 'en' }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const dict = getExperienceV2I18n(lang);

  useEffect(() => {
    // Check if user has reduced-motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check session storage
    const hasSeenPreloader =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('ep_experience_v2_preloader_done') === 'true';

    if (prefersReducedMotion || hasSeenPreloader) {
      setIsDismissed(true);
      onComplete();
      return;
    }

    // Asset verification & smooth timer
    const startTime = performance.now();
    const duration = 1800; // 1.8s duration

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        triggerWipe();
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  const triggerWipe = () => {
    setIsWiping(true);
    try {
      sessionStorage.setItem('ep_experience_v2_preloader_done', 'true');
    } catch (e) {}

    setTimeout(() => {
      setIsDismissed(true);
      onComplete();
    }, 600);
  };

  const handleSkip = () => {
    setIsWiping(true);
    try {
      sessionStorage.setItem('ep_experience_v2_preloader_done', 'true');
    } catch (e) {}
    setTimeout(() => {
      setIsDismissed(true);
      onComplete();
    }, 300);
  };

  if (isDismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={dict.intro.preloader.title}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080b11] text-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isWiping ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="w-full max-w-md px-6 text-center">
        {/* Animated Compass Icon */}
        <div className="mb-6 inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
          <Compass size={36} className="animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider mb-2 text-slate-100">
          {dict.intro.preloader.title}
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mb-8">
          {dict.intro.preloader.subtitle}
        </p>

        {/* Counter */}
        <div className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter text-amber-500 mb-6">
          {progress}%
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-75 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Skip Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
        >
          <span>{dict.intro.preloader.skip}</span>
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

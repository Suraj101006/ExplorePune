'use client';

import React, { useEffect, useState } from 'react';
import BrandLogo from '@/components/BrandLogo';

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
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    // Accessibility: instantly complete if user prefers reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const startTime = Date.now();
    const duration = 2600; // 2.6 seconds smooth intro

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 35) setStep(1);
      else if (pct < 70) setStep(2);
      else setStep(3);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white select-none overflow-hidden transition-opacity duration-500"
      role="dialog"
      aria-modal="true"
      aria-label="Map Calibrator Intro"
    >
      {/* Subtle Animated Coordinate Radar Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(16, 185, 129, 0.25) 0, transparent 70%),
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 48px 48px, 48px 48px',
          }}
        />
        {/* Animated Scanning Line */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
      </div>

      {/* Top Right Skip Intro Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={onComplete}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        >
          <span>{isMr ? 'वगळा (SKIP)' : 'SKIP INTRO'}</span>
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Center Cinematic Card */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        {/* Brand Crest with White Badge */}
        <div className="mb-5 relative">
          <div className="absolute -inset-3 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          <BrandLogo size={68} withBadge priority alt="Explore Pune Official" />
        </div>

        {/* Identity Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-black uppercase tracking-widest mb-3 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{isMr ? 'पुणे जिल्हा थेट भौगोलिक नकाशा' : 'PUNE DISTRICT GEOSPATIAL MAP'}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase leading-tight">
          {isMr ? (
            <>
              एक जिल्हा • शेकडो गाथा <br />
              <span className="text-emerald-400">थेट संवादी नकाशा</span>
            </>
          ) : (
            <>
              One District. Hundreds of Stories. <br />
              <span className="text-emerald-400">One Living Interactive Map.</span>
            </>
          )}
        </h1>

        {/* Dynamic Coordinates Readout */}
        <div className="mt-4 px-4 py-1.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-amber-300 flex items-center gap-3">
          <span>LAT: 18.5204° N</span>
          <span className="text-white/30">•</span>
          <span>LNG: 73.8567° E</span>
          <span className="text-white/30">•</span>
          <span className="text-emerald-400">15 TALUKAS</span>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full max-w-sm mt-8">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-white/50 mb-1.5">
            <span>
              {step === 1 && (isMr ? 'उपग्रह नकाशा इंजिन सुरू होत आहे...' : 'CALIBRATING GEOSPATIAL ENGINE...')}
              {step === 2 && (isMr ? '१५ तालुक्यांच्या भौगोलिक सीमा जोडत आहे...' : 'MAPPING 15 TALUKA PERIMETERS...')}
              {step === 3 && (isMr ? '१०६ नोंदणीकृत जीपीएस स्थाने सक्रिय करत आहे...' : 'ACTIVATING 106 GPS DESTINATIONS...')}
            </span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

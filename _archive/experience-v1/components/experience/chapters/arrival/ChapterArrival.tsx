'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Compass, Wind, Mountain, ShieldAlert, ArrowDown, Sun, CloudRain, Moon, Shield } from 'lucide-react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getExperienceI18n } from '@/lib/experience/i18n';
import { getArrivalHeroData } from '@/lib/experience/selectors';
import { globalChapterRegistry } from '@/lib/experience/registry';
import { useScrollTriggerManager, toDevanagariDigits } from '@/components/experience/motion/motionUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ChapterArrival() {
  const { isLiteMode, prefersReducedMotion, lang, isMr, scrubChapter } = useExperience();
  const dict = getExperienceI18n(lang);
  const ch1 = dict.chapters.ch1_arrival;
  const heroData = getArrivalHeroData();
  const { addTrigger } = useScrollTriggerManager();

  const isReduced = prefersReducedMotion || isLiteMode;

  const containerRef = useRef<HTMLDivElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const leftBoulderRef = useRef<HTMLDivElement>(null);
  const rightBoulderRef = useRef<HTMLDivElement>(null);
  const mistLayerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const flagRef = useRef<SVGSVGElement>(null);

  // Time-of-day dynamic sky gradient calculation for Pune
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'day' | 'sunset' | 'night'>('day');
  const [puneTimeStr, setPuneTimeStr] = useState<string>('');

  useEffect(() => {
    try {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const timeParts = formatter.formatToParts(now);
      const hour = parseInt(timeParts.find((p) => p.type === 'hour')?.value || '12', 10);
      const minute = timeParts.find((p) => p.type === 'minute')?.value || '00';

      setPuneTimeStr(`${hour}:${minute} IST`);

      if (hour >= 5 && hour < 8) {
        setTimeOfDay('dawn');
      } else if (hour >= 8 && hour < 17) {
        setTimeOfDay('day');
      } else if (hour >= 17 && hour < 19) {
        setTimeOfDay('sunset');
      } else {
        setTimeOfDay('night');
      }
    } catch (e) {
      setTimeOfDay('day');
      setPuneTimeStr('12:00 IST');
    }
  }, []);

  // Register Chapter 1 in global registry
  useEffect(() => {
    globalChapterRegistry.register({
      id: 'arrival',
      titleEn: ch1.title,
      titleMr: ch1.title,
      order: 1,
      scrub: (p) => {
        // Handled by GSAP ScrollTrigger
      },
    });

    return () => {
      globalChapterRegistry.unregister('arrival');
    };
  }, [ch1.title]);

  // GSAP ScrollTrigger Scrub Choreography
  useEffect(() => {
    if (isReduced || !containerRef.current || !pinTrackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinTrackRef.current,
      scrub: 0.8,
      onUpdate: (self) => {
        const progress = self.progress;
        scrubChapter('arrival', progress);

        // 0% - 40%: Boulders separate laterally
        if (leftBoulderRef.current && rightBoulderRef.current) {
          const boulderShift = Math.min(progress / 0.4, 1) * 160;
          gsap.set(leftBoulderRef.current, {
            x: -boulderShift,
            opacity: 1 - progress * 0.5,
          });
          gsap.set(rightBoulderRef.current, {
            x: boulderShift,
            opacity: 1 - progress * 0.5,
          });
        }

        // 30% - 70%: Headline eases into place and mist clears
        if (headlineRef.current) {
          const headlineY = (1 - Math.min(progress / 0.6, 1)) * 30;
          gsap.set(headlineRef.current, {
            y: headlineY,
            opacity: Math.min(progress * 2, 1),
          });
        }

        // Mist layer opacity reduction
        if (mistLayerRef.current) {
          gsap.set(mistLayerRef.current, {
            opacity: 0.85 - progress * 0.55,
          });
        }
      },
    });

    addTrigger(trigger);

    return () => {
      trigger.kill();
    };
  }, [isReduced, addTrigger, scrubChapter]);

  // Dynamic sky gradients based on time of day
  const skyGradients = {
    dawn: 'from-[#2e1065] via-[#9a3412] to-[#ea580c]',
    day: 'from-[#032030] via-[#0369a1] to-[#38bdf8]',
    sunset: 'from-[#1c1917] via-[#7c2d12] to-[#c2410c]',
    night: 'from-[#04060a] via-[#080b11] to-[#0f172a]',
  };

  const weatherIcons = {
    dawn: <Sun className="h-4 w-4 text-amber-400" />,
    day: <Sun className="h-4 w-4 text-sky-400" />,
    sunset: <Sun className="h-4 w-4 text-orange-400" />,
    night: <Moon className="h-4 w-4 text-indigo-300" />,
  };

  return (
    <section
      ref={containerRef}
      id="arrival"
      className={`relative w-full ${isReduced ? 'min-h-screen py-16' : 'h-[175vh]'} bg-[#080b11] text-slate-100 overflow-hidden`}
      aria-label={ch1.title}
    >
      <div
        ref={pinTrackRef}
        className={`relative w-full ${isReduced ? 'min-h-screen' : 'h-screen'} flex flex-col justify-between overflow-hidden`}
      >
        {/* Dynamic Sky Gradient Layer (Plane 0) */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${skyGradients[timeOfDay]} opacity-90 transition-colors duration-1000 z-0`}
          aria-hidden="true"
        />

        {/* Ambient Stars (Only on Night / Dawn) */}
        {(timeOfDay === 'night' || timeOfDay === 'dawn') && (
          <div
            className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-25 z-0"
            aria-hidden="true"
          />
        )}

        {/* Sahyadri Distant Ridge Silhouettes (Plane 1) */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-[55%] pointer-events-none z-10 opacity-70"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Deep distant peaks: Torna & Rajgad */}
          <path
            d="M0,420 L180,310 L340,360 L520,240 L690,320 L860,210 L1040,290 L1210,180 L1360,280 L1440,240 L1440,600 L0,600 Z"
            fill="#0f172a"
            opacity="0.65"
          />
          {/* Midground Sinhagad Ridge */}
          <path
            d="M0,480 L140,390 L290,440 L480,330 L660,400 L820,300 L990,380 L1180,270 L1340,370 L1440,320 L1440,600 L0,600 Z"
            fill="#080b11"
            opacity="0.9"
          />
        </svg>

        {/* Sahyadri Mist & Lake Khadakwasla Fog (Plane 2) */}
        <div
          ref={mistLayerRef}
          className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-monsoon-900/30 to-transparent pointer-events-none z-20"
          aria-hidden="true"
        />

        {/* Ramparts & Saffron Maratha Pennant (Plane 2.5) */}
        <div className="absolute bottom-16 right-8 sm:right-24 z-20 flex flex-col items-center pointer-events-none">
          <svg
            ref={flagRef}
            className="w-16 h-20 sm:w-24 sm:h-28 drop-shadow-[0_4px_16px_rgba(234,88,12,0.6)]"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Flagpole */}
            <line x1="20" y1="10" x2="20" y2="115" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
            {/* Bhagwa Zenda (Double swallowtail pennant) */}
            <path
              d="M20,15 L95,45 L70,60 L105,80 L20,95 Z"
              fill="#ea580c"
              className={!isReduced ? 'animate-pulse' : ''}
            />
            {/* Golden Sun Emblem on Flag */}
            <circle cx="45" cy="55" r="7" fill="#facc15" />
          </svg>
          <span className="mt-1 text-[10px] font-mono tracking-widest text-amber-400 uppercase">
            {isMr ? 'भगवा ध्वज' : 'Bhagwa Flag'}
          </span>
        </div>

        {/* Foreground Basalt Boulders (Plane 3 - Split Laterally on Scroll) */}
        {!isReduced && (
          <>
            {/* Left Basalt Boulder */}
            <div
              ref={leftBoulderRef}
              className="absolute -bottom-10 -left-16 w-64 sm:w-96 h-80 sm:h-96 pointer-events-none z-30"
              aria-hidden="true"
            >
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl" fill="#04060a">
                <path d="M0,300 L0,80 Q80,60 160,110 Q240,160 280,240 L280,300 Z" />
              </svg>
            </div>

            {/* Right Basalt Boulder */}
            <div
              ref={rightBoulderRef}
              className="absolute -bottom-10 -right-16 w-64 sm:w-96 h-80 sm:h-96 pointer-events-none z-30"
              aria-hidden="true"
            >
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl" fill="#04060a">
                <path d="M300,300 L300,90 Q220,70 140,120 Q60,170 20,250 L20,300 Z" />
              </svg>
            </div>
          </>
        )}

        {/* Top HUD: Elevation, Live Weather & Curfew Telemetry */}
        <header className="relative z-30 flex flex-wrap items-center justify-between gap-4 px-6 pt-8 sm:px-12">
          {/* Badge & Coordinates */}
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-saffron-600/20 border border-saffron-500/40 px-3.5 py-1 text-xs font-semibold text-saffron-300 tracking-wider uppercase font-mono">
              {ch1.badge}
            </span>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Mountain className="h-3.5 w-3.5 text-amber-400" />
              <span>{ch1.altitudeLabel}</span>
            </div>
          </div>

          {/* Live Pune Climate Pill */}
          <div className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 text-xs text-slate-300 font-mono shadow-lg">
            {weatherIcons[timeOfDay]}
            <span className="text-slate-200">Pune {puneTimeStr}</span>
            <span className="text-slate-600">•</span>
            <Wind className="h-3.5 w-3.5 text-monsoon-400" />
            <span>22°C (14 km/h)</span>
          </div>
        </header>

        {/* Center Content: Monumental Marathi Quote & Arrival Story */}
        <main
          ref={headlineRef}
          className="relative z-30 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto my-auto"
        >
          {/* Historical war phrase */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs sm:text-sm font-semibold text-amber-300 font-display-mr">
            <Shield className="h-4 w-4 text-amber-400" />
            <span>&ldquo;गड आला पण सिंह गेला!&rdquo; — १६७० नरवीर तानाजी मालुसरे</span>
          </div>

          {/* Monumental Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-100 font-display-pune drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-tight mb-4">
            {ch1.title}
          </h1>

          {/* Editorial Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-body-pune leading-relaxed mb-6">
            {ch1.subtitle}
          </p>

          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-4 text-xs font-mono">
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-3 flex flex-col items-center">
              <span className="text-slate-400">{isMr ? 'उंची' : 'Altitude'}</span>
              <strong className="text-sm text-amber-400 mt-0.5">
                {isMr ? toDevanagariDigits('1,312') + ' मी' : '1,312 m'}
              </strong>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-3 flex flex-col items-center">
              <span className="text-slate-400">{isMr ? 'अंतर' : 'Distance'}</span>
              <strong className="text-sm text-sky-400 mt-0.5">
                {isMr ? toDevanagariDigits('30') + ' किमी' : '30 km'}
              </strong>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-3 flex flex-col items-center">
              <span className="text-slate-400">{isMr ? 'ऐतिहासिक विजय' : 'Conquest Year'}</span>
              <strong className="text-sm text-orange-400 mt-0.5">
                {isMr ? toDevanagariDigits('1670') + ' इ.स.' : '1670 CE'}
              </strong>
            </div>
          </div>

          {/* Curfew / Forest Department Notice */}
          <div className="flex items-center gap-2 text-xs text-amber-300/80 bg-amber-950/40 border border-amber-900/50 rounded-full px-4 py-1">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>{ch1.weatherNotice}</span>
          </div>
        </main>

        {/* Bottom Bar: Scroll Indicator */}
        <footer className="relative z-30 flex items-center justify-between px-6 pb-8 sm:px-12">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Compass className="h-3.5 w-3.5 text-slate-400" />
            <span>18.3663° N, 73.7558° E • SINHAGAD BASTION</span>
          </div>

          <div className="mx-auto sm:mx-0 flex items-center gap-2 text-xs font-medium text-amber-400 animate-bounce">
            <span>{ch1.exploreCta}</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </div>
        </footer>
      </div>
    </section>
  );
}

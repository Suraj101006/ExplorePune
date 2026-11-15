'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sun, CloudRain, Sparkles, Snowflake, Thermometer, Calendar, Wind, ArrowRight, Utensils, MapPin } from 'lucide-react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getExperienceI18n } from '@/lib/experience/i18n';
import { getSeasonalExperiences, SeasonInfo } from '@/lib/experience/selectors';
import { globalChapterRegistry } from '@/lib/experience/registry';
import { useScrollTriggerManager, toDevanagariDigits } from '@/components/experience/motion/motionUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ChapterSeasons() {
  const { isLiteMode, prefersReducedMotion, lang, isMr, scrubChapter } = useExperience();
  const dict = getExperienceI18n(lang);
  const ch6 = dict.chapters.ch6_seasons;
  const seasons = getSeasonalExperiences();
  const { addTrigger } = useScrollTriggerManager();

  const isReduced = prefersReducedMotion || isLiteMode;

  const containerRef = useRef<HTMLDivElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const [activeSeasonIndex, setActiveSeasonIndex] = useState<number>(0);

  // Register Chapter 6 in global registry
  useEffect(() => {
    globalChapterRegistry.register({
      id: 'seasons',
      titleEn: ch6.title,
      titleMr: ch6.title,
      order: 6,
      scrub: (p) => {
        // Handled by ScrollTrigger
      },
    });

    return () => {
      globalChapterRegistry.unregister('seasons');
    };
  }, [ch6.title]);

  // ScrollTrigger Setup
  useEffect(() => {
    if (isReduced || !containerRef.current || !pinTrackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinTrackRef.current,
      scrub: 0.6,
      snap: {
        snapTo: [0, 0.333, 0.666, 1],
        duration: 0.4,
        ease: 'power2.out',
      },
      onUpdate: (self) => {
        const progress = self.progress;
        scrubChapter('seasons', progress);

        // Map progress [0, 1] to 4 seasons:
        // 0: Summer (Grishma)
        // 1: Monsoon (Varsha)
        // 2: Festive Autumn (Sharad)
        // 3: Crisp Winter (Shishir)
        let sIdx = 0;
        if (progress >= 0.75) {
          sIdx = 3;
        } else if (progress >= 0.5) {
          sIdx = 2;
        } else if (progress >= 0.25) {
          sIdx = 1;
        } else {
          sIdx = 0;
        }
        setActiveSeasonIndex(sIdx);
      },
    });

    addTrigger(trigger);

    return () => {
      trigger.kill();
    };
  }, [isReduced, addTrigger, scrubChapter]);

  // Seasonal Canvas Particle Emitter (Petals for Summer, Rain for Monsoon, Lanterns for Autumn, Mist for Winter)
  useEffect(() => {
    if (isReduced || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 60 particles morphing behavior by season
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 1,
      speedY: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      rotation: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (activeSeasonIndex === 0) {
          // Summer: Crimson / Orange Gulmohar blossoms drifting diagonally
          p.x += Math.sin(p.rotation) * 0.8 + 0.5;
          p.y += p.speedY * 0.8;
          p.rotation += 0.02;

          ctx.fillStyle = `rgba(234, 88, 12, ${p.opacity * 0.8})`;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 2, p.size, p.rotation, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeSeasonIndex === 1) {
          // Monsoon: Fast vertical rain streaks
          p.y += p.speedY * 4.5 + 4;
          p.x += 0.5;

          ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + 12);
          ctx.stroke();
        } else if (activeSeasonIndex === 2) {
          // Autumn: Floating golden marigold & lantern motes rising gently
          p.y -= p.speedY * 0.6;
          p.x += Math.sin(p.rotation) * 0.5;
          p.rotation += 0.015;

          ctx.fillStyle = `rgba(250, 204, 21, ${p.opacity * 0.85})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Winter: Slow rolling fog and mist horizontal drift
          p.x += p.speedX * 0.7 + 0.4;
          p.y += (Math.random() - 0.5) * 0.3;

          ctx.fillStyle = `rgba(186, 230, 253, ${p.opacity * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Boundary wrap
        if (p.y > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        } else if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -10;
        if (p.x < -20) p.x = width + 10;
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeSeasonIndex, isReduced]);

  const seasonMeta = [
    {
      id: 'summer',
      titleEn: 'Grishma Ritu (Summer)',
      titleMr: 'ग्रीष्म ऋतू (उन्हाळा)',
      monthsEn: 'March to May',
      monthsMr: 'मार्च ते मे',
      tempEn: '24°C – 38°C • Golden Sunsets',
      tempMr: '२४°से ते ३८°से • सोनेरी सूर्यास्त',
      delicacyEn: 'Chilled Sujata Mango Mastani & Aamras Puri',
      delicacyMr: 'सुजाता मॅंगो मस्तानी आणि थंडगार आमरस पुरी',
      bgGradient: 'from-[#451a03] via-[#1c1917] to-[#04060a]',
      accentColor: 'text-amber-400',
      badgeBorder: 'border-amber-500/40',
      icon: <Sun className="h-6 w-6 text-amber-400" />,
    },
    {
      id: 'monsoon',
      titleEn: 'Varsha Ritu (Monsoon)',
      titleMr: 'वर्षा ऋतू (पावसाळा)',
      monthsEn: 'June to September',
      monthsMr: 'जून ते सप्टेंबर',
      tempEn: '22°C – 27°C • Fresh Showers',
      tempMr: '२२°से ते २७°से • रिमझिम पाऊस व धुके',
      delicacyEn: 'Piping Hot Kanda Bhaji & Pithla-Bhakri at Sinhagad',
      delicacyMr: 'सिंहगड पायथ्याची गरमागरम कांदा भजी व पिठलं-भाकरी',
      bgGradient: 'from-[#064e3b] via-[#032030] to-[#04060a]',
      accentColor: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/40',
      icon: <CloudRain className="h-6 w-6 text-emerald-400" />,
    },
    {
      id: 'autumn',
      titleEn: 'Sharad Ritu (Festive Autumn)',
      titleMr: 'शरद ऋतू (गणेशोत्सव व दिवाळी)',
      monthsEn: 'August to October',
      monthsMr: 'ऑगस्ट ते ऑक्टोबर',
      tempEn: '23°C – 29°C • Electric Citywide Energy',
      tempMr: '२३°से ते २९°से • अभूतपूर्व जल्लोष',
      delicacyEn: 'Fresh Ukadiche Modak & Festive Diwali Faral',
      delicacyMr: 'गरमागरम उकडीचे मोदक व साखरेची करंजी',
      bgGradient: 'from-[#7c2d12] via-[#2e1065]/40 to-[#04060a]',
      accentColor: 'text-orange-400',
      badgeBorder: 'border-orange-500/40',
      icon: <Sparkles className="h-6 w-6 text-orange-400" />,
    },
    {
      id: 'winter',
      titleEn: 'Shishir Ritu (Crisp Winter)',
      titleMr: 'शिशिर ऋतू (गुलाबी थंडी)',
      monthsEn: 'November to February',
      monthsMr: 'नोव्हेंबर ते फेब्रुवारी',
      tempEn: '12°C – 28°C • Pleasant Chilly Mornings',
      tempMr: '१२°से ते २८°से • आल्हाददायक गुलाबी थंडी',
      delicacyEn: 'Roasted Bhutta on Vetal Tekdi & Masala Chai',
      delicacyMr: 'वेताळ टेकडीवर भाजलेले कणीस आणि कडक मसाला चहा',
      bgGradient: 'from-[#032030] via-[#0f172a] to-[#04060a]',
      accentColor: 'text-sky-400',
      badgeBorder: 'border-sky-500/40',
      icon: <Snowflake className="h-6 w-6 text-sky-400" />,
    },
  ];

  const handleSelectSeason = (idx: number) => {
    setActiveSeasonIndex(idx);
    if (!isReduced && containerRef.current) {
      const top = containerRef.current.offsetTop;
      const height = containerRef.current.offsetHeight;
      const targetScroll = top + (height - window.innerHeight) * (idx / 3);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const curr = seasonMeta[activeSeasonIndex] || seasonMeta[0];
  const info = seasons[activeSeasonIndex] || seasons[0];

  return (
    <section
      ref={containerRef}
      id="seasons"
      className={`relative w-full ${isReduced ? 'min-h-screen py-16' : 'h-[320vh]'} bg-[#04060a] text-slate-100 overflow-hidden select-none`}
      aria-label={ch6.title}
    >
      <div
        ref={pinTrackRef}
        className={`relative w-full ${isReduced ? 'min-h-screen' : 'h-screen'} flex flex-col justify-between overflow-hidden bg-gradient-to-b ${curr.bgGradient} transition-colors duration-1000`}
      >
        {/* Dynamic Canvas Particles (Rain / Petals / Lanterns / Mist) */}
        {!isReduced && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0 opacity-80"
            aria-hidden="true"
          />
        )}

        {/* Top Header: Badge, Title & Season Selector Buttons */}
        <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 sm:px-12 border-b border-slate-800/60 pb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300 font-mono uppercase tracking-wider">
                {ch6.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {isMr ? 'सह्याद्रीची ऋतुचक्र' : 'The Sahyadri Rhythm'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display-pune">
              {ch6.title}
            </h2>
          </div>

          {/* 4 Interactive Season Tabs */}
          <nav aria-label="Four Seasons Tabs" className="flex items-center gap-2">
            {seasonMeta.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSeason(idx)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono transition-all ${
                  activeSeasonIndex === idx
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-lg scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
                aria-current={activeSeasonIndex === idx ? 'page' : undefined}
              >
                <span>{isMr ? s.titleMr.split(' ')[0] : s.titleEn.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Center Stage: Season Gauge & Atmospheric Landscape Card */}
        <main className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 sm:px-12 py-6 items-center max-w-7xl mx-auto w-full">
          {/* Left Pane (7 cols): Season Narrative & Local Delicacy */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>{isMr ? curr.monthsMr : curr.monthsEn}</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black text-slate-100 font-display-pune mb-3 leading-tight">
              {isMr ? curr.titleMr : curr.titleEn}
            </h3>

            <p className="text-base sm:text-lg text-slate-300 font-body-pune leading-relaxed mb-6">
              {isMr ? info.atmosphereMr : info.atmosphereEn}
            </p>

            {/* Local Delicacy Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-4 mb-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {isMr ? 'ऋतुमानानुसार खास चव' : 'Seasonal Delicacy'}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-amber-300">
                  {isMr ? curr.delicacyMr : curr.delicacyEn}
                </h4>
              </div>
            </div>

            {/* Recommended Places */}
            {info.recommendedPlaces.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-slate-500 font-mono">
                  {isMr ? 'सर्वोत्तम भ्रमंती ठिकाणे:' : 'Best to Visit:'}
                </span>
                {info.recommendedPlaces.map((p) => (
                  <span
                    key={p.slug}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-800/60 border border-slate-700/50 px-2 py-0.5 text-xs text-slate-300"
                  >
                    <MapPin className="h-3 w-3 text-amber-400" />
                    <span>{isMr ? (p.name_mr || p.name) : p.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Pane (5 cols): Atmospheric Barometer Gauge Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/85 backdrop-blur-xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl">
              {/* Season Icon Orb */}
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center mb-6 shadow-inner">
                {curr.icon}
              </div>

              {/* Temperature Badge */}
              <div className="flex items-center gap-2 text-sm sm:text-base font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4">
                <Thermometer className="h-4 w-4" />
                <span>{isMr ? curr.tempMr : curr.tempEn}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-body-pune leading-relaxed mb-6">
                {isMr
                  ? 'सह्याद्रीच्या कुशीत वसलेल्या पुण्यात प्रत्येक ऋतू आपले वेगळे वैभव घेऊन येतो.'
                  : 'Nestled on the Deccan plateau, Pune’s landscape transforms dramatically across each Sahyadri season.'}
              </p>

              {/* Progress Indicator */}
              <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 pt-4 border-t border-slate-800">
                <span>{isMr ? `ऋतू ${toDevanagariDigits(activeSeasonIndex + 1)} / ४` : `Season ${activeSeasonIndex + 1} of 4`}</span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  {isMr ? 'हवामान पडताळणी' : 'Live Sahyadri Cycle'}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Bar: Scrub Indicator */}
        <footer className="relative z-20 flex items-center justify-between px-6 pb-6 sm:px-12 border-t border-slate-800/60 pt-3">
          <div className="text-[11px] font-mono text-slate-500 tracking-wider">
            SCROLL TO SCRUB SAHYADRI ATMOSPHERE • PUNE THROUGH TIME
          </div>
          <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
            <span>{isMr ? 'पुढील ऋतूसाठी खाली स्क्रोल करा' : 'Scroll down for next season'}</span>
            <span className="text-amber-400">↓</span>
          </div>
        </footer>
      </div>
    </section>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Flame, Shield, Landmark, BookOpen, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getExperienceI18n } from '@/lib/experience/i18n';
import { getHistoricalEpochs, HistoricalEpoch } from '@/lib/experience/selectors';
import { globalChapterRegistry } from '@/lib/experience/registry';
import { useScrollTriggerManager, toDevanagariDigits } from '@/components/experience/motion/motionUtils';
import EpochSceneMorph from '@/components/experience/chapters/epochs-scene/EpochSceneMorph';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ChapterEpochs() {
  const { isLiteMode, prefersReducedMotion, lang, isMr, scrubChapter } = useExperience();
  const dict = getExperienceI18n(lang);
  const ch2 = dict.chapters.ch2_epochs;
  const epochs = getHistoricalEpochs();
  const { addTrigger } = useScrollTriggerManager();

  const isReduced = prefersReducedMotion || isLiteMode;

  const containerRef = useRef<HTMLDivElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(0);

  // Register Chapter 2 in global registry
  useEffect(() => {
    globalChapterRegistry.register({
      id: 'epochs',
      titleEn: ch2.title,
      titleMr: ch2.title,
      order: 2,
      scrub: (p) => {
        // Handled by ScrollTrigger
      },
    });

    return () => {
      globalChapterRegistry.unregister('epochs');
    };
  }, [ch2.title]);

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
        scrubChapter('epochs', progress);

        // Map progress [0, 1] to 4 epochs
        let epochIdx = 0;
        if (progress >= 0.75) {
          epochIdx = 3;
        } else if (progress >= 0.5) {
          epochIdx = 2;
        } else if (progress >= 0.25) {
          epochIdx = 1;
        } else {
          epochIdx = 0;
        }
        setActiveEpochIndex(epochIdx);
      },
    });

    addTrigger(trigger);

    return () => {
      trigger.kill();
    };
  }, [isReduced, addTrigger, scrubChapter]);

  // Epoch Visual Meta Data
  const epochStyles = [
    {
      yearBadge: '750 CE',
      yearBadgeMr: 'इ.स. ७५०',
      moniker: 'पाषाण युग',
      monikerEn: 'Monolith Basalt Era',
      themeBg: 'from-[#1c1917] via-[#0c0a09] to-[#04060a]',
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      glowShadow: 'shadow-[0_0_50px_rgba(245,158,11,0.2)]',
      icon: <Flame className="h-6 w-6 text-amber-400" />,
      artifactNameEn: 'Monolithic Shiva Lingam & Basalt Pillars',
      artifactNameMr: 'एकाश्म शिवपिंडी व कातळकडील खांब',
      artifactDetailsEn: 'Carved out of single bedrock concurrently with Ellora',
      artifactDetailsMr: 'एकाच कातळात कोरलेले प्राचीन पाताळेश्वर मंदिर',
    },
    {
      yearBadge: '1670 CE',
      yearBadgeMr: 'इ.स. १६७०',
      moniker: 'स्वराज्य युग',
      monikerEn: 'Maratha Swarajya Era',
      themeBg: 'from-[#451a03] via-[#1c1917] to-[#080b11]',
      accentColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      glowShadow: 'shadow-[0_0_50px_rgba(234,88,12,0.25)]',
      icon: <Shield className="h-6 w-6 text-orange-400" />,
      artifactNameEn: 'Maratha Dhal-Talwar & Torchlit Ramparts',
      artifactNameMr: 'मराठा ढाल-तलवार व मशालींचा पहारा',
      artifactDetailsEn: 'Tanaji Malusare’s night escalade on Sinhagad bastion',
      artifactDetailsMr: 'नरवीर तानाजी मालुसरेंची सिंहगडावरील शौर्यगाथा',
    },
    {
      yearBadge: '1732 CE',
      yearBadgeMr: 'इ.स. १७३२',
      moniker: 'पेशवाई वैभव',
      monikerEn: 'Peshwa Wada Zenith',
      themeBg: 'from-[#2e1065]/40 via-[#1e293b] to-[#080b11]',
      accentColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30',
      glowShadow: 'shadow-[0_0_50px_rgba(234,179,8,0.25)]',
      icon: <Landmark className="h-6 w-6 text-yellow-400" />,
      artifactNameEn: 'Ornate Teakwood Wada & Hazari Karanje',
      artifactNameMr: 'सागवानी कोरीव वाडा व सहस्र कारंजे',
      artifactDetailsEn: 'Shaniwar Wada courtly glory, wooden pillars & 18 peths',
      artifactDetailsMr: 'थोरल्या बाजीरावांची शनिवार वाडा राजधानी व पेठांचा विस्तार',
    },
    {
      yearBadge: '1848–2026',
      yearBadgeMr: '१८४८–२०२६',
      moniker: 'प्रबोधन व सायबर युग',
      monikerEn: 'Social Reform & Cyber Epoch',
      themeBg: 'from-[#032030] via-[#0f172a] to-[#04060a]',
      accentColor: 'text-sky-400',
      borderColor: 'border-sky-500/30',
      glowShadow: 'shadow-[0_0_50px_rgba(56,189,248,0.25)]',
      icon: <BookOpen className="h-6 w-6 text-sky-400" />,
      artifactNameEn: 'Phule Wada Desk & Silicon Grid Corridors',
      artifactNameMr: 'भिडे वाडा शिक्षणाचा उगम व सायबर कॉरिडोअर',
      artifactDetailsEn: 'First girls’ school, Tilak’s Kesari & global tech innovation',
      artifactDetailsMr: 'सावित्रीबाईंची पहिली शाळा, स्वातंत्र्य लढा ते सायबर पुणे',
    },
  ];

  const handleSelectEpoch = (idx: number) => {
    setActiveEpochIndex(idx);
    if (!isReduced && containerRef.current) {
      const top = containerRef.current.offsetTop;
      const height = containerRef.current.offsetHeight;
      const targetScroll = top + (height - window.innerHeight) * (idx / 3);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const curr = epochs[activeEpochIndex] || epochs[0];
  const style = epochStyles[activeEpochIndex] || epochStyles[0];

  return (
    <section
      ref={containerRef}
      id="epochs"
      className={`relative w-full ${isReduced ? 'min-h-screen py-16' : 'h-[350vh]'} bg-[#04060a] text-slate-100 overflow-hidden`}
      aria-label={ch2.title}
    >
      <div
        ref={pinTrackRef}
        className={`relative w-full ${isReduced ? 'min-h-screen' : 'h-screen'} flex flex-col justify-between overflow-hidden bg-gradient-to-b ${style.themeBg} transition-colors duration-700`}
      >
        {/* Top Header: Badge, Instructions & Progress Indicator */}
        <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 sm:px-12 border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300 font-mono uppercase tracking-wider">
              {ch2.badge}
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 font-body-pune">
              {ch2.instructions}
            </span>
          </div>

          {/* 4 Interactive Progress Beads */}
          <nav aria-label="Historical Epoch Timeline" className="flex items-center gap-2">
            {epochStyles.map((ep, idx) => (
              <button
                key={ep.yearBadge}
                type="button"
                onClick={() => handleSelectEpoch(idx)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono transition-all ${
                  activeEpochIndex === idx
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-lg scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
                aria-current={activeEpochIndex === idx ? 'step' : undefined}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span>{isMr ? ep.yearBadgeMr : ep.yearBadge}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Center Stage: Split Screen Narrative & Artifact Showcase */}
        <main className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 sm:px-12 py-6 items-center max-w-7xl mx-auto w-full">
          {/* Left Pane (7 cols): Epoch Outline Year, Moniker, Headline & Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Outline Historical Year Watermark */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl sm:text-6xl font-black tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.3)] font-mono">
                {isMr ? style.yearBadgeMr : style.yearBadge}
              </span>
              <span className="text-sm sm:text-base font-semibold text-amber-400 font-display-mr">
                {isMr ? style.moniker : style.monikerEn}
              </span>
            </div>

            {/* Epoch Era Moniker */}
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-100 font-display-pune mb-3 leading-snug">
              {isMr ? curr.headlineMr : curr.headlineEn}
            </h2>

            {/* Epoch Timeframe Pill */}
            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 mb-4 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5 w-fit">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>{isMr ? curr.timeframeMr : curr.timeframeEn}</span>
            </div>

            {/* Authentic Narrative */}
            <p className="text-sm sm:text-base text-slate-300 font-body-pune leading-relaxed mb-6">
              {isMr ? curr.narrativeMr : curr.narrativeEn}
            </p>

            {/* Architectural Style & Associated Places */}
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500 uppercase tracking-wider">{isMr ? 'स्थापत्य शैली:' : 'Architectural Style:'}</span>
                <span className="text-amber-300 font-semibold">{isMr ? curr.architecturalStyleMr : curr.architecturalStyleEn}</span>
              </div>

              {curr.associatedPlaces.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">{isMr ? 'प्रमुख ठिकाणे:' : 'Key Places:'}</span>
                  {curr.associatedPlaces.map((p) => (
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
          </div>

          {/* Right Pane (5 cols): Visual Artifact Showcase with 3D Epoch Scene Morph */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              className={`w-full max-w-md rounded-2xl border ${style.borderColor} bg-slate-950/80 backdrop-blur-xl p-4 sm:p-6 flex flex-col items-center text-center ${style.glowShadow} transition-all duration-500`}
            >
              {/* 3D Visual Anchor Morph Stage */}
              <div className="w-full h-48 sm:h-56 mb-3 rounded-xl overflow-hidden relative border border-slate-800/80 bg-slate-950/60">
                <EpochSceneMorph activeEpoch={activeEpochIndex} />
              </div>

              {/* Artifact Name & Details */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 font-display-pune mb-2">
                {isMr ? style.artifactNameMr : style.artifactNameEn}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 font-body-pune leading-relaxed mb-6">
                {isMr ? style.artifactDetailsMr : style.artifactDetailsEn}
              </p>

              {/* Epoch Indicator Footer */}
              <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 pt-4 border-t border-slate-800">
                <span>{isMr ? `कालखंड ${toDevanagariDigits(activeEpochIndex + 1)} / ४` : `Epoch ${activeEpochIndex + 1} of 4`}</span>
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  {isMr ? 'पडताळलेला इतिहास' : 'ASI Verified'}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Bar: Timeline Rail Indicator */}
        <footer className="relative z-20 flex items-center justify-between px-6 pb-6 sm:px-12 border-t border-slate-800/60 pt-3">
          <div className="text-[11px] font-mono text-slate-500 tracking-wider">
            1300 YEARS OF CIVILIZATIONAL CONTINUUM • PUNE THROUGH TIME
          </div>

          <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
            <span>{isMr ? 'पुढील कालखंडासाठी खाली स्क्रोल करा' : 'Scroll down for next epoch'}</span>
            <span className="text-amber-400">↓</span>
          </div>
        </footer>
      </div>
    </section>
  );
}

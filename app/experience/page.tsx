'use client';

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Lenis from 'lenis';
import { useLanguage } from '@/lib/LanguageContext';
import { getExperienceV2I18n } from '@/lib/experience/i18n';
import './experience.css';

// Part A Components (Dialed-Style Editorial Intro)
import {
  Preloader,
  Hero,
  MarqueeStrip,
  CategorySlider,
  FeatureGuidePinned,
  NumbersStrip,
  StoriesRow,
  FaqAccordion,
  Bridge,
} from '@/components/experience/intro';

// Part B Components (Interactive Full-Screen Map + SEO Directory)
import { MapSection } from '@/components/experience/map';
import { DirectorySection } from '@/components/experience/map-ui';

export default function ExperiencePage() {
  const { lang, isMr } = useLanguage();
  const dict = getExperienceV2I18n(lang);

  const [preloaderComplete, setPreloaderComplete] = useState<boolean>(false);
  const [selectedCategoryForMap, setSelectedCategoryForMap] = useState<string>('all');
  const [selectedPlaceSlugForMap, setSelectedPlaceSlugForMap] = useState<string | undefined>(undefined);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll for Part A
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Smooth scroll helper into #map
  const scrollToMap = (categorySlug?: string) => {
    if (categorySlug) {
      setSelectedCategoryForMap(categorySlug);
    }

    const mapElement = document.getElementById('map');
    if (mapElement) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(mapElement, { offset: 0, duration: 1.4 });
      } else {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectPlaceFromDirectory = (slug: string) => {
    setSelectedPlaceSlugForMap(slug);
    scrollToMap();
  };

  // Structured Data (JSON-LD) for SEO, Geo & Knowledge Graph
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: isMr ? 'पुणे पर्यटन अनुभव' : 'Explore Pune Interactive Experience',
    description: dict.meta.description,
    url: 'https://explorepune-guide.vercel.app/experience',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.5204,
      longitude: 73.8567,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    hasPart: [
      {
        '@type': 'TouristAttraction',
        name: 'Sinhagad Fort',
        geo: { '@type': 'GeoCoordinates', latitude: 18.3663, longitude: 73.7558 },
      },
      {
        '@type': 'TouristAttraction',
        name: 'Shaniwar Wada',
        geo: { '@type': 'GeoCoordinates', latitude: 18.5195, longitude: 73.8553 },
      },
      {
        '@type': 'TouristAttraction',
        name: 'Pataleshwar Cave Temple',
        geo: { '@type': 'GeoCoordinates', latitude: 18.5274, longitude: 73.8504 },
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-[#0E1015] text-white selection:bg-[#F1293A] selection:text-white">
      {/* Preloader (A0) */}
      <Preloader
        lang={lang}
        onComplete={() => setPreloaderComplete(true)}
      />

      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* ========================================================================= */}
      {/* PART A: DIALED-STYLE EDITORIAL INTRO                                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full overflow-hidden">
        {/* A1: Hero Section */}
        <Hero
          lang={lang}
          onFlyToMap={() => scrollToMap()}
        />

        {/* A2: Marquee Strip */}
        <MarqueeStrip lang={lang} />

        {/* A3: Explore By Interest Slider */}
        <CategorySlider
          lang={lang}
          onSelectCategory={(catSlug) => scrollToMap(catSlug)}
        />

        {/* A4: Pinned Feature Guide */}
        <FeatureGuidePinned lang={lang} />

        {/* A5: Numbers Strip */}
        <NumbersStrip lang={lang} />

        {/* A6: Stories Row */}
        <StoriesRow lang={lang} />

        {/* A7: FAQ Accordion */}
        <FaqAccordion lang={lang} />

        {/* A8: Bridge to Map */}
        <Bridge
          lang={lang}
          onEnterMap={() => scrollToMap()}
        />
      </div>

      {/* ========================================================================= */}
      {/* PART B: FULL-SCREEN MAP & CRAWLABLE DIRECTORY                             */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full bg-[#1F242D]">
        {/* Part B Map Container */}
        <MapSection
          lang={lang}
          initialCategory={selectedCategoryForMap}
          initialPlaceSlug={selectedPlaceSlugForMap}
        />

        {/* Accessible, Server-Rendered Crawlable Directory */}
        <DirectorySection
          lang={lang}
          onSelectPlace={handleSelectPlaceFromDirectory}
        />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useLanguage } from '@/lib/LanguageContext';
import './experience.css';

// Dynamic client import for WebGL Three.js canvas (zero SSR overhead)
const ExperienceCanvas = dynamic(
  () => import('@/components/experience/ExperienceCanvas'),
  {
    ssr: false,
    loading: () => <div className="exp-canvas-container" aria-hidden="true" />,
  }
);

// Dynamic 3D World Component
const ExperienceWorld3D = dynamic(
  () => import('@/components/experience/ExperienceWorld3D'),
  {
    ssr: false,
    loading: () => <div className="exp-section exp-world3d-section" style={{ minHeight: 600 }} />,
  }
);

// Experience Foundation (Phase 1): Provider & Smooth Motion Bootstrap
import ExperienceProvider from '@/components/experience/context/ExperienceProvider';
import LenisBootstrap from '@/components/experience/motion/LenisBootstrap';

// Custom Interactive Trailing Cursor
import ExperienceCursor from '@/components/experience/ExperienceCursor';
import ExperienceCinematicIntro from '@/components/experience/ExperienceCinematicIntro';

// 15 Comprehensive Experience Sections & Next-Gen Storytelling
import ExperienceHero from '@/components/experience/ExperienceHero';
import ExperienceNavSticky from '@/components/experience/ExperienceNavSticky';
import ExperiencePinnedJourney from '@/components/experience/ExperiencePinnedJourney';
import ExperienceCategories from '@/components/experience/ExperienceCategories';
import ExperienceMap from '@/components/experience/ExperienceMap';
import HeritageStorySection from '@/components/experience/HeritageStorySection';
import AdventureFortsSection from '@/components/experience/AdventureFortsSection';
import TasteOfPuneSection from '@/components/experience/TasteOfPuneSection';
import ExperienceCuriosityCabinet from '@/components/experience/ExperienceCuriosityCabinet';
import CultureTraditionsSection from '@/components/experience/CultureTraditionsSection';
import NatureEscapesSection from '@/components/experience/NatureEscapesSection';
import HiddenGemsSection from '@/components/experience/HiddenGemsSection';
import SeasonalExperienceSection from '@/components/experience/SeasonalExperienceSection';
import PersonalizedFinder from '@/components/experience/PersonalizedFinder';
import ItineraryBuilderSection from '@/components/experience/ItineraryBuilderSection';
import ExperienceStoriesSection from '@/components/experience/ExperienceStoriesSection';
import CommunityProgressSection from '@/components/experience/CommunityProgressSection';
import ExperienceFooterCta from '@/components/experience/ExperienceFooterCta';

export default function ExperiencePage() {
  const { isMr } = useLanguage();
  const [showIntro, setShowIntro] = React.useState<boolean>(true);
  const [isClient, setIsClient] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsClient(true);
    try {
      const dismissed = sessionStorage.getItem('ep_experience_intro_dismissed');
      if (dismissed === 'true') {
        setShowIntro(false);
      }
    } catch (e) {
      // Graceful fallback in sandboxed iframe/storage environments
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('ep_experience_intro_dismissed', 'true');
    } catch (e) {}
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // Structured Data (JSON-LD) for SEO, GEO & AI Search Discovery
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristDestination',
        '@id': 'https://explorepune-guide.vercel.app/experience#destination',
        name: 'Experience Pune — Immersive Tourism Discovery Platform',
        alternateName: 'पुणे अनुभव',
        description:
          'Next-generation immersive tourism discovery platform exploring 106 verified destinations, 3D interactive terrain, Maratha forts, Peshwa heritage wadas, authentic culinary institutions, and seasonal itineraries across Pune, Maharashtra.',
        url: 'https://explorepune-guide.vercel.app/experience',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 18.5204,
          longitude: 73.8567,
        },
        hasMap: 'https://explorepune-guide.vercel.app/experience#map',
        touristType: [
          'Heritage Tourism',
          'Adventure Tourism',
          'Culinary Tourism',
          'Spiritual Pilgrimage',
          'Cultural Tourism',
          '3D Virtual Tourism',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://explorepune-guide.vercel.app/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Experience',
            item: 'https://explorepune-guide.vercel.app/experience',
          },
        ],
      },
    ],
  };

  return (
    <ExperienceProvider>
      <LenisBootstrap>
        <main className="experience-root">
          {/* Extraordinary 10-Second Cinematic Opening Overture (Code of Sagar & Studio Macaco style) */}
          {showIntro && isClient && (
            <ExperienceCinematicIntro
              onComplete={handleIntroComplete}
              isMr={isMr}
            />
          )}

      {/* JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Subtle Three.js Fixed Background WebGL Starfield/Particles Canvas */}
      <ExperienceCanvas currentScene={1} />

      {/* Interactive Trailing Cursor (Desktop) */}
      <ExperienceCursor />

      {/* Atmospheric Overlays */}
      <div className="exp-vignette" aria-hidden="true" />
      <div className="exp-grid-overlay" aria-hidden="true" />

      {/* Sticky Quick-Navigation Bar */}
      <ExperienceNavSticky isMr={isMr} onReplayIntro={handleReplayIntro} />

      {/* Interconnected Experience Sections */}
      <div className="exp-content-wrapper">
        {/* Section 01: Cinematic Hero */}
        <ExperienceHero isMr={isMr} />

        {/* Signature 3D Experience: Explore Pune as a Digital World */}
        <ExperienceWorld3D isMr={isMr} />

        {/* Advanced Scroll-Based Epoch Storytelling (Code of Sagar style) */}
        <ExperiencePinnedJourney isMr={isMr} />

        {/* Section 02: 16 Discovery Categories */}
        <ExperienceCategories isMr={isMr} />

        {/* Section 03: Interactive Pune Geographical Experience Map */}
        <ExperienceMap isMr={isMr} />

        {/* Section 04: Explore Pune's Living Heritage */}
        <HeritageStorySection isMr={isMr} />

        {/* Section 05: Forts & Adventure Experiences */}
        <AdventureFortsSection isMr={isMr} />

        {/* Section 06: Taste of Pune (Culinary Magazine) */}
        <TasteOfPuneSection isMr={isMr} />

        {/* Playful Interactive Discovery: Cabinet of Curiosities (Studio Macaco style) */}
        <ExperienceCuriosityCabinet isMr={isMr} />

        {/* Section 07: Culture & Living Local Traditions */}
        <CultureTraditionsSection isMr={isMr} />

        {/* Section 08: Nature & Peaceful Escapes */}
        <NatureEscapesSection isMr={isMr} />

        {/* Section 09: Hidden Gems of Pune */}
        <HiddenGemsSection isMr={isMr} />

        {/* Section 10: Experience Pune Through the Seasons */}
        <SeasonalExperienceSection isMr={isMr} />

        {/* Section 11: Personalized Experience Finder */}
        <PersonalizedFinder isMr={isMr} />

        {/* Section 12: Build Your Own Pune Itinerary */}
        <ItineraryBuilderSection isMr={isMr} />

        {/* Section 13: Editorial Experience Stories */}
        <ExperienceStoriesSection isMr={isMr} />

        {/* Section 14: User Experience & Community Progress Passport */}
        <CommunityProgressSection isMr={isMr} />

        {/* Section 15: Final Immersive Call to Action */}
        <ExperienceFooterCta isMr={isMr} />
      </div>
    </main>
      </LenisBootstrap>
    </ExperienceProvider>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  SEASONS_DATA,
  SeasonalGuide,
  PLACES_BY_SLUG,
} from '@/lib/experienceData';
import {
  Sun,
  CloudRain,
  Snowflake,
  PartyPopper,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from 'lucide-react';

interface SeasonalExperienceSectionProps {
  isMr: boolean;
}

export default function SeasonalExperienceSection({ isMr }: SeasonalExperienceSectionProps) {
  const [activeSeasonId, setActiveSeasonId] = useState<string>('monsoon');

  const activeSeason =
    SEASONS_DATA.find((s) => s.id === activeSeasonId) || SEASONS_DATA[1];

  const getSeasonIcon = (id: string) => {
    switch (id) {
      case 'summer':
        return <Sun size={18} />;
      case 'monsoon':
        return <CloudRain size={18} />;
      case 'winter':
        return <Snowflake size={18} />;
      case 'festival':
        return <PartyPopper size={18} />;
      default:
        return <Sun size={18} />;
    }
  };

  return (
    <section id="seasons" className="exp-section exp-seasons-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Calendar size={14} />
            <span>{isMr ? 'विभाग १० • चार ऋतूंचे पुणे' : 'SECTION 10 • FOUR SEASONS OF PUNE'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'ऋतूनुसार पुण्याचा अनुभव घ्या' : 'Experience Pune Through the Seasons'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'पावसाळ्यातील हिरवेगार किल्ले, हिवाळ्यातील आल्हाददायक ट्रेक्स, उन्हाळ्यातील सकाळचे शांत वॉक आणि गणेशोत्सवाचा चैतन्यमय सोहळा.'
              : 'Pune transforms dramatically with every turn of the calendar. Select a season to explore curated activities, climate advisories, and highlighted destinations.'}
          </p>
        </div>

        {/* 4 Season Interactive Tab Switcher */}
        <div className="exp-season-tabs" role="tablist">
          {SEASONS_DATA.map((season) => (
            <button
              key={season.id}
              type="button"
              role="tab"
              aria-selected={activeSeasonId === season.id}
              onClick={() => setActiveSeasonId(season.id)}
              className={`exp-season-tab ${activeSeasonId === season.id ? 'active' : ''}`}
            >
              <div className="icon">{getSeasonIcon(season.id)}</div>
              <div className="info">
                <span className="name">{isMr ? season.nameMr : season.name}</span>
                <span className="months">{season.months.split('(')[0]}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Active Season Detail Card */}
        <div className="exp-season-card">
          <div className="exp-season-header-row">
            <div>
              <span className="exp-season-theme-lbl">
                {isMr ? 'शिफारस केलेली थीम:' : 'Recommended Focus:'}
              </span>
              <h3 className="exp-season-theme-title">{activeSeason.recommendedTheme}</h3>
              <p className="exp-season-climate">
                <strong>{isMr ? 'हवामान:' : 'Climate:'}</strong> {activeSeason.climateOverview}
              </p>
            </div>
            <div className="exp-season-temp-badge">
              <span>{activeSeason.months}</span>
            </div>
          </div>

          <div className="exp-season-columns">
            {/* Best Activities */}
            <div className="exp-season-col">
              <h4 className="exp-season-col-title">
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                <span>{isMr ? 'सर्वोत्तम अनुभव:' : 'Best Experiences & Things to Do:'}</span>
              </h4>
              <ul className="exp-season-list">
                {activeSeason.bestActivities.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            {/* Safety & Travel Tips */}
            <div className="exp-season-col">
              <h4 className="exp-season-col-title">
                <ShieldAlert size={16} style={{ color: '#f59e0b' }} />
                <span>{isMr ? 'सुरक्षा व प्रवास सूचना:' : 'Safety & Preparation Tips:'}</span>
              </h4>
              <ul className="exp-season-list">
                {activeSeason.safetyAndTravelTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Featured Seasonal Destinations */}
          <div className="exp-season-places-row">
            <span className="lbl">{isMr ? 'ऋतुमानानुसार सर्वोत्तम ठिकाणे:' : 'Must-Visit Places This Season:'}</span>
            <div className="chips">
              {activeSeason.featuredPlaces.map((slug) => {
                const p = PLACES_BY_SLUG[slug];
                if (!p) return null;
                return (
                  <Link key={slug} href={`/places/${slug}`} className="exp-season-place-chip">
                    <span>{isMr && p.name_mr ? p.name_mr : p.name}</span>
                    <ArrowRight size={13} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

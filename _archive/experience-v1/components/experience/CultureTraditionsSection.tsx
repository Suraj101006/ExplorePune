'use client';

import React from 'react';
import Image from 'next/image';
import {
  CULTURE_TRADITIONS_DATA,
  CulturalHeritage,
} from '@/lib/experienceData';
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Award,
} from 'lucide-react';

interface CultureTraditionsSectionProps {
  isMr: boolean;
}

export default function CultureTraditionsSection({ isMr }: CultureTraditionsSectionProps) {
  return (
    <section id="culture" className="exp-section exp-culture-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Sparkles size={14} />
            <span>{isMr ? 'विभाग ०७ • संस्कृती आणि परंपरा' : 'SECTION 07 • CULTURE & LIVING TRADITIONS'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुण्याची समृद्ध संस्कृती आणि लोकपरंपरा' : 'Culture & Local Traditions'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'तांबट आळीतील ४०० वर्षे जुनी तांबे घडवण्याची कला, बालगंधर्वांची संगीत नाटके, ढोल-ताशांची लयबद्ध ऊर्जा आणि मानाच्या गणपतींची गौरवशाली परंपरा.'
              : 'From 400-year-old coppersmith lanes in Kasba Peth to the thunderous rhythms of Dhol-Tasha pathaks and classical Marathi theatre, encounter the true soul of Maharashtra.'}
          </p>
        </div>

        {/* Culture Cards Grid */}
        <div className="exp-culture-grid">
          {CULTURE_TRADITIONS_DATA.map((item, idx) => (
            <article key={item.title} className="exp-culture-card">
              <div className="exp-culture-media">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="exp-culture-img"
                />
                <div className="exp-culture-overlay" />
                <div className="exp-culture-timing-pill">
                  <Calendar size={12} />
                  <span>{item.seasonOrFrequency}</span>
                </div>
              </div>

              <div className="exp-culture-body">
                <h3 className="exp-culture-title">
                  {isMr ? item.titleMr : item.title}
                </h3>
                <p className="exp-culture-subtitle">{item.subtitle}</p>
                <p className="exp-culture-desc">{item.description}</p>

                <div className="exp-culture-significance">
                  <Award size={14} style={{ color: 'var(--exp-gold)', flexShrink: 0 }} />
                  <div>
                    <span className="lbl">{isMr ? 'महत्त्व:' : 'Cultural Significance:'}</span>
                    <p className="text">{item.significance}</p>
                  </div>
                </div>

                <div className="exp-culture-location">
                  <MapPin size={13} />
                  <span>{item.location}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

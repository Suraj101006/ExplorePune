'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  NATURE_ESCAPES_DATA,
  NatureSpot,
  PLACES_BY_SLUG,
} from '@/lib/experienceData';
import {
  Trees,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
  Compass,
} from 'lucide-react';

interface NatureEscapesSectionProps {
  isMr: boolean;
}

export default function NatureEscapesSection({ isMr }: NatureEscapesSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredSpots = NATURE_ESCAPES_DATA.filter((spot) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'city') return spot.locationScope === 'Within Pune City';
    if (selectedFilter === 'regional') return spot.locationScope === 'Regional Scenic Getaway';
    return spot.category.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <section id="nature" className="exp-section exp-nature-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Trees size={14} />
            <span>{isMr ? 'विभाग ०८ • निसर्ग आणि शांतता' : 'SECTION 08 • NATURE & PEACEFUL ESCAPES'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुण्यातील शांत निसर्ग आणि टेकड्या' : 'Nature & Peaceful Escapes'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'वेताळ टेकडीवरील सकाळचा ताजी हवा, खडकवासल्याची सूर्यास्त शांतता, ओकायामा जपानी बाग आणि पावसाळ्यातील ताम्हिणीचे धबधबे.'
              : 'From sunrise walks across Pune’s seven natural hills to quiet lakeside sunsets and cascading monsoon waterfalls in the Western Ghats.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="exp-nature-filter-row">
          {[
            { id: 'all', label: isMr ? 'सर्व निसर्ग स्थळे' : 'All Natural Havens' },
            { id: 'city', label: isMr ? 'पुणे शहर अंतर्गत (टेकड्या/उद्याने)' : 'Within Pune City' },
            { id: 'regional', label: isMr ? 'परिसरातील धरणे/घाट' : 'Regional Scenic Getaways' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              className={`exp-chip ${selectedFilter === f.id ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Nature Cards Grid */}
        <div className="exp-nature-grid">
          {filteredSpots.map((spot) => {
            const p = PLACES_BY_SLUG[spot.slug];
            const imgSrc = p ? p.image_url : `/images/places/${spot.slug}.jpg`;

            return (
              <div key={spot.slug} className="exp-nature-card">
                <div className="exp-nature-media">
                  <Image
                    src={imgSrc}
                    alt={spot.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="exp-nature-img"
                  />
                  <div className="exp-nature-overlay" />
                  <div className="exp-nature-scope-badge">
                    {spot.locationScope}
                  </div>
                </div>

                <div className="exp-nature-body">
                  <span className="exp-nature-cat">{spot.category}</span>
                  <h3 className="exp-nature-title">
                    {isMr ? spot.nameMr : spot.name}
                  </h3>
                  <p className="exp-nature-desc">{spot.description}</p>

                  <div className="exp-nature-meta">
                    <div className="item">
                      <Clock size={13} />
                      <span><strong>{isMr ? 'उत्तम वेळ:' : 'Best Time:'}</strong> {spot.bestTimeOfDay}</span>
                    </div>
                    <div className="item">
                      <Sparkles size={13} />
                      <span><strong>{isMr ? 'ऋतू विशेष:' : 'Season:'}</strong> {spot.seasonalHighlight}</span>
                    </div>
                  </div>

                  <div className="exp-nature-actions">
                    <Link
                      href={`/places/${spot.slug}`}
                      className="exp-btn-secondary full-w"
                    >
                      <span>{isMr ? 'सविस्तर निसर्ग माहिती' : 'Explore Natural Haven'}</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

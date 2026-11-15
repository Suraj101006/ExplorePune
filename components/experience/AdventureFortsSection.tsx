'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FORTS_ADVENTURE_DATA,
  PLACES_BY_SLUG,
  FortAdventure,
} from '@/lib/experienceData';
import {
  Mountain,
  AlertTriangle,
  Clock,
  Compass,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

interface AdventureFortsSectionProps {
  isMr: boolean;
}

export default function AdventureFortsSection({ isMr }: AdventureFortsSectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredForts = FORTS_ADVENTURE_DATA.filter((fort) => {
    if (selectedDifficulty === 'all') return true;
    return fort.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
  });

  return (
    <section id="forts" className="exp-section exp-forts-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Mountain size={14} />
            <span>{isMr ? 'विभाग ०५ • किल्ले आणि साहस' : 'SECTION 05 • SAHYADRI FORTS & TREKS'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'सह्याद्रीचे गडकोट आणि साहसी ट्रेक्स' : 'Forts & Adventure Experiences'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'शिवकालीन अजिंक्य गडकोट, कडेकपारीतील ऐतिहासिक मार्ग, पायथ्याशी मिळणारी पिठलं-भाकरी आणि अचूक ट्रेकिंग सुरक्षितता नियमांसह सह्याद्री अनुभवा.'
              : 'Conquer cloud-veiled Maratha citadels, razor-sharp basalt ridges, and historic stone gateways with verified trek difficulties and safety advisories.'}
          </p>
        </div>

        {/* Difficulty Filter Chips */}
        <div className="exp-forts-filter-row">
          <span className="exp-filter-label">{isMr ? 'कठीणता पातळी:' : 'Filter by Difficulty:'}</span>
          {['all', 'Easy', 'Moderate', 'Challenging', 'Strenuous'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`exp-chip ${selectedDifficulty === diff ? 'active' : ''}`}
            >
              {diff === 'all' ? (isMr ? 'सर्व किल्ले (७)' : 'All Forts (7)') : diff}
            </button>
          ))}
        </div>

        {/* Forts Grid */}
        <div className="exp-forts-grid">
          {filteredForts.map((fort) => {
            const p = PLACES_BY_SLUG[fort.slug];
            const imgSrc = p ? p.image_url : `/images/places/${fort.slug}.jpg`;

            return (
              <div key={fort.slug} className="exp-fort-card">
                <div className="exp-fort-media">
                  <Image
                    src={imgSrc}
                    alt={fort.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="exp-fort-img"
                  />
                  <div className="exp-fort-overlay" />
                  <div className="exp-fort-badges">
                    <span className={`exp-diff-badge ${fort.difficulty.toLowerCase()}`}>
                      {fort.difficulty}
                    </span>
                    <span className="exp-elev-badge">
                      {fort.elevationMeters}m MSL
                    </span>
                  </div>
                </div>

                <div className="exp-fort-body">
                  <h3 className="exp-fort-title">
                    {isMr ? fort.marathiName : fort.name}
                  </h3>

                  {/* Core Trek Metrics */}
                  <div className="exp-fort-metrics-grid">
                    <div className="exp-fort-metric">
                      <Clock size={13} />
                      <div>
                        <span className="lbl">{isMr ? 'चढाई वेळ' : 'Trek Duration'}</span>
                        <span className="val">{fort.trekDurationHours}</span>
                      </div>
                    </div>

                    <div className="exp-fort-metric">
                      <MapPin size={13} />
                      <div>
                        <span className="lbl">{isMr ? 'पुण्यापासून अंतर' : 'Distance from Pune'}</span>
                        <span className="val">{fort.distanceFromPuneKm} km</span>
                      </div>
                    </div>

                    <div className="exp-fort-metric">
                      <Compass size={13} />
                      <div>
                        <span className="lbl">{isMr ? 'पायथा गाव' : 'Base Village'}</span>
                        <span className="val">{fort.baseVillage}</span>
                      </div>
                    </div>

                    <div className="exp-fort-metric">
                      <CheckCircle2 size={13} />
                      <div>
                        <span className="lbl">{isMr ? 'उत्तम ऋतू' : 'Best Season'}</span>
                        <span className="val">{fort.bestSeason}</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="exp-fort-highlights">
                    <span className="lbl">{isMr ? 'प्रमुख आकर्षणे:' : 'Trek Highlights:'}</span>
                    <ul className="exp-highlights-list">
                      {fort.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety & Restrictions Alert Box */}
                  <div className="exp-fort-safety-box">
                    <ShieldAlert size={15} className="exp-safety-icon" />
                    <div>
                      <span className="exp-safety-title">{isMr ? 'सुरक्षा नियम:' : 'Safety Advisory:'}</span>
                      <p className="exp-safety-text">{fort.safetyAdvisory}</p>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="exp-fort-facilities">
                    <Coffee size={13} style={{ color: 'var(--exp-gold)' }} />
                    <span>{fort.facilities}</span>
                  </div>

                  <div className="exp-fort-actions">
                    <Link
                      href={`/places/${fort.slug}`}
                      className="exp-btn-primary full-w"
                    >
                      <span>{isMr ? 'किल्ला मार्गदर्शिका पाहा' : 'View Fortress Trail Guide'}</span>
                      <ExternalLink size={14} />
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

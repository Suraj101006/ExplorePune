'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  HIDDEN_GEMS_DATA,
  HiddenGem,
  PLACES_BY_SLUG,
} from '@/lib/experienceData';
import {
  Compass,
  Sparkles,
  MapPin,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

interface HiddenGemsSectionProps {
  isMr: boolean;
}

export default function HiddenGemsSection({ isMr }: HiddenGemsSectionProps) {
  return (
    <section id="gems" className="exp-section exp-gems-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Compass size={14} />
            <span>{isMr ? 'विभाग ०९ • अनोखी ठिकाणे' : 'SECTION 09 • HIDDEN GEMS OF PUNE'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुण्यातील दुर्लक्षित आणि गुप्त ठेवा' : 'Hidden Gems of Pune'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'नेहमीच्या पर्यटन स्थळांच्या पलीकडे जाऊन त्रिशुंड गणपती, सोमेश्वर पाषाण, सायकल संग्रहालय आणि भिडे वाड्यासारख्या दुर्मीळ ऐतिहासिक ठिकाणांचा शोध घ्या.'
              : 'Venture beyond tourist crowds to uncover secret stepwells, curious mechanical museums, and hallowed milestones of reform.'}
          </p>
        </div>

        {/* Gems Grid */}
        <div className="exp-gems-grid">
          {HIDDEN_GEMS_DATA.map((gem) => {
            const p = PLACES_BY_SLUG[gem.slug];
            const imgSrc = p ? p.image_url : `/images/places/${gem.slug}.jpg`;

            return (
              <div key={gem.slug} className="exp-gem-card">
                <div className="exp-gem-media">
                  <Image
                    src={imgSrc}
                    alt={gem.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="exp-gem-img"
                  />
                  <div className="exp-gem-overlay" />
                  <div className="exp-gem-loc-badge">
                    <MapPin size={11} />
                    <span>{gem.locality}</span>
                  </div>
                </div>

                <div className="exp-gem-body">
                  <h3 className="exp-gem-title">
                    {isMr ? gem.nameMr : gem.name}
                  </h3>
                  <p className="exp-gem-tagline">{gem.tagline}</p>
                  <p className="exp-gem-desc">{gem.description}</p>

                  <div className="exp-gem-unique-box">
                    <Sparkles size={14} style={{ color: 'var(--exp-gold)', flexShrink: 0 }} />
                    <div>
                      <span className="lbl">{isMr ? 'हे का खास आहे:' : 'Why It’s Unique:'}</span>
                      <p className="val">{gem.whyItsUnique}</p>
                    </div>
                  </div>

                  <div className="exp-gem-actions">
                    <Link
                      href={`/places/${gem.slug}`}
                      className="exp-btn-secondary full-w"
                    >
                      <span>{isMr ? 'संपूर्ण माहिती वाचा' : 'Discover Secret Landmark'}</span>
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

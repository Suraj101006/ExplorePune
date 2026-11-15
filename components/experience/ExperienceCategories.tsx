'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  EXPERIENCE_CATEGORIES,
  ALL_106_PLACES,
  ExperienceCategory,
  ExperiencePlace,
} from '@/lib/experienceData';
import {
  Compass,
  ArrowRight,
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ExperienceCategoriesProps {
  isMr: boolean;
}

export default function ExperienceCategories({ isMr }: ExperienceCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory | null>(null);

  // Compute live counts
  const categoryCounts: Record<string, number> = {};
  EXPERIENCE_CATEGORIES.forEach((cat) => {
    categoryCounts[cat.id] = ALL_106_PLACES.filter(cat.slugFilter).length;
  });

  const matchingPlaces: ExperiencePlace[] = selectedCategory
    ? ALL_106_PLACES.filter(selectedCategory.slugFilter)
    : [];

  return (
    <section id="categories" className="exp-section exp-categories-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Compass size={14} />
            <span>{isMr ? 'विभाग ०२ • १६ अनुभव मार्ग' : 'SECTION 02 • 16 DISCOVERY PATHWAYS'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुणे अनुभवा तुमच्या पद्धतीने' : 'Discover Pune Your Way'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'ऐतिहासिक गडांपासून जुन्या वाड्यांपर्यंत, आणि तिखट मिसळीपासून शांत टेकड्यांपर्यंत — १६ विविध मार्गांनी पुण्याचा अनुभव घ्या.'
              : 'From cloud-wrapped Maratha bastions to 400-year-old artisan quarters and serene hilltop sunsets, choose how you wish to experience the city.'}
          </p>
        </div>

        {/* 16 Category Cards Grid */}
        <div className="exp-category-grid">
          {EXPERIENCE_CATEGORIES.map((cat, idx) => {
            const count = categoryCounts[cat.id] || 0;
            return (
              <div
                key={cat.id}
                className="exp-category-card"
                onClick={() => setSelectedCategory(cat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCategory(cat);
                  }
                }}
                aria-label={`Explore category ${cat.title} with ${count} verified destinations`}
              >
                {/* Background Image Container with Parallax Zoom */}
                <div className="exp-cat-media">
                  <Image
                    src={cat.coverImage}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="exp-cat-img"
                  />
                  <div className="exp-cat-overlay" />
                  <div className="exp-cat-num">#{String(idx + 1).padStart(2, '0')}</div>
                </div>

                {/* Card Content */}
                <div className="exp-cat-body">
                  <div className="exp-cat-pill">
                    <ShieldCheck size={13} style={{ color: '#10b981' }} />
                    <span>
                      {count} {isMr ? 'सत्यापित ठिकाणे' : 'Verified Places'}
                    </span>
                  </div>

                  <h3 className="exp-cat-title">
                    {isMr ? cat.titleMr : cat.title}
                  </h3>

                  <p className="exp-cat-tagline">{cat.tagline}</p>
                  <p className="exp-cat-desc">{cat.description}</p>

                  <div className="exp-cat-action">
                    <span>{isMr ? 'अनुभव उघडा' : 'Explore Category'}</span>
                    <ArrowRight size={16} className="exp-cat-arrow" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Discovery Modal / Drawer */}
      {selectedCategory && (
        <div
          className="exp-modal-backdrop"
          onClick={() => setSelectedCategory(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cat-modal-title"
        >
          <div
            className="exp-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="exp-modal-header">
              <div className="exp-modal-header-text">
                <div className="exp-modal-kicker">
                  <Sparkles size={14} style={{ color: 'var(--exp-gold)' }} />
                  <span>
                    {isMr ? selectedCategory.titleMr : selectedCategory.title} • {matchingPlaces.length}{' '}
                    {isMr ? 'सत्यापित ठिकाणे' : 'Verified Destinations'}
                  </span>
                </div>
                <h3 id="cat-modal-title" className="exp-modal-title">
                  {selectedCategory.tagline}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="exp-modal-close"
                aria-label="Close category dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Matching Destinations List */}
            <div className="exp-modal-scroll">
              <p className="exp-modal-summary">{selectedCategory.description}</p>

              <div className="exp-modal-places-grid">
                {matchingPlaces.map((place) => (
                  <div key={place.id || place.slug} className="exp-place-card">
                    <div className="exp-place-media">
                      <Image
                        src={place.image_url}
                        alt={place.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 320px"
                        className="exp-place-img"
                      />
                      <div className="exp-place-badge">
                        {place.entry_fee === 0 || place.fee_status === 'free' ? '₹0 Free' : 'Verified'}
                      </div>
                    </div>

                    <div className="exp-place-info">
                      <h4 className="exp-place-name">
                        {isMr && place.name_mr ? place.name_mr : place.name}
                      </h4>
                      <p className="exp-place-addr">
                        <MapPin size={12} />
                        <span>{place.address}</span>
                      </p>
                      {place.opening_hours && (
                        <p className="exp-place-time">
                          <Clock size={12} />
                          <span>{place.opening_hours}</span>
                        </p>
                      )}
                      <p className="exp-place-desc">
                        {place.description ? place.description.slice(0, 110) + '…' : ''}
                      </p>

                      <div className="exp-place-actions">
                        <Link
                          href={`/places/${place.slug}`}
                          className="exp-place-btn-view"
                        >
                          <span>{isMr ? 'सविस्तर माहिती' : 'View Destination'}</span>
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="exp-modal-footer">
              <span>
                {matchingPlaces.length} {isMr ? 'ठिकाणे नोंदणीकृत' : 'places available in Explore Pune archive'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="exp-btn-secondary"
              >
                {isMr ? 'बंद करा' : 'Close Discovery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

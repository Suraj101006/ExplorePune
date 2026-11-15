'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getSavedPlaces,
  SavedPlaceSummary,
  clearSavedPlaces,
} from '@/lib/savedPlaces';
import {
  Bookmark,
  CheckCircle2,
  Users,
  Footprints,
  Compass,
  ArrowRight,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface CommunityProgressSectionProps {
  isMr: boolean;
}

export default function CommunityProgressSection({ isMr }: CommunityProgressSectionProps) {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaceSummary[]>([]);

  useEffect(() => {
    // Initial read
    setSavedPlaces(getSavedPlaces());

    // Listen to live saved changes across tabs/windows
    const handler = (e: any) => {
      if (e.detail) {
        setSavedPlaces(e.detail);
      } else {
        setSavedPlaces(getSavedPlaces());
      }
    };

    window.addEventListener('explore-pune-saved-changed', handler);
    return () => window.removeEventListener('explore-pune-saved-changed', handler);
  }, []);

  const totalDestinations = 106;
  const progressPercent = Math.min(
    Math.round((savedPlaces.length / totalDestinations) * 100),
    100
  );

  return (
    <section id="community" className="exp-section exp-community-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Users size={14} />
            <span>{isMr ? 'विभाग १४ • समुदाय आणि प्रगती' : 'SECTION 14 • COMMUNITY & PROGRESS'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'तुमचा वैयक्तिक पुणे अनुभव ट्रॅकर' : 'Your Personal Experience Passport'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'पुण्यातील तुमच्या आवडत्या ठिकाणांची वैयक्तिक यादी बनवा, भेटींची नोंद ठेवा आणि तुमच्या प्रवासाची प्रगती पहा.'
              : 'Track your personal Pune journey: curate your wishlist, record visited destinations, and unlock exploration milestones.'}
          </p>
        </div>

        {/* Progress Passport Card */}
        <div className="exp-passport-card">
          <div className="exp-passport-grid">
            {/* Exploration Progress Gauge */}
            <div className="exp-passport-status">
              <span className="lbl">{isMr ? 'पुणे एक्सप्लोरेशन प्रगती' : 'PUNE EXPLORATION PROGRESS'}</span>
              <div className="num-row">
                <span className="count">{savedPlaces.length}</span>
                <span className="total">/ {totalDestinations} {isMr ? 'ठिकाणे' : 'Places Saved'}</span>
              </div>

              {/* Progress Bar */}
              <div className="exp-progress-track">
                <div
                  className="exp-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="exp-progress-note">
                {progressPercent}% {isMr ? 'पुणे अनुभव पूर्ण!' : 'of curated Pune destinations saved in your personal journey.'}
              </p>

              <div className="exp-passport-actions">
                <Link
                  href="/journey"
                  className="exp-btn-primary"
                >
                  <Footprints size={16} />
                  <span>{isMr ? 'माझी सफर उघडा' : 'Open My Journey'}</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/community"
                  className="exp-btn-secondary"
                >
                  <Users size={16} />
                  <span>{isMr ? 'पुणे समुदाय मंच' : 'Community Forum'}</span>
                </Link>
              </div>
            </div>

            {/* Live Saved Destinations Deck */}
            <div className="exp-passport-deck">
              <div className="deck-header">
                <h4>
                  <Bookmark size={15} style={{ color: 'var(--exp-gold)' }} />
                  <span>{isMr ? 'जतन केलेली ठिकाणे:' : 'Your Active Wishlist:'}</span>
                </h4>
                {savedPlaces.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      clearSavedPlaces();
                      setSavedPlaces([]);
                    }}
                    className="clear-btn"
                  >
                    <Trash2 size={13} />
                    <span>{isMr ? 'सर्व हटवा' : 'Clear All'}</span>
                  </button>
                )}
              </div>

              {savedPlaces.length > 0 ? (
                <div className="deck-scroll">
                  {savedPlaces.map((place) => (
                    <Link
                      key={place.id || place.slug}
                      href={`/places/${place.slug}`}
                      className="deck-item"
                    >
                      <div className="dot" />
                      <div className="info">
                        <span className="name">
                          {isMr && place.name_mr ? place.name_mr : place.name}
                        </span>
                        <span className="cat">{place.category || 'Verified Destination'}</span>
                      </div>
                      <ArrowRight size={13} className="arrow" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="deck-empty">
                  <Compass size={28} />
                  <p>
                    {isMr
                      ? 'अद्याप कोणतेही ठिकाण जतन केलेले नाही. वरील १६ श्रेणी किंवा नकाशावरून ठिकाणे जोडा!'
                      : 'No saved destinations yet. Click "Save Stop" on the interactive map or categories to curate your personal itinerary!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

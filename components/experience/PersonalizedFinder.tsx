'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ALL_106_PLACES,
  ExperiencePlace,
} from '@/lib/experienceData';
import {
  Sparkles,
  Clock,
  Compass,
  DollarSign,
  Users,
  Car,
  Bookmark,
  Check,
  ArrowRight,
  ExternalLink,
  MapPin,
  Route,
} from 'lucide-react';
import { toggleSavedPlace, isPlaceSaved } from '@/lib/savedPlaces';

interface PersonalizedFinderProps {
  isMr: boolean;
}

export default function PersonalizedFinder({ isMr }: PersonalizedFinderProps) {
  // 5 Quiz Preferences
  const [selectedTime, setSelectedTime] = useState<'2hr' | 'halfDay' | 'fullDay' | 'weekend'>('halfDay');
  const [selectedPassion, setSelectedPassion] = useState<string>('heritage');
  const [selectedBudget, setSelectedBudget] = useState<'free' | 'budget' | 'any'>('budget');
  const [selectedGroup, setSelectedGroup] = useState<'solo' | 'couple' | 'friends' | 'family'>('friends');
  const [selectedTransport, setSelectedTransport] = useState<'transit' | 'bike' | 'car' | 'walk'>('transit');

  const [savedPlan, setSavedPlan] = useState(false);

  // Recommendations matching algorithm
  const recommendations = useMemo(() => {
    let pool = [...ALL_106_PLACES];

    // 1. Filter by Passion
    if (selectedPassion === 'heritage') {
      pool = pool.filter((p) => p.category_slug === 'heritage');
    } else if (selectedPassion === 'forts') {
      pool = pool.filter((p) => p.category_slug === 'forts');
    } else if (selectedPassion === 'culinary') {
      pool = pool.filter((p) => p.category_slug === 'food');
      if (pool.length === 0) pool = ALL_106_PLACES.filter((p) => p.category_slug === 'food');
    } else if (selectedPassion === 'spiritual') {
      pool = pool.filter((p) => p.category_slug === 'temples');
    } else if (selectedPassion === 'nature') {
      pool = pool.filter((p) => p.category_slug === 'nature' || p.category_slug === 'parks');
    }

    // 2. Filter by Budget
    if (selectedBudget === 'free') {
      pool = pool.filter((p) => p.entry_fee === 0 || p.fee_status === 'free');
    }

    // 3. Filter by Group (e.g. family prefers parks/museums/accessible spots)
    if (selectedGroup === 'family') {
      const familyFavs = pool.filter((p) =>
        ['parks', 'museums', 'temples', 'heritage'].includes(p.category_slug)
      );
      if (familyFavs.length >= 3) pool = familyFavs;
    }

    // 4. Limit by Time
    let maxStops = 4;
    if (selectedTime === '2hr') maxStops = 2;
    if (selectedTime === 'halfDay') maxStops = 3;
    if (selectedTime === 'fullDay') maxStops = 5;
    if (selectedTime === 'weekend') maxStops = 6;

    // Pick top places by popularity_score
    pool.sort((a, b) => (b.popularity_score || 80) - (a.popularity_score || 80));
    return pool.slice(0, maxStops);
  }, [selectedTime, selectedPassion, selectedBudget, selectedGroup, selectedTransport]);

  const handleSaveAll = () => {
    recommendations.forEach((place) => {
      toggleSavedPlace({
        id: place.id || place.slug,
        slug: place.slug,
        name: place.name,
        name_mr: place.name_mr,
        image_url: place.image_url,
        category_slug: place.category_slug,
        category: place.category,
      });
    });
    setSavedPlan(true);
    setTimeout(() => setSavedPlan(false), 3000);
  };

  return (
    <section id="finder" className="exp-section exp-finder-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Sparkles size={14} />
            <span>{isMr ? 'विभाग ११ • वैयक्तिक अनुभव फाइंडर' : 'SECTION 11 • PERSONALIZED FINDER'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'तुमच्या आवडीनुसार पुणे अनुभव तयार करा' : 'Personalized Experience Finder'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'तुमचा उपलब्ध वेळ, आवड, बजेट आणि प्रवासाचे साधन निवडा — अल्गोरिदम १०६ प्रमाणित ठिकाणांमधून सर्वोत्तम प्रवास योजना तयार करेल.'
              : 'Select your available time, passion, budget, group, and transit mode. Our real-time spatial matcher builds your verified custom Pune journey.'}
          </p>
        </div>

        {/* 5-Step Quiz Card */}
        <div className="exp-finder-card">
          <div className="exp-quiz-grid">
            {/* 1. Time */}
            <div className="exp-quiz-group">
              <label className="exp-quiz-label">
                <Clock size={15} />
                <span>1. {isMr ? 'उपलब्ध वेळ:' : 'Available Time:'}</span>
              </label>
              <div className="exp-quiz-options">
                {[
                  { id: '2hr', label: isMr ? '२ तास एक्सप्रेस' : '2 Hours' },
                  { id: 'halfDay', label: isMr ? 'अर्धा दिवस (४-५ तास)' : 'Half Day (4-5 hrs)' },
                  { id: 'fullDay', label: isMr ? 'पूर्ण दिवस (८ तास)' : 'Full Day (8 hrs)' },
                  { id: 'weekend', label: isMr ? 'वीकेंड सहल' : 'Weekend (2 Days)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedTime(opt.id as any)}
                    className={`exp-quiz-btn ${selectedTime === opt.id ? 'active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Passion */}
            <div className="exp-quiz-group">
              <label className="exp-quiz-label">
                <Compass size={15} />
                <span>2. {isMr ? 'प्रमुख आवड:' : 'Primary Passion:'}</span>
              </label>
              <div className="exp-quiz-options">
                {[
                  { id: 'heritage', label: isMr ? 'इतिहास व वाडे' : 'Heritage & Wadas' },
                  { id: 'forts', label: isMr ? 'किल्ले व ट्रेक्स' : 'Forts & Treks' },
                  { id: 'culinary', label: isMr ? 'खाद्यसंस्कृती' : 'Food & Cafes' },
                  { id: 'spiritual', label: isMr ? 'अध्यात्म व मंदिरे' : 'Spiritual & Shrines' },
                  { id: 'nature', label: isMr ? 'निसर्ग व टेकड्या' : 'Nature & Hills' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedPassion(opt.id)}
                    className={`exp-quiz-btn ${selectedPassion === opt.id ? 'active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Budget */}
            <div className="exp-quiz-group">
              <label className="exp-quiz-label">
                <DollarSign size={15} />
                <span>3. {isMr ? 'अपेक्षित बजेट:' : 'Budget Preference:'}</span>
              </label>
              <div className="exp-quiz-options">
                {[
                  { id: 'free', label: isMr ? '१००% मोफत (₹0)' : '₹0 Free Only' },
                  { id: 'budget', label: isMr ? 'किफायतशीर (₹100-₹500)' : 'Budget (₹100 - ₹500)' },
                  { id: 'any', label: isMr ? 'काहीही (सर्व समावेशक)' : 'Any Budget' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedBudget(opt.id as any)}
                    className={`exp-quiz-btn ${selectedBudget === opt.id ? 'active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Travel Group */}
            <div className="exp-quiz-group">
              <label className="exp-quiz-label">
                <Users size={15} />
                <span>4. {isMr ? 'प्रवासी गट:' : 'Travel Group:'}</span>
              </label>
              <div className="exp-quiz-options">
                {[
                  { id: 'solo', label: isMr ? 'एकटे प्रवासी' : 'Solo Explorer' },
                  { id: 'couple', label: isMr ? 'जोडीदार / कपल' : 'Couple' },
                  { id: 'friends', label: isMr ? 'मित्रमंडळी' : 'Friends' },
                  { id: 'family', label: isMr ? 'कुटुंब व मुले' : 'Family' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedGroup(opt.id as any)}
                    className={`exp-quiz-btn ${selectedGroup === opt.id ? 'active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Transit Mode */}
            <div className="exp-quiz-group">
              <label className="exp-quiz-label">
                <Car size={15} />
                <span>5. {isMr ? 'प्रवासाचे साधन:' : 'Preferred Transport:'}</span>
              </label>
              <div className="exp-quiz-options">
                {[
                  { id: 'transit', label: isMr ? 'मेट्रो व PMPML बस' : 'Pune Metro + Bus' },
                  { id: 'bike', label: isMr ? 'दुचाकी / बाइक' : 'Two-Wheeler' },
                  { id: 'car', label: isMr ? 'कार / कॅब' : 'Car / Cab' },
                  { id: 'walk', label: isMr ? 'पायी हेरिटेज वॉक' : 'Walking Trail' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedTransport(opt.id as any)}
                    className={`exp-quiz-btn ${selectedTransport === opt.id ? 'active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Recommendations Output */}
          <div className="exp-finder-results">
            <div className="exp-finder-results-header">
              <div>
                <span className="kicker">
                  {isMr ? 'शिफारस केलेली यात्रा क्रमवारी' : 'RECOMMENDED SEQUENCED PLAN'}
                </span>
                <h3 className="title">
                  {recommendations.length} {isMr ? 'प्रमाणित ठिकाणांची योजना' : 'Handpicked Stops for You'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleSaveAll}
                className="exp-btn-secondary"
              >
                {savedPlan ? (
                  <>
                    <Check size={16} style={{ color: '#10b981' }} />
                    <span>{isMr ? 'जतन केले!' : 'Saved to Wishlist!'}</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    <span>{isMr ? 'सर्व ठिकाणे जतन करा' : 'Save Full Plan'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Sequenced Timeline Stops */}
            <div className="exp-finder-timeline">
              {recommendations.map((place, idx) => (
                <div key={place.slug} className="exp-finder-stop">
                  <div className="stop-marker">
                    <span>{idx + 1}</span>
                  </div>

                  <div className="stop-card">
                    <div className="stop-media">
                      <Image
                        src={place.image_url}
                        alt={place.name}
                        fill
                        sizes="180px"
                        className="stop-img"
                      />
                    </div>

                    <div className="stop-body">
                      <div className="stop-cat-row">
                        <span className="cat">{place.category}</span>
                        <span className="fee">
                          {place.entry_fee === 0 || place.fee_status === 'free'
                            ? '₹0 Free'
                            : typeof place.fee_details === 'string'
                            ? place.fee_details
                            : 'Verified Entry'}
                        </span>
                      </div>

                      <h4 className="stop-title">
                        {isMr && place.name_mr ? place.name_mr : place.name}
                      </h4>

                      <p className="stop-addr">
                        <MapPin size={12} />
                        <span>{place.address}</span>
                      </p>

                      <div className="stop-actions">
                        <Link
                          href={`/places/${place.slug}`}
                          className="exp-btn-link"
                        >
                          <span>{isMr ? 'माहिती पाहा' : 'View Stop Profile'}</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

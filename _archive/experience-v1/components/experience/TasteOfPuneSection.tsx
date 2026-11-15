'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  TASTE_OF_PUNE_DATA,
  CulinaryDelight,
  PLACES_BY_SLUG,
} from '@/lib/experienceData';
import {
  Utensils,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Tag,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface TasteOfPuneSectionProps {
  isMr: boolean;
}

export default function TasteOfPuneSection({ isMr }: TasteOfPuneSectionProps) {
  const [activeDishId, setActiveDishId] = useState<string>(TASTE_OF_PUNE_DATA[0].id);

  const activeDish =
    TASTE_OF_PUNE_DATA.find((d) => d.id === activeDishId) || TASTE_OF_PUNE_DATA[0];

  return (
    <section id="food" className="exp-section exp-food-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Utensils size={14} />
            <span>{isMr ? 'विभाग ०६ • पुणेरी खाद्यसंस्कृती' : 'SECTION 06 • TASTE OF PUNE'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुणेरी चवींचा अस्सल वारसा' : 'Taste of Pune — Culinary Magazine'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'नारायण पेठेतील झणझणीत मिसळ, सदाशिव पेठेतील सुजाता मस्तानी, चितळे बंधूंची बाकरवडी आणि ब्रिटिश-इराणी चहाची शतकोन् शतके जुनी खाद्य परंपरा.'
              : 'A curated gastronomic journal celebrating Pune’s authentic culinary institutions, from century-old Irani bakeries and fiery misal to royal Mastani desserts.'}
          </p>
        </div>

        {/* Magazine Feature Showcase Layout */}
        <div className="exp-food-showcase">
          {/* Dish Selector Tabs */}
          <div className="exp-food-nav-list" role="tablist">
            {TASTE_OF_PUNE_DATA.map((dish) => (
              <button
                key={dish.id}
                type="button"
                role="tab"
                aria-selected={activeDishId === dish.id}
                onClick={() => setActiveDishId(dish.id)}
                className={`exp-food-nav-btn ${activeDishId === dish.id ? 'active' : ''}`}
              >
                <div className="exp-food-nav-icon">
                  {dish.isVegetarian ? (
                    <span className="exp-veg-badge" title="Vegetarian">🟢</span>
                  ) : (
                    <span className="exp-nonveg-badge" title="Contains Egg / Non-Vegetarian">🔴</span>
                  )}
                </div>
                <div className="exp-food-nav-text">
                  <span className="dish-name">{isMr ? dish.dishNameMr : dish.dishName}</span>
                  <span className="dish-where">{dish.whereToTry.split('(')[0]}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Dish Magazine Feature Panel */}
          <div className="exp-food-feature-card">
            <div className="exp-food-feature-media">
              <Image
                src={activeDish.imageUrl}
                alt={activeDish.dishName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="exp-food-feature-img"
              />
              <div className="exp-food-feature-overlay" />
              <div className="exp-food-tag-badge">
                {activeDish.isVegetarian
                  ? isMr
                    ? '१००% शाकाहारी'
                    : '100% Pure Vegetarian'
                  : isMr
                  ? 'अंडी समाविष्ट'
                  : 'Contains Egg'}
              </div>
            </div>

            <div className="exp-food-feature-body">
              <div className="exp-food-price-tag">
                <Tag size={13} />
                <span>{activeDish.priceRange}</span>
              </div>

              <h3 className="exp-food-title">
                {isMr ? activeDish.dishNameMr : activeDish.dishName}
              </h3>

              <p className="exp-food-tagline">{activeDish.tagline}</p>
              <p className="exp-food-desc">{activeDish.description}</p>

              {/* Cultural Heritage Vignette */}
              <div className="exp-food-culture-box">
                <Sparkles size={15} className="exp-culture-icon" />
                <div>
                  <span className="title">{isMr ? 'सांस्कृतिक पार्श्वभूमी:' : 'Cultural Origin & Heritage:'}</span>
                  <p className="text">{activeDish.culturalBackground}</p>
                </div>
              </div>

              {/* Verified Where to Try & Timings */}
              <div className="exp-food-location-box">
                <div className="item">
                  <MapPin size={14} />
                  <div>
                    <span className="lbl">{isMr ? 'कुठे चाखाल:' : 'Where to try:'}</span>
                    <span className="val">{activeDish.whereToTry}</span>
                    <span className="sub">{activeDish.verifiedAddress}</span>
                  </div>
                </div>

                <div className="item">
                  <Clock size={14} />
                  <div>
                    <span className="lbl">{isMr ? 'वेळ:' : 'Timings:'}</span>
                    <span className="val">{activeDish.timings}</span>
                  </div>
                </div>
              </div>

              {activeDish.placeSlug && (
                <div className="exp-food-actions">
                  <Link
                    href={`/places/${activeDish.placeSlug}`}
                    className="exp-btn-primary full-w"
                  >
                    <span>{isMr ? 'खाद्य ठिकाणाची सविस्तर माहिती पाहा' : 'Explore Culinary Destination'}</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

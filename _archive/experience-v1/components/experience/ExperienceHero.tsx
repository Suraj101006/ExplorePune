'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Compass, ArrowDown, ShieldCheck } from 'lucide-react';
import ExperienceAudio from '@/components/experience/ExperienceAudio';

interface ExperienceHeroProps {
  isMr: boolean;
}

export default function ExperienceHero({ isMr }: ExperienceHeroProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="exp-hero-section" aria-label="Experience Pune Hero">
      {/* Background Cinematic Video with Fallback Poster */}
      <div className="exp-hero-media" aria-hidden="true">
        <video
          className="exp-hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/explore-pune-metro-transit-poster.jpg"
        >
          <source src="/videos/explore-pune-intro.mp4" type="video/mp4" />
        </video>
        <div className="exp-hero-overlay" />
        <div className="exp-hero-radial" />
      </div>

      {/* Atmospheric Badges & Audio Controls */}
      <div className="exp-hero-topbar">
        <div className="exp-hero-pill">
          <Sparkles size={14} className="exp-sparkle-icon" />
          <span>{isMr ? 'पुणे अनुभव • Discover More. Experience Pune.' : 'Experience Pune • Beyond the Ordinary'}</span>
        </div>

        <ExperienceAudio />
      </div>

      {/* Main Content */}
      <div className="exp-hero-content">
        <div className="exp-editorial-kicker">
          <span className="exp-kicker-line" />
          <span className="exp-kicker-text">
            {isMr ? 'अधिक शोधा. पुणे अनुभवा.' : 'DISCOVER MORE. EXPERIENCE PUNE.'}
          </span>
          <span className="exp-kicker-line" />
        </div>

        <h1 className="exp-hero-heading">
          {isMr ? (
            <>
              पुणे <span className="exp-gold-gradient">अनुभव</span>
            </>
          ) : (
            <>
              EXPERIENCE <span className="exp-gold-gradient">PUNE</span>
            </>
          )}
        </h1>

        <p className="exp-hero-subheading">
          {isMr
            ? 'रस्त्यांच्या पलीकडे जाऊन पुणे शोधा — ऐतिहासिक वारसा, सह्याद्रीचे गडकोट आणि जिवंत संस्कृतीचा प्रत्यक्ष अनुभव.'
            : 'Discover the city beyond its streets. An extraordinary digital journey through centuries of Maratha valor, Peshwa majesty, and living culture.'}
        </p>

        {/* Quick CTAs */}
        <div className="exp-hero-actions">
          <button
            type="button"
            onClick={() => scrollTo('world3d')}
            className="exp-btn-primary"
          >
            <Sparkles size={18} />
            <span>{isMr ? '३डी डिजिटल पुणे' : 'Explore 3D Digital World'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('categories')}
            className="exp-btn-secondary"
          >
            <Compass size={18} />
            <span>{isMr ? '१६ अनुभव श्रेणी' : '16 Experiences'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('map')}
            className="exp-btn-ghost"
          >
            <MapPin size={18} />
            <span>{isMr ? 'नकाशावर पाहा' : 'Interactive Map'}</span>
          </button>
        </div>

        {/* Real Metrics Ticker */}
        <div className="exp-hero-metrics" role="region" aria-label="Key Platform Metrics">
          <div className="exp-metric-item">
            <span className="exp-metric-val">106</span>
            <span className="exp-metric-lbl">
              <ShieldCheck size={13} style={{ display: 'inline', marginRight: 4, color: '#10b981' }} />
              {isMr ? 'सत्यापित ठिकाणे' : 'Verified Destinations'}
            </span>
          </div>
          <div className="exp-metric-div" />
          <div className="exp-metric-item">
            <span className="exp-metric-val">16</span>
            <span className="exp-metric-lbl">{isMr ? 'अनुभव श्रेणी' : 'Discovery Categories'}</span>
          </div>
          <div className="exp-metric-div" />
          <div className="exp-metric-item">
            <span className="exp-metric-val">8</span>
            <span className="exp-metric-lbl">{isMr ? 'नियोजित ट्रेल्स' : 'Curated Itineraries'}</span>
          </div>
          <div className="exp-metric-div" />
          <div className="exp-metric-item">
            <span className="exp-metric-val">100%</span>
            <span className="exp-metric-lbl">{isMr ? 'अधिकृत संशोधन' : 'Authoritative Facts'}</span>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        type="button"
        onClick={() => scrollTo('categories')}
        className="exp-scroll-indicator"
        aria-label="Scroll down to experiences"
      >
        <span className="exp-scroll-label">{isMr ? 'खाली स्क्रोल करा' : 'Scroll to explore'}</span>
        <div className="exp-scroll-chevrons">
          <ArrowDown size={18} />
        </div>
      </button>
    </section>
  );
}

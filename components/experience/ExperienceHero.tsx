'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Compass, ArrowDown, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface ExperienceHeroProps {
  isMr: boolean;
}

export default function ExperienceHero({ isMr }: ExperienceHeroProps) {
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

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
          muted={isMuted}
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

        <button
          type="button"
          onClick={toggleSound}
          className="exp-audio-btn"
          aria-label={isMuted ? 'Unmute cinematic ambient sound' : 'Mute cinematic ambient sound'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
        </button>
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
            ? 'नेहमीच्या पलीकडे जाऊन पुण्याच्या कथा, ऐतिहासिक वारसा, चवदार खाद्यसंस्कृती आणि अप्रतिम निसर्गाचा प्रत्यक्ष अनुभव घ्या.'
            : 'Beyond the ordinary. Discover the stories, flavours, heritage and hidden wonders of Pune.'}
        </p>

        {/* Quick CTAs */}
        <div className="exp-hero-actions">
          <button
            type="button"
            onClick={() => scrollTo('categories')}
            className="exp-btn-primary"
          >
            <Compass size={18} />
            <span>{isMr ? '१६ अनुभव एक्सप्लोर करा' : 'Explore Experiences'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('map')}
            className="exp-btn-secondary"
          >
            <MapPin size={18} />
            <span>{isMr ? 'नकाशावर पाहा' : 'Interactive Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('finder')}
            className="exp-btn-ghost"
          >
            <Sparkles size={18} />
            <span>{isMr ? 'माझ्या आवडीनुसार शोधा' : 'Personalized Finder'}</span>
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

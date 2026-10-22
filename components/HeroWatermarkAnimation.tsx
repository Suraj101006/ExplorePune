'use client';

import React from 'react';
import Image from 'next/image';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function HeroWatermarkAnimation() {
  const { isMr } = useLanguage();

  return (
    <div className="hero-pune-artwork-container" aria-label="Explore Pune Heritage Map Artwork">
      {/* Ambient Pulsing Saffron/Orange Halo Aura */}
      <div className="hero-pune-map-glow" aria-hidden="true" />

      {/* Floating 3D Pune Map Centerpiece with Forts, Wadas & Marathi Calligraphy */}
      <div className="hero-pune-map-wrapper">
        <Image
          src="/images/pune-map-hero.png"
          alt="Pune District 3D Map with Sinhagad Fort, Shaniwar Wada, and Marathi Calligraphy"
          width={520}
          height={500}
          priority
          className="hero-pune-map-img"
        />
      </div>

      {/* Cultural Heritage Continuation Block: Punyanagari, Sahyadri & Aamch Pune */}
      <div className="hero-pune-cultural-block">
        <div className="hero-pune-cultural-crest">
          <Shield size={13} style={{ color: '#ea580c' }} aria-hidden="true" />
          <span className="hero-pune-crest-text">
            पुण्यनगरी • सह्याद्री • संस्कृती
          </span>
          <span style={{ fontSize: '11px', color: '#9a3412', fontWeight: 700 }}>•</span>
        </div>

        <div className="hero-pune-cultural-sub">
          {isMr ? 'आमचं पुणे, आमचा वारसा' : 'Official Pune Heritage & Field Archive'}
        </div>
      </div>
    </div>
  );
}

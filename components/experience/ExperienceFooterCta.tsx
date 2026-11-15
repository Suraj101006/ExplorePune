'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Route,
  MapPin,
  Home,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ExperienceFooterCtaProps {
  isMr: boolean;
}

export default function ExperienceFooterCta({ isMr }: ExperienceFooterCtaProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="finale" className="exp-section exp-footer-cta-section">
      <div className="exp-container">
        <div className="exp-footer-cta-card">
          <div className="exp-cta-badge">
            <Sparkles size={14} />
            <span>{isMr ? 'विभाग १५ • अंतिम आमंत्रण' : 'SECTION 15 • YOUR JOURNEY AWAITS'}</span>
          </div>

          <h2 className="exp-cta-heading">
            {isMr ? 'तुमची पुणे सफर इथून सुरू होते.' : 'Your Pune Story Starts Here.'}
          </h2>

          <p className="exp-cta-sub">
            {isMr
              ? 'प्रत्येक रस्त्याला एक कथा आहे. प्रत्येक ऐतिहासिक ठिकाणाचा एक अनोखा अनुभव आहे. चला, आजच तुमचे पुणे शोधा.'
              : 'Every street has a story. Every destination has an experience. Go discover yours.'}
          </p>

          <div className="exp-cta-nav-grid">
            <Link href="/destinations" className="exp-cta-tile">
              <MapPin size={20} className="icon" />
              <div className="text">
                <span className="title">{isMr ? 'सर्व १०६ ठिकाणे' : 'Explore All 106 Places'}</span>
                <span className="desc">{isMr ? 'संपूर्ण पर्यटन डेटाबेस' : 'Complete Verified Directory'}</span>
              </div>
              <ArrowRight size={16} className="arrow" />
            </Link>

            <Link href="/planner" className="exp-cta-tile">
              <Route size={20} className="icon" />
              <div className="text">
                <span className="title">{isMr ? 'ट्रिप प्लॅनर' : 'Build Custom Itinerary'}</span>
                <span className="desc">{isMr ? 'मार्ग व प्रवास नियोजन' : 'Turn-by-turn Route Calculator'}</span>
              </div>
              <ArrowRight size={16} className="arrow" />
            </Link>

            <button
              type="button"
              onClick={() => scrollTo('categories')}
              className="exp-cta-tile"
            >
              <Compass size={20} className="icon" />
              <div className="text">
                <span className="title">{isMr ? '१६ अनुभव श्रेणी' : '16 Discovery Pathways'}</span>
                <span className="desc">{isMr ? 'पुन्हा श्रेणी पाहा' : 'Browse Experiences'}</span>
              </div>
              <ArrowRight size={16} className="arrow" />
            </button>

            <Link href="/" className="exp-cta-tile">
              <Home size={20} className="icon" />
              <div className="text">
                <span className="title">{isMr ? 'मुख्य पृष्ठ' : 'Explore Pune Home'}</span>
                <span className="desc">{isMr ? 'वेबसाइटच्या सुरुवातीला जा' : 'Return to Home Overview'}</span>
              </div>
              <ArrowRight size={16} className="arrow" />
            </Link>
          </div>

          <div className="exp-cta-footer-note">
            <ShieldCheck size={14} style={{ color: '#10b981' }} />
            <span>
              {isMr
                ? 'एक्सप्लोर पुणे — सत्य, प्रमाणित आणि विश्वासार्ह पर्यटन माहितीचा अधिकृत मंच.'
                : 'Explore Pune — Authentic, Fact-Checked & Curated Tourism Discovery Platform.'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

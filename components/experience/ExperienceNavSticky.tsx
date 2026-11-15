'use client';

import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';

interface ExperienceNavStickyProps {
  isMr: boolean;
  onReplayIntro?: () => void;
}

export default function ExperienceNavSticky({ isMr, onReplayIntro }: ExperienceNavStickyProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  const sections = [
    { id: 'hero', label: isMr ? 'मुख्य' : 'Intro' },
    { id: 'world3d', label: isMr ? '३डी जग' : '3D World' },
    { id: 'pinned-journey', label: isMr ? '४ युगे' : 'Epochs' },
    { id: 'categories', label: isMr ? '१६ श्रेणी' : 'Categories' },
    { id: 'map', label: isMr ? 'नकाशा' : 'Map' },
    { id: 'heritage', label: isMr ? 'वारसा' : 'Heritage' },
    { id: 'forts', label: isMr ? 'किल्ले' : 'Forts' },
    { id: 'food', label: isMr ? 'खाद्य' : 'Culinary' },
    { id: 'curiosities', label: isMr ? 'कौतुक' : 'Curiosities' },
    { id: 'culture', label: isMr ? 'संस्कृती' : 'Culture' },
    { id: 'nature', label: isMr ? 'निसर्ग' : 'Nature' },
    { id: 'gems', label: isMr ? 'अनोखे' : 'Hidden Gems' },
    { id: 'seasons', label: isMr ? 'ऋतू' : 'Seasons' },
    { id: 'finder', label: isMr ? 'फाइंडर' : 'Finder' },
    { id: 'planner', label: isMr ? 'प्लॅनर' : 'Itinerary' },
    { id: 'stories', label: isMr ? 'कथा' : 'Stories' },
    { id: 'community', label: isMr ? 'समुदाय' : 'Community' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Check which section is in view
      const scrollPos = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="exp-nav-sticky" aria-label="Experience Pune sections navigation">
      <div className="exp-nav-track">
        <div className="exp-nav-items-scroll">
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="exp-nav-item exp-nav-replay-intro"
              title={isMr ? 'सिनेमॅटिक प्रस्तावना पुन्हा पाहा' : 'Replay 10s Cinematic Overture'}
              aria-label="Replay Cinematic Overture"
            >
              <Film size={12} style={{ marginRight: 4, display: 'inline' }} />
              <span>{isMr ? 'प्रस्तावना' : 'Overture'}</span>
            </button>
          )}

          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              className={`exp-nav-item ${activeSection === s.id ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      {/* Visual Scroll Progress Bar */}
      <div
        className="exp-nav-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
    </nav>
  );
}

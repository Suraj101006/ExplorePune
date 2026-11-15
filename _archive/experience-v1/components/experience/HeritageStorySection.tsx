'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  PUNE_HERITAGE_TIMELINE,
  PLACES_BY_SLUG,
  ExperiencePlace,
} from '@/lib/experienceData';
import {
  Landmark,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MapPin,
  Tag,
} from 'lucide-react';

interface HeritageStorySectionProps {
  isMr: boolean;
}

const FEATURED_HERITAGE_DESTINATIONS = [
  {
    slug: 'shaniwar-wada',
    title: 'Shaniwar Wada',
    titleMr: 'शनिवार वाडा',
    builtYear: '1732 CE (Peshwa Bajirao I)',
    architecture: 'Maratha-Mughal Fortified Citadel & Teak Palaces',
    story: 'The epicentre of the Maratha Empire from where Peshwa Bajirao I and his successors directed military campaigns spanning Attock to Cuttack. Behind the massive Delhi Gate with its steel elephant spikes lies centuries of royal ambition and dramatic history.',
    significance: 'Historic seat of the Peshwa administration; Centrally Protected Monument under Archaeological Survey of India (ASI).',
    visitingNote: '09:30 AM – 05:30 PM • Sound & Light Show in evenings • Ticket: ₹25 (Indian), ₹300 (Foreigner).',
  },
  {
    slug: 'aga-khan-palace',
    title: 'Aga Khan Palace',
    titleMr: 'आगाखान पॅलेस',
    builtYear: '1892 CE (Sultan Muhammed Shah Aga Khan III)',
    architecture: 'Italianate Arches, French Terraces & Sprawling Lawns',
    story: 'Constructed as an act of famine relief in 1892, this stately palace holds an immortal place in India\'s freedom struggle. Following the 1942 Quit India resolution, Mahatma Gandhi, Kasturba Gandhi, and Mahadev Desai were interned here.',
    significance: 'Houses the sacred samadhis of Kasturba Gandhi and Mahadev Desai, alongside Gandhi memorial archives.',
    visitingNote: '09:00 AM – 05:30 PM • Ticket: ₹25 (Indian), ₹300 (Foreigner) • Nagar Road, Kalyani Nagar.',
  },
  {
    slug: 'lal-mahal',
    title: 'Lal Mahal',
    titleMr: 'लाल महाल',
    builtYear: '1630 CE (Shahaji Raje Bhosale)',
    architecture: 'Traditional Red Brick & Wood Maratha Palatial Reconstruction',
    story: 'Where Chhatrapati Shivaji Maharaj spent his formative childhood alongside his revered mother Rajmata Jijau. Here Shivaji Maharaj masterminded the daring midnight raid in 1663 that cut off the fingers of Mughal general Shaista Khan.',
    significance: 'Hallowed cradle of the Maratha Swarajya, housing historic murals depicting Shivaji\'s childhood exploits.',
    visitingNote: '09:00 AM – 01:00 PM, 04:00 PM – 08:00 PM • Nominal Entry: ₹5 • Kasba Peth (Next to Shaniwar Wada).',
  },
  {
    slug: 'vishrambaug-wada',
    title: 'Vishrambaug Wada',
    titleMr: 'विश्रामबाग वाडा',
    builtYear: '1807 CE (Peshwa Bajirao II)',
    architecture: 'Peshwa Baroque Teak Architecture & Cypress Columns',
    story: 'Built at a lavish expenditure of ₹2 lakh by Peshwa Bajirao II, Vishrambaug Wada features an extraordinary timber facade, carved peacock cornices, and an ornate Meghadambari balcony.',
    significance: 'Preserved by the PMC Heritage Cell, hosting the famous "Punavadi to Punyanagari" historical exhibition.',
    visitingNote: '10:00 AM – 05:00 PM • Entry: ₹5 • Bajirao Road, Sadashiv Peth.',
  },
  {
    slug: 'raja-dinkar-kelkar-museum',
    title: 'Raja Dinkar Kelkar Museum',
    titleMr: 'राजा दिनकर केळकर संग्रहालय',
    builtYear: '1962 (Dr. D.G. Kelkar)',
    architecture: 'Traditional Rajasthani-Maratha Stone Courtyard Museum',
    story: 'The lifelong obsession of Dr. Dinkar G. Kelkar, who traversed remote Indian villages to rescue over 20,000+ priceless artifacts of everyday Indian life, including musical instruments, lock mechanisms, and the restored Mastani Mahal.',
    significance: 'One of the world\'s most remarkable private collections of everyday historical crafts.',
    visitingNote: '10:00 AM – 05:30 PM • Entry: ₹100 (Adult), ₹30 (Child) • Shukrawar Peth.',
  },
  {
    slug: 'pataleshwar-cave-temple',
    title: 'Pataleshwar Cave Temple',
    titleMr: 'पाताळेश्वर लेणी',
    builtYear: '8th Century CE (Rashtrakuta Dynasty)',
    architecture: 'Monolithic Rock-Cut Basalt Cave Temple',
    story: 'Carved out of a single basalt rock bed during the Rashtrakuta era contemporaneously with the Ellora caves, this subterranean cave temple is dedicated to Lord Shiva with a circular monolithic Nandi Mandapa.',
    significance: 'Pune\'s oldest enduring architectural monument, protected by the ASI with ₹0 free entry.',
    visitingNote: '08:30 AM – 05:30 PM • 100% Free Entry (₹0) • Jangli Maharaj Road, Shivajinagar.',
  },
];

export default function HeritageStorySection({ isMr }: HeritageStorySectionProps) {
  const [activeEraIdx, setActiveEraIdx] = useState(0);
  const activeEra = PUNE_HERITAGE_TIMELINE[activeEraIdx];

  return (
    <section id="heritage" className="exp-section exp-heritage-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Landmark size={14} />
            <span>{isMr ? 'विभाग ०४ • ऐतिहासिक वारसा' : 'SECTION 04 • LIVING HERITAGE'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुण्याचा ऐतिहासिक वारसा' : "Explore Pune's Heritage"}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'आठव्या शतकातील राष्ट्रकूट लेण्यांपासून शिवशाही, पेशवेकालीन वैभवी वाडे आणि स्वातंत्र्यलढ्याच्या प्रेरणादायी केंद्रांपर्यंत पुण्याचा इतिहास जिवंत अनुभवा.'
              : 'From 8th-century monolithic basalt caves to Maratha bastions, imperial Peshwa wadas, and freedom-era memorials, trace the living history that shaped Maharashtra.'}
          </p>
        </div>

        {/* Historical Timeline Interactive Switcher */}
        <div className="exp-timeline-card">
          <div className="exp-timeline-tabs">
            {PUNE_HERITAGE_TIMELINE.map((era, idx) => (
              <button
                key={era.era}
                type="button"
                onClick={() => setActiveEraIdx(idx)}
                className={`exp-timeline-tab ${activeEraIdx === idx ? 'active' : ''}`}
              >
                <span className="exp-timeline-century">{era.century}</span>
                <span className="exp-timeline-name">{era.era}</span>
              </button>
            ))}
          </div>

          <div className="exp-timeline-content">
            <div className="exp-timeline-badge">
              <Calendar size={14} />
              <span>{activeEra.century} • {activeEra.era}</span>
            </div>
            <h3 className="exp-timeline-heading">{activeEra.title}</h3>
            <p className="exp-timeline-text">{activeEra.summary}</p>

            <div className="exp-timeline-places">
              <span className="exp-timeline-places-lbl">
                {isMr ? 'संबंधित प्रमुख ऐतिहासिक स्थळे:' : 'Key Historic Landmarks:'}
              </span>
              <div className="exp-timeline-links">
                {activeEra.keyPlaces.map((slug) => {
                  const p = PLACES_BY_SLUG[slug];
                  if (!p) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/places/${slug}`}
                      className="exp-timeline-chip"
                    >
                      <MapPin size={12} />
                      <span>{isMr && p.name_mr ? p.name_mr : p.name}</span>
                      <ArrowRight size={12} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 6 Featured Heritage Deep-Dive Cards */}
        <div className="exp-heritage-grid">
          {FEATURED_HERITAGE_DESTINATIONS.map((dest) => {
            const p = PLACES_BY_SLUG[dest.slug];
            const imgSrc = p ? p.image_url : `/images/places/${dest.slug}.jpg`;

            return (
              <article key={dest.slug} className="exp-heritage-card">
                <div className="exp-heritage-media">
                  <Image
                    src={imgSrc}
                    alt={dest.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="exp-heritage-img"
                  />
                  <div className="exp-heritage-overlay" />
                  <div className="exp-heritage-meta-top">
                    <span className="exp-heritage-year">{dest.builtYear}</span>
                  </div>
                </div>

                <div className="exp-heritage-body">
                  <div className="exp-heritage-arch">
                    <Tag size={12} />
                    <span>{dest.architecture}</span>
                  </div>

                  <h3 className="exp-heritage-title">
                    {isMr ? dest.titleMr : dest.title}
                  </h3>

                  <p className="exp-heritage-story">{dest.story}</p>

                  <div className="exp-heritage-significance">
                    <ShieldCheck size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span>{dest.significance}</span>
                  </div>

                  <div className="exp-heritage-visiting">
                    <Clock size={13} style={{ color: 'var(--exp-gold)', flexShrink: 0 }} />
                    <span>{dest.visitingNote}</span>
                  </div>

                  <div className="exp-heritage-actions">
                    <Link
                      href={`/places/${dest.slug}`}
                      className="exp-btn-primary full-w"
                    >
                      <span>{isMr ? 'वारसा माहिती वाचा' : 'Read Full Heritage Archive'}</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

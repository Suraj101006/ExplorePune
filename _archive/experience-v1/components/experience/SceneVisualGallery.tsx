'use client';

import React from 'react';
import Image from 'next/image';
import { Eye } from 'lucide-react';

export default function SceneVisualGallery() {
  const exhibits = [
    {
      title: 'Monolithic Sahyadri Fortress',
      sub: 'Sinhagad • 1,312m Altitude',
      img: '/images/places/sinhagad-fort.jpg',
      tag: 'Sahyadri Bastion',
    },
    {
      title: 'Imperial Peshwa Seat',
      sub: 'Shaniwar Wada • 1732 AD',
      img: '/images/places/shaniwar-wada.jpg',
      tag: 'Peshwa Architecture',
    },
    {
      title: 'Italianate Arcades & Freedom',
      sub: 'Aga Khan Palace • 1892 AD',
      img: '/images/places/aga-khan-palace.jpg',
      tag: 'National Memorial',
    },
  ];

  return (
    <section id="scene-gallery" className="exp-scene" aria-label="Scene 04: Cinematic Visual Gallery">
      <div className="exp-portal-tag">
        <Eye size={12} />
        <span>Dimension 04 • Cinematic Gallery</span>
      </div>

      <h2
        style={{
          fontSize: 'clamp(2.4rem, 6vw, 5rem)',
          fontWeight: 850,
          textTransform: 'uppercase',
          letterSpacing: '-0.03em',
          textAlign: 'center',
          margin: '0 0 16px',
        }}
      >
        Luminous Heritage Canvases
      </h2>

      <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '650px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
        Atmospheric compositions capturing stone, mist, and antiquity through deep cinematic perspective.
      </p>

      <div className="exp-gallery-wrapper">
        {exhibits.map((item, idx) => (
          <div key={idx} className="exp-gallery-card">
            <Image
              src={item.img}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={idx === 0}
            />
            <div className="exp-gallery-overlay">
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#d4af37',
                  marginBottom: 6,
                }}
              >
                {item.tag}
              </span>
              <strong style={{ fontSize: '20px', color: '#ffffff', lineHeight: 1.2, marginBottom: 4 }}>
                {item.title}
              </strong>
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

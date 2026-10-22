'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface TimelineMilestone {
  year: string;
  yearMr: string;
  era: string;
  eraMr: string;
  title: string;
  titleMr: string;
  desc: string;
  descMr: string;
}

interface HeritageTimelineProps {
  milestones: TimelineMilestone[];
  isMarathi?: boolean;
}

export default function HeritageTimeline({
  milestones,
  isMarathi = false,
}: HeritageTimelineProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxStr = entry.target.getAttribute('data-milestone-index');
            if (idxStr !== null) {
              setActiveIdx(parseInt(idxStr, 10));
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.heritage-timeline-item');
      items.forEach((item) => observer.observe(item));
    }

    return () => observer.disconnect();
  }, [milestones]);

  if (!milestones || milestones.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        paddingLeft: 28,
        margin: '24px 0',
      }}
    >
      {/* Central Progressively Revealed Guideline */}
      <div
        className="heritage-timeline-line"
        style={{
          position: 'absolute',
          left: 9,
          top: 8,
          bottom: 12,
          width: 2.5,
          background: 'linear-gradient(180deg, #047857 0%, #cbd5e1 100%)',
          borderRadius: 2,
        }}
      />

      <div style={{ display: 'grid', gap: 24 }}>
        {milestones.map((m, idx) => {
          const isActive = activeIdx === idx;
          return (
            <div
              key={idx}
              data-milestone-index={idx}
              className="heritage-timeline-item"
              style={{
                position: 'relative',
                transition: 'all 0.3s ease',
                opacity: isActive ? 1 : 0.85,
              }}
            >
              {/* Timeline Node Marker */}
              <div
                className="heritage-timeline-marker"
                style={{
                  position: 'absolute',
                  left: -28,
                  top: 2,
                  width: 19,
                  height: 19,
                  borderRadius: '50%',
                  background: isActive ? '#047857' : '#ffffff',
                  border: isActive ? '3.5px solid #ffffff' : '2.5px solid #94a3b8',
                  boxShadow: isActive ? '0 0 0 3px rgba(4, 120, 87, 0.35)' : 'none',
                  display: 'grid',
                  placeItems: 'center',
                }}
              />

              {/* Milestone Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'monospace, var(--sans)',
                      fontSize: 13,
                      fontWeight: 800,
                      color: isActive ? '#065f46' : 'var(--muted)',
                      background: isActive ? '#ecfdf5' : '#f1f5f9',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: isActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    }}
                  >
                    {isMarathi ? m.yearMr : m.year}
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--clay)', textTransform: 'uppercase' }}>
                    {isMarathi ? m.eraMr : m.era}
                  </span>
                </div>

                <h4 style={{ margin: '6px 0 3px', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                  {isMarathi ? m.titleMr : m.title}
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.55 }}>
                  {isMarathi ? m.descMr : m.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

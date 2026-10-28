'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { DayJourney, deleteJourney } from '@/lib/journeyStorage';
import { ActiveTrip } from '@/lib/activeTrip';
import {
  Compass,
  Calendar,
  MapPin,
  Sparkles,
  Share2,
  Trash2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

interface JourneysListTabProps {
  journeys: DayJourney[];
  activeTrip: ActiveTrip | null;
  onSelectJourney: (journey: DayJourney) => void;
  onCreateReel: (journey: DayJourney) => void;
  onShare: (journey: DayJourney) => void;
  onPlanJourney: () => void;
  onJourneyDeleted: (journeyId: string) => void;
  userId?: string | null;
}

export default function JourneysListTab({
  journeys,
  activeTrip,
  onSelectJourney,
  onCreateReel,
  onShare,
  onPlanJourney,
  onJourneyDeleted,
  userId,
}: JourneysListTabProps) {
  const { isMr } = useLanguage();

  const [statusFilter, setStatusFilter] = useState<'all' | 'planned' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [journeyToDelete, setJourneyToDelete] = useState<string | null>(null);

  const filteredJourneys = useMemo(() => {
    return journeys.filter((j) => {
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'planned' && (j.status === 'planned' || j.status === 'active')) ||
        (statusFilter === 'completed' && j.status === 'completed');

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        j.title.toLowerCase().includes(q) ||
        (j.titleMr && j.titleMr.toLowerCase().includes(q)) ||
        j.places.some((p) => p.placeName.toLowerCase().includes(q) || (p.placeNameMr && p.placeNameMr.includes(q)));

      return matchStatus && matchSearch;
    });
  }, [journeys, statusFilter, searchQuery]);

  const handleDelete = (journeyId: string) => {
    deleteJourney(journeyId, userId);
    setJourneyToDelete(null);
    onJourneyDeleted(journeyId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Active Trip Banner if user has ongoing planner route */}
      {activeTrip && !activeTrip.isCompleted && (
        <div
          style={{
            padding: '18px 22px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            border: '1.5px solid #fed7aa',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#ea580c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Compass size={24} />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' }}>
                {isMr ? 'चालू सहल आराखडा' : 'Active Exploration Route'}
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: '2px 0 0', color: '#7c2d12' }}>
                {isMr && activeTrip.titleMr ? activeTrip.titleMr : activeTrip.titleEn}
              </h3>
              <span style={{ fontSize: 12, color: '#9a3412' }}>
                {activeTrip.stops.length} {isMr ? 'ठिकाणे' : 'Stops'} • ⏱️ {activeTrip.totalDurationMinutes} min
              </span>
            </div>
          </div>

          <Link
            href="/planner"
            style={{
              padding: '9px 18px',
              borderRadius: 10,
              background: '#ea580c',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)',
            }}
          >
            <span>{isMr ? 'सहल सुरू ठेवा' : 'Continue Route'}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: isMr ? 'सर्व सफरी' : 'All' },
            { id: 'planned', label: isMr ? 'नियोजित' : 'Planned' },
            { id: 'completed', label: isMr ? 'पूर्ण झालेल्या' : 'Completed' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id as any)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: statusFilter === f.id ? '#ea580c' : '#cbd5e1',
                background: statusFilter === f.id ? '#ea580c' : '#ffffff',
                color: statusFilter === f.id ? '#ffffff' : '#475569',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: 220, flex: '1 1 240px', maxWidth: 360 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isMr ? 'सफर किंवा ठिकाण शोधा…' : 'Search journeys or stops…'}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 10,
              border: '1.5px solid #cbd5e1',
              fontSize: 13,
              background: '#ffffff',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Journeys Grid */}
      {filteredJourneys.length === 0 ? (
        <div
          style={{
            padding: '52px 24px',
            textAlign: 'center',
            borderRadius: 20,
            background: '#ffffff',
            border: '1.5px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#fff7ed',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Compass size={28} />
          </div>
          <div>
            <h4 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              {isMr ? 'कोणतीही सफर आढळली नाही' : 'No journeys found'}
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', maxWidth: 420 }}>
              {isMr
                ? 'नवीन पुणे सफरीचे नियोजन करा किंवा वरील फिल्टर बदला.'
                : 'Start planning your next Pune exploration by choosing destinations from the database.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onPlanJourney}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              fontSize: 13.5,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            <Plus size={16} />
            <span>{isMr ? 'नवीन सफर तयार करा' : 'Plan a Journey'}</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {filteredJourneys.map((journey) => {
            const visitedCount = journey.places.filter((p) => p.isVisited).length;
            const totalStops = journey.places.length;
            const progress = totalStops > 0 ? Math.round((visitedCount / totalStops) * 100) : 0;
            const cover = journey.coverImage || journey.places[0]?.photos?.[0] || journey.places[0]?.image_url || '/images/places/shaniwar-wada.jpg';

            return (
              <div
                key={journey.id || journey.date}
                style={{
                  borderRadius: 18,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                }}
              >
                {/* Cover & Badges */}
                <div
                  style={{
                    position: 'relative',
                    height: 160,
                    width: '100%',
                    background: '#0f172a',
                    cursor: 'pointer',
                  }}
                  onClick={() => onSelectJourney(journey)}
                >
                  <img
                    src={cover}
                    alt={journey.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)',
                    }}
                  />

                  {/* Top Tags */}
                  <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'rgba(234, 88, 12, 0.9)',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {journey.travelMode ? journey.travelMode.replace('_', ' ') : 'Tour'}
                    </span>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {isMr ? journey.dateLabelMr || journey.date : journey.dateLabelEn || journey.date}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: progress === 100 ? '#16a34a' : 'rgba(0, 0, 0, 0.65)',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {progress === 100 ? (isMr ? 'पूर्ण ✓' : 'Done ✓') : `${progress}%`}
                  </div>

                  {/* Bottom title on image */}
                  <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: '#ffffff',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {isMr && journey.titleMr ? journey.titleMr : journey.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Stops preview pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {journey.places.slice(0, 3).map((p, pIdx) => (
                      <span
                        key={pIdx}
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: '#f1f5f9',
                          color: '#475569',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <MapPin size={10} color="#ea580c" />
                        <span>{isMr && p.placeNameMr ? p.placeNameMr : p.placeName}</span>
                      </span>
                    ))}
                    {journey.places.length > 3 && (
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, padding: '3px 4px' }}>
                        +{journey.places.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Distance & duration info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                    <span>📍 {totalStops} {isMr ? 'ठिकाणे' : 'Stops'}</span>
                    <span>🛣️ ~{journey.totalDistanceKm || 12} km</span>
                    <span>⏱️ ~{journey.totalDurationMinutes || 120} min</span>
                  </div>

                  {/* Card Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectJourney(journey)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {isMr ? 'टाइमलाइन पहा' : 'View Timeline'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => onCreateReel(journey)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 8,
                          background: '#fff7ed',
                          border: '1px solid #fed7aa',
                          color: '#c2410c',
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          cursor: 'pointer',
                        }}
                        title="Create Reel for this Journey"
                      >
                        <Sparkles size={13} />
                        <span>{isMr ? 'रील' : 'Reel'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onShare(journey)}
                        style={{
                          padding: '6px 8px',
                          borderRadius: 8,
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: '#475569',
                          cursor: 'pointer',
                        }}
                        title="Share Journey"
                      >
                        <Share2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(journey.id)}
                        style={{
                          padding: '6px 8px',
                          borderRadius: 8,
                          background: '#fee2e2',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                        }}
                        title="Delete Journey"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

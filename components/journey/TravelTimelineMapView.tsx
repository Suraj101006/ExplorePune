'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import {
  Route,
  Map,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { DestinationVisitRecord } from '@/lib/memoryAlbumStorage';
import { StructuredPlace } from '@/lib/chatKnowledgeEngine';
import PlaceMapWrapper from '@/components/PlaceMapWrapper';

interface TravelTimelineMapViewProps {
  allVisits: DestinationVisitRecord[];
  allPlaces: StructuredPlace[];
  isMr: boolean;
  onSelectPlaceDetails: (place: StructuredPlace) => void;
}

export default function TravelTimelineMapView({
  allVisits,
  allPlaces,
  isMr,
  onSelectPlaceDetails,
}: TravelTimelineMapViewProps) {
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');
  const [selectedMapPlace, setSelectedMapPlace] = useState<StructuredPlace>(allPlaces[0]);

  // Sort visits chronologically descending
  const sortedVisits = [...allVisits].sort((a, b) =>
    (b.visitDate || b.visitedDate || '').localeCompare(a.visitDate || a.visitedDate || '')
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* View Switcher Header */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#fdf2f8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Route size={22} color="#db2777" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#0f172a' }}>
              {isMr ? 'प्रवास टाईमलाईन व नकाशा' : 'Travel Timeline & Exploration Map'}
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {isMr
                ? 'तुमच्या सर्व पुणे भेटींचा कालक्रमानुसार मार्ग आणि संवादी नकाशा'
                : 'Chronological exploration trail and precision interactive map.'}
            </span>
          </div>
        </div>

        {/* Toggle between Timeline & Map */}
        <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 4, borderRadius: 12 }}>
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: viewMode === 'timeline' ? 700 : 500,
              border: 'none',
              background: viewMode === 'timeline' ? '#ffffff' : 'transparent',
              color: viewMode === 'timeline' ? '#db2777' : '#64748b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Calendar size={14} />
            <span>{isMr ? 'टाईमलाईन' : 'Timeline Trail'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('map')}
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: viewMode === 'map' ? 700 : 500,
              border: 'none',
              background: viewMode === 'map' ? '#ffffff' : 'transparent',
              color: viewMode === 'map' ? '#db2777' : '#64748b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Map size={14} />
            <span>{isMr ? 'नकाशा' : 'Map View'}</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Timeline View */}
      {viewMode === 'timeline' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #e2e8f0',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {sortedVisits.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: 13.5 }}>
              {isMr
                ? 'अजून कोणत्याही भेटी नोंदवलेल्या नाहीत. "माझी ठिकाणे" वरून पहिली भेट नोंदवा!'
                : 'No visit milestones recorded yet. Browse "My Places" to log your first checkpoint!'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
              {/* Vertical connector line */}
              <div
                style={{
                  position: 'absolute',
                  left: 19,
                  top: 10,
                  bottom: 10,
                  width: 2,
                  backgroundColor: '#fce7f3',
                }}
              />

              {sortedVisits.map((visit) => {
                const place = allPlaces.find((p) => p.id === visit.placeId || p.slug === visit.placeId);
                return (
                  <div
                    key={visit.id}
                    style={{
                      display: 'flex',
                      gap: 16,
                      alignItems: 'flex-start',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    {/* Pin dot */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#db2777',
                        border: '3px solid #ffffff',
                        boxShadow: '0 2px 8px rgba(219, 39, 119, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={18} />
                    </div>

                    {/* Milestone Card */}
                    <div
                      style={{
                        flex: 1,
                        padding: '16px 20px',
                        borderRadius: 16,
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, color: '#db2777', fontWeight: 800 }}>
                            {visit.visitedDate}
                          </span>
                          {visit.rating && (
                            <span style={{ fontSize: 12, color: '#f59e0b' }}>
                              {'★'.repeat(visit.rating)}
                            </span>
                          )}
                        </div>
                        <h4 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                          {visit.placeName}
                        </h4>
                        {visit.notes && (
                          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569' }}>
                            {visit.notes}
                          </p>
                        )}
                      </div>

                      {place && (
                        <button
                          type="button"
                          onClick={() => onSelectPlaceDetails(place)}
                          style={{
                            padding: '7px 14px',
                            borderRadius: 10,
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#0f172a',
                            fontSize: 12.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span>{isMr ? 'आठवणी पहा' : 'View Memories'}</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Map View */}
      {viewMode === 'map' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #e2e8f0',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                {isMr ? 'पुणे प्रवास नकाशा' : 'Precision Interactive Pune Map'}
              </h3>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                {isMr ? 'ठिकाण निवडून त्याचे नकाशा स्थान पहा' : 'Select a destination to pin and explore on the map'}
              </span>
            </div>

            <select
              value={selectedMapPlace.id}
              onChange={(e) => {
                const found = allPlaces.find((p) => p.id === e.target.value);
                if (found) setSelectedMapPlace(found);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
              }}
            >
              {allPlaces.map((p) => (
                <option key={p.id} value={p.id}>
                  {isMr && p.name_mr ? p.name_mr : p.name}
                </option>
              ))}
            </select>
          </div>

          <PlaceMapWrapper
            latitude={selectedMapPlace.latitude || 18.5204}
            longitude={selectedMapPlace.longitude || 73.8567}
            name={selectedMapPlace.name}
          />
        </div>
      )}
    </div>
  );
}

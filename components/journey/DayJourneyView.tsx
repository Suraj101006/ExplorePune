'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sun,
  MapPin,
  Clock,
  Film,
  Camera,
  Sparkles,
  ArrowRight,
  Plus,
  Bus,
  Train,
  Footprints,
  Car,
} from 'lucide-react';
import { DayJourney } from '@/lib/journeyStorage';
import { MemoryMediaItem } from '@/lib/memoryAlbumStorage';
import { StructuredPlace } from '@/lib/chatKnowledgeEngine';

interface DayJourneyViewProps {
  journeys: DayJourney[];
  allMemories: MemoryMediaItem[];
  allPlaces: StructuredPlace[];
  isMr: boolean;
  onOpenCreateReelForJourney: (journey: DayJourney) => void;
  onPlanNewJourney: () => void;
}

export default function DayJourneyView({
  journeys,
  allMemories,
  allPlaces,
  isMr,
  onOpenCreateReelForJourney,
  onPlanNewJourney,
}: DayJourneyViewProps) {
  // Available dates from journeys
  const availableDates = useMemo(() => {
    const dates = journeys.map((j) => j.date).filter(Boolean);
    return Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));
  }, [journeys]);

  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates[0] || new Date().toISOString().slice(0, 10)
  );

  // Selected Day Journey object
  const currentJourney = useMemo(() => {
    return journeys.find((j) => j.date === selectedDate) || journeys[0] || null;
  }, [journeys, selectedDate]);

  // Photos taken on this selected date
  const dayMemories = useMemo(() => {
    return allMemories.filter((m) => m.capturedDate?.startsWith(selectedDate));
  }, [allMemories, selectedDate]);

  // AI evocative day story generator
  const generatedDayStory = useMemo(() => {
    if (!currentJourney || currentJourney.places.length === 0) {
      return isMr
        ? 'या दिवशी अद्याप कोणताही प्रवास नोंदवलेला नाही. नवीन योजना तयार करा!'
        : 'No journey recorded for this day yet. Plan your adventure across Pune!';
    }

    const placeNames = currentJourney.places.map((p) => (isMr && p.placeNameMr ? p.placeNameMr : p.placeName));
    const stopsText = placeNames.join(', ');

    if (isMr) {
      return `पुण्यातील एका संस्मरणीय दिवसाचा प्रवास! ${currentJourney.places[0]?.placeNameMr || 'सुरुवात'} पासून सुरू झालेली ही सफर ऐतिहासिक आणि सांस्कृतिक सौंदर्याने नटलेली राहिली. दिवसभरात ${stopsText} या प्रमुख ठिकाणांना भेटी दिल्या. शनिवार वाड्याच्या पराक्रमाची साक्ष, दगडूशेठच्या दर्शनातील शांतता आणि तुळशीबागेची लगबग यामुळे आजचा प्रवास अविस्मरणीय ठरला.`;
    }

    return `An evocative Pune adventure unfolded on ${selectedDate}. Starting from ${currentJourney.places[0]?.placeName || 'Pune'}, the route carried through ${stopsText}. From heritage fortresses standing tall against the horizon to soulful temple bells and vibrant street trails, every moment captured the timeless pulse of Maharashtra’s cultural capital.`;
  }, [currentJourney, selectedDate, isMr]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Top Banner and Date Picker */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#fff7ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sun size={24} color="#ea580c" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#0f172a' }}>
                {isMr ? 'माझा आजचा दिवस (MY DAY IN PUNE)' : 'My Day in Pune (Single Day Journey)'}
              </h2>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                {isMr ? 'दैनिक प्रवास क्रम, वेळ व छायाचित्रे' : 'Daily timeline, transit distance, and captured memories.'}
              </span>
            </div>
          </div>

          {/* Date Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} color="#64748b" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b',
                background: '#ffffff',
                outline: 'none',
              }}
            >
              {availableDates.length > 0 ? (
                availableDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))
              ) : (
                <option value={selectedDate}>{selectedDate} (Today)</option>
              )}
            </select>

            <button
              type="button"
              onClick={onPlanNewJourney}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <Plus size={14} />
              <span>{isMr ? 'नवीन दिवस आखा' : 'Plan Day'}</span>
            </button>
          </div>
        </div>

        {/* Day Metric Highlights */}
        {currentJourney && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 12,
              paddingTop: 14,
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {isMr ? 'थांबे (Stops)' : 'Total Stops'}
              </span>
              <strong style={{ display: 'block', fontSize: 18, color: '#0f172a', marginTop: 2 }}>
                {currentJourney.places.length}
              </strong>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {isMr ? 'अंदाजे अंतर' : 'Est. Distance'}
              </span>
              <strong style={{ display: 'block', fontSize: 18, color: '#2563eb', marginTop: 2 }}>
                ~{Math.max(12, currentJourney.places.length * 6.5).toFixed(1)} km
              </strong>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {isMr ? 'वाहतूक प्रकार' : 'Transit Modes'}
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                <span title="Pune Metro"><Train size={15} color="#ea580c" /></span>
                <span title="PMPML Bus"><Bus size={15} color="#10b981" /></span>
                <span title="Walking Heritage"><Footprints size={15} color="#6366f1" /></span>
              </div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {isMr ? 'आजचे फोटो' : 'Day Photos'}
              </span>
              <strong style={{ display: 'block', fontSize: 18, color: '#ea580c', marginTop: 2 }}>
                {dayMemories.length}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* AI Evocative Day Story Recap */}
      <div
        style={{
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: 18,
          border: '1px solid #e9d5ff',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color="#7c3aed" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#581c87' }}>
            {isMr ? 'पुणे प्रवास कथा (AI Day Story Recap)' : 'AI Evocative Day Story Recap'}
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#4c1d95', lineHeight: 1.65 }}>
          {generatedDayStory}
        </p>

        {currentJourney && (
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => onOpenCreateReelForJourney(currentJourney)}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                background: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
              }}
            >
              <Film size={14} />
              <span>{isMr ? 'या दिवसाचा रील बनवा' : 'Generate Day Reel'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Chronological Stops Timeline */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
          {isMr ? 'दिवसभराचा प्रवास क्रम' : 'Chronological Journey Stops'}
        </h3>

        {currentJourney && currentJourney.places.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {currentJourney.places.map((place, idx) => (
              <div
                key={place.placeId + idx}
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  position: 'relative',
                }}
              >
                {/* Step badge */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    background: '#ea580c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                    flexShrink: 0,
                    zIndex: 2,
                  }}
                >
                  {idx + 1}
                </div>

                {/* Stop Card */}
                <div
                  style={{
                    flex: 1,
                    padding: '16px 18px',
                    borderRadius: 14,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      {isMr && place.placeNameMr ? place.placeNameMr : place.placeName}
                    </h4>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      {place.arrivalTime || `Stop #${idx + 1}`}
                    </span>
                  </div>

                  {place.note && (
                    <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
                      {place.note}
                    </p>
                  )}

                  {place.photos && place.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 6, overflowX: 'auto' }}>
                      {place.photos.map((pUrl, pIdx) => (
                        <img
                          key={pIdx}
                          src={pUrl}
                          alt="Stop photo"
                          style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
            {isMr ? 'या दिवसासाठी कोणतेही थांबे जोडलेले नाहीत.' : 'No stops found for this date.'}
          </div>
        )}
      </div>
    </div>
  );
}

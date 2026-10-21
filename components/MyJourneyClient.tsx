'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import JourneyMapAnimation from '@/components/JourneyMapAnimation';
import {
  DayJourney,
  getAllJourneys,
  getTodayJourney,
  toggleJourneyStopVisited,
  computeOverallStats,
  computeJourneyMilestones,
} from '@/lib/journeyStorage';

export default function MyJourneyClient() {
  const { isMr } = useLanguage();
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'overall'>('today');
  const [historyViewMode, setHistoryViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [journeys, setJourneys] = useState<DayJourney[]>(() => getAllJourneys());
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<string>('2026-10'); // YYYY-MM
  const [checkinToast, setCheckinToast] = useState<string>('');

  // Load and subscribe to journeys from storage + parse URL params
  useEffect(() => {
    const sync = () => {
      setJourneys(getAllJourneys());
    };
    sync();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const dateParam = params.get('date');
      const tabParam = params.get('tab');
      if (tabParam === 'today' || tabParam === 'history' || tabParam === 'overall') {
        setActiveTab(tabParam);
      }
      if (dateParam) {
        setSelectedJourneyId(dateParam);
        setActiveTab('history');
      }
    }

    window.addEventListener('explore-pune-journeys-changed', sync);
    return () => window.removeEventListener('explore-pune-journeys-changed', sync);
  }, []);

  const todayJourney = useMemo(() => getTodayJourney(), []);
  const overallStats = useMemo(() => computeOverallStats(journeys), [journeys]);
  const milestones = useMemo(() => computeJourneyMilestones(overallStats), [overallStats]);

  // Selected individual journey for detail view
  const activeDetailJourney = useMemo(() => {
    if (!selectedJourneyId) return null;
    return journeys.find((j) => j.id === selectedJourneyId || j.date === selectedJourneyId) || null;
  }, [selectedJourneyId, journeys]);

  // Filtered journeys for History Tab
  const filteredJourneys = useMemo(() => {
    return journeys.filter((j) => {
      // Category filter
      if (filterCategory !== 'all') {
        if (filterCategory === '2026' && !j.date.startsWith('2026')) return false;
        if (filterCategory === '2025' && !j.date.startsWith('2025')) return false;
        if (['heritage', 'forts', 'nature', 'temples', 'food'].includes(filterCategory)) {
          const hasCat = j.places.some((p) => p.category === filterCategory);
          if (!hasCat) return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = j.title.toLowerCase().includes(q) || (j.titleMr && j.titleMr.toLowerCase().includes(q));
        const matchesDate = j.date.includes(q) || j.dateLabelEn.toLowerCase().includes(q);
        const matchesPlace = j.places.some(
          (p) =>
            p.placeName.toLowerCase().includes(q) ||
            (p.placeNameMr && p.placeNameMr.toLowerCase().includes(q)) ||
            (p.note && p.note.toLowerCase().includes(q))
        );
        return matchesTitle || matchesDate || matchesPlace;
      }
      return true;
    });
  }, [journeys, filterCategory, searchQuery]);

  // Handle Mark as Visited for Today's Journey
  const handleToggleVisited = (placeId: string, currentStatus: boolean) => {
    if (!todayJourney) return;
    const updated = toggleJourneyStopVisited(todayJourney.id, placeId, !currentStatus);
    if (updated) {
      setJourneys(getAllJourneys());
      const p = updated.places.find((item) => item.placeId === placeId);
      if (!currentStatus) {
        setCheckinToast(
          isMr
            ? `🎉 अभिनंदन! "${p?.placeNameMr || p?.placeName}" येथे भेट नोंदवली!`
            : `🎉 Great! "${p?.placeName}" marked as visited!`
        );
        setTimeout(() => setCheckinToast(''), 4000);
      }
    }
  };

  // Calendar matrix computation for selected month
  const calendarDays = useMemo(() => {
    const [yearStr, monthStr] = selectedCalendarMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // 0-indexed

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNumber: number | null; dateString: string; journey: DayJourney | null }> = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateString: '', journey: null });
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const foundJ = journeys.find((j) => j.date === dateStr) || null;
      days.push({ dayNumber: d, dateString: dateStr, journey: foundJ });
    }
    return days;
  }, [selectedCalendarMonth, journeys]);

  return (
    <main className="wrap" style={{ paddingTop: 36, paddingBottom: 80 }}>
      {/* Hero Header: Cinematic Identity */}
      <section style={{ maxWidth: 840, marginBottom: 32 }}>
        <div className="hero-pill" style={{ marginBottom: 12 }}>
          <span>🧭</span> {isMr ? 'माझी पुणे यात्रा' : 'My Pune Journey'}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 46px)', margin: '0 0 10px', fontWeight: 800, color: 'var(--ink)' }}>
          {isMr ? 'प्रत्येक ठिकाण बनते तुमच्या ' : 'Every place becomes a part of your '}
          <span className="gradient">{isMr ? 'पुणे प्रवासाची कथा' : 'Pune Story'}</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16.5, lineHeight: 1.6, margin: 0 }}>
          {isMr
            ? 'पुण्यातील तुमच्या आजच्या सहलीपासून ते ऐतिहासिक वाटांपर्यंतचा संपूर्ण डिजिटल प्रवास नकाशा, आठवणी आणि यशोगाथा.'
            : 'Trace your personal exploration of Pune — from today’s active steps to your complete history across historic wadas, Sahyadri forts, and cultural trails.'}
        </p>
      </section>

      {/* 3 Primary Navigation Level Tabs */}
      <nav
        aria-label="Journey Levels"
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 32,
          padding: 6,
          background: 'rgba(0, 0, 0, 0.035)',
          borderRadius: 999,
          border: '1px solid var(--line)',
          maxWidth: 680,
        }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('today');
            setSelectedJourneyId(null);
          }}
          style={{
            flex: 1,
            minWidth: 140,
            padding: '10px 18px',
            borderRadius: 999,
            border: activeTab === 'today' ? '1.5px solid var(--primary-border)' : 'none',
            background: activeTab === 'today' ? '#ffffff' : 'transparent',
            color: activeTab === 'today' ? 'var(--primary)' : 'var(--ink-secondary)',
            fontWeight: activeTab === 'today' ? 800 : 600,
            fontSize: 13.5,
            cursor: 'pointer',
            boxShadow: activeTab === 'today' ? '0 2px 8px rgba(6, 95, 70, 0.12)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.18s ease',
          }}
        >
          <span>🧭</span>
          <span>{isMr ? 'आजची सफर' : "TODAY'S JOURNEY"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('history');
            setSelectedJourneyId(null);
          }}
          style={{
            flex: 1,
            minWidth: 150,
            padding: '10px 18px',
            borderRadius: 999,
            border: activeTab === 'history' ? '1.5px solid var(--primary-border)' : 'none',
            background: activeTab === 'history' ? '#ffffff' : 'transparent',
            color: activeTab === 'history' ? 'var(--primary)' : 'var(--ink-secondary)',
            fontWeight: activeTab === 'history' ? 800 : 600,
            fontSize: 13.5,
            cursor: 'pointer',
            boxShadow: activeTab === 'history' ? '0 2px 8px rgba(6, 95, 70, 0.12)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.18s ease',
          }}
        >
          <span>📅</span>
          <span>{isMr ? 'सफरींचा इतिहास' : 'JOURNEY HISTORY'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('overall');
            setSelectedJourneyId(null);
          }}
          style={{
            flex: 1,
            minWidth: 150,
            padding: '10px 18px',
            borderRadius: 999,
            border: activeTab === 'overall' ? '1.5px solid var(--primary-border)' : 'none',
            background: activeTab === 'overall' ? '#ffffff' : 'transparent',
            color: activeTab === 'overall' ? 'var(--primary)' : 'var(--ink-secondary)',
            fontWeight: activeTab === 'overall' ? 800 : 600,
            fontSize: 13.5,
            cursor: 'pointer',
            boxShadow: activeTab === 'overall' ? '0 2px 8px rgba(6, 95, 70, 0.12)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.18s ease',
          }}
        >
          <span>🗺️</span>
          <span>{isMr ? 'संपूर्ण प्रवास' : 'OVERALL JOURNEY'}</span>
        </button>
      </nav>

      {/* Checkin Toast */}
      {checkinToast && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1.5px solid #10b981',
            borderRadius: 'var(--radius)',
            padding: '12px 20px',
            marginBottom: 24,
            color: '#065f46',
            fontWeight: 700,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>🎯</span>
          <span>{checkinToast}</span>
        </div>
      )}

      {/* ===================================================================
          LEVEL 1 — TODAY'S JOURNEY
          =================================================================== */}
      {activeTab === 'today' && (
        <section>
          {todayJourney ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'start' }}>
              {/* Left Column: Interactive Animated Map */}
              <div>
                <JourneyMapAnimation
                  journey={todayJourney}
                  isMr={isMr}
                />

                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    background: '#f8fafc',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                      {isMr ? 'सुरुवातीचे स्थान' : 'Starting Point'}
                    </span>
                    <strong style={{ display: 'block', fontSize: 14, color: 'var(--ink)' }}>
                      🚩 {todayJourney.startLocation}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                      {isMr ? 'अंदाजे वेळ' : 'Est. Duration'}
                    </span>
                    <strong style={{ display: 'block', fontSize: 14, color: 'var(--clay)' }}>
                      ⏱️ {todayJourney.totalDurationMinutes} {isMr ? 'मि.' : 'min'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                      {isMr ? 'एकूण अंतर' : 'Total Distance'}
                    </span>
                    <strong style={{ display: 'block', fontSize: 14, color: '#047857' }}>
                      📏 {todayJourney.totalDistanceKm} km
                    </strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Today's Journey Details & Stepper */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--primary-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 24,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      TODAY • {todayJourney.dateLabelEn}
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 2px', color: 'var(--ink)' }}>
                      {isMr ? todayJourney.titleMr || todayJourney.title : todayJourney.title}
                    </h2>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
                      {todayJourney.theme}
                    </p>
                  </div>

                  <span
                    style={{
                      background: todayJourney.status === 'completed' ? '#dcfce7' : '#fef3c7',
                      color: todayJourney.status === 'completed' ? '#15803d' : '#b45309',
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                    }}
                  >
                    {todayJourney.status === 'completed'
                      ? isMr ? '✓ पूर्ण झाली' : 'Completed'
                      : isMr ? '🟢 चालू सफर' : 'In Progress'}
                  </span>
                </div>

                {/* Progress Strip */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                    <span>{isMr ? 'प्रगती (ठिकाणे)' : 'Journey Progress'}</span>
                    <span style={{ color: 'var(--primary)' }}>
                      {todayJourney.places.filter((p) => p.isVisited).length} / {todayJourney.places.length}{' '}
                      {isMr ? 'ठिकाणे पूर्ण' : 'places completed'}
                    </span>
                  </div>
                  <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.round(
                          (todayJourney.places.filter((p) => p.isVisited).length / todayJourney.places.length) * 100
                        )}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        borderRadius: 999,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Vertical Stepper Timeline */}
                <div style={{ position: 'relative', paddingLeft: 24, marginBottom: 24 }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 7,
                      top: 12,
                      bottom: 12,
                      width: 2,
                      background: '#e2e8f0',
                    }}
                  />

                  {/* Start Point */}
                  <div style={{ position: 'relative', marginBottom: 20 }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: -24,
                        top: 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#047857',
                        border: '3px solid #ffffff',
                        boxShadow: '0 0 0 1px #047857',
                      }}
                    />
                    <strong style={{ fontSize: 13, color: 'var(--ink)' }}>
                      🚩 {todayJourney.startLocation} ({todayJourney.startTime})
                    </strong>
                  </div>

                  {/* Destinations List with Visit Checkboxes */}
                  {todayJourney.places.map((p, idx) => (
                    <div
                      key={p.placeId || idx}
                      style={{
                        position: 'relative',
                        marginBottom: idx === todayJourney.places.length - 1 ? 0 : 20,
                        background: p.isVisited ? '#f0fdf4' : '#ffffff',
                        border: p.isVisited ? '1px solid #bbf7d0' : '1px solid var(--line)',
                        borderRadius: 'var(--radius)',
                        padding: 14,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Step Indicator Dot */}
                      <div
                        style={{
                          position: 'absolute',
                          left: -24,
                          top: 16,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: p.isVisited ? '#10b981' : '#cbd5e1',
                          border: '3px solid #ffffff',
                          boxShadow: p.isVisited ? '0 0 0 1px #10b981' : 'none',
                          color: '#fff',
                          fontSize: 9,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                        }}
                      >
                        {p.isVisited ? '✓' : ''}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--clay)', textTransform: 'uppercase' }}>
                              {idx + 1}. {p.categoryName || p.category}
                            </span>
                            {p.arrivalTime && (
                              <span style={{ fontSize: 11, color: 'var(--muted)' }}>⏰ {p.arrivalTime}</span>
                            )}
                          </div>
                          <h4 style={{ fontSize: 15.5, fontWeight: 800, margin: '4px 0 2px', color: 'var(--ink)' }}>
                            {isMr && p.placeNameMr ? p.placeNameMr : p.placeName}
                          </h4>
                          {p.note && (
                            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
                              &ldquo;{p.note}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Interactive Checkbox Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisited(p.placeId, p.isVisited)}
                          style={{
                            flexShrink: 0,
                            padding: '6px 12px',
                            borderRadius: 999,
                            border: p.isVisited ? '1px solid #10b981' : '1px solid var(--line)',
                            background: p.isVisited ? '#ecfdf5' : '#ffffff',
                            color: p.isVisited ? '#065f46' : 'var(--ink-secondary)',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {p.isVisited ? (
                            <>
                              <span>✓</span>
                              <span>{isMr ? 'झाली' : 'Visited'}</span>
                            </>
                          ) : (
                            <>
                              <span>○</span>
                              <span>{isMr ? 'भेट नोंदवा' : 'Check In'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center', fontSize: 12 }}>
                        <Link
                          href={`/places/${p.placeSlug}`}
                          style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}
                        >
                          {isMr ? 'ठिकाण पहा →' : 'View Place →'}
                        </Link>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}&travelmode=transit`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--muted)', textDecoration: 'none' }}
                        >
                          🗺️ {isMr ? 'नकाशा उघडा' : 'Directions'}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                  <Link
                    href="/planner"
                    className="btn"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      padding: '11px 20px',
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: 999,
                      textDecoration: 'none',
                    }}
                  >
                    🚀 {isMr ? 'थेट सहल मार्गदर्शक उघडा' : 'Open Guided Tour'}
                  </Link>
                  <Link
                    href="/milestones"
                    className="btn outline"
                    style={{ padding: '11px 18px', fontSize: 13, textDecoration: 'none' }}
                  >
                    🏆 {isMr ? 'यशोगाथा पदके' : 'Milestones'}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Attractive Empty State */
            <div
              style={{
                textAlign: 'center',
                padding: '64px 24px',
                background: 'linear-gradient(145deg, #ffffff 0%, #fffbf5 100%)',
                border: '1.5px dashed #fbd38d',
                borderRadius: 'var(--radius-xl)',
                maxWidth: 620,
                margin: '0 auto',
              }}
            >
              <span style={{ fontSize: 56, display: 'block', marginBottom: 14 }}>🧭</span>
              <h3 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: 'var(--ink)' }}>
                {isMr ? 'आजच्या पुणे प्रवासाची गोष्ट अजून सुरू व्हायची आहे.' : "Your Pune story for today hasn't started yet."}
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--muted)', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.5 }}>
                {isMr
                  ? 'सहल नियोजक वापरा आणि शनिवार वाडा, सिंहगड किंवा पेशवेकालीन वास्तूंचा समावेश करून आजचा सुंदर प्रवास आराखडा तयार करा.'
                  : 'Launch our custom trip planner to generate an optimal itinerary across historic forts, wadas, and serene lakes for today.'}
              </p>
              <Link
                href="/planner"
                className="btn"
                style={{
                  padding: '12px 28px',
                  fontSize: 14.5,
                  fontWeight: 800,
                  borderRadius: 999,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>✨</span>
                <span>{isMr ? 'आजची सफर तयार करा' : "Create Today's Journey"}</span>
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ===================================================================
          LEVEL 2 — DATE-WISE JOURNEY HISTORY
          =================================================================== */}
      {activeTab === 'history' && (
        <section>
          {/* Detail View for an Individual Selected Date (e.g. 14 June) */}
          {activeDetailJourney ? (
            <div style={{ animation: 'fadeIn 0.25s ease' }}>
              <div style={{ marginBottom: 20 }}>
                <button
                  type="button"
                  onClick={() => setSelectedJourneyId(null)}
                  className="chip"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginBottom: 12,
                  }}
                >
                  ← {isMr ? 'सर्व सफरींच्या इतिहासाकडे परत जा' : 'Back to Journey History'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {activeDetailJourney.dateLabelEn} • YOUR PUNE JOURNEY
                    </span>
                    <h2 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 2px', color: 'var(--ink)' }}>
                      {isMr ? activeDetailJourney.titleMr || activeDetailJourney.title : activeDetailJourney.title}
                    </h2>
                    <p style={{ margin: 0, fontSize: 13.5, color: 'var(--muted)' }}>
                      {activeDetailJourney.theme} • {activeDetailJourney.totalDistanceKm} km • {activeDetailJourney.places.length} {isMr ? 'ठिकाणे' : 'Destinations'}
                    </p>
                  </div>

                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      padding: '4px 12px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    ✓ {isMr ? 'सहल पूर्ण झाली' : 'Completed Journey'}
                  </span>
                </div>
              </div>

              {/* Animated Map for This Specific Date */}
              <div style={{ marginBottom: 32 }}>
                <JourneyMapAnimation
                  journey={activeDetailJourney}
                  isMr={isMr}
                />
              </div>

              {/* Grid of Visited Place Cards & Timeline */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {activeDetailJourney.places.map((p, idx) => (
                  <article
                    key={p.placeId || idx}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <div style={{ height: 180, position: 'relative', background: '#cbd5e1' }}>
                      <img
                        src={p.image_url || '/images/places/shaniwar-wada.jpg'}
                        alt={p.placeName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: 'rgba(0, 0, 0, 0.72)',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        Stop {idx + 1}
                      </div>
                    </div>

                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--clay)', textTransform: 'uppercase' }}>
                        {p.categoryName || p.category}
                      </span>
                      <h3 style={{ fontSize: 16, fontWeight: 800, margin: '4px 0 2px', color: 'var(--ink)' }}>
                        {isMr && p.placeNameMr ? p.placeNameMr : p.placeName}
                      </h3>
                      {p.arrivalTime && (
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                          ⏰ Visited · {activeDetailJourney.dateLabelEn} at {p.arrivalTime}
                        </div>
                      )}
                      <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 12px', lineHeight: 1.45, flex: 1 }}>
                        {p.description}
                      </p>

                      {p.note && (
                        <div
                          style={{
                            background: '#fffbeb',
                            border: '1px solid #fde68a',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 10px',
                            fontSize: 11.5,
                            color: '#92400e',
                            marginBottom: 12,
                            fontStyle: 'italic',
                          }}
                        >
                          &ldquo;{p.note}&rdquo;
                        </div>
                      )}

                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link
                          href={`/places/${p.placeSlug}`}
                          className="btn outline"
                          style={{ padding: '6px 14px', fontSize: 12 }}
                        >
                          {isMr ? 'ठिकाण पहा →' : 'View Place →'}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            /* History Explorer (Timeline & Calendar Mode) */
            <div>
              {/* Search, Filter & View Switcher Toolbar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {/* Search Bar */}
                <div style={{ position: 'relative', minWidth: 260, flex: 1 }}>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isMr
                        ? 'सफर किंवा ठिकाण शोधा (उदा. सिंहगड, शनिवार वाडा, १४ जून)...'
                        : 'Search journeys by date, place, or note (e.g. Sinhagad, 14 June)...'
                    }
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: 999,
                      border: '1px solid var(--line)',
                      fontSize: 13.5,
                    }}
                  />
                  <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 14, color: 'var(--muted)' }}>
                    🔍
                  </span>
                </div>

                {/* View Switcher: [ Timeline ] [ Calendar ] */}
                <div
                  style={{
                    display: 'flex',
                    background: '#f1f5f9',
                    borderRadius: 999,
                    padding: 3,
                    border: '1px solid var(--line)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setHistoryViewMode('timeline')}
                    style={{
                      border: 'none',
                      background: historyViewMode === 'timeline' ? '#ffffff' : 'transparent',
                      color: historyViewMode === 'timeline' ? 'var(--ink)' : 'var(--muted)',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: 999,
                      fontSize: 12.5,
                      cursor: 'pointer',
                      boxShadow: historyViewMode === 'timeline' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    📜 {isMr ? 'टाइमलाईन' : 'Timeline'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryViewMode('calendar')}
                    style={{
                      border: 'none',
                      background: historyViewMode === 'calendar' ? '#ffffff' : 'transparent',
                      color: historyViewMode === 'calendar' ? 'var(--ink)' : 'var(--muted)',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: 999,
                      fontSize: 12.5,
                      cursor: 'pointer',
                      boxShadow: historyViewMode === 'calendar' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    📅 {isMr ? 'कॅलेंडर' : 'Calendar'}
                  </button>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {[
                  { key: 'all', label: isMr ? 'सर्व सफरी' : 'All Journeys' },
                  { key: '2026', label: '2026' },
                  { key: 'heritage', label: isMr ? 'ऐतिहासिक वाडे' : 'Heritage' },
                  { key: 'forts', label: isMr ? 'किल्ले' : 'Forts' },
                  { key: 'nature', label: isMr ? 'निसर्ग व तलाव' : 'Nature & Lakes' },
                  { key: 'temples', label: isMr ? 'मंदिरे' : 'Temples' },
                ].map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => setFilterCategory(chip.key)}
                    className="chip"
                    style={{
                      padding: '5px 12px',
                      fontSize: 12,
                      cursor: 'pointer',
                      background: filterCategory === chip.key ? 'var(--primary)' : '#ffffff',
                      color: filterCategory === chip.key ? '#ffffff' : 'var(--ink-secondary)',
                      borderColor: filterCategory === chip.key ? 'var(--primary)' : 'var(--line)',
                      fontWeight: filterCategory === chip.key ? 700 : 500,
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* TIMELINE VIEW */}
              {historyViewMode === 'timeline' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  {filteredJourneys.map((j) => (
                    <div
                      key={j.id}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid var(--line)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '18px 22px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 16,
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 'var(--radius)',
                            background: 'var(--primary-light)',
                            border: '1px solid var(--primary-border)',
                            color: 'var(--primary)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: 17, fontWeight: 800 }}>
                            {j.date.split('-')[2]}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                            {new Date(j.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--clay)', textTransform: 'uppercase' }}>
                              {j.dateLabelEn}
                            </span>
                            {j.status === 'completed' && (
                              <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '2px 0 4px', color: 'var(--ink)' }}>
                            {isMr ? j.titleMr || j.title : j.title}
                          </h3>
                          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                            📍 {j.places.length} {isMr ? 'ठिकाणे' : 'Places'} • 📏 {j.totalDistanceKm} km • ⏱️ {j.totalDurationMinutes} min
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedJourneyId(j.id)}
                          className="btn"
                          style={{
                            padding: '8px 18px',
                            fontSize: 13,
                            fontWeight: 700,
                            borderRadius: 999,
                          }}
                        >
                          {isMr ? 'सहल पहा →' : 'View Journey →'}
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredJourneys.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)' }}>
                      🔍 {isMr ? 'या निकषांवर कोणतीही सफर सापडली नाही.' : 'No journeys match your filter or search query.'}
                    </div>
                  )}
                </div>
              )}

              {/* CALENDAR VIEW */}
              {historyViewMode === 'calendar' && (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid var(--line)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 24,
                    maxWidth: 700,
                    margin: '0 auto',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                      {selectedCalendarMonth === '2026-10' ? 'OCTOBER 2026' : 'JUNE 2026'}
                    </h3>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => setSelectedCalendarMonth('2026-06')}
                        className="chip"
                        style={{
                          fontSize: 11.5,
                          padding: '4px 10px',
                          background: selectedCalendarMonth === '2026-06' ? 'var(--primary)' : '#fff',
                          color: selectedCalendarMonth === '2026-06' ? '#fff' : 'inherit',
                        }}
                      >
                        June 2026
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCalendarMonth('2026-10')}
                        className="chip"
                        style={{
                          fontSize: 11.5,
                          padding: '4px 10px',
                          background: selectedCalendarMonth === '2026-10' ? 'var(--primary)' : '#fff',
                          color: selectedCalendarMonth === '2026-10' ? '#fff' : 'inherit',
                        }}
                      >
                        October 2026
                      </button>
                    </div>
                  </div>

                  {/* Day of Week Headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center', marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>

                  {/* Calendar Grid Cells */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                    {calendarDays.map((cell, idx) => {
                      if (!cell.dayNumber) {
                        return <div key={`empty-${idx}`} style={{ height: 58 }} />;
                      }
                      const hasJourney = Boolean(cell.journey);
                      return (
                        <div
                          key={cell.dateString}
                          onClick={() => {
                            if (cell.journey) {
                              setSelectedJourneyId(cell.journey.id);
                            }
                          }}
                          style={{
                            height: 58,
                            borderRadius: 'var(--radius-sm)',
                            border: hasJourney ? '2px solid #ea580c' : '1px solid #f1f5f9',
                            background: hasJourney ? '#fff7ed' : '#ffffff',
                            cursor: hasJourney ? 'pointer' : 'default',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            position: 'relative',
                            transition: 'all 0.15s ease',
                          }}
                          title={hasJourney ? `${cell.journey?.title} (${cell.journey?.places.length} places)` : ''}
                        >
                          <span style={{ fontSize: 13, fontWeight: hasJourney ? 800 : 500, color: hasJourney ? '#9a3412' : '#334155' }}>
                            {cell.dayNumber}
                          </span>
                          {hasJourney && (
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: '#ea580c',
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p style={{ margin: '18px 0 0', fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
                    💡 {isMr ? 'ऑरेंज हायलाइट केलेल्या तारखांवर क्लिक करून त्या दिवशीची सफर पहा (उदा. १४ जून, १८ ऑक्टोबर).' : 'Dates with orange indicator contain recorded journeys. Click to view (e.g. 14 June, 18 Oct).'}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ===================================================================
          LEVEL 3 — OVERALL JOURNEY
          =================================================================== */}
      {activeTab === 'overall' && (
        <section>
          {/* Dynamic Overall Statistics Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
                border: '1.5px solid #fed7aa',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' }}>
                {isMr ? 'एकूण पाहिलेली ठिकाणे' : 'Places Visited'}
              </span>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#9a3412', marginTop: 4 }}>
                {overallStats.totalPlacesVisited}
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Across Pune District</span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
                border: '1.5px solid #a7f3d0',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                {isMr ? 'एकूण सफरी' : 'Journeys Completed'}
              </span>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#065f46', marginTop: 4 }}>
                {overallStats.totalJourneys}
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Recorded Days</span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
                border: '1.5px solid #bfdbfe',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
                {isMr ? 'एकूण पार केलेले अंतर' : 'Total Distance'}
              </span>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#1e40af', marginTop: 4 }}>
                {overallStats.totalDistanceKm} <span style={{ fontSize: 18 }}>km</span>
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Transit & Trails</span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
                border: '1.5px solid #e9d5ff',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase' }}>
                {isMr ? 'अन्वेषण केलेले विभाग' : 'Areas Explored'}
              </span>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#6b21a8', marginTop: 4 }}>
                {overallStats.totalAreasExplored}
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Distinct Regions</span>
            </div>
          </div>

          {/* Complete Historical Multi-Route Animated Pune Map */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                  {isMr ? 'पुणे संपूर्ण ऐतिहासिक नकाशा' : 'Chronological Exploration Map of Pune'}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted)' }}>
                  {isMr
                    ? 'प्रत्येक रेषेवर क्लिक करून त्या दिवसाची ऐतिहासिक सफर उघडा.'
                    : 'Interactive overlay of all completed journeys. Click any route or marker to explore that day.'}
                </p>
              </div>
            </div>

            <JourneyMapAnimation
              journey={null}
              allJourneys={journeys}
              isOverallMode={true}
              selectedDateId={selectedJourneyId || undefined}
              onSelectDate={(id) => {
                setSelectedJourneyId(id);
                setActiveTab('history');
              }}
              isMr={isMr}
            />
          </div>

          {/* Journey Milestones Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: 'var(--ink)' }}>
              🏆 {isMr ? 'पुणे भ्रमंती यशोगाथा व पदके' : 'Journey Milestones & Badges'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {milestones.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: m.isUnlocked ? '#ffffff' : '#f8fafc',
                    border: m.isUnlocked ? '1.5px solid #10b981' : '1px solid var(--line)',
                    borderRadius: 'var(--radius)',
                    padding: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    boxShadow: m.isUnlocked ? '0 4px 14px rgba(16, 185, 129, 0.1)' : 'none',
                    opacity: m.isUnlocked ? 1 : 0.75,
                  }}
                >
                  <span style={{ fontSize: 32 }}>{m.badge}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: 14.5, color: m.isUnlocked ? '#065f46' : 'var(--ink)' }}>
                        {isMr ? m.titleMr : m.titleEn}
                      </strong>
                      {m.isUnlocked && (
                        <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: 999, fontWeight: 800 }}>
                          ✓ UNLOCKED
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '3px 0 6px', fontSize: 12, color: 'var(--muted)' }}>
                      {isMr ? m.descMr : m.descEn}
                    </p>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.round((m.progress / m.target) * 100)}%`,
                          height: '100%',
                          background: m.isUnlocked ? '#10b981' : 'var(--primary)',
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

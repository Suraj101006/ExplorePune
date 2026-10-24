'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { getActiveTrip } from '@/lib/activeTrip';
import { getSavedPlaces, SavedPlaceSummary } from '@/lib/savedPlaces';
import JourneyMapAnimation from '@/components/JourneyMapAnimation';
import TodayHeroAnimation from '@/components/TodayHeroAnimation';
import JourneyReelPlayerModal from '@/components/JourneyReelPlayerModal';
import CreateJourneyReelModal from '@/components/CreateJourneyReelModal';
import { JourneyReelData } from '@/lib/journeyReel';
import ShareJourneyModal from '@/components/ShareJourneyModal';
import MemoryMomentModal from '@/components/MemoryMomentModal';
import {
  DayJourney,
  JourneyPlaceStop,
  buildUserJourneysFromVisits,
  SEED_JOURNEYS,
  getAllJourneys,
  toggleJourneyStopVisited,
  computeOverallStats,
  computeJourneyMilestones,
  generateSpecialJourneyCards,
  generateJourneyStories,
  calculateExplorationStreak,
  recordJourneyActivity,
  TOTAL_PUNE_PLACES_COUNT,
  SpecialJourneyCard,
  JourneyStoryCardItem,
} from '@/lib/journeyStorage';
import {
  Play,
  Share2,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  CheckCircle2,
  Award,
  ChevronRight,
  Flame,
  Search,
  Filter,
  Eye,
  Clock,
  Navigation,
} from 'lucide-react';

export default function MyJourneyClient() {
  const { isMr } = useLanguage();
  const { user, ready } = useAuth();

  // Primary top-level navigation: 'today' | 'overall' (Requirement 1)
  const [activeTab, setActiveTab] = useState<'today' | 'overall'>('today');

  // Modal states (Requirements 5, 14, 16)
  const [reelJourney, setReelJourney] = useState<DayJourney | null>(null);
  const [customReelData, setCustomReelData] = useState<JourneyReelData | null>(null);
  const [isCreateReelOpen, setIsCreateReelOpen] = useState(false);
  const [createReelMode, setCreateReelMode] = useState<'today' | 'overall'>('today');
  const [shareJourney, setShareJourney] = useState<DayJourney | null>(null);
  const [memoryJourney, setMemoryJourney] = useState<DayJourney | null>(null);

  // Filters & selection
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [checkinToast, setCheckinToast] = useState<string>('');

  // Data states
  const [loading, setLoading] = useState(true);
  const [realVisitsCount, setRealVisitsCount] = useState(0);
  const [showDemoSample, setShowDemoSample] = useState(false);
  const [journeys, setJourneys] = useState<DayJourney[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaceSummary[]>([]);

  // Load user's authentic journeys from Firestore visits & active planner trips
  const loadRealJourneys = useCallback(async () => {
    setLoading(true);
    try {
      // Load saved places from localStorage
      setSavedPlaces(getSavedPlaces());

      if (!user) {
        if (showDemoSample) {
          setJourneys(SEED_JOURNEYS);
        } else {
          const guestTrips = getAllJourneys(null, false);
          setJourneys(guestTrips);
        }
        setRealVisitsCount(0);
        return;
      }

      // 1. Fetch user's authentic visits from Firestore
      const visitsSnap = await getDocs(
        query(collection(db, 'visits'), where('user_id', '==', user.uid))
      );
      const visits = visitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRealVisitsCount(visits.length);

      // 2. Fetch published places for metadata enrichment
      const placesMap = new Map<string, any>();
      try {
        const placesSnap = await getDocs(
          query(collection(db, 'places'), where('status', '==', 'published'))
        );
        placesSnap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          placesMap.set(docSnap.id, data);
          if (data.slug) placesMap.set(data.slug, data);
        });
      } catch (err) {
        console.warn('Could not fetch places for metadata enrichment:', err);
      }

      // 3. Load active planner trip
      const activeTrip = getActiveTrip();

      // 4. Synthesize real DayJourneys from actual visits & active trip
      const realJourneys = buildUserJourneysFromVisits(visits, placesMap, activeTrip);

      // 5. Also load any user-scoped stored journeys
      const localUserJourneys = getAllJourneys(user.uid, false);
      const mergedMap = new Map<string, DayJourney>();
      for (const j of localUserJourneys) mergedMap.set(j.date, j);
      for (const j of realJourneys) mergedMap.set(j.date, j);
      const finalJourneys = Array.from(mergedMap.values());
      finalJourneys.sort((a, b) => b.date.localeCompare(a.date));

      if (showDemoSample) {
        setJourneys(SEED_JOURNEYS);
      } else {
        setJourneys(finalJourneys);
      }
    } catch (err) {
      console.error('Failed to load real user journeys:', err);
    } finally {
      setLoading(false);
    }
  }, [user, showDemoSample]);

  // Initial load and URL param parsing
  useEffect(() => {
    loadRealJourneys();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const dateParam = params.get('date');
      const tabParam = params.get('tab');
      if (tabParam === 'today' || tabParam === 'overall') {
        setActiveTab(tabParam);
      }
      if (dateParam) {
        setSelectedJourneyId(dateParam);
        setActiveTab('overall');
      }
    }

    const handleSync = () => loadRealJourneys();
    window.addEventListener('explore-pune-journeys-changed', handleSync);
    window.addEventListener('explore-pune-visit-logged', handleSync);
    window.addEventListener('explore-pune-active-trip-changed', handleSync);
    window.addEventListener('explore-pune-saved-changed', handleSync);

    return () => {
      window.removeEventListener('explore-pune-journeys-changed', handleSync);
      window.removeEventListener('explore-pune-visit-logged', handleSync);
      window.removeEventListener('explore-pune-active-trip-changed', handleSync);
      window.removeEventListener('explore-pune-saved-changed', handleSync);
    };
  }, [loadRealJourneys]);

  // Derived state
  const todayJourney = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    return journeys.find((j) => j.date === todayIso || j.status === 'active') || null;
  }, [journeys]);

  const overallStats = useMemo(() => computeOverallStats(journeys), [journeys]);
  const milestones = useMemo(() => computeJourneyMilestones(overallStats), [overallStats]);
  const specialCards = useMemo(() => generateSpecialJourneyCards(journeys, overallStats), [journeys, overallStats]);
  const journeyStories = useMemo(() => generateJourneyStories(journeys), [journeys]);
  const streak = useMemo(() => calculateExplorationStreak(journeys), [journeys]);

  // Exploration progress percentage
  const explorationPct = Math.min(
    100,
    Math.round((overallStats.totalPlacesVisited / TOTAL_PUNE_PLACES_COUNT) * 100)
  );

  // Filtered journeys for Overall Timeline
  const filteredJourneys = useMemo(() => {
    return journeys.filter((j) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const hasCategory = j.places.some((p) => p.category === selectedCategory);
        if (!hasCategory) return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = j.title.toLowerCase().includes(q) || (j.titleMr && j.titleMr.toLowerCase().includes(q));
        const matchesDate = j.date.includes(q) || j.dateLabelEn.toLowerCase().includes(q);
        const matchesPlace = j.places.some(
          (p) =>
            p.placeName.toLowerCase().includes(q) ||
            (p.placeNameMr && p.placeNameMr.toLowerCase().includes(q))
        );
        return matchesTitle || matchesDate || matchesPlace;
      }
      return true;
    });
  }, [journeys, selectedCategory, searchQuery]);

  // Group filtered journeys by Year & Month (Requirement 10)
  const groupedJourneys = useMemo(() => {
    const groups: Record<string, Record<string, DayJourney[]>> = {};
    for (const j of filteredJourneys) {
      const year = j.date.slice(0, 4) || '2026';
      const monthIndex = parseInt(j.date.slice(5, 7), 10) - 1;
      const monthName = !isNaN(monthIndex)
        ? new Date(2026, monthIndex, 1).toLocaleDateString('en-GB', { month: 'long' }).toUpperCase()
        : 'OCTOBER';

      if (!groups[year]) groups[year] = {};
      if (!groups[year][monthName]) groups[year][monthName] = [];
      groups[year][monthName].push(j);
    }
    return groups;
  }, [filteredJourneys]);

  // Handle Mark as Visited for Today's Journey & Synchronize with Firestore & Activities
  const handleToggleVisited = async (placeId: string, currentStatus: boolean) => {
    if (!todayJourney) return;
    const newStatus = !currentStatus;
    const updated = toggleJourneyStopVisited(todayJourney.id, placeId, newStatus, user?.uid);
    if (updated) {
      const p = updated.places.find((item) => item.placeId === placeId);

      // Record activity in local engine
      recordJourneyActivity({
        userId: user?.uid || 'guest',
        type: newStatus ? 'place_visited' : 'journey_created',
        placeId,
        placeName: p?.placeName,
        category: p?.category,
        distance: updated.totalDistanceKm,
      });

      // If user is authenticated and checked in, sync to Firestore
      if (user && newStatus) {
        try {
          const visitId = `${user.uid}_${placeId}_${Date.now()}`;
          await setDoc(doc(db, 'visits', visitId), {
            place_id: placeId,
            place_slug: p?.placeSlug || placeId,
            place_name: p?.placeName || 'Pune Spot',
            place_name_mr: p?.placeNameMr || p?.placeName,
            user_id: user.uid,
            user_name: user.displayName || user.email?.split('@')[0] || 'Pune Explorer',
            user_avatar: user.photoURL || null,
            visited_at: new Date().toISOString().slice(0, 10),
            notes: p?.note || 'Checked in via My Journey',
            image_url: p?.image_url || '/images/places/shaniwar-wada.jpg',
            is_public: false,
            created_at: new Date().toISOString(),
          });
          window.dispatchEvent(new CustomEvent('explore-pune-visit-logged', { detail: { placeId } }));
        } catch (dbErr) {
          console.warn('Could not sync checkin to Firestore:', dbErr);
        }
      }

      loadRealJourneys();

      if (newStatus) {
        setCheckinToast(
          isMr
            ? `🎉 अभिनंदन! "${p?.placeNameMr || p?.placeName}" येथे भेट नोंदवली!`
            : `🎉 Great! "${p?.placeName}" marked as visited!`
        );
        setTimeout(() => setCheckinToast(''), 4000);
      }
    }
  };

  const hasAnyActivity = journeys.length > 0 && overallStats.totalPlacesVisited > 0;

  return (
    <main className="wrap" style={{ paddingTop: 36, paddingBottom: 80 }}>
      {/* 🧭 HERO HEADER & PLATFORM IDENTITY */}
      <section style={{ maxWidth: 840, marginBottom: 28 }}>
        <div className="hero-pill" style={{ marginBottom: 12 }}>
          <span>🧭</span> {isMr ? 'माझी पुणे यात्रा' : 'My Pune Journey'}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 46px)', margin: '0 0 10px', fontWeight: 800, color: 'var(--ink)' }}>
          {isMr ? 'प्रत्येक ठिकाण बनते तुमच्या ' : 'Every place becomes a part of your '}
          <span className="gradient">{isMr ? 'पुणे प्रवासाची कथा' : 'Pune Story'}</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16.5, lineHeight: 1.6, margin: 0 }}>
          {isMr
            ? '“पुणे हे केवळ ठिकाणांची यादी नाही. हा तुमचा स्वतः निर्माण केलेला जिवंत प्रवास आहे.”'
            : '“Your Pune journey, beautifully remembered. Turn actual exploration into a visual travel story.”'}
        </p>
      </section>

      {/* Account Data Mode Indicator */}
      {user ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            padding: '14px 20px',
            background: showDemoSample ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: `1.5px solid ${showDemoSample ? '#fde68a' : '#a7f3d0'}`,
            borderRadius: 14,
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>{showDemoSample ? '🔬' : '👤'}</span>
            <div>
              <strong style={{ display: 'block', fontSize: 14, color: showDemoSample ? '#92400e' : '#065f46' }}>
                {showDemoSample
                  ? (isMr ? 'डेमो नमुना सहल डेटा (काल्पनिक प्रदर्शन)' : 'Viewing Sample Demonstration Data')
                  : (isMr
                      ? `${user.displayName || user.email?.split('@')[0] || 'प्रवासी मित्र'} - तुमचा प्रत्यक्ष प्रवास डेटा (${realVisitsCount} ठिकाणे भेट)`
                      : `${user.displayName || user.email?.split('@')[0] || 'Pune Explorer'}'s Authentic Travel Journal (${realVisitsCount} verified visits)`)}
              </strong>
              <span style={{ fontSize: 12.5, color: showDemoSample ? '#b45309' : '#047857' }}>
                {showDemoSample
                  ? (isMr ? 'हा नमुना डेटा आहे. तुमच्या खात्याचा खरा डेटा पाहण्यासाठी उजवीकडील बटण दाबा.' : 'This sample dataset illustrates a completed travel history across Pune.')
                  : (isMr ? 'पुण्यातील तुम्ही प्रत्यक्ष भेट दिलेली ठिकाणे व सहलीचा जिवंत नकाशा.' : 'Live synchronized with your Firestore visits, planner itineraries, and activities.')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDemoSample(!showDemoSample)}
            className="chip"
            style={{
              cursor: 'pointer',
              background: showDemoSample ? '#d97706' : '#ffffff',
              color: showDemoSample ? '#ffffff' : '#065f46',
              fontWeight: 700,
              border: `1.5px solid ${showDemoSample ? '#b45309' : '#10b981'}`,
            }}
          >
            {showDemoSample
              ? (isMr ? '✓ माझा खरा डेटा दाखवा' : 'Show My Real Data')
              : (isMr ? '🔬 नमुना डेमो पहा' : 'View Sample Demo')}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            padding: '12px 18px',
            background: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 14,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🔒</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              {isMr
                ? 'अतिथी मोड: कायमस्वरूपी प्रवास इतिहास जतन करण्यासाठी लॉगिन करा.'
                : 'Guest mode: Sign in to sync your exploration across devices and unlock verified achievements.'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowDemoSample(!showDemoSample)}
              className="chip"
              style={{
                cursor: 'pointer',
                background: showDemoSample ? '#d97706' : '#ffffff',
                color: showDemoSample ? '#ffffff' : '#065f46',
                fontWeight: 700,
                border: '1px solid var(--border)',
              }}
            >
              {showDemoSample ? 'Show Empty State' : 'Preview Sample Journey'}
            </button>
            <Link href="/auth?redirect=/journey" className="chip primary">
              {isMr ? 'लॉगिन करा' : 'Sign In'}
            </Link>
          </div>
        </div>
      )}

      {/* 🧭 TWO PRIMARY TOP-LEVEL NAVIGATION TABS (Requirement 1) */}
      <nav
        aria-label="Journey Primary Tabs"
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 28,
          padding: 6,
          background: 'rgba(0, 0, 0, 0.04)',
          borderRadius: 999,
          border: '1px solid var(--line)',
          maxWidth: 480,
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
            padding: '11px 20px',
            borderRadius: 999,
            border: activeTab === 'today' ? '1.5px solid var(--primary-border)' : 'none',
            background: activeTab === 'today' ? '#ffffff' : 'transparent',
            color: activeTab === 'today' ? 'var(--primary)' : 'var(--ink-secondary)',
            fontWeight: activeTab === 'today' ? 800 : 600,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: activeTab === 'today' ? '0 2px 10px rgba(6, 95, 70, 0.12)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.18s ease',
          }}
        >
          <span>📍</span>
          <span>{isMr ? 'आजची सफर' : "Today's Journey"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('overall');
            setSelectedJourneyId(null);
          }}
          style={{
            flex: 1,
            padding: '11px 20px',
            borderRadius: 999,
            border: activeTab === 'overall' ? '1.5px solid var(--primary-border)' : 'none',
            background: activeTab === 'overall' ? '#ffffff' : 'transparent',
            color: activeTab === 'overall' ? 'var(--primary)' : 'var(--ink-secondary)',
            fontWeight: activeTab === 'overall' ? 800 : 600,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: activeTab === 'overall' ? '0 2px 10px rgba(6, 95, 70, 0.12)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.18s ease',
          }}
        >
          <span>🗺️</span>
          <span>{isMr ? 'संपूर्ण प्रवास' : 'Overall Journey'}</span>
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
          TAB 1: TODAY'S JOURNEY (Requirements 2, 3, 5, 6, 7)
          =================================================================== */}
      {activeTab === 'today' && (
        <section>
          {todayJourney ? (
            <div>
              {/* Requirement 3: Hero Cinematic Introduction */}
              <TodayHeroAnimation
                journey={todayJourney}
                isMr={isMr}
                onPlayReel={() => {
                  const toPlay = todayJourney || journeys[0] || SEED_JOURNEYS[0];
                  setReelJourney(toPlay);
                }}
                onShare={() => setShareJourney(todayJourney || journeys[0] || SEED_JOURNEYS[0])}
              />

              {/* Requirement 2: Visual Timeline Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px', color: 'var(--ink)' }}>
                    {isMr ? 'आजची सफर' : "Today's Journey"}
                  </h2>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', fontStyle: 'italic' }}>
                    {isMr ? '“आज तुम्ही पुण्यात काय अनुभवले?”' : '“What did you discover today?”'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateReelMode('today');
                      setIsCreateReelOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: 13.5,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                    }}
                  >
                    <Sparkles size={15} />
                    {isMr ? '✨ रील तयार करा' : '✨ Create Journey Reel'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const toPlay = todayJourney || journeys[0] || SEED_JOURNEYS[0];
                      setReelJourney(toPlay);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      borderRadius: 14,
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#065f46',
                      border: '1.5px solid rgba(16, 185, 129, 0.3)',
                      fontWeight: 700,
                      fontSize: 13.5,
                      cursor: 'pointer',
                    }}
                  >
                    <Play size={15} fill="#065f46" />
                    {isMr ? '🎬 रील पहा' : '🎬 Watch Journey Reel'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareJourney(todayJourney)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      borderRadius: 14,
                      background: '#ffffff',
                      color: 'var(--ink)',
                      border: '1.5px solid var(--border)',
                      fontWeight: 600,
                      fontSize: 13.5,
                      cursor: 'pointer',
                    }}
                  >
                    <Share2 size={15} />
                    {isMr ? 'शेअर' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Split View: Map + Timeline */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'start' }}>
                {/* Left: Interactive Map */}
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
                        ⏱️ {todayJourney.totalDurationMinutes} min
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                        {isMr ? 'अंतर' : 'Distance'}
                      </span>
                      <strong style={{ display: 'block', fontSize: 14, color: 'var(--primary)' }}>
                        📍 {todayJourney.totalDistanceKm} km
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Right: Step-by-Step Chronological Timeline (Requirement 2) */}
                <div>
                  <div
                    style={{
                      position: 'relative',
                      paddingLeft: 28,
                      borderLeft: '2.5px solid #10b981',
                      marginLeft: 14,
                    }}
                  >
                    {/* 09:15 Started Journey */}
                    <div style={{ position: 'relative', marginBottom: 24 }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: -39,
                          top: 2,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: '#10b981',
                          border: '3px solid #ffffff',
                          boxShadow: '0 0 0 1.5px #10b981',
                        }}
                      />
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                        {todayJourney.startTime || '09:15 AM'}
                      </span>
                      <strong style={{ display: 'block', fontSize: 15, color: 'var(--ink)' }}>
                        📍 {isMr ? 'सफर सुरू झाली' : 'Started Journey'} — {todayJourney.startLocation}
                      </strong>
                    </div>

                    {/* Visited / Planned Stops */}
                    {todayJourney.places.map((p, idx) => (
                      <div
                        key={p.placeId || idx}
                        style={{
                          position: 'relative',
                          marginBottom: 24,
                          background: '#ffffff',
                          border: p.isVisited ? '1.5px solid #a7f3d0' : '1px solid var(--border)',
                          borderRadius: 16,
                          padding: 16,
                          boxShadow: p.isVisited ? '0 4px 14px rgba(16, 185, 129, 0.08)' : '0 2px 6px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: -39,
                            top: 18,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: p.isVisited ? '#10b981' : '#94a3b8',
                            border: '3px solid #ffffff',
                            boxShadow: `0 0 0 1.5px ${p.isVisited ? '#10b981' : '#94a3b8'}`,
                          }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                          <div>
                            <span style={{ fontSize: 11.5, fontWeight: 800, color: p.isVisited ? '#059669' : '#64748b' }}>
                              {p.arrivalTime || '10:00 AM'}
                            </span>
                            <h4 style={{ fontSize: 16, fontWeight: 800, margin: '2px 0 0', color: 'var(--ink)' }}>
                              {isMr ? (p.placeNameMr || p.placeName) : p.placeName}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleVisited(p.placeId, p.isVisited)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 20,
                              background: p.isVisited ? '#ecfdf5' : '#f1f5f9',
                              border: p.isVisited ? '1.5px solid #10b981' : '1px solid var(--border)',
                              color: p.isVisited ? '#065f46' : 'var(--ink)',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <CheckCircle2 size={13} style={{ color: p.isVisited ? '#10b981' : '#94a3b8' }} />
                            {p.isVisited ? (isMr ? 'भेट दिली ✓' : 'Visited ✓') : isMr ? 'भेट नोंदवा' : 'Check In'}
                          </button>
                        </div>

                        {p.image_url && (
                          <div style={{ height: 110, borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                            <img
                              src={p.image_url}
                              alt={p.placeName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        )}

                        {p.note && (
                          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                            “{isMr ? (p.noteMr || p.note) : p.note}”
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Journey Complete Node */}
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: -39,
                          top: 2,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: '#047857',
                          border: '3px solid #ffffff',
                          boxShadow: '0 0 0 1.5px #047857',
                        }}
                      />
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                        {todayJourney.endTime || '05:00 PM'}
                      </span>
                      <strong style={{ display: 'block', fontSize: 15, color: '#065f46' }}>
                        ✓ {isMr ? 'आजचा प्रवास पूर्ण' : 'Journey Complete'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Requirement 23: Empty State for Today */
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: '#f8fafc',
                border: '1.5px dashed var(--border)',
                borderRadius: 24,
                maxWidth: 600,
                margin: '0 auto',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🧭</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: 'var(--ink)' }}>
                {isMr ? 'तुमची पुणे सफर इथून सुरू होते.' : 'Your Pune story starts here.'}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
                {isMr
                  ? 'पुण्यातील तुमच्या पहिल्या प्रेक्षणीय स्थळाला भेट द्या किंवा सहल आखा. आम्ही तुमच्या प्रवासाची सुंदर डिजिटल कथा तयार करू.'
                  : 'Explore your first place and we’ll start building your journey. Plan an itinerary or check in at a Pune landmark.'}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setReelJourney(SEED_JOURNEYS[0])}
                  className="btn"
                  style={{
                    padding: '12px 22px',
                    fontWeight: 700,
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 12,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <Play size={15} fill="#ffffff" />
                  {isMr ? '🎬 नमुना प्रवास रील्स पहा' : '🎬 Watch Sample Journey Reel'}
                </button>
                <Link href="/planner" className="btn btn-primary" style={{ padding: '12px 24px', fontWeight: 700 }}>
                  {isMr ? 'सहल आखा →' : 'Plan a Trip →'}
                </Link>
                <Link href="/" className="btn btn-secondary" style={{ padding: '12px 24px', fontWeight: 600 }}>
                  {isMr ? 'ठिकाणे शोधा' : 'Explore Landmarks'}
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===================================================================
          🎬 REQUIREMENT 19: REEL WAITING CALLOUT / ONE REEL CREATION BANNER
          =================================================================== */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
          borderRadius: 20,
          padding: '24px 28px',
          color: '#ffffff',
          marginTop: 36,
          marginBottom: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: '0 10px 30px rgba(6, 78, 59, 0.25)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
        }}
      >
        <div style={{ maxWidth: 540 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>🎬</span>
            <h3 style={{ margin: 0, fontSize: 18.5, fontWeight: 800, color: '#6ee7b7' }}>
              {isMr ? 'तुमची पुणे सफर वाट पाहत आहे 🎬' : 'Your Journey Is Waiting 🎬'}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#e2e8f0', lineHeight: 1.5 }}>
            {isMr
              ? `तुम्ही ${Math.max(overallStats.totalPlacesVisited, 3)} ठिकाणे पाहिली आहेत. तुमचे फोटो जोडून एका सुंदर, सिनेमॅटिक प्रवासात रूपांतरित करा.`
              : `You have explored ${Math.max(overallStats.totalPlacesVisited, 3)} places. Add your photos and turn your Pune memories into one beautiful journey reel.`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setCreateReelMode('overall');
              setIsCreateReelOpen(true);
            }}
            style={{
              padding: '12px 22px',
              borderRadius: 14,
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: 13.5,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Sparkles size={16} />
            {isMr ? 'माझा रील तयार करा' : 'Create My Reel'}
          </button>
          <button
            type="button"
            onClick={() => {
              setCustomReelData(null);
              setReelJourney(todayJourney || journeys[0] || SEED_JOURNEYS[0]);
            }}
            style={{
              padding: '12px 18px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.14)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <Play size={14} fill="#ffffff" />
            {isMr ? 'सध्याचा रील पहा' : 'Watch One Reel'}
          </button>
        </div>
      </div>

      {/* ===================================================================
          ✨ JOURNEY STORIES SHOWCASE (Requirements 1, 4, 12, 13)
          =================================================================== */}
      <section style={{ marginTop: 48, marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>✨</span>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                {isMr ? 'पुणे प्रवास कथा' : 'Journey Stories'}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
              {isMr
                ? 'तुमच्या प्रत्यक्ष प्रवासातून आपोआप तयार झालेली दृश्यमान आठवण कार्ड्स.'
                : 'Automatically generated visual story cards from meaningful exploration activity.'}
            </p>
          </div>
        </div>

        {/* Story Cards Carousel / Grid (Requirement 4) */}
        {journeyStories.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
              marginBottom: 32,
            }}
          >
            {journeyStories.slice(0, 4).map((story) => (
              <div
                key={story.id}
                className="story-card-container"
                style={{
                  height: 380,
                  borderRadius: 20,
                  background: '#022c22',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                }}
              >
                <img
                  src={story.imageUrl}
                  alt={story.placeName}
                  className="story-card-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Cinematic gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.25) 55%, rgba(15, 23, 42, 0.6) 100%)',
                  }}
                />

                {/* Top Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    right: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 10,
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 10,
                    }}
                  >
                    📍 {story.categoryName || 'Heritage'}
                  </span>
                  <span style={{ fontSize: 11.5, color: '#cbd5e1', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    {story.dateEn}
                  </span>
                </div>

                {/* Bottom Story Content */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    zIndex: 10,
                    color: '#ffffff',
                  }}
                >
                  <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 2 }}>
                    ⏰ {story.timeString}
                  </span>
                  <h4 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: '#ffffff', lineHeight: 1.25 }}>
                    {isMr ? (story.placeNameMr || story.placeName) : story.placeName}
                  </h4>
                  <p
                    style={{
                      fontSize: 13,
                      color: '#e2e8f0',
                      margin: '0 0 14px',
                      lineHeight: 1.45,
                      fontStyle: 'italic',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {isMr ? story.quoteMr : story.quoteEn}
                  </p>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        const j =
                          journeys.find((item) => item.id === story.journeyId) ||
                          journeys[0] ||
                          SEED_JOURNEYS.find((s) => s.id === story.journeyId) ||
                          SEED_JOURNEYS[0];
                        setReelJourney(j);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 10,
                        background: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Play size={12} fill="#ffffff" /> {isMr ? 'रील्स' : 'Watch Reel'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const j = journeys.find((item) => item.id === story.journeyId) || journeys[0];
                        setShareJourney(j);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 10,
                        background: 'rgba(255, 255, 255, 0.18)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '32px 20px',
              background: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: 16,
              textAlign: 'center',
              color: 'var(--muted)',
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            {isMr
              ? 'अद्याप कोणत्याही ठिकाणाला भेट नोंदवलेली नाही. ठिकाणे पाहिल्यावर येथे कथा कार्ड्स तयार होतील.'
              : 'No journey stories yet. Explore and check in at Pune places to generate your visual story cards.'}
          </div>
        )}

        {/* Special Achievement Cards (Requirement 12) */}
        {specialCards.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h4 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 14px', color: 'var(--ink)' }}>
              🌟 {isMr ? 'विशेष प्रवास पदके' : 'Special Journey Moments'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {specialCards.map((sc) => (
                <div
                  key={sc.id}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                    border: '1.5px solid #a7f3d0',
                    borderRadius: 16,
                    padding: 18,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)',
                  }}
                >
                  <span style={{ fontSize: 32, flexShrink: 0 }}>{sc.badge}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: 14.5, color: '#065f46' }}>
                        {isMr ? sc.titleMr : sc.titleEn}
                      </strong>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#047857',
                          background: '#dcfce7',
                          padding: '2px 8px',
                          borderRadius: 10,
                        }}
                      >
                        {isMr ? sc.statsTextMr : sc.statsTextEn}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.45 }}>
                      {isMr ? sc.descriptionMr : sc.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===================================================================
          TAB 2: OVERALL JOURNEY (Requirements 8, 9, 10, 11, 17, 18)
          =================================================================== */}
      {activeTab === 'overall' && (
        <section>
          {/* Requirement 17: Pune Exploration Progress Ring & Exploration Streak Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              marginBottom: 32,
              alignItems: 'center',
            }}
          >
            {/* Exploration Progress Ring Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '24px 28px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(6, 95, 70, 0.2)',
              }}
            >
              {/* Circular SVG Ring */}
              <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
                <svg width="96" height="96" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray="251.3"
                    strokeDashoffset={251.3 - (251.3 * explorationPct) / 100}
                    strokeLinecap="round"
                    className="exploration-progress-ring-circle"
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
                    {explorationPct}%
                  </span>
                </div>
              </div>

              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#6ee7b7',
                    textTransform: 'uppercase',
                  }}
                >
                  {isMr ? 'पुणे अन्वेषण प्रगती' : 'PUNE EXPLORATION'}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: '4px 0 2px', color: '#ffffff' }}>
                  {overallStats.totalPlacesVisited} / {TOTAL_PUNE_PLACES_COUNT} {isMr ? 'ठिकाणे पाहिली' : 'places explored'}
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: '#a7f3d0' }}>
                  {isMr ? 'तुम्ही पुणे नव्याने अनुभवत आहात.' : "You're discovering Pune."}
                </p>
              </div>
            </div>

            {/* Requirement 18: Exploration Streak (Healthy & Celebratory) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '24px 28px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                border: '1.5px solid #fde68a',
                color: '#92400e',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.1)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#fef3c7',
                  border: '2px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                🔥
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: '#b45309', textTransform: 'uppercase' }}>
                  {isMr ? 'सफर सातत्य' : 'EXPLORATION STREAK'}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: '2px 0 2px', color: '#78350f' }}>
                  {streak.totalActiveDays} {isMr ? 'दिवसांची पुणे भ्रमंती' : 'exploration days'}
                </h3>
                <span style={{ fontSize: 12.5, color: '#92400e' }}>
                  {isMr ? 'प्रत्येक पाऊल पुण्याचा इतिहास जिवंत करते.' : 'Celebrating real journeys without pressure.'}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Overall Statistics Strip (Requirement 8) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
                border: '1.5px solid #fed7aa',
                borderRadius: 16,
                padding: 18,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' }}>
                {isMr ? 'पाहिलेली ठिकाणे' : 'Places Explored'}
              </span>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#9a3412', marginTop: 4 }}>
                {overallStats.totalPlacesVisited}
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Across Pune</span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
                border: '1.5px solid #a7f3d0',
                borderRadius: 16,
                padding: 18,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                {isMr ? 'श्रेणी अन्वेषण' : 'Categories'}
              </span>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#065f46', marginTop: 4 }}>
                {overallStats.categoriesExplored.length}
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Distinct Themes</span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
                border: '1.5px solid #bfdbfe',
                borderRadius: 16,
                padding: 18,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
                {isMr ? 'पूर्ण यशोगाथा' : 'Milestones'}
              </span>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#1e40af', marginTop: 4 }}>
                {milestones.filter((m) => m.isUnlocked).length}
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Achievements</span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
                border: '1.5px solid #e9d5ff',
                borderRadius: 16,
                padding: 18,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase' }}>
                {isMr ? 'एकूण सहली' : 'Trips Completed'}
              </span>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#6b21a8', marginTop: 4 }}>
                {overallStats.totalJourneys}
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Recorded Days</span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                border: '1.5px solid #bbf7d0',
                borderRadius: 16,
                padding: 18,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
                {isMr ? 'सफर अंतर' : 'Journey Distance'}
              </span>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#14532d', marginTop: 4 }}>
                {overallStats.totalDistanceKm} <span style={{ fontSize: 16 }}>km</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Verified Trails</span>
            </div>
          </div>

          {/* Complete Historical Multi-Route Animated Pune Map (Requirement 9) */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                  {isMr ? 'पुणे संपूर्ण ऐतिहासिक नकाशा' : 'Interactive Pune Exploration Map'}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted)' }}>
                  {isMr
                    ? 'हिरवे बिंदू भेट दिलेली ठिकाणे, सोनेरी तारे सेव्ह केलेली ठिकाणे दर्शवतात. कोणत्याही मार्गावर क्लिक करा.'
                    : 'Shows visited landmarks (emerald pins), saved places (golden stars), and historical routes. Click any route or marker.'}
                </p>
              </div>

              {/* Map Legend */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c2410c' }} />
                  {isMr ? 'भेट दिलेली ठिकाणे' : 'Visited Places'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fbbf24' }} />
                  {isMr ? 'सेव्ह केलेली ठिकाणे' : 'Saved Places'}
                </span>
              </div>
            </div>

            <JourneyMapAnimation
              journey={null}
              allJourneys={journeys}
              isOverallMode={true}
              savedPlaces={savedPlaces.map((sp) => ({
                id: sp.id,
                name: sp.name,
                name_mr: sp.name_mr,
                latitude: (sp as any).latitude || 18.5204,
                longitude: (sp as any).longitude || 73.8567,
              }))}
              selectedDateId={selectedJourneyId || undefined}
              onSelectDate={(id) => {
                const j = journeys.find((item) => item.id === id || item.date === id);
                if (j) setMemoryJourney(j);
              }}
              isMr={isMr}
            />
          </div>

          {/* Category-based Journey Filters (Requirement 11) */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                {isMr ? 'श्रेणीनुसार प्रवास' : 'Category Journeys'}
              </h4>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'सर्व दाखवा (Reset)' : 'Reset to All'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: isMr ? 'सर्व' : 'All', icon: '🧭' },
                { id: 'forts', label: isMr ? 'किल्ले' : 'Forts', icon: '🏰' },
                { id: 'heritage', label: isMr ? 'वारसा' : 'Heritage', icon: '🏛️' },
                { id: 'temples', label: isMr ? 'मंदिरे' : 'Temples', icon: '🛕' },
                { id: 'nature', label: isMr ? 'निसर्ग' : 'Nature', icon: '🌿' },
                { id: 'meditation', label: isMr ? 'ध्यान' : 'Meditation', icon: '🧘' },
                { id: 'museums', label: isMr ? 'संग्रहालय' : 'Museums', icon: '🏺' },
                { id: 'food', label: isMr ? 'संस्कृती' : 'Culture & Food', icon: '🎭' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 20,
                    border: selectedCategory === cat.id ? '2px solid #10b981' : '1px solid var(--border)',
                    background: selectedCategory === cat.id ? '#ecfdf5' : '#ffffff',
                    color: selectedCategory === cat.id ? '#065f46' : 'var(--ink)',
                    fontWeight: selectedCategory === cat.id ? 700 : 500,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 150ms ease',
                  }}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chronological Timeline History (Requirements 10 & 16) */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: 'var(--ink)' }}>
              📅 {isMr ? 'कालक्रमानुसार प्रवास इतिहास' : 'Chronological Journey Timeline'}
            </h3>

            {Object.keys(groupedJourneys).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {Object.entries(groupedJourneys).map(([year, months]) => (
                  <div key={year}>
                    {/* Year Header */}
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: 'var(--primary)',
                        marginBottom: 16,
                        borderBottom: '2px solid var(--line)',
                        paddingBottom: 6,
                      }}
                    >
                      {year}
                    </div>

                    {Object.entries(months).map(([month, monthJourneys]) => (
                      <div key={month} style={{ marginBottom: 24, paddingLeft: 8 }}>
                        {/* Month Header */}
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            color: 'var(--muted)',
                            marginBottom: 14,
                            textTransform: 'uppercase',
                          }}
                        >
                          {month}
                        </div>

                        {/* Month Journeys List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {monthJourneys.map((j) => (
                            <div
                              key={j.id}
                              onClick={() => setMemoryJourney(j)}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 16,
                                padding: '16px 20px',
                                background: '#ffffff',
                                border: '1px solid var(--border)',
                                borderRadius: 16,
                                cursor: 'pointer',
                                transition: 'all 200ms ease',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 18px rgba(6, 95, 70, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div
                                  style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: 'rgba(16, 185, 129, 0.12)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 20,
                                    flexShrink: 0,
                                  }}
                                >
                                  🧭
                                </div>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>
                                      {j.dateLabelEn}
                                    </span>
                                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>• {j.places.length} places</span>
                                  </div>
                                  <h4 style={{ fontSize: 16, fontWeight: 800, margin: '2px 0 0', color: 'var(--ink)' }}>
                                    {isMr ? (j.titleMr || j.title) : j.title}
                                  </h4>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#047857' }}>
                                  {j.totalDistanceKm} km
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReelJourney(j || SEED_JOURNEYS[0]);
                                  }}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: 10,
                                    background: '#10b981',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                >
                                  <Play size={11} fill="#ffffff" /> {isMr ? 'रील्स' : 'Reel'}
                                </button>
                                <ChevronRight size={18} color="var(--muted)" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '36px 20px',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  textAlign: 'center',
                  color: 'var(--muted)',
                  fontSize: 14,
                }}
              >
                {isMr
                  ? 'या श्रेणीतील कोणतीही सफर आढळली नाही.'
                  : 'No recorded journeys found matching your search or category filter.'}
              </div>
            )}
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

      {/* ===================================================================
          MODALS
          =================================================================== */}
      {/* 1. Journey Video Reel Player Modal (Requirements 1, 2, 10, 12, 14) */}
      <JourneyReelPlayerModal
        isOpen={Boolean(reelJourney)}
        onClose={() => {
          setReelJourney(null);
          setCustomReelData(null);
        }}
        journey={reelJourney}
        reelData={customReelData}
        userName={user?.displayName || user?.email?.split('@')[0] || 'Suraj'}
        isMr={isMr}
        onShare={() => {
          const toShare = reelJourney;
          setReelJourney(null);
          setShareJourney(toShare);
        }}
      />

      {/* 2. Create Journey Reel Modal (Requirements 2, 3, 4, 5, 6, 7, 17, 20) */}
      <CreateJourneyReelModal
        isOpen={isCreateReelOpen}
        onClose={() => setIsCreateReelOpen(false)}
        journeys={journeys}
        todayJourney={todayJourney}
        userName={user?.displayName || user?.email?.split('@')[0] || 'Suraj'}
        isMr={isMr}
        initialMode={createReelMode}
        onReelGenerated={(reel) => {
          setCustomReelData(reel);
          setReelJourney(todayJourney || journeys[0] || SEED_JOURNEYS[0]);
        }}
      />

      {/* 3. Share Journey Modal (Requirements 14 & 19) */}
      <ShareJourneyModal
        isOpen={Boolean(shareJourney)}
        onClose={() => setShareJourney(null)}
        journey={shareJourney}
        userName={user?.displayName || user?.email?.split('@')[0] || 'Suraj'}
        isMr={isMr}
      />

      {/* 3. Memory Moment Modal (Requirement 16) */}
      <MemoryMomentModal
        isOpen={Boolean(memoryJourney)}
        onClose={() => setMemoryJourney(null)}
        journey={memoryJourney}
        isMr={isMr}
        onPlayReel={() => {
          const toPlay = memoryJourney;
          setMemoryJourney(null);
          setReelJourney(toPlay);
        }}
        onShare={() => {
          const toShare = memoryJourney;
          setMemoryJourney(null);
          setShareJourney(toShare);
        }}
      />
    </main>
  );
}

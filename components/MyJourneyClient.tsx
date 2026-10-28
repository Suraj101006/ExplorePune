'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getActiveTrip, ActiveTrip } from '@/lib/activeTrip';
import { getSavedPlaces, SavedPlaceSummary } from '@/lib/savedPlaces';
import {
  DayJourney,
  getAllJourneys,
  buildUserJourneysFromVisits,
  SEED_JOURNEYS,
  saveJourney,
} from '@/lib/journeyStorage';
import {
  JourneyReelData,
  getSavedReels,
  getAllCustomPhotosList,
} from '@/lib/journeyReel';
import JourneyHeader from '@/components/journey/JourneyHeader';
import JourneysListTab from '@/components/journey/JourneysListTab';
import JourneyTimelineModal from '@/components/journey/JourneyTimelineModal';
import CreateJourneyModal from '@/components/journey/CreateJourneyModal';
import MemoryGalleryTab from '@/components/journey/MemoryGalleryTab';
import ReelLibraryTab from '@/components/journey/ReelLibraryTab';
import SavedDestinationsTab from '@/components/journey/SavedDestinationsTab';
import JourneyReelPlayerModal from '@/components/JourneyReelPlayerModal';
import CreateJourneyReelModal from '@/components/CreateJourneyReelModal';
import ShareJourneyModal from '@/components/ShareJourneyModal';
import MemoryMomentModal from '@/components/MemoryMomentModal';
import GuestLockModal from '@/components/GuestLockModal';
import { Compass, Sparkles, Loader2 } from 'lucide-react';

export default function MyJourneyClient() {
  const { isMr } = useLanguage();
  const { user, ready } = useAuth();

  // Navigation tab: 'journeys' | 'memories' | 'reels' | 'saved'
  const [activeTab, setActiveTab] = useState<'journeys' | 'memories' | 'reels' | 'saved'>('journeys');

  // Data states
  const [loading, setLoading] = useState(true);
  const [journeys, setJourneys] = useState<DayJourney[]>([]);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaceSummary[]>([]);
  const [savedReels, setSavedReels] = useState<JourneyReelData[]>([]);
  const [allPhotos, setAllPhotos] = useState<Array<{ photoUrl: string; placeId: string; caption?: string }>>([]);

  // Modal active states
  const [selectedTimelineJourney, setSelectedTimelineJourney] = useState<DayJourney | null>(null);
  const [isCreateJourneyOpen, setIsCreateJourneyOpen] = useState(false);
  const [isCreateReelOpen, setIsCreateReelOpen] = useState(false);
  const [createReelMode, setCreateReelMode] = useState<'today' | 'overall'>('overall');
  const [targetReelJourney, setTargetReelJourney] = useState<DayJourney | null>(null);
  const [activeReelPlayer, setActiveReelPlayer] = useState<JourneyReelData | null>(null);
  const [shareJourney, setShareJourney] = useState<DayJourney | null>(null);
  const [memoryJourney, setMemoryJourney] = useState<DayJourney | null>(null);
  const [isGuestLockOpen, setIsGuestLockOpen] = useState(false);

  // Load user data from Firestore & local storage
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      setActiveTrip(getActiveTrip());
      setSavedPlaces(getSavedPlaces());
      setSavedReels(getSavedReels(user?.uid));
      setAllPhotos(getAllCustomPhotosList());

      if (!user) {
        // Guest mode
        const guestJourneys = getAllJourneys(null, true);
        setJourneys(guestJourneys);
        return;
      }

      // Authenticated User: Load visits & enrich from Firestore
      const visitsSnap = await getDocs(
        query(collection(db, 'visits'), where('user_id', '==', user.uid))
      );
      const visits = visitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

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

      const currentActiveTrip = getActiveTrip();
      const realJourneys = buildUserJourneysFromVisits(visits, placesMap, currentActiveTrip);
      const localUserJourneys = getAllJourneys(user.uid, false);

      const mergedMap = new Map<string, DayJourney>();
      for (const j of localUserJourneys) mergedMap.set(j.id || j.date, j);
      for (const j of realJourneys) mergedMap.set(j.id || j.date, j);

      const finalJourneys = Array.from(mergedMap.values());
      finalJourneys.sort((a, b) => b.date.localeCompare(a.date));

      // If user is brand new with 0 visits, show empty or seed fallback
      if (finalJourneys.length === 0) {
        const fallback = getAllJourneys(user.uid, true);
        setJourneys(fallback);
      } else {
        setJourneys(finalJourneys);
      }
    } catch (err) {
      console.error('Failed to load user journeys:', err);
      setJourneys(getAllJourneys(null, true));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();

    // Parse URL query parameters if present
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'memories' || tabParam === 'reels' || tabParam === 'saved' || tabParam === 'journeys') {
        setActiveTab(tabParam as any);
      }
      const newParam = params.get('new');
      if (newParam === 'true') {
        setIsCreateJourneyOpen(true);
      }
    }

    const handleSync = () => loadData();
    window.addEventListener('explore-pune-journeys-changed', handleSync);
    window.addEventListener('explore-pune-visit-logged', handleSync);
    window.addEventListener('explore-pune-active-trip-changed', handleSync);
    window.addEventListener('explore-pune-saved-changed', handleSync);
    window.addEventListener('explore-pune-reels-changed', handleSync);
    window.addEventListener('explore-pune-photos-changed', handleSync);

    return () => {
      window.removeEventListener('explore-pune-journeys-changed', handleSync);
      window.removeEventListener('explore-pune-visit-logged', handleSync);
      window.removeEventListener('explore-pune-active-trip-changed', handleSync);
      window.removeEventListener('explore-pune-saved-changed', handleSync);
      window.removeEventListener('explore-pune-reels-changed', handleSync);
      window.removeEventListener('explore-pune-photos-changed', handleSync);
    };
  }, [loadData]);

  // Derived real metrics
  const totalVisitedStops = useMemo(() => {
    let count = 0;
    for (const j of journeys) {
      count += j.places.filter((p) => p.isVisited).length;
    }
    return count;
  }, [journeys]);

  const todayJourney = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    return journeys.find((j) => j.date === todayIso || j.status === 'active') || null;
  }, [journeys]);

  // Handlers
  const handleOpenPlanJourney = () => {
    setIsCreateJourneyOpen(true);
  };

  const handleOpenCreateReel = (journey?: DayJourney) => {
    if (journey) {
      setTargetReelJourney(journey);
    } else {
      setTargetReelJourney(todayJourney || journeys[0] || null);
    }
    setCreateReelMode('overall');
    setIsCreateReelOpen(true);
  };

  const handleJourneyCreated = (newJourney: DayJourney) => {
    setJourneys((prev) => [newJourney, ...prev]);
    setSelectedTimelineJourney(newJourney);
  };

  const handleJourneyUpdated = (updated: DayJourney) => {
    setJourneys((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    if (selectedTimelineJourney?.id === updated.id) {
      setSelectedTimelineJourney(updated);
    }
  };

  const handleJourneyDeleted = (journeyId: string) => {
    setJourneys((prev) => prev.filter((j) => j.id !== journeyId && j.date !== journeyId));
    if (selectedTimelineJourney?.id === journeyId) {
      setSelectedTimelineJourney(null);
    }
  };

  const handlePlanWithSavedPlace = (place: SavedPlaceSummary) => {
    setIsCreateJourneyOpen(true);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#faf8f5',
        color: '#0f172a',
        padding: 'clamp(16px, 3vw, 40px) 16px 80px',
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Editorial Journal Header & Stats */}
        <JourneyHeader
          user={user}
          totalJourneys={journeys.length}
          totalVisited={totalVisitedStops}
          totalMemories={allPhotos.length}
          totalReels={savedReels.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPlanJourney={handleOpenPlanJourney}
          onCreateReel={() => handleOpenCreateReel()}
        />

        {/* Tab Body Content */}
        {loading && journeys.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              color: '#64748b',
            }}
          >
            <Loader2 size={32} className="animate-spin" color="#ea580c" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {isMr ? 'तुमची प्रवास दैनंदिनी लोड करत आहे…' : 'Loading your travel journal…'}
            </span>
          </div>
        ) : (
          <div>
            {/* 1. All Journeys & Timeline */}
            {activeTab === 'journeys' && (
              <JourneysListTab
                journeys={journeys}
                activeTrip={activeTrip}
                onSelectJourney={(j) => setSelectedTimelineJourney(j)}
                onCreateReel={(j) => handleOpenCreateReel(j)}
                onShare={(j) => setShareJourney(j)}
                onPlanJourney={handleOpenPlanJourney}
                onJourneyDeleted={handleJourneyDeleted}
                userId={user?.uid}
              />
            )}

            {/* 2. Personal Memory Gallery */}
            {activeTab === 'memories' && (
              <MemoryGalleryTab
                onOpenCreateReel={() => handleOpenCreateReel()}
                userId={user?.uid}
              />
            )}

            {/* 3. Reel Studio & Saved Reels */}
            {activeTab === 'reels' && (
              <ReelLibraryTab
                onPlayReel={(reel) => setActiveReelPlayer(reel)}
                onOpenCreateReel={() => handleOpenCreateReel()}
                userId={user?.uid}
              />
            )}

            {/* 4. Bookmarked Saved Destinations */}
            {activeTab === 'saved' && (
              <SavedDestinationsTab
                onPlanWithPlace={handlePlanWithSavedPlace}
              />
            )}
          </div>
        )}
      </div>

      {/* ===================================================================
          MODALS & SYSTEM OVERLAYS (Integrated with Viewport ModalPortal)
          =================================================================== */}

      {/* 1. Interactive Journey Timeline Detail Modal */}
      <JourneyTimelineModal
        isOpen={Boolean(selectedTimelineJourney)}
        onClose={() => setSelectedTimelineJourney(null)}
        journey={selectedTimelineJourney}
        onJourneyUpdated={handleJourneyUpdated}
        onJourneyDeleted={handleJourneyDeleted}
        onCreateReel={(j) => {
          setSelectedTimelineJourney(null);
          handleOpenCreateReel(j);
        }}
        onShare={(j) => {
          setShareJourney(j);
        }}
        userId={user?.uid}
      />

      {/* 2. 4-Step Guided Journey Creator Modal */}
      <CreateJourneyModal
        isOpen={isCreateJourneyOpen}
        onClose={() => setIsCreateJourneyOpen(false)}
        onJourneyCreated={handleJourneyCreated}
        userId={user?.uid}
      />

      {/* 3. Create Journey Cinematic Reel Studio Modal */}
      <CreateJourneyReelModal
        isOpen={isCreateReelOpen}
        onClose={() => setIsCreateReelOpen(false)}
        journeys={targetReelJourney ? [targetReelJourney, ...journeys.filter((j) => j.id !== targetReelJourney.id)] : journeys}
        todayJourney={targetReelJourney || todayJourney}
        userName={user?.displayName || user?.email?.split('@')[0] || (isMr ? 'पुणेकर' : 'Explorer')}
        isMr={isMr}
        initialMode={createReelMode}
        onReelGenerated={(reel) => {
          setIsCreateReelOpen(false);
          setActiveReelPlayer(reel);
          setSavedReels(getSavedReels(user?.uid));
        }}
      />

      {/* 4. Fullscreen Journey Reel Video Player Modal */}
      <JourneyReelPlayerModal
        isOpen={Boolean(activeReelPlayer)}
        onClose={() => setActiveReelPlayer(null)}
        journey={targetReelJourney || todayJourney || journeys[0] || SEED_JOURNEYS[0]}
        reelData={activeReelPlayer}
        userName={user?.displayName || user?.email?.split('@')[0] || (isMr ? 'पुणेकर' : 'Explorer')}
        isMr={isMr}
        onShare={() => {
          if (targetReelJourney || journeys[0]) {
            setShareJourney(targetReelJourney || journeys[0]);
          }
        }}
      />

      {/* 5. Share Journey Modal */}
      <ShareJourneyModal
        isOpen={Boolean(shareJourney)}
        onClose={() => setShareJourney(null)}
        journey={shareJourney}
        userName={user?.displayName || user?.email?.split('@')[0] || (isMr ? 'पुणेकर' : 'Explorer')}
        isMr={isMr}
      />

      {/* 6. Travel Memory Moment Modal */}
      <MemoryMomentModal
        isOpen={Boolean(memoryJourney)}
        onClose={() => setMemoryJourney(null)}
        journey={memoryJourney}
        isMr={isMr}
        onPlayReel={(selectedJ) => {
          const toPlay = selectedJ || memoryJourney || targetReelJourney || journeys[0];
          setMemoryJourney(null);
          handleOpenCreateReel(toPlay);
        }}
        onShare={() => {
          const toShare = memoryJourney;
          setMemoryJourney(null);
          setShareJourney(toShare);
        }}
      />

      {/* 7. Guest Lock Modal */}
      <GuestLockModal
        isOpen={isGuestLockOpen}
        onClose={() => setIsGuestLockOpen(false)}
        featureName="creating a reel"
        featureNameMr="सिनेमॅटिक रील बनवण्यासाठी"
        redirectUrl="/login?redirect=/journey"
      />
    </div>
  );
}

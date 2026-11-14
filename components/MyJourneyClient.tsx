'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getActiveTrip, ActiveTrip } from '@/lib/activeTrip';
import { getSavedPlaces, toggleSavedPlace, SavedPlaceSummary } from '@/lib/savedPlaces';
import {
  DayJourney,
  getAllJourneys,
  buildUserJourneysFromVisits,
  SEED_JOURNEYS,
} from '@/lib/journeyStorage';
import {
  getAllMemories,
  getAllDestinationVisits,
  getAllProjectDrafts,
  getAllRenderedExports,
  MemoryMediaItem,
  DestinationVisitRecord,
  ReelProjectDraft,
  RenderedExportRecord,
  saveMemoryItem,
} from '@/lib/memoryAlbumStorage';
import { ALL_STRUCTURED_PLACES, StructuredPlace } from '@/lib/chatKnowledgeEngine';
import { JourneyReelData, getSavedReels } from '@/lib/journeyReel';

// Master Journey Views
import JourneySidebar, { JourneyViewKey } from '@/components/journey/JourneySidebar';
import JourneyDashboardView from '@/components/journey/JourneyDashboardView';
import MyPlacesView from '@/components/journey/MyPlacesView';
import DestinationMemoryDetailsView from '@/components/journey/DestinationMemoryDetailsView';
import MyMemoriesView from '@/components/journey/MyMemoriesView';
import DayJourneyView from '@/components/journey/DayJourneyView';
import MonthlyJourneyView from '@/components/journey/MonthlyJourneyView';
import ReelStudioView from '@/components/journey/ReelStudioView';
import SavedReelsView from '@/components/journey/SavedReelsView';
import TravelTimelineMapView from '@/components/journey/TravelTimelineMapView';
import AchievementsView from '@/components/journey/AchievementsView';
import JourneySettingsView from '@/components/journey/JourneySettingsView';

// Modals
import JourneyTimelineModal from '@/components/journey/JourneyTimelineModal';
import CreateJourneyModal from '@/components/journey/CreateJourneyModal';
import CreateJourneyReelModal from '@/components/CreateJourneyReelModal';
import JourneyReelPlayerModal from '@/components/JourneyReelPlayerModal';
import ShareJourneyModal from '@/components/ShareJourneyModal';
import GuestLockModal from '@/components/GuestLockModal';
import { Loader2 } from 'lucide-react';

export default function MyJourneyClient() {
  const { isMr } = useLanguage();
  const { user, ready } = useAuth();

  // Active view across the 10 connected modules
  const [activeView, setActiveView] = useState<JourneyViewKey>('dashboard');

  // Selected place for focused details or reel studio
  const [selectedPlace, setSelectedPlace] = useState<StructuredPlace | null>(null);
  const [activeDraft, setActiveDraft] = useState<ReelProjectDraft | null>(null);

  // Core Data States
  const [loading, setLoading] = useState(true);
  const [journeys, setJourneys] = useState<DayJourney[]>([]);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaceSummary[]>([]);
  const [memories, setMemories] = useState<MemoryMediaItem[]>([]);
  const [visits, setVisits] = useState<DestinationVisitRecord[]>([]);
  const [projectDrafts, setProjectDrafts] = useState<ReelProjectDraft[]>([]);
  const [renderedExports, setRenderedExports] = useState<RenderedExportRecord[]>([]);
  const [savedReelsLegacy, setSavedReelsLegacy] = useState<JourneyReelData[]>([]);

  // Modals
  const [selectedTimelineJourney, setSelectedTimelineJourney] = useState<DayJourney | null>(null);
  const [isCreateJourneyOpen, setIsCreateJourneyOpen] = useState(false);
  const [isLegacyReelModalOpen, setIsLegacyReelModalOpen] = useState(false);
  const [activePlayerReel, setActivePlayerReel] = useState<any | null>(null);
  const [shareJourney, setShareJourney] = useState<DayJourney | null>(null);
  const [isGuestLockOpen, setIsGuestLockOpen] = useState(false);

  // Load all user records
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      setActiveTrip(getActiveTrip());
      setSavedPlaces(getSavedPlaces());
      setMemories(getAllMemories(user?.uid));
      setVisits(getAllDestinationVisits(user?.uid));
      setProjectDrafts(getAllProjectDrafts(user?.uid));
      setRenderedExports(getAllRenderedExports(user?.uid));
      setSavedReelsLegacy(getSavedReels(user?.uid));

      if (!user) {
        // Guest mode: load seed/guest journeys
        const guestJourneys = getAllJourneys(null, true);
        setJourneys(guestJourneys);
        return;
      }

      // Authenticated User: Load visits & enrich from Firestore
      const visitsSnap = await getDocs(
        query(collection(db, 'visits'), where('user_id', '==', user.uid))
      );
      const fsVisits = visitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

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
        console.warn('Places fetch warning:', err);
      }

      const currentActiveTrip = getActiveTrip();
      const realJourneys = buildUserJourneysFromVisits(fsVisits, placesMap, currentActiveTrip);
      const localUserJourneys = getAllJourneys(user.uid, false);

      const mergedMap = new Map<string, DayJourney>();
      for (const j of localUserJourneys) mergedMap.set(j.id || j.date, j);
      for (const j of realJourneys) mergedMap.set(j.id || j.date, j);

      const finalJourneys = Array.from(mergedMap.values());
      finalJourneys.sort((a, b) => b.date.localeCompare(a.date));

      if (finalJourneys.length === 0) {
        setJourneys(getAllJourneys(user.uid, true));
      } else {
        setJourneys(finalJourneys);
      }
    } catch (err) {
      console.error('Failed to load journey records:', err);
      setJourneys(getAllJourneys(null, true));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAllData();

    // Check URL query parameters for deep linking
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') as JourneyViewKey;
      if (
        viewParam &&
        [
          'dashboard',
          'places',
          'details',
          'memories',
          'day',
          'month',
          'studio',
          'saved_reels',
          'timeline',
          'achievements',
          'settings',
        ].includes(viewParam)
      ) {
        setActiveView(viewParam);
      }
      const placeParam = params.get('place');
      if (placeParam) {
        const found = ALL_STRUCTURED_PLACES.find((p) => p.id === placeParam || p.slug === placeParam);
        if (found) setSelectedPlace(found);
      }
    }

    const handleSync = () => {
      setMemories(getAllMemories(user?.uid));
      setVisits(getAllDestinationVisits(user?.uid));
      setProjectDrafts(getAllProjectDrafts(user?.uid));
      setRenderedExports(getAllRenderedExports(user?.uid));
      setSavedPlaces(getSavedPlaces());
      setSavedReelsLegacy(getSavedReels(user?.uid));
    };

    window.addEventListener('explore-pune-memories-changed', handleSync);
    window.addEventListener('explore-pune-visit-logged', handleSync);
    window.addEventListener('explore-pune-drafts-changed', handleSync);
    window.addEventListener('explore-pune-exports-changed', handleSync);
    window.addEventListener('explore-pune-saved-changed', handleSync);
    window.addEventListener('explore-pune-journeys-changed', handleSync);

    return () => {
      window.removeEventListener('explore-pune-memories-changed', handleSync);
      window.removeEventListener('explore-pune-visit-logged', handleSync);
      window.removeEventListener('explore-pune-drafts-changed', handleSync);
      window.removeEventListener('explore-pune-exports-changed', handleSync);
      window.removeEventListener('explore-pune-saved-changed', handleSync);
      window.removeEventListener('explore-pune-journeys-changed', handleSync);
    };
  }, [loadAllData, user?.uid]);

  // Visited places list computed from visits & journeys
  const visitedPlacesList = useMemo(() => {
    const visitedSlugs = new Set<string>();
    visits.forEach((v) => {
      if (v.placeId) visitedSlugs.add(v.placeId);
      if (v.placeSlug) visitedSlugs.add(v.placeSlug);
    });
    journeys.forEach((j) => {
      j.places.forEach((p) => {
        if (p.isVisited && p.placeId) visitedSlugs.add(p.placeId);
      });
    });

    return ALL_STRUCTURED_PLACES.filter(
      (p) => visitedSlugs.has(p.id) || visitedSlugs.has(p.slug)
    );
  }, [visits, journeys]);

  // Navigation Handler with URL sync
  const handleNavigateView = (view: JourneyViewKey, contextData?: any) => {
    setActiveView(view);
    if (contextData?.place) {
      setSelectedPlace(contextData.place);
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Place click-through handlers
  const handleSelectPlaceDetails = (place: StructuredPlace) => {
    setSelectedPlace(place);
    handleNavigateView('details', { place });
  };

  const handleLaunchPlaceReel = (place: StructuredPlace) => {
    setSelectedPlace(place);
    handleNavigateView('studio', { place });
  };

  const handleToggleSavePlace = (place: StructuredPlace) => {
    toggleSavedPlace({
      id: place.id,
      slug: place.slug,
      name: place.name,
      name_mr: place.name_mr,
      category: place.category,
      image_url: place.image_url,
    });
    setSavedPlaces(getSavedPlaces());
  };

  // Resume a project draft in Reel Studio
  const handleResumeDraft = (draft: ReelProjectDraft) => {
    setActiveDraft(draft);
    const foundPlace = ALL_STRUCTURED_PLACES.find(
      (p) => p.id === draft.placeId || p.slug === draft.placeId
    );
    if (foundPlace) setSelectedPlace(foundPlace);
    handleNavigateView('studio');
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
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Unified Application Layout: Sidebar + Main Content View */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 260px) 1fr',
            gap: 24,
            alignItems: 'start',
          }}
          className="journey-grid-layout"
        >
          {/* 1. Left Sidebar Navigation */}
          <JourneySidebar
            activeView={activeView}
            onViewChange={handleNavigateView}
            stats={{
              visitedPlaces: visitedPlacesList.length,
              totalMemories: memories.length,
              totalReels: renderedExports.length + savedReelsLegacy.length,
              totalDrafts: projectDrafts.length,
              achievementsUnlocked: Math.min(8, Math.floor(visitedPlacesList.length / 2) + 1),
            }}
            isMr={isMr}
            selectedPlaceName={selectedPlace ? (isMr && selectedPlace.name_mr ? selectedPlace.name_mr : selectedPlace.name) : undefined}
          />

          {/* 2. Right Main View Panel */}
          <main style={{ minWidth: 0, width: '100%' }}>
            {loading && journeys.length === 0 ? (
              <div
                style={{
                  padding: '80px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  color: '#64748b',
                }}
              >
                <Loader2 size={36} className="animate-spin" color="#ea580c" />
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {isMr ? 'तुमचा प्रवास व आठवणी लोड करत आहे…' : 'Loading your travel memories & platform…'}
                </span>
              </div>
            ) : (
              <div>
                {/* View 1: Journey Dashboard */}
                {activeView === 'dashboard' && (
                  <JourneyDashboardView
                    user={user}
                    isMr={isMr}
                    journeys={journeys}
                    visitedPlaces={visitedPlacesList}
                    allMemories={memories}
                    savedReelsCount={renderedExports.length + savedReelsLegacy.length}
                    draftsCount={projectDrafts.length}
                    recentVisits={visits}
                    onNavigate={handleNavigateView}
                    onOpenAddMemory={() => handleNavigateView('memories')}
                    onOpenPlanJourney={() => setIsCreateJourneyOpen(true)}
                    onSelectPlaceDetails={handleSelectPlaceDetails}
                  />
                )}

                {/* View 2: My Places (106 Pune Destinations) */}
                {activeView === 'places' && (
                  <MyPlacesView
                    allPlaces={ALL_STRUCTURED_PLACES}
                    savedPlaces={savedPlaces}
                    allMemories={memories}
                    allVisits={visits}
                    isMr={isMr}
                    onSelectPlaceDetails={handleSelectPlaceDetails}
                    onCreatePlaceReel={handleLaunchPlaceReel}
                    onAddPlacePhotos={(place) => {
                      setSelectedPlace(place);
                      handleNavigateView('details', { place });
                    }}
                    onToggleSavePlace={handleToggleSavePlace}
                  />
                )}

                {/* View 3: Destination Memory Details */}
                {activeView === 'details' && (
                  <DestinationMemoryDetailsView
                    place={selectedPlace || ALL_STRUCTURED_PLACES[0]}
                    userMemories={memories.filter(
                      (m) =>
                        m.placeId === (selectedPlace?.id || ALL_STRUCTURED_PLACES[0].id) ||
                        m.placeId === (selectedPlace?.slug || ALL_STRUCTURED_PLACES[0].slug)
                    )}
                    visits={visits.filter(
                      (v) =>
                        v.placeId === (selectedPlace?.id || ALL_STRUCTURED_PLACES[0].id) ||
                        v.placeId === (selectedPlace?.slug || ALL_STRUCTURED_PLACES[0].slug)
                    )}
                    isMr={isMr}
                    userId={user?.uid}
                    onBack={() => handleNavigateView('places')}
                    onCreateLocationReel={handleLaunchPlaceReel}
                  />
                )}

                {/* View 4: My Memories (Digital Travel Album) */}
                {activeView === 'memories' && (
                  <MyMemoriesView
                    allMemories={memories}
                    allPlaces={ALL_STRUCTURED_PLACES}
                    isMr={isMr}
                    userId={user?.uid}
                    onOpenCreateReel={() => handleNavigateView('studio')}
                  />
                )}

                {/* View 5: Day Journey ("MY DAY IN PUNE") */}
                {activeView === 'day' && (
                  <DayJourneyView
                    journeys={journeys}
                    allMemories={memories}
                    allPlaces={ALL_STRUCTURED_PLACES}
                    isMr={isMr}
                    onOpenCreateReelForJourney={(j) => {
                      const firstPlace = ALL_STRUCTURED_PLACES.find((p) => p.name === j.places[0]?.placeName);
                      if (firstPlace) setSelectedPlace(firstPlace);
                      handleNavigateView('studio');
                    }}
                    onPlanNewJourney={() => setIsCreateJourneyOpen(true)}
                  />
                )}

                {/* View 6: Monthly Journey ("MY MONTH IN PUNE") */}
                {activeView === 'month' && (
                  <MonthlyJourneyView
                    journeys={journeys}
                    allVisits={visits}
                    allMemories={memories}
                    allPlaces={ALL_STRUCTURED_PLACES}
                    isMr={isMr}
                    onLaunchMonthlyReel={({ monthPrefix, durationTier }) => {
                      handleNavigateView('studio');
                    }}
                    onSelectPlaceDetails={handleSelectPlaceDetails}
                  />
                )}

                {/* View 7: Reel Studio & 9:16 Cinematic Video Editor */}
                {activeView === 'studio' && (
                  <ReelStudioView
                    initialPlace={selectedPlace}
                    allPlaces={ALL_STRUCTURED_PLACES}
                    isMr={isMr}
                    userId={user?.uid}
                    initialDraft={activeDraft}
                    onSavedReelCreated={(exp) => {
                      setRenderedExports(getAllRenderedExports(user?.uid));
                    }}
                  />
                )}

                {/* View 8: Saved Reels & Project Drafts */}
                {activeView === 'saved_reels' && (
                  <SavedReelsView
                    savedExports={renderedExports}
                    savedDrafts={projectDrafts}
                    isMr={isMr}
                    userId={user?.uid}
                    onResumeDraft={handleResumeDraft}
                    onPlayReel={(reel) => setActivePlayerReel(reel)}
                    onLaunchNewReel={() => handleNavigateView('studio')}
                  />
                )}

                {/* View 9: Travel Timeline & Map */}
                {activeView === 'timeline' && (
                  <TravelTimelineMapView
                    allVisits={visits}
                    allPlaces={ALL_STRUCTURED_PLACES}
                    isMr={isMr}
                    onSelectPlaceDetails={handleSelectPlaceDetails}
                  />
                )}

                {/* View 10: Travel Achievements & Milestones */}
                {activeView === 'achievements' && (
                  <AchievementsView
                    allVisits={visits}
                    allMemories={memories}
                    savedExports={renderedExports}
                    allPlaces={ALL_STRUCTURED_PLACES}
                    isMr={isMr}
                  />
                )}

                {/* View 11: Settings & Traveler Profile */}
                {activeView === 'settings' && (
                  <JourneySettingsView user={user} isMr={isMr} />
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <CreateJourneyModal
        isOpen={isCreateJourneyOpen}
        onClose={() => setIsCreateJourneyOpen(false)}
        onJourneyCreated={(newJ) => {
          setJourneys((prev) => [newJ, ...prev]);
          handleNavigateView('day');
        }}
        userId={user?.uid}
      />

      <JourneyTimelineModal
        isOpen={Boolean(selectedTimelineJourney)}
        onClose={() => setSelectedTimelineJourney(null)}
        journey={selectedTimelineJourney}
        onJourneyUpdated={(updated) => {
          setJourneys((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
        }}
        onJourneyDeleted={(delId) => {
          setJourneys((prev) => prev.filter((j) => j.id !== delId && j.date !== delId));
        }}
        onCreateReel={(j) => {
          setSelectedTimelineJourney(null);
          handleNavigateView('studio');
        }}
        onShare={(j) => setShareJourney(j)}
        userId={user?.uid}
      />

      <ShareJourneyModal
        isOpen={Boolean(shareJourney)}
        onClose={() => setShareJourney(null)}
        journey={shareJourney}
        userName={user?.displayName || user?.email?.split('@')[0] || (isMr ? 'पुणेकर' : 'Explorer')}
        isMr={isMr}
      />

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

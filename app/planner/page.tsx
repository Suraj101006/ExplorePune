'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Image import removed — not used in this file
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import { downloadItineraryPdf } from '@/lib/generateItineraryPdf';
import { speakPlaceName } from '@/lib/speech';
import {
  getActiveTrip,
  saveActiveTrip,
  updateActiveTripCurrentStop,
  markStopVisited,
  clearActiveTrip,
  ActiveTrip,
  ActiveTripStop,
} from '@/lib/activeTrip';
import {
  saveJourney,
  toggleJourneyStopVisited,
  DayJourney,
  JourneyPlaceStop,
  calculateJourneyTotalDistance,
} from '@/lib/journeyStorage';
import {
  getStoredUserLocation,
  DEFAULT_PUNE_STATIC_LOCATION,
  detectBrowserGps,
} from '@/lib/userLocation';
import TravelCompass from '@/components/TravelCompass';

function getAtmosphereClass(hourOrTime?: string | number): string {
  let hour = 12;
  if (typeof hourOrTime === 'number') {
    hour = hourOrTime;
  } else if (typeof hourOrTime === 'string') {
    const parts = hourOrTime.split(':');
    if (parts.length > 0) hour = parseInt(parts[0], 10) || 12;
  } else {
    hour = new Date().getHours();
  }
  if (hour >= 5 && hour < 11) return 'travel-atmosphere-morning';
  if (hour >= 11 && hour < 17) return 'travel-atmosphere-afternoon';
  if (hour >= 17 && hour < 20) return 'travel-atmosphere-evening';
  return 'travel-atmosphere-night';
}

const STARTS: Record<string, { coords: [number, number]; mr: string }> = {
  'Central Pune (Shaniwar Wada)': { coords: [18.5204, 73.8567], mr: 'मध्यवर्ती पुणे (शनिवार वाडा)' },
  'Pune Railway Station': { coords: [18.5289, 73.8744], mr: 'पुणे रेल्वे स्टेशन' },
  'Swargate Bus Terminal': { coords: [18.5018, 73.8636], mr: 'स्वारगेट बस स्थानक' },
  'Deccan Gymkhana (FC Road)': { coords: [18.5167, 73.8409], mr: 'डेक्कन जिमखाना (एफसी रोड)' },
  'Shivajinagar': { coords: [18.5308, 73.8475], mr: 'शिवाजीनगर' },
  'Kothrud (Vanaz Metro)': { coords: [18.5074, 73.8077], mr: 'कोथरूड (वनाज मेट्रो)' },
  'Hinjewadi IT Park': { coords: [18.5912, 73.7389], mr: 'हिंजवडी आयटी पार्क' },
  'Hadapsar Gadital': { coords: [18.5089, 73.9259], mr: 'हडपसर गाडीतळ' },
};

const INTERESTS: Array<{ key: string; en: string; mr: string; icon: string }> = [
  { key: 'heritage', en: 'Heritage & Architecture', mr: 'वास्तू आणि इतिहास', icon: '🏛️' },
  { key: 'forts', en: 'Forts & Sahyadri Trails', mr: 'किल्ले व सह्याद्री ट्रेक', icon: '🏰' },
  { key: 'temples', en: 'Temples & Sacred Sites', mr: 'प्रसिद्ध मंदिरे व देवस्थान', icon: '🛕' },
  { key: 'museums', en: 'Museums & Art', mr: 'वस्तुसंग्रहालये व कला', icon: '🖼️' },
  { key: 'parks', en: 'Parks & Botanical Gardens', mr: 'उद्याने व बागा', icon: '🌳' },
  { key: 'nature', en: 'Lakes, Ghats & Viewpoints', mr: 'तलाव व निसर्गरम्य स्थळे', icon: '🌄' },
];

export default function PlannerPage() {
  const { isMr, t } = useLanguage();
  const { user } = useAuth();
  const [duration, setDuration] = useState(180);
  const [mode, setMode] = useState('public_transit');
  const [budget, setBudget] = useState('500');
  const [start, setStart] = useState('Central Pune (Shaniwar Wada)');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [time, setTime] = useState('09:30');
  const [interests, setInterests] = useState<string[]>([]);
  const [includeUnverified, setIncludeUnverified] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState('');
  const [planningStep, setPlanningStep] = useState(0);

  // Email Itinerary / PDF Dispatch State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [itineraryUserName, setItineraryUserName] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  // Pre-fill email and user name when authenticated
  useEffect(() => {
    if (user?.email && !emailAddress) {
      setEmailAddress(user.email);
    }
    if (user?.displayName && !itineraryUserName) {
      setItineraryUserName(user.displayName);
    }
  }, [user, emailAddress, itineraryUserName]);

  // Active / Guided Trip State (Persisted for later milestones & history)
  const [savedOngoingTrip, setSavedOngoingTrip] = useState<ActiveTrip | null>(null);
  const [activeGuidedTrip, setActiveGuidedTrip] = useState<ActiveTrip | null>(null);
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [checkinNotice, setCheckinNotice] = useState<string>('');

  useEffect(() => {
    const syncActiveTrip = () => {
      const saved = getActiveTrip();
      setSavedOngoingTrip(saved);
      if (saved && !saved.isCompleted) {
        setActiveGuidedTrip(saved);
      }
    };
    syncActiveTrip();
    window.addEventListener('explore-pune-active-trip-changed', syncActiveTrip);
    return () => window.removeEventListener('explore-pune-active-trip-changed', syncActiveTrip);
  }, []);

  const handleGetGps = async () => {
    setIsLocatingGps(true);
    setGpsErrorMsg('');
    try {
      const result = await detectBrowserGps();
      if (result.success && result.location) {
        setUserCoords({ lat: result.location.lat, lng: result.location.lng });
        setStart('my-live-gps');
        setGpsAccuracy(result.accuracyMeters || 10);
      } else {
        setGpsErrorMsg(result.error || (isMr ? 'GPS स्थान मिळवता आले नाही.' : 'Could not acquire GPS position.'));
      }
    } catch {
      setGpsErrorMsg(isMr ? 'GPS सेन्सर सुरू करताना त्रुटी आली.' : 'Failed to connect to device GPS.');
    } finally {
      setIsLocatingGps(false);
    }
  };

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setPlanningStep(0);
    setError('');
    setResult(null);
    setSelectedPlanIndex(0);
    setPdfSuccess('');
    setIsGuidedMode(false);

    const startTime = Date.now();
    const progressTimer = setInterval(() => {
      setPlanningStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 140);

    const [h, m] = time.split(':').map(Number);
    let lat = 18.5204;
    let lng = 73.8567;
    if (start === 'my-live-gps' && userCoords) {
      lat = userCoords.lat;
      lng = userCoords.lng;
    } else {
      const startObj = STARTS[start] || STARTS['Central Pune (Shaniwar Wada)'];
      lat = startObj.coords[0];
      lng = startObj.coords[1];
    }

    try {
      const res = await fetch('/api/v1/itineraries/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availableMinutes: duration,
          mode,
          budgetPerPerson: budget ? Number(budget) : undefined,
          includeUnverified,
          interests,
          startMinuteOfDay: h * 60 + m,
          start: { lat, lng },
        }),
      });
      const json = await res.json();

      // Ensure calm 650ms progress animation so user sees the step sequence (Requirement 9)
      const elapsed = Date.now() - startTime;
      if (elapsed < 650) {
        await new Promise((resolve) => setTimeout(resolve, 650 - elapsed));
      }

      if (json.data) {
        setResult(json.data);
      } else {
        setError(
          json.error?.message ??
            (isMr ? 'मार्ग तयार करता आला नाही. कृपया वेळ वाढवा.' : 'Could not build a plan. Please try again.')
        );
      }
    } catch {
      setError(isMr ? 'संपर्क त्रुटी आली. कृपया इंटरनेट तपासा.' : 'Connection failure. Check your network connection.');
    } finally {
      clearInterval(progressTimer);
      setPlanningStep(4);
      setLoading(false);
    }
  }

  const toggle = (k: string) =>
    setInterests((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  // Active plan selection
  const plans: any[] = result?.plans && result.plans.length > 0 ? result.plans : result ? [result] : [];
  const activePlan = plans[selectedPlanIndex] || plans[0] || result;

  // Start Guided Trip from Selected Plan
  const handleStartGuidedTrip = (plan: any) => {
    if (!plan || !plan.stops || plan.stops.length === 0) return;
    const startLabel =
      start === 'my-live-gps'
        ? isMr ? 'माझे थेट GPS स्थान' : 'My Live GPS'
        : STARTS[start] && isMr ? STARTS[start].mr : start;

    const stops: ActiveTripStop[] = plan.stops.map((s: any, idx: number) => ({
      index: idx + 1,
      placeId: s.placeId,
      placeSlug: s.placeSlug,
      placeName: s.placeName,
      placeNameMr: s.placeName_mr,
      arrivalTime: s.arrivalTime,
      departureTime: s.departureTime,
      visitMinutes: s.visitMinutes,
      travelMinutes: s.travelMinutes,
      entryCost: s.entryCost,
      latitude: s.latitude,
      longitude: s.longitude,
      image_url: s.image_url,
      transitDetails: s.transitDetails,
      isVisited: false,
    }));

    const trip: ActiveTrip = {
      id: `trip_${Date.now()}`,
      planIndex: selectedPlanIndex,
      titleEn: plan.titleEn || `Plan ${selectedPlanIndex + 1}`,
      titleMr: plan.titleMr || `पर्याय ${selectedPlanIndex + 1}`,
      themeEn: plan.themeEn || '',
      themeMr: plan.themeMr || '',
      badge: plan.badge || '🗺️',
      startLocation: startLabel,
      startTime: time,
      travelMode: mode,
      totalDurationMinutes: plan.totalDurationMinutes || 0,
      knownCost: plan.knownCost || 0,
      stops,
      currentStopIndex: 0,
      isCompleted: false,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveActiveTrip(trip);
    setActiveGuidedTrip(trip);
    setSavedOngoingTrip(trip);
    setIsGuidedMode(true);

    // Synchronize to My Journey as today's active journey
    try {
      const todayIso = new Date().toISOString().slice(0, 10);
      const dayStops: JourneyPlaceStop[] = stops.map((s, idx) => ({
        placeId: s.placeId,
        placeSlug: s.placeSlug,
        placeName: s.placeName,
        placeNameMr: s.placeNameMr,
        category: 'heritage',
        categoryName: 'Pune Exploration',
        categoryNameMr: 'पुणे दर्शन',
        image_url: s.image_url,
        description: '',
        latitude: s.latitude ?? 18.5204,
        longitude: s.longitude ?? 73.8567,
        arrivalTime: s.arrivalTime,
        departureTime: s.departureTime,
        visitDurationMinutes: s.visitMinutes,
        isVisited: Boolean(s.isVisited),
        order: idx + 1,
      }));

      const firstStop = trip.stops[0];
      const startCoords =
        firstStop?.latitude != null && firstStop?.longitude != null
          ? { lat: firstStop.latitude, lng: firstStop.longitude }
          : undefined;

      const validMode = (['walking', 'cycling', 'driving', 'public_transit'].includes(trip.travelMode)
        ? trip.travelMode
        : 'public_transit') as 'walking' | 'cycling' | 'driving' | 'public_transit';

      const dayJourney: DayJourney = {
        id: `journey-${todayIso}`,
        date: todayIso,
        dateLabelEn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        dateLabelMr: `${new Date().getDate()} ${new Date().toLocaleDateString('mr-IN', { month: 'long' })} २०२६`,
        title: trip.titleEn,
        titleMr: trip.titleMr,
        theme: trip.themeEn,
        themeMr: trip.themeMr,
        startLocation: trip.startLocation,
        startLocationMr: trip.startLocation,
        startCoords,
        startTime: trip.startTime,
        endTime: trip.stops[trip.stops.length - 1]?.departureTime || '06:00 PM',
        travelMode: validMode,
        status: 'active',
        totalDurationMinutes: trip.totalDurationMinutes,
        totalDistanceKm: 0,
        notes: 'Curated with Explore Pune Trip Planner',
        places: dayStops,
      };
      dayJourney.totalDistanceKm = calculateJourneyTotalDistance(dayJourney);
      saveJourney(dayJourney);
    } catch (err) {
      console.warn('Could not sync to My Journey:', err);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeTrip = () => {
    if (savedOngoingTrip) {
      setActiveGuidedTrip(savedOngoingTrip);
      setIsGuidedMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDiscardTrip = () => {
    if (confirm(isMr ? 'चालू सहल रद्द करायची आहे का?' : 'Discard ongoing trip progress?')) {
      clearActiveTrip();
      setSavedOngoingTrip(null);
      setActiveGuidedTrip(null);
      setIsGuidedMode(false);
    }
  };

  const handleToggleCheckin = (placeId: string) => {
    if (!activeGuidedTrip) return;
    const currStop = activeGuidedTrip.stops.find((s) => s.placeId === placeId);
    const willBeVisited = !currStop?.isVisited;
    const updated = markStopVisited(placeId, willBeVisited);
    if (updated) {
      setActiveGuidedTrip({ ...updated });
      setSavedOngoingTrip({ ...updated });

      try {
        const todayIso = new Date().toISOString().slice(0, 10);
        toggleJourneyStopVisited(`journey-${todayIso}`, placeId, willBeVisited);
      } catch {
        // Ignore if storage sync fails
      }

      if (willBeVisited) {
        setCheckinNotice(
          isMr
            ? `🎉 अभिनंदन! "${currStop?.placeNameMr || currStop?.placeName}" येथे भेट नोंदवली गेली!`
            : `🎉 Awesome! "${currStop?.placeName}" marked as visited!`
        );
        setTimeout(() => setCheckinNotice(''), 4500);

        // Auto advance to next unvisited stop if available
        const nextUnvisitedIdx = updated.stops.findIndex(
          (s, idx) => !s.isVisited && idx > updated.currentStopIndex
        );
        if (nextUnvisitedIdx >= 0) {
          updateActiveTripCurrentStop(nextUnvisitedIdx);
          setActiveGuidedTrip({ ...updated, currentStopIndex: nextUnvisitedIdx });
        }
      }
    }
  };

  const handleSelectStep = (idx: number) => {
    if (!activeGuidedTrip) return;
    const updated = updateActiveTripCurrentStop(idx);
    if (updated) {
      setActiveGuidedTrip({ ...updated });
    }
  };

  const handleSpeak = (text: string) => {
    setSpeakingText(text);
    speakPlaceName(text, isMr);
    setTimeout(() => setSpeakingText(null), 2500);
  };

  const handleDownloadPdf = () => {
    const planToExport = isGuidedMode && activeGuidedTrip ? activeGuidedTrip : activePlan;
    if (!planToExport) return;
    setDownloadingPdf(true);
    setPdfSuccess('');

    try {
      const planTitle = isMr
        ? planToExport.titleMr || planToExport.titleEn || 'पुणे सहल आराखडा'
        : planToExport.titleEn || 'Explore Pune Itinerary';
      const planTheme = isMr
        ? planToExport.themeMr || planToExport.themeEn || ''
        : planToExport.themeEn || '';

      const startLabel =
      start === 'my-live-gps'
        ? isMr ? 'माझे थेट GPS स्थान' : 'My Live GPS'
        : STARTS[start] && isMr ? STARTS[start].mr : start;

      const profileName =
        itineraryUserName.trim() ||
        user?.displayName ||
        (user?.email ? user.email.split('@')[0] : '') ||
        (isMr ? 'पुणे पर्यटक' : 'Pune Explorer');

      downloadItineraryPdf({
        userName: profileName,
        userEmail: user?.email || undefined,
        planTitle,
        planTitleMr: planToExport.titleMr,
        planTheme,
        planThemeMr: planToExport.themeMr,
        badge: planToExport.badge || '🗺️',
        startLocationName: startLabel,
        startTime: time,
        travelMode: mode,
        totalDurationMinutes: planToExport.totalDurationMinutes || 0,
        bufferMinutes: (planToExport as any).bufferMinutes || 0,
        estimatedCost: planToExport.knownCost || 0,
        isMr,
        stops: (planToExport.stops || []).map((s: any, idx: number) => ({
          index: idx + 1,
          name: isMr ? s.placeName_mr || s.placeName : s.placeName,
          nameMr: s.placeName_mr,
          arrivalTime: s.arrivalTime,
          departureTime: s.departureTime,
          visitMinutes: s.visitMinutes,
          travelMinutes: s.travelMinutes,
          entryCost: s.entryCost,
          transitSummary: isMr ? s.transitDetails?.summaryMr || s.transitDetails?.summaryEn : s.transitDetails?.summaryEn,
          transitStepByStep: isMr ? s.transitDetails?.stepByStepMr || s.transitDetails?.stepByStepEn : s.transitDetails?.stepByStepEn,
          nearestMetro: isMr
            ? s.transitDetails?.nearestMetro?.stationNameMr || s.transitDetails?.nearestMetro?.stationNameEn
            : s.transitDetails?.nearestMetro?.stationNameEn,
          nearestBus: isMr
            ? s.transitDetails?.nearestBus?.stopNameMr || s.transitDetails?.nearestBus?.stopNameEn
            : s.transitDetails?.nearestBus?.stopNameEn,
          ticketInfo: isMr ? s.transitDetails?.ticketInfoMr || s.transitDetails?.ticketInfoEn : s.transitDetails?.ticketInfoEn,
        })),
        warnings: (planToExport as any).warnings || [],
      });

      setPdfSuccess(isMr ? '✓ PDF यशस्वीरीत्या डाऊनलोड झाली!' : '✓ PDF downloaded successfully!');
      setTimeout(() => setPdfSuccess(''), 5000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setDownloadingPdf(false), 600);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailAddress.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setEmailError(isMr ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा.' : 'Please enter a valid email address.');
      return;
    }

    const planToExport = isGuidedMode && activeGuidedTrip ? activeGuidedTrip : activePlan;
    if (!planToExport) return;

    setSendingEmail(true);
    setEmailError('');
    setEmailSuccess('');

    try {
      const planTitle = isMr
        ? planToExport.titleMr || planToExport.titleEn || 'पुणे सहल आराखडा'
        : planToExport.titleEn || 'Explore Pune Itinerary';
      const planTheme = isMr
        ? planToExport.themeMr || planToExport.themeEn || ''
        : planToExport.themeEn || '';

      const startLabel =
      start === 'my-live-gps'
        ? isMr ? 'माझे थेट GPS स्थान' : 'My Live GPS'
        : STARTS[start] && isMr ? STARTS[start].mr : start;

      const profileName =
        itineraryUserName.trim() ||
        user?.displayName ||
        (cleanEmail ? cleanEmail.split('@')[0] : '') ||
        (isMr ? 'पुणे पर्यटक' : 'Pune Explorer');

      const itineraryData = {
        userName: profileName,
        planTitle,
        planTitleMr: planToExport.titleMr,
        planTheme,
        planThemeMr: planToExport.themeMr,
        badge: planToExport.badge || '🗺️',
        startLocationName: startLabel,
        startTime: time,
        travelMode: mode,
        totalDurationMinutes: planToExport.totalDurationMinutes || 0,
        bufferMinutes: (planToExport as any).bufferMinutes || 0,
        estimatedCost: planToExport.knownCost || 0,
        isMr,
        stops: (planToExport.stops || []).map((s: any, idx: number) => ({
          index: idx + 1,
          name: isMr ? s.placeName_mr || s.placeName : s.placeName,
          nameMr: s.placeName_mr,
          arrivalTime: s.arrivalTime,
          departureTime: s.departureTime,
          visitMinutes: s.visitMinutes,
          travelMinutes: s.travelMinutes,
          entryCost: s.entryCost,
          transitSummary: isMr ? s.transitDetails?.summaryMr || s.transitDetails?.summaryEn : s.transitDetails?.summaryEn,
          transitStepByStep: isMr ? s.transitDetails?.stepByStepMr || s.transitDetails?.stepByStepEn : s.transitDetails?.stepByStepEn,
          nearestMetro: isMr
            ? s.transitDetails?.nearestMetro?.stationNameMr || s.transitDetails?.nearestMetro?.stationNameEn
            : s.transitDetails?.nearestMetro?.stationNameEn,
          nearestBus: isMr
            ? s.transitDetails?.nearestBus?.stopNameMr || s.transitDetails?.nearestBus?.stopNameEn
            : s.transitDetails?.nearestBus?.stopNameEn,
          ticketInfo: isMr ? s.transitDetails?.ticketInfoMr || s.transitDetails?.ticketInfoEn : s.transitDetails?.ticketInfoEn,
        })),
        warnings: (planToExport as any).warnings || [],
      };

      const res = await fetch('/api/v1/itineraries/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          userName: profileName,
          lang: isMr ? 'mr' : 'en',
          itineraryData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to dispatch email');
      }

      setEmailSuccess(
        data.message ||
          (isMr
            ? `✓ ${profileName} यांच्यासाठी सानुकूल आराखडा आणि अधिकृत PDF फाईल ${cleanEmail} वर पाठवली!`
            : `✓ Custom itinerary and official PDF successfully sent to ${cleanEmail} for ${profileName}!`)
      );

      // Also trigger instant browser PDF download so the user receives their PDF immediately
      try {
        downloadItineraryPdf(itineraryData);
      } catch (pdfErr) {
        console.warn('Instant PDF download notice:', pdfErr);
      }
      setTimeout(() => {
        setEmailModalOpen(false);
        setEmailSuccess('');
      }, 4000);
    } catch (err: any) {
      setEmailError(
        err?.message ||
          (isMr ? 'ईमेल पाठवता आला नाही. कृपया पुन्हा प्रयत्न करा.' : 'Could not send email. Please try again.')
      );
    } finally {
      setSendingEmail(false);
    }
  };

  const currStop = activeGuidedTrip?.stops[activeGuidedTrip.currentStopIndex];
  const visitedStopsCount = activeGuidedTrip?.stops.filter((s) => s.isVisited).length || 0;
  const totalStopsCount = activeGuidedTrip?.stops.length || 0;
  const progressPercent = totalStopsCount > 0 ? Math.round((visitedStopsCount / totalStopsCount) * 100) : 0;

  return (
    <main className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
      {/* Ongoing Saved Trip Resume Banner */}
      {savedOngoingTrip && !isGuidedMode && (
        <div
          style={{
            marginBottom: 24,
            background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
            border: '1.5px solid #10b981',
            borderRadius: 'var(--radius)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>📍</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isMr ? 'चालू सहल मार्गदर्शन उपलब्ध' : 'Saved Ongoing Trip in Progress'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                {isMr ? savedOngoingTrip.titleMr || savedOngoingTrip.titleEn : savedOngoingTrip.titleEn}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
                {savedOngoingTrip.stops.filter((s) => s.isVisited).length} / {savedOngoingTrip.stops.length}{' '}
                {isMr ? 'ठिकाणे पूर्ण' : 'stops completed'} •{' '}
                {isMr
                  ? `सध्याचे ठिकाण: ${savedOngoingTrip.stops[savedOngoingTrip.currentStopIndex]?.placeName}`
                  : `Current Stop: ${savedOngoingTrip.stops[savedOngoingTrip.currentStopIndex]?.placeName}`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleResumeTrip}
              className="btn"
              style={{
                background: '#047857',
                color: '#ffffff',
                fontWeight: 700,
                padding: '8px 18px',
                fontSize: '13px',
                borderRadius: 999,
              }}
            >
              🚀 {isMr ? 'सहल मार्गदर्शन सुरू ठेवा' : 'Resume Guided Tour'}
            </button>
            <button
              type="button"
              onClick={handleDiscardTrip}
              className="btn outline"
              style={{
                fontSize: '13px',
                padding: '8px 14px',
                borderColor: '#fca5a5',
                color: '#dc2626',
              }}
            >
              🗑️ {isMr ? 'रद्द करा' : 'Discard'}
            </button>
          </div>
        </div>
      )}

      {/* Main Page Title */}
      <div style={{ maxWidth: 740, marginBottom: 28 }}>
        <div className="hero-pill">
          <span>⚡</span> {t('planner.badge')}
        </div>
        <h1 style={{ fontSize: 32, margin: '0 0 10px' }}>{t('planner.title')}</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, margin: 0, lineHeight: 1.6 }}>
          {t('planner.sub')}
        </p>
      </div>

      {/* ===================================================================
          LIVE STEP-BY-STEP GUIDED TOUR MODE
          =================================================================== */}
      {isGuidedMode && activeGuidedTrip && currStop && (
        <section
          className={getAtmosphereClass(activeGuidedTrip.startTime)}
          style={{
            marginBottom: 36,
            background: '#ffffff',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: '0 12px 32px rgba(6, 95, 70, 0.14)',
          }}
        >
          {/* Top Tour Status Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              paddingBottom: 16,
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  🟢 {isMr ? 'थेट सहल मार्गदर्शन चालू' : 'Live Guided Tour'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                  {activeGuidedTrip.startLocation} ➔ {isMr ? activeGuidedTrip.titleMr : activeGuidedTrip.titleEn}
                </span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '6px 0 2px', color: 'var(--ink)' }}>
                {isMr ? activeGuidedTrip.titleMr || activeGuidedTrip.titleEn : activeGuidedTrip.titleEn}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link
                href="/journey?tab=today"
                className="btn outline"
                style={{
                  padding: '6px 14px',
                  fontSize: 12.5,
                  backgroundColor: '#fff7ed',
                  color: '#ea580c',
                  borderColor: '#fed7aa',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                🧭 {isMr ? 'माझी सफरीमध्ये पहा' : 'View in My Journey'}
              </Link>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="btn outline"
                style={{ padding: '6px 14px', fontSize: 12.5 }}
              >
                <span>{downloadingPdf ? '⏳' : '📥'}</span> {isMr ? 'PDF डाऊनलोड' : 'Export PDF'}
              </button>
              <button
                type="button"
                onClick={() => setIsGuidedMode(false)}
                className="btn outline"
                style={{ padding: '6px 14px', fontSize: 12.5 }}
              >
                📋 {isMr ? 'आराखडा यादी पहा' : 'View Full Plan'}
              </button>
              <button
                type="button"
                onClick={handleDiscardTrip}
                className="btn outline"
                style={{ padding: '6px 12px', fontSize: 12.5, borderColor: '#fca5a5', color: '#dc2626' }}
              >
                🗑️ {isMr ? 'सहल संपवा' : 'End Trip'}
              </button>
            </div>
          </div>

          {/* Tour Progress Bar */}
          <div style={{ margin: '18px 0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              <span>
                {isMr
                  ? `${totalStopsCount} पैकी ${visitedStopsCount} ठिकाणे पूर्ण झाली`
                  : `${visitedStopsCount} of ${totalStopsCount} Stops Completed`}
              </span>
              <span style={{ color: 'var(--primary)' }}>{progressPercent}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: 10,
                background: '#e2e8f0',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  borderRadius: 999,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* Horizontal Stops Stepper Pills */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 10,
              marginBottom: 20,
              scrollbarWidth: 'thin',
            }}
          >
            {activeGuidedTrip.stops.map((st, idx) => {
              const isCurrent = activeGuidedTrip.currentStopIndex === idx;
              return (
                <button
                  key={st.placeId}
                  type="button"
                  onClick={() => handleSelectStep(idx)}
                  style={{
                    flexShrink: 0,
                    padding: '8px 14px',
                    borderRadius: 999,
                    border: isCurrent
                      ? '2px solid var(--primary)'
                      : st.isVisited
                      ? '1px solid #10b981'
                      : '1px solid var(--line)',
                    background: isCurrent
                      ? 'var(--primary-light)'
                      : st.isVisited
                      ? '#ecfdf5'
                      : '#ffffff',
                    color: isCurrent
                      ? 'var(--primary)'
                      : st.isVisited
                      ? '#065f46'
                      : 'var(--ink-secondary)',
                    fontWeight: isCurrent ? 800 : 600,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: st.isVisited ? '#10b981' : isCurrent ? 'var(--primary)' : '#94a3b8',
                      color: '#fff',
                      fontSize: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    {st.isVisited ? '✓' : st.index}
                  </span>
                  <span>{isMr ? st.placeNameMr || st.placeName : st.placeName}</span>
                </button>
              );
            })}
          </div>

          {/* Check-in Notice Popup */}
          {checkinNotice && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1.5px solid #10b981',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 16px',
                marginBottom: 16,
                color: '#065f46',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <span>🎯</span>
              <span>{checkinNotice}</span>
            </div>
          )}

          {/* Active Stop Spotlight Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'center' }}>
              {/* Media or Visual Landmark Header */}
              <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', height: 220, background: '#cbd5e1' }}>
                <img
                  src={currStop.image_url || '/images/places/shaniwar-wada.jpg'}
                  alt={currStop.placeName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  📍 {isMr ? `ठिकाण ${currStop.index} / ${totalStopsCount}` : `Stop ${currStop.index} of ${totalStopsCount}`}
                </div>
              </div>

              {/* Stop Info and Controls */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span
                    style={{
                      background: '#e0f2fe',
                      color: '#0369a1',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {isMr ? 'सध्याचे गंतव्यस्थान' : 'Target Destination'}
                  </span>
                  {currStop.isVisited && (
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      ✓ {isMr ? 'भेट पूर्ण झाली' : 'Visited'}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px', color: 'var(--ink)' }}>
                  {isMr ? currStop.placeNameMr || currStop.placeName : currStop.placeName}
                </h3>
                {isMr && currStop.placeNameMr && (
                  <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>{currStop.placeName}</div>
                )}

                {/* Pronunciation & Audio Guide Tool */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <button
                    type="button"
                    onClick={() => handleSpeak(isMr && currStop.placeNameMr ? currStop.placeNameMr : currStop.placeName)}
                    className="chip"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      padding: '5px 12px',
                      cursor: 'pointer',
                    }}
                    title={isMr ? 'पुणेरी उच्चार ऐका' : 'Listen Native Pronunciation'}
                  >
                    <span>{speakingText ? '🔊' : '🔈'}</span>
                    <span>{speakingText ? (isMr ? 'उच्चारत आहे…' : 'Speaking…') : (isMr ? 'उच्चार ऐका' : 'Pronunciation')}</span>
                  </button>
                  <Link
                    href={`/places/${currStop.placeSlug}`}
                    target="_blank"
                    style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                  >
                    {isMr ? 'सर्व तपशील पहा ↗' : 'View Full Landmark Page ↗'}
                  </Link>
                </div>

                {/* Timing, Duration & Entry Cost Badges & Bearing Compass */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                  {currStop.latitude && currStop.longitude && (
                    <div style={{ flexShrink: 0 }}>
                      <TravelCompass
                        latitude={currStop.latitude}
                        longitude={currStop.longitude}
                        targetName={isMr ? currStop.placeNameMr || currStop.placeName : currStop.placeName}
                        isMarathi={isMr}
                        size={84}
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 13, flex: 1 }}>
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                      }}
                    >
                      <span style={{ display: 'block', fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {isMr ? 'वेळ' : 'Schedule'}
                      </span>
                      <strong style={{ color: 'var(--clay)' }}>⏰ {currStop.arrivalTime || '--'} - {currStop.departureTime || '--'}</strong>
                    </div>

                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                      }}
                    >
                      <span style={{ display: 'block', fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {isMr ? 'भेट कालावधी' : 'Duration'}
                      </span>
                      <strong>⏱️ {currStop.visitMinutes} {isMr ? 'मि.' : 'min'}</strong>
                    </div>

                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                      }}
                    >
                      <span style={{ display: 'block', fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {isMr ? 'प्रवेश शुल्क' : 'Entry Ticket'}
                      </span>
                      <strong style={{ color: '#047857' }}>
                        🎟️ {currStop.entryCost === 0 ? (isMr ? 'मोफत' : 'Free Entry') : `₹${currStop.entryCost ?? 'N/A'}`}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Primary Check-In Action Button */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleCheckin(currStop.placeId)}
                    className="btn"
                    style={{
                      background: currStop.isVisited ? '#10b981' : '#047857',
                      color: '#ffffff',
                      padding: '12px 24px',
                      fontSize: 14,
                      fontWeight: 800,
                      borderRadius: 999,
                      boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)',
                    }}
                  >
                    {currStop.isVisited
                      ? `✓ ${isMr ? 'या ठिकाणी भेट झाली (काढा)' : 'Checked In (Undo)'}`
                      : `✅ ${isMr ? 'येथे भेट दिली (Check In & Next)' : 'Mark as Visited & Advance'}`}
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${currStop.latitude || 18.5204},${currStop.longitude || 73.8567}&travelmode=${mode === 'public_transit' ? 'transit' : mode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn outline"
                    style={{ padding: '12px 20px', fontSize: 13.5, fontWeight: 700 }}
                  >
                    🗺️ {isMr ? 'Google Maps वर नेव्हिगेशन ↗' : 'Navigate on Google Maps ↗'}
                  </a>
                </div>
              </div>
            </div>

            {/* Transit Directions Leg to This Stop */}
            {currStop.transitDetails && (
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🚌</span>
                    <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                      {isMr ? 'येथपर्यंतचा थेट सार्वजनिक वाहतूक मार्ग' : 'Transit Route to This Stop'}
                    </strong>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#047857' }}>
                    {isMr ? currStop.transitDetails.summaryMr : currStop.transitDetails.summaryEn}
                  </span>
                </div>

                <ol style={{ margin: '8px 0 12px 20px', padding: 0, fontSize: 13, color: '#334155' }}>
                  {(isMr ? currStop.transitDetails.stepByStepMr : currStop.transitDetails.stepByStepEn).map(
                    (step: string, sIdx: number) => (
                      <li key={sIdx} style={{ marginBottom: 4 }}>
                        {step}
                      </li>
                    )
                  )}
                </ol>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, paddingTop: 8, borderTop: '1px dashed #cbd5e1', fontSize: 12 }}>
                  <span style={{ color: '#047857', fontWeight: 600 }}>
                    🎟️ {isMr ? currStop.transitDetails.ticketInfoMr : currStop.transitDetails.ticketInfoEn}
                  </span>
                  {currStop.transitDetails.bookingOptions?.metroWhatsApp && (
                    <a
                      href={currStop.transitDetails.bookingOptions.metroWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#25d366', fontWeight: 700, textDecoration: 'none' }}
                    >
                      📲 {isMr ? 'WhatsApp वर मेट्रो QR तिकीट काढा ↗' : 'WhatsApp Metro QR Ticket ↗'}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Previous / Next Stepper Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <button
                type="button"
                onClick={() => handleSelectStep(activeGuidedTrip.currentStopIndex - 1)}
                disabled={activeGuidedTrip.currentStopIndex === 0}
                className="btn outline"
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                ← {isMr ? 'मागील ठिकाण' : 'Previous Stop'}
              </button>

              <button
                type="button"
                onClick={() => handleSelectStep(activeGuidedTrip.currentStopIndex + 1)}
                disabled={activeGuidedTrip.currentStopIndex === activeGuidedTrip.stops.length - 1}
                className="btn outline"
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                {isMr ? 'पुढील ठिकाण' : 'Next Stop'} →
              </button>
            </div>
          </div>

          {/* All Places Visited Celebration Banner */}
          {activeGuidedTrip.isCompleted && (
            <div
              style={{
                marginTop: 24,
                background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
                border: '2px solid #f59e0b',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 44, display: 'block', marginBottom: 10 }}>🏆🎉</span>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: '#92400e' }}>
                {isMr ? 'अभिनंदन! तुम्ही संपूर्ण सहल यशस्वीरीत्या पूर्ण केली!' : 'Congratulations! Tour Completed!'}
              </h3>
              <p style={{ maxWidth: 540, margin: '0 auto 16px', fontSize: 14, color: '#78350f', lineHeight: 1.5 }}>
                {isMr
                  ? `तुम्ही "${activeGuidedTrip.titleMr || activeGuidedTrip.titleEn}" मधील सर्व ${totalStopsCount} ऐतिहासिक व प्रेक्षणीय ठिकाणांना भेट दिली आहे. आता एक्सप्लोरर यशोगाथा पेजवर जाऊन तुमचे पदके व प्रमाणपत्र मिळवा!`
                  : `You have successfully visited all ${totalStopsCount} landmarks in "${activeGuidedTrip.titleEn}". Visit Explorer Milestones to claim your badges and certificate!`}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Link
                  href="/milestones"
                  className="btn"
                  style={{
                    background: '#92400e',
                    color: '#ffffff',
                    fontWeight: 800,
                    padding: '10px 22px',
                    borderRadius: 999,
                  }}
                >
                  🏆 {isMr ? 'माझे पदके व यशोगाथा पहा' : 'Claim Explorer Milestones'}
                </Link>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="btn outline"
                  style={{ borderColor: '#d97706', color: '#92400e', fontWeight: 700 }}
                >
                  📥 {isMr ? 'सहल सारांश PDF डाऊनलोड' : 'Download Summary PDF'}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===================================================================
          STANDARD PLANNER FORM & RESULTS VIEW
          =================================================================== */}
      <div className="two" style={{ alignItems: 'start' }}>
        {/* Form Panel */}
        <form onSubmit={generate} className="panel" style={{ position: 'sticky', top: 90 }}>
          <h2
            style={{
              fontSize: 18,
              marginTop: 0,
              marginBottom: 18,
              borderBottom: '1px solid var(--line)',
              paddingBottom: 10,
            }}
          >
            {t('planner.params')}
          </h2>

          {/* Starting Point Hub & Device GPS */}
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
              <label htmlFor="start" style={{ margin: 0 }}>
                {t('planner.startPoint')}
              </label>
              <button
                type="button"
                onClick={handleGetGps}
                disabled={isLocatingGps}
                style={{
                  background: start === 'my-live-gps' ? '#ecfdf5' : '#ffffff',
                  border: '1px solid #10b981',
                  color: '#065f46',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: isLocatingGps ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 10px',
                  borderRadius: 999,
                }}
                title={isMr ? 'डिव्हाइस सेन्सरद्वारे थेट GPS स्थान मिळवा' : 'Acquire live coordinates from device GPS'}
              >
                {isLocatingGps ? (
                  <>⏳ {t('planner.locating')}</>
                ) : (
                  <>🎯 {isMr ? 'थेट GPS स्थान वापरा' : 'Use Live Device GPS'}</>
                )}
              </button>
            </div>

            <select id="start" value={start} onChange={(e) => setStart(e.target.value)}>
              {userCoords && (
                <option value="my-live-gps">
                  📍 {isMr ? 'माझे थेट GPS स्थान' : 'My Live GPS Location'} ({userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)})
                </option>
              )}
              {Object.entries(STARTS).map(([k, val]) => (
                <option key={k} value={k}>
                  {isMr ? val.mr : k}
                </option>
              ))}
            </select>

            {userCoords && start === 'my-live-gps' && (
              <div
                style={{
                  marginTop: 6,
                  padding: '6px 10px',
                  background: '#ecfdf5',
                  border: '1px solid #10b981',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>🎯</span>
                <span>
                  <strong>{t('planner.gpsDetected')}:</strong> {userCoords.lat.toFixed(4)}° N, {userCoords.lng.toFixed(4)}° E
                  {gpsAccuracy && ` (±${Math.round(gpsAccuracy)}m)`}
                </span>
              </div>
            )}

            {gpsErrorMsg && (
              <div
                style={{
                  marginTop: 6,
                  padding: '6px 10px',
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'start',
                  gap: 6,
                }}
              >
                <span>⚠️</span>
                <span>{gpsErrorMsg}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label htmlFor="time">{t('planner.startTime')}</label>
              <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="dur">
                {t('planner.availableTime')} (min)
              </label>
              <input
                id="dur"
                type="number"
                min={30}
                max={720}
                step={15}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Travel Mode including Public Transit */}
          <div className="field">
            <label htmlFor="mode">{t('planner.mode')}</label>
            <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="public_transit">🚇 {t('planner.publicTransit')}</option>
              <option value="walking">🚶 {t('planner.walking')}</option>
              <option value="cycling">🚴 {t('planner.cycling')}</option>
              <option value="driving">🚗 {t('planner.driving')}</option>
            </select>
            {mode === 'public_transit' && (
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--primary)', lineHeight: 1.4 }}>
                🚇 {isMr ? 'पुणे मेट्रो (लाईन १ व २) आणि पीएमपीएमएल बस सेवांचा वापर. तिकिटे व मार्ग समाविष्ट.' : 'Integrates Pune Metro (Purple & Aqua Lines) and PMPML Buses with transfer stops and fares.'}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="bud">{t('planner.budget')}</label>
            <input
              id="bud"
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 500"
            />
          </div>

          <div className="field">
            <label>{isMr ? 'आवडीचे विषय' : 'Interests & Themes'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginTop: 6 }}>
              {INTERESTS.map((item) => (
                <label
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--line)',
                    background: interests.includes(item.key) ? 'var(--primary-light)' : '#ffffff',
                    borderColor: interests.includes(item.key) ? 'var(--primary-border)' : 'var(--line)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(item.key)}
                    onChange={() => toggle(item.key)}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <span>{item.icon}</span> {isMr ? item.mr : item.en}
                </label>
              ))}
            </div>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
              fontSize: 13,
              color: 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={includeUnverified}
              onChange={(e) => setIncludeUnverified(e.target.checked)}
              style={{ width: 'auto' }}
            />
            {t('planner.includeUnverified')}
          </label>

          <button className="btn" disabled={loading} style={{ width: '100%', padding: '13px' }}>
            {loading ? t('planner.calculating') : t('planner.generateBtn')}
          </button>
        </form>

        {/* Results Panel */}
        <div aria-live="polite" style={{ display: 'grid', gap: 16 }}>
          {error && <p className="note err">{error}</p>}

          {/* Short Professional Planning Animation (Requirement 9) */}
          {loading && (
            <div
              className="panel"
              style={{
                padding: '36px 24px',
                textAlign: 'center',
                background: '#ffffff',
                border: '1.5px solid var(--primary-border)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 8px 24px rgba(6, 95, 70, 0.08)',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🧭</div>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, color: 'var(--primary)', fontWeight: 800 }}>
                {isMr ? 'पुणे सहल आराखडा तयार करत आहे…' : 'Generating Custom Pune Itinerary…'}
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--muted)' }}>
                {isMr ? 'अचूक बस व मेट्रो कॉरिडॉर, वेळा आणि विश्रांती नियोजन' : 'Mapping transit routes, opening hours, and visit schedules'}
              </p>

              {/* Moving Step Progress Indicator (Location -> Places -> Route -> Time -> Final Itinerary) */}
              <div style={{ maxWidth: 480, margin: '0 auto 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 8, gap: 4 }}>
                  <span style={{ color: planningStep >= 0 ? 'var(--primary)' : 'var(--muted)', fontWeight: planningStep === 0 ? 800 : 600 }}>
                    📍 {isMr ? 'स्थान' : 'Location'}
                  </span>
                  <span>→</span>
                  <span style={{ color: planningStep >= 1 ? 'var(--primary)' : 'var(--muted)', fontWeight: planningStep === 1 ? 800 : 600 }}>
                    🏛️ {isMr ? 'ठिकाणे' : 'Places'}
                  </span>
                  <span>→</span>
                  <span style={{ color: planningStep >= 2 ? 'var(--primary)' : 'var(--muted)', fontWeight: planningStep === 2 ? 800 : 600 }}>
                    🚌 {isMr ? 'मार्ग' : 'Route'}
                  </span>
                  <span>→</span>
                  <span style={{ color: planningStep >= 3 ? 'var(--primary)' : 'var(--muted)', fontWeight: planningStep === 3 ? 800 : 600 }}>
                    ⏱️ {isMr ? 'वेळ' : 'Time'}
                  </span>
                  <span>→</span>
                  <span style={{ color: planningStep >= 4 ? 'var(--primary)' : 'var(--muted)', fontWeight: planningStep === 4 ? 800 : 600 }}>
                    🏁 {isMr ? 'आराखडा' : 'Itinerary'}
                  </span>
                </div>
                {/* Moving Progress Bar */}
                <div
                  style={{
                    height: 6,
                    background: '#e2e8f0',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (planningStep + 1) * 20)}%`,
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      borderRadius: 999,
                      transition: 'width 180ms var(--ease-standard)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {!result && !error && !loading && (
            <div
              className="panel"
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: 'var(--muted)',
              }}
            >
              <span style={{ fontSize: 44, display: 'block', marginBottom: 14 }}>🗺️</span>
              <h3 style={{ margin: '0 0 8px', color: 'var(--ink)' }}>{t('planner.routeAwaits')}</h3>
              <p style={{ fontSize: 14, margin: '0 auto', maxWidth: '38ch' }}>
                {t('planner.routeAwaitsSub')}
              </p>
            </div>
          )}

          {result && !activePlan?.feasible && (
            <div className="note" style={{ padding: 20 }}>
              <strong>⚠️ {t('planner.noFeasible')}</strong>
            </div>
          )}

          {activePlan?.feasible && (
            <>
              {/* 3 DISTINCT PLANS SELECTOR */}
              {plans.length > 1 && (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid var(--primary-border)',
                    borderRadius: 'var(--radius)',
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--clay)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ✨ {t('planner.selectPlan')}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                      {isMr ? '३ स्वतंत्र व भिन्न पर्याय' : '3 Distinct Curated Options'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 10,
                    }}
                  >
                    {plans.map((p: any, idx: number) => {
                      const isSelected = selectedPlanIndex === idx;
                      const title = isMr ? p.titleMr || p.titleEn : p.titleEn;
                      const tagline = isMr ? p.taglineMr || p.taglineEn : p.taglineEn;
                      return (
                        <div
                          key={p.id || idx}
                          onClick={() => {
                            setSelectedPlanIndex(idx);
                            setPdfSuccess('');
                          }}
                          style={{
                            textAlign: 'left',
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected
                              ? '2px solid var(--clay)'
                              : '1px solid var(--line)',
                            background: isSelected ? 'var(--primary-light)' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span style={{ fontSize: 16 }}>{p.badge || '🗺️'}</span>
                            {isSelected && (
                              <span
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 800,
                                  background: 'var(--clay)',
                                  color: '#fff',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                }}
                              >
                                {isMr ? '✓ निवडलेली' : '✓ Active'}
                              </span>
                            )}
                          </div>
                          <strong
                            style={{
                              fontSize: 13.5,
                              color: isSelected ? 'var(--clay)' : 'var(--ink)',
                              marginTop: 2,
                            }}
                          >
                            {title}
                          </strong>
                          <span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 500 }}>
                            {p.stops?.length || 0} {isMr ? 'ठिकाणे' : 'stops'} • {p.totalDurationMinutes} {isMr ? 'मि.' : 'min'} • ₹{p.knownCost}
                          </span>
                          {tagline && (
                            <span style={{ fontSize: 11, color: 'var(--ink-secondary)', marginTop: 2, lineHeight: 1.3 }}>
                              {tagline}
                            </span>
                          )}

                          {/* Instant 1-Click Start Button on Selected Plan */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlanIndex(idx);
                              handleStartGuidedTrip(p);
                            }}
                            className="btn"
                            style={{
                              marginTop: 8,
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: isSelected ? 'var(--clay)' : '#047857',
                              color: '#fff',
                              borderRadius: 999,
                              justifyContent: 'center',
                            }}
                          >
                            🚀 {isMr ? 'हा प्लॅन निवडून सहल सुरू करा' : 'Start This Plan'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Plan Theme Banner with Quick Start Tour Button */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius)',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{activePlan.badge || '🗺️'}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, color: 'var(--clay)' }}>
                      {isMr ? activePlan.titleMr || activePlan.titleEn : activePlan.titleEn}
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--ink-secondary)' }}>
                      {isMr ? activePlan.themeMr || activePlan.themeEn : activePlan.themeEn}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartGuidedTrip(activePlan)}
                  className="btn"
                  style={{
                    background: '#047857',
                    color: '#ffffff',
                    padding: '10px 22px',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    borderRadius: '999px',
                    boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                  }}
                >
                  <span>🚀</span>
                  <span>{isMr ? 'हा प्लॅन निवडा व सहल सुरू करा' : 'Select Plan & Start Guided Tour'}</span>
                </button>
              </div>

              {/* Summary Stats */}
              <div
                className="panel"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: 16,
                  background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-light) 100%)',
                  border: '1px solid var(--primary-border)',
                }}
              >
                <div>
                  <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {t('planner.timePlanned')}
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
                    {activePlan.totalDurationMinutes} {isMr ? 'मि.' : 'min'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {t('planner.bufferTime')}
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)' }}>
                    {activePlan.bufferMinutes} {isMr ? 'मि.' : 'min'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {t('planner.estCost')}
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--clay)' }}>
                    ₹{activePlan.knownCost}
                  </div>
                </div>
              </div>

              {/* Free Itinerary Export & Sharing Toolbar with PDF Download */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '4px 0', alignItems: 'center' }}>
                {/* Instant PDF Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="btn"
                  style={{
                    background: '#c2410c',
                    color: '#ffffff',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                  title={isMr ? 'या प्लॅनची संपूर्ण PDF फाईल डाऊनलोड करा' : 'Download complete PDF file for this plan'}
                >
                  <span>{downloadingPdf ? '⏳' : '📥'}</span>
                  <span>
                    {downloadingPdf
                      ? isMr ? 'PDF तयार करत आहे…' : 'Generating PDF…'
                      : isMr ? 'सहल PDF डाऊनलोड करा' : 'Download Itinerary PDF'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => typeof window !== 'undefined' && window.print()}
                  className="btn outline"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  title={isMr ? 'सहल आराखडा प्रिंट किंवा PDF सेव्ह करा' : 'Print or save itinerary'}
                >
                  <span>🖨️</span>
                  <span>{isMr ? 'प्रिंट करा' : 'Print / Save'}</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Explore Pune Day Plan - ${activePlan.titleEn || 'Itinerary'} (${activePlan.stops?.length || 0} Stops, ₹${activePlan.knownCost}):\n${(activePlan.stops || [])
                      .map((s: any, idx: number) => `${idx + 1}. ${s.placeName} (${s.arrivalTime || ''} - ${s.departureTime || ''})`)
                      .join('\n')}\nPlan yours: https://punetrail.web.app/planner`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn outline"
                  style={{ padding: '8px 16px', fontSize: '13px', color: '#15803d' }}
                >
                  <span>💬</span>
                  <span>{isMr ? 'WhatsApp वर पाठवा' : 'Share on WhatsApp'}</span>
                </a>

                {/* Email Itinerary & PDF Button */}
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(!emailModalOpen)}
                  className="btn"
                  style={{
                    background: '#047857',
                    color: '#ffffff',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                  title={isMr ? 'हा सहल आराखडा आणि PDF ईमेलवर मिळवा' : 'Receive this itinerary and PDF via email'}
                >
                  <span>📧</span>
                  <span>{isMr ? 'ईमेलवर PDF मिळवा' : 'Email Me My Itinerary (PDF)'}</span>
                </button>

                {pdfSuccess && (
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#047857' }}>
                    {pdfSuccess}
                  </span>
                )}
              </div>

              {/* Interactive Email Itinerary & PDF Dispatch Box */}
              {emailModalOpen && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                    border: '1.5px solid #86efac',
                    borderRadius: 12,
                    padding: '16px 20px',
                    margin: '12px 0 16px',
                    boxShadow: '0 4px 14px rgba(4, 120, 87, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong style={{ fontSize: 14, color: '#065f46', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>📧</span> {isMr ? 'हा सहल आराखडा व PDF ईमेलवर मिळवा' : 'Receive Your Itinerary & PDF via Email'}
                    </strong>
                    <button
                      type="button"
                      onClick={() => setEmailModalOpen(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#64748b' }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ fontSize: 12.5, color: '#334155', margin: '0 0 12px', lineHeight: 1.5 }}>
                    {isMr
                      ? 'तुमचे नाव व ईमेल प्रविष्ट करा. एक्सप्लोर पुणे टीम (explorepune232@gmail.com) कडून तुमच्या नावाचा अधिकृत सहल आराखडा आणि उच्च दर्जाची प्रिंट करण्यायोग्य PDF फाईल ईमेलवर पाठवली जाईल.'
                      : 'Enter your name and email below. The ExplorePune Team (explorepune232@gmail.com) will email you your personalized expedition pass with your high-resolution printable PDF attached for offline travel.'}
                  </p>

                  {/* PDF Attachment & Personalization Badge */}
                  <div
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: 8,
                      padding: '8px 12px',
                      marginBottom: 12,
                      fontSize: 12,
                      color: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>📎</span>
                    <span>
                      <strong>{isMr ? 'अधिकृत PDF संलग्नक:' : 'Official PDF Attached:'}</strong>{' '}
                      {isMr
                        ? `${itineraryUserName.trim() || 'पर्यटक'} यांच्यासाठी तयार केलेली Explore_Pune_Itinerary.pdf ईमेलमध्ये जोडली जाईल व थेट डाऊनलोडही होईल.`
                        : `Explore_Pune_${(itineraryUserName.trim() || 'Explorer').replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary.pdf prepared for ${itineraryUserName.trim() || 'Explorer'} will be attached to your email and saved to your device.`}
                    </span>
                  </div>

                  <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: '#065f46',
                            marginBottom: 4,
                          }}
                        >
                          👤 {isMr ? 'तुमचे नाव (PDF व ईमेलसाठी):' : 'Your Full Name (for PDF & Pass):'}
                        </label>
                        <input
                          type="text"
                          required
                          value={itineraryUserName}
                          onChange={(e) => setItineraryUserName(e.target.value)}
                          placeholder={isMr ? 'तुमचे नाव (उदा. सुरज ढोक)' : 'Your Name (e.g. Suraj Dhok)'}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            fontSize: 13,
                            background: '#ffffff',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: '#065f46',
                            marginBottom: 4,
                          }}
                        >
                          ✉️ {isMr ? 'तुमचा ईमेल पत्ता:' : 'Your Email Address:'}
                        </label>
                        <input
                          type="email"
                          required
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder={isMr ? 'तुमचा ईमेल पत्ता (उदा. user@example.com)' : 'Your email address (e.g. user@gmail.com)'}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            fontSize: 13,
                            background: '#ffffff',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                      <button
                        type="submit"
                        disabled={sendingEmail}
                        className="btn"
                        style={{
                          background: '#047857',
                          color: '#ffffff',
                          padding: '9px 20px',
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                          borderRadius: 8,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span>{sendingEmail ? '⏳' : '🚀'}</span>
                        <span>
                          {sendingEmail
                            ? isMr
                              ? 'PDF तयार करून पाठवत आहे…'
                              : 'Generating & Sending PDF…'
                            : isMr
                            ? 'PDF व ईमेल पाठवा'
                            : 'Send PDF Itinerary to Email'}
                        </span>
                      </button>
                    </div>
                  </form>
                  {emailSuccess && (
                    <div style={{ marginTop: 12, padding: 12, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#047857', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>✓</span>
                        <span>{emailSuccess}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#166534', marginBottom: 10 }}>
                        {isMr
                          ? 'एक्सप्लोर पुणे टीम (explorepune232@gmail.com) कडून हा अधिकृत PDF ईमेल पाठवला गेला आहे.'
                          : 'Sent by ExplorePune Team (explorepune232@gmail.com). You can also view or open directly in Gmail below:'}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${encodeURIComponent(`Your Explore Pune Itinerary: ${activePlan.titleEn || 'Custom Tour'} 🗺️`)}&body=${encodeURIComponent(`Dear ${itineraryUserName.trim() || 'Explorer'},\n\nHere is your custom Pune itinerary created on Explore Pune (explorepune232@gmail.com):\nPlan: ${activePlan.titleEn || 'Custom Tour'}\nPrepared for: ${itineraryUserName.trim() || 'Explorer'}\nStart: ${start === 'my-live-gps' ? 'My Live Location' : (start || 'Central Pune')}\nDuration: ~${Math.round((activePlan.totalDurationMinutes || 180)/60)} hours\n\nStops:\n${(activePlan.stops || []).map((s: any, i: number) => `${i+1}. ${s.placeName} (${s.arrivalTime || ''} - ${s.departureTime || ''})`).join('\n')}\n\nOfficial PDF Attached: Explore_Pune_${(itineraryUserName.trim() || 'Explorer').replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary.pdf\n\nWarm regards,\nSuraj Dhok & Sahil Jadhav (Founders), Ishan Kakade (QA & Documentation)\nExplorePune Team`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                          style={{
                            padding: '6px 14px',
                            fontSize: 12,
                            fontWeight: 700,
                            background: '#ea4335',
                            color: '#ffffff',
                            borderRadius: 6,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span>📬</span> {isMr ? 'Gmail मध्ये उघडा' : 'Open in Gmail (explorepune232@gmail.com)'}
                        </a>
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          className="btn outline"
                          style={{
                            padding: '6px 14px',
                            fontSize: 12,
                            fontWeight: 700,
                            borderRadius: 6,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span>📥</span> {isMr ? 'PDF डाउनलोड करा' : 'Download PDF Guide'}
                        </button>
                      </div>
                    </div>
                  )}
                  {emailError && (
                    <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
                      {emailError}
                    </div>
                  )}
                </div>
              )}

              {activePlan.warnings?.length > 0 && (
                <div className="note" style={{ fontSize: 13 }}>
                  {activePlan.warnings.map((w: string, i: number) => (
                    <p key={i} style={{ margin: '3px 0' }}>
                      ℹ️ {w}
                    </p>
                  ))}
                </div>
              )}

                {/* Stops Timeline with Progressive Entrance (Requirement 10) */}
                <div style={{ display: 'grid', gap: 14 }}>
                  <h3 style={{ margin: '8px 0 0', fontSize: 16 }}>
                    {t('planner.routeItinerary')} ({activePlan.stops?.length || 0} {isMr ? 'ठिकाणे' : 'Stops'})
                  </h3>
                  {activePlan.stops.map((s: any, i: number) => (
                    <div
                      key={s.placeId}
                      className="panel itinerary-stop-card"
                      style={{
                        padding: 16,
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius)',
                        '--stop-i': i,
                      } as React.CSSProperties}
                    >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: s.transitDetails ? 12 : 0 }}>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        <strong
                          style={{
                            fontSize: 16,
                            color: 'var(--ink)',
                            fontFamily: isMr ? 'var(--deva)' : 'inherit',
                          }}
                        >
                          {isMr ? s.placeName_mr || s.placeName : s.placeName}
                        </strong>
                        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
                          {s.arrivalTime && s.departureTime && (
                            <>
                              <span style={{ fontWeight: 700, color: 'var(--clay)' }}>
                                ⏰ {s.arrivalTime} - {s.departureTime}
                              </span>{' '}
                              •{' '}
                            </>
                          )}
                          <span>
                            {mode === 'public_transit' ? '🚇' : '🚶'} {s.travelMinutes} {isMr ? 'मि. प्रवास' : 'min travel'}
                          </span>{' '}
                          • <span>⏱️ {s.visitMinutes} {isMr ? 'मि. भेट' : 'min visit'}</span>
                          {s.entryCost !== null && (
                            <>
                              {' '}
                              • <span>🎟️ {s.entryCost === 0 ? (isMr ? 'मोफत' : 'Free') : `₹${s.entryCost}`}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/places/${s.placeSlug}`}
                        className="btn outline"
                        style={{ padding: '6px 14px', fontSize: 12 }}
                      >
                        {isMr ? 'तपशील →' : 'View →'}
                      </Link>
                    </div>

                    {/* Detailed Public Transit Card for this leg */}
                    {s.transitDetails && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: 12,
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 13,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8,
                            alignItems: 'center',
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              background: '#047857',
                              color: '#fff',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            🚌 {isMr ? 'सार्वजनिक मार्ग' : 'Transit Route'}
                          </span>
                          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                            {isMr ? s.transitDetails.summaryMr : s.transitDetails.summaryEn}
                          </span>
                        </div>

                        {/* Step by step directions */}
                        <ol style={{ margin: '6px 0 8px 18px', padding: 0, color: '#334155' }}>
                          {(isMr ? s.transitDetails.stepByStepMr : s.transitDetails.stepByStepEn).map(
                            (st: string, idx: number) => (
                              <li key={idx} style={{ marginBottom: 4 }}>
                                {st}
                              </li>
                            )
                          )}
                        </ol>

                        {/* Ticket & Booking pill */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                            paddingTop: 8,
                            borderTop: '1px dashed #cbd5e1',
                            fontSize: 12,
                          }}
                        >
                          <div style={{ color: '#047857', fontWeight: 600 }}>
                            🎟️ {isMr ? s.transitDetails.ticketInfoMr : s.transitDetails.ticketInfoEn}
                          </div>
                          {s.transitDetails.bookingOptions?.metroWhatsApp && (
                            <a
                              href={s.transitDetails.bookingOptions.metroWhatsApp}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#25d366',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              📲 {isMr ? 'व्हॉट्सअॅपवर मेट्रो तिकीट काढा ↗' : 'WhatsApp Metro QR Ticket ↗'}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Regards Section Exactly as Requested */}
              <div
                style={{
                  marginTop: 20,
                  padding: '18px 20px',
                  background: 'linear-gradient(to right, #f8fafc 0%, #ffffff 100%)',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 2 }}>
                    {isMr ? 'सस्नेह नमस्कार / Warm regards,' : 'Warm regards,'}
                  </div>
                  <div style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--clay)' }}>
                    Suraj Dhok & Sahil Jadhav
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#b45309', marginTop: 2 }}>
                    {isMr ? 'गुणवत्ता हमी (QA) व दस्तऐवजीकरण: इशान काकडे (Ishan Kakade)' : 'QA Testing & Documentation: Ishan Kakade'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-secondary)', marginTop: 2 }}>
                    {isMr
                      ? 'एक्सप्लोर पुणे (Explore Pune) टीम • अस्सल पुणे भ्रमंती व डिजिटल मार्गदर्शक'
                      : 'Explore Pune Team • Authentic Tourism & Cultural Guide'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="btn"
                  style={{
                    fontSize: 12.5,
                    padding: '8px 16px',
                    background: '#c2410c',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  <span>{downloadingPdf ? '⏳' : '📥'}</span>{' '}
                  <span>{isMr ? 'हा प्लॅन PDF मध्ये सेव्ह करा' : 'Save This Plan as PDF'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

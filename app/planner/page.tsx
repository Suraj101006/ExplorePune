'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import ModalPortal from '@/components/ModalPortal';
import Link from 'next/link';
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
import { detectBrowserGps } from '@/lib/userLocation';
import TravelCompass from '@/components/TravelCompass';
import { openDirectionsModal } from '@/lib/navigationService';
import JourneyMapAnimation from '@/components/JourneyMapAnimation';
import { calculateDistanceKm } from '@/lib/publicTransit';
import { X as LucideX, Plus as LucidePlus } from 'lucide-react';

// =========================================================================
// CUSTOM COUNT-UP ANIMATION HOOK (Requirement 9 & 28)
// Smoothly interpolates values from 0 to target over durationMs (600-800ms)
// Automatically respects prefers-reduced-motion
// =========================================================================
function useCountUp(endVal: number, durationMs = 750, active = true): number {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active || endVal === 0) {
      setVal(endVal);
      return;
    }
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVal(endVal);
      return;
    }

    let frameId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(easeProgress * endVal));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setVal(endVal);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [endVal, durationMs, active]);

  return val;
}

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

function formatMinutesToClock(totalMin: number): string {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
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

// 9 Categories as per Section 3
const CATEGORIES: Array<{ key: string; en: string; mr: string; icon: string }> = [
  { key: 'forts', en: 'Forts & Trails', mr: 'किल्ले व सह्याद्री ट्रेक', icon: '🏰' },
  { key: 'heritage', en: 'Heritage & Wadas', mr: 'वास्तू आणि वाडे', icon: '🏛️' },
  { key: 'temples', en: 'Temples & Sacred Sites', mr: 'प्रसिद्ध मंदिरे व देवस्थान', icon: '🛕' },
  { key: 'nature', en: 'Nature & Lakes', mr: 'तलाव व निसर्गरम्य स्थळे', icon: '🌄' },
  { key: 'meditation', en: 'Meditation & Peace', mr: 'शांतता व ध्यान केंद्रे', icon: '🧘' },
  { key: 'museums', en: 'Museums & Art', mr: 'वस्तुसंग्रहालये व कला', icon: '🖼️' },
  { key: 'culture', en: 'Culture & Traditions', mr: 'संस्कृती व परंपरा', icon: '🎭' },
  { key: 'parks', en: 'Parks & Gardens', mr: 'उद्याने व बागा', icon: '🌳' },
  { key: 'trekking', en: 'Trekking & Hills', mr: 'ट्रेकिंग व टेकड्या', icon: '🥾' },
];

// Preferences as per Section 4
const PREFERENCES: Array<{ key: string; en: string; mr: string; icon: string }> = [
  { key: 'short_travel', en: 'Short travel', mr: 'कमी प्रवास / जवळची ठिकाणे', icon: '⏱️' },
  { key: 'more_sightseeing', en: 'More sightseeing', mr: 'जास्तीत जास्त दर्शन', icon: '👁️' },
  { key: 'historical', en: 'Historical places', mr: 'ऐतिहासिक वारसा', icon: '📜' },
  { key: 'scenic_nature', en: 'Nature & Views', mr: 'निसर्ग व नयनरम्य दृश्ये', icon: '🌿' },
  { key: 'family_friendly', en: 'Family friendly', mr: 'कुटुंबासह फिरण्यासाठी', icon: '👨‍👩‍👧‍👦' },
  { key: 'low_cost', en: 'Low cost / Free', mr: 'कमी खर्च / मोफत प्रवेश', icon: '💰' },
  { key: 'less_walking', en: 'Less walking', mr: 'कमी पायपीट / सुलभ प्रवेश', icon: '🚶‍♂️' },
];

// Planning sequence steps as per Section 6
const PLANNING_STEPS: Array<{ en: string; mr: string; icon: string }> = [
  { en: 'Checking available time', mr: 'उपलब्ध वेळेची पडताळणी', icon: '⏱️' },
  { en: 'Matching verified places', mr: 'अस्सल ठिकाणांची निवड', icon: '🏛️' },
  { en: 'Estimating travel & transit', mr: 'प्रवास व मेट्रो वेळेचा अंदाज', icon: '🚌' },
  { en: 'Optimizing route sequence', mr: 'मार्गाची अचूक आखणी', icon: '🗺️' },
  { en: 'Building your itinerary', mr: 'सहल आराखडा तयार करत आहे', icon: '✨' },
];

export default function PlannerPage() {
  const { isMr, t } = useLanguage();
  const { user } = useAuth();

  // Core Form State
  const [duration, setDuration] = useState(180);
  const [mode, setMode] = useState('public_transit');
  const [budget, setBudget] = useState('500');
  const [start, setStart] = useState('Central Pune (Shaniwar Wada)');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [time, setTime] = useState('09:30');
  const [interests, setInterests] = useState<string[]>(['heritage', 'forts']);
  const [preferences, setPreferences] = useState<string[]>(['more_sightseeing']);
  const [justSelectedPref, setJustSelectedPref] = useState<string | null>(null);
  const [includeUnverified, setIncludeUnverified] = useState(true);

  // Planning / Calculation State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [planningStep, setPlanningStep] = useState(0);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Interactive Map Route State
  const [showRouteMap, setShowRouteMap] = useState(true);

  // Add Place Modal State
  const [addPlaceModalOpen, setAddPlaceModalOpen] = useState(false);
  const [availablePlacesList, setAvailablePlacesList] = useState<any[]>([]);
  const [addPlaceSearchQuery, setAddPlaceSearchQuery] = useState('');
  const [loadingPlacesList, setLoadingPlacesList] = useState(false);
  const [removingStopId, setRemovingStopId] = useState<string | null>(null);
  const [justAddedStopId, setJustAddedStopId] = useState<string | null>(null);


  // PDF & Email State
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState('');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [itineraryUserName, setItineraryUserName] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  // Active Guided Tour State
  const [savedOngoingTrip, setSavedOngoingTrip] = useState<ActiveTrip | null>(null);
  const [activeGuidedTrip, setActiveGuidedTrip] = useState<ActiveTrip | null>(null);
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [checkinNotice, setCheckinNotice] = useState<string>('');

  // 1. Session State Persistence (Requirement 25)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('explore_pune_planner_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.duration) setDuration(parsed.duration);
        if (parsed.mode) setMode(parsed.mode);
        if (parsed.budget !== undefined) setBudget(parsed.budget);
        if (parsed.start) setStart(parsed.start);
        if (parsed.time) setTime(parsed.time);
        if (Array.isArray(parsed.interests) && parsed.interests.length > 0) setInterests(parsed.interests);
        if (Array.isArray(parsed.preferences)) setPreferences(parsed.preferences);
      }
    } catch {
      // Ignore sessionStorage parsing issues
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        'explore_pune_planner_v2',
        JSON.stringify({ duration, mode, budget, start, time, interests, preferences })
      );
    } catch {
      // Ignore
    }
  }, [duration, mode, budget, start, time, interests, preferences]);

  // Pre-fill email and user name when authenticated
  useEffect(() => {
    if (user?.email && !emailAddress) {
      setEmailAddress(user.email);
    }
    if (user?.displayName && !itineraryUserName) {
      setItineraryUserName(user.displayName);
    }
  }, [user, emailAddress, itineraryUserName]);

  // Sync ongoing active trip from localStorage
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

  // GPS Acquisition
  const handleGetGps = async () => {
    setIsLocatingGps(true);
    setGpsErrorMsg('');
    try {
      const res = await detectBrowserGps();
      if (res.success && res.location) {
        setUserCoords({ lat: res.location.lat, lng: res.location.lng });
        setStart('my-live-gps');
        setGpsAccuracy(res.accuracyMeters || 10);
      } else {
        setGpsErrorMsg(res.error || (isMr ? 'GPS स्थान मिळवता आले नाही.' : 'Could not acquire GPS position.'));
      }
    } catch {
      setGpsErrorMsg(isMr ? 'GPS सेन्सर सुरू करताना त्रुटी आली.' : 'Failed to connect to device GPS.');
    } finally {
      setIsLocatingGps(false);
    }
  };

  // Category Toggle
  const toggleInterest = (key: string) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Preference Toggle
  const togglePreference = (key: string) => {
    setJustSelectedPref(key);
    setTimeout(() => setJustSelectedPref(null), 250);
    setPreferences((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Generate Itinerary API Call
  async function generate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setPlanningStep(0);
    setError('');
    setResult(null);
    setSelectedPlanIndex(0);
    setPdfSuccess('');
    setIsGuidedMode(false);

    const startTime = Date.now();
    const STEP_INTERVAL_MS = 500;
    const progressTimer = setInterval(() => {
      setPlanningStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, STEP_INTERVAL_MS);

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
          startMinuteOfDay: (h || 9) * 60 + (m || 30),
          start: { lat, lng },
        }),
      });
      const json = await res.json();

      // Ensure calm, deliberate ~2.5s generative calculation sequence so user can read each step comfortably
      const MIN_CALCULATION_DURATION = 2500;
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_CALCULATION_DURATION) {
        await new Promise((resolve) => setTimeout(resolve, MIN_CALCULATION_DURATION - elapsed));
      }
      clearInterval(progressTimer);
      setPlanningStep(4);
      await new Promise((resolve) => setTimeout(resolve, 350));

      if (json.data) {
        setResult(json.data);
      } else {
        setError(
          json.error?.message ??
            (isMr ? 'मार्ग तयार करता आला नाही. कृपया वेळ वाढवून पुन्हा प्रयत्न करा.' : 'Could not build a plan with current filters. Please adjust available time or categories.')
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

  // Active plan selection
  const plans: any[] = result?.plans && result.plans.length > 0 ? result.plans : result ? [result] : [];
  const activePlan = plans[selectedPlanIndex] || plans[0] || result;

  // Active Plan Statistics Calculation (Distance, Duration, Cost)
  const totalStopsInPlan = activePlan?.stops?.length || 0;
  const rawDuration = activePlan?.totalDurationMinutes || duration;
  const rawCost = activePlan?.knownCost || 0;

  // Approximate total distance in km using stop coordinates
  const calculatedTotalKm = useMemo(() => {
    if (!activePlan?.stops || activePlan.stops.length < 2) return (totalStopsInPlan * 3.8);
    let totalKm = 0;
    const stops = activePlan.stops;
    for (let i = 0; i < stops.length - 1; i++) {
      const p1 = stops[i];
      const p2 = stops[i + 1];
      if (p1.latitude && p1.longitude && p2.latitude && p2.longitude) {
        totalKm += calculateDistanceKm(p1.latitude, p1.longitude, p2.latitude, p2.longitude) * 1.25;
      } else {
        totalKm += 3.5;
      }
    }
    return Math.round(totalKm * 10) / 10;
  }, [activePlan?.stops, totalStopsInPlan]);

  // Smooth Count-Up Hooks for Summary Statistics (Requirement 9)
  const animatedDuration = useCountUp(rawDuration, 750, Boolean(result));
  const animatedStopsCount = useCountUp(totalStopsInPlan, 650, Boolean(result));
  const animatedDistanceKm = useCountUp(Math.round(calculatedTotalKm * 10), 800, Boolean(result)) / 10;
  const animatedCost = useCountUp(rawCost, 700, Boolean(result));

  // Time formatter helper
  const formattedHours = Math.floor(duration / 60);
  const formattedMinutes = duration % 60;
  const timeSliderDisplay = `${formattedHours > 0 ? `${formattedHours}h ` : ''}${formattedMinutes > 0 ? `${formattedMinutes}m` : formattedHours === 0 ? '0m' : ''}`.trim();

  // Convert activePlan stops into DayJourney for JourneyMapAnimation
  const activePlanJourney: DayJourney | null = useMemo(() => {
    if (!activePlan || !activePlan.stops || activePlan.stops.length === 0) return null;
    const todayIso = new Date().toISOString().slice(0, 10);
    const dayStops: JourneyPlaceStop[] = activePlan.stops.map((s: any, idx: number) => ({
      placeId: s.placeId,
      placeSlug: s.placeSlug,
      placeName: s.placeName,
      placeNameMr: s.placeName_mr || s.placeName,
      category: s.category_slug || 'heritage',
      categoryName: 'Pune Exploration',
      categoryNameMr: 'पुणे दर्शन',
      image_url: s.image_url,
      description: '',
      latitude: s.latitude ?? 18.5204,
      longitude: s.longitude ?? 73.8567,
      arrivalTime: s.arrivalTime,
      departureTime: s.departureTime,
      visitDurationMinutes: s.visitMinutes || 45,
      isVisited: Boolean(s.isVisited),
      order: idx + 1,
    }));

    return {
      id: `plan-${activePlan.id || selectedPlanIndex}`,
      date: todayIso,
      dateLabelEn: activePlan.titleEn || 'Planned Journey',
      dateLabelMr: activePlan.titleMr || 'नियोजित सहल',
      title: activePlan.titleEn,
      titleMr: activePlan.titleMr,
      theme: activePlan.themeEn,
      themeMr: activePlan.themeMr,
      startLocation: start,
      startLocationMr: start,
      startCoords: activePlan.stops[0] ? { lat: activePlan.stops[0].latitude, lng: activePlan.stops[0].longitude } : undefined,
      startTime: time,
      endTime: activePlan.stops[activePlan.stops.length - 1]?.departureTime || '06:00 PM',
      travelMode: (['walking', 'cycling', 'driving', 'public_transit'].includes(mode) ? mode : 'public_transit') as any,
      status: 'active',
      totalDurationMinutes: activePlan.totalDurationMinutes || 180,
      totalDistanceKm: calculatedTotalKm,
      notes: 'Curated with Explore Pune Trip Planner',
      places: dayStops,
    };
  }, [activePlan, selectedPlanIndex, start, time, mode, calculatedTotalKm]);

  // Recalculate schedule times along stops
  const recalculateScheduleTimes = (stops: any[]) => {
    const [h, m] = time.split(':').map(Number);
    let currentClock = (h || 9) * 60 + (m || 30);
    const bufferPerStop = mode === 'driving' || mode === 'public_transit' ? 10 : 5;

    return stops.map((stop) => {
      const travelM = stop.travelMinutes || 15;
      const visitM = stop.visitMinutes || 45;
      const arrivalMin = currentClock + travelM;
      const departureMin = arrivalMin + visitM;
      currentClock = departureMin + bufferPerStop;

      return {
        ...stop,
        arrivalTime: formatMinutesToClock(arrivalMin),
        departureTime: formatMinutesToClock(departureMin),
      };
    });
  };

  // Reorder Stop Up / Down (Requirement 15)
  const handleMoveStop = (idx: number, direction: 'up' | 'down') => {
    if (!activePlan || !activePlan.stops) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= activePlan.stops.length) return;

    setIsRecalculating(true);
    const newStops = [...activePlan.stops];
    const temp = newStops[idx];
    newStops[idx] = newStops[targetIdx];
    newStops[targetIdx] = temp;

    const rescheduled = recalculateScheduleTimes(newStops);
    const updatedPlan = { ...activePlan, stops: rescheduled };

    // Update in plans array
    if (result?.plans && result.plans.length > 0) {
      const updatedPlans = [...result.plans];
      updatedPlans[selectedPlanIndex] = updatedPlan;
      setResult({ ...result, plans: updatedPlans });
    } else {
      setResult(updatedPlan);
    }

    setTimeout(() => setIsRecalculating(false), 300);
  };

  // Remove Stop Animation (Requirement 16)
  const handleRemoveStop = (placeId: string) => {
    if (!activePlan || !activePlan.stops) return;
    setRemovingStopId(placeId);
    setIsRecalculating(true);

    setTimeout(() => {
      const remainingStops = activePlan.stops.filter((s: any) => s.placeId !== placeId);
      const rescheduled = recalculateScheduleTimes(remainingStops);
      const updatedPlan = {
        ...activePlan,
        stops: rescheduled,
        totalDurationMinutes: Math.max(30, (activePlan.totalDurationMinutes || 180) - 45),
        knownCost: remainingStops.reduce((sum: number, s: any) => sum + (s.entryCost || 0), 0),
      };

      if (result?.plans && result.plans.length > 0) {
        const updatedPlans = [...result.plans];
        updatedPlans[selectedPlanIndex] = updatedPlan;
        setResult({ ...result, plans: updatedPlans });
      } else {
        setResult(updatedPlan);
      }

      setRemovingStopId(null);
      setIsRecalculating(false);
    }, 320);
  };

  // Open Add Place Modal (Requirement 17)
  const handleOpenAddPlaceModal = async () => {
    setAddPlaceModalOpen(true);
    if (availablePlacesList.length === 0) {
      setLoadingPlacesList(true);
      try {
        const res = await fetch('/api/v1/places');
        const json = await res.json();
        if (json.data) {
          setAvailablePlacesList(json.data);
        }
      } catch {
        // Fallback
      } finally {
        setLoadingPlacesList(false);
      }
    }
  };

  // Add Place to Current Route (Requirement 17)
  const handleAddPlaceToRoute = (place: any) => {
    if (!activePlan) return;
    if (activePlan.stops?.some((s: any) => s.placeId === place.id || (place.slug && s.placeSlug === place.slug))) {
      setAddPlaceModalOpen(false);
      return;
    }
    setIsRecalculating(true);
    setJustAddedStopId(place.id);

    const newStop: any = {
      placeId: place.id,
      placeSlug: place.slug,
      placeName: place.name,
      placeName_mr: place.name_mr,
      travelMinutes: 20,
      visitMinutes: place.recommended_duration_minutes || 45,
      entryCost: place.entry_fee ?? 0,
      latitude: place.latitude,
      longitude: place.longitude,
      image_url: place.image_url,
      category_slug: place.category_slug,
      isVisited: false,
    };

    const newStops = [...(activePlan.stops || []), newStop];
    const rescheduled = recalculateScheduleTimes(newStops);
    const updatedPlan = {
      ...activePlan,
      stops: rescheduled,
      totalDurationMinutes: (activePlan.totalDurationMinutes || 180) + 65,
      knownCost: (activePlan.knownCost || 0) + (place.entry_fee || 0),
    };

    if (result?.plans && result.plans.length > 0) {
      const updatedPlans = [...result.plans];
      updatedPlans[selectedPlanIndex] = updatedPlan;
      setResult({ ...result, plans: updatedPlans });
    } else {
      setResult(updatedPlan);
    }

    setAddPlaceModalOpen(false);
    setAddPlaceSearchQuery('');

    setTimeout(() => {
      setIsRecalculating(false);
      setJustAddedStopId(null);
    }, 450);
  };

  // Start Guided Trip from Selected Plan (Requirement 21)
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

    // Sync to My Journey
    try {
      if (activePlanJourney) {
        saveJourney(activePlanJourney);
      }
    } catch {
      // Ignore
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
    if (confirm(isMr ? 'चालू सहल मार्गदर्शन थांबवायचे आहे का?' : 'Discard ongoing trip progress?')) {
      clearActiveTrip();
      setSavedOngoingTrip(null);
      setActiveGuidedTrip(null);
      setIsGuidedMode(false);
    }
  };

  // Toggle Checkin with Milestone Update (Requirement 22 & 23)
  const handleToggleCheckin = (placeId: string) => {
    if (!activeGuidedTrip) return;
    const currentStop = activeGuidedTrip.stops.find((s) => s.placeId === placeId);
    const willBeVisited = !currentStop?.isVisited;
    const updated = markStopVisited(placeId, willBeVisited);
    if (updated) {
      setActiveGuidedTrip({ ...updated });
      setSavedOngoingTrip({ ...updated });

      try {
        const todayIso = new Date().toISOString().slice(0, 10);
        toggleJourneyStopVisited(`journey-${todayIso}`, placeId, willBeVisited);
      } catch {
        // Ignore
      }

      if (willBeVisited) {
        setCheckinNotice(
          isMr
            ? `🎉 अभिनंदन! "${currentStop?.placeNameMr || currentStop?.placeName}" येथे भेट नोंदवली गेली!`
            : `🎉 Awesome! "${currentStop?.placeName}" marked as visited!`
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

  const handleSelectGuidedStep = (idx: number) => {
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

  // Download PDF
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

  // Email Itinerary
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

      try {
        downloadItineraryPdf(itineraryData);
      } catch {
        // Ignore
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
  const totalGuidedStopsCount = activeGuidedTrip?.stops.length || 0;
  const progressPercent = totalGuidedStopsCount > 0 ? Math.round((visitedStopsCount / totalGuidedStopsCount) * 100) : 0;

  // Filtered places for Add Place modal
  const filteredAvailablePlaces = useMemo(() => {
    if (!addPlaceSearchQuery.trim()) return availablePlacesList.slice(0, 20);
    const q = addPlaceSearchQuery.toLowerCase().trim();
    return availablePlacesList
      .filter((p) => p.name.toLowerCase().includes(q) || p.name_mr.toLowerCase().includes(q))
      .slice(0, 20);
  }, [availablePlacesList, addPlaceSearchQuery]);

  return (
    <main className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
      {/* 1. Header with Upward Slide & Fade (Requirement 1) */}
      <div className="planner-header-entrance" style={{ maxWidth: 760, marginBottom: 28 }}>
        <div className="hero-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span>⚡</span> {t('planner.badge')}
        </div>
        <h1 style={{ fontSize: 32, margin: '0 0 10px', color: 'var(--ink)' }}>{t('planner.title')}</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, margin: 0, lineHeight: 1.6 }}>
          {t('planner.sub')}
        </p>
      </div>

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

      {/* ===================================================================
          LIVE STEP-BY-STEP GUIDED TOUR MODE (Requirement 21, 22, 23)
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

          {/* Tour Progress Bar with Radial/Linear Sync */}
          <div style={{ margin: '18px 0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              <span>
                {isMr
                  ? `${totalGuidedStopsCount} पैकी ${visitedStopsCount} ठिकाणे पूर्ण झाली`
                  : `${visitedStopsCount} of ${totalGuidedStopsCount} Stops Completed`}
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
                  transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
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
                  onClick={() => handleSelectGuidedStep(idx)}
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
                    transition: 'all 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
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
                animation: 'stepFadeSlide 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
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
                  📍 {isMr ? `ठिकाण ${currStop.index} / ${totalGuidedStopsCount}` : `Stop ${currStop.index} of ${totalGuidedStopsCount}`}
                </div>
              </div>

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
                    <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
                      <span style={{ display: 'block', fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {isMr ? 'वेळ' : 'Schedule'}
                      </span>
                      <strong style={{ color: 'var(--clay)' }}>⏰ {currStop.arrivalTime || '--'} - {currStop.departureTime || '--'}</strong>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
                      <span style={{ display: 'block', fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {isMr ? 'भेट कालावधी' : 'Duration'}
                      </span>
                      <strong>⏱️ {currStop.visitMinutes} {isMr ? 'मि.' : 'min'}</strong>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
                      <span style={{ display: 'block', fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {isMr ? 'प्रवेश शुल्क' : 'Entry Ticket'}
                      </span>
                      <strong style={{ color: '#047857' }}>
                        🎟️ {currStop.entryCost === 0 ? (isMr ? 'मोफत' : 'Free Entry') : `₹${currStop.entryCost ?? 'N/A'}`}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Next Destination Navigation Card (Requirement 21) */}
                <div
                  style={{
                    background: '#ecfdf5',
                    border: '1.5px solid #a7f3d0',
                    borderRadius: 12,
                    padding: '12px 16px',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {isMr ? 'पुढील गंतव्यस्थान:' : 'Next destination:'}
                    </span>
                    <strong style={{ display: 'block', fontSize: 15, color: '#065f46' }}>
                      {isMr ? currStop.placeNameMr || currStop.placeName : currStop.placeName}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openDirectionsModal({
                        id: currStop.placeId,
                        name: currStop.placeName,
                        nameMr: currStop.placeNameMr,
                        latitude: currStop.latitude,
                        longitude: currStop.longitude,
                        slug: currStop.placeSlug,
                        imageUrl: currStop.image_url,
                      })
                    }
                    className="btn"
                    style={{
                      background: '#047857',
                      color: '#ffffff',
                      padding: '8px 18px',
                      fontSize: 13,
                      fontWeight: 800,
                      borderRadius: 8,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 2px 8px rgba(4, 120, 87, 0.2)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>📍</span>
                    <span>{isMr ? 'नेव्हिगेशन सुरू करा (Navigate)' : 'Navigate'}</span>
                  </button>
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

                  <button
                    type="button"
                    onClick={() =>
                      openDirectionsModal({
                        id: currStop.placeId,
                        name: currStop.placeName,
                        nameMr: currStop.placeNameMr,
                        latitude: currStop.latitude,
                        longitude: currStop.longitude,
                        slug: currStop.placeSlug,
                        imageUrl: currStop.image_url,
                      })
                    }
                    className="btn outline"
                    style={{ padding: '12px 20px', fontSize: 13.5, fontWeight: 700 }}
                  >
                    🗺️ {isMr ? 'GPS मार्ग व नेव्हिगेशन' : 'Get Directions & GPS'}
                  </button>
                </div>
              </div>
            </div>

            {/* Previous / Next Stepper Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <button
                type="button"
                onClick={() => handleSelectGuidedStep(activeGuidedTrip.currentStopIndex - 1)}
                disabled={activeGuidedTrip.currentStopIndex === 0}
                className="btn outline"
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                ← {isMr ? 'मागील ठिकाण' : 'Previous Stop'}
              </button>

              <button
                type="button"
                onClick={() => handleSelectGuidedStep(activeGuidedTrip.currentStopIndex + 1)}
                disabled={activeGuidedTrip.currentStopIndex === activeGuidedTrip.stops.length - 1}
                className="btn outline"
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                {isMr ? 'पुढील ठिकाण' : 'Next Stop'} →
              </button>
            </div>
          </div>

          {/* All Places Visited Celebration Banner (Requirement 23) */}
          {activeGuidedTrip.isCompleted && (
            <div
              style={{
                marginTop: 24,
                background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
                border: '2px solid #f59e0b',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 12 Micro Particles Burst around completion banner */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const burstX = Math.round(Math.cos(angle) * 45);
                const burstY = Math.round(Math.sin(angle) * 45);
                return (
                  <span
                    key={i}
                    className="celebration-burst-dot"
                    style={{
                      left: '50%',
                      top: '25%',
                      background: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'][i % 4],
                      '--burst-x': `${burstX}px`,
                      '--burst-y': `${burstY}px`,
                      animationDelay: `${i * 60}ms`,
                    } as React.CSSProperties}
                  />
                );
              })}

              <span style={{ fontSize: 46, display: 'block', marginBottom: 12 }}>🏆🎉</span>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: '#92400e' }}>
                {isMr ? 'अभिनंदन! तुम्ही संपूर्ण सहल यशस्वीरीत्या पूर्ण केली!' : 'Journey Complete! You explored Pune!'}
              </h3>
              <p style={{ maxWidth: 540, margin: '0 auto 18px', fontSize: 14, color: '#78350f', lineHeight: 1.5 }}>
                {isMr
                  ? `तुम्ही "${activeGuidedTrip.titleMr || activeGuidedTrip.titleEn}" मधील सर्व ${totalGuidedStopsCount} ऐतिहासिक व प्रेक्षणीय ठिकाणांना भेट दिली आहे. आता एक्सप्लोरर यशोगाथा पेजवर जाऊन तुमचे पदके व प्रमाणपत्र मिळवा!`
                  : `You explored all ${totalGuidedStopsCount} destinations across Pune in "${activeGuidedTrip.titleEn}". Head to Explorer Milestones to claim your official badges!`}
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
          PLANNER FORM & RESULTS VIEW WITH STAGGERED ENTRANCE
          =================================================================== */}
      <div className="two" style={{ alignItems: 'start' }}>
        {/* Left Form Panel with Section-by-Section Stagger (Requirement 1) */}
        <form onSubmit={generate} className="panel" style={{ position: 'sticky', top: 90 }}>
          <div
            className="planner-section-stagger"
            style={{
              '--stagger-i': 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              borderBottom: '1px solid var(--line)',
              paddingBottom: 10,
            } as React.CSSProperties}
          >
            <h2 style={{ fontSize: 18, margin: 0, fontWeight: 800, color: 'var(--ink)' }}>
              {t('planner.params')}
            </h2>
            {isRecalculating && (
              <span className="inline-route-updating-pill" style={{ fontSize: 11, fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '3px 8px', borderRadius: 999 }}>
                ⚡ {isMr ? 'मार्ग अद्ययावत करत आहे…' : 'Updating route…'}
              </span>
            )}
          </div>

          {/* Stagger 1: Starting Point & Live GPS Location (Requirement 14) */}
          <div className="field planner-section-stagger" style={{ '--stagger-i': 1 } as React.CSSProperties}>
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
                  position: 'relative',
                }}
                title={isMr ? 'डिव्हाइस सेन्सरद्वारे थेट GPS स्थान मिळवा' : 'Acquire live coordinates from device GPS'}
              >
                {/* Location Pulse Only While Acquiring (Requirement 14) */}
                {isLocatingGps && <span className="gps-pulse-outer" style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '2px solid #10b981' }} />}
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

          {/* Stagger 2: Start Time & Interactive Time Slider (Requirement 2) */}
          <div className="planner-section-stagger" style={{ '--stagger-i': 2, marginBottom: 16 } as React.CSSProperties}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="time">{t('planner.startTime')}</label>
                <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>

              <div className="field" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="dur" style={{ margin: 0 }}>
                    {t('planner.availableTime')}
                  </label>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#047857' }}>
                    {timeSliderDisplay}
                  </span>
                </div>
                <input
                  id="dur"
                  type="number"
                  min={30}
                  max={720}
                  step={15}
                  value={duration}
                  onChange={(e) => setDuration(Math.min(720, Math.max(30, Number(e.target.value))))}
                  required
                />
              </div>
            </div>

            {/* Smooth Time Slider with Active Track (Requirement 2) */}
            <div>
              <input
                type="range"
                min={30}
                max={720}
                step={15}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="planner-time-slider"
                style={{
                  background: `linear-gradient(90deg, #10b981 0%, #047857 ${Math.max(0, Math.min(100, ((duration - 30) / 690) * 100))}%, #e2e8f0 ${Math.max(0, Math.min(100, ((duration - 30) / 690) * 100))}%)`,
                }}
              />
              {/* Accurately positioned time markers corresponding to exact slider percentages */}
              <div style={{ position: 'relative', width: '100%', height: 18, fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                <span
                  onClick={() => setDuration(30)}
                  title="30 minutes"
                  style={{ position: 'absolute', left: 0, cursor: 'pointer', fontWeight: duration === 30 ? 800 : 500, color: duration === 30 ? '#047857' : undefined }}
                >
                  30m
                </span>
                <span
                  onClick={() => setDuration(180)}
                  title="3 hours (180 mins)"
                  style={{ position: 'absolute', left: '21.74%', transform: 'translateX(-50%)', cursor: 'pointer', fontWeight: duration === 180 ? 800 : 500, color: duration === 180 ? '#047857' : undefined }}
                >
                  3h
                </span>
                <span
                  onClick={() => setDuration(360)}
                  title="6 hours (360 mins)"
                  style={{ position: 'absolute', left: '47.83%', transform: 'translateX(-50%)', cursor: 'pointer', fontWeight: duration === 360 ? 800 : 500, color: duration === 360 ? '#047857' : undefined }}
                >
                  6h
                </span>
                <span
                  onClick={() => setDuration(720)}
                  title="12 hours (720 mins)"
                  style={{ position: 'absolute', right: 0, cursor: 'pointer', fontWeight: duration === 720 ? 800 : 500, color: duration === 720 ? '#047857' : undefined }}
                >
                  12h
                </span>
              </div>
            </div>
          </div>

          {/* Stagger 3: Travel Mode Tabs (Requirement 19) */}
          <div className="field planner-section-stagger" style={{ '--stagger-i': 3 } as React.CSSProperties}>
            <label>{t('planner.mode')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 4 }}>
              {[
                { key: 'public_transit', icon: '🚇', label: isMr ? 'सार्वजनिक (मेट्रो/बस)' : 'Public Transit' },
                { key: 'walking', icon: '🚶', label: isMr ? 'पायी (Walking)' : 'Walking' },
                { key: 'cycling', icon: '🚴', label: isMr ? 'सायकल (Cycling)' : 'Cycling' },
                { key: 'driving', icon: '🚗', label: isMr ? 'कार/कॅब (Driving)' : 'Driving' },
              ].map((m) => {
                const isActive = mode === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMode(m.key)}
                    className="mode-tab-button"
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: isActive ? '2px solid #047857' : '1px solid var(--line)',
                      background: isActive ? '#ecfdf5' : '#ffffff',
                      color: isActive ? '#065f46' : 'var(--ink)',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: 12.5,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{m.icon}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.label}</span>
                  </button>
                );
              })}
            </div>
            {mode === 'public_transit' && (
              <p style={{ margin: '6px 0 0', fontSize: 11.5, color: '#047857', lineHeight: 1.4 }}>
                🚇 {isMr ? 'पुणे मेट्रो (पर्पल व अ‍ॅक्वा लाईन) आणि पीएमपीएमएल बस मार्गदर्शक समाविष्ट.' : 'Integrates Pune Metro & PMPML bus routes with transfer stops and ₹70 pass savings.'}
              </p>
            )}
          </div>

          {/* Stagger 4: Categories Selection with Animated Checkmark (Requirement 3) */}
          <div className="field planner-section-stagger" style={{ '--stagger-i': 4 } as React.CSSProperties}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ margin: 0 }}>{isMr ? 'आवडीचे विषय (Categories)' : 'Interests & Categories'}</label>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>
                {interests.length} {isMr ? 'निवडले' : 'selected'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 6, marginTop: 4 }}>
              {CATEGORIES.map((item) => {
                const isSelected = interests.includes(item.key);
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleInterest(item.key)}
                    className={`category-card-interactive ${isSelected ? 'selected' : ''}`}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: isSelected ? '1.5px solid #047857' : '1px solid var(--line)',
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#065f46' : 'var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="category-icon">{item.icon}</span>
                      <span style={{ fontSize: 11.5 }}>{isMr ? item.mr : item.en}</span>
                    </div>
                    {isSelected && (
                      <svg className="category-checkmark-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stagger 5: Trip Preferences (Requirement 4) */}
          <div className="field planner-section-stagger" style={{ '--stagger-i': 5 } as React.CSSProperties}>
            <label style={{ marginBottom: 6, display: 'block' }}>{isMr ? 'सहल प्राधान्ये (Preferences)' : 'Trip Preferences'}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PREFERENCES.map((pref) => {
                const isSelected = preferences.includes(pref.key);
                const isPulsing = justSelectedPref === pref.key;
                return (
                  <button
                    key={pref.key}
                    type="button"
                    onClick={() => togglePreference(pref.key)}
                    className={`preference-pill-interactive ${isPulsing ? 'just-selected' : ''}`}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 999,
                      border: isSelected ? '1.5px solid #047857' : '1px solid var(--line)',
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      color: isSelected ? '#047857' : 'var(--ink-secondary)',
                      fontSize: 11.5,
                      fontWeight: isSelected ? 700 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{pref.icon}</span>
                    <span>{isMr ? pref.mr : pref.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stagger 6: Budget & Unverified Options */}
          <div className="field planner-section-stagger" style={{ '--stagger-i': 6 } as React.CSSProperties}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignItems: 'center' }}>
              <div>
                <label htmlFor="bud" style={{ fontSize: 12 }}>{t('planner.budget')}</label>
                <input
                  id="bud"
                  type="number"
                  min={0}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 500"
                />
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11.5,
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  marginTop: 18,
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={includeUnverified}
                  onChange={(e) => setIncludeUnverified(e.target.checked)}
                  style={{ width: 'auto', margin: 0 }}
                />
                <span>{t('planner.includeUnverified')}</span>
              </label>
            </div>
          </div>

          {/* Stagger 7: START PLANNING CTA BUTTON (Requirement 5) */}
          <div className="planner-section-stagger" style={{ '--stagger-i': 7, marginTop: 14 } as React.CSSProperties}>
            <button
              className="btn btn-plan-trip-cta"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: 15,
                fontWeight: 800,
                background: '#047857',
                color: '#ffffff',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span>⏳</span>
                  <span>{isMr ? 'मार्ग तयार करत आहे…' : 'Building Your Route...'}</span>
                </>
              ) : (
                <>
                  <span>{isMr ? 'पुणे सहल आखा' : 'Plan My Pune Trip'}</span>
                  <span className="cta-arrow">→</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Results Panel (Requirement 6, 7, 8, 9, 10, 11) */}
        <div aria-live="polite" style={{ display: 'grid', gap: 16 }}>
          {error && <p className="note err">{error}</p>}

          {/* 6 & 7. PLANNING / CALCULATION & BUILDING ROUTE VISUAL (Requirement 6 & 7) */}
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
              <div style={{ fontSize: 36, marginBottom: 10 }}>🧭</div>
              <h3 style={{ margin: '0 0 4px', fontSize: 20, color: 'var(--primary)', fontWeight: 800 }}>
                {isMr ? 'पुणे सहल आराखडा तयार करत आहे…' : 'Building Your Pune Journey…'}
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--muted)' }}>
                {isMr ? 'वेळ, बस-मेट्रो कॉरिडॉर व अचूक मार्गांची पडताळणी चालू आहे' : 'Matching verified landmarks, optimizing sequence, and estimating transit schedules'}
              </p>

              {/* Lightweight SVG Vertical Route Construction Visualization (Requirement 7) */}
              <div
                style={{
                  maxWidth: 320,
                  margin: '0 auto 24px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <strong style={{ fontSize: 13, color: '#065f46' }}>{start === 'my-live-gps' ? (isMr ? 'माझे GPS स्थान' : 'Your Live Location') : start}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 6 }}>
                  <svg width="12" height="28" viewBox="0 0 12 28">
                    <line x1="6" y1="0" x2="6" y2="28" stroke="#10b981" strokeWidth="3" className="journey-building-line" />
                  </svg>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>
                    {isMr ? 'मार्ग जोडत आहे…' : 'Calculating route leg…'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🏰</span>
                  <strong style={{ fontSize: 13, color: '#0f172a' }}>{isMr ? '१. सिंहगड / ऐतिहासिक वास्तू' : '1. Sinhagad / Historical Hub'}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 6 }}>
                  <svg width="12" height="28" viewBox="0 0 12 28">
                    <line x1="6" y1="0" x2="6" y2="28" stroke="#10b981" strokeWidth="3" className="journey-building-line" />
                  </svg>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>
                    {isMr ? 'वेळ व शुल्क पडताळणी…' : 'Optimizing travel & cost…'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🏛️</span>
                  <strong style={{ fontSize: 13, color: '#0f172a' }}>{isMr ? '२. शनिवार वाडा / वारसा स्थळ' : '2. Heritage Site / Cultural Hub'}</strong>
                </div>
              </div>

              {/* Generative Progress Bar (Requirement 6 - Slower, relaxed animation) */}
              <div
                style={{
                  maxWidth: 460,
                  margin: '0 auto 16px',
                  height: 6,
                  background: '#e2e8f0',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.round(((planningStep + 1) / PLANNING_STEPS.length) * 100))}%`,
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    borderRadius: 999,
                    transition: 'width 480ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>

              {/* Sequential 5-Step Planning Ticker (Requirement 6) */}
              <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PLANNING_STEPS.map((st, sIdx) => {
                  const isDone = planningStep > sIdx;
                  const isCurrent = planningStep === sIdx;
                  return (
                    <div
                      key={sIdx}
                      className="planning-step-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: isCurrent ? '#ecfdf5' : isDone ? '#f8fafc' : 'transparent',
                        border: isCurrent ? '1px solid #86efac' : '1px solid transparent',
                        color: isCurrent ? '#065f46' : isDone ? '#047857' : 'var(--muted)',
                        fontSize: 12.5,
                        fontWeight: isCurrent ? 800 : isDone ? 600 : 400,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{st.icon}</span>
                        <span>{isMr ? st.mr : st.en}</span>
                      </div>
                      <span>{isDone ? '✓' : isCurrent ? '⏳' : '○'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State when no plan yet */}
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

          {/* ===================================================================
              8. RESULT EXPAND & SMOOTH TRANSITION (Requirement 8, 9, 20)
              =================================================================== */}
          {activePlan?.feasible && (
            <div className="planner-results-wrapper" style={{ display: 'grid', gap: 16 }}>
              {/* 20. "Trip Ready" Completion Moment with Micro-Sparkles (Requirement 20) */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
                  border: '1.5px solid #10b981',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1)',
                }}
              >
                {/* 8 Micro Sparkles Floating around Heading (Requirement 20) */}
                {[...Array(8)].map((_, i) => (
                  <span
                    key={i}
                    className="micro-sparkle"
                    style={{
                      left: `${15 + i * 11}%`,
                      top: `${20 + (i % 3) * 20}%`,
                      fontSize: 10 + (i % 3) * 3,
                      animationDelay: `${i * 220}ms`,
                    }}
                  >
                    ✨
                  </span>
                ))}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: 32 }}>✨</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 17, color: '#065f46', fontWeight: 800 }}>
                      {isMr ? 'तुमचा पुणे सहल आराखडा तयार आहे!' : 'Your Pune Journey is Ready'}
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#047857' }}>
                      {isMr ? 'सर्व ठिकाणे, वेळ, बस-मेट्रो मार्ग आणि तिकिटे समाविष्ट' : 'Optimized transit timing, verified entry fees & landmark connections'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                  <button
                    type="button"
                    onClick={() => handleStartGuidedTrip(activePlan)}
                    className="btn"
                    style={{
                      background: '#047857',
                      color: '#ffffff',
                      padding: '8px 18px',
                      fontSize: 13,
                      fontWeight: 800,
                      borderRadius: 999,
                      boxShadow: '0 2px 8px rgba(4, 120, 87, 0.25)',
                    }}
                  >
                    🚀 {isMr ? 'थेट सहल सुरू करा' : 'Start Journey →'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRouteMap(!showRouteMap)}
                    className="btn outline"
                    style={{ padding: '8px 14px', fontSize: 13, borderColor: '#10b981', color: '#065f46' }}
                  >
                    🗺️ {showRouteMap ? (isMr ? 'नकाशा लपवा' : 'Hide Map') : (isMr ? 'नकाशा पहा' : 'View Route Map')}
                  </button>
                </div>
              </div>

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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--clay)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ✨ {t('planner.selectPlan')}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                      {isMr ? '३ स्वतंत्र व भिन्न पर्याय' : '3 Distinct Curated Options'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                    {plans.map((p: any, idx: number) => {
                      const isSelected = selectedPlanIndex === idx;
                      const title = isMr ? p.titleMr || p.titleEn : p.titleEn;
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
                            border: isSelected ? '2px solid var(--clay)' : '1px solid var(--line)',
                            background: isSelected ? 'var(--primary-light)' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span style={{ fontSize: 16 }}>{p.badge || '🗺️'}</span>
                            {isSelected && (
                              <span style={{ fontSize: 10.5, fontWeight: 800, background: 'var(--clay)', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>
                                {isMr ? '✓ निवडलेली' : '✓ Active'}
                              </span>
                            )}
                          </div>
                          <strong style={{ fontSize: 13.5, color: isSelected ? 'var(--clay)' : 'var(--ink)', marginTop: 2 }}>
                            {title}
                          </strong>
                          <span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 500 }}>
                            {p.stops?.length || 0} {isMr ? 'ठिकाणे' : 'stops'} • {p.totalDurationMinutes} {isMr ? 'मि.' : 'min'} • ₹{p.knownCost}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 9. TRIP SUMMARY STATS WITH COUNT-UP & SHIMMER (Requirement 9) */}
              <div
                className="panel summary-highlight-shimmer"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: 16,
                  background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-light) 100%)',
                  border: '1.5px solid var(--primary-border)',
                  borderRadius: 12,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  <span style={{ fontSize: 11.5, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    ⏱️ {t('planner.timePlanned')}
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}>
                    {Math.floor(animatedDuration / 60)}h {animatedDuration % 60}m
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11.5, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    🏛️ {isMr ? 'एकूण ठिकाणे' : 'Destinations'}
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginTop: 2 }}>
                    {animatedStopsCount} {isMr ? 'ठिकाणे' : 'Places'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11.5, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    🛣️ {isMr ? 'एकूण अंतर' : 'Total Distance'}
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0369a1', marginTop: 2 }}>
                    {animatedDistanceKm} km
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11.5, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    🎟️ {t('planner.estCost')}
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--clay)', marginTop: 2 }}>
                    ₹{animatedCost} {isMr ? 'अंदाजे' : 'Est.'}
                  </div>
                </div>
              </div>

              {/* 13. EMBEDDED INTERACTIVE ROUTE MAP (Requirement 13) */}
              {showRouteMap && activePlanJourney && (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid var(--line)',
                    borderRadius: 'var(--radius)',
                    padding: 16,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>🗺️</span>
                      <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                        {isMr ? 'सहल मार्ग नकाशा (Interactive Route Line & Stops)' : 'Interactive Route Map & Verified Corridor'}
                      </strong>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                      {mode === 'public_transit' ? '🚇 Metro & PMPML' : mode}
                    </span>
                  </div>
                  <JourneyMapAnimation journey={activePlanJourney} isMr={isMr} />
                </div>
              )}

              {/* Free Itinerary Export & Sharing Toolbar with PDF Download */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '4px 0', alignItems: 'center' }}>
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
                >
                  <span>{downloadingPdf ? '⏳' : '📥'}</span>
                  <span>{downloadingPdf ? (isMr ? 'PDF तयार करत आहे…' : 'Generating PDF…') : (isMr ? 'सहल PDF डाऊनलोड करा' : 'Download Itinerary PDF')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => typeof window !== 'undefined' && window.print()}
                  className="btn outline"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
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
                >
                  <span>📧</span>
                  <span>{isMr ? 'ईमेलवर PDF मिळवा' : 'Email Me PDF'}</span>
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

                  <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#065f46', marginBottom: 4 }}>
                          👤 {isMr ? 'तुमचे नाव:' : 'Your Name:'}
                        </label>
                        <input
                          type="text"
                          required
                          value={itineraryUserName}
                          onChange={(e) => setItineraryUserName(e.target.value)}
                          placeholder={isMr ? 'तुमचे नाव (उदा. सुरज ढोक)' : 'Your Name (e.g. Suraj Dhok)'}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#ffffff', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#065f46', marginBottom: 4 }}>
                          ✉️ {isMr ? 'तुमचा ईमेल पत्ता:' : 'Your Email Address:'}
                        </label>
                        <input
                          type="email"
                          required
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="user@example.com"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#ffffff', boxSizing: 'border-box' }}
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
                        <span>{sendingEmail ? (isMr ? 'पाठवत आहे…' : 'Sending…') : (isMr ? 'PDF ईमेल पाठवा' : 'Send PDF Itinerary')}</span>
                      </button>
                    </div>
                  </form>

                  {emailSuccess && (
                    <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#047857' }}>
                      {emailSuccess}
                    </div>
                  )}
                  {emailError && (
                    <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
                      {emailError}
                    </div>
                  )}
                </div>
              )}

              {/* 10, 11, 12, 15, 16. VERTICAL JOURNEY TIMELINE & STOPS (Requirement 10, 11, 12, 15, 16) */}
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ margin: '8px 0 0', fontSize: 17, color: 'var(--ink)', fontWeight: 800 }}>
                    📍 {t('planner.routeItinerary')} ({activePlan.stops?.length || 0} {isMr ? 'ठिकाणे' : 'Stops'})
                  </h3>

                  {/* Add Place CTA (Requirement 17) */}
                  <button
                    type="button"
                    onClick={handleOpenAddPlaceModal}
                    className="btn outline"
                    style={{
                      padding: '6px 14px',
                      fontSize: 12.5,
                      fontWeight: 700,
                      borderColor: '#10b981',
                      color: '#065f46',
                      background: '#ecfdf5',
                      borderRadius: 999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>➕</span>
                    <span>{isMr ? 'नवीन ठिकाण जोडा' : 'Add Place to Route'}</span>
                  </button>
                </div>

                {activePlan.stops.map((s: any, i: number) => {
                  const isRemoving = removingStopId === s.placeId;
                  const isJustAdded = justAddedStopId === s.placeId;
                  return (
                    <div
                      key={s.placeId}
                      className={`panel itinerary-stop-card-hover ${isRemoving ? 'stop-card-removing' : ''} ${isJustAdded ? 'stop-card-just-added' : ''}`}
                      style={{
                        padding: 18,
                        border: '1.5px solid var(--line)',
                        borderRadius: 'var(--radius)',
                        position: 'relative',
                        '--stop-i': i,
                      } as React.CSSProperties}
                    >
                      <div style={{ display: 'flex', alignItems: 'start', gap: 14 }}>
                        {/* Timeline Node Number Circle (Requirement 11) */}
                        <span
                          className={`timeline-node-circle ${i === 0 ? 'timeline-current-pulse' : ''}`}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: '#047857',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 13,
                            flexShrink: 0,
                            boxShadow: '0 2px 6px rgba(4, 120, 87, 0.25)',
                          }}
                        >
                          {i + 1}
                        </span>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 8 }}>
                            <div>
                              <strong
                                style={{
                                  fontSize: 17,
                                  color: 'var(--ink)',
                                  fontFamily: isMr ? 'var(--deva)' : 'inherit',
                                }}
                              >
                                {isMr ? s.placeName_mr || s.placeName : s.placeName}
                              </strong>
                              {isMr && s.placeName_mr && (
                                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{s.placeName}</div>
                              )}
                            </div>

                            {/* Reorder and Remove Controls (Requirement 15 & 16) */}
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleMoveStop(i, 'up')}
                                disabled={i === 0}
                                title={isMr ? 'वर हलवा' : 'Move Up'}
                                style={{
                                  border: '1px solid var(--line)',
                                  background: '#ffffff',
                                  borderRadius: 4,
                                  padding: '3px 7px',
                                  fontSize: 11,
                                  cursor: i === 0 ? 'not-allowed' : 'pointer',
                                  opacity: i === 0 ? 0.35 : 1,
                                }}
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveStop(i, 'down')}
                                disabled={i === activePlan.stops.length - 1}
                                title={isMr ? 'खाली हलवा' : 'Move Down'}
                                style={{
                                  border: '1px solid var(--line)',
                                  background: '#ffffff',
                                  borderRadius: 4,
                                  padding: '3px 7px',
                                  fontSize: 11,
                                  cursor: i === activePlan.stops.length - 1 ? 'not-allowed' : 'pointer',
                                  opacity: i === activePlan.stops.length - 1 ? 0.35 : 1,
                                }}
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveStop(s.placeId)}
                                title={isMr ? 'यादीतून काढा' : 'Remove stop'}
                                style={{
                                  border: '1px solid #fecaca',
                                  background: '#fef2f2',
                                  color: '#dc2626',
                                  borderRadius: 4,
                                  padding: '3px 8px',
                                  fontSize: 11.5,
                                  cursor: 'pointer',
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
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

                          {/* Quick Action Buttons */}
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
                            <button
                              type="button"
                              onClick={() =>
                                openDirectionsModal({
                                  id: s.placeId,
                                  name: s.placeName,
                                  nameMr: s.placeName_mr,
                                  latitude: s.latitude,
                                  longitude: s.longitude,
                                  slug: s.placeSlug,
                                  imageUrl: s.image_url,
                                })
                              }
                              className="btn outline"
                              style={{
                                padding: '5px 12px',
                                fontSize: 12,
                                borderColor: '#10b981',
                                color: '#065f46',
                                background: '#ecfdf5',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              📍 {isMr ? 'थेट GPS नेव्हिगेशन' : 'Navigate'}
                            </button>

                            <Link
                              href={`/places/${s.placeSlug}`}
                              className="btn outline"
                              style={{ padding: '5px 12px', fontSize: 12 }}
                            >
                              {isMr ? 'तपशील →' : 'View Place →'}
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Public Transit Leg (Requirement 10) */}
                      {s.transitDetails && (
                        <div
                          style={{
                            marginTop: 14,
                            padding: 12,
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 12.5,
                          }}
                        >
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ background: '#047857', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                              🚌 {isMr ? 'सार्वजनिक मार्ग' : 'Transit Route'}
                            </span>
                            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                              {isMr ? s.transitDetails.summaryMr : s.transitDetails.summaryEn}
                            </span>
                          </div>

                          <ol style={{ margin: '6px 0 8px 18px', padding: 0, color: '#334155' }}>
                            {(isMr ? s.transitDetails.stepByStepMr : s.transitDetails.stepByStepEn).map((st: string, idx: number) => (
                              <li key={idx} style={{ marginBottom: 3 }}>
                                {st}
                              </li>
                            ))}
                          </ol>

                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingTop: 6, borderTop: '1px dashed #cbd5e1', fontSize: 12 }}>
                            <div style={{ color: '#047857', fontWeight: 600 }}>
                              🎟️ {isMr ? s.transitDetails.ticketInfoMr : s.transitDetails.ticketInfoEn}
                            </div>
                            {s.transitDetails.bookingOptions?.metroWhatsApp && (
                              <a
                                href={s.transitDetails.bookingOptions.metroWhatsApp}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#25d366', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              >
                                📲 {isMr ? 'WhatsApp वर मेट्रो QR तिकीट ↗' : 'WhatsApp Metro QR Ticket ↗'}
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Regards & Attribution Section */}
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
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
          17. ADD PLACE SEARCH MODAL (Requirement 17)
          =================================================================== */}
      {addPlaceModalOpen && (
        <ModalPortal isOpen={addPlaceModalOpen} onClose={() => setAddPlaceModalOpen(false)}>
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(3px)',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setAddPlaceModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              maxWidth: 560,
              width: '100%',
              margin: 'auto',
              maxHeight: '88vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.35)',
              border: '1px solid #e2e8f0',
              animation: 'modalSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <LucidePlus size={20} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isMr ? 'सहल आराखडा' : 'Explore Pune Route'}
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {isMr ? 'मार्गामध्ये नवीन ठिकाण जोडा' : 'Add a Verified Landmark'}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddPlaceModalOpen(false)}
                aria-label="Close"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <LucideX size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>

            <input
              type="text"
              value={addPlaceSearchQuery}
              onChange={(e) => setAddPlaceSearchQuery(e.target.value)}
              placeholder={isMr ? 'नाव शोधा (उदा. पाताळेश्वर, शनिवार वाडा, सिंहगड)...' : 'Search landmark by name (e.g. Pataleshwar, Sinhagad)...'}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: 14,
                marginBottom: 14,
                boxSizing: 'border-box',
              }}
              autoFocus
            />

            {loadingPlacesList ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                ⏳ {isMr ? 'ठिकाणे लोड करत आहे…' : 'Loading verified places…'}
              </div>
            ) : filteredAvailablePlaces.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                {isMr ? 'कोणतेही ठिकाण सापडले नाही.' : 'No matching landmarks found.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredAvailablePlaces.map((p) => {
                  const alreadyInRoute = activePlan?.stops?.some((s: any) => s.placeId === p.id || (p.slug && s.placeSlug === p.slug));
                  return (
                    <div
                      key={p.id}
                      style={{
                        padding: '10px 14px',
                        border: '1px solid var(--line)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        background: alreadyInRoute ? '#f8fafc' : '#ffffff',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: 14, color: 'var(--ink)', display: 'block' }}>
                          {isMr ? p.name_mr || p.name : p.name}
                        </strong>
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {p.category_name || p.category_slug} • ⏱️ {p.recommended_duration_minutes || 45} min •{' '}
                          {p.entry_fee === 0 ? (isMr ? 'मोफत' : 'Free') : `₹${p.entry_fee}`}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddPlaceToRoute(p)}
                        disabled={alreadyInRoute}
                        className="btn"
                        style={{
                          padding: '6px 14px',
                          fontSize: 12,
                          background: alreadyInRoute ? '#94a3b8' : '#047857',
                          color: '#ffffff',
                          cursor: alreadyInRoute ? 'default' : 'pointer',
                          borderRadius: 6,
                          flexShrink: 0,
                        }}
                      >
                        {alreadyInRoute ? (isMr ? 'समाविष्ट आहे' : 'In Route') : (isMr ? 'जोडा +' : 'Add +')}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            </div>{/* end scrollable body */}
          </div>
        </div>
        </ModalPortal>
      )}
    </main>
  );
}

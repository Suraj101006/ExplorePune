'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  MapPin,
  Clock,
  Ticket,
  ShieldCheck,
  Volume2,
  Bookmark,
  Camera,
  Search,
  ArrowRight,
  Sun,
  Bus,
  Mountain,
  Landmark,
  BookOpen,
  History,
  CheckCircle2,
  Utensils,
  Calendar,
  ChevronRight,
  Info,
  ExternalLink,
  X,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import HeroWatermarkAnimation from '@/components/HeroWatermarkAnimation';
import FeedbackSection from '@/components/FeedbackSection';
import WeatherWidget from '@/components/WeatherWidget';
import LocationPickerModal from '@/components/LocationPickerModal';
import { calculateDistanceKm } from '@/lib/publicTransit';
import { getOperatingStatus } from '@/lib/operatingHours';
import { speakPlaceName } from '@/lib/speech';
import { getSavedPlaces, toggleSavedPlace } from '@/lib/savedPlaces';
import { getStoredUserLocation, UserSavedLocation, DEFAULT_PUNE_STATIC_LOCATION } from '@/lib/userLocation';
import PlacePhotoSlideshowModal from '@/components/PlacePhotoSlideshowModal';
import { useTravelPhotoTransition } from '@/components/TravelPhotoTransition';
import { openDirectionsModal } from '@/lib/navigationService';

const TIER_MR: Record<string, string> = {
  verified: 'तपासलेले अधिकृत तपशील',
  enriched: 'सार्वजनिक शासकीय माहिती',
  listed: 'नोंदणीकृत ठिकाण',
};

const TIER_EN: Record<string, string> = {
  verified: 'Official Verified Source',
  enriched: 'Public Heritage Record',
  listed: 'Listed Heritage Site',
};

const CATEGORY_NAMES_MR: Record<string, string> = {
  forts: 'किल्ले व गड',
  heritage: 'ऐतिहासिक वाडे',
  temples: 'प्रसिद्ध मंदिरे',
  museums: 'वस्तुसंग्रहालये',
  parks: 'उद्याने व बागा',
  nature: 'तलाव व निसर्ग',
  food: 'पुणेरी खाद्यसंस्कृती',
};

const CATEGORY_BADGES: Record<string, string> = {
  all: '/images/logo.svg',
  forts: '/images/places/sinhagad-fort.jpg',
  heritage: '/images/places/shaniwar-wada.jpg',
  temples: '/images/places/shreemant-dagdusheth-halwai-ganpati.jpg',
  museums: '/images/places/raja-dinkar-kelkar-museum.jpg',
  parks: '/images/places/okayama-friendship-garden.jpg',
  nature: '/images/places/khadakwasla-dam.jpg',
};

const POPULAR_SEARCHES = [
  { label: 'Sinhagad Fort', labelMr: 'सिंहगड किल्ला', query: 'Sinhagad', slug: 'sinhagad-fort' },
  { label: 'Shaniwar Wada Palace', labelMr: 'शनिवार वाडा महाल', query: 'Shaniwar Wada', slug: 'shaniwar-wada' },
  { label: 'Dagdusheth Ganpati', labelMr: 'दगडूशेठ गणपती', query: 'Dagdusheth', slug: 'shreemant-dagdusheth-halwai-ganpati' },
  { label: 'Kelkar Museum', labelMr: 'केळकर संग्रहालय', query: 'Kelkar', slug: 'raja-dinkar-kelkar-museum' },
  { label: 'Phule Wada', labelMr: 'महात्मा फुले वाडा', query: 'Phule Wada', slug: 'mahatma-phule-wada' },
  { label: 'Aga Khan Palace', labelMr: 'आगाखान पॅलेस', query: 'Aga Khan Palace', slug: 'aga-khan-palace' },
  { label: 'Pataleshwar Cave', labelMr: 'पाताळेश्वर लेणी', query: 'Pataleshwar', slug: 'pataleshwar-cave-temple' },
  { label: 'Khadakwasla Dam', labelMr: 'खडकवासला धरण', query: 'Khadakwasla', slug: 'khadakwasla-dam' },
];

export const PUNE_GEOGRAPHIC_ZONES = [
  { id: 'all', nameEn: 'All Pune Districts', nameMr: 'संपूर्ण पुणे विभाग', emoji: '🚩' },
  { id: 'peths', nameEn: 'Historic Peths & Wadas', nameMr: 'ऐतिहासिक पेठा व वाडे', emoji: '🏰' },
  { id: 'deccan', nameEn: 'Deccan & Kothrud', nameMr: 'डेक्कन व कोथरूड', emoji: '🌿' },
  { id: 'camp', nameEn: 'Pune Camp & Cantonment', nameMr: 'पुणे कॅम्प व लष्कर', emoji: '🎖️' },
  { id: 'koregaon', nameEn: 'Koregaon Park & Nagar Rd', nameMr: 'कोरेगाव पार्क व परिसर', emoji: '🌳' },
  { id: 'forts', nameEn: 'Sahyadri Forts & Reservoirs', nameMr: 'सह्याद्री गड-किल्ले', emoji: '⛰️' },
];

function getPlaceLocality(place: any, isMr: boolean): string {
  if (isMr && place.address_mr) {
    const parts = place.address_mr.split(',');
    return parts[0]?.trim() || 'पुणे';
  }
  if (place.address) {
    const parts = place.address.split(',');
    return parts[0]?.trim() || 'Pune';
  }
  return isMr ? 'पुणे' : 'Pune';
}

function formatDuration(minutes?: number, isMr?: boolean): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} ${isMr ? 'मि.' : 'min'}`;
  const hrs = Math.round((minutes / 60) * 10) / 10;
  return `${hrs} ${isMr ? 'तास' : 'hrs'}`;
}

function formatTicket(place: any, isMr: boolean): string {
  if (!place) return isMr ? 'प्रवेश माहिती उपलब्ध' : 'Entry info available';
  const price = place.place_prices?.[0];
  // Case 1: Verified Free Entry (₹0 confirmed by authoritative sources)
  if (place.fee_status === 'free' || place.entry_fee === 0) {
    return isMr ? 'मोफत प्रवेश (₹०)' : 'Free Entry (₹0)';
  }
  // Case 2: Verified Paid Entry
  if (place.fee_status === 'paid' || (typeof place.entry_fee === 'number' && place.entry_fee > 0)) {
    const amount = place.entry_fee ?? price?.amount;
    return `₹${amount}${isMr ? ' प्रति व्यक्ती' : ' per person'}`;
  }
  if (price && typeof price.amount === 'number' && price.amount > 0) {
    return `₹${price.amount}${isMr ? ' प्रति व्यक्ती' : ' per person'}`;
  }
  if (price && price.is_free && place.fee_status !== 'paid') {
    return isMr ? 'मोफत प्रवेश (₹०)' : 'Free Entry (₹0)';
  }
  // Case 3: Unknown / Not Verified - NEVER convert to ₹0
  if (place.fee_status === 'not_verified' || place.entry_fee === null) {
    return isMr ? 'प्रवेश शुल्क अधिकृतपणे पुष्टी नाही' : 'Fee info not officially confirmed';
  }
  return isMr ? 'प्रवेश माहिती उपलब्ध' : 'Entry info available';
}

interface HomeExplorerProps {
  places: any[];
  categories: any[];
  currentCat: string;
  searchTerm: string;
  page: number;
  totalPages: number;
  totalCount: number;
}

export default function HomeExplorer({
  places,
  categories,
  currentCat,
  searchTerm,
  page,
  totalPages,
  totalCount,
}: HomeExplorerProps) {
  const { isMr, t } = useLanguage();
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [showAll, setShowAll] = useState(Boolean(currentCat || searchTerm || page > 1));
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [savedLoc, setSavedLoc] = useState<UserSavedLocation | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [sortByNearMe, setSortByNearMe] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [slideshowPlace, setSlideshowPlace] = useState<any | null>(null);
  const { startTransition: startPhotoTransition } = useTravelPhotoTransition();
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [poppingBookmarkId, setPoppingBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    const loc = getStoredUserLocation() || DEFAULT_PUNE_STATIC_LOCATION;
    setSavedLoc(loc);
    setUserCoords({ lat: loc.lat, lng: loc.lng });

    const handleLocChanged = (e: any) => {
      const updated = e.detail || getStoredUserLocation() || DEFAULT_PUNE_STATIC_LOCATION;
      if (updated) {
        setSavedLoc(updated);
        setUserCoords({ lat: updated.lat, lng: updated.lng });
      }
    };

    window.addEventListener('explore-pune-location-changed', handleLocChanged);
    return () => window.removeEventListener('explore-pune-location-changed', handleLocChanged);
  }, []);

  useEffect(() => {
    const syncSaved = () => {
      setSavedIds(getSavedPlaces().map((p) => p.id));
    };
    syncSaved();
    window.addEventListener('explore-pune-saved-changed', syncSaved);
    return () => window.removeEventListener('explore-pune-saved-changed', syncSaved);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -25px 0px' }
    );

    const targets = document.querySelectorAll('.scroll-reveal, .scroll-reveal-group');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleToggleSave = (p: any) => {
    const isCurrentlySaved = savedIds.includes(p.id);
    setPoppingBookmarkId(p.id);
    setTimeout(() => setPoppingBookmarkId(null), 300);

    toggleSavedPlace({
      id: p.id,
      slug: p.slug || p.id,
      name: p.name,
      name_mr: p.name_mr,
      image_url: p.image_url,
      category_slug: p.category_slug,
      category: p.category,
      data_tier: p.data_tier,
    });

    const placeTitle = isMr && p.name_mr ? p.name_mr : p.name;
    const msg = !isCurrentlySaved
      ? (isMr ? `✓ "${placeTitle}" आवडत्या यादीत जोडले` : `✓ Added "${placeTitle}" to your Pune collection`)
      : (isMr ? `"${placeTitle}" यादीतून काढले` : `Removed "${placeTitle}" from collection`);

    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleSpeak = (p: any) => {
    setSpeakingId(p.id);
    const text = isMr && p.name_mr ? p.name_mr : p.name;
    speakPlaceName(text, isMr);
    setTimeout(() => setSpeakingId(null), 2500);
  };

  const isDefaultHome = !currentCat && !searchTerm && page === 1;

  // Attach distance from selected Pune locality
  const placesWithDistance = places.map((p) => {
    if (userCoords && p.latitude && p.longitude) {
      const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, p.latitude, p.longitude);
      return { ...p, distanceKm: dist };
    }
    return p;
  });

  // Sort if near-me filter is enabled
  const sortedPlaces =
    sortByNearMe && userCoords
      ? [...placesWithDistance].sort(
          (a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999)
        )
      : placesWithDistance;

  const zoneFilteredPlaces =
    selectedZone === 'all'
      ? sortedPlaces
      : sortedPlaces.filter((p) => {
          const text = `${p.name} ${p.name_mr || ''} ${p.address || ''} ${p.address_mr || ''} ${p.slug} ${p.category_slug || ''}`.toLowerCase();
          if (selectedZone === 'forts') {
            return p.category_slug === 'forts' || text.includes('fort') || text.includes('किल्ला') || text.includes('dam') || text.includes('ghat');
          }
          if (selectedZone === 'peths') {
            return text.includes('peth') || text.includes('पेठ') || text.includes('wada') || text.includes('वाडा') || text.includes('mahal');
          }
          if (selectedZone === 'deccan') {
            return text.includes('deccan') || text.includes('kothrud') || text.includes('fergusson') || text.includes('vetal') || text.includes('arai') || text.includes('deshpande') || text.includes('pataleshwar');
          }
          if (selectedZone === 'camp') {
            return text.includes('camp') || text.includes('कॅम्प') || text.includes('cantonment') || text.includes('bund') || text.includes('memorial') || text.includes('shinde');
          }
          if (selectedZone === 'koregaon') {
            return text.includes('koregaon') || text.includes('aga khan') || text.includes('osho') || text.includes('yerawada') || text.includes('nagar');
          }
          return true;
        });

  const displayedPlaces =
    !isDefaultHome || showAll || sortByNearMe || selectedZone !== 'all' ? zoneFilteredPlaces : zoneFilteredPlaces.slice(0, 6);

  const href = (p: number) =>
    `/?${new URLSearchParams({
      ...(searchTerm && { q: searchTerm }),
      ...(currentCat && { cat: currentCat }),
      page: String(p),
    })}`;

  return (
    <>
      {/* Hero Section: Authoritative Heritage Guide */}
      <section className="hero wrap">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <div
              className="hero-anim-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: '999px',
                background: '#f8fafc',
                border: '1px solid var(--line)',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: 'var(--ink-secondary)',
                textTransform: 'uppercase',
              }}
            >
              <ShieldCheck size={13} color="#059669" />
              <span>{isMr ? 'पुणे अधिकृत वारसा सूची · २०२६' : 'Curated Pune Heritage Field Guide · 2026'}</span>
            </div>
            <div className="hero-anim-weather">
              <WeatherWidget />
            </div>
          </div>

          <h1 className="hero-anim-title">
            {isMr ? (
              <>
                पुण्यातील <span className="gradient">ऐतिहासिक किल्ले, वाडे</span> व सांस्कृतिक वारसा
              </>
            ) : (
              <>
                The Curated Field Guide to <span className="gradient">Historic Pune</span>
              </>
            )}
          </h1>

          <p className="lede hero-anim-desc">
            {isMr
              ? 'छत्रपती शिवाजी महाराजांचे अजिंक्य किल्ले, पेशवेकालीन वाडे, पवित्र मंदिरे, अधिकृत वेळापत्रक आणि थेट सार्वजनिक वाहतूक मार्गदर्शक.'
              : 'An authoritative, locally researched field guide to Maratha forts, Peshwa-era wadas, sacred sanctuaries, verified opening hours, and public transit schedules.'}
          </p>

          <form className="search hero-anim-search" action="/" role="search">
            <input
              name="q"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              aria-label={t('hero.searchPlaceholder')}
            />
            {currentCat && <input type="hidden" name="cat" value={currentCat} />}
            <button className="btn" type="submit">
              <span className="btn-icon">
                <Search size={16} />
              </span>
              <span>{t('hero.searchBtn')}</span>
            </button>
          </form>

          {/* Quick Search Chips */}
          <div
            className="hero-anim-chips-wrap"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
              marginTop: 12,
              fontSize: 12,
            }}
          >
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
              {isMr ? 'वारंवार शोधलेले:' : 'Quick lookup:'}
            </span>
            {POPULAR_SEARCHES.map((item, idx) => (
              <Link
                key={item.query}
                href={`/places/${item.slug}`}
                aria-label={`Visit ${item.label} guide`}
                className="chip hero-search-chip hero-anim-chip"
                style={{
                  '--chip-i': idx,
                  padding: '3px 10px',
                  fontSize: '11.5px',
                  borderRadius: '999px',
                  background: '#f8fafc',
                  border: '1px solid var(--line)',
                  color: 'var(--ink-secondary)',
                  textDecoration: 'none',
                  fontWeight: 600,
                } as React.CSSProperties}
              >
                {isMr ? item.labelMr : item.label}
              </Link>
            ))}
          </div>

          {/* Hero Action CTAs */}
          <div className="hero-actions hero-anim-actions" style={{ marginTop: 20 }}>
            <a className="btn clay btn-explore-places" href="#explore-places">
              <span className="btn-icon">
                <Compass size={16} />
              </span>
              <span>{isMr ? 'सर्व ठिकाणे पहा' : 'Explore Heritage Places'}</span>
            </a>
            <Link className="btn outline" href="/planner">
              <span className="btn-icon">
                <Calendar size={16} />
              </span>
              <span>{isMr ? 'सहल नियोजन करा' : 'Plan My Visit'}</span>
            </Link>
            <Link className="btn outline" href="/milestones">
              <span className="btn-icon">
                <CheckCircle2 size={16} />
              </span>
              <span>{isMr ? 'भ्रमंती यशोगाथा पहा' : 'Explorer Milestones'}</span>
            </Link>
          </div>

          {/* Source Transparency & Provenance Strip */}
          <div
            className="hero-anim-trust"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              flexWrap: 'wrap',
              marginTop: 22,
              paddingTop: 16,
              borderTop: '1px solid var(--line-light)',
              fontSize: '12.5px',
              color: 'var(--muted)',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} color="#059669" />
              <span>{isMr ? 'महाराष्ट्र पर्यटन व पुरातत्व खात्याकडून प्रमाणित' : 'Maharashtra Tourism & ASI Ground-Truth Data'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Bus size={14} color="#059669" />
              <span>{isMr ? 'पुणे मेट्रो व PMPML थेट वेळापत्रक' : 'Integrated Pune Metro & PMPML Transit'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={14} color="#059669" />
              <span>{isMr ? 'तपासलेले प्रवेश शुल्क आणि वेळ' : 'Verified Operating Hours & Ticket Tariffs'}</span>
            </div>
          </div>
        </div>

        {/* Animated Pune Calligraphy & Royal Crest Watermark */}
        <HeroWatermarkAnimation />
      </section>

      {/* CURATED HIGHLIGHTS: Editor's Picks */}
      <section className="wrap scroll-reveal-group" style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              {isMr ? 'संपादकांची निवड' : "Curator's Highlights"}
            </span>
            <h2 style={{ fontSize: '22px', margin: '2px 0 0', fontWeight: 800 }}>
              {isMr ? 'पुण्याचे चार मानाचे ऐतिहासिक स्तंभ' : 'Four Iconic Pillars of Pune Heritage'}
            </h2>
          </div>
          <Link
            href="/milestones"
            style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <span>{isMr ? 'पुणेकर यशोगाथा व पदके पहा' : 'Earn Explorer Badges & Milestones'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid">
          {/* Card 1: Sinhagad Fort */}
          <div
            className="scroll-reveal-child"
            style={{
              '--reveal-i': 0,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ position: 'relative', height: 160, width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
              <img
                src="/images/places/sinhagad-fort.jpg"
                alt="Sinhagad Fort"
                width={320}
                height={180}
                loading="eager"
                {...({ fetchPriority: 'high' } as any)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '16 / 9' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.04em',
                }}
              >
                {isMr ? 'किल्ले · सह्याद्री' : 'Historic Fort · Donje'}
              </span>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <strong style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: 2 }}>
                {isMr ? 'सिंहगड किल्ला (कोंढाणा)' : "Sinhagad Fort (Lion's Fort)"}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: 8 }}>
                {isMr ? 'सुभेदार तानाजी मालुसरे यांचा पराक्रम · १,३१२ मीटर' : 'Tanaji Malusare 1670 Battleground · 1,312m Ridge'}
              </span>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45, margin: '0 0 12px' }}>
                {isMr
                  ? 'कल्याण दरवाजा, तानाजी समाधी आणि अप्रतिम सह्याद्री निसर्ग दृश्ये.'
                  : 'Iconic Sahyadri hill fortress known for Kalyan Darwaza and panoramic valley vistas.'}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--line-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={12} />
                  {isMr ? 'सकाळी ६ ते सायं ६' : '06:00 – 18:00'}
                </span>
                <Link
                  href="/places/sinhagad-fort"
                  aria-label="View Sinhagad Fort visitor guide and history"
                  style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                >
                  {isMr ? 'सिंहगड माहिती →' : 'Sinhagad Guide →'}
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Shaniwar Wada */}
          <div
            className="scroll-reveal-child"
            style={{
              '--reveal-i': 1,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ position: 'relative', height: 160, width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
              <img
                src="/images/places/shaniwar-wada.jpg"
                alt="Shaniwar Wada"
                width={320}
                height={180}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '16 / 9' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.04em',
                }}
              >
                {isMr ? 'वाडे · शनिवार पेठ' : 'Peshwa Seat · Shaniwar Peth'}
              </span>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <strong style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: 2 }}>
                {isMr ? 'शनिवार वाडा' : 'Shaniwar Wada'}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: 8 }}>
                {isMr ? 'पेशवे बाजीराव पहिले · १७३२ ची भव्य तटबंदी' : 'Peshwa Baji Rao I · 1732 CE Stone Citadel'}
              </span>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45, margin: '0 0 12px' }}>
                {isMr
                  ? 'मराठा साम्राज्याची राजधानी, दिल्ली दरवाजा व १६ कमळांचा कारंजा.'
                  : 'The historic seat of the Peshwa rulers, Delhi Darwaza spikes, and Hazari Karanje.'}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--line-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={12} />
                  {isMr ? 'सकाळी ९:३० ते सायं ५:३०' : '09:30 – 17:30'}
                </span>
                <Link
                  href="/places/shaniwar-wada"
                  aria-label="View Shaniwar Wada visitor guide and history"
                  style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                >
                  {isMr ? 'शनिवार वाडा माहिती →' : 'Shaniwar Wada Guide →'}
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Raja Dinkar Kelkar Museum */}
          <div
            className="scroll-reveal-child"
            style={{
              '--reveal-i': 2,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ position: 'relative', height: 160, width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
              <img
                src="/images/places/raja-dinkar-kelkar-museum.jpg"
                alt="Raja Dinkar Kelkar Museum"
                width={320}
                height={180}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '16 / 9' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.04em',
                }}
              >
                {isMr ? 'वस्तुसंग्रहालय · शुक्रवार पेठ' : 'Museum · Shukrawar Peth'}
              </span>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <strong style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: 2 }}>
                {isMr ? 'राजा दिनकर केळकर संग्रहालय' : 'Raja Dinkar Kelkar Museum'}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: 8 }}>
                {isMr ? '२०,०००+ ऐतिहासिक दुर्मिळ वस्तू व मस्तानी महाल' : '20,000+ Maratha Artifacts & Mastani Mahal'}
              </span>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45, margin: '0 0 12px' }}>
                {isMr
                  ? 'डॉ. दिनकर केळकर यांचा जीवनगौरव संग्रह: वाद्ये, शस्त्रे व हस्तकला.'
                  : 'Priceless single-collector treasury of 18th-century textiles, instruments, and arms.'}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--line-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={12} />
                  {isMr ? 'सकाळी १० ते सायं ५:३०' : '10:00 – 17:30'}
                </span>
                <Link
                  href="/places/raja-dinkar-kelkar-museum"
                  aria-label="View Raja Dinkar Kelkar Museum visitor guide and artifacts"
                  style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                >
                  {isMr ? 'केळकर संग्रहालय माहिती →' : 'Kelkar Museum Guide →'}
                </Link>
              </div>
            </div>
          </div>

          {/* Card 4: Pataleshwar Cave Temple */}
          <div
            className="scroll-reveal-child"
            style={{
              '--reveal-i': 3,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ position: 'relative', height: 160, width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
              <img
                src="/images/places/pataleshwar-cave-temple.jpg"
                alt="Pataleshwar Cave Temple"
                width={320}
                height={180}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '16 / 9' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.04em',
                }}
              >
                {isMr ? 'प्राचीन लेणी · शिवाजीनगर' : 'Rock-Cut Shrine · Shivajinagar'}
              </span>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <strong style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: 2 }}>
                {isMr ? 'पाताळेश्वर लेणी मंदिर' : 'Pataleshwar Cave Temple'}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: 8 }}>
                {isMr ? '८वे शतक · राष्ट्रकूटकालीन अखंड कातळात कोरलेले मंदिर' : '8th-Century Rashtrakuta Monolithic Shrine'}
              </span>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45, margin: '0 0 12px' }}>
                {isMr
                  ? 'जंगली महाराज रस्त्यावरील बेसाल्ट खडकातील वर्तुळाकार नंदी मंडप व शिवमंदिर.'
                  : 'Carved out of single basalt rock, featuring a circular Nandi pavilion on JM Road.'}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--line-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={12} />
                  {isMr ? 'सकाळी ८:३० ते सायं ५:३०' : '08:30 – 17:30'}
                </span>
                <Link
                  href="/places/pataleshwar-cave-temple"
                  aria-label="View Pataleshwar Cave Temple monolithic shrine details"
                  style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                >
                  {isMr ? 'पाताळेश्वर लेणी माहिती →' : 'Pataleshwar Cave Guide →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED TRAILS: Explore by Experience */}
      <section className="wrap scroll-reveal-group" style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              {isMr ? 'विषयवार वाटा' : 'Thematic Pune Trails'}
            </span>
            <h2 style={{ fontSize: '22px', margin: '2px 0 0', fontWeight: 800 }}>
              {isMr ? 'अभिरुचीनुसार वारसा मार्ग निवडा' : 'Explore Pune by Cultural Experience'}
            </h2>
          </div>
          <Link
            href="/planner"
            style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <span>{isMr ? 'कस्टम सहल प्लॅन करा' : 'Custom Itinerary Planner'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid">
          {/* Trail 1: Forts */}
          <div
            className="trail-card scroll-reveal-child"
            style={{
              '--reveal-i': 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '20px',
              background: 'var(--card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  background: '#ffedd5',
                  color: '#c2410c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mountain size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#c2410c', background: '#ffedd5', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
                {isMr ? '१२ गड-किल्ले' : '12 Forts'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: 4 }}>
                <Link
                  href="/destinations/forts"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {isMr ? 'सह्याद्रीचे अजिंक्य किल्ले' : 'Sahyadri Forts & Bastions'}
                </Link>
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'सिंहगड, राजगड, तोरणा आणि लोहगड — छत्रपती शिवाजी महाराजांचा पराक्रमी वारसा.' : 'Sinhagad, Rajgad, Torna & Lohagad — historic mountain strongholds of Shivaji Maharaj.'}
              </p>
            </div>
            <Link
              href="/destinations/forts"
              style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            >
              <span>{isMr ? 'किल्ले सूची पहा' : 'View Forts'}</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Trail 2: Heritage Wadas */}
          <div
            className="trail-card scroll-reveal-child"
            style={{
              '--reveal-i': 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '20px',
              background: 'var(--card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  background: '#fae8ff',
                  color: '#86198f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Landmark size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#86198f', background: '#fae8ff', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
                {isMr ? '८ ऐतिहासिक वास्तू' : '8 Wadas'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: 4 }}>
                <Link
                  href="/destinations/heritage"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {isMr ? 'पेशवेकालीन वाडे व राजवाडे' : 'Peshwa Era Wadas & Palaces'}
                </Link>
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'शनिवार वाडा, लाल महाल आणि विश्रामबाग वाडा — पेशवाईच्या वैभवशाली लाकडी वास्तू.' : 'Shaniwar Wada, Lal Mahal & Vishrambaug Wada — signature Peshwa architecture.'}
              </p>
            </div>
            <Link
              href="/destinations/heritage"
              style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            >
              <span>{isMr ? 'वाडे सूची पहा' : 'View Wadas'}</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Trail 3: Sacred Temples */}
          <div
            className="trail-card scroll-reveal-child"
            style={{
              '--reveal-i': 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '20px',
              background: 'var(--card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  background: '#fef9c3',
                  color: '#854d0e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sun size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#854d0e', background: '#fef9c3', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
                {isMr ? '१० तीर्थक्षेत्रे' : '10 Shrines'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: 4 }}>
                <Link
                  href="/destinations/temples"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {isMr ? 'पुण्यनगरीची पवित्र मंदिरे' : 'Sacred Sanctuaries & Temples'}
                </Link>
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'दगडूशेठ हलवाई गणपती, ओंकारेश्वर, आळंदी व देहू — शतकांची वारकरी परंपरा.' : 'Dagdusheth Ganpati, Omkareshwar, Alandi & Dehu — centuries of spiritual devotion.'}
              </p>
            </div>
            <Link
              href="/destinations/temples"
              style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            >
              <span>{isMr ? 'मंदिरे सूची पहा' : 'View Temples'}</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Trail 4: Museums & Reformers */}
          <div
            className="trail-card scroll-reveal-child"
            style={{
              '--reveal-i': 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '20px',
              background: 'var(--card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
                {isMr ? '७ वस्तुसंग्रहालये' : '7 Museums'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: 4 }}>
                <Link
                  href="/destinations/museums"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {isMr ? 'सुधारक व वस्तुसंग्रहालये' : 'Museums & Social Reformers'}
                </Link>
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'महात्मा फुले वाडा, राजा दिनकर केळकर व आगाखान पॅलेस — समाजक्रांतीचे साक्षिदार.' : 'Phule Wada, Kelkar Museum & Aga Khan Palace — freedom struggle & social equity.'}
              </p>
            </div>
            <Link
              href="/destinations/museums"
              style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            >
              <span>{isMr ? 'संग्रहालये पहा' : 'View Museums'}</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Trail 5: Nature & Lakes */}
          <div
            className="trail-card scroll-reveal-child"
            style={{
              '--reveal-i': 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '20px',
              background: 'var(--card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  background: '#d1fae5',
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Compass size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
                {isMr ? '६ निसर्गस्थळे' : '6 Nature Sites'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: 4 }}>
                <Link
                  href="/destinations/nature"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {isMr ? 'निसर्गरम्य तलाव व उद्याने' : 'Sahyadri Lakes & Serene Parks'}
                </Link>
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'खडकवासला धरण, ओकायामा गार्डन व पाषाण तलाव — शांत व निसर्गरम्य वाटा.' : 'Khadakwasla Dam, Okayama Friendship Garden & Pashan Lake — tranquil waters.'}
              </p>
            </div>
            <Link
              href="/destinations/nature"
              style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            >
              <span>{isMr ? 'निसर्गस्थळे पहा' : 'View Nature'}</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Trail 6: Traditional Gastronomy */}
          <div
            className="trail-card scroll-reveal-child"
            style={{
              '--reveal-i': 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '20px',
              background: 'var(--card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-xs)',
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  background: '#fee2e2',
                  color: '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Utensils size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', background: '#fee2e2', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
                {isMr ? 'पुणेरी चव' : 'Gastronomy'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: 4 }}>
                <Link
                  href="/destinations/food"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {isMr ? 'पुणेरी खाद्यसंस्कृती' : 'Punekar Food & Culinary Heritage'}
                </Link>
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'काटाकिर्र मिसळ, चितळे बाकरवडी, सुजाता मस्तानी आणि वैशालीचा चविष्ट वारसा.' : 'Authentic Puneri misal, Chitale Bakarwadi, Sujata Mastani & FC Road institutions.'}
              </p>
            </div>
            <Link
              href="/destinations/food"
              style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            >
              <span>{isMr ? 'खाद्यसंस्कृती पहा' : 'Explore Food'}</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* PLAN BY TIME: Duration Planning Matrix */}
      <section className="wrap scroll-reveal" style={{ marginBottom: '36px' }}>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              {isMr ? 'वेळेनुसार सहल' : 'Plan by Available Time'}
            </span>
            <h3 style={{ fontSize: '20px', margin: '2px 0 0', fontWeight: 800 }}>
              {isMr ? 'तुमच्याकडे उपलब्ध वेळेनुसार आदर्श मार्ग' : 'Smart Routing for Every Schedule'}
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '16px',
            }}
          >
            {/* 2 Hours */}
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
                {isMr ? '२ तास' : '2 Hours'}
              </span>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)', margin: '4px 0 2px' }}>
                {isMr ? 'पेठांमधील पदभ्रमण' : 'Old City Peth Heritage Walk'}
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>
                {isMr ? 'शनिवार वाडा → लाल महाल → कसबा गणपती पायी फेरी.' : 'Shaniwar Wada → Lal Mahal → Kasba Ganpati walking loop.'}
              </p>
            </div>

            {/* Half Day */}
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase' }}>
                {isMr ? 'अर्धा दिवस (४–५ तास)' : 'Half Day (4–5 Hours)'}
              </span>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)', margin: '4px 0 2px' }}>
                {isMr ? 'सह्याद्री गडभ्रमण' : 'The Citadel Excursion'}
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>
                {isMr ? 'सिंहगड किल्ला सकाळची चढाई आणि डोणजे पायथा पिठलं भाकरी.' : 'Sinhagad dawn ascent, Tanaji memorial & Donje ghat food.'}
              </p>
            </div>

            {/* Full Day */}
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                {isMr ? 'पूर्ण दिवस (८ तास)' : 'Full Day (8 Hours)'}
              </span>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)', margin: '4px 0 2px' }}>
                {isMr ? 'पुणे महापरिक्रमा' : 'Grand Pune Circuit'}
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>
                {isMr ? 'शनिवार वाडा + केळकर संग्रहालय + खडकवासला सूर्यास्त.' : 'Shaniwar Wada + Kelkar Museum + Khadakwasla sunset.'}
              </p>
            </div>

            {/* Weekend */}
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>
                {isMr ? '२ दिवसांची सहल' : 'Weekend (2 Days)'}
              </span>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)', margin: '4px 0 2px' }}>
                {isMr ? 'सह्याद्री व वारकरी पट्टा' : 'Deep Sahyadri & Temple Trail'}
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>
                {isMr ? 'राजगड किंवा तोरणा ट्रेक + आळंदी आणि देहू तीर्थक्षेत्र.' : 'Rajgad/Torna trek + Alandi & Dehu spiritual heritage.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CATALOGUE: Fact-Rich Places Grid */}
      <div className="wrap scroll-reveal" id="explore-places">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              {isMr ? 'प्रमाणित ठिकाणे' : 'Verified Directory'}
            </span>
            <h2 style={{ fontSize: '22px', margin: '2px 0 0', fontWeight: 800 }}>
              {isMr ? 'पुण्यातील सर्व ऐतिहासिक व प्रेक्षणीय स्थळे' : 'The Complete Pune Landmark Directory'}
            </h2>
          </div>
          {totalCount > 0 && (
            <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600 }}>
              {isMr ? `एकूण ${totalCount} ठिकाणे उपलब्ध` : `Showing ${totalCount} verified places`}
            </span>
          )}
        </div>

        {/* Circular Category Badge Navigation with Native Smooth Scrolling (Requirement 4) */}
        <nav
          className="chips category-nav-scroll"
          aria-label="Categories"
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          {/* Active Pune Locality Selector Button */}
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: '999px',
              cursor: 'pointer',
              background: savedLoc ? '#ecfdf5' : '#ffffff',
              color: savedLoc ? '#065f46' : 'var(--ink)',
              border: savedLoc ? '1.5px solid #10b981' : '1px solid var(--line)',
              fontWeight: 700,
              fontSize: '13px',
              transition: 'all 0.15s ease',
            }}
            title={isMr ? 'पुणे परिसर निवडा किंवा बदला' : 'Select or change Pune locality'}
          >
            <MapPin size={14} color={savedLoc ? '#059669' : 'currentColor'} />
            <span>
              {savedLoc
                ? isMr
                  ? `${savedLoc.nameMr} (बदला)`
                  : `${savedLoc.nameEn} (Change)`
                : isMr
                ? 'पुणे परिसर निवडा'
                : 'Select Pune Locality'}
            </span>
          </button>

          <Link
            className="chip"
            href="/"
            aria-current={!currentCat && !sortByNearMe}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: '999px',
            }}
          >
            <Image
              src="/images/logo.svg"
              alt="All Places"
              width={22}
              height={22}
              className="cat-badge-img"
            />
            <span>{isMr ? 'सर्व ठिकाणे' : 'All Places'}</span>
          </Link>

          {/* Verified Free Entry Filter (₹0 Only) */}
          <Link
            className="chip"
            href="/destinations/free"
            aria-label="Filter by verified free entry places"
            aria-current={currentCat === 'free'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: '999px',
              fontWeight: currentCat === 'free' ? 700 : 500,
            }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>🎟️</span>
            <span>{isMr ? 'मोफत प्रवेश (₹०)' : 'Free Entry (₹0)'}</span>
          </Link>

          {categories.map((c) => {
            const badgeImg = CATEGORY_BADGES[c.slug] || '/images/places/shaniwar-wada.jpg';
            const displayName = isMr ? (CATEGORY_NAMES_MR[c.slug] || c.name) : c.name;
            return (
              <Link
                key={c.slug}
                className="chip"
                href={`/destinations/${c.slug}`}
                aria-label={`Explore ${displayName} category`}
                aria-current={currentCat === c.slug}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: '999px',
                }}
              >
                <Image
                  src={badgeImg}
                  alt={c.name}
                  width={22}
                  height={22}
                  className="cat-badge-img"
                />
                <span>{displayName}</span>
              </Link>
            );
          })}
        </nav>

        {/* Locality Proximity Banner */}
        {sortByNearMe && userCoords && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#065f46',
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              <MapPin size={16} />
              <span>
                {isMr
                  ? `निवडलेल्या स्थानावरून (${savedLoc ? savedLoc.nameMr : 'मध्यवर्ती पुणे'}) अंतराच्या क्रमाने मांडलेली ठिकाणे`
                  : `Attractions sorted by proximity to ${savedLoc ? savedLoc.nameEn : 'Central Pune'}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSortByNearMe(false)}
              className="chip"
              style={{
                fontSize: 12,
                padding: '4px 12px',
                cursor: 'pointer',
                background: '#ffffff',
                border: '1px solid #10b981',
                color: '#065f46',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <X size={12} />
              <span>{isMr ? 'मूळ क्रम दाखवा' : 'Reset to default order'}</span>
            </button>
          </div>
        )}

        {/* Places Grid */}
        {places.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: '48px 24px', margin: '24px 0' }}>
            <Search size={36} color="var(--muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '16px', color: 'var(--muted)', margin: '0 0 16px' }}>
              {t('hero.noPlaces')}
            </p>
            <Link href="/" className="btn outline">
              {t('hero.resetFilters')}
            </Link>
          </div>
        ) : (
          <>
            {/* Scroll-Driven Pune Regional Explorer Navigation (Requirement 4) */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🗺️</span>
                  <span>{isMr ? 'पुणे ऐतिहासिक व भौगोलिक विभाग:' : 'Explore by Pune Heritage Zone:'}</span>
                </div>
                {selectedZone !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedZone('all')}
                    style={{ fontSize: 12, color: '#047857', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    {isMr ? 'सर्व विभाग दाखवा' : 'Show All Zones'}
                  </button>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  overflowX: 'auto',
                  paddingBottom: 6,
                  scrollbarWidth: 'none',
                }}
              >
                {PUNE_GEOGRAPHIC_ZONES.map((zone) => {
                  const isSelected = selectedZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone.id)}
                      className="chip"
                      style={{
                        flexShrink: 0,
                        fontSize: 12.5,
                        fontWeight: isSelected ? 800 : 600,
                        padding: '6px 14px',
                        borderRadius: 999,
                        background: isSelected ? '#047857' : '#ffffff',
                        color: isSelected ? '#ffffff' : 'var(--ink)',
                        border: isSelected ? '1px solid #047857' : '1px solid var(--line)',
                        boxShadow: isSelected ? '0 2px 8px rgba(4, 120, 87, 0.25)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{zone.emoji}</span>
                      <span>{isMr ? zone.nameMr : zone.nameEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid">
              {displayedPlaces.map((p, idx) => {
                const catObj = p.place_categories?.[0] || { name: p.category_slug || 'Spot' };
                const catDisplayName = isMr ? (CATEGORY_NAMES_MR[p.category_slug || ''] || catObj.name) : catObj.name;
                const tierLabel = isMr ? (TIER_MR[p.data_tier] || 'तपासलेले') : (TIER_EN[p.data_tier] || 'Verified');
                const price = p.place_prices?.[0];
                const badgeImg = CATEGORY_BADGES[p.category_slug || ''] || '/images/places/shaniwar-wada.jpg';
                const opStatus = getOperatingStatus(p);
                const isSaved = savedIds.includes(p.id);
                const locality = getPlaceLocality(p, isMr);
                const durationLabel = formatDuration(p.recommended_duration_minutes, isMr);
                const ticketLabel = formatTicket(p, isMr);

                return (
                  <article
                    key={p.id}
                    className={`card place-card-interactive ${idx > 5 ? 'card-deferred' : ''}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      '--card-i': Math.min(idx, 5),
                    } as React.CSSProperties}
                  >
                    {/* Landmark Photo Banner with Tactile Stack & Shared Element Flight Transition */}
                    <div
                      className="card-media"
                      style={{ position: 'relative', overflow: 'hidden' }}
                    >
                      <Link
                        href={`/places/${p.slug}`}
                        aria-label={`View photo of ${p.name}`}
                        style={{ display: 'block', width: '100%', height: '100%' }}
                        title={isMr ? `${p.name_mr || p.name} माहिती व थेट छायाचित्र स्लाइडशो` : `View ${p.name} details & automatic slideshow`}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                          const imgEl = e.currentTarget.querySelector('.place-card-img-zoom') as HTMLElement;
                          if (imgEl) {
                            e.preventDefault();
                            startPhotoTransition({
                              src: p.image_url || badgeImg,
                              alt: p.name,
                              element: imgEl,
                              targetHref: `/places/${p.slug}`,
                              slug: p.slug,
                            });
                          }
                        }}
                      >
                        {/* 3-Photo Tactile Print Stack (Requirement 7) */}
                        <div className="travel-photo-stack">
                          <div
                            className="travel-photo-stack-layer travel-photo-stack-layer-2"
                            style={{ backgroundImage: `url(${p.image_url || badgeImg})` }}
                          />
                          <div
                            className="travel-photo-stack-layer travel-photo-stack-layer-1"
                            style={{ backgroundImage: `url(${p.image_url || badgeImg})` }}
                          />
                          <div className="travel-photo-stack-main">
                            <img
                              src={p.image_url || badgeImg}
                              alt={p.name}
                              width={360}
                              height={225}
                              loading="lazy"
                              decoding="async"
                              className="place-card-img-zoom"
                              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '16 / 10' }}
                            />
                          </div>
                        </div>

                        {/* Interactive Slideshow Indicator Badge */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            zIndex: 5,
                            background: 'rgba(15, 23, 42, 0.85)',
                            backdropFilter: 'blur(6px)',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          }}
                        >
                          <Camera size={12} />
                          <span>{isMr ? `${p.name_mr || p.name} फोटो` : `${p.name.split(' (')[0].split(' & ')[0]} Photos`}</span>
                        </div>
                      </Link>

                      {/* Native Audio Pronunciation Tool */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSpeak(p);
                        }}
                        className="card-action-btn"
                        style={{ position: 'absolute', top: 10, left: 10, zIndex: 3 }}
                        title={isMr ? 'पुणेरी उच्चार ऐका' : 'Listen Native Pronunciation'}
                        aria-label="Listen pronunciation"
                      >
                        <Volume2 size={15} color={speakingId === p.id ? '#059669' : '#ffffff'} />
                      </button>

                      {/* Bookmark Tool (Requirement 14) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleSave(p);
                        }}
                        className={`card-action-btn ${isSaved ? 'active-saved' : ''} ${poppingBookmarkId === p.id ? 'bookmark-btn-pop' : ''}`}
                        style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}
                        title={isSaved ? (isMr ? 'आवडत्या यादीतून काढा' : 'Remove from Wishlist') : (isMr ? 'आवडत्या यादीत जोडा' : 'Save to Wishlist')}
                        aria-label="Save place"
                      >
                        <Bookmark size={15} fill={isSaved ? '#ea580c' : 'none'} color={isSaved ? '#ea580c' : '#ffffff'} />
                      </button>
                    </div>

                    {/* Card Body Wrapper for consistent padding and flex layout */}
                    <div className="card-body">
                    {/* Metadata Row: Category · Locality & Distance */}
                    <div className="card-top" style={{ minHeight: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: '1 1 auto' }}>
                        <span className="cat" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                          {catDisplayName} · {locality}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                        {p.distanceKm !== undefined && (
                          <span
                            className="tier"
                            style={{
                              background: '#ecfdf5',
                              color: '#065f46',
                              borderColor: '#10b981',
                              fontWeight: 700,
                              fontSize: '10.5px',
                              padding: '2px 6px',
                            }}
                          >
                            {p.distanceKm} {isMr ? 'किमी' : 'km'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Landmark Title */}
                    <div
                      style={{
                        minHeight: 46,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minWidth: 0,
                      }}
                    >
                      <Link
                        href={`/places/${p.slug}`}
                        aria-label={`Explore ${p.name} travel guide`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <h2
                          style={{
                            fontSize: isMr ? '17px' : '16.5px',
                            fontFamily: isMr ? 'var(--deva)' : 'inherit',
                            margin: '0 0 2px',
                            lineHeight: 1.25,
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            color: 'var(--ink)',
                          }}
                        >
                          {isMr && p.name_mr
                            ? p.name_mr
                            : p.name.length > 45
                            ? p.name.split(' (')[0].split(' & ')[0]
                            : p.name}
                        </h2>
                      </Link>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {isMr ? p.name : p.name_mr}
                      </div>
                    </div>

                    {/* Editorial Description */}
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--muted)',
                        lineHeight: 1.45,
                        margin: '4px 0 10px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '38px',
                        maxHeight: '40px',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        fontFamily: isMr ? 'var(--deva)' : 'inherit',
                      }}
                    >
                      {(isMr ? (p.description_mr || p.description) : p.description) ||
                        (isMr ? 'पुण्यातील हे प्रेक्षणीय ठिकाण पाहण्यासारखे आहे.' : 'A wonderful landmark to explore in Pune.')}
                    </p>

                    {/* Operational Details Row: Hours & Visit Duration */}
                    <div style={{ margin: '2px 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, minWidth: 0, flexWrap: 'wrap' }}>
                      <span className={`status-badge ${opStatus.badgeClass}`} style={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: opStatus.isOpen ? '#059669' : '#dc2626',
                            display: 'inline-block',
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {isMr ? opStatus.statusTextMr : opStatus.statusTextEn}
                        </span>
                      </span>
                      {durationLabel && (
                        <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <Clock size={11} />
                          <span>{durationLabel}</span>
                        </span>
                      )}
                    </div>
                    </div>{/* end .card-body */}

                    {/* Entry Fee & Provenance Footer */}
                    <div
                      style={{
                        marginTop: 'auto',
                        padding: '12px 18px 18px',
                        borderTop: '1px solid var(--line)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--clay)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Ticket size={13} />
                          <span>{ticketLabel}</span>
                        </span>
                        <span style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                          <ShieldCheck size={11} color="#059669" />
                          <span>{tierLabel}</span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openDirectionsModal({
                              id: p.id,
                              name: p.name,
                              nameMr: p.name_mr,
                              latitude: p.latitude,
                              longitude: p.longitude,
                              address: p.address,
                              addressMr: p.address_mr,
                              slug: p.slug,
                              imageUrl: p.image_url,
                              category: p.category_slug,
                            });
                          }}
                          className="btn outline"
                          style={{
                            padding: '6px 10px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            borderColor: '#10b981',
                            color: '#065f46',
                            background: '#ecfdf5',
                            cursor: 'pointer',
                          }}
                          title={isMr ? `${p.name_mr || p.name} चा मार्ग शोधा` : `Get directions to ${p.name}`}
                        >
                          <span>📍</span>
                          <span>{isMr ? 'मार्ग' : 'Route'}</span>
                        </button>
                        <Link
                          href={`/places/${p.slug}`}
                          aria-label={`View visitor guide and timings for ${p.name}`}
                          className="btn outline"
                          style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 700 }}
                        >
                          {isMr ? `${p.name_mr || p.name} माहिती` : `${p.name.split(' (')[0].split(' & ')[0]} Guide`}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* "Show All Places" Action Button when limited places are shown */}
            {isDefaultHome && !showAll && places.length > 6 && (
              <div style={{ textAlign: 'center', margin: '36px 0 20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="btn"
                  style={{
                    padding: '12px 32px',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>{isMr ? 'पुण्यातील सर्व ठिकाणे पहा' : 'Show All Verified Places'}</span>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.22)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                    }}
                  >
                    {totalCount} {isMr ? 'ठिकाणे' : 'Places'} →
                  </span>
                </button>
              </div>
            )}

            {/* Collapse toggle back to top 6 */}
            {isDefaultHome && showAll && places.length > 6 && (
              <div style={{ textAlign: 'center', margin: '20px 0 28px' }}>
                <button
                  type="button"
                  onClick={() => setShowAll(false)}
                  className="chip"
                  style={{ cursor: 'pointer', fontSize: '13px', padding: '6px 18px' }}
                >
                  {isMr ? '↑ फक्त मुख्य ६ ठिकाणे दाखवा' : '↑ Show Top 6 Featured Only'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {(!isDefaultHome || showAll) && totalPages > 1 && (
          <div className="pager">
            {page > 1 && (
              <Link className="btn outline" href={href(page - 1)} rel="nofollow" aria-label="Go to previous page">
                {isMr ? '← मागील' : '← Previous'}
              </Link>
            )}
            <span style={{ color: 'var(--muted)', fontSize: '14px' }}>
              {isMr ? `पान ${page} / ${totalPages}` : `Page ${page} of ${totalPages}`}
            </span>
            {page < totalPages && (
              <Link className="btn outline" href={href(page + 1)} rel="nofollow" aria-label="Go to next page">
                {isMr ? 'पुढील →' : 'Next →'}
              </Link>
            )}
          </div>
        )}

        {/* EDITORIAL FIELD NOTES & HISTORICAL ESSAYS */}
        <section className="scroll-reveal" style={{ marginTop: '48px', marginBottom: '36px' }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              {isMr ? 'ऐतिहासिक नोंदी व संदर्भ' : 'Cultural Context & Field Notes'}
            </span>
            <h3 style={{ fontSize: '20px', margin: '2px 0 0', fontWeight: 800 }}>
              {isMr ? 'पुण्याच्या इतिहासातील महत्त्वाचे टप्पे' : 'Stories Behind the Living Heritage'}
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '18px',
            }}
          >
            {/* Note 1 */}
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <History size={16} color="var(--primary)" />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {isMr ? 'किल्ले स्थापत्य' : 'Hill Fortress Architecture'}
                </span>
              </div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: 6 }}>
                {isMr ? 'सह्याद्रीची नैसर्गिक तटबंदी' : 'The Sahyadri Fort System'}
              </strong>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
                {isMr
                  ? 'छत्रपती शिवाजी महाराजांनी सह्याद्रीच्या बेसाल्ट कड्यांचा वापर करून गड उभारले. सिंहगड आणि राजगड या किल्ल्यांवर पाण्याचे टाके आणि कल्याण दरवाजा तत्कालीन उत्कृष्ट दुर्गबांधणीचे उदाहरण आहेत.'
                  : "Chhatrapati Shivaji Maharaj transformed Sahyadri's volcanic basalt cliffs into unassailable citadels. Rainwater harvesting tanks at Sinhagad and Rajgad remain functional engineering marvels."}
              </p>
            </div>

            {/* Note 2 */}
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Landmark size={16} color="var(--primary)" />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {isMr ? 'नगररचना' : 'Urban Planning'}
                </span>
              </div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: 6 }}>
                {isMr ? 'पुण्यातील ऐतिहासिक पेठांची रचना' : 'The Peshwa Peth Settlement System'}
              </strong>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
                {isMr
                  ? '१७ व्या व १८ व्या शतकात शनिवार, रविवार, सोमवार अशा वारांवरून व महापुरुषांच्या नावाने वसविलेल्या १७ पेठा आजही पुण्याचा व्यावसायिक व सांस्कृतिक केंद्रबिंदू आहेत.'
                  : 'From 1720 onwards, the Peshwas planned 17 dedicated peths, named after days of the week and founders, establishing specialized trading hubs that thrive to this day.'}
              </p>
            </div>

            {/* Note 3 */}
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <BookOpen size={16} color="var(--primary)" />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {isMr ? 'समाजसुधारणा' : 'Social Renaissance'}
                </span>
              </div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: 6 }}>
                {isMr ? 'भिडे वाडा व शिक्षणक्रांती' : '1848: The Dawn of Women’s Education'}
              </strong>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
                {isMr
                  ? 'क्रांतिज्योती सावित्रीबाई फुले व महात्मा जोतीराव फुले यांनी १ जानेवारी १८४८ रोजी भिडे वाड्यात मुलींची पहिली शाळा सुरू करून देशात समता व ज्ञानाची मुहूर्तमेढ रोवली.'
                  : "On 1 January 1848, Savitribai Phule and Mahatma Jyotirao Phule established India's first indigenous school for girls at Bhide Wada, igniting a national social revolution."}
              </p>
            </div>
          </div>
        </section>


        {/* Smart Trip Planner Callout */}
        <div
          style={{
            marginTop: '20px',
            marginBottom: '40px',
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '32px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 10,
              }}
            >
              <Calendar size={13} />
              <span>{isMr ? 'मोफत सहल नियोजन' : 'Curated Trip Planning'}</span>
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px', color: '#ffffff' }}>
              {isMr ? 'पुणे भ्रमंतीचे परिपूर्ण नियोजन करा' : 'Build Your Custom Pune Itinerary'}
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.5, opacity: 0.92, margin: 0 }}>
              {isMr
                ? 'किल्ले, वाडे आणि मंदिरांसाठी थेट मेट्रो व पीएमपीएमएल बस मार्गांसह १ किंवा २ दिवसांची आदर्श सहल रूपरेषा तयार करा आणि मोफत PDF डाउनलोड करा.'
                : 'Generate tailored 1-day or 2-day itineraries complete with real Pune Metro & PMPML bus routes, ticket fares, and downloadable PDF travel schedules.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              href="/planner"
              className="btn"
              style={{
                background: '#ffffff',
                color: '#065f46',
                fontWeight: 800,
                padding: '11px 22px',
                fontSize: '14px',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Calendar size={15} color="#065f46" />
              <span style={{ color: '#065f46', fontWeight: 800 }}>
                {isMr ? 'सहल प्लॅन करा' : 'Launch Trip Planner'}
              </span>
            </Link>

            <Link
              href="/milestones"
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1.5px solid rgba(255, 255, 255, 0.65)',
                color: '#ffffff',
                fontWeight: 800,
                padding: '11px 20px',
                fontSize: '14px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <CheckCircle2 size={15} color="#ffffff" />
              <span style={{ color: '#ffffff', fontWeight: 800 }}>
                {isMr ? 'यशोगाथा पहा' : 'View Milestones'}
              </span>
            </Link>
          </div>
        </div>

        {/* Community Feedback Section */}
        <FeedbackSection />
      </div>

      {/* Pune Locality Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelected={(loc) => {
          setSavedLoc(loc);
          setUserCoords({ lat: loc.lat, lng: loc.lng });
          setSortByNearMe(true);
          setShowAll(true);
        }}
      />

      {/* Interactive Landmark Photo Slideshow Modal */}
      <PlacePhotoSlideshowModal
        isOpen={Boolean(slideshowPlace)}
        onClose={() => setSlideshowPlace(null)}
        place={slideshowPlace}
      />

      {/* Tiny Bookmark Confirmation Toast (Requirement 14) */}
      {toastMessage && (
        <div className="pune-toast-pill" role="status" aria-live="polite">
          <span>🔖</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

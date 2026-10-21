'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import HeroWatermarkAnimation from '@/components/HeroWatermarkAnimation';
import FeedbackSection from '@/components/FeedbackSection';
import IntroVideoOverlay from '@/components/IntroVideoOverlay';
import WeatherWidget from '@/components/WeatherWidget';
import { calculateDistanceKm } from '@/lib/publicTransit';
import { getOperatingStatus } from '@/lib/operatingHours';
import { speakPlaceName } from '@/lib/speech';
import { getSavedPlaces, toggleSavedPlace } from '@/lib/savedPlaces';

const TIER_MR: Record<string, string> = {
  verified: 'तपासलेले तपशील',
  enriched: 'सार्वजनिक माहिती',
  listed: 'अंदाजे वेळ',
};

const TIER_EN: Record<string, string> = {
  verified: 'Verified Details',
  enriched: 'Public Source Info',
  listed: 'Hours Unverified',
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
  { label: 'Sinhagad Fort', labelMr: 'सिंहगड किल्ला', query: 'Sinhagad' },
  { label: 'Shaniwar Wada', labelMr: 'शनिवार वाडा', query: 'Shaniwar Wada' },
  { label: 'Dagdusheth Ganpati', labelMr: 'दगडूशेठ गणपती', query: 'Dagdusheth' },
  { label: 'Aga Khan Palace', labelMr: 'आगाखान पॅलेस', query: 'Aga Khan Palace' },
  { label: 'Khadakwasla Dam', labelMr: 'खडकवासला धरण', query: 'Khadakwasla' },
];

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
  const [userGps, setUserGps] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [sortByNearMe, setSortByNearMe] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    const syncSaved = () => {
      setSavedIds(getSavedPlaces().map((p) => p.id));
    };
    syncSaved();
    window.addEventListener('explore-pune-saved-changed', syncSaved);
    return () => window.removeEventListener('explore-pune-saved-changed', syncSaved);
  }, []);

  const handleToggleSave = (p: any) => {
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
  };

  const handleSpeak = (p: any) => {
    setSpeakingId(p.id);
    const text = isMr && p.name_mr ? p.name_mr : p.name;
    speakPlaceName(text, isMr);
    setTimeout(() => setSpeakingId(null), 2500);
  };

  const isDefaultHome = !currentCat && !searchTerm && page === 1;

  const handleNearMeClick = () => {
    if (sortByNearMe) {
      setSortByNearMe(false);
      return;
    }
    if (userGps) {
      setSortByNearMe(true);
      setShowAll(true);
      return;
    }
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert(
        isMr
          ? 'आपल्या ब्राउझरमध्ये GPS सेवा उपलब्ध नाही.'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setIsLocatingGps(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocatingGps(false);
        setSortByNearMe(true);
        setShowAll(true);
      },
      (err) => {
        setIsLocatingGps(false);
        setGpsError(
          err.code === err.PERMISSION_DENIED
            ? isMr
              ? 'कृपया ब्राउझरमध्ये लोकेशन परवानगी द्या.'
              : 'Location permission was denied.'
            : isMr
            ? 'स्थान शोधता आले नाही.'
            : 'Unable to detect location.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Attach distance if GPS available
  const placesWithDistance = places.map((p) => {
    if (userGps && p.latitude && p.longitude) {
      const dist = calculateDistanceKm(userGps.lat, userGps.lng, p.latitude, p.longitude);
      return { ...p, distanceKm: dist };
    }
    return p;
  });

  // Sort if near-me filter is enabled
  const sortedPlaces =
    sortByNearMe && userGps
      ? [...placesWithDistance].sort(
          (a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999)
        )
      : placesWithDistance;

  const displayedPlaces =
    !isDefaultHome || showAll || sortByNearMe ? sortedPlaces : sortedPlaces.slice(0, 6);

  const href = (p: number) =>
    `/?${new URLSearchParams({
      ...(searchTerm && { q: searchTerm }),
      ...(currentCat && { cat: currentCat }),
      page: String(p),
    })}`;

  return (
    <>
      {/* 3.5-Second Cinematic Intro Video Overlay (First Visit in Session) */}
      <IntroVideoOverlay />

      {/* Hero Section */}
      <section className="hero wrap">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <div className="hero-pill" style={{ marginBottom: 0 }}>
              <span>✨</span> {isMr ? 'पुणे आणि सह्याद्रीच्या ऐतिहासिक वाटा' : 'Discover the Heart of Maharashtra'}
            </div>
            <WeatherWidget />
          </div>
          <h1>
            {isMr ? (
              <>
                पुण्यातील <span className="gradient">ऐतिहासिक किल्ले, वाडे</span> व सह्याद्री दर्शन
              </>
            ) : (
              <>
                Explore <span className="gradient">Pune</span>
              </>
            )}
          </h1>
          <p className="lede">
            {isMr
              ? 'तपासलेले प्रवेश शुल्क, अधिकृत वेळ आणि सहल नियोजनासाठी पुण्याचे सर्वात परिपूर्ण डिजिटल मार्गदर्शक.'
              : 'Where heritage meets the rhythm of a modern city — historic forts, Peshwa wadas, sacred temples, verified timings, and custom trip planning.'}
          </p>

          <form className="search" action="/" role="search">
            <input
              name="q"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              aria-label={t('hero.searchPlaceholder')}
            />
            {currentCat && <input type="hidden" name="cat" value={currentCat} />}
            <button className="btn">{t('hero.searchBtn')}</button>
          </form>

          {/* Quick Search Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 10, fontSize: 12 }}>
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{isMr ? 'लोकप्रिय:' : 'Popular:'}</span>
            {POPULAR_SEARCHES.map((item) => (
              <Link
                key={item.query}
                href={`/?q=${encodeURIComponent(item.query)}`}
                className="chip"
                style={{
                  padding: '2px 9px',
                  fontSize: '11.5px',
                  borderRadius: '999px',
                  background: '#f8fafc',
                  border: '1px solid var(--line)',
                  color: 'var(--ink-secondary)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {isMr ? item.labelMr : item.label}
              </Link>
            ))}
          </div>

          <div className="hero-actions" style={{ marginTop: 20 }}>
            <a className="btn clay" href="#explore-places">
              ⚡ {isMr ? 'सर्व ठिकाणे पहा' : 'Explore Places'}
            </a>
            <Link className="btn outline" href="/planner">
              🗺️ {isMr ? 'सहल नियोजन करा' : 'Plan My Visit'}
            </Link>
            <Link className="btn outline" href="/milestones">
              🏆 {isMr ? 'भ्रमंती यशोगाथा पहा' : 'Explorer Milestones'}
            </Link>
          </div>

          {/* Pune Heritage Trust Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
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
              <span style={{ color: '#059669', fontSize: 14 }}>✓</span>
              <span>{isMr ? '५०+ तपासलेली ऐतिहासिक ठिकाणे' : '50+ Verified Landmarks'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#059669', fontSize: 14 }}>✓</span>
              <span>{isMr ? 'पुणे मेट्रो व PMPML मार्ग' : 'Pune Metro & PMPML Transit'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#059669', fontSize: 14 }}>✓</span>
              <span>{isMr ? 'थेट चालू/बंद वेळ व दर' : 'Live Operating Hours & Costs'}</span>
            </div>
          </div>
        </div>

        {/* Animated Pune Calligraphy & Royal Jiretop Watermark */}
        <HeroWatermarkAnimation />
      </section>

      {/* Feature Highlights Banner */}
      <section className="wrap" style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            background: 'var(--card)',
            padding: '20px 24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Image
              src="/images/cat-forts.png"
              alt="Forts"
              width={38}
              height={38}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>
                {isMr ? 'गड-किल्ले आणि इतिहास' : 'Heritage & Forts'}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {isMr ? 'मराठा साम्राज्याचा गौरवशाली वारसा' : 'Maratha history & architectural wonders'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Image
              src="/images/cat-heritage.png"
              alt="Heritage"
              width={38}
              height={38}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>
                {isMr ? 'अधिकृत वेळ व दर' : 'Verified Timings'}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {isMr ? 'तपासलेली वेळ आणि अचूक तिकीट माहिती' : 'Fact-checked opening hours & ticket fees'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Image
              src="/images/cat-all.png"
              alt="Day Trips"
              width={38}
              height={38}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>
                {isMr ? 'स्मार्ट सहल नियोजन' : 'Smart Day Trips'}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {isMr ? 'शहरातील वाटा आणि सह्याद्री ट्रेक' : 'City center walks & Sahyadri trails'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Thematic Discovery Trails: Sahyadri Forts, Peshwa Heritage, Sacred Temples, Nature Serenity */}
      <section className="wrap" style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              {isMr ? 'पुणे भ्रमंती वाटा' : 'Curated Pune Trails'}
            </span>
            <h2 style={{ fontSize: '22px', margin: '2px 0 0', fontWeight: 800 }}>
              {isMr ? 'वैशिष्ट्यपूर्ण सहल वाटा निवडा' : 'Experience Pune by Theme'}
            </h2>
          </div>
          <Link
            href="/planner"
            style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
          >
            {isMr ? 'कस्टम सहल प्लॅन करा →' : 'Custom Itinerary Planner →'}
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Forts Trail */}
          <Link
            href="/?cat=forts"
            className="trail-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '18px 20px',
              background: 'linear-gradient(145deg, #ffffff 0%, #fff7ed 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid #fed7aa',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '28px' }}>⚔️</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#c2410c', background: '#ffedd5', padding: '3px 8px', borderRadius: 999 }}>
                {isMr ? 'सह्याद्री ट्रेक' : 'Sahyadri Treks'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15.5px', color: '#9a3412', marginBottom: 4 }}>
                {isMr ? 'सह्याद्रीचे अजिंक्य किल्ले' : 'Sahyadri Forts Trail'}
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'सिंहगड, राजगड, तोरणा आणि लोहगड — छत्रपती शिवाजी महाराजांचा पराक्रमी वारसा.' : 'Sinhagad, Rajgad, Torna & Lohagad — historic bastions of Chhatrapati Shivaji Maharaj.'}
              </p>
            </div>
            <span style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: '#ea580c' }}>
              {isMr ? 'किल्ले पहा →' : 'Explore Forts →'}
            </span>
          </Link>

          {/* Heritage Trail */}
          <Link
            href="/?cat=heritage"
            className="trail-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '18px 20px',
              background: 'linear-gradient(145deg, #ffffff 0%, #fdf4ff 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid #f5d0fe',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '28px' }}>🏰</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#86198f', background: '#fae8ff', padding: '3px 8px', borderRadius: 999 }}>
                {isMr ? 'पेशवेकालीन वास्तू' : 'Peshwa Era'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15.5px', color: '#701a75', marginBottom: 4 }}>
                {isMr ? 'पेशवेकालीन वाडे व राजवाडे' : 'Peshwa Heritage Trail'}
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'शनिवार वाडा, लाल महाल आणि विश्रामबाग वाडा — पेशवाईच्या वैभवशाली वास्तू.' : 'Shaniwar Wada, Lal Mahal & Vishrambaug Wada — grand Maratha architecture.'}
              </p>
            </div>
            <span style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: '#a21caf' }}>
              {isMr ? 'वाडे पहा →' : 'Explore Wadas →'}
            </span>
          </Link>

          {/* Temples Trail */}
          <Link
            href="/?cat=temples"
            className="trail-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '18px 20px',
              background: 'linear-gradient(145deg, #ffffff 0%, #fefce8 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid #fef08a',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '28px' }}>🛕</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#854d0e', background: '#fef9c3', padding: '3px 8px', borderRadius: 999 }}>
                {isMr ? 'तीर्थक्षेत्रे' : 'Sacred Sites'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15.5px', color: '#713f12', marginBottom: 4 }}>
                {isMr ? 'पुण्यनगरीची पवित्र मंदिरे' : 'Sacred Temples Trail'}
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'दगडूशेठ हलवाई गणपती, आळंदी, देहू आणि जेजुरी — वारकरी आणि संतांची भूमी.' : 'Dagdusheth Ganpati, Alandi, Dehu & Jejuri — sacred spiritual heritage.'}
              </p>
            </div>
            <span style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: '#ca8a04' }}>
              {isMr ? 'मंदिरे पहा →' : 'Explore Temples →'}
            </span>
          </Link>

          {/* Nature & Gardens Trail */}
          <Link
            href="/?cat=nature"
            className="trail-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '18px 20px',
              background: 'linear-gradient(145deg, #ffffff 0%, #ecfdf5 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid #a7f3d0',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '28px' }}>🌿</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '3px 8px', borderRadius: 999 }}>
                {isMr ? 'निसर्ग व तलाव' : 'Nature & Lakes'}
              </span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '15.5px', color: '#064e3b', marginBottom: 4 }}>
                {isMr ? 'निसर्गरम्य तलाव व उद्याने' : 'Lakes & Scenic Nature'}
              </strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.45 }}>
                {isMr ? 'खडकवासला धरण, ओकायामा फ्रेंडशिप गार्डन आणि पाषाण तलाव — शांत व रम्य निसर्ग.' : 'Khadakwasla Dam, Okayama Friendship Garden & Pashan Lake — serene spots.'}
              </p>
            </div>
            <span style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: '#059669' }}>
              {isMr ? 'निसर्गस्थळे पहा →' : 'Explore Nature →'}
            </span>
          </Link>
        </div>
      </section>

      {/* Main Content & Place Grid */}
      <div className="wrap" id="explore-places">
        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>
            {isMr ? 'विभागानुसार शोधा' : 'Browse by Category'}
          </h2>
          {totalCount > 0 && (
            <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 600 }}>
              {isMr ? `${totalCount} ठिकाणे उपलब्ध` : `Showing ${totalCount} places`}
            </span>
          )}
        </div>

        {/* Circular Category Badge Navigation */}
        <nav
          className="chips"
          aria-label="Categories"
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          {/* Find Near Me GPS Button */}
          <button
            type="button"
            onClick={handleNearMeClick}
            className={`chip ${sortByNearMe ? 'active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: '999px',
              cursor: 'pointer',
              background: sortByNearMe ? '#065f46' : '#ffffff',
              color: sortByNearMe ? '#ffffff' : '#065f46',
              border: '1.5px solid #065f46',
              fontWeight: 700,
              boxShadow: sortByNearMe ? '0 4px 12px rgba(6, 95, 70, 0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{isLocatingGps ? '⏳' : '📍'}</span>
            <span>
              {isLocatingGps
                ? isMr
                  ? 'स्थान शोधत आहे…'
                  : 'Locating…'
                : sortByNearMe
                ? isMr
                  ? '✓ अंतराप्रमाणे क्रम (काढा)'
                  : '✓ Near Me Active (Reset)'
                : isMr
                ? 'माझ्या जवळची ठिकाणे (GPS)'
                : 'Find Near Me (GPS)'}
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
              width={26}
              height={26}
              className="cat-badge-img"
            />
            <span>{isMr ? 'सर्व ठिकाणे' : 'All Places'}</span>
          </Link>

          {categories.map((c) => {
            const badgeImg = CATEGORY_BADGES[c.slug] || '/images/places/shaniwar-wada.jpg';
            const displayName = isMr ? (CATEGORY_NAMES_MR[c.slug] || c.name) : c.name;
            return (
              <Link
                key={c.slug}
                className="chip"
                href={`/?cat=${c.slug}`}
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
                  width={26}
                  height={26}
                  className="cat-badge-img"
                />
                <span>{displayName}</span>
              </Link>
            );
          })}
        </nav>

        {/* GPS Proximity Banner */}
        {gpsError && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              padding: '10px 16px',
              marginBottom: '20px',
              color: '#dc2626',
              fontSize: '13px',
            }}
          >
            ⚠️ {gpsError}
          </div>
        )}

        {sortByNearMe && userGps && (
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
              <span style={{ fontSize: 18 }}>🎯</span>
              <span>
                {isMr
                  ? 'तुमच्या थेट GPS स्थानावरून अंतराच्या क्रमाने मांडलेली ठिकाणे'
                  : 'Attractions sorted by real-time GPS distance from you'}
                {' '}
                ({userGps.lat.toFixed(4)}° N, {userGps.lng.toFixed(4)}° E)
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
              }}
            >
              ✕ {isMr ? 'मूळ क्रम दाखवा' : 'Reset to default order'}
            </button>
          </div>
        )}

        {/* Places Grid */}
        {places.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: '48px 24px', margin: '24px 0' }}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🔍</span>
            <p style={{ fontSize: '16px', color: 'var(--muted)', margin: '0 0 16px' }}>
              {t('hero.noPlaces')}
            </p>
            <Link href="/" className="btn outline">
              {t('hero.resetFilters')}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid">
              {displayedPlaces.map((p) => {
                const catObj = p.place_categories?.[0] || { name: p.category_slug || 'Spot' };
                const catDisplayName = isMr ? (CATEGORY_NAMES_MR[p.category_slug || ''] || catObj.name) : catObj.name;
                const tierLabel = isMr ? (TIER_MR[p.data_tier] || p.data_tier) : (TIER_EN[p.data_tier] || p.data_tier);
                const price = p.place_prices?.[0];
                const badgeImg = CATEGORY_BADGES[p.category_slug || ''] || '/images/places/shaniwar-wada.jpg';
                const opStatus = getOperatingStatus(p);
                const isSaved = savedIds.includes(p.id);

                return (
                  <article key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Landmark Photo Banner with Free Wishlist & Audio Pronunciation Actions */}
                    <div className="card-media" style={{ position: 'relative' }}>
                      <img
                        src={p.image_url || badgeImg}
                        alt={p.name}
                        loading="lazy"
                      />

                      {/* Free Audio Pronunciation Tool */}
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
                      >
                        {speakingId === p.id ? '🔊' : '🔈'}
                      </button>

                      {/* Free Wishlist / Bookmark Tool */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleSave(p);
                        }}
                        className={`card-action-btn ${isSaved ? 'active-saved' : ''}`}
                        style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}
                        title={isSaved ? (isMr ? 'आवडत्या यादीतून काढा' : 'Remove from Wishlist') : (isMr ? 'आवडत्या यादीत जोडा' : 'Save to Wishlist')}
                      >
                        {isSaved ? '❤️' : '🤍'}
                      </button>
                    </div>

                    {/* Metadata Row: Category & Data Tier */}
                    <div className="card-top" style={{ minHeight: 28, margin: '4px 0 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: '1 1 auto' }}>
                        <Image
                          src={badgeImg}
                          alt=""
                          width={18}
                          height={18}
                          className="cat-badge-img"
                          style={{ flexShrink: 0 }}
                        />
                        <span className="cat" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                          {catDisplayName}
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
                            📍 {p.distanceKm} {isMr ? 'किमी' : 'km'}
                          </span>
                        )}
                        <span className={`tier ${p.data_tier}`}>{tierLabel}</span>
                      </div>
                    </div>

                    {/* Aligned Title Container */}
                    <div style={{ minHeight: 46, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                      {isMr && p.name_mr ? (
                        <>
                          <h2 style={{ fontSize: '17px', fontFamily: 'var(--deva)', margin: '0 0 2px', lineHeight: 1.25, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {p.name_mr}
                          </h2>
                          <div style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        </>
                      ) : (
                        <>
                          <h2 style={{ fontSize: '16.5px', margin: '0 0 2px', lineHeight: 1.25, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{p.name}</h2>
                          {p.name_mr && (
                            <p className="mr" style={{ margin: 0, fontSize: '12.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.name_mr}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Clamped Description */}
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--muted)',
                        lineHeight: 1.45,
                        margin: '4px 0 8px',
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

                    {/* Free Live Operating Hours Status Badge */}
                    <div style={{ margin: '2px 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, minWidth: 0, flexWrap: 'wrap' }}>
                      <span className={`status-badge ${opStatus.badgeClass}`} style={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ fontSize: 9, flexShrink: 0 }}>{opStatus.isOpen ? '🟢' : '🔴'}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {isMr ? opStatus.statusTextMr : opStatus.statusTextEn}
                        </span>
                      </span>
                      {p.recommended_duration_minutes && (
                        <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, flexShrink: 0 }}>
                          ⏱️ {p.recommended_duration_minutes} {isMr ? 'मि.' : 'min'}
                        </span>
                      )}
                    </div>

                    {/* Aligned Pinned Card Footer */}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--line)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--clay)' }}>
                        {price
                          ? price.is_free
                            ? (isMr ? 'मोफत प्रवेश' : 'Free Entry')
                            : `${isMr ? 'किमान ₹' : 'From ₹'}${price.amount}`
                          : (isMr ? 'प्रवेश शुल्क' : 'Visitor Info')}
                      </span>
                      <Link
                        href={`/places/${p.slug}`}
                        className="btn outline"
                        style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 700 }}
                      >
                        {t('card.view')} →
                      </Link>
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
                    padding: '14px 38px',
                    fontSize: '15px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    boxShadow: '0 8px 24px rgba(6, 95, 70, 0.22)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span>{isMr ? 'पुण्यातील सर्व ठिकाणे पहा' : 'Show All Places in Pune'}</span>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.22)',
                      padding: '3px 12px',
                      borderRadius: '999px',
                      fontSize: '13px',
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
              <Link className="btn outline" href={href(page - 1)}>
                {isMr ? '← मागील' : '← Previous'}
              </Link>
            )}
            <span style={{ color: 'var(--muted)', fontSize: '14px' }}>
              {isMr ? `पान ${page} / ${totalPages}` : `Page ${page} of ${totalPages}`}
            </span>
            {page < totalPages && (
              <Link className="btn outline" href={href(page + 1)}>
                {isMr ? 'पुढील →' : 'Next →'}
              </Link>
            )}
          </div>
        )}

        {/* Smart Trip Planner Interactive Callout */}
        <div
          style={{
            marginTop: '48px',
            marginBottom: '40px',
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24,
            boxShadow: '0 16px 36px rgba(6, 95, 70, 0.22)',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '11.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: 999,
                marginBottom: 10,
              }}
            >
              🗺️ {isMr ? 'मोफत सहल नियोजन' : '100% Free Trip Planner'}
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px', color: '#ffffff' }}>
              {isMr ? 'पुणे भ्रमंतीचे स्मार्ट नियोजन करा' : 'Plan Your Perfect Pune Trip in Seconds'}
            </h3>
            <p style={{ fontSize: '14.5px', lineHeight: 1.5, opacity: 0.92, margin: 0 }}>
              {isMr
                ? 'किल्ले, वाडे आणि मंदिरांसाठी थेट मेट्रो व पीएमपीएमएल बस मार्गांसह १ किंवा २ दिवसांची आदर्श सहल रूपरेषा तयार करा आणि मोफत PDF डाउनलोड करा.'
                : 'Generate tailored 1-day or 2-day itineraries complete with real Pune Metro & PMPML bus routes, ticket fares, and downloadable PDF travel schedules.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/planner"
              className="btn"
              style={{
                background: '#ffffff',
                color: '#065f46',
                fontWeight: 800,
                padding: '12px 24px',
                fontSize: '14px',
                borderRadius: 999,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                textDecoration: 'none',
              }}
            >
              ✨ {isMr ? 'सहल प्लॅन करा' : 'Launch Trip Planner'}
            </Link>
            <Link
              href="/milestones"
              className="btn outline"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                fontWeight: 700,
                padding: '12px 20px',
                fontSize: '14px',
                borderRadius: 999,
                textDecoration: 'none',
              }}
            >
              🏆 {isMr ? 'यशोगाथा पहा' : 'View Milestones'}
            </Link>
          </div>
        </div>

        {/* Community Feedback Section */}
        <FeedbackSection />
      </div>
    </>
  );
}

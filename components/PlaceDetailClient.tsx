'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import PlaceActions from '@/components/PlaceActions';
import Reviews from '@/components/Reviews';
import PlaceMap from '@/components/PlaceMapWrapper';
import CommunityGallery from '@/components/CommunityGallery';
import TransitRouteMap from '@/components/TransitRouteMap';
import LocationPickerModal from '@/components/LocationPickerModal';
import {
  getPublicTransitRoute,
  TransitRouteInfo,
  PUNE_COMMUTE_HUBS,
  calculateDistanceKm,
} from '@/lib/publicTransit';
import { getOperatingStatus } from '@/lib/operatingHours';
import { speakPlaceName } from '@/lib/speech';
import { getSavedPlaces, toggleSavedPlace } from '@/lib/savedPlaces';
import { getPlaceVisitorGuidelines } from '@/lib/visitorGuidelines';
import { getStoredUserLocation, UserSavedLocation } from '@/lib/userLocation';
import PlacePhotoSlideshowModal from '@/components/PlacePhotoSlideshowModal';

const CATEGORY_NAMES_MR: Record<string, string> = {
  forts: 'किल्ले व गड',
  heritage: 'ऐतिहासिक वाडे व राजवाडे',
  temples: 'मंदिरे व तीर्थक्षेत्रे',
  museums: 'वस्तुसंग्रहालये',
  parks: 'उद्याने व बागा',
  nature: 'तलाव व निसर्गरम्य स्थळे',
};

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

export default function PlaceDetailClient({ place }: { place: any }) {
  const { isMr } = useLanguage();

  const categoryName = Array.isArray(place.place_categories)
    ? place.place_categories[0]?.name
    : place.place_categories?.name || place.category || 'Attraction';

  const categoryDisplayName = isMr
    ? CATEGORY_NAMES_MR[place.category_slug || ''] || categoryName
    : categoryName;

  const tierLabel = isMr
    ? TIER_MR[place.data_tier] || place.data_tier
    : TIER_EN[place.data_tier] || place.data_tier;

  const primaryName = isMr && place.name_mr ? place.name_mr : place.name;
  const secondaryName = isMr && place.name_mr ? place.name : place.name_mr;

  const description = isMr
    ? place.description_mr || place.description
    : place.description;

  const address = isMr ? place.address_mr || place.address : place.address;
  const bestTime = isMr ? place.best_time_mr || place.best_time : place.best_time;

  const price = place.place_prices?.[0];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name}, Pune`
  )}`;

  const defaultTransit = getPublicTransitRoute(18.5204, 73.8567, place);
  const [liveTransit, setLiveTransit] = useState<TransitRouteInfo | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHubId, setSelectedHubId] = useState<string>('central');
  const [originName, setOriginName] = useState<string>(
    isMr ? 'मध्यवर्ती पुणे (मनपा/शनिवार वाडा)' : 'Central Pune (PMC Bhavan)'
  );
  const [gpsError, setGpsError] = useState('');
  const [gpsNotice, setGpsNotice] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeGuidelineTab, setActiveGuidelineTab] = useState<'commute' | 'timing' | 'rules'>('commute');
  const [speaking, setSpeaking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [slideshowOpen, setSlideshowOpen] = useState(false);

  const guidelines = useMemo(() => getPlaceVisitorGuidelines(place), [place]);
  const opStatus = getOperatingStatus(place);

  // Sync stored user location if available
  useEffect(() => {
    const loc = getStoredUserLocation();
    if (loc) {
      setUserCoords({ lat: loc.lat, lng: loc.lng });
      setSelectedHubId(loc.id);
      const name = isMr ? loc.nameMr : loc.nameEn;
      setOriginName(name);
      const computed = getPublicTransitRoute(loc.lat, loc.lng, place, name);
      setLiveTransit(computed);
    }
  }, [place, isMr]);

  useEffect(() => {
    const sync = () => {
      const list = getSavedPlaces();
      setIsSaved(list.some((p) => p.id === place.id));
    };
    sync();
    window.addEventListener('explore-pune-saved-changed', sync);
    return () => window.removeEventListener('explore-pune-saved-changed', sync);
  }, [place.id]);

  const handleSpeak = () => {
    setSpeaking(true);
    speakPlaceName(primaryName, isMr);
    setTimeout(() => setSpeaking(false), 2500);
  };

  const handleToggleSave = () => {
    toggleSavedPlace({
      id: place.id,
      slug: place.slug || place.id,
      name: place.name,
      name_mr: place.name_mr,
      image_url: place.image_url,
      category_slug: place.category_slug,
      category: place.category,
      data_tier: place.data_tier,
    });
  };

  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = isMr
      ? `पुण्यातील ${primaryName} बद्दल माहिती आणि प्रवास मार्गदर्शक पहा: ${shareUrl}`
      : `Check out ${primaryName} on Explore Pune: ${shareUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: primaryName, text, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${primaryName} - Explore Pune\n${typeof window !== 'undefined' ? window.location.href : ''}`
  )}`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleCalcGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError(
        isMr
          ? 'आपल्या ब्राउझरमध्ये GPS सेवा उपलब्ध नाही.'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    setGpsNotice('');

    // Fast, non-hanging geolocation configuration
    const geoOptions: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const coords = { lat: userLat, lng: userLng };
        setUserCoords(coords);
        setSelectedHubId('gps');

        // Check geographic proximity to Pune center (18.5204, 73.8567)
        const distFromPune = calculateDistanceKm(userLat, userLng, 18.5204, 73.8567);
        const distToPlace =
          place.latitude && place.longitude
            ? calculateDistanceKm(userLat, userLng, place.latitude, place.longitude)
            : distFromPune;

        if (distFromPune > 45) {
          // Coordinates are outside Pune Metropolitan Region (e.g. testing from Mumbai/desktop IP)
          // Intelligently route from closest main arrival gateway to avoid broken long-distance walking steps
          const gatewayHub =
            PUNE_COMMUTE_HUBS.find((h) => h.id === 'pune-station') || PUNE_COMMUTE_HUBS[0];
          const gatewayLabel = isMr ? 'पुणे स्टेशन (मुख्य प्रवेशद्वार)' : 'Pune Station (Gateway)';
          const notice = isMr
            ? `📍 तुमचे थेट स्थान पुण्याच्या बाहेर (${Math.round(distFromPune)} किमी) आढळले. ${primaryName} येथे जाण्यासाठी पुण्याच्या मुख्य प्रवेशद्वारावरून (पुणे स्टेशन) थेट मेट्रो व बस मार्ग तयार केला आहे.`
            : `📍 Location detected ${Math.round(distFromPune)} km outside Pune. For visiting ${primaryName}, transit is routed from Pune's central gateway (${gatewayHub.nameEn}), plus highway travel options!`;
          setGpsNotice(notice);
          setOriginName(gatewayLabel);

          const computed = getPublicTransitRoute(
            gatewayHub.latitude,
            gatewayHub.longitude,
            place,
            gatewayLabel
          );
          setLiveTransit(computed);
        } else {
          // User is inside Pune! Identify closest neighborhood
          let closestHub = PUNE_COMMUTE_HUBS[0];
          let minHubDist = 999;
          for (const hub of PUNE_COMMUTE_HUBS) {
            const d = calculateDistanceKm(userLat, userLng, hub.latitude, hub.longitude);
            if (d < minHubDist) {
              minHubDist = d;
              closestHub = hub;
            }
          }

          const localityName = isMr
            ? closestHub.nameMr.split('/')[0]
            : closestHub.nameEn.split('/')[0];
          const gpsLabel = isMr
            ? `माझे GPS स्थान (जवळ ${localityName} • ${distToPlace.toFixed(1)} किमी)`
            : `My Live GPS (near ${localityName} • ${distToPlace.toFixed(1)} km away)`;
          setOriginName(gpsLabel);
          setGpsNotice(
            isMr
              ? `📍 थेट GPS सक्रिय: तुम्ही ${primaryName} पासून अंदाजे ${distToPlace.toFixed(1)} किमी अंतरावर आहात.`
              : `📍 Live GPS Active: You are ~${distToPlace.toFixed(1)} km from ${primaryName}!`
          );

          const computed = getPublicTransitRoute(userLat, userLng, place, gpsLabel);
          setLiveTransit(computed);
        }
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(
          err.code === err.PERMISSION_DENIED
            ? isMr
              ? 'कृपया ब्राउझरमध्ये लोकेशन परवानगी द्या (Allow Location).'
              : 'Location permission was denied by browser.'
            : isMr
            ? 'स्थान शोधता आले नाही. कृपया खालील यादीतून तुमचा भाग निवडा.'
            : 'Could not acquire precise GPS. Please pick your starting locality from the list below.'
        );
      },
      geoOptions
    );
  };

  const handleSelectHub = (hubId: string) => {
    setSelectedHubId(hubId);
    setGpsError('');
    setGpsNotice('');
    if (hubId === 'gps') {
      handleCalcGps();
      return;
    }
    const hub = PUNE_COMMUTE_HUBS.find((h) => h.id === hubId);
    if (hub) {
      const coords = { lat: hub.latitude, lng: hub.longitude };
      setUserCoords(coords);
      const hubLabel = isMr ? hub.nameMr : hub.nameEn;
      setOriginName(hubLabel);
      const computed = getPublicTransitRoute(hub.latitude, hub.longitude, place, hubLabel);
      setLiveTransit(computed);
    } else {
      setUserCoords(null);
      const defaultLabel = isMr ? 'मध्यवर्ती पुणे (मनपा/शनिवार वाडा)' : 'Central Pune (PMC Bhavan)';
      setOriginName(defaultLabel);
      const computed = getPublicTransitRoute(18.5204, 73.8567, place, defaultLabel);
      setLiveTransit(computed);
    }
  };

  const activeTransit = liveTransit || defaultTransit;

  return (
    <main className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <Link
          href="/"
          className="chip"
          style={{ marginBottom: 20, display: 'inline-flex', fontSize: 13, gap: 6 }}
        >
          <span>←</span> {isMr ? 'सर्व ठिकाणांकडे परत' : 'Back to All Places'}
        </Link>

        {/* Photo Banner with Authentic Image & Slideshow Opener */}
        {place.image_url && (
          <div
            onClick={() => setSlideshowOpen(true)}
            style={{
              width: '100%',
              height: 380,
              borderRadius: 18,
              overflow: 'hidden',
              marginBottom: 24,
              boxShadow: '0 12px 32px rgba(18, 53, 36, 0.12)',
              border: '1px solid var(--line)',
              position: 'relative',
              backgroundColor: '#0a1e16',
              cursor: 'pointer',
            }}
            title={isMr ? 'सर्व छायाचित्रांचा स्लाइडशो पहा (क्लिक करा)' : 'Click to open full photo slideshow'}
          >
            <img
              src={place.image_url}
              alt={primaryName}
              className="place-detail-banner-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px 20px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                color: '#ffffff',
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <span>📷 {isMr ? 'अधिकृत छायाचित्र (विकिपीडिया व कॉमन्स)' : 'Verified Landmark Photograph (Wikipedia & Commons)'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSlideshowOpen(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 12px rgba(194, 65, 12, 0.4)',
                }}
              >
                <span>📸</span>
                <span>{isMr ? 'छायाचित्रे स्लाइडशो उघडा' : 'View Photos Slideshow'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Hero Header */}
        <header
          className="panel"
          style={{
            marginBottom: 24,
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
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
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                color: 'var(--clay)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              📍 {categoryDisplayName}
            </span>
            <span className={`tier ${place.data_tier}`}>{tierLabel}</span>
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              margin: '6px 0 4px',
              color: 'var(--ink)',
              fontFamily: isMr ? 'var(--deva)' : 'inherit',
              lineHeight: 1.25,
            }}
          >
            {primaryName}
          </h1>

          {secondaryName && (
            <p
              style={{
                fontSize: '17px',
                color: 'var(--muted)',
                margin: '0 0 16px 0',
                fontFamily: isMr ? 'inherit' : 'var(--deva)',
              }}
            >
              {secondaryName}
            </p>
          )}

          {/* Free Live Operating Status Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              margin: '14px 0 16px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: opStatus.isOpen ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${opStatus.isOpen ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            <span className={`status-badge ${opStatus.badgeClass}`}>
              <span style={{ fontSize: 9 }}>{opStatus.isOpen ? '🟢' : '🔴'}</span>
              <span>{isMr ? opStatus.statusTextMr : opStatus.statusTextEn}</span>
            </span>
            <span style={{ fontSize: '13px', color: 'var(--ink-secondary)', fontWeight: 500 }}>
              {isMr ? opStatus.detailMr : opStatus.detailEn}
            </span>
          </div>

          {/* Quick Traveler Utilities Action Bar */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {/* Free Speech Audio Pronunciation */}
            <button
              type="button"
              onClick={handleSpeak}
              className="btn outline"
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
              title={isMr ? 'स्थानिक पुणेरी उच्चार ऐका' : 'Listen Native Pronunciation'}
            >
              <span>{speaking ? '🔊' : '🔈'}</span>
              <span>{speaking ? (isMr ? 'उच्चारत आहे…' : 'Speaking…') : (isMr ? 'नाव उच्चार ऐका' : 'Listen Pronunciation')}</span>
            </button>

            {/* Free Quick Wishlist / Save */}
            <button
              type="button"
              onClick={handleToggleSave}
              className="btn outline"
              style={{
                padding: '7px 14px',
                fontSize: '12.5px',
                color: isSaved ? '#e11d48' : undefined,
                borderColor: isSaved ? '#fecdd3' : undefined,
                background: isSaved ? '#fff1f2' : undefined,
              }}
            >
              <span>{isSaved ? '❤️' : '🤍'}</span>
              <span>{isSaved ? (isMr ? 'जतन केले आहे' : 'Saved in Wishlist') : (isMr ? 'आवडत्या यादीत जतन करा' : 'Save to Wishlist')}</span>
            </button>

            {/* Free 1-Click WhatsApp Share */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="btn outline"
              style={{ padding: '7px 14px', fontSize: '12.5px', color: '#15803d' }}
            >
              <span>💬</span>
              <span>{isMr ? 'WhatsApp वर शेअर करा' : 'Share on WhatsApp'}</span>
            </a>

            {/* Native Share or Link Copy */}
            <button
              type="button"
              onClick={handleShare}
              className="btn outline"
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              <span>🔗</span>
              <span>{copiedShare ? (isMr ? '✓ लिंक कॉपी झाली' : '✓ Link Copied') : (isMr ? 'लिंक शेअर करा' : 'Share Link')}</span>
            </button>

            {/* Free Offline Print & PDF Export */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn outline"
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
              title={isMr ? 'ऑफलाइन वाचनासाठी मार्गदर्शक प्रिंट किंवा सेव्ह करा' : 'Print or save offline travel guide'}
            >
              <span>🖨️</span>
              <span>{isMr ? 'ऑफलाइन PDF प्रिंट' : 'Print / Save PDF'}</span>
            </button>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--line)',
              paddingTop: '16px',
              marginTop: '16px',
              fontSize: '13.5px',
              color: 'var(--muted)',
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {place.latitude && place.longitude && (
              <span>
                🧭 {isMr ? 'स्थान निर्देशक' : 'Coordinates'}:{' '}
                <strong>
                  {Number(place.latitude).toFixed(4)}° N, {Number(place.longitude).toFixed(4)}° E
                </strong>
              </span>
            )}
            {address && <span>📍 {address}</span>}
          </div>
        </header>

        {/* Place Actions (Save, Record Visit) */}
        <PlaceActions placeId={place.id} placeSlug={place.slug} placeName={place.name} />

        {/* About & Visitor Info */}
        <div className="stack" style={{ marginBottom: 24 }}>
          {/* Overview & History Section */}
          <section className="panel">
            <h2
              style={{
                fontSize: '19px',
                borderBottom: '1px solid var(--line)',
                paddingBottom: 10,
                marginTop: 0,
                color: 'var(--ink)',
              }}
            >
              {isMr ? 'विहंगावलोकन आणि इतिहास' : 'Overview & Historical Context'}
            </h2>
            <p
              style={{
                fontSize: '15.5px',
                lineHeight: 1.75,
                color: 'var(--ink-secondary)',
                margin: '14px 0 0',
                fontFamily: isMr ? 'var(--deva)' : 'inherit',
              }}
            >
              {description ||
                (isMr
                  ? 'या ऐतिहासिक स्थानाबद्दल तपशीलवार माहिती लवकरच अद्ययावत केली जाईल.'
                  : 'Detailed information and visitor guide for this historic spot in Pune.')}
            </p>
          </section>

          {/* Visitor Intel Section */}
          <section className="panel">
            <h2
              style={{
                fontSize: '19px',
                borderBottom: '1px solid var(--line)',
                paddingBottom: 10,
                marginTop: 0,
                color: 'var(--ink)',
              }}
            >
              {isMr ? 'पर्यटक माहिती आणि नियोजन' : 'Visitor Intel & Planning'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
              {/* Admission Pricing */}
              <div>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    display: 'block',
                    letterSpacing: '0.04em',
                    marginBottom: 4,
                  }}
                >
                  {isMr ? 'प्रवेश शुल्क' : 'Admission Fee'}
                </span>
                <p style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--clay)' }}>
                  {price
                    ? price.is_free
                      ? isMr
                        ? 'विनामूल्य प्रवेश (सर्वांसाठी मोफत)'
                        : 'Free Admission for everyone'
                      : isMr
                      ? `₹${price.amount} प्रति व्यक्ती`
                      : `₹${price.amount} per person`
                    : isMr
                    ? 'स्थानिक नियमांनुसार विनामूल्य किंवा सवलत'
                    : 'Free or nominal local fee'}
                </p>
              </div>

              {/* Best Time to Visit */}
              {bestTime && (
                <div>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      display: 'block',
                      letterSpacing: '0.04em',
                      marginBottom: 4,
                    }}
                  >
                    {isMr ? 'उत्तम भेट काळ' : 'Best Time to Visit'}
                  </span>
                  <p style={{ fontSize: '14.5px', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>
                    ⏱️ {bestTime}
                  </p>
                </div>
              )}

              {/* Recommended Duration */}
              {place.recommended_duration_minutes && (
                <div>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      display: 'block',
                      letterSpacing: '0.04em',
                      marginBottom: 4,
                    }}
                  >
                    {isMr ? 'अपेक्षित वेळ' : 'Recommended Time'}
                  </span>
                  <p style={{ fontSize: '14.5px', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>
                    ⏳ {place.recommended_duration_minutes} {isMr ? 'मिनिटे' : 'minutes'}
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn outline"
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                📍 {isMr ? 'गुगल मॅप्सवर रस्ता शोधा ↗' : 'Navigate on Google Maps ↗'}
              </a>
            </div>
          </section>
        </div>

        {/* Comprehensive Visitor Guidelines & How to Visit */}
        <section
          className="panel"
          style={{
            marginBottom: 24,
            border: '1.5px solid #fed7aa',
            background: 'linear-gradient(to bottom, #fffbeb 0%, #ffffff 120px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              borderBottom: '1px solid var(--line)',
              paddingBottom: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '20px',
                  margin: 0,
                  color: '#9a3412',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>📋</span>
                <span>
                  {isMr
                    ? `${primaryName} — भेट मार्गदर्शक व नियम`
                    : `Guidelines: How to Visit ${primaryName}`}
                </span>
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ink-secondary)' }}>
                {isMr ? guidelines.summaryMr : guidelines.summaryEn}
              </p>
            </div>

            {guidelines.difficultyOrTypeEn && (
              <span
                style={{
                  background: '#ffedd5',
                  color: '#c2410c',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 999,
                  border: '1px solid #fdba74',
                }}
              >
                {isMr ? guidelines.difficultyOrTypeMr : guidelines.difficultyOrTypeEn}
              </span>
            )}
          </div>

          {/* Guideline Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 16,
              flexWrap: 'wrap',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: 8,
            }}
          >
            {[
              { id: 'commute', labelEn: '🧭 How to Reach (Commute)', labelMr: '🧭 कसे पोहोचावे' },
              { id: 'timing', labelEn: '🎟️ Timing & Tickets', labelMr: '🎟️ वेळ व तिकीट' },
              { id: 'rules', labelEn: "📋 Rules & Do's / Don'ts", labelMr: '📋 नियम व आचारसंहिता' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveGuidelineTab(tab.id as any)}
                style={{
                  border: 'none',
                  background: activeGuidelineTab === tab.id ? '#ea580c' : 'rgba(0,0,0,0.05)',
                  color: activeGuidelineTab === tab.id ? '#ffffff' : '#475569',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isMr ? tab.labelMr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div style={{ display: 'grid', gap: 12 }}>
            {guidelines.sections
              .filter((_, idx) => {
                if (activeGuidelineTab === 'commute') return idx === 0;
                if (activeGuidelineTab === 'timing') return idx === 1;
                return idx === 2;
              })
              .map((section, sIdx) => (
                <div key={sIdx} style={{ display: 'grid', gap: 10 }}>
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #f1f5f9',
                        borderRadius: 10,
                        padding: '12px 14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                          marginBottom: 4,
                          flexWrap: 'wrap',
                        }}
                      >
                        <strong style={{ fontSize: 13.5, color: '#1e293b' }}>
                          {isMr ? item.labelMr : item.labelEn}
                        </strong>
                        {item.tag && (
                          <span
                            style={{
                              background: '#fef3c7',
                              color: '#92400e',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: '#475569',
                          lineHeight: 1.55,
                        }}
                      >
                        {isMr ? item.descMr : item.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          {/* Local Pro-Tips Callout */}
          {guidelines.proTipsEn.length > 0 && (
            <div
              style={{
                marginTop: 18,
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <strong style={{ fontSize: 13, color: '#c2410c', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span>💡</span> {isMr ? 'स्थानिक तज्ज्ञ सूचना (Local Pro-Tips):' : 'Local Expert Pro-Tips:'}
              </strong>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#7c2d12', lineHeight: 1.6 }}>
                {(isMr ? guidelines.proTipsMr : guidelines.proTipsEn).map((tip, tIdx) => (
                  <li key={tIdx} style={{ marginBottom: 2 }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Local Authentic Food Recommendations */}
          {guidelines.nearbyCulinaryEn.length > 0 && (
            <div
              style={{
                marginTop: 12,
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <strong style={{ fontSize: 13, color: '#15803d', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span>🍲</span> {isMr ? 'परिसरातील प्रसिद्ध खाद्यसंस्कृती:' : 'Authentic Local Food to Try Nearby:'}
              </strong>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#166534', lineHeight: 1.6 }}>
                {(isMr ? guidelines.nearbyCulinaryMr : guidelines.nearbyCulinaryEn).map((dish, dIdx) => (
                  <li key={dIdx} style={{ marginBottom: 2 }}>{dish}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Public Transit & Directions Section */}
        <section
          className="panel"
          style={{
            marginBottom: 24,
            border: '1.5px solid #bbf7d0',
            background: 'linear-gradient(to bottom, #f0fdf4 0%, #ffffff 120px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              borderBottom: '1px solid var(--line)',
              paddingBottom: 12,
            }}
          >
            <h2
              style={{
                fontSize: '19px',
                margin: 0,
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>🚇</span>{' '}
              {isMr
                ? 'सार्वजनिक वाहतूक मार्गदर्शक (पुणे मेट्रो व बस)'
                : 'Public Transit Guide (Metro & Bus)'}
            </h2>
          </div>

          {/* Starting Location / Home Selector */}
          <div
            style={{
              marginTop: 14,
              padding: '14px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <label
                htmlFor="home-locality-select"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>🏠</span>
                <span>
                  {isMr
                    ? 'तुमच्या घरातून / भागातून मार्ग निवडा:'
                    : 'Choose Starting Point (From Your Home / Locality):'}
                </span>
              </label>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="btn outline"
                  style={{
                    padding: '4px 10px',
                    fontSize: 11.5,
                    borderRadius: 999,
                    background: '#ffffff',
                    borderColor: '#059669',
                    color: '#065f46',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title={isMr ? 'पुण्यातील ३५+ परिसरांमधून थेट शोधा' : 'Search across 35+ Pune localities'}
                >
                  <span>📍</span>
                  <span>{isMr ? 'सर्व ३५+ परिसर शोधा' : 'Search 35+ Localities'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCalcGps}
                  disabled={gpsLoading}
                  className="btn outline"
                  style={{
                    padding: '4px 10px',
                    fontSize: 11.5,
                    borderRadius: 999,
                    background: selectedHubId === 'gps' ? '#ecfdf5' : '#ffffff',
                    borderColor: selectedHubId === 'gps' ? '#10b981' : '#cbd5e1',
                    color: selectedHubId === 'gps' ? '#047857' : '#334155',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span>{gpsLoading ? '⏳' : '📍'}</span>
                  <span>
                    {gpsLoading
                      ? isMr
                        ? 'स्थान शोधत आहे…'
                        : 'Locating…'
                      : selectedHubId === 'gps'
                      ? isMr
                        ? '✓ थेट GPS निवडले'
                        : '✓ Live GPS Active'
                      : isMr
                      ? 'माझे थेट GPS वापरा'
                      : 'Use My Live GPS'}
                  </span>
                </button>
              </div>
            </div>

            {/* GPS Live Notice Banner */}
            {gpsNotice && (
              <div
                style={{
                  marginBottom: 12,
                  padding: '10px 14px',
                  background: '#ecfdf5',
                  border: '1px solid #10b981',
                  borderRadius: 8,
                  fontSize: 12.5,
                  color: '#065f46',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>📍</span>
                <span>{gpsNotice}</span>
              </div>
            )}

            {/* GPS Error Banner */}
            {gpsError && (
              <div
                style={{
                  marginBottom: 12,
                  padding: '10px 14px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  fontSize: 12.5,
                  color: '#b91c1c',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>⚠️</span>
                <span>{gpsError}</span>
              </div>
            )}

            {/* Quick Hub Pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: 12,
              }}
            >
              {[
                { id: 'central', en: 'Central PMC', mr: 'मनपा मध्यवर्ती' },
                { id: 'kothrud', en: 'Kothrud', mr: 'कोथरूड' },
                { id: 'hadapsar', en: 'Hadapsar', mr: 'हडपसर' },
                { id: 'hinjewadi', en: 'Hinjewadi', mr: 'हिंजवडी' },
                { id: 'viman-nagar', en: 'Viman Nagar', mr: 'विमान नगर' },
                { id: 'shivajinagar', en: 'Shivaji Nagar', mr: 'शिवाजीनगर' },
                { id: 'swargate', en: 'Swargate', mr: 'स्वारगेट' },
                { id: 'deccan', en: 'Deccan', mr: 'डेक्कन' },
                { id: 'baner', en: 'Baner', mr: 'बाणेर' },
                { id: 'wakad', en: 'Wakad', mr: 'वाकड' },
                { id: 'katraj', en: 'Katraj', mr: 'कात्रज' },
                { id: 'pimpri', en: 'Pimpri PCMC', mr: 'पिंपरी' },
                { id: 'sinhagad-road', en: 'Sinhagad Rd', mr: 'सिंहगड रस्ता' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => handleSelectHub(pill.id)}
                  style={{
                    border: '1px solid',
                    borderColor: selectedHubId === pill.id ? '#059669' : '#cbd5e1',
                    background: selectedHubId === pill.id ? '#ecfdf5' : '#ffffff',
                    color: selectedHubId === pill.id ? '#065f46' : '#475569',
                    fontWeight: selectedHubId === pill.id ? 700 : 500,
                    borderRadius: 999,
                    padding: '3px 10px',
                    fontSize: 11.5,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isMr ? pill.mr : pill.en}
                </button>
              ))}
            </div>

            {/* Comprehensive Locality Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', minWidth: 0, width: '100%' }}>
              <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {isMr ? 'सर्व उपनगरे:' : 'All localities:'}
              </span>
              <select
                id="home-locality-select"
                value={selectedHubId}
                onChange={(e) => handleSelectHub(e.target.value)}
                style={{
                  flex: '1 1 200px',
                  minWidth: 0,
                  maxWidth: '100%',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#0f172a',
                }}
              >
                <option value="central">
                  🏛️ {isMr ? 'मध्यवर्ती पुणे (मनपा/शनिवार वाडा)' : 'Central Pune (PMC Bhavan / Shaniwar Wada)'}
                </option>
                {PUNE_COMMUTE_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    🏠 {isMr ? hub.nameMr : hub.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {gpsError && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#dc2626' }}>
              ⚠️ {gpsError}
            </div>
          )}

          {/* Active Route Status Callout */}
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              background: '#f0fdf4',
              borderRadius: 8,
              border: '1px solid #a7f3d0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              fontSize: 12.5,
            }}
          >
            <div>
              <span style={{ color: '#065f46', fontWeight: 700 }}>
                📍 {isMr ? 'सुरुवात:' : 'From:'} {originName}
              </span>
              <span style={{ margin: '0 6px', color: '#059669' }}>➔</span>
              <span style={{ color: '#065f46', fontWeight: 700 }}>
                🚩 {isMr ? 'गंतव्य:' : 'To:'} {primaryName}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: '#047857', fontWeight: 700 }}>
                ⏱️ ~{activeTransit.estimatedMinutes} {isMr ? 'मिनिटे' : 'mins'}
              </span>
              <span
                style={{
                  background: '#047857',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                ₹{activeTransit.estimatedCostInr}
              </span>
            </div>
          </div>

          {/* Transit Options Grid */}
          <div
            style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            {/* Metro Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--line)',
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>🚇</span>
                <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                  {isMr ? 'पुणे मेट्रो सेवा' : 'Pune Metro Access'}
                </strong>
              </div>
              {activeTransit.nearestMetro ? (
                <>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: activeTransit.nearestMetro.lineColor,
                      marginBottom: 4,
                    }}
                  >
                    {isMr
                      ? activeTransit.nearestMetro.stationNameMr
                      : activeTransit.nearestMetro.stationNameEn}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                    {isMr
                      ? activeTransit.nearestMetro.lineNameMr
                      : activeTransit.nearestMetro.lineNameEn}{' '}
                    • ~{activeTransit.nearestMetro.distanceKm} km (
                    ~{activeTransit.nearestMetro.walkingMinutes}{' '}
                    {isMr ? 'मि. चालत' : 'min walk'})
                  </div>
                  <a
                    href="https://wa.me/919420101990?text=Hi"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      background: '#25D366',
                      color: '#ffffff',
                      fontSize: 11.5,
                      padding: '6px 12px',
                      borderRadius: 6,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontWeight: 700,
                    }}
                  >
                    <span>🎟️</span>{' '}
                    {isMr
                      ? 'व्हॉट्सअॅपवर मेट्रो तिकीट बुक करा'
                      : 'Book Metro Ticket on WhatsApp'}
                  </a>
                </>
              ) : (
                <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>
                  {isMr
                    ? 'या ठिकाणी थेट मेट्रो उपलब्ध नाही; पीएमपीएमएल बस किंवा कॅबने प्रवास करा.'
                    : 'Direct metro is not available nearby; PMPML buses serve this destination.'}
                </p>
              )}
            </div>

            {/* PMPML Bus Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--line)',
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>🚌</span>
                <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                  {isMr ? 'पीएमपीएमएल (PMPML) बस सेवा' : 'PMPML City Buses'}
                </strong>
              </div>
              {activeTransit.nearestBus && (
                <>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#f97316',
                      marginBottom: 4,
                    }}
                  >
                    {isMr
                      ? activeTransit.nearestBus.stopNameMr
                      : activeTransit.nearestBus.stopNameEn}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                    {isMr ? 'बस क्रमांक:' : 'Bus Lines:'}{' '}
                    <strong>{activeTransit.nearestBus.routeNumbers.join(', ')}</strong>
                  </div>
                </>
              )}
              <div
                style={{
                  fontSize: 11.5,
                  color: '#047857',
                  background: '#ecfdf5',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                💡{' '}
                {isMr
                  ? 'टीप: पीएमपीएमएलचा ₹७० चा दैनिक पास (PMC + PCMC) किंवा ₹१५० चा ऑल-रूट पास दिवसभर अमर्याद प्रवासासाठी मिळतो.'
                  : 'Tip: PMPML Day Pass is ₹70 for PMC+PCMC limits, or ₹150 for all routes (rural/PMRDA network).'}
              </div>
            </div>
          </div>

          {/* Step by step directions */}
          <div
            style={{
              marginTop: 16,
              background: '#ffffff',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: 14,
            }}
          >
            <strong
              style={{
                fontSize: 13,
                color: 'var(--ink)',
                display: 'block',
                marginBottom: 8,
              }}
            >
              📋{' '}
              {isMr
                ? `${originName} येथून थेट प्रवास मार्ग:`
                : `Step-by-step route from ${originName}:`}
            </strong>
            <ol
              style={{
                margin: 0,
                paddingLeft: 18,
                fontSize: 12.5,
                color: 'var(--ink)',
                lineHeight: 1.6,
              }}
            >
              {(isMr ? activeTransit.stepByStepMr : activeTransit.stepByStepEn).map(
                (step, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    {step}
                  </li>
                )
              )}
            </ol>

            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                ⏱️ ~{activeTransit.estimatedMinutes} {isMr ? 'मिनिटे' : 'mins'} | 🎟️{' '}
                {isMr ? 'अंदाजे भाडे:' : 'Est. Fare:'} ₹{activeTransit.estimatedCostInr}
              </span>
              <a
                href={
                  activeTransit.gmapsTransitUrl ||
                  (userCoords
                    ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${place.latitude || 18.5204},${place.longitude || 73.8567}&travelmode=transit`
                    : mapsUrl)
                }
                target="_blank"
                rel="noreferrer"
                className="btn outline"
                style={{ padding: '4px 12px', fontSize: 11.5 }}
              >
                🗺️ {isMr ? 'गुगल मॅप्सवर थेट बस/मेट्रो मार्ग ↗' : 'Google Maps Live Bus & Metro ↗'}
              </a>
            </div>
          </div>

          {/* Integrated Interactive Transit Route Map */}
          <TransitRouteMap
            origin={{
              name: originName,
              lat: userCoords ? userCoords.lat : 18.5204,
              lng: userCoords ? userCoords.lng : 73.8567,
            }}
            destination={{
              name: primaryName,
              lat: place.latitude || 18.5204,
              lng: place.longitude || 73.8567,
            }}
            transitInfo={activeTransit}
            isMarathi={isMr}
          />
        </section>

        {/* Location & Map Section */}
        <section className="panel" style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: '19px',
              borderBottom: '1px solid var(--line)',
              paddingBottom: 10,
              marginTop: 0,
              marginBottom: 16,
              color: 'var(--ink)',
            }}
          >
            {isMr ? 'परिसर आणि नकाशा' : 'Location & Interactive Map'}
          </h2>
          <PlaceMap
            latitude={place.latitude || 18.5204}
            longitude={place.longitude || 73.8567}
            name={primaryName}
          />
        </section>

        {/* Community Visitor Photo Gallery */}
        <CommunityGallery placeId={place.id} placeName={primaryName} />

        {/* Reviews Section */}
        <Reviews placeId={place.id} />
      </div>

      {/* Global Location & GPS Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelected={(loc) => {
          setSelectedHubId(loc.id);
          const name = isMr ? loc.nameMr : loc.nameEn;
          setOriginName(name);
          setUserCoords({ lat: loc.lat, lng: loc.lng });
          setGpsNotice(
            isMr
              ? `✓ निवडलेले स्थान: ${loc.nameMr}`
              : `✓ Origin set to: ${loc.nameEn}`
          );
          setGpsError('');
          const computed = getPublicTransitRoute(loc.lat, loc.lng, place, name);
          setLiveTransit(computed);
        }}
      />

      {/* Interactive Landmark Photo Slideshow Modal */}
      <PlacePhotoSlideshowModal
        isOpen={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        place={place}
      />
    </main>
  );
}

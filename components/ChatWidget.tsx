'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface PlaceSummary {
  id: string;
  name: string;
  name_mr?: string;
  slug: string;
  category?: string;
  category_slug?: string;
  description?: string;
  description_mr?: string;
  data_tier?: string;
  place_prices?: Array<{ amount?: number; is_free?: boolean; visitor_category?: string }>;
  place_hours?: Array<{ opens_at?: string; closes_at?: string; is_closed?: boolean }>;
}

interface TransitData {
  hasTransit: boolean;
  transitType: string;
  summaryEn: string;
  summaryMr: string;
  nearestMetro?: {
    stationNameEn: string;
    stationNameMr: string;
    lineNameEn: string;
    lineNameMr: string;
    distanceKm: number;
    walkingMinutes: number;
    lineColor: string;
  };
  nearestBus?: {
    stopNameEn: string;
    stopNameMr: string;
    routeNumbers: string[];
    distanceKm: number;
    walkingMinutes: number;
  };
  stepByStepEn: string[];
  stepByStepMr: string[];
  estimatedMinutes: number;
  estimatedCostInr: number;
  ticketInfoEn: string;
  ticketInfoMr: string;
  bookingOptions?: {
    metroWhatsApp?: string;
    busApp?: string;
    ticketType?: string;
    dayPassEligible?: boolean;
  };
}

interface ChatMessage {
  id: string;
  role: 'me' | 'bot';
  text: string;
  places?: PlaceSummary[];
  transit?: TransitData;
  suggestions?: string[];
  time?: string;
}

const DEFAULT_HINTS_EN = [
  '🏰 Forts around Pune',
  '🏛️ Historic Peshwa Wadas',
  '🛕 Famous Ganpati Temples',
  '🚇 Pune Metro & WhatsApp Ticket',
  '🚌 PMPML ₹70 / ₹150 Day Pass',
  '🎟️ Free places to visit',
  '⚡ 1-Day Pune Itinerary',
];

const DEFAULT_HINTS_MR = [
  '🏰 पुण्याभोवतीचे गड-किल्ले',
  '🏛️ पेशवेकालीन ऐतिहासिक वाडे',
  '🛕 प्रसिद्ध गणपती मंदिरे',
  '🚇 पुणे मेट्रो व व्हॉट्सअॅप तिकीट',
  '🚌 पीएमपीएमएल ₹७० / ₹१५० डेली पास',
  '🎟️ मोफत प्रेक्षणीय ठिकाणे',
  '⚡ १ दिवसाची पुणे सहल',
];

function formatMarkdownLinks(text: string) {
  // Support bold **text** and /places/slug links
  const parts = text.split(/(\/places\/[a-z0-9-]+|\*\*[^*]+\*\*)/gi);
  return parts.map((part, i) => {
    if (part.startsWith('/places/')) {
      return (
        <Link
          key={i}
          href={part}
          style={{
            color: 'var(--primary)',
            textDecoration: 'underline',
            fontWeight: 700,
          }}
        >
          {part}
        </Link>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function ChatWidget() {
  const { lang, isMr, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [showTeaser, setShowTeaser] = useState(false);
  const [hasDismissedTeaser, setHasDismissedTeaser] = useState(false);
  const [log, setLog] = useState<ChatMessage[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingGps, setLocatingGps] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [expandedTransitSteps, setExpandedTransitSteps] = useState<Record<string, boolean>>({});

  const endRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when language changes
  useEffect(() => {
    if (log.length === 0) {
      setLog([
        {
          id: 'welcome',
          role: 'bot',
          text: isMr
            ? 'नमस्कार! 🙏 मी तुमचा एक्सप्लोर पुणे (Explore Pune) डिजिटल मार्गदर्शक आहे. पुण्यातील गड-किल्ले, वाडे, मंदिरे, सार्वजनिक वाहतूक (मेट्रो व बस), तिकीट दर किंवा सहलीबद्दल काहीही विचारा.'
            : 'Namaste! 🙏 I am your Explore Pune guide. Ask me anything about forts, wadas, temples, Pune Metro & PMPML buses, tickets, or travel tips.',
          suggestions: isMr ? DEFAULT_HINTS_MR.slice(0, 4) : DEFAULT_HINTS_EN.slice(0, 4),
        },
      ]);
    }
  }, [isMr, log.length]);

  // Animated teaser popup after site load (900ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open && !hasDismissedTeaser) {
        setShowTeaser(true);
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [open, hasDismissedTeaser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [log, busy, open]);

  async function send(text: string, locationOverride?: { lat: number; lng: number }) {
    const message = text.trim();
    if (!message || busy) return;

    setInput('');
    setBusy(true);
    setShowTeaser(false);

    const activeLoc = locationOverride || userLocation;
    const msgId = Date.now().toString();

    // Append user message
    setLog((prev) => [...prev, { id: `u-${msgId}`, role: 'me', text: message }]);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          lang,
          userLocation: activeLoc || undefined,
        }),
      });
      const data = await res.json();

      setLog((prev) => [
        ...prev,
        {
          id: `b-${msgId}`,
          role: 'bot',
          text:
            data.reply ||
            (isMr
              ? 'माहिती मिळाली नाही, पुन्हा प्रयत्न करा.'
              : 'Could not fetch details. Please try again.'),
          places: data.places,
          transit: data.transit,
          suggestions:
            data.suggestions ||
            (isMr ? DEFAULT_HINTS_MR.slice(0, 3) : DEFAULT_HINTS_EN.slice(0, 3)),
        },
      ]);
    } catch {
      setLog((prev) => [
        ...prev,
        {
          id: `err-${msgId}`,
          role: 'bot',
          text: isMr
            ? 'संपर्क त्रुटी आली. कृपया इंटरनेट तपासा आणि पुन्हा विचारा.'
            : 'Connection failure. Check your internet connection and try again.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    setShowTeaser(false);
    setHasDismissedTeaser(true);
  }

  function handleClear() {
    setLog([
      {
        id: 'cleared',
        role: 'bot',
        text: isMr
          ? 'चॅट साफ झाले आहे. आपण नवीन प्रश्न विचारू शकता! 🙏'
          : 'Chat history cleared. What would you like to explore in Pune?',
        suggestions: isMr ? DEFAULT_HINTS_MR.slice(0, 4) : DEFAULT_HINTS_EN.slice(0, 4),
      },
    ]);
  }

  function handleCopy(id: string, text: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  function handleShareLocation() {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert(
        isMr
          ? 'आपल्या ब्राउझरमध्ये GPS सेवा उपलब्ध नाही.'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocatingGps(false);
        const queryText = isMr
          ? 'माझ्या सध्याच्या GPS स्थानावरून सर्वात जवळची ठिकाणे कोणती आहेत?'
          : 'What attractions are closest to my live GPS location?';
        send(queryText, coords);
      },
      (err) => {
        setLocatingGps(false);
        alert(
          err.code === err.PERMISSION_DENIED
            ? isMr
              ? 'कृपया ब्राउझरमध्ये लोकेशन परवानगी द्या (Allow Location).'
              : 'Location permission was denied. Please allow location access in your browser.'
            : isMr
            ? 'GPS स्थान शोधता आले नाही.'
            : 'Unable to detect location. Please check GPS settings.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  const hints = isMr ? DEFAULT_HINTS_MR : DEFAULT_HINTS_EN;

  return (
    <>
      {/* Right-Corner Fixed Container */}
      <div className="chat-fab-container">
        {/* Animated Teaser Bubble on Site Open */}
        {showTeaser && !open && (
          <div
            className="chat-teaser-bubble"
            onClick={handleOpen}
            role="dialog"
            aria-label="Pune Guide Greeting"
          >
            <span style={{ fontSize: 24, animation: 'pulseGlow 2s infinite' }}>🚩</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
                {isMr ? 'नमस्कार! पुणे फिरताय?' : 'Namaskar! Exploring Pune?'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {isMr ? 'मेट्रो, बस व ठिकाणांबद्दल विचारा ⚡' : 'Ask about Metro, buses & spots ⚡'}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
                setHasDismissedTeaser(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: 14,
                padding: '4px',
              }}
              aria-label="Dismiss greeting"
            >
              ✕
            </button>
          </div>
        )}

        {/* FAB Button at Right Corner */}
        <button
          className="chat-fab"
          onClick={() => (open ? setOpen(false) : handleOpen())}
          aria-expanded={open}
          aria-label={
            open
              ? isMr
                ? 'मार्गदर्शक बंद करा'
                : 'Close Pune Guide'
              : isMr
              ? 'पुणे मार्गदर्शक उघडा'
              : 'Open Pune Guide'
          }
        >
          <div className="chat-fab-pulse" />
          <span style={{ fontSize: 20 }}>🚩</span>
          <span style={{ fontSize: 14 }}>
            {open
              ? isMr
                ? 'मार्गदर्शक बंद करा'
                : 'Close Guide'
              : isMr
              ? 'पुणे मार्गदर्शक AI'
              : 'Ask Pune Guide'}
          </span>
        </button>
      </div>

      {/* Interactive Chat Panel at Right Corner */}
      {open && (
        <section
          className={`chat-panel ${isExpanded ? 'expanded' : ''}`}
          aria-label="Pune Assistant"
        >
          {/* Header */}
          <div className="chat-panel-header">
            <span style={{ fontSize: 22 }}>🚩</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {isMr ? 'एक्सप्लोर पुणे AI मार्गदर्शक' : 'Explore Pune AI Guide'}
              </div>
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.9,
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{isMr ? 'मेट्रो, बस व पर्यटन सहाय्यक' : 'Live Transit & Travel Assistant'}</span>
                {userLocation && (
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.25)',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      fontSize: 10,
                    }}
                  >
                    📍 GPS Active
                  </span>
                )}
              </div>
            </div>

            {/* Expand / Minimize Window */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Minimize' : 'Expand'}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 0,
                color: '#fff',
                width: 26,
                height: 26,
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                fontSize: 12,
              }}
              aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}
            >
              {isExpanded ? '❐' : '⛶'}
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClear}
              title={isMr ? 'चॅट साफ करा' : 'Clear conversation'}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 0,
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {isMr ? 'साफ' : 'Clear'}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.25)',
                border: 0,
                color: '#fff',
                width: 26,
                height: 26,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
              }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Log */}
          <div className="chat-log" aria-live="polite">
            {log.map((m) => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className={`msg ${m.role}`}>{formatMarkdownLinks(m.text)}</div>

                {/* Structured Public Transit Route Card */}
                {m.transit && (
                  <div className="chat-transit-card">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <strong style={{ color: '#065f46', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🚇</span> {isMr ? 'सार्वजनिक वाहतूक मार्ग' : 'Public Transit Option'}
                      </strong>
                      <span
                        style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          fontWeight: 700,
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        ~₹{m.transit.estimatedCostInr} • ~{m.transit.estimatedMinutes} min
                      </span>
                    </div>

                    {/* Nearest Metro Station */}
                    {m.transit.nearestMetro && (
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #d1fae5',
                          borderRadius: 8,
                          padding: '8px 10px',
                          fontSize: 12,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span
                            style={{
                              background: m.transit.nearestMetro.lineColor,
                              color: '#fff',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            Metro
                          </span>
                          <strong>
                            {isMr
                              ? m.transit.nearestMetro.stationNameMr
                              : m.transit.nearestMetro.stationNameEn}
                          </strong>
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: 11 }}>
                          🚶 {m.transit.nearestMetro.distanceKm} km (
                          ~{m.transit.nearestMetro.walkingMinutes}{' '}
                          {isMr ? 'मिनिटे पायी' : 'min walk'})
                        </div>
                      </div>
                    )}

                    {/* Nearest Bus */}
                    {m.transit.nearestBus && (
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #d1fae5',
                          borderRadius: 8,
                          padding: '8px 10px',
                          fontSize: 12,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span
                            style={{
                              background: '#f97316',
                              color: '#fff',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            PMPML
                          </span>
                          <strong>
                            {isMr
                              ? m.transit.nearestBus.stopNameMr
                              : m.transit.nearestBus.stopNameEn}
                          </strong>
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: 11 }}>
                          🚌 {isMr ? 'बस क्रमांक:' : 'Bus Routes:'}{' '}
                          <strong>{m.transit.nearestBus.routeNumbers.join(', ')}</strong>
                        </div>
                      </div>
                    )}

                    {/* Step-by-Step Toggle */}
                    {((isMr ? m.transit.stepByStepMr : m.transit.stepByStepEn) || []).length > 0 && (
                      <div style={{ marginTop: 2 }}>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTransitSteps((prev) => ({
                              ...prev,
                              [m.id]: !prev[m.id],
                            }))
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#047857',
                            fontWeight: 700,
                            fontSize: 11.5,
                            cursor: 'pointer',
                            padding: '2px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span>{expandedTransitSteps[m.id] ? '▼' : '►'}</span>
                          <span>
                            {expandedTransitSteps[m.id]
                              ? isMr
                                ? 'तपशीलवार मार्ग लपवा'
                                : 'Hide directions steps'
                              : isMr
                              ? 'पायरी-दर-पायरी मार्ग पहा'
                              : 'View step-by-step directions'}
                          </span>
                        </button>

                        {expandedTransitSteps[m.id] && (
                          <ol
                            style={{
                              margin: '6px 0 0 16px',
                              padding: 0,
                              fontSize: 11.5,
                              color: 'var(--ink)',
                              lineHeight: 1.5,
                            }}
                          >
                            {(isMr ? m.transit.stepByStepMr : m.transit.stepByStepEn).map(
                              (st, sIdx) => (
                                <li key={sIdx} style={{ marginBottom: 4 }}>
                                  {st}
                                </li>
                              )
                            )}
                          </ol>
                        )}
                      </div>
                    )}

                    {/* WhatsApp Metro Booking Action */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      <a
                        href="https://wa.me/919420101990?text=Hi"
                        target="_blank"
                        rel="noreferrer"
                        className="btn"
                        style={{
                          background: '#25D366',
                          color: '#ffffff',
                          fontSize: 11,
                          padding: '5px 10px',
                          borderRadius: 6,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontWeight: 700,
                        }}
                      >
                        <span>🎟️</span>
                        <span>{t('chat.metroWhatsApp')}</span>
                      </a>

                      <Link
                        href="/planner"
                        className="btn outline"
                        style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6 }}
                      >
                        🗺️ {isMr ? 'सहल नियोजन' : 'Trip Planner'}
                      </Link>
                    </div>
                  </div>
                )}

                {/* Interactive Place Cards */}
                {m.places && m.places.length > 0 && (
                  <div style={{ display: 'grid', gap: 8, marginTop: 4, maxWidth: '98%' }}>
                    {m.places.map((p) => {
                      const verified = p.data_tier === 'verified';
                      const price = p.place_prices?.[0];
                      return (
                        <div key={p.id} className="chat-place-card">
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: 6,
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: 13.5, color: 'var(--ink)' }}>
                                {isMr && p.name_mr ? p.name_mr : p.name}
                              </strong>
                              {isMr && p.name_mr && (
                                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                                  {p.name}
                                </div>
                              )}
                            </div>
                            <span
                              className={`tier ${verified ? 'verified' : ''}`}
                              style={{ fontSize: 9, padding: '2px 6px' }}
                            >
                              {verified
                                ? isMr
                                  ? 'तपासलेले'
                                  : 'Verified'
                                : isMr
                                ? 'सार्वजनिक'
                                : 'Public'}
                            </span>
                          </div>

                          {p.description && (
                            <p
                              style={{
                                fontSize: 12,
                                color: 'var(--muted)',
                                margin: 0,
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {isMr && p.description_mr ? p.description_mr : p.description}
                            </p>
                          )}

                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: 4,
                              paddingTop: 6,
                              borderTop: '1px solid var(--line)',
                            }}
                          >
                            <span
                              style={{ fontSize: 11, fontWeight: 700, color: 'var(--clay)' }}
                            >
                              {price
                                ? price.is_free
                                  ? isMr
                                    ? 'मोफत प्रवेश'
                                    : 'Free Entry'
                                  : `₹${price.amount}`
                                : isMr
                                ? 'प्रवेश शुल्क'
                                : 'Admission details'}
                            </span>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <Link
                                href={`/places/${p.slug}`}
                                className="btn outline"
                                style={{ padding: '4px 10px', fontSize: 11 }}
                              >
                                {isMr ? 'तपशील →' : 'Details →'}
                              </Link>
                              <button
                                type="button"
                                onClick={() =>
                                  send(
                                    isMr
                                      ? `${p.name_mr || p.name} साठी बस आणि मेट्रो मार्ग कसा आहे?`
                                      : `How to reach ${p.name} by Metro or PMPML bus?`
                                  )
                                }
                                className="btn clay"
                                style={{ padding: '4px 8px', fontSize: 11 }}
                              >
                                🚌 {isMr ? 'बस/मेट्रो मार्ग' : 'Transit'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Message Actions (Copy & Helpful Feedback) */}
                {m.role === 'bot' && (
                  <div className="msg-actions">
                    <button
                      type="button"
                      className="msg-action-btn"
                      onClick={() => handleCopy(m.id, m.text)}
                      title={t('chat.copyAnswer')}
                    >
                      <span>{copiedId === m.id ? '✓' : '📋'}</span>
                      <span>{copiedId === m.id ? t('chat.copied') : t('chat.copyAnswer')}</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                      <button
                        type="button"
                        className="msg-action-btn"
                        onClick={() =>
                          setFeedback((prev) => ({ ...prev, [m.id]: 'up' }))
                        }
                        style={{
                          color: feedback[m.id] === 'up' ? 'var(--primary)' : 'var(--muted)',
                          fontWeight: feedback[m.id] === 'up' ? 700 : 400,
                        }}
                        title={t('chat.helpful')}
                      >
                        👍
                      </button>
                      <button
                        type="button"
                        className="msg-action-btn"
                        onClick={() =>
                          setFeedback((prev) => ({ ...prev, [m.id]: 'down' }))
                        }
                        style={{
                          color: feedback[m.id] === 'down' ? '#dc2626' : 'var(--muted)',
                          fontWeight: feedback[m.id] === 'down' ? 700 : 400,
                        }}
                        title={t('chat.unhelpful')}
                      >
                        👎
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggestions / Prompt Chips */}
                {m.suggestions && m.suggestions.length > 0 && m.id === log[log.length - 1]?.id && !busy && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {m.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="chip"
                        style={{
                          fontSize: 11.5,
                          padding: '5px 10px',
                          background: '#ffffff',
                          border: '1px solid var(--line)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        💡 {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Quick Chips on New Chat */}
            {log.length === 1 && !busy && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {isMr ? 'लोकप्रिय प्रश्न:' : 'Suggested topics:'}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {hints.map((h) => (
                    <button
                      key={h}
                      type="button"
                      className="chip"
                      style={{
                        fontSize: 12,
                        padding: '6px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--primary-border)',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      onClick={() => send(h)}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Thinking Indicator */}
            {busy && (
              <div className="msg bot" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {isMr ? 'पुणे नोंदी तपासत आहे' : 'Consulting Pune records'}
                </span>
                <div className="chat-typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Quick Interactive Actions Bar above input */}
          <div className="chat-actions-bar">
            {/* Share Live Location GPS Pill */}
            <button
              type="button"
              className="chat-action-pill"
              onClick={handleShareLocation}
              disabled={locatingGps}
              title="Locate closest spots via live GPS"
            >
              <span>{locatingGps ? '⏳' : '📍'}</span>
              <span>{locatingGps ? t('chat.locating') : t('chat.shareLocation')}</span>
            </button>

            {/* Metro WhatsApp Ticket Booking */}
            <button
              type="button"
              className="chat-action-pill"
              onClick={() =>
                send(
                  isMr
                    ? 'पुणे मेट्रोचे मार्ग आणि व्हॉट्सअॅपवरून तिकीट कसे काढावे?'
                    : 'Tell me about Pune Metro lines and how to buy WhatsApp tickets'
                )
              }
            >
              <span>🚇</span>
              <span>{isMr ? 'मेट्रो व तिकीट' : 'Metro Ticket'}</span>
            </button>

            {/* PMPML Day Pass */}
            <button
              type="button"
              className="chat-action-pill"
              onClick={() =>
                send(
                  isMr
                    ? 'पीएमपीएमएल ₹७० आणि ₹१५० डेली पास व बस मार्गांची माहिती सांगा'
                    : 'Tell me about the PMPML ₹70 & ₹150 unlimited daily pass and bus routes'
                )
              }
            >
              <span>🚌</span>
              <span>{isMr ? '₹७०/₹१५० बस पास' : '₹70/₹150 Pass'}</span>
            </button>

            {/* Forts Trek */}
            <button
              type="button"
              className="chat-action-pill"
              onClick={() =>
                send(isMr ? 'पुण्यातील किल्ले व ट्रेकिंग मार्ग' : 'Top forts and trekking routes in Pune')
              }
            >
              <span>🏰</span>
              <span>{isMr ? 'किल्ले' : 'Forts'}</span>
            </button>
          </div>

          {/* Input Form */}
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder={
                isMr
                  ? 'ठिकाणाबद्दल विचारा (उदा. शनिवार वाड्याची वेळ, मेट्रो, बस)...'
                  : 'Ask about places, metro, buses, or entry fees...'
              }
              aria-label={isMr ? 'तुमचा प्रश्न' : 'Your question'}
            />
            <button
              className="btn"
              disabled={busy || !input.trim()}
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              {isMr ? 'विचारा' : 'Send'}
            </button>
          </form>
        </section>
      )}
    </>
  );
}

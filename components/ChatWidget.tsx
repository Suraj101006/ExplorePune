'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LocationPickerModal from '@/components/LocationPickerModal';
import { getStoredUserLocation, UserSavedLocation } from '@/lib/userLocation';

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
  image_url?: string;
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
}

interface ChatMessage {
  id: string;
  role: 'me' | 'bot';
  text: string;
  places?: PlaceSummary[];
  transit?: TransitData;
  suggestions?: string[];
  isGemini?: boolean;
  model?: string;
}

/**
 * Parses markdown bold (**text**), markdown links [Label](url), and raw paths (/places/slug) into React elements.
 */
function renderMarkdownContent(text: string) {
  // Pattern matches [Label](url) OR /places/slug OR **bold**
  const regex = /(\[[^\]]+\]\([^)]+\)|\/places\/[a-z0-9-]+|\*\*[^*]+\*\*)/gi;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    // Markdown link [Label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isInternal = url.startsWith('/');
      return isInternal ? (
        <Link
          key={i}
          href={url}
          style={{
            color: 'var(--primary)',
            textDecoration: 'underline',
            fontWeight: 700,
          }}
        >
          {label}
        </Link>
      ) : (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--primary)',
            textDecoration: 'underline',
            fontWeight: 700,
          }}
        >
          {label}
        </a>
      );
    }

    // Bare /places/slug link
    if (part.startsWith('/places/')) {
      const slugName = part.replace('/places/', '').replace(/-/g, ' ');
      return (
        <Link
          key={i}
          href={part}
          style={{
            color: 'var(--primary)',
            textDecoration: 'underline',
            fontWeight: 700,
            textTransform: 'capitalize',
          }}
        >
          {slugName}
        </Link>
      );
    }

    // Bold text **word**
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
  const [log, setLog] = useState<ChatMessage[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [savedLoc, setSavedLoc] = useState<UserSavedLocation | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [expandedTransitSteps, setExpandedTransitSteps] = useState<Record<string, boolean>>({});

  const endRef = useRef<HTMLDivElement>(null);

  // Sync saved user location
  useEffect(() => {
    const loc = getStoredUserLocation();
    if (loc) {
      setSavedLoc(loc);
      setUserLocation({ lat: loc.lat, lng: loc.lng });
    }

    const handleLocChanged = (e: any) => {
      const updated = e.detail || getStoredUserLocation();
      if (updated) {
        setSavedLoc(updated);
        setUserLocation({ lat: updated.lat, lng: updated.lng });
      }
    };

    window.addEventListener('explore-pune-location-changed', handleLocChanged);
    return () => window.removeEventListener('explore-pune-location-changed', handleLocChanged);
  }, []);

  // Initialize clean, welcoming greeting
  useEffect(() => {
    if (log.length === 0) {
      setLog([
        {
          id: 'welcome',
          role: 'bot',
          text: isMr
            ? 'नमस्कार! 🙏 मी तुमचा Explore Pune AI मार्गदर्शक (पुणे दर्शन मित्र) आहे. पुण्यातील गड-किल्ले, पेशवेकालीन वाडे, प्रसिद्ध मंदिरे, सार्वजनिक वाहतूक (मेट्रो व बस), किंवा सहल नियोजनाबद्दल काहीही विचारा!'
            : 'Namaste! 🙏 Welcome to Explore Pune AI guide. Ask me about historical forts, Peshwa palaces, temples, Pune Metro & PMPML bus routes, or custom itineraries!',
          suggestions: isMr
            ? ['माझ्या परिसराजवळील ठिकाणे', 'पुणे मेट्रो तिकीट कसे काढावे?', 'सिंहगड किल्ला कसा जावा?', '१ दिवसाची सहल आखा']
            : ['Places near my area', 'How to book Pune Metro ticket', 'How to reach Sinhagad Fort', 'Plan 1-day itinerary'],
        },
      ]);
    }
  }, [isMr, log.length]);

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

    const activeLoc =
      locationOverride ||
      (savedLoc ? { lat: savedLoc.lat, lng: savedLoc.lng } : userLocation);
    const msgId = Date.now().toString();

    // Append user message
    setLog((prev) => [...prev, { id: `u-${msgId}`, role: 'me', text: message }]);

    // Prepare multi-turn history
    const historyPayload = log
      .filter((m) => m.id !== 'welcome' && m.id !== 'cleared')
      .map((m) => ({
        role: m.role === 'me' ? ('user' as const) : ('model' as const),
        text: m.text,
      }))
      .slice(-6);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: historyPayload,
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
              ? 'माहिती मिळाली नाही, पुन्हा विचारून पहा.'
              : 'Could not fetch details. Please try asking again.'),
          places: data.places,
          transit: data.transit,
          isGemini: data.isGemini,
          model: data.model,
          suggestions: data.suggestions,
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
            : 'Connection failure. Please check your network and try again.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleClear() {
    setLog([
      {
        id: 'cleared',
        role: 'bot',
        text: isMr
          ? 'चॅट इतिहास साफ झाला आहे. आपण नवीन प्रश्न विचारू शकता! 🙏'
          : 'Chat history cleared. What would you like to explore in Pune?',
        suggestions: isMr
          ? ['माझ्या परिसराजवळील ठिकाणे', 'शनिवार वाडा', 'पुणे मेट्रो मार्ग', '१ दिवसाची सहल']
          : ['Places near my area', 'Shaniwar Wada', 'Pune Metro routes', '1-day itinerary'],
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

  function handleNearMeClick() {
    if (savedLoc) {
      const queryText = isMr
        ? `${savedLoc.nameMr} परिसरावरून सर्वात जवळची पुणे पर्यटन स्थळे कोणती आहेत?`
        : `What attractions are closest to my neighborhood (${savedLoc.nameEn})?`;
      send(queryText, { lat: savedLoc.lat, lng: savedLoc.lng });
      return;
    }
    setIsLocationModalOpen(true);
  }

  return (
    <>
      {/* Floating Action Button at Bottom Right */}
      <div className="chat-fab-container">
        <button
          className="chat-fab"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={open ? (isMr ? 'मार्गदर्शक बंद करा' : 'Close Guide') : (isMr ? 'पुणे AI मार्गदर्शक' : 'Open Pune AI Guide')}
        >
          <div className="chat-fab-pulse" />
          <span style={{ fontSize: 20 }}>🚩</span>
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>
            {open
              ? isMr
                ? 'बंद करा'
                : 'Close'
              : isMr
              ? 'पुणे AI मार्गदर्शक'
              : 'Ask Pune AI'}
          </span>
        </button>
      </div>

      {/* Interactive Chat Panel */}
      {open && (
        <section
          className={`chat-panel ${isExpanded ? 'expanded' : ''}`}
          aria-label="Explore Pune AI Assistant"
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{isMr ? 'Explore Pune AI' : 'Explore Pune AI Guide'}</span>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: 999,
                    letterSpacing: '0.03em',
                  }}
                >
                  ✨ Gemini
                </span>
              </div>

              {/* Locality Badge (Click to Change) */}
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  color: '#ffffff',
                  padding: '1px 8px',
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 3,
                }}
                title={isMr ? 'पुणे परिसर निवडा किंवा बदला' : 'Choose or change Pune locality'}
              >
                <span>📍</span>
                <span>
                  {savedLoc
                    ? isMr
                      ? savedLoc.nameMr
                      : savedLoc.nameEn
                    : isMr
                    ? 'परिसर निवडा'
                    : 'Choose Area'}
                </span>
                <span style={{ opacity: 0.8, fontSize: 9 }}>✏️</span>
              </button>
            </div>

            {/* Expand / Minimize Window */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Minimize' : 'Expand'}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
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
                background: 'rgba(255, 255, 255, 0.2)',
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
                background: 'rgba(255, 255, 255, 0.25)',
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
                <div className={`msg ${m.role}`}>
                  {renderMarkdownContent(m.text)}
                  {m.isGemini && (
                    <div
                      style={{
                        marginTop: 6,
                        paddingTop: 4,
                        borderTop: '1px dashed rgba(6, 95, 70, 0.2)',
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        opacity: 0.85,
                      }}
                    >
                      <span>✨</span>
                      <span>Explore Pune Gemini AI</span>
                    </div>
                  )}
                </div>

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
                        <span>🚇</span> {isMr ? 'सार्वजनिक वाहतूक मार्ग' : 'Public Transit Guide'}
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
                              background: m.transit.nearestMetro.lineColor || '#7c3aed',
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
                          🚶 {m.transit.nearestMetro.distanceKm} km (~{m.transit.nearestMetro.walkingMinutes} {isMr ? 'मिनिटे पायी' : 'min walk'})
                        </div>
                      </div>
                    )}

                    {/* Nearest Bus Stop */}
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
                          🚌 {isMr ? 'बस क्र.:' : 'Routes:'} <strong>{m.transit.nearestBus.routeNumbers.join(', ')}</strong>
                        </div>
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

                {/* Structured Place Cards */}
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
                              {verified ? (isMr ? 'तपासलेले' : 'Verified') : (isMr ? 'सार्वजनिक' : 'Public')}
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
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--clay)' }}>
                              {price
                                ? price.is_free
                                  ? isMr ? 'मोफत प्रवेश' : 'Free Entry'
                                  : `₹${price.amount}`
                                : isMr ? 'प्रवेश शुल्क' : 'Admission'}
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
                                🚌 {isMr ? 'मार्ग' : 'Transit'}
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

                {/* Contextual Suggestion Chips */}
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

            {/* Thinking / Streaming Indicator */}
            {busy && (
              <div className="msg bot" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {isMr ? 'पुणे माहिती तपासत आहे' : 'Consulting Pune records'}
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

          {/* Clean Input Form with Location Action */}
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <button
              type="button"
              onClick={handleNearMeClick}
              style={{
                background: '#ecfdf5',
                border: '1px solid #10b981',
                color: '#065f46',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              title={isMr ? 'माझ्या परिसराजवळील ठिकाणे' : 'Find places near my area'}
            >
              📍
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              placeholder={
                isMr
                  ? 'पुण्यातील ठिकाण, मेट्रो, बस किंवा सहलीबद्दल विचारा...'
                  : 'Ask about Pune places, metro, buses, or itineraries...'
              }
              aria-label={isMr ? 'तुमचा प्रश्न' : 'Your question'}
              style={{ flex: 1 }}
            />

            <button
              className="btn"
              disabled={busy || !input.trim()}
              style={{ padding: '8px 16px', fontSize: 13, flexShrink: 0 }}
            >
              {isMr ? 'विचारा' : 'Send'}
            </button>
          </form>
        </section>
      )}

      {/* Pune Locality Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelected={(loc) => {
          setSavedLoc(loc);
          setUserLocation({ lat: loc.lat, lng: loc.lng });
          send(
            isMr
              ? `${loc.nameMr} परिसरावरून सर्वात जवळची पुणे पर्यटन स्थळे कोणती आहेत?`
              : `What attractions are closest to my neighborhood (${loc.nameEn})?`,
            { lat: loc.lat, lng: loc.lng }
          );
        }}
      />
    </>
  );
}

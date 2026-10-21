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
  isGemini?: boolean;
  model?: string;
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
  const [savedLoc, setSavedLoc] = useState<UserSavedLocation | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [expandedTransitSteps, setExpandedTransitSteps] = useState<Record<string, boolean>>({});

  // Gemini API key support (stored in localStorage)
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>('');
  const [keyNotice, setKeyNotice] = useState<string>('');

  const endRef = useRef<HTMLDivElement>(null);

  // Load stored location and Gemini API key
  useEffect(() => {
    const loc = getStoredUserLocation();
    if (loc) {
      setSavedLoc(loc);
      setUserLocation({ lat: loc.lat, lng: loc.lng });
    }

    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('explore-pune-gemini-key') || '';
      if (storedKey) {
        setGeminiKey(storedKey);
        setKeyInput(storedKey);
      }
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

  // Initialize welcome message when language changes
  useEffect(() => {
    if (log.length === 0) {
      setLog([
        {
          id: 'welcome',
          role: 'bot',
          text: isMr
            ? 'नमस्कार! 🙏 मी तुमचा एक्सप्लोर पुणे (Explore Pune) डिजिटल मार्गदर्शक आहे. गुगल जेमिनी (Google Gemini AI) द्वारे समर्थित — पुण्यातील गड-किल्ले, वाडे, मंदिरे, सार्वजनिक वाहतूक (मेट्रो व बस), तिकीट दर किंवा सहलीबद्दल काहीही विचारा.'
            : 'Namaste! 🙏 I am your Explore Pune guide, powered by Google Gemini AI. Ask me anything about forts, wadas, temples, Pune Metro & PMPML buses, tickets, or travel itineraries.',
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

  const handleSaveGeminiKey = () => {
    const clean = keyInput.trim();
    if (clean) {
      localStorage.setItem('explore-pune-gemini-key', clean);
      setGeminiKey(clean);
      setKeyNotice(isMr ? '✓ जेमिनी की यशस्वीरित्या जोडली!' : '✓ Gemini API Key saved successfully!');
    } else {
      localStorage.removeItem('explore-pune-gemini-key');
      setGeminiKey('');
      setKeyNotice(isMr ? '✓ डीफॉल्ट सर्व्हर मोड सेट केला.' : '✓ Set to default server mode.');
    }
    setTimeout(() => {
      setKeyNotice('');
      setShowKeyModal(false);
    }, 1200);
  };

  async function send(text: string, locationOverride?: { lat: number; lng: number }) {
    const message = text.trim();
    if (!message || busy) return;

    setInput('');
    setBusy(true);
    setShowTeaser(false);

    const activeLoc =
      locationOverride ||
      (savedLoc ? { lat: savedLoc.lat, lng: savedLoc.lng } : userLocation);
    const msgId = Date.now().toString();

    // Append user message
    setLog((prev) => [...prev, { id: `u-${msgId}`, role: 'me', text: message }]);

    // Prepare multi-turn history (up to last 6 turns)
    const historyPayload = log
      .filter((m) => m.id !== 'welcome' && m.id !== 'cleared')
      .map((m) => ({
        role: m.role === 'me' ? ('user' as const) : ('model' as const),
        text: m.text,
      }))
      .slice(-6);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (geminiKey) {
        headers['x-gemini-key'] = geminiKey;
      }

      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          history: historyPayload,
          lang,
          userLocation: activeLoc || undefined,
          apiKey: geminiKey || undefined,
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
          isGemini: data.isGemini,
          model: data.model,
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
    if (savedLoc) {
      const queryText = isMr
        ? `${savedLoc.nameMr} परिसरावरून सर्वात जवळची पुणे पर्यटन स्थळे कोणती आहेत?`
        : `What attractions are closest to my neighborhood (${savedLoc.nameEn})?`;
      send(queryText, { lat: savedLoc.lat, lng: savedLoc.lng });
      return;
    }
    setIsLocationModalOpen(true);
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{isMr ? 'एक्सप्लोर पुणे AI मार्गदर्शक' : 'Explore Pune AI Guide'}</span>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(true)}
                  style={{
                    background: geminiKey
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    letterSpacing: '0.04em',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                  title={isMr ? 'गुगल जेमिनी AI सेटिंग्ज' : 'Configure Google Gemini AI Key'}
                >
                  <span>✨</span>
                  <span>{geminiKey ? 'Gemini Active' : 'Gemini AI'}</span>
                </button>
              </div>
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.95,
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  style={{
                    background: 'rgba(255,255,255,0.22)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    color: '#ffffff',
                    padding: '1px 8px',
                    borderRadius: '999px',
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  title={isMr ? 'पुणे परिसर बदला किंवा अचूक GPS वापरा' : 'Change Pune locality or use smart GPS'}
                >
                  <span>📍</span>
                  <span>
                    {savedLoc
                      ? isMr
                        ? savedLoc.nameMr
                        : savedLoc.nameEn
                      : userLocation
                      ? 'GPS'
                      : isMr
                      ? 'परिसर निवडा'
                      : 'Choose Area'}
                  </span>
                  <span style={{ opacity: 0.8, fontSize: 9 }}>✏️</span>
                </button>
                <span style={{ opacity: 0.85, fontSize: 10.5 }}>
                  {isMr ? 'मेट्रो, बस व पर्यटन' : 'Transit & Guide'}
                </span>
              </div>
            </div>

            {/* Configure Gemini Key */}
            <button
              onClick={() => setShowKeyModal(!showKeyModal)}
              title={isMr ? 'जेमिनी AI की सेट करा' : 'Configure Gemini API Key'}
              style={{
                background: geminiKey ? '#059669' : 'rgba(255,255,255,0.2)',
                border: 0,
                color: '#fff',
                padding: '4px 7px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: 10.5,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <span>🔑</span>
              <span>{geminiKey ? 'Key ✓' : 'Key'}</span>
            </button>

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

          {/* Gemini AI Key Settings Overlay */}
          {showKeyModal && (
            <div
              style={{
                background: '#f8fafc',
                borderBottom: '2px solid #10b981',
                padding: '12px 14px',
                color: '#0f172a',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 13, color: '#065f46', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>✨</span> {isMr ? 'गुगल जेमिनी AI की (Google Gemini Key)' : 'Google Gemini AI Key'}
                </strong>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#64748b' }}
                >
                  ✕
                </button>
              </div>
              <p style={{ fontSize: 11.5, color: '#475569', margin: '0 0 8px', lineHeight: 1.4 }}>
                {isMr
                  ? 'अमर्याद व जलद AI संभाषणासाठी तुमची मोफत Google AI Studio API Key येथे पेस्ट करा (ती तुमच्या ब्राउझरमध्ये सुरक्षित सेव्ह राहील).'
                  : 'For unlimited, instant Gemini conversations, paste your free Google AI Studio API Key below (stored securely in your local browser).'}
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={isMr ? 'उदा. AIzaSy...' : 'Paste AIzaSy... key'}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveGeminiKey}
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  {isMr ? 'सेव्ह करा' : 'Save'}
                </button>
              </div>
              {keyNotice && (
                <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 600, marginTop: 6 }}>
                  {keyNotice}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 11 }}>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline' }}
                >
                  🔑 {isMr ? 'मोफत जेमिनी की मिळवा (Google AI Studio)' : 'Get free Gemini API Key →'}
                </a>
                {geminiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setKeyInput('');
                      localStorage.removeItem('explore-pune-gemini-key');
                      setGeminiKey('');
                      setKeyNotice(isMr ? 'डीफॉल्ट मोड' : 'Reset to default');
                      setTimeout(() => setKeyNotice(''), 1500);
                    }}
                    style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11, cursor: 'pointer' }}
                  >
                    {isMr ? 'काढून टाका' : 'Remove Key'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Messages Log */}
          <div className="chat-log" aria-live="polite">
            {log.map((m) => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className={`msg ${m.role}`}>
                  {formatMarkdownLinks(m.text)}
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
                      <span>Google Gemini AI</span>
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

      {/* Global Location & GPS Picker Modal */}
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

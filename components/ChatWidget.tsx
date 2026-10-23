'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LocationPickerModal from '@/components/LocationPickerModal';
import { getStoredUserLocation, UserSavedLocation } from '@/lib/userLocation';
import { resolveLocalKnowledge, StructuredPlace } from '@/lib/chatKnowledgeEngine';
import { openDirectionsModal } from '@/lib/navigationService';

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
  places?: StructuredPlace[] | any[];
  transit?: TransitData;
  suggestions?: string[];
  planPayload?: {
    hours: number;
    title: string;
    slugs: string[];
  };
  isGemini?: boolean;
  model?: string;
  isStreaming?: boolean;
  isError?: boolean;
}

// In-memory session cache for fast repeated queries (Requirement 19)
const queryCache = new Map<string, any>();

/**
 * Parses markdown bold (**text**), markdown links [Label](url), and raw paths (/places/slug) into React elements.
 */
function renderMarkdownContent(text: string) {
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
  const router = useRouter();
  const { lang, isMr, t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [log, setLog] = useState<ChatMessage[]>([]);

  // Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [savedLoc, setSavedLoc] = useState<UserSavedLocation | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Interaction & UI helpers
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showNewMessagePill, setShowNewMessagePill] = useState(false);
  const [lastReferencedSlug, setLastReferencedSlug] = useState<string | null>(null);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const [mobileKeyboardHeight, setMobileKeyboardHeight] = useState(0);

  const endRef = useRef<HTMLDivElement>(null);
  const chatLogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Default welcoming message
  const initWelcome = useCallback(() => {
    setLog([
      {
        id: 'welcome',
        role: 'bot',
        text: isMr
          ? 'नमस्कार! 🙏 मी तुमचा Explore Pune Travel Assistant (पुणे दर्शन मित्र) आहे. पुण्यातील गड-किल्ले, ऐतिहासिक वाडे, मंदिरे, सार्वजनिक वाहतूक (मेट्रो व बस वेळापत्रक), किंवा सहल नियोजनात मी त्वरित मदत करू शकतो!'
          : 'Namaste! 🙏 Welcome to Explore Pune Travel Assistant. Ask me about historical forts, Peshwa palaces, sacred temples, Pune Metro & PMPML bus routes, or custom itineraries!',
        suggestions: isMr
          ? ['🏰 सर्वोत्तम किल्ले', '🏛️ ऐतिहासिक वास्तू', '🛕 प्रसिद्ध मंदिरे', '🌿 निसर्गरम्य ठिकाणे', '🗺️ सहल नियोजन (४ तास)', '📍 माझ्याजवळील ठिकाणे']
          : ['🏰 Best Forts', '🏛️ Heritage Places', '🛕 Religious Places', '🌿 Nature Spots', '🗺️ Plan 4-Hour Trip', '📍 Places Near Me'],
      },
    ]);
  }, [isMr]);

  // Restore conversation from sessionStorage on mount (Requirement 15)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('explore_pune_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLog(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('SessionStorage read error:', e);
    }
    initWelcome();
  }, [initWelcome]);

  // Persist conversation to sessionStorage on update
  useEffect(() => {
    if (log.length > 0) {
      try {
        sessionStorage.setItem('explore_pune_chat_history', JSON.stringify(log));
      } catch (e) {
        console.warn('SessionStorage write error:', e);
      }
    }
  }, [log]);

  // Sync user saved locality
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

  // Instant open & input auto-focus (Requirement 2)
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        endRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 40);
    }
  }, [open]);

  // Mobile Keyboard & VisualViewport resize handling (Requirement 11 & 12)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleViewportChange = () => {
      if (!window.visualViewport) return;
      if (window.innerWidth <= 768) {
        const vpHeight = window.visualViewport.height;
        const offsetTop = window.visualViewport.offsetTop;
        const winHeight = window.innerHeight;
        const kbHeight = Math.max(0, winHeight - vpHeight - offsetTop);
        setMobileKeyboardHeight(kbHeight);

        if (kbHeight > 60) {
          setTimeout(() => {
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 80);
        }
      } else {
        setMobileKeyboardHeight(0);
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  // Lock background scroll on mobile when chat is open (Requirement 12)
  useEffect(() => {
    if (open && window.innerWidth <= 768) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [open]);

  // Smart auto-scroll observer (Requirement 14)
  const handleChatLogScroll = () => {
    if (!chatLogRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatLogRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 110;
    setIsNearBottom(nearBottom);
    if (nearBottom) {
      setShowNewMessagePill(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    if (isNearBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      setShowNewMessagePill(false);
    } else if (log.length > 1) {
      setShowNewMessagePill(true);
    }
  }, [log, isNearBottom, open]);

  // Speech synthesis audio listener
  function handleSpeak(id: string, text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    setSpeakingId(id);
    const cleanText = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_#`]/g, '')
      .replace(/[\n\r]+/g, ' ')
      .trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isMr ? 'mr-IN' : 'en-IN';
    utterance.rate = isMr ? 0.92 : 0.96;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  }

  // Progressive streaming text helper (Requirement 3)
  const streamTextIntoMessage = (
    msgId: string,
    fullText: string,
    onComplete: () => void
  ) => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    const words = fullText.split(' ');
    let wordIndex = 0;
    let accumulated = '';

    streamIntervalRef.current = setInterval(() => {
      // Chunk 2-3 words per tick (~20ms per tick => ~30-45 words/second)
      const chunk = words.slice(wordIndex, wordIndex + 3).join(' ');
      accumulated = accumulated ? `${accumulated} ${chunk}` : chunk;
      wordIndex += 3;

      setLog((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, text: accumulated, isStreaming: true } : m
        )
      );

      if (wordIndex >= words.length) {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        setLog((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, text: fullText, isStreaming: false } : m
          )
        );
        onComplete();
      }
    }, 20);
  };

  // Main Send Action
  async function send(text: string, locationOverride?: { lat: number; lng: number }) {
    const message = text.trim();
    if (!message || busy) return;

    // Abort previous in-flight request if user sends another question (Requirement 17)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    setInput('');
    setBusy(true);
    setLastFailedQuery(null);

    const activeLoc =
      locationOverride ||
      (savedLoc ? { lat: savedLoc.lat, lng: savedLoc.lng } : userLocation);
    const msgId = Date.now().toString();
    const botMsgId = `b-${msgId}`;

    // Append user message immediately
    setLog((prev) => [...prev, { id: `u-${msgId}`, role: 'me', text: message }]);

    // ------------------------------------------------------------------------
    // STAGE A: Check Lightweight Local Knowledge Layer first (Requirement 4 & 5)
    // ------------------------------------------------------------------------
    const localAnswer = resolveLocalKnowledge(message, {
      lastReferencedSlug,
      userLocation: activeLoc,
      userLocalityName: savedLoc?.nameEn,
      lang: isMr ? 'mr' : 'en',
    });

    if (localAnswer.handled) {
      // Create empty bot message shell
      setLog((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'bot',
          text: '',
          isStreaming: true,
        },
      ]);
      setBusy(false);

      // Stream local answer smoothly in real-time
      streamTextIntoMessage(botMsgId, localAnswer.reply, () => {
        // Attach cards, transit info, and suggestion chips after stream
        setLog((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  places: localAnswer.places,
                  transit: localAnswer.transit,
                  suggestions: localAnswer.suggestions,
                  planPayload: localAnswer.planPayload,
                  isStreaming: false,
                }
              : m
          )
        );
        if (localAnswer.places && localAnswer.places[0]?.slug) {
          setLastReferencedSlug(localAnswer.places[0].slug);
        }
      });
      return;
    }

    // ------------------------------------------------------------------------
    // STAGE B: Check In-Memory Query Cache (Requirement 19)
    // ------------------------------------------------------------------------
    const cacheKey = `${lang}_${message.toLowerCase()}`;
    const cachedData = queryCache.get(cacheKey);

    if (cachedData) {
      setLog((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'bot',
          text: '',
          isStreaming: true,
        },
      ]);
      setBusy(false);

      streamTextIntoMessage(botMsgId, cachedData.reply, () => {
        setLog((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  places: cachedData.places,
                  transit: cachedData.transit,
                  suggestions: cachedData.suggestions,
                  planPayload: cachedData.planPayload,
                  isGemini: cachedData.isGemini,
                  model: cachedData.model,
                  isStreaming: false,
                }
              : m
          )
        );
        if (cachedData.places && cachedData.places[0]?.slug) {
          setLastReferencedSlug(cachedData.places[0].slug);
        }
      });
      return;
    }

    // ------------------------------------------------------------------------
    // STAGE C: Call Backend API with Multi-Turn Context (Requirement 3 & 16)
    // ------------------------------------------------------------------------
    const historyPayload = log
      .filter((m) => m.id !== 'welcome' && !m.isError)
      .map((m) => ({
        role: m.role === 'me' ? ('user' as const) : ('model' as const),
        text: m.text,
      }))
      .slice(-6);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          message,
          history: historyPayload,
          lang,
          userLocation: activeLoc || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      const replyText =
        data.reply ||
        (isMr
          ? 'माहिती मिळाली नाही. कृपया पुन्हा विचारून पहा.'
          : 'Could not fetch details. Please try asking again.');

      // Save to cache
      queryCache.set(cacheKey, data);

      // Create placeholder and stream
      setLog((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'bot',
          text: '',
          isStreaming: true,
        },
      ]);
      setBusy(false);

      streamTextIntoMessage(botMsgId, replyText, () => {
        setLog((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  places: data.places,
                  transit: data.transit,
                  suggestions: data.suggestions,
                  planPayload: data.planPayload,
                  isGemini: data.isGemini,
                  model: data.model,
                  isStreaming: false,
                }
              : m
          )
        );
        if (data.places && data.places[0]?.slug) {
          setLastReferencedSlug(data.places[0].slug);
        }
      });
    } catch (err: any) {
      if (err.name === 'AbortError') return;

      setBusy(false);
      setLastFailedQuery(message);

      // Friendly Error handling without technical 500 dumps (Requirement 16)
      setLog((prev) => [
        ...prev,
        {
          id: `err-${msgId}`,
          role: 'bot',
          text: isMr
            ? 'माहिती मिळवण्यात अडचण येत आहे. कृपया पुन्हा प्रयत्न करा.'
            : "I'm having trouble responding right now. Please try again.",
          isError: true,
        },
      ]);
    }
  }

  // New Chat Handler (Requirement 15)
  function handleNewChat() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setBusy(false);
    setLastReferencedSlug(null);
    setLastFailedQuery(null);
    setShowNewMessagePill(false);
    try {
      sessionStorage.removeItem('explore_pune_chat_history');
    } catch {}
    initWelcome();
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  // Copy answer to clipboard
  function handleCopy(id: string, text: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  // Open Trip Planner from Chat (Requirement 9)
  function handleOpenInTripPlanner(plan: { hours: number; title: string; slugs: string[] }) {
    try {
      localStorage.setItem('pune_chat_draft_itinerary', JSON.stringify(plan));
    } catch {}
    router.push(`/planner?from=chat&hours=${plan.hours}&slugs=${plan.slugs.join(',')}`);
    setOpen(false);
  }

  // Quick Near-Me Trigger
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
      {/* Floating Action Button at Bottom Right (Requirement 11) */}
      <div className="chat-fab-container">
        <button
          className="chat-fab"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={
            open
              ? isMr
                ? 'Explore Pune सहाय्यक बंद करा'
                : 'Close Explore Pune Assistant'
              : isMr
              ? 'Explore Pune सहाय्यक उघडा'
              : 'Open Explore Pune Assistant'
          }
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

      {/* Interactive Chat Panel Shell (Requirement 2 & 11) */}
      {open && (
        <section
          className={`chat-panel ${isExpanded ? 'expanded' : ''}`}
          style={
            mobileKeyboardHeight > 0
              ? {
                  height: `calc(100dvh - ${mobileKeyboardHeight}px)`,
                  maxHeight: `calc(100dvh - ${mobileKeyboardHeight}px)`,
                }
              : undefined
          }
          aria-label="Explore Pune Travel Assistant"
          role="dialog"
          aria-modal="true"
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
                <span>{isMr ? 'Explore Pune AI' : 'Explore Pune Travel Assistant'}</span>
                <span className="chat-gemini-shimmer">
                  ⚡ Smart Concierge
                </span>
              </div>

              {/* Status and Locality Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: 9.5,
                    color: '#a7f3d0',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: '#34d399',
                      boxShadow: '0 0 5px #34d399',
                    }}
                  />
                  Live Guide
                </span>

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
            </div>

            {/* New Chat Button (Requirement 15) */}
            <button
              onClick={handleNewChat}
              title={isMr ? 'नवीन चॅट सुरू करा' : 'Start a new conversation'}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 0,
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>+</span>
              <span>{isMr ? 'नवीन' : 'New Chat'}</span>
            </button>

            {/* Expand / Minimize Window (Desktop) */}
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
              aria-label="Close Explore Pune Assistant"
            >
              ✕
            </button>
          </div>

          {/* Messages Log (Requirement 13 & 14) */}
          <div
            ref={chatLogRef}
            className="chat-log"
            onScroll={handleChatLogScroll}
            aria-live="polite"
          >
            {log.map((m) => (
              <div key={m.id} className="chat-msg-row">
                <div className={`msg ${m.role}`}>
                  {renderMarkdownContent(m.text)}

                  {/* AI Model Tag */}
                  {m.isGemini && (
                    <div
                      style={{
                        marginTop: 6,
                        paddingTop: 4,
                        borderTop: '1px dashed rgba(6, 95, 70, 0.2)',
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        opacity: 0.9,
                      }}
                    >
                      <span>✨</span>
                      <span>{m.model || 'Gemini 3.8'} • Explore Pune AI</span>
                    </div>
                  )}
                </div>

                {/* Welcome Initial Suggestion Chips (Requirement 8) */}
                {m.id === 'welcome' && (
                  <div className="chat-quick-starters">
                    {[
                      {
                        label: isMr ? '🏰 सर्वोत्तम किल्ले' : '🏰 Best Forts',
                        q: isMr ? 'पुण्यातील सर्वोत्तम किल्ले कोणते आहेत?' : 'What are the best forts to visit in Pune?',
                      },
                      {
                        label: isMr ? '🏛️ ऐतिहासिक वास्तू' : '🏛️ Heritage Places',
                        q: isMr ? 'पुण्यातील प्रसिद्ध ऐतिहासिक वास्तू सांगा' : 'Tell me about historic wadas and heritage in Pune',
                      },
                      {
                        label: isMr ? '🛕 प्रसिद्ध मंदिरे' : '🛕 Religious Places',
                        q: isMr ? 'पुण्यातील मानाची मंदिरे व गणपती देवस्थाने' : 'Famous temples and religious places in Pune',
                      },
                      {
                        label: isMr ? '🌿 निसर्गरम्य ठिकाणे' : '🌿 Nature Spots',
                        q: isMr ? 'पुण्यातील निसर्गरम्य टेकड्या व तलाव' : 'Scenic nature spots, tekdis and lakes in Pune',
                      },
                      {
                        label: isMr ? '🗺️ ४ तासांची सहल' : '🗺️ 4-Hour Tour',
                        q: isMr ? 'माझ्याकडे ४ तास आहेत, सहल आखा' : 'I have 4 hours in Pune, plan my trip',
                      },
                      {
                        label: isMr ? '📍 माझ्याजवळील ठिकाणे' : '📍 Nearby Places',
                        action: 'near_me',
                      },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (item.action === 'near_me') {
                            handleNearMeClick();
                          } else if (item.q) {
                            send(item.q);
                          }
                        }}
                        className="chat-starter-btn"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Trip Planning Integration Card (Requirement 9) */}
                {m.planPayload && (
                  <div className="chat-plan-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <strong style={{ color: '#065f46', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🗺️</span> {m.planPayload.title}
                      </strong>
                      <span style={{ fontSize: 11, background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                        {m.planPayload.hours} {isMr ? 'तास' : 'Hours'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
                      {isMr
                        ? 'हा सहल मार्ग थेट आमच्या सहल नियोजक (Trip Planner) मध्ये उघडून लाइव्ह वेळापत्रक व मार्ग पहा.'
                        : 'Open this suggested route in the interactive Trip Planner with live Metro and PMPML transit schedules.'}
                    </p>
                    <button
                      type="button"
                      className="chat-plan-btn"
                      onClick={() => handleOpenInTripPlanner(m.planPayload!)}
                    >
                      <span>🗺️</span>
                      <span>{isMr ? 'हा मार्ग सहल नियोजकात उघडा →' : 'Plan this trip →'}</span>
                    </button>
                  </div>
                )}

                {/* Structured Place Cards (Requirement 10) */}
                {m.places && m.places.length > 0 && (
                  <div style={{ display: 'grid', gap: 8, marginTop: 4, maxWidth: '98%' }}>
                    {m.places.map((p) => {
                      const verified = p.data_tier === 'verified' || p.verification?.status === 'verified';
                      const feeStatus =
                        p.fee_status === 'free' || p.entry_fee === 0
                          ? isMr ? 'मोफत प्रवेश (₹0)' : 'Free Entry (₹0)'
                          : p.entry_fee ? `₹${p.entry_fee}` : isMr ? 'सार्वजनिक दर' : 'Regular Admission';
                      const durationMin = p.recommended_duration_minutes || 60;
                      const durationText = `~${Math.round(durationMin / 60 * 10) / 10} hr visit`;

                      return (
                        <div key={p.id || p.slug} className="chat-place-card">
                          <div className="chat-place-header-row">
                            <img
                              src={p.image_url || '/images/places/shaniwar-wada.jpg'}
                              alt={p.name}
                              className="chat-place-thumbnail"
                              loading="lazy"
                            />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                                <strong style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.3 }}>
                                  {isMr && p.name_mr ? p.name_mr : p.name}
                                </strong>
                                <span
                                  className={`tier ${verified ? 'verified' : ''}`}
                                  style={{ fontSize: 9, padding: '2px 6px', flexShrink: 0 }}
                                >
                                  {verified ? (isMr ? 'तपासलेले' : 'Verified') : (isMr ? 'सार्वजनिक' : 'Public')}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 11, color: 'var(--clay)', fontWeight: 700 }}>
                                  {feeStatus}
                                </span>
                                <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                                  • ⏳ {durationText}
                                </span>
                              </div>
                            </div>
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
                              gap: 6,
                              marginTop: 2,
                              paddingTop: 6,
                              borderTop: '1px solid var(--line)',
                              flexWrap: 'wrap',
                            }}
                          >
                            <Link
                              href={`/places/${p.slug}`}
                              className="btn outline"
                              style={{ padding: '4px 8px', fontSize: 11, textDecoration: 'none' }}
                            >
                              {isMr ? 'तपशील' : 'Details'}
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                openDirectionsModal({
                                  id: p.id,
                                  name: p.name,
                                  nameMr: p.name_mr,
                                  latitude: p.latitude,
                                  longitude: p.longitude,
                                  address: p.address,
                                  slug: p.slug,
                                  imageUrl: p.image_url,
                                })
                              }
                              className="btn outline"
                              style={{
                                padding: '4px 8px',
                                fontSize: 11,
                                borderColor: '#10b981',
                                color: '#065f46',
                                background: '#ecfdf5',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                              title={isMr ? `${p.name_mr || p.name} चा थेट मार्ग मिळवा` : `Get directions to ${p.name}`}
                            >
                              📍 {isMr ? 'मार्ग मिळवा' : 'Directions'}
                            </button>

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
                              🚌 {isMr ? 'वाहतूक' : 'Transit'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Structured Public Transit Route Card */}
                {m.transit && (
                  <div className="chat-transit-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <strong style={{ color: '#065f46', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🚇</span> {isMr ? 'सार्वजनिक वाहतूक मार्ग' : 'Public Transit Route'}
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
                      <div style={{ background: '#ffffff', border: '1px solid #d1fae5', borderRadius: 8, padding: '8px 10px', fontSize: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ background: m.transit.nearestMetro.lineColor || '#7c3aed', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>
                            Metro
                          </span>
                          <strong>{isMr ? m.transit.nearestMetro.stationNameMr : m.transit.nearestMetro.stationNameEn}</strong>
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: 11 }}>
                          🚶 {m.transit.nearestMetro.distanceKm} km (~{m.transit.nearestMetro.walkingMinutes} {isMr ? 'मिनिटे पायी' : 'min walk'})
                        </div>
                      </div>
                    )}

                    {/* Nearest Bus Stop */}
                    {m.transit.nearestBus && (
                      <div style={{ background: '#ffffff', border: '1px solid #d1fae5', borderRadius: 8, padding: '8px 10px', fontSize: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ background: '#f97316', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>
                            PMPML
                          </span>
                          <strong>{isMr ? m.transit.nearestBus.stopNameMr : m.transit.nearestBus.stopNameEn}</strong>
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: 11 }}>
                          🚌 {isMr ? 'बस क्र.:' : 'Routes:'} <strong>{m.transit.nearestBus.routeNumbers.join(', ')}</strong>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp Ticket & Planner Links */}
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

                {/* Friendly Error Card with Try Again button (Requirement 16) */}
                {m.isError && lastFailedQuery && (
                  <div className="chat-error-card">
                    <span>⚠️ {m.text}</span>
                    <div>
                      <button
                        type="button"
                        onClick={() => send(lastFailedQuery)}
                        className="btn outline"
                        style={{ padding: '4px 12px', fontSize: 11.5, background: '#ffffff' }}
                      >
                        🔄 {isMr ? 'पुन्हा प्रयत्न करा' : 'Try Again'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Actions (Listen, Copy, Feedback) */}
                {m.role === 'bot' && !m.isError && (
                  <div className="msg-actions">
                    <button
                      type="button"
                      className="msg-action-btn"
                      onClick={() => handleSpeak(m.id, m.text)}
                      title={isMr ? (speakingId === m.id ? 'आवाज थांबवा' : 'ऐका (मराठी आवाज)') : (speakingId === m.id ? 'Stop audio' : 'Listen aloud')}
                      style={{
                        color: speakingId === m.id ? '#c2410c' : 'var(--muted)',
                        fontWeight: speakingId === m.id ? 700 : 400,
                      }}
                    >
                      <span>{speakingId === m.id ? '⏹' : '🔊'}</span>
                      <span>{speakingId === m.id ? (isMr ? 'थांबवा' : 'Stop') : (isMr ? 'ऐका' : 'Listen')}</span>
                    </button>

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
                        onClick={() => setFeedback((prev) => ({ ...prev, [m.id]: 'up' }))}
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
                        onClick={() => setFeedback((prev) => ({ ...prev, [m.id]: 'down' }))}
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

                {/* Contextual Suggestion Chips (Requirement 8) */}
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

            {/* Thinking Indicator (Requirement 3) */}
            {busy && (
              <div className="msg bot" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="chat-gemini-shimmer" style={{ fontSize: 10.5 }}>
                  ⚡ AI
                </span>
                <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
                  {isMr ? 'पुणे पर्यटन डेटा तपासत आहे...' : 'Analyzing Pune places & transit records...'}
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

          {/* Floating '↓ New response' button if scrolled up (Requirement 14) */}
          {showNewMessagePill && (
            <button
              type="button"
              className="chat-new-msg-pill"
              onClick={() => {
                endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                setShowNewMessagePill(false);
              }}
            >
              <span>↓</span>
              <span>{isMr ? 'नवीन संदेश' : 'New response'}</span>
            </button>
          )}

          {/* Clean Input Form with Location Action (Requirement 11, 12, 20) */}
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
              aria-label={isMr ? 'माझ्या परिसराजवळील ठिकाणे' : 'Find places near my area'}
            >
              📍
            </button>

            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              maxLength={1000}
              placeholder={
                isMr
                  ? 'पुण्यातील ठिकाण, किल्ले, मेट्रो, वेळ किंवा सहलीबद्दल विचारा...'
                  : 'Ask about Pune places, forts, metro, timings, or itineraries...'
              }
              aria-label={isMr ? 'तुमचा प्रश्न' : 'Your question'}
              style={{ flex: 1 }}
            />

            <button
              type="submit"
              className="btn"
              disabled={busy || !input.trim()}
              style={{
                padding: '10px 18px',
                fontSize: 13.5,
                fontWeight: 700,
                flexShrink: 0,
                borderRadius: 12,
                background:
                  busy || !input.trim()
                    ? '#e2e8f0'
                    : 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                color: busy || !input.trim() ? '#94a3b8' : '#ffffff',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: busy || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{isMr ? 'विचारा' : 'Send'}</span>
              <span>➤</span>
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

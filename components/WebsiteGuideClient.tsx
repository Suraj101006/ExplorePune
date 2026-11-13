'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Compass,
  MapPin,
  Route,
  Bus,
  Sparkles,
  Footprints,
  Award,
  ShieldAlert,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Square,
  Share2,
  ExternalLink,
  Printer,
  Search,
  Download,
  Check,
  AlertTriangle,
  Clock,
  RotateCcw,
  Menu,
  X,
  Layers,
  Calendar,
  Smartphone,
  Navigation,
  FileText,
  Star,
  Zap,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { useLanguage } from '@/lib/LanguageContext';
import AchievementBadgeMedal from '@/components/AchievementBadgeMedal';

// Table of Contents Metadata
export interface GuideChapterMeta {
  id: number;
  slug: string;
  number: string;
  titleEn: string;
  titleMr: string;
  subtitleEn: string;
  subtitleMr: string;
  readTime: string;
  icon: string;
  badge: string;
  coverImage: string;
}

export const GUIDE_CHAPTERS: GuideChapterMeta[] = [
  {
    id: 1,
    slug: 'welcome',
    number: '01',
    titleEn: 'Welcome to Explore Pune',
    titleMr: 'एक्सप्लोर पुणे मध्ये आपले स्वागत',
    subtitleEn: 'The Philosophy, 106-Place Master Registry & Architecture',
    subtitleMr: 'संकल्पना, १०६ अधिकृत ठिकाणे आणि पुणे वारसा मार्गदर्शक',
    readTime: '2 min',
    icon: '🏛️',
    badge: 'Foundation',
    coverImage: '/images/places/shaniwar-wada.jpg',
  },
  {
    id: 2,
    slug: 'discover',
    number: '02',
    titleEn: 'Discovering Pune',
    titleMr: 'पुणे दर्शन व शोध पद्धत',
    subtitleEn: 'Bilingual Fuzzy Search, Category Navigation & Localities',
    subtitleMr: 'द्विभाषिक शोध, ७ प्रमुख श्रेणी आणि स्थानिक परिसर निवड',
    readTime: '2 min',
    icon: '🧭',
    badge: 'Directory',
    coverImage: '/images/places/aga-khan-palace.jpg',
  },
  {
    id: 3,
    slug: 'destination-details',
    number: '03',
    titleEn: 'Destination Details & Intelligence',
    titleMr: 'ठिकाणाचे सखोल तपशील व पडताळणी',
    subtitleEn: 'Operating Status, Verified Fees, Hours & Photo Slideshows',
    subtitleMr: 'चालू-बंद स्थिती, अधिकृत दरपत्रक, वेळा व छायाचित्रे',
    readTime: '3 min',
    icon: '📋',
    badge: 'Verified Intel',
    coverImage: '/images/places/sinhagad-fort.jpg',
  },
  {
    id: 4,
    slug: 'smart-trip-planner',
    number: '04',
    titleEn: 'Smart AI Trip Planner',
    titleMr: 'स्मार्ट सहल नियोजन प्रणाली',
    subtitleEn: 'Time-Optimized Routing, Transit Sequencing & PDF Export',
    subtitleMr: 'वेळेनुसार अचूक मार्ग आखणी, बस-मेट्रो जोडणी व PDF',
    readTime: '3 min',
    icon: '🗺️',
    badge: 'AI Engine',
    coverImage: '/images/places/lal-mahal.jpg',
  },
  {
    id: 5,
    slug: 'travel-and-transport',
    number: '05',
    titleEn: 'Public Transit & Commuting',
    titleMr: 'सार्वजनिक वाहतूक: मेट्रो व पीएमपीएमएल',
    subtitleEn: 'Metro Lines 1 & 2, District Court Interchange & ₹70 Pass',
    subtitleMr: 'मेट्रो मार्ग, सिव्हिल कोर्ट इंटरचेंज आणि ₹७० डेली पास',
    readTime: '2 min',
    icon: '🚇',
    badge: 'Transit',
    coverImage: '/images/places/fc-road.jpg',
  },
  {
    id: 6,
    slug: 'ai-travel-assistant',
    number: '06',
    titleEn: 'AI Travel Assistant (Puneri Bot)',
    titleMr: 'एआय ट्रॅव्हल असिस्टंट (पुणेरी मार्गदर्शक)',
    subtitleEn: 'Strict Anti-Hallucination, Natural Prompts & Edge Intel',
    subtitleMr: 'स्थानिक अचूक उत्तरे, मराठी-इंग्रजी संभाषण व त्वरित सल्ला',
    readTime: '2 min',
    icon: '⚡',
    badge: 'AI Assistant',
    coverImage: '/images/places/pataleshwar-cave-temple.jpg',
  },
  {
    id: 7,
    slug: 'my-journey',
    number: '07',
    titleEn: 'My Journey & Cinematic Reels',
    titleMr: 'माझी सफर व सिनेमॅटिक रील्स',
    subtitleEn: 'Tracking Visits, Logging Memories & 106-Template Video Engine',
    subtitleMr: 'भेट दिलेल्या ठिकाणांची नोंद, आठवणी आणि ५-अंकी रील्स',
    readTime: '3 min',
    icon: '🎬',
    badge: 'Memories',
    coverImage: '/images/places/rajgad-fort.jpg',
  },
  {
    id: 8,
    slug: 'profile-and-achievements',
    number: '08',
    titleEn: 'Milestones & Achievement Medals',
    titleMr: 'माईलस्टोन्स व सन्मान पदके',
    subtitleEn: 'Historical Mastery Medals, Ranks & 1080x1080 Share Cards',
    subtitleMr: 'इतिहासकार पदके, श्रेणी आणि इन्स्टाग्राम शेअर कार्ड्स',
    readTime: '2 min',
    icon: '🏅',
    badge: 'Gamification',
    coverImage: '/images/places/shinde-chhatri.jpg',
  },
  {
    id: 9,
    slug: 'safety-and-travel-updates',
    number: '09',
    titleEn: 'Safety Alerts & Forest Regulations',
    titleMr: 'सुरक्षा सतर्कता व वनविभाग नियम',
    subtitleEn: 'Monsoon Curfews, Ghat Road Advisories & Emergency Helplines',
    subtitleMr: 'पावसाळी निर्बंध, घाट रस्ता सतर्कता आणि आपत्कालीन संपर्क',
    readTime: '2 min',
    icon: '🛡️',
    badge: 'Safety',
    coverImage: '/images/places/torna-fort.jpg',
  },
  {
    id: 10,
    slug: 'tips-troubleshooting',
    number: '10',
    titleEn: 'Pro Tips, PWA & Traveler Checklist',
    titleMr: 'महत्त्वाच्या टिप्स, ऑफलाइन ॲप व चेकलिस्ट',
    subtitleEn: 'Offline PWA, Dark Mode, Keyboard Shortcuts & Packing List',
    subtitleMr: 'ऑफलाइन सुविधा, डार्क मोड, शॉर्टकट व सहल पूर्वतयारी',
    readTime: '3 min',
    icon: '🎒',
    badge: 'Handbook',
    coverImage: '/images/places/okayama-friendship-garden.jpg',
  },
];

// Interactive Checklist default items
const DEFAULT_PREP_CHECKLIST = [
  { id: 'c1', textEn: 'Save offline PDF of your planned itinerary via /planner', textMr: 'सहल आराखड्याची PDF डाऊनलोड करून ऑफलाइन सेव्ह करा', checked: true },
  { id: 'c2', textEn: 'Check Sinhagad & fort weather / road advisories before leaving', textMr: 'किल्ल्यांवर जाण्यापूर्वी हवामान व घाट रस्त्याचे अपडेट्स तपासा', checked: true },
  { id: 'c3', textEn: 'Purchase PMPML ₹70 Day Pass for unlimited city bus travel', textMr: 'अमर्याद प्रवासासाठी पीएमपीएमएलचा ₹७० चा डे पास घ्या', checked: false },
  { id: 'c4', textEn: 'Carry valid Govt Photo ID for ASI monument entry (Aga Khan Palace, Shaniwar Wada)', textMr: 'एएसआय स्मारकांसाठी शासकीय ओळखपत्र (आधार/पॅन) सोबत ठेवा', checked: true },
  { id: 'c5', textEn: 'Wear sturdy grip shoes for rock-cut steps at Sinhagad, Rajgad or Karla', textMr: 'किल्ल्यांच्या कातळ पायऱ्यांसाठी चांगली ग्रिप असलेले ट्रेकिंग शूज वापरा', checked: false },
  { id: 'c6', textEn: 'Enable GPS location on Explore Pune for real-time proximity calculations', textMr: 'अचूक अंतर व मार्गदर्शनासाठी ब्राउझरचे जीपीएस लोकेशन सुरू करा', checked: true },
  { id: 'c7', textEn: 'Install Explore Pune as PWA on your home screen for quick offline launch', textMr: 'जलद वापरासाठी एक्सप्लोर पुणे ॲप होम स्क्रीनवर सेव्ह (PWA) करा', checked: false },
];

export default function WebsiteGuideClient() {
  const { isMr: globalIsMr } = useLanguage();
  const [activeLang, setActiveLang] = useState<'en' | 'mr'>(globalIsMr ? 'mr' : 'en');
  const isMr = activeLang === 'mr';

  // Navigation State
  // 0 = Handbook Cover, 1..10 = Chapters 1..10
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [guideSearchQuery, setGuideSearchQuery] = useState<string>('');
  const [checklist, setChecklist] = useState(DEFAULT_PREP_CHECKLIST);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // Demo Interactive States inside chapters
  const [demoSelectedCategory, setDemoSelectedCategory] = useState<string>('forts');
  const [demoActiveStopIndex, setDemoActiveStopIndex] = useState<number>(0);

  const notebookRef = useRef<HTMLDivElement>(null);

  // Load checklist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('explore_pune_guide_checklist_v1');
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
      try {
        localStorage.setItem('explore_pune_guide_checklist_v1', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Keyboard navigation: Left/Right arrows to flip chapters
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;
      if (e.key === 'ArrowRight' && currentChapter < 10) {
        setCurrentChapter((prev) => prev + 1);
        notebookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (e.key === 'ArrowLeft' && currentChapter > 0) {
        setCurrentChapter((prev) => prev - 1);
        notebookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter]);

  // Handle Chapter Change with smooth scroll
  const goToChapter = (num: number) => {
    setCurrentChapter(num);
    setIsTocOpen(false);
    notebookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(text);
    setTimeout(() => setCopiedPrompt(null), 2500);
  };

  // Reading progress %
  const progressPercent = useMemo(() => {
    if (currentChapter === 0) return 5;
    return Math.round((currentChapter / 10) * 100);
  }, [currentChapter]);

  // Filtered Chapters based on guideSearchQuery
  const filteredChapters = useMemo(() => {
    if (!guideSearchQuery.trim()) return GUIDE_CHAPTERS;
    const q = guideSearchQuery.toLowerCase();
    return GUIDE_CHAPTERS.filter(
      (c) =>
        c.titleEn.toLowerCase().includes(q) ||
        c.titleMr.toLowerCase().includes(q) ||
        c.subtitleEn.toLowerCase().includes(q) ||
        c.subtitleMr.toLowerCase().includes(q) ||
        c.number.includes(q)
    );
  }, [guideSearchQuery]);

  const activeChapterData = useMemo(() => {
    if (currentChapter === 0) return null;
    return GUIDE_CHAPTERS.find((c) => c.id === currentChapter) || GUIDE_CHAPTERS[0];
  }, [currentChapter]);

  return (
    <div
      ref={notebookRef}
      className="website-guide-wrapper"
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        paddingTop: 24,
        paddingBottom: 80,
      }}
    >
      {/* 1. TOP PROGRESS & BREADCRUMB BAR */}
      <div
        className="wrap"
        style={{
          maxWidth: 1180,
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/"
            className="chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              background: 'var(--card)',
              border: '1px solid var(--line)',
            }}
          >
            <ArrowLeft size={14} />
            <span>{isMr ? 'मुख्य पृष्ठ' : 'Explore Pune Home'}</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: isTocOpen ? 'var(--primary)' : 'var(--card)',
              color: isTocOpen ? '#ffffff' : 'var(--ink)',
              border: '1px solid var(--line)',
            }}
          >
            <BookOpen size={14} />
            <span>{isMr ? 'अनुक्रमणिका (TOC)' : 'Table of Contents'}</span>
            <span
              style={{
                fontSize: 11,
                background: isTocOpen ? 'rgba(255,255,255,0.2)' : 'var(--line-light)',
                padding: '1px 6px',
                borderRadius: 999,
              }}
            >
              10
            </span>
          </button>
        </div>

        {/* Reading progress indicator & Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--ink-secondary)',
              background: 'var(--card)',
              border: '1px solid var(--line)',
              padding: '4px 12px',
              borderRadius: 999,
            }}
          >
            <span>📖</span>
            <span>
              {currentChapter === 0
                ? isMr
                  ? 'मुखपृष्ठ'
                  : 'Cover Page'
                : isMr
                ? `प्रकरण ${currentChapter} / १०`
                : `Chapter ${currentChapter} of 10`}
            </span>
            <div
              style={{
                width: 60,
                height: 6,
                borderRadius: 999,
                background: 'var(--line-light, #e2e8f0)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ea580c, #10b981)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span>{progressPercent}%</span>
          </div>

          {/* Bilingual Switcher */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--card)',
              padding: 3,
              borderRadius: 999,
              border: '1px solid var(--line)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                border: 'none',
                background: !isMr ? '#047857' : 'transparent',
                color: !isMr ? '#ffffff' : 'var(--muted)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('mr')}
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                border: 'none',
                background: isMr ? '#047857' : 'transparent',
                color: isMr ? '#ffffff' : 'var(--muted)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'var(--deva)',
              }}
            >
              मराठी
            </button>
          </div>
        </div>
      </div>

      {/* 2. TABLE OF CONTENTS MODAL / DRAWER */}
      {isTocOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setIsTocOpen(false)}
        >
          <div
            style={{
              background: 'var(--card)',
              width: '100%',
              maxWidth: 720,
              maxHeight: '85vh',
              borderRadius: 20,
              border: '1.5px solid var(--line)',
              overflowY: 'auto',
              padding: '24px 28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                borderBottom: '1px solid var(--line)',
                paddingBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>📖</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--ink)' }}>
                    {isMr ? 'पुणे प्रवास मार्गदर्शक अनुक्रमणिका' : 'Explore Pune Handbook — Index'}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>
                    {isMr ? 'कोणत्याही प्रकरणावर क्लिक करून थेट वाचा' : 'Jump directly to any chapter or interactive walkthrough'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTocOpen(false)}
                className="btn outline"
                style={{ padding: '6px 10px', borderRadius: '50%', minWidth: 34, height: 34 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Search inside Guide */}
            <div style={{ position: 'relative', marginBottom: 18 }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
              />
              <input
                type="text"
                value={guideSearchQuery}
                onChange={(e) => setGuideSearchQuery(e.target.value)}
                placeholder={isMr ? 'मार्गदर्शिकेत शोधा (उदा. मेट्रो, रील्स, तिकीट, एआय...)' : 'Search topics (e.g. metro, reels, fees, AI bot, checklist)...'}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  fontSize: 13,
                  background: 'var(--bg)',
                  color: 'var(--ink)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Chapter Items List */}
            <div style={{ display: 'grid', gap: 8 }}>
              <button
                type="button"
                onClick={() => goToChapter(0)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: currentChapter === 0 ? '1.5px solid var(--primary)' : '1px solid var(--line)',
                  background: currentChapter === 0 ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>📜</span>
                  <div>
                    <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                      {isMr ? 'मुखपृष्ठ: मार्गदर्शिका परिचय' : 'Handbook Cover & Editorial Foreword'}
                    </strong>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {isMr ? 'पुणे डिजिटल प्रवास मार्गदर्शिकेची पार्श्वभूमी' : 'The definitive local traveler handbook'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--primary)', fontWeight: 700 }}>
                  {currentChapter === 0 ? '✓ Current' : 'Open →'}
                </span>
              </button>

              {filteredChapters.map((ch) => {
                const isActive = currentChapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => goToChapter(ch.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: isActive ? '1.5px solid #ea580c' : '1px solid var(--line)',
                      background: isActive ? 'var(--clay-light, rgba(194, 65, 12, 0.08))' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: 'var(--line-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 800,
                          color: 'var(--ink-secondary)',
                          flexShrink: 0,
                        }}
                      >
                        {ch.number}
                      </span>
                      <div>
                        <strong style={{ fontSize: 13.5, color: 'var(--ink)' }}>
                          {isMr ? ch.titleMr : ch.titleEn}
                        </strong>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                          {isMr ? ch.subtitleMr : ch.subtitleEn}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{ch.readTime}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: isActive ? '#c2410c' : 'var(--muted)',
                        }}
                      >
                        {isActive ? '● Reading' : '→'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN NOTEBOOK CONTAINER */}
      <main className="wrap" style={{ maxWidth: 1180 }}>
        <div
          className="editorial-notebook-frame"
          style={{
            background: 'var(--card)',
            border: '2px solid var(--line)',
            borderRadius: 24,
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Notebook Decorative Leather Spine Stitches on Top/Left */}
          <div
            style={{
              height: 6,
              background: 'linear-gradient(90deg, #ea580c 0%, #065f46 50%, #0284c7 100%)',
              width: '100%',
            }}
          />

          {/* Notebook Inner Layout: Left Chapter Tabs (Desktop) + Right Content Page */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {/* Desktop Chapter Tabs Spine Column */}
            <aside
              className="notebook-spine-sidebar"
              style={{
                borderRight: '1px solid var(--line)',
                background: 'var(--surface)',
                padding: '24px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                maxHeight: '850px',
                overflowY: 'auto',
              }}
            >
              <div style={{ paddingBottom: 12, marginBottom: 8, borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <BrandLogo size={32} withBadge />
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>
                    Handbook Index
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {isMr ? '१० मार्गदर्शक प्रकरणे • १२ मिनिटे वाचन' : '10 Chapters • 12 Min Comprehensive Read'}
                </div>
              </div>

              {/* Cover Tab Button */}
              <button
                type="button"
                onClick={() => goToChapter(0)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: currentChapter === 0 ? '1.5px solid var(--primary)' : '1px solid transparent',
                  background: currentChapter === 0 ? 'var(--primary-light)' : 'transparent',
                  color: currentChapter === 0 ? 'var(--primary)' : 'var(--ink)',
                  fontWeight: currentChapter === 0 ? 800 : 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>📜</span>
                <span>{isMr ? 'मुखपृष्ठ (Cover)' : 'Foreword & Cover'}</span>
              </button>

              {/* 10 Chapter Tab Buttons */}
              {GUIDE_CHAPTERS.map((ch) => {
                const isActive = currentChapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => goToChapter(ch.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: isActive ? '1.5px solid #ea580c' : '1px solid transparent',
                      background: isActive ? 'var(--clay-light, rgba(194,65,12,0.08))' : 'transparent',
                      color: isActive ? '#c2410c' : 'var(--ink)',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: 12.5,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ fontSize: 13, opacity: isActive ? 1 : 0.7 }}>{ch.icon}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ch.number}. {isMr ? ch.titleMr : ch.titleEn}
                      </span>
                    </div>
                    {isActive && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ea580c', flexShrink: 0 }} />
                    )}
                  </button>
                );
              })}
            </aside>

            {/* Right Reading Canvas Area */}
            <div
              className="notebook-page-canvas"
              style={{
                gridColumn: 'span 2',
                padding: '36px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
                background: 'var(--card)',
              }}
            >
              {/* =========================================================
                  CHAPTER 0: HANDBOOK COVER & EDITORIAL FOREWORD
                  ========================================================= */}
              {currentChapter === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Decorative Cover Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'rgba(194, 65, 12, 0.08)',
                        color: 'var(--clay, #c2410c)',
                        padding: '4px 14px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <span>📖</span> {isMr ? 'अधिकृत डिजिटल प्रवासी हस्तपुस्तिका' : 'Official Explorer Handbook'}
                    </div>

                    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                      {isMr ? 'आवृत्ती २.५ • नोव्हेंबर २०२६' : 'Edition 2.5 • November 2026 Archive'}
                    </span>
                  </div>

                  {/* Dramatic Editorial Header */}
                  <div>
                    <h1
                      style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        margin: '0 0 14px',
                        color: 'var(--ink)',
                        lineHeight: 1.15,
                        fontFamily: isMr ? 'var(--deva)' : 'var(--serif)',
                      }}
                    >
                      {isMr
                        ? 'एक्सप्लोर पुणे: संपूर्ण डिजिटल प्रवास व वारसा मार्गदर्शिका'
                        : 'Explore Pune: The Definitive Digital Travel Handbook'}
                    </h1>
                    <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.6, margin: 0, maxWidth: 720 }}>
                      {isMr
                        ? 'पुण्यनगरीतील १०६ प्रमाणित ऐतिहासिक किल्ले, पेशवेकालीन वाडे, प्रसिद्ध मंदिरे, निसर्ग टेकड्या, सार्वजनिक वाहतूक (मेट्रो व पीएमपीएमएल) आणि एआय सहल नियोजनाचा परिपूर्ण वापर कसा करावा याचे प्रात्यक्षिकांसह मार्गदर्शन.'
                        : 'Learn how to navigate 106 verified Sahyadri hill forts, Peshwa wadas, ancient rock-cut caves, public transit corridors, and custom AI journey tools with ease.'}
                    </p>
                  </div>

                  {/* Cover Photo Montage Banner */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: 18,
                      overflow: 'hidden',
                      aspectRatio: '16 / 7',
                      minHeight: 220,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    <Image
                      src="/images/places/sinhagad-fort.jpg"
                      alt="Sinhagad Fort Heritage Cover"
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.85) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '24px 28px',
                        color: '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <BrandLogo size={36} withBadge />
                        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          Explore Pune Master Registry
                        </span>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>
                        {isMr ? 'सह्याद्रीच्या गड-किल्ल्यांपासून ते मेट्रोच्या जलद प्रवासापर्यंत' : 'From Sahyadri Fort Summits to Modern Metro Lines'}
                      </div>
                    </div>
                  </div>

                  {/* 4 Feature Highlights Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
                    <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🛡️</div>
                      <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                        {isMr ? '१०६ अस्सल ठिकाणे' : '106 Master Places'}
                      </strong>
                      <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '4px 0 0' }}>
                        {isMr ? 'शून्य अनधिकृत नोंदी; एएसआय व महापालिकेचे अधिकृत संदर्भ.' : '0 placeholder places; 100% verified archival & field data.'}
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🗺️</div>
                      <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                        {isMr ? 'स्मार्ट ट्रिप प्लॅनर' : 'Smart AI Planner'}
                      </strong>
                      <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '4px 0 0' }}>
                        {isMr ? 'वेळ व बजेटनुसार बस-मेट्रो जोडणीसह सानुकूल सहल आराखडा.' : 'Personalized itinerary calculation with transit timings & PDF export.'}
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🎬</div>
                      <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                        {isMr ? 'सिनेमॅटिक रील्स' : '106 Journey Reels'}
                      </strong>
                      <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '4px 0 0' }}>
                        {isMr ? 'प्रत्येक ठिकाणासाठी ५-अंकी स्वतंत्र सांस्कृतिक व्हिडिओ रील.' : 'Art-directed 5-act narrative reels mapped with cultural music.'}
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>📱</div>
                      <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                        {isMr ? 'ऑफलाइन व PWA' : 'Offline Ready'}
                      </strong>
                      <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '4px 0 0' }}>
                        {isMr ? 'नेटवर्क नसतानाही वापरता येणारे विश्वसनीय डिजिटल मार्गदर्शक.' : 'Printable PDFs, installable PWA app and zero-lag local cache.'}
                      </p>
                    </div>
                  </div>

                  {/* Start Reading CTA Banner */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: 16,
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 16,
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17, color: '#065f46', fontWeight: 800 }}>
                        {isMr ? 'हस्तपुस्तिका वाचण्यास सुरुवात करा' : 'Ready to explore the chapters?'}
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#047857' }}>
                        {isMr
                          ? 'प्रकरण ०१ पासून सुरुवात करा किंवा वरून थेट हवे ते प्रकरण निवडा.'
                          : 'Begin with Chapter 01 to learn website fundamentals or pick any chapter above.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => goToChapter(1)}
                      className="btn"
                      style={{
                        background: '#047857',
                        color: '#ffffff',
                        padding: '10px 22px',
                        fontSize: 14,
                        fontWeight: 800,
                        borderRadius: 999,
                        boxShadow: '0 4px 12px rgba(4, 120, 87, 0.25)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span>{isMr ? 'प्रकरण ०१ उघडा' : 'Start Reading Chapter 01'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 01: WELCOME TO EXPLORE PUNE
                  ========================================================= */}
              {currentChapter === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 01
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>2 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण ०१ — एक्सप्लोर पुणे: संकल्पना व पाया' : 'Chapter 01 — Welcome to Explore Pune'}
                  </h2>

                  <div style={{ position: 'relative', width: '100%', height: 260, borderRadius: 16, overflow: 'hidden' }}>
                    <Image src="/images/places/shaniwar-wada.jpg" alt="Shaniwar Wada" fill style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 12, left: 14, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11 }}>
                      🏛️ Shaniwar Wada — Historic Seat of the Peshwas (1732 AD)
                    </div>
                  </div>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'एक्सप्लोर पुणे हे कोणत्याही व्यावसायिक हेतूशिवाय, स्थानिक इतिहास अभ्यासक व तंत्रज्ञानप्रेमींनी पुणेकरांसाठी आणि जगभरातील पर्यटकांसाठी तयार केलेले अधिकृत डिजिटल पर्यटन मार्गदर्शक आहे. या पोर्टलचा मुख्य उद्देश म्हणजे पर्यटकांना दिशाभूल करणाऱ्या जाहिराती किंवा चुकीच्या माहितीपासून वाचवून अधिकृत, प्रमाणित आणि उपयुक्त माहिती देणे.'
                      : 'Explore Pune is an authoritative, community-first digital field guide engineered to preserve, celebrate, and navigate the cultural capital of Maharashtra. Unlike generic review portals filled with outdated hours or spam, Explore Pune delivers 100% field-audited data directly cross-referenced against the Archaeological Survey of India (ASI), Maharashtra Tourism (MTDC), and municipal authorities.'}
                  </p>

                  <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 14, border: '1.5px solid var(--line)' }}>
                    <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                      🎯 {isMr ? 'एक्सप्लोर पुणे चे ४ प्रमुख स्तंभ' : 'The 4 Core Pillars of Explore Pune'}
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--ink-secondary)' }}>
                      <li>
                        <strong>{isMr ? '१०६ मास्टर नोंदणी:' : '106 Master Registry:'}</strong>{' '}
                        {isMr ? 'सर्व १०६ ठिकाणे प्रत्यक्ष पडताळलेली आहेत. एकही ठिकाण अस्पष्ट किंवा अंदाजे नाही.' : 'Every single landmark is fully mapped with coordinates, ticket fees, operating hours, and historical provenance.'}
                      </li>
                      <li>
                        <strong>{isMr ? 'थेट सार्वजनिक वाहतूक जोडणी:' : 'Integrated Transit Engine:'}</strong>{' '}
                        {isMr ? 'पुणे मेट्रो लाईन्स १ व २ आणि पीएमपीएमएल बस वेळापत्रक प्रत्येक स्थळाशी जोडलेले आहे.' : 'Instant routing via Pune Metro Lines 1 & 2 and official PMPML suburban timetables.'}
                      </li>
                      <li>
                        <strong>{isMr ? 'खर्चाची पारदर्शकता:' : 'Transparent Ticket Pricing:'}</strong>{' '}
                        {isMr ? 'भारतीय नागरिक, परदेशी पर्यटक, कॅमेरा व पार्किंगचे अचूक दर स्पष्टपणे दाखवले आहेत.' : 'Explicit differentiation between ₹0 free monuments and paid ASI/Trust ticketing.'}
                      </li>
                      <li>
                        <strong>{isMr ? 'सुरक्षा व प्रशासकीय सूचना:' : 'Real-time Safety Vigilance:'}</strong>{' '}
                        {isMr ? 'जिल्हाधिकारी व वनविभागाचे पावसाळी निर्बंध आणि घाट रस्त्यांचे अपडेट्स थेट उपलब्ध.' : 'Standing forest regulations, monsoon ban circulars, and weather hazard advisories.'}
                      </li>
                    </ul>
                  </div>

                  {/* Walkthrough CTA link */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link href="/" className="btn outline" style={{ fontSize: 13, padding: '8px 16px' }}>
                      🌐 {isMr ? 'मुख्य निर्देशिका उघडा' : 'Open Landmark Directory'}
                    </Link>
                    <Link href="/about" className="btn outline" style={{ fontSize: 13, padding: '8px 16px' }}>
                      ℹ️ {isMr ? 'आमच्याबद्दल अधिक वाचा' : 'About the Creators'}
                    </Link>
                  </div>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 02: DISCOVERING PUNE
                  ========================================================= */}
              {currentChapter === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 02
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>2 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण ०२ — पुणे दर्शन, शोध व श्रेणी नेव्हिगेशन' : 'Chapter 02 — Discovering Pune: Search & Categories'}
                  </h2>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'पुण्यातील १०६ ठिकाणे शोधण्यासाठी मुख्य पृष्ठावर अत्याधुनिक द्विभाषिक शोध (Bilingual Search) आणि ७ प्रमुख श्रेणींची गोल स्क्रोलिंग बॅज प्रणाली दिलेली आहे. तुम्ही इंग्रजी किंवा मराठी कोणत्याही भाषेत नाव टाईप करून त्वरित ठिकाण शोधू शकता.'
                      : 'Browsing across 106 destinations is streamlined through fuzzy bilingual search and a native-scrolling category navigation bar. Whether you search "Sinhagad" in English or "सिंहगड" in Devanagari Marathi, results filter instantly with sub-millisecond edge resolution.'}
                  </p>

                  {/* Interactive Category Selector Demo */}
                  <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 16, border: '1.5px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                        🎮 {isMr ? 'प्रात्यक्षिक: श्रेणी निवडून पहा' : 'Interactive Demo: Test Category Filter'}
                      </strong>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>Click any category pill</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      {[
                        { slug: 'forts', labelEn: 'Forts & Treks (15)', labelMr: 'किल्ले व गड (१५)', icon: '🏰' },
                        { slug: 'heritage', labelEn: 'Historic Wadas (29)', labelMr: 'ऐतिहासिक वाडे (२९)', icon: '🏛️' },
                        { slug: 'temples', labelEn: 'Temples & Shrines (27)', labelMr: 'प्रसिद्ध मंदिरे (२७)', icon: '🛕' },
                        { slug: 'nature', labelEn: 'Lakes & Nature (14)', labelMr: 'तलाव व निसर्ग (१४)', icon: '🌿' },
                        { slug: 'food', labelEn: 'Food Heritage (6)', labelMr: 'पुणेरी खाद्यसंस्कृती (६)', icon: '🍲' },
                      ].map((cat) => {
                        const isSel = demoSelectedCategory === cat.slug;
                        return (
                          <button
                            key={cat.slug}
                            type="button"
                            onClick={() => setDemoSelectedCategory(cat.slug)}
                            style={{
                              background: isSel ? '#047857' : 'var(--card)',
                              color: isSel ? '#ffffff' : 'var(--ink)',
                              border: isSel ? '1px solid #047857' : '1px solid var(--line)',
                              borderRadius: 999,
                              padding: '6px 14px',
                              fontSize: 12.5,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span>{cat.icon}</span>
                            <span>{isMr ? cat.labelMr : cat.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Simulated Results Card */}
                    <div style={{ background: 'var(--card)', padding: 14, borderRadius: 10, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 28 }}>
                        {demoSelectedCategory === 'forts' ? '🏰' : demoSelectedCategory === 'heritage' ? '🏛️' : demoSelectedCategory === 'temples' ? '🛕' : demoSelectedCategory === 'food' ? '🍲' : '🌿'}
                      </span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
                          {demoSelectedCategory === 'forts'
                            ? (isMr ? 'किल्ले श्रेणी सक्रिय: सिंहगड, राजगड, तोरणा, शिवनेरी, लोहगड...' : 'Active: Forts & Treks (Sinhagad, Rajgad, Torna, Shivneri, Lohagad...)')
                            : demoSelectedCategory === 'heritage'
                            ? (isMr ? 'वाडे श्रेणी सक्रिय: शनिवार वाडा, लाल महाल, विश्रामबाग वाडा...' : 'Active: Historic Wadas (Shaniwar Wada, Lal Mahal, Vishrambaug Wada...)')
                            : demoSelectedCategory === 'temples'
                            ? (isMr ? 'मंदिरे सक्रिय: दगडूशेठ गणपती, पाताळेश्वर, चतुःशृंगी...' : 'Active: Sacred Shrines (Dagdusheth, Pataleshwar, Chaturshringi...)')
                            : demoSelectedCategory === 'food'
                            ? (isMr ? 'खाद्यसंस्कृती सक्रिय: एफसी रोड, चितळे बाकरवडी, बेडेकर मिसळ...' : 'Active: Culinary Heritage (FC Road, Chitale Bandhu, Bedekar Misal...)')
                            : (isMr ? 'निसर्ग श्रेणी सक्रिय: खडकवासला, वेताळ टेकडी, पाषाण तलाव...' : 'Active: Nature & Scenic Spots (Khadakwasla, Vetal Tekdi, Pashan Lake...)')}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                          {isMr ? 'प्रत्येक कार्डवर रेटिंग, अंतर व थेट दिशानिर्देश उपलब्ध असतात.' : 'Each place card displays live open/closed status, fees & distance from your location.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                    <div style={{ padding: 14, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--line)' }}>
                      <strong>📍 {isMr ? 'स्थानिक परिसर निवड:' : 'Active Locality Selector:'}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>
                        {isMr ? 'स्वारगेट, डेक्कन किंवा हडपसर निवडून तिथून अचूक अंतर मोजा.' : 'Select your home base (e.g. Swargate, Hinjawadi) to calculate distance & transit routes.'}
                      </p>
                    </div>

                    <div style={{ padding: 14, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--line)' }}>
                      <strong>🔍 {isMr ? 'द्विभाषिक शोध क्षमता:' : 'Bilingual Keyword Match:'}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>
                        {isMr ? '"misal", "चहा", "trek" अशा शब्दांनीही अचूक परिणाम मिळतात.' : 'Search by cultural tags like "misal", "trek trail", or "buddhist caves".'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 03: DESTINATION DETAILS
                  ========================================================= */}
              {currentChapter === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 03
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>3 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण ०३ — स्थळ तपशील, पडताळणी व माहितीची रचना' : 'Chapter 03 — Destination Details & Field Intelligence'}
                  </h2>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'प्रत्येक ठिकाणाच्या पानावर (उदा. /places/sinhagad-fort) गेल्यानंतर पर्यटकाला त्या ठिकाणाची संपूर्ण, अस्सल आणि सत्यापित माहिती मिळते. खालील घटक प्रत्येक पानावर आवर्जून तपासा:'
                      : 'Every destination page (e.g. /places/sinhagad-fort) is built as a complete field dossier. Here is how to interpret the verified data fields on any place page:'}
                  </p>

                  {/* Visual Dossier Structure Card */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 14, padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                          ✓ VERIFIED
                        </span>
                        <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                          {isMr ? '१. अधिकृत पडताळणी संस्था (Authority Sources):' : '1. Confirming Authority Badges:'}
                        </strong>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                        {isMr
                          ? 'भारतीय पुरातत्व सर्वेक्षण (ASI), महाराष्ट्र पर्यटन (MTDC) किंवा पुणे महापालिका वारसा कक्षाचे थेट संकेतस्थळ दुवे व पडताळणी तारीख दिलेली असते.'
                          : 'Displays direct source links (asi.nic.in, maharashtratourism.gov.in) with source classifications (ASI Monument, Municipal Heritage Cell) and last-verified audit dates.'}
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 14, padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                          🕒 TIMINGS
                        </span>
                        <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                          {isMr ? '२. चालू-बंद स्थिती व वेळेचे नियम:' : '2. Real-time Operating Hours Engine:'}
                        </strong>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                        {isMr
                          ? 'सध्याच्या वेळेनुसार (IST) ठिकाण उघडे आहे की बंद, दुपारची विश्रांतीची वेळ (उदा. विश्रामबाग वाडा) आणि आठवड्यातील बंद दिवस (उदा. शनिवार वाड्यावर विशिष्ट कार्यक्रम).'
                          : 'Dynamically computes open/closed state against Indian Standard Time (IST), factoring in lunch breaks and weekly closure days.'}
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 14, padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                          🎟️ ENTRY POLICY
                        </span>
                        <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                          {isMr ? '३. प्रवेश शुल्क पारदर्शकता (Entry Fees):' : '3. Transparent Ticket Rules:'}
                        </strong>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                        {isMr
                          ? 'विनामूल्य प्रवेश (₹०) स्पष्ट दर्शविला जातो. सशुल्क ठिकाणांसाठी भारतीय नागरिक, परदेशी नागरिक, कॅमेरा शुल्क आणि वाहनांचा टोल (उदा. डोणजे वनविभाग नाका) स्पष्ट असतो.'
                          : 'Explicit distinction between ₹0 public landmarks, ASI tickets (₹25 domestic / ₹300 foreign), and Forest Department toll checkpoints.'}
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 14, padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ background: '#fdf2f8', color: '#be185d', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                          📸 THEATER
                        </span>
                        <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                          {isMr ? '४. सिनेमॅटिक फोटो स्लाइडशो व थिएटर मोड:' : '4. Cinematic Slideshow & Theater Mode:'}
                        </strong>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                        {isMr
                          ? 'केन बर्न्स इफेक्टसह फोटोंचा स्लाइडशो, फोटो काउंटर, आणि पूर्ण स्क्रीनवर पाहण्यासाठी थिएटर मोड उपलब्ध आहे.'
                          : 'High-resolution photo slideshow with Ken Burns smooth pan-and-zoom, verified photo counter, and fullscreen theater overlay.'}
                      </p>
                    </div>
                  </div>

                  <Link href="/places/sinhagad-fort" className="btn outline" style={{ alignSelf: 'flex-start', fontSize: 13 }}>
                    🏰 {isMr ? 'सिंहगड किल्ल्याचे पान प्रत्यक्ष पहा →' : 'Inspect Sinhagad Fort Page Live →'}
                  </Link>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 04: SMART TRIP PLANNER
                  ========================================================= */}
              {currentChapter === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 04
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>3 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण ०४ — स्मार्ट एआय सहल नियोजन (Trip Planner)' : 'Chapter 04 — Smart AI Trip Planner'}
                  </h2>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'एक्सप्लोर पुणे चे सहल नियोजन इंजिन (/planner) हे केवळ साधे ठिकाणांचे संकलन नाही. ते भूगोलाधारित अल्गोरिदम वापरून तुमच्या उपलब्ध वेळेत (उदा. ३ तास किंवा संपूर्ण दिवस), बजेटमध्ये आणि वाहतूक पद्धतीनुसार (मेट्रो, बस, पायी किंवा गाडी) सर्वोत्तम क्रमाने सहल तयार करते.'
                      : 'The Trip Planner at /planner uses geospatial graph routing combined with verified opening hours, ticket entry costs, and transit corridors across Pune. It structures realistic arrival/departure hours, guarantees you do not reach a monument after closing, and exports clean PDFs.'}
                  </p>

                  {/* Interactive Itinerary Stop Preview */}
                  <div style={{ background: 'var(--surface)', padding: 22, borderRadius: 16, border: '1.5px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                        📍 {isMr ? 'नमुना सहल आराखडा (५-थांबे ऐतिहासिक मार्ग):' : 'Sample 1-Day Heritage Itinerary Preview:'}
                      </strong>
                      <span style={{ fontSize: 11.5, color: '#047857', fontWeight: 700 }}>
                        ✓ {isMr ? '३०५ मिनिटे • ₹७५ एकूण खर्च' : '305 Mins • ₹75 Total Cost'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { time: '09:00 AM - 10:15 AM', nameEn: '1. Shaniwar Wada', nameMr: '१. शनिवार वाडा', whyEn: 'Ideal morning start near Civil Court Metro; minimal queue.', whyMr: 'सकाळच्या शांत वेळेत शनिवार वाडा दर्शन व मेट्रो जोडणी.' },
                        { time: '10:25 AM - 11:10 AM', nameEn: '2. Lal Mahal', nameMr: '२. लाल महाल', whyEn: '250m walking distance from Shaniwar Wada; Shivaji Maharaj childhood.', whyMr: 'शनिवार वाड्यापासून २५० मी. पायी अंतर; बालपण वास्तू.' },
                        { time: '11:20 AM - 12:05 PM', nameEn: '3. Dagdusheth Ganpati', nameMr: '३. दगडूशेठ हलवाई गणपती', whyEn: 'Spiritual heart of Pune; ₹0 free darshan before noon.', whyMr: 'पुण्याचे आराध्य दैवत; दुपारपूर्वी सुलभ दर्शन.' },
                        { time: '12:20 PM - 01:10 PM', nameEn: '4. Vishrambaug Wada', nameMr: '४. विश्रामबाग वाडा', whyEn: 'Peshwa Bajirao II wooden carved palace; Punawadi exhibition.', whyMr: 'दुसऱ्या बाजीराव पेशव्यांची लाकडी नक्षीकाम वास्तू.' },
                      ].map((stop, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 10,
                            background: 'var(--card)',
                            border: '1px solid var(--line)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 8,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>
                              {isMr ? stop.nameMr : stop.nameEn}
                            </div>
                            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                              💡 <strong>{isMr ? 'निवडीचे कारण:' : 'Why selected:'}</strong> {isMr ? stop.whyMr : stop.whyEn}
                            </div>
                          </div>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#c2410c', background: 'rgba(194,65,12,0.08)', padding: '3px 8px', borderRadius: 6 }}>
                            {stop.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface)', padding: 18, borderRadius: 14, border: '1px solid var(--line)' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>
                      📥 {isMr ? 'सहल आराखड्याची निर्यात (Export Options):' : 'Exporting & Sharing Your Itinerary:'}
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                      <li><strong>PDF Download:</strong> Generates a high-resolution, branded printable itinerary PDF with official logo.</li>
                      <li><strong>WhatsApp Sharing:</strong> Instantly formats a clean text summary ready to send to travel companions.</li>
                      <li><strong>Email Itinerary:</strong> Sends the generated schedule and attached PDF directly to your inbox.</li>
                    </ul>
                  </div>

                  <Link href="/planner" className="btn outline" style={{ alignSelf: 'flex-start', fontSize: 13 }}>
                    🗺️ {isMr ? 'ट्रिप प्लॅनर प्रत्यक्ष वापरा →' : 'Launch Trip Planner Now →'}
                  </Link>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 05: TRAVEL AND TRANSPORT
                  ========================================================= */}
              {currentChapter === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 05
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>2 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण ०५ — सार्वजनिक वाहतूक: पुणे मेट्रो व पीएमपीएमएल बस' : 'Chapter 05 — Public Transit & Commuter Guide'}
                  </h2>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'पुण्यात पर्यटनासाठी स्वतःचे वाहन नसले तरी पुणे मेट्रो आणि पीएमपीएमएल बस सेवेने तुम्ही संपूर्ण शहर व उपनगरे अत्यंत स्वस्तात व जलद गतीने फिरू शकता.'
                      : 'Explore Pune seamlessly integrates the modern Pune Metro network (Lines 1 & 2) and the dense PMPML suburban bus network to make vehicle-free tourism accessible, affordable, and sustainable.'}
                  </p>

                  {/* Metro Network Card */}
                  <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 16, border: '1.5px solid var(--line)' }}>
                    <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>🚇</span> {isMr ? 'पुणे मेट्रो मार्गदर्शक (Pune Metro Guide)' : 'Pune Metro Network Overview'}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                      <div style={{ background: 'var(--card)', padding: 14, borderRadius: 10, border: '1px solid #c084fc' }}>
                        <div style={{ color: '#9333ea', fontWeight: 800, fontSize: 13 }}>💜 PURPLE LINE (LINE 1)</div>
                        <div style={{ fontSize: 13, fontWeight: 700, margin: '4px 0', color: 'var(--ink)' }}>PCMC ➔ Swargate</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {isMr ? 'पिंपरी-चिंचवड ते स्वारगेट भुयारी मार्ग. सिव्हिल कोर्ट, कसबा पेठ, शनिवार वाड्यासाठी सर्वोत्तम.' : 'Connects industrial north to central Pune via Civil Court and Kasba Peth.'}
                        </div>
                      </div>

                      <div style={{ background: 'var(--card)', padding: 14, borderRadius: 10, border: '1px solid #38bdf8' }}>
                        <div style={{ color: '#0284c7', fontWeight: 800, fontSize: 13 }}>🩵 AQUA LINE (LINE 2)</div>
                        <div style={{ fontSize: 13, fontWeight: 700, margin: '4px 0', color: 'var(--ink)' }}>Vanaz ➔ Ramwadi</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {isMr ? 'कोथरूड (वनाझ) ते नगर रस्ता (रामवाडी). डेक्कन, संभाजी पार्क, पुणे स्टेशन, आगाखान पॅलेससाठी सोयीस्कर.' : 'East-West link through Deccan Gymkhana, Pune Station, and Kalyani Nagar.'}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(6, 95, 70, 0.08)', borderRadius: 8, fontSize: 12.5, color: 'var(--ink)' }}>
                      🔄 <strong>District Court Interchange:</strong> Change trains between Purple and Aqua lines without buying another ticket.
                    </div>
                  </div>

                  {/* PMPML Day Pass Pro Tip */}
                  <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)', border: '1.5px solid #fde68a', borderRadius: 14, padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 24 }}>💡</span>
                      <strong style={{ fontSize: 15, color: '#92400e' }}>
                        {isMr ? 'सुवर्ण सल्ला: पीएमपीएमएल ₹७० डे पास (Daily Pass)' : 'Pro Tip: PMPML ₹70 Daily Bus Pass'}
                      </strong>
                    </div>
                    <p style={{ fontSize: 13, color: '#78350f', margin: 0, lineHeight: 1.6 }}>
                      {isMr
                        ? 'पुणे मनपा (PMC) आणि पिंपरी चिंचवड (PCMC) हद्दीत दिवसभरात कितीही बसेस प्रवास करण्यासाठी केवळ ₹७० चा डे पास मिळतो. कोणत्याही बस कंडक्टरकडे किंवा डेपोवर मागू शकता. सिंहगड किंवा ग्रामीण भागासाठी ₹१५० चा पास लागतो.'
                        : 'Instead of buying single ₹10-₹30 tickets repeatedly, purchase a ₹70 PMPML Day Pass from any bus conductor for unlimited citywide travel across both PMC and PCMC limits until midnight.'}
                    </p>
                  </div>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 06: AI TRAVEL ASSISTANT
                  ========================================================= */}
              {currentChapter === 6 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 06
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>2 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण ०६ — एआय ट्रॅव्हल असिस्टंट (पुणेरी मार्गदर्शक)' : 'Chapter 06 — AI Travel Assistant (ChatWidget)'}
                  </h2>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'वेबसाईटच्या उजव्या कोपऱ्यात तळाशी चमकणारा हिरवा आयकॉन हा आमचा इन-बिल्ट एआय ट्रॅव्हल असिस्टंट आहे. हा कोणत्याही खोट्या किंवा आभासी माहितीशिवाय (Strict Anti-Hallucination) थेट १०६ ठिकाणांच्या मास्टर डेटामधून उत्तरे देतो.'
                      : 'The floating circular badge in the bottom-right corner activates our on-device AI Travel Assistant. Built on a local semantic classifier and edge knowledge engine, it answers heritage, transit, and ticket queries instantly without external API lag.'}
                  </p>

                  {/* Click to Copy Prompt Cards */}
                  <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 16, border: '1.5px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                        💬 {isMr ? 'क्लिक करून प्रश्न कॉपी करा (Click to copy & try):' : 'Recommended Prompts to Ask the AI:'}
                      </strong>
                      {copiedPrompt && (
                        <span style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>
                          ✓ Copied to clipboard!
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gap: 8 }}>
                      {[
                        { en: 'Suggest a 3-hour morning heritage walk near Shaniwar Wada', mr: 'शनिवार वाड्याभोवती ३ तासांची सकाळची हेरिटेज वॉक सुचवा' },
                        { en: 'What is the entry fee and timing for Aga Khan Palace?', mr: 'आगाखान पॅलेसचे तिकीट दर आणि चालू-बंद वेळ काय आहे?' },
                        { en: 'How do I reach Sinhagad Fort using PMPML bus from Swargate?', mr: 'स्वारगेटवरून पीएमपीएमएल बसने सिंहगडला कसे जायचे?' },
                        { en: 'Are there any free entry museums in Pune?', mr: 'पुण्यात विनामूल्य प्रवेश असलेली वस्तुसंग्रहालये कोणती आहेत?' },
                      ].map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleCopyPrompt(isMr ? prompt.mr : prompt.en)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: 'var(--card)',
                            border: '1px solid var(--line)',
                            borderRadius: 10,
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: 13,
                            color: 'var(--ink)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: '#047857' }}>💬</span>
                            <span>&ldquo;{isMr ? prompt.mr : prompt.en}&rdquo;</span>
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--line-light)', padding: '2px 8px', borderRadius: 4 }}>
                            Copy
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: 14, borderRadius: 10, background: 'rgba(6, 95, 70, 0.06)', border: '1px solid #86efac', fontSize: 13, color: 'var(--ink)' }}>
                    🔒 <strong>Strict Truth Standard:</strong> If an operating detail or seasonal rule is unverified, the assistant will explicitly state: <em>&ldquo;I don&apos;t have a verified record for this yet&rdquo;</em> rather than hallucinating fake timings.
                  </div>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 07: MY JOURNEY & REELS
                  ========================================================= */}
              {currentChapter === 7 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 07
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>3 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण ०७ — माझी सफर (My Journey) व सिनेमॅटिक रील्स' : 'Chapter 07 — My Journey & Cinematic Journey Reels'}
                  </h2>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'माझी सफर (/journey) हे तुमचे वैयक्तिक पुणे पर्यटन डायरी आहे. येथे तुम्ही भेट दिलेल्या ठिकाणांची नोंद करू शकता, आठवणींचे फोटो जोडू शकता आणि सर्वात वैशिष्ट्यपूर्ण म्हणजे १०६ स्वतंत्र सिनेमॅटिक रील्स तयार करू शकता.'
                      : 'The My Journey section at /journey is your personal travel log and memories engine. Log visited forts, upload journal photos, and trigger our bespoke 106-template Cinematic Reel generator.'}
                  </p>

                  {/* 5-Act Narrative Reel Architecture */}
                  <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 16, border: '1.5px solid var(--line)' }}>
                    <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>🎬</span> {isMr ? '५-अंकी सिनेमॅटिक रील रचना (5-Act Narrative Structure):' : 'The 5-Act Cinematic Reel Engine:'}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                      <div style={{ background: 'var(--card)', padding: 12, borderRadius: 8, border: '1px solid var(--line)' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#ea580c' }}>ACT 1: HOOK</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, margin: '2px 0' }}>Breathtaking Vista</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Zoom punch & bold Marathi title drop.</div>
                      </div>

                      <div style={{ background: 'var(--card)', padding: 12, borderRadius: 8, border: '1px solid var(--line)' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#0284c7' }}>ACT 2: ESTABLISHING</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, margin: '2px 0' }}>Heritage Context</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Historical era, elevation & bastion lines.</div>
                      </div>

                      <div style={{ background: 'var(--card)', padding: 12, borderRadius: 8, border: '1px solid var(--line)' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#059669' }}>ACT 3: IMMERSION</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, margin: '2px 0' }}>Architecture Details</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Stone carvings, gates & cultural atmosphere.</div>
                      </div>

                      <div style={{ background: 'var(--card)', padding: 12, borderRadius: 8, border: '1px solid var(--line)' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#9333ea' }}>ACT 4: CLIMAX</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, margin: '2px 0' }}>Peak Story Point</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Speed-ramp transition on musical drop.</div>
                      </div>

                      <div style={{ background: 'var(--card)', padding: 12, borderRadius: 8, border: '1px solid var(--line)' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#b45309' }}>ACT 5: HERO ENDING</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, margin: '2px 0' }}>Memorable Farewell</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Cinematic fade & explorer medal stamp.</div>
                      </div>
                    </div>
                  </div>

                  <Link href="/journey" className="btn outline" style={{ alignSelf: 'flex-start', fontSize: 13 }}>
                    🧭 {isMr ? 'माझी सफर डॅशबोर्ड उघडा →' : 'Explore My Journey Dashboard →'}
                  </Link>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 08: PROFILE AND ACHIEVEMENTS
                  ========================================================= */}
              {currentChapter === 8 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 08
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>2 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण ०८ — प्रोफाईल, माईलस्टोन्स व सन्मान पदके' : 'Chapter 08 — Milestones & Achievement Medals'}
                  </h2>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'तुम्ही जशी पुण्यातील ठिकाणांना भेट देता, तसे तुमचे प्रोफाइल लेव्हल वाढते आणि तुम्हाला मराठा इतिहास व संस्कृतीवर आधारित धातूंची पदके (Medals) मिळतात. ही पदके तुम्ही १०८०x१०८० रिझोल्यूशनच्या आकर्षक कार्डमध्ये इन्स्टाग्राम व व्हॉट्सॲपवर शेअर करू शकता.'
                      : 'Every verified landmark you log counts towards thematic milestones. Earn crafted metallic medals (Bronze, Silver, Gold, Platinum) and export high-resolution 1080x1080 social share cards to showcase your cultural exploration.'}
                  </p>

                  {/* Interactive Achievement Medal Preview */}
                  <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 16, border: '1.5px solid var(--line)' }}>
                    <strong style={{ fontSize: 14, color: 'var(--ink)', display: 'block', marginBottom: 12 }}>
                      🏅 {isMr ? 'सन्मान पदके प्रात्यक्षिक (Interactive Medal Finishes):' : 'Authentic Milestone Medals Preview:'}
                    </strong>

                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: 16, padding: '16px 0' }}>
                      <div style={{ textAlign: 'center' }}>
                        <AchievementBadgeMedal
                          design={{ metal: 'bronze', symbol: 'fortress', ribbonColor: '#ea580c', accentColor: '#f97316', glowColor: 'rgba(234, 88, 12, 0.45)' }}
                          rarity="common"
                          size="md"
                        />
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>Sahyadri Scout</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Bronze Finish</div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <AchievementBadgeMedal
                          design={{ metal: 'silver', symbol: 'wada', ribbonColor: '#0284c7', accentColor: '#38bdf8', glowColor: 'rgba(14, 165, 233, 0.45)' }}
                          rarity="rare"
                          size="md"
                        />
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>Peshwa Historian</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Silver Finish</div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <AchievementBadgeMedal
                          design={{ metal: 'gold', symbol: 'temple', ribbonColor: '#d97706', accentColor: '#fbbf24', glowColor: 'rgba(245, 158, 11, 0.5)' }}
                          rarity="epic"
                          size="md"
                        />
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>Sacred Explorer</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Gold Finish</div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <AchievementBadgeMedal
                          design={{ metal: 'platinum', symbol: 'crown', ribbonColor: '#047857', accentColor: '#34d399', glowColor: 'rgba(16, 185, 129, 0.5)' }}
                          rarity="legendary"
                          size="md"
                        />
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>Pune Connoisseur</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>Platinum Celestial</div>
                      </div>
                    </div>
                  </div>

                  <Link href="/milestones" className="btn outline" style={{ alignSelf: 'flex-start', fontSize: 13 }}>
                    🏆 {isMr ? 'सर्व पदके व प्रगती पहा →' : 'View All Milestones & Badges →'}
                  </Link>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 09: SAFETY AND TRAVEL UPDATES
                  ========================================================= */}
              {currentChapter === 9 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 09
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>2 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण ०९ — सुरक्षा सतर्कता, प्रशासकीय आदेश व आपत्कालीन संपर्क' : 'Chapter 09 — Safety Alerts & Forest Regulations'}
                  </h2>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'सह्याद्रीच्या किल्ल्यांवर ट्रेकिंग करताना किंवा धरणांच्या परिसरात जाताना सुरक्षेला सर्वोच्च प्राधान्य दिले पाहिजे. एक्सप्लोर पुणे थेट जिल्हाधिकारी कार्यालय व वनविभागाचे आदेश प्रदर्शित करते.'
                      : 'Trekking Sahyadri forts and ghat routes requires vigilance regarding monsoon flash floods, fog, and administrative orders. Explore Pune continuously monitors and flags active advisories directly on place pages.'}
                  </p>

                  {/* Standing Regulations Matrix */}
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ padding: '14px 18px', borderRadius: 12, background: '#fff1f2', border: '1.5px solid #fecdd3' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 18 }}>🛑</span>
                        <strong style={{ color: '#9f1239', fontSize: 14 }}>
                          {isMr ? 'सिंहगड व गड-किल्ले रात्रकालीन संचारबंदी नियम:' : 'Standing Forest Night Curfew Rules:'}
                        </strong>
                      </div>
                      <p style={{ fontSize: 13, color: '#881337', margin: 0, lineHeight: 1.5 }}>
                        {isMr
                          ? 'वनविभागाच्या नियमांनुसार सिंहगड व इतर संरक्षित किल्ल्यांवर संध्याकाळी ६:०० नंतर वाहनांना प्रवेश बंद असतो आणि रात्री गडावर मुक्काम करण्यास बंदी आहे.'
                          : 'Vehicular ascent is closed after 6:00 PM at Donje toll checkpoint, and overnight stays inside the fort are strictly regulated by Maharashtra Forest Department.'}
                      </p>
                    </div>

                    <div style={{ padding: '14px 18px', borderRadius: 12, background: '#fffbeb', border: '1.5px solid #fde68a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 18 }}>🌧️</span>
                        <strong style={{ color: '#92400e', fontSize: 14 }}>
                          {isMr ? 'पावसाळी जलप्रपात व धबधबे सुरक्षा:' : 'Monsoon Waterfalls & Dam Inundation:'}
                        </strong>
                      </div>
                      <p style={{ fontSize: 13, color: '#78350f', margin: 0, lineHeight: 1.5 }}>
                        {isMr
                          ? 'भुशी डॅम, ताम्हिणी घाट व लवासा परिसरात अतिवृष्टीच्या काळात कलम १४४ अन्वये पाण्याचे प्रवाह ओलांडण्यास प्रतिबंध असतो.'
                          : 'During red-alert rain events, local authorities enforce Section 144 around overflowing spillways at Bushi Dam, Tamhini Ghat, and Mulshi.'}
                      </p>
                    </div>

                    <div style={{ padding: '14px 18px', borderRadius: 12, background: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 18 }}>📞</span>
                        <strong style={{ color: '#1e40af', fontSize: 14 }}>
                          {isMr ? 'महत्त्वाचे आपत्कालीन दूरध्वनी क्रमांक:' : 'Essential Emergency Helplines:'}
                        </strong>
                      </div>
                      <p style={{ fontSize: 13, color: '#1e3a8a', margin: 0, lineHeight: 1.6 }}>
                        • Police & Emergency: <strong>112</strong> • Forest Helpline (Maharashtra): <strong>1926</strong><br />
                        • Pune Municipal Corporation Disaster Cell: <strong>020-25501269</strong> • Ambulance: <strong>108</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  CHAPTER 10: TIPS, TROUBLESHOOTING & CHECKLIST
                  ========================================================= */}
              {currentChapter === 10 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Chapter 10
                    </span>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>3 min read</span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                    {isMr ? 'प्रकरण १० — महत्त्वाच्या टिप्स, PWA ॲप व प्रवासी चेकलिस्ट' : 'Chapter 10 — Pro Tips, Offline PWA & Explorer Checklist'}
                  </h2>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                    {isMr
                      ? 'पुणे भ्रमंती सुखकर आणि आनंददायी होण्यासाठी खालील आधुनिक तंत्रज्ञान टिप्स आणि प्रवासाची परस्परसंवादी चेकलिस्ट वापरा. तुम्ही केलेली निवड आपोआप सेव्ह होते.'
                      : 'Ensure smooth travels across Pune with these field-tested tips and our interactive travel readiness checklist. Checked items persist in your browser.'}
                  </p>

                  {/* Interactive Pre-Trip Checklist */}
                  <div style={{ background: 'var(--surface)', padding: 22, borderRadius: 16, border: '1.5px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <strong style={{ fontSize: 15, color: 'var(--ink)' }}>
                        ✅ {isMr ? 'पुणे सहल पूर्वतयारी चेकलिस्ट (Interactive Checklist):' : 'Pre-Trip Preparation Checklist:'}
                      </strong>
                      <span style={{ fontSize: 12, color: '#047857', fontWeight: 700 }}>
                        {checklist.filter((c) => c.checked).length} / {checklist.length} Completed
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {checklist.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleToggleChecklist(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 14px',
                            borderRadius: 10,
                            background: item.checked ? 'rgba(5, 150, 105, 0.06)' : 'var(--card)',
                            border: item.checked ? '1px solid #10b981' : '1px solid var(--line)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ color: item.checked ? '#059669' : 'var(--muted)', display: 'flex', alignItems: 'center' }}>
                            {item.checked ? <CheckSquare size={18} /> : <Square size={18} />}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: item.checked ? 'var(--ink)' : 'var(--ink-secondary)',
                              textDecoration: item.checked ? 'line-through' : 'none',
                              opacity: item.checked ? 0.85 : 1,
                            }}
                          >
                            {isMr ? item.textMr : item.textEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tips Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                    <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                      <strong>📱 Install as PWA:</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>
                        On Chrome/Safari mobile, tap Share ➔ &ldquo;Add to Home Screen&rdquo; to launch Explore Pune like a native app.
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--line)' }}>
                      <strong>🌙 Dark Mode Toggle:</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>
                        Click the Moon/Sun icon in the navigation bar to switch between daytime high-contrast and midnight OLED mode.
                      </p>
                    </div>
                  </div>

                  {/* Feedback CTA */}
                  <div style={{ padding: '16px 20px', borderRadius: 14, background: 'var(--primary-light)', border: '1px solid var(--primary-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <strong style={{ fontSize: 14, color: 'var(--primary)' }}>
                        {isMr ? 'काही प्रश्न किंवा सूचना आहेत?' : 'Have feedback or spot a changed ticket fee?'}
                      </strong>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                        {isMr ? 'आमच्या स्वयंसेवक पथकाला थेट माहिती कळवा.' : 'Send feedback to our editorial team to keep Explore Pune 100% accurate.'}
                      </div>
                    </div>
                    <Link href="/about" className="btn" style={{ background: '#047857', color: '#fff', fontSize: 13, padding: '8px 16px', borderRadius: 999 }}>
                      ✉️ {isMr ? 'अभिप्राय पाठवा' : 'Contact Editorial Team'}
                    </Link>
                  </div>
                </div>
              )}

              {/* =========================================================
                  4. BOTTOM NAVIGATION CONTROLS (Prev / Next Chapter)
                  ========================================================= */}
              <div
                style={{
                  borderTop: '1px solid var(--line)',
                  paddingTop: 24,
                  marginTop: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                {currentChapter > 0 ? (
                  <button
                    type="button"
                    onClick={() => goToChapter(currentChapter - 1)}
                    className="btn outline"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      padding: '8px 16px',
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>
                      {isMr ? 'मागील प्रकरण' : 'Previous Chapter'} ({currentChapter === 1 ? 'Cover' : `Ch ${currentChapter - 1}`})
                    </span>
                  </button>
                ) : (
                  <span />
                )}

                {currentChapter < 10 ? (
                  <button
                    type="button"
                    onClick={() => goToChapter(currentChapter + 1)}
                    className="btn"
                    style={{
                      background: '#ea580c',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      padding: '8px 18px',
                      borderRadius: 999,
                      boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>
                      {isMr ? 'पुढील प्रकरण' : 'Next Chapter'} ({`Ch ${currentChapter + 1}`})
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToChapter(0)}
                    className="btn"
                    style={{
                      background: '#047857',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      padding: '8px 18px',
                      borderRadius: 999,
                    }}
                  >
                    <span>🎉 {isMr ? 'मार्गदर्शिका पूर्ण • मुखपृष्ठावर जा' : 'Handbook Complete • Return to Cover'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. FLOATING QUICK NAVIGATOR BUTTON */}
      <aside
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 900,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => setIsTocOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
            color: '#ffffff',
            border: '1.5px solid rgba(255,255,255,0.2)',
            borderRadius: 999,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 24px rgba(6, 95, 70, 0.35)',
            cursor: 'pointer',
          }}
          title="Open Table of Contents"
        >
          <BookOpen size={16} />
          <span>{isMr ? 'अनुक्रमणिका' : 'Guide Index'}</span>
          <span
            style={{
              background: 'rgba(255,255,255,0.25)',
              padding: '1px 6px',
              borderRadius: 999,
              fontSize: 11,
            }}
          >
            {currentChapter}/10
          </span>
        </button>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: 'var(--card)',
            color: 'var(--ink)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          }}
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </aside>
    </div>
  );
}

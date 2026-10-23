'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  MessageSquare,
  ThumbsUp,
  Share2,
  Flag,
  MapPin,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import {
  CommunityPost,
  CommunityPostType,
  CommunitySortOption,
  POST_TYPE_META,
  getStoredCommunityPosts,
  filterCommunityPosts,
  togglePostHelpful,
  formatCommunityTime,
} from '@/lib/communityStorage';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';
import CommunityPostModal from '@/components/CommunityPostModal';
import CommunityPostDetailModal from '@/components/CommunityPostDetailModal';
import CommunityReportModal from '@/components/CommunityReportModal';

// Popular places for quick filter chips
const POPULAR_PLACE_CHIPS = [
  { id: 'all', nameEn: 'All Places', nameMr: 'सर्व ठिकाणे' },
  { id: 'sinhagad-fort', nameEn: 'Sinhagad Fort', nameMr: 'सिंहगड किल्ला' },
  { id: 'shaniwar-wada', nameEn: 'Shaniwar Wada', nameMr: 'शनिवार वाडा' },
  { id: 'aga-khan-palace', nameEn: 'Aga Khan Palace', nameMr: 'आगाखान पॅलेस' },
  { id: 'dagdusheth-ganpati', nameEn: 'Dagdusheth Ganpati', nameMr: 'दगडूशेठ गणपती' },
  { id: 'rajgad-fort', nameEn: 'Rajgad Fort', nameMr: 'राजगड किल्ला' },
  { id: 'lal-mahal', nameEn: 'Lal Mahal', nameMr: 'लाल महाल' },
  { id: 'pataleshwar-cave', nameEn: 'Pataleshwar Caves', nameMr: 'पाताळेश्वर लेणी' },
  { id: 'kelkar-museum', nameEn: 'Kelkar Museum', nameMr: 'केळकर संग्रहालय' },
  { id: 'vetal-tekdi', nameEn: 'Vetal Tekdi', nameMr: 'वेताळ टेकडी' },
];

// Category metadata for discovery cards
const CATEGORY_DISCOVERY = [
  { slug: 'all', nameEn: 'All Categories', nameMr: 'सर्व श्रेणी', icon: '🌟' },
  { slug: 'forts', nameEn: 'Forts & Hills', nameMr: 'किल्ले व सह्याद्री', icon: '🏰' },
  { slug: 'heritage', nameEn: 'Heritage & Wadas', nameMr: 'ऐतिहासिक वाडे', icon: '🏛️' },
  { slug: 'temples', nameEn: 'Religious & Temples', nameMr: 'मंदिरे व तीर्थ', icon: '🛕' },
  { slug: 'nature', nameEn: 'Nature & Trails', nameMr: 'निसर्ग व टेकड्या', icon: '🌿' },
  { slug: 'museums', nameEn: 'Museums & Culture', nameMr: 'संग्रहालये', icon: '🏺' },
  { slug: 'gardens', nameEn: 'Gardens & Parks', nameMr: 'उद्याने', icon: '🌳' },
];

function CommunityContent() {
  const { isMr } = useLanguage();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // State
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPostType, setSelectedPostType] = useState<CommunityPostType | 'all'>('all');
  const [selectedSort, setSelectedSort] = useState<CommunitySortOption>('latest');

  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedDetailPost, setSelectedDetailPost] = useState<CommunityPost | null>(null);
  const [reportingPost, setReportingPost] = useState<CommunityPost | null>(null);
  const [shareToast, setShareToast] = useState(false);

  // Load initial posts from storage and listen to storage updates
  useEffect(() => {
    setPosts(getStoredCommunityPosts());

    const handleStorageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CommunityPost[]>;
      if (customEvent.detail) {
        setPosts(customEvent.detail);
      } else {
        setPosts(getStoredCommunityPosts());
      }
    };

    window.addEventListener('explore-pune-community-updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('explore-pune-community-updated', handleStorageUpdate);
    };
  }, []);

  // Sync query params on mount
  useEffect(() => {
    const qPlace = searchParams.get('place');
    const qCat = searchParams.get('category');
    const qType = searchParams.get('type') as CommunityPostType | null;

    if (qPlace) setSelectedPlaceId(qPlace);
    if (qCat) setSelectedCategory(qCat);
    if (qType && POST_TYPE_META[qType]) setSelectedPostType(qType);
  }, [searchParams]);

  // Filtered & sorted posts
  const filteredPosts = useMemo(() => {
    return filterCommunityPosts({
      posts,
      searchQuery,
      placeId: selectedPlaceId,
      categorySlug: selectedCategory,
      postType: selectedPostType,
      sortOption: selectedSort,
    });
  }, [posts, searchQuery, selectedPlaceId, selectedCategory, selectedPostType, selectedSort]);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach((p) => {
      if (p.categorySlug) {
        counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  // Compute counts per post type
  const postTypeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach((p) => {
      if (p.postType) {
        counts[p.postType] = (counts[p.postType] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  // Selected place object for banner / info
  const activePlaceObj = useMemo(() => {
    if (selectedPlaceId === 'all') return null;
    return (
      ALL_STRUCTURED_PLACES.find(
        (p) => p.id === selectedPlaceId || p.slug === selectedPlaceId
      ) || null
    );
  }, [selectedPlaceId]);

  // Handle Helpful toggle
  const handleToggleHelpful = (post: CommunityPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const userId = user?.uid || 'guest-user';
    const result = togglePostHelpful({ postId: post.id, userId });

    if (result.success) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === post.id) {
            const userIds = [...(p.helpfulUserIds || [])];
            if (result.hasVoted) {
              if (!userIds.includes(userId)) userIds.push(userId);
            } else {
              const idx = userIds.indexOf(userId);
              if (idx > -1) userIds.splice(idx, 1);
            }
            return {
              ...p,
              helpfulCount: result.helpfulCount,
              helpfulUserIds: userIds,
            };
          }
          return p;
        })
      );
    }
  };

  // Handle Share link copy
  const handleSharePost = (post: CommunityPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/community?post=${post.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2600);
      });
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPlaceId('all');
    setSelectedCategory('all');
    setSelectedPostType('all');
    setSelectedSort('latest');
  };

  return (
    <main className="community-page-wrap" style={{ minHeight: '85vh', paddingBottom: 60 }}>
      {/* 1. HERO HEADER */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(194, 65, 12, 0.08) 0%, rgba(249, 115, 22, 0.03) 100%)',
          borderBottom: '1px solid var(--line)',
          padding: '38px 0 30px',
          marginBottom: 24,
        }}
      >
        <div className="wrap">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'rgba(194, 65, 12, 0.1)',
                  color: 'var(--brand-terracotta, #c2410c)',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                <Users size={14} />
                <span>{isMr ? 'पुणे प्रवासी समुदाय' : 'Pune Explorer Community'}</span>
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(24px, 4vw, 34px)',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                }}
              >
                👥 {isMr ? 'पुणे समुदाय' : 'Pune Community'}
              </h1>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: '15px',
                  color: 'var(--muted)',
                  lineHeight: 1.6,
                }}
              >
                {isMr
                  ? 'पर्यटक आणि स्थानिक पुणेकरांनी शेअर केलेले अस्सल अनुभव, उपयुक्त प्रवास टिप्स, प्रश्न आणि शिफारशी.'
                  : 'Discover Pune through experiences, recommendations, tips, and discussions shared by visitors and locals.'}
              </p>
            </div>

            {/* Post CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(true)}
                className="btn btn-primary"
                style={{
                  padding: '12px 22px',
                  borderRadius: 12,
                  fontSize: 14.5,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(194, 65, 12, 0.25)',
                }}
              >
                <Plus size={18} />
                <span>{isMr ? 'अनुभव शेअर करा' : 'Share Experience'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              marginTop: 22,
              paddingTop: 16,
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              fontSize: 13,
              color: 'var(--ink-secondary)',
            }}
          >
            <div>
              <strong style={{ color: 'var(--ink)' }}>{posts.length}</strong> {isMr ? 'चर्चा' : 'Discussions'}
            </div>
            <span>•</span>
            <div>
              <strong style={{ color: 'var(--ink)' }}>{ALL_STRUCTURED_PLACES.length}</strong>{' '}
              {isMr ? 'अधिकृत ठिकाणे' : 'Verified Places'}
            </div>
            <span>•</span>
            <div>
              <span style={{ color: '#047857' }}>✓ {isMr ? '१००% अस्सल पुणे माहिती' : '100% Authentic Pune Insights'}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        {/* 2. SEARCH & FILTER CONTROLS */}
        <section
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isMr
                    ? 'चर्चा, प्रश्न, किंवा ठिकाण शोधा...'
                    : 'Search discussions, tips, places...'
                }
                style={{
                  width: '100%',
                  padding: '10px 34px 10px 36px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                  color: 'var(--ink)',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: 2,
                  }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Place Dropdown */}
            <div style={{ position: 'relative' }}>
              <MapPin
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                  pointerEvents: 'none',
                }}
              />
              <select
                value={selectedPlaceId}
                onChange={(e) => setSelectedPlaceId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                  color: 'var(--ink)',
                  fontSize: 13.5,
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
                aria-label="Select place filter"
              >
                <option value="all">📍 {isMr ? 'सर्व ठिकाणे (All Places)' : 'All Places'}</option>
                {ALL_STRUCTURED_PLACES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.name_mr ? `(${p.name_mr})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div style={{ position: 'relative' }}>
              <TrendingUp
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                  pointerEvents: 'none',
                }}
              />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as CommunitySortOption)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                  color: 'var(--ink)',
                  fontSize: 13.5,
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
                aria-label="Sort community posts"
              >
                <option value="latest">⏱️ {isMr ? 'नवीनतम (Latest)' : 'Latest Discussions'}</option>
                <option value="helpful">👍 {isMr ? 'सर्वाधिक उपयुक्त (Most Helpful)' : 'Most Helpful'}</option>
                <option value="discussed">💬 {isMr ? 'सर्वाधिक चर्चा (Most Discussed)' : 'Most Discussed'}</option>
                <option value="trending">🔥 {isMr ? 'ट्रेंडिंग (Trending)' : 'Trending'}</option>
              </select>
            </div>
          </div>

          {/* POPULAR PLACES CHIPS (Requirement 4) */}
          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: 2,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--muted)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              🔥 {isMr ? 'लोकप्रिय:' : 'Popular:'}
            </span>
            {POPULAR_PLACE_CHIPS.map((chip) => {
              const isActive = selectedPlaceId === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedPlaceId(chip.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    border: isActive
                      ? '1px solid var(--brand-terracotta, #c2410c)'
                      : '1px solid var(--line)',
                    background: isActive ? 'rgba(194, 65, 12, 0.1)' : 'var(--bg)',
                    color: isActive ? 'var(--brand-terracotta, #c2410c)' : 'var(--ink-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {isMr ? chip.nameMr : chip.nameEn}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. ACTIVE PLACE NOTICE / BANNER (if place filter active) */}
        {activePlaceObj && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(59, 130, 246, 0.03) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: 14,
              padding: '12px 18px',
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: 'rgba(59, 130, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                📍
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>
                  {activePlaceObj.name} {activePlaceObj.name_mr ? `(${activePlaceObj.name_mr})` : ''}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                  {isMr
                    ? `या ठिकाणासाठी ${filteredPosts.length} चर्चा उपलब्ध`
                    : `Showing ${filteredPosts.length} discussions for this place`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link
                href={`/places/${activePlaceObj.slug}`}
                className="btn outline"
                style={{
                  fontSize: 12.5,
                  padding: '6px 14px',
                  borderRadius: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>{isMr ? 'ठिकाणाची संपूर्ण माहिती पहा' : 'View Place Details'}</span>
                <ExternalLink size={13} />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedPlaceId('all')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                {isMr ? '✕ फिल्टर काढा' : '✕ Clear'}
              </button>
            </div>
          </div>
        )}

        {/* 4. CATEGORY & POST TYPE TABS */}
        <div style={{ marginBottom: 22 }}>
          {/* Post Type Horizontal Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: 8,
              marginBottom: 10,
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedPostType('all')}
              style={{
                padding: '7px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: selectedPostType === 'all' ? 700 : 500,
                border:
                  selectedPostType === 'all'
                    ? '1.5px solid var(--ink)'
                    : '1px solid var(--line)',
                background: selectedPostType === 'all' ? 'var(--ink)' : 'var(--surface)',
                color: selectedPostType === 'all' ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
              }}
            >
              🌟 {isMr ? 'सर्व' : 'All'} ({postTypeCounts.all || 0})
            </button>

            {(Object.keys(POST_TYPE_META) as CommunityPostType[]).map((typeKey) => {
              const meta = POST_TYPE_META[typeKey];
              const isSelected = selectedPostType === typeKey;
              const count = postTypeCounts[typeKey] || 0;

              return (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setSelectedPostType(typeKey)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: isSelected ? 700 : 500,
                    border: isSelected ? `1.5px solid ${meta.color}` : '1px solid var(--line)',
                    background: isSelected ? meta.bg : 'var(--surface)',
                    color: isSelected ? meta.color : 'var(--ink-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span>{meta.icon}</span>
                  <span>{isMr ? meta.labelMr : meta.labelEn}</span>
                  <span
                    style={{
                      fontSize: 11,
                      opacity: 0.75,
                      marginLeft: 2,
                    }}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Chips */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: 4,
            }}
          >
            {CATEGORY_DISCOVERY.map((cat) => {
              const isCatSelected = selectedCategory === cat.slug;
              const catCount = categoryCounts[cat.slug] || 0;

              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: isCatSelected ? 600 : 500,
                    border: isCatSelected ? '1px solid var(--ink)' : '1px solid var(--line)',
                    background: isCatSelected ? 'var(--surface-sunken, #f3f4f6)' : 'transparent',
                    color: isCatSelected ? 'var(--ink)' : 'var(--muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{isMr ? cat.nameMr : cat.nameEn}</span>
                  {catCount > 0 && <span style={{ opacity: 0.7 }}>({catCount})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. ACTIVE FILTERS SUMMARY & RESULTS COUNT */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            fontSize: 13.5,
            color: 'var(--muted)',
          }}
        >
          <div>
            {isMr
              ? `${filteredPosts.length} चर्चा सापडल्या`
              : `Showing ${filteredPosts.length} ${filteredPosts.length === 1 ? 'discussion' : 'discussions'}`}
            {searchQuery && (
              <span>
                {' '}
                {isMr ? 'शोध:' : 'for'} &ldquo;
                <strong style={{ color: 'var(--ink)' }}>{searchQuery}</strong>&rdquo;
              </span>
            )}
          </div>

          {(searchQuery ||
            selectedPlaceId !== 'all' ||
            selectedCategory !== 'all' ||
            selectedPostType !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand-terracotta, #c2410c)',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <X size={14} />
              <span>{isMr ? 'सर्व फिल्टर्स रीसेट करा' : 'Reset all filters'}</span>
            </button>
          )}
        </div>

        {/* 6. DISCUSSIONS FEED */}
        {filteredPosts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredPosts.map((post) => {
              const meta = POST_TYPE_META[post.postType] || POST_TYPE_META.experience;
              const hasVoted =
                user && (post.helpfulUserIds || []).includes(user.uid);

              return (
                <article
                  key={post.id}
                  onClick={() => setSelectedDetailPost(post)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDetailPost(post);
                    }
                  }}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 16,
                    padding: '20px 22px',
                    cursor: 'pointer',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(194, 65, 12, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                    e.currentTarget.style.borderColor = 'var(--line)';
                  }}
                >
                  {/* Top Bar: Author, Badges, Time */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 12,
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 15,
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        {post.authorAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          post.authorName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>
                            {post.authorName}
                          </span>
                          {post.isExplorePuneVerified ? (
                            <span
                              title={isMr ? 'अधिकृत पडताळणीकृत' : 'Explore Pune Verified Guide'}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                background: '#ecfdf5',
                                color: '#047857',
                                padding: '1px 7px',
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              <CheckCircle2 size={12} />
                              <span>{isMr ? 'पडताळणीकृत' : 'Verified'}</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                background: 'rgba(0,0,0,0.04)',
                                color: 'var(--muted)',
                                padding: '1px 6px',
                                borderRadius: 999,
                                fontSize: 10.5,
                              }}
                            >
                              👥 {isMr ? 'समुदाय' : 'Community'}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                          {formatCommunityTime(post.createdAt, isMr)}
                        </div>
                      </div>
                    </div>

                    {/* Post Type Badge */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        background: meta.bg,
                        color: meta.color,
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <span>{meta.icon}</span>
                      <span>{isMr ? meta.labelMr : meta.labelEn}</span>
                    </div>
                  </div>

                  {/* Place & Category Tag Strip */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexWrap: 'wrap',
                      marginBottom: 10,
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaceId(post.placeId);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        background: 'rgba(194, 65, 12, 0.08)',
                        color: 'var(--brand-terracotta, #c2410c)',
                        border: 'none',
                        borderRadius: 6,
                        padding: '3px 8px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <MapPin size={12} />
                      <span>{post.placeName}</span>
                    </button>

                    <span
                      style={{
                        background: 'var(--line)',
                        color: 'var(--ink-secondary)',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: 11.5,
                      }}
                    >
                      {post.categoryName}
                    </span>
                  </div>

                  {/* Title & Content */}
                  <h2
                    style={{
                      margin: '0 0 8px',
                      fontSize: 17,
                      fontWeight: 700,
                      color: 'var(--ink)',
                      lineHeight: 1.4,
                    }}
                  >
                    {post.title}
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: 'var(--ink-secondary)',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.content}
                  </p>

                  {/* Image Thumbnails if any */}
                  {post.images && post.images.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        marginTop: 12,
                        overflowX: 'auto',
                      }}
                    >
                      {post.images.slice(0, 3).map((img, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: 100,
                            height: 70,
                            borderRadius: 8,
                            overflow: 'hidden',
                            position: 'relative',
                            flexShrink: 0,
                            border: '1px solid var(--line)',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {idx === 2 && post.images && post.images.length > 3 && (
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 13,
                                fontWeight: 700,
                              }}
                            >
                              +{post.images.length - 3}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Action Strip */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 16,
                      paddingTop: 12,
                      borderTop: '1px solid var(--line)',
                      fontSize: 13,
                      color: 'var(--muted)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      {/* Helpful Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleHelpful(post, e)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: hasVoted ? 'rgba(4, 120, 87, 0.12)' : 'none',
                          color: hasVoted ? '#047857' : 'var(--ink-secondary)',
                          border: hasVoted ? '1px solid #047857' : '1px solid var(--line)',
                          borderRadius: 8,
                          padding: '5px 12px',
                          cursor: 'pointer',
                          fontWeight: hasVoted ? 700 : 500,
                          fontSize: 12.5,
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <ThumbsUp size={14} />
                        <span>
                          {post.helpfulCount}{' '}
                          {isMr ? 'उपयुक्त' : 'Helpful'}
                        </span>
                      </button>

                      {/* Comment Count */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          color: 'var(--ink-secondary)',
                          fontSize: 12.5,
                        }}
                      >
                        <MessageSquare size={14} />
                        <span>
                          {post.commentCount} {isMr ? 'चर्चा' : 'Comments'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={(e) => handleSharePost(post, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--muted)',
                          padding: 6,
                          borderRadius: 6,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title={isMr ? 'शेअर करा' : 'Share link'}
                        aria-label="Share post link"
                      >
                        <Share2 size={15} />
                      </button>

                      {/* Report Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReportingPost(post);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--muted)',
                          padding: 6,
                          borderRadius: 6,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title={isMr ? 'तक्रार नोंदवा' : 'Report discussion'}
                        aria-label="Report post"
                      >
                        <Flag size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* 7. EMPTY STATE */
          <div
            style={{
              background: 'var(--surface)',
              border: '1px dashed var(--line)',
              borderRadius: 20,
              padding: '60px 24px',
              textAlign: 'center',
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(194, 65, 12, 0.08)',
                color: 'var(--brand-terracotta, #c2410c)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                marginBottom: 16,
              }}
            >
              💬
            </div>
            <h3
              style={{
                margin: '0 0 8px',
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              {isMr ? 'या निकषांसाठी चर्चा सापडली नाही' : 'No discussions found'}
            </h3>
            <p
              style={{
                margin: '0 auto 20px',
                maxWidth: 440,
                fontSize: 14,
                color: 'var(--muted)',
                lineHeight: 1.5,
              }}
            >
              {isMr
                ? 'निवडलेल्या निकषांनुसार अद्याप चर्चा किंवा प्रवास सल्ला उपलब्ध नाही. पहिले अनुभव शेअर करणारे बना!'
                : 'No community posts match your selected filter. Be the first explorer to share tips, experiences, or questions!'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn outline"
                style={{ fontSize: 13.5, padding: '9px 18px' }}
              >
                {isMr ? 'फिल्टर्स रीसेट करा' : 'Reset Filters'}
              </button>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(true)}
                className="btn btn-primary"
                style={{ fontSize: 13.5, padding: '9px 20px' }}
              >
                ＋ {isMr ? 'पहिला अनुभव शेअर करा' : 'Share the First Experience'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 40,
        }}
      >
        <button
          type="button"
          onClick={() => setIsPostModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            padding: '13px 22px',
            fontSize: 14.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 6px 20px rgba(194, 65, 12, 0.4)',
            cursor: 'pointer',
          }}
          aria-label="Create new community discussion"
        >
          <Plus size={18} />
          <span>{isMr ? 'अनुभव लिहा' : 'Share Tip / Story'}</span>
        </button>
      </div>

      {/* MODALS */}
      {/* 1. Composer Modal */}
      <CommunityPostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        initialPlaceId={selectedPlaceId !== 'all' ? selectedPlaceId : undefined}
        onPostCreated={(newPost) => {
          setPosts((prev) => [newPost, ...prev]);
        }}
      />

      {/* 2. Detail Modal */}
      <CommunityPostDetailModal
        post={selectedDetailPost}
        isOpen={Boolean(selectedDetailPost)}
        onClose={() => setSelectedDetailPost(null)}
        onPostUpdated={(updated) => {
          setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setSelectedDetailPost(updated);
        }}
        onSelectRelatedPost={(related) => {
          setSelectedDetailPost(related);
        }}
      />

      {/* 3. Report Modal */}
      {reportingPost && (
        <CommunityReportModal
          isOpen={Boolean(reportingPost)}
          onClose={() => setReportingPost(null)}
          targetId={reportingPost.id}
          targetType="post"
          targetTitle={reportingPost.title}
        />
      )}

      {/* Toast Feedback */}
      {shareToast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--ink, #111827)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          ✓ {isMr ? 'चर्चेची लिंक कॉपी झाली!' : 'Discussion link copied to clipboard!'}
        </div>
      )}
    </main>
  );
}

export default function CommunityClient() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading Pune Community...</div>
        </div>
      }
    >
      <CommunityContent />
    </Suspense>
  );
}

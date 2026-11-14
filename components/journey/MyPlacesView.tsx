'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Camera,
  Film,
  Bookmark,
  Share2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { StructuredPlace } from '@/lib/chatKnowledgeEngine';
import { MemoryMediaItem, DestinationVisitRecord } from '@/lib/memoryAlbumStorage';
import { SavedPlaceSummary } from '@/lib/savedPlaces';

interface MyPlacesViewProps {
  allPlaces: StructuredPlace[];
  savedPlaces: SavedPlaceSummary[];
  allMemories: MemoryMediaItem[];
  allVisits: DestinationVisitRecord[];
  isMr: boolean;
  onSelectPlaceDetails: (place: StructuredPlace) => void;
  onCreatePlaceReel: (place: StructuredPlace) => void;
  onAddPlacePhotos: (place: StructuredPlace) => void;
  onToggleSavePlace: (place: StructuredPlace) => void;
}

type PlaceStatusFilter = 'all' | 'visited' | 'saved' | 'month' | 'has_photos' | 'has_reels';
type PlaceSortOption = 'recent' | 'most_visited' | 'photos' | 'alpha';

export default function MyPlacesView({
  allPlaces,
  savedPlaces,
  allMemories,
  allVisits,
  isMr,
  onSelectPlaceDetails,
  onCreatePlaceReel,
  onAddPlacePhotos,
  onToggleSavePlace,
}: MyPlacesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PlaceStatusFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<PlaceSortOption>('recent');

  // Mappings for fast lookup
  const savedPlaceIds = useMemo(() => new Set(savedPlaces.map((s) => s.id || s.slug)), [savedPlaces]);

  // Place visits map: placeId -> DestinationVisitRecord[]
  const placeVisitsMap = useMemo(() => {
    const map = new Map<string, DestinationVisitRecord[]>();
    for (const v of allVisits) {
      const list = map.get(v.placeId) || [];
      list.push(v);
      map.set(v.placeId, list);
    }
    return map;
  }, [allVisits]);

  // Place memories count map: placeId -> count
  const placeMemoriesMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of allMemories) {
      map.set(m.placeId, (map.get(m.placeId) || 0) + 1);
    }
    return map;
  }, [allMemories]);

  // Categories list extracted from all places
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of allPlaces) {
      if (p.category) set.add(p.category);
    }
    return Array.from(set).sort();
  }, [allPlaces]);

  // Current month prefix for "explored this month"
  const currentMonthPrefix = new Date().toISOString().slice(0, 7);

  // Filtered & sorted places
  const displayedPlaces = useMemo(() => {
    return allPlaces
      .filter((place) => {
        const visits = placeVisitsMap.get(place.id) || placeVisitsMap.get(place.slug) || [];
        const isVisited = visits.length > 0;
        const isSaved = savedPlaceIds.has(place.id) || savedPlaceIds.has(place.slug);
        const photoCount = placeMemoriesMap.get(place.id) || placeMemoriesMap.get(place.slug) || 0;
        const visitedThisMonth = visits.some((v) => v.visitedDate?.startsWith(currentMonthPrefix));

        // 1. Status Filter
        if (statusFilter === 'visited' && !isVisited) return false;
        if (statusFilter === 'saved' && !isSaved) return false;
        if (statusFilter === 'month' && !visitedThisMonth) return false;
        if (statusFilter === 'has_photos' && photoCount === 0) return false;

        // 2. Category Filter
        if (selectedCategory !== 'all' && place.category !== selectedCategory) return false;

        // 3. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = place.name.toLowerCase().includes(q);
          const matchMr = place.name_mr ? place.name_mr.includes(q) : false;
          const matchCat = place.category ? place.category.toLowerCase().includes(q) : false;
          const matchAddr = place.address ? place.address.toLowerCase().includes(q) : false;
          if (!matchName && !matchMr && !matchCat && !matchAddr) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const visitsA = placeVisitsMap.get(a.id) || placeVisitsMap.get(a.slug) || [];
        const visitsB = placeVisitsMap.get(b.id) || placeVisitsMap.get(b.slug) || [];
        const photosA = placeMemoriesMap.get(a.id) || placeMemoriesMap.get(a.slug) || 0;
        const photosB = placeMemoriesMap.get(b.id) || placeMemoriesMap.get(b.slug) || 0;

        if (sortOption === 'most_visited') {
          return visitsB.length - visitsA.length;
        }
        if (sortOption === 'photos') {
          return photosB - photosA;
        }
        if (sortOption === 'alpha') {
          return a.name.localeCompare(b.name);
        }
        // default: 'recent'
        const dateA = visitsA[0]?.visitedDate || '';
        const dateB = visitsB[0]?.visitedDate || '';
        return dateB.localeCompare(dateA);
      });
  }, [
    allPlaces,
    searchQuery,
    statusFilter,
    selectedCategory,
    sortOption,
    placeVisitsMap,
    savedPlaceIds,
    placeMemoriesMap,
    currentMonthPrefix,
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header and Controls */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#0f172a' }}>
              {isMr ? 'माझी ठिकाणे (१०६ पुणे ठिकाणे)' : 'My Places (106 Pune Destinations)'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              {isMr
                ? `एकूण ${displayedPlaces.length} ठिकाणे दाखवत आहे. तुमच्या भेटी व आठवणी व्यवस्थापित करा.`
                : `Showing ${displayedPlaces.length} destinations. Filter visited places, create reels, or log memories.`}
            </p>
          </div>

          {/* Quick Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 12,
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              minWidth: 260,
            }}
          >
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder={isMr ? 'नाव, विभाग किंवा गड शोधा…' : 'Search name, category, fort…'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 13,
                width: '100%',
                color: '#0f172a',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status Filters Bar */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { id: 'all', label: isMr ? 'सर्व (१०६)' : 'All (106)' },
            { id: 'visited', label: isMr ? '✓ भेट दिलेली' : '✓ Visited' },
            { id: 'saved', label: isMr ? '📍 जतन केलेली' : '📍 Bookmarked' },
            { id: 'month', label: isMr ? '🗓️ या महिन्यात' : '🗓️ This Month' },
            { id: 'has_photos', label: isMr ? '📸 फोटो असलेल्या' : '📸 With Photos' },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as PlaceStatusFilter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 500,
                  border: active ? '1px solid #ea580c' : '1px solid #e2e8f0',
                  background: active ? '#fff7ed' : '#ffffff',
                  color: active ? '#ea580c' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowUpDown size={14} color="#64748b" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as PlaceSortOption)}
              style={{
                padding: '6px 10px',
                borderRadius: 10,
                fontSize: 12,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="recent">{isMr ? 'नुकतीच भेट दिलेली' : 'Recently Visited'}</option>
              <option value="most_visited">{isMr ? 'सर्वाधिक भेटी' : 'Most Visited'}</option>
              <option value="photos">{isMr ? 'सर्वात जास्त फोटो' : 'Highest Photos'}</option>
              <option value="alpha">{isMr ? 'अ-ते-ज्ञ मुळाक्षर' : 'Alphabetical (A-Z)'}</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', paddingTop: 4 }}>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 11.5,
              fontWeight: selectedCategory === 'all' ? 700 : 500,
              border: 'none',
              background: selectedCategory === 'all' ? '#0f172a' : '#f1f5f9',
              color: selectedCategory === 'all' ? '#ffffff' : '#64748b',
              cursor: 'pointer',
            }}
          >
            {isMr ? 'सर्व प्रकार' : 'All Categories'}
          </button>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: active ? 700 : 500,
                  border: 'none',
                  background: active ? '#0f172a' : '#f1f5f9',
                  color: active ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Places Grid */}
      {displayedPlaces.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            borderRadius: 20,
            background: '#ffffff',
            border: '1px dashed #cbd5e1',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <MapPin size={36} color="#94a3b8" />
          <h3 style={{ margin: 0, fontSize: 16, color: '#334155' }}>
            {isMr ? 'कोणतेही ठिकाण सापडले नाही' : 'No destinations match your filters'}
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            {isMr
              ? 'कृपया तुमचे शोध शब्द किंवा फिल्टर्स बदला.'
              : 'Try clearing your search query or switching filter tabs.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setSelectedCategory('all');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isMr ? 'फिल्टर्स पूर्ववत करा' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 18,
          }}
        >
          {displayedPlaces.map((place) => {
            const visits = placeVisitsMap.get(place.id) || placeVisitsMap.get(place.slug) || [];
            const isVisited = visits.length > 0;
            const isSaved = savedPlaceIds.has(place.id) || savedPlaceIds.has(place.slug);
            const photoCount = placeMemoriesMap.get(place.id) || placeMemoriesMap.get(place.slug) || 0;
            const lastVisit = visits[0]?.visitedDate ? visits[0].visitedDate.slice(0, 10) : null;

            return (
              <div
                key={place.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 18,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                }}
              >
                {/* Image Header with Badges */}
                <div style={{ position: 'relative', width: '100%', height: 160, backgroundColor: '#e2e8f0' }}>
                  <img
                    src={place.image_url || '/images/places/shaniwar-wada.jpg'}
                    alt={place.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 8,
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {place.category}
                    </span>
                    <span
                      style={{
                        padding: '3px 7px',
                        borderRadius: 8,
                        background: '#059669',
                        color: '#ffffff',
                        fontSize: 10,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <CheckCircle2 size={11} />
                      {isMr ? 'तपासलेले' : 'Verified'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSavePlace(place);
                    }}
                    title={isSaved ? 'Remove bookmark' : 'Bookmark place'}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Bookmark size={15} color={isSaved ? '#ea580c' : '#64748b'} fill={isSaved ? '#ea580c' : 'none'} />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <div>
                    <h3
                      onClick={() => onSelectPlaceDetails(place)}
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                        color: '#0f172a',
                        cursor: 'pointer',
                      }}
                    >
                      {isMr && place.name_mr ? place.name_mr : place.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', marginTop: 3 }}>
                      <MapPin size={12} color="#ea580c" />
                      <span>{place.address ? place.address.split(',')[0] : 'Pune'}</span>
                    </div>
                  </div>

                  {/* Visit status pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {isVisited ? (
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 8,
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                        }}
                      >
                        {isMr
                          ? `✓ ${visits.length} वेळा भेट (${lastVisit || ''})`
                          : `✓ Visited ${visits.length} time${visits.length > 1 ? 's' : ''}${lastVisit ? ` (${lastVisit})` : ''}`}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 8,
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                        }}
                      >
                        {isMr ? 'अजून भेट नाही' : 'Not visited yet'}
                      </span>
                    )}

                    {photoCount > 0 && (
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 8,
                          backgroundColor: '#fff7ed',
                          color: '#c2410c',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Camera size={11} />
                        {photoCount} {isMr ? 'फोटो' : 'photos'}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 12,
                      borderTop: '1px solid #f1f5f9',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPlaceDetails(place)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 10,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#1e293b',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {isMr ? 'आठवणी पहा' : 'View Memories'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onCreatePlaceReel(place)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                      }}
                    >
                      <Film size={12} />
                      <span>{isMr ? 'रील बनवा' : 'Create Reel'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

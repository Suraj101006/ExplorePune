'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { User } from 'firebase/auth';
import {
  Compass,
  MapPin,
  Camera,
  Film,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  Trophy,
  Heart,
  Clock,
  Share2,
} from 'lucide-react';
import { StructuredPlace } from '@/lib/chatKnowledgeEngine';
import { MemoryMediaItem, DestinationVisitRecord } from '@/lib/memoryAlbumStorage';
import { DayJourney } from '@/lib/journeyStorage';
import { JourneyViewKey } from './JourneySidebar';

interface JourneyDashboardViewProps {
  user: User | null;
  isMr: boolean;
  journeys: DayJourney[];
  visitedPlaces: StructuredPlace[];
  allMemories: MemoryMediaItem[];
  savedReelsCount: number;
  draftsCount: number;
  recentVisits: DestinationVisitRecord[];
  onNavigate: (view: JourneyViewKey, contextData?: any) => void;
  onOpenAddMemory: () => void;
  onOpenPlanJourney: () => void;
  onSelectPlaceDetails: (place: StructuredPlace) => void;
}

export default function JourneyDashboardView({
  user,
  isMr,
  journeys,
  visitedPlaces,
  allMemories,
  savedReelsCount,
  draftsCount,
  recentVisits,
  onNavigate,
  onOpenAddMemory,
  onOpenPlanJourney,
  onSelectPlaceDetails,
}: JourneyDashboardViewProps) {
  const userName = user?.displayName || user?.email?.split('@')[0] || (isMr ? 'पुणेकर प्रवासी' : 'Pune Explorer');

  // Calculate actual user statistics
  const totalVisited = visitedPlaces.length;
  const totalPhotos = allMemories.filter((m) => m.type === 'photo').length;
  const totalVideos = allMemories.filter((m) => m.type === 'video').length;
  const favoriteMemories = allMemories.filter((m) => m.isFavorite);

  // Calculate unique exploration days
  const explorationDaysSet = new Set<string>();
  journeys.forEach((j) => {
    if (j.date) explorationDaysSet.add(j.date);
  });
  recentVisits.forEach((v) => {
    const vDate = v.visitDate || v.visitedDate;
    if (vDate) explorationDaysSet.add(vDate.slice(0, 10));
  });
  const totalExplorationDays = explorationDaysSet.size || (journeys.length > 0 ? journeys.length : 0);

  // Latest visited place
  const latestPlace = visitedPlaces[0] || null;

  // Monthly progress: destinations visited in current month
  const currentMonthPrefix = new Date().toISOString().slice(0, 7);
  const thisMonthVisits = recentVisits.filter((v) =>
    (v.visitDate || v.visitedDate || '').startsWith(currentMonthPrefix)
  );
  const thisMonthTarget = 6;
  const monthlyProgressPercent = Math.min(100, Math.round((thisMonthVisits.length / thisMonthTarget) * 100));

  // Top recently explored places (up to 4)
  const recentPlacesDisplay = visitedPlaces.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* 1. Hero Banner */}
      <section
        style={{
          borderRadius: 24,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
          color: '#ffffff',
          padding: 'clamp(24px, 4vw, 36px)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px -6px rgba(15, 23, 42, 0.3)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -24,
            top: -24,
            opacity: 0.05,
            pointerEvents: 'none',
          }}
        >
          <Compass size={280} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 20,
                background: 'rgba(234, 88, 12, 0.25)',
                border: '1px solid rgba(234, 88, 12, 0.5)',
                color: '#fb923c',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span>🏛️</span>
              <span>{isMr ? 'पुणे वैयक्तिक प्रवास व्यासपीठ' : 'Explore Pune Travel Memories'}</span>
            </span>

            {user && (
              <span
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '4px 10px',
                  borderRadius: 20,
                }}
              >
                {user.email}
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 4.2vw, 38px)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {isMr ? 'तुमचा प्रवास, तुमच्या आठवणी.' : 'Your Journey, Your Memories.'}
          </h1>

          <p
            style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: '#cbd5e1',
              margin: 0,
              maxWidth: 620,
              lineHeight: 1.5,
            }}
          >
            {isMr
              ? 'तुम्ही अनुभवलेला प्रत्येक ऐतिहासिक गड, संस्कृती आणि ठिकाण एक अजरामर गोष्ट बनते. तुमची वैयक्तिक प्रवास दैनंदिनी.'
              : 'Every place you explore becomes a story worth remembering. Track your visits, relive moments, and export cinematic 9:16 reels.'}
          </p>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: 12,
              marginTop: 12,
              paddingTop: 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                {isMr ? 'ठिकाणे भेट' : 'Places Visited'}
              </span>
              <strong style={{ display: 'block', fontSize: 22, color: '#34d399', marginTop: 2 }}>
                {totalVisited}
              </strong>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                {isMr ? 'प्रवास दिवस' : 'Exploration Days'}
              </span>
              <strong style={{ display: 'block', fontSize: 22, color: '#60a5fa', marginTop: 2 }}>
                {totalExplorationDays}
              </strong>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                {isMr ? 'फोटो व व्हिडिओ' : 'Photos & Videos'}
              </span>
              <strong style={{ display: 'block', fontSize: 22, color: '#fb923c', marginTop: 2 }}>
                {totalPhotos + totalVideos}
              </strong>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                {isMr ? 'सिनेमॅटिक रील' : 'Saved Reels'}
              </span>
              <strong style={{ display: 'block', fontSize: 22, color: '#a78bfa', marginTop: 2 }}>
                {savedReelsCount}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Functional Quick Actions (6 Buttons) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={onOpenAddMemory}
          style={{
            padding: '14px 16px',
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid #fed7aa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.08)',
            transition: 'transform 0.16s ease, box-shadow 0.16s ease',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#fff7ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Camera size={18} color="#ea580c" />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#0f172a' }}>
              {isMr ? 'आठवण जोडा' : 'Add Memory'}
            </strong>
            <span style={{ fontSize: 11.5, color: '#64748b' }}>
              {isMr ? 'फोटो व कॅप्शन सेव्ह करा' : 'Upload photo & note'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('places')}
          style={{
            padding: '14px 16px',
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.16s ease',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapPin size={18} color="#10b981" />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#0f172a' }}>
              {isMr ? 'माझी ठिकाणे' : 'Explore My Places'}
            </strong>
            <span style={{ fontSize: 11.5, color: '#64748b' }}>
              {isMr ? 'पुण्यातील १०६ ठिकाणे' : '106 Pune destinations'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('studio')}
          style={{
            padding: '14px 16px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            border: 'none',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
            transition: 'transform 0.16s ease',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Film size={18} color="#ffffff" />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#ffffff' }}>
              {isMr ? 'सिनेमॅटिक रील बनवा' : 'Create Location Reel'}
            </strong>
            <span style={{ fontSize: 11.5, color: '#e9d5ff' }}>
              {isMr ? 'संगीत व MP4 सह' : 'With music & MP4'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('day')}
          style={{
            padding: '14px 16px',
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.16s ease',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={18} color="#d97706" />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#0f172a' }}>
              {isMr ? 'माझा आजचा दिवस' : 'Create Day Journey'}
            </strong>
            <span style={{ fontSize: 11.5, color: '#64748b' }}>
              {isMr ? 'दैनिक प्रवास व कथा' : 'Daily timeline & story'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('month')}
          style={{
            padding: '14px 16px',
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.16s ease',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} color="#2563eb" />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#0f172a' }}>
              {isMr ? 'मासिक रील' : 'Create Monthly Reel'}
            </strong>
            <span style={{ fontSize: 11.5, color: '#64748b' }}>
              {isMr ? '३० ते ९० सेकंद' : '30-90s monthly recap'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('timeline')}
          style={{
            padding: '14px 16px',
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.16s ease',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#fdf2f8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Compass size={18} color="#db2777" />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#0f172a' }}>
              {isMr ? 'नकाशा व प्रवास' : 'View Timeline & Map'}
            </strong>
            <span style={{ fontSize: 11.5, color: '#64748b' }}>
              {isMr ? 'नकाशावर ठिकाणे' : 'Interactive trail'}
            </span>
          </div>
        </button>
      </section>

      {/* 3. Monthly Exploration Progress Meter */}
      <section
        style={{
          background: '#ffffff',
          borderRadius: 18,
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {isMr ? 'या महिन्यातील प्रवास प्रगती' : 'Monthly Exploration Progress'}
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {isMr
                ? `${thisMonthVisits.length} / ${thisMonthTarget} ठिकाणे भेट दिली (${new Date().toLocaleString('default', { month: 'long' })})`
                : `${thisMonthVisits.length} of ${thisMonthTarget} destinations explored in ${new Date().toLocaleString('default', { month: 'long' })}`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('month')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              border: 'none',
              background: 'transparent',
              color: '#ea580c',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>{isMr ? 'तपशील' : 'View Details'}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Progress Track */}
        <div
          style={{
            width: '100%',
            height: 10,
            borderRadius: 5,
            backgroundColor: '#f1f5f9',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${monthlyProgressPercent}%`,
              height: '100%',
              borderRadius: 5,
              background: 'linear-gradient(90deg, #ea580c 0%, #f97316 100%)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </section>

      {/* 4. Recently Explored Destinations */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {isMr ? 'नुकतीच भेट दिलेली ठिकाणे' : 'Recently Explored Destinations'}
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {isMr ? 'तुमच्या भेटी आणि आठवणी' : 'Destinations you have documented'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('places')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              border: 'none',
              background: 'transparent',
              color: '#ea580c',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>{isMr ? 'सर्व १०६ ठिकाणे' : 'See all 106'}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {recentPlacesDisplay.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              borderRadius: 16,
              background: '#ffffff',
              border: '1px dashed #cbd5e1',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Compass size={32} color="#94a3b8" />
            <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
              {isMr
                ? 'अजून कोणत्याही ठिकाणाला भेट नोंदवलेली नाही. ठिकाण निवडून प्रवास सुरू करा!'
                : 'No destinations logged yet. Explore 106 Pune places and start logging your memories!'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('places')}
              style={{
                marginTop: 6,
                padding: '8px 18px',
                borderRadius: 10,
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isMr ? 'ठिकाणे शोधा' : 'Browse Destinations'}
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {recentPlacesDisplay.map((place) => (
              <div
                key={place.id}
                onClick={() => onSelectPlaceDetails(place)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                  boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: 140, backgroundColor: '#f1f5f9' }}>
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
                      padding: '3px 8px',
                      borderRadius: 8,
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {place.category}
                  </div>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                    {isMr && place.name_mr ? place.name_mr : place.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                    <MapPin size={13} color="#ea580c" />
                    <span>{place.address ? place.address.split(',')[0] : 'Pune'}</span>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 11.5, color: '#10b981', fontWeight: 700 }}>
                      ✓ {isMr ? 'भेट दिली' : 'Documented'}
                    </span>
                    <span style={{ fontSize: 12, color: '#ea580c', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      {isMr ? 'पहा' : 'View'} <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Featured Memories & Favorite Moments */}
      {favoriteMemories.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Heart size={18} color="#ef4444" fill="#ef4444" />
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0f172a' }}>
                {isMr ? 'आवडत्या आठवणी' : 'Featured Favorite Memories'}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('memories')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                border: 'none',
                background: 'transparent',
                color: '#ea580c',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>{isMr ? 'सर्व आठवणी' : 'All memories'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            {favoriteMemories.slice(0, 4).map((memory) => (
              <div
                key={memory.id}
                onClick={() => onNavigate('memories')}
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  position: 'relative',
                  height: 180,
                  cursor: 'pointer',
                  backgroundColor: '#0f172a',
                }}
              >
                <img
                  src={memory.url}
                  alt={memory.caption || 'Memory'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 10,
                    color: '#ffffff',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>
                    {memory.caption || (isMr ? 'पुणे आठवण' : 'Pune memory')}
                  </span>
                  <span style={{ fontSize: 10, color: '#cbd5e1', marginTop: 2 }}>
                    {memory.placeName || 'Pune'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

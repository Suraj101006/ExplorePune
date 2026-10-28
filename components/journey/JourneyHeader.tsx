'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { User } from 'firebase/auth';
import {
  Compass,
  Sparkles,
  Plus,
  MapPin,
  Film,
  Camera,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface JourneyHeaderProps {
  user: User | null;
  totalJourneys: number;
  totalVisited: number;
  totalMemories: number;
  totalReels: number;
  activeTab: 'journeys' | 'memories' | 'reels' | 'saved';
  onTabChange: (tab: 'journeys' | 'memories' | 'reels' | 'saved') => void;
  onPlanJourney: () => void;
  onCreateReel: () => void;
}

export default function JourneyHeader({
  user,
  totalJourneys,
  totalVisited,
  totalMemories,
  totalReels,
  activeTab,
  onTabChange,
  onPlanJourney,
  onCreateReel,
}: JourneyHeaderProps) {
  const { isMr } = useLanguage();

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || (isMr ? 'पुणेकर' : 'Explorer');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Editorial Hero Header Banner */}
      <div
        style={{
          position: 'relative',
          padding: '28px 32px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Subtle decorative background watermarks */}
        <div
          style={{
            position: 'absolute',
            right: -20,
            bottom: -30,
            opacity: 0.06,
            pointerEvents: 'none',
          }}
        >
          <Compass size={240} />
        </div>

        {/* Top Greeting & Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 2 }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 20,
                background: 'rgba(234, 88, 12, 0.2)',
                border: '1px solid rgba(234, 88, 12, 0.45)',
                color: '#fb923c',
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              <span>🏛️</span>
              <span>{isMr ? 'पुणे प्रवास दैनंदिनी' : 'Pune Travel Journal & Reel Studio'}</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: '0 0 6px',
                color: '#ffffff',
              }}
            >
              {isMr ? 'माझा प्रवास' : 'My Journey'}
            </h1>

            <p style={{ margin: 0, fontSize: 15, color: '#94a3b8', maxWidth: 540 }}>
              {isMr
                ? 'तुमच्या पुणे सफरी, आठवणी आणि सिनेमॅटिक रील एकाच ठिकाणी.'
                : 'Your Pune adventures, collected in one place.'}
            </p>

            {user && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>👋</span>
                <span>
                  {isMr ? `स्वागत आहे, ${userDisplayName}!` : `Welcome back, ${userDisplayName}!`}
                </span>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onPlanJourney}
              style={{
                padding: '11px 20px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: 13.5,
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(234, 88, 12, 0.35)',
                transition: 'transform 0.16s ease',
              }}
            >
              <Plus size={18} />
              <span>{isMr ? 'नवीन सफर आखा' : 'Plan a Journey'}</span>
            </button>

            <button
              type="button"
              onClick={onCreateReel}
              style={{
                padding: '11px 18px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: 13.5,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.16s ease',
              }}
            >
              <Sparkles size={16} />
              <span>{isMr ? 'सिनेमॅटिक रील' : 'Create Reel'}</span>
            </button>
          </div>
        </div>

        {/* Truthful Real Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            paddingTop: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isMr ? 'एकूण सफरी' : 'Journeys'}
            </span>
            <strong style={{ display: 'block', fontSize: 20, color: '#ffffff', marginTop: 2 }}>
              {totalJourneys}
            </strong>
          </div>

          <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isMr ? 'ठिकाणे भेट दिली' : 'Stops Explored'}
            </span>
            <strong style={{ display: 'block', fontSize: 20, color: '#34d399', marginTop: 2 }}>
              {totalVisited}
            </strong>
          </div>

          <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isMr ? 'आठवणी फोटो' : 'Memories'}
            </span>
            <strong style={{ display: 'block', fontSize: 20, color: '#fb923c', marginTop: 2 }}>
              {totalMemories}
            </strong>
          </div>

          <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isMr ? 'तयार केलेले रील' : 'Reels Exported'}
            </span>
            <strong style={{ display: 'block', fontSize: 20, color: '#60a5fa', marginTop: 2 }}>
              {totalReels}
            </strong>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: 2,
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'journeys', label: isMr ? '📔 सर्व सफरी (Journeys)' : '📔 All Journeys', count: totalJourneys },
          { id: 'memories', label: isMr ? '📸 आठवणी गॅलरी (Memories)' : '📸 Memory Gallery', count: totalMemories },
          { id: 'reels', label: isMr ? '🎬 रील स्टुडिओ (Reels)' : '🎬 Reel Studio', count: totalReels },
          { id: 'saved', label: isMr ? '📍 जतन केलेली ठिकाणे' : '📍 Saved Places' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id as any)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px 10px 0 0',
                border: 'none',
                background: isActive ? '#ffffff' : 'transparent',
                borderBottom: isActive ? '3px solid #ea580c' : '3px solid transparent',
                color: isActive ? '#ea580c' : '#64748b',
                fontSize: 14,
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.16s ease',
              }}
            >
              <span>{tab.label}</span>
              {typeof (tab as any).count === 'number' && (
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: 12,
                    background: isActive ? '#fff7ed' : '#f1f5f9',
                    color: isActive ? '#ea580c' : '#64748b',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {(tab as any).count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

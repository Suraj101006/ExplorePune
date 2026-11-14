'use client';

import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Compass,
  Image as ImageIcon,
  Sun,
  Calendar,
  Film,
  FolderHeart,
  Route,
  Trophy,
  Settings,
  ChevronRight,
} from 'lucide-react';

export type JourneyViewKey =
  | 'dashboard'
  | 'places'
  | 'details'
  | 'memories'
  | 'day'
  | 'month'
  | 'studio'
  | 'saved_reels'
  | 'timeline'
  | 'achievements'
  | 'settings';

interface JourneySidebarProps {
  activeView: JourneyViewKey;
  onViewChange: (view: JourneyViewKey) => void;
  stats: {
    visitedPlaces: number;
    totalMemories: number;
    totalReels: number;
    totalDrafts: number;
    achievementsUnlocked: number;
  };
  isMr: boolean;
  selectedPlaceName?: string | null;
}

interface NavItem {
  key: JourneyViewKey;
  label: string;
  labelMr: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  group: 'core' | 'creation' | 'journal' | 'personal';
}

export default function JourneySidebar({
  activeView,
  onViewChange,
  stats,
  isMr,
  selectedPlaceName,
}: JourneySidebarProps) {
  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      label: 'Journey Dashboard',
      labelMr: 'डॅशबोर्ड',
      icon: LayoutDashboard,
      group: 'core',
    },
    {
      key: 'places',
      label: 'My Places (106)',
      labelMr: 'माझी ठिकाणे',
      icon: MapPin,
      badge: stats.visitedPlaces,
      badgeColor: '#10b981',
      group: 'core',
    },
    {
      key: 'details',
      label: selectedPlaceName ? selectedPlaceName : 'Place Memories',
      labelMr: selectedPlaceName ? selectedPlaceName : 'ठिकाण आठवणी',
      icon: Compass,
      group: 'core',
    },
    {
      key: 'memories',
      label: 'My Memories',
      labelMr: 'माझ्या आठवणी',
      icon: ImageIcon,
      badge: stats.totalMemories,
      badgeColor: '#ea580c',
      group: 'journal',
    },
    {
      key: 'day',
      label: 'Day Journey',
      labelMr: 'माझा आजचा दिवस',
      icon: Sun,
      group: 'journal',
    },
    {
      key: 'month',
      label: 'Monthly Journey',
      labelMr: 'मासिक प्रवास',
      icon: Calendar,
      group: 'journal',
    },
    {
      key: 'studio',
      label: 'Reel Studio 9:16',
      labelMr: 'सिनेमॅटिक रील स्टुडिओ',
      icon: Film,
      badge: 'PRO',
      badgeColor: '#8b5cf6',
      group: 'creation',
    },
    {
      key: 'saved_reels',
      label: 'Saved Reels & Projects',
      labelMr: 'जतन केलेले रील व मसुदे',
      icon: FolderHeart,
      badge: stats.totalReels + stats.totalDrafts,
      badgeColor: '#3b82f6',
      group: 'creation',
    },
    {
      key: 'timeline',
      label: 'Timeline & Map',
      labelMr: 'प्रवास नकाशा व टाईमलाईन',
      icon: Route,
      group: 'journal',
    },
    {
      key: 'achievements',
      label: 'Achievements',
      labelMr: 'प्रवास पदके',
      icon: Trophy,
      badge: `${stats.achievementsUnlocked}/8`,
      badgeColor: '#f59e0b',
      group: 'personal',
    },
    {
      key: 'settings',
      label: 'Settings & Profile',
      labelMr: 'सेटिंग्ज व प्रोफाईल',
      icon: Settings,
      group: 'personal',
    },
  ];

  return (
    <aside
      role="navigation"
      aria-label="My Journey Navigation"
      style={{
        width: '100%',
        maxWidth: 260,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
        padding: '16px 12px',
        boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignSelf: 'flex-start',
        position: 'sticky',
        top: 84,
      }}
    >
      <div style={{ padding: '4px 10px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: 4 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#94a3b8',
          }}
        >
          {isMr ? 'प्रवास विभाग' : 'Explore Modules'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => {
          const isActive = activeView === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onViewChange(item.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: 12,
                border: 'none',
                background: isActive ? '#fff7ed' : 'transparent',
                color: isActive ? '#ea580c' : '#334155',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13.5,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.16s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Icon size={17} color={isActive ? '#ea580c' : '#64748b'} />
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isMr ? item.labelMr : item.label}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {item.badge !== undefined && item.badge !== null && (
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 10,
                      backgroundColor: isActive ? '#ea580c' : (item.badgeColor || '#94a3b8'),
                      color: '#ffffff',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={14} color="#ea580c" />}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

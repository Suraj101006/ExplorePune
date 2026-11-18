'use client';

import React, { useEffect, useState } from 'react';
import { X, Trophy, MapPin, Compass, Flag, Award, Sparkles, Navigation } from 'lucide-react';
import { ambientAudio } from '@/lib/experience/ambientAudio';

export type GameNotificationType =
  | 'mission_started'
  | 'destination_discovered'
  | 'waypoint_added'
  | 'mission_completed'
  | 'achievement_unlocked';

export interface GameNotification {
  id: string;
  type: GameNotificationType;
  title: string;
  subtitle?: string;
  xp?: number;
  icon?: string;
  badge?: string;
  durationMs?: number;
}

interface GameNotificationBannerProps {
  notification: GameNotification | null;
  onDismiss: () => void;
  lang?: string;
}

export default function GameNotificationBanner({
  notification,
  onDismiss,
  lang = 'en',
}: GameNotificationBannerProps) {
  const isMr = lang === 'mr';
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    if (!notification) return;

    // Play corresponding subtle audio chime
    if (notification.type === 'achievement_unlocked' || notification.type === 'mission_completed') {
      ambientAudio.playAchievementChime();
    } else if (notification.type === 'destination_discovered') {
      ambientAudio.playDiscoveryPing(notification.xp ? notification.xp * 4 : 520);
    } else {
      ambientAudio.playUiBlip(880, 0.06);
    }

    const duration = notification.durationMs || 4200;
    const interval = 50;
    const step = 100 / (duration / interval);

    setProgress(100);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  // Visual theming based on notification type
  const theme = {
    mission_started: {
      border: 'border-cyan-500/50',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      defaultIcon: <Flag size={18} />,
      label: isMr ? 'नवीन मोहीम सुरू' : 'MISSION STARTED',
    },
    destination_discovered: {
      border: 'border-emerald-500/50',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      defaultIcon: <MapPin size={18} />,
      label: isMr ? 'स्थळ अन्वेषण' : 'DESTINATION DISCOVERED',
    },
    waypoint_added: {
      border: 'border-sky-500/50',
      badgeBg: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
      glow: 'shadow-[0_0_30px_rgba(14,165,233,0.25)]',
      iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      defaultIcon: <Navigation size={18} />,
      label: isMr ? 'मार्ग दर्शक बिंदू' : 'WAYPOINT SET',
    },
    mission_completed: {
      border: 'border-amber-500/60',
      badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.35)]',
      iconBg: 'bg-amber-500/25 text-amber-400 border-amber-500/50',
      defaultIcon: <Trophy size={18} />,
      label: isMr ? 'मोहीम यशस्वी!' : 'MISSION COMPLETED',
    },
    achievement_unlocked: {
      border: 'border-amber-400/70',
      badgeBg: 'bg-amber-950/90 text-amber-200 border-amber-400/50',
      glow: 'shadow-[0_0_40px_rgba(251,191,36,0.4)]',
      iconBg: 'bg-amber-400/25 text-amber-300 border-amber-400/60',
      defaultIcon: <Award size={18} />,
      label: isMr ? 'यशोगाथा सन्मान!' : 'ACHIEVEMENT UNLOCKED',
    },
  }[notification.type];

  return (
    <div
      className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[110] w-[92%] max-w-md select-none font-mono pointer-events-auto animate-in slide-in-from-top-4 fade-in duration-300"
      role="status"
      aria-live="polite"
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border ${theme.border} ${theme.glow} p-3.5 sm:p-4 text-white shadow-2xl`}
      >
        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none gta-hud-scanlines opacity-40" />

        <div className="relative flex items-center gap-3.5">
          {/* Icon Badge */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${theme.iconBg} text-lg shadow-inner`}
          >
            {notification.icon || theme.defaultIcon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${theme.badgeBg}`}
              >
                {notification.badge || theme.label}
              </span>
              {notification.xp ? (
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                  <Sparkles size={10} />+{notification.xp} XP
                </span>
              ) : null}
            </div>

            <h4 className="text-sm font-black text-white truncate tracking-tight">
              {notification.title}
            </h4>

            {notification.subtitle ? (
              <p className="text-[11px] text-white/65 truncate font-sans">
                {notification.subtitle}
              </p>
            ) : null}
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss Notification"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

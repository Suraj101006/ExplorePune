'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle } from 'lucide-react';
import { ExplorationAchievement } from '@/lib/experience/achievements';
import { ambientAudio } from '@/lib/experience/ambientAudio';

interface AchievementToastProps {
  achievement: ExplorationAchievement | null;
  onDismiss: () => void;
  lang?: string;
}

export default function AchievementToast({
  achievement,
  onDismiss,
  lang = 'en',
}: AchievementToastProps) {
  const isMr = lang === 'mr';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      ambientAudio.playAchievementChime();
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 400);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement || !isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-6"
    >
      <div
        className="px-5 py-3.5 rounded-2xl bg-black/95 border-2 border-amber-400 text-white shadow-2xl flex items-center gap-4 max-w-md backdrop-blur-2xl"
        style={{
          boxShadow: '0 0 35px rgba(245, 158, 11, 0.4), inset 0 0 15px rgba(245, 158, 11, 0.1)',
        }}
      >
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/80 flex items-center justify-center text-3xl flex-shrink-0 animate-bounce">
          {achievement.icon || '🏆'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-400">
              {isMr ? '🏆 सन्मान प्राप्त!' : '🏆 ACHIEVEMENT UNLOCKED'}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              +{achievement.xp} XP
            </span>
          </div>
          <h4 className="text-sm font-black text-white tracking-tight truncate mt-0.5">
            {isMr ? achievement.titleMr : achievement.titleEn}
          </h4>
          <p className="text-[11px] text-white/70 line-clamp-1 font-sans">
            {isMr ? achievement.descriptionMr : achievement.descriptionEn}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="text-white/40 hover:text-white text-xs font-mono px-2 py-1"
          aria-label="Dismiss toast"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

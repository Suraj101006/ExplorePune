'use client';

import React from 'react';
import { Trophy, Award, CheckCircle2, Lock, X, Compass, MapPin } from 'lucide-react';
import { MASTER_ACHIEVEMENTS, UserExplorationProfile } from '@/lib/experience/achievements';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserExplorationProfile;
  totalLocations: number;
  lang?: string;
}

export default function AchievementsModal({
  isOpen,
  onClose,
  profile,
  totalLocations,
  lang = 'en',
}: AchievementsModalProps) {
  const isMr = lang === 'mr';

  if (!isOpen) return null;

  const unlockedCount = profile.unlockedAchievementIds.length;
  const progressPercent = Math.round((unlockedCount / MASTER_ACHIEVEMENTS.length) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        className="relative w-full max-w-xl bg-zinc-950/95 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-white"
        style={{ boxShadow: '0 0 50px rgba(245, 158, 11, 0.15)' }}
      >
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-amber-950/60 via-zinc-900/90 to-zinc-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Trophy size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {isMr ? 'पुणे शोधक प्रगती' : 'EXPLORATION PROGRESS'}
                </span>
                <span className="text-[11px] font-mono text-white/50">
                  {profile.totalXp} XP
                </span>
              </div>
              <h2 id="achievements-title" className="text-xl font-black text-white tracking-tight mt-1">
                {isMr ? 'शोध सन्मान व यशोगाथा' : 'Exploration Trophies & Milestones'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close achievements"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="px-6 py-3.5 bg-black/50 border-b border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4 text-white/70">
            <span>
              <strong className="text-emerald-400">{profile.visitedSlugs.length}</strong> / {totalLocations} {isMr ? 'स्थळे' : 'Discovered'}
            </span>
            <span>•</span>
            <span>
              <strong className="text-amber-400">{profile.visitedTalukas.length}</strong> / 15 {isMr ? 'तालुके' : 'Talukas'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">{progressPercent}%</span>
            <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {MASTER_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = profile.unlockedAchievementIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-lg'
                    : 'bg-white/[0.02] border-white/10 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-500/20 border border-amber-400/60 shadow-md'
                      : 'bg-white/5 border border-white/10 grayscale'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{isMr ? ach.titleMr : ach.titleEn}</span>
                      {isUnlocked && (
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      )}
                    </h3>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex-shrink-0">
                      +{ach.xp} XP
                    </span>
                  </div>

                  <p className="text-xs text-white/60 mt-1 leading-relaxed">
                    {isMr ? ach.descriptionMr : ach.descriptionEn}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-white/40">
                    <span className="flex items-center gap-1">
                      {isUnlocked ? (
                        <span className="text-emerald-400 font-semibold">● UNLOCKED</span>
                      ) : (
                        <span className="flex items-center gap-1 text-white/40">
                          <Lock size={10} /> LOCKED
                        </span>
                      )}
                    </span>
                    <span>{ach.code}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>{isMr ? 'नकाशा फिरून नवीन ठिकाणे शोधा आणि गुण मिळवा!' : 'Explore the live map to discover locations & earn trophies.'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
          >
            {isMr ? 'बंद करा' : 'CLOSE'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Trophy, Award, CheckCircle2, Lock, X, Compass, MapPin, Flag, Sparkles, Navigation } from 'lucide-react';
import {
  MASTER_ACHIEVEMENTS,
  UserExplorationProfile,
  getExplorerRank,
} from '@/lib/experience/achievements';
import { getAllPlaces, getPlaceBySlug } from '@/lib/experience/selectors';
import { ExperiencePlace } from '@/lib/experience/types';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserExplorationProfile;
  totalLocations: number;
  onFlyToPlace?: (place: ExperiencePlace) => void;
  lang?: string;
}

export default function AchievementsModal({
  isOpen,
  onClose,
  profile,
  totalLocations,
  onFlyToPlace,
  lang = 'en',
}: AchievementsModalProps) {
  const isMr = lang === 'mr';
  const [activeTab, setActiveTab] = useState<'trophies' | 'visited'>('trophies');

  if (!isOpen) return null;

  const unlockedCount = profile.unlockedAchievementIds.length;
  const progressPercent = Math.round((unlockedCount / MASTER_ACHIEVEMENTS.length) * 100);
  const rank = getExplorerRank(profile.totalXp);
  const allPlaces = getAllPlaces();
  const visitedPlaces = profile.visitedSlugs
    .map((slug) => getPlaceBySlug(slug))
    .filter(Boolean) as ExperiencePlace[];

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
        className="relative w-full max-w-2xl bg-zinc-950/95 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-white font-mono"
        style={{ boxShadow: '0 0 50px rgba(245, 158, 11, 0.2)' }}
      >
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-amber-950/70 via-zinc-900/90 to-zinc-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
              <Trophy size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  {rank.badge} · {isMr ? rank.titleMr : rank.titleEn}
                </span>
                <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles size={11} /> {profile.totalXp} XP
                </span>
              </div>
              <h2 id="achievements-title" className="text-xl font-black text-white tracking-tight mt-1">
                {isMr ? 'पुणे जिल्हा शोध सन्मान व यशोगाथा' : 'Exploration Trophies & District Progress'}
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

        {/* 4-Stat Overview Dashboard */}
        <div className="p-4 bg-black/60 border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin size={11} className="text-emerald-400" />
              <span>{isMr ? 'शोधलेली स्थळे' : 'Discovered'}</span>
            </div>
            <div className="text-base font-black text-white">
              <span className="text-emerald-400">{profile.visitedSlugs.length}</span> / {totalLocations}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Compass size={11} className="text-amber-400" />
              <span>{isMr ? 'तालुके सफर' : 'Talukas'}</span>
            </div>
            <div className="text-base font-black text-white">
              <span className="text-amber-400">{profile.visitedTalukas.length}</span> / 15
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Flag size={11} className="text-cyan-400" />
              <span>{isMr ? 'पूर्ण मोहिमा' : 'Missions'}</span>
            </div>
            <div className="text-base font-black text-white">
              <span className="text-cyan-400">{profile.completedMissions.length}</span> / 7
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Award size={11} className="text-amber-400" />
              <span>{isMr ? 'यशोगाथा' : 'Trophies'}</span>
            </div>
            <div className="text-base font-black text-white">
              <span className="text-amber-400">{unlockedCount}</span> / {MASTER_ACHIEVEMENTS.length}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/60">
              {isMr ? 'एकूण प्रगती' : 'Mastery Progress'}:
            </span>
            <span className="text-amber-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-48 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-zinc-900/60 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('trophies')}
            className={`pb-2.5 px-3 text-xs font-black tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'trophies'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {isMr ? 'सर्व यशोगाथा सन्मान' : 'TROPHIES & BADGES'} ({unlockedCount}/{MASTER_ACHIEVEMENTS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visited')}
            className={`pb-2.5 px-3 text-xs font-black tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'visited'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {isMr ? 'शोधलेली स्थळे' : 'VISITED PLACES'} ({visitedPlaces.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {activeTab === 'trophies' ? (
            MASTER_ACHIEVEMENTS.map((ach) => {
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
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          {ach.code}
                        </span>
                        <h3 className="font-black text-sm text-white truncate">
                          {isMr ? ach.titleMr : ach.titleEn}
                        </h3>
                      </div>
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1 flex-shrink-0">
                        +{ach.xp} XP
                      </span>
                    </div>

                    <p className="text-xs text-white/60 font-sans mt-1 leading-relaxed">
                      {isMr ? ach.descriptionMr : ach.descriptionEn}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2">
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={11} />
                          <span>UNLOCKED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          <Lock size={11} />
                          <span>LOCKED</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="space-y-2">
              {visitedPlaces.length === 0 ? (
                <div className="py-12 text-center text-white/50 text-xs">
                  <Compass size={32} className="mx-auto mb-2 text-white/20 animate-spin" />
                  <p>{isMr ? 'अजून कोणतेही स्थळ शोधले नाही. नकाशावर स्थळे निवडून प्रवास सुरू करा!' : 'No locations discovered yet. Click any destination marker or embark on a mission to start exploring!'}</p>
                </div>
              ) : (
                visitedPlaces.map((place, idx) => (
                  <div
                    key={place.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-emerald-400 font-bold w-6 text-right">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {isMr ? place.name_mr || place.name : place.name}
                        </h4>
                        <p className="text-[11px] text-white/50 truncate font-sans">
                          {place.category_slug} · {place.address}
                        </p>
                      </div>
                    </div>

                    {onFlyToPlace ? (
                      <button
                        type="button"
                        onClick={() => {
                          onFlyToPlace(place);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold text-[11px] border border-emerald-500/40 flex items-center gap-1 transition-all"
                      >
                        <Navigation size={12} />
                        <span>FLY</span>
                      </button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

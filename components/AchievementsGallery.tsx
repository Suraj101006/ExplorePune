'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AchievementCategory,
  BadgeRarity,
  UserAchievementState,
  ACHIEVEMENT_DEFINITIONS,
} from '@/lib/achievements';
import AchievementBadgeMedal from './AchievementBadgeMedal';
import { Share2, Award, Star, Compass, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react';

interface AchievementsGalleryProps {
  achievements: UserAchievementState[];
  onShareClick?: (achievement: UserAchievementState) => void;
  onDownloadCertificate?: (achievement: UserAchievementState) => void;
  onToggleFavorite?: (badgeId: string) => void;
  isMr?: boolean;
  isAccountView?: boolean;
}

export default function AchievementsGallery({
  achievements,
  onShareClick,
  onDownloadCertificate,
  onToggleFavorite,
  isMr = false,
  isAccountView = false,
}: AchievementsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const categories = useMemo(
    () => [
      { id: 'all', labelEn: 'All Categories', labelMr: 'सर्व वर्गवारी' },
      { id: 'getting_started', labelEn: 'Getting Started', labelMr: 'सुरुवात' },
      { id: 'fort_explorer', labelEn: 'Fort Explorer', labelMr: 'गडकोट शिलेदार' },
      { id: 'heritage_culture', labelEn: 'Heritage & Culture', labelMr: 'वारसा व संस्कृती' },
      { id: 'adventure', labelEn: 'Adventure', labelMr: 'साहस व निसर्ग' },
      { id: 'special_challenges', labelEn: 'Special Challenges', labelMr: 'विशेष आव्हाने' },
    ],
    []
  );

  const filteredAchievements = useMemo(() => {
    return achievements.filter((a) => {
      if (selectedCategory !== 'all' && a.definition.category !== selectedCategory) {
        return false;
      }
      if (selectedRarity !== 'all' && a.definition.rarity !== selectedRarity) {
        return false;
      }
      if (statusFilter === 'unlocked' && !a.isUnlocked) {
        return false;
      }
      if (statusFilter === 'locked' && a.isUnlocked) {
        return false;
      }
      return true;
    });
  }, [achievements, selectedCategory, selectedRarity, statusFilter]);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div>
      {/* Category & Status Filter Tabs Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="chip"
                style={{
                  fontSize: 12.5,
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontWeight: active ? 700 : 500,
                  background: active ? 'var(--ink)' : 'var(--bg-card)',
                  color: active ? '#ffffff' : 'var(--ink)',
                  border: active ? '1px solid var(--ink)' : '1px solid var(--line)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isMr ? cat.labelMr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Status Dropdown / Pills */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{
              padding: '6px 12px',
              fontSize: 12.5,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--line)',
              background: 'var(--bg)',
              color: 'var(--ink)',
              cursor: 'pointer',
            }}
            aria-label="Filter by unlock status"
          >
            <option value="all">{isMr ? 'सर्व स्थिती (All)' : 'All Badges'}</option>
            <option value="unlocked">{isMr ? 'प्राप्त पदके (Unlocked)' : 'Unlocked Only'}</option>
            <option value="locked">{isMr ? 'प्रगतीपथावर (Locked)' : 'Locked Only'}</option>
          </select>

          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: 12.5,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--line)',
              background: 'var(--bg)',
              color: 'var(--ink)',
              cursor: 'pointer',
            }}
            aria-label="Filter by rarity"
          >
            <option value="all">{isMr ? 'सर्व दुर्मीळता (All Rarity)' : 'All Rarities'}</option>
            <option value="common">Common (कांस्य / Bronze)</option>
            <option value="rare">Rare (रौप्य / Silver)</option>
            <option value="epic">Epic (सुवर्ण / Gold)</option>
            <option value="legendary">Legendary (प्लॅटिनम / Diamond)</option>
          </select>
        </div>
      </div>

      {/* Grid of Achievement Cards */}
      {filteredAchievements.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            border: '1px dashed var(--line)',
          }}
        >
          <Compass size={32} style={{ margin: '0 auto 10px', color: 'var(--muted)' }} />
          <h4 style={{ margin: '0 0 6px', color: 'var(--ink)' }}>
            {isMr ? 'कोणतेही पदक आढळले नाही' : 'No Badges Found'}
          </h4>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--muted)' }}>
            {isMr ? 'कृपया वेगळे फिल्टर निवडून पहा.' : 'Try adjusting the category or rarity filter.'}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 18,
          }}
        >
          {filteredAchievements.map((item) => {
            const def = item.definition;
            const isUnlocked = item.isUnlocked;

            return (
              <div
                key={item.id}
                className="panel"
                style={{
                  position: 'relative',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius)',
                  background: isUnlocked ? 'var(--bg-card)' : 'var(--bg-muted, rgba(0,0,0,0.02))',
                  border: isUnlocked
                    ? `1.5px solid ${
                        def.rarity === 'legendary'
                          ? 'rgba(225, 29, 72, 0.4)'
                          : def.rarity === 'epic'
                          ? 'rgba(217, 119, 6, 0.4)'
                          : def.rarity === 'rare'
                          ? 'rgba(2, 132, 199, 0.4)'
                          : 'rgba(194, 65, 12, 0.3)'
                      }`
                    : '1px solid var(--line)',
                  boxShadow: isUnlocked
                    ? '0 6px 20px rgba(0,0,0,0.06)'
                    : 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Favorite Star Button (Top Right) */}
                {isUnlocked && onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    title={item.isFavorite ? 'Remove from Showcase' : 'Showcase on Profile'}
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      background: item.isFavorite ? '#fef3c7' : 'var(--line-light)',
                      border: item.isFavorite ? '1px solid #f59e0b' : '1px solid var(--line)',
                      color: item.isFavorite ? '#d97706' : 'var(--muted)',
                      borderRadius: 999,
                      width: 30,
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                    aria-label="Pin favorite badge"
                  >
                    <Star size={14} fill={item.isFavorite ? '#f59e0b' : 'none'} />
                  </button>
                )}

                {/* Top Section: Medallion + Titles */}
                <div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 12 }}>
                    {/* Medal Component */}
                    <div style={{ flexShrink: 0 }}>
                      <AchievementBadgeMedal
                        design={def.medalDesign}
                        rarity={def.rarity}
                        isUnlocked={isUnlocked}
                        size="md"
                        title={isMr ? def.nameMr : def.nameEn}
                      />
                    </div>

                    {/* Badge Info */}
                    <div style={{ minWidth: 0, flex: 1, paddingRight: isUnlocked ? 24 : 0 }}>
                      {/* Rarity & Category Pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: 4,
                            letterSpacing: 0.4,
                            background:
                              def.rarity === 'legendary'
                                ? '#ffe4e6'
                                : def.rarity === 'epic'
                                ? '#fef3c7'
                                : def.rarity === 'rare'
                                ? '#e0f2fe'
                                : '#ffedd5',
                            color:
                              def.rarity === 'legendary'
                                ? '#be123c'
                                : def.rarity === 'epic'
                                ? '#b45309'
                                : def.rarity === 'rare'
                                ? '#0369a1'
                                : '#9a3412',
                          }}
                        >
                          {def.rarity}
                        </span>

                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: 'var(--line-light)',
                            color: 'var(--muted)',
                          }}
                        >
                          {isMr ? def.categoryLabelMr : def.categoryLabelEn}
                        </span>
                      </div>

                      {/* Badge Title */}
                      <h3
                        style={{
                          margin: '0 0 4px',
                          fontSize: 16,
                          fontWeight: 700,
                          color: 'var(--ink)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span>{isMr ? def.nameMr : def.nameEn}</span>
                        {isUnlocked ? (
                          <CheckCircle2 size={15} color="#16a34a" />
                        ) : (
                          <Lock size={13} color="var(--muted)" />
                        )}
                      </h3>

                      {/* Description */}
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12.5,
                          lineHeight: 1.4,
                          color: 'var(--muted)',
                        }}
                      >
                        {isMr ? def.descMr : def.descEn}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar & Exact Metrics */}
                  <div style={{ marginTop: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: 'var(--ink)',
                        marginBottom: 4,
                      }}
                    >
                      <span>
                        {isUnlocked
                          ? (isMr ? '✓ यशोगाथा पूर्ण' : '✓ Completed')
                          : (isMr ? 'प्रगती (Progress)' : 'Progress')}
                      </span>
                      <span>
                        {item.current} / {def.target} {isMr ? def.unitMr : def.unitEn} ({item.percentage}%)
                      </span>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: 7,
                        borderRadius: 999,
                        background: 'var(--line)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${item.percentage}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: isUnlocked
                            ? 'linear-gradient(90deg, #16a34a, #10b981)'
                            : 'linear-gradient(90deg, #ea580c, #f59e0b)',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>

                    {/* Next step hint */}
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 11.5,
                        color: isUnlocked ? '#15803d' : 'var(--muted)',
                        fontWeight: isUnlocked ? 600 : 400,
                      }}
                    >
                      {isMr ? item.nextStepHintMr : item.nextStepHintEn}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: '1px solid var(--line-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  {isUnlocked ? (
                    <>
                      {/* Share 1080x1080 Card Trigger */}
                      {onShareClick && (
                        <button
                          onClick={() => onShareClick(item)}
                          className="btn"
                          style={{
                            padding: '6px 14px',
                            fontSize: 12,
                            fontWeight: 700,
                            background: '#ea580c',
                            color: '#ffffff',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          <Share2 size={13} />
                          <span>{isMr ? 'शेअर कार्ड (1080)' : 'Share Card'}</span>
                        </button>
                      )}

                      {/* Download PDF Certificate */}
                      {onDownloadCertificate && (
                        <button
                          onClick={() => onDownloadCertificate(item)}
                          className="chip"
                          style={{
                            padding: '6px 12px',
                            fontSize: 11.5,
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer',
                          }}
                          title={isMr ? 'प्रमाणपत्र डाऊनलोड करा' : 'Download PDF Certificate'}
                        >
                          <Award size={13} color="#047857" />
                          <span>{isMr ? 'प्रमाणपत्र' : 'Certificate'}</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Locked: Action Link to Relevant Destinations */}
                      <Link
                        href={def.actionLink}
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#c2410c',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span>{isMr ? def.actionTextMr : def.actionTextEn}</span>
                        <ArrowRight size={13} />
                      </Link>

                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {def.target - item.current} {isMr ? 'शिल्लक' : 'remaining'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

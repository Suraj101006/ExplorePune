'use client';

import React from 'react';
import { UserAchievementState, markBadgeAsCelebrated } from '@/lib/achievements';
import AchievementBadgeMedal from './AchievementBadgeMedal';
import { Sparkles, Share2, Compass, Award, X } from 'lucide-react';

interface CelebrationUnlockModalProps {
  achievement: UserAchievementState | null;
  onClose: () => void;
  onShareClick: (achievement: UserAchievementState) => void;
  onViewCollectionClick?: () => void;
  onDownloadCertificate?: (achievement: UserAchievementState) => void;
  isMr?: boolean;
}

export default function CelebrationUnlockModal({
  achievement,
  onClose,
  onShareClick,
  onViewCollectionClick,
  onDownloadCertificate,
  isMr = false,
}: CelebrationUnlockModalProps) {
  if (!achievement) return null;

  const def = achievement.definition;
  const badgeTitle = isMr ? def.nameMr : def.nameEn;
  const badgeDesc = isMr ? def.descMr : def.descEn;
  const unlockDate = new Date().toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleClose = () => {
    markBadgeAsCelebrated(achievement.id);
    onClose();
  };

  const handleShare = () => {
    markBadgeAsCelebrated(achievement.id);
    onShareClick(achievement);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 10, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 10001,
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #181829, #0c0b14)',
          color: '#f8fafc',
          borderRadius: 24,
          maxWidth: 480,
          width: '100%',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: '0 25px 60px -10px rgba(0,0,0,0.8), 0 0 40px rgba(234, 88, 12, 0.25)',
          border: '1.5px solid rgba(234, 179, 8, 0.4)',
          position: 'relative',
          animation: 'fadeScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: '#f8fafc',
            width: 32,
            height: 32,
            borderRadius: 999,
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Celebratory Sparkle Header */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            color: '#fbbf24',
            padding: '4px 14px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 20,
          }}
        >
          <Sparkles size={14} />
          <span>{isMr ? 'नवीन यशोगाथा पदक अनलॉक!' : 'NEW ACHIEVEMENT UNLOCKED!'}</span>
        </div>

        {/* Large Hero Medal with 3D Pop Effect */}
        <div style={{ margin: '10px 0 20px', display: 'flex', justifyContent: 'center' }}>
          <AchievementBadgeMedal
            design={def.medalDesign}
            rarity={def.rarity}
            isUnlocked={true}
            size="xl"
            showGlow={true}
          />
        </div>

        {/* Rarity Label Pill */}
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 6,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              background:
                def.rarity === 'legendary'
                  ? '#e11d48'
                  : def.rarity === 'epic'
                  ? '#d97706'
                  : def.rarity === 'rare'
                  ? '#0284c7'
                  : '#c2410c',
              color: '#ffffff',
            }}
          >
            ✦ {def.rarity} Medal ✦
          </span>
        </div>

        {/* Badge Title */}
        <h3
          style={{
            margin: '0 0 8px',
            fontSize: 26,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: -0.3,
          }}
        >
          {badgeTitle}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            color: '#cbd5e1',
            lineHeight: 1.5,
            margin: '0 0 16px',
            padding: '0 10px',
          }}
        >
          {badgeDesc}
        </p>

        {/* Unlock Date Pill */}
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 24 }}>
          {isMr ? 'प्राप्ती दिनांक:' : 'Unlocked on:'} <strong>{unlockDate}</strong>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gap: 10 }}>
          {/* Share Achievement Button (Hero) */}
          <button
            onClick={handleShare}
            className="btn"
            style={{
              width: '100%',
              padding: '12px 18px',
              fontSize: 14,
              fontWeight: 700,
              background: '#ea580c',
              color: '#ffffff',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)',
            }}
          >
            <Share2 size={16} />
            <span>{isMr ? 'यशोगाथा शेअर करा (1080×1080)' : 'Share Achievement (1080×1080)'}</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: onDownloadCertificate ? '1fr 1fr' : '1fr', gap: 10 }}>
            {onDownloadCertificate && (
              <button
                onClick={() => {
                  markBadgeAsCelebrated(achievement.id);
                  onDownloadCertificate(achievement);
                }}
                className="btn outline"
                style={{
                  padding: '10px 14px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#f8fafc',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Award size={15} color="#10b981" />
                <span>{isMr ? 'प्रमाणपत्र (PDF)' : 'Certificate (PDF)'}</span>
              </button>
            )}

            <button
              onClick={() => {
                handleClose();
                if (onViewCollectionClick) onViewCollectionClick();
              }}
              className="btn outline"
              style={{
                padding: '10px 14px',
                fontSize: 12.5,
                fontWeight: 600,
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#f8fafc',
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Compass size={15} />
              <span>{isMr ? 'संग्रह पहा' : 'View Collection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

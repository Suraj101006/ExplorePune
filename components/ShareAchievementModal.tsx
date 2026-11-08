'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { UserAchievementState } from '@/lib/achievements';
import AchievementBadgeMedal from './AchievementBadgeMedal';
import { Download, Share2, MessageCircle, Copy, Check, Sparkles, X } from 'lucide-react';

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M5.07 18.5h2.79v-8.37H5.07v8.37Z" />
    </svg>
  );
}

function InstagramIcon({ size = 14, color = '#ec4899' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface ShareAchievementModalProps {
  achievement: UserAchievementState;
  userName: string;
  userPhotoUrl?: string | null;
  totalVisitedCount: number;
  isOpen: boolean;
  onClose: () => void;
  isMr?: boolean;
}

export default function ShareAchievementModal({
  achievement,
  userName,
  userPhotoUrl,
  totalVisitedCount,
  isOpen,
  onClose,
  isMr = false,
}: ShareAchievementModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [rendering, setRendering] = useState(true);
  const [nativeShareSupported, setNativeShareSupported] = useState(false);

  const def = achievement.definition;
  const badgeTitle = isMr ? def.nameMr : def.nameEn;
  const badgeDesc = isMr ? def.descMr : def.descEn;
  const rarityLabel = def.rarity.toUpperCase();
  const unlockDate = new Date().toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const defaultCaption = def.shareCaption(userName, totalVisitedCount);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setNativeShareSupported(true);
    }
  }, []);

  // Render high-res 1080x1080 Canvas Card
  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setRendering(true);

    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    // 1. Rich Royal Deep Background (Imperial Pune Night Sky)
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 750);
    bgGrad.addColorStop(0, '#1a1829');
    bgGrad.addColorStop(0.5, '#0f0f18');
    bgGrad.addColorStop(1, '#07060a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Decorative Topographical Mountain Contours
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.08)';
    ctx.lineWidth = 1.5;
    for (let r = 200; r <= 600; r += 60) {
      ctx.beginPath();
      ctx.arc(W / 2, 420, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Luxurious Border Accents (Double Gold Inlay)
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    ctx.strokeStyle = 'rgba(249, 115, 22, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(46, 46, W - 92, H - 92);

    // Corner Ornament Flourishes
    const cornerSize = 28;
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-cornerSize / 2, -2, cornerSize, 4);
      ctx.fillRect(-2, -cornerSize / 2, 4, cornerSize);
      ctx.restore();
    };
    drawCorner(36, 36, 0);
    drawCorner(W - 36, 36, Math.PI / 2);
    drawCorner(W - 36, H - 36, Math.PI);
    drawCorner(36, H - 36, -Math.PI / 2);

    // 4. Header: Explore Pune Official Emblem & Seal
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Saffron Heritage Pill
    ctx.fillStyle = 'rgba(234, 88, 12, 0.15)';
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(W / 2 - 180, 78, 360, 44, 22);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#fb923c';
    ctx.fillText('EXPLORE PUNE • VERIFIED ACHIEVEMENT', W / 2, 100);

    // 5. Central Hero Badge Medal Radial Glow
    const medalGlow = ctx.createRadialGradient(W / 2, 360, 20, W / 2, 360, 240);
    const glowColor =
      def.medalDesign.metal === 'platinum'
        ? 'rgba(45, 212, 191, 0.35)'
        : def.medalDesign.metal === 'gold'
        ? 'rgba(245, 158, 11, 0.35)'
        : def.medalDesign.metal === 'silver'
        ? 'rgba(56, 189, 248, 0.35)'
        : 'rgba(234, 88, 12, 0.35)';
    medalGlow.addColorStop(0, glowColor);
    medalGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = medalGlow;
    ctx.beginPath();
    ctx.arc(W / 2, 360, 240, 0, Math.PI * 2);
    ctx.fill();

    // Draw Medallion Artwork onto Canvas
    const medalImg = new Image();
    const medalSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="${def.medalDesign.accentColor}" stroke="#ffffff" stroke-width="2" />
        <circle cx="50" cy="50" r="39" fill="#0f172a" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 2" />
        <circle cx="50" cy="50" r="33" fill="#18181b" />
        <text x="50" y="58" font-size="28" text-anchor="middle" fill="#fef08a">🏆</text>
      </svg>
    `;
    const svgBlob = new Blob([medalSvg], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(svgBlob);

    medalImg.onload = () => {
      ctx.drawImage(medalImg, W / 2 - 130, 230, 260, 260);
      URL.revokeObjectURL(blobUrl);

      // 6. Rarity Pill Banner
      ctx.fillStyle =
        def.rarity === 'legendary'
          ? '#e11d48'
          : def.rarity === 'epic'
          ? '#d97706'
          : def.rarity === 'rare'
          ? '#0284c7'
          : '#c2410c';
      ctx.beginPath();
      ctx.roundRect(W / 2 - 110, 520, 220, 36, 18);
      ctx.fill();

      ctx.font = '800 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`✦ ${rarityLabel} MEDAL ✦`, W / 2, 538);

      // 7. Badge Title (High Impact Bold Serif / Sans)
      ctx.font = '800 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(badgeTitle, W / 2, 600);

      // 8. Achievement Description
      ctx.font = '400 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(badgeDesc.length > 70 ? badgeDesc.slice(0, 68) + '…' : badgeDesc, W / 2, 650);

      // 9. Divider with decorative diamond
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 240, 695);
      ctx.lineTo(W / 2 + 240, 695);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(W / 2, 695, 4, 0, Math.PI * 2);
      ctx.fill();

      // 10. Explorer Identity & Stats Card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 380, 725, 760, 160, 20);
      ctx.fill();
      ctx.stroke();

      // Avatar Circle (Fallback Monogram)
      const avatarX = W / 2 - 300;
      const avatarY = 805;
      const avatarR = 48;

      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Initials Monogram
      const initials = (userName || 'Pune Explorer')
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      ctx.font = '700 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(initials, avatarX, avatarY + 2);

      // User Name & Explorer Rank
      ctx.textAlign = 'left';
      ctx.font = '700 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(userName || 'Pune Explorer', avatarX + 70, 785);

      ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#fb923c';
      ctx.fillText(`🚩 ${totalVisitedCount} Destinations Visited • Unlocked on ${unlockDate}`, avatarX + 70, 825);

      // 11. Footer Branding & Website URL
      ctx.textAlign = 'center';
      ctx.font = '600 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('explore-pune-guide.vercel.app  •  Discover the Soul of Pune', W / 2, 940);

      // Verification Watermark
      ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Officially certified travel milestone record', W / 2, 970);

      // Export to Data URL
      setGeneratedImgUrl(canvas.toDataURL('image/png'));
      setRendering(false);
    };

    medalImg.src = blobUrl;
  }, [achievement, userName, totalVisitedCount, badgeTitle, badgeDesc, rarityLabel, unlockDate, def]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(drawCard, 80);
    }
  }, [isOpen, drawCard]);

  if (!isOpen) return null;

  // Sharing Handlers
  const handleDownloadPng = () => {
    if (!generatedImgUrl) return;
    const a = document.createElement('a');
    a.href = generatedImgUrl;
    a.download = `ExplorePune_${def.nameEn.replace(/\s+/g, '_')}_Badge.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleNativeShare = async () => {
    if (!generatedImgUrl || !navigator.share) return;
    try {
      // Convert Data URL to File
      const res = await fetch(generatedImgUrl);
      const blob = await res.blob();
      const file = new File([blob], `${def.nameEn}_Badge.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Explore Pune: ${def.nameEn} Badge`,
          text: defaultCaption,
          files: [file],
          url: 'https://explorepune-guide.vercel.app/milestones',
        });
      } else {
        await navigator.share({
          title: `Explore Pune: ${def.nameEn} Badge`,
          text: defaultCaption,
          url: 'https://explorepune-guide.vercel.app/milestones',
        });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Native share failed:', err);
      }
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${defaultCaption}\n\nView my badge here: https://explorepune-guide.vercel.app/milestones`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent('https://explorepune-guide.vercel.app/milestones');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('https://explorepune-guide.vercel.app/milestones');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleCopyCaption = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(defaultCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2200);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 10, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0f172a',
          color: '#f8fafc',
          borderRadius: 20,
          maxWidth: 960,
          width: '100%',
          padding: 24,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.15)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#f8fafc',
            width: 36,
            height: 36,
            borderRadius: 999,
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>
            <Sparkles size={16} />
            <span>{isMr ? 'सोशल मीडिया यशोगाथा कार्ड' : '1080 × 1080 Social Media Achievement Card'}</span>
          </div>
          <h2 style={{ fontSize: 24, margin: '4px 0 6px', color: '#ffffff' }}>
            {isMr ? 'आपली यशोगाथा अभिमानाने शेअर करा' : 'Share Your Travel Achievement'}
          </h2>
          <p style={{ margin: 0, fontSize: 13.5, color: '#94a3b8' }}>
            {isMr
              ? 'इंस्टाग्राम, व्हॉट्सॲप, किंवा लिंक्डइनसाठी डिझाइन केलेले उच्च दर्जाचे स्क्वेअर कार्ड.'
              : 'Crisp, high-definition square card ready for Instagram, WhatsApp Stories, and LinkedIn.'}
          </p>
        </div>

        {/* Main Split Layout: Left Preview, Right Share Actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            alignItems: 'center',
          }}
        >
          {/* Left Column: 1080x1080 Card Preview */}
          <div
            style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#07060a',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              border: '1.5px solid rgba(234, 179, 8, 0.4)',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Hidden High-Res 1080x1080 Canvas */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Rendered Preview Image */}
            {generatedImgUrl ? (
              <img
                src={generatedImgUrl}
                alt={`${badgeTitle} 1080x1080 Share Card`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                <Sparkles size={28} style={{ margin: '0 auto 8px', color: '#f59e0b' }} />
                <span>{rendering ? 'Generating 1080x1080 Card…' : 'Preparing badge…'}</span>
              </div>
            )}
          </div>

          {/* Right Column: Actions & Captions */}
          <div>
            {/* Pre-written Social Caption Box */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>
                  {isMr ? 'सोशल मीडिया कॅप्शन:' : 'Pre-written Caption:'}
                </span>
                <button
                  onClick={handleCopyCaption}
                  className="chip"
                  style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: copiedCaption ? '#047857' : 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {copiedCaption ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedCaption ? (isMr ? 'कॉपी झाले!' : 'Copied!') : (isMr ? 'कॅप्शन कॉपी करा' : 'Copy Caption')}</span>
                </button>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: '#cbd5e1',
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{defaultCaption}&rdquo;
              </p>
            </div>

            {/* Action Buttons Grid */}
            <div style={{ display: 'grid', gap: 10 }}>
              {/* 1. Download PNG */}
              <button
                onClick={handleDownloadPng}
                disabled={!generatedImgUrl}
                className="btn"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 14,
                  fontWeight: 700,
                  background: '#ea580c',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Download size={18} />
                <span>{isMr ? 'कार्ड डाऊनलोड करा (1080×1080 PNG)' : 'Download Badge Card (1080×1080 PNG)'}</span>
              </button>

              {/* 2. Native Share Menu (if device supported) */}
              {nativeShareSupported && (
                <button
                  onClick={handleNativeShare}
                  className="btn outline"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    fontSize: 13.5,
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    borderRadius: 10,
                    cursor: 'pointer',
                  }}
                >
                  <Share2 size={16} />
                  <span>{isMr ? 'डिव्हाइस मेनूने शेअर करा' : 'Share via Device Menu'}</span>
                </button>
              )}

              {/* Social Channels Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {/* WhatsApp */}
                <button
                  onClick={handleWhatsAppShare}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={handleLinkedInShare}
                  style={{
                    background: '#0a66c2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <LinkedInIcon size={16} />
                  <span>LinkedIn</span>
                </button>
              </div>

              {/* Copy Direct Milestone Link */}
              <button
                onClick={handleCopyLink}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                {copiedLink ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>
                  {copiedLink
                    ? (isMr ? 'लिंक कॉपी झाली!' : 'Milestone Link Copied!')
                    : (isMr ? 'यशोगाथा लिंक कॉपी करा' : 'Copy Achievement Link')}
                </span>
              </button>

              {/* Instagram Notice */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11.5,
                  color: '#94a3b8',
                  marginTop: 6,
                }}
              >
                <InstagramIcon size={14} color="#ec4899" />
                <span>
                  {isMr
                    ? 'टीप: इन्स्टाग्राम स्टोरीज किंवा पोस्टसाठी PNG डाऊनलोड करा व कॅप्शन पेस्ट करा.'
                    : 'Tip: Download the PNG card to post directly on Instagram Feed or Stories.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

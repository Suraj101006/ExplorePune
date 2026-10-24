'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect } from 'react';
import { DayJourney } from '@/lib/journeyStorage';
import { X, Download, Share2, Copy, Check, Lock, Globe, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { shareOrCopy } from '@/lib/shareUtils';

interface ShareJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: DayJourney | null;
  userName?: string;
  isMr?: boolean;
}

export default function ShareJourneyModal({
  isOpen,
  onClose,
  journey,
  userName = 'Pune Explorer',
  isMr = false,
}: ShareJourneyModalProps) {
  const [aspectRatio, setAspectRatio] = useState<'story' | 'square' | 'landscape'>('square');
  const [visibility, setVisibility] = useState<'private' | 'only_me' | 'shareable'>('shareable');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen || !journey) return null;

  const places = journey.places || [];
  const visitedStops = places.filter((p) => p.isVisited);
  const topPlaces = visitedStops.length > 0 ? visitedStops.slice(0, 3) : places.slice(0, 3);
  const heroImage = topPlaces[0]?.image_url || '/images/places/shaniwar-wada.jpg';
  const totalKm = journey.totalDistanceKm || 12.4;
  const placeCount = visitedStops.length > 0 ? visitedStops.length : places.length;

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/journey?date=${journey.date}`;
      const res = await shareOrCopy({
        title: `${userName}'s Pune Travel Journey`,
        text: `Check out ${userName}'s Pune travel journey on Explore Pune:`,
        url: shareUrl,
      });
      if (res === 'copied' || res === 'shared') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = 1080;
      let height = 1080;
      if (aspectRatio === 'story') {
        width = 1080;
        height = 1920;
      } else if (aspectRatio === 'landscape') {
        width = 1200;
        height = 675;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(0.7, '#022c22');
      grad.addColorStop(1, '#01140e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle header
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(isMr ? 'पुणे प्रवास आठवण' : 'EXPLORE PUNE JOURNEY', 60, 90);

      // Title & User
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px sans-serif';
      const title = `${userName}'s Pune Journey`;
      ctx.fillText(title, 60, 160);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '32px sans-serif';
      ctx.fillText(journey.dateLabelEn, 60, 215);

      // Stats pills
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.roundRect(60, 260, 480, 70, 16);
      ctx.fill();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(`${placeCount} Places  •  ${totalKm} km`, 90, 310);

      // Quote
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'italic 30px sans-serif';
      ctx.fillText('“Pune isn’t just a destination, it’s a journey created.”', 60, height - 120);

      // Branding
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText('🏛️ Explore Pune • punetrail.web.app', 60, height - 60);

      // Export canvas to PNG
      const link = document.createElement('a');
      link.download = `pune-journey-${journey.date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="journey-reel-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Share Journey"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(94vw, 560px)',
          maxHeight: '90vh',
          borderRadius: 24,
          background: '#ffffff',
          color: 'var(--ink)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          overflowY: 'auto',
          padding: 24,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
              }}
            >
              <Share2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                {isMr ? 'सफर शेअर करा' : 'Share Your Pune Journey'}
              </h2>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                {isMr ? 'सुंदर दृश्य कार्ड तयार करा आणि शेअर करा' : 'Create a polished visual share card'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: 6,
            }}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Aspect Ratio Switcher */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>
            {isMr ? 'कार्ड आकार (Aspect Ratio)' : 'Card Format'}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { id: 'square', label: '1:1 Square', icon: '⏹️' },
              { id: 'story', label: '9:16 Story', icon: '📱' },
              { id: 'landscape', label: '16:9 Landscape', icon: '🖥️' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setAspectRatio(fmt.id as any)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: aspectRatio === fmt.id ? '2px solid #10b981' : '1px solid var(--border)',
                  background: aspectRatio === fmt.id ? '#ecfdf5' : '#ffffff',
                  color: aspectRatio === fmt.id ? '#065f46' : 'var(--ink)',
                  fontWeight: aspectRatio === fmt.id ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 150ms ease',
                }}
              >
                <span>{fmt.icon}</span> {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Visual Card Preview */}
        <div
          style={{
            position: 'relative',
            borderRadius: 18,
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #064e3b 0%, #022c22 70%, #01140e 100%)',
            color: '#ffffff',
            padding: 24,
            boxShadow: '0 8px 24px rgba(6, 95, 70, 0.25)',
            marginBottom: 20,
            aspectRatio: aspectRatio === 'story' ? '9/14' : aspectRatio === 'landscape' ? '16/9' : '1/1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Subtle Top Photo Backdrop with opacity */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.25,
            }}
          />

          {/* Top Card Info */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '3px 8px',
                  borderRadius: 10,
                  textTransform: 'uppercase',
                }}
              >
                Explore Pune Journey
              </span>
              <span style={{ fontSize: 12, opacity: 0.9 }}>{journey.dateLabelEn}</span>
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#ffffff' }}>
              {userName}&apos;s Pune Journey
            </h3>
            <p style={{ fontSize: 13, color: '#a7f3d0', margin: 0 }}>
              {isMr ? (journey.titleMr || journey.title) : journey.title}
            </p>
          </div>

          {/* Middle Landmarks Snapshot */}
          <div style={{ position: 'relative', zIndex: 10, margin: '14px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {topPlaces.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(6px)',
                    padding: '6px 10px',
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontSize: 15 }}>📍</span>
                  <span style={{ fontWeight: 600 }}>{p.placeName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Summary Bar */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 12,
                borderTop: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#34d399' }}>
                  {placeCount} places • {totalKm} km
                </span>
                <div style={{ fontSize: 11, color: '#cbd5e1' }}>
                  {isMr ? 'सत्य ऐतिहासिक वाटा' : 'Authentic Exploration Trail'}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>
                <div>🏛️ Explore Pune</div>
                <div>punetrail.web.app</div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Note (Requirement 14 & 19) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 14px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            marginBottom: 20,
            fontSize: 12.5,
            color: '#475569',
          }}
        >
          <Lock size={16} style={{ color: '#059669', marginTop: 2, flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#0f172a' }}>{isMr ? 'गोपनीयता सुरक्षित' : 'Privacy Protected'}: </strong>
            {isMr
              ? 'हे कार्ड केवळ निवडलेली प्रेक्षणीय स्थळे दर्शवते. तुमचा अचूक जीपीएस इतिहास, घराचे स्थान किंवा खाजगी वेळ सुरक्षित आणि गुप्त राहतात.'
              : 'This share card shows only selected landmarks and summary stats. Your exact home location, private GPS history, and personal timestamps are never exposed.'}
          </div>
        </div>

        {/* Actions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={downloading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 14,
              background: '#10b981',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 13.5,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Download size={16} />
            {downloading ? (isMr ? 'तयार होत आहे...' : 'Generating...') : isMr ? 'इमेज डाउनलोड' : 'Download PNG'}
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 14,
              background: copied ? '#ecfdf5' : '#f1f5f9',
              color: copied ? '#059669' : 'var(--ink)',
              border: copied ? '1.5px solid #10b981' : '1px solid var(--border)',
              fontWeight: 600,
              fontSize: 13.5,
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? (isMr ? 'लिंक कॉपी झाली!' : 'Link Copied!') : isMr ? 'लिंक कॉपी' : 'Copy Link'}
          </button>

          <Link
            href={`/community?shareJourney=${journey.id}&title=${encodeURIComponent(journey.title)}&places=${placeCount}`}
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 14,
              background: '#0f172a',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: 13.5,
              textDecoration: 'none',
            }}
          >
            <Globe size={16} />
            {isMr ? 'समुदायात शेअर' : 'Post to Community'}
          </Link>
        </div>
      </div>
    </div>
  );
}

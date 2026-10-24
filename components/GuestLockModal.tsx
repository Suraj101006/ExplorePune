'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, X, LogIn, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface GuestLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  featureNameMr?: string;
  redirectUrl?: string;
}

export default function GuestLockModal({
  isOpen,
  onClose,
  featureName = 'this feature',
  featureNameMr = 'हे वैशिष्ट्य वापरण्यासाठी',
  redirectUrl = '/login',
}: GuestLockModalProps) {
  const { isMr } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          margin: 'auto',
          background: '#ffffff',
          borderRadius: 22,
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          animation: 'fadeIn 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div
          style={{
            padding: '24px 24px 16px',
            background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
            color: '#ffffff',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>

          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              border: '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Lock size={26} color="#ffffff" strokeWidth={2.4} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#ffffff' }}>
            {isMr ? 'लॉगिन आवश्यक आहे' : 'Explorer Sign In Required'}
          </h2>
          <span style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
            {isMr ? 'पुणे एक्सप्लोरर खाते आवश्यक' : 'Members-only feature lock'}
          </span>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px 24px 20px' }}>
          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.6,
              color: 'var(--ink-secondary)',
              margin: '0 0 20px',
            }}
          >
            {isMr
              ? `${featureNameMr} कृपया आपल्या खात्यामध्ये लॉगिन करा. यामुळे आपले अनुभव, रील्स आणि प्रवास इतिहास सुरक्षित राहील.`
              : `To use ${featureName}, please sign in to your Explore Pune account. This keeps your travel reels, photos, and milestones synced securely.`}
          </p>

          <div
            style={{
              background: '#f8fafc',
              borderRadius: 14,
              padding: '12px 14px',
              border: '1px solid #e2e8f0',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textAlign: 'left',
            }}
          >
            <Sparkles size={18} color="#d97706" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 600 }}>
              {isMr
                ? 'मोफत नोंदणी • १-क्लिक गुगल लॉगिन उपलब्ध'
                : 'Free explorer account • 1-click Google Sign-in available'}
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link
              href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: 12,
                fontSize: 14.5,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(6, 95, 70, 0.3)',
              }}
            >
              <LogIn size={17} />
              <span>{isMr ? 'आता लॉगिन करा →' : 'Sign In with Google / Email →'}</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              {isMr ? 'नंतर करू' : 'Cancel / Continue as Guest'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

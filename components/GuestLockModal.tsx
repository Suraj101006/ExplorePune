'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, X, LogIn, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import ModalPortal from '@/components/ModalPortal';

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
    <ModalPortal isOpen={isOpen} onClose={onClose}>
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
          maxWidth: 480,
          margin: 'auto',
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Lock size={20} />
            </div>
            <div style={{ minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isMr ? 'पुणे एक्सप्लोरर खाते' : 'Explore Pune Membership'}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isMr ? 'लॉगिन आवश्यक आहे' : 'Explorer Sign In Required'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
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
    </ModalPortal>
  );
}

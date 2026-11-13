'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import Link from 'next/link';
import {
  CookieConsentPreferences,
  getCookieConsent,
  hasUserConsented,
  saveCookieConsent,
  OPEN_COOKIE_PREFERENCES_EVENT,
  COOKIE_CONSENT_EVENT,
  CookieCategory,
} from '@/lib/cookies';
import { useLanguage } from '@/lib/LanguageContext';
import { Cookie, ShieldCheck, Check, Settings2, X, Info } from 'lucide-react';

export default function CookieConsentBanner() {
  const { isMr } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal category preferences
  const [prefs, setPrefs] = useState<CookieConsentPreferences>({
    essential: true,
    functional: false,
    analytics: false,
    personalization: false,
    timestamp: '',
    version: 1,
  });

  const headingId = useId();
  const descId = useId();

  // Initialize and check existing consent status
  useEffect(() => {
    setMounted(true);
    const existing = getCookieConsent();
    setPrefs(existing);

    if (!hasUserConsented()) {
      // Delay banner display slightly to preserve 0ms TBT and avoid competing with LCP
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for programmatic preference modal triggers (e.g. from footer, /cookies page, or account page)
  useEffect(() => {
    const handleOpen = () => {
      const current = getCookieConsent();
      setPrefs(current);
      setShowModal(true);
    };

    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<CookieConsentPreferences>;
      if (customEvent.detail) {
        setPrefs(customEvent.detail);
      }
    };

    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange as EventListener);
    return () => {
      window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange as EventListener);
    };
  }, []);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const handleAcceptAll = useCallback(() => {
    saveCookieConsent({
      essential: true,
      functional: true,
      analytics: true,
      personalization: true,
    });
    setShowBanner(false);
    setShowModal(false);
  }, []);

  const handleEssentialOnly = useCallback(() => {
    saveCookieConsent({
      essential: true,
      functional: false,
      analytics: false,
      personalization: false,
    });
    setShowBanner(false);
    setShowModal(false);
  }, []);

  const handleSaveCustom = useCallback(() => {
    saveCookieConsent({
      essential: true,
      functional: prefs.functional,
      analytics: prefs.analytics,
      personalization: prefs.personalization,
    });
    setShowBanner(false);
    setShowModal(false);
  }, [prefs]);

  const toggleCategory = (category: 'functional' | 'analytics' | 'personalization') => {
    setPrefs((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!mounted) return null;

  return (
    <>
      {/* 1. Floating Bottom Cookie Consent Banner */}
      {showBanner && !showModal && (
        <aside
          role="region"
          aria-label={isMr ? 'कुकी संमती सूचना' : 'Cookie Consent Notice'}
          className="cookie-banner-dock"
          style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            right: 20,
            maxWidth: 1040,
            margin: '0 auto',
            zIndex: 9998,
            background: 'var(--card-bg, #ffffff)',
            color: 'var(--ink, #0f172a)',
            borderRadius: 18,
            boxShadow: '0 20px 48px -10px rgba(15, 23, 42, 0.22), 0 0 0 1px var(--line, rgba(226, 232, 240, 0.8))',
            padding: '20px 24px',
            backdropFilter: 'blur(16px)',
            animation: 'cookieBannerSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            {/* Banner Text & Icon */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: '1 1 540px' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.25) 100%)',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Cookie size={24} aria-hidden="true" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <strong style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                    {isMr ? 'गोपनीयता व कुकी पसंती' : 'Privacy & Cookie Choices'}
                  </strong>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: 'rgba(6, 95, 70, 0.1)',
                      color: '#047857',
                    }}
                  >
                    DPDP Act 2023
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--muted)' }}>
                  {isMr ? (
                    <>
                      एक्सप्लोर पुणे सुरक्षित ऑथेंटिकेशनसाठी आवश्यक कुकीज, तसेच डार्क मोड, मराठी भाषा पसंती आणि सुरक्षित ट्रान्झिट माहितीसाठी पर्यायी स्थानिक साठा वापरते.{' '}
                      <Link
                        href="/cookies"
                        style={{ color: '#ea580c', fontWeight: 600, textDecoration: 'underline' }}
                      >
                        सविस्तर कुकी धोरण वाचा →
                      </Link>
                    </>
                  ) : (
                    <>
                      Explore Pune uses essential cookies for site security and optional storage to remember your dark mode, Marathi language choice, and transit routes under India’s DPDP Act 2023.{' '}
                      <Link
                        href="/cookies"
                        style={{ color: '#ea580c', fontWeight: 600, textDecoration: 'underline' }}
                      >
                        Read Cookie Policy →
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Banner Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowModal(true);
                }}
                className="btn btn-outline"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '9px 16px',
                  borderRadius: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Settings2 size={15} aria-hidden="true" />
                {isMr ? 'पसंती व्यवस्थापित करा' : 'Customize'}
              </button>

              <button
                type="button"
                onClick={handleEssentialOnly}
                className="btn btn-outline"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '9px 16px',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                {isMr ? 'केवळ आवश्यक' : 'Essential Only'}
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="btn btn-primary"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '9px 20px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(6, 95, 70, 0.25)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Check size={16} aria-hidden="true" />
                {isMr ? 'सर्व स्वीकारा' : 'Accept All'}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Granular Cookie Preferences Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          aria-describedby={descId}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease-out forwards',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 680,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--card-bg, #ffffff)',
              color: 'var(--ink, #0f172a)',
              borderRadius: 20,
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--line, #e2e8f0)',
              padding: '28px 28px',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom: '1px solid var(--line, #e2e8f0)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(6, 95, 70, 0.12)',
                    color: '#047857',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 id={headingId} style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                    {isMr ? 'कुकी व गोपनीयता पसंती केंद्र' : 'Cookie & Privacy Preferences Center'}
                  </h2>
                  <p id={descId} style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>
                    {isMr
                      ? 'डीपीडीपी कायदा २०२३ अंतर्गत तुमच्या वैयक्तिक डेटावर तुमचे पूर्ण नियंत्रण आहे.'
                      : 'You have full autonomy over optional cookies & storage under India’s DPDP Act 2023.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label={isMr ? 'बंद करा' : 'Close preferences'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Category 1: Strictly Necessary (Essential) */}
            <div
              style={{
                background: 'var(--bg, #f8fafc)',
                border: '1px solid var(--line, #e2e8f0)',
                borderRadius: 14,
                padding: '16px 18px',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>
                    {isMr ? '१. अनिवार्य व आवश्यक कुकीज' : '1. Strictly Necessary (Essential)'}
                  </strong>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: '#ecfdf5',
                      color: '#065f46',
                    }}
                  >
                    {isMr ? 'नेहमी सक्रिय' : 'Always Active'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  aria-label="Essential cookies cannot be disabled"
                  style={{ width: 18, height: 18, accentColor: '#047857', cursor: 'not-allowed' }}
                />
              </div>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'var(--muted)' }}>
                {isMr
                  ? 'सुरक्षित लॉगिन, गैरवापर प्रतिबंध, आणि ही कुकी पसंती स्वतः साठवण्यासाठी आवश्यक आहेत. हे घटक बंद करता येत नाहीत.'
                  : 'Required for secure sign-in sessions, CSRF prevention, and preserving your privacy choices. These cannot be disabled.'}
              </p>
            </div>

            {/* Category 2: Functional Preferences */}
            <div
              style={{
                background: 'var(--bg, #f8fafc)',
                border: '1px solid var(--line, #e2e8f0)',
                borderRadius: 14,
                padding: '16px 18px',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <strong style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>
                    {isMr ? '२. कार्यक्षम व भाषा पसंती' : '2. Functional & Language Preferences'}
                  </strong>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.functional}
                    onChange={() => toggleCategory('functional')}
                    aria-label="Toggle Functional cookies"
                    style={{ width: 18, height: 18, accentColor: '#047857', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'var(--muted)' }}>
                {isMr
                  ? 'डार्क/लाईट थीम मोड, मराठी/इंग्रजी भाषा निवड, आणि ऑफलाइन पाहण्यासाठी सेव्ह केलेले किल्ले लक्षात ठेवते.'
                  : 'Remembers your Dark/Light theme mode, Marathi/English language selection, and bookmarked forts for offline access.'}
              </p>
            </div>

            {/* Category 3: Analytics & Performance */}
            <div
              style={{
                background: 'var(--bg, #f8fafc)',
                border: '1px solid var(--line, #e2e8f0)',
                borderRadius: 14,
                padding: '16px 18px',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <strong style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>
                    {isMr ? '३. विश्लेषण व कार्यक्षमता (GTM/GA)' : '3. Analytics & Speed Performance'}
                  </strong>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={() => toggleCategory('analytics')}
                    aria-label="Toggle Analytics cookies"
                    style={{ width: 18, height: 18, accentColor: '#047857', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'var(--muted)' }}>
                {isMr
                  ? 'पानांचा लोड होण्याचा वेग आणि ट्रेकर्सद्वारे सर्वाधिक वाचल्या जाणाऱ्या किल्ल्यांची निनावी आकडेवारी गोळा करते. कोणतीही वैयक्तिक माहिती घेतली जात नाही.'
                  : 'Collects aggregated, anonymous telemetry on page speeds and popular fort guides via Google Consent Mode v2 without personal profiling.'}
              </p>
            </div>

            {/* Category 4: Personalization & Trail Recommendations */}
            <div
              style={{
                background: 'var(--bg, #f8fafc)',
                border: '1px solid var(--line, #e2e8f0)',
                borderRadius: 14,
                padding: '16px 18px',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <strong style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>
                    {isMr ? '४. वैयक्तिकृत वारसा शिफारसी' : '4. Personalization & Trail Suggestions'}
                  </strong>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.personalization}
                    onChange={() => toggleCategory('personalization')}
                    aria-label="Toggle Personalization cookies"
                    style={{ width: 18, height: 18, accentColor: '#047857', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'var(--muted)' }}>
                {isMr
                  ? 'तुम्ही शोधलेल्या स्थळांनुसार जवळचे किल्ले, घाट रस्ते आणि शनिवार वाड्याच्या परिसरातील ठिकाणांची सुसंगत शिफारस करते.'
                  : 'Delivers personalized recommendations for nearby trekking trails, ghat passes, and historic Peshwa wadas based on your recent searches.'}
              </p>
            </div>

            {/* Modal Actions Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                paddingTop: 16,
                borderTop: '1px solid var(--line, #e2e8f0)',
              }}
            >
              <Link
                href="/cookies"
                onClick={() => setShowModal(false)}
                style={{
                  fontSize: 13,
                  color: 'var(--ink-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  textDecoration: 'underline',
                }}
              >
                <Info size={15} />
                {isMr ? 'संपूर्ण कुकी यादी व तपशील' : 'Full Cookie Catalog'}
              </Link>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="btn btn-outline"
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    padding: '9px 18px',
                    borderRadius: 10,
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'माझी निवड सेव्ह करा' : 'Save Choices'}
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="btn btn-primary"
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    padding: '9px 20px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(6, 95, 70, 0.25)',
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'सर्व स्वीकारा' : 'Accept All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import {
  EXPLORE_PUNE_COOKIE_CATALOG,
  openCookiePreferencesModal,
  resetCookieConsent,
  CookieItem,
} from '@/lib/cookies';
import { Cookie, ShieldCheck, Settings, RotateCcw, Lock, ExternalLink, HelpCircle, Layers } from 'lucide-react';

export default function CookiePolicyPage() {
  const { isMr: globalIsMr } = useLanguage();
  const [activeLang, setActiveLang] = useState<'en' | 'mr'>(globalIsMr ? 'mr' : 'en');
  const isMr = activeLang === 'mr';

  const categoryColor: Record<string, { bg: string; text: string; labelEn: string; labelMr: string }> = {
    essential: { bg: '#ecfdf5', text: '#065f46', labelEn: 'Strictly Necessary', labelMr: 'अनिवार्य व आवश्यक' },
    functional: { bg: '#eff6ff', text: '#1e40af', labelEn: 'Functional', labelMr: 'कार्यक्षम पसंती' },
    analytics: { bg: '#f5f3ff', text: '#6d28d9', labelEn: 'Performance & Analytics', labelMr: 'विश्लेषण व गती' },
    personalization: { bg: '#fff7ed', text: '#c2410c', labelEn: 'Personalization', labelMr: 'वैयक्तिकृत वारसा' },
  };

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 960 }}>
      {/* Top Breadcrumb & Language Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Link
          href="/"
          className="chip"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ← {isMr ? 'मुख्य पृष्ठावर परत जा' : 'Back to Home'}
        </Link>

        {/* DPDP Act 2023 Section 5(3) Bilingual Accessibility Switcher */}
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--bg, #f1f5f9)',
            padding: 3,
            borderRadius: 999,
            border: '1px solid var(--line, #e2e8f0)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              background: !isMr ? '#047857' : 'transparent',
              color: !isMr ? '#ffffff' : 'var(--muted)',
              fontWeight: !isMr ? 800 : 600,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: !isMr ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            English (Official)
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('mr')}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              background: isMr ? '#047857' : 'transparent',
              color: isMr ? '#ffffff' : 'var(--muted)',
              fontWeight: isMr ? 800 : 600,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: isMr ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            मराठी (८वी अनुसूची)
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <header
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #064e3b 100%)',
          color: '#ffffff',
          borderRadius: 20,
          padding: '36px 32px',
          marginBottom: 36,
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.14)',
            color: '#34d399',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 14,
          }}
        >
          <Cookie size={16} />
          {isMr ? 'डीपीडीपी कायदा २०२३ • कुकी व साठा धोरण' : 'DPDP Act 2023 • Cookie & Storage Policy'}
        </div>
        <h1
          style={{
            fontSize: 'clamp(24px, 4vw, 34px)',
            fontWeight: 800,
            lineHeight: 1.25,
            margin: '0 0 12px',
          }}
        >
          {isMr
            ? 'एक्सप्लोर पुणे कुकी व स्थानिक डेटा साठा धोरण'
            : 'Explore Pune Cookie & Device Storage Policy'}
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            maxWidth: 720,
            margin: '0 0 20px',
            color: '#e2e8f0',
          }}
        >
          {isMr
            ? 'आम्ही वापरकर्त्यांच्या गोपनीयतेचा आदर करतो. आम्ही तुमचा डेटा कधीही विकत नाही, त्रयस्थ जाहिरातदारांना ट्रॅकिंग देत नाही आणि केवळ पर्यटन अनुभवासाठी आवश्यक डेटा वापरतो.'
            : 'Explore Pune is committed to radical transparency and zero ad-network tracking. Learn how first-party cookies and browser storage are utilized to deliver historic trail navigation and trip planning.'}
        </p>

        {/* Action Controls Inside Banner */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={openCookiePreferencesModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              background: '#ffffff',
              color: '#0f172a',
              fontSize: 13.5,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Settings size={16} color="#047857" />
            {isMr ? 'कुकी पसंती व्यवस्थापित करा' : 'Manage Cookie Preferences'}
          </button>

          <button
            type="button"
            onClick={resetCookieConsent}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: 13.5,
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.25)',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} />
            {isMr ? 'सर्व संमती रीसेट करा' : 'Reset All Consent'}
          </button>
        </div>

        <div style={{ marginTop: 18, fontSize: 12, color: '#94a3b8' }}>
          {isMr ? 'शेवटचे अद्यतन: नोव्हेंबर २०२६ • आवृत्ती १.०' : 'Last Updated: November 2026 • Version 1.0 (Audit-Verified)'}
        </div>
      </header>

      {/* Section 1: Introduction */}
      <section className="panel" style={{ marginBottom: 24, padding: '28px 28px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px', color: 'var(--ink)' }}>
          {isMr ? '१. कुकीज आणि स्थानिक डेटा साठा म्हणजे काय?' : '1. What Are Cookies and Device Storage?'}
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 14px' }}>
          {isMr
            ? 'कुकीज (Cookies) या छोट्या टेक्स्ट फाइल्स असतात ज्या तुम्ही संकेतस्थळाला भेट देता तेव्हा तुमच्या ब्राउझरमध्ये साठवल्या जातात. याव्यतिरिक्त, आधुनिक वेब तंत्रज्ञान LocalStorage आणि SessionStorage चा वापर करते, जेणेकरून पानांचा लोड वेग वाढतो आणि नेटवर्क नसतानाही तुमचे बुकमार्क केलेले किल्ले सुरक्षित राहतात.'
            : 'Cookies are small text strings saved on your browser when you access a web application. Alongside standard HTTP cookies, modern web platforms utilize HTML5 LocalStorage and SessionStorage to cache critical offline heritage data, reduce bandwidth, and remember user preferences without transmitting sensitive data across the wire on every HTTP request.'}
        </p>
        <div
          style={{
            background: 'var(--bg, #f8fafc)',
            borderLeft: '4px solid #047857',
            padding: '14px 18px',
            borderRadius: '0 10px 10px 0',
            fontSize: 13,
            color: 'var(--ink)',
          }}
        >
          <strong style={{ color: '#047857' }}>
            {isMr ? 'महत्त्वाची हमी:' : 'Key Privacy Invariant:'}
          </strong>{' '}
          {isMr
            ? 'एक्सप्लोर पुणे कधीही जाहिराती दाखवत नाही, कोणत्याही थर्ड-पार्टी ॲडव्हर्टायझिंग डेटा ब्रोकर्सशी संलग्न नाही आणि युजर्सचा वैयक्तिक डेटा विकत नाही.'
            : 'Explore Pune does not host third-party advertisement networks, does not sell telemetry to commercial data brokers, and strictly enforces Google Consent Mode v2 with default denied states for unconsented visitors.'}
        </div>
      </section>

      {/* Section 2: Complete Cookie Inventory Catalog Table */}
      <section className="panel" style={{ marginBottom: 24, padding: '28px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', color: 'var(--ink)' }}>
              {isMr ? '२. एक्सप्लोर पुणे वापरत असलेल्या सर्व कुकीजची यादी' : '2. Master Cookie & Storage Catalog'}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
              {isMr
                ? 'खालील तक्त्यात संकेतस्थळावर वापरल्या जाणाऱ्या प्रत्येक तंत्रज्ञानाचा हेतू व कालावधी दर्शविला आहे.'
                : 'Full audit of all first-party and auxiliary storage items, classified by legal purpose.'}
            </p>
          </div>
          <button
            type="button"
            onClick={openCookiePreferencesModal}
            className="btn btn-outline"
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Settings size={14} />
            {isMr ? 'पसंती बदला' : 'Change Consent'}
          </button>
        </div>

        {/* Responsive Table Container */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line, #e2e8f0)', background: 'var(--bg, #f8fafc)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--ink)' }}>
                  {isMr ? 'नाव / की' : 'Storage Key'}
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--ink)' }}>
                  {isMr ? 'वर्ग' : 'Category'}
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--ink)' }}>
                  {isMr ? 'प्रदाता' : 'Provider'}
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--ink)' }}>
                  {isMr ? 'प्रकार' : 'Type'}
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--ink)' }}>
                  {isMr ? 'मुदत' : 'Duration'}
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--ink)' }}>
                  {isMr ? 'वापराचा हेतू' : 'Purpose & Usage'}
                </th>
              </tr>
            </thead>
            <tbody>
              {EXPLORE_PUNE_COOKIE_CATALOG.map((c: CookieItem) => {
                const badge = categoryColor[c.category] || categoryColor.essential;
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid var(--line, #e2e8f0)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '14px 14px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--ink)' }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 999,
                          background: badge.bg,
                          color: badge.text,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isMr ? badge.labelMr : badge.labelEn}
                      </span>
                    </td>
                    <td style={{ padding: '14px 14px', color: 'var(--ink-secondary)', whiteSpace: 'nowrap' }}>
                      {c.provider}
                    </td>
                    <td style={{ padding: '14px 14px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {c.type}
                    </td>
                    <td style={{ padding: '14px 14px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {isMr ? c.expiryMr : c.expiry}
                    </td>
                    <td style={{ padding: '14px 14px', lineHeight: 1.5, color: 'var(--muted)', minWidth: 260 }}>
                      {isMr ? c.purposeMr : c.purposeEn}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Browser Controls Guide */}
      <section className="panel" style={{ marginBottom: 24, padding: '28px 28px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px', color: 'var(--ink)' }}>
          {isMr ? '३. आपल्या ब्राउझरमध्ये कुकीज कशा नियंत्रित कराव्यात?' : '3. How to Manage Cookies in Your Browser'}
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 16px' }}>
          {isMr
            ? 'आमच्या ऑन-साइट पसंती केंद्राव्यतिरिक्त, तुम्ही तुमच्या वेब ब्राउझरच्या सेटिंग्जमधून कोणत्याही वेळी कुकीज ब्लॉक किंवा डिलीट करू शकता:'
            : 'In addition to our on-site Privacy Preferences Center, modern browsers empower you to inspect, block, or purge cookies and web storage at will:'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          <div style={{ border: '1px solid var(--line, #e2e8f0)', borderRadius: 12, padding: 16 }}>
            <strong style={{ fontSize: 14, color: 'var(--ink)' }}>Google Chrome</strong>
            <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
              {isMr
                ? 'सेटिंग्ज → गोपनीयता आणि सुरक्षा → तृतीय-पक्ष कुकीज → ब्लॉक किंवा साफ करा.'
                : 'Settings → Privacy & Security → Third-Party Cookies → Block or clear on exit.'}
            </p>
          </div>

          <div style={{ border: '1px solid var(--line, #e2e8f0)', borderRadius: 12, padding: 16 }}>
            <strong style={{ fontSize: 14, color: 'var(--ink)' }}>Apple Safari (iOS & Mac)</strong>
            <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
              {isMr
                ? 'सेटिंग्ज → सफारी → प्रगत → सर्व कुकीज ब्लॉक करा किंवा प्रिव्हेंट क्रॉस-साइट ट्रॅकिंग.'
                : 'Settings → Safari → Advanced → Block All Cookies or Prevent Cross-Site Tracking.'}
            </p>
          </div>

          <div style={{ border: '1px solid var(--line, #e2e8f0)', borderRadius: 12, padding: 16 }}>
            <strong style={{ fontSize: 14, color: 'var(--ink)' }}>Mozilla Firefox</strong>
            <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
              {isMr
                ? 'पर्याय → गोपनीयता आणि सुरक्षा → वर्धित ट्रॅकिंग संरक्षण (कडक/कस्टम निवडा).'
                : 'Options → Privacy & Security → Enhanced Tracking Protection (Strict/Custom mode).'}
            </p>
          </div>

          <div style={{ border: '1px solid var(--line, #e2e8f0)', borderRadius: 12, padding: 16 }}>
            <strong style={{ fontSize: 14, color: 'var(--ink)' }}>Microsoft Edge</strong>
            <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
              {isMr
                ? 'सेटिंग्ज → कुकीज आणि साइट परवानग्या → कुकीज आणि साइट डेटा व्यवस्थापित करा.'
                : 'Settings → Cookies and Site Permissions → Manage and delete cookies and site data.'}
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: DPDP Compliance & Grievance Contact */}
      <section className="panel" style={{ padding: '28px 28px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px', color: 'var(--ink)' }}>
          {isMr ? '४. कायदेशीर तक्रार निवारण व संपर्क' : '4. Legal Grievance Redressal & Contact'}
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 16px' }}>
          {isMr
            ? 'डीपीडीपी कायदा २०२३ अंतर्गत कोणत्याही डेटा साठ्याबाबत प्रश्न असल्यास किंवा तुमचा साठा हटवण्याची विनंती असल्यास, तुम्ही थेट आमच्या डेव्हलपर टीमशी संपर्क साधू शकता.'
            : 'If you have questions regarding stored device tokens or wish to submit a data erasure request under India’s DPDP Act 2023, please contact our team directly:'}
        </p>

        <div
          style={{
            background: 'var(--bg, #f8fafc)',
            border: '1px solid var(--line, #e2e8f0)',
            borderRadius: 12,
            padding: '16px 20px',
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <div>
            <strong>Explore Pune Lead Development & Data Governance:</strong>
          </div>
          <div style={{ color: 'var(--muted)' }}>
            Suraj Dhok, Sahil Jadhav & Ishan Kakade • Pune, Maharashtra 411001
          </div>
          <div style={{ marginTop: 8 }}>
            <Link
              href="/privacy"
              style={{ color: '#047857', fontWeight: 600, textDecoration: 'underline', marginRight: 16 }}
            >
              {isMr ? 'संपूर्ण गोपनीयता धोरण (DPDP) वाचा →' : 'Read Full Privacy Policy (DPDP) →'}
            </Link>
            <Link
              href="/terms"
              style={{ color: '#047857', fontWeight: 600, textDecoration: 'underline' }}
            >
              {isMr ? 'सेवा अटी वाचा →' : 'Read Terms of Service →'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

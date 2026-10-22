'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function DataMethodologyPage() {
  const { isMr: globalIsMr } = useLanguage();
  const [activeLang, setActiveLang] = useState<'en' | 'mr'>(globalIsMr ? 'mr' : 'en');
  const isMr = activeLang === 'mr';

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 880 }}>
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

        {/* Bilingual Switcher */}
        <div
          style={{
            display: 'inline-flex',
            background: '#f1f5f9',
            padding: 3,
            borderRadius: 999,
            border: '1px solid var(--line)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              background: !isMr ? '#ffffff' : 'transparent',
              color: !isMr ? '#047857' : 'var(--muted)',
              fontWeight: !isMr ? 800 : 600,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: !isMr ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('mr')}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              background: isMr ? '#ffffff' : 'transparent',
              color: isMr ? '#047857' : 'var(--muted)',
              fontWeight: isMr ? 800 : 600,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: isMr ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <header
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          marginBottom: 36,
          boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            fontSize: 11.5,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'rgba(255, 255, 255, 0.16)',
            padding: '4px 12px',
            borderRadius: 999,
            marginBottom: 12,
          }}
        >
          📊 {isMr ? 'पारदर्शक माहिती व डेटा कार्यपद्धती' : 'Open Data, Methodology & Verification'}
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 12px', color: '#ffffff', fontWeight: 800 }}>
          {isMr ? 'डेटा स्रोत, दर्जा आणि पडताळणी पद्धत' : 'Data Methodology, Sourcing & Quality Standards'}
        </h1>
        <p style={{ margin: 0, fontSize: 16, opacity: 0.94, lineHeight: 1.6, maxWidth: 720 }}>
          {isMr
            ? 'एक्सप्लोर पुणेवरील ठिकाणांची माहिती, मेट्रो व बस मार्ग, तिकीट दर आणि वेळापत्रके कशी संकलित व पडताळली जातात याविषयीची संपूर्ण माहिती.'
            : 'How Explore Pune sources, audits, calibrates, and cross-verifies heritage landmarks, Pune Metro stations, and PMPML transit schedules.'}
        </p>
      </header>

      {/* Main Content Article */}
      <article
        style={{
          background: '#ffffff',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          lineHeight: 1.7,
          fontSize: 15,
          color: '#334155',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Verification Tiers */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, color: '#0f172a', fontWeight: 800, marginBottom: 16 }}>
            🏷️ {isMr ? 'डेटा विश्वसनीयता श्रेणी (Reliability Labels)' : 'Data Verification Tiers'}
          </h2>
          <p>
            {isMr
              ? 'पुण्यातील प्रत्येक पर्यटन स्थळाच्या माहितीची विश्वासार्हता समजण्यासाठी आम्ही खालील ३ पारदर्शक श्रेणी वापरतो:'
              : 'Every landmark on Explore Pune is transparently labeled with one of three data verification tiers so travelers know the level of validation:'}
          </p>

          <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
            <div
              style={{
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <span className="tier verified" style={{ marginTop: 2, flexShrink: 0 }}>
                {isMr ? 'तपासलेले तपशील' : 'Verified Details'}
              </span>
              <div>
                <strong style={{ color: '#065f46', display: 'block', marginBottom: 2 }}>
                  {isMr ? 'थेट अधिकृत व प्रत्यक्ष पडताळणी' : 'Primary Source Verified'}
                </strong>
                <p style={{ margin: 0, fontSize: 13.5, color: '#334155' }}>
                  {isMr
                    ? 'स्थळाच्या प्रत्यक्ष फलकावरून, पुरातत्व विभाग (ASI), महाराष्ट्र पर्यटन (MTDC) किंवा विश्वस्त मंडळाच्या अधिकृत नोंदीवरून वेळ व प्रवेश शुल्क तपासलेले आहे.'
                    : 'Opening hours, weekly holidays, ticket prices, and photo rules have been physically verified on-site or cross-checked with official government/trust boards.'}
                </p>
              </div>
            </div>

            <div
              style={{
                background: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <span className="tier enriched" style={{ marginTop: 2, flexShrink: 0 }}>
                {isMr ? 'सार्वजनिक माहिती' : 'Public Source Info'}
              </span>
              <div>
                <strong style={{ color: '#1e40af', display: 'block', marginBottom: 2 }}>
                  {isMr ? 'सार्वजनिक व विकिमीडिया संदर्भ' : 'Open Knowledge Reference'}
                </strong>
                <p style={{ margin: 0, fontSize: 13.5, color: '#334155' }}>
                  {isMr
                    ? 'इतिहास, वर्णने आणि छायाचित्रे विकिपीडिया किंवा विकिमीडिया कॉमन्स संदर्भानुसार आहेत. अचूक वेळेसाठी स्थानिक पातळीवर तपासणी करावी.'
                    : 'Historical summaries, architectural backgrounds, and media are sourced from open knowledge commons (Wikipedia, Wikimedia). Timings are reasonably accurate but subject to local variation.'}
                </p>
              </div>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <span className="tier" style={{ marginTop: 2, flexShrink: 0 }}>
                {isMr ? 'अंदाजे वेळ' : 'Hours Unverified'}
              </span>
              <div>
                <strong style={{ color: '#475569', display: 'block', marginBottom: 2 }}>
                  {isMr ? 'मुक्त नकाशा नोंदी' : 'Open Geospatial Entry'}
                </strong>
                <p style={{ margin: 0, fontSize: 13.5, color: '#334155' }}>
                  {isMr
                    ? 'मुक्त नकाशा माहितीवर आधारित नोंद. सहल करण्यापूर्वी स्थानिक रहिवासी किंवा देवस्थान मंडळाशी संपर्क साधून वेळेची खात्री करावी.'
                    : 'Coordinates and categories confirmed from open geospatial maps. Visitors should confirm operational hours locally before planning visits.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Public Transit Corridors & PMPML GTFS Data */}
        <section style={{ marginBottom: 36, borderTop: '1px solid #e2e8f0', paddingTop: 28 }}>
          <h2 style={{ fontSize: 22, color: '#0f172a', fontWeight: 800, marginBottom: 14 }}>
            🚌 {isMr ? 'अधिकृत PMPML GTFS बस व पुणे मेट्रो डेटा एकत्रीकरण' : 'Official PMPML GTFS Transit & Pune Metro Integration'}
          </h2>
          <p>
            {isMr ? (
              <>
                पुणे शहरात एका ठिकाणाहून दुसऱ्या ठिकाणी जाण्यासाठी प्रवाशांना खाजगी कॅबवर अवलंबून राहावे लागू नये म्हणून आम्ही अधिकृत <strong>PMPML GTFS (General Transit Feed Specification)</strong> डेटाबेस समाविष्ट केला आहे. यात <strong>३१५ बस मार्ग</strong>, <strong>६,७४५ अधिकृत बस थांबे</strong> आणि प्रत्येक वारसा स्थळाजवळचे नेमके बस थांबे समाविष्ट आहेत:
              </>
            ) : (
              <>
                To ensure budget-friendly, sustainable commuting across Pune, Explore Pune integrates the official <strong>PMPML GTFS (General Transit Feed Specification)</strong> dataset, covering <strong>315 official bus routes</strong> and <strong>6,745 geocoded bus stops</strong> directly mapped to city landmarks and transit hubs:
              </>
            )}
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, marginTop: 12, fontSize: 13.5 }}>
            <div style={{ fontWeight: 700, color: '#c2410c', marginBottom: 8, fontSize: 14 }}>
              {isMr ? 'प्रमुख PMPML बस कॉरिडॉर्स व वारसा थांबे:' : 'Key PMPML Corridors & Landmark Stops:'}
            </div>
            <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
              <li><strong>Bus 149:</strong> Hadapsar Gadital ↔ Nigdi Pradhikaran via Kharadi Bypass, Viman Nagar, Bhosari & Pimpri</li>
              <li><strong>Bus 108:</strong> Pune Station Moledina Road ↔ Sutardara via Shaniwarwada (85m walk), Kesari Wada & Deccan</li>
              <li><strong>Bus 50:</strong> Swargate Natraj Stand ↔ Sinhagad Fort Paytha / Donje via Khadakwasla Dam</li>
              <li><strong>Bus 144 / 144A:</strong> Pune Station ↔ NDA 10 No. Gate / Khadakwasla Dam via Shaniwar Wada & Swargate</li>
              <li><strong>Bus 100:</strong> Ma Na Pa (PMC) / Pune Station ↔ Hinjawadi Maan Phase 3 via Baner & Wakad Bridge</li>
              <li><strong>Bus 119:</strong> Alandi Sant Dnyaneshwar Samadhi ↔ Ma Na Pa Daphale Garage via Dighi & Charholi</li>
              <li><strong>Bus 24:</strong> Katraj Bus Depot ↔ Pune Railway Station via Swargate & Sarasbaug / Parvati</li>
              <li><strong>Bus 42:</strong> Nigdi Bhakti Shakti ↔ Katraj Bus Depot via Pimpri, Shivajinagar, Swargate & Parvati Payatha</li>
              <li><strong>Pune Metro Line 1 (Purple):</strong> PCMC Station ↔ Swargate (via Shivajinagar & Civil Court)</li>
              <li><strong>Pune Metro Line 2 (Aqua):</strong> Vanaz (Kothrud) ↔ Ramwadi (via Deccan Gymkhana & District Court)</li>
            </ul>
          </div>
        </section>

        {/* DPDP Act 2023 Compliance & Data Minimization */}
        <section style={{ marginBottom: 36, borderTop: '1px solid #e2e8f0', paddingTop: 28 }}>
          <h2 style={{ fontSize: 22, color: '#0f172a', fontWeight: 800, marginBottom: 14 }}>
            🛡️ {isMr ? 'DPDP कायदा २०२३ डेटा नैतिकता (Data Ethics & DPDP Act)' : 'Data Ethics & DPDP Act 2023 Compliance'}
          </h2>
          <p>
            {isMr
              ? 'भारतीय डिजिटल वैयक्तिक डेटा संरक्षण कायदा, २०२३ (DPDP Act) च्या तत्त्वांचे पालन करत आम्ही वापरकर्त्याच्या गोपनीयतेचे रक्षण करतो. आम्ही कोणताही डेटा ट्रॅकिंग कंपन्यांना विकत नाही. जीपीएस स्थान फक्त जवळची ठिकाणे दाखवण्यासाठी थेट ब्राउझरमध्ये वापरले जाते आणि सर्व्हरवर साठवले जात नाही.'
              : 'In strict compliance with the Digital Personal Data Protection Act, 2023, Explore Pune upholds the highest standards of data minimization and purpose limitation. Browser geolocation coordinates are processed strictly in-browser memory to compute route distances and are never tracked in the background or sold to data brokers.'}
          </p>
        </section>

        {/* Data Corrections & Contact Information */}
        <section style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 18, color: '#0f172a', fontWeight: 800, marginTop: 0, marginBottom: 10 }}>
            📬 {isMr ? 'डेटा दुरुस्ती व संपर्क (Data Corrections & Submissions)' : 'Report Data Corrections & Add Hidden Spots'}
          </h3>
          <p style={{ fontSize: 14, margin: '0 0 16px', lineHeight: 1.6 }}>
            {isMr
              ? 'एखाद्या ठिकाणाच्या वेळेत बदल झाला असल्यास, नवीन बस मार्ग सुचवायचा असल्यास किंवा नवीन प्रेक्षणीय स्थळ जोडायचे असल्यास आमच्या संस्थापकांशी थेट संपर्क साधा:'
              : 'Notice a change in venue entry fees, updated metro feeders, or want to contribute a hidden Pune landmark? Reach out directly to our team:'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
              <strong style={{ display: 'block', fontSize: 15, color: '#047857' }}>Suraj Dhok</strong>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>Technical Architecture & Data Engineering</span>
              <a
                href="mailto:surajdhok1010@gmail.com"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13.5, color: '#047857', fontWeight: 800, textDecoration: 'underline' }}
              >
                ✉️ surajdhok1010@gmail.com
              </a>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
              <strong style={{ display: 'block', fontSize: 15, color: '#1d4ed8' }}>Sahil Jadhav</strong>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>Heritage Research & Community Sourcing</span>
              <a
                href="mailto:sj176644@gmail.com"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13.5, color: '#1d4ed8', fontWeight: 800, textDecoration: 'underline' }}
              >
                ✉️ sj176644@gmail.com
              </a>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
              <strong style={{ display: 'block', fontSize: 15, color: '#b45309' }}>Ishan Kakade</strong>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>Strategic Advisor & Heritage Consultant</span>
              <a
                href="mailto:1ishankakade@gmail.com"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13.5, color: '#b45309', fontWeight: 800, textDecoration: 'underline' }}
              >
                ✉️ 1ishankakade@gmail.com
              </a>
            </div>
          </div>
        </section>
      </article>

      {/* Footer Navigation Links */}
      <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
        <Link href="/about" style={{ color: '#047857', fontWeight: 700, fontSize: 14, textDecoration: 'underline' }}>
          {isMr ? 'आमच्याबद्दल (About Us) पहा →' : 'View About Us →'}
        </Link>
        <Link href="/privacy" style={{ color: '#047857', fontWeight: 700, fontSize: 14, textDecoration: 'underline' }}>
          {isMr ? 'गोपनीयता धोरण (DPDP Act)' : 'Privacy Policy (DPDP)'}
        </Link>
        <Link href="/terms" style={{ color: '#047857', fontWeight: 700, fontSize: 14, textDecoration: 'underline' }}>
          {isMr ? 'सेवा अटी' : 'Terms of Service'}
        </Link>
      </div>
    </main>
  );
}

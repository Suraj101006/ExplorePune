'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function AboutPage() {
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
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          marginBottom: 36,
          boxShadow: '0 16px 36px rgba(6, 95, 70, 0.2)',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            fontSize: 11.5,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: 999,
            marginBottom: 12,
          }}
        >
          🚩 {isMr ? 'पुणे पर्यटन व सांस्कृतिक वारसा' : 'About Explore Pune'}
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', margin: '0 0 12px', color: '#ffffff', fontWeight: 800 }}>
          {isMr ? 'पुण्याचा इतिहास, संस्कृती आणि सह्याद्रीची सफर' : 'Preserving Heritage, Empowering Pune Explorers'}
        </h1>
        <p style={{ margin: 0, fontSize: 16, opacity: 0.94, lineHeight: 1.6, maxWidth: 720 }}>
          {isMr
            ? 'ऐतिहासिक गड-किल्ले, पेशवेकालीन वाडे, प्रसिद्ध देवस्थाने आणि थेट पुणे मेट्रो व पीएमपीएमएल बस मार्गांसह पुण्याची खरी ओळख देणारे महाराष्ट्रातील अग्रगण्य डिजिटल व्यासपीठ.'
            : 'The definitive open tourism platform uniting Sahyadri hill fortresses, Peshwa wadas, revered shrines, and real-time Pune Metro & PMPML public transit navigation.'}
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
        {/* Mission & Vision */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, color: '#0f172a', fontWeight: 800, marginBottom: 14 }}>
            🎯 {isMr ? 'आमचे ध्येय व संकल्पना (Our Mission)' : 'Our Mission & Vision'}
          </h2>
          <p>
            {isMr ? (
              <>
                <strong>Explore Pune</strong> ची निर्मिती पुणे शहर आणि परिसरातील पर्यटन अधिक सुलभ, विश्वासार्ह आणि प्रेरणादायी बनवण्यासाठी करण्यात आली आहे. शनिवार वाडा, लाल महाल, सिंहगड, पाताळेश्वर अशा ५० हून अधिक ऐतिहासिक ठिकाणांचे अचूक चालू-बंद वेळ, तिकीट दर, पार्किंग माहिती आणि प्रत्यक्ष <strong>पुणे मेट्रो (पर्पल व अक्वा लाईन)</strong> तसेच <strong>PMPML बस मार्ग (उदा. बस क्र. १४९, २४, ५०, १५९)</strong> एकाच ठिकाणी उपलब्ध करून देणे हा आमचा मुख्य उद्देश आहे.
              </>
            ) : (
              <>
                <strong>Explore Pune</strong> was born out of a profound passion to solve real commuter and traveler challenges across Pune. While Pune is globally celebrated for its Maratha history and Sahyadri landscapes, visitors often struggle with unverified operating hours, confusing bus terminal transfers, and fragmented travel info. Explore Pune unifies verified landmarks, accurate timings, entry fees, and point-to-point public transit navigation into an intuitive, bilingual experience.
              </>
            )}
          </p>
        </section>

        {/* Founders / Engineering Team */}
        <section style={{ marginBottom: 36, borderTop: '1px solid #e2e8f0', paddingTop: 28 }}>
          <h2 style={{ fontSize: 22, color: '#0f172a', fontWeight: 800, marginBottom: 18 }}>
            👥 {isMr ? 'संस्थापक व विकासक संघ (Leadership & Engineering Team)' : 'Meet the Founders & Engineering Team'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Suraj Dhok Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                border: '1.5px solid #a7f3d0',
                borderRadius: 14,
                padding: '24px 20px',
                boxShadow: '0 4px 12px rgba(6, 95, 70, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#047857',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  SD
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#065f46', fontWeight: 800 }}>Suraj Dhok</h3>
                  <span style={{ fontSize: 13, color: '#047857', fontWeight: 600 }}>
                    {isMr ? 'सह-संस्थापक आणि मुख्य तंत्रज्ञान विकासक' : 'Co-Founder & Lead Engineer'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: '#334155', margin: '0 0 14px', lineHeight: 1.5 }}>
                {isMr
                  ? 'सॉफ्टवेअर आर्किटेक्चर, फायरबेस क्लाऊड इन्फ्रास्ट्रक्चर, डीपीडीपी डेटा सुरक्षा आणि अल्गोरिदम नियोजनाचे नेतृत्व.'
                  : 'Leading platform architecture, Firebase cloud integrations, DPDP Act 2023 compliance, and transit routing engines.'}
              </p>
              <div style={{ fontSize: 13, borderTop: '1px solid #bbf7d0', paddingTop: 10 }}>
                <strong>Contact Email:</strong>{' '}
                <a href="mailto:suraj10.pp@gmail.com" style={{ color: '#047857', fontWeight: 700, textDecoration: 'underline' }}>
                  suraj10.pp@gmail.com
                </a>
              </div>
            </div>

            {/* Sahil Jadhav Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
                border: '1.5px solid #bfdbfe',
                borderRadius: 14,
                padding: '24px 20px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#1d4ed8',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  SJ
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#1e40af', fontWeight: 800 }}>Sahil Jadhav</h3>
                  <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>
                    {isMr ? 'सह-संस्थापक आणि उत्पादन व्यवस्थापक' : 'Co-Founder & Product Architect'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: '#334155', margin: '0 0 14px', lineHeight: 1.5 }}>
                {isMr
                  ? 'पुणेरी ऐतिहासिक संशोधन, वापरकर्ता अनुभव, पी.एम.पी.एम.एल मार्ग संकलन आणि कम्युनिटी मार्गदर्शन.'
                  : 'Overseeing Pune heritage research, transit corridor mapping, UI/UX aesthetics, and community engagement.'}
              </p>
              <div style={{ fontSize: 13, borderTop: '1px solid #bfdbfe', paddingTop: 10 }}>
                <strong>Contact Email:</strong>{' '}
                <a href="mailto:sj176644@gmail.com" style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'underline' }}>
                  sj176644@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Core Pillars */}
        <section style={{ marginBottom: 36, borderTop: '1px solid #e2e8f0', paddingTop: 28 }}>
          <h2 style={{ fontSize: 22, color: '#0f172a', fontWeight: 800, marginBottom: 16 }}>
            ⭐ {isMr ? 'आमची ५ मुख्य वैशिष्ट्ये (Our Core Pillars)' : 'Our 5 Core Pillars'}
          </h2>

          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 16 }}>
              <strong style={{ color: '#0f172a', fontSize: 15.5 }}>1. {isMr ? '१००% मोफत व पारदर्शक पर्यटन:' : '100% Free & Open Community Platform:'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 14 }}>
                {isMr
                  ? 'सर्व सहल नियोजन, मेट्रो व बस मार्गदर्शक आणि सानुकूल PDF डाउनलोड पूर्णपणे मोफत आहेत.'
                  : 'No paywalls, hidden booking charges, or biased sponsored listings. Everything is 100% open.'}
              </p>
            </div>

            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 16 }}>
              <strong style={{ color: '#0f172a', fontSize: 15.5 }}>2. {isMr ? 'प्रत्यक्ष PMPML बस व पुणे मेट्रो जोडणी:' : 'Integrated Pune Metro & PMPML Corridors:'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 14 }}>
                {isMr
                  ? 'प्रत्येक ठिकाणासाठी थेट बस क्रमांक (उदा. हडपसर ते निगडी बस १४९) आणि जिल्हा न्यायालय मेट्रो इंटरचेंजचे अचूक मार्गदर्शन.'
                  : 'Real bus numbers with origin/terminus endpoints and District Court Metro interchange guidance for seamless commuting.'}
              </p>
            </div>

            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 16 }}>
              <strong style={{ color: '#0f172a', fontSize: 15.5 }}>3. {isMr ? 'DPDP कायदा २०२३ अंतर्गत डेटा सुरक्षा:' : 'DPDP Act 2023 Compliant Privacy:'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 14 }}>
                {isMr
                  ? 'वापरकर्त्याचा जीपीएस किंवा वैयक्तिक डेटा कोणत्याही तिसऱ्या पक्षाला विकला जात नाही. वापरकर्त्याचे स्वतःच्या डेटावर पूर्ण सार्वभौमत्व आहे.'
                  : 'Strict adherence to India’s DPDP Act 2023. User data is protected with transparent consent, purpose limitation, and zero ad profiling.'}
              </p>
            </div>

            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 16 }}>
              <strong style={{ color: '#0f172a', fontSize: 15.5 }}>4. {isMr ? 'माझी सफर (My Journey) - खरा प्रवास इतिहास:' : 'My Journey - Authentic Travel Journal:'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 14 }}>
                {isMr
                  ? 'साइन इन केलेल्या वापरकर्त्याला त्याने प्रत्यक्ष भेट दिलेल्या ठिकाणांचा खरा नकाशा, अंतर आणि तारीखवार इतिहास दिसतो.'
                  : 'Logged-in users experience their genuine visit check-ins, photo proofs, and chronological exploration map.'}
              </p>
            </div>

            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 16 }}>
              <strong style={{ color: '#0f172a', fontSize: 15.5 }}>5. {isMr ? 'द्विभाषिक सुविधा (मराठी व इंग्रजी):' : 'Bilingual First (English & Marathi):'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 14 }}>
                {isMr
                  ? 'महाराष्ट्राची संस्कृती आणि मराठी भाषेचा आदर राखून प्रत्येक माहिती अस्सल मराठीत उपलब्ध.'
                  : 'Deep bilingual support ensuring every landmark, note, and PDF schedule is culturally authentic in Marathi and English.'}
              </p>
            </div>
          </div>
        </section>

        {/* Contact & Support Box */}
        <section style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 18, color: '#0f172a', fontWeight: 800, marginTop: 0, marginBottom: 10 }}>
            📬 {isMr ? 'आमच्याशी संपर्क साधा (Direct Contact Emails)' : 'Contact the Explore Pune Team'}
          </h3>
          <p style={{ fontSize: 14, margin: '0 0 16px', lineHeight: 1.6 }}>
            {isMr
              ? 'आपल्याकडे नवीन ठिकाणाची माहिती, वेळेत दुरुस्ती, सहकार्य अथवा तांत्रिक मदतीसाठी आमच्याशी खालील ईमेल पत्त्यांवर थेट संपर्क साधा:'
              : 'For suggestions, historical corrections, partnership proposals, or technical inquiries, reach out directly to our founders:'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
              <strong style={{ display: 'block', fontSize: 15, color: '#047857' }}>Suraj Dhok</strong>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>Technical Architecture & Systems</span>
              <a
                href="mailto:suraj10.pp@gmail.com"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13.5, color: '#047857', fontWeight: 800, textDecoration: 'underline' }}
              >
                ✉️ suraj10.pp@gmail.com
              </a>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
              <strong style={{ display: 'block', fontSize: 15, color: '#1d4ed8' }}>Sahil Jadhav</strong>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>Product & Community Outreach</span>
              <a
                href="mailto:sj176644@gmail.com"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13.5, color: '#1d4ed8', fontWeight: 800, textDecoration: 'underline' }}
              >
                ✉️ sj176644@gmail.com
              </a>
            </div>
          </div>
        </section>
      </article>

      {/* Footer Navigation Links */}
      <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
        <Link href="/data" style={{ color: '#047857', fontWeight: 700, fontSize: 14, textDecoration: 'underline' }}>
          {isMr ? 'डेटा कार्यपद्धती (Data Methodology) पहा →' : 'View Data Methodology →'}
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

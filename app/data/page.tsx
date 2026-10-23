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
        {/* 3-Tier Source Hierarchy & Authenticity Scoring System */}
        <section style={{ marginBottom: 36, borderBottom: '1px solid #e2e8f0', paddingBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 24 }}>🛡️</span>
            <div>
              <h2 style={{ fontSize: 22, color: '#0f172a', fontWeight: 800, margin: 0 }}>
                {isMr ? 'त्रिस्तरीय सत्यता व स्रोत पडताळणी पद्धत (3-Tier Authority Hierarchy)' : 'Authentic Sourcing & 3-Tier Verification Hierarchy'}
              </h2>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                {isMr
                  ? 'गुगल किंवा खाजगी जाहिराती नव्हे, तर शासकीय व वारसा संस्थांद्वारे प्रमाणित स्थळे'
                  : 'Google verifies physical existence; State & Heritage Authorities determine cultural authenticity'}
              </span>
            </div>
          </div>

          <p style={{ fontSize: 14.5, color: '#334155', lineHeight: 1.65 }}>
            {isMr
              ? 'पुण्यातील खऱ्या आणि अस्सल पर्यटन स्थळांची निवड करण्यासाठी आम्ही एका कडक त्रिस्तरीय (3-Tier) कार्यपद्धतीचा अवलंब करतो. यामुळे "पुण्यातील पर्यटन स्थळे" शोधताना प्रवाशांना सामान्य दुकाने, सलून किंवा व्यावसायिक हॉटेल्स दिसत नाहीत, तर केवळ अधिकृत व ऐतिहासिकदृष्ट्या महत्त्वाचा वारसा सादर केला जातो.'
              : 'Explore Pune implements a strict 3-tier curation hierarchy. When someone searches for authentic places in Pune, they are never served ordinary businesses, salons, or commercial listings. Cultural and historical authenticity is strictly established before any place is admitted.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
            {/* Tier 1 */}
            <div style={{ background: '#faf5ff', border: '1.5px solid #d8b4fe', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🏛️</span>
                <strong style={{ color: '#6b21a8', fontSize: 15 }}>
                  {isMr ? 'Tier 1 — शोध व अधिकृत मान्यता' : 'Tier 1 — Discovery & Authority'}
                </strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#4c1d95', lineHeight: 1.6 }}>
                <li>Maharashtra Tourism Development Corporation (MTDC)</li>
                <li>Government of Maharashtra &amp; PMC / PCMC Heritage Cell</li>
                <li>Incredible India (Ministry of Tourism, Govt of India)</li>
                <li>Archaeological Survey of India (ASI / Ministry of Culture)</li>
                <li>Official museum, fort, and registered trust portals</li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>📍</span>
                <strong style={{ color: '#166534', fontSize: 15 }}>
                  {isMr ? 'Tier 2 — प्रत्यक्ष अस्तित्त्वाची पडताळणी' : 'Tier 2 — Physical Verification'}
                </strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#14532d', lineHeight: 1.6 }}>
                <li><strong>Google Places:</strong> Verifies physical existence, operational status, entry gate, and opening hours only. <em>(Google does NOT decide cultural significance)</em></li>
                <li><strong>OpenStreetMap (OSM):</strong> Verifies boundary polygons, public access paths, and nearby transit stops.</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>📚</span>
                <strong style={{ color: '#334155', fontSize: 15 }}>
                  {isMr ? 'Tier 3 — संशोधन व ऐतिहासिक संदर्भ' : 'Tier 3 — Research & Enrichment'}
                </strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
                <li>Wikidata &amp; Wikipedia scholarly citations</li>
                <li>Historical gazetteers (e.g. 1885 Poona District Gazetteer)</li>
                <li>State archives, academic publications &amp; peer-reviewed history</li>
              </ul>
            </div>
          </div>

          {/* Authenticity Score Rubric */}
          <div style={{ marginTop: 24, background: '#f1f5f9', borderRadius: 12, padding: '20px 24px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16, color: '#0f172a', fontWeight: 800 }}>
              ⚖️ {isMr ? 'पुरावा-आधारित सत्यता गुणांकन (Authenticity Score Model — Max 100 Pts)' : 'Evidence-Based Authenticity Scoring Model (Max 100 Pts)'}
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: 13.5, color: '#475569' }}>
              {isMr
                ? 'प्रत्येक पर्यटन स्थळाला पुराव्याच्या आधारे १०० पैकी गुण दिले जातात:'
                : 'Every place is evaluated against tangible institutional evidence across 5 pillars:'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 12.5 }}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a', display: 'block' }}>🏛️ Government / Tourism</strong>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: 14 }}>+30 points</span>
                <div style={{ color: '#64748b', fontSize: 11.5 }}>ASI, MTDC, State Protected, PMC Heritage Grade I/II</div>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a', display: 'block' }}>📜 Official Institution</strong>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: 14 }}>+25 points</span>
                <div style={{ color: '#64748b', fontSize: 11.5 }}>Registered public trust, management board, official website</div>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a', display: 'block' }}>⏳ Historical Significance</strong>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: 14 }}>+20 points</span>
                <div style={{ color: '#64748b', fontSize: 11.5 }}>Shivaji Maharaj era, Peshwa era, Freedom Struggle, ancient caves</div>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a', display: 'block' }}>🏙️ Local Importance</strong>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: 14 }}>+15 points</span>
                <div style={{ color: '#64748b', fontSize: 11.5 }}>Gramdaivat of Pune, Manache Ganpati, Vetal Tekdi conservation</div>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a', display: 'block' }}>📍 Geographic Presence</strong>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: 14 }}>+10 points</span>
                <div style={{ color: '#64748b', fontSize: 11.5 }}>Verified physical access, OSM polygon, zero ghost listings</div>
              </div>
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #cbd5e1', display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12 }}>
              <span style={{ background: '#ede9fe', color: '#6b21a8', padding: '3px 10px', borderRadius: 6, fontWeight: 700 }}>
                🏆 90–100: Signature Pune
              </span>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: 6, fontWeight: 700 }}>
                🛡️ 75–89: Authentic Pune
              </span>
              <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 6, fontWeight: 700 }}>
                💎 60–74: Local / Hidden Gem
              </span>
              <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '3px 10px', borderRadius: 6, fontWeight: 700 }}>
                🚫 &lt;60: Excluded from Tourism Database
              </span>
            </div>
          </div>
        </section>

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
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
              <img
                src="/images/team/suraj-dhok.jpg"
                alt="Suraj Dhok"
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2.5px solid #a7f3d0', boxShadow: '0 2px 6px rgba(4, 120, 87, 0.2)', flexShrink: 0 }}
              />
              <div>
                <strong style={{ display: 'block', fontSize: 15, color: '#047857' }}>Suraj Dhok</strong>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>Technical Architecture & Data Engineering</span>
                <a
                  href="mailto:surajdhok1010@gmail.com"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 13.5, color: '#047857', fontWeight: 800, textDecoration: 'underline' }}
                >
                  ✉️ surajdhok1010@gmail.com
                </a>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
              <img
                src="/images/team/sahil-jadhav.jpg"
                alt="Sahil Jadhav"
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2.5px solid #bfdbfe', boxShadow: '0 2px 6px rgba(29, 78, 216, 0.2)', flexShrink: 0 }}
              />
              <div>
                <strong style={{ display: 'block', fontSize: 15, color: '#1d4ed8' }}>Sahil Jadhav</strong>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>Heritage Research & Community Sourcing</span>
                <a
                  href="mailto:sj176644@gmail.com"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 13.5, color: '#1d4ed8', fontWeight: 800, textDecoration: 'underline' }}
                >
                  ✉️ sj176644@gmail.com
                </a>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
              <img
                src="/images/team/ishan-kakade.jpg"
                alt="Ishan Kakade"
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2.5px solid #fde68a', boxShadow: '0 2px 6px rgba(180, 83, 9, 0.2)', flexShrink: 0 }}
              />
              <div>
                <strong style={{ display: 'block', fontSize: 15, color: '#b45309' }}>Ishan Kakade</strong>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>Quality Assurance (QA) Testing & Documentation</span>
                <a
                  href="mailto:1ishankakade@gmail.com"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 13.5, color: '#b45309', fontWeight: 800, textDecoration: 'underline' }}
                >
                  ✉️ 1ishankakade@gmail.com
                </a>
              </div>
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

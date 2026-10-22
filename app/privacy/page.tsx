'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function PrivacyPolicyPage() {
  const { isMr: globalIsMr } = useLanguage();
  const [activeLang, setActiveLang] = useState<'en' | 'mr'>(globalIsMr ? 'mr' : 'en');
  const isMr = activeLang === 'mr';

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 860 }}>
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
            English (Official)
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
            मराठी (८वी अनुसूची)
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <header
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 32px',
          marginBottom: 36,
          boxShadow: '0 12px 32px rgba(6, 95, 70, 0.18)',
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
          🛡️ {isMr ? 'डिजिटल वैयक्तिक डेटा संरक्षण कायदा, २०२३' : 'Digital Personal Data Protection Act, 2023 (DPDP Act)'}
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', margin: '0 0 10px', color: '#ffffff', fontWeight: 800 }}>
          {isMr ? 'गोपनीयता धोरण (Privacy Policy)' : 'Privacy Policy & Data Protection Notice'}
        </h1>
        <p style={{ margin: 0, fontSize: 14.5, opacity: 0.94, lineHeight: 1.6, maxWidth: 700 }}>
          {isMr
            ? 'एक्सप्लोर पुणे (Explore Pune) हे व्यासपीठ भारतीय डिजिटल वैयक्तिक डेटा संरक्षण कायदा, २०२३ (DPDP Act 2023) अंतर्गत आपल्या गोपनीयतेचा आणि वैयक्तिक माहितीच्या अधिकारांचा पूर्ण आदर करते.'
            : 'Explore Pune is committed to protecting your personal data and upholding your statutory rights in strict adherence with the Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023 of India).'}
        </p>
        <div style={{ marginTop: 16, fontSize: 12.5, opacity: 0.82 }}>
          {isMr ? 'अंतिम सुधारणा तारीख: २२ ऑक्टोबर २०२६ • आवृत्ती २.०' : 'Effective & Last Updated: 22 October 2026 • Version 2.0 (DPDPA Compliant)'}
        </div>
      </header>

      {/* Main Legal Content */}
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
        {/* Section 1: Data Fiduciary Identity */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🏢</span> {isMr ? '१. डेटा फिड्युशियरी ओळख (Data Fiduciary Identity)' : '1. Data Fiduciary Details'}
          </h2>
          <p>
            {isMr ? (
              <>
                DPDP कायदा २०२३ च्या कलम २(i) नुसार, <strong>Explore Pune</strong> हे व्यासपीठ डेटा फिड्युशियरी (Data Fiduciary) म्हणून काम करते. हे व्यासपीठ <strong>सुरज ढोक (Suraj Dhok)</strong> आणि <strong>साहिल जाधव (Sahil Jadhav)</strong> यांच्या नेतृत्वाखाली पुणे पर्यटन, वारसा आणि सार्वजनिक वाहतूक मार्गदर्शनासाठी संचालित केले जाते.
              </>
            ) : (
              <>
                Pursuant to Section 2(i) of the Digital Personal Data Protection Act, 2023, <strong>Explore Pune</strong> operates as the Data Fiduciary responsible for determining the purpose and means of processing personal data. The platform is founded and engineered by <strong>Suraj Dhok</strong> and <strong>Sahil Jadhav</strong> for public tourism, heritage education, and civic transit navigation in Pune, Maharashtra.
              </>
            )}
          </p>
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13.5 }}>
            <strong>{isMr ? 'संपर्क पत्ता:' : 'Registered Contact Address:'}</strong> Explore Pune Initiative, Pune, Maharashtra 411047, India.<br />
            <strong>{isMr ? 'अधिकृत ईमेल:' : 'Official Communications:'}</strong> <a href="mailto:surajdhok1010@gmail.com" style={{ color: '#047857', fontWeight: 700 }}>surajdhok1010@gmail.com</a> • <a href="mailto:sj176644@gmail.com" style={{ color: '#047857', fontWeight: 700 }}>sj176644@gmail.com</a> • <a href="mailto:1ishankakade@gmail.com" style={{ color: '#047857', fontWeight: 700 }}>1ishankakade@gmail.com</a>
          </div>
        </section>

        {/* Section 2: Grounds for Processing & Clear Consent */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📝</span> {isMr ? '२. संमती व वैयक्तिक डेटा संकलन (Consent & Personal Data Collected)' : '2. Grounds for Processing & Clear Consent (Section 6)'}
          </h2>
          <p>
            {isMr
              ? 'DPDP कायद्याच्या कलम ६ नुसार, आम्ही कोणत्याही वापरकर्त्याची माहिती केवळ स्पष्ट, मुक्त आणि सकारात्मक संमतीने (Affirmative Action Checkbox) गोळा करतो. आम्ही खालील मर्यादित डेटा गोळा करतो:'
              : 'Under Section 6 of the DPDP Act 2023, personal data is processed solely with your prior, freely given, specific, informed, unconditional, and unambiguous consent indicated through affirmative action (such as the mandatory checkbox during sign-in):'}
          </p>
          <ul style={{ paddingLeft: 22, marginTop: 8 }}>
            <li>
              <strong>{isMr ? 'खाते माहिती (Identity & Authentication):' : 'Identity & Account Data:'}</strong>{' '}
              {isMr ? 'तुमचे नाव, ईमेल पत्ता आणि पासवर्ड किंवा गुगल ऑथेंटिकेशन टोकन्स (फायरबेस ऑथद्वारे सुरक्षित).' : 'Name, email address, profile avatar, and authentication tokens via Google OAuth or Firebase Auth.'}
            </li>
            <li>
              <strong>{isMr ? 'स्थान व जीपीएस डेटा (Browser Geolocation):' : 'Precise Geolocation Data:'}</strong>{' '}
              {isMr ? 'केवळ तुम्ही स्वेच्छेने परवानगी दिल्यास, जवळची ठिकाणे आणि अचूक बस/मेट्रो मार्ग शोधण्यासाठी ब्राउझरचा ऑन-डिव्हाइस GPS वापरला जातो. हा डेटा आमच्या सर्व्हरवर विकला किंवा ट्रॅक केला जात नाही.' : 'With explicit browser permission, device coordinates are accessed strictly on-device to calculate route distance to Pune landmarks, Metro stations, and PMPML bus terminals. We never track your background location or sell geolocation data.'}
            </li>
            <li>
              <strong>{isMr ? 'वापरकर्त्याचा सहभाग व फोटो (User Generated Content):' : 'User Exploration Data & Photo Proofs:'}</strong>{' '}
              {isMr ? 'यशोगाथा (Milestones) व "I Have Been Here" भेटीची नोंद करताना तुम्ही स्वेच्छेने अपलोड केलेले फोटो, भेटीची तारीख व प्रवास वर्णने (खाजगी किंवा सार्वजनिक पर्याय).' : 'Attraction visit check-ins, personal trekking notes, user-uploaded landmark photos for milestone validation, and travel reviews.'}
            </li>
            <li>
              <strong>{isMr ? 'संपर्क व अभिप्राय (Feedback & Communications):' : 'Feedback & Itinerary Email Requests:'}</strong>{' '}
              {isMr ? 'अभिप्राय संदेश, रेटिंग्ज आणि ट्रिप प्लॅनरद्वारे सानुकूल PDF वेळापत्रक ईमेलने प्राप्त करण्याची विनंती.' : 'Feedback ratings, suggestions, and itinerary email dispatch requests along with generated PDF schedules.'}
            </li>
          </ul>
        </section>

        {/* Section 3: Specified Purpose of Processing */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎯</span> {isMr ? '३. माहिती प्रक्रियेचा उद्देश (Specified Purpose of Processing - Section 5)' : '3. Purpose Limitation (Section 5)'}
          </h2>
          <p>
            {isMr
              ? 'डेटा फक्त खालील वैध आणि निर्दिष्ट उद्देशांसाठीच वापरला जातो:'
              : 'Your personal data is collected and processed strictly for the following legitimate purposes:'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 12 }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 8 }}>
              <strong style={{ color: '#065f46', display: 'block', marginBottom: 4 }}>🧭 {isMr ? 'सहलीचे नियोजन व मार्ग' : 'Custom Itinerary Generation'}</strong>
              <span style={{ fontSize: 13 }}>{isMr ? 'मेट्रो व पीएमपीएमएल बस मार्गांसह सानुकूल प्रवास आराखडा तयार करणे.' : 'Generating personalized multi-stop routes with real Pune Metro & PMPML bus corridors.'}</span>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 8 }}>
              <strong style={{ color: '#065f46', display: 'block', marginBottom: 4 }}>🏆 {isMr ? 'यशोगाथा व पदके' : 'Milestones & Verification'}</strong>
              <span style={{ fontSize: 13 }}>{isMr ? 'पुण्यातील गड, वाडे आणि मंदिरांच्या भेटींची नोंद ठेवून पदके देणे.' : 'Verifying completed visits to Sahyadri forts, wadas, and sacred shrines.'}</span>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 8 }}>
              <strong style={{ color: '#065f46', display: 'block', marginBottom: 4 }}>📬 {isMr ? 'ईमेल संप्रेषण' : 'Official Communications'}</strong>
              <span style={{ fontSize: 13 }}>{isMr ? 'explorepune232@gmail.com द्वारे आभार संदेश व PDF वेळापत्रक पाठवणे.' : 'Dispatching automated Thank-You confirmations and PDF schedules via explorepune232@gmail.com.'}</span>
            </div>
          </div>
        </section>

        {/* Section 4: Data Principal Rights under DPDP Act */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚖️</span> {isMr ? '४. वापरकर्त्याचे वैधानिक हक्क (Rights of Data Principals - Sections 11-14)' : '4. Your Statutory Rights as Data Principal (Sections 11–14)'}
          </h2>
          <p>
            {isMr
              ? 'भारतीय DPDP कायदा २०२३ अंतर्गत तुम्हाला खालील वैधानिक अधिकार प्राप्त आहेत:'
              : 'Under Chapter III of the Digital Personal Data Protection Act, 2023, you are guaranteed the following enforceable rights:'}
          </p>

          <div style={{ display: 'grid', gap: 14, marginTop: 14 }}>
            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 14 }}>
              <strong style={{ color: '#0f172a' }}>1. {isMr ? 'माहिती मिळवण्याचा अधिकार (Right to Access Information - Sec 11):' : 'Right to Access Information (Section 11):'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13.5 }}>
                {isMr ? 'आमच्याकडे तुमच्या कोणत्या वैयक्तिक नोंदी आहेत याची माहिती मिळवण्याचा तुम्हाला अधिकार आहे.' : 'You have the right to obtain a summary of your personal data being processed, the processing activities carried out, and the identities of all data fiduciaries/processors.'}
              </p>
            </div>

            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 14 }}>
              <strong style={{ color: '#0f172a' }}>2. {isMr ? 'दुरुस्ती व माहिती नष्ट करण्याचा अधिकार (Right to Correction & Erasure - Sec 12):' : 'Right to Correction & Erasure (Section 12):'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13.5 }}>
                {isMr ? 'तुम्ही प्रोफाइल माहिती कधीही बदलू शकता किंवा "खाते हटवा" द्वारे सर्व डेटा कायमचा नष्ट करू शकता.' : 'You have the right to request correction of inaccurate data, completion of incomplete data, or complete erasure of your account and visit records via our automated account settings or via email request.'}
              </p>
            </div>

            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 14 }}>
              <strong style={{ color: '#0f172a' }}>3. {isMr ? 'तक्रार निवारण अधिकार (Right of Grievance Redressal - Sec 13):' : 'Right of Grievance Redressal (Section 13):'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13.5 }}>
                {isMr ? 'डेटा संदर्भात तक्रार असल्यास आमच्या तक्रार निवारण अधिकाऱ्याशी संपर्क साधू शकता. ७ दिवसांच्या आत तक्रार सोडवली जाईल.' : 'You have the right to readily available grievance redressal mechanisms with our designated Grievance Officer, with response provided within 7 business days.'}
              </p>
            </div>

            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 14 }}>
              <strong style={{ color: '#0f172a' }}>4. {isMr ? 'नामनिर्देशन अधिकार (Right to Nominate - Sec 14):' : 'Right to Nominate (Section 14):'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13.5 }}>
                {isMr ? 'मृत्यू किंवा अपंगत्वाच्या प्रसंगी तुमच्या खात्याचे अधिकार इतर व्यक्तीकडे सोपवण्याचा अधिकार.' : 'You have the right to designate an individual who, in the event of death or incapacity, shall exercise your rights under the Act.'}
              </p>
            </div>

            <div style={{ borderLeft: '3.5px solid #047857', paddingLeft: 14 }}>
              <strong style={{ color: '#0f172a' }}>5. {isMr ? 'संमती मागे घेण्याचा अधिकार (Right to Withdraw Consent - Sec 6(4)):' : 'Right to Withdraw Consent (Section 6(4)):'}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13.5 }}>
                {isMr ? 'तुम्ही दिलेली संमती कोणत्याही क्षणी मागे घेऊ शकता. संमती मागे घेतल्यावर तुमच्या खात्याची माहिती सुरक्षितपणे हटवली जाईल.' : 'You may withdraw your consent at any time with the same ease with which consent was provided. Upon withdrawal, processing ceases and your personal data will be purged.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Children's Data Protection */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>👶</span> {isMr ? '५. बालकांच्या डेटाचे संरक्षण (Protection of Children - Section 9)' : "5. Processing of Children's Personal Data (Section 9)"}
          </h2>
          <p>
            {isMr
              ? '१८ वर्षांखालील बालकांच्या वैयक्तिक डेटावर प्रक्रिया करताना आम्ही DPDP कायद्याच्या कलम ९ चे काटेकोरपणे पालन करतो. बालकांना लक्ष्य करून जाहिरातबाजी किंवा मानसिक वर्तनाचे ट्रॅकिंग करणे आमच्या प्लॅटफॉर्मवर पूर्णपणे निषिद्ध आहे.'
              : 'In accordance with Section 9 of the DPDP Act 2023, Explore Pune does not undertake tracking, behavioral monitoring, or targeted advertising directed at children under the age of 18 years. Use by minors is intended strictly under parent or lawful guardian supervision for educational and historical tourism.'}
          </p>
        </section>

        {/* Section 6: Grievance Redressal Officer */}
        <section style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 19, color: '#0f172a', fontWeight: 800, marginTop: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📬</span> {isMr ? '६. तक्रार निवारण अधिकारी संपर्क (Grievance Redressal Officer)' : '6. Grievance Redressal Officer (DPDPA Statutory Notice)'}
          </h2>
          <p style={{ fontSize: 14, margin: '0 0 14px' }}>
            {isMr
              ? 'डेटा गोपनीयता, अधिकार वापरणे किंवा तक्रारींसाठी आपण आमच्या अधिकृत डेटा संरक्षण व तक्रार निवारण अधिकाऱ्याशी थेट संपर्क साधू शकता:'
              : 'If you have any questions, wish to exercise any of your statutory rights, or wish to file a data grievance under the DPDP Act 2023, please reach out to our designated Data Protection & Grievance Redressal Officer:'}
          </p>
          <div style={{ lineHeight: 1.8, fontSize: 13.5 }}>
            <strong>{isMr ? 'अधिकारी:' : 'Designated Officer:'}</strong> Suraj Dhok & Sahil Jadhav<br />
            <strong>{isMr ? 'संस्था:' : 'Platform:'}</strong> Explore Pune Initiative<br />
            <strong>{isMr ? 'अधिकृत ईमेल:' : 'Designated Grievance Emails:'}</strong>{' '}
            <a href="mailto:surajdhok1010@gmail.com" style={{ color: '#047857', fontWeight: 800, textDecoration: 'underline' }}>
              surajdhok1010@gmail.com
            </a>{' '}&{' '}
            <a href="mailto:sj176644@gmail.com" style={{ color: '#047857', fontWeight: 800, textDecoration: 'underline' }}>
              sj176644@gmail.com
            </a><br />
            <strong>{isMr ? 'कार्यक्षेत्र:' : 'Jurisdiction:'}</strong> Pune District, Maharashtra, India<br />
            <strong>{isMr ? 'निवारण कालावधी:' : 'Statutory Resolution Window:'}</strong> {isMr ? '७ कामकाजाच्या दिवसांत उत्तर दिले जाईल.' : 'Guaranteed acknowledgement within 24 hours, resolution within 7 business days.'}
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 12.5, color: '#64748b' }}>
            {isMr
              ? 'जर आमच्या उत्तराने आपले समाधान झाले नाही, तर DPDP कायदा २०२३ अंतर्गत स्थापन झालेल्या भारतीय डेटा संरक्षण मंडळाकडे (Data Protection Board of India - DPBI) तक्रार करण्याचा अधिकार आपणास आहे.'
              : 'If you are not satisfied with the resolution provided by our Grievance Officer, you have the statutory right to escalate your complaint to the Data Protection Board of India (DPBI) established under the DPDP Act 2023.'}
          </p>
        </section>
      </article>

      {/* Footer Navigation */}
      <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', justifyContent: 'center', gap: 20 }}>
        <Link href="/terms" style={{ color: '#047857', fontWeight: 700, fontSize: 14, textDecoration: 'underline' }}>
          {isMr ? 'सेवा अटी (Terms of Service) पहा →' : 'View Terms of Service →'}
        </Link>
        <Link href="/login" style={{ color: '#64748b', fontSize: 14 }}>
          {isMr ? 'खाते साइन इन' : 'Account Sign In'}
        </Link>
      </div>
    </main>
  );
}

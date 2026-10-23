'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function TermsOfServicePage() {
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
            मराठी (सेवा अटी)
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <header
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 32px',
          marginBottom: 36,
          boxShadow: '0 12px 32px rgba(30, 58, 138, 0.2)',
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
          📜 {isMr ? 'व्यासपीठ वापर व सेवा नियम' : 'Terms of Service & Platform Governance'}
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', margin: '0 0 10px', color: '#ffffff', fontWeight: 800 }}>
          {isMr ? 'सेवा अटी व वापर नियम (Terms of Service)' : 'Terms of Service & Community Guidelines'}
        </h1>
        <p style={{ margin: 0, fontSize: 14.5, opacity: 0.94, lineHeight: 1.6, maxWidth: 700 }}>
          {isMr
            ? 'एक्सप्लोर पुणे (Explore Pune) व्यासपीठाचा वापर करताना लागू होणाऱ्या कायदेशीर अटी, वापरकर्त्याच्या जबाबदाऱ्या आणि ऐतिहासिक स्थळांच्या जतनाविषयीचे नियम.'
            : 'Legally binding terms governing access to Explore Pune, interactive trip planning, public transit timetables, milestone check-ins, and user content submissions in compliance with Indian Laws.'}
        </p>
        <div style={{ marginTop: 16, fontSize: 12.5, opacity: 0.82 }}>
          {isMr ? 'अंतिम सुधारणा तारीख: २२ ऑक्टोबर २०२६ • आवृत्ती २.०' : 'Effective & Last Updated: 22 October 2026 • Governed under IT Act 2000 & DPDP Act 2023'}
        </div>
      </header>

      {/* Main Content */}
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
        {/* Section 1: Agreement to Terms */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🤝</span> {isMr ? '१. अटींची स्वीकृती (Acceptance of Terms)' : '1. Agreement & Acceptance of Terms'}
          </h2>
          <p>
            {isMr ? (
              <>
                <strong>एक्सप्लोर पुणे (Explore Pune)</strong> संकेतस्थळ वापरून, नोंदणी करून किंवा ट्रिप प्लॅनर व सेवांचा लाभ घेऊन आपण या सेवा अटी आणि आमच्या{' '}
                <Link href="/privacy" style={{ color: '#047857', fontWeight: 700, textDecoration: 'underline' }}>
                  गोपनीयता धोरणास (Privacy Policy)
                </Link>{' '}
                मान्यता देत आहात. जर आपण या अटींशी सहमत नसाल, तर आपण या सेवेचा वापर करू नये.
              </>
            ) : (
              <>
                By accessing, browsing, creating an account, or utilizing the interactive trip planner and transit guides on <strong>Explore Pune</strong>, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and our{' '}
                <Link href="/privacy" style={{ color: '#047857', fontWeight: 700, textDecoration: 'underline' }}>
                  Privacy Policy (DPDP Act 2023 Compliant)
                </Link>
                . These terms constitute a legally binding electronic agreement under the Information Technology Act, 2000.
              </>
            )}
          </p>
        </section>

        {/* Section 2: Account Security & Checkbox Requirement */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🔐</span> {isMr ? '२. वापरकर्ता खाते व सुरक्षा (User Account & Security)' : '2. Account Registration & User Responsibility'}
          </h2>
          <p>
            {isMr
              ? 'खाते उघडताना आपण दिलेली माहिती अचूक आणि अद्ययावत असणे आवश्यक आहे. साइन-इन पृष्ठावर गोपनीयता धोरण व अटी मान्यतेचा चेकबॉक्स टिक करणे अनिवार्य आहे. आपल्या खात्याच्या पासवर्डची गोपनीयता राखण्याची जबाबदारी आपली राहील.'
              : 'When registering an account on Explore Pune, you warrant that all information provided is accurate and authentic. In compliance with affirmative consent requirements under the DPDP Act 2023, you must explicitly accept these Terms and Privacy Policy before account creation or sign-in. You are responsible for safeguarding your credentials and for all activities conducted under your account.'}
          </p>
        </section>

        {/* Section 3: Heritage Conservation & Site Etiquette */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🏰</span> {isMr ? '३. ऐतिहासिक वारसा जतन व आचारसंहिता (Heritage Site Preservation)' : '3. Heritage Site Etiquette & Conservation Code'}
          </h2>
          <p>
            {isMr
              ? 'पुणे व सह्याद्री परिसरातील ऐतिहासिक गड-किल्ले, पेशवेकालीन वाडे आणि पवित्र मंदिरे ही महाराष्ट्राचा अमूल्य वारसा आहेत. वापरकर्त्यांनी खालील नियमांचे काटेकोर पालन करणे बंधनकारक आहे:'
              : 'Pune and the Western Ghats house sacred sanctuaries, historic Peshwa wadas, and iconic Maratha hill fortresses. When visiting these cultural treasures, all explorers must strictly adhere to the following conservation code:'}
          </p>
          <ul style={{ paddingLeft: 22, marginTop: 8 }}>
            <li>
              <strong>{isMr ? 'स्वच्छता व प्लास्टिक बंदी:' : 'Zero Litter & Plastic Ban:'}</strong>{' '}
              {isMr ? 'गडांवर, मंदिरांमध्ये किंवा तलावांच्या परिसरात प्लास्टिक कचरा, बाटल्या फेकण्यास सक्त मनाई आहे. आपला कचरा परत शहरात आणा.' : 'Do not litter plastic wraps, bottles, or food waste on forts, hill trails, or lake reserves. Pack out what you pack in.'}
            </li>
            <li>
              <strong>{isMr ? 'भिंतींवर विद्रुपीकरण मनाई:' : 'Strict Anti-Defacement Policy:'}</strong>{' '}
              {isMr ? 'ऐतिहासिक वास्तू, तटबंदी किंवा गुहांवर नावे कोरणे, रंग लावणे किंवा विद्रुपीकरण करणे कायद्याने दंडनीय गुन्हा आहे (AMASR Act १९५८).' : 'Carving names, graffiti, or damaging ancient masonry on forts, wadas, or rock-cut caves is strictly prohibited and punishable under the Ancient Monuments and Archaeological Sites and Remains Act, 1958.'}
            </li>
            <li>
              <strong>{isMr ? 'धार्मिक व सांस्कृतिक आदर:' : 'Sanctuary Etiquette:'}</strong>{' '}
              {isMr ? 'दगडूशेठ गणपती, कसबा गणपती, आळंदी, देहू अशा पवित्र तीर्थक्षेत्रांमध्ये योग्य पेहराव ठेवा आणि मंदिराच्या नियमांचे पालन करा.' : 'Maintain respectful decorum, silence, and dress code at sacred shrines including Shreemant Dagdusheth Halwai Ganpati, Kasba Ganpati, Alandi, and Dehu.'}
            </li>
          </ul>
        </section>

        {/* Section 4: Public Transit Schedules & Disclaimer */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🚌</span> {isMr ? '४. सार्वजनिक वाहतूक व वेळापत्रक माहिती (Transit Data & Fare Disclaimer)' : '4. Pune Metro & PMPML Transit Information Disclaimer'}
          </h2>
          <p>
            {isMr
              ? 'एक्सप्लोर पुणेवर दिलेली पुणे मेट्रो (पर्पल व अक्वा लाईन) आणि पीएमपीएमएल बस मार्गांची माहिती (उदा. बस क्र. १४९, २४, ५०, १५९) ही प्रवाशांच्या सोयीसाठी संकलित केलेली अधिकृत माहिती आहे. तथापि, वाहतूक कोंडी, महामेट्रो किंवा पीएमपीएमएल प्रशासनाच्या तातडीच्या बदलांमुळे वेळापत्रकात किंवा दरांमध्ये तफावत असू शकते. प्रवाशांनी प्रवासापूर्वी स्थानकावरील घोषणा तपासाव्यात.'
              : 'Explore Pune compiles verified public transit data—including Pune Metro Purple & Aqua Line feeder stations, interchange corridors, and primary PMPML bus routes (e.g. Bus 149, Bus 24, Bus 50, Bus 159). While we continuously calibrate these transit corridors for high fidelity, actual bus timings, metro headway, and ticketing fares are subject to real-time traffic conditions and administrative updates by Maha Metro and PMPML. Explore Pune is not liable for transport delays or missed connections.'}
          </p>
        </section>

        {/* Section 5: Adventure Trails & Trekker Safety Warning */}
        <section style={{ marginBottom: 32, background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 18, color: '#92400e', fontWeight: 800, marginTop: 0, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠️</span> {isMr ? '५. ट्रेकिंग, सह्याद्री दुर्ग व पावसाळी सुरक्षितता इशारा (Trekker Safety Warning)' : '5. Outdoor Trekking & Monsoon Safety Disclaimer'}
          </h2>
          <p style={{ margin: 0, fontSize: 13.5, color: '#78350f', lineHeight: 1.6 }}>
            {isMr
              ? 'सिंहगड, राजगड, तोरणा, लोहगड यांसारख्या सह्याद्रीच्या गडांवर किंवा ताम्हिणी घाटात भ्रमंती करताना पावसाळ्यात निसरड्या पायऱ्या, दरडी कोसळणे आणि दाट धुके यामुळे धोका निर्माण होऊ शकतो. पर्यटकांनी योग्य ट्रेकिंग शूज वापरावेत, पुरेसे पिण्याचे पाणी सोबत ठेवावे, स्थानिक मार्गदर्शकांचा सल्ला घ्यावा आणि हवामान खात्याच्या रेड/ऑरेंज अलर्टच्या दिवशी धोकादायक कड्यांवर जाणे टाळावे. पर्यटनादरम्यान घडणाऱ्या कोणत्याही व्यक्तिगत दुखापतीस अथवा दुर्घटनेस एक्सप्लोर पुणे जबाबदार राहणार नाही.'
              : 'Trekking Sahyadri fortresses (e.g., Sinhagad, Rajgad, Torna, Lohagad) and navigating waterfalls during monsoons carry inherent natural risks, including slippery rock faces, flash surges, and heavy fog. Explorers must carry adequate hydration, wear specialized trekking footwear, check official IMD weather advisories, and avoid restricted precipices during monsoon red alerts. Explore Pune provides travel guides purely for informational and cultural purposes and assumes no liability for personal injury, lost gear, or accidents on trails.'}
          </p>
        </section>

        {/* Section 6: User Content & Milestones Photo Proofs */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📸</span> {isMr ? '६. वापरकर्त्याने अपलोड केलेली छायाचित्रे व लेख (User Content & Photo Proofs)' : '6. User Submissions & Photo Proof Integrity'}
          </h2>
          <p>
            {isMr
              ? 'यशोगाथा पदके मिळवण्यासाठी किंवा कम्युनिटी गॅलरीमध्ये फोटो अपलोड करताना वापरकर्त्यांनी स्वतः काढलेले खरे फोटोच जोडणे आवश्यक आहे. अश्लील, आक्षेपार्ह, कॉपीराइटचे उल्लंघन करणारी किंवा इतरांच्या गोपनीयतेला बाधा आणणारी छायाचित्रे अपलोड करण्यास सक्त मनाई आहे. अशा प्रकारची सामग्री आढळल्यास संबंधित खाते कोणतीही पूर्वसूचना न देता तात्काळ निलंबित केले जाईल.'
              : 'When submitting check-in photos for milestone badges, community galleries, or travel blogs, you warrant that you are the sole creator and copyright owner of the uploaded media. Uploading obscene, defamatory, infringing, or harmful content is strictly prohibited under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. Any such content will be removed immediately and offending accounts will be terminated.'}
          </p>
        </section>

        {/* Section 7: Governing Law & Dispute Resolution */}
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, color: '#0f172a', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚖️</span> {isMr ? '७. कायदेशीर कार्यक्षेत्र (Governing Law & Jurisdiction)' : '7. Governing Law & Jurisdiction'}
          </h2>
          <p>
            {isMr
              ? 'या अटी व नियमांचे अन्वयार्थ भारतीय कायद्यांनुसार केले जाईल. या व्यासपीठाच्या वापराशी संबंधित कोणत्याही विवादावर केवळ पुणे, महाराष्ट्र येथील सक्षम न्यायालयांचेच अधिकारक्षेत्र राहील.'
              : 'These Terms shall be governed by, interpreted, and enforced in accordance with the laws of the Republic of India. Any disputes arising out of or relating to these terms or platform usage shall be subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra, India.'}
          </p>
        </section>

        {/* Section 8: Support & Contact */}
        <section style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 16.5, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
            📬 {isMr ? 'संपर्क व अधिकृत माहिती' : 'Platform Operations & Support'}
          </h3>
          <p style={{ margin: '0 0 10px', fontSize: 13.5 }}>
            {isMr
              ? 'सेवा अटींविषयी काही प्रश्न अथवा सूचना असल्यास आमच्याशी संपर्क साधा:'
              : 'For inquiries, clarifications, or reporting issues regarding these Terms of Service, please reach out to:'}
          </p>
          <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>
            <strong>Explore Pune Platform Team</strong><br />
            Founders: Suraj Dhok & Sahil Jadhav | QA & Documentation: Ishan Kakade<br />
            Email: <a href="mailto:surajdhok1010@gmail.com" style={{ color: '#047857', fontWeight: 700 }}>surajdhok1010@gmail.com</a> • <a href="mailto:sj176644@gmail.com" style={{ color: '#047857', fontWeight: 700 }}>sj176644@gmail.com</a> • <a href="mailto:1ishankakade@gmail.com" style={{ color: '#047857', fontWeight: 700 }}>1ishankakade@gmail.com</a><br />
            Pune, Maharashtra, India
          </div>
        </section>
      </article>

      {/* Footer Navigation */}
      <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', justifyContent: 'center', gap: 20 }}>
        <Link href="/privacy" style={{ color: '#047857', fontWeight: 700, fontSize: 14, textDecoration: 'underline' }}>
          {isMr ? '← गोपनीयता धोरण (Privacy Policy) पहा' : '← View Privacy Policy (DPDP Act) '}
        </Link>
        <Link href="/login" style={{ color: '#64748b', fontSize: 14 }}>
          {isMr ? 'खाते साइन इन' : 'Account Sign In'}
        </Link>
      </div>
    </main>
  );
}

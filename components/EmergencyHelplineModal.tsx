'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import ModalPortal from '@/components/ModalPortal';

interface HelplineItem {
  id: string;
  icon: string;
  titleEn: string;
  titleMr: string;
  number: string;
  telUri: string;
  descEn: string;
  descMr: string;
  tagEn: string;
  tagMr: string;
}

const HELPLINES: HelplineItem[] = [
  {
    id: 'police',
    icon: '🚨',
    titleEn: 'Pune Police Emergency & Tourist Help',
    titleMr: 'पुणे पोलीस नियंत्रण कक्ष व पर्यटक मदत',
    number: '112',
    telUri: 'tel:112',
    descEn: '24x7 Centralized police emergency response for Pune city & rural districts.',
    descMr: 'पुणे शहर व ग्रामीण भागासाठी २४ तास तत्पर पोलीस आणीबाणी सेवा.',
    tagEn: '24x7 Immediate',
    tagMr: '२४ तास त्वरित',
  },
  {
    id: 'tourist-cell',
    icon: '🛡️',
    titleEn: 'Pune Tourist Assistance Cell',
    titleMr: 'पुणे पर्यटक साहाय्यता कक्ष',
    number: '020-26122880',
    telUri: 'tel:02026122880',
    descEn: 'Dedicated tourist support, guidance, and assistance at historical landmarks.',
    descMr: 'पर्यटक मार्गदर्शन, तक्रार निवारण आणि ऐतिहासिक स्थळांवरील साहाय्य.',
    tagEn: 'Tourist Wing',
    tagMr: 'पर्यटन कक्ष',
  },
  {
    id: 'metro',
    icon: '🚇',
    titleEn: 'Pune Metro 24x7 Helpline',
    titleMr: 'पुणे मेट्रो हेल्पलाइन',
    number: '1800 270 5551',
    telUri: 'tel:18002705551',
    descEn: 'Toll-free customer care for train timings, station accessibility & ticket help.',
    descMr: 'मेट्रो फेऱ्यांची वेळ, तिकीट चौकशी व स्थानक साहाय्यासाठी टोल-फ्री क्रमांक.',
    tagEn: 'Toll Free',
    tagMr: 'टोल फ्री',
  },
  {
    id: 'pmpml',
    icon: '🚌',
    titleEn: 'PMPML Bus Commuter Care',
    titleMr: 'पीएमपीएमएल बस प्रवासी कक्ष',
    number: '020-24504000',
    telUri: 'tel:02024504000',
    descEn: 'Bus timetable, depot inquiries, lost property, and day-pass information.',
    descMr: 'बस मार्ग, डेपो चौकशी, हरवलेल्या वस्तू व दैनिक पास माहिती.',
    tagEn: 'City Transit',
    tagMr: 'शहर बस',
  },
  {
    id: 'women',
    icon: '🌸',
    titleEn: 'Women Safety Helpline (Damini Squad)',
    titleMr: 'महिला सुरक्षा हेल्पलाइन (दामिनी पथक)',
    number: '1091',
    telUri: 'tel:1091',
    descEn: 'Immediate patrol response for female solo travelers and women in distress.',
    descMr: 'महिला पर्यटकांच्या सुरक्षेसाठी विशेष तत्पर मदत पथक.',
    tagEn: 'Women Safety',
    tagMr: 'महिला सुरक्षा',
  },
  {
    id: 'ambulance',
    icon: '🚑',
    titleEn: 'Medical Ambulance (EMRI)',
    titleMr: 'रुग्णवाहिका व वैद्यकीय आणीबाणी',
    number: '108',
    telUri: 'tel:108',
    descEn: 'Free government medical emergency ambulance and first-aid response.',
    descMr: 'तातडीच्या वैद्यकीय उपचारांसाठी विनामूल्य रुग्णवाहिका सेवा.',
    tagEn: 'Medical',
    tagMr: 'वैद्यकीय',
  },
  {
    id: 'rescue',
    icon: '⛰️',
    titleEn: 'Sahyadri Trekker Search & Rescue',
    titleMr: 'सह्याद्री ट्रेकर शोध व बचाव कक्ष',
    number: '1077',
    telUri: 'tel:1077',
    descEn: 'District Disaster Management for fort hikers, lost trails, or heavy rain rescues.',
    descMr: 'किल्ल्यांवर रस्ता चुकल्यास किंवा आपत्कालीन स्थितीत जिल्हा आपत्ती व्यवस्थापन.',
    tagEn: 'Fort Rescue',
    tagMr: 'दुर्ग बचाव',
  },
];

export default function EmergencyHelplineModal() {
  const { isMr } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCopy = (id: string, num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Trigger Button in Header or Footer */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="chip helpline-chip-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#fff1f2',
          borderColor: '#fecdd3',
          color: '#be123c',
          fontWeight: 700,
          cursor: 'pointer',
          padding: '6px 14px',
          fontSize: '12.5px',
          transition: 'all 0.15s ease',
        }}
        title={isMr ? 'पुणे आपत्कालीन व प्रवासी हेल्पलाइन' : 'Pune Tourist & Emergency Helplines'}
      >
        <span>🚨</span>
        <span className="hide-on-compact-desktop">{isMr ? 'मदत व हेल्पलाइन' : 'Helplines'}</span>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <ModalPortal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease forwards',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--line)',
              padding: '28px',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 20,
                borderBottom: '1px solid var(--line)',
                paddingBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  <span>🚨</span> {isMr ? '२४/७ अधिकृत हेल्पलाइन' : 'Official 24x7 Pune Assistance'}
                </div>
                <h2 style={{ fontSize: '22px', margin: '4px 0 2px', color: 'var(--ink)' }}>
                  {isMr ? 'पुणे पर्यटक व आपत्कालीन मदत कक्ष' : 'Pune Tourist & Emergency Helplines'}
                </h2>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)' }}>
                  {isMr
                    ? 'पुणे शहर, मेट्रो, पीएमपीएमएल आणि सह्याद्री भ्रमंती दरम्यान मदतीसाठी आवश्यक संपर्क क्रमांक.'
                    : 'Instant one-tap contacts for police, transit support, medical aid, and Sahyadri trekker rescue.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="chip"
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: 'var(--ink)',
                  fontSize: '16px',
                  fontWeight: 700,
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Helpline Grid */}
            <div style={{ display: 'grid', gap: '12px' }}>
              {HELPLINES.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: '#f8fafc',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1, minWidth: '220px' }}>
                    <span style={{ fontSize: '26px' }}>{item.icon}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>
                          {isMr ? item.titleMr : item.titleEn}
                        </strong>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '999px',
                            background: '#e2e8f0',
                            color: 'var(--ink-secondary)',
                          }}
                        >
                          {isMr ? item.tagMr : item.tagEn}
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.4 }}>
                        {isMr ? item.descMr : item.descEn}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <a
                      href={item.telUri}
                      className="btn"
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        background: '#065f46',
                        color: '#ffffff',
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none',
                      }}
                    >
                      📞 {item.number}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.number)}
                      className="btn outline"
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                      title="Copy number"
                    >
                      {copiedId === item.id ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer notice */}
            <div
              style={{
                marginTop: 20,
                padding: '12px 16px',
                background: '#f0fdf4',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #bbf7d0',
                fontSize: '12px',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>ℹ️</span>
              <span>
                {isMr
                  ? 'टीप: आपत्कालीन प्रसंगी १०८ रुग्णवाहिका आणि ११२ पोलीस सेवा टोल-फ्री उपलब्ध असून कोणत्याही मोबाईलवरून थेट चालू होतात.'
                  : 'Note: 112 (Police) and 108 (Ambulance) are toll-free and accessible from any mobile operator across Maharashtra.'}
              </span>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </>
  );
}

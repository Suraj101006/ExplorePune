'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, AlertCircle, X, Compass, HeartHandshake } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { acceptCommunityGuidelines } from '@/lib/userSafety';
import ModalPortal from '@/components/ModalPortal';

interface CommunityGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccepted: () => void;
  userId?: string;
}

export default function CommunityGuidelinesModal({
  isOpen,
  onClose,
  onAccepted,
  userId,
}: CommunityGuidelinesModalProps) {
  const { isMr } = useLanguage();
  const [agreed, setAgreed] = useState(false);
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!agreed) {
      setShowError(true);
      return;
    }
    acceptCommunityGuidelines(userId);
    onAccepted();
  };

  const guidelinesEn = [
    'Respect other community members.',
    'Discuss places and experiences, not people.',
    'Do not post abusive, hateful, threatening, or discriminatory content.',
    'Do not deliberately spread false information.',
    'Do not post someone’s private information or phone number.',
    'Do not spam or repeatedly advertise.',
    'Do not upload inappropriate or illegal content.',
    'Respect Pune’s cultural, historical, religious, and public places.',
    'Report problems instead of engaging in arguments.',
    'Repeated violations may result in posting restrictions or account suspension.',
  ];

  const guidelinesMr = [
    'इतर समुदाय सदस्यांचा आदर करा.',
    'व्यक्तींवर नव्हे, तर ठिकाणे आणि अनुभवांवर चर्चा करा.',
    'अपमानास्पद, द्वेषपूर्ण किंवा भेदभावात्मक मजकूर टाळा.',
    'जाणूनबुजून खोटी किंवा दिशाभूल करणारी माहिती पसरवू नका.',
    'कोणाचाही वैयक्तिक फोन नंबर किंवा खाजगी माहिती पोस्ट करू नका.',
    'स्पॅम किंवा वारंवार व्यावसायिक जाहिराती करू नका.',
    'अयोग्य किंवा बेकायदेशीर छायाचित्रे जोडू नका.',
    'पुण्याच्या सांस्कृतिक, ऐतिहासिक आणि धार्मिक स्थळांचा आदर राखा.',
    'वाद घालण्याऐवजी संशयास्पद मजकुराची तक्रार (Report) करा.',
    'वारंवार नियमांचे उल्लंघन केल्यास पोस्टिंगवर निर्बंध घातले जातील.',
  ];

  const activeGuidelines = isMr ? guidelinesMr : guidelinesEn;

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 20,
          border: '1px solid var(--line)',
          maxWidth: 580,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'fadeInScale 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 16px',
            borderBottom: '1px solid var(--line)',
            background: 'linear-gradient(135deg, rgba(194, 65, 12, 0.08) 0%, rgba(249, 115, 22, 0.02) 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(194, 65, 12, 0.12)',
                color: 'var(--brand-terracotta, #c2410c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HeartHandshake size={24} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--brand-terracotta, #c2410c)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {isMr ? 'सुरक्षित व आदरयुक्त समुदाय' : 'Community Safety & Dignity'}
              </div>
              <h2
                style={{
                  margin: '2px 0 0',
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'var(--ink)',
                }}
              >
                {isMr ? 'पुणे समुदाय मार्गदर्शक तत्त्वे' : 'Explore Pune Community Guidelines'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content & 10 Guidelines */}
        <div
          style={{
            padding: '20px 28px',
            overflowY: 'auto',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          <p
            style={{
              margin: '0 0 16px',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--brand-terracotta, #c2410c)',
            }}
          >
            {isMr
              ? 'आदरयुक्त व्हा. उपयुक्त माहिती द्या. जबाबदारीने वागा.'
              : 'Be respectful. Be useful. Be responsible.'}
          </p>

          <p style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: 13.5 }}>
            {isMr
              ? 'पुणे प्रवासी समुदाय हा पर्यटकांना अस्सल अनुभव आणि स्थानिक प्रवास सल्ले देण्यासाठी आहे. कृपया खालील नियमांचे पालन करा:'
              : 'The Explore Pune Community exists to help travelers discover historic Pune through helpful, respectful, and experience-based discussions:'}
          </p>

          <ol
            style={{
              margin: 0,
              paddingLeft: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              color: 'var(--ink)',
            }}
          >
            {activeGuidelines.map((rule, idx) => (
              <li key={idx} style={{ fontSize: 13.5, color: 'var(--ink-secondary)' }}>
                {rule}
              </li>
            ))}
          </ol>
        </div>

        {/* Checkbox & Actions */}
        <div
          style={{
            padding: '16px 28px 20px',
            borderTop: '1px solid var(--line)',
            background: 'var(--bg)',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              marginBottom: 16,
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setShowError(false);
              }}
              style={{
                width: 18,
                height: 18,
                accentColor: 'var(--brand-terracotta, #c2410c)',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>
              {isMr
                ? 'मी समुदाय मार्गदर्शक तत्त्वांचे पालन करण्यास सहमत आहे'
                : 'I agree to follow the Explore Pune Community Guidelines'}
            </span>
          </label>

          {showError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#dc2626',
                fontSize: 12.5,
                marginBottom: 12,
              }}
            >
              <AlertCircle size={15} />
              <span>
                {isMr
                  ? 'कृपया पुढे जाण्यापूर्वी नियमांशी सहमत व्हा.'
                  : 'Please agree to the guidelines to participate in the community.'}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn outline"
              style={{ padding: '8px 16px', fontSize: 13.5 }}
            >
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="btn btn-primary"
              style={{
                padding: '8px 20px',
                fontSize: 13.5,
                fontWeight: 600,
                opacity: agreed ? 1 : 0.65,
              }}
            >
              {isMr ? 'स्वीकारा आणि सुरू करा' : 'Agree & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}

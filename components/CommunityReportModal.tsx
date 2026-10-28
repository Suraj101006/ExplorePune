'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, UserX, FileText } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import { submitCommunityReport } from '@/lib/communityStorage';
import ModalPortal from '@/components/ModalPortal';

export interface CommunityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'post' | 'comment' | 'user' | 'account';
  targetTitle?: string;
  authorId?: string;
  authorName?: string;
  initialReportType?: 'post' | 'user';
}

export default function CommunityReportModal({
  isOpen,
  onClose,
  targetId,
  targetType = 'post',
  targetTitle,
  authorId,
  authorName,
  initialReportType,
}: CommunityReportModalProps) {
  const { isMr } = useLanguage();
  const { user } = useAuth();

  const [activeMode, setActiveMode] = useState<'post' | 'user'>(
    initialReportType || (targetType === 'user' || targetType === 'account' ? 'user' : 'post')
  );

  const [reason, setReason] = useState<
    'spam' | 'harassment' | 'hate' | 'false_info' | 'inappropriate' | 'privacy' | 'scam' | 'other'
  >('spam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setDetails('');
      setReason('spam');
      setActiveMode(initialReportType || (targetType === 'user' || targetType === 'account' ? 'user' : 'post'));
    }
  }, [isOpen, initialReportType, targetType]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmitted(false);
    setDetails('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTargetType = activeMode === 'user' ? 'user' : (targetType === 'comment' ? 'comment' : 'post');
    const finalTargetId = activeMode === 'user' ? (authorId || targetId) : targetId;
    const finalTargetTitle = activeMode === 'user'
      ? (authorName ? `@${authorName}` : targetTitle || 'User Account')
      : (targetTitle || 'Discussion Post');

    submitCommunityReport({
      targetType: finalTargetType,
      targetId: finalTargetId,
      targetTitle: finalTargetTitle,
      authorName: authorName || undefined,
      reporterUserId: user?.uid || 'guest-reporter',
      reason,
      details: details.trim() || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 1800);
  };

  const hasAuthorOption = Boolean(authorName || authorId);

  return (
    <ModalPortal isOpen={isOpen} onClose={handleClose}>
      <div
        role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000000,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
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
      >
        {/* Header Bar */}
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
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isMr ? 'पुणे समुदाय सुरक्षा' : 'Pune Community Safety'}
              </div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  margin: 0,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {activeMode === 'user'
                  ? (isMr ? 'वापरकर्ता खात्याची तक्रार करा' : 'Report User Account')
                  : (isMr ? 'मजकुराची तक्रार करा' : 'Report Discussion Content')}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
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

        {submitted ? (
          <div style={{ padding: '36px 24px', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#059669" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px', color: '#065f46' }}>
              {isMr ? 'तक्रार यशस्वीरित्या नोंदवली गेली आहे' : 'Report Successfully Submitted'}
            </h3>
            <p style={{ fontSize: 14, color: '#475569', margin: 0, lineHeight: 1.5 }}>
              {activeMode === 'user'
                ? (isMr
                    ? `धन्यवाद. '${authorName || 'वापरकर्ता'}' या खात्याची आमच्या सुरक्षा टीमकडून २४ तासांत तपासणी केली जाईल.`
                    : `Thank you. The account of "${authorName || 'this user'}" has been flagged for administrative review.`)
                : (isMr
                    ? 'धन्यवाद. ही पोस्ट पुनरावलोकनासाठी पाठवण्यात आली आहे. आवश्यक असल्यास कारवाई केली जाईल.'
                    : 'Thank you. This post has been sent to our moderators for verification.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Mode Switcher: Report Post vs Report Account (if author info present) */}
            {hasAuthorOption && (
              <div
                style={{
                  display: 'flex',
                  background: '#f1f5f9',
                  padding: 4,
                  borderRadius: 10,
                  gap: 4,
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveMode('post')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeMode === 'post' ? '#ffffff' : 'transparent',
                    color: activeMode === 'post' ? '#0f172a' : '#64748b',
                    fontWeight: activeMode === 'post' ? 700 : 500,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxShadow: activeMode === 'post' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <FileText size={14} />
                  <span>{isMr ? 'मजकूर / चर्चा' : 'This Post'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('user')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeMode === 'user' ? '#ffffff' : 'transparent',
                    color: activeMode === 'user' ? '#dc2626' : '#64748b',
                    fontWeight: activeMode === 'user' ? 700 : 500,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxShadow: activeMode === 'user' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <UserX size={14} />
                  <span>{isMr ? `खाते: ${authorName || ''}` : `Account: ${authorName || 'Author'}`}</span>
                </button>
              </div>
            )}

            {/* Target Label */}
            <div
              style={{
                fontSize: 13,
                color: '#475569',
                background: '#f8fafc',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
            >
              {activeMode === 'user' ? (
                <>
                  👤 {isMr ? 'तक्रार केले जाणारे खाते:' : 'Reporting Account:'}{' '}
                  <strong style={{ color: '#0f172a' }}>{authorName ? `@${authorName}` : 'User Profile'}</strong>
                </>
              ) : (
                <>
                  📝 {isMr ? 'तक्रार करत असलेली पोस्ट:' : 'Reporting Post:'}{' '}
                  <strong style={{ color: '#0f172a' }}>{targetTitle || 'Discussion Post'}</strong>
                </>
              )}
            </div>

            {/* Reason Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                {isMr ? 'तक्रारीचे कारण निवडा:' : 'Select Reason for Violation:'}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 13.5,
                  outline: 'none',
                  background: '#ffffff',
                }}
              >
                {activeMode === 'user' ? (
                  <>
                    <option value="harassment">{isMr ? 'छळ, शिवीगाळ किंवा धमकी (Harassment & Abuse)' : 'Harassment, Abuse, or Threats'}</option>
                    <option value="spam">{isMr ? 'स्पॅम किंवा बनावट बॉट खाते (Commercial Spam / Bot)' : 'Commercial Spam or Automated Bot'}</option>
                    <option value="scam">{isMr ? 'बनावट किंवा फसवे प्रोफाईल (Fake / Impersonation Account)' : 'Fake Profile or Impersonation'}</option>
                    <option value="hate">{isMr ? 'द्वेषपूर्ण किंवा आक्रमक वर्तन (Hate Speech & Hostility)' : 'Hate Speech & Discriminatory Behavior'}</option>
                    <option value="inappropriate">{isMr ? 'अयोग्य प्रोफाईल नाव किंवा फोटो (Inappropriate Avatar/Name)' : 'Inappropriate Avatar or Profile Name'}</option>
                    <option value="privacy">{isMr ? 'इतरांची खाजगी माहिती उघड करणे (Doxxing / Privacy)' : 'Sharing Private Numbers / Doxxing'}</option>
                    <option value="other">{isMr ? 'इतर खाते उल्लंघन (Other Account Policy Violation)' : 'Other Policy Violation'}</option>
                  </>
                ) : (
                  <>
                    <option value="spam">{isMr ? 'स्पॅम किंवा जाहिरात (Spam or Advertising)' : 'Spam or Commercial Promo'}</option>
                    <option value="harassment">{isMr ? 'छळ किंवा वैयक्तिक हल्ला (Harassment / Personal Attack)' : 'Harassment or Personal Attack'}</option>
                    <option value="hate">{isMr ? 'द्वेष, धार्मिक किंवा प्रादेशिक वाद (Hate Speech / Conflict)' : 'Hate, Religious or Regional Conflict'}</option>
                    <option value="false_info">{isMr ? 'चुकीची किंवा दिशाभूल करणारी माहिती (False / Misleading Info)' : 'False Information or Timings'}</option>
                    <option value="inappropriate">{isMr ? 'अयोग्य किंवा आक्षेपार्ह मजकूर (Inappropriate Content)' : 'Inappropriate or Offensive Language'}</option>
                    <option value="privacy">{isMr ? 'खाजगी फोन नंबर किंवा पत्ता उघड करणे (Privacy Breach)' : 'Private Contact Info / Doxxing'}</option>
                    <option value="scam">{isMr ? 'घोटाळा किंवा संशयास्पद लिंक्स (Scam or Phishing)' : 'Scam, Fraud, or Suspicious Links'}</option>
                    <option value="other">{isMr ? 'इतर (Other)' : 'Other'}</option>
                  </>
                )}
              </select>
            </div>

            {/* Additional Details */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                {isMr ? 'अतिरिक्त तपशील (पर्यायी):' : 'Additional Details (Optional):'}
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  activeMode === 'user'
                    ? (isMr ? 'या खात्याबद्दल अधिक माहिती द्या…' : 'Briefly describe the inappropriate behavior of this account…')
                    : (isMr ? 'कृपया कारण थोडक्यात स्पष्ट करा…' : 'Briefly explain why this content violates community guidelines…')
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn outline"
                style={{ padding: '9px 18px', fontSize: 13.5, borderRadius: 8 }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="btn"
                style={{
                  padding: '9px 20px',
                  fontSize: 13.5,
                  fontWeight: 700,
                  borderRadius: 8,
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                }}
              >
                {activeMode === 'user'
                  ? (isMr ? 'खाते तक्रार करा' : 'Report Account')
                  : (isMr ? 'तक्रार सबमिट करा' : 'Submit Report')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </ModalPortal>
  );
}

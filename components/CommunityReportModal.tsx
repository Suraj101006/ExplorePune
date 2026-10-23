'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import { CommunityReport, submitCommunityReport } from '@/lib/communityStorage';

interface CommunityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'post' | 'comment';
  targetTitle?: string;
}

export default function CommunityReportModal({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
}: CommunityReportModalProps) {
  const { isMr } = useLanguage();
  const { user } = useAuth();

  const [reason, setReason] = useState<
    'spam' | 'harassment' | 'hate' | 'false_info' | 'inappropriate' | 'privacy' | 'scam' | 'other'
  >('spam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmitted(false);
    setDetails('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCommunityReport({
      targetType,
      targetId,
      reporterUserId: user?.uid || 'guest-reporter',
      reason,
      details: details.trim() || undefined,
    });
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(4px)',
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
          maxWidth: 460,
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            background: '#991b1b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700 }}>
            <AlertTriangle size={18} />
            <span>{isMr ? 'मजकुराची तक्रार करा' : 'Report Discussion Content'}</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <CheckCircle2 size={44} color="#059669" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#065f46' }}>
              {isMr ? 'तक्रार नोंदवली गेली आहे' : 'Report Submitted'}
            </h3>
            <p style={{ fontSize: 13.5, color: '#475569', margin: 0 }}>
              {isMr
                ? 'धन्यवाद. तुमची तक्रार पुनरावलोकनासाठी पाठवण्यात आली आहे.'
                : 'Thanks. Your report has been submitted for review.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {targetTitle && (
              <div style={{ fontSize: 12.5, color: '#64748b' }}>
                {isMr ? 'तक्रार करत असलेली पोस्ट:' : 'Reporting:'} <strong>{targetTitle}</strong>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                {isMr ? 'तक्रारीचे कारण निवडा:' : 'Select Reason:'}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                }}
              >
                <option value="spam">{isMr ? 'स्पॅम (Spam)' : 'Spam'}</option>
                <option value="harassment">{isMr ? 'छळ किंवा धमकी (Harassment)' : 'Harassment'}</option>
                <option value="hate">{isMr ? 'द्वेष किंवा भेदभाव (Hate/Discrimination)' : 'Hate/Discrimination'}</option>
                <option value="false_info">{isMr ? 'खोटी माहिती (False Information)' : 'False Information'}</option>
                <option value="inappropriate">{isMr ? 'अयोग्य सामग्री (Inappropriate Content)' : 'Inappropriate Content'}</option>
                <option value="privacy">{isMr ? 'गोपनीयता उल्लंघन / फोन नंबर (Privacy Violation)' : 'Privacy Violation'}</option>
                <option value="scam">{isMr ? 'घोटाळा किंवा फसवणूक (Scam/Fraud)' : 'Scam/Fraud'}</option>
                <option value="other">{isMr ? 'इतर (Other)' : 'Other'}</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                {isMr ? 'अतिरिक्त तपशील (पर्यायी):' : 'Additional Details (Optional):'}
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={isMr ? 'कृपया कारण थोडक्यात स्पष्ट करा…' : 'Briefly explain why this content violates community guidelines…'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn outline"
                style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="btn"
                style={{
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 8,
                  background: '#dc2626',
                  color: '#ffffff',
                }}
              >
                {isMr ? 'तक्रार सबमिट करा' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

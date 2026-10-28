'use client';

import React, { useState } from 'react';
import { X, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import { submitCommunityAppeal } from '@/lib/userSafety';
import ModalPortal from '@/components/ModalPortal';

interface CommunityAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle?: string;
  currentUserId?: string;
}

export default function CommunityAppealModal({
  isOpen,
  onClose,
  postId,
  postTitle,
  currentUserId,
}: CommunityAppealModalProps) {
  const { isMr } = useLanguage();
  const { user } = useAuth();

  const [reason, setReason] = useState('mistake');
  const [explanation, setExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmitted(false);
    setExplanation('');
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim() || explanation.trim().length < 10) {
      setErrorMsg(isMr ? 'कृपया किमान १० अक्षरांचे स्पष्टीकरण द्या.' : 'Please provide at least 10 characters explaining your appeal.');
      return;
    }

    submitCommunityAppeal({
      postId,
      postTitle,
      userId: currentUserId || user?.uid || 'guest-user',
      authorName: user?.displayName || user?.email?.split('@')[0] || (isMr ? 'पुणे पर्यटक' : 'Pune Explorer'),
      reason,
      explanation: explanation.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={handleClose}>
      <div
        role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        background: 'rgba(15, 23, 42, 0.7)',
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
          maxWidth: 480,
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HelpCircle size={20} />
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#ffffff' }}>
                {isMr ? 'पुनरावलोकन विनंती (Request Review)' : 'Request Moderation Review'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <CheckCircle2 size={44} color="#059669" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#065f46' }}>
              {isMr ? 'विनंती यशस्वीरित्या नोंदवली' : 'Review Request Submitted'}
            </h3>
            <p style={{ fontSize: 13.5, color: '#475569', margin: 0 }}>
              {isMr
                ? 'आमचे मानवी नियंत्रक तुमच्या विनंतीचे पुनरावलोकन करतील.'
                : 'A human moderator will review your request and re-evaluate this content.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {postTitle && (
              <div style={{ fontSize: 12.5, color: '#64748b' }}>
                {isMr ? 'पोस्ट:' : 'Content:'} <strong>{postTitle}</strong>
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#991b1b',
                  fontSize: 12.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                {isMr ? 'पुनरावलोकनाचे कारण:' : 'Why should this be reviewed?'}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                }}
              >
                <option value="mistake">
                  {isMr ? 'चुकीने आक्षेपार्ह म्हणून चिन्हांकित केले गेले' : 'Incorrectly flagged by automated filter'}
                </option>
                <option value="constructive">
                  {isMr ? 'हा केवळ प्रामाणिक प्रवास अनुभव / टीका आहे' : 'Constructive travel criticism, not abuse'}
                </option>
                <option value="cultural">
                  {isMr ? 'ऐतिहासिक व सांस्कृतिक संदर्भ गैरसमज झाला' : 'Cultural / historical context misunderstood'}
                </option>
                <option value="other">
                  {isMr ? 'इतर कारण' : 'Other justification'}
                </option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                {isMr ? 'स्पष्टीकरण (Explanation):' : 'Please explain why your content is compliant:'}
              </label>
              <textarea
                rows={4}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder={
                  isMr
                    ? 'कृपया सांगा की हा मजकूर समुदाय नियमांचे उल्लंघन का करत नाही...'
                    : 'Briefly explain why this post meets Explore Pune Community Guidelines...'
                }
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn outline"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600 }}
              >
                {isMr ? 'पुनरावलोकन पाठवा' : 'Submit Appeal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </ModalPortal>
  );
}

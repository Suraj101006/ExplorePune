'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ThumbsUp,
  MessageSquare,
  Share2,
  Flag,
  MapPin,
  CheckCircle2,
  Calendar,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import {
  CommunityPost,
  POST_TYPE_META,
  formatCommunityTime,
  togglePostHelpful,
  addCommentToPost,
  getStoredCommunityPosts,
} from '@/lib/communityStorage';
import CommunityReportModal from '@/components/CommunityReportModal';

interface CommunityPostDetailModalProps {
  post: CommunityPost | null;
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated?: (updatedPost: CommunityPost) => void;
  onSelectRelatedPost?: (relatedPost: CommunityPost) => void;
}

export default function CommunityPostDetailModal({
  post,
  isOpen,
  onClose,
  onPostUpdated,
  onSelectRelatedPost,
}: CommunityPostDetailModalProps) {
  const { isMr } = useLanguage();
  const { user } = useAuth();

  const [currentPost, setCurrentPost] = useState<CommunityPost | null>(post);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [hasVotedHelpful, setHasVotedHelpful] = useState(false);

  useEffect(() => {
    setCurrentPost(post);
    if (post && user) {
      setHasVotedHelpful((post.helpfulUserIds || []).includes(user.uid));
    } else {
      setHasVotedHelpful(false);
    }
  }, [post, user]);

  if (!isOpen || !currentPost) return null;

  const currentUserId = user?.uid || 'guest-user';
  const typeMeta = POST_TYPE_META[currentPost.postType] || POST_TYPE_META.experience;
  const relativeTime = formatCommunityTime(currentPost.createdAt, isMr);

  // Find related discussions (same place or same category, excluding current)
  const allPosts = getStoredCommunityPosts();
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.id !== currentPost.id &&
        (p.placeId === currentPost.placeId || p.categorySlug === currentPost.categorySlug)
    )
    .slice(0, 3);

  const handleHelpfulClick = () => {
    const res = togglePostHelpful({
      postId: currentPost.id,
      userId: currentUserId,
    });

    if (res.success) {
      const updated: CommunityPost = {
        ...currentPost,
        helpfulCount: res.helpfulCount,
        helpfulUserIds: res.hasVoted
          ? [...(currentPost.helpfulUserIds || []), currentUserId]
          : (currentPost.helpfulUserIds || []).filter((id) => id !== currentUserId),
      };
      setCurrentPost(updated);
      setHasVotedHelpful(res.hasVoted);
      if (onPostUpdated) onPostUpdated(updated);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setIsSubmittingComment(true);
    const newComment = addCommentToPost({
      postId: currentPost.id,
      userId: user?.uid || `guest-${Date.now()}`,
      authorName: user?.displayName || user?.email?.split('@')[0] || (isMr ? 'पुणे पर्यटक' : 'Pune Explorer'),
      authorAvatar: user?.photoURL || undefined,
      content: commentInput.trim(),
    });

    if (newComment) {
      const updated: CommunityPost = {
        ...currentPost,
        commentCount: (currentPost.commentCount || 0) + 1,
        comments: [...(currentPost.comments || []), newComment],
      };
      setCurrentPost(updated);
      setCommentInput('');
      if (onPostUpdated) onPostUpdated(updated);
    }
    setIsSubmittingComment(false);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const shareUrl = `${window.location.origin}/community?place=${currentPost.placeSlug}#${currentPost.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Modal Header Bar */}
        <div
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>💬</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>
              {isMr ? 'पुणे समुदाय चर्चा' : 'Pune Community Discussion'}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              width: 30,
              height: 30,
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          {/* Author Strip & Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={currentPost.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentPost.authorName}
                style={{ width: 44, height: 44, borderRadius: 999, objectFit: 'cover', border: '2px solid #e2e8f0' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <strong style={{ fontSize: 14.5, color: '#0f172a' }}>{currentPost.authorName}</strong>
                  {currentPost.isExplorePuneVerified ? (
                    <span
                      style={{
                        background: '#ecfdf5',
                        color: '#065f46',
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        border: '1px solid #10b981',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <span>✓</span>
                      <span>{isMr ? 'पुणे पडताळलेले' : 'Explore Pune Verified'}</span>
                    </span>
                  ) : (
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                      }}
                    >
                      👥 {isMr ? 'समुदाय' : 'Community'}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 11.5, color: '#64748b' }}>{relativeTime}</span>
              </div>
            </div>

            {/* Place Link Badge */}
            <Link
              href={`/places/${currentPost.placeSlug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '5px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <MapPin size={13} />
              <span>{isMr && currentPost.placeNameMr ? currentPost.placeNameMr : currentPost.placeName}</span>
              <ExternalLink size={11} />
            </Link>
          </div>

          {/* Post Type & Category Pill */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center' }}>
            <span
              style={{
                background: typeMeta.bg,
                color: typeMeta.color,
                fontSize: 11.5,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{typeMeta.icon}</span>
              <span>{isMr ? typeMeta.labelMr : typeMeta.labelEn}</span>
            </span>

            <span
              style={{
                background: '#f8fafc',
                color: '#64748b',
                fontSize: 11.5,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
              }}
            >
              {isMr && currentPost.categoryNameMr ? currentPost.categoryNameMr : currentPost.categoryName}
            </span>
          </div>

          {/* Title & Body Content */}
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.35 }}>
            {currentPost.title}
          </h1>

          <div style={{ fontSize: 14.5, color: '#334155', lineHeight: 1.65, whiteSpace: 'pre-line', marginBottom: 18 }}>
            {currentPost.content}
          </div>

          {/* Attached Images */}
          {currentPost.images && currentPost.images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 20 }}>
              {currentPost.images.map((img, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    height: 180,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <img src={img} alt={`${currentPost.title} photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Helpful & Action Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              marginBottom: 24,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleHelpfulClick}
                style={{
                  background: hasVotedHelpful ? '#ecfdf5' : '#ffffff',
                  border: hasVotedHelpful ? '1.5px solid #10b981' : '1px solid #cbd5e1',
                  color: hasVotedHelpful ? '#065f46' : '#334155',
                  padding: '7px 16px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                  boxShadow: hasVotedHelpful ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
                }}
              >
                <ThumbsUp size={15} fill={hasVotedHelpful ? '#10b981' : 'none'} color={hasVotedHelpful ? '#065f46' : 'currentColor'} />
                <span>
                  {currentPost.helpfulCount} {isMr ? 'उपयुक्त (Helpful)' : 'Helpful'}
                </span>
              </button>

              <span style={{ fontSize: 13, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <MessageSquare size={15} />
                <span>{currentPost.commentCount || 0} {isMr ? 'प्रतिक्रिया' : 'Comments'}</span>
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={handleShare}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Share2 size={13} />
                <span>{copiedShare ? (isMr ? '✓ लिंक कॉपी झाली' : '✓ Copied') : (isMr ? 'शेअर' : 'Share')}</span>
              </button>

              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#991b1b',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Flag size={13} />
                <span>{isMr ? 'तक्रार' : 'Report'}</span>
              </button>
            </div>
          </div>

          {/* =================================================================
              COMMENTS SECTION
              ================================================================= */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
              💬 {isMr ? 'प्रतिक्रिया व चर्चा' : 'Comments & Discussion'} ({currentPost.comments?.length || 0})
            </h3>

            {/* Comment Composer */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={isMr ? 'तुमची प्रतिक्रिया किंवा प्रश्न लिहा…' : 'Add a helpful comment or answer…'}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 13.5,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !commentInput.trim()}
                className="btn"
                style={{
                  padding: '10px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 10,
                  background: '#047857',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: !commentInput.trim() ? 'not-allowed' : 'pointer',
                  opacity: !commentInput.trim() ? 0.6 : 1,
                }}
              >
                <Send size={14} />
                <span>{isMr ? 'पाठवा' : 'Post'}</span>
              </button>
            </form>

            {/* Comments List */}
            {currentPost.comments && currentPost.comments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentPost.comments.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '12px 14px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: 13, color: '#0f172a' }}>{c.authorName}</strong>
                      <span style={{ fontSize: 11, color: '#64748b' }}>
                        {formatCommunityTime(c.createdAt, isMr)}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
                {isMr ? 'अद्याप कोणतीही प्रतिक्रिया नाही. पहिले मत नोंदवा!' : 'No comments yet. Be the first to reply!'}
              </p>
            )}
          </div>

          {/* =================================================================
              RELATED DISCUSSIONS
              ================================================================= */}
          {relatedPosts.length > 0 && (
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                📌 {isMr ? `${currentPost.placeName} वरील इतर चर्चा` : `More from ${currentPost.placeName}`}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {relatedPosts.map((rp) => (
                  <button
                    key={rp.id}
                    type="button"
                    onClick={() => {
                      if (onSelectRelatedPost) onSelectRelatedPost(rp);
                      setCurrentPost(rp);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 13.5, color: '#0f172a', display: 'block', marginBottom: 2 }}>
                        {rp.title}
                      </strong>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>
                        👤 {rp.authorName} • 👍 {rp.helpfulCount} • 💬 {rp.commentCount}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: '#047857', fontWeight: 700 }}>
                      {isMr ? 'पहा →' : 'Read →'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <CommunityReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetId={currentPost.id}
        targetType="post"
        targetTitle={currentPost.title}
      />
    </div>
  );
}

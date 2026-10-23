'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  ThumbsUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import {
  CommunityPost,
  POST_TYPE_META,
  getStoredCommunityPosts,
  filterCommunityPosts,
  togglePostHelpful,
  formatCommunityTime,
} from '@/lib/communityStorage';
import CommunityPostModal from '@/components/CommunityPostModal';
import CommunityPostDetailModal from '@/components/CommunityPostDetailModal';

interface PlaceCommunitySectionProps {
  placeId: string;
  placeSlug: string;
  placeName: string;
}

export default function PlaceCommunitySection({
  placeId,
  placeSlug,
  placeName,
}: PlaceCommunitySectionProps) {
  const { isMr } = useLanguage();
  const { user } = useAuth();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  useEffect(() => {
    setPosts(getStoredCommunityPosts());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CommunityPost[]>;
      if (customEvent.detail) {
        setPosts(customEvent.detail);
      } else {
        setPosts(getStoredCommunityPosts());
      }
    };

    window.addEventListener('explore-pune-community-updated', handleUpdate);
    return () => {
      window.removeEventListener('explore-pune-community-updated', handleUpdate);
    };
  }, []);

  const placePosts = useMemo(() => {
    return filterCommunityPosts({
      posts,
      placeId,
      sortOption: 'latest',
    });
  }, [posts, placeId]);

  const handleHelpfulClick = (post: CommunityPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const userId = user?.uid || 'guest-user';
    const res = togglePostHelpful({ postId: post.id, userId });
    if (res.success) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === post.id) {
            const userIds = [...(p.helpfulUserIds || [])];
            if (res.hasVoted) {
              if (!userIds.includes(userId)) userIds.push(userId);
            } else {
              const idx = userIds.indexOf(userId);
              if (idx > -1) userIds.splice(idx, 1);
            }
            return {
              ...p,
              helpfulCount: res.helpfulCount,
              helpfulUserIds: userIds,
            };
          }
          return p;
        })
      );
    }
  };

  return (
    <section
      className="panel scroll-reveal place-section-reveal"
      style={{
        marginBottom: 28,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: '24px 22px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          borderBottom: '1px solid var(--line)',
          paddingBottom: 16,
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--brand-terracotta, #c2410c)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 4,
            }}
          >
            <Users size={14} />
            <span>{isMr ? 'पुणे समुदाय मंच' : 'Pune Community Forum'}</span>
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: '19px',
              fontWeight: 700,
              color: 'var(--ink)',
            }}
          >
            👥 {isMr ? 'समुदाय चर्चा आणि उपयुक्त टिप्स' : `Community Discussions & Local Tips`}
          </h2>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '13px',
              color: 'var(--muted)',
            }}
          >
            {isMr
              ? `${placeName} साठी इतर पर्यटकांनी दिलेले सल्ले, ट्रेकिंग मार्गदर्शक आणि प्रश्न.`
              : `Real travel tips, parking advice, and questions from explorers who visited ${placeName}.`}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setComposerOpen(true)}
          className="btn btn-primary"
          style={{
            fontSize: '13px',
            padding: '8px 16px',
            borderRadius: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 600,
          }}
        >
          <Plus size={16} />
          <span>{isMr ? 'अनुभव किंवा प्रश्न जोडा' : 'Ask Question / Share Tip'}</span>
        </button>
      </div>

      {/* Posts List */}
      {placePosts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {placePosts.slice(0, 4).map((post) => {
            const meta = POST_TYPE_META[post.postType] || POST_TYPE_META.experience;
            const hasVoted = user && (post.helpfulUserIds || []).includes(user.uid);

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPost(post);
                  }
                }}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: '16px 18px',
                  background: 'var(--bg)',
                  cursor: 'pointer',
                  transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(194, 65, 12, 0.4)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Meta strip */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: '#ea580c',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{post.authorName}</span>
                    {post.isExplorePuneVerified && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          background: '#ecfdf5',
                          color: '#047857',
                          padding: '1px 6px',
                          borderRadius: 999,
                          fontSize: 10.5,
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle2 size={11} />
                        <span>{isMr ? 'पडताळणीकृत' : 'Verified'}</span>
                      </span>
                    )}
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span style={{ color: 'var(--muted)' }}>
                      {formatCommunityTime(post.createdAt, isMr)}
                    </span>
                  </div>

                  <span
                    style={{
                      background: meta.bg,
                      color: meta.color,
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {meta.icon} {isMr ? meta.labelMr : meta.labelEn}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    margin: '0 0 6px',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--ink)',
                  }}
                >
                  {post.title}
                </h3>

                {/* Snippet */}
                <p
                  style={{
                    margin: 0,
                    fontSize: '13.5px',
                    color: 'var(--ink-secondary)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.content}
                </p>

                {/* Footer Info */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    fontSize: 12,
                    color: 'var(--muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      type="button"
                      onClick={(e) => handleHelpfulClick(post, e)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        background: hasVoted ? 'rgba(4, 120, 87, 0.1)' : 'transparent',
                        color: hasVoted ? '#047857' : 'inherit',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontWeight: hasVoted ? 700 : 500,
                      }}
                    >
                      <ThumbsUp size={13} />
                      <span>{post.helpfulCount}</span>
                    </button>

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <MessageSquare size={13} />
                      <span>
                        {post.commentCount} {isMr ? 'चर्चा' : 'comments'}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      color: 'var(--brand-terracotta, #c2410c)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <span>{isMr ? 'संपूर्ण चर्चा पहा' : 'View Discussion'}</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}

          {/* Link to all community discussions for this place */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Link
              href={`/community?place=${placeId}`}
              className="btn outline"
              style={{
                fontSize: 13,
                padding: '7px 18px',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>
                {isMr
                  ? `${placeName} साठी सर्व चर्चा पहा (${placePosts.length})`
                  : `View all ${placePosts.length} discussions for this place`}
              </span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div
          style={{
            textAlign: 'center',
            padding: '28px 16px',
            background: 'var(--bg)',
            borderRadius: 12,
            border: '1px dashed var(--line)',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
          <p style={{ margin: '0 0 12px', fontSize: 13.5, color: 'var(--muted)' }}>
            {isMr
              ? `या ठिकाणासाठी अद्याप चर्चा उपलब्ध नाही. पहिले अनुभव किंवा उपयुक्त टीप शेअर करा!`
              : `No community discussions for ${placeName} yet. Be the first explorer to share tips or ask questions!`}
          </p>
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: 12.5, padding: '7px 16px' }}
          >
            ＋ {isMr ? 'पहिला अनुभव जोडा' : 'Share First Tip / Experience'}
          </button>
        </div>
      )}

      {/* Composer Modal */}
      <CommunityPostModal
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        initialPlaceId={placeId}
        initialPlaceSlug={placeSlug}
        onPostCreated={(newPost) => {
          setPosts((prev) => [newPost, ...prev]);
        }}
      />

      {/* Detail Modal */}
      <CommunityPostDetailModal
        post={selectedPost}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        onPostUpdated={(updated) => {
          setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setSelectedPost(updated);
        }}
        onSelectRelatedPost={(related) => {
          setSelectedPost(related);
        }}
      />
    </section>
  );
}

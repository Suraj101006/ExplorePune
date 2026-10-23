'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  MessageSquare,
  FileText,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import {
  CommunityPost,
  CommunityReport,
  getStoredCommunityPosts,
  getStoredCommunityReports,
  resolveCommunityReport,
  updatePostStatus,
  formatCommunityTime,
} from '@/lib/communityStorage';
import {
  CommunityAppeal,
  getStoredAppeals,
  resolveCommunityAppeal,
} from '@/lib/userSafety';

export default function CommunityModerationDashboard() {
  const { isMr } = useLanguage();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [appeals, setAppeals] = useState<CommunityAppeal[]>([]);
  const [activeSection, setActiveSection] = useState<'reports' | 'review' | 'appeals'>('reports');
  const [actionNotice, setActionNotice] = useState('');

  const loadData = () => {
    setPosts(getStoredCommunityPosts());
    setReports(getStoredCommunityReports());
    setAppeals(getStoredAppeals());
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const reviewPosts = posts.filter((p) => p.status === 'review');
  const pendingAppeals = appeals.filter((a) => a.status === 'pending');

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 2500);
    loadData();
  };

  const handleResolveReport = (reportId: string, action: 'keep' | 'remove' | 'dismiss') => {
    resolveCommunityReport(reportId, action);
    showFeedback(
      action === 'remove'
        ? 'Post removed and report marked resolved.'
        : action === 'keep'
        ? 'Content retained and report resolved.'
        : 'Report dismissed.'
    );
  };

  const handlePostApproval = (postId: string, approve: boolean) => {
    updatePostStatus(postId, approve ? 'published' : 'hidden');
    showFeedback(approve ? 'Post approved and published!' : 'Post rejected and hidden.');
  };

  const handleAppealDecision = (appeal: CommunityAppeal, grant: boolean) => {
    resolveCommunityAppeal(
      appeal.id,
      grant ? 'approved' : 'rejected',
      grant ? 'Approved after review' : 'Content violates guidelines'
    );
    if (grant) {
      updatePostStatus(appeal.postId, 'published');
    }
    showFeedback(grant ? 'Appeal granted: post restored!' : 'Appeal denied.');
  };

  return (
    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Metric Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={15} />
            <span>{isMr ? 'प्रलंबित तक्रारी' : 'Pending Reports'}</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
            {pendingReports.length}
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#d97706', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={15} />
            <span>{isMr ? 'पुनरावलोकन रांग' : 'Held in Review'}</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
            {reviewPosts.length}
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 6 }}>
            <UserCheck size={15} />
            <span>{isMr ? 'वापरकर्ता अपील्स' : 'Pending Appeals'}</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
            {pendingAppeals.length}
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: 10,
            padding: '10px 16px',
            color: '#065f46',
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          ✓ {actionNotice}
        </div>
      )}

      {/* Queue Tabs */}
      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
        <button
          type="button"
          onClick={() => setActiveSection('reports')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: activeSection === 'reports' ? '1.5px solid #dc2626' : '1px solid var(--line)',
            background: activeSection === 'reports' ? 'rgba(220, 38, 38, 0.08)' : 'transparent',
            color: activeSection === 'reports' ? '#dc2626' : 'var(--ink)',
            fontWeight: activeSection === 'reports' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 13.5,
          }}
        >
          🚨 {isMr ? 'तक्रारी रांग' : 'User Reports'} ({pendingReports.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('review')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: activeSection === 'review' ? '1.5px solid #d97706' : '1px solid var(--line)',
            background: activeSection === 'review' ? 'rgba(217, 119, 6, 0.08)' : 'transparent',
            color: activeSection === 'review' ? '#d97706' : 'var(--ink)',
            fontWeight: activeSection === 'review' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 13.5,
          }}
        >
          ⏳ {isMr ? 'सुरक्षितता तपासणी' : 'Held Review Queue'} ({reviewPosts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('appeals')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: activeSection === 'appeals' ? '1.5px solid #2563eb' : '1px solid var(--line)',
            background: activeSection === 'appeals' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
            color: activeSection === 'appeals' ? '#2563eb' : 'var(--ink)',
            fontWeight: activeSection === 'appeals' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 13.5,
          }}
        >
          🛡️ {isMr ? 'अपील्स (Appeals)' : 'User Appeals'} ({pendingAppeals.length})
        </button>
      </div>

      {/* 1. REPORTS QUEUE */}
      {activeSection === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {pendingReports.length > 0 ? (
            pendingReports.map((report) => {
              const targetPost = posts.find((p) => p.id === report.targetId);

              return (
                <div
                  key={report.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 14,
                    padding: 18,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          background: '#fee2e2',
                          color: '#991b1b',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {report.reason}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        Reported {formatCommunityTime(report.createdAt, isMr)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => handleResolveReport(report.id, 'keep')}
                        className="btn outline"
                        style={{ fontSize: 12, padding: '5px 12px', color: '#047857' }}
                      >
                        ✓ Keep Content
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolveReport(report.id, 'remove')}
                        className="btn btn-primary"
                        style={{ fontSize: 12, padding: '5px 12px', background: '#dc2626' }}
                      >
                        ✕ Remove Post
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolveReport(report.id, 'dismiss')}
                        className="btn outline"
                        style={{ fontSize: 12, padding: '5px 12px' }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>

                  {targetPost ? (
                    <div>
                      <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                        {targetPost.title}
                      </h4>
                      <p style={{ margin: '0 0 10px', fontSize: 13.5, color: 'var(--ink-secondary)' }}>
                        {targetPost.content}
                      </p>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        Author: <strong>{targetPost.authorName}</strong> • Place: {targetPost.placeName}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
                      Target content id: {report.targetId} (Content not found or already deleted)
                    </div>
                  )}

                  {report.details && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: '8px 12px',
                        background: 'rgba(0,0,0,0.03)',
                        borderRadius: 8,
                        fontSize: 12.5,
                        color: 'var(--ink-secondary)',
                      }}
                    >
                      <strong>Reporter Notes:</strong> &ldquo;{report.details}&rdquo;
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
              ✓ No pending reports. The community queue is clear!
            </div>
          )}
        </div>
      )}

      {/* 2. HELD REVIEW QUEUE */}
      {activeSection === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reviewPosts.length > 0 ? (
            reviewPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid #fde68a',
                  borderRadius: 14,
                  padding: 18,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Held by Automated Safety Check
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {formatCommunityTime(post.createdAt, isMr)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handlePostApproval(post.id, true)}
                      className="btn btn-primary"
                      style={{ fontSize: 12, padding: '5px 14px', background: '#047857' }}
                    >
                      ✓ Approve & Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePostApproval(post.id, false)}
                      className="btn outline"
                      style={{ fontSize: 12, padding: '5px 14px', color: '#dc2626' }}
                    >
                      ✕ Reject Post
                    </button>
                  </div>
                </div>

                <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                  {post.title}
                </h4>
                <p style={{ margin: '0 0 10px', fontSize: 13.5, color: 'var(--ink-secondary)' }}>
                  {post.content}
                </p>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  Author: <strong>{post.authorName}</strong> • Destination: {post.placeName}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
              ✓ No posts currently held in review.
            </div>
          )}
        </div>
      )}

      {/* 3. APPEALS QUEUE */}
      {activeSection === 'appeals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {pendingAppeals.length > 0 ? (
            pendingAppeals.map((appeal) => (
              <div
                key={appeal.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: 18,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Appeal: {appeal.reason}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Submitted {formatCommunityTime(appeal.createdAt, isMr)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleAppealDecision(appeal, true)}
                      className="btn btn-primary"
                      style={{ fontSize: 12, padding: '5px 14px', background: '#2563eb' }}
                    >
                      ✓ Grant Appeal & Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAppealDecision(appeal, false)}
                      className="btn outline"
                      style={{ fontSize: 12, padding: '5px 14px' }}
                    >
                      ✕ Deny Appeal
                    </button>
                  </div>
                </div>

                {appeal.postTitle && (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Post: {appeal.postTitle}
                  </div>
                )}

                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(37, 99, 235, 0.05)',
                    borderRadius: 10,
                    fontSize: 13,
                    color: 'var(--ink)',
                    marginBottom: 10,
                  }}
                >
                  <strong>User Explanation:</strong> &ldquo;{appeal.explanation}&rdquo;
                </div>

                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  Appealed by: <strong>{appeal.authorName}</strong> (UID: {appeal.userId})
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
              ✓ No pending appeals from community members.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

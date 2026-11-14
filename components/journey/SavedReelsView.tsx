'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import {
  Film,
  Play,
  Download,
  Trash2,
  Copy,
  Edit3,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  FolderHeart,
} from 'lucide-react';
import {
  RenderedExportRecord,
  ReelProjectDraft,
  deleteRenderedExport,
  deleteProjectDraft,
  duplicateProjectDraft,
} from '@/lib/memoryAlbumStorage';
import { JourneyReelData } from '@/lib/journeyReel';

interface SavedReelsViewProps {
  savedExports: RenderedExportRecord[];
  savedDrafts: ReelProjectDraft[];
  isMr: boolean;
  userId?: string | null;
  onResumeDraft: (draft: ReelProjectDraft) => void;
  onPlayReel: (reel: any) => void;
  onLaunchNewReel: () => void;
}

export default function SavedReelsView({
  savedExports,
  savedDrafts,
  isMr,
  userId,
  onResumeDraft,
  onPlayReel,
  onLaunchNewReel,
}: SavedReelsViewProps) {
  const [activeTab, setActiveTab] = useState<'exports' | 'drafts'>('exports');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Top Banner and Tabs */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FolderHeart size={22} color="#2563eb" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#0f172a' }}>
              {isMr ? 'जतन केलेले रील व प्रोजेक्ट्स' : 'Saved Reels & Studio Projects'}
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {isMr
                ? 'तयार झालेले MP4 व्हिडिओ आणि अपूर्ण प्रोजेक्ट मसुदे'
                : 'Completed MP4 exports and in-progress project drafts.'}
            </span>
          </div>
        </div>

        {/* Dual Tab Switcher */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setActiveTab('exports')}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: activeTab === 'exports' ? 700 : 500,
              border: activeTab === 'exports' ? '1px solid #2563eb' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'exports' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'exports' ? '#2563eb' : '#475569',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Film size={14} />
            <span>{isMr ? 'तयार MP4 रील' : 'Rendered MP4s'} ({savedExports.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drafts')}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: activeTab === 'drafts' ? 700 : 500,
              border: activeTab === 'drafts' ? '1px solid #7c3aed' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'drafts' ? '#faf5ff' : '#ffffff',
              color: activeTab === 'drafts' ? '#7c3aed' : '#475569',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Layers size={14} />
            <span>{isMr ? 'प्रोजेक्ट मसुदे' : 'Project Drafts'} ({savedDrafts.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Rendered MP4 Exports */}
      {activeTab === 'exports' && (
        <div>
          {savedExports.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                borderRadius: 20,
                background: '#ffffff',
                border: '1px dashed #cbd5e1',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Film size={36} color="#94a3b8" />
              <h3 style={{ margin: 0, fontSize: 16, color: '#334155' }}>
                {isMr ? 'अजून कोणताही MP4 रील तयार केलेला नाही' : 'No Rendered MP4 Reels Yet'}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                {isMr
                  ? 'रील स्टुडिओमध्ये जाऊन तुमच्या आवडत्या ठिकाणाचा पहिला सिनेमॅटिक रील बनवा.'
                  : 'Open Reel Studio to generate your first vertical 9:16 travel story.'}
              </p>
              <button
                type="button"
                onClick={onLaunchNewReel}
                style={{
                  padding: '9px 18px',
                  borderRadius: 10,
                  background: '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isMr ? 'रील स्टुडिओ उघडा' : 'Launch Reel Studio'}
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 16,
              }}
            >
              {savedExports.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 18,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: 180,
                      backgroundColor: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Film size={44} color="#64748b" />
                    <button
                      type="button"
                      onClick={() => onPlayReel(exp)}
                      style={{
                        position: 'absolute',
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: 'rgba(234, 88, 12, 0.9)',
                        border: 'none',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Play size={20} style={{ marginLeft: 2 }} />
                    </button>
                  </div>

                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <strong style={{ fontSize: 14.5, color: '#0f172a' }}>{exp.title}</strong>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      {exp.placeName || 'Pune'} • {exp.durationSec.toFixed(0)}s • {exp.resolution}
                    </span>

                    <div
                      style={{
                        marginTop: 6,
                        paddingTop: 10,
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      {exp.downloadUrl ? (
                        <a
                          href={exp.downloadUrl}
                          download={exp.filename || 'pune-journey-reel.mp4'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#059669',
                            textDecoration: 'none',
                          }}
                        >
                          <Download size={13} />
                          <span>{isMr ? 'डाउनलोड' : 'Download'}</span>
                        </a>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>Archived</span>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteRenderedExport(exp.id, userId)}
                        title="Delete export"
                        style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Project Drafts */}
      {activeTab === 'drafts' && (
        <div>
          {savedDrafts.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                borderRadius: 20,
                background: '#ffffff',
                border: '1px dashed #cbd5e1',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Layers size={36} color="#94a3b8" />
              <h3 style={{ margin: 0, fontSize: 16, color: '#334155' }}>
                {isMr ? 'कोणतेही अपूर्ण मसुदे नाहीत' : 'No Project Drafts Found'}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                {isMr
                  ? 'रील स्टुडिओमध्ये "मसुदा जतन करा" बटणावर क्लिक करून तुम्ही काम नंतर सुरू ठेवू शकता.'
                  : 'Save in-progress projects in Reel Studio to pick up editing anytime.'}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {savedDrafts.map((draft) => (
                <div
                  key={draft.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 18,
                    border: '1px solid #e2e8f0',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: 15, color: '#0f172a', display: 'block' }}>
                        {draft.title}
                      </strong>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        {draft.placeName} • {draft.scenes?.length || 5} scenes
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 8,
                        backgroundColor: '#faf5ff',
                        color: '#7c3aed',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      Draft
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 10,
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onResumeDraft(draft)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 10,
                        backgroundColor: '#7c3aed',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: 12.5,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <Edit3 size={12} />
                      <span>{isMr ? 'काम सुरू ठेवा' : 'Resume Editing'}</span>
                    </button>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => duplicateProjectDraft(draft.id, userId)}
                        title="Duplicate draft"
                        style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}
                      >
                        <Copy size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProjectDraft(draft.id, userId)}
                        title="Delete draft"
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

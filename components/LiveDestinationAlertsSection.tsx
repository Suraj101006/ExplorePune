'use client';

import React, { useState } from 'react';
import { DestinationLiveStatusSummary, DestinationAlert, formatIstTimestamp } from '@/lib/liveStatus';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Clock,
  Compass,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCw,
} from 'lucide-react';

interface LiveDestinationAlertsSectionProps {
  statusData: DestinationLiveStatusSummary;
  isMarathi?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function LiveDestinationAlertsSection({
  statusData,
  isMarathi = false,
  onRefresh,
  isRefreshing = false,
}: LiveDestinationAlertsSectionProps) {
  const {
    destinationName,
    destinationNameMr,
    status,
    activeAlerts,
    newsUpdates,
    lastVerifiedAt,
  } = statusData;

  const destDisplayName = isMarathi && destinationNameMr ? destinationNameMr : destinationName;

  // Category labels mapping
  const categoryLabels: Record<string, { en: string; mr: string; icon: string }> = {
    closure: { en: 'Closure Notice', mr: 'बंद आदेश', icon: '🛑' },
    trekking: { en: 'Trekking & Trails', mr: 'ट्रेकिंग व पायवाट', icon: '🥾' },
    weather: { en: 'Weather & Hazards', mr: 'हवामान व धोका', icon: '🌧️' },
    road_access: { en: 'Road Access & Traffic', mr: 'रस्ता व वाहतूक', icon: '🚗' },
    darshan: { en: 'Temple & Darshan', mr: 'दर्शन व रांग', icon: '🛕' },
    crowd: { en: 'Crowd Regulation', mr: 'गर्दी नियंत्रण', icon: '👥' },
    general: { en: 'General Update', mr: 'सर्वसाधारण अपडेट', icon: 'ℹ️' },
  };

  return (
    <section
      id="live-status-alerts"
      className="panel scroll-reveal place-section-reveal"
      style={{
        marginBottom: 24,
        border: '1.5px solid var(--line, #e2e8f0)',
        borderRadius: 'var(--radius-md, 12px)',
        padding: '24px 22px',
        background: 'var(--card, #ffffff)',
      }}
    >
      {/* SECTION HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          borderBottom: '1px solid var(--line, #e2e8f0)',
          paddingBottom: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: status === 'closed' ? '#e11d48' : status === 'restricted' ? '#d97706' : '#059669',
                boxShadow: `0 0 0 3px ${status === 'closed' ? 'rgba(225,29,72,0.2)' : status === 'restricted' ? 'rgba(217,119,6,0.2)' : 'rgba(5,150,105,0.2)'}`,
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--green, #1F4D3A)',
                fontFamily: 'var(--serif)',
              }}
            >
              {isMarathi ? 'थेट स्थिती व सुरक्षा सतर्कता सूचना' : 'Live Status & Safety Alerts'}
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted, #64748b)' }}>
            {isMarathi
              ? `${destDisplayName} साठी अधिकृत प्रशासकीय आदेश, वनविभाग सूचना व पडताळणी`
              : `Official administrative circulars, forest department orders & live safety verification for ${destDisplayName}`}
          </p>
        </div>

        {/* Verification & Manual Refresh Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '12px', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} />
            <span>{isMarathi ? 'सुरक्षा सूचना तपासणी:' : 'Advisories Checked:'} {lastVerifiedAt}</span>
          </span>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="btn outline"
              style={{
                padding: '4px 10px',
                fontSize: '11.5px',
                borderRadius: 999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                cursor: isRefreshing ? 'wait' : 'pointer',
              }}
              title={isMarathi ? 'ताजी माहिती तपासा' : 'Check latest status'}
            >
              <RotateCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? (isMarathi ? 'तपासत आहे…' : 'Checking…') : (isMarathi ? 'रिफ्रेश' : 'Refresh')}</span>
            </button>
          )}
        </div>
      </div>

      {/* PART 1: ACTIVE LIVE SAFETY ALERTS */}
      <div style={{ marginBottom: 28 }}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: 'var(--ink, #1e293b)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>🚨</span>
          <span>{isMarathi ? 'सक्रिय प्रशासकीय आदेश व सुरक्षा सूचना' : 'Active Official Notices & Safety Advisories'}</span>
        </h3>

        {activeAlerts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activeAlerts.map((alert) => {
              const catInfo = categoryLabels[alert.category] || categoryLabels.general;
              const isUrgent = alert.severity === 'urgent';
              const isRestr = alert.severity === 'moderate';

              return (
                <div
                  key={alert.id}
                  style={{
                    borderRadius: 'var(--radius-sm, 10px)',
                    border: `1.5px solid ${isUrgent ? '#fecdd3' : isRestr ? '#fde68a' : '#e2e8f0'}`,
                    background: isUrgent ? '#fff1f2' : isRestr ? '#fffbeb' : '#f8fafc',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {/* Alert Header Row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: isUrgent ? '#e11d48' : isRestr ? '#d97706' : '#475569',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        <span>{catInfo.icon}</span>
                        <span>{isMarathi ? catInfo.mr : catInfo.en}</span>
                      </span>

                      {alert.isOfficialOrder && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#065f46',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <CheckCircle2 size={11} />
                          <span>{isMarathi ? 'अधिकृत शासकीय आदेश' : 'Official Authority Order'}</span>
                        </span>
                      )}
                    </div>

                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {formatIstTimestamp(alert.effectiveFrom)}
                    </span>
                  </div>

                  {/* Title & Reason */}
                  <div>
                    <h4
                      style={{
                        margin: '0 0 6px',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: isUrgent ? '#e11d48' : isRestr ? '#f59e0b' : 'var(--ink)',
                      }}
                    >
                      {isMarathi && alert.titleMr ? alert.titleMr : alert.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.55, color: 'var(--ink-secondary)' }}>
                      {isMarathi && alert.summaryMr ? alert.summaryMr : alert.summary}
                    </p>
                  </div>

                  {/* Granular Visitor Permissions Card */}
                  <div
                    style={{
                      background: 'var(--card)',
                      color: 'var(--ink)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      gap: 16,
                      flexWrap: 'wrap',
                      fontSize: '12px',
                    }}
                  >
                    {alert.canEnter !== null && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: alert.canEnter ? '#059669' : '#e11d48', fontWeight: 800 }}>
                          {alert.canEnter ? '✓' : '✕'}
                        </span>
                        <span>
                          {isMarathi
                            ? (alert.canEnter ? 'प्रवेश परवानगी: सुरू' : 'प्रवेश: पूर्ण बंद')
                            : (alert.canEnter ? 'Public Entry: Allowed' : 'Public Entry: Prohibited')}
                        </span>
                      </span>
                    )}

                    {alert.canTrek !== null && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: alert.canTrek ? '#059669' : '#d97706', fontWeight: 800 }}>
                          {alert.canTrek ? '✓' : '✕'}
                        </span>
                        <span>
                          {isMarathi
                            ? (alert.canTrek ? 'ट्रेकिंग: दिवसा सुरू' : 'ट्रेकिंग: निर्बंध लागू')
                            : (alert.canTrek ? 'Trekking: Daylight Only' : 'Trekking: Restricted')}
                        </span>
                      </span>
                    )}

                    {alert.canDarshan !== null && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: alert.canDarshan ? '#059669' : '#e11d48', fontWeight: 800 }}>
                          {alert.canDarshan ? '✓' : '✕'}
                        </span>
                        <span>
                          {isMarathi
                            ? (alert.canDarshan ? 'दर्शन: सुरू' : 'दर्शन: तात्पुरते स्थगित')
                            : (alert.canDarshan ? 'Darshan: Active' : 'Darshan: Suspended')}
                        </span>
                      </span>
                    )}

                    {alert.reopeningConditions && (
                      <span style={{ color: '#047857', fontWeight: 600 }}>
                        ⏳ {isMarathi && alert.reopeningConditionsMr ? alert.reopeningConditionsMr : alert.reopeningConditions}
                      </span>
                    )}
                  </div>

                  {/* Issuing Authority & Verified Source Link */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 10,
                      fontSize: '12px',
                      color: '#475569',
                      paddingTop: 4,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Building size={13} color="var(--primary, #047857)" />
                      <span>
                        {isMarathi ? 'जारीकर्ता प्राधिकरण:' : 'Issuing Authority:'}{' '}
                        <strong>{isMarathi && alert.issuingAuthorityMr ? alert.issuingAuthorityMr : alert.issuingAuthority}</strong>
                      </span>
                    </span>

                    {alert.sourceUrl && (
                      <a
                        href={alert.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{
                          fontSize: '12px',
                          color: '#0284c7',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span>{isMarathi ? 'मूळ अधिकृत सूचना पहा' : 'View Official Notice'}</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* NO RESTRICTIONS CARD (Prompt Requirement 5) */
          <div
            style={{
              borderRadius: 'var(--radius-sm, 10px)',
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <ShieldCheck size={24} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ display: 'block', color: '#065f46', fontSize: '14.5px', marginBottom: 4 }}>
                {isMarathi
                  ? 'ताज्या उपलब्ध स्रोतांमध्ये कोणताही सक्रिय निर्बंध आढळलेला नाही'
                  : 'No verified active restriction found in latest available sources.'}
              </strong>
              <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#166534', lineHeight: 1.5 }}>
                {isMarathi
                  ? 'स्थानिक हवामान व प्रशासकीय नियमांनुसार बदल संभवतात; प्रवासाला निघण्यापूर्वी स्थानिक प्रशासन किंवा संस्थेशी खात्री करा.'
                  : 'Conditions may change due to local weather, maintenance, or administrative advisories. Confirm with the local authority or temple trust before travelling.'}
              </p>
              <span style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600 }}>
                ✓ {isMarathi ? 'पुणे जिल्हा प्रशासन व वनविभाग पोर्टलवर कोणतीही बंदी नोंद नाही.' : 'No active closure order listed on Pune District Administration or Forest Department portals.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PART 2: LATEST NEWS & UPDATES (Prompt Requirement 5) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: 'var(--ink, #1e293b)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>📰</span>
            <span>{isMarathi ? 'ताज्या बातम्या व घडामोडी' : 'Latest News & Updates'}</span>
          </h3>

          <span
            style={{
              fontSize: '11px',
              color: 'var(--muted, #64748b)',
              background: 'var(--bg, #f1f5f9)',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {isMarathi ? 'माध्यम अहवाल (प्रशासकीय आदेशांहून वेगळे)' : 'Press Coverage (Distinct from Official Orders)'}
          </span>
        </div>

        {newsUpdates.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {newsUpdates.map((news) => (
              <article
                key={news.id}
                style={{
                  borderRadius: 'var(--radius-sm, 8px)',
                  border: '1px solid var(--line)',
                  background: 'var(--card)',
                  color: 'var(--ink)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 8,
                  boxShadow: 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.04))',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary, #047857)' }}>{news.sourceName}</span>
                    <span>{formatIstTimestamp(news.effectiveFrom).split(',')[0]}</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '13.5px', fontWeight: 700, lineHeight: 1.4, color: 'var(--ink)' }}>
                    {news.title}
                  </h4>
                  {news.summary && news.summary !== news.title && (
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: 1.45 }}>
                      {news.summary.slice(0, 140)}...
                    </p>
                  )}
                </div>

                <div style={{ paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                  <a
                    href={news.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                      fontSize: '11.5px',
                      color: '#0284c7',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <span>{isMarathi ? 'सविस्तर बातमी वाचा' : 'Read Article'}</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '12.5px', color: '#64748b' }}>
            ℹ️ {isMarathi
              ? 'गेल्या काही आठवड्यांत या ठिकाणाबाबत कोणतीही प्रतिकूल बातमी किंवा निर्बंध नोंदवले गेलेले नाहीत.'
              : 'No adverse incidents, road blockages, or emergency alerts reported in leading Pune press over recent weeks.'}
          </div>
        )}
      </div>
    </section>
  );
}

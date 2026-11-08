'use client';

import React from 'react';
import { DestinationLiveStatusSummary } from '@/lib/liveStatus';
import { ShieldCheck, AlertTriangle, XCircle, Info, Clock, ExternalLink } from 'lucide-react';

interface LiveDestinationStatusBadgeProps {
  statusData: DestinationLiveStatusSummary;
  isMarathi?: boolean;
}

export default function LiveDestinationStatusBadge({
  statusData,
  isMarathi = false,
}: LiveDestinationStatusBadgeProps) {
  const {
    status,
    statusLabelEn,
    statusLabelMr,
    badgeClass,
    headlineEn,
    headlineMr,
    canEnter,
    canTrek,
    canDarshan,
    lastVerifiedAt,
    activeAlerts,
    newsUpdates,
  } = statusData;

  const isClosed = status === 'closed';
  const isRestricted = status === 'restricted';
  const isWarning = status === 'warning';
  const isOpen = status === 'open';

  // Card background and border color based on status
  const containerBg = isClosed
    ? '#fff1f2'
    : isRestricted
    ? '#fffbeb'
    : isWarning
    ? '#fefce8'
    : isOpen
    ? '#f0fdf4'
    : '#f8fafc';

  const containerBorder = isClosed
    ? '#fecdd3'
    : isRestricted
    ? '#fde68a'
    : isWarning
    ? '#fef08a'
    : isOpen
    ? '#bbf7d0'
    : '#e2e8f0';

  const headline = isMarathi ? headlineMr : headlineEn;
  const statusLabel = isMarathi ? statusLabelMr : statusLabelEn;

  const scrollToAlerts = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('live-status-alerts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside
      aria-label={isMarathi ? 'थेट ठिकाण स्थिती व सुरक्षा सूचना' : 'Live destination status and safety advisory'}
      style={{
        borderRadius: 'var(--radius-sm, 10px)',
        background: containerBg,
        border: `1.5px solid ${containerBorder}`,
        padding: '12px 16px',
        margin: '12px 0 16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Top Row: Status Badge, Headline & Link */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className={`status-badge ${badgeClass}`} style={{ fontSize: '11px', padding: '3px 10px' }}>
            {isClosed ? (
              <XCircle size={12} strokeWidth={2.5} />
            ) : isRestricted ? (
              <AlertTriangle size={12} strokeWidth={2.5} />
            ) : isWarning ? (
              <AlertTriangle size={12} strokeWidth={2.5} />
            ) : isOpen ? (
              <ShieldCheck size={12} strokeWidth={2.5} />
            ) : (
              <Info size={12} strokeWidth={2.5} />
            )}
            <span>{statusLabel}</span>
          </span>

          <strong
            style={{
              fontSize: '13.5px',
              color: isClosed ? '#9f1239' : isRestricted ? '#92400e' : isWarning ? '#854d0e' : '#065f46',
              fontWeight: 700,
            }}
          >
            {headline}
          </strong>
        </div>

        {/* Anchor link to full alerts breakdown */}
        {(activeAlerts.length > 0 || newsUpdates.length > 0) && (
          <a
            href="#live-status-alerts"
            onClick={scrollToAlerts}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: isClosed ? '#be123c' : isRestricted ? '#b45309' : '#047857',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{isMarathi ? 'सविस्तर सूचना व स्रोत पहा' : 'View Advisories & Sources'}</span>
            <span aria-hidden="true">↓</span>
          </a>
        )}
      </div>

      {/* Second Row: Specific Permissions & Verification Timestamp */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: '12px',
          color: 'var(--muted, #64748b)',
          borderTop: `1px solid ${containerBorder}`,
          paddingTop: 8,
        }}
      >
        {/* Permission Badges */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {canEnter !== null && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: canEnter ? '#059669' : '#e11d48', fontWeight: 800 }}>
                {canEnter ? '✓' : '✕'}
              </span>
              <span style={{ fontWeight: 600, color: '#334155' }}>
                {isMarathi ? (canEnter ? 'प्रवेश सुरू' : 'प्रवेश बंद') : (canEnter ? 'Public Entry Open' : 'Entry Closed')}
              </span>
            </span>
          )}

          {canTrek !== null && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: canTrek ? '#059669' : '#d97706', fontWeight: 800 }}>
                {canTrek ? '✓' : '✕'}
              </span>
              <span style={{ fontWeight: 600, color: '#334155' }}>
                {isMarathi
                  ? (canTrek ? 'दिवसा ट्रेकिंग सुरू' : 'रात्री ट्रेकिंग मनाई / निर्बंध')
                  : (canTrek ? 'Daytime Trekking Allowed' : 'Trekking Restricted')}
              </span>
            </span>
          )}

          {canDarshan !== null && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: canDarshan ? '#059669' : '#e11d48', fontWeight: 800 }}>
                {canDarshan ? '✓' : '✕'}
              </span>
              <span style={{ fontWeight: 600, color: '#334155' }}>
                {isMarathi ? (canDarshan ? 'दर्शन सुरू' : 'दर्शन स्थगित') : (canDarshan ? 'Darshan Active' : 'Darshan Suspended')}
              </span>
            </span>
          )}
        </div>

        {/* Verification Timestamp */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '11.5px', color: '#64748b' }}>
          <Clock size={12} />
          <span>
            {isMarathi ? 'पडताळणी:' : 'Last verified:'} <strong>{lastVerifiedAt}</strong>
          </span>
        </div>
      </div>
    </aside>
  );
}

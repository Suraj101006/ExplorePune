'use client';

import React from 'react';
import {
  AccuracyEvaluation,
  LocationAccuracyService,
} from '@/lib/services/LocationAccuracyService';
import { LocationSource } from '@/lib/services/LocationService';

interface LocationAccuracyIndicatorProps {
  accuracyMeters?: number | null;
  evaluation?: AccuracyEvaluation | null;
  source?: LocationSource;
  isMr?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  showSource?: boolean;
  showAdvice?: boolean;
  compact?: boolean;
}

export default function LocationAccuracyIndicator({
  accuracyMeters,
  evaluation,
  source = 'gps',
  isMr = false,
  onRefresh,
  isRefreshing = false,
  showSource = true,
  showAdvice = false,
  compact = false,
}: LocationAccuracyIndicatorProps) {
  const evalResult = evaluation || LocationAccuracyService.evaluate(accuracyMeters);

  const getSourceLabel = (src: LocationSource) => {
    switch (src) {
      case 'gps':
        return isMr ? 'उपग्रह GPS' : 'Satellite GPS';
      case 'network':
        return isMr ? 'मोबाइल नेटवर्क / Wi-Fi' : 'Cellular / Wi-Fi';
      case 'ip':
        return isMr ? 'IP अंदाज' : 'IP Approximation';
      case 'manual':
        return isMr ? 'निवडलेले' : 'Manual Selection';
      case 'default':
        return isMr ? 'डीफॉल्ट' : 'Default';
      default:
        return isMr ? 'थेट' : 'Live';
    }
  };

  const getAdviceText = () => {
    if (evalResult.tier === 'excellent' || evalResult.tier === 'good') {
      return isMr
        ? 'उत्कृष्ट उपग्रह सिग्नल. अचूक अंतर व नेव्हिगेशन उपलब्ध.'
        : 'High-precision GNSS lock. Optimal for routing and proximity.';
    }
    if (evalResult.tier === 'moderate') {
      return isMr
        ? 'मध्यम अचूकता. खुल्या आकाशाखाली आल्यास सिग्नल सुधारेल.'
        : 'Moderate signal. Moving outdoors provides pinpoint precision.';
    }
    return isMr
      ? 'कमी अचूकता. अचूक अंतरासाठी GPS रीफ्रेश करा.'
      : 'Coarse fix. Tap refresh for a higher accuracy satellite fix.';
  };

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 8px',
          borderRadius: 999,
          background: evalResult.badgeBg,
          border: `1px solid ${evalResult.color}33`,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: evalResult.color,
          lineHeight: 1.2,
        }}
        title={`${isMr ? evalResult.labelMr : evalResult.labelEn} • ${getSourceLabel(source)}`}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: evalResult.color,
            boxShadow: `0 0 6px ${evalResult.color}`,
            display: 'inline-block',
          }}
        />
        <span>{isMr ? evalResult.labelMr : evalResult.labelEn}</span>
        {onRefresh && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            disabled={isRefreshing}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: isRefreshing ? 'wait' : 'pointer',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              color: evalResult.color,
              opacity: isRefreshing ? 0.5 : 0.85,
            }}
            aria-label={isMr ? 'स्थान रीफ्रेश करा' : 'Refresh location'}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '8px 12px',
        borderRadius: 10,
        background: evalResult.badgeBg,
        border: `1px solid ${evalResult.color}40`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              backgroundColor: evalResult.color,
              boxShadow: `0 0 8px ${evalResult.color}`,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.82rem',
              color: evalResult.color,
            }}
          >
            {isMr ? evalResult.labelMr : evalResult.labelEn}
          </span>
          {showSource && (
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(0, 0, 0, 0.05)',
                color: '#475569',
                fontWeight: 600,
              }}
            >
              {getSourceLabel(source)}
            </span>
          )}
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 6,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#334155',
              cursor: isRefreshing ? 'wait' : 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{isMr ? 'रीफ्रेश' : 'Refresh'}</span>
          </button>
        )}
      </div>

      {showAdvice && (
        <p
          style={{
            margin: 0,
            fontSize: '0.73rem',
            color: '#64748b',
            lineHeight: 1.35,
          }}
        >
          {getAdviceText()}
        </p>
      )}
    </div>
  );
}

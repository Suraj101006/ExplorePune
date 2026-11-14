'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { RotateCcw, Home, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Explore Pune Runtime Boundary Caught Error:', error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 60px) 16px',
        backgroundColor: 'var(--bg, #f8fafc)',
        color: 'var(--ink, #0f172a)',
      }}
    >
      <div
        style={{
          maxWidth: 540,
          width: '100%',
          backgroundColor: 'var(--card, #ffffff)',
          borderRadius: 24,
          border: '1px solid var(--line, #e2e8f0)',
          padding: 'clamp(28px, 5vw, 40px)',
          textAlign: 'center',
          boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <BrandLogo size={52} withBadge />

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#dc2626',
          }}
        >
          <AlertTriangle size={24} />
        </div>

        <h1
          style={{
            fontSize: 'clamp(22px, 4vw, 28px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--ink, #0f172a)',
          }}
        >
          काहीतरी तांत्रिक अडचण आली
          <span style={{ display: 'block', fontSize: '0.65em', color: 'var(--muted, #64748b)', fontWeight: 600, marginTop: 4 }}>
            Something unexpected occurred on this trail
          </span>
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: 'var(--muted, #64748b)',
            lineHeight: 1.5,
          }}
        >
          काळजी करू नका! तुमचे सेव्ह केलेले डेटा सुरक्षित आहे. खाली दिलेल्या बटणावर क्लिक करून पुन्हा प्रयत्न करा किंवा मुख्य पानावर जा.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '11px 20px',
              borderRadius: 12,
              backgroundColor: 'var(--primary, #065f46)',
              color: '#ffffff',
              border: 'none',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(6, 95, 70, 0.25)',
            }}
          >
            <RotateCcw size={15} />
            <span>पुन्हा प्रयत्न करा (Try Again)</span>
          </button>

          <Link
            href="/"
            style={{
              padding: '11px 18px',
              borderRadius: 12,
              backgroundColor: 'var(--line-light, #f1f5f9)',
              color: 'var(--ink, #0f172a)',
              border: '1px solid var(--line, #e2e8f0)',
              textDecoration: 'none',
              fontSize: 13.5,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Home size={15} />
            <span>होमपेज</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

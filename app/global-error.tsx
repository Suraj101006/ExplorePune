'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ExplorePune] Fatal Root Application Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Explore Pune — Application Error</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: '90%',
            backgroundColor: '#1e293b',
            borderRadius: 20,
            border: '1px solid #334155',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              marginBottom: 16,
            }}
          >
            ⚠️
          </div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              margin: '0 0 8px',
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            काहीतरी तांत्रिक त्रुटी आली
            <span style={{ display: 'block', fontSize: 14, color: '#94a3b8', fontWeight: 600, marginTop: 4 }}>
              Critical Application Error
            </span>
          </h1>

          <p
            style={{
              fontSize: 13.5,
              color: '#cbd5e1',
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}
          >
            Explore Pune encountered an unexpected issue while loading the application shell. Your stored travel data is safe.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '11px 22px',
                borderRadius: 12,
                backgroundColor: '#ea580c',
                color: '#ffffff',
                border: 'none',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🔄 पुन्हा प्रयत्न करा (Try Again)
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/';
              }}
              style={{
                padding: '11px 20px',
                borderRadius: 12,
                backgroundColor: '#334155',
                color: '#f8fafc',
                border: '1px solid #475569',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🏠 मुख्यपृष्ठ (Home)
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

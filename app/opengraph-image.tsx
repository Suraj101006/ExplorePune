import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Explore Pune - Cultural Capital of Maharashtra';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 40%, #7c2d12 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '64px 80px',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(234, 88, 12, 0.3) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              background: '#ea580c',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '22px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            🚩 EXPLORE PUNE
          </div>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fdba74',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Official Heritage & Travel Portal
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: '54px',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: 0,
              maxWidth: '960px',
              letterSpacing: '-1px',
              color: '#fafaf9',
            }}
          >
            Historic Forts, Peshwa Wadas & Sacred Temples of Pune
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#d6d3d1',
              margin: 0,
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            Verified Timings • Ticket Fees • PMPML & Metro Transit • Multilingual Marathi & English
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '28px',
            fontSize: '20px',
            color: '#a8a29e',
          }}
        >
          <span style={{ color: '#fb923c', fontWeight: 700 }}>
            explore-pune-eosin.vercel.app
          </span>
          <span>106 Verified Pune Landmarks</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

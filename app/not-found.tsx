import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { Compass, MapPin, Route, Footprints, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
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
          maxWidth: 600,
          width: '100%',
          backgroundColor: 'var(--card, #ffffff)',
          borderRadius: 24,
          border: '1px solid var(--line, #e2e8f0)',
          padding: 'clamp(28px, 5vw, 44px)',
          textAlign: 'center',
          boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Subtle Watermark */}
        <div
          style={{
            position: 'absolute',
            right: -30,
            bottom: -30,
            opacity: 0.04,
            pointerEvents: 'none',
          }}
        >
          <Compass size={240} />
        </div>

        {/* Brand Logo & Error Pill */}
        <BrandLogo size={56} withBadge />

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 20,
            backgroundColor: 'rgba(234, 88, 12, 0.1)',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            color: '#c2410c',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <span>४०४ • दिशाभूल झाली</span>
          <span>•</span>
          <span>404 Not Found</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(26px, 5vw, 36px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--ink, #0f172a)',
            lineHeight: 1.2,
          }}
        >
          हा रस्ता सापडला नाही
          <span style={{ display: 'block', fontSize: '0.7em', color: 'var(--muted, #64748b)', fontWeight: 700, marginTop: 4 }}>
            Lost in the Sahyadri trails?
          </span>
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 14.5,
            color: 'var(--muted, #64748b)',
            lineHeight: 1.6,
            maxWidth: 460,
          }}
        >
          तुम्ही शोधत असलेले पान किंवा ठिकाण अस्तित्वात नाही किंवा हलवण्यात आले आहे. चला, सुरक्षित मार्गाने पुन्हा प्रवासाला सुरुवात करूया!
        </p>

        {/* Helpful Navigation Links Grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 10,
            marginTop: 8,
          }}
        >
          <Link
            href="/"
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              backgroundColor: 'var(--primary, #065f46)',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(6, 95, 70, 0.25)',
            }}
          >
            <Home size={15} />
            <span>होम (Home)</span>
          </Link>

          <Link
            href="/destinations"
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              backgroundColor: 'var(--line-light, #f1f5f9)',
              color: 'var(--ink, #0f172a)',
              border: '1px solid var(--line, #e2e8f0)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <MapPin size={15} color="#ea580c" />
            <span>ठिकाणे (Places)</span>
          </Link>

          <Link
            href="/journey"
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              backgroundColor: 'var(--line-light, #f1f5f9)',
              color: 'var(--ink, #0f172a)',
              border: '1px solid var(--line, #e2e8f0)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Footprints size={15} color="#7c3aed" />
            <span>माझी सफर</span>
          </Link>

          <Link
            href="/planner"
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              backgroundColor: 'var(--line-light, #f1f5f9)',
              color: 'var(--ink, #0f172a)',
              border: '1px solid var(--line, #e2e8f0)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Route size={15} color="#2563eb" />
            <span>प्लॅनर (Planner)</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

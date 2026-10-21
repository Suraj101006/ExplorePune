import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data, Verification & Open Source Credits | Explore Pune',
  description: 'How Explore Pune sources, verifies, and curates heritage places, temples, forts, and visitor intelligence across Pune.',
};

export default function AboutPage() {
  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
        <div className="hero-pill">
          <span>🛡️</span> Open Data & Transparency
        </div>
        <h1 style={{ fontSize: 34, margin: '6px 0 12px' }}>Where Our Data Comes From</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
          Explore Pune is built on transparent, community-verified data. While locations and basic
          categories can be imported from open geospatial maps, visitor details like hours and
          entry fees require careful local verification.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        {/* Tier Explanations */}
        <section className="panel">
          <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 16 }}>Reliability Labels</h2>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span className="tier verified" style={{ marginTop: 2 }}>
                Verified Details
              </span>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-secondary)' }}>
                Opening hours and ticket fees were checked directly against official government
                sources, heritage boards, or on-site venue boards.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span className="tier enriched" style={{ marginTop: 2 }}>
                Public Source Info
              </span>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-secondary)' }}>
                Contains detailed descriptions, history, or photos from Wikipedia or Wikimedia
                Commons with attribution. Specific visitor hours and ticket costs are not fully confirmed.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span className="tier" style={{ marginTop: 2 }}>
                Hours Unverified
              </span>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-secondary)' }}>
                Listed from open map data only. Please confirm timings and fees with the venue or
                local caretakers before making travel plans.
              </p>
            </div>
          </div>
        </section>

        {/* Credits Section */}
        <section className="panel">
          <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 14 }}>Open Credits & Licences</h2>
          <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14, color: 'var(--ink-secondary)', lineHeight: 1.8 }}>
            <li>
              <strong>Map Data:</strong> ©{' '}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
                OpenStreetMap contributors
              </a>
              , licensed under the Open Database Licence (ODbL).
            </li>
            <li>
              <strong>Descriptions:</strong> Text extracts from Wikipedia are available under CC BY-SA 4.0.
            </li>
            <li>
              <strong>Photographs:</strong> Community photos maintain their respective creator rights and Creative Commons licences.
            </li>
          </ul>
        </section>

        {/* Trip Planner Disclaimers */}
        <section className="panel">
          <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 10 }}>Trip Planner Algorithm</h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
            Our route builder calculates estimates using real straight-line coordinates scaled by
            a 1.3x Pune road detour factor. Because Pune city traffic fluctuates heavily around
            peak hours, treat planned timelines as a flexible foundation.
          </p>
        </section>

        {/* Privacy */}
        <section className="panel">
          <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 10 }}>Privacy & Data Ethics</h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
            Explore Pune respects user privacy. Your location inputs are processed in-memory for the
            duration of your itinerary request and are not stored. Chat queries are answered using
            our database records and never contain personal identifiers.
          </p>
        </section>
      </div>

      <p style={{ textAlign: 'center', marginTop: 24 }}>
        <Link href="/" className="btn outline">
          ← Return to Explore Pune
        </Link>
      </p>
    </div>
  </main>
);
}

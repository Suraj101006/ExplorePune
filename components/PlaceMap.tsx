'use client';

interface PlaceMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function PlaceMap({ latitude, longitude, name }: PlaceMapProps) {
  const lat = latitude || 18.5204;
  const lng = longitude || 73.8567;
  const delta = 0.012;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Interactive Map Embed */}
      <div
        style={{
          width: '100%',
          height: 320,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--line)',
          background: '#f8fafc',
          position: 'relative',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <iframe
          title={`Map of ${name}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={osmEmbedUrl}
        />
      </div>

      {/* Map Action Links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          fontSize: 13,
        }}
      >
        <span style={{ color: 'var(--muted)' }}>
          📍 GPS: <strong>{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</strong>
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ padding: '6px 14px', fontSize: 12, borderRadius: 999 }}
          >
            🧭 Directions on Google Maps ↗
          </a>
        </div>
      </div>
    </div>
  );
}

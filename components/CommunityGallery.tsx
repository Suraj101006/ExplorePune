'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/lib/LanguageContext';

interface PublicVisitPhoto {
  id: string;
  image_url: string;
  user_name: string;
  visited_at: string;
  notes?: string;
  created_at?: string;
}

export default function CommunityGallery({
  placeId,
  placeName,
}: {
  placeId: string;
  placeName: string;
}) {
  const { isMr } = useLanguage();
  const [photos, setPhotos] = useState<PublicVisitPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<PublicVisitPhoto | null>(null);

  const fetchPublicPhotos = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'visits'),
        where('place_id', '==', placeId),
        where('is_public', '==', true)
      );
      const snap = await getDocs(q);
      const list: PublicVisitPhoto[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      // Sort by visited_at or created_at descending
      list.sort((a, b) => (b.visited_at || b.created_at || '').localeCompare(a.visited_at || a.created_at || ''));
      setPhotos(list);
    } catch (err) {
      console.error('Error fetching community photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicPhotos();

    const handleLogged = (e: any) => {
      if (e.detail?.placeId === placeId) {
        fetchPublicPhotos();
      }
    };

    window.addEventListener('explore-pune-visit-logged', handleLogged);
    return () => window.removeEventListener('explore-pune-visit-logged', handleLogged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  return (
    <section className="panel" style={{ marginBottom: 28 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          borderBottom: '1px solid var(--line)',
          paddingBottom: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ fontSize: '19px', margin: 0, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📸</span>
            <span>{isMr ? 'पर्यटकांचे सार्वजनिक फोटो (Community Gallery)' : 'Visitor Community Gallery'}</span>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            {isMr
              ? `${placeName} ला भेट दिलेल्या प्रवाशांनी सार्वजनिक केलेले अस्सल फोटो`
              : `Authentic photos shared by travelers who completed their milestone visits to ${placeName}`}
          </p>
        </div>

        {photos.length > 0 && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--clay)',
              background: 'var(--primary-light)',
              padding: '4px 10px',
              borderRadius: 999,
              border: '1px solid var(--primary-border)',
            }}
          >
            {photos.length} {isMr ? 'सार्वजनिक फोटो' : 'Community Photos'}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
          ⏳ {isMr ? 'गॅलरी फोटो लोड होत आहेत…' : 'Loading community photos…'}
        </div>
      ) : photos.length === 0 ? (
        <div
          style={{
            padding: '32px 20px',
            textAlign: 'center',
            background: '#f8fafc',
            border: '1px dashed var(--line)',
            borderRadius: 'var(--radius)',
          }}
        >
          <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>📷</span>
          <h3 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--ink)' }}>
            {isMr ? 'अजून कोणताही सार्वजनिक फोटो नाही' : 'No Public Photos Yet'}
          </h3>
          <p style={{ margin: '0 auto 14px', maxWidth: '44ch', fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            {isMr
              ? 'या ऐतिहासिक स्थानाला भेट देणारे पहिले व्हा! "मी येथे गेलो होतो" वर क्लिक करून सार्वजनिक फोटो जोडा आणि यशोगाथा पदक अनलॉक करा.'
              : 'Be the first traveler to share a photo! Click "I\'ve Been Here" above, upload a picture, set privacy to Public, and complete your milestone.'}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {photos.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              style={{
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                background: '#ffffff',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 160, background: '#f1f5f9' }}>
                <img
                  src={item.image_url}
                  alt={`Photo by ${item.user_name}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    background: 'rgba(0,0,0,0.65)',
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  ✓ {isMr ? 'प्रमाणित भेट' : 'Verified Visit'}
                </span>
              </div>

              <div style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <strong style={{ fontSize: 12.5, color: 'var(--ink)' }}>
                    👤 {item.user_name}
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {item.visited_at}
                  </span>
                </div>

                {item.notes && (
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: 12,
                      color: 'var(--ink-secondary)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    💬 {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius)',
              maxWidth: 700,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ position: 'relative', width: '100%', maxHeight: '70vh', background: '#000', display: 'flex', justifyContent: 'center' }}>
              <img
                src={activePhoto.image_url}
                alt={`Full photo by ${activePhoto.user_name}`}
                style={{ maxHeight: '70vh', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
              />
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  fontSize: 16,
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                    👤 {activePhoto.user_name}
                  </strong>
                  <span
                    style={{
                      background: '#ecfdf5',
                      color: '#065f46',
                      border: '1px solid #a7f3d0',
                      borderRadius: 4,
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '1px 6px',
                    }}
                  >
                    ✓ {isMr ? 'यशोगाथा पूर्तता' : 'Milestone Check-in'}
                  </span>
                </div>
                {activePhoto.notes && (
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--ink-secondary)' }}>
                    💬 {activePhoto.notes}
                  </p>
                )}
              </div>

              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                📅 {isMr ? 'भेटीची तारीख:' : 'Visited:'} {activePhoto.visited_at}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

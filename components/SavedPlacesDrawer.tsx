'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { getSavedPlaces, toggleSavedPlace, clearSavedPlaces, SavedPlaceSummary } from '@/lib/savedPlaces';

export default function SavedPlacesDrawer() {
  const { isMr } = useLanguage();
  const [saved, setSaved] = useState<SavedPlaceSummary[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    // Initial load
    setSaved(getSavedPlaces());

    const handleUpdate = (e: any) => {
      setSaved(e.detail || getSavedPlaces());
    };

    window.addEventListener('explore-pune-saved-changed', handleUpdate);
    window.addEventListener('storage', () => setSaved(getSavedPlaces()));

    return () => {
      window.removeEventListener('explore-pune-saved-changed', handleUpdate);
      window.removeEventListener('storage', () => setSaved(getSavedPlaces()));
    };
  }, []);

  const handleRemove = (p: SavedPlaceSummary) => {
    toggleSavedPlace(p);
  };

  return (
    <>
      {/* Header Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="chip saved-chip-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          fontSize: '12.5px',
          cursor: 'pointer',
          background: saved.length > 0 ? '#fff1f2' : 'var(--card)',
          borderColor: saved.length > 0 ? '#fecdd3' : 'var(--line)',
          color: saved.length > 0 ? '#e11d48' : 'var(--ink-secondary)',
          fontWeight: 700,
          transition: 'all 0.15s ease',
        }}
        title={isMr ? 'माझी आवडती ठिकाणे' : 'My Saved Places'}
      >
        <Bookmark size={13} strokeWidth={2.2} fill={saved.length > 0 ? '#e11d48' : 'none'} />
        <span className="saved-chip-text hide-on-compact-desktop">{isMr ? 'जतन केलेली' : 'Saved'}</span>
        {saved.length > 0 && (
          <span
            style={{
              background: '#e11d48',
              color: '#ffffff',
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '999px',
              fontWeight: 800,
            }}
          >
            {saved.length}
          </span>
        )}
      </button>

      {/* Slide-over Backdrop & Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.15s ease',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#ffffff',
              height: '100%',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '18px', color: 'var(--ink)' }}>
                  ❤️ {isMr ? 'माझी आवडती ठिकाणे' : 'My Saved Places'}
                </h3>
                <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
                  {saved.length}{' '}
                  {isMr
                    ? saved.length === 1
                      ? 'ठिकाण जतन केले'
                      : 'ठिकाणे जतन केली'
                    : saved.length === 1
                    ? 'spot bookmarked'
                    : 'spots bookmarked'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="chip"
                style={{
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {saved.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <Bookmark size={40} strokeWidth={1.5} style={{ color: 'var(--muted)' }} />
                  </div>
                  <strong style={{ display: 'block', fontSize: '16px', color: 'var(--ink)', marginBottom: '6px' }}>
                    {isMr ? 'कोणतेही ठिकाण जतन केलेले नाही' : 'Your wishlist is empty'}
                  </strong>
                  <p style={{ fontSize: '13px', lineHeight: 1.5, margin: '0 0 20px' }}>
                    {isMr
                      ? 'कोणत्याही प्रेक्षणीय ठिकाणाच्या कार्डवरील ❤️ बटण दाबून ते येथे जतन करू शकता.'
                      : 'Click the heart icon on any landmark card to add it to your travel wishlist.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn outline"
                    style={{ fontSize: '13px', padding: '8px 18px' }}
                  >
                    {isMr ? 'ठिकाणे शोधा' : 'Explore Places'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {saved.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--line)',
                        background: '#f8fafc',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={item.image_url || '/images/places/shaniwar-wada.jpg'}
                        alt={item.name}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link
                          href={`/places/${item.slug || item.id}`}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--ink)',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {isMr && item.name_mr ? item.name_mr : item.name}
                        </Link>
                        {item.name_mr && (
                          <div style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {isMr ? item.name : item.name_mr}
                          </div>
                        )}
                        <span
                          style={{
                            fontSize: '11px',
                            color: 'var(--clay)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.category_slug || item.category || 'Spot'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        style={{
                          background: 'transparent',
                          border: 0,
                          cursor: 'pointer',
                          color: '#94a3b8',
                          fontSize: '16px',
                          padding: '4px',
                        }}
                        title="Remove from saved"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            {saved.length > 0 && (
              <div
                style={{
                  padding: '16px 20px',
                  borderTop: '1px solid var(--line)',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Link
                  href="/planner"
                  onClick={() => setIsOpen(false)}
                  className="btn"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                >
                  🗺️ {isMr ? 'या ठिकाणांची सहल आखा' : 'Plan Trip with Saved Places'}
                </Link>

                <button
                  type="button"
                  onClick={clearSavedPlaces}
                  style={{
                    background: 'transparent',
                    border: 0,
                    color: 'var(--muted)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {isMr ? 'सर्व यादी रिकामी करा' : 'Clear All Saved Places'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

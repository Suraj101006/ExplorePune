'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { getSavedPlaces, toggleSavedPlace, SavedPlaceSummary } from '@/lib/savedPlaces';
import { Bookmark, ExternalLink, Plus, Trash2 } from 'lucide-react';

interface SavedDestinationsTabProps {
  onPlanWithPlace: (place: SavedPlaceSummary) => void;
}

export default function SavedDestinationsTab({ onPlanWithPlace }: SavedDestinationsTabProps) {
  const { isMr } = useLanguage();
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaceSummary[]>([]);

  const refreshList = () => {
    setSavedPlaces(getSavedPlaces());
  };

  useEffect(() => {
    refreshList();
    const handleSync = () => refreshList();
    window.addEventListener('explore-pune-saved-changed', handleSync);
    return () => window.removeEventListener('explore-pune-saved-changed', handleSync);
  }, []);

  const handleRemove = (place: SavedPlaceSummary) => {
    toggleSavedPlace(place);
    refreshList();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
            {isMr ? 'जतन केलेली आवडती ठिकाणे' : 'Saved Pune Destinations'}
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            {isMr ? 'भविष्यातील सहलीसाठी तुम्ही बुकमार्क केलेली खास ठिकाणे.' : 'Destinations you have bookmarked across Explore Pune for upcoming trips.'}
          </p>
        </div>
      </div>

      {savedPlaces.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: 18,
            background: '#ffffff',
            border: '1.5px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#fff7ed',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bookmark size={26} />
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              {isMr ? 'अद्याप कोणतेही ठिकाण जतन केलेले नाही' : 'No destinations bookmarked yet'}
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', maxWidth: 400 }}>
              {isMr
                ? 'पुण्यातील प्रेक्षणीय ठिकाणे एक्सप्लोर करताना बुकमार्क आयकॉनवर क्लिक करून येथे जोडा.'
                : 'Browse places across Pune and tap the bookmark ribbon to save them here for easy journey planning.'}
            </p>
          </div>
          <Link
            href="/"
            style={{
              padding: '9px 18px',
              borderRadius: 10,
              background: '#0f172a',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              marginTop: 4,
            }}
          >
            {isMr ? 'पुणे ठिकाणे एक्सप्लोर करा' : 'Explore Pune Places'}
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 18,
          }}
        >
          {savedPlaces.map((place) => (
            <div
              key={place.id}
              style={{
                borderRadius: 16,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ position: 'relative', height: 160, background: '#0f172a' }}>
                <img
                  src={place.image_url || '/images/places/shaniwar-wada.jpg'}
                  alt={place.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemove(place)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: 'rgba(0, 0, 0, 0.65)',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Remove Bookmark"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                    {isMr && place.name_mr ? place.name_mr : place.name}
                  </h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {place.category_slug || place.category || 'Historical Site'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                  <button
                    type="button"
                    onClick={() => onPlanWithPlace(place)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: 8,
                      background: '#ea580c',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    <span>{isMr ? 'सफरीत जोडा' : 'Add to Journey'}</span>
                  </button>

                  <Link
                    href={`/places/${place.slug}`}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>{isMr ? 'माहिती' : 'Details'}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';
import {
  compressUploadedPhoto,
  saveCustomPlacePhotos,
  deleteCustomPhoto,
  savePhotoCaption,
  getAllCustomPhotosList,
} from '@/lib/journeyReel';
import ModalPortal from '@/components/ModalPortal';
import {
  Camera,
  Upload,
  Trash2,
  Edit2,
  X,
  Eye,
  Sparkles,
  MapPin,
} from 'lucide-react';

interface MemoryGalleryTabProps {
  onOpenCreateReel: () => void;
  userId?: string | null;
}

export default function MemoryGalleryTab({ onOpenCreateReel, userId: _userId }: MemoryGalleryTabProps) {
  const { isMr } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photos, setPhotos] = useState<Array<{ photoUrl: string; placeId: string; caption?: string }>>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(ALL_STRUCTURED_PLACES[0]?.id || 'shaniwar-wada');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Lightbox preview modal state
  const [previewPhoto, setPreviewPhoto] = useState<{ photoUrl: string; placeId: string; caption?: string } | null>(null);

  // Caption editing state
  const [editingPhotoUrl, setEditingPhotoUrl] = useState<string | null>(null);
  const [captionDraft, setCaptionDraft] = useState('');

  // Delete confirmation state
  const [photoToDelete, setPhotoToDelete] = useState<{ photoUrl: string; placeId: string } | null>(null);

  const refreshPhotos = () => {
    setPhotos(getAllCustomPhotosList());
  };

  useEffect(() => {
    refreshPhotos();
    const handleSync = () => refreshPhotos();
    window.addEventListener('explore-pune-photos-changed', handleSync);
    window.addEventListener('explore-pune-captions-changed', handleSync);

    return () => {
      window.removeEventListener('explore-pune-photos-changed', handleSync);
      window.removeEventListener('explore-pune-captions-changed', handleSync);
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressUploadedPhoto(files[i]);
        newUrls.push(compressed);
      }

      saveCustomPlacePhotos(selectedPlaceId, newUrls);
      refreshPhotos();
      setUploadSuccess(isMr ? `${newUrls.length} नवीन आठवणी यशस्वीरित्या जोडल्या!` : `${newUrls.length} travel photos uploaded successfully!`);
      setTimeout(() => setUploadSuccess(null), 3500);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveCaption = (photoUrl: string) => {
    savePhotoCaption(photoUrl, captionDraft);
    setEditingPhotoUrl(null);
    refreshPhotos();
  };

  const handleConfirmDelete = () => {
    if (!photoToDelete) return;
    deleteCustomPhoto(photoToDelete.photoUrl, photoToDelete.placeId);
    setPhotoToDelete(null);
    if (previewPhoto?.photoUrl === photoToDelete.photoUrl) setPreviewPhoto(null);
    refreshPhotos();
  };

  const getPlaceName = (placeId: string) => {
    const match = ALL_STRUCTURED_PLACES.find((p) => p.id === placeId || p.slug === placeId);
    if (!match) return placeId;
    return isMr && match.name_mr ? match.name_mr : match.name;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Upload & Action Card */}
      <div
        style={{
          padding: '22px 24px',
          borderRadius: 18,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              {isMr ? 'वैयक्तिक आठवणी गॅलरी' : 'Personal Memory Gallery'}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              {isMr
                ? 'तुमच्या पुणे प्रवासातील अस्सल फोटो आणि आठवणी जोडा, कॅप्शन लिहा व रीलमध्ये वापरा.'
                : 'Upload authentic travel photos, document personal notes, and feature them in your reels.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreateReel}
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.28)',
            }}
          >
            <Sparkles size={16} />
            <span>{isMr ? 'आठवणींतून रील बनवा' : 'Create Reel from Photos'}</span>
          </button>
        </div>

        {/* Upload bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px',
            borderRadius: 12,
            background: '#f8fafc',
            border: '1.5px dashed #cbd5e1',
          }}
        >
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              {isMr ? 'ठिकाण निवडा (ज्या ठिकाणी फोटो काढला):' : 'Select Pune Destination for Upload:'}
            </label>
            <select
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                background: '#ffffff',
                color: '#0f172a',
              }}
            >
              {ALL_STRUCTURED_PLACES.map((p) => (
                <option key={p.id} value={p.id}>
                  {isMr && p.name_mr ? p.name_mr : p.name} ({p.category_slug || 'pune'})
                </option>
              ))}
            </select>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/webp,image/heic"
            multiple
            onChange={handleFileUpload}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: uploading ? 'wait' : 'pointer',
              marginTop: 'auto',
            }}
          >
            <Upload size={16} />
            <span>{uploading ? (isMr ? 'अपलोड होत आहे…' : 'Uploading…') : (isMr ? '+ फोटो अपलोड करा (Max 15MB)' : '+ Upload Photos (Max 15MB)')}</span>
          </button>
        </div>

        {/* Feedback messages */}
        {uploadError && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: '#fee2e2', color: '#b91c1c', fontSize: 12.5, fontWeight: 600 }}>
            ⚠️ {uploadError}
          </div>
        )}
        {uploadSuccess && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: '#dcfce7', color: '#15803d', fontSize: 12.5, fontWeight: 600 }}>
            ✓ {uploadSuccess}
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {photos.length === 0 ? (
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
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#fff7ed',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Camera size={28} />
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              {isMr ? 'अजून कोणतीही आठवण जोडली नाही' : 'No personal memories uploaded yet'}
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', maxWidth: 420 }}>
              {isMr
                ? 'सिंहगड, शनिवार वाडा किंवा आपल्या पुणे सफरीतील सुंदर क्षण येथे जोडा आणि त्यांचे रील तयार करा.'
                : 'Upload photos from your Pune journeys above to build your personal travel archive.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '9px 18px',
              borderRadius: 10,
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 6,
            }}
          >
            {isMr ? '+ पहिला फोटो जोडा' : '+ Upload Your First Photo'}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 18,
          }}
        >
          {photos.map((item, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 16,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Photo Preview */}
              <div
                style={{
                  position: 'relative',
                  height: 190,
                  width: '100%',
                  background: '#0f172a',
                  cursor: 'pointer',
                }}
                onClick={() => setPreviewPhoto(item)}
              >
                <img
                  src={item.photoUrl}
                  alt={getPlaceName(item.placeId)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <MapPin size={11} />
                  <span>{getPlaceName(item.placeId)}</span>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Eye size={12} /> {isMr ? 'पहा' : 'View'}
                </div>
              </div>

              {/* Caption and Actions */}
              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                {editingPhotoUrl === item.photoUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <input
                      type="text"
                      value={captionDraft}
                      onChange={(e) => setCaptionDraft(e.target.value)}
                      placeholder={isMr ? 'कॅप्शन लिहा…' : 'Add a caption…'}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: '1.5px solid #ea580c',
                        fontSize: 12.5,
                        boxSizing: 'border-box',
                      }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => setEditingPhotoUrl(null)}
                        style={{ padding: '4px 8px', borderRadius: 6, background: '#f1f5f9', border: 'none', fontSize: 11.5, cursor: 'pointer' }}
                      >
                        {isMr ? 'रद्द' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveCaption(item.photoUrl)}
                        style={{ padding: '4px 10px', borderRadius: 6, background: '#16a34a', color: '#ffffff', border: 'none', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {isMr ? 'सेव्ह ✓' : 'Save ✓'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <p style={{ margin: 0, fontSize: 12.5, color: item.caption ? '#0f172a' : '#94a3b8', fontStyle: item.caption ? 'normal' : 'italic' }}>
                      {item.caption || (isMr ? 'कोणतेही कॅप्शन नाही' : 'No caption added')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPhotoUrl(item.photoUrl);
                        setCaptionDraft(item.caption || '');
                      }}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                      title="Edit Caption"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                  <button
                    type="button"
                    onClick={() => setPhotoToDelete(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      padding: '2px 4px',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>{isMr ? 'हटवा' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {previewPhoto && (
        <ModalPortal isOpen={Boolean(previewPhoto)} onClose={() => setPreviewPhoto(null)}>
          <div
            className="journey-reel-backdrop"
            role="dialog"
            aria-modal="true"
            onClick={() => setPreviewPhoto(null)}
          >
            <div
              style={{
                position: 'relative',
                maxWidth: 'min(92vw, 900px)',
                maxHeight: '90vh',
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                style={{
                  position: 'absolute',
                  top: -44,
                  right: 0,
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>

              <img
                src={previewPhoto.photoUrl}
                alt={getPlaceName(previewPhoto.placeId)}
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: 14,
                  boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                }}
              />

              <div
                style={{
                  marginTop: 12,
                  padding: '10px 18px',
                  borderRadius: 12,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  textAlign: 'center',
                }}
              >
                <strong style={{ display: 'block', fontSize: 15 }}>
                  📍 {getPlaceName(previewPhoto.placeId)}
                </strong>
                {previewPhoto.caption && (
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#e2e8f0' }}>
                    &ldquo;{previewPhoto.caption}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Delete Confirmation Modal */}
      {photoToDelete && (
        <ModalPortal isOpen={Boolean(photoToDelete)} onClose={() => setPhotoToDelete(null)}>
          <div
            className="journey-reel-backdrop"
            role="dialog"
            aria-modal="true"
            onClick={() => setPhotoToDelete(null)}
          >
            <div
              style={{
                width: 'min(92vw, 400px)',
                background: '#ffffff',
                borderRadius: 18,
                padding: '24px',
                margin: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                    {isMr ? 'फोटो हटवायचा आहे का?' : 'Delete Travel Photo?'}
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    {isMr ? 'हा फोटो तुमच्या आठवणी गॅलरीतून कायमचा हटवला जाईल.' : 'This will remove the photo from your memory gallery.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setPhotoToDelete(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'होय, हटवा' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

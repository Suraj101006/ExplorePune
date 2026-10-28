'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ModalPortal from '@/components/ModalPortal';
import {
  Camera,
  Upload,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import {
  validateImageFile,
  cropAndCompressAvatar,
  getUserInitials,
} from '@/lib/avatarUtils';

interface ProfileAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string | null;
  name?: string | null;
  email?: string | null;
  onSavePhoto: (dataUrl: string) => Promise<void>;
  onRemovePhoto: () => Promise<void>;
}

type ModalView = 'menu' | 'crop' | 'confirm-remove';

export default function ProfileAvatarModal({
  isOpen,
  onClose,
  currentPhotoUrl,
  name,
  email,
  onSavePhoto,
  onRemovePhoto,
}: ProfileAvatarModalProps) {
  const { isMr } = useLanguage();

  const [view, setView] = useState<ModalView>('menu');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Selected file image for cropping
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  // Crop / Pan / Zoom states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  const hasPhoto = Boolean(currentPhotoUrl && currentPhotoUrl.trim());
  const initials = getUserInitials(name, email);

  // Reset state whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setView('menu');
      setErrorMsg(null);
      setIsSaving(false);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setSelectedImageSrc(null);
      setImageElement(null);
    } else {
      if (selectedImageSrc && selectedImageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImageSrc);
      }
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  // File selection & validation
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const validation = await validateImageFile(file);

    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid image file.');
      // Reset input so same file can be retried
      e.target.value = '';
      return;
    }

    // Create object URL and load image element
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageElement(img);
      setSelectedImageSrc(objectUrl);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setView('crop');
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setErrorMsg(isMr ? 'प्रतिमा लोड करता आली नाही.' : 'Unable to load image.');
    };
    img.src = objectUrl;

    // Reset input
    e.target.value = '';
  };

  // Mouse / Touch Drag Handlers for Panning
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    },
    [isDragging]
  );

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Save Cropped Image
  const handleSaveCrop = async () => {
    if (!imageElement || !cropContainerRef.current) return;
    setIsSaving(true);
    setErrorMsg(null);

    try {
      const container = cropContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Circular guide diameter
      const guideSize = 240; // match CSS width/height
      const guideLeft = (containerWidth - guideSize) / 2;
      const guideTop = (containerHeight - guideSize) / 2;

      // Natural image dimensions
      const naturalW = imageElement.naturalWidth;
      const naturalH = imageElement.naturalHeight;

      // Base display scale so image covers or fits inside container
      const baseScale = Math.max(containerWidth / naturalW, containerHeight / naturalH);
      const effectiveScale = baseScale * zoom;

      const renderedW = naturalW * effectiveScale;
      const renderedH = naturalH * effectiveScale;

      // Image top-left in container coords
      const imgLeft = (containerWidth - renderedW) / 2 + pan.x;
      const imgTop = (containerHeight - renderedH) / 2 + pan.y;

      // Guide offset relative to rendered image
      const cropXOnRendered = guideLeft - imgLeft;
      const cropYOnRendered = guideTop - imgTop;

      // Convert from rendered pixels back to original image pixels
      const cropX = Math.max(0, cropXOnRendered / effectiveScale);
      const cropY = Math.max(0, cropYOnRendered / effectiveScale);
      const cropSize = guideSize / effectiveScale;

      const croppedDataUrl = await cropAndCompressAvatar(
        imageElement,
        {
          x: cropX,
          y: cropY,
          size: cropSize,
        },
        400,
        0.88
      );

      await onSavePhoto(croppedDataUrl);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save cropped image.');
    } finally {
      setIsSaving(false);
    }
  };

  // Remove Photo Handler
  const handleConfirmRemove = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await onRemovePhoto();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove photo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen} onClose={!isSaving ? onClose : undefined}>
      <div
        className="avatar-modal-backdrop"
      onClick={() => {
        if (!isSaving) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-modal-title"
    >
      <div
        className="avatar-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileSelected}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="user"
          style={{ display: 'none' }}
          onChange={handleFileSelected}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📸</span>
            <h3
              id="avatar-modal-title"
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 800,
                color: 'var(--ink)',
              }}
            >
              {view === 'menu' && (isMr ? 'प्रोफाईल फोटो पर्याय' : 'Profile Photo')}
              {view === 'crop' && (isMr ? 'फोटो क्रॉप व सेट करा' : 'Crop & Position Photo')}
              {view === 'confirm-remove' && (isMr ? 'फोटो हटवा' : 'Remove Profile Photo')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              color: 'var(--muted)',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 16px',
              background: '#fef2f2',
              borderBottom: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            role="alert"
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 1: UPLOAD MENU / ACTION SHEET                               */}
        {/* ================================================================= */}
        {view === 'menu' && (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Current Avatar Preview with Initials Fallback */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 18px',
                background: 'var(--line-light)',
                borderRadius: 14,
                border: '1px solid var(--line)',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '2px solid #ffffff',
                }}
              >
                {hasPhoto ? (
                  <img
                    src={currentPhotoUrl!}
                    alt="Current profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="avatar-initials-badge" style={{ fontSize: 22 }}>
                    {initials}
                  </div>
                )}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong
                  style={{
                    display: 'block',
                    fontSize: 15,
                    color: 'var(--ink)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {name || (isMr ? 'पुणे एक्सप्लोरर' : 'Pune Explorer')}
                </strong>
                <span
                  style={{
                    fontSize: 12.5,
                    color: 'var(--muted)',
                    display: 'block',
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {email || (isMr ? 'सदस्य खाते' : 'Member Account')}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: hasPhoto ? 'var(--primary)' : 'var(--muted)',
                    fontWeight: 600,
                    marginTop: 4,
                    display: 'inline-block',
                  }}
                >
                  {hasPhoto
                    ? (isMr ? '✓ फोटो सेट केला आहे' : '✓ Custom photo active')
                    : (isMr ? 'आद्याक्षरे दाखवत आहे' : 'Initials active')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Upload Photo */}
              <button
                type="button"
                className="avatar-modal-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Upload size={18} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)' }}>
                    {isMr ? 'फोटो अपलोड करा' : 'Upload Photo'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {isMr ? 'गॅलरीतून निवडा (JPG, PNG, WebP • कमाल 5 MB)' : 'Choose from gallery (JPG, PNG, WebP • Max 5 MB)'}
                  </div>
                </div>
              </button>

              {/* Take Photo (Mobile / Web Camera) */}
              <button
                type="button"
                className="avatar-modal-btn"
                onClick={() => cameraInputRef.current?.click()}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'var(--amber-bg)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Camera size={18} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)' }}>
                    {isMr ? 'फोटो काढा' : 'Take Photo'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {isMr ? 'डिव्हाइस कॅमेऱ्याने थेट फोटो काढा' : 'Use your mobile/device camera'}
                  </div>
                </div>
              </button>

              {/* Remove Photo (Only shown if photo is set) */}
              {hasPhoto && (
                <button
                  type="button"
                  className="avatar-modal-btn danger"
                  onClick={() => setView('confirm-remove')}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: '#fee2e2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={18} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#dc2626' }}>
                      {isMr ? 'फोटो हटवा' : 'Remove Photo'}
                    </div>
                    <div style={{ fontSize: 12, color: '#991b1b', marginTop: 2 }}>
                      {isMr ? 'पुन्हा नावाचे आद्याक्षरे वापरा' : 'Revert back to your initials avatar'}
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Cancel Button */}
            <div style={{ paddingTop: 4 }}>
              <button
                type="button"
                onClick={onClose}
                className="btn outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: CROP & REPOSITION INTERFACE                               */}
        {/* ================================================================= */}
        {view === 'crop' && selectedImageSrc && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Interactive Viewport */}
            <div
              ref={cropContainerRef}
              className="avatar-crop-container"
              onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={(e) => {
                if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={handlePointerUp}
            >
              {/* Underlying Image */}
              <img
                src={selectedImageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  pointerEvents: 'none',
                  transition: isDragging ? 'none' : 'transform 100ms ease-out',
                }}
              />

              {/* 1:1 Circular Crop Guide */}
              <div className="avatar-crop-circular-guide" />

              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 14,
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: 11.5,
                  padding: '4px 10px',
                  borderRadius: 20,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>✋ {isMr ? 'मध्यभागी करण्यासाठी ड्रॅग करा' : 'Drag to reposition'}</span>
              </div>
            </div>

            {/* Crop Controls & Preview */}
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Zoom Slider & Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--line-light)',
                  padding: '8px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--line)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, Number((z - 0.15).toFixed(2))))}
                  disabled={zoom <= 1}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: zoom <= 1 ? 'not-allowed' : 'pointer',
                    color: zoom <= 1 ? 'var(--muted)' : 'var(--ink)',
                    padding: 4,
                  }}
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>

                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
                  aria-label="Zoom photo"
                />

                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, Number((z + 0.15).toFixed(2))))}
                  disabled={zoom >= 3}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: zoom >= 3 ? 'not-allowed' : 'pointer',
                    color: zoom >= 3 ? 'var(--muted)' : 'var(--ink)',
                    padding: 4,
                  }}
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--line)',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  title="Reset Position & Zoom"
                >
                  <RotateCcw size={12} />
                  <span>{isMr ? 'रिसेट' : 'Reset'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setView('menu')}
                  disabled={isSaving}
                  className="btn outline"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {isMr ? 'मागे जा' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveCrop}
                  disabled={isSaving}
                  className="btn"
                  style={{
                    flex: 1.4,
                    justifyContent: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{isMr ? 'जतन करत आहे…' : 'Saving…'}</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} strokeWidth={2.4} />
                      <span>{isMr ? 'फोटो जतन करा' : 'Save Photo'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 3: CONFIRM REMOVE PHOTO                                     */}
        {/* ================================================================= */}
        {view === 'confirm-remove' && (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <Trash2 size={24} strokeWidth={2.2} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: 'var(--ink)' }}>
                {isMr ? 'प्रोफाईल फोटो हटवायचा आहे का?' : 'Remove your profile photo?'}
              </h4>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                {isMr
                  ? 'तुमचा कस्टम फोटो हटवला जाईल आणि तुमच्या नावाची आद्याक्षरे (उदा. ' + initials + ') दिसतील.'
                  : 'Your custom profile photo will be removed and your initials (' + initials + ') will be displayed instead.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setView('menu')}
                disabled={isSaving}
                className="btn outline"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                disabled={isSaving}
                className="btn"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  background: '#dc2626',
                  borderColor: '#dc2626',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{isMr ? 'हटवत आहे…' : 'Removing…'}</span>
                  </>
                ) : (
                  <span>{isMr ? 'फोटो हटवा' : 'Remove'}</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </ModalPortal>
  );
}

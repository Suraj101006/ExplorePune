'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Check, AlertCircle, Camera, Search, ShieldCheck, PenSquare } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import {
  CommunityPost,
  CommunityPostType,
  POST_TYPE_META,
  createCommunityPost,
} from '@/lib/communityStorage';
import { ALL_STRUCTURED_PLACES, StructuredPlace } from '@/lib/chatKnowledgeEngine';
import { compressImageFile } from '@/lib/imageUtils';
import { validateCommunityImageUpload } from '@/lib/communityModeration';
import { hasAcceptedCommunityGuidelines } from '@/lib/userSafety';
import CommunityGuidelinesModal from '@/components/CommunityGuidelinesModal';

interface CommunityPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (post: CommunityPost) => void;
  initialPlaceId?: string;
  initialPlaceSlug?: string;
}

export default function CommunityPostModal({
  isOpen,
  onClose,
  onPostCreated,
  initialPlaceId,
  initialPlaceSlug,
}: CommunityPostModalProps) {
  const { isMr } = useLanguage();
  const { user } = useAuth();

  const [hasAgreed, setHasAgreed] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const [postType, setPostType] = useState<CommunityPostType>('experience');
  const [selectedPlace, setSelectedPlace] = useState<StructuredPlace | null>(null);
  const [placeSearch, setPlaceSearch] = useState('');
  const [isPlaceDropdownOpen, setIsPlaceDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check guidelines acceptance on open
  useEffect(() => {
    if (isOpen) {
      const accepted = hasAcceptedCommunityGuidelines(user?.uid);
      setHasAgreed(accepted);
      if (!accepted) {
        setShowGuidelines(true);
      }
    }
  }, [isOpen, user]);

  // Pre-fill user profile info
  useEffect(() => {
    if (user?.displayName) {
      setAuthorName(user.displayName);
    } else if (user?.email) {
      setAuthorName(user.email.split('@')[0]);
    } else if (!authorName) {
      setAuthorName(isMr ? 'पुणे पर्यटक' : 'Pune Explorer');
    }
  }, [user, isMr, authorName]);

  // Pre-select place if passed
  useEffect(() => {
    if (initialPlaceId || initialPlaceSlug) {
      const match = ALL_STRUCTURED_PLACES.find(
        (p) =>
          p.id === initialPlaceId ||
          p.slug === initialPlaceSlug ||
          p.slug === initialPlaceId
      );
      if (match) {
        setSelectedPlace(match);
      }
    }
  }, [initialPlaceId, initialPlaceSlug]);

  // Reset form when modal closes
  const handleClose = () => {
    setTitle('');
    setContent('');
    setImages([]);
    setErrorMsg('');
    setImageError('');
    onClose();
  };

  // Filtered places for place selector
  const filteredPlaces = ALL_STRUCTURED_PLACES.filter((p) => {
    const q = placeSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.name_mr && p.name_mr.toLowerCase().includes(q)) ||
      p.slug.includes(q)
    );
  }).slice(0, 15);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 3) {
      setImageError(isMr ? 'जास्तीत जास्त ३ छायाचित्रे जोडू शकता.' : 'You can attach up to 3 photos.');
      return;
    }

    const file = files[0];
    const imgValidation = validateCommunityImageUpload(file);
    if (!imgValidation.valid) {
      setImageError(isMr ? (imgValidation.errorMr || 'अवैध छायाचित्र.') : (imgValidation.errorEn || 'Invalid image.'));
      return;
    }

    try {
      const compressed = await compressImageFile(file, 900, 0.8);
      setImages((prev) => [...prev, compressed]);
    } catch {
      // Fallback to FileReader
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedPlace) {
      setErrorMsg(isMr ? 'कृपया पुण्यातील ठिकाण निवडा.' : 'Please select a Pune destination.');
      return;
    }

    if (!title.trim() || title.trim().length < 5) {
      setErrorMsg(isMr ? 'शीर्षक किमान ५ अक्षरांचे असावे.' : 'Title must be at least 5 characters.');
      return;
    }

    if (!content.trim() || content.trim().length < 20) {
      setErrorMsg(isMr ? 'वर्णन किमान २० अक्षरांचे असावे.' : 'Please write at least 20 characters of detail.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newPost = createCommunityPost({
        userId: user?.uid || `guest-${Date.now()}`,
        authorName: authorName.trim() || (isMr ? 'पुणे पर्यटक' : 'Pune Explorer'),
        authorAvatar:
          user?.photoURL ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isVerifiedUser: Boolean(user),
        isExplorePuneVerified: false,
        placeId: selectedPlace.id || selectedPlace.slug,
        placeSlug: selectedPlace.slug,
        placeName: selectedPlace.name,
        placeNameMr: selectedPlace.name_mr,
        categorySlug: selectedPlace.category_slug || selectedPlace.category || 'heritage',
        categoryName: selectedPlace.category || 'Pune Destination',
        categoryNameMr: selectedPlace.category || 'पुणे स्थळ',
        postType,
        title: title.trim(),
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
        tags: [selectedPlace.name.replace(/\s+/g, ''), postType],
      });

      if (onPostCreated) {
        onPostCreated(newPost);
      }

      if (newPost.status === 'review') {
        setInfoMsg(
          isMr
            ? 'तुमची पोस्ट सुरक्षितता पुनरावलोकनासाठी पाठवली आहे. मॉडेरेटरने तपासल्यानंतर ती लगेच प्रकाशित होईल.'
            : 'Your post was submitted for community safety review and will appear once verified by moderators.'
        );
        setTimeout(() => {
          handleClose();
        }, 2200);
      } else {
        handleClose();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (!hasAgreed && showGuidelines) {
    return (
      <CommunityGuidelinesModal
        isOpen={showGuidelines}
        onClose={handleClose}
        userId={user?.uid}
        onAccepted={() => {
          setHasAgreed(true);
          setShowGuidelines(false);
        }}
      />
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '90vh',
          margin: 'auto',
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PenSquare size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isMr ? 'पुणे समुदाय अनुभव' : 'Explore Pune Community'}
              </div>
              <h2 id="community-modal-title" style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isMr ? 'पुणे समुदायात अनुभव शेअर करा' : 'Share with Pune Community'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {errorMsg && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                padding: '10px 14px',
                color: '#991b1b',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: 10,
                padding: '10px 14px',
                color: '#047857',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Check size={16} />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Safety & Guidelines Notice Banner */}
          <div
            style={{
              background: 'rgba(194, 65, 12, 0.08)',
              border: '1px solid rgba(194, 65, 12, 0.2)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 12.5,
              color: 'var(--brand-terracotta, #c2410c)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              lineHeight: 1.4,
            }}
          >
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>
              {isMr
                ? 'आदरयुक्त व्हा. व्यक्तींवर नव्हे तर ठिकाणे व प्रवासावर चर्चा करा. फोन नंबर किंवा खाजगी माहिती टाळा.'
                : 'Be respectful. Discuss places & travel experiences, not people. Never share private phone numbers or contact details.'}
            </span>
          </div>

          {/* Author Display Name (Rule 3: No Anonymous Posting) */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 700,
                color: '#334155',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {isMr ? 'सार्वजनिक नाव (निनावी पोस्टिंग बंद आहे)' : 'Display Name (No Anonymous Posting)'}
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={isMr ? 'तुमचे नाव (उदा. सुरज ढोक)' : 'Your display name (e.g. Suraj Dhok)'}
              required
              maxLength={50}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13.5,
                background: '#ffffff',
                color: '#0f172a',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Post Type Selector */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isMr ? 'प्रकार (Post Type)' : 'Post Type'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(Object.keys(POST_TYPE_META) as CommunityPostType[]).map((type) => {
                const meta = POST_TYPE_META[type];
                const isSelected = postType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPostType(type)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      border: isSelected ? `2px solid ${meta.color}` : '1px solid #cbd5e1',
                      background: isSelected ? meta.bg : '#ffffff',
                      color: isSelected ? meta.color : '#475569',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{meta.icon}</span>
                    <span>{isMr ? meta.labelMr : meta.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Place Selector (Mandatory for place association) */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              📍 {isMr ? 'पुण्यातील ठिकाण निवडा *' : 'Pune Place (Mandatory) *'}
            </label>

            {selectedPlace ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#ecfdf5',
                  border: '1.5px solid #10b981',
                  borderRadius: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📍</span>
                  <strong style={{ fontSize: 13.5, color: '#065f46' }}>
                    {isMr && selectedPlace.name_mr ? selectedPlace.name_mr : selectedPlace.name}
                  </strong>
                  <span style={{ fontSize: 11, color: '#047857' }}>
                    ({selectedPlace.category})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlace(null);
                    setIsPlaceDropdownOpen(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {isMr ? 'बदला' : 'Change'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ position: 'relative' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input
                    type="text"
                    value={placeSearch}
                    onChange={(e) => {
                      setPlaceSearch(e.target.value);
                      setIsPlaceDropdownOpen(true);
                    }}
                    onFocus={() => setIsPlaceDropdownOpen(true)}
                    placeholder={isMr ? 'उदा. सिंहगड, शनिवार वाडा, दगडूशेठ…' : 'Search destination (e.g. Sinhagad, Shaniwar Wada…)'}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13.5,
                      outline: 'none',
                    }}
                  />
                </div>

                {isPlaceDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: 220,
                      overflowY: 'auto',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 10,
                      marginTop: 4,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      zIndex: 10,
                    }}
                  >
                    {filteredPlaces.map((p) => (
                      <button
                        key={p.id || p.slug}
                        type="button"
                        onClick={() => {
                          setSelectedPlace(p);
                          setIsPlaceDropdownOpen(false);
                          setPlaceSearch('');
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '9px 14px',
                          border: 'none',
                          borderBottom: '1px solid #f1f5f9',
                          background: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: 13,
                        }}
                      >
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                          {isMr && p.name_mr ? p.name_mr : p.name}
                        </span>
                        <span style={{ fontSize: 11, color: '#64748b' }}>{p.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isMr ? 'शीर्षक *' : 'Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isMr ? 'उदा. सिंहगड सकाळची चढाई आणि पार्किंगचा अनुभव' : 'e.g. Sinhagad morning trek & parking advice'}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                fontSize: 13.5,
                outline: 'none',
              }}
            />
          </div>

          {/* Content Description */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isMr ? 'तुमचा अनुभव / सल्ला सविस्तर लिहा *' : 'Your Experience / Travel Advice *'}
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isMr
                  ? 'इतर प्रवाशांना मदत होईल अशी उपयुक्त माहिती लिहा (उदा. भेट देण्याची योग्य वेळ, गर्दी, तिकीट, खाणे, पार्किंग इ.)'
                  : 'Share helpful information for visitors (e.g. best timing, crowd, ticketing, food recommendations, transport, parking…)'
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                fontSize: 13.5,
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Author Name */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              👤 {isMr ? 'लेखकाचे नाव' : 'Your Display Name'}
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                fontSize: 13.5,
                outline: 'none',
              }}
            />
          </div>

          {/* Photo Upload Attachment */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                📸 {isMr ? 'छायाचित्रे जोडा (ऐच्छिक)' : 'Add Photos (Optional)'}
              </label>
              <span style={{ fontSize: 11, color: '#64748b' }}>{images.length}/3 photos</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
            />

            {imageError && (
              <p style={{ color: '#dc2626', fontSize: 12, margin: '0 0 6px' }}>{imageError}</p>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 8,
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  <img src={img} alt="Uploaded preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 999,
                      width: 18,
                      height: 18,
                      fontSize: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {images.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 8,
                    border: '1.5px dashed #94a3b8',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    color: '#64748b',
                    fontSize: 11,
                  }}
                >
                  <Camera size={18} />
                  <span>+ {isMr ? 'फोटो' : 'Photo'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
            <button
              type="button"
              onClick={handleClose}
              className="btn outline"
              style={{ padding: '10px 20px', fontSize: 13.5, borderRadius: 10 }}
            >
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn"
              style={{
                background: '#047857',
                color: '#ffffff',
                padding: '10px 24px',
                fontSize: 13.5,
                fontWeight: 800,
                borderRadius: 10,
                boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: isSubmitting ? 'wait' : 'pointer',
              }}
            >
              {isSubmitting ? (isMr ? 'प्रकाशित करत आहे…' : 'Publishing…') : (isMr ? 'प्रकाशित करा ✓' : 'Publish Experience ✓')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

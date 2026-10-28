'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { DayJourney, JourneyPlaceStop, saveJourney, deleteJourney, toggleJourneyStopVisited } from '@/lib/journeyStorage';
import { compressUploadedPhoto, saveCustomPlacePhotos } from '@/lib/journeyReel';
import ModalPortal from '@/components/ModalPortal';
import {
  X,
  Sparkles,
  Share2,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Trash2,
  Camera,
  Car,
  Bus,
  Footprints,
  Compass,
  AlertCircle,
  Film,
} from 'lucide-react';

interface JourneyTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: DayJourney | null;
  onJourneyUpdated: (updated: DayJourney) => void;
  onJourneyDeleted: (journeyId: string) => void;
  onCreateReel: (journey: DayJourney) => void;
  onShare: (journey: DayJourney) => void;
  userId?: string | null;
}

export default function JourneyTimelineModal({
  isOpen,
  onClose,
  journey,
  onJourneyUpdated,
  onJourneyDeleted,
  onCreateReel,
  onShare,
  userId,
}: JourneyTimelineModalProps) {
  const { isMr } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadStopId, setActiveUploadStopId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !journey) return null;

  // Toggle stop visited status
  const handleToggleStatus = (stopId: string, currentVisited: boolean) => {
    const updated = toggleJourneyStopVisited(journey.id, stopId, !currentVisited, userId);
    if (updated) {
      onJourneyUpdated(updated);
    }
  };

  // Upload photo attached to specific stop
  const handleTriggerUpload = (placeId: string) => {
    setActiveUploadStopId(placeId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeUploadStopId) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await compressUploadedPhoto(files[i]);
        newUrls.push(url);
      }

      // Update place photos in storage
      saveCustomPlacePhotos(activeUploadStopId, newUrls);

      // Update current journey places state
      const updatedPlaces = journey.places.map((p) => {
        if (p.placeId === activeUploadStopId || p.placeSlug === activeUploadStopId) {
          return {
            ...p,
            photos: [...(p.photos || []), ...newUrls],
          };
        }
        return p;
      });

      const updatedJourney = { ...journey, places: updatedPlaces };
      saveJourney(updatedJourney, userId);
      onJourneyUpdated(updatedJourney);
    } catch (err: any) {
      alert(err?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
      setActiveUploadStopId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = () => {
    deleteJourney(journey.id, userId);
    onJourneyDeleted(journey.id);
    onClose();
  };

  const visitedCount = journey.places.filter((p) => p.isVisited).length;
  const totalStops = journey.places.length;
  const progressPercent = totalStops > 0 ? Math.round((visitedCount / totalStops) * 100) : 0;

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        className="journey-reel-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label={isMr ? `${journey.titleMr || journey.title} सफर आढावा` : `${journey.title} Timeline`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          onChange={handleFileChange}
        />

        <div
          style={{
            position: 'relative',
            width: 'min(94vw, 720px)',
            maxHeight: 'min(92dvh, 840px)',
            margin: 'auto',
            borderRadius: 22,
            background: '#ffffff',
            color: 'var(--ink)',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.4)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cover Header */}
          <div
            style={{
              position: 'relative',
              height: 180,
              width: '100%',
              background: '#0f172a',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px 20px',
            }}
          >
            <img
              src={journey.coverImage || journey.places[0]?.photos?.[0] || journey.places[0]?.image_url || '/images/places/shaniwar-wada.jpg'}
              alt={journey.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.38,
              }}
            />

            {/* Top Bar with Badges and Close */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: 'rgba(234, 88, 12, 0.9)',
                    color: '#ffffff',
                    fontSize: 11.5,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Compass size={13} />
                  <span>{journey.travelMode ? journey.travelMode.replace('_', ' ') : 'Heritage Tour'}</span>
                </span>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#e2e8f0',
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  {isMr ? journey.dateLabelMr || journey.date : journey.dateLabelEn || journey.date}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Title and stats on cover */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                {isMr && journey.titleMr ? journey.titleMr : journey.title}
              </h2>
              <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: '#f1f5f9', fontWeight: 600 }}>
                <span>📍 {totalStops} {isMr ? 'ठिकाणे' : 'Stops'}</span>
                <span>🛣️ {journey.totalDistanceKm || 15} km</span>
                <span>⏱️ ~{journey.totalDurationMinutes || 180} min</span>
              </div>
            </div>
          </div>

          {/* Quick Action Ribbon */}
          <div
            style={{
              padding: '12px 20px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            {/* Progress tracker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: progressPercent === 100 ? '#dcfce7' : '#ffedd5',
                  color: progressPercent === 100 ? '#16a34a' : '#c2410c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {progressPercent}%
              </div>
              <div>
                <strong style={{ fontSize: 13, color: '#0f172a', display: 'block' }}>
                  {visitedCount} of {totalStops} {isMr ? 'ठिकाणे भेट दिली' : 'Stops Explored'}
                </strong>
                <span style={{ fontSize: 11.5, color: '#64748b' }}>
                  {progressPercent === 100 ? (isMr ? 'सफर पूर्ण झाली! 🎉' : 'Journey Complete! 🎉') : (isMr ? 'सफर प्रगतीपथावर आहे' : 'In Progress')}
                </span>
              </div>
            </div>

            {/* Actions: Create Reel, Share, Delete */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => onCreateReel(journey)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 10,
                  background: '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(234, 88, 12, 0.28)',
                }}
              >
                <Sparkles size={14} />
                <span>{isMr ? 'रील बनवा' : 'Create Reel'}</span>
              </button>

              <button
                type="button"
                onClick={() => onShare(journey)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 10,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: 12.5,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Share2 size={14} />
                <span>{isMr ? 'शेअर' : 'Share'}</span>
              </button>

              {confirmDelete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    type="button"
                    onClick={handleDelete}
                    style={{
                      padding: '7px 10px',
                      borderRadius: 8,
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {isMr ? 'होय, हटवा' : 'Yes, Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 8,
                      background: '#e2e8f0',
                      color: '#475569',
                      border: 'none',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  style={{
                    padding: '7px 10px',
                    borderRadius: 10,
                    background: '#fee2e2',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                  }}
                  title="Delete Journey"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Timeline Stops Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {journey.places.map((stop, idx) => {
                const isVisited = Boolean(stop.isVisited);
                return (
                  <div
                    key={stop.placeId || idx}
                    style={{
                      display: 'flex',
                      gap: 14,
                      position: 'relative',
                    }}
                  >
                    {/* Vertical Connector Line */}
                    {idx < journey.places.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 17,
                          top: 36,
                          bottom: -16,
                          width: 2,
                          background: isVisited ? '#22c55e' : '#cbd5e1',
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Step Circle Status Indicator */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(stop.placeId, isVisited)}
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: `2px solid ${isVisited ? '#16a34a' : '#94a3b8'}`,
                        background: isVisited ? '#16a34a' : '#ffffff',
                        color: isVisited ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.18s ease',
                      }}
                      title={isVisited ? 'Mark as Not Visited' : 'Mark as Visited'}
                    >
                      {isVisited ? '✓' : idx + 1}
                    </button>

                    {/* Stop Card */}
                    <div
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: 14,
                        background: '#ffffff',
                        border: `1.5px solid ${isVisited ? '#bbf7d0' : '#e2e8f0'}`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <strong style={{ fontSize: 15, color: '#0f172a' }}>
                              {isMr && stop.placeNameMr ? stop.placeNameMr : stop.placeName}
                            </strong>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 6,
                                background: isVisited ? '#dcfce7' : '#f1f5f9',
                                color: isVisited ? '#16a34a' : '#64748b',
                              }}
                            >
                              {isVisited ? (isMr ? 'भेट दिली ✓' : 'Visited ✓') : (isMr ? 'नियोजित' : 'Planned')}
                            </span>
                          </div>

                          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <span>📍 {stop.address || 'Pune'}</span>
                            {stop.elevation && <span>⛰️ {stop.elevation}m</span>}
                            <span>⏱️ {stop.recommendedDurationMinutes || 60} min</span>
                          </div>
                        </div>

                        {/* Upload photo for this stop */}
                        <button
                          type="button"
                          onClick={() => handleTriggerUpload(stop.placeId)}
                          disabled={uploading}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Camera size={14} />
                          <span>{isMr ? '+ फोटो' : '+ Photo'}</span>
                        </button>
                      </div>

                      {/* Photos thumbnail gallery for this stop */}
                      {stop.photos && stop.photos.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
                          {stop.photos.map((photoUrl, pIdx) => (
                            <img
                              key={pIdx}
                              src={photoUrl}
                              alt={stop.placeName}
                              style={{
                                width: 64,
                                height: 64,
                                borderRadius: 8,
                                objectFit: 'cover',
                                border: '1px solid #e2e8f0',
                                flexShrink: 0,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

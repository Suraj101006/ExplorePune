'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Film,
  Camera,
  Plus,
  Trash2,
  Save,
  Music2,
  CheckCircle2,
  Share2,
  Star,
  ExternalLink,
  Sparkles,
  Wand2,
  Copy,
  Check,
} from 'lucide-react';
import { StructuredPlace } from '@/lib/chatKnowledgeEngine';
import {
  MemoryMediaItem,
  DestinationVisitRecord,
  saveMemoryItem,
  deleteMemoryItem,
  addDestinationVisit,
  deleteDestinationVisit,
} from '@/lib/memoryAlbumStorage';
import { recommendReelSong, ReelSongTrack } from '@/lib/reelSongLibrary';
import { findReelTemplate } from '@/lib/reelTemplates106';

interface DestinationMemoryDetailsViewProps {
  place: StructuredPlace;
  userMemories: MemoryMediaItem[];
  visits: DestinationVisitRecord[];
  isMr: boolean;
  userId?: string | null;
  onBack: () => void;
  onCreateLocationReel: (place: StructuredPlace) => void;
}

export default function DestinationMemoryDetailsView({
  place,
  userMemories,
  visits,
  isMr,
  userId,
  onBack,
  onCreateLocationReel,
}: DestinationMemoryDetailsViewProps) {
  // New visit modal / form state
  const [isLoggingVisit, setIsLoggingVisit] = useState(false);
  const [newVisitDate, setNewVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [newVisitNotes, setNewVisitNotes] = useState('');
  const [newVisitRating, setNewVisitRating] = useState(5);

  // Quick photo upload state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Template and recommended music lookup
  const reelTemplate = useMemo(() => findReelTemplate(place.id) || findReelTemplate(place.slug), [place]);
  const recommendedSong = useMemo<ReelSongTrack | null>(() => {
    const res = recommendReelSong([
      { category: place.category, placeSlug: place.slug, placeId: place.id },
    ]);
    return res?.recommended || null;
  }, [place]);

  // AI Memory Storytelling synthesis
  const aiGeneratedStory = useMemo(() => {
    const placeName = isMr && place.name_mr ? place.name_mr : place.name;
    const tagEn = reelTemplate?.conceptTaglineEn || `${place.name} is one of Pune's most celebrated landmarks.`;
    const tagMr = reelTemplate?.conceptTaglineMr || `${placeName} हे पुण्यातील अत्यंत प्रसिद्ध आणि संस्मरणीय ठिकाण आहे.`;

    const recentNote = visits.find((v) => v.notes)?.notes;
    const visitCountTextEn = visits.length > 0 ? `Having explored this sanctuary ${visits.length} time${visits.length > 1 ? 's' : ''}, ` : '';
    const visitCountTextMr = visits.length > 0 ? `येथे एकूण ${visits.length} वेळा भेट देऊन, ` : '';

    const vignetteEn = `${visitCountTextEn}${tagEn} Standing here evokes the timeless pulse of Pune. ${recentNote ? `Personal memory: "${recentNote}".` : ''} Every stone and breeze carries echoes of Sahyadri history, leaving an indelible imprint on the traveler's heart.`;

    const vignetteMr = `${visitCountTextMr}${tagMr} येथे आल्यावर पुण्यातील समृद्ध इतिहासाचा आणि संस्कृतीचा प्रत्यक्ष अनुभव येतो. ${recentNote ? `वैयक्तिक आठवण: "${recentNote}".` : ''} सह्याद्रीचे वारे आणि या भूमीचे वैभव मनाला एक नवी ऊर्जा आणि शांतता देऊन जाते.`;

    const captionEn = `Echoes of Pune • ${place.name} 🌿✨\n${tagEn}\n\nCaptured memories from the cultural capital of Maharashtra.\n#ExplorePune #${(place.slug || 'pune').replace(/-/g, '')} #PuneTravel #IncredibleMaharashtra #TravelDiaries`;

    const captionMr = `पुण्यातील अविस्मरणीय सफर • ${placeName} 🚩✨\n${tagMr}\n\nसह्याद्रीच्या कुशीतील आणि पुण्याच्या इतिहासातील एक अनमोल ठेवा.\n#ExplorePune #${(place.slug || 'pune').replace(/-/g, '')} #पुणे #पुणेकर #महाराष्ट्रपर्यटन #माझीसफर`;

    const diaryQuoteEn = `“In ${place.name}, time slows down just enough to hear the quiet poetry of history.”`;
    const diaryQuoteMr = `“${placeName} येथे आल्यावर काळाची गती थांबते आणि इतिहासाचे मूक काव्य मनाला स्पर्श करते.”`;

    return {
      vignetteEn,
      vignetteMr,
      captionEn,
      captionMr,
      diaryQuoteEn,
      diaryQuoteMr,
    };
  }, [place, reelTemplate, visits, isMr]);

  const handleCopyStory = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedToast(label);
      setTimeout(() => setCopiedToast(null), 2500);
    }
  };

  // First visit and latest visit
  const sortedVisits = useMemo(() => {
    return [...visits].sort((a, b) =>
      (b.visitDate || b.visitedDate || '').localeCompare(a.visitDate || a.visitedDate || '')
    );
  }, [visits]);

  const firstVisit =
    sortedVisits[sortedVisits.length - 1]?.visitDate?.slice(0, 10) ||
    sortedVisits[sortedVisits.length - 1]?.visitedDate?.slice(0, 10) ||
    null;
  const latestVisit =
    sortedVisits[0]?.visitDate?.slice(0, 10) ||
    sortedVisits[0]?.visitedDate?.slice(0, 10) ||
    null;

  // Handle logging a new visit
  const handleSaveVisit = () => {
    if (!newVisitDate) return;
    addDestinationVisit({
      placeId: place.id,
      placeName: place.name,
      placeSlug: place.slug,
      visitedDate: newVisitDate,
      notes: newVisitNotes,
      rating: newVisitRating,
      userId: userId || undefined,
    });
    setNewVisitNotes('');
    setIsLoggingVisit(false);
  };

  // Handle adding a memory photo
  const handleAddMemoryPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    saveMemoryItem({
      placeId: place.id,
      placeName: place.name,
      url: newPhotoUrl.trim(),
      type: 'photo',
      caption: newPhotoCaption.trim() || undefined,
      capturedDate: new Date().toISOString().slice(0, 10),
      userId: userId || undefined,
    });
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setIsUploadingPhoto(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Top Navigation Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 12,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#334155',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>{isMr ? 'माझी सर्व ठिकाणे' : 'Back to My Places'}</span>
        </button>

        <button
          type="button"
          onClick={() => onCreateLocationReel(place)}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: 13.5,
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
          }}
        >
          <Film size={16} />
          <span>{isMr ? 'या ठिकाणाचा रील बनवा' : 'Create Location Reel'}</span>
        </button>
      </div>

      {/* Hero Cover Card */}
      <div
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          position: 'relative',
          boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.3)',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: 'clamp(220px, 32vw, 360px)' }}>
          <img
            src={place.image_url || '/images/places/shaniwar-wada.jpg'}
            alt={place.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(0,0,0,0.1) 100%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              right: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(234, 88, 12, 0.9)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {place.category}
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontSize: 11.5,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <CheckCircle2 size={13} />
                {isMr ? 'तपासलेले ऐतिहासिक ठिकाण' : 'Verified Heritage Site'}
              </span>
            </div>

            <h1 style={{ margin: 0, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900 }}>
              {isMr && place.name_mr ? place.name_mr : place.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: '#cbd5e1', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={15} color="#fb923c" />
                <span>{place.address || 'Pune, Maharashtra'}</span>
              </div>
              {place.latitude && place.longitude && (
                <span style={{ color: '#94a3b8' }}>
                  ({place.latitude.toFixed(4)}, {place.longitude.toFixed(4)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Fact Sheet Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            padding: '18px 24px',
            backgroundColor: '#1e293b',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isMr ? 'उत्तम वेळ' : 'Best Time to Visit'}
            </span>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#f8fafc', marginTop: 2 }}>
              {isMr && place.best_time_mr ? place.best_time_mr : place.best_time || 'October to March'}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isMr ? 'वेळा' : 'Timings'}
            </span>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#f8fafc', marginTop: 2 }}>
              {place.place_hours?.[0]
                ? `${place.place_hours[0].opens_at || '9:00 AM'} - ${place.place_hours[0].closes_at || '6:00 PM'}`
                : 'Open Daily'}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isMr ? 'प्रवेश शुल्क' : 'Entry Fee'}
            </span>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#34d399', marginTop: 2 }}>
              {place.entry_fee ? `₹${place.entry_fee}` : (place.fee_status === 'free' || !place.entry_fee ? (isMr ? 'विनामूल्य' : 'Free Entry') : '₹25')}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isMr ? 'शिफारस कालावधी' : 'Recommended Time'}
            </span>
            <strong style={{ display: 'block', fontSize: 13.5, color: '#60a5fa', marginTop: 2 }}>
              {place.recommended_duration_minutes ? `${place.recommended_duration_minutes} mins` : '1.5 - 2 Hours'}
            </strong>
          </div>
        </div>
      </div>

      {/* Description & History Context */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#0f172a' }}>
          {isMr ? 'ऐतिहासिक व सांस्कृतिक माहिती' : 'Historical & Cultural Context'}
        </h2>
        <p style={{ margin: 0, fontSize: 14.5, color: '#334155', lineHeight: 1.65 }}>
          {isMr && place.description_mr ? place.description_mr : place.description || 'Historic landmark of Pune cultural heritage.'}
        </p>

        {reelTemplate && (
          <div
            style={{
              marginTop: 10,
              padding: '12px 16px',
              borderRadius: 14,
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>
                {isMr ? 'सिनेमॅटिक रील टेम्पलेट तयार आहे' : 'Cinematic 5-Act Reel Template Available'}
              </span>
              <strong style={{ display: 'block', fontSize: 14, color: '#4c1d95', marginTop: 2 }}>
                {isMr && reelTemplate.conceptTaglineMr ? reelTemplate.conceptTaglineMr : reelTemplate.conceptTaglineEn}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => onCreateLocationReel(place)}
              style={{
                padding: '7px 14px',
                borderRadius: 10,
                background: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isMr ? 'टेम्पलेट उघडा' : 'Launch Studio'}
            </button>
          </div>
        )}
      </div>

      {/* Personal Relationship: Multi-Visit History */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {isMr ? 'माझा भेटींचा इतिहास (Visit Timeline)' : 'My Visit History & Timeline'}
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {visits.length > 0
                ? isMr
                  ? `तुम्ही या ठिकाणाला एकूण ${visits.length} वेळा भेट दिली आहे.`
                  : `You have visited this destination ${visits.length} time${visits.length > 1 ? 's' : ''}.`
                : isMr
                ? 'या ठिकाणाला अजून कोणतीही भेट नोंदवलेली नाही.'
                : 'No visits recorded yet for this place.'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsLoggingVisit(!isLoggingVisit)}
            style={{
              padding: '8px 16px',
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
            }}
          >
            <Plus size={15} />
            <span>{isMr ? 'नवीन भेट नोंदवा' : 'Log Another Visit'}</span>
          </button>
        </div>

        {/* Log Visit Inline Form */}
        {isLoggingVisit && (
          <div
            style={{
              padding: '16px',
              borderRadius: 14,
              backgroundColor: '#fff7ed',
              border: '1px solid #fed7aa',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <strong style={{ fontSize: 14, color: '#9a3412' }}>
              {isMr ? 'नवीन भेट तारीख व आठवणी नोंदवा' : 'Record New Visit Date & Personal Notes'}
            </strong>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  {isMr ? 'भेटीची तारीख' : 'Visit Date'}
                </label>
                <input
                  type="date"
                  value={newVisitDate}
                  onChange={(e) => setNewVisitDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    background: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  {isMr ? 'अनुभव रेटिंग (१ ते ५)' : 'Experience Rating (1-5)'}
                </label>
                <select
                  value={newVisitRating}
                  onChange={(e) => setNewVisitRating(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    background: '#ffffff',
                  }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5 Outstanding)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5 Great)</option>
                  <option value={3}>⭐⭐⭐ (3/5 Good)</option>
                  <option value={2}>⭐⭐ (2/5 Average)</option>
                  <option value={1}>⭐ (1/5 Needs improvement)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                {isMr ? 'भेटीच्या आठवणी व नोंदी' : 'Travel Notes & Highlights'}
              </label>
              <textarea
                rows={3}
                placeholder={isMr ? 'उदा. सकाळी ७ वाजता गड चढलो, हवा छान होती, पिठलं भाकरी खाल्ली…' : 'e.g., Reached early morning at sunrise, peaceful ambiance, tried local misal...'}
                value={newVisitNotes}
                onChange={(e) => setNewVisitNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  background: '#ffffff',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsLoggingVisit(false)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid #cbd5e1',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveVisit}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  background: '#ea580c',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#ffffff',
                }}
              >
                {isMr ? 'जतन करा' : 'Save Visit'}
              </button>
            </div>
          </div>
        )}

        {/* Chronological list of recorded visits */}
        {sortedVisits.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedVisits.map((v, idx) => (
              <div
                key={v.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: 14,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={14} color="#ea580c" />
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>
                      {v.visitedDate}
                    </strong>
                    {v.rating && (
                      <span style={{ fontSize: 12, color: '#f59e0b' }}>
                        {'★'.repeat(v.rating)}
                      </span>
                    )}
                  </div>
                  {v.notes ? (
                    <p style={{ margin: 0, fontSize: 13.5, color: '#475569', lineHeight: 1.5 }}>
                      {v.notes}
                    </p>
                  ) : (
                    <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                      {isMr ? 'कोणतीही नोंद नाही' : 'No personal note attached'}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => deleteDestinationVisit(v.id, userId)}
                  title="Delete visit"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '16px', borderRadius: 12, background: '#f8fafc', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            {isMr
              ? 'वर दिलेल्या "नवीन भेट नोंदवा" बटणावर क्लिक करून तुमची भेट तारीख जतन करा.'
              : 'Click "Log Another Visit" above to log when you explored this location.'}
          </div>
        )}
      </div>

      {/* Destination Photo & Video Gallery */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {isMr ? 'या ठिकाणाचे फोटो व व्हिडिओ' : 'Photos & Videos from this Destination'}
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {isMr
                ? `${userMemories.length} फोटो जतन केलेले आहेत.`
                : `${userMemories.length} memories captured here.`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadingPhoto(!isUploadingPhoto)}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              background: '#f1f5f9',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Camera size={15} color="#ea580c" />
            <span>{isMr ? 'फोटो जोडा' : 'Add Photo'}</span>
          </button>
        </div>

        {/* Inline Add Photo Form */}
        {isUploadingPhoto && (
          <div
            style={{
              padding: '16px',
              borderRadius: 14,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <strong style={{ fontSize: 14, color: '#0f172a' }}>
              {isMr ? 'नवीन फोटो जोडा' : 'Add Image for this Destination'}
            </strong>
            <input
              type="text"
              placeholder="Image URL (e.g. https://... or /images/places/...)"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                background: '#ffffff',
              }}
            />
            <input
              type="text"
              placeholder={isMr ? 'फोटो कॅप्शन (उदा. गडावरील सूर्यास्त)' : 'Caption (e.g., Sunset from the bastion)'}
              value={newPhotoCaption}
              onChange={(e) => setNewPhotoCaption(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                background: '#ffffff',
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsUploadingPhoto(false)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid #cbd5e1',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleAddMemoryPhoto}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  background: '#ea580c',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#ffffff',
                }}
              >
                {isMr ? 'अपलोड करा' : 'Save Photo'}
              </button>
            </div>
          </div>
        )}

        {/* Memories Grid */}
        {userMemories.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            {userMemories.map((m) => (
              <div
                key={m.id}
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  backgroundColor: '#0f172a',
                  position: 'relative',
                  height: 180,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={m.url}
                  alt={m.caption || 'Memory'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => deleteMemoryItem(m.id, userId)}
                  title="Delete photo"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: 'rgba(0,0,0,0.65)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={13} />
                </button>
                {m.caption && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '8px 10px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                      color: '#ffffff',
                      fontSize: 11.5,
                      fontWeight: 600,
                    }}
                  >
                    {m.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '24px', borderRadius: 12, background: '#f8fafc', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            {isMr
              ? 'या ठिकाणासाठी अजून कोणताही वैयक्तिक फोटो जोडलेला नाही.'
              : 'No personal photos added for this destination yet. Add photos to feature them in your reel!'}
          </div>
        )}
      </div>

      {/* AI Memory Storytelling & Caption Generator Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          borderRadius: 20,
          border: '1.5px solid #fed7aa',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 4px 18px -4px rgba(234, 88, 12, 0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: '#ea580c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wand2 size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#c2410c', letterSpacing: '0.05em' }}>
                  AI Destination Intelligence
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 6, background: '#ea580c', color: '#ffffff' }}>
                  Live Storytelling
                </span>
              </div>
              <h3 style={{ margin: '2px 0 0', fontSize: 17, fontWeight: 900, color: '#9a3412' }}>
                {isMr ? 'AI वैयक्तिक प्रवास गाथा व कॅप्शन्स' : 'AI Personal Memory Storyteller & Captions'}
              </h3>
            </div>
          </div>

          {copiedToast && (
            <span style={{ padding: '4px 10px', borderRadius: 8, background: '#059669', color: '#ffffff', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Check size={14} />
              {copiedToast} Copied!
            </span>
          )}
        </div>

        {/* Narrative Vignette Card */}
        <div
          style={{
            padding: '16px 18px',
            borderRadius: 14,
            background: '#ffffff',
            border: '1px solid #fed7aa',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase' }}>
              📜 {isMr ? 'साहित्यिक प्रवास विग्नेट (Travel Vignette)' : 'Evocative Travel Vignette'}
            </span>
            <button
              type="button"
              onClick={() => handleCopyStory(isMr ? aiGeneratedStory.vignetteMr : aiGeneratedStory.vignetteEn, 'Story Vignette')}
              style={{
                border: 'none',
                background: '#f8fafc',
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Copy size={13} />
              <span>{isMr ? 'कॉपी करा' : 'Copy'}</span>
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.6, fontStyle: 'italic' }}>
            {isMr ? aiGeneratedStory.vignetteMr : aiGeneratedStory.vignetteEn}
          </p>
        </div>

        {/* Two-Column Grid: Social Caption + Diary Quote */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {/* Social Caption */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: '#ffffff',
              border: '1px solid #fed7aa',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase' }}>
                📸 {isMr ? 'सोशल मीडिया रील कॅप्शन' : 'Social Media Caption & Tags'}
              </span>
              <button
                type="button"
                onClick={() => handleCopyStory(isMr ? aiGeneratedStory.captionMr : aiGeneratedStory.captionEn, 'Caption')}
                style={{
                  border: 'none',
                  background: '#f8fafc',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Copy size={13} />
                <span>{isMr ? 'कॅप्शन कॉपी' : 'Copy'}</span>
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                fontFamily: 'inherit',
                fontSize: 12,
                color: '#475569',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
              }}
            >
              {isMr ? aiGeneratedStory.captionMr : aiGeneratedStory.captionEn}
            </pre>
          </div>

          {/* Diary Reflection */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: '#ffffff',
              border: '1px solid #fed7aa',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase' }}>
                💭 {isMr ? 'डायरी सुविचार (Travel Reflection)' : 'Traveler Diary Quote'}
              </span>
              <blockquote style={{ margin: '8px 0 0', fontSize: 13, color: '#1e293b', fontStyle: 'italic', lineHeight: 1.5 }}>
                {isMr ? aiGeneratedStory.diaryQuoteMr : aiGeneratedStory.diaryQuoteEn}
              </blockquote>
            </div>

            <button
              type="button"
              onClick={() => onCreateLocationReel(place)}
              style={{
                alignSelf: 'flex-start',
                marginTop: 8,
                padding: '7px 14px',
                borderRadius: 8,
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Film size={13} />
              <span>{isMr ? 'हा कथाभाग रीलमध्ये वापरा' : 'Apply to Reel Studio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Soundtrack Section */}
      {recommendedSong && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #e2e8f0',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Music2 size={22} color="#2563eb" />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                {isMr ? 'शिफारस केलेले संगीत' : 'Recommended Soundtrack'}
              </span>
              <strong style={{ display: 'block', fontSize: 15, color: '#0f172a', marginTop: 2 }}>
                {recommendedSong.title}
              </strong>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {recommendedSong.artist} • {recommendedSong.bpm} BPM • {recommendedSong.genre}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onCreateLocationReel(place)}
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Film size={14} />
            <span>{isMr ? 'या गाण्यासह रील बनवा' : 'Use in Reel Studio'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

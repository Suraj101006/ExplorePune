'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { ALL_STRUCTURED_PLACES, StructuredPlace } from '@/lib/chatKnowledgeEngine';
import { DayJourney, JourneyPlaceStop, saveJourney, calculateGeoDistanceKm } from '@/lib/journeyStorage';
import ModalPortal from '@/components/ModalPortal';
import {
  X,
  Compass,
  Search,
  Check,
  ArrowUp,
  ArrowDown,
  Trash2,
  Car,
  Bus,
  Footprints,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface CreateJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJourneyCreated: (journey: DayJourney) => void;
  userId?: string | null;
}

const CATEGORY_FILTERS = [
  { id: 'all', labelEn: 'All Categories', labelMr: 'सर्व प्रकार' },
  { id: 'historical', labelEn: 'Historical & Forts', labelMr: 'ऐतिहासिक व किल्ले' },
  { id: 'temple', labelEn: 'Temples & Spiritual', labelMr: 'मंदिरे व धार्मिक' },
  { id: 'nature', labelEn: 'Nature & Parks', labelMr: 'निसर्ग व उद्याने' },
  { id: 'culinary', labelEn: 'Food & Heritage', labelMr: 'पुणेरी खाद्यसंस्कृती' },
  { id: 'museum', labelEn: 'Museums & Culture', labelMr: 'संग्रहालये व कला' },
];

export default function CreateJourneyModal({
  isOpen,
  onClose,
  onJourneyCreated,
  userId,
}: CreateJourneyModalProps) {
  const { isMr } = useLanguage();

  // Wizard Step: 1: Details -> 2: Destinations -> 3: Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [travelMode, setTravelMode] = useState<'driving' | 'public_transit' | 'walking'>('public_transit');
  const [note, setNote] = useState('');

  // Destination Search & Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlaces, setSelectedPlaces] = useState<StructuredPlace[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter available destinations
  const filteredPlaces = useMemo(() => {
    return ALL_STRUCTURED_PLACES.filter((p) => {
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.name_mr && p.name_mr.includes(searchQuery)) ||
        (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'historical' && (p.category_slug?.includes('fort') || p.category_slug?.includes('histor') || p.category_slug?.includes('wada') || p.category_slug?.includes('monument'))) ||
        (selectedCategory === 'temple' && (p.category_slug?.includes('temple') || p.category_slug?.includes('spiritual'))) ||
        (selectedCategory === 'nature' && (p.category_slug?.includes('park') || p.category_slug?.includes('garden') || p.category_slug?.includes('lake') || p.category_slug?.includes('hill') || p.category_slug?.includes('nature'))) ||
        (selectedCategory === 'culinary' && (p.category_slug?.includes('food') || p.category_slug?.includes('culinary') || p.category_slug?.includes('market'))) ||
        (selectedCategory === 'museum' && (p.category_slug?.includes('museum') || p.category_slug?.includes('cultural')));

      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleTogglePlace = (place: StructuredPlace) => {
    const exists = selectedPlaces.some((p) => p.id === place.id);
    if (exists) {
      setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id));
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
    setErrorMsg('');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...selectedPlaces];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSelectedPlaces(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= selectedPlaces.length - 1) return;
    const updated = [...selectedPlaces];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSelectedPlaces(updated);
  };

  const handleRemovePlace = (id: string) => {
    setSelectedPlaces(selectedPlaces.filter((p) => p.id !== id));
  };

  // Calculate estimated total distance
  const totalDistanceKm = useMemo(() => {
    if (selectedPlaces.length <= 1) return 0;
    let dist = 0;
    for (let i = 0; i < selectedPlaces.length - 1; i++) {
      const p1 = selectedPlaces[i];
      const p2 = selectedPlaces[i + 1];
      if (p1.latitude && p1.longitude && p2.latitude && p2.longitude) {
        dist += calculateGeoDistanceKm(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
      }
    }
    return Math.round(dist * 1.35 * 10) / 10; // road winding factor
  }, [selectedPlaces]);

  // Handle Save
  const handleSaveJourney = () => {
    if (!title.trim()) {
      setErrorMsg(isMr ? 'कृपया प्रवासाचे नाव प्रविष्ट करा.' : 'Please enter a journey title.');
      setCurrentStep(1);
      return;
    }
    if (selectedPlaces.length === 0) {
      setErrorMsg(isMr ? 'कृपया किमान एक ठिकाण निवडा.' : 'Please add at least one destination stop.');
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const journeyId = `journey-${Date.now()}`;
      const places: JourneyPlaceStop[] = selectedPlaces.map((p, idx) => ({
        placeId: p.id,
        placeSlug: p.slug,
        placeName: p.name,
        placeNameMr: p.name_mr || p.name,
        category: p.category_slug || p.category || 'heritage',
        isVisited: false,
        order: idx,
        note: idx === 0 && note.trim() ? note.trim() : '',
        photos: p.image_url ? [p.image_url] : [],
        latitude: p.latitude,
        longitude: p.longitude,
        elevation: (p as any).elevation || 560,
        address: p.address || 'Pune, Maharashtra',
        addressMr: p.address_mr || 'पुणे, महाराष्ट्र',
        recommendedDurationMinutes: p.recommended_duration_minutes || 60,
        isHistorical: p.category_slug?.includes('fort') || p.category_slug?.includes('histor') || false,
      }));

      const newJourney: DayJourney = {
        id: journeyId,
        date,
        title: title.trim(),
        titleMr: title.trim(),
        dateLabelEn: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        dateLabelMr: new Date(date).toLocaleDateString('mr-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        travelMode,
        status: 'planned',
        totalDistanceKm: totalDistanceKm || 12,
        totalDurationMinutes: selectedPlaces.length * 75,
        startLocation: selectedPlaces[0]?.name || 'Pune City',
        places,
        notes: note.trim() || undefined,
        coverImage: selectedPlaces[0]?.image_url || '/images/places/shaniwar-wada.jpg',
      };

      saveJourney(newJourney, userId);
      onJourneyCreated(newJourney);
      onClose();
    } catch (err) {
      console.error('Error creating journey:', err);
      setErrorMsg(isMr ? 'प्रवास सेव्ह करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.' : 'Failed to save journey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        className="journey-reel-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label={isMr ? 'नवीन पुणे प्रवास तयार करा' : 'Create New Pune Journey'}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSubmitting) onClose();
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 'min(94vw, 680px)',
            maxHeight: 'min(92dvh, 800px)',
            margin: 'auto',
            borderRadius: 20,
            background: '#ffffff',
            color: 'var(--ink)',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.45)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 24px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(234, 88, 12, 0.2)',
                  border: '1px solid rgba(234, 88, 12, 0.4)',
                  color: '#fb923c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Compass size={20} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {isMr ? 'पुणे प्रवास नियोजन' : 'Pune Travel Journal'}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  {isMr ? 'नवीन सफर आखा' : 'Plan a Pune Journey'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
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

          {/* Stepper Indicator */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}
          >
            {[
              { step: 1, title: isMr ? '१. तपशील' : '1. Details' },
              { step: 2, title: isMr ? `२. ठिकाणे (${selectedPlaces.length})` : `2. Stops (${selectedPlaces.length})` },
              { step: 3, title: isMr ? '३. मार्ग आढावा' : '3. Review & Save' },
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step as any)}
                style={{
                  flex: 1,
                  padding: '12px 10px',
                  background: currentStep === s.step ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderBottom: currentStep === s.step ? '2.5px solid #ea580c' : '2.5px solid transparent',
                  fontWeight: currentStep === s.step ? 700 : 500,
                  fontSize: 13,
                  color: currentStep === s.step ? '#ea580c' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div
              style={{
                margin: '12px 24px 0',
                padding: '10px 14px',
                borderRadius: 10,
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Body Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {/* STEP 1: JOURNEY DETAILS */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    {isMr ? 'प्रवासाचे शीर्षक / नाव *' : 'Journey Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder={isMr ? 'उदा. ऐतिहासिक किल्ले आणि वाडे सफर' : 'e.g. Historic Forts & Old City Wadas'}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 14.5,
                      color: 'var(--ink)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      {isMr ? 'सफरीची तारीख' : 'Journey Date'}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1.5px solid #cbd5e1',
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      {isMr ? 'प्रवास साधन' : 'Travel Mode'}
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[
                        { id: 'public_transit', icon: Bus, label: isMr ? 'बस / मेट्रो' : 'Transit' },
                        { id: 'driving', icon: Car, label: isMr ? 'कार / बाईक' : 'Drive' },
                        { id: 'walking', icon: Footprints, label: isMr ? 'पादचारी' : 'Walk' },
                      ].map((m) => {
                        const Icon = m.icon;
                        const isSelected = travelMode === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setTravelMode(m.id as any)}
                            style={{
                              flex: 1,
                              padding: '9px 6px',
                              borderRadius: 10,
                              border: `1.5px solid ${isSelected ? '#ea580c' : '#e2e8f0'}`,
                              background: isSelected ? '#fff7ed' : '#ffffff',
                              color: isSelected ? '#ea580c' : '#475569',
                              fontSize: 12,
                              fontWeight: 700,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 4,
                              cursor: 'pointer',
                            }}
                          >
                            <Icon size={16} />
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    {isMr ? 'वैयक्तिक नोंद / योजना (ऐच्छिक)' : 'Personal Note & Plan (Optional)'}
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={
                      isMr
                        ? 'सकाळच्या वेळेत सिंहगड सर करायचा आणि दुपारी शनिवार वाड्यावर जेवण…'
                        : 'Morning trek to Sinhagad Fort, then lunch around FC Road and afternoon heritage walk…'
                    }
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13.5,
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: CHOOSE DESTINATIONS */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                  <Search
                    size={18}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isMr ? '८०+ पुणे ठिकाणे शोधा (उदा. शनिवार वाडा, सिंहगड, सारसबाग…)' : 'Search 80+ Pune destinations (e.g. Sinhagad, Shaniwar Wada…)'}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13.5,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                  {CATEGORY_FILTERS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 20,
                        border: '1px solid',
                        borderColor: selectedCategory === cat.id ? '#ea580c' : '#cbd5e1',
                        background: selectedCategory === cat.id ? '#ea580c' : '#ffffff',
                        color: selectedCategory === cat.id ? '#ffffff' : '#475569',
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                    >
                      {isMr ? cat.labelMr : cat.labelEn}
                    </button>
                  ))}
                </div>

                {/* Selected Stops Bar */}
                {selectedPlaces.length > 0 && (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#fff7ed',
                      borderRadius: 12,
                      border: '1px solid #fed7aa',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#c2410c' }}>
                      {isMr ? `निवडलेली ठिकाणे (${selectedPlaces.length}):` : `Added Stops (${selectedPlaces.length}):`}
                    </span>
                    {selectedPlaces.map((sp, idx) => (
                      <span
                        key={sp.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 20,
                          background: '#ffffff',
                          border: '1px solid #fdba74',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#9a3412',
                        }}
                      >
                        <span>{idx + 1}. {isMr && sp.name_mr ? sp.name_mr : sp.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePlace(sp.id)}
                          style={{ background: 'none', border: 'none', color: '#9a3412', cursor: 'pointer', padding: 0 }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Places Catalog List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' }}>
                  {filteredPlaces.slice(0, 30).map((place) => {
                    const isSelected = selectedPlaces.some((p) => p.id === place.id);
                    return (
                      <div
                        key={place.id}
                        onClick={() => handleTogglePlace(place)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 12px',
                          borderRadius: 12,
                          border: `1.5px solid ${isSelected ? '#ea580c' : '#e2e8f0'}`,
                          background: isSelected ? '#fff7ed' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? '#ea580c' : '#cbd5e1'}`,
                            background: isSelected ? '#ea580c' : 'transparent',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {isSelected ? '✓' : ''}
                        </div>

                        <img
                          src={place.image_url || '/images/places/shaniwar-wada.jpg'}
                          alt={place.name}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong style={{ fontSize: 13.5, color: '#0f172a', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {isMr && place.name_mr ? place.name_mr : place.name}
                          </strong>
                          <span style={{ fontSize: 11.5, color: '#64748b' }}>
                            {place.category_slug || place.category} • ⏱️ {place.recommended_duration_minutes || 60} min
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: isSelected ? '#ea580c' : '#0284c7',
                          }}
                        >
                          {isSelected ? (isMr ? 'काढून टाका' : 'Remove') : (isMr ? '+ जोडा' : '+ Add')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW ROUTE */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Journey Overview Card */}
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: 12,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {isMr ? 'ठिकाणे' : 'Total Stops'}
                    </span>
                    <strong style={{ display: 'block', fontSize: 18, color: '#0f172a' }}>
                      {selectedPlaces.length} {isMr ? 'ठिकाणे' : 'Stops'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {isMr ? 'अंदाजे अंतर' : 'Est. Distance'}
                    </span>
                    <strong style={{ display: 'block', fontSize: 18, color: '#ea580c' }}>
                      ~{totalDistanceKm} km
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {isMr ? 'साधन' : 'Travel Mode'}
                    </span>
                    <strong style={{ display: 'block', fontSize: 18, color: '#0f172a', textTransform: 'capitalize' }}>
                      {travelMode.replace('_', ' ')}
                    </strong>
                  </div>
                </div>

                {/* Ordered Timeline Reordering */}
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#334155', margin: '0 0 10px' }}>
                    {isMr ? 'सफरीचा क्रम (बदलण्यासाठी बाण वापरा):' : 'Itinerary Sequence (Use arrows to reorder stops):'}
                  </h4>

                  {selectedPlaces.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                      {isMr ? 'कोणतेही ठिकाण निवडलेले नाही. मागे जाऊन ठिकाणे जोडा.' : 'No stops selected yet. Go back to step 2.'}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedPlaces.map((place, idx) => (
                        <div
                          key={place.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: '#ffffff',
                            borderRadius: 12,
                            border: '1.5px solid #e2e8f0',
                            gap: 10,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <div
                              style={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                background: '#ea580c',
                                color: '#ffffff',
                                fontSize: 12,
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {idx + 1}
                            </div>
                            <img
                              src={place.image_url || '/images/places/shaniwar-wada.jpg'}
                              alt={place.name}
                              style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover' }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <strong style={{ fontSize: 13.5, color: '#0f172a', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {isMr && place.name_mr ? place.name_mr : place.name}
                              </strong>
                              <span style={{ fontSize: 11.5, color: '#64748b' }}>
                                {place.address || 'Pune'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <button
                              type="button"
                              onClick={() => handleMoveUp(idx)}
                              disabled={idx === 0}
                              style={{
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: 6,
                                padding: 6,
                                cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                opacity: idx === 0 ? 0.35 : 1,
                              }}
                              title="Move Stop Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveDown(idx)}
                              disabled={idx === selectedPlaces.length - 1}
                              style={{
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: 6,
                                padding: 6,
                                cursor: idx === selectedPlaces.length - 1 ? 'not-allowed' : 'pointer',
                                opacity: idx === selectedPlaces.length - 1 ? 0.35 : 1,
                              }}
                              title="Move Stop Down"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePlace(place.id)}
                              style={{
                                background: '#fee2e2',
                                color: '#dc2626',
                                border: 'none',
                                borderRadius: 6,
                                padding: 6,
                                cursor: 'pointer',
                                marginLeft: 4,
                              }}
                              title="Remove Stop"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <ChevronLeft size={16} /> {isMr ? 'मागे' : 'Back'}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: 'transparent',
                  color: '#64748b',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !title.trim()) {
                    setErrorMsg(isMr ? 'कृपया प्रवासाचे नाव प्रविष्ट करा.' : 'Please enter a journey title.');
                    return;
                  }
                  if (currentStep === 2 && selectedPlaces.length === 0) {
                    setErrorMsg(isMr ? 'कृपया किमान एक ठिकाण जोडा.' : 'Please add at least one stop.');
                    return;
                  }
                  setErrorMsg('');
                  setCurrentStep((currentStep + 1) as any);
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#ea580c',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)',
                }}
              >
                <span>{isMr ? 'पुढील पायरी' : 'Next Step'}</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveJourney}
                disabled={isSubmitting || selectedPlaces.length === 0}
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#16a34a',
                  color: '#ffffff',
                  fontSize: 13.5,
                  fontWeight: 800,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                }}
              >
                <Check size={18} />
                <span>{isSubmitting ? (isMr ? 'जतन करत आहे…' : 'Saving Journey…') : (isMr ? 'सफर जतन करा ✓' : 'Save Journey ✓')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

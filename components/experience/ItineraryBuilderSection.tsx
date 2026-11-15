'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ITINERARY_TEMPLATES,
  PLACES_BY_SLUG,
  ALL_106_PLACES,
  ItineraryTemplate,
  ExperiencePlace,
} from '@/lib/experienceData';
import {
  Route,
  Clock,
  Car,
  MapPin,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Bookmark,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ItineraryBuilderSectionProps {
  isMr: boolean;
}

export default function ItineraryBuilderSection({ isMr }: ItineraryBuilderSectionProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(ITINERARY_TEMPLATES[0].id);
  const [customStops, setCustomStops] = useState<string[]>(ITINERARY_TEMPLATES[0].stops);
  const [transportMode, setTransportMode] = useState<'transit' | 'bike' | 'car'>('car');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchPlace, setSearchPlace] = useState('');
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  const activeTemplate =
    ITINERARY_TEMPLATES.find((t) => t.id === selectedTemplateId) || ITINERARY_TEMPLATES[0];

  const handleSelectTemplate = (template: ItineraryTemplate) => {
    setSelectedTemplateId(template.id);
    setCustomStops(template.stops);
  };

  const handleMoveStop = (idx: number, direction: 'up' | 'down') => {
    const updated = [...customStops];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCustomStops(updated);
  };

  const handleRemoveStop = (idx: number) => {
    if (customStops.length <= 1) return;
    const updated = customStops.filter((_, i) => i !== idx);
    setCustomStops(updated);
  };

  const handleAddStop = (slug: string) => {
    if (customStops.includes(slug)) return;
    setCustomStops([...customStops, slug]);
    setShowAddDrawer(false);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Compute total travel time estimate
  const estimatedHours = Math.round((customStops.length * 1.25) * 10) / 10;

  return (
    <section id="planner" className="exp-section exp-planner-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Route size={14} />
            <span>{isMr ? 'विभाग १२ • परस्परसंवादी प्रवास योजना' : 'SECTION 12 • CUSTOM ITINERARY BUILDER'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'तुमची स्वतःची पुणे भ्रमंती योजना आखा' : 'Build Your Own Pune Experience'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? '८ पूर्वनिर्मित आदर्श यात्रांपैकी निवडा किंवा स्वतःची ठिकाणे जोडून क्रमवारी बदला, प्रवासाचा वेळ मोजा आणि योजना जतन करा.'
              : 'Choose from 8 battle-tested itinerary templates or customize your own: reorder stops, calculate travel times, and launch turn-by-turn navigation.'}
          </p>
        </div>

        {/* 8 Preset Itinerary Templates Carousel */}
        <div className="exp-templates-carousel">
          {ITINERARY_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tmpl)}
              className={`exp-template-pill ${selectedTemplateId === tmpl.id ? 'active' : ''}`}
            >
              <div className="tmpl-time">{tmpl.durationLabel}</div>
              <div className="tmpl-title">{isMr ? tmpl.titleMr : tmpl.title}</div>
              <div className="tmpl-stops-cnt">{tmpl.stops.length} {isMr ? 'थांबे' : 'Stops'}</div>
            </button>
          ))}
        </div>

        {/* Builder Workspace Card */}
        <div className="exp-builder-card">
          <div className="exp-builder-header">
            <div>
              <span className="lbl">{isMr ? 'निवडलेली योजना:' : 'Active Template:'}</span>
              <h3 className="title">{isMr ? activeTemplate.titleMr : activeTemplate.title}</h3>
              <p className="desc">{activeTemplate.description}</p>
            </div>

            <div className="actions">
              <button
                type="button"
                onClick={handleShare}
                className="exp-btn-secondary"
              >
                {copiedLink ? (
                  <>
                    <Check size={15} style={{ color: '#10b981' }} />
                    <span>{isMr ? 'दुवा कॉपी झाला!' : 'Link Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 size={15} />
                    <span>{isMr ? 'योजना शेअर करा' : 'Share Plan'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowAddDrawer(true)}
                className="exp-btn-primary"
              >
                <Plus size={15} />
                <span>{isMr ? 'ठिकाण जोडा' : 'Add Stop'}</span>
              </button>
            </div>
          </div>

          {/* Real Travel Metrics Summary Bar */}
          <div className="exp-builder-metrics-bar">
            <div className="metric">
              <Clock size={15} />
              <span>
                <strong>{isMr ? 'अंदाजे वेळ:' : 'Estimated Time:'}</strong> ~{estimatedHours} {isMr ? 'तास' : 'Hours'}
              </span>
            </div>
            <div className="metric">
              <Car size={15} />
              <span>
                <strong>{isMr ? 'प्रवासाचे साधन:' : 'Recommended Transport:'}</strong> {activeTemplate.recommendedTransport}
              </span>
            </div>
            <div className="metric">
              <MapPin size={15} />
              <span>
                <strong>{isMr ? 'एकूण थांबे:' : 'Total Stops:'}</strong> {customStops.length} {isMr ? 'ठिकाणे' : 'Places'}
              </span>
            </div>
          </div>

          {/* Interactive Sequenced Stops List */}
          <div className="exp-builder-stops-list">
            {customStops.map((slug, idx) => {
              const place = PLACES_BY_SLUG[slug];
              if (!place) return null;

              return (
                <div key={`${slug}-${idx}`} className="exp-builder-stop-item">
                  <div className="stop-num">{idx + 1}</div>

                  <div className="stop-thumb">
                    <Image
                      src={place.image_url}
                      alt={place.name}
                      fill
                      sizes="90px"
                      className="img"
                    />
                  </div>

                  <div className="stop-info">
                    <span className="cat">{place.category}</span>
                    <h4 className="name">
                      {isMr && place.name_mr ? place.name_mr : place.name}
                    </h4>
                    <p className="addr">{place.address}</p>
                  </div>

                  <div className="stop-controls">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveStop(idx, 'up')}
                      className="ctrl-btn"
                      title="Move Up"
                      aria-label="Move stop up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === customStops.length - 1}
                      onClick={() => handleMoveStop(idx, 'down')}
                      className="ctrl-btn"
                      title="Move Down"
                      aria-label="Move stop down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={customStops.length <= 1}
                      onClick={() => handleRemoveStop(idx)}
                      className="ctrl-btn delete"
                      title="Remove Stop"
                      aria-label="Remove stop"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Launcher Action */}
          <div className="exp-builder-footer">
            <Link
              href="/planner"
              className="exp-btn-primary"
            >
              <Route size={16} />
              <span>{isMr ? 'पूर्ण ट्रिप प्लॅनर मध्ये उघडा' : 'Open in Full Trip Planner'}</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Add Stop Modal Drawer */}
      {showAddDrawer && (
        <div
          className="exp-modal-backdrop"
          onClick={() => setShowAddDrawer(false)}
        >
          <div
            className="exp-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="exp-modal-header">
              <h3 className="exp-modal-title">
                {isMr ? 'योजनेमध्ये नवीन ठिकाण जोडा' : 'Add Destination to Your Custom Plan'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDrawer(false)}
                className="exp-modal-close"
              >
                ✕
              </button>
            </div>

            <div className="exp-modal-scroll">
              <input
                type="text"
                placeholder={isMr ? '१०६ ठिकाणांमधून शोधा...' : 'Search from all 106 destinations...'}
                value={searchPlace}
                onChange={(e) => setSearchPlace(e.target.value)}
                className="exp-search-input"
                style={{ width: '100%', marginBottom: 16 }}
              />

              <div className="exp-add-stops-grid">
                {ALL_106_PLACES.filter(
                  (p) =>
                    !customStops.includes(p.slug) &&
                    (!searchPlace || p.name.toLowerCase().includes(searchPlace.toLowerCase()))
                ).map((place) => (
                  <div
                    key={place.slug}
                    className="exp-add-stop-row"
                    onClick={() => handleAddStop(place.slug)}
                  >
                    <div className="info">
                      <span className="name">{isMr && place.name_mr ? place.name_mr : place.name}</span>
                      <span className="cat">{place.category}</span>
                    </div>
                    <button type="button" className="exp-btn-secondary mini">
                      <Plus size={13} /> {isMr ? 'जोडा' : 'Add'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

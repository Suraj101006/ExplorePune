'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  EXPERIENCE_STORIES_DATA,
  ExperienceStory,
  PLACES_BY_SLUG,
} from '@/lib/experienceData';
import {
  BookOpen,
  Clock,
  ArrowRight,
  X,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ExperienceStoriesSectionProps {
  isMr: boolean;
}

export default function ExperienceStoriesSection({ isMr }: ExperienceStoriesSectionProps) {
  const [activeStory, setActiveStory] = useState<ExperienceStory | null>(null);

  return (
    <section id="stories" className="exp-section exp-stories-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <BookOpen size={14} />
            <span>{isMr ? 'विभाग १३ • अनुभव कथा' : 'SECTION 13 • EDITORIAL EXPERIENCE STORIES'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुण्याच्या अंतरंगातील अनुभव कथा' : 'Experience Stories of Pune'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'गडांवरील सकाळची धुक्याची चादर, १७ पेठांमधील ऐतिहासिक पाऊलखुणा आणि खाद्यसंस्कृतीची खोलवर सफर घडवणाऱ्या विशेष संपादकीय कथा.'
              : 'Immersion into the living pulse of Pune: deep-form narrative dispatches exploring early dawn on Sinhagad, living artisan alleys, and the spiritual roots of Ganeshotsav.'}
          </p>
        </div>

        {/* 6 Editorial Stories Grid */}
        <div className="exp-stories-grid">
          {EXPERIENCE_STORIES_DATA.map((story) => (
            <article
              key={story.id}
              className="exp-story-card"
              onClick={() => setActiveStory(story)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveStory(story);
                }
              }}
              aria-label={`Read story: ${story.headline}`}
            >
              <div className="exp-story-media">
                <Image
                  src={story.coverImage}
                  alt={story.headline}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="exp-story-img"
                />
                <div className="exp-story-overlay" />
                <div className="exp-story-readtime">
                  <Clock size={12} />
                  <span>{story.readingMinutes} {isMr ? 'मि. वाचन' : 'min read'}</span>
                </div>
              </div>

              <div className="exp-story-body">
                <span className="exp-story-author">{story.authorNote}</span>

                <h3 className="exp-story-headline">
                  {isMr ? story.headlineMr : story.headline}
                </h3>

                <p className="exp-story-excerpt">{story.excerpt}</p>

                <div className="exp-story-read-action">
                  <span>{isMr ? 'संपूर्ण कथा वाचा' : 'Read Full Story'}</span>
                  <ArrowRight size={15} className="arrow" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Story Reading Modal Dialog */}
      {activeStory && (
        <div
          className="exp-modal-backdrop"
          onClick={() => setActiveStory(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="exp-modal-card story-reader"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="exp-story-modal-hero">
              <Image
                src={activeStory.coverImage}
                alt={activeStory.headline}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="img"
              />
              <div className="overlay" />
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="exp-modal-close inside"
                aria-label="Close story reader"
              >
                <X size={20} />
              </button>

              <div className="hero-text">
                <span className="author">{activeStory.authorNote}</span>
                <h3 className="title">{isMr ? activeStory.headlineMr : activeStory.headline}</h3>
              </div>
            </div>

            <div className="exp-modal-scroll">
              <div
                className="exp-story-html"
                dangerouslySetInnerHTML={{ __html: activeStory.narrativeHtml }}
              />

              {/* Linked Destinations Box */}
              <div className="exp-story-linked-places">
                <span className="title">
                  <MapPin size={14} />
                  <span>{isMr ? 'कथेशी संबंधित प्रमुख ठिकाणे:' : 'Destinations Featured in this Story:'}</span>
                </span>
                <div className="grid">
                  {activeStory.featuredSlugs.map((slug) => {
                    const place = PLACES_BY_SLUG[slug];
                    if (!place) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/places/${slug}`}
                        className="exp-story-place-link"
                      >
                        <div className="thumb">
                          <Image
                            src={place.image_url}
                            alt={place.name}
                            fill
                            sizes="70px"
                            className="img"
                          />
                        </div>
                        <div className="info">
                          <span className="name">
                            {isMr && place.name_mr ? place.name_mr : place.name}
                          </span>
                          <span className="addr">{place.address}</span>
                        </div>
                        <ExternalLink size={13} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="exp-modal-footer">
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="exp-btn-secondary"
              >
                {isMr ? 'कथा बंद करा' : 'Close Story Reader'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

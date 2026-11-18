'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTopStories } from '@/lib/experience/selectors';
import { getExperienceV2I18n } from '@/lib/experience/i18n';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface StoriesRowProps {
  lang?: string;
}

export default function StoriesRow({ lang = 'en' }: StoriesRowProps) {
  const dict = getExperienceV2I18n(lang);
  const isMr = lang === 'mr';
  const stories = getTopStories();

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <BookOpen size={12} />
            <span>{dict.intro.stories.badge}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            {dict.intro.stories.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xl text-base md:text-lg">
            {dict.intro.stories.subtitle}
          </p>
        </div>

        <div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:underline"
          >
            <span>{dict.intro.stories.viewAllBlogs}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* 3 Story Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story) => (
          <article
            key={story.id}
            className="flex flex-col bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
          >
            {/* Cover Photo */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={story.coverImage}
                alt={isMr ? story.titleMr : story.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white flex items-center gap-1">
                <Clock size={10} />
                <span>{story.readingMinutes} min read</span>
              </div>
            </div>

            {/* Story Content */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                  {isMr ? story.authorNoteMr : story.authorNoteEn}
                </p>

                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug mb-3">
                  {isMr ? story.titleMr : story.titleEn}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-6">
                  {isMr ? story.excerptMr : story.excerptEn}
                </p>
              </div>

              <div>
                <Link
                  href={story.route}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <span>{dict.intro.stories.readStoryBtn}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

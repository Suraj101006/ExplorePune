'use client';

import React from 'react';
import { getMarqueeItems } from '@/lib/experience/selectors';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface MarqueeStripProps {
  lang?: string;
}

export default function MarqueeStrip({ lang = 'en' }: MarqueeStripProps) {
  const items = getMarqueeItems();
  const isMr = lang === 'mr';

  // Double items for seamless infinite horizontal loop
  const loopItems = [...items, ...items];

  return (
    <div
      role="region"
      aria-label="Verified Travel Telemetry Ticker"
      className="relative w-full py-4 bg-amber-600 dark:bg-amber-950/80 text-white border-y border-amber-700/50 dark:border-amber-500/20 overflow-hidden"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {loopItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="flex items-center gap-3 px-6 md:px-8 border-r border-white/20 whitespace-nowrap text-xs md:text-sm font-semibold tracking-wide"
          >
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-white/20 text-white inline-flex items-center gap-1">
              <CheckCircle2 size={10} />
              <span>{item.badge}</span>
            </span>

            <span className="text-white/95">
              {isMr ? item.textMr : item.textEn}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

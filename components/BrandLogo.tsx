'use client';

import React from 'react';
import Image from 'next/image';

export const OFFICIAL_LOGO_PATH = '/assets/explore-pune-logo.png';
export const OFFICIAL_LOGO_CDN_URL = 'https://explorepune-guide.vercel.app/assets/explore-pune-logo.png';

export interface BrandLogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
  withBadge?: boolean;
  style?: React.CSSProperties;
  badgeBackground?: string;
  badgeBorderRadius?: string | number;
}

/**
 * Reusable official BrandLogo component for Explore Pune.
 * Renders the official uploaded logo preserving original 1:1 proportions,
 * crispness, and typography.
 */
export default function BrandLogo({
  size = 40,
  className = '',
  priority = false,
  alt = 'Explore Pune Official Logo',
  withBadge = false,
  style,
  badgeBackground = '#ffffff',
  badgeBorderRadius = '50%',
}: BrandLogoProps) {
  const imageElement = (
    <Image
      src={OFFICIAL_LOGO_PATH}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
      }}
    />
  );

  if (withBadge) {
    return (
      <span
        className={`brand-logo-badge ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size + 8,
          height: size + 8,
          borderRadius: badgeBorderRadius,
          background: badgeBackground,
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          flexShrink: 0,
          ...style,
        }}
      >
        {imageElement}
      </span>
    );
  }

  return (
    <span
      className={`brand-logo-wrap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      {imageElement}
    </span>
  );
}

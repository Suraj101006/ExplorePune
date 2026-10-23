'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { getUserInitials } from '@/lib/avatarUtils';

interface ProfileAvatarProps {
  photoUrl?: string | null;
  name?: string | null;
  email?: string | null;
  size?: number; // e.g. 96 for profile header, 40 for navbar, 32 for compact
  editable?: boolean;
  onEditClick?: () => void;
  isUpdated?: boolean;
  className?: string;
  altText?: string;
}

export default function ProfileAvatar({
  photoUrl,
  name,
  email,
  size = 96,
  editable = false,
  onEditClick,
  isUpdated = false,
  className = '',
  altText,
}: ProfileAvatarProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const initials = getUserInitials(name, email);

  // Camera badge size scales proportionally with the avatar
  const badgeSize = Math.max(26, Math.round(size * 0.32));
  const iconSize = Math.max(13, Math.round(badgeSize * 0.52));
  const fontSize = Math.max(12, Math.round(size * 0.36));

  const hasPhoto = Boolean(photoUrl && photoUrl.trim());

  return (
    <div
      className={`avatar-wrapper ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="avatar-circle"
        style={{
          width: size,
          height: size,
          cursor: editable ? 'pointer' : 'default',
        }}
        onClick={editable ? onEditClick : undefined}
        role={editable ? 'button' : undefined}
        tabIndex={editable ? 0 : undefined}
        onKeyDown={
          editable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEditClick?.();
                }
              }
            : undefined
        }
        aria-label={editable ? 'Change profile photo' : 'Profile avatar'}
      >
        {hasPhoto ? (
          <img
            key={photoUrl} // forces key transition when photoUrl changes
            src={photoUrl!}
            alt={altText || name || 'Profile Avatar'}
            onLoad={() => setImageLoaded(true)}
            className={`${imageLoaded ? 'avatar-img-loaded' : ''} ${
              isUpdated ? 'avatar-img-updated' : ''
            }`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              opacity: imageLoaded ? 1 : 0,
            }}
          />
        ) : (
          <div
            className="avatar-initials-badge"
            style={{
              fontSize,
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Camera / Edit Trigger Badge */}
      {editable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick?.();
          }}
          className="avatar-camera-trigger"
          style={{
            width: badgeSize,
            height: badgeSize,
          }}
          title="Change profile photo"
          aria-label="Change profile photo"
        >
          <Camera size={iconSize} strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}

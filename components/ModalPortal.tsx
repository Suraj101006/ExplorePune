'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  lockBackgroundScroll?: boolean;
}

// Module-level reference counting for nested/chained modals
let activeModalCount = 0;
let initialScrollY = 0;
let originalOverflow = '';
let originalPaddingRight = '';

export function lockScroll() {
  if (typeof window === 'undefined') return;

  if (activeModalCount === 0) {
    initialScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    originalOverflow = document.body.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;

    // Prevent horizontal page layout shift from scrollbar disappearing
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
  }
  activeModalCount++;
}

export function unlockScroll() {
  if (typeof window === 'undefined') return;

  activeModalCount = Math.max(0, activeModalCount - 1);
  if (activeModalCount === 0) {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
    document.body.classList.remove('modal-open');

    // Reliably restore the user's scroll position without unwanted jump
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    if (Math.abs(currentScrollY - initialScrollY) > 1) {
      window.scrollTo({
        top: initialScrollY,
        behavior: 'instant' as ScrollBehavior,
      });
    }
  }
}

/**
 * Universal Modal Portal
 * 
 * Renders modal content directly into `document.body` via React createPortal.
 * Escapes all parent containing blocks (transforms, will-change, filter, overflow, scrolled parents).
 * Enforces immediate centered viewport positioning, body scroll lock, and scroll position restoration.
 */
export default function ModalPortal({
  isOpen,
  onClose,
  children,
  lockBackgroundScroll = true,
}: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !mounted) return;

    if (lockBackgroundScroll) {
      lockScroll();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCloseRef.current) {
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (lockBackgroundScroll) {
        unlockScroll();
      }
    };
  }, [isOpen, mounted, lockBackgroundScroll]);

  if (!isOpen || !mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(children, document.body);
}

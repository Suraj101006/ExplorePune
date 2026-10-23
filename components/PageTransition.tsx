'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      setDisplayedChildren(children);
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 420);
      return () => clearTimeout(timer);
    } else {
      setDisplayedChildren(children);
    }
  }, [pathname, children]);

  return (
    <div
      key={pathname}
      className={`page-transition-wrap ${isAnimating ? 'page-entering' : ''}`}
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 140px)',
      }}
    >
      {displayedChildren}
    </div>
  );
}

'use client';

import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Enlarge cursor on hoverable elements via event delegation: `mouseover`/
    // `mouseout` bubble (unlike `mouseenter`/`mouseleave`), so one listener
    // on `document` catches events from any matching element — including
    // ones mounted after this effect runs — with no MutationObserver or
    // per-element listeners, and no re-scanning the DOM on every mutation.
    const grow = () => {
      cursor.style.width = '14px';
      cursor.style.height = '14px';
    };
    const shrink = () => {
      cursor.style.width = '6px';
      cursor.style.height = '6px';
    };

    const isHoverTarget = (el: EventTarget | null): el is HTMLElement =>
      el instanceof HTMLElement && el.closest('button, .name') !== null;

    const handleMouseOver = (e: MouseEvent) => {
      if (isHoverTarget(e.target)) grow();
    };
    const handleMouseOut = (e: MouseEvent) => {
      // Only shrink when the pointer has actually left the hoverable
      // element (not just moved between its children).
      const target = e.target;
      const related = e.relatedTarget;
      if (
        isHoverTarget(target) &&
        !(related instanceof HTMLElement && target instanceof HTMLElement && target.contains(related))
      ) {
        shrink();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Tab title change on visibility
    const originalTitle = document.title;
    const handleVisibility = () => {
      document.title = document.hidden ? 'Come back...' : originalTitle;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <div id="custom-cursor" />;
}

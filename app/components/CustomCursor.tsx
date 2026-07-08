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

    // Enlarge cursor on hoverable elements — uses event delegation so it works
    // even for elements mounted after this effect runs.
    const grow = () => {
      cursor.style.width = '14px';
      cursor.style.height = '14px';
    };
    const shrink = () => {
      cursor.style.width = '6px';
      cursor.style.height = '6px';
    };

    const attachHoverListeners = () => {
      document.querySelectorAll<HTMLElement>('button, .name').forEach((el) => {
        el.addEventListener('mouseenter', grow);
        el.addEventListener('mouseleave', shrink);
      });
    };

    // Initial attach + re-attach whenever the DOM settles
    attachHoverListeners();
    const mo = new MutationObserver(attachHoverListeners);
    mo.observe(document.body, { childList: true, subtree: true });

    // Tab title change on visibility
    const originalTitle = document.title;
    const handleVisibility = () => {
      document.title = document.hidden ? 'Come back...' : originalTitle;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      mo.disconnect();
    };
  }, []);

  return <div id="custom-cursor" />;
}

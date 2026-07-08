'use client';

import { useEffect } from 'react';

export default function RevealObserver() {
  useEffect(() => {
    // Observe elements with .reveal — adds .visible when they enter the viewport
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

    // Observe .trait-item elements — blur-focus effect on scroll
    const focusObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in-focus');
          else e.target.classList.remove('in-focus');
        });
      },
      { rootMargin: '-35% 0px -35% 0px' }
    );

    document.querySelectorAll('.trait-item').forEach((el) => focusObs.observe(el));

    return () => {
      revealObs.disconnect();
      focusObs.disconnect();
    };
  }, []);

  return null;
}

'use client';

import { useEffect } from 'react';

export default function ScrollThread() {
  useEffect(() => {
    const el = document.getElementById('scroll-thread');
    if (!el) return;

    const handleScroll = () => {
      const scrolled = document.body.scrollTop || document.documentElement.scrollTop;
      const total =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      el.style.height = (scrolled / total) * 100 + '%';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div id="scroll-thread" />;
}

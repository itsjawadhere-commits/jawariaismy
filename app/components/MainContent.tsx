'use client';

import { useEffect, useState } from 'react';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    // Small tick so the CSS transition fires after mount
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <main
      id="main-content"
      className={visible ? 'content-visible' : ''}
    >
      {children}
    </main>
  );
}

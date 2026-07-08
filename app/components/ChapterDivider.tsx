'use client';

import { useEffect, useRef, useState } from 'react';

interface ChapterDividerProps {
  numeral: string; // 'i', 'ii', 'iii'...
  title: string; // 'The Beginning'
  epigraph: string; // one quiet line setting up the chapter
}

export default function ChapterDivider({ numeral, title, epigraph }: ChapterDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`chapter-divider${visible ? ' chapter-visible' : ''}`} ref={ref}>
      <span className="chapter-numeral mono">{numeral}</span>
      <h2 className="chapter-title serif">{title}</h2>
      <p className="chapter-epigraph serif">{epigraph}</p>
      <span className="chapter-line" />
    </div>
  );
}

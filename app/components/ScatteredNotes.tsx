'use client';

import { useEffect, useRef } from 'react';
import { SCATTERED_NOTES } from '../lib/data/scatteredNotes';

export default function ScatteredNotes() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const notes = field.querySelectorAll<HTMLSpanElement>('.note');
    const isMobile = window.innerWidth <= 768;

    notes.forEach((note, i) => {
      const pos = SCATTERED_NOTES[i];
      if (!isMobile) {
        note.style.left = pos.l + '%';
        note.style.top = pos.t + '%';
      }
      note.style.transform = `rotate(${pos.r}deg)`;
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            notes.forEach((note, i) => {
              setTimeout(() => note.classList.add('visible'), i * 120);
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    obs.observe(field);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="scattered-section">
      <p className="mono" style={{ marginBottom: '0.5rem', zIndex: 2, position: 'relative' }}>
        the small things
      </p>
      <p
        className="serif"
        style={{ opacity: 0.5, fontSize: '1rem', marginBottom: '3rem', zIndex: 2, position: 'relative' }}
      >
        details i carry without meaning to
      </p>
      <div className="scattered-field" id="scattered-field" ref={fieldRef}>
        {SCATTERED_NOTES.map((note, i) => (
          <span key={i} className="note" data-i={i}>
            {note.text}
          </span>
        ))}
      </div>
    </section>
  );
}

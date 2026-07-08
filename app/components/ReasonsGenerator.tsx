'use client';

import { useEffect, useRef, useState } from 'react';
import { REASONS } from '../lib/data/reasons';

// A shuffled, stable reading order — same for everyone, so "reason 14 of 204"
// means something, but not in the original array order.
function shuffledOrder(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  // simple seeded shuffle so the order is deterministic across renders
  let seed = 1337;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ORDER = shuffledOrder(REASONS.length);

export default function ReasonsGenerator() {
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const goTo = (next: number) => {
    if (next < 0 || next >= ORDER.length) return;
    setOpacity(0);
    setTimeout(() => {
      setIndex(next);
      setOpacity(1);
    }, 500);
  };

  // Gentle auto-drift forward while the section is in view, paused on interaction
  const sectionRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !pausedRef.current) {
            autoTimerRef.current = setInterval(() => {
              setIndex((cur) => {
                const next = cur + 1 < ORDER.length ? cur + 1 : cur;
                if (next !== cur) {
                  setOpacity(0);
                  setTimeout(() => setOpacity(1), 400);
                }
                return next;
              });
            }, 7000);
          } else if (autoTimerRef.current) {
            clearInterval(autoTimerRef.current);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  const handleManual = (dir: 1 | -1) => {
    pausedRef.current = true;
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    goTo(index + dir);
  };

  return (
    <section className="section-padding reveal" ref={sectionRef}>
      <p className="mono" style={{ marginBottom: '0.5rem' }}>
        why i love you, jawaria
      </p>
      <div className="generator-container" style={{ marginTop: '2rem' }}>
        <p id="reason-text" className="serif" style={{ opacity }}>
          {REASONS[ORDER[index]]}
        </p>
        <div className="generator-controls">
          <button
            className="generator-nav"
            onClick={() => handleManual(-1)}
            disabled={index === 0}
            aria-label="previous reason"
          >
            ←
          </button>
          <span className="mono" style={{ opacity: 0.35, fontSize: '0.65rem' }}>
            {pausedRef.current ? 'lingering' : 'drifting on its own'}
          </span>
          <button
            className="generator-nav"
            onClick={() => handleManual(1)}
            disabled={index === ORDER.length - 1}
            aria-label="next reason"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

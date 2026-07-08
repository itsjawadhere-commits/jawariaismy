'use client';

import { useEffect, useRef, useState } from 'react';
import { THINGS_I_NOTICED } from '../lib/data/thingsINoticed';

const TOTAL = THINGS_I_NOTICED.length;
const STORAGE_KEY = 'memory_jar_order';
const STORAGE_POS = 'memory_jar_pos';

// deterministic seeded shuffle so the pull order stays the same across visits
function shuffledOrder(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  let seed = 4211;
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

type Stage = 'idle' | 'lifting' | 'unfolding' | 'open';

export default function MemoryJar() {
  const orderRef = useRef<number[]>(shuffledOrder(TOTAL));
  const [pos, setPos] = useState(0);
  const [stage, setStage] = useState<Stage>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // restore progress so she can pick up where she left off, without repeats
  useEffect(() => {
    try {
      const storedOrder = localStorage.getItem(STORAGE_KEY);
      const storedPos = localStorage.getItem(STORAGE_POS);
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder);
        if (Array.isArray(parsed) && parsed.length === TOTAL) {
          orderRef.current = parsed;
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orderRef.current));
      }
      if (storedPos) {
        const n = parseInt(storedPos, 10);
        if (!Number.isNaN(n) && n >= 0) {
          setPos(n);
        }
      }
    } catch {
      // localStorage unavailable, just run in memory for this visit
    }

    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const currentIndex = orderRef.current[pos % TOTAL];
  const currentText = THINGS_I_NOTICED[currentIndex];

  const handlePull = () => {
    if (stage === 'lifting' || stage === 'unfolding') return;

    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (stage === 'open') {
      // fold the current note away first, then reveal the next one
      setStage('idle');
      timers.current.push(
        setTimeout(() => {
          advanceAndReveal();
        }, 260)
      );
      return;
    }

    advanceAndReveal();
  };

  const advanceAndReveal = () => {
    setPos((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(STORAGE_POS, String(next));
      } catch {
        // ignore
      }
      return next;
    });

    setStage('lifting');
    timers.current.push(
      setTimeout(() => setStage('unfolding'), 420)
    );
    timers.current.push(
      setTimeout(() => setStage('open'), 1050)
    );
  };

  const isFirstPull = stage === 'idle' && pos === 0;

  return (
    <section className="section-padding reveal memjar-section">
      <p className="mono" style={{ marginBottom: '0.5rem' }}>a jar full of small things</p>
      <h2
        className="serif"
        style={{
          fontStyle: 'italic',
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          fontWeight: 300,
          letterSpacing: '0.01em',
          marginBottom: '0.6rem',
        }}
      >
        Things I Noticed About You
      </h2>
      <p className="serif" style={{ opacity: 0.55, fontSize: '1rem', marginBottom: '2.5rem' }}>
        every glance, every little thing, kept in one place for you.
      </p>

      <div className="memjar-illustration" aria-hidden="true">
        <svg viewBox="0 0 220 280" className="memjar-svg" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="240" rx="70" ry="14" className="memjar-shadow" />

          {/* little heart tied above the lid */}
          <path
            d="M110 8 C104 0, 92 2, 92 12 C92 20, 102 26, 110 34 C118 26, 128 20, 128 12 C128 2, 116 0, 110 8 Z"
            className="memjar-heart"
          />
          <line x1="110" y1="34" x2="110" y2="40" className="memjar-string" />

          {/* lid */}
          <rect x="72" y="40" width="76" height="12" rx="4" className="memjar-lid-top" />
          <rect x="66" y="50" width="88" height="16" rx="6" className="memjar-lid" />

          {/* jar body */}
          <path
            d="M58 62 L58 208 C58 234, 82 240, 110 240 C138 240, 162 234, 162 208 L162 62 Z"
            className="memjar-body"
          />

          {/* glass highlight */}
          <path d="M74 78 L74 202" className="memjar-highlight" />
          <path d="M84 78 L84 130" className="memjar-highlight memjar-highlight-thin" />

          {/* folded notes resting inside the jar */}
          <g className="memjar-note-icon" transform="rotate(-10 92 150)">
            <rect x="80" y="140" width="24" height="18" rx="2" />
            <text x="92" y="153">&#9825;</text>
          </g>
          <g className="memjar-note-icon" transform="rotate(8 122 165)">
            <rect x="110" y="155" width="24" height="18" rx="2" />
            <text x="122" y="168">&#9825;</text>
          </g>
          <g className="memjar-note-icon" transform="rotate(-6 100 185)">
            <rect x="88" y="176" width="24" height="18" rx="2" />
            <text x="100" y="189">&#9825;</text>
          </g>
          <g className="memjar-note-icon" transform="rotate(11 132 198)">
            <rect x="120" y="188" width="24" height="18" rx="2" />
            <text x="132" y="201">&#9825;</text>
          </g>
          <g className="memjar-note-icon" transform="rotate(4 96 210)">
            <rect x="84" y="200" width="24" height="18" rx="2" />
            <text x="96" y="213">&#9825;</text>
          </g>
        </svg>
      </div>

      <button className="memjar-btn" onClick={handlePull} disabled={stage === 'lifting' || stage === 'unfolding'}>
        {isFirstPull ? 'pull out a memory' : 'pull out another memory'}
      </button>

      <div className="memjar-note-stage">
        {pos > 0 && (
          <div className={`memjar-note memjar-note-${stage}`}>
            <p className="serif memjar-note-text">{currentText}</p>
          </div>
        )}
      </div>
    </section>
  );
}

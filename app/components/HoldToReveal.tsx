'use client';

import { useEffect, useRef, useState } from 'react';

export default function HoldToReveal() {
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [containerHidden, setContainerHidden] = useState(false);

  const holdingRef = useRef(false);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);

  const loop = () => {
    if (!holdingRef.current) return;
    progressRef.current += 0.8;
    setProgress(progressRef.current);

    if (progressRef.current >= 100) {
      setRevealed(true);
      setContainerHidden(true);
    } else {
      rafRef.current = requestAnimationFrame(loop);
    }
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) e.preventDefault();
    holdingRef.current = true;
    rafRef.current = requestAnimationFrame(loop);
  };

  const end = () => {
    holdingRef.current = false;
    cancelAnimationFrame(rafRef.current);
    if (!revealed) {
      progressRef.current = 0;
      setProgress(0);
    }
  };

  // Global mouseup / touchend so releasing outside button still stops
  useEffect(() => {
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
    return () => {
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchend', end);
    };
  }, [revealed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="section-padding">
      <p className="mono">don&apos;t rush</p>
      <div className={`hold-container${containerHidden ? ' completed' : ''}`}>
        <button
          id="hold-btn"
          className="serif"
          onMouseDown={start}
          onTouchStart={start}
        >
          press and hold
        </button>
        <div
          id="progress-fill"
          className="progress-track"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div id="secret-message" className={`hidden-content${revealed ? ' revealed' : ''}`}>
        <p className="serif" style={{ fontSize: '2rem', color: 'var(--accent-gold)' }}>
          Every clock I own runs slower on the days I get to talk to you.
        </p>
      </div>
    </section>
  );
}

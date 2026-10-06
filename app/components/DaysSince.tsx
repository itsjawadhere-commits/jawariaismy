'use client';

import { useEffect, useState } from 'react';
import { daysTogether } from '../lib/anniversary';

export default function DaysSince() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    // Pinned to Pakistan time, so it rolls over at midnight PKT for everyone.
    const calc = () => setDays(daysTogether());
    calc();
    const id = setInterval(calc, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section-padding reveal">
      <div
        id="days-since-counter"
        className="serif"
        style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', color: 'var(--accent-gold)' }}
      >
        {days}
      </div>
      <p className="mono">days since you got jealous that night and became mine.</p>
    </section>
  );
}

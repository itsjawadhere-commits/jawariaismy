'use client';

import { useEffect, useState } from 'react';

const START_DATE = new Date('October 6, 2025 00:00:00');

export default function DaysSince() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = Date.now() - START_DATE.getTime();
      setDays(Math.max(0, Math.floor(diff / 86400000)));
    };
    calc();
    const id = setInterval(calc, 3_600_000);
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

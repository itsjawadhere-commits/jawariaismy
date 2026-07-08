'use client';

import { useEffect, useState } from 'react';

const MET_DATE = new Date('2026-05-07T00:00:00+05:00');

export default function DaysMet() {
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState<string>('—');
  const [label, setLabel] = useState('days since the day we finally met.');

  useEffect(() => {
    const now = new Date();
    const diff = now.getTime() - MET_DATE.getTime();

    if (diff < 0) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const days = Math.floor(diff / 86400000);
    setCounter(days === 0 ? 'today ♡' : String(days));
    setLabel(days === 0 ? 'the day we finally met. ♡' : 'days since the day we finally met.');
  }, []);

  if (!visible) return null;

  return (
    <section className="section-padding reveal" id="days-met-section">
      <div
        id="days-met-counter"
        className="serif"
        style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', color: 'var(--accent-gold)' }}
      >
        {counter}
      </div>
      <p className="mono" id="days-met-label">
        {label}
      </p>
    </section>
  );
}

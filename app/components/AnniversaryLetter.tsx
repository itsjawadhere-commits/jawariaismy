'use client';

import { useEffect, useState } from 'react';
import { isAnniversaryReached } from '../lib/anniversary';
import { ANNIVERSARY_HEADING, ANNIVERSARY_LETTER } from '../lib/data/anniversaryLetter';

export default function AnniversaryLetter() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => setShow(isAnniversaryReached());
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!show) return null;

  return (
    <section id="anniversary-letter" className="anniv-letter section-padding">
      <h2 className="serif anniv-heading">{ANNIVERSARY_HEADING}</h2>
      <div className="anniv-body">
        {ANNIVERSARY_LETTER.map((p, i) => (
          <p key={i} className="serif">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

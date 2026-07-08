'use client';

import { useState } from 'react';

export interface EnvelopeItem {
  id: string;
  type: 'letter' | 'poem' | 'couplet';
  title: string;
  date?: string;
  content: string;
  language?: 'en' | 'ur';
}

export default function EnvelopeCard({ item }: { item: EnvelopeItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lp-envelope-outer">
      <p className="serif lp-envelope-title">{item.title}</p>

      <div
        className={`lp-envelope-wrap${open ? ' open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
      >
        {/* Envelope closed face */}
        <div className="lp-envelope-body">
          <div className="lp-envelope-flap" />
          {!open && <div className="lp-envelope-seal">♡</div>}
        </div>

        {/* Content — simple fade in */}
        <div className={`lp-content${open ? ' visible' : ''}`}>
          {item.language === 'ur' ? (
            <p className="urdu" style={{ padding: '2rem', width: '100%' }}>
              {item.content}
            </p>
          ) : (
            <p
              className="lp-envelope-letter"
              style={{ whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          )}
        </div>

        <p className="mono lp-tap-hint" style={open ? { color: 'var(--accent-gold)', opacity: 0.8 } : {}}>
          {open ? 'tap to close ✦' : 'tap to open ✦'}
        </p>
      </div>
    </div>
  );
}

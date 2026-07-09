'use client';

import { useEffect, useState } from 'react';
import { sendToPartner } from '../lib/sendToPartner';

type Tag = 'complaint' | 'venting' | 'quiet-days' | 'just-because';

const TAGS: { key: Tag; label: string }[] = [
  { key: 'complaint', label: 'a complaint' },
  { key: 'venting', label: 'just need to vent' },
  { key: 'quiet-days', label: "when we're not talking" },
  { key: 'just-because', label: 'just because' },
];

const TAG_LABELS: Record<Tag, string> = {
  complaint: 'a complaint',
  venting: 'just need to vent',
  'quiet-days': "when we're not talking",
  'just-because': 'just because',
};

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'offline';

const DRAFT_KEY = 'unsaid_draft_unsent';

export default function UnsaidNotes() {
  const [tag, setTag] = useState<Tag | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  // If a previous send failed (e.g. she closed the tab on a bad connection),
  // recover the unsent draft so it's never lost.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { message: string; tag: Tag | null };
        if (parsed.message) {
          setMessage(parsed.message);
          setTag(parsed.tag ?? null);
          setStatus('error');
        }
      }
    } catch {
      // ignore — nothing to recover
    }
  }, []);

  const persistDraft = (msg: string, t: Tag | null) => {
    try {
      if (msg.trim()) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ message: msg, tag: t }));
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch {
      // localStorage unavailable — send will still be attempted, just without
      // a local safety net
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === 'sending') return;

    // Save locally first — no matter what happens with the network, this
    // message is not lost.
    persistDraft(message, tag);

    if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
      setStatus('offline');
      return;
    }

    setStatus('sending');

    const ok = await sendToPartner({
      _subject: 'a note, just for you',
      _template: 'box',
      type: tag ? TAG_LABELS[tag] : 'not specified',
      message,
    });

    if (ok) {
      persistDraft('', null);
      setStatus('sent');
      setMessage('');
      setTag(null);
    } else {
      setStatus('error');
    }
  };

  const handleWriteAnother = () => {
    setStatus('idle');
  };

  return (
    <section className="section-padding reveal unsaid-section">
      <p className="mono" style={{ marginBottom: '0.5rem' }}>just for the two of us</p>
      <h1
        className="serif"
        style={{
          fontStyle: 'italic',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 300,
          letterSpacing: '0.02em',
          marginBottom: '0.8rem',
        }}
      >
        Unsaid
      </h1>
      <p
        className="serif unsaid-subtitle"
        style={{ opacity: 0.55, fontSize: '1rem', marginBottom: '3rem' }}
      >
        for the things you don&apos;t say out loud. a bad day, a complaint, something
        you&apos;re holding back, or just words on a day we&apos;re not talking.
        write it here, it comes straight to me, and only me.
      </p>

      {status === 'sent' ? (
        <div className="unsaid-sent">
          <p className="serif unsaid-sent-text">
            I have received it. I promise I will give it the attention it deserves.
          </p>
          <button className="memjar-btn" onClick={handleWriteAnother}>
            write another
          </button>
        </div>
      ) : (
        <form className="unsaid-form" onSubmit={handleSubmit}>
          <div className="unsaid-tag-grid">
            {TAGS.map(({ key, label }) => (
              <button
                type="button"
                key={key}
                className={`unsaid-tag-btn${tag === key ? ' active' : ''}`}
                onClick={() => setTag((prev) => (prev === key ? null : key))}
              >
                {label}
              </button>
            ))}
          </div>

          <textarea
            className="unsaid-textarea"
            placeholder="say whatever it is. take your time."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            required
          />

          <button
            type="submit"
            className="memjar-btn"
            disabled={status === 'sending' || !message.trim()}
          >
            {status === 'sending' ? 'sending…' : 'send it to him'}
          </button>

          {status === 'error' && (
            <p className="unsaid-error">
              something went wrong sending that — but what you wrote is safely
              saved right here, nothing is lost. try again whenever you&apos;re ready,
              or{' '}
              <a
                href={`mailto:itsjawadhere@gmail.com?subject=${encodeURIComponent(
                  'a note, just for you'
                )}&body=${encodeURIComponent(message)}`}
              >
                email it directly instead
              </a>
              .
            </p>
          )}
          {status === 'offline' && (
            <p className="unsaid-error">
              looks like there&apos;s no internet connection right now. what you
              wrote is saved here — reconnect and hit send again.
            </p>
          )}
        </form>
      )}
    </section>
  );
}

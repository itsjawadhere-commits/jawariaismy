'use client';

import { useState } from 'react';

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

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function UnsaidNotes() {
  const [tag, setTag] = useState<Tag | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === 'sending') return;

    setStatus('sending');

    try {
      const res = await fetch('https://formsubmit.co/ajax/itsjawadhere@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: 'a note, just for you',
          _template: 'box',
          type: tag ? TAG_LABELS[tag] : 'not specified',
          message,
        }),
      });

      if (!res.ok) throw new Error('failed to send');

      setStatus('sent');
      setMessage('');
      setTag(null);
    } catch {
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
        write it here, it comes straight to me and only me.
      </p>

      {status === 'sent' ? (
        <div className="unsaid-sent">
          <p className="serif unsaid-sent-text">
            it&apos;s been sent, quietly. only I&apos;ll read it, and I&apos;ll take it
            seriously — I promise.
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
            {status === 'sending' ? 'sending…' : 'send it to him, quietly'}
          </button>

          {status === 'error' && (
            <p className="unsaid-error">
              something went wrong sending that. please try again in a bit.
            </p>
          )}
        </form>
      )}
    </section>
  );
}

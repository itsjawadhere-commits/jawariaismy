'use client';

import { useEffect, useState } from 'react';
import MainContent from '../components/MainContent';

type Message = {
  id: string;
  created_at: string;
  source: 'unsaid' | 'journal';
  tag: string | null;
  message: string;
};

const SESSION_KEY = 'inbox_passcode';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function InboxPage() {
  const [passcode, setPasscode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<'idle' | 'checking' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const fetchMessages = async (code: string) => {
    setStatus('checking');
    setErrorText('');
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorText(data?.error ?? 'something went wrong');
        try {
          sessionStorage.removeItem(SESSION_KEY);
        } catch {
          // ignore
        }
        return;
      }

      setMessages(data.messages ?? []);
      setUnlocked(true);
      setStatus('idle');
      try {
        sessionStorage.setItem(SESSION_KEY, code);
      } catch {
        // ignore — just means she'll need to re-enter the passcode next visit
      }
    } catch {
      setStatus('error');
      setErrorText('could not reach the inbox — check your connection and try again');
    }
  };

  // If this tab already unlocked the inbox earlier this session, skip the
  // passcode prompt automatically.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        setPasscode(saved);
        fetchMessages(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || status === 'checking') return;
    fetchMessages(passcode.trim());
  };

  const handleRefresh = () => {
    if (passcode) fetchMessages(passcode);
  };

  return (
    <MainContent>
      <section className="section-padding" style={{ minHeight: '100vh' }}>
        <p className="mono" style={{ marginBottom: '0.5rem' }}>just for you</p>
        <h1
          className="serif"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            marginBottom: '2rem',
          }}
        >
          Inbox
        </h1>

        {!unlocked ? (
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '360px' }}
          >
            <input
              type="password"
              className="unsaid-textarea"
              style={{ minHeight: 'unset', height: 'auto', padding: '0.9rem 1rem' }}
              placeholder="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="memjar-btn"
              disabled={status === 'checking' || !passcode.trim()}
            >
              {status === 'checking' ? 'checking…' : 'unlock'}
            </button>
            {status === 'error' && <p className="unsaid-error">{errorText}</p>}
          </form>
        ) : (
          <>
            <button
              className="journal-link-btn"
              onClick={handleRefresh}
              style={{ marginBottom: '2rem' }}
            >
              {status === 'checking' ? 'refreshing…' : 'refresh'}
            </button>

            {messages.length === 0 ? (
              <p className="mono journal-empty">nothing here yet.</p>
            ) : (
              <div className="journal-entries" style={{ maxWidth: '640px' }}>
                {messages.map((m) => (
                  <div className="journal-card" key={m.id}>
                    <div className="journal-card-top">
                      <span className="mono journal-date">{formatDate(m.created_at)}</span>
                      <span className="mono journal-badge shared">
                        {m.source === 'journal' ? 'journal' : m.tag ?? 'unsaid'}
                      </span>
                    </div>
                    <p className="serif journal-text">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </MainContent>
  );
}

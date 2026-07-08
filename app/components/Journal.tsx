'use client';

import { useEffect, useState } from 'react';

type Visibility = 'private' | 'shared';
type SendStatus = 'sent' | 'pending' | 'error';

type JournalEntry = {
  id: string;
  text: string;
  date: string; // ISO string
  visibility: Visibility;
  sendStatus?: SendStatus; // only relevant when visibility === 'shared'
};

const STORAGE_KEY = 'journal_entries';

function makeId() {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // fall through
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable — entries just won't persist this session
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

async function sendToPartner(text: string): Promise<boolean> {
  try {
    const res = await fetch('https://formsubmit.co/ajax/itsjawadhere@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: 'a page from her journal',
        _template: 'box',
        type: 'journal entry (shared)',
        message: text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [draft, setDraft] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    setEntries(loadEntries());
    setHydrated(true);
  }, []);

  const handleSave = async () => {
    if (!draft.trim() || saving) return;
    setSaving(true);

    const entry: JournalEntry = {
      id: makeId(),
      text: draft.trim(),
      date: new Date().toISOString(),
      visibility,
      sendStatus: visibility === 'shared' ? 'pending' : undefined,
    };

    // save locally right away so nothing is ever lost, even if sending fails
    const withNew = [entry, ...entries];
    setEntries(withNew);
    saveEntries(withNew);
    setDraft('');
    setVisibility('private');

    if (entry.visibility === 'shared') {
      const ok = await sendToPartner(entry.text);
      setEntries((prev) => {
        const next = prev.map((e) =>
          e.id === entry.id ? { ...e, sendStatus: (ok ? 'sent' : 'error') as SendStatus } : e
        );
        saveEntries(next);
        return next;
      });
    }

    setSaving(false);
  };

  const handleResend = async (id: string) => {
    const target = entries.find((e) => e.id === id);
    if (!target) return;

    setEntries((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, sendStatus: 'pending' as SendStatus } : e));
      saveEntries(next);
      return next;
    });

    const ok = await sendToPartner(target.text);
    setEntries((prev) => {
      const next = prev.map((e) =>
        e.id === id ? { ...e, sendStatus: (ok ? 'sent' : 'error') as SendStatus } : e
      );
      saveEntries(next);
      return next;
    });
  };

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (id: string) => {
    if (!editText.trim()) return;
    const next = entries.map((e) => (e.id === id ? { ...e, text: editText.trim() } : e));
    setEntries(next);
    saveEntries(next);
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveEntries(next);
  };

  return (
    <section className="section-padding reveal journal-section">
      <p className="mono" style={{ marginBottom: '0.5rem' }}>your pages</p>
      <h2
        className="serif"
        style={{
          fontStyle: 'italic',
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          fontWeight: 300,
          letterSpacing: '0.01em',
          marginBottom: '0.8rem',
        }}
      >
        Journal
      </h2>
      <p className="serif journal-subtitle" style={{ opacity: 0.55, fontSize: '1rem', marginBottom: '2.5rem' }}>
        a page just for you. write here whenever you need to, kept only on
        this device unless you choose to let me read it too.
      </p>

      <div className="journal-form">
        <textarea
          className="unsaid-textarea"
          placeholder="dear journal..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={6}
        />

        <div className="journal-visibility-row">
          <button
            type="button"
            className={`unsaid-tag-btn${visibility === 'private' ? ' active' : ''}`}
            onClick={() => setVisibility('private')}
          >
            just for me
          </button>
          <button
            type="button"
            className={`unsaid-tag-btn${visibility === 'shared' ? ' active' : ''}`}
            onClick={() => setVisibility('shared')}
          >
            let him read this one
          </button>
        </div>

        <button
          type="button"
          className="memjar-btn"
          onClick={handleSave}
          disabled={!draft.trim() || saving}
        >
          {saving ? 'saving…' : 'save entry'}
        </button>
      </div>

      <div className="journal-entries">
        {!hydrated ? null : entries.length === 0 ? (
          <p className="mono journal-empty">no pages yet. the first one is waiting.</p>
        ) : (
          entries.map((entry) => (
            <div className="journal-card" key={entry.id}>
              <div className="journal-card-top">
                <span className="mono journal-date">{formatDate(entry.date)}</span>
                <span className={`mono journal-badge${entry.visibility === 'shared' ? ' shared' : ''}`}>
                  {entry.visibility === 'shared' ? 'shared with him' : 'private'}
                </span>
              </div>

              {editingId === entry.id ? (
                <div className="journal-edit-wrap">
                  <textarea
                    className="unsaid-textarea"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={5}
                  />
                  <div className="journal-card-actions">
                    <button className="memjar-btn" onClick={() => saveEdit(entry.id)} disabled={!editText.trim()}>
                      save
                    </button>
                    <button className="journal-link-btn" onClick={cancelEdit}>
                      cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="serif journal-text">{entry.text}</p>
                  <div className="journal-card-actions">
                    <button className="journal-link-btn" onClick={() => startEdit(entry)}>
                      edit
                    </button>
                    <button className="journal-link-btn" onClick={() => handleDelete(entry.id)}>
                      delete
                    </button>
                    {entry.visibility === 'shared' && entry.sendStatus === 'error' && (
                      <button className="journal-link-btn" onClick={() => handleResend(entry.id)}>
                        retry send
                      </button>
                    )}
                  </div>
                  {entry.visibility === 'shared' && (
                    <p className="mono journal-send-status">
                      {entry.sendStatus === 'pending' && 'sending to him…'}
                      {entry.sendStatus === 'sent' && 'delivered to him'}
                      {entry.sendStatus === 'error' && "couldn't reach him — still saved here"}
                    </p>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

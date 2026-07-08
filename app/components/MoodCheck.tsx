'use client';

import { useState } from 'react';
import { MOOD_RESPONSES, type MoodKey } from '../lib/data/moodResponses';

const MOODS: { key: MoodKey; emoji: string; label: string }[] = [
  { key: 'happy',   emoji: '🍀',  label: 'happy'      },
  { key: 'sad',     emoji: '🌧',  label: 'sad'        },
  { key: 'tired',   emoji: '🕊',  label: 'tired'      },
  { key: 'anxious', emoji: '🍃',  label: 'anxious'    },
  { key: 'loved',   emoji: '🧸',  label: 'loved'      },
  { key: 'numb',    emoji: '🌫',  label: 'numb'       },
  { key: 'silly',   emoji: '🍭',  label: 'silly'      },
  { key: 'missing', emoji: '💌',  label: 'missing you' },
];

export default function MoodCheck() {
  const [active, setActive] = useState<MoodKey | null>(null);
  const [response, setResponse] = useState('');
  const [visible, setVisible] = useState(false);

  const handleMood = (key: MoodKey) => {
    setActive(key);
    setVisible(false);
    setTimeout(() => {
      setResponse(MOOD_RESPONSES[key]);
      setVisible(true);
    }, 300);
  };

  return (
    <section className="section-padding reveal">
      <p className="mono" style={{ marginBottom: '0.5rem' }}>
        how are you feeling
      </p>
      <p className="serif" style={{ opacity: 0.6, fontSize: '1rem', marginBottom: '0.5rem' }}>
        right now, honestly
      </p>
      <div className="mood-grid">
        {MOODS.map(({ key, emoji, label }) => (
          <button
            key={key}
            className={`mood-btn${active === key ? ' active' : ''}`}
            data-mood={key}
            onClick={() => handleMood(key)}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
      <p id="mood-response" className={visible ? 'show' : ''}>
        {response}
      </p>
    </section>
  );
}

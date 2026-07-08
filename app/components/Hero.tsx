'use client';

import { useEffect, useRef, useState } from 'react';

const SCRAMBLE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
const NAME = 'Jawaria';

function getPKTGreeting(): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Karachi',
    hour: 'numeric',
    hour12: false,
  };
  const pktHour = parseInt(
    new Intl.DateTimeFormat('en-US', options).format(new Date())
  );
  if (pktHour >= 5 && pktHour < 12) return 'Morning light suits you,';
  if (pktHour >= 12 && pktHour < 18) return 'The day is better with you,';
  if (pktHour >= 18 && pktHour < 22) return 'The evening is listening to you,';
  return 'The world is asleep, just for you,';
}

function formatCountdown(diff: number) {
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(d).padStart(2, '0')}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

function getReturnWhisper(visitCount: number): string | null {
  if (visitCount <= 1) return null;
  const whispers = [
    'you came back. i noticed.',
    'still here. so am i.',
    'every visit, a little more yours.',
    'the sky remembers you were just here.',
    'this place waits for you better than anywhere else does.',
  ];
  return whispers[(visitCount - 2) % whispers.length];
}

export default function Hero() {
  const [greeting, setGreeting] = useState('...');
  const [displayName, setDisplayName] = useState(NAME);
  const [countdown, setCountdown] = useState('00d 00h 00m 00s');
  const [subtext, setSubtext] = useState('Until the 31st returns.');
  const [whisper, setWhisper] = useState<string | null>(null);
  const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setGreeting(getPKTGreeting());
  }, []);

  useEffect(() => {
    try {
      const count = parseInt(localStorage.getItem('visit_count') ?? '0', 10) + 1;
      localStorage.setItem('visit_count', String(count));
      setWhisper(getReturnWhisper(count));
    } catch {
      // localStorage unavailable — skip silently
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const isBirthday = now.getMonth() === 2 && now.getDate() === 31;

      if (isBirthday) {
        setCountdown('Happy Birthday my love!');
        setSubtext('The 31st is here.');
        return;
      }

      const target = new Date(`March 31, ${now.getFullYear()} 00:00:00`);
      if (now > target) target.setFullYear(target.getFullYear() + 1);
      setCountdown(formatCountdown(target.getTime() - now.getTime()));
      setSubtext('Until the 31st returns.');
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleMouseOver = () => {
    if (scrambleRef.current) clearInterval(scrambleRef.current);
    let iteration = 0;
    scrambleRef.current = setInterval(() => {
      setDisplayName(
        NAME.split('')
          .map((_, idx) => {
            if (idx < iteration) return NAME[idx];
            return SCRAMBLE_LETTERS[Math.floor(Math.random() * SCRAMBLE_LETTERS.length)];
          })
          .join('')
      );
      if (iteration >= NAME.length) {
        clearInterval(scrambleRef.current!);
        setDisplayName(NAME);
      }
      iteration += 1 / 4;
    }, 30);
  };

  return (
    <section className="section-padding">
      <p id="time-greeting" className="mono greeting-text">
        {greeting}
      </p>
      <h1
        className="name serif"
        data-value={NAME}
        onMouseOver={handleMouseOver}
      >
        {displayName}
      </h1>
      <div id="countdown" className="mono">
        {countdown}
      </div>
      <p className="mono">{subtext}</p>
      {whisper && (
        <p className="mono return-whisper">{whisper}</p>
      )}
    </section>
  );
}

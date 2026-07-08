'use client';

import { useEffect, useState } from 'react';

export default function BirthdaySection() {
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Karachi',
      month: 'numeric',
      day: 'numeric',
    };
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(new Date());
    const month = parseInt(parts.find((p) => p.type === 'month')!.value);
    const day = parseInt(parts.find((p) => p.type === 'day')!.value);
    setIsBirthday(month === 3 && day === 31);
  }, []);

  if (!isBirthday) return null;

  return (
    <section id="birthday-gate" className="section-padding">
      <div
        id="birthday-content"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
      >
        <h2 className="serif" style={{ fontSize: '3.5rem', marginBottom: '2.5rem', textAlign: 'right' }}>
          Happy Birthday, My Jawaria
        </h2>
        <p
          className="serif"
          style={{ maxWidth: 600, marginBottom: '2rem', fontSize: '1.2rem', textAlign: 'justify', marginLeft: 'auto' }}
        >
          Today feels like the world paused for a second just to make space for you and somehow
          i&apos;m the lucky one, existing in the same timeline, breathing the same air, getting
          to know you in ways no one else does. That&apos;s a flex actually. It&apos;s a quiet
          kind of miracle, having you here, having you in my life.
        </p>
        <p
          className="serif"
          style={{ maxWidth: 600, marginBottom: '2rem', fontSize: '1.2rem', textAlign: 'justify', marginLeft: 'auto' }}
        >
          But this year, i don&apos;t want to love you on autopilot really. i want to love you
          with intention to notice the small things i might&apos;ve missed, the shifts in your
          voice, the cries you don&apos;t explain early on, the thoughts you keep just beneath the
          surface. i want to understand you, not just be close to you.
        </p>
        <p
          className="serif"
          style={{ maxWidth: 600, marginBottom: '2rem', fontSize: '1.2rem', textAlign: 'justify', marginLeft: 'auto' }}
        >
          I want to learn your silences the way people learn songs, to be the place you come to
          when everything feels heavy and the reason you smile when it suddenly doesn&apos;t. and
          no matter how much time passes, i never want you to feel ordinary to me. i want that
          same pull, that same wonder like who trapped who but I&apos;d love you like i&apos;m
          still discovering you for the first time.
        </p>
        <p
          className="serif"
          style={{ maxWidth: 600, fontSize: '1.2rem', textAlign: 'justify', marginLeft: 'auto' }}
        >
          and just so you know, i do plan on annoying you consistently this year too but just in a
          more thoughtful, premium kind of way because you&apos;re not just someone in my life,
          you&apos;re the part that softens everything and you give me teas i didn&apos;t know i
          needed so i love you deeply, honestly and for everything.
        </p>
      </div>
    </section>
  );
}

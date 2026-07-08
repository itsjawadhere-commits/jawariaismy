'use client';

import { useEffect, useState } from 'react';

// Unlock datetime: May 7, 2026 15:00 PKT (UTC+5) = 10:00 UTC
const UNLOCK_UTC = new Date('2026-05-07T10:00:00Z');
// Reference dates used purely to compute the "written X days before we met" note
const WRITTEN_DATE = new Date('2026-02-01T00:00:00+05:00');
const MET_DATE = new Date('2026-05-07T00:00:00+05:00');

export default function SealedEnvelope() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('opens in —');
  const [writtenNote, setWrittenNote] = useState('');

  useEffect(() => {
    setWrittenNote(
      `written ${Math.round((MET_DATE.getTime() - WRITTEN_DATE.getTime()) / 86400000)} days before we met.`
    );
  }, []);

  useEffect(() => {
    const isPreview = new URLSearchParams(window.location.search).get('preview') === '1';

    const checkUnlock = () => {
      const now = new Date();
      const shouldUnlock = isPreview || now >= UNLOCK_UTC;

      if (shouldUnlock) {
        setOpen(true);
        setLabel(
          isPreview
            ? '✦ preview mode, this is how it will look on may 7th at 3pm'
            : 'opened the day we finally met. ♡'
        );
      } else {
        const diff = UNLOCK_UTC.getTime() - now.getTime();
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        setLabel(`opens in ${d}d ${h}h ${m}m ✦`);
      }
    };

    checkUnlock();
    const id = setInterval(checkUnlock, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section-padding reveal">
      <p className="mono" style={{ marginBottom: '0.5rem' }}>
        a sealed letter
      </p>
      <p className="serif" style={{ opacity: 0.6, fontSize: '1rem', marginBottom: '1rem' }}>
        locked until the day we meet
      </p>
      <div className={`envelope-wrap${open ? ' open' : ''}`} id="envelope-wrap">
        <div className="envelope-body">
          <div className="envelope-flap" />
          <div className="envelope-seal">♡</div>
          <p className="envelope-letter" id="envelope-letter">
            Alright, one thing is confirmed, by the time you&apos;ll be reading this, you&apos;d be
            sitting next to me. Or maybe on my lap if you are not being shy right now. But when the
            fuck we are going to meet I mean I have no idea in heaven or hell. It will be the most
            unstable emotional kicker day for both of us. Oh, you think I&apos;m going to act all
            okay and cool? I bet you, I&apos;d be kicking my feet in the air on my way to you. But
            what do I get you? If I tell you right now, even giving you a hint might ruin the
            surprise and my future self will hate me for it. But leave all that.
            <br />
            <br />
            Something that started on 14th august with a single text and now we&apos;re sitting
            into each other&apos;s presence is nothing less than a miracle of possibilities. But
            the possibility of &quot;what if we never meet&quot; exists as well. Don&apos;t kick me
            in the nuts if you&apos;re reading this alright, I&apos;m just afraid to lose you
            that&apos;s all. I love you more than a man could love so the mixture of getting what
            one wants sometimes scare you off as well. But at the same time, something about this
            doesn&apos;t feel temporary. I&apos;ve tried to doubt it, it just doesn&apos;t sit
            right.
            <br />
            <br />
            It&apos;s February now and I think I should code something into the website that will
            count the days since October and we&apos;ll see after how many days we meet, if we
            meet.
            <br />
            <br />
            Okay let&apos;s assume we are meeting today, what do I notice first thing about you?
            Your smile? More like blushes. Or how your almondy doe eyes change when you smile. I
            keep wondering what the first 5 seconds will look like. Do we just stand there like
            idiots or do I pull you in before my brain even catches up or or…
            <br />
            <br />
            Being honest don&apos;t want to bore you with this letter, if you&apos;re next to me,
            kiss me already. (I&apos;m jealous of my lucky future self). Bye.
            <br />
            <br />
            <span
              id="envelope-written-note"
              style={{
                fontSize: '0.8rem',
                opacity: 0.45,
                fontStyle: 'normal',
                fontFamily: 'var(--mono-font)',
                letterSpacing: '0.05em',
              }}
            >
              {writtenNote}
            </span>
          </p>
        </div>
      </div>
      <p
        id="envelope-label"
        className="mono"
        style={{
          marginTop: '1rem',
          opacity: open ? 0.8 : 0.5,
          color: open ? 'var(--accent-gold)' : undefined,
        }}
      >
        {label}
      </p>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { PROMISES } from '../lib/data/promises';

export default function PromiseJar() {
  const [slipText, setSlipText] = useState('tap to unfold a promise');
  const [slipVisible, setSlipVisible] = useState(false);
  const [btnText, setBtnText] = useState('unfold one');
  const [btnDisabled, setBtnDisabled] = useState(false);

  // Restore today's promise on mount
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem('promise_date');
      const storedPromise = localStorage.getItem('promise_text');

      if (storedDate === today && storedPromise) {
        setSlipText(storedPromise);
        setSlipVisible(true);
        setBtnText('come back tomorrow');
        setBtnDisabled(true);
      }
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, []);

  const handleUnfold = () => {
    const today = new Date().toDateString();

    try {
      const usedDate = localStorage.getItem('promise_date');
      if (usedDate === today) {
        setSlipVisible(false);
        setTimeout(() => {
          setSlipText('patience, my love. one promise a day only.');
          setSlipVisible(true);
        }, 300);
        return;
      }

      const last = localStorage.getItem('promise_text') ?? '';
      let p = last;
      while (p === last) {
        p = PROMISES[Math.floor(Math.random() * PROMISES.length)];
      }

      localStorage.setItem('promise_date', today);
      localStorage.setItem('promise_text', p);

      setSlipVisible(false);
      setTimeout(() => {
        setSlipText(p);
        setSlipVisible(true);
        setBtnText('come back tomorrow');
        setBtnDisabled(true);
      }, 300);
    } catch {
      // localStorage unavailable — just show a random promise without persisting
      const p = PROMISES[Math.floor(Math.random() * PROMISES.length)];
      setSlipVisible(false);
      setTimeout(() => {
        setSlipText(p);
        setSlipVisible(true);
      }, 300);
    }
  };

  return (
    <section className="section-padding reveal">
      <p className="mono" style={{ marginBottom: '0.5rem' }}>
        the promise jar
      </p>
      <p className="serif" style={{ opacity: 0.6, fontSize: '1rem', marginBottom: '1rem' }}>
        small things i swear to you
      </p>
      <div className="jar-wrap" id="jar-wrap">
        <div className="jar-lid" />
        <div className="jar-body">
          <div className="jar-glow" />
          <p id="jar-slip" className={`jar-slip${slipVisible ? ' show' : ''}`}>
            {slipText}
          </p>
        </div>
      </div>
      <button
        id="promise-btn"
        onClick={handleUnfold}
        disabled={btnDisabled}
        style={btnDisabled ? { opacity: 0.4 } : {}}
      >
        {btnText}
      </button>
    </section>
  );
}

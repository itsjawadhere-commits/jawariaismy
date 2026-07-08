'use client';

import { useEffect, useRef, useState } from 'react';

function formatTime(secs: number): string {
  if (isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function AudioPlayer() {
  const audioRef   = useRef<HTMLAudioElement>(null);
  const [btnLabel, setBtnLabel]   = useState('play');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [fillPct, setFillPct]     = useState(0);
  const [timeStr, setTimeStr]     = useState('0:00 / 0:00');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setFillPct(pct);
      setTimeStr(`${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`);
    };

    const onLoadedMetadata = () => {
      setTimeStr(`0:00 / ${formatTime(audio.duration)}`);
    };

    const onEnded = () => {
      setBtnLabel('play');
      setFillPct(0);
      audio.currentTime = 0;
      setTimeStr(`0:00 / ${formatTime(audio.duration)}`);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setBtnLabel('buffering...');
      setBtnDisabled(true);

      const play = () => {
        audio.play();
        setBtnLabel('pause');
        setBtnDisabled(false);
        audio.removeEventListener('canplaythrough', play);
      };

      if (audio.readyState >= 3) {
        audio.play();
        setBtnLabel('pause');
        setBtnDisabled(false);
      } else {
        audio.addEventListener('canplaythrough', play);
      }
    } else {
      audio.pause();
      setBtnLabel('play');
    }
  };

  return (
    <section className="section-padding reveal">
      <p className="mono" style={{ marginBottom: '2rem' }}>
        use headphones (its a rant)
      </p>
      <div className="audio-container">
        <button
          id="play-pause-btn"
          className="mono"
          onClick={handlePlayPause}
          disabled={btnDisabled}
        >
          {btnLabel}
        </button>
        <div className="audio-track">
          <div
            id="audio-fill"
            className="audio-fill"
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <p id="audio-time" className="mono">
          {timeStr}
        </p>
        {/* Place your audio file at public/Audio Note.mp4 */}
        <audio id="voice-note" ref={audioRef} src="/Audio%20Note.mp4" />
      </div>
      <p className="serif" style={{ maxWidth: 720, opacity: 0.8, fontSize: '1.2rem', marginTop: '2rem' }}>
        Some things are better heard than read.
      </p>
    </section>
  );
}

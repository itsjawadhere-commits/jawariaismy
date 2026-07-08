'use client';

import { useEffect, useRef, useState } from 'react';

const MUSIC_VOLUME = 0.5; // normal background level
const DUCK_VOLUME = 0.15; // lowered while the home page voice note plays
const FADE_MS = 500;

// The voice-note <audio> on the home page (see AudioPlayer.tsx) has this id.
const VOICE_NOTE_ID = 'voice-note';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);
  const duckedRef = useRef(false);
  const fadeFrameRef = useRef<number | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Reflect the muted preference onto the element whenever it changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.muted = isMuted;
  }, [isMuted]);

  const fadeTo = (target: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeFrameRef.current !== null) cancelAnimationFrame(fadeFrameRef.current);

    const start = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - startTime) / FADE_MS, 1);
      audio.volume = start + (target - start) * t;
      if (t < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
      }
    };
    fadeFrameRef.current = requestAnimationFrame(step);
  };

  // Start playback on the very first user interaction, per browser autoplay
  // policy — no attempt to autoplay before that.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = MUSIC_VOLUME;
    audio.loop = true;

    const tryStart = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      audio.play().catch(() => {
        // If it still fails (rare), allow another interaction to retry.
        startedRef.current = false;
      });
      setHasStarted(true);
    };

    const events: (keyof WindowEventMap)[] = [
      'pointerdown',
      'keydown',
      'touchstart',
      'wheel',
    ];
    events.forEach((evt) =>
      window.addEventListener(evt, tryStart, { once: true, passive: true })
    );

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, tryStart));
    };
  }, []);

  // Duck the music whenever the home page voice note is playing, and restore
  // it when that note pauses/ends. Uses capture-phase listeners on the
  // document so it works no matter when the voice-note element mounts
  // (it only exists on the home page, not on every route).
  useEffect(() => {
    const isVoiceNote = (target: EventTarget | null) =>
      target instanceof HTMLElement && target.id === VOICE_NOTE_ID;

    const duck = (e: Event) => {
      if (!isVoiceNote(e.target)) return;
      duckedRef.current = true;
      fadeTo(DUCK_VOLUME);
    };

    const restore = (e: Event) => {
      if (!isVoiceNote(e.target)) return;
      duckedRef.current = false;
      fadeTo(MUSIC_VOLUME);
    };

    document.addEventListener('play', duck, true);
    document.addEventListener('pause', restore, true);
    document.addEventListener('ended', restore, true);

    return () => {
      document.removeEventListener('play', duck, true);
      document.removeEventListener('pause', restore, true);
      document.removeEventListener('ended', restore, true);
    };
  }, []);

  const toggleMute = () => setIsMuted((m) => !m);

  return (
    <>
      {/* Place your track at public/music/background-music.mp3 */}
      <audio ref={audioRef} src="/music/background-music.mp3" preload="auto" />
      <button
        type="button"
        className={`music-toggle${hasStarted ? ' visible' : ''}${isMuted ? ' is-muted' : ''}`}
        onClick={toggleMute}
        aria-label={isMuted ? 'unmute background music' : 'mute background music'}
        aria-pressed={isMuted}
      >
        {isMuted ? (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
            <path
              d="M16 9l5 6M21 9l-5 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
            <path
              d="M15.5 8.5a4.5 4.5 0 0 1 0 7M18 6a8 8 0 0 1 0 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </>
  );
}

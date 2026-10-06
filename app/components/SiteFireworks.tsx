'use client';

import { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  hue: number;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  hue: number;
}

// Warm palette that matches the gold accent, with a few soft rose/ivory tones.
const HUES = [38, 42, 30, 345, 20, 48];

export default function SiteFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // no motion at all for people who ask for less of it

    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    const MAX_SPARKS = isMobile ? 260 : 600;
    const SPARKS_PER_BURST = isMobile ? 34 : 60;
    const LAUNCH_EVERY = isMobile ? [1800, 3200] : [900, 2200];

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };
    window.addEventListener('resize', onResize);

    const sparks: Spark[] = [];
    const rockets: Rocket[] = [];
    let nextLaunch = performance.now() + 600;
    let raf: number | null = null;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const launch = () => {
      rockets.push({
        x: rand(width * 0.08, width * 0.92),
        y: height + 10,
        vy: -rand(height * 0.011, height * 0.015),
        targetY: rand(height * 0.12, height * 0.55),
        hue: HUES[Math.floor(Math.random() * HUES.length)],
      });
    };

    const burst = (x: number, y: number, hue: number) => {
      const room = MAX_SPARKS - sparks.length;
      const n = Math.min(SPARKS_PER_BURST, room);
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + rand(-0.08, 0.08);
        const speed = rand(1.2, 3.6);
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: rand(0.008, 0.016),
          hue: hue + rand(-8, 8),
          size: rand(0.9, 1.8),
        });
      }
    };

    const frame = (now: number) => {
      // Fade the previous frame instead of clearing, for soft trails. The
      // canvas is transparent, so use destination-out to fade toward clear
      // (never toward black) and let the page background show through.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      if (now >= nextLaunch) {
        launch();
        nextLaunch = now + rand(LAUNCH_EVERY[0], LAUNCH_EVERY[1]);
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy *= 0.985;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${r.hue}, 80%, 80%, 0.9)`;
        ctx.fill();
        if (r.y <= r.targetY || Math.abs(r.vy) < 0.8) {
          burst(r.x, r.y, r.hue);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.985;
        s.vy = s.vy * 0.985 + 0.028; // gentle gravity
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 85%, 68%, ${s.life * 0.85})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf === null) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    if (!document.hidden) start();
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, []);

  return <canvas ref={canvasRef} id="site-fireworks" aria-hidden="true" role="presentation" />;
}

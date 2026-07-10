'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  driftX: number;
  driftY: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const DENSITY = 9000; // px^2 per particle — lower = more particles
const MAX_PARTICLES = 90;

export default function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const makeParticles = () => {
      const count = Math.min(
        MAX_PARTICLES,
        Math.floor((width * height) / DENSITY)
      );
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.4,
        baseOpacity: Math.random() * 0.35 + 0.15,
        driftX: (Math.random() - 0.5) * 0.08,
        driftY: Math.random() * 0.12 + 0.03,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
    };

    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };
    window.addEventListener('resize', onResize);

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 245, ${p.baseOpacity})`;
        ctx.fill();
      });
    };

    if (prefersReducedMotion) {
      // Respect reduced-motion: render a static, non-animated sprinkle of particles.
      drawStatic();
      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener('resize', onResize);
      };
    }

    let frame = 0;
    const drawFrame = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        p.x += p.driftX;
        p.y += p.driftY;

        if (p.y > height + 4) {
          p.y = -4;
          p.x = Math.random() * width;
        }
        if (p.x > width + 4) p.x = -4;
        if (p.x < -4) p.x = width + 4;

        const twinkle =
          (Math.sin(frame * p.twinkleSpeed + p.twinklePhase) + 1) / 2;
        const opacity = p.baseOpacity * (0.6 + 0.4 * twinkle);

        // Soft glow via a larger, low-opacity circle drawn underneath the
        // core dot, instead of ctx.shadowBlur. shadowBlur forces a blur
        // filter pass on every single fill, which is one of the more
        // expensive things Canvas2D can do at 60fps — two plain fills per
        // particle is far cheaper at this particle count, with a near
        // identical soft look.
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(207, 170, 110, ${opacity * 0.35})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 245, ${opacity})`;
        ctx.fill();
      });
    };

    // Run the loop only while the tab is actually visible. Most browsers
    // throttle rAF in background tabs anyway, but explicitly stopping (rather
    // than relying on that throttling) means zero canvas work happens at all
    // while this page isn't the one being looked at — meaningful over a long
    // session on a phone, since this canvas covers the whole viewport on
    // every route in the site.
    const startLoop = () => {
      if (rafRef.current !== null) return;
      const loopFrame = () => {
        drawFrame();
        rafRef.current = requestAnimationFrame(loopFrame);
      };
      rafRef.current = requestAnimationFrame(loopFrame);
    };

    const stopLoop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    if (!document.hidden) startLoop();

    const handleVisibility = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      stopLoop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="ambient-particles"
      aria-hidden="true"
      role="presentation"
    />
  );
}

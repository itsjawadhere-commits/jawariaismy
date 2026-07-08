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
    const tick = () => {
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

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 245, ${opacity})`;
        ctx.shadowBlur = p.radius * 2;
        ctx.shadowColor = 'rgba(207, 170, 110, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
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

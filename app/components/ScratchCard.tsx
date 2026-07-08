'use client';

import { useEffect, useRef } from 'react';

export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wrap = canvas.parentElement!;
    canvas.width = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;

    const ctx = canvas.getContext('2d')!;

    // Gold-tinted dark overlay layer
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#1a1408');
    grad.addColorStop(1, '#251d0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hint text on the scratch layer
    ctx.fillStyle = 'rgba(207,170,110,0.5)';
    ctx.font = '11px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('scratch here ✦', canvas.width / 2, canvas.height / 2 - 8);
    ctx.fillText('something is waiting', canvas.width / 2, canvas.height / 2 + 10);

    ctx.globalCompositeOperation = 'destination-out';

    let scratching = false;

    const scratch = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    };

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const src = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0]
        : (e as MouseEvent);
      return {
        x: (src.clientX - rect.left) * (canvas.width / rect.width),
        y: (src.clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      scratching = true;
      const p = getPos(e);
      scratch(p.x, p.y);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!scratching) return;
      const p = getPos(e);
      scratch(p.x, p.y);
    };
    const onMouseUp = () => { scratching = false; };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      scratching = true;
      const p = getPos(e);
      scratch(p.x, p.y);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!scratching) return;
      const p = getPos(e);
      scratch(p.x, p.y);
    };
    const onTouchEnd = () => { scratching = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="scratch-wrap">
      <div className="scratch-reveal">
        <p>every good thing I imagine for my future has your face in it.</p>
      </div>
      <canvas id="scratch-canvas" ref={canvasRef} />
    </div>
  );
}

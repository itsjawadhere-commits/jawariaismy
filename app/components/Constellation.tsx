'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CONSTELLATION_MSGS } from '../lib/data/constellationMsgs';

const STAR_RATIOS = [
  { x: 0.15, y: 0.2  }, { x: 0.35, y: 0.1  }, { x: 0.6,  y: 0.18 }, { x: 0.8,  y: 0.08 },
  { x: 0.1,  y: 0.5  }, { x: 0.3,  y: 0.45 }, { x: 0.55, y: 0.38 }, { x: 0.75, y: 0.55 },
  { x: 0.2,  y: 0.75 }, { x: 0.45, y: 0.7  }, { x: 0.65, y: 0.8  }, { x: 0.88, y: 0.75 },
  { x: 0.5,  y: 0.55 }, { x: 0.92, y: 0.4  }, { x: 0.05, y: 0.88 },
];

interface Star  { x: number; y: number; connected: boolean; }
interface Line  { x1: number; y1: number; x2: number; y2: number; }

export default function Constellation() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const starsRef   = useRef<Star[]>([]);
  const linesRef   = useRef<Line[]>([]);
  const lastStarRef = useRef<Star | null>(null);
  const [msg, setMsg] = useState('');
  const [msgVisible, setMsgVisible] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(207,170,110,0.35)';
    ctx.lineWidth = 1;
    linesRef.current.forEach((l) => {
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
    });

    starsRef.current.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.connected ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = s.connected ? 'rgba(207,170,110,1)' : 'rgba(245,245,245,0.6)';
      ctx.shadowBlur = s.connected ? 10 : 4;
      ctx.shadowColor = 'rgba(207,170,110,0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, []);

  // Init canvas + stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrap = canvas.parentElement!;
    canvas.width  = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;

    starsRef.current = STAR_RATIOS.map((r) => ({
      x: r.x * canvas.width,
      y: r.y * canvas.height,
      connected: false,
    }));
    draw();

    // Resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width  = wrap.offsetWidth;
        canvas.height = wrap.offsetHeight;
        STAR_RATIOS.forEach((r, i) => {
          starsRef.current[i].x = r.x * canvas.width;
          starsRef.current[i].y = r.y * canvas.height;
        });
        linesRef.current = linesRef.current.map((l) => ({
          x1: (l.x1 / (canvas.width  || 1)) * canvas.width,
          y1: (l.y1 / (canvas.height || 1)) * canvas.height,
          x2: (l.x2 / (canvas.width  || 1)) * canvas.width,
          y2: (l.y2 / (canvas.height || 1)) * canvas.height,
        }));
        draw();
      }, 150);
    };

    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [draw]);

  const handleStarClick = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx   = (clientX - rect.left) * (canvas.width  / rect.width);
    const my   = (clientY - rect.top)  * (canvas.height / rect.height);

    let closest: Star | null = null;
    let minD = 40;
    starsRef.current.forEach((s) => {
      const d = Math.hypot(s.x - mx, s.y - my);
      if (d < minD) { minD = d; closest = s; }
    });

    if (!closest) return;
    (closest as Star).connected = true;
    if (lastStarRef.current) {
      linesRef.current.push({
        x1: lastStarRef.current.x, y1: lastStarRef.current.y,
        x2: (closest as Star).x,   y2: (closest as Star).y,
      });
    }
    lastStarRef.current = closest as Star;
    draw();

    const connectedCount = starsRef.current.filter((s) => s.connected).length;
    if (connectedCount >= 5) {
      const newMsg = CONSTELLATION_MSGS[Math.floor(Math.random() * CONSTELLATION_MSGS.length)];
      setMsg(newMsg);
      setMsgVisible(true);
    }
  }, [draw]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) =>
    handleStarClick(e.clientX, e.clientY);

  const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handleStarClick(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleReset = () => {
    linesRef.current = [];
    lastStarRef.current = null;
    starsRef.current.forEach((s) => { s.connected = false; });
    setMsgVisible(false);
    draw();
  };

  return (
    <section className="section-padding reveal">
      <p className="mono" style={{ marginBottom: '0.5rem' }}>
        draw our constellation
      </p>
      <p className="serif" style={{ opacity: 0.6, fontSize: '1rem', marginBottom: '0.5rem' }}>
        connect the stars, see what we become
      </p>
      <div className="constellation-wrap">
        <canvas
          id="constellation-canvas"
          ref={canvasRef}
          onClick={handleClick}
          onTouchStart={handleTouch}
        />
      </div>
      <p id="constellation-msg" className={msgVisible ? 'show' : ''}>
        {msg}
      </p>
      <button id="constellation-reset" onClick={handleReset}>
        reset the sky
      </button>
    </section>
  );
}

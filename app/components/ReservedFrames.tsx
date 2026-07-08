'use client';

import { useEffect, useRef, useState } from 'react';

const FRAMES = [
  { slot: 0, rotate: '-2deg',       marginTop: '0px',  caption: 'About Us.'         },
  { slot: 1, rotate: '3deg',        marginTop: '20px', caption: 'That one blurry selfie we\'ll take.' },
  { slot: 2, rotate: '-1deg',       marginTop: '0px',  caption: 'You, looking pretty.'            },
];

const MAX_PX = 600;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(MAX_PX / img.width, MAX_PX / img.height, 1);
        const cvs = document.createElement('canvas');
        cvs.width  = img.width  * scale;
        cvs.height = img.height * scale;
        cvs.getContext('2d')!.drawImage(img, 0, 0, cvs.width, cvs.height);
        resolve(cvs.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function PolaroidFrame({ slot, rotate, marginTop, caption }: (typeof FRAMES)[0]) {
  // Key bumped to v2 so any photo saved under the old key is no longer restored.
  const key = `polaroid_img_v2_${slot}`;
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore saved photo
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setImgSrc(saved);
    } catch { /* ignore */ }
  }, [key]);

  const handleChange = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setImgSrc(compressed);
      try {
        localStorage.setItem(key, compressed);
      } catch {
        console.warn('Storage full, photo shown but not saved.');
      }
    } catch { /* ignore */ }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgSrc(null);
    if (inputRef.current) inputRef.current.value = '';
    try {
      localStorage.removeItem(key);
    } catch { /* ignore */ }
  };

  return (
    <div className="polaroid" style={{ transform: `rotate(${rotate})`, marginTop }}>
      <label className="polaroid-blank" data-slot={slot} title="tap to add a photo">
        <input
          type="file"
          accept="image/*"
          className="polaroid-input"
          style={{ display: 'none' }}
          ref={inputRef}
          onChange={handleChange}
        />
        {!imgSrc && <span className="polaroid-hint">tap to add ✦</span>}
        {imgSrc && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded data: URI, not a static/remote asset next/image can optimize */}
            <img
              className="polaroid-img"
              src={imgSrc}
              alt={caption}
            />
            <button
              type="button"
              className="polaroid-remove"
              onClick={handleRemove}
              aria-label="remove photo"
              title="remove photo"
            >
              ✕
            </button>
          </>
        )}
      </label>
      <p className="serif caption">{caption}</p>
    </div>
  );
}

export default function ReservedFrames() {
  return (
    <section className="section-padding reveal">
      <p className="mono" style={{ marginBottom: '2rem' }}>
        Reserved Frames
      </p>
      <p className="serif" style={{ maxWidth: 500, opacity: 0.8, fontSize: '1.2rem', marginBottom: '3rem' }}>
        Empty spaces waiting for the moments we haven&apos;t lived yet.
      </p>
      <div className="polaroid-grid">
        {FRAMES.map((f) => (
          <PolaroidFrame key={f.slot} {...f} />
        ))}
      </div>
    </section>
  );
}

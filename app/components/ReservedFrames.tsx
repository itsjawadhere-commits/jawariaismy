'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { RESERVED_FRAMES } from '../lib/data/reservedFrames';

const CENTER_INDEX = Math.floor((RESERVED_FRAMES.length - 1) / 2);

function FrameItem({
  image,
  alt,
  index,
  innerRef,
}: (typeof RESERVED_FRAMES)[0] & {
  index: number;
  innerRef: (el: HTMLDivElement | null) => void;
}) {
  const isCenter = index === CENTER_INDEX;
  const tilt = index < CENTER_INDEX ? '-6deg' : '6deg';

  return (
    <div
      ref={innerRef}
      className={`frame-item ${isCenter ? 'frame-item--center' : 'frame-item--side'}`}
      style={{ '--tilt': tilt } as React.CSSProperties}
    >
      <div className="frame-card">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 420px) 32vw, (max-width: 768px) 26vw, 220px"
          quality={70}
          className="frame-card-img"
        />
      </div>
    </div>
  );
}

export default function ReservedFrames() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Center the deck on the hero frame — same feel on every screen size.
    // Deliberately NOT using scrollIntoView here: with block: 'nearest', it
    // still scrolls the page vertically to bring this section into view if
    // it isn't already on-screen (which it never is on initial load, since
    // this section sits well below the hero) — that's what was causing the
    // page to open scrolled down to the photos instead of the hero. Setting
    // scrollLeft directly only ever affects this track's own horizontal
    // scroll, never the page's vertical position.
    const track = trackRef.current;
    const center = centerRef.current;
    if (!track || !center) return;

    track.scrollLeft = center.offsetLeft - track.clientWidth / 2 + center.clientWidth / 2;
  }, []);

  return (
    <section className="section-padding reveal">
      <p className="mono" style={{ marginBottom: '2rem' }}>
        Kept, Not Taken
      </p>

      <p
        className="serif"
        style={{
          maxWidth: 500,
          opacity: 0.8,
          fontSize: '1.2rem',
          marginBottom: '3rem',
        }}
      >
        Moments which were dreams once.
      </p>

      <div className="frames-wrap">
        <div className="frames-glow" aria-hidden="true" />
        <div className="frames-track" ref={trackRef}>
          {RESERVED_FRAMES.map((frame, index) => (
            <FrameItem
              key={frame.image}
              index={index}
              {...frame}
              innerRef={(el) => {
                if (index === CENTER_INDEX) centerRef.current = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';

const FRAMES = [
  { image: '/images/3.jpeg' },
  { image: '/images/7.jpeg' },
  { image: '/images/5.jpeg' },
  
];

const CENTER_INDEX = Math.floor((FRAMES.length - 1) / 2);

function FrameItem({
  image,
  index,
}: (typeof FRAMES)[0] & { index: number }) {
  const isCenter = index === CENTER_INDEX;
  const tilt = index < CENTER_INDEX ? '-6deg' : '6deg';

  return (
    <div
      className={`frame-item ${isCenter ? 'frame-item--center' : 'frame-item--side'}`}
      style={{ '--tilt': tilt } as React.CSSProperties}
    >
      <div className="frame-card">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 480px) 40vw, (max-width: 768px) 30vw, 220px"
          quality={70}
          className="frame-card-img"
        />
      </div>
    </div>
  );
}

export default function ReservedFrames() {
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
        <div className="frames-track">
          {FRAMES.map((frame, index) => (
            <FrameItem
              key={frame.image}
              index={index}
              {...frame}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

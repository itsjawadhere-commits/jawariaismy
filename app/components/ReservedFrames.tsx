'use client';

const FRAMES = [
  {
    rotate: '-2deg',
    marginTop: '0px',
    caption: 'About Us.',
    image: '/images/about-us.jpeg',
  },
  {
    rotate: '3deg',
    marginTop: '20px',
    caption: "That one blurry selfie we'll take.",
    image: '/images/blurry-selfie.jpeg',
  },
  {
    rotate: '-1deg',
    marginTop: '0px',
    caption: 'You, looking pretty.',
    image: '/images/pretty.jpeg',
  },
];

function PolaroidFrame({
  rotate,
  marginTop,
  caption,
  image,
}: (typeof FRAMES)[0]) {
  return (
    <div
      className="polaroid"
      style={{
        transform: `rotate(${rotate})`,
        marginTop,
      }}
    >
      <div className="polaroid-blank">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={caption}
          className="polaroid-img"
        />
      </div>

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

      <div className="polaroid-grid">
        {FRAMES.map((frame) => (
          <PolaroidFrame
            key={frame.caption}
            {...frame}
          />
        ))}
      </div>
    </section>
  );
}
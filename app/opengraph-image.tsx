import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '31 March | Jawaria';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030303',
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(207,170,110,0.16), rgba(3,3,3,0) 60%)',
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'lowercase',
            color: '#cfaa6e',
            opacity: 0.85,
            marginBottom: 28,
          }}
        >
          31 march
        </div>
        <div
          style={{
            fontSize: 88,
            fontStyle: 'italic',
            color: '#f5f5f5',
            letterSpacing: 1,
          }}
        >
          for Jawaria
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            color: '#f5f5f5',
            opacity: 0.55,
            letterSpacing: 2,
          }}
        >
          moments · promises · things left unsaid
        </div>
      </div>
    ),
    { ...size }
  );
}

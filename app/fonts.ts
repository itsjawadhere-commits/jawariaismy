import { Cormorant_Garamond, Space_Mono, Noto_Nastaliq_Urdu } from 'next/font/google';

// next/font/google downloads these once at build time and self-hosts the
// files alongside the rest of the app's static assets — no <link> tags to
// fonts.googleapis.com/fonts.gstatic.com at request time, no extra DNS/TLS
// round trip in the critical path, and no layout shift while the browser
// waits on a third-party font request. Each font exposes a CSS variable
// that globals.css reads instead of hardcoded font-family strings.

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu',
  display: 'swap',
});

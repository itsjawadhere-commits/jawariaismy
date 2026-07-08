import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from './components/CustomCursor';
import ScrollThread from './components/ScrollThread';
import Nav from './components/Nav';
import BackToTop from './components/BackToTop';
import AmbientParticles from './components/AmbientParticles';
import BackgroundMusic from './components/BackgroundMusic';

export const metadata: Metadata = {
  title: '31 March | Jawaria',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable @next/next/no-page-custom-font -- intentional: these fonts are
            loaded once in the App Router root layout (not pages/_document), so they apply
            to the whole app, not a single page. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Space+Mono&display=swap"
          rel="stylesheet"
        />
        {/* eslint-enable @next/next/no-page-custom-font */}
      </head>
      <body>
        <CustomCursor />
        <Nav />
        <AmbientParticles />
        <div className="grain" />
        <ScrollThread />
        {children}
        <BackToTop />
        <BackgroundMusic />
      </body>
    </html>
  );
}


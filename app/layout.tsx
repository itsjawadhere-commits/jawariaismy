import type { Metadata } from 'next';
import './globals.css';
import { cormorantGaramond, spaceMono, notoNastaliqUrdu } from './fonts';
import CustomCursor from './components/CustomCursor';
import ScrollThread from './components/ScrollThread';
import Nav from './components/Nav';
import SecondaryNav from './components/SecondaryNav';
import BackToTop from './components/BackToTop';
import AmbientParticles from './components/AmbientParticles';
import BackgroundMusic from './components/BackgroundMusic';

export const metadata: Metadata = {
  title: '31 March | Jawaria',
  description: 'A collection of moments, promises, and things left unsaid — for Jawaria.',
  robots: {
    // This is a private, personal page for one specific person — it has no
    // reason to show up in search results or get crawled/indexed anywhere.
    index: false,
    follow: false,
  },
  openGraph: {
    title: '31 March | Jawaria',
    description: 'A collection of moments, promises, and things left unsaid — for Jawaria.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '31 March | Jawaria',
    description: 'A collection of moments, promises, and things left unsaid — for Jawaria.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${spaceMono.variable} ${notoNastaliqUrdu.variable}`}
    >
      <body>
        <CustomCursor />
        <Nav />
        <SecondaryNav />
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


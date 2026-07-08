'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav">
      <Link href="/" className={`site-nav-link${pathname === '/' ? ' active' : ''}`}>
        home
      </Link>
      <span className="site-nav-sep">✦</span>
      <Link
        href="/letters-and-poems"
        className={`site-nav-link${pathname === '/letters-and-poems' ? ' active' : ''}`}
      >
        letters &amp; poems
      </Link>
      <span className="site-nav-sep">✦</span>
      <Link
        href="/things-i-noticed"
        className={`site-nav-link${pathname === '/things-i-noticed' ? ' active' : ''}`}
      >
        impressions
      </Link>
    </nav>
  );
}

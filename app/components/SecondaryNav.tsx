'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SecondaryNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav-secondary">
      <Link
        href="/unsaid"
        className={`site-nav-link${pathname === '/unsaid' ? ' active' : ''}`}
      >
        unsaid
      </Link>
    </nav>
  );
}

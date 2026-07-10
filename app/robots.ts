import type { MetadataRoute } from 'next';

// This is a private page for one specific person, not meant to be
// discovered or indexed. Combined with `robots: { index: false }` in
// layout.tsx's metadata, this stops well-behaved crawlers before they even
// request a page to notice the noindex tag.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}

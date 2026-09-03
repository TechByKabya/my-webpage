import type { Metadata } from 'next'

// IMPORTANT: Use a hardcoded absolute production URL for the default OG image.
// DO NOT call getServerSideURL() at module init — it runs before env vars are
// available during the build and can resolve to localhost, breaking social cards.
// Facebook/LinkedIn crawlers also require absolute URLs that never change.
const SITE_URL = 'https://www.kabyac.tech'

// Use JPEG — Facebook's crawler has documented issues with WebP intermittently.
// JPEG is the most reliable format across all social crawlers (FB, Twitter, LinkedIn, WhatsApp).
const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Personal portfolio, projects, and technical blog of Kabya Ghosh. Explore software engineering, web development, and more.',
  images: [
    {
      url: DEFAULT_OG_IMAGE_URL,
      width: 1200,
      height: 630,
      alt: 'Kabya Ghosh - Personal Portfolio & Tech Blog',
    },
  ],
  siteName: 'Kabya Ghosh Portfolio',
  title: 'Kabya Ghosh',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

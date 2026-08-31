import type { Metadata } from 'next'

import type { Media, Page, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    // Prefer the og-sized image (1200x630 JPEG), fallback to the main image
    const rawUrl = image.sizes?.og?.url || image.url

    if (rawUrl) {
      // If it's already an absolute URL (e.g. a Vercel Blob CDN URL), use it directly
      // If it's a relative path (e.g. /api/media/file/...), prefix with the server URL
      url = rawUrl.startsWith('http') ? rawUrl : serverUrl + rawUrl
    }
  }

  return url
}

export const generateMeta = async (args: {
  doc: any | null
  url?: string
}): Promise<Metadata> => {
  const { doc, url } = args

  const ogImage = getImageURL(doc?.meta?.image || doc?.coverImage)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Kabya Ghosh'
    : 'Kabya Ghosh - Personal Portfolio & Tech Blog'

  const description = doc?.meta?.description || 'Personal portfolio, projects, and technical blog of Kabya Ghosh. Explore software engineering, web development, and more.'

  return {
    description,
    keywords: ['Kabya Ghosh', 'Kabya', 'Ghosh', 'Software Engineer', 'Web Developer', 'Tech Blog', 'Portfolio', 'Developer', 'Bangladesh', 'TechByKabya'],
    authors: [{ name: 'Kabya Ghosh', url: 'https://github.com/TechByKabya' }],
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: url || (doc?.slug ? `/${doc.slug}` : '/'),
    }),
    twitter: {
      card: 'summary_large_image',
      creator: '@kabya_ghosh',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    title,
  }
}

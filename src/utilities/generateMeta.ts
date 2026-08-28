import type { Metadata } from 'next'

import type { Media, Page, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: any | null
  url?: string
}): Promise<Metadata> => {
  const { doc, url } = args

  const ogImage = getImageURL(doc?.meta?.image)

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
    title,
  }
}

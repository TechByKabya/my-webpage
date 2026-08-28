import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/kabya-52005/'],
    },
    sitemap: `${getServerSideURL()}/sitemap.xml`,
  }
}

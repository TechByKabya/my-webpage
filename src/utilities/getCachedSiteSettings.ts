/**
 * Shared, cached site-settings fetcher.
 *
 * Centralised here so layout.tsx, generateMeta.ts, and any other server
 * component always share the SAME cache entry instead of each creating their
 * own with slightly different cache keys, which wastes memory and causes
 * unnecessary DB round-trips.
 *
 * Cache strategy:
 *  - Revalidated every hour (revalidate: 3600)
 *  - Tag-based revalidation: call revalidateTag('site-settings', 'max') in the
 *    SiteSettings afterChange hook to bust this immediately on admin save.
 */
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const getCachedSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  },
  ['global-site-settings'],
  { revalidate: 3600, tags: ['site-settings'] },
)

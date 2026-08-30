import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from "@vercel/analytics/next"
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import GlobalElements from '@/components/GlobalElements'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const getCachedSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  },
  ['global-site-settings'],
  { revalidate: 3600, tags: ['site-settings'] }
)

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  // Fetch dynamic favicon from CMS
  let faviconUrl: string | null = null
  try {
    const siteSettings = await getCachedSiteSettings()
    // @ts-ignore
    const favicon = siteSettings?.favicon
    if (favicon && typeof favicon === 'object' && 'url' in favicon && favicon.url) {
      faviconUrl = favicon.url as string
    }
  } catch {
    // fallback to static favicon if CMS is unavailable
  }

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        {faviconUrl ? (
          <>
            <link href={faviconUrl} rel="icon" />
            <link href={faviconUrl} rel="apple-touch-icon" sizes="180x180" />
          </>
        ) : (
          <>
            <link href="/favicon.ico" rel="icon" sizes="32x32" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
            <link href="/favicon.ico" rel="apple-touch-icon" sizes="180x180" />
          </>
        )}
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <GlobalElements />
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@kabya_ghosh',
  },
  keywords: [
    'Embedded System IoT Engineer BD',
    'Embedded System IoT Expert in BD',
    'Daffodil International University',
    'Low Cost 3D Printing Dhaka',
    'CAD Model Design Bangladesh',
    'Kabya Ghosh',
    'TechByKabya'
  ],
  authors: [{ name: 'Kabya Ghosh', url: 'https://github.com/TechByKabya' }],
}


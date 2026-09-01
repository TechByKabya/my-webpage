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
import { getCachedSiteSettings } from '@/utilities/getCachedSiteSettings'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
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

export async function generateMetadata(): Promise<Metadata> {
  let ogImageUrl = `${getServerSideURL()}/website-template-OG.webp`
  let fbAppId = '966242223397117' // Fallback dummy ID to bypass warning
  let faviconUrl: string | null = null

  try {
    const siteSettings = await getCachedSiteSettings()
    // @ts-ignore
    const avatar = siteSettings?.adminLoginAvatar
    if (avatar && typeof avatar === 'object' && 'url' in avatar && avatar.url) {
      ogImageUrl = avatar.url as string
    }
    // @ts-ignore
    if (siteSettings?.fbAppId) {
      // @ts-ignore
      fbAppId = siteSettings.fbAppId
    }
    // @ts-ignore
    const favicon = siteSettings?.favicon
    if (favicon && typeof favicon === 'object' && 'url' in favicon && favicon.url) {
      faviconUrl = favicon.url as string
    }
  } catch (err) {
    console.error('Error fetching site settings for OG image:', err)
  }

  return {
    metadataBase: new URL(getServerSideURL()),
    icons: faviconUrl ? faviconUrl : [
      { rel: 'icon', url: '/favicon.ico', sizes: '32x32' },
      { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', url: '/favicon.ico', sizes: '180x180' },
    ],
    openGraph: mergeOpenGraph({
      url: '/',
      images: [{ url: ogImageUrl }],
    }),
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
    other: {
      'fb:app_id': fbAppId,
    },
  }
}


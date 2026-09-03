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
import GlobalElements from '@/components/GlobalElements'
import { getCachedSiteSettings } from '@/utilities/getCachedSiteSettings'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  let fbAppId = '966242223397117' // Fallback dummy ID
  try {
    const siteSettings = await getCachedSiteSettings()
    // @ts-ignore
    if (siteSettings?.fbAppId) fbAppId = siteSettings.fbAppId
  } catch (err) { }

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <meta property="fb:app_id" content={fbAppId} />
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
  // Hardcode the production OG image URL — never use getServerSideURL() here
  // because it runs at build time and the env var may not be set correctly.
  // Use JPEG, not WebP — Facebook's crawler has intermittent WebP issues.
  const ogImageUrl = 'https://www.kabyac.tech/og-image.jpg'

  return {
    metadataBase: new URL('https://www.kabyac.tech'),
    // NOTE: favicon.ico + apple-icon.png in src/app/ root handle the favicon
    // via the file-based convention — that is the most reliable method.
    // Do NOT define icons here as it creates a conflict with Payload's metadata.
    openGraph: mergeOpenGraph({
      url: '/',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Kabya Ghosh Portfolio' }],
    }),
    twitter: {
      card: 'summary_large_image',
      creator: '@kabya_ghosh',
      images: [ogImageUrl],
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
}


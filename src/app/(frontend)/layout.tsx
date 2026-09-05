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

  // Read the favicon dynamically from Site Settings so it can be changed
  // in the admin panel without a redeploy.
  let faviconUrl = '/favicon.png' // static fallback
  let siteOgImageUrl = ogImageUrl // will be overridden if ogImage is set
  try {
    const siteSettings = await getCachedSiteSettings()
    const faviconMedia = (siteSettings as any)?.favicon
    if (faviconMedia && typeof faviconMedia === 'object' && faviconMedia.url) {
      faviconUrl = faviconMedia.url as string
    }
    // Also pull the dedicated ogImage if available
    const ogMedia = (siteSettings as any)?.ogImage
    if (ogMedia && typeof ogMedia === 'object' && ogMedia.url) {
      siteOgImageUrl = (ogMedia.url as string).startsWith('http')
        ? (ogMedia.url as string)
        : `https://www.kabyac.tech${ogMedia.url}`
    } else {
      // Fall back to adminLoginAvatar if no ogImage set
      const avatarMedia = (siteSettings as any)?.adminLoginAvatar
      if (avatarMedia && typeof avatarMedia === 'object' && avatarMedia.url) {
        siteOgImageUrl = (avatarMedia.url as string).startsWith('http')
          ? (avatarMedia.url as string)
          : `https://www.kabyac.tech${avatarMedia.url}`
      }
    }
  } catch (err) {}

  return {
    metadataBase: new URL('https://www.kabyac.tech'),
    // Dynamic favicon from Site Settings — overrides file-based convention
    // so the admin can change it without a redeploy.
    icons: {
      icon: [{ url: faviconUrl }],
      shortcut: [{ url: faviconUrl }],
      apple: [{ url: faviconUrl }],
    },
    openGraph: mergeOpenGraph({
      url: '/',
      images: [{ url: siteOgImageUrl, width: 1200, height: 630, alt: 'Kabya Ghosh Portfolio' }],
    }),
    twitter: {
      card: 'summary_large_image',
      creator: '@kabya_ghosh',
      images: [siteOgImageUrl],
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



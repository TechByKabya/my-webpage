import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import SearchableIndustrial from '@/components/Frontend/SearchableIndustrial'

export const metadata: Metadata = {
  title: 'Industrial Solutions & Engineering Projects | Kabya Ghosh',
  description: 'Explore Kabya Ghosh\'s elite industrial solutions, robotics engineering, embedded hardware architectures, and automated industrial systems.',
  metadataBase: new URL('https://www.kabyac.tech'),
  openGraph: {
    type: 'website',
    title: 'Industrial Solutions & Engineering Projects | Kabya Ghosh',
    description: 'Explore Kabya Ghosh\'s elite industrial solutions, robotics engineering, embedded hardware architectures, and automated industrial systems.',
    url: 'https://www.kabyac.tech/industrial',
    siteName: 'Kabya Ghosh Portfolio',
    images: [{ url: 'https://www.kabyac.tech/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@kabya_ghosh',
    title: 'Industrial Solutions & Engineering Projects | Kabya Ghosh',
    description: 'Explore Kabya Ghosh\'s elite industrial solutions, robotics engineering, embedded hardware architectures, and automated industrial systems.',
    images: ['https://www.kabyac.tech/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.kabyac.tech/industrial',
  },
}

export const revalidate = 3600
export const maxDuration = 30

export default async function IndustrialPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: rawProjects } = await payload.find({
    collection: 'industrial-projects',
    where: { visibility: { not_equals: 'private' } },
    depth: 2,
    limit: 100,
  })

  const projects = (rawProjects || []) as any[]

  return (
    <main style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <section id="industrial" style={{ paddingTop: '0px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '1200px', width: '92%' }}>
          <SearchableIndustrial projects={projects} />
        </div>
      </section>
    </main>
  )
}

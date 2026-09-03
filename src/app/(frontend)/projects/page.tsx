import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import SearchableProjects from '@/components/Frontend/SearchableProjects'

export const metadata: Metadata = {
  title: 'Hardware & IoT Engineering Projects | Kabya Ghosh',
  description: 'Explore Kabya Ghosh\'s portfolio of embedded systems, IoT engineering projects, and custom 3D printed CAD models in Bangladesh.',
  metadataBase: new URL('https://www.kabyac.tech'),
  openGraph: {
    type: 'website',
    title: 'Hardware & IoT Engineering Projects | Kabya Ghosh',
    description: 'Explore Kabya Ghosh\'s portfolio of embedded systems, IoT engineering projects, and custom 3D printed CAD models in Bangladesh.',
    url: 'https://www.kabyac.tech/projects',
    siteName: 'Kabya Ghosh Portfolio',
    images: [{ url: 'https://www.kabyac.tech/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@kabya_ghosh',
    title: 'Hardware & IoT Engineering Projects | Kabya Ghosh',
    description: 'Explore Kabya Ghosh\'s portfolio of embedded systems, IoT engineering projects, and custom 3D printed CAD models in Bangladesh.',
    images: ['https://www.kabyac.tech/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.kabyac.tech/projects',
  },
}

export const revalidate = 3600
export const maxDuration = 30

export default async function ProjectsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { visibility: { not_equals: 'private' } },
    depth: 2,
    limit: 100,
  })

  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (!mediaObj) return defaultUrl
    if (typeof mediaObj === 'object' && mediaObj.url) return mediaObj.url
    if (typeof mediaObj === 'string') return mediaObj
    return defaultUrl
  }

  return (
    <main style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <section id="projects" style={{ paddingTop: '0px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className="container" style={{ maxWidth: '1200px', width: '92%' }}>
              <SearchableProjects projects={projects} />
          </div>
      </section>
    </main>
  )
}

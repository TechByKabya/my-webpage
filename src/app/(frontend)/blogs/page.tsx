import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import SearchableBlogs from '@/components/Frontend/SearchableBlogs'

export const metadata: Metadata = {
  title: 'Embedded IoT & Tech Blog | Kabya Ghosh',
  description: 'Read the latest thoughts, tutorials, and life updates on embedded systems, IoT engineering, and 3D printing by Kabya Ghosh, an expert in BD.',
}

export const revalidate = 3600
export const maxDuration = 30

export default async function BlogsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: blogs } = await payload.find({
    collection: 'blogs',
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
      <section id="blogs" style={{ paddingTop: '0px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className="container" style={{ maxWidth: '1200px', width: '92%' }}>
              <SearchableBlogs blogs={blogs} />
          </div>
      </section>
    </main>
  )
}

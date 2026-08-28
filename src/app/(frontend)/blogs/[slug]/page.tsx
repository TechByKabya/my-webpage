import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'

export default async function BlogSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const payload = await getPayload({ config: configPromise })
  const { slug } = await params

  const { docs: blogs } = await payload.find({
    collection: 'blogs',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })

  if (!blogs || blogs.length === 0) {
    return notFound()
  }

  const blog = blogs[0]

  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (mediaObj && typeof mediaObj === 'object' && mediaObj.url) {
      return mediaObj.url
    }
    return defaultUrl
  }
  const coverUrl = getMediaUrl(blog.coverImage, '/mission_bot.jpeg')

  return (
    <main style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="container" style={{ 
        maxWidth: '850px', 
        width: '92%', 
        backgroundColor: '#ffffff',
        padding: 'clamp(24px, 5vw, 48px)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.04)',
        position: 'relative'
      }}>
        <a href="/blogs" className="btn-secondary" style={{ display: 'inline-block', marginBottom: '30px', marginTop: '10px' }}>&larr; Back to Blogs</a>
        
        <img src={coverUrl} alt={blog.title} style={{ width: '100%', borderRadius: '15px', marginBottom: '40px' }} />
        
        <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', marginBottom: '10px' }}>{blog.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.6 }}>{blog.excerpt}</p>
        </div>

        {blog.content && (
          <div className="blog-content" style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            <RichText data={blog.content} enableGutter={false} />
          </div>
        )}
      </div>
    </main>
  )
}

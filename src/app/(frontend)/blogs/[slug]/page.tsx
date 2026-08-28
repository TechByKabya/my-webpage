import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'

import { TextToSpeech } from '@/components/Frontend/TextToSpeech'
import type { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs: blogs } = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return generateMeta({ doc: blogs?.[0] || null })
}

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

  const { docs: suggestedBlogs } = await payload.find({
    collection: 'blogs',
    where: {
      slug: { not_equals: slug },
    },
    limit: 4,
  })

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
        maxWidth: '1050px', 
        width: '92%', 
        backgroundColor: '#ffffff',
        padding: 'clamp(24px, 5vw, 48px)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.04)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', marginTop: '10px' }}>
          <a href="/" className="btn-secondary" style={{ display: 'inline-block' }}><i className="fas fa-home" style={{ marginRight: '6px' }}></i> Home</a>
          <a href="/blogs" className="btn-secondary" style={{ display: 'inline-block' }}>&larr; Back to Blogs</a>
        </div>
        
        <img src={coverUrl} alt={blog.title} style={{ width: '100%', borderRadius: '15px', marginBottom: '40px' }} />
        
        <div>
            <h1 style={{ fontSize: '3rem', color: '#1D1D1F', marginBottom: '16px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{blog.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src="/kabya.jpeg" alt="Kabya Ghosh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#1d1d1f', fontSize: '1.05rem' }}>Kabya Ghosh</p>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>Author</p>
              </div>
            </div>

            <TextToSpeech targetId="post-content" />
            <p style={{ color: '#6b7280', fontSize: '1.2rem', lineHeight: 1.6, marginTop: '24px' }}>{blog.excerpt}</p>
        </div>

        <hr style={{ border: 'none', borderBottom: '1px solid rgba(0,0,0,0.08)', margin: '40px 0' }} />

        {blog.content && (
          <div id="post-content" className="blog-content" style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            <RichText data={blog.content} enableGutter={false} />
          </div>
        )}

        {suggestedBlogs && suggestedBlogs.length > 0 && (
          <div style={{ marginTop: '80px', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '40px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', color: '#1D1D1F' }}>Up Next</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {suggestedBlogs.map((suggestion, i) => {
                const sCoverUrl = getMediaUrl(suggestion.coverImage, '/mission_bot.jpeg')
                return (
                  <a key={i} href={`/blogs/${suggestion.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: '20px', alignItems: 'center', padding: '12px', borderRadius: '16px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: '160px', height: '100px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <img src={sCoverUrl} alt={suggestion.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '6px', lineHeight: 1.3 }}>{suggestion.title}</h4>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{suggestion.excerpt}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

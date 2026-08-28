import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const revalidate = 60

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
              <div className="section-header center-text" style={{ paddingBottom: '40px', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1D1D1F' }}>Blog</h2>
                  <p className="sub-head" style={{ fontSize: '1.1rem', color: '#6b7280' }}>Thoughts, tutorials, and life updates.</p>
              </div>

              <div className="bento-grid">
                  {blogs.length === 0 ? (
                      <p style={{ textAlign: 'center', width: '100%' }}>No blog posts yet. Check back soon!</p>
                  ) : (
                      blogs.map((blog, i) => {
                        const coverUrl = getMediaUrl(blog.coverImage, '/mission_bot.jpeg')
                        
                        return (
                          <div className="project-card span-1" data-cursor="Read" key={i}>
                              <a href={`/blogs/${blog.slug || '#'}`} className="full-link">
                                <img src={coverUrl} alt={blog.title} className="p-bg" />
                                <div className="p-content">
                                    <span className="p-tag">Blog Post</span>
                                    <h3>{blog.title}</h3>
                                    <p>{blog.excerpt}</p>
                                </div>
                              </a>
                          </div>
                        )
                      })
                  )}
              </div>
          </div>
      </section>
    </main>
  )
}

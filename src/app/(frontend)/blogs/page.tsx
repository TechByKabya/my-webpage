import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function BlogsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: blogs } = await payload.find({
    collection: 'blogs',
    depth: 1,
    limit: 100,
  })

  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (mediaObj && typeof mediaObj === 'object' && mediaObj.url) {
      return mediaObj.url
    }
    return defaultUrl
  }

  return (
    <main style={{ paddingTop: '100px' }}>
      <section id="blogs">
          <div className="container">
              <div className="section-header center-text">
                  <h2>Blog</h2>
                  <p className="sub-head">Thoughts, tutorials, and life updates.</p>
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

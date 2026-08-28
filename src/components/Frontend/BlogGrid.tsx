// @ts-nocheck

'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Blog {
  title: string
  excerpt?: string
  slug?: string
  coverImage?: any
}

interface BlogGridProps {
  blogs: Blog[]
}

const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
  if (!mediaObj) return defaultUrl
  if (typeof mediaObj === 'object' && mediaObj.url) return mediaObj.url
  if (typeof mediaObj === 'string') return mediaObj
  return defaultUrl
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] 
    }
  })
}

export const BlogGrid: React.FC<BlogGridProps> = ({ blogs }) => {
  return (
    <section id="blogs">
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="section-header center-text text-center max-w-[1200px] mx-auto"
        >
          <h2>Latest Articles</h2>
          <p className="sub-head">Thoughts and tutorials.</p>
        </motion.div>

        <div className="bento-grid">
          {blogs.length === 0 ? (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>No blog posts yet. Check back soon!</p>
          ) : (
            blogs.map((blog, i) => {
              const coverUrl = getMediaUrl(blog.coverImage, '/mission_bot.jpeg')
              
              return (
                <motion.div 
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={cardVariants}
                  className="project-card span-1" 
                  key={i}
                >
                  <a href={`/blogs/${blog.slug || '#'}`} className="full-link">
                    <img src={coverUrl} alt={blog.title} className="p-bg" />
                    <div className="p-content">
                      <span className="p-tag">Blog Post</span>
                      <h3>{blog.title}</h3>
                      <p>{blog.excerpt}</p>
                    </div>
                  </a>
                </motion.div>
              )
            })
          )}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <a href="/blogs" className="btn-primary">View All Articles</a>
        </motion.div>
      </div>
    </section>
  )
}

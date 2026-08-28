// @ts-nocheck

'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Project {
  title: string
  description: string
  slug?: string
  tag?: string
  linkUrl?: string
  isGithubCard?: boolean
  gridSpan?: string
  coverImage?: any
}

interface ProjectGridProps {
  projects: Project[]
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
      ease: [0.22, 1, 0.36, 1] // Apple-like easing
    }
  })
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  return (
    <section id="projects">
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="section-header center-text text-center max-w-[1200px] mx-auto"
        >
          <h2>Recent Projects</h2>
          <p className="sub-head">A glimpse of my latest work.</p>
        </motion.div>

        <div className="bento-grid">
          {projects.map((proj, i) => {
            const coverUrl = getMediaUrl(proj.coverImage, '/mission_bot.jpeg')
            
            if(proj.isGithubCard) {
              return (
                <motion.div 
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={cardVariants}
                  className={`project-card ${proj.gridSpan} dark-card`} 
                  key={i}
                >
                  <a href={proj.linkUrl || `/projects/${proj.slug || '#'}`} className="full-link">
                    <div className="center-content">
                      <i className="fab fa-github fa-3x"></i>
                      <h3>{proj.title}</h3>
                      <p>{proj.description}</p>
                    </div>
                  </a>
                </motion.div>
              )
            }

            return (
              <motion.div 
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className={`project-card ${proj.gridSpan}`} 
                key={i}
              >
                <a href={`/projects/${proj.slug || '#'}`} className="full-link">
                  <img src={coverUrl} alt={proj.title} className="p-bg" />
                  <div className="p-content">
                    <span className="p-tag">{proj.tag}</span>
                    <h3>{proj.title}</h3>
                    <p>{proj.description}</p>
                  </div>
                </a>
              </motion.div>
            )
          })}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <a href="/projects" className="btn-primary">View All Projects</a>
        </motion.div>
      </div>
    </section>
  )
}

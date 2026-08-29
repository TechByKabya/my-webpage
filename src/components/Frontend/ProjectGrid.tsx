// @ts-nocheck

'use client'

import React from 'react'
import Image from 'next/image'
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
  totalCount?: number
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

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, totalCount = 0 }) => {
  const displayProjects = projects.slice(0, 4);
  const remainingCount = Math.max(0, totalCount - 3);
  const hasMore = totalCount > 4;

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
        </motion.div>

        <div className="bento-grid">
          {displayProjects.map((proj, i) => {
            const coverUrl = getMediaUrl(proj.coverImage, '/mission_bot.jpeg')
            
            if(proj.isGithubCard) {
              const isLastWithMore = hasMore && i === 3;
              return (
                <motion.div 
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={cardVariants}
                  className={`project-card ${proj.gridSpan} dark-card`} 
                  key={i}
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  <a href={isLastWithMore ? "/projects" : (proj.linkUrl || `/projects/${proj.slug || '#'}`)} className="full-link">
                    <div className="center-content">
                      <i className="fab fa-github fa-3x"></i>
                      <h3>{proj.title}</h3>
                      <p>{proj.description}</p>
                    </div>
                    {isLastWithMore && (
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.3s ease' }} className="hover-unblur">
                        <span style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1 }}>+{remainingCount}</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: '600', letterSpacing: '0.5px' }}>More Projects</span>
                      </div>
                    )}
                  </a>
                </motion.div>
              )
            }

            const isLastWithMore = hasMore && i === 3;
            return (
              <motion.div 
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className={`project-card ${proj.gridSpan}`} 
                key={i}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <a href={isLastWithMore ? "/projects" : `/projects/${proj.slug || '#'}`} className="full-link">
                  <div className="card-img-wrap">
                    <Image src={coverUrl} alt={proj.title} fill sizes="(max-width: 768px) 50vw, 50vw" className="p-bg" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="p-content">
                    <span className="p-tag">{proj.tag}</span>
                    <h3>{proj.title}</h3>
                    <p>{proj.description}</p>
                  </div>
                  {isLastWithMore && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.3s ease' }} className="hover-unblur">
                      <span style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1 }}>+{remainingCount}</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: '600', letterSpacing: '0.5px' }}>More Projects</span>
                    </div>
                  )}
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

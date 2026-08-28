import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hardware & IoT Engineering Projects | Kabya Ghosh',
  description: 'Explore Kabya Ghosh\'s portfolio of embedded systems, IoT engineering projects, and custom 3D printed CAD models in Bangladesh.',
}

export const revalidate = 60

export default async function ProjectsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: projects } = await payload.find({
    collection: 'projects',
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
              <div className="section-header center-text" style={{ paddingBottom: '40px', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1D1D1F' }}>All Projects</h2>
                  <p className="sub-head" style={{ fontSize: '1.1rem', color: '#6b7280' }}>A comprehensive list of my work, experiments, and case studies.</p>
              </div>

              <div className="bento-grid">
                  {projects.map((proj, i) => {
                    const coverUrl = getMediaUrl(proj.coverImage, '/mission_bot.jpeg')
                    if(proj.isGithubCard) {
                      return (
                        <div className={`project-card ${proj.gridSpan} dark-card`} data-cursor="GitHub" key={i}>
                            <a href={proj.linkUrl || `/projects/${proj.slug || '#'}`} className="full-link">
                                <div className="center-content">
                                    <i className="fab fa-github fa-3x"></i>
                                    <h3>{proj.title}</h3>
                                    <p>{proj.description}</p>
                                </div>
                            </a>
                        </div>
                      )
                    }

                    return (
                      <div className={`project-card ${proj.gridSpan}`} data-cursor="View Case" key={i}>
                          <a href={`/projects/${proj.slug || '#'}`} className="full-link">
                            <img src={coverUrl} alt={proj.title} className="p-bg" />
                            <div className="p-content">
                                <span className="p-tag">{proj.tag}</span>
                                <h3>{proj.title}</h3>
                                <p>{proj.description}</p>
                            </div>
                          </a>
                      </div>
                    )
                  })}
              </div>
          </div>
      </section>
    </main>
  )
}

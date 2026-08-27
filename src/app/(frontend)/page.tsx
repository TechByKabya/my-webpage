import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Script from 'next/script'
import { ClientScripts } from './ClientScripts'
import './globals.css' // We ensure the global CSS is loaded

// Revalidate every 60 seconds so image updates show without full rebuild
export const revalidate = 60

export default async function PortfolioHome() {
  const payload = await getPayload({ config: configPromise })

  // ── Fetch Global Settings ──
  const settings = await payload.findGlobal({
    slug: 'homepage-settings',
    depth: 2, // depth 2 ensures media objects are fully resolved with url
  })

  // ── Fetch Projects ──
  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 2,
    limit: 4,
  })

  // ── Fetch Blogs ──
  const { docs: blogs } = await payload.find({
    collection: 'blogs',
    depth: 2,
    limit: 4,
  })

  // Safely extract media URLs — works for Vercel Blob (https://...) and local (/media/...)
  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (!mediaObj) return defaultUrl
    if (typeof mediaObj === 'object' && mediaObj.url) return mediaObj.url
    if (typeof mediaObj === 'string') return mediaObj
    return defaultUrl
  }

  const heroPhotoUrl = getMediaUrl(settings.heroPhoto, '/kabya.jpeg')

  // Extract variables with defaults
  const heroTitle = settings.heroTitle || 'Design.\nBuild.\nLearn.'


  return (
    <>
      <main>
          {/* HERO SECTION */}
          <section id="hero">
              <div className="hero-container">
                  <div className="hero-text animate-up">
                      <span className="badge">{settings.heroBadgeText || 'Based in Bangladesh'}</span>
                      <h1 className="hero-title-3d" dangerouslySetInnerHTML={{ __html: heroTitle.replace(/\n/g, '<br>') }}></h1>
                      <p className="bio">
                          {settings.heroBio || 'I work where hardware and software meet — building practical projects, helping teams, and learning along the way.'}
                      </p>
                      <div className="hero-btns">
                          <a href="/projects" className="btn-primary" data-cursor="View Work">View Work</a>
                          <a href="#contact" className="btn-secondary" data-cursor="Contact Me">Contact</a>
                      </div>
                  </div>

                  <div className="hero-visual">
                      <div className="tilt-card">
                          <div className="float-card f-1">
                              <div className="icon-box"><i className={settings.heroFloatCard1Icon || 'fas fa-bolt'}></i></div>
                              <span>{settings.heroFloatCard1Text || 'Reliable'}</span>
                          </div>
                          <div className="float-card f-2">
                              <div className="icon-box"><i className={settings.heroFloatCard2Icon || 'fas fa-brain'}></i></div>
                              <span>{settings.heroFloatCard2Text || 'AI experiments'}</span>
                          </div>
                          <img src={heroPhotoUrl} alt="Profile" className="profile-photo" />
                      </div>
                  </div>
              </div>
          </section>

          {/* LATEST PROJECTS SECTION */}
          <section id="projects">
              <div className="container">
                  <div className="section-header center-text">
                      <h2>Recent Projects</h2>
                      <p className="sub-head">A glimpse of my latest work.</p>
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
                  
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                      <a href="/projects" className="btn-primary" data-cursor="View All">View All Projects</a>
                  </div>
              </div>
          </section>

          {/* LATEST BLOGS SECTION */}
          <section id="blogs">
              <div className="container">
                  <div className="section-header center-text">
                      <h2>Latest Articles</h2>
                      <p className="sub-head">Thoughts and tutorials.</p>
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
                  
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                      <a href="/blogs" className="btn-primary" data-cursor="View All">View All Articles</a>
                  </div>
              </div>
          </section>

          {/* FOOTER / CONTACT SECTION */}
          <footer id="contact" style={{ paddingBottom: '100px' }}>
              <div className="footer-content">
                  <h2>{settings.contactTitle || 'Interested in collaborating?'}</h2>
                  <p>{settings.contactSubtitle || 'Open to practical collaborations, small R&D efforts, and project work.'}</p>
                  <a href={`mailto:${settings.contactEmail || 'test@test.com'}`} className="btn-primary">Get in Touch</a>
                  <p style={{marginTop: '15px', fontWeight: 600}}>{settings.contactPhone}</p>

                  <div className="social-links">
                      {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer"><i className="fab fa-facebook"></i></a>}
                      {settings.githubUrl && <a href={settings.githubUrl} target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>}
                      {settings.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>}
                      {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>}
                  </div>

                  <div className="copyright">
                      &copy; <span id="current-year"></span> Kabya Ghosh. Made with care.
                  </div>
              </div>
          </footer>
      </main>
    </>
  )
}

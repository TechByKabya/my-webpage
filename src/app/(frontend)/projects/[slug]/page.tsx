import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import type { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { TextToSpeech } from '@/components/Frontend/TextToSpeech'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return generateMeta({ doc: projects?.[0] || null, url: `/projects/${slug}` })
}

export default async function ProjectSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const payload = await getPayload({ config: configPromise })
  const { slug } = await params

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })

  if (!projects || projects.length === 0) {
    return notFound()
  }

  // Fetch suggested projects for the sidebar
  const { docs: suggestedProjects } = await payload.find({
    collection: 'projects',
    where: {
      slug: { not_equals: slug },
    },
    limit: 4,
  })

  const project = projects[0]

  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (mediaObj && typeof mediaObj === 'object' && mediaObj.url) {
      return mediaObj.url
    }
    return defaultUrl
  }
  const coverUrl = getMediaUrl(project.coverImage, '/mission_bot.jpeg')

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  }

  // Format date
  const publishDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Recently Published'

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', backgroundColor: '#ffffff' }}>
      <div className="editorial-grid" style={{ width: '100%' }}>
        <style>{`
          .editorial-grid {
             display: grid;
             grid-template-columns: 1fr;
             gap: 60px;
             align-items: start;
          }
          .sidebar-responsive {
             display: flex;
             flex-direction: column;
             gap: 40px;
             background-color: #fafafa;
             border-top: 1px solid #eaeaea;
             padding: 40px 5%;
          }
          .author-block {
             display: flex;
             flex-direction: column;
             align-items: center;
             text-align: center;
          }
          .author-avatar {
             width: 160px;
             height: 160px;
             border-radius: 50%;
             overflow: hidden;
             margin-bottom: 20px;
             flex-shrink: 0;
          }
          .up-next-list {
             display: flex;
             flex-direction: column;
             gap: 32px;
          }
          @media(min-width: 992px) {
             .editorial-grid {
                 grid-template-columns: minmax(0, 1fr) 400px;
             }
             .sidebar-responsive {
                 border-top: none;
                 border-left: 1px solid #eaeaea;
                 padding: 60px 40px;
                 height: calc(100vh - 100px);
                 position: sticky;
                 top: 100px;
                 overflow-y: auto;
                 gap: 60px;
             }
          }
          @media(max-width: 991px) {
             .sidebar-responsive {
                 display: grid;
                 grid-template-columns: 1fr 1fr;
                 gap: 20px;
                 padding: 40px 4%;
                 border-left: none;
             }
             .author-block {
                 flex-direction: column;
                 text-align: center;
                 gap: 16px;
             }
             .author-avatar {
                 width: 100px;
                 height: 100px;
                 margin-bottom: 0;
             }
             .author-socials {
                 justify-content: center;
             }
             .up-next-list {
                 flex-direction: column;
                 overflow-y: auto;
                 overflow-x: hidden;
                 max-height: 450px;
                 padding-bottom: 0;
                 padding-right: 10px;
                 gap: 16px;
                 scroll-snap-type: none;
             }
             .up-next-list > * {
                 min-width: 0;
                 max-width: none;
             }
          }
          .editorial-content img {
             border-radius: 4px;
          }
          .project-suggestion-link {
             text-decoration: none;
             color: inherit;
             display: flex;
             flex-direction: column;
             gap: 12px;
             transition: opacity 0.2s;
          }
          .project-suggestion-link:hover {
             opacity: 0.7;
          }
          .editorial-btn {
             display: inline-block;
             padding: 12px 24px;
             background-color: #111;
             color: #fff;
             text-decoration: none;
             font-family: 'Geist Sans', sans-serif;
             font-size: 0.95rem;
             text-transform: uppercase;
             letter-spacing: 0.05em;
             border-radius: 2px;
             transition: background 0.2s;
          }
          .editorial-btn:hover {
             background-color: #333;
          }
        `}</style>
        
        {/* Left Column (Main Article) */}
        <article style={{ minWidth: 0, overflow: 'hidden', padding: '60px 4%', paddingBottom: '100px' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a href="/projects" style={{ color: '#86868b', textDecoration: 'none', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>&larr; Back to Portfolio</a>
              {project.tag && (
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111', fontWeight: 600, border: '1px solid #111', padding: '4px 10px', borderRadius: '2px' }}>
                  {project.tag}
                </span>
              )}
            </div>

            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              fontFamily: '"Georgia", serif', 
              color: '#111', 
              marginBottom: '16px', 
              fontWeight: 400, 
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              {project.title}
            </h1>
            
            <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '40px', fontStyle: 'italic' }}>
                {publishDate}
            </p>

            <div style={{ marginBottom: '40px' }}>
              <img src={coverUrl} alt={project.title} style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '4px' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <TextToSpeech targetId="post-content" />
            </div>

            {project.description && (
              <p style={{ color: '#111', fontSize: '1.4rem', lineHeight: 1.6, marginTop: '24px', fontWeight: 400, fontFamily: '"Georgia", serif' }}>
                {project.description}
              </p>
            )}

            {project.youtubeUrl && getYouTubeId(project.youtubeUrl as string) && (
              <div style={{ marginTop: '40px', width: '100%', position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '4px' }}>
                <iframe 
                  src={`https://www.youtube.com/embed/${getYouTubeId(project.youtubeUrl as string)}`} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            )}

            {project.content && (
              <div id="post-content" className="editorial-content" style={{ color: '#222', fontSize: '1.15rem', lineHeight: 1.8, marginTop: '40px', fontFamily: '"Georgia", serif' }}>
                <RichText data={project.content} enableGutter={false} />
              </div>
            )}

            {project.linkUrl && (
              <div style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
                <a href={project.linkUrl} target="_blank" rel="noreferrer" className="editorial-btn">
                  Visit External Link &rarr;
                </a>
              </div>
            )}
          </div>
        </article>

        {/* Right Column (Sidebar) */}
        <aside className="sidebar-responsive">
            
            {/* Author Block */}
            <div>
               <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '12px', fontWeight: 600 }}>About the Engineer</h4>
               <div className="author-block">
                   <div className="author-avatar">
                      <img src="/kabya.jpeg" alt="Kabya Ghosh" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                   </div>
                   <div>
                     <p style={{ fontSize: '1.05rem', color: '#333', lineHeight: 1.6, fontFamily: '"Georgia", serif' }}>
                        <strong style={{ color: '#d93025' }}>Kabya Ghosh</strong> is a Computer Science and Engineering undergraduate specializing in embedded systems, IoT architecture, and full-stack prototyping.
                     </p>
                     <div className="author-socials" style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                         <a href="https://github.com/TechByKabya" target="_blank" style={{ color: '#000', fontSize: '1.3rem', transition: 'color 0.2s' }}><i className="fab fa-github hover:text-red-600"></i></a>
                         <a href="https://linkedin.com/in/kabya-ghosh" target="_blank" style={{ color: '#000', fontSize: '1.3rem', transition: 'color 0.2s' }}><i className="fab fa-linkedin hover:text-red-600"></i></a>
                         <a href="mailto:kabyaghosh52005@gmail.com" style={{ color: '#000', fontSize: '1.3rem', transition: 'color 0.2s' }}><i className="fas fa-envelope hover:text-red-600"></i></a>
                     </div>
                   </div>
               </div>
            </div>

            {/* Up Next Projects */}
            {suggestedProjects && suggestedProjects.length > 0 && (
                <div>
                   <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '12px', fontWeight: 600 }}>More Projects</h4>
                   <div className="up-next-list">
                      {suggestedProjects.map((suggestion, i) => {
                        const sCoverUrl = getMediaUrl(suggestion.coverImage, '/mission_bot.jpeg')
                        return (
                          <a key={i} href={`/projects/${suggestion.slug}`} className="project-suggestion-link">
                            <div style={{ width: '100%', paddingTop: '66%', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
                              <img src={sCoverUrl} alt={suggestion.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                              <h5 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111', marginBottom: '8px', lineHeight: 1.3, fontFamily: '"Georgia", serif' }}>{suggestion.title}</h5>
                            </div>
                          </a>
                        )
                      })}
                   </div>
                </div>
            )}
        </aside>
      </div>
    </main>
  )
}

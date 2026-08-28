import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'

import { TextToSpeech } from '@/components/Frontend/TextToSpeech'

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

  const project = projects[0]

  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (mediaObj && typeof mediaObj === 'object' && mediaObj.url) {
      return mediaObj.url
    }
    return defaultUrl
  }
  const coverUrl = getMediaUrl(project.coverImage, '/mission_bot.jpeg')

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
        <a href="/projects" className="btn-secondary" style={{ display: 'inline-block', marginBottom: '30px', marginTop: '10px' }}>&larr; Back to Projects</a>
        
        <img src={coverUrl} alt={project.title} style={{ width: '100%', borderRadius: '15px', marginBottom: '40px' }} />
        
        <div>
            <span className="badge" style={{ marginBottom: '15px', display: 'inline-block', backgroundColor: '#f3f4f6', color: '#374151', padding: '6px 12px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>{project.tag}</span>
            <h1 style={{ fontSize: '3rem', color: '#1D1D1F', marginBottom: '10px', fontWeight: 800, letterSpacing: '-0.02em' }}>{project.title}</h1>
            <TextToSpeech targetId="post-content" />
            <p style={{ color: '#6b7280', fontSize: '1.2rem', lineHeight: 1.6, marginTop: '20px' }}>{project.description}</p>
        </div>

        <hr style={{ border: 'none', borderBottom: '1px solid rgba(0,0,0,0.08)', margin: '40px 0' }} />

        {project.content && (
          <div id="post-content" className="project-content" style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            <RichText data={project.content} enableGutter={false} />
          </div>
        )}

        {project.linkUrl && (
          <div style={{ marginTop: '50px' }}>
            <a href={project.linkUrl} target="_blank" rel="noreferrer" className="btn-primary" data-cursor="Visit Site">
              Visit External Link
            </a>
          </div>
        )}
      </div>
    </main>
  )
}

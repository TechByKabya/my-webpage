import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import './globals.css'

// Import new Client Components
import { HeroSection } from '@/components/Frontend/HeroSection'
import { ProjectGrid } from '@/components/Frontend/ProjectGrid'
import { BlogGrid } from '@/components/Frontend/BlogGrid'
import { FooterSection } from '@/components/Frontend/FooterSection'
import { SkillsSection } from '@/components/Frontend/SkillsSection'

export const revalidate = 60

export default async function PortfolioHome() {
  const payload = await getPayload({ config: configPromise })

  // ── Fetch Global Settings ──
  const settings = await payload.findGlobal({
    slug: 'homepage-settings',
    depth: 2,
  })

  // Safely extract media URLs
  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (!mediaObj) return defaultUrl
    if (typeof mediaObj === 'object' && mediaObj.url) return mediaObj.url
    if (typeof mediaObj === 'string') return mediaObj
    return defaultUrl
  }

  // ── Fetch Projects ──
  let projects: any[] = []
  try {
    const projRes = await payload.find({
      collection: 'projects',
      depth: 2,
      limit: 4,
    })
    projects = projRes.docs || []
  } catch (err) {
    console.error('Error fetching projects:', err)
  }

  // ── Fetch Blogs ──
  let blogs: any[] = []
  try {
    const blogRes = await payload.find({
      collection: 'blogs',
      depth: 2,
      limit: 4,
    })
    blogs = blogRes.docs || []
  } catch (err) {
    console.error('Error fetching blogs:', err)
  }

  const heroPhotoUrl = getMediaUrl(settings.heroPhoto, '/kabya.jpeg')
  const heroTitle = settings.heroTitle || 'Design.\nBuild.\nLearn.'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main className="bg-[#f8fafc] text-[#1D1D1F]" style={{ flex: 1 }}>
        <HeroSection 
          heroTitle={heroTitle}
          heroBio={settings.heroBio || 'I work where hardware and software meet — building practical projects, helping teams, and learning along the way.'}
          heroBadgeText={settings.heroBadgeText || 'Based in Bangladesh'}
          heroPhotoUrl={heroPhotoUrl}
          heroFloatCard1Icon={settings.heroFloatCard1Icon || 'fas fa-bolt'}
          heroFloatCard1Text={'AIOT'}
          heroFloatCard2Icon={settings.heroFloatCard2Icon || 'fas fa-brain'}
          heroFloatCard2Text={'Embedded & IoT'}
        />

        <BlogGrid blogs={blogs} />
        <ProjectGrid projects={projects} />
        
        <SkillsSection 
          title={settings.skillsSectionTitle || undefined}
          subtitle={settings.skillsSectionSubtitle || undefined}
          skills={(settings as any).skills || undefined}
        />
      </main>

      {/* Footer is OUTSIDE main so it always sits flush at the page bottom */}
      <FooterSection 
        footerVideoUrl={getMediaUrl(settings.footerVideoBg, '')}
        contactTitle={settings.contactTitle || ''}
        contactSubtitle={settings.contactSubtitle || ''}
        contactEmail={settings.contactEmail || ''}
        contactPhone={settings.contactPhone || ''}
        facebookUrl={settings.facebookUrl || ''}
        githubUrl={settings.githubUrl || ''}
        youtubeUrl={settings.youtubeUrl || ''}
        linkedinUrl={settings.linkedinUrl || ''}
      />
    </div>
  )
}

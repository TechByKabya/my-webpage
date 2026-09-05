import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
// globals.css is imported in layout.tsx which wraps this page — no need to re-import

export const metadata: Metadata = {
  title: 'Kabya Ghosh | Embedded System IoT Expert BD',
  description: 'Kabya Ghosh is an Embedded System IoT Expert in BD and student at Daffodil International University. Offering IoT solutions, low cost 3D printing and CAD design in Dhaka.',
}

// Import new Client Components
import { HeroSection } from '@/components/Frontend/HeroSection'
import { ProjectGrid } from '@/components/Frontend/ProjectGrid'
import { BlogGrid } from '@/components/Frontend/BlogGrid'
import { FooterSection } from '@/components/Frontend/FooterSection'
import { SkillsSection } from '@/components/Frontend/SkillsSection'
import { IndustrialPreview } from '@/components/Frontend/IndustrialPreview'

export const revalidate = 3600
export const maxDuration = 30

export default async function PortfolioHome() {
  let settings: any = {}
  let projects: any[] = []
  let totalProjects = 0
  let blogs: any[] = []
  let totalBlogs = 0
  let industrialProjects: any[] = []
  let totalIndustrialProjects = 0

  // Safely extract media URLs
  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (!mediaObj) return defaultUrl
    if (typeof mediaObj === 'object' && mediaObj.url) return mediaObj.url
    if (typeof mediaObj === 'string') return mediaObj
    return defaultUrl
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // ── Fetch all data in parallel instead of sequentially ──
    const [settingsRes, projRes, blogRes, indRes] = await Promise.all([
      payload.findGlobal({ slug: 'homepage-settings', depth: 2 }),
      payload.find({
        collection: 'projects',
        where: { visibility: { not_equals: 'private' } },
        depth: 2,
        limit: 4,
      }),
      payload.find({
        collection: 'blogs',
        where: { visibility: { not_equals: 'private' } },
        depth: 2,
        limit: 4,
      }),
      payload.find({
        collection: 'industrial-projects',
        where: {
          visibility: { not_equals: 'private' },
          featured: { equals: true },
        },
        depth: 2,
        sort: 'order',
        limit: 3,
      }),
    ])

    settings = settingsRes
    projects = projRes.docs || []
    totalProjects = projRes.totalDocs || 0
    blogs = blogRes.docs || []
    totalBlogs = blogRes.totalDocs || 0
    industrialProjects = indRes.docs || []
    totalIndustrialProjects = indRes.totalDocs || 0
  } catch (err) {
    console.error('Error fetching homepage data:', err)
  }


  const heroPhotoUrl = getMediaUrl(settings.heroPhoto, '/kabya.jpeg')
  const isHeroVideo = typeof settings.heroPhoto === 'object' && settings.heroPhoto !== null && (settings.heroPhoto as any).mimeType?.startsWith('video/')
  const heroTitle = settings.heroTitle || 'Design.\nBuild.\nLearn.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kabya Ghosh',
    jobTitle: 'Embedded System IoT Expert',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Daffodil International University'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressRegion: 'Dhaka',
      addressCountry: 'BD'
    },
    url: 'https://www.kabyac.tech',
    sameAs: [
      settings.githubUrl || 'https://github.com/TechByKabya',
      settings.linkedinUrl || '',
      settings.youtubeUrl || '',
      settings.facebookUrl || '',
    ].filter(Boolean),
    description: 'Embedded System IoT Expert in BD, CAD model designer, and provider of low cost 3D printing services in Dhaka.'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-[#f8fafc] text-[#1D1D1F]" style={{ flex: 1 }}>
        <div id="section-hero">
          <HeroSection 
            heroTitle={heroTitle}
            heroBio={settings.heroBio || 'I work where hardware and software meet — building practical projects, helping teams, and learning along the way.'}
            heroBadgeText={''}
            heroPhotoUrl={heroPhotoUrl}
            heroFloatCard1Icon={settings.heroFloatCard1Icon || 'fas fa-bolt'}
            heroFloatCard1Text={'AIOT'}
            heroFloatCard2Icon={settings.heroFloatCard2Icon || 'fas fa-brain'}
            heroFloatCard2Text={'Embedded & IoT'}
            isHeroVideo={isHeroVideo}
          />
        </div>

        <div id="section-blogs" style={{ 
          background: '#ffffff', 
          borderTop: '1px solid rgba(0,0,0,0.04)', 
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.02)' 
        }}>
          <BlogGrid blogs={blogs} totalCount={totalBlogs} />
        </div>

        <div id="section-projects" style={{ background: '#f8fafc' }}>
          <ProjectGrid projects={projects} totalCount={totalProjects} />
        </div>

        {industrialProjects && industrialProjects.length > 0 && (
          <div id="section-industrial" style={{ 
            background: '#ffffff', 
            borderTop: '1px solid rgba(0,0,0,0.04)', 
            boxShadow: '0 4px 30px rgba(0,0,0,0.02)',
            paddingBottom: '20px'
          }}>
            <IndustrialPreview projects={industrialProjects} totalCount={totalIndustrialProjects} />
          </div>
        )}
        
        <div id="section-skills" style={{ 
          background: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.02)'
        }}>
          <SkillsSection 
            title={settings.skillsSectionTitle || undefined}
            subtitle={settings.skillsSectionSubtitle || undefined}
            skills={(settings as any).skills || undefined}
          />
        </div>
      </main>

      {/* Footer is OUTSIDE main so it always sits flush at the page bottom */}
      <div id="section-footer">
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
    </div>
  )
}

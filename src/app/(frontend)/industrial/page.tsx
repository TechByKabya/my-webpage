import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { IndustrialGrid } from '@/components/Frontend/IndustrialGrid'
import { Cpu, Zap, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Industrial Engineering Solutions & Robotics | Kabya Ghosh',
  description: 'Explore elite industrial engineering solutions, automated robotic cells, IoT architectures, and smart manufacturing systems engineered by Kabya Ghosh.',
  metadataBase: new URL('https://www.kabyac.tech'),
  openGraph: {
    type: 'website',
    title: 'Industrial Engineering Solutions & Robotics | Kabya Ghosh',
    description: 'Explore elite industrial engineering solutions, automated robotic cells, IoT architectures, and smart manufacturing systems engineered by Kabya Ghosh.',
    url: 'https://www.kabyac.tech/industrial',
    siteName: 'Kabya Ghosh Portfolio',
    images: [{ url: 'https://www.kabyac.tech/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@kabya_ghosh',
    title: 'Industrial Engineering Solutions & Robotics | Kabya Ghosh',
    description: 'Explore elite industrial engineering solutions, automated robotic cells, IoT architectures, and smart manufacturing systems engineered by Kabya Ghosh.',
    images: ['https://www.kabyac.tech/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.kabyac.tech/industrial',
  },
}

export const revalidate = 3600
export const maxDuration = 30

export default async function IndustrialSolutionsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: rawProjects } = await payload.find({
    collection: 'industrial-projects',
    where: { visibility: { not_equals: 'private' } },
    sort: 'order',
    limit: 100,
    depth: 1,
  })

  const projects = (rawProjects || []) as any[]

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#07090e',
        color: '#f8fafc',
        paddingTop: '130px',
        paddingBottom: '100px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(2, 132, 199, 0.03) 60%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '92%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header / Hero */}
        <div style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '850px', margin: '0 auto 60px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            <Zap size={13} />
            <span>Elite Engineering Showcase</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 20px 0',
            }}
          >
            Industrial Solutions &amp; <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              High-End Architecture
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              lineHeight: 1.6,
              color: '#94a3b8',
              margin: '0 0 32px 0',
            }}
          >
            A dedicated showcase of enterprise-grade hardware engineering, autonomous robotic systems,
            and custom IoT deployments. Each project is crafted as a standalone, high-performance experience.
          </p>

          {/* Quick Metrics / Badges */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              padding: '16px 24px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <Cpu size={16} style={{ color: '#38bdf8' }} />
              <span>Embedded Hardware &amp; AI</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <ShieldCheck size={16} style={{ color: '#38bdf8' }} />
              <span>Industrial Reliability</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <Zap size={16} style={{ color: '#38bdf8' }} />
              <span>Standalone Experiences</span>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <IndustrialGrid projects={projects} />
      </div>
    </main>
  )
}

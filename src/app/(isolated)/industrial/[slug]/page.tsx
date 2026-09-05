import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'

export const revalidate = 3600
export const maxDuration = 30

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'industrial-projects',
      where: { visibility: { not_equals: 'private' } },
      limit: 1000,
      select: { slug: true },
    })
    return docs.filter((p) => Boolean(p.slug)).map((p) => ({ slug: p.slug as string }))
  } catch (e) {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'industrial-projects',
    where: { slug: { equals: slug }, visibility: { not_equals: 'private' } },
    limit: 1,
  })

  const project = docs?.[0] || null
  if (!project) {
    return {
      title: 'Industrial Project Not Found | Kabya Ghosh',
    }
  }

  return generateMeta({
    doc: project,
    url: `/industrial/${slug}`,
  })
}

export default async function IndustrialProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'industrial-projects',
    where: {
      slug: { equals: slug },
      visibility: { not_equals: 'private' },
    },
    limit: 1,
  })

  if (!docs || docs.length === 0) {
    return notFound()
  }

  const project = docs[0]

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#07080c',
      }}
    >
      <style>{`
        .industrial-floating-nav {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 999999;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          color: #f8fafc;
          text-decoration: none;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0.85;
        }
        .industrial-floating-nav:hover {
          opacity: 1;
          transform: translateY(-2px);
          background: rgba(15, 23, 42, 0.95);
          border-color: rgba(56, 189, 248, 0.5);
          box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.3);
          color: #ffffff;
        }
        .industrial-badge {
          display: inline-block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 9999px;
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          font-weight: 700;
        }
        .industrial-frame {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      `}</style>

      {/* Floating Modern Pill to Exit to Industrial Solutions */}
      <a
        href="/industrial"
        className="industrial-floating-nav"
        title="Return to Industrial Solutions Gallery"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span>Industrial Solutions</span>
        <span className="industrial-badge">Live View</span>
      </a>

      {/* Isolated Fullscreen Project Sandbox */}
      <iframe
        src={`/api/industrial-render/${slug}`}
        className="industrial-frame"
        title={project.title || 'Industrial Solution'}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
        loading="eager"
      />
    </main>
  )
}

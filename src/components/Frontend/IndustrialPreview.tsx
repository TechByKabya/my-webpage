// @ts-nocheck
'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Cpu, Zap } from 'lucide-react'

interface IndustrialProject {
  title: string
  tagline?: string
  description?: string
  slug?: string
  category?: string
  coverImage?: any
}

interface IndustrialPreviewProps {
  projects: IndustrialProject[]
  totalCount?: number
}

const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
  if (!mediaObj) return defaultUrl
  if (typeof mediaObj === 'object' && mediaObj.url) return mediaObj.url
  if (typeof mediaObj === 'string') return mediaObj
  return defaultUrl
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export const IndustrialPreview: React.FC<IndustrialPreviewProps> = ({
  projects,
  totalCount = 0,
}) => {
  // If no industrial projects exist yet, hide the preview section so the page stays clean
  if (!projects || projects.length === 0) {
    return null
  }

  const displayProjects = projects.slice(0, 3)
  const remainingCount = Math.max(0, totalCount - 2)
  const hasMore = totalCount > 3

  return (
    <section
      id="section-industrial"
      style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, #090b11 0%, #06070a 100%)',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Decorative Radial Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(2, 132, 199, 0.01) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '50px' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 14px',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            <Zap size={13} />
            <span>Elite Engineering</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 16px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Industrial Solutions
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Bespoke automation, high-precision robotics, and large-scale IoT hardware systems.
            Crafted as standalone, interactive architectural experiences.
          </p>
        </motion.div>

        {/* 3-Column Bento Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {displayProjects.map((proj, i) => {
            const coverUrl = getMediaUrl(proj.coverImage, '/mission_bot.jpeg')
            const isLastWithMore = hasMore && i === 2

            return (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                style={{
                  position: 'relative',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, rgba(18, 24, 38, 0.9) 0%, rgba(10, 14, 22, 0.98) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                className="industrial-preview-card"
              >
                <a
                  href={isLastWithMore ? '/industrial' : `/industrial/${proj.slug || '#'}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', background: '#0e121b' }}>
                    <Image
                      src={coverUrl}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      className="preview-card-img"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(8, 10, 16, 0.1) 0%, rgba(8, 10, 16, 0.9) 100%)',
                      }}
                    />

                    {/* Tag Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: 'rgba(8, 11, 20, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#38bdf8',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {proj.category || 'Industrial Solution'}
                    </div>

                    {/* Arrow Button */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      <ArrowUpRight size={16} />
                    </div>

                    {/* If last card with more */}
                    {isLastWithMore && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(6, 9, 15, 0.75)',
                          backdropFilter: 'blur(8px)',
                          zIndex: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}
                      >
                        <span style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: '#38bdf8' }}>
                          +{remainingCount}
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: '600', letterSpacing: '0.5px', marginTop: '6px' }}>
                          More Solutions
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3
                      style={{
                        margin: '0 0 6px 0',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        lineHeight: 1.3,
                      }}
                    >
                      {proj.title}
                    </h3>

                    {proj.tagline && (
                      <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 500, marginBottom: '10px' }}>
                        {proj.tagline}
                      </div>
                    )}

                    {proj.description && (
                      <p
                        style={{
                          margin: '0 0 16px 0',
                          fontSize: '0.84rem',
                          lineHeight: 1.55,
                          color: '#94a3b8',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {proj.description}
                      </p>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        Launch Solution &rarr;
                      </span>
                    </div>
                  </div>
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* View All CTA */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="/industrial"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(2, 132, 199, 0.25) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontSize: '0.92rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(56, 189, 248, 0.15)',
              transition: 'all 0.3s ease',
            }}
            className="industrial-cta-btn"
          >
            <span>Explore All Industrial Solutions</span>
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>

      <style>{`
        .industrial-preview-card:hover {
          border-color: rgba(56, 189, 248, 0.4) !important;
          box-shadow: 0 20px 45px -10px rgba(56, 189, 248, 0.2) !important;
        }
        .industrial-preview-card:hover .preview-card-img {
          transform: scale(1.06);
        }
        .industrial-cta-btn:hover {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 6px 25px rgba(2, 132, 199, 0.4) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  )
}

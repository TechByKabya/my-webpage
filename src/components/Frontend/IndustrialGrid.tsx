// @ts-nocheck
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Cpu, Layers, Sparkles, Filter } from 'lucide-react'

interface IndustrialProject {
  id?: string
  title: string
  slug?: string
  category?: string
  tagline?: string
  description?: string
  coverImage?: any
  order?: number
}

interface IndustrialGridProps {
  projects: IndustrialProject[]
}

const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
  if (!mediaObj) return defaultUrl
  if (typeof mediaObj === 'object' && mediaObj.url) return mediaObj.url
  if (typeof mediaObj === 'string') return mediaObj
  return defaultUrl
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const IndustrialGrid: React.FC<IndustrialGridProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Derive unique categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))]

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory)

  return (
    <div style={{ width: '100%' }}>
      {/* Category Pills Filter */}
      {categories.length > 2 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '40px',
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0.35) 100%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#38bdf8' : '#94a3b8',
                  boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid of Industrial Projects */}
      {filteredProjects.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <Cpu size={40} style={{ margin: '0 auto 16px auto', color: '#38bdf8', opacity: 0.6 }} />
          <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', marginBottom: '8px' }}>
            No Industrial Solutions In This Category
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Check back soon or select &ldquo;All&rdquo; to view all enterprise engineering solutions.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '30px',
          }}
        >
          <AnimatePresence>
            {filteredProjects.map((proj, idx) => {
              const coverUrl = getMediaUrl(proj.coverImage, '/mission_bot.jpeg')

              return (
                <motion.article
                  key={proj.slug || idx}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(11, 15, 25, 0.95) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  className="industrial-card-hover"
                >
                  <a
                    href={`/industrial/${proj.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    {/* Media Preview Container */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '240px',
                        overflow: 'hidden',
                        background: '#0e121b',
                      }}
                    >
                      <Image
                        src={coverUrl}
                        alt={proj.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        className="industrial-card-img"
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(7, 9, 15, 0.1) 0%, rgba(7, 9, 15, 0.85) 100%)',
                        }}
                      />

                      {/* Category Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          background: 'rgba(7, 10, 18, 0.85)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#38bdf8',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }}></span>
                        {proj.category || 'Industrial System'}
                      </div>

                      {/* Top Right Arrow Icon */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(8px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          transition: 'transform 0.3s ease, background 0.3s ease',
                        }}
                        className="industrial-arrow-bubble"
                      >
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          lineHeight: 1.3,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {proj.title}
                      </h3>

                      {proj.tagline && (
                        <div
                          style={{
                            fontSize: '0.9rem',
                            color: '#38bdf8',
                            fontWeight: 500,
                            marginBottom: '12px',
                            lineHeight: 1.4,
                          }}
                        >
                          {proj.tagline}
                        </div>
                      )}

                      {proj.description && (
                        <p
                          style={{
                            margin: '0 0 20px 0',
                            fontSize: '0.88rem',
                            lineHeight: 1.6,
                            color: '#94a3b8',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {proj.description}
                        </p>
                      )}

                      {/* Bottom Action Footer */}
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '16px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#e2e8f0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          Launch Experience
                          <ArrowUpRight size={15} style={{ color: '#38bdf8' }} />
                        </span>

                        <span
                          style={{
                            fontSize: '0.72rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#64748b',
                            fontWeight: 600,
                          }}
                        >
                          Elite Post
                        </span>
                      </div>
                    </div>
                  </a>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <style>{`
        .industrial-card-hover:hover {
          border-color: rgba(56, 189, 248, 0.35) !important;
          box-shadow: 0 25px 50px -12px rgba(56, 189, 248, 0.15), 0 0 25px rgba(56, 189, 248, 0.08) !important;
        }
        .industrial-card-hover:hover .industrial-card-img {
          transform: scale(1.05);
        }
        .industrial-card-hover:hover .industrial-arrow-bubble {
          transform: translate(2px, -2px);
          background: #0284c7 !important;
          border-color: #38bdf8 !important;
        }
      `}</style>
    </div>
  )
}

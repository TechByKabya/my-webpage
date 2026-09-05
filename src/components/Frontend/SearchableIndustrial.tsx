'use client'

import React, { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import Image from 'next/image'

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

export default function SearchableIndustrial({ projects }: { projects: IndustrialProject[] }) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Extract unique categories
  const categories = useMemo(() => {
    const raw = projects.map((p) => p.category).filter(Boolean) as string[]
    return ['All', ...Array.from(new Set(raw))]
  }, [projects])

  // Filter by category first
  const categoryFiltered = useMemo(() => {
    if (selectedCategory === 'All') return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [projects, selectedCategory])

  // Fuzzy search over category-filtered items
  const fuse = useMemo(() => {
    return new Fuse(categoryFiltered, {
      keys: ['title', 'description', 'tagline', 'category'],
      threshold: 0.4,
    })
  }, [categoryFiltered])

  const results = query ? fuse.search(query).map((r) => r.item) : categoryFiltered

  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (!mediaObj) return defaultUrl
    if (typeof mediaObj === 'object' && mediaObj.url) return mediaObj.url
    if (typeof mediaObj === 'string') return mediaObj
    return defaultUrl
  }

  return (
    <>
      <style>{`
        .search-header-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          padding-bottom: 30px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          margin-bottom: 30px;
        }
        .search-header-left {
          flex: 1 1 300px;
          width: 100%;
        }
        .search-input-wrapper {
          flex: 1 1 400px;
          display: flex;
          justify-content: flex-end;
        }
        .search-bar-inner {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 500px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #ffffff;
          padding: 4px 4px 4px 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .category-pill {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          color: #4b5563;
          transition: all 0.2s ease;
        }
        .category-pill:hover {
          border-color: #0d9488;
          color: #0d9488;
        }
        .category-pill.active {
          background: #0d9488;
          border-color: #0d9488;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(13, 148, 136, 0.25);
        }
        @media (max-width: 768px) {
          .search-header-container {
            flex-direction: column;
            align-items: flex-start;
          }
          .search-header-left {
            flex: 1 1 auto;
          }
          .search-input-wrapper {
            flex: 1 1 auto;
            width: 100%;
            justify-content: flex-start;
          }
          .search-bar-inner {
            max-width: 100%;
          }
          .search-btn {
            padding: 10px 12px !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>

      {/* Header & Search Bar (matches Projects & Blogs pages) */}
      <div className="search-header-container">
        <div className="search-header-left">
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1D1D1F', margin: 0, lineHeight: 1.2 }}>
            Industrial Solutions
          </h2>
          <p className="sub-head" style={{ fontSize: '1rem', color: '#6b7280', margin: '5px 0 0 0' }}>
            High-impact industrial engineering projects, bespoke robotics, and autonomous systems.
          </p>
        </div>

        <div className="search-input-wrapper">
          <div className="search-bar-inner">
            <i className="fas fa-search" style={{ color: '#9ca3af', fontSize: '1rem', marginRight: '10px' }}></i>
            <input
              type="text"
              placeholder="Search industrial solutions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '1rem',
                color: '#374151',
                width: '100%',
              }}
            />
            <button
              className="search-btn"
              style={{
                background: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills (if more than 1 category) */}
      {categories.length > 2 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '36px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Bento Grid */}
      {results.length === 0 ? (
        <div style={{ textAlign: 'center', width: '100%', padding: '60px 20px', color: '#6b7280' }}>
          {query
            ? `No industrial solutions found matching "${query}". Try another search term.`
            : 'No industrial solutions published yet. Check back soon!'}
        </div>
      ) : (
        <div className="bento-grid">
          {results.map((proj, i) => {
            const coverUrl = getMediaUrl(proj.coverImage, '/mission_bot.jpeg')

            return (
              <div
                className="project-card span-1"
                data-cursor="View Solution"
                key={proj.slug || i}
              >
                <a href={`/industrial/${proj.slug || '#'}`} className="full-link">
                  <div className="card-img-wrap">
                    <Image
                      src={coverUrl}
                      alt={proj.title}
                      fill
                      className="p-bg"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="p-content">
                    <span className="p-tag">{proj.category || 'Industrial Solution'}</span>
                    <h3>{proj.title}</h3>
                    <p>{proj.description || proj.tagline}</p>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

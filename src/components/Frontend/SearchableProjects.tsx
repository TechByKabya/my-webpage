'use client'

import React, { useState, useMemo } from 'react'
import Fuse from 'fuse.js'

export default function SearchableProjects({ projects }: { projects: any[] }) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => {
    return new Fuse(projects, {
      keys: ['title', 'description', 'tag'],
      threshold: 0.4,
    })
  }, [projects])

  const results = query ? fuse.search(query).map(r => r.item) : projects

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
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          margin-bottom: 40px;
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

      <div className="search-header-container">
        {/* Left Side: Header */}
        <div className="search-header-left">
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1D1D1F', margin: 0, lineHeight: 1.2 }}>All Projects</h2>
            <p className="sub-head" style={{ fontSize: '1rem', color: '#6b7280', margin: '5px 0 0 0' }}>A comprehensive list of my work, experiments, and case studies.</p>
        </div>

        {/* Right Side: Search Bar */}
        <div className="search-input-wrapper">
          <div className="search-bar-inner">
            <i className="fas fa-search" style={{ color: '#9ca3af', fontSize: '1rem', marginRight: '10px' }}></i>
            <input
              type="text"
              placeholder="Search projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '1rem',
                color: '#374151',
                width: '100%'
              }}
            />
            <button className="search-btn" style={{
              background: '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>Search Projects</button>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#6b7280' }}>
          No projects found matching "{query}". Try another search term.
        </div>
      ) : (
        <div className="bento-grid">
          {results.map((proj, i) => {
            const coverUrl = getMediaUrl(proj.coverImage, '/mission_bot.jpeg')
            if (proj.isGithubCard) {
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
      )}
    </>
  )
}

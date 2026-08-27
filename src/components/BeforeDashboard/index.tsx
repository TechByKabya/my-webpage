'use client'
import React from 'react'

const BeforeDashboard: React.FC = () => {
  const cards = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      title: 'Home Page',
      desc: 'Edit hero text, profile photo, contact info, and social links',
      href: '/admin/globals/homepage-settings',
      color: '#6366f1',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      title: 'Projects',
      desc: 'Add, edit or remove portfolio projects and case studies',
      href: '/admin/collections/projects',
      color: '#8b5cf6',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      title: 'Blog Posts',
      desc: 'Write and publish articles, tutorials, and blog content',
      href: '/admin/collections/blogs',
      color: '#06b6d4',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      ),
      title: 'Media Library',
      desc: 'Upload and manage images used across your website',
      href: '/admin/collections/media',
      color: '#10b981',
    },
  ]

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Welcome Header */}
      <div className="dashboard-welcome">
        <div>
          <h2 className="dashboard-welcome__title">Welcome back, Kabya</h2>
          <p className="dashboard-welcome__sub">Manage your portfolio website from this control panel.</p>
        </div>
        <span className="dashboard-welcome__badge">CMS Dashboard</span>
      </div>

      {/* Quick Action Cards */}
      <div className="dashboard-grid">
        {cards.map((card) => (
          <a key={card.href} href={card.href} className="dashboard-card">
            <div className="dashboard-card__icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="dashboard-card__title">{card.title}</div>
            <div className="dashboard-card__desc">{card.desc}</div>
            <div className="dashboard-card__arrow">Open &rarr;</div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default BeforeDashboard

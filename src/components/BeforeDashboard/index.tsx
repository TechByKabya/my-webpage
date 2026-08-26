'use client'
import React from 'react'

const BeforeDashboard: React.FC = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '24px',
      color: 'white',
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'white' }}>
        👋 Welcome to your Website Dashboard
      </h2>
      <p style={{ color: '#a0aec0', marginBottom: '24px', fontSize: '15px' }}>
        Manage all your website content from here. No coding needed.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {[
          { icon: '🏠', title: 'Homepage', desc: 'Edit your title, photo, skills, contact info', href: '/admin/globals/homepage-settings' },
          { icon: '🚀', title: 'Projects', desc: 'Add or edit portfolio projects', href: '/admin/collections/projects' },
          { icon: '📝', title: 'Blog Posts', desc: 'Write and publish articles', href: '/admin/collections/posts' },
          { icon: '🖼️', title: 'Image Slider', desc: 'Manage homepage slider photos', href: '/admin/collections/hero-slides' },
          { icon: '📁', title: 'Media', desc: 'Upload and manage all images', href: '/admin/collections/media' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '16px',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.2s',
              display: 'block',
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.2)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.5)' }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: '#718096' }}>{item.desc}</div>
          </a>
        ))}
      </div>

      <p style={{ marginTop: '20px', fontSize: '13px', color: '#4a5568' }}>
        💡 Tip: Click "Homepage Settings" to change your name, photo, bio, skills, and contact info.
      </p>
    </div>
  )
}

export default BeforeDashboard

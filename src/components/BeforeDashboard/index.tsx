import React from 'react'
import '../Admin/admin.css'

const BeforeDashboard: React.FC = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '24px',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: 'white', letterSpacing: '-0.02em' }}>
        Welcome to your CMS Dashboard ✨
      </h2>
      <p style={{ color: '#E2E8F0', marginBottom: '32px', fontSize: '16px' }}>
        Manage your website content efficiently from this centralized hub.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { icon: '🏠', title: 'Homepage Customization', desc: 'Edit the layout and content of your main page', href: '/admin/globals/homepage-settings' },
          { icon: '📄', title: 'Pages', desc: 'Create and manage website pages', href: '/admin/collections/pages' },
          { icon: '🧭', title: 'Menu Creator', desc: 'Manage your website navigation', href: '/admin/globals/header' },
          { icon: '🖼️', title: 'Media Library', desc: 'Upload and manage all images and files', href: '/admin/collections/media' },
          { icon: '👥', title: 'Users', desc: 'Manage system administrators', href: '/admin/collections/users' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="dashboard-card"
          >
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
            <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>{item.title}</div>
            <div style={{ fontSize: '13px', color: '#CBD5E0', lineHeight: 1.4 }}>{item.desc}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default BeforeDashboard

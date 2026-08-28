'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useConfig, useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Settings, FileText, Database, Folder, Image as ImageIcon, Briefcase, Key } from 'lucide-react'

export const CustomNav: React.FC = () => {
  const { config } = useConfig()
  const { user } = useAuth()
  const pathname = usePathname()

  // We only want to render visible collections/globals
  // Functions in config aren't serialized to Client Components, so we explicitly filter by slug
  const allowedCollections = ['projects', 'blogs', 'drive-files', 'media']
  const allowedGlobals = ['homepage-settings', 'site-settings', 'drive-settings']

  const visibleCollections = config.collections.filter(c => allowedCollections.includes(c.slug))
  const visibleGlobals = config.globals.filter(g => allowedGlobals.includes(g.slug))

  // Clean labels if they have zero width spaces
  const cleanLabel = (label: any, fallback: string) => {
    let text = fallback
    if (typeof label === 'string') text = label
    else if (label && typeof label === 'object' && label.singular) text = label.singular
    else if (label && typeof label === 'object' && label.plural) text = label.plural
    
    return text.replace(/[\u200B]/g, '')
  }

  const getIcon = (slug: string) => {
    switch (slug) {
      case 'drive-files': return <Folder size={18} />
      case 'drive-settings': return <Key size={18} />
      case 'projects': return <Briefcase size={18} />
      case 'blogs': return <FileText size={18} />
      case 'media': return <ImageIcon size={18} />
      case 'homepage-settings': return <LayoutDashboard size={18} />
      case 'site-settings': return <Settings size={18} />
      default: return <Database size={18} />
    }
  }

  const navItems = [
    ...visibleCollections.map((c) => ({
      href: `${config.routes.admin}/collections/${c.slug}`,
      label: cleanLabel(c.labels?.plural || c.labels, c.slug),
      icon: getIcon(c.slug),
    })),
    ...visibleGlobals.map((g) => ({
      href: `${config.routes.admin}/globals/${g.slug}`,
      label: cleanLabel(g.label, g.slug),
      icon: getIcon(g.slug),
    }))
  ]

  // Re-sort alphabetically as requested previously
  navItems.sort((a, b) => a.label.localeCompare(b.label))

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      padding: '24px 16px',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50
    }}>
      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, x: -20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '32px 24px 20px' }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            color: '#0f172a',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              padding: '8px',
              borderRadius: '12px',
              color: 'white',
              display: 'flex',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}>
              <LayoutDashboard size={20} />
            </div>
            CMS Admin
          </h2>
        </div>

        {/* Navigation Links */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {navItems.map((item, i) => {
            const isActive = pathname.startsWith(item.href)
            
            return (
              <Link href={item.href} key={item.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 6, backgroundColor: isActive ? '#e0e7ff' : '#f1f5f9' }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    backgroundColor: isActive ? '#e0e7ff' : 'transparent',
                    color: isActive ? '#4338ca' : '#475569',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem',
                    gap: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.2s, background-color 0.2s',
                  }}
                >
                  <div style={{ 
                    color: isActive ? '#4f46e5' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s'
                  }}>
                    {item.icon}
                  </div>
                  
                  <span style={{ flex: 1, letterSpacing: '-0.01em' }}>{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '15%',
                        bottom: '15%',
                        width: '4px',
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: '#4f46e5'
                      }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Footer / User Profile */}
        <div style={{ 
          padding: '24px 20px', 
          borderTop: '1px solid rgba(0,0,0,0.04)',
          background: 'rgba(248, 250, 252, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: '#1e293b',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                {user?.name || 'Admin'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {user?.email}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.href = `${config.routes.admin}/logout`}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: '#fef2f2',
              color: '#ef4444',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.1s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fef2f2'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useConfig, useAuth, useNav } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Settings, FileText, Database, Folder, Image as ImageIcon, Briefcase, Key, X } from 'lucide-react'

export const CustomNav: React.FC = () => {
  const { config } = useConfig()
  const { user } = useAuth()
  const pathname = usePathname()
  
  // Safe useNav extraction (in case it's used outside provider during build)
  let navContext = { navOpen: false, setNavOpen: (v: boolean) => {} }
  try {
    navContext = useNav()
  } catch (e) {
    // ignore
  }
  const { navOpen, setNavOpen } = navContext

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
    <>
      <style>{`
        .custom-nav-wrapper {
          width: 280px;
          height: 100vh;
          position: sticky;
          top: 0;
          padding: 24px 16px;
          background: transparent;
          display: flex;
          flex-direction: column;
          z-index: 50;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        /* On desktop, when nav is collapsed (navOpen is false), hide it or shrink it */
        @media (min-width: 1025px) {
          .custom-nav-wrapper:not(.nav-open) {
            width: 0px;
            padding-left: 0;
            padding-right: 0;
            opacity: 0;
            pointer-events: none;
          }
        }

        .custom-nav-backdrop {
          display: none;
        }
        
        .mobile-close-btn {
          display: none;
        }

        @media (max-width: 1024px) {
          /* Override Payload's default grid layout that reserves space for the Nav */
          :global(.template-default) {
            display: block !important;
          }
          :global(.template-default__nav-wrapper) {
            position: absolute !important;
            width: 0 !important;
            height: 0 !important;
            overflow: visible !important;
          }
          :global(.template-default__wrap) {
            margin-left: 0 !important;
            padding-left: 0 !important;
            width: 100% !important;
          }
          /* Alternatively, without :global if Payload doesn't use CSS modules for template */
          .template-default {
            display: block !important;
          }
          .template-default__nav-wrapper {
            position: absolute !important;
            width: 0 !important;
            height: 0 !important;
            overflow: visible !important;
          }
          .template-default__wrap {
            margin-left: 0 !important;
            padding-left: 0 !important;
            width: 100% !important;
          }

          .custom-nav-wrapper {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 9999;
            transform: translateX(-100%);
            padding: 16px;
          }
          
          .custom-nav-wrapper.nav-open {
            transform: translateX(0);
          }
          
          .custom-nav-backdrop.nav-open {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(15, 23, 42, 0.4);
            z-index: 9998;
            backdrop-filter: blur(4px);
            opacity: 1;
            animation: fadeIn 0.3s ease-out forwards;
          }
          
          .mobile-close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            color: #0f172a;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <div 
        className={`custom-nav-backdrop ${navOpen ? 'nav-open' : ''}`} 
        onClick={() => setNavOpen(false)} 
      />
      
      <div className={`custom-nav-wrapper ${navOpen ? 'nav-open' : ''}`}>
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
        <div style={{ padding: '32px 24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <button 
            className="mobile-close-btn"
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
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
              <Link 
                href={item.href} 
                key={item.href} 
                style={{ textDecoration: 'none' }}
                onClick={() => setNavOpen(false)}
              >
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
    </>
  )
}

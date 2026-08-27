import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

export const Icon = async () => {
  headers() // Force dynamic rendering
  const payload = await getPayload({ config: configPromise })
  
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })

  // If a logo is uploaded, render the image
  if (siteSettings?.logo && typeof siteSettings.logo === 'object' && siteSettings.logo.url) {
    return (
      <img 
        src={siteSettings.logo.url} 
        alt={siteSettings.logo.alt || 'Admin Icon'} 
        style={{ height: '34px', width: '34px', objectFit: 'contain' }} 
      />
    )
  }

  // Fallback to text icon
  return (
    <div style={{
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      width: '34px',
      height: '34px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '800',
      fontSize: '17px',
      boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
      fontFamily: 'Inter, sans-serif',
      flexShrink: 0,
    }}>
      K
    </div>
  )
}

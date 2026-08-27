import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

export const Logo = async () => {
  headers() // Force dynamic rendering
  const payload = await getPayload({ config: configPromise })
  
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })

  // If a logo is uploaded, render the image
  if (siteSettings?.logo && typeof siteSettings.logo === 'object' && siteSettings.logo.url) {
    return (
      <div className="custom-admin-logo">
        <img 
          src={siteSettings.logo.url} 
          alt={siteSettings.logo.alt || 'Admin Logo'} 
          style={{ height: '34px', objectFit: 'contain' }} 
        />
        <span className="logo-text">Kabya Dev</span>
      </div>
    )
  }

  // Fallback to text logo
  return (
    <div className="custom-admin-logo">
      <div className="logo-icon">K</div>
      <span className="logo-text">Kabya Dev</span>
    </div>
  )
}

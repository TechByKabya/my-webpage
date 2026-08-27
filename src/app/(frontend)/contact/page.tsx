// @ts-nocheck

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ContactForm } from '@/components/Frontend/ContactForm'
import { FooterSection } from '@/components/Frontend/FooterSection'

export const revalidate = 60

export default async function ContactPage() {
  const payload = await getPayload({ config: configPromise })

  const settings = await payload.findGlobal({
    slug: 'homepage-settings',
    depth: 2,
  })

  const getMediaUrl = (mediaObj: any, defaultUrl: string) => {
    if (!mediaObj) return defaultUrl
    if (typeof mediaObj === 'object' && mediaObj.url) return mediaObj.url
    if (typeof mediaObj === 'string') return mediaObj
    return defaultUrl
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main className="text-[#1D1D1F]" style={{ flex: 1, padding: '150px 20px 80px' }}>
        <ContactForm title={settings.contactTitle || 'Send a Message'} subtitle={settings.contactSubtitle} />
      </main>

      <FooterSection 
        footerVideoUrl={getMediaUrl(settings.footerVideoBg, '')}
        contactTitle={settings.contactTitle || ''}
        contactSubtitle={settings.contactSubtitle || ''}
        contactEmail={settings.contactEmail || ''}
        contactPhone={settings.contactPhone || ''}
        facebookUrl={settings.facebookUrl || ''}
        githubUrl={settings.githubUrl || ''}
        youtubeUrl={settings.youtubeUrl || ''}
        linkedinUrl={settings.linkedinUrl || ''}
        hideContactForm={true}
      />
    </div>
  )
}

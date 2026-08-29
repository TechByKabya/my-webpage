// @ts-nocheck

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ContactForm } from '@/components/Frontend/ContactForm'
import { FooterSection } from '@/components/Frontend/FooterSection'
import { LottieAnimation } from '@/components/Frontend/LottieAnimation'

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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>

      <main
        className="contact-page-main"
        style={{
          flex: 1,
          paddingTop: '112px',
          paddingBottom: '80px',
          paddingLeft: '24px',
          paddingRight: '24px',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
            width: '100%',
          }}
        >

          {/* ── LEFT: Text + Animation ── */}
          <div
            className="contact-left"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900,
              color: '#1d1d1f',
              margin: 0,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}>
              Get in Touch
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              margin: 0,
              maxWidth: '320px',
              lineHeight: 1.6,
            }}>
              Have a question, a project in mind, or just want to say hi? Fill out the form and I'll get back to you shortly.
            </p>
            <div className="contact-lottie" style={{ width: '220px', marginTop: '8px' }}>
              <LottieAnimation
                src="/contactus-animation.json"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>

          {/* ── RIGHT: The Form ── */}
          <div style={{ width: '100%' }}>
            <ContactForm
              title={settings.contactTitle || 'Send a Message'}
              subtitle={settings.contactSubtitle}
            />
          </div>

        </div>
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

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Script from 'next/script'
import { ClientScripts } from '@/app/(frontend)/ClientScripts'
import { Chatbot } from '@/components/Frontend/Chatbot'
import { SplashScreen } from '@/components/Frontend/SplashScreen'

export default async function GlobalElements() {
  const payload = await getPayload({ config: configPromise })

  // Fetch homepage settings (for nav logo, chatbot, menu)
  const settings = await payload.findGlobal({
    slug: 'homepage-settings',
    depth: 1,
  })

  // Fetch site settings separately (for loading animation)
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })

  const botWelcome = settings.botWelcomeMessage || 'Hello — ask me about projects, skills, or how to get in touch.'

  // Logo video used in the nav/footer
  const footerVideoBg = settings.footerVideoBg
  const logoVideoUrl = footerVideoBg && typeof footerVideoBg === 'object' && 'url' in footerVideoBg
    ? (footerVideoBg as any).url as string
    : typeof footerVideoBg === 'string' ? footerVideoBg : undefined

  // Separate loading animation from Site Settings
  const loadingAnimationMedia = (siteSettings as any).loadingAnimation
  const loadingAnimationUrl = loadingAnimationMedia && typeof loadingAnimationMedia === 'object' && 'url' in loadingAnimationMedia
    ? (loadingAnimationMedia as any).url as string
    : typeof loadingAnimationMedia === 'string' ? loadingAnimationMedia : undefined

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <canvas id="particle-canvas"></canvas>

      {/* SPLASH SCREEN — uses dedicated loading animation from Site Settings */}
      <SplashScreen logoVideoUrl={loadingAnimationUrl ?? logoVideoUrl} />

      <header id="main-nav">
          <div className="nav-container">
              {/* Logo — video or text fallback */}
              <a href="/" className="logo" style={{ display: 'flex', alignItems: 'center', padding: 0, background: 'none' }}>
                {logoVideoUrl ? (
                  <video
                    src={logoVideoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      height: '52px',
                      width: '52px',
                      objectFit: 'contain',
                      display: 'block',
                      mixBlendMode: 'multiply',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      background: 'transparent',
                    }}
                  />
                ) : (
                  <>Kabya<span>.Dev</span></>
                )}
              </a>

              <ul className="menu" id="nav-menu">
                  {(settings.menuItems && settings.menuItems.length > 0 ? settings.menuItems : [
                      { label: 'Home', link: '/', isButton: false },
                      { label: 'Projects', link: '/projects', isButton: false },
                      { label: 'Blogs', link: '/blogs', isButton: false },
                      { label: 'Contact', link: '/contact', isButton: true },
                  ]).map((item, i) => (
                      <li key={i}>
                          <a 
                            href={item.link} 
                            className={item.isButton ? "btn-nav" : ""} 
                            data-cursor={item.label}
                          >
                            {item.label}
                          </a>
                      </li>
                  ))}
              </ul>

              <button className="hamburger" id="hamburger-menu">
                  <i className="fas fa-bars"></i>
              </button>
          </div>
      </header>



      {/* CHATBOT */}
      <Chatbot initialMessage={botWelcome} />

      <Script src="/particles.js" strategy="lazyOnload" />
      <ClientScripts />
    </>
  )
}


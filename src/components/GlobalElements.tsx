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
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <canvas id="particle-canvas"></canvas>

      {/* SPLASH SCREEN — uses dedicated loading animation from Site Settings */}
      <SplashScreen logoVideoUrl={loadingAnimationUrl ?? logoVideoUrl} />

      {/* Mobile Overlay */}
      <div id="mobile-overlay" className="mobile-overlay"></div>

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

              <nav id="nav-menu" className="nav-menu-wrapper">
                  {/* Mobile Sidebar Header */}
                  <div className="mobile-sidebar-header hide-on-desktop">
                     <img src="/kabya.jpeg" alt="Kabya Ghosh" className="mobile-avatar" />
                     <div className="mobile-profile-info">
                        <h4>Kabya Ghosh</h4>
                        <p>Embedded System IoT Engineer</p>
                     </div>
                  </div>

                  {/* Menu Links Centered */}
                  <div className="mobile-menu-center">
                    <ul className="menu">
                        {(settings.menuItems && settings.menuItems.length > 0 ? settings.menuItems : [
                            { label: 'Home', link: '/', isButton: false, icon: 'fas fa-home' },
                            { label: 'Blogs', link: '/blogs', isButton: false, icon: 'fas fa-pen-nib' },
                            { label: 'Projects', link: '/projects', isButton: false, icon: 'fas fa-layer-group' },
                            { label: '3D Printing', link: '/3d-printing', isButton: false, icon: 'fas fa-cube' },
                            { label: 'Contact', link: '/contact', isButton: true, icon: 'fas fa-envelope' },
                        ]).map((item, i) => (
                            <li key={i}>
                                <a 
                                  href={item.link} 
                                  className={item.isButton ? "btn-nav" : ""} 
                                  data-cursor={item.label}
                                >
                                  <i className={`mobile-nav-icon hide-on-desktop ${(item as any).icon || 'fas fa-circle-notch'}`}></i>
                                  <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                  </div>

                  {/* Mobile Sidebar Footer */}
                  <div className="mobile-sidebar-footer hide-on-desktop">
                      <a href="/faq" className="faq-button">
                          <i className="fas fa-info-circle"></i> 
                          <span>Help & Information</span>
                      </a>
                  </div>
              </nav>

              <button className="hamburger" id="hamburger-menu" aria-label="Toggle Menu">
                  <div className="morph-hamburger">
                      <span></span>
                      <span></span>
                      <span></span>
                  </div>
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


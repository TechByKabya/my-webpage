'use client'

import React, { useEffect, useState } from 'react'

const TypingEffect: React.FC<{text: string}> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('')
  
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index))
      index++
      if (index > text.length) {
        clearInterval(interval)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {displayedText}
      <span style={{
        display: 'inline-block',
        width: 'clamp(3px, 0.4vw, 5px)',
        height: '1em',
        backgroundColor: 'white',
        marginLeft: '4px',
        animation: 'loginBlinkCursor 0.75s step-end infinite'
      }} />
    </span>
  )
}

// Full CSS injection — completely overrides Payload's login page styles
const LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

  /* ── RESET PAGE ── */
  section.login.template-minimal {
    display: flex !important;
    flex-direction: row !important;
    width: 100vw !important;
    max-width: 100vw !important;
    min-height: 100vh !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
    background: #0d0f1a !important;
    position: relative !important;
  }

  /* ── HIDE PAYLOAD'S DEFAULT BRAND/LOGO ── */
  .login__brand {
    display: none !important;
  }

  /* ── RIGHT PANEL (Payload's .template-minimal__wrap) ── */
  .template-minimal__wrap {
    width: 48% !important;
    min-width: 48% !important;
    max-width: 48% !important;
    min-height: 100vh !important;
    background: #ffffff !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 0 0 auto !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    position: relative !important;
    z-index: 5 !important;
    overflow: hidden !important;
  }

  /* Subtle mesh background on white panel */
  .template-minimal__wrap::before {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    background:
      radial-gradient(ellipse 80% 50% at 100% 0%, rgba(79,70,229,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 60% 60% at 0% 100%, rgba(99,102,241,0.04) 0%, transparent 70%) !important;
    pointer-events: none !important;
    z-index: 0 !important;
  }

  /* ── FORM CONTAINER ── */
  .login__form {
    position: relative !important;
    z-index: 1 !important;
    padding: 0 64px 56px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }

  /* ── STRIP OUT ALL FORM BOXES ── */
  .login form,
  .payload-form,
  .payload-form-wrapper,
  .login__form__inputWrap,
  .login__form div:not(.login__brand) {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }

  /* ── INPUT WRAP ── */
  .login__form__inputWrap {
    display: flex !important;
    flex-direction: column !important;
    gap: 20px !important;
    margin-bottom: 8px !important;
  }

  /* ── LABELS ── */
  .login__form label,
  .login__form .field-label {
    color: #374151 !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
    margin-bottom: 6px !important;
    display: block !important;
    font-family: 'Inter', sans-serif !important;
  }

  /* ── INPUTS ── */
  .login__form input,
  .login__form .field-type input {
    background: #f9fafb !important;
    border: 1.5px solid #e5e7eb !important;
    border-radius: 10px !important;
    color: #111827 !important;
    font-size: 15px !important;
    height: 50px !important;
    padding: 0 18px !important;
    font-family: 'Inter', sans-serif !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
    width: 100% !important;
    outline: none !important;
  }

  .login__form input:focus {
    border-color: #4f46e5 !important;
    background: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.12) !important;
    outline: none !important;
  }

  .login__form input::placeholder {
    color: #9ca3af !important;
  }

  /* ── FORGOT PASSWORD LINK ── */
  .login__form a {
    color: #4f46e5 !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    text-decoration: none !important;
    display: inline-block !important;
    margin: 10px 0 28px !important;
    transition: color 0.2s ease !important;
  }

  .login__form a:hover {
    color: #6366f1 !important;
    text-decoration: underline !important;
  }

  /* ── SUBMIT BUTTON ── */
  .login__form .form-submit button,
  .login__form button[type="submit"],
  .login__form .btn[type="submit"] {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%) !important;
    background-size: 200% 100% !important;
    background-position: left !important;
    border: none !important;
    border-radius: 12px !important;
    color: #ffffff !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    height: 52px !important;
    width: 100% !important;
    cursor: pointer !important;
    box-shadow: 0 4px 16px rgba(79,70,229,0.3), 0 1px 4px rgba(79,70,229,0.2) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease !important;
    letter-spacing: 0.02em !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .login__form .form-submit button:hover,
  .login__form button[type="submit"]:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 28px rgba(79,70,229,0.4), 0 2px 8px rgba(79,70,229,0.25) !important;
    background-position: right !important;
  }

  .login__form .form-submit button:active,
  .login__form button[type="submit"]:active {
    transform: translateY(0) !important;
  }

  /* ── HIDE STEP INDICATOR ── */
  .login__form .step {
    display: none !important;
  }

  /* ── FIELD ERROR ── */
  .login__form .field-error {
    color: #ef4444 !important;
    font-size: 12px !important;
    margin-top: 4px !important;
  }

  /* ═══════════════════════════════════════════════════════════
     BEFORE-LOGIN (left panel positioned as fixed overlay)
     ═══════════════════════════════════════════════════════════ */
  #admin-login-left-panel {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    width: 52% !important;
    height: 100vh !important;
    z-index: 4 !important;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    #admin-login-left-panel {
      display: none !important;
    }

    section.login.template-minimal {
      background: #ffffff !important;
      justify-content: center !important;
    }

    .template-minimal__wrap {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      justify-content: flex-start !important;
      padding-top: 60px !important;
    }

    .template-minimal__wrap::before {
      background:
        radial-gradient(ellipse 80% 40% at 50% 0%, rgba(79,70,229,0.07) 0%, transparent 70%) !important;
    }

    .login__form {
      padding: 0 28px 48px !important;
    }
  }

  @media (max-width: 480px) {
    .login__form {
      padding: 0 20px 40px !important;
    }
  }
`

const BeforeLogin: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [footerVideoUrl, setFooterVideoUrl] = useState<string | null>(null)
  const [loginVideoUrl, setLoginVideoUrl] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Inject full CSS
    const existing = document.getElementById('admin-login-redesign-css')
    if (!existing) {
      const styleEl = document.createElement('style')
      styleEl.id = 'admin-login-redesign-css'
      styleEl.textContent = LOGIN_CSS
      document.head.appendChild(styleEl)
    }
    return () => {
      document.getElementById('admin-login-redesign-css')?.remove()
    }
  }, [])

  useEffect(() => {
    fetch('/api/globals/site-settings?depth=1')
      .then((res) => res.json())
      .then((data) => {
        const avatarMedia = data?.adminLoginAvatar
        if (avatarMedia && typeof avatarMedia === 'object' && avatarMedia.url) {
          setAvatarUrl(avatarMedia.url)
        } else if (typeof avatarMedia === 'string') {
          setAvatarUrl(avatarMedia)
        }

        const loginVideo = data?.adminLoginVideo
        if (loginVideo && typeof loginVideo === 'object' && loginVideo.url) {
          setLoginVideoUrl(loginVideo.url)
        } else if (typeof loginVideo === 'string') {
          setLoginVideoUrl(loginVideo)
        }
      })
      .catch(() => {})

    fetch('/api/globals/homepage-settings?depth=1')
      .then((res) => res.json())
      .then((data) => {
        const footerVideo = data?.footerVideoBg
        if (footerVideo && typeof footerVideo === 'object' && footerVideo.url) {
          setFooterVideoUrl(footerVideo.url)
        } else if (typeof footerVideo === 'string') {
          setFooterVideoUrl(footerVideo)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* LEFT PANEL — absolutely positioned to cover exactly the left 52% */}
      <div
        id="admin-login-left-panel"
        style={{
          background: 'linear-gradient(145deg, #0d0f1a 0%, #111827 30%, #1e1b4b 65%, #312e81 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Animated glow blobs */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(79,70,229,0.1) 40%, transparent 70%)',
          top: '-15%',
          left: '-20%',
          animation: 'loginBlobPulse1 8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(109,40,217,0.08) 40%, transparent 70%)',
          bottom: '-10%',
          right: '-15%',
          animation: 'loginBlobPulse2 10s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        {/* Subtle grid pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 48px' }}>
          {/* Avatar */}
          <div style={{
            marginBottom: '36px',
            display: 'flex',
            justifyContent: 'center',
          }}>
            {avatarUrl ? (
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(139,92,246,0.8) 100%)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 64px rgba(0,0,0,0.6)',
                animation: 'avatarFloat 6s ease-in-out infinite',
              }}>
                <img
                  src={avatarUrl}
                  alt="Admin Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                    border: '2px solid rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px dashed rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '8px',
                color: 'rgba(255,255,255,0.3)',
                animation: 'avatarFloat 6s ease-in-out infinite',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
            )}
          </div>

          {/* Headline */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '28px',
          }}>
            <h1 style={{
              fontSize: 'clamp(32px, 3.5vw, 56px)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}>
              <TypingEffect text="Kabya Ghosh" />
            </h1>
          </div>

          {/* Dots */}
          <div style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            marginTop: '32px',
          }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: i === 0 ? '20px' : '6px',
                height: '6px',
                borderRadius: '999px',
                background: i === 0 ? 'rgba(165,180,252,0.9)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Animation keyframes */}
        <style>{`
          @keyframes loginBlobPulse1 {
            0%, 100% { transform: scale(1) translate(0,0); opacity: 0.7; }
            33%       { transform: scale(1.08) translate(2%,3%); opacity: 0.9; }
            66%       { transform: scale(0.95) translate(-1%,-2%); opacity: 0.6; }
          }
          @keyframes loginBlobPulse2 {
            0%, 100% { transform: scale(1) translate(0,0); opacity: 0.6; }
            40%       { transform: scale(1.1) translate(-3%,-2%); opacity: 0.85; }
            70%       { transform: scale(0.92) translate(2%, 1%); opacity: 0.5; }
          }
          @keyframes avatarFloat {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-10px); }
          }
          @keyframes loginBlinkCursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>

      {/* Branding block injected ABOVE the Payload form — via the DOM at #before-login-brand */}
      {mounted && (
        <style>{`
          /* Inject branding section before the form inputs */
          .template-minimal__wrap {
            padding-top: 0 !important;
          }

          /* Brand block sits inside .login__form before the inputs */
          .login__form::before {
            content: '' !important;
          }
        `}</style>
      )}

      {/* Brand block that appears above the form (inside .template-minimal__wrap) */}
      <div id="admin-login-brand-block" style={{
        position: 'fixed',
        /* We'll move this via JS after mount */
        left: '-9999px',
        top: '-9999px',
        zIndex: -1,
      }}>
        <div className="login-brand-inner">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', position: 'relative' }}>
            <a href="/" style={{ position: 'absolute', left: 0, top: 0, padding: '10px 16px', background: 'rgba(0,0,0,0.04)', borderRadius: '12px', textDecoration: 'none', color: '#374151', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', border: '1px solid rgba(0,0,0,0.05)' }} onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              Home
            </a>
            <div style={{
              width: '120px', height: '120px', borderRadius: '24px', overflow: 'hidden', flexShrink: 0,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
              display: loginVideoUrl ? 'block' : 'none',
            }}>
              {loginVideoUrl && (
                <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                  <source src={loginVideoUrl} type="video/quicktime" />
                  <source src={loginVideoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      </div>

      <BrandInjector />
    </>
  )
}

// Injects the brand block into the right panel above the form
const BrandInjector: React.FC = () => {
  useEffect(() => {
    const tryInject = () => {
      const brandBlock = document.getElementById('admin-login-brand-block')
      const form = document.querySelector('.login__form')
      if (!form || !brandBlock) return

      // Move brand block to be the first child of the form
      const inner = brandBlock.querySelector('.login-brand-inner')
      if (!inner) return

      // Check if already injected
      if (form.querySelector('#injected-brand')) return

      const wrapper = document.createElement('div')
      wrapper.id = 'injected-brand'
      Object.assign(wrapper.style, {
        padding: '56px 0 0',
      })
      
      // Move actual DOM nodes so the video element retains its state/autoplay
      while (inner.firstChild) {
        wrapper.appendChild(inner.firstChild)
      }
      
      form.insertBefore(wrapper, form.firstChild)

      // Explicitly play video if needed
      const video = wrapper.querySelector('video')
      if (video) {
        video.play().catch(() => {})
      }

      // Hide the original off-screen element
      brandBlock.style.display = 'none'
    }

    // Try immediately and retry after delay
    tryInject()
    const timer1 = setTimeout(tryInject, 200)
    const timer2 = setTimeout(tryInject, 600)
    const timer3 = setTimeout(tryInject, 1200)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return null
}

export default BeforeLogin

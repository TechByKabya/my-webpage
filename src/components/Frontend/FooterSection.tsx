'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LottieAnimation } from './LottieAnimation'

// Thin wrapper so the lottie player renders client-side inside this client component
const LottieContactAnimation = () => (
  <LottieAnimation
    src="/contactus-animation.json"
    style={{ width: '100%', height: 'auto', display: 'block' }}
  />
)

const Lottie3DAnimation = () => (
  <LottieAnimation
    src="https://lottie.host/d7dfafa4-1d91-470e-8682-0ed044516b7e/Gmso1MWI18.lottie"
    style={{ width: '100%', height: 'auto', display: 'block' }}
  />
)

interface FooterSectionProps {
  footerVideoUrl?: string
  contactTitle: string
  contactSubtitle: string
  contactEmail: string
  contactPhone: string
  facebookUrl?: string
  githubUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
  hideContactForm?: boolean
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  footerVideoUrl,
  contactTitle,
  contactSubtitle,
  contactEmail,
  contactPhone,
  facebookUrl,
  githubUrl,
  youtubeUrl,
  linkedinUrl,
  hideContactForm = false,
}) => {

  const socials = [
    { icon: 'fab fa-github', href: githubUrl },
    { icon: 'fab fa-linkedin', href: linkedinUrl },
    { icon: 'fab fa-youtube', href: youtubeUrl },
    { icon: 'fab fa-facebook', href: facebookUrl },
  ].filter(s => s.href)

  return (
    <footer
      id="contact"
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
      }}
    >

      {/* ── SPLIT CTA SECTION ── */}
      {!hideContactForm && (
        <div style={{ 
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '80px 24px',
        }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '0',
            alignItems: 'center',
          }}
            className="cta-split-grid"
          >

            {/* ── LEFT: Get in Touch ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 40px' }}
            >
              <div style={{ width: '280px', marginBottom: '4px' }}>
                <LottieContactAnimation />
              </div>
              <h2 style={{ 
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', 
                fontWeight: 900, color: '#1d1d1f', 
                margin: '0 0 12px',
                letterSpacing: '-0.04em', lineHeight: 1.1,
              }}>
                Get in Touch
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '320px', lineHeight: 1.6, margin: '0 0 32px' }}>
                Have a project in mind or just want to say hi? I'd love to hear from you.
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(99,102,241,0.35)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '14px 36px', borderRadius: '50px',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                  textDecoration: 'none', letterSpacing: '0.01em',
                  boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
                }}
              >
                <i className="fas fa-paper-plane" style={{ fontSize: '0.85rem' }} />
                Contact Me
              </motion.a>
            </motion.div>

            {/* ── MIDDLE: Decorative Divider ── */}
            <div className="cta-split-divider" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
              <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, #e5e7eb)' }} />
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '1.5px solid #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                color: '#9ca3af', fontSize: '0.8rem', fontWeight: 700,
                letterSpacing: '0.05em',
              }}>
                OR
              </div>
              <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to top, transparent, #e5e7eb)' }} />
            </div>

            {/* ── RIGHT: 3D Printing Shortcuts ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 40px' }}
            >
              <div style={{ width: '260px', marginBottom: '4px' }}>
                <Lottie3DAnimation />
              </div>
              <h2 style={{ 
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', 
                fontWeight: 900, color: '#1d1d1f', 
                margin: '0 0 12px',
                letterSpacing: '-0.04em', lineHeight: 1.1,
              }}>
                3D Printing
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '320px', lineHeight: 1.6, margin: '0 0 28px' }}>
                Low cost, precision 3D prints delivered fast. Upload your CAD file or describe your idea.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
                <motion.a
                  href="/3d-printing"
                  whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(249,115,22,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '14px 36px', borderRadius: '50px',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                    textDecoration: 'none', letterSpacing: '0.01em',
                    boxShadow: '0 8px 24px rgba(249,115,22,0.2)',
                  }}
                >
                  <i className="fas fa-cube" style={{ fontSize: '0.85rem' }} />
                  Place an Order
                </motion.a>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { label: 'PLA Prints', icon: 'fas fa-layer-group' },
                    { label: 'Fast Delivery', icon: 'fas fa-bolt' },
                    { label: 'CAD Design', icon: 'fas fa-drafting-compass' },
                  ].map((tag) => (
                    <span key={tag.label} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '6px 12px', borderRadius: '20px',
                      background: '#fff7ed', border: '1px solid #fed7aa',
                      color: '#c2410c', fontSize: '0.78rem', fontWeight: 600,
                    }}>
                      <i className={tag.icon} style={{ fontSize: '0.7rem' }} />
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      )}

      {/* ── LIGHT GLASS FOOTER BAR ── */}
      <div style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', flex: 1, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="responsive-padding" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 40px' }}>

          {/* Top of footer bar */}
          {/* Top of footer bar */}
          <div className="responsive-footer-grid" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '60px' }}>
            
            {/* Brand */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '320px', flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)',
                }}>
                  {footerVideoUrl ? (
                    <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                      <source src={footerVideoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.5rem', background: '#f3f4f6', color: '#1d1d1f' }}>K</div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#1d1d1f' }}>
                    Kabya<span style={{ color: '#6366f1' }}> Ghosh</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px', fontWeight: 500 }}>Building with curiosity.</p>
                </div>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '4px' }}>
                Delivering high-quality embedded systems, IoT solutions, and precise 3D printing services in Bangladesh.
              </p>
            </div>

            {/* Contact Details */}
            <div style={{ flex: '1 1 200px', maxWidth: '280px' }}>
              <p style={{ color: '#111827', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '24px' }}>Contact Info</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <a href={`mailto:${contactEmail || 'kabya.connect24@gmail.com'}`} style={{ color: '#4b5563', fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 500, transition: 'color 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.color = '#6366f1'} onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}><i className="fas fa-envelope" /></div>
                  <span style={{ wordBreak: 'break-all' }}>{contactEmail || 'kabya.connect24@gmail.com'}</span>
                </a>
                <span style={{ color: '#4b5563', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 500 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}><i className="fas fa-phone" /></div>
                  <span>{contactPhone || '+880 1950-440296'}</span>
                </span>
                <span style={{ color: '#4b5563', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 500 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}><i className="fas fa-map-marker-alt" /></div>
                  <span>Dhaka, Bangladesh</span>
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ flex: '1 1 200px', maxWidth: '300px' }}>
              <p style={{ color: '#111827', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '24px' }}>Connect</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {socials.map((s, i) => {
                  const names: Record<string, string> = { 'fab fa-github': 'GitHub', 'fab fa-linkedin': 'LinkedIn', 'fab fa-youtube': 'YouTube', 'fab fa-facebook': 'Facebook' };
                  const name = names[s.icon] || 'Social';
                  return (
                    <motion.a key={i} href={s.href} target="_blank" rel="noreferrer"
                      whileHover={{ y: -2, background: '#6366f1', color: '#ffffff', borderColor: '#6366f1' }}
                      style={{ 
                        padding: '12px 14px', borderRadius: '12px', background: '#ffffff', 
                        border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '10px',
                        color: '#4b5563', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500,
                        transition: 'all 0.2s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}>
                      <i className={s.icon} style={{ fontSize: '1.1rem' }} /> {name}
                    </motion.a>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', marginBottom: '30px' }} />

          {/* Bottom row */}
          <div className="responsive-footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[['Home', '/'], ['Projects', '/projects'], ['Blogs', '/blogs'], ['Contact', '/contact']].map(([l, h]) => (
                <a key={h} href={h} style={{ color: '#6b7280', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#1d1d1f')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>{l}</a>
              ))}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: 'white',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.3)', transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(99,102,241,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)'; }}
                title="Scroll to top"
              >
                <i className="fas fa-arrow-up" />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                <p style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500 }}>&copy; {new Date().getFullYear()} Kabya Ghosh. | <a href="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</a></p>
              </div>
            </div>
          </div>

          {/* Clever SEO Text Block */}
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.7rem', lineHeight: 1.6, maxWidth: '900px', margin: '0 auto' }}>
              Kabya Ghosh is an embedded system IoT expert in BD and a student at Daffodil International University. 
              We also provide a low cost 3D printing service in Dhaka, offering premium precision prints delivered fast, serving all local areas including near Daffodil.
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}

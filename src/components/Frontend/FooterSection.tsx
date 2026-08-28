'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ContactForm } from './ContactForm'

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

      {/* ── CONTACT FORM SECTION ── */}
      {!hideContactForm && (
        <div style={{ background: 'transparent', padding: '100px 20px', borderTop: '1px solid #e5e7eb' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ContactForm title={contactTitle} subtitle={contactSubtitle} />
          </motion.div>
        </div>
      )}

      {/* ── LIGHT GLASS FOOTER BAR ── */}
      <div style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', flex: 1, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="responsive-padding" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 40px' }}>

          {/* Top of footer bar */}
          <div className="responsive-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '50px' }}>
            
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.05)',
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
                <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#1d1d1f' }}>
                  Kabya<span style={{ color: '#6366f1' }}> Ghosh</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px' }}>Building with curiosity.</p>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Contact Info</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href={`mailto:${contactEmail || 'kabya.connect24@gmail.com'}`} style={{ color: '#374151', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>
                  <i className="fas fa-envelope" style={{ color: '#6366f1', width: '16px' }} /> {contactEmail || 'kabya.connect24@gmail.com'}
                </a>
                <span style={{ color: '#374151', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>
                  <i className="fas fa-phone" style={{ color: '#6366f1', width: '16px' }} /> {contactPhone || '+880 1950-440296'}
                </span>
                <span style={{ color: '#374151', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#6366f1', width: '16px' }} /> Bangladesh
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Socials</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {socials.map((s, i) => (
                  <motion.a key={i} href={s.href} target="_blank" rel="noreferrer"
                    whileHover={{ y: -3, background: '#fff', color: '#6366f1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    style={{ 
                      width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', 
                      border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', color: '#6b7280', fontSize: '1rem', textDecoration: 'none',
                      transition: 'background 0.2s, color 0.2s, box-shadow 0.2s'
                    }}>
                    <i className={s.icon} />
                  </motion.a>
                ))}
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
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#1d1d1f', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>K.</div>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500 }}>&copy; {new Date().getFullYear()} Kabya Ghosh. | <a href="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</a></p>
              </div>
            </div>
          </div>

          {/* Clever SEO Text Block */}
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.7rem', lineHeight: 1.6, maxWidth: '900px', margin: '0 auto' }}>
              Kabya Ghosh is an embedded system IoT engineer at Daffodil International University and an embedded system IoT expert in BD. 
              We also provide a low cost 3D printing service in Dhaka, offering premium precision prints delivered fast, serving all local areas including near Daffodil.
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}

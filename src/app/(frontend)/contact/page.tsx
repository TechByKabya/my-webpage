import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function ContactPage() {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'homepage-settings',
    depth: 1,
  })

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* FOOTER / CONTACT */}
      <footer id="contact" style={{ marginTop: 0, paddingBottom: '100px' }}>
          <div className="footer-content">
              <h2>{settings.contactTitle || 'Interested in collaborating?'}</h2>
              <p>{settings.contactSubtitle || 'Open to practical collaborations, small R&D efforts, and project work.'}</p>
              <a href={`mailto:${settings.contactEmail || 'test@test.com'}`} className="btn-primary">Get in Touch</a>
              <p style={{marginTop: '15px', fontWeight: 600}}>{settings.contactPhone}</p>

              <div className="social-links">
                  {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer"><i className="fab fa-facebook"></i></a>}
                  {settings.githubUrl && <a href={settings.githubUrl} target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>}
                  {settings.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>}
                  {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>}
              </div>

              <div className="copyright">
                  &copy; <span id="current-year"></span> Kabya Ghosh. Made with care.
              </div>
          </div>
      </footer>
    </main>
  )
}

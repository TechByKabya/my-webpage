'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface ContactFormProps {
  title?: string
  subtitle?: string
}

export const ContactForm: React.FC<ContactFormProps> = ({ title, subtitle }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', borderRadius: '12px',
    border: '1.5px solid #e5e7eb', background: '#fafafa',
    fontSize: '0.95rem', color: '#1d1d1f', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  }

  return (
    <div className="responsive-padding" style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '50px', boxShadow: '0 8px 40px rgba(0,0,0,0.04)' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '12px', letterSpacing: '-0.03em' }}>{title || 'Send a Message'}</h2>
        <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>{subtitle || 'I\'ll get back to you within 24 hours.'}</p>
      </div>

      {status === 'success' ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
          <h4 style={{ color: '#1d1d1f', fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Message sent successfully!</h4>
          <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>Thanks for reaching out. I'll reply to your email soon.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="responsive-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Full Name *</label>
              <input
                type="text" required placeholder="Kabya Ghosh"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Email *</label>
              <input
                type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Subject</label>
            <input
              type="text" placeholder="Project Collaboration"
              value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Message *</label>
            <textarea
              required rows={6} placeholder="Tell me about your project or idea..."
              value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          {status === 'error' && (
            <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '16px', textAlign: 'center' }}>Something went wrong. Please try again.</p>
          )}
          <motion.button
            type="submit" disabled={status === 'loading'}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #1d1d1f, #333336)', color: '#fff',
              fontSize: '1rem', fontWeight: 600, letterSpacing: '0.02em',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
          >
            {status === 'loading' ? (
              <><i className="fas fa-spinner fa-spin" /> Sending...</>
            ) : (
              <>Send Message <i className="fas fa-arrow-right" style={{ fontSize: '0.85rem' }} /></>
            )}
          </motion.button>
        </form>
      )}
    </div>
  )
}

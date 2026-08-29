'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LottieAnimation } from '@/components/Frontend/LottieAnimation'
import { DotLottiePlayer } from '@dotlottie/react-player'
import '@dotlottie/react-player/dist/index.css'

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
      const res = await fetch('/api/contact-submissions', {
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
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    background: '#fafafa',
    fontSize: '0.9rem',
    color: '#1d1d1f',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#374151',
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: '5px',
  }

  return (
    <div className="contact-form-card" style={{
      width: '100%',
      background: '#fff',
      borderRadius: '20px',
      border: '1px solid #e5e7eb',
      padding: '28px 32px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    }}>

      {/* Form header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ width: '90px', margin: '0 auto 10px auto' }}>
          <LottieAnimation
            src="/email-animation.json"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d1d1f', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          {title || 'Send a Message'}
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
          {subtitle || "I'll get back to you within 24 hours."}
        </p>
      </div>

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '32px 20px' }}
        >
          <div style={{ width: '120px', height: '120px', margin: '0 auto 12px' }}>
            <DotLottiePlayer
              src="/send-message-animation.json"
              autoplay
              loop={false}
            />
          </div>
          <h4 style={{ color: '#1d1d1f', fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
            Message sent!
          </h4>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Thanks for reaching out. I'll reply to your email soon.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Name + Email side by side */}
          <div className="contact-form-name-email" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                type="text" required placeholder="Your Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input
                type="email" required placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Subject</label>
            <input
              type="text" placeholder="Project Collaboration"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Message *</label>
            <textarea
              required rows={4} placeholder="Tell me about your project or idea..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {status === 'error' && (
            <p style={{ color: '#ef4444', fontSize: '0.88rem', marginBottom: '12px', textAlign: 'center' }}>
              Something went wrong. Please try again.
            </p>
          )}

          <motion.button
            type="submit"
            disabled={status === 'loading'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              border: 'none',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #1d1d1f, #333336)',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
              boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: status === 'loading' ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {status === 'loading' ? (
              <><i className="fas fa-spinner fa-spin" /> Sending...</>
            ) : (
              <>Send Message <i className="fas fa-arrow-right" style={{ fontSize: '0.8rem' }} /></>
            )}
          </motion.button>
        </form>
      )}
    </div>
  )
}

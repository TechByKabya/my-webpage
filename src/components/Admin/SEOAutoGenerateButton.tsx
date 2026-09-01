'use client'

import React, { useState, useEffect } from 'react'
import { useForm, useFormFields, useField } from '@payloadcms/ui'
import { UIField } from 'payload'
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'

export const SEOAutoGenerateButton: React.FC<{ field: UIField }> = () => {
  const { dispatchFields } = useForm()
  
  // Aggressively hide the native SEO plugin UI
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .plugin-seo__field button { display: none !important; }
      .plugin-seo__field .field-description { display: none !important; }
    `
    document.head.appendChild(style)
    
    let isRunning = true
    const cleanup = () => {
      if (!isRunning) return
      try {
        // Hide the " — " text next to the label
        document.querySelectorAll('.plugin-seo__field').forEach((el) => {
          const label = el.querySelector('.field-label')
          if (label && label.nextSibling && label.nextSibling.nodeType === Node.TEXT_NODE) {
            if (label.nextSibling.textContent?.includes('—')) {
              label.nextSibling.textContent = ''
            }
          }
        })
        
        // Hide the Preview block safely
        document.querySelectorAll('.field-type').forEach((el) => {
          // If the field contains the exact text and has NO inputs or textareas (so we don't accidentally hide the whole form)
          if (
            el.textContent?.includes('Exact result listings may vary') &&
            !el.querySelector('input') &&
            !el.querySelector('textarea')
          ) {
            (el as HTMLElement).style.display = 'none'
          }
        })
      } catch (e) {
        console.error('Error in SEO cleanup interval', e)
      }
    }
    
    const interval = setInterval(cleanup, 200)
    cleanup() // run once immediately
    
    return () => {
      isRunning = false
      style.remove()
      clearInterval(interval)
    }
  }, [])

  const titleField = useFormFields(([fields]) => fields?.title)
  const excerptField = useFormFields(([fields]) => fields?.excerpt)

  const { setValue: setMetaTitle } = useField<string>({ path: 'meta.title' })
  const { setValue: setMetaDescription } = useField<string>({ path: 'meta.description' })

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setSuccess(false)
    
    try {
      const title = titleField?.value as string || ''
      const excerpt = excerptField?.value as string || ''
      
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate SEO')
      }

      const data = await response.json()
      
      if (data.seoTitle) {
        setMetaTitle(data.seoTitle)
      }
      if (data.seoDescription) {
        setMetaDescription(data.seoDescription)
      }
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#8b5cf6" />
          AI SEO Optimization
        </h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
          Automatically generate an optimized SEO Title and Meta Description based on your blog content using Gemini AI.
        </p>
      </div>
      
      <button 
        type="button" 
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.85rem 1.5rem',
          background: isGenerating ? '#cbd5e1' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 600,
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          boxShadow: isGenerating ? 'none' : '0 4px 14px -1px rgba(99, 102, 241, 0.4)',
          transition: 'all 0.2s ease',
          transform: isGenerating ? 'none' : 'translateY(-1px)'
        }}
        onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.boxShadow = '0 6px 20px -2px rgba(99, 102, 241, 0.5)')}
        onMouseLeave={(e) => !isGenerating && (e.currentTarget.style.boxShadow = '0 4px 14px -1px rgba(99, 102, 241, 0.4)')}
      >
        <Sparkles size={18} />
        {isGenerating ? 'Analyzing & Generating...' : 'Auto Generate AI SEO'}
      </button>
      
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.875rem', fontWeight: 500, background: '#fef2f2', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.875rem', fontWeight: 500, background: '#ecfdf5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
          <CheckCircle2 size={16} />
          SEO tags successfully generated and applied!
        </div>
      )}
    </div>
  )
}

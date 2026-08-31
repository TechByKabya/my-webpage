'use client'
import React from 'react'

export const AIAutomationBanner: React.FC = () => {
  return (
    <div style={{
      padding: '16px 20px',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      color: '#166534',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/>
          <path d="M19 17v4"/>
          <path d="M3 5h4"/>
          <path d="M17 19h4"/>
        </svg>
      </div>
      <div>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Gemini AI SEO Automation Active</h4>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#15803d' }}>
          You don't need to manually fill out the Title or Description fields below. Just click <b>Save</b>, and Gemini AI will automatically generate optimized SEO metadata based on your content!
        </p>
      </div>
    </div>
  )
}

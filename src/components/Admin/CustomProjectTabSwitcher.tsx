'use client'

import React, { useState } from 'react'
import { FileText, Search } from 'lucide-react'

export const CustomProjectTabSwitcher: React.FC = () => {
  const [tab, setTab] = useState<'project' | 'seo'>('project')

  return (
    <div style={{ marginBottom: '2rem', marginTop: '-1rem' }}>
      <div style={{
        display: 'flex',
        gap: '1rem',
        paddingBottom: '1.5rem',
        borderBottom: '2px solid var(--theme-elevation-100)',
        marginBottom: '2rem'
      }}>
        <button
          type="button"
          onClick={() => setTab('project')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.85rem 2.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: tab === 'project' ? 'linear-gradient(135deg, #3b82f6, #4f46e5)' : 'var(--theme-elevation-50)',
            color: tab === 'project' ? '#fff' : 'var(--theme-elevation-500)',
            boxShadow: tab === 'project' ? '0 4px 14px 0 rgba(79, 70, 229, 0.35)' : '0 1px 3px rgba(0,0,0,0.05)',
            transform: tab === 'project' ? 'translateY(-1px)' : 'none'
          }}
        >
          <FileText size={18} /> Project Content
        </button>

        <button
          type="button"
          onClick={() => setTab('seo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.85rem 2.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: tab === 'seo' ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--theme-elevation-50)',
            color: tab === 'seo' ? '#fff' : 'var(--theme-elevation-500)',
            boxShadow: tab === 'seo' ? '0 4px 14px 0 rgba(16, 185, 129, 0.35)' : '0 1px 3px rgba(0,0,0,0.05)',
            transform: tab === 'seo' ? 'translateY(-1px)' : 'none'
          }}
        >
          <Search size={18} /> SEO Settings
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide Payload's native document tabs if they appear */
        .tabs-field { display: none !important; }

        .payload-form {
          gap: 3rem !important;
        }
        .payload-form__sidebar {
          padding-left: 2rem !important;
          border-left: 1px dashed var(--theme-elevation-200) !important;
        }

        /* Toggling based on tabs */
        ${tab === 'project' ? `
          /* Hide SEO elements when in Project tab */
          .field-type:has(#field-meta),
          .field-type:has([name="meta.title"]),
          .field-type:has([name="meta.description"]),
          .field-type:has(#field-seoAutoGenerate),
          .field-type:has(#field-seoScoreGauge),
          .field-type:has([name="meta.image"]),
          .field-type:has(.plugin-seo__preview),
          .plugin-seo__preview {
            display: none !important;
          }
        ` : `
          /* Hide Project content fields when in SEO tab */
          .project-field,
          .field-type:has([name="visibility"]),
          .field-type:has([name="coverImage"]),
          .field-type:has([name="slug"]) {
            display: none !important;
          }
          /* Full-width focus view for SEO */
          .payload-form__sidebar {
            display: none !important;
          }
          .payload-form__main {
            grid-column: 1 / -1 !important;
            max-width: 850px;
            margin: 0 auto;
          }
        `}

        /* Globally hide the SEO plugin's built-in Auto-generate buttons and Link Preview */
        .field-type:has([name="meta.title"]) label button,
        .field-type:has([name="meta.description"]) label button,
        .field-type:has([name="meta.title"]) header button,
        .field-type:has([name="meta.description"]) header button,
        .plugin-seo__auto-generate,
        .plugin-seo__preview,
        .field-type:has(.plugin-seo__preview),
        .field-type:has([name="meta.image"]) {
          display: none !important;
        }
      `}} />
    </div>
  )
}

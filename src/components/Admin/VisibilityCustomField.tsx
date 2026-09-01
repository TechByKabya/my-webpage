'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import { SelectField } from 'payload'

export const VisibilityCustomField: React.FC<{ field: SelectField }> = ({ field }) => {
  const { value, setValue } = useField<string>({ path: field.name })

  return (
    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--theme-elevation-50)', borderRadius: '8px', border: '1px solid var(--theme-elevation-100)' }}>
      <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>
        {field.label as string || 'Post Visibility'}
      </label>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setValue('public')}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '6px',
            border: value === 'public' ? '2px solid var(--theme-success-400)' : '1px solid var(--theme-elevation-200)',
            background: value === 'public' ? 'var(--theme-success-100)' : 'transparent',
            color: value === 'public' ? 'var(--theme-success-700)' : 'var(--theme-elevation-800)',
            fontWeight: value === 'public' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Public
        </button>
        <button
          type="button"
          onClick={() => setValue('private')}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '6px',
            border: value === 'private' ? '2px solid var(--theme-error-400)' : '1px solid var(--theme-elevation-200)',
            background: value === 'private' ? 'var(--theme-error-100)' : 'transparent',
            color: value === 'private' ? 'var(--theme-error-700)' : 'var(--theme-elevation-800)',
            fontWeight: value === 'private' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Private
        </button>
      </div>
      
      {field.admin?.description && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--theme-elevation-400)' }}>
          {field.admin.description as string}
        </p>
      )}
    </div>
  )
}

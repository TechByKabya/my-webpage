'use client'

import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export const ProjectEditHeader: React.FC = () => {
  const { id, title: docTitle } = useDocumentInfo()

  const isNew = !id
  const displayTitle = isNew ? 'Create New Project' : docTitle || 'Untitled Project'

  return (
    <div className="custom-project-header" style={{ marginBottom: '2rem' }}>
      <h1
        style={{
          margin: 0,
          fontSize: '2rem',
          fontWeight: 600,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.2'
        }}
      >
        {displayTitle as React.ReactNode}
      </h1>
      <p style={{ color: 'var(--theme-elevation-400)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {isNew ? 'Creating a new project' : `Editing project ID: ${id}`}
      </p>
    </div>
  )
}

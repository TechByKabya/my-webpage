'use client'

import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

export const BlogEditHeader: React.FC = () => {
  const { id, title: docTitle } = useDocumentInfo()
  const pathname = usePathname()
  
  // If no ID, it's a new document
  const isNew = !id
  const displayTitle = isNew ? 'Create New Blog Post' : docTitle || 'Untitled Blog Post'

  return (
    <div className="custom-blog-header" style={{ marginBottom: '2rem' }}>
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
        {isNew ? 'Drafting a new post' : `Editing post ID: ${id}`}
      </p>
    </div>
  )
}

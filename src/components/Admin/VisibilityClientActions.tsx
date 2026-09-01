'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

type Props = {
  id: string | number
  currentVisibility: 'public' | 'private'
  collectionSlug: 'blogs' | 'projects'
}

export const VisibilityClientActions = ({ id, currentVisibility, collectionSlug }: Props) => {
  const [loading, setLoading] = useState(false)
  const [visibility, setVisibility] = useState(currentVisibility)

  const toggleVisibility = async () => {
    setLoading(true)
    const nextVisibility = visibility === 'public' ? 'private' : 'public'
    
    try {
      const res = await fetch(`/api/${collectionSlug}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visibility: nextVisibility }),
      })

      if (res.ok) {
        setVisibility(nextVisibility)
      } else {
        alert('Failed to update visibility')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating visibility')
    }
    setLoading(false)
  }

  const isPublic = visibility === 'public'

  return (
    <button
      onClick={toggleVisibility}
      disabled={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 700,
        cursor: loading ? 'wait' : 'pointer',
        border: 'none',
        background: isPublic ? '#dcfce7' : '#f1f5f9',
        color: isPublic ? '#16a34a' : '#475569',
        transition: 'all 0.2s',
      }}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isPublic ? (
        <Eye size={14} />
      ) : (
        <EyeOff size={14} />
      )}
      {isPublic ? 'PUBLIC' : 'PRIVATE'}
    </button>
  )
}

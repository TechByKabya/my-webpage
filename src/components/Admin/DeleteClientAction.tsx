'use client'

import React, { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  id: string | number
  collectionSlug: 'blogs' | 'projects' | 'contact-submissions' | 'printing-requests'
}

export const DeleteClientAction = ({ id, collectionSlug }: Props) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const itemName = collectionSlug.replace('-', ' ').replace(/s$/, '')
    if (!window.confirm(`Are you sure you want to delete this ${itemName}? This action cannot be undone.`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/${collectionSlug}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        router.refresh() // Refresh the server component to update the list
      } else {
        alert('Failed to delete document')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting document')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: loading ? 'wait' : 'pointer',
        border: '1px solid #fee2e2',
        background: '#fff',
        color: '#ef4444',
        transition: 'all 0.2s',
      }}
      onMouseOver={(e) => {
        if (!loading) {
          e.currentTarget.style.background = '#fef2f2'
          e.currentTarget.style.borderColor = '#fca5a5'
        }
      }}
      onMouseOut={(e) => {
        if (!loading) {
          e.currentTarget.style.background = '#fff'
          e.currentTarget.style.borderColor = '#fee2e2'
        }
      }}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Trash2 size={14} />
      )}
      Delete
    </button>
  )
}

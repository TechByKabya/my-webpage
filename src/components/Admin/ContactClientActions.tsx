'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ShieldAlert, Trash2, ArrowLeft } from 'lucide-react'

export const ContactClientActions = ({ id, currentStatus }: { id: string, currentStatus: string }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const updateStatus = async (status: string) => {
    if (loading) return
    setLoading(true)
    try {
      // In Payload v3, the Local API is preferred for server components, but for client components we use the REST API.
      // Since this is the admin panel, the user is authenticated.
      const res = await fetch(`/api/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to update status', err)
    }
    setLoading(false)
  }

  const deleteSubmission = async () => {
    if (loading || !confirm('Are you sure you want to delete this submission?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/contact-submissions/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/kabya-52005/collections/contact-submissions')
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to delete', err)
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <button 
        onClick={() => router.push('/kabya-52005/collections/contact-submissions')}
        style={btnStyle('#f1f5f9', '#475569')}
      >
        <ArrowLeft size={16} /> Back to List
      </button>

      <div style={{ flex: 1 }} />

      {currentStatus !== 'read' && currentStatus !== 'replied' && (
        <button 
          onClick={() => updateStatus('read')} 
          disabled={loading}
          style={btnStyle('#4f46e5', '#fff')}
        >
          <CheckCircle size={16} /> Mark as Read
        </button>
      )}
      
      {currentStatus !== 'archived' && (
        <button 
          onClick={() => updateStatus('archived')} 
          disabled={loading}
          style={btnStyle('#fee2e2', '#dc2626')}
        >
          <ShieldAlert size={16} /> Mark as Spam / Archived
        </button>
      )}

      <button 
        onClick={deleteSubmission} 
        disabled={loading}
        style={btnStyle('#fff', '#dc2626', '1px solid #fecaca')}
      >
        <Trash2 size={16} /> Delete
      </button>
    </div>
  )
}

const btnStyle = (bg: string, color: string, border: string = 'none'): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 18px',
  borderRadius: '10px',
  background: bg,
  color: color,
  border: border,
  fontWeight: 600,
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'opacity 0.2s, transform 0.1s',
})

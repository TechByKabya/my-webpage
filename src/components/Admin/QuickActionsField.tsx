'use client'

import React, { useState, useEffect } from 'react'
import { useForm, useFormFields, useDocumentInfo } from '@payloadcms/ui'

export const QuickActionsField: React.FC = () => {
  const { id } = useDocumentInfo()
  const { submit, dispatchFields } = useForm()
  
  const status = useFormFields(([fields]) => fields.status?.value) as string
  const price = useFormFields(([fields]) => fields.price?.value) as number | undefined
  const adminNotes = useFormFields(([fields]) => fields.adminNotes?.value) as string | undefined

  const [isUpdating, setIsUpdating] = useState(false)
  const [localPrice, setLocalPrice] = useState<string>('')
  const [localNotes, setLocalNotes] = useState<string>('')

  useEffect(() => {
    if (price !== undefined && price !== null) setLocalPrice(price.toString())
    if (adminNotes !== undefined && adminNotes !== null) setLocalNotes(adminNotes)
  }, [price, adminNotes])

  if (!id) return null

  const handleAction = (newStatus: string) => {
    setIsUpdating(true)
    
    dispatchFields({ type: 'UPDATE', path: 'status', value: newStatus })
    dispatchFields({ type: 'UPDATE', path: 'price', value: Number(localPrice) || 0 })
    dispatchFields({ type: 'UPDATE', path: 'adminNotes', value: localNotes })
    
    setTimeout(async () => {
      try {
        await submit()
      } finally {
        setIsUpdating(false)
      }
    }, 100)
  }

  const btnStyle = {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    cursor: isUpdating ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#fff',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    opacity: isUpdating ? 0.7 : 1,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--theme-elevation-200, #cbd5e1)',
    background: 'var(--theme-elevation-0, #fff)',
    color: 'var(--theme-elevation-800, #0f172a)',
    fontSize: '0.85rem',
    marginBottom: '8px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const containerStyle = {
    display: 'flex', 
    flexDirection: 'column' as const, 
    gap: '12px', 
    marginTop: '20px',
    padding: '16px',
    background: 'var(--theme-elevation-50, #f8fafc)',
    borderRadius: '12px',
    border: '1px solid var(--theme-elevation-100, #e2e8f0)'
  }

  if (status === 'Rejected') {
    return (
      <div style={{ ...containerStyle, background: '#fef2f2', borderColor: '#fecaca', alignItems: 'center' }}>
        <div style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          ❌ Order Rejected
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#7f1d1d', textAlign: 'center' }}>
          This order has been permanently rejected.
        </p>
      </div>
    )
  }

  if (status === 'Delivered') {
    return (
      <div style={{ ...containerStyle, background: '#f0fdf4', borderColor: '#bbf7d0', alignItems: 'center' }}>
        <div style={{ padding: '8px 16px', background: '#22c55e', color: '#fff', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          ✓ Order Delivered
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#166534', textAlign: 'center' }}>
          This order was successfully delivered.
        </p>
      </div>
    )
  }

  if (status === 'Completed') {
    return (
      <div style={{ ...containerStyle, background: '#f0fdfa', borderColor: '#ccfbf1', alignItems: 'center' }}>
        <div style={{ padding: '8px 16px', background: '#0d9488', color: '#fff', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          ✨ Printing Completed
        </div>
        <div style={{ width: '100%', marginTop: '12px' }}>
          <button 
            onClick={() => handleAction('Delivered')} disabled={isUpdating}
            style={{ ...btnStyle, background: '#22c55e' }}
          >
            Mark as Delivered
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: 'var(--theme-elevation-800)' }}>
        Smart Actions
      </h4>

      {status !== 'Payment Requested' && (
        <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1e3a8a', marginBottom: '6px' }}>Order Total (BDT)</label>
          <input 
            type="number" 
            placeholder="e.g. 1500" 
            value={localPrice} 
            onChange={(e) => setLocalPrice(e.target.value)} 
            style={inputStyle}
          />
          <button 
            onClick={() => handleAction('Payment Requested')} disabled={isUpdating}
            style={{ ...btnStyle, background: '#3b82f6', marginTop: '4px' }}
          >
             💳 Request Payment
          </button>
        </div>
      )}

      {status !== 'Suggestion Given' && (
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Suggestion Note</label>
          <textarea 
            placeholder="We suggest printing in PETG for strength..." 
            value={localNotes} 
            onChange={(e) => setLocalNotes(e.target.value)} 
            style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
          />
          <button 
            onClick={() => handleAction('Suggestion Given')} disabled={isUpdating}
            style={{ ...btnStyle, background: '#64748b', marginTop: '4px' }}
          >
             💡 Send Suggestion
          </button>
        </div>
      )}

      <hr style={{ width: '100%', border: 'none', borderTop: '1px solid var(--theme-elevation-150)', margin: '8px 0' }} />

      <button 
        onClick={() => handleAction('Rejected')} disabled={isUpdating}
        style={{ ...btnStyle, background: '#ef4444' }}
      >
         ❌ Reject Order
      </button>

      {status === 'Payment Requested' && (
        <button 
          onClick={() => handleAction('Completed')} disabled={isUpdating}
          style={{ ...btnStyle, background: '#0d9488', marginTop: '12px' }}
        >
           ✨ Mark Printing Complete
        </button>
      )}
    </div>
  )
}

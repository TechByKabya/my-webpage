'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export const QuickActionsCell: React.FC<any> = ({ rowData }) => {
  const [status, setStatus] = useState(rowData.status || 'Pending')
  const [price, setPrice] = useState(rowData.price || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/printing-requests/${rowData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          price: price ? Number(price) : 0,
        }),
      })

      if (res.ok) {
        // Force the router to refresh to show new data in table
        router.refresh()
      } else {
        alert('Failed to update')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating')
    }
    setIsUpdating(false)
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        style={{ 
          padding: '6px', 
          borderRadius: '4px', 
          border: '1px solid var(--theme-elevation-200, #ccc)', 
          background: 'var(--theme-elevation-0, #fff)', 
          color: 'var(--theme-elevation-800, #000)' 
        }}
      >
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
        <option value="Completed">Completed</option>
        <option value="Delivered">Delivered</option>
      </select>
      
      <input 
        type="number"
        placeholder="Price BDT"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ 
          width: '90px', 
          padding: '6px', 
          borderRadius: '4px', 
          border: '1px solid var(--theme-elevation-200, #ccc)', 
          background: 'var(--theme-elevation-0, #fff)', 
          color: 'var(--theme-elevation-800, #000)' 
        }}
      />

      <button 
        onClick={handleUpdate}
        disabled={isUpdating}
        style={{ 
          padding: '6px 14px', 
          backgroundColor: isUpdating ? 'var(--theme-elevation-400, #ccc)' : 'var(--theme-elevation-800, #000)', 
          color: 'var(--theme-elevation-0, #fff)', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: isUpdating ? 'not-allowed' : 'pointer',
          fontWeight: '500'
        }}
      >
        {isUpdating ? '...' : 'Update'}
      </button>
    </div>
  )
}

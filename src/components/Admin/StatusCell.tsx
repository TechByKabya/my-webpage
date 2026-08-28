'use client'

import React from 'react'

export const StatusCell: React.FC<any> = ({ cellData }) => {
  if (!cellData) return null

  const colors = {
    'Pending': { bg: '#fef3c7', text: '#d97706' },
    'Approved': { bg: '#e0e7ff', text: '#4338ca' },
    'Payment Requested': { bg: '#dbeafe', text: '#2563eb' },
    'Suggestion Given': { bg: '#f1f5f9', text: '#475569' },
    'Completed': { bg: '#ccfbf1', text: '#0d9488' },
    'Delivered': { bg: '#dcfce3', text: '#16a34a' },
    'Rejected': { bg: '#fee2e2', text: '#dc2626' }
  }

  // Fallback to Pending color if unknown status
  const color = colors[cellData as keyof typeof colors] || colors.Pending

  return (
    <span style={{
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 600,
      backgroundColor: color.bg,
      color: color.text,
      display: 'inline-block',
      whiteSpace: 'nowrap',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }}>
      {cellData}
    </span>
  )
}

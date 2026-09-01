'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const PaginationUI = ({ page, totalPages, collectionSlug }: { page: number, totalPages: number, collectionSlug: string }) => {
  if (totalPages <= 1) return null

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '24px', justifyContent: 'center' }}>
      {page > 1 ? (
        <Link 
          href={`/kabya-52005/collections/${collectionSlug}?page=${page - 1}`}
          style={{ display: 'flex', padding: '8px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', textDecoration: 'none', alignItems: 'center' }}
        >
          <ChevronLeft size={16} /> Prev
        </Link>
      ) : (
        <div style={{ display: 'flex', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#cbd5e1', opacity: 0.5, cursor: 'not-allowed', alignItems: 'center' }}>
          <ChevronLeft size={16} /> Prev
        </div>
      )}
      
      <span style={{ margin: '0 12px', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link 
          href={`/kabya-52005/collections/${collectionSlug}?page=${page + 1}`}
          style={{ display: 'flex', padding: '8px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', textDecoration: 'none', alignItems: 'center' }}
        >
          Next <ChevronRight size={16} />
        </Link>
      ) : (
        <div style={{ display: 'flex', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#cbd5e1', opacity: 0.5, cursor: 'not-allowed', alignItems: 'center' }}>
          Next <ChevronRight size={16} />
        </div>
      )}
    </div>
  )
}

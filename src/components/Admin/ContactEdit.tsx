import React from 'react'
import { ContactClientActions } from './ContactClientActions'
import { Mail, Clock, ShieldAlert, CheckCircle, MapPin, Monitor, Globe } from 'lucide-react'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const ContactEdit = async (props: any) => {
  let doc = props.doc

  if (!doc || Object.keys(doc).length === 0) {
    const id = props.params?.segments?.[2]
    if (id) {
      const payload = await getPayload({ config: configPromise })
      try {
        doc = await payload.findByID({ collection: 'contact-submissions', id })
      } catch (err) {
        console.error(err)
      }
    }
  }
  
  if (!doc) {
    return (
      <div style={{ padding: '40px' }}>
        Document not found.
      </div>
    )
  }

  const date = new Date(doc.createdAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Actions */}
      <div style={{ marginBottom: '24px' }}>
        <ContactClientActions id={doc.id} currentStatus={doc.status || 'new'} />
      </div>

      {/* Main Card */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '24px', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        
        {/* Header Section */}
        <div style={{ 
          padding: '32px', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', 
              background: '#4f46e5', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.8rem',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}>
              {doc.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', color: '#0f172a', fontWeight: 800 }}>{doc.name}</h1>
              <div style={{ color: '#475569', fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} /> <a href={`mailto:${doc.email}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>{doc.email}</a>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '8px',
              ...getStatusStyle(doc.status || 'new')
            }}>
              {doc.status === 'new' && <Clock size={14} />}
              {doc.status === 'read' && <CheckCircle size={14} />}
              {doc.status === 'replied' && <CheckCircle size={14} />}
              {doc.status === 'archived' && <ShieldAlert size={14} />}
              {(doc.status || 'new').toUpperCase()}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
              {date}
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div style={{ padding: '40px 32px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Message Content
          </h3>
          <div style={{ 
            fontSize: '1.1rem', 
            lineHeight: 1.7, 
            color: '#1e293b',
            whiteSpace: 'pre-wrap',
            background: '#f8fafc',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #f1f5f9'
          }}>
            {doc.message}
          </div>
        </div>

        {/* Metadata Footer */}
        <div style={{ 
          padding: '24px 32px', 
          background: '#f8fafc', 
          borderTop: '1px solid #e2e8f0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <MetaItem icon={<Monitor size={16} />} label="Source" value={doc.source || 'Website Contact Form'} />
          <MetaItem icon={<Globe size={16} />} label="IP Address" value={doc.ipAddress || 'Not recorded'} />
        </div>
      </div>
    </div>
  )
}

const MetaItem = ({ icon, label, value }: any) => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
    <div style={{ color: '#94a3b8', marginTop: '2px' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>{value}</div>
    </div>
  </div>
)

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'new': return { background: '#dbeafe', color: '#2563eb', border: '1px solid #bfdbfe' }
    case 'read': return { background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }
    case 'replied': return { background: '#f3e8ff', color: '#9333ea', border: '1px solid #e9d5ff' }
    case 'archived': return { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }
    default: return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }
  }
}

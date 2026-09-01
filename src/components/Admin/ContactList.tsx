import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { Mail, CheckCircle, Trash2, Calendar, User, Search, Clock, ShieldAlert } from 'lucide-react'
import { DeleteClientAction } from './DeleteClientAction'
import { PaginationUI } from './PaginationUI'

export const ContactList = async (props: any) => {
  const payload = await getPayload({ config: configPromise })
  
  const searchParams = props.searchParams instanceof Promise ? await props.searchParams : (props.searchParams || {})
  const page = searchParams.page ? parseInt(searchParams.page as string, 10) : 1
  const limit = 10
  
  // Fetch all contact submissions
  const data = await payload.find({
    collection: 'contact-submissions',
    depth: 0,
    limit,
    page,
    sort: '-createdAt',
  })

  const total = data.totalDocs
  const unread = data.docs.filter(doc => doc.status === 'new').length
  const spam = data.docs.filter(doc => doc.status === 'archived').length

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .contact-row:hover {
          background-color: #f1f5f9 !important;
        }
      `}</style>
      
      {/* Header & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Contact Responses</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Manage and review all form submissions from your website.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <StatCard title="Total" value={total} icon={<Mail size={20} color="#4f46e5" />} bg="#e0e7ff" />
          <StatCard title="Unread" value={unread} icon={<Clock size={20} color="#eab308" />} bg="#fef08a" />
          <StatCard title="Archived" value={spam} icon={<ShieldAlert size={20} color="#ef4444" />} bg="#fecaca" />
        </div>
      </div>

      {/* List Container */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '24px', 
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        
        {/* Toolbar */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
            <Search size={18} />
            <span>{data.docs.length} Submissions</span>
          </div>
        </div>

        {/* Table/List */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          {data.docs.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              <Mail size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
              <h3>No submissions yet</h3>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fff', borderBottom: '2px solid #f1f5f9' }}>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Sender</th>
                  <th style={thStyle}>Message Preview</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.docs.map((doc, i) => {
                  const isNew = doc.status === 'new'
                  return (
                    <tr key={doc.id} className="contact-row" style={{ 
                      borderBottom: '1px solid #f1f5f9',
                      background: isNew ? '#f8fafc' : '#fff',
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}>
                      <td style={tdStyle}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          ...getStatusStyle(doc.status || 'new')
                        }}>
                          {doc.status === 'new' && <Clock size={14} />}
                          {doc.status === 'read' && <CheckCircle size={14} />}
                          {doc.status === 'replied' && <CheckCircle size={14} />}
                          {doc.status === 'archived' && <ShieldAlert size={14} />}
                          {(doc.status || 'new').toUpperCase()}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: isNew ? 700 : 500, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '36px', height: '36px', borderRadius: '50%', 
                            background: '#e0e7ff', color: '#4f46e5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '1.1rem'
                          }}>
                            {doc.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.95rem' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{doc.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, color: isNew ? '#0f172a' : '#64748b', fontWeight: isNew ? 600 : 400, maxWidth: '300px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.message}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, color: '#64748b', fontSize: '0.85rem' }}>
                        {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Link 
                            href={`/kabya-52005/collections/contact-submissions/${doc.id}`}
                            style={{
                              display: 'inline-block',
                              background: '#4f46e5',
                              color: '#fff',
                              textDecoration: 'none',
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                            }}
                          >
                            View Details
                          </Link>
                          <DeleteClientAction id={doc.id} collectionSlug="contact-submissions" />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <PaginationUI page={data.page || 1} totalPages={data.totalPages || 1} collectionSlug="contact-submissions" />
    </div>
  )
}

// Helpers
const StatCard = ({ title, value, icon, bg }: any) => (
  <div style={{ 
    display: 'flex', alignItems: 'center', gap: '16px', 
    background: '#fff', padding: '16px 24px', borderRadius: '16px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' 
  }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{value}</div>
    </div>
  </div>
)

const thStyle: React.CSSProperties = {
  padding: '16px 24px',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#94a3b8',
  fontWeight: 700
}

const tdStyle: React.CSSProperties = {
  padding: '16px 24px',
  verticalAlign: 'middle'
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'new': return { background: '#dbeafe', color: '#2563eb' }
    case 'read': return { background: '#dcfce7', color: '#16a34a' }
    case 'replied': return { background: '#f3e8ff', color: '#9333ea' }
    case 'archived': return { background: '#fee2e2', color: '#dc2626' }
    default: return { background: '#f1f5f9', color: '#475569' }
  }
}

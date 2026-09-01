import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Printer, CheckCircle, Clock, ShieldAlert, Package, Banknote, Edit, Eye, MessageSquare, Box } from 'lucide-react'
import { DeleteClientAction } from './DeleteClientAction'
import { PaginationUI } from './PaginationUI'
import Link from 'next/link'

export const PrintingRequestList = async (props: any) => {
  const payload = await getPayload({ config: configPromise })
  
  const searchParams = props.searchParams instanceof Promise ? await props.searchParams : (props.searchParams || {})
  const page = searchParams.page ? parseInt(searchParams.page as string, 10) : 1
  const limit = 10
  
  const data = await payload.find({
    collection: 'printing-requests',
    depth: 0,
    limit,
    page,
    sort: '-createdAt'
  })

  const total = data.totalDocs
  const pendingCount = data.docs.filter(doc => doc.status === 'Pending').length
  const completedCount = data.docs.filter(doc => doc.status === 'Completed' || doc.status === 'Delivered').length

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .order-row:hover {
          background-color: #f8fafc !important;
        }
      `}</style>
      
      {/* Header & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', color: '#0f172a', fontWeight: 800 }}>3D Printing Orders</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>Manage customer print requests and file submissions.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <StatCard title="Total Orders" value={total} icon={<Printer size={20} color="#4f46e5" />} bg="#e0e7ff" />
          <StatCard title="Pending" value={pendingCount} icon={<Clock size={20} color="#eab308" />} bg="#fef08a" />
          <StatCard title="Finished" value={completedCount} icon={<Package size={20} color="#16a34a" />} bg="#dcfce7" />
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '24px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {data.docs.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <Box size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
            <p>No printing requests found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={thStyle}>Customer & Type</th>
                  <th style={thStyle}>Specs</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.docs.map((doc, i) => {
                  const date = new Date(doc.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })
                  
                  return (
                    <tr key={doc.id} className="order-row" style={{ 
                      borderBottom: '1px solid #f1f5f9',
                      background: '#fff',
                      transition: 'background 0.2s',
                    }}>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#0f172a' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '1.05rem' }}>{doc.name}</span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                            {doc.orderType}
                          </span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, color: '#475569', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontWeight: 600 }}>{doc.material} <span style={{ opacity: 0.5 }}>|</span> {doc.color}</span>
                          <span style={{ fontSize: '0.8rem' }}>{doc.infill} infill <span style={{ opacity: 0.5 }}>•</span> {doc.layerHeight}</span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          ...getStatusStyle(doc.status || 'Pending')
                        }}>
                          {getIcon(doc.status || 'Pending')}
                          {(doc.status || 'Pending').toUpperCase()}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, color: '#64748b', fontSize: '0.9rem' }}>
                        {date}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Link 
                            href={`/kabya-52005/collections/printing-requests/${doc.id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: '#0f172a',
                              color: '#fff',
                              textDecoration: 'none',
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              transition: 'opacity 0.2s'
                            }}
                          >
                            <Eye size={14} /> Review
                          </Link>
                          <DeleteClientAction id={doc.id} collectionSlug="printing-requests" />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PaginationUI page={data.page || 1} totalPages={data.totalPages || 1} collectionSlug="printing-requests" />
    </div>
  )
}

const thStyle = {
  padding: '16px 24px',
  color: '#475569',
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  fontWeight: 700,
}

const tdStyle = {
  padding: '16px 24px',
  verticalAlign: 'middle',
}

const StatCard = ({ title, value, icon, bg }: any) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px', 
    background: '#fff', 
    padding: '20px', 
    borderRadius: '16px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    border: '1px solid #f1f5f9',
    minWidth: '160px'
  }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>{title}</div>
      <div style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
    </div>
  </div>
)

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Pending': return { background: '#fef3c7', color: '#b45309' }
    case 'Approved': return { background: '#dbeafe', color: '#1d4ed8' }
    case 'Payment Requested': return { background: '#fce7f3', color: '#be185d' }
    case 'Rejected': return { background: '#fee2e2', color: '#dc2626' }
    case 'Suggestion Given': return { background: '#e0e7ff', color: '#4338ca' }
    case 'Completed': return { background: '#dcfce7', color: '#15803d' }
    case 'Delivered': return { background: '#dcfce7', color: '#15803d' }
    default: return { background: '#f1f5f9', color: '#475569' }
  }
}

const getIcon = (status: string) => {
  switch (status) {
    case 'Pending': return <Clock size={12} />
    case 'Approved': return <CheckCircle size={12} />
    case 'Payment Requested': return <Banknote size={12} />
    case 'Rejected': return <ShieldAlert size={12} />
    case 'Suggestion Given': return <MessageSquare size={12} />
    case 'Completed': return <CheckCircle size={12} />
    case 'Delivered': return <Package size={12} />
    default: return <Clock size={12} />
  }
}

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { FolderGit2, Eye, EyeOff, Edit, ArrowRight } from 'lucide-react'
import { VisibilityClientActions } from './VisibilityClientActions'
import { DeleteClientAction } from './DeleteClientAction'
import { PaginationUI } from './PaginationUI'
import Link from 'next/link'

export const ProjectList = async (props: any) => {
  const payload = await getPayload({ config: configPromise })
  
  // Resolve searchParams promise if it's Next 15, otherwise just use it
  const searchParams = props.searchParams instanceof Promise ? await props.searchParams : (props.searchParams || {})
  const page = searchParams.page ? parseInt(searchParams.page as string, 10) : 1
  const limit = 10
  
  const data = await payload.find({
    collection: 'projects',
    depth: 0,
    limit,
    page,
    sort: '-createdAt'
  })

  const total = data.totalDocs
  const publicCount = data.docs.filter(doc => doc.visibility === 'public').length
  const privateCount = data.docs.filter(doc => doc.visibility === 'private').length

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .project-row:hover {
          background-color: #f8fafc !important;
        }
      `}</style>
      
      {/* Header & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', color: '#0f172a', fontWeight: 800 }}>Projects</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>Manage your portfolio and showcase projects.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <StatCard title="Total" value={total} icon={<FolderGit2 size={20} color="#4f46e5" />} bg="#e0e7ff" />
          <StatCard title="Public" value={publicCount} icon={<Eye size={20} color="#16a34a" />} bg="#dcfce7" />
          <StatCard title="Private" value={privateCount} icon={<EyeOff size={20} color="#64748b" />} bg="#f1f5f9" />
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
            <FolderGit2 size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
            <p>No projects found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={thStyle}>Project Name & Tag</th>
                  <th style={thStyle}>Visibility</th>
                  <th style={thStyle}>Slug</th>
                  <th style={thStyle}>Last Updated</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.docs.map((doc, i) => {
                  const date = new Date(doc.updatedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })
                  
                  return (
                    <tr key={doc.id} className="project-row" style={{ 
                      borderBottom: '1px solid #f1f5f9',
                      background: '#fff',
                      transition: 'background 0.2s',
                    }}>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#0f172a' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '1rem' }}>{doc.title}</span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                            <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>{doc.tag}</span>
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <VisibilityClientActions id={doc.id} currentVisibility={doc.visibility || 'public'} collectionSlug="projects" />
                      </td>
                      <td style={{ ...tdStyle, color: '#64748b' }}>
                        <code style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                          /{doc.slug}
                        </code>
                      </td>
                      <td style={{ ...tdStyle, color: '#64748b', fontSize: '0.9rem' }}>
                        {date}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Link 
                            href={`/kabya-52005/collections/projects/${doc.id}`}
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
                            <Edit size={14} /> Edit
                          </Link>
                          <DeleteClientAction id={doc.id} collectionSlug="projects" />
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

      <PaginationUI page={data.page || 1} totalPages={data.totalPages || 1} collectionSlug="projects" />
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
  padding: '20px 24px',
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

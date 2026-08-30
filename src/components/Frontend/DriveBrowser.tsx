'use client'

import React, { useState } from 'react'
import { LottieAnimation } from '@/components/Frontend/LottieAnimation'
import { motion, Variants } from 'framer-motion'
import {
  FileText,
  FileCode2,
  Presentation,
  FileBox,
  DownloadCloud,
  HardDrive,
  FolderOpen,
} from 'lucide-react'

export type DriveFileType = 'pdf' | 'pptx' | 'code' | 'txt' | 'other'

export interface DriveFile {
  id: string
  name: string
  fileType: DriveFileType
  createdAt: string
}

interface DriveBrowserProps {
  files: DriveFile[]
}

const FILE_ICON_STYLES: Record<DriveFileType, { color: string; bg: string }> = {
  pdf:   { color: '#ef4444', bg: '#fef2f2' },
  pptx:  { color: '#f97316', bg: '#fff7ed' },
  code:  { color: '#3b82f6', bg: '#eff6ff' },
  txt:   { color: '#64748b', bg: '#f8fafc' },
  other: { color: '#8b5cf6', bg: '#f5f3ff' },
}

const getIconForType = (type: DriveFileType) => {
  const s = FILE_ICON_STYLES[type] || FILE_ICON_STYLES.other
  const iconStyle = { color: s.color }
  switch (type) {
    case 'pdf':   return <FileText size={24} style={iconStyle} />
    case 'pptx':  return <Presentation size={24} style={iconStyle} />
    case 'code':  return <FileCode2 size={24} style={iconStyle} />
    case 'txt':   return <FileText size={24} style={iconStyle} />
    default:      return <FileBox size={24} style={iconStyle} />
  }
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
}

export const DriveBrowser: React.FC<DriveBrowserProps> = ({ files }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(files.length / itemsPerPage))
  
  const currentFiles = files.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      <style>{`
        .drive-grid-header {
          display: grid;
          grid-template-columns: 1fr 160px 160px;
          padding: 16px 28px;
          border-bottom: 1px solid #f1f5f9;
          background: rgba(248,250,252,0.7);
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .drive-grid-row {
          display: grid;
          grid-template-columns: 1fr 160px 160px;
          align-items: center;
          padding: 18px 28px;
          transition: background 0.2s;
        }
        .drive-action-col {
          text-align: right;
        }
        @media (max-width: 768px) {
          .drive-grid-header {
            display: none;
          }
          .drive-list-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            padding: 16px;
          }
          .drive-grid-row {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 16px;
            border: 1px solid #f1f5f9 !important;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          }
          .drive-date-col {
            margin-top: 12px;
          }
          .drive-action-col {
            text-align: left;
            margin-top: 16px;
            width: 100%;
          }
          .drive-action-col a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
      <div
      style={{
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '60px',
        paddingLeft: '20px',
        paddingRight: '20px',
        background: 'radial-gradient(ellipse at top right, #dbeafe 0%, #f5f5f7 50%, #ede9fe 100%)',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '40px' }}
        >
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <HardDrive size={40} color="#4f46e5" />
            Secure Drive
          </h1>
        </motion.div>

        {/* File list card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
            overflow: 'hidden',
            minHeight: '890px', // Expand to roughly fit 10 items
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Background Animation */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.1, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LottieAnimation
              src="/live-cloud-storage.json"
              style={{ width: '80%', height: '80%' }}
            />
          </div>

          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <div className="drive-grid-header">
            <span>File</span>
            <span>Date Added</span>
            <span style={{ textAlign: 'right' }}>Action</span>
          </div>

          {files.length === 0 ? (
            <div
              style={{
                padding: '80px 20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  marginBottom: '20px',
                }}
              >
                <FolderOpen size={36} color="#93c5fd" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>
                Vault is Empty
              </h3>
              <p style={{ color: '#64748b', margin: 0 }}>No files have been securely uploaded yet.</p>
            </div>
          ) : (
            <motion.div className="drive-list-container" variants={containerVariants} initial="hidden" animate="show">
              {currentFiles.map((file, i) => {
                const s = FILE_ICON_STYLES[file.fileType] || FILE_ICON_STYLES.other
                return (
                  <motion.div
                    key={file.id}
                    variants={itemVariants}
                    className="drive-grid-row"
                    style={{
                      borderBottom: i < currentFiles.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.background = '#f8fafc'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.background = 'transparent'
                    }}
                  >
                    {/* Name + icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '14px',
                          background: s.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: `1px solid ${s.color}22`,
                        }}
                      >
                        {getIconForType(file.fileType)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            color: '#0f172a',
                            marginBottom: '4px',
                          }}
                        >
                          {file.name}
                        </div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: s.color,
                            background: s.bg,
                            border: `1px solid ${s.color}33`,
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {file.fileType}
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="drive-date-col" style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                      {new Date(file.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>

                    {/* Download */}
                    <div className="drive-action-col">
                      <a
                        href={`/api/drive/download/${file.id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          background: '#4f46e5',
                          color: 'white',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'background 0.2s, transform 0.15s, box-shadow 0.15s',
                          boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.background = '#4338ca'
                          el.style.transform = 'translateY(-2px)'
                          el.style.boxShadow = '0 6px 16px rgba(79,70,229,0.35)'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.background = '#4f46e5'
                          el.style.transform = 'translateY(0)'
                          el.style.boxShadow = '0 2px 8px rgba(79,70,229,0.3)'
                        }}
                      >
                        <DownloadCloud size={16} />
                        Download
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              padding: '20px',
              borderTop: '1px solid #f1f5f9',
              marginTop: 'auto'
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === 1 ? '#f8fafc' : '#ffffff',
                  color: currentPage === 1 ? '#94a3b8' : '#0f172a',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                Previous
              </button>
              
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === totalPages ? '#f8fafc' : '#ffffff',
                  color: currentPage === totalPages ? '#94a3b8' : '#0f172a',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                Next
              </button>
            </div>
          )}
          </div>
        </motion.div>
      </div>
      </div>
    </>
  )
}

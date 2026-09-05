'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useFormFields, useField, useDocumentInfo } from '@payloadcms/ui'
import { Copy, Check, Zap, ExternalLink, Image as ImageIcon, RefreshCw, FileCode, UploadCloud, CheckCircle2 } from 'lucide-react'

interface AssetItem {
  id?: string
  mediaId: string | number
  filename: string
  originalName?: string
  alt?: string
  url: string
  customAlias?: string
  filesize?: number
  mimeType?: string
}

export const IndustrialAssetHelper: React.FC = () => {
  const { id: docId } = useDocumentInfo()
  const slugField = useFormFields(([fields]) => fields?.slug)
  const { value: htmlCode, setValue: setHtmlCode } = useField<string>({ path: 'htmlCode' })
  const { value: assetsValue, setValue: setAssetsValue } = useField<any[]>({ path: 'assets' })

  const [assetItems, setAssetItems] = useState<AssetItem[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [replaceResult, setReplaceResult] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const slug = (slugField?.value as string) || ''

  const storageKey = docId ? `industrial_assets_${docId}` : 'industrial_assets_draft'

  // Load assets from database / API and cache on mount & page refresh
  useEffect(() => {
    let isMounted = true

    // 1. Initial instant load from localStorage if available
    try {
      const cached = localStorage.getItem(storageKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAssetItems(parsed)
        }
      }
    } catch (_) {}

    // 2. Fetch fresh assets from API for this project
    const fetchProjectAssets = async () => {
      setLoading(true)
      try {
        if (docId) {
          const res = await fetch(`/api/industrial-projects/${docId}?depth=1`)
          if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data?.assets) && data.assets.length > 0) {
              const items: AssetItem[] = data.assets
                .map((item: any) => {
                  const fileObj = typeof item.file === 'object' && item.file !== null ? item.file : null
                  if (!fileObj) return null
                  const mediaUrl = fileObj.url || (fileObj.filename ? `/api/media/file/${fileObj.filename}` : '')
                  if (!mediaUrl) return null

                  return {
                    id: String(item.id || fileObj.id),
                    mediaId: fileObj.id,
                    filename: fileObj.filename || item.customAlias || 'asset',
                    originalName: fileObj.alt || item.customAlias || fileObj.filename,
                    alt: fileObj.alt || item.customAlias,
                    url: mediaUrl,
                    customAlias: item.customAlias,
                    mimeType: fileObj.mimeType,
                  }
                })
                .filter(Boolean) as AssetItem[]

              if (isMounted && items.length > 0) {
                setAssetItems(items)
                try {
                  localStorage.setItem(storageKey, JSON.stringify(items))
                } catch (_) {}
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading project assets:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchProjectAssets()

    return () => {
      isMounted = false
    }
  }, [docId, storageKey])

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Core replacement engine matching original name, webp filename, customAlias, and base name
  const performAutoLink = useCallback(
    (codeToProcess: string, itemsToLink: AssetItem[]): { updatedCode: string; count: number } => {
      let code = codeToProcess
      let totalCount = 0

      itemsToLink.forEach((asset) => {
        const original = (asset.originalName || asset.alt || '').trim()
        const fn = (asset.filename || '').trim()
        const alias = (asset.customAlias || '').trim()
        const baseName = (original || fn).replace(/\.[^.]+$/, '')

        const patterns: string[] = []
        if (original) patterns.push(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        if (fn && fn !== original) patterns.push(fn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        if (alias && alias !== original && alias !== fn) patterns.push(alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        if (baseName && baseName.length > 2) {
          patterns.push(baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\.[a-zA-Z0-9]+')
        }

        if (patterns.length > 0) {
          // Match paths in quotes or url() without already having http:// or https://
          const regexStr = `(['"\\(])(?:(?!(?:https?:)?\\/\\/)[^'"()\\s]*\\/)?(?:${patterns.join('|')})(['"\\)])`
          const regex = new RegExp(regexStr, 'gi')

          const matches = code.match(regex)
          if (matches && matches.length > 0) {
            totalCount += matches.length
            code = code.replace(regex, `$1${asset.url}$2`)
          }
        }
      })

      return { updatedCode: code, count: totalCount }
    },
    [],
  )

  // Handle multi-file bulk upload
  const handleFilesSelected = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    setUploading(true)
    setUploadProgress(`Uploading ${fileArray.length} image(s)...`)

    try {
      const formData = new FormData()
      fileArray.forEach((f) => formData.append('files', f))
      if (docId) {
        formData.append('projectId', String(docId))
      }

      const res = await fetch('/api/industrial-upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to upload files')
      }

      const data = await res.json()
      const newlyUploaded: Array<{
        id: string | number
        filename: string
        originalName: string
        alt: string
        url: string
      }> = data.uploaded || []

      if (newlyUploaded.length > 0) {
        // 1. Convert to AssetItem format
        const newItems: AssetItem[] = newlyUploaded.map((u) => ({
          id: String(u.id),
          mediaId: u.id,
          filename: u.filename,
          originalName: u.originalName || u.alt,
          alt: u.alt || u.originalName,
          url: u.url,
          customAlias: u.originalName,
        }))

        // Merge with existing items (prevent duplicates by mediaId)
        const mergedItems = [...assetItems]
        newItems.forEach((item) => {
          if (!mergedItems.some((m) => String(m.mediaId) === String(item.mediaId))) {
            mergedItems.push(item)
          }
        })

        setAssetItems(mergedItems)
        try {
          localStorage.setItem(storageKey, JSON.stringify(mergedItems))
        } catch (_) {}

        // 2. Update Payload form assets field
        const currentAssets = Array.isArray(assetsValue) ? [...assetsValue] : []
        newlyUploaded.forEach((u) => {
          currentAssets.push({
            file: u.id,
            customAlias: u.originalName,
          })
        })
        if (setAssetsValue) {
          setAssetsValue(currentAssets)
        }

        // 3. Auto-replace into htmlCode immediately if HTML is present!
        if (htmlCode) {
          const { updatedCode, count } = performAutoLink(htmlCode, mergedItems)
          if (count > 0) {
            setHtmlCode(updatedCode)
            setReplaceResult(`🎉 Uploaded ${newlyUploaded.length} images & auto-linked ${count} reference(s) in HTML!`)
          } else {
            setReplaceResult(`✅ Uploaded ${newlyUploaded.length} images! Click "Auto-Link Assets in HTML" below.`)
          }
        } else {
          setReplaceResult(`✅ Successfully uploaded ${newlyUploaded.length} images! Paste your HTML code below and click Auto-Link.`)
        }
      }
    } catch (err: any) {
      setReplaceResult(`❌ Upload error: ${err.message}`)
    } finally {
      setUploading(false)
      setUploadProgress(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTimeout(() => setReplaceResult(null), 7000)
    }
  }

  // Scan htmlCode and replace local filenames / aliases with full CDN URLs
  const handleAutoReplace = () => {
    if (!htmlCode) {
      setReplaceResult('⚠️ HTML Code is empty. Paste your HTML code first.')
      setTimeout(() => setReplaceResult(null), 4000)
      return
    }

    if (assetItems.length === 0) {
      setReplaceResult('⚠️ No uploaded assets detected. Use "Bulk Upload Images" first.')
      setTimeout(() => setReplaceResult(null), 4000)
      return
    }

    const { updatedCode, count } = performAutoLink(htmlCode, assetItems)

    if (count > 0) {
      setHtmlCode(updatedCode)
      setReplaceResult(`✅ Successfully replaced ${count} image reference(s) with live CDN URLs!`)
    } else {
      setReplaceResult('ℹ️ No matching relative image filenames found. (Images may already be linked!)')
    }

    setTimeout(() => setReplaceResult(null), 6000)
  }

  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '1.5rem',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #10141d 0%, #161c28 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#e2e8f0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Hidden Multi-file input */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesSelected(e.target.files)
          }
        }}
      />

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <FileCode size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc' }}>
              Industrial Asset Assistant & Bulk Uploader
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Upload all project images at once. Local filenames (.png, .jpg) automatically resolve to live CDN URLs.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {/* Bulk Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: uploading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
              opacity: uploading ? 0.7 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {uploading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud size={16} />
                Bulk Upload Images
              </>
            )}
          </button>

          {/* Auto-Link Button */}
          <button
            type="button"
            onClick={handleAutoReplace}
            disabled={uploading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Zap size={15} />
            Auto-Link Assets in HTML
          </button>

          {slug && (
            <a
              href={`/industrial/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#f8fafc',
                fontSize: '0.85rem',
                textDecoration: 'none',
                fontWeight: 500,
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <ExternalLink size={14} />
              Live Preview
            </a>
          )}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesSelected(e.dataTransfer.files)
          }
        }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          border: dragOver ? '2px dashed #38bdf8' : '2px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          padding: '1.25rem',
          textAlign: 'center',
          background: dragOver ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0, 0, 0, 0.2)',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '1.25rem',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={24} className="animate-spin" style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 500 }}>
              {uploadProgress || 'Uploading images to Vercel Blob...'}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <UploadCloud size={30} style={{ color: '#38bdf8', opacity: 0.9 }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
              Drag & Drop all project images here, or click to browse
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Select multiple photos at once. They will upload directly to Vercel Blob and automatically link in your HTML!
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification Result */}
      {replaceResult && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: replaceResult.includes('✅') || replaceResult.includes('🎉') ? 'rgba(34, 197, 94, 0.15)' : replaceResult.includes('❌') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: replaceResult.includes('✅') || replaceResult.includes('🎉') ? '1px solid rgba(34, 197, 94, 0.3)' : replaceResult.includes('❌') ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
            color: replaceResult.includes('✅') || replaceResult.includes('🎉') ? '#4ade80' : replaceResult.includes('❌') ? '#f87171' : '#fbbf24',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          {replaceResult}
        </div>
      )}

      {/* Asset List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600 }}>
            <span>Attached Project Media ({assetItems.length})</span>
            {assetItems.length > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#4ade80', fontSize: '0.75rem', textTransform: 'none', fontWeight: 500 }}>
                <CheckCircle2 size={13} /> Active
              </span>
            )}
          </div>
          {assetItems.length > 0 && (
            <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
              Click any URL to copy
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            <RefreshCw size={16} className="animate-spin" style={{ display: 'inline', marginRight: '6px' }} />
            Loading project assets from database...
          </div>
        ) : assetItems.length === 0 ? (
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#94a3b8',
            }}
          >
            <ImageIcon size={20} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
            No images uploaded yet. Use the <strong>Bulk Upload</strong> box above to upload all your project photos.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
            {assetItems.map((asset, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: '#1e293b',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt={asset.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {asset.originalName || asset.customAlias || asset.filename}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {asset.url}
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(asset.url, idx)}
                  title="Copy full CDN URL"
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: copiedIndex === idx ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    color: copiedIndex === idx ? '#4ade80' : '#94a3b8',
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

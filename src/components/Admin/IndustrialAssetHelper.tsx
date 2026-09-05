'use client'

import React, { useState, useEffect } from 'react'
import { useFormFields, useField } from '@payloadcms/ui'
import { Copy, Check, Zap, ExternalLink, Image as ImageIcon, RefreshCw, FileCode } from 'lucide-react'

interface AssetItem {
  id?: string
  mediaId: string | number
  filename: string
  url: string
  customAlias?: string
  filesize?: number
  mimeType?: string
}

export const IndustrialAssetHelper: React.FC = () => {
  const assetsField = useFormFields(([fields]) => fields?.assets)
  const slugField = useFormFields(([fields]) => fields?.slug)
  const { value: htmlCode, setValue: setHtmlCode } = useField<string>({ path: 'htmlCode' })

  const [assetItems, setAssetItems] = useState<AssetItem[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [replaceResult, setReplaceResult] = useState<string | null>(null)

  const slug = (slugField?.value as string) || ''

  // Resolve media details from assets field
  useEffect(() => {
    const rawAssets = assetsField?.value as any[]
    if (!Array.isArray(rawAssets) || rawAssets.length === 0) {
      setAssetItems([])
      return
    }

    let isMounted = true
    setLoading(true)

    const fetchAllAssets = async () => {
      const items: AssetItem[] = []

      for (let i = 0; i < rawAssets.length; i++) {
        const item = rawAssets[i]
        const rawFile = item?.file
        const customAlias = item?.customAlias || ''

        if (!rawFile) continue

        // If file object already has URL
        if (typeof rawFile === 'object' && rawFile !== null && rawFile.url) {
          items.push({
            id: rawFile.id,
            mediaId: rawFile.id,
            filename: rawFile.filename || `asset-${i + 1}`,
            url: rawFile.url,
            customAlias,
            mimeType: rawFile.mimeType,
          })
          continue
        }

        // If file is an ID, fetch its details from Payload media API
        const mediaId = typeof rawFile === 'object' && rawFile !== null ? rawFile.id : rawFile
        if (mediaId) {
          try {
            const res = await fetch(`/api/media/${mediaId}`)
            if (res.ok) {
              const data = await res.json()
              if (data?.url) {
                items.push({
                  id: String(mediaId),
                  mediaId,
                  filename: data.filename || `asset-${i + 1}`,
                  url: data.url,
                  customAlias,
                  mimeType: data.mimeType,
                })
              }
            }
          } catch (e) {
            console.error('Failed to fetch media asset:', e)
          }
        }
      }

      if (isMounted) {
        setAssetItems(items)
        setLoading(false)
      }
    }

    fetchAllAssets()

    return () => {
      isMounted = false
    }
  }, [assetsField?.value])

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Scan htmlCode and replace local file names / aliases with full CDN URLs
  const handleAutoReplace = () => {
    if (!htmlCode) {
      setReplaceResult('⚠️ HTML Code is empty. Paste your HTML code first.')
      setTimeout(() => setReplaceResult(null), 4000)
      return
    }

    if (assetItems.length === 0) {
      setReplaceResult('⚠️ No uploaded assets detected yet. Upload images in the section below.')
      setTimeout(() => setReplaceResult(null), 4000)
      return
    }

    let code = htmlCode
    let replacementCount = 0

    assetItems.forEach((asset) => {
      const targets = [asset.filename, asset.customAlias].filter(Boolean) as string[]

      targets.forEach((target) => {
        const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // Match occurrences inside quotes or parentheses (e.g. src="target", url('target'), href="target", etc.)
        const regex = new RegExp(`(?<=['"(]|src=['"]|url\\(['"]?)(?:\\.?\\/)?${escaped}(?=['")]|['"]?\\))`, 'g')
        const matches = code.match(regex)
        if (matches && matches.length > 0) {
          replacementCount += matches.length
          code = code.replace(regex, asset.url)
        }
      })
    })

    if (replacementCount > 0) {
      setHtmlCode(code)
      setReplaceResult(`✅ Successfully replaced ${replacementCount} image reference(s) with CDN URLs!`)
    } else {
      setReplaceResult('ℹ️ No matching relative filenames found in your HTML code.')
    }

    setTimeout(() => setReplaceResult(null), 5000)
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
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
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
              Industrial Asset Assistant & URL Auto-Linker
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Bulk upload images below, then click Auto-Link to resolve local paths in your HTML to CDN URLs.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
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
              Open Live Page
            </a>
          )}

          <button
            type="button"
            onClick={handleAutoReplace}
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
        </div>
      </div>

      {replaceResult && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: replaceResult.includes('✅') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: replaceResult.includes('✅') ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
            color: replaceResult.includes('✅') ? '#4ade80' : '#fbbf24',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          {replaceResult}
        </div>
      )}

      {/* Asset List */}
      <div>
        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600, marginBottom: '0.75rem' }}>
          Uploaded Project Media ({assetItems.length})
        </div>

        {loading ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            <RefreshCw size={16} className="animate-spin" style={{ display: 'inline', marginRight: '6px' }} />
            Resolving uploaded asset URLs...
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
            No assets added yet. Add media items in the <strong>Project Image & Media Assets</strong> field below.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
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
                    {asset.customAlias ? `${asset.customAlias} (${asset.filename})` : asset.filename}
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

'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useFormFields, useDocumentInfo } from '@payloadcms/ui'
import {
  PenTool,
  Eye,
  EyeOff,
  Copy,
  CheckCheck,
  ExternalLink,
  BarChart3,
  FileText,
  Hash,
  Sparkles,
  Globe,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

/* ─── helpers ─────────────────────────────────────────── */
const countLexicalWords = (editorState: any): number => {
  if (!editorState?.root) return 0
  let text = ''
  const walk = (node: any) => {
    if (node.text) text += node.text + ' '
    node.children?.forEach(walk)
  }
  try { walk(editorState.root) } catch { return 0 }
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length
}

const seoColor = (s: number) => s >= 80 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626'
const seoLabel = (s: number) => s >= 80 ? 'Excellent' : s >= 50 ? 'Needs Work' : 'Poor'

/* ─── component ───────────────────────────────────────── */
export const BlogPostHeader: React.FC = () => {
  const { id } = useDocumentInfo()
  const [copied, setCopied] = useState(false)

  /* live field values */
  const titleField    = useFormFields(([f]) => f['title'])
  const slugField     = useFormFields(([f]) => f['slug'])
  const visField      = useFormFields(([f]) => f['visibility'])
  const contentField  = useFormFields(([f]) => f['content'])
  const metaTitleF    = useFormFields(([f]) => f['meta.title'])
  const metaDescF     = useFormFields(([f]) => f['meta.description'])

  const title       = (titleField?.value   as string) || ''
  const slug        = (slugField?.value    as string) || ''
  const visibility  = (visField?.value     as string) || 'public'
  const metaTitle   = (metaTitleF?.value   as string) || ''
  const metaDesc    = (metaDescF?.value    as string) || ''
  const contentVal  = contentField?.value

  /* SEO score */
  const { score, wordCount } = useMemo(() => {
    let t = 0
    if (metaTitle.length >= 40 && metaTitle.length <= 60)      t = 30
    else if (metaTitle.length > 20 && metaTitle.length < 80)   t = 20
    else if (metaTitle.length > 0)                             t = 10

    let d = 0
    if (metaDesc.length >= 120 && metaDesc.length <= 160)      d = 30
    else if (metaDesc.length > 80  && metaDesc.length < 200)   d = 20
    else if (metaDesc.length > 0)                              d = 10

    const wc = typeof contentVal === 'object' ? countLexicalWords(contentVal) : 0
    let c = 0
    if (wc > 300) c = 40
    else if (wc > 150) c = 20
    else if (wc > 50)  c = 10

    return { score: t + d + c, wordCount: wc }
  }, [metaTitle, metaDesc, contentVal])

  const scoreColor = seoColor(score)
  const scoreLabel = seoLabel(score)

  const handleCopySlug = useCallback(async () => {
    if (!slug) return
    await navigator.clipboard.writeText(`/blogs/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [slug])

  const isNew = !id

  return (
    <div style={{
      margin: '0 0 32px 0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <style>{`
        .bph-btn { transition: all 0.18s ease; }
        .bph-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .bph-btn:active { transform: translateY(0); }
        .bph-card { transition: box-shadow 0.2s; }
        .bph-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
      `}</style>

      {/* ── Top Header Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '20px',
        boxShadow: '0 8px 32px rgba(15,23,42,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative background dots */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '300px', height: '100%',
          background: 'radial-gradient(ellipse at 80% 50%, rgba(79,70,229,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          {/* Left: Title + meta */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(79,70,229,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PenTool size={18} color="#a5b4fc" />
              </div>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {isNew ? 'New Blog Post' : 'Blog Editor'}
              </span>
              {/* Visibility badge */}
              <span style={{
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: visibility === 'public' ? 'rgba(22,163,74,0.2)' : 'rgba(100,116,139,0.2)',
                color: visibility === 'public' ? '#4ade80' : '#94a3b8',
                border: `1px solid ${visibility === 'public' ? 'rgba(74,222,128,0.3)' : 'rgba(148,163,184,0.2)'}`,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {visibility === 'public' ? <Eye size={10} /> : <EyeOff size={10} />}
                {visibility === 'public' ? 'Public' : 'Private'}
              </span>
            </div>

            <h2 style={{
              margin: '0 0 12px',
              fontSize: title ? '1.6rem' : '1.2rem',
              fontWeight: 800,
              color: title ? '#f1f5f9' : '#475569',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}>
              {title || 'Untitled Blog Post'}
            </h2>

            {/* Slug row */}
            {slug && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={13} color="#64748b" />
                <code style={{
                  color: '#7c3aed', background: 'rgba(124,58,237,0.12)',
                  padding: '3px 10px', borderRadius: '6px',
                  fontSize: '0.82rem', fontWeight: 500,
                }}>
                  /blogs/{slug}
                </code>
                <button
                  className="bph-btn"
                  onClick={handleCopySlug}
                  title="Copy slug path"
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: '4px 8px', borderRadius: '6px', color: copied ? '#4ade80' : '#64748b',
                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem',
                  }}
                >
                  {copied ? <><CheckCheck size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            )}
          </div>

          {/* Right: Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            {id && slug && (
              <a
                href={`https://www.kabyac.tech/blogs/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bph-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '12px',
                  background: 'rgba(79,70,229,0.2)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  color: '#a5b4fc', textDecoration: 'none',
                  fontSize: '0.85rem', fontWeight: 600,
                }}
              >
                <Globe size={15} /> View Live
                <ExternalLink size={12} style={{ opacity: 0.7 }} />
              </a>
            )}

            {/* Word count pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '20px',
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(148,163,184,0.1)',
              color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600,
            }}>
              <FileText size={13} />
              {wordCount.toLocaleString()} words
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        {/* SEO Score Card */}
        <div className="bph-card" style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            border: `4px solid ${scoreColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            background: `${scoreColor}10`,
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: scoreColor }}>{score}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              SEO Score
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{scoreLabel}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>out of 100</div>
          </div>
        </div>

        {/* Meta Title Card */}
        <div className="bph-card" style={{
          background: '#fff', borderRadius: '16px', padding: '20px',
          border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: metaTitle.length >= 40 && metaTitle.length <= 60 ? '#dcfce7' : '#fef3c7',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <TrendingUp size={22} color={metaTitle.length >= 40 && metaTitle.length <= 60 ? '#16a34a' : '#d97706'} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Title Length
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              {metaTitle.length} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>chars</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Target: 40–60</div>
          </div>
        </div>

        {/* Meta Desc Card */}
        <div className="bph-card" style={{
          background: '#fff', borderRadius: '16px', padding: '20px',
          border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: metaDesc.length >= 120 && metaDesc.length <= 160 ? '#dcfce7' : '#fef3c7',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <BarChart3 size={22} color={metaDesc.length >= 120 && metaDesc.length <= 160 ? '#16a34a' : '#d97706'} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Description
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              {metaDesc.length} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>chars</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Target: 120–160</div>
          </div>
        </div>

        {/* Word count / Content card */}
        <div className="bph-card" style={{
          background: '#fff', borderRadius: '16px', padding: '20px',
          border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: wordCount >= 300 ? '#dcfce7' : wordCount >= 100 ? '#fef3c7' : '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Sparkles size={22} color={wordCount >= 300 ? '#16a34a' : wordCount >= 100 ? '#d97706' : '#dc2626'} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Word Count
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              {wordCount.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>words</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
              {wordCount >= 300 ? '✓ Great length' : wordCount >= 100 ? 'Add more content' : 'Too short'}
            </div>
          </div>
        </div>
      </div>

      {/* ── SEO Tips banner (only if score is low) ── */}
      {score < 50 && !isNew && (
        <div style={{
          marginTop: '16px',
          padding: '14px 20px',
          borderRadius: '12px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 500 }}>
            <strong>SEO Tip:</strong> Save this post to auto-generate a meta title &amp; description via AI, or fill them in the sidebar manually for a better score.
          </span>
        </div>
      )}

      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
        margin: '28px 0 4px',
      }} />
    </div>
  )
}

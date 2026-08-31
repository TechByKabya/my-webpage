'use client'
import React, { useMemo } from 'react'
import { useFormFields } from '@payloadcms/ui'

const countLexicalWords = (editorState: any): number => {
  if (!editorState || !editorState.root) return 0
  let text = ''
  
  const extractText = (node: any) => {
    if (node.text) text += node.text + ' '
    if (node.children) {
      node.children.forEach(extractText)
    }
  }
  
  try {
    extractText(editorState.root)
  } catch (e) {
    return 0
  }
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

export const SEOScoreGauge: React.FC = () => {
  const titleField = useFormFields(([fields]) => fields['meta.title'])
  const descriptionField = useFormFields(([fields]) => fields['meta.description'])
  const contentField = useFormFields(([fields]) => fields['content'])

  const title = (titleField?.value as string) || ''
  const description = (descriptionField?.value as string) || ''
  const contentValue = contentField?.value

  const { score, titleScore, descScore, wordCount, contentScore } = useMemo(() => {
    let tScore = 0
    if (title.length > 0) {
      if (title.length >= 40 && title.length <= 60) tScore = 30
      else if (title.length > 20 && title.length < 80) tScore = 20
      else tScore = 10
    }

    let dScore = 0
    if (description.length > 0) {
      if (description.length >= 120 && description.length <= 160) dScore = 30
      else if (description.length > 80 && description.length < 200) dScore = 20
      else dScore = 10
    }

    const words = typeof contentValue === 'object' ? countLexicalWords(contentValue) : 0
    let cScore = 0
    if (words > 300) cScore = 40
    else if (words > 150) cScore = 20
    else if (words > 50) cScore = 10

    return {
      score: tScore + dScore + cScore,
      titleScore: tScore,
      descScore: dScore,
      wordCount: words,
      contentScore: cScore,
    }
  }, [title, description, contentValue])

  const getColor = (s: number) => {
    if (s >= 80) return '#16a34a'
    if (s >= 50) return '#eab308'
    return '#dc2626'
  }

  const color = getColor(score)

  return (
    <div style={{
      padding: '24px',
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ margin: '0 0 6px', fontSize: '20px', color: '#0f172a', fontWeight: 600 }}>Real-time SEO Score</h3>
          <p style={{ margin: 0, fontSize: '15px', color: '#64748b' }}>Optimize your content for better search rankings.</p>
        </div>
        <div style={{ 
          width: '80px', height: '80px', 
          borderRadius: '50%', 
          border: `6px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: 'bold', color: color
        }}>
          {score}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* Title */}
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', borderLeft: `4px solid ${titleScore === 30 ? '#16a34a' : titleScore === 20 ? '#eab308' : '#cbd5e1'}` }}>
          <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>Title Length</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{title.length} <span style={{fontSize: '15px', fontWeight: 500, color: '#94a3b8'}}>chars</span></div>
          <div style={{ fontSize: '14px', color: '#475569' }}>Target: 50-60</div>
        </div>

        {/* Description */}
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', borderLeft: `4px solid ${descScore === 30 ? '#16a34a' : descScore === 20 ? '#eab308' : '#cbd5e1'}` }}>
          <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>Meta Desc</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{description.length} <span style={{fontSize: '15px', fontWeight: 500, color: '#94a3b8'}}>chars</span></div>
          <div style={{ fontSize: '14px', color: '#475569' }}>Target: 120-160</div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', borderLeft: `4px solid ${contentScore === 40 ? '#16a34a' : contentScore === 20 ? '#eab308' : '#cbd5e1'}` }}>
          <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>Word Count</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{wordCount} <span style={{fontSize: '15px', fontWeight: 500, color: '#94a3b8'}}>words</span></div>
          <div style={{ fontSize: '14px', color: '#475569' }}>Target: 300+</div>
        </div>
      </div>
    </div>
  )
}

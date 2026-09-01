'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const ProjectSocialPreview: React.FC = () => {
  const titleField = useFormFields(([fields]) => fields['meta.title'])
  const descriptionField = useFormFields(([fields]) => fields['meta.description'])
  const coverImageField = useFormFields(([fields]) => fields['coverImage'])

  const title = (titleField?.value as string) || 'AI will generate an SEO title upon save'
  const description = (descriptionField?.value as string) || 'AI will generate an SEO description upon save'

  const [imageUrl, setImageUrl] = React.useState('/website-template-OG.webp')

  React.useEffect(() => {
    const val = coverImageField?.value
    if (!val) {
      setImageUrl('/website-template-OG.webp')
      return
    }
    if (typeof val === 'object' && val !== null && 'url' in val) {
      setImageUrl((val as any).url as string)
    } else if (typeof val === 'string' || typeof val === 'number') {
      fetch(`/api/media/${val}`)
        .then(res => res.json())
        .then(data => { if (data?.url) setImageUrl(data.url) })
        .catch(console.error)
    }
  }, [coverImageField?.value])

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '8px', background: '#f9f9f9', fontFamily: 'sans-serif' }}>
      <h4 style={{ marginBottom: '1rem', color: '#333' }}>Live Social Media Preview</h4>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        This shows how your project will look when shared on platforms like X (Twitter), LinkedIn, or Facebook. <br/>
        <strong>✨ AI Magic:</strong> Click <b>Save</b> to automatically generate an optimized title and description!
      </p>
      <div style={{ border: '1px solid #cfd9de', borderRadius: '16px', overflow: 'hidden', background: '#fff', maxWidth: '500px' }}>
        <div style={{ height: '260px', background: '#e1e8ed', position: 'relative', borderBottom: '1px solid #cfd9de', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '13px', color: '#536471', marginBottom: '2px' }}>kabyac.tech</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f1419', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
          <div style={{ fontSize: '15px', color: '#536471', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'

export type YouTubeBlockProps = {
  youtubeUrl: string
}

export const YouTubeBlockComponent: React.FC<YouTubeBlockProps> = ({ youtubeUrl }) => {
  if (!youtubeUrl) return null

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  }

  const videoId = getYouTubeId(youtubeUrl)

  if (!videoId) return null

  return (
    <div style={{ marginTop: '40px', marginBottom: '40px', width: '100%', maxWidth: '850px', margin: '40px auto', position: 'relative', paddingBottom: 'min(478px, 56.25%)', height: 0, overflow: 'hidden', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
      <iframe 
        src={`https://www.youtube.com/embed/${videoId}`} 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      />
    </div>
  )
}

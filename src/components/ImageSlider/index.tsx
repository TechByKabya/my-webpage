'use client'

import React, { useState, useEffect, useCallback } from 'react'
import type { Media } from '@/payload-types'

type Slide = {
  id: string | number
  image: Media | number | string
  caption?: string | null
}

export function ImageSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  const prev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, next, slides.length])

  if (!slides.length) return null

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl group"
      style={{ aspectRatio: '16/9' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {slides.map((slide, i) => {
        const img = typeof slide.image === 'object' && slide.image !== null ? slide.image as Media : null
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {img?.url && (
              <img
                src={img.url}
                alt={slide.caption || img.alt || ''}
                className="w-full h-full object-cover"
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {slide.caption && (
              <div className="absolute bottom-6 left-6 text-white font-medium text-lg drop-shadow-lg">
                {slide.caption}
              </div>
            )}
          </div>
        )
      })}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            aria-label="Next"
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 right-6 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

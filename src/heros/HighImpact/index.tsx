'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center text-white bg-black overflow-hidden"
      data-theme="dark"
    >
      {/* Glowing background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-4xl mx-auto">
        {/* Profile photo — circular avatar */}
        {media && typeof media === 'object' && (
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-indigo-500/40 ring-offset-4 ring-offset-black shadow-2xl shadow-indigo-900/50">
            <Media
              fill
              imgClassName="object-cover"
              priority
              resource={media}
            />
          </div>
        )}

        {/* Online status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Available for new opportunities
        </div>

        {/* Rich Text content (your headline and description) */}
        {richText && (
          <div className="[&_h1]:text-5xl [&_h1]:md:text-7xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:bg-clip-text [&_h1]:text-transparent [&_h1]:bg-gradient-to-br [&_h1]:from-white [&_h1]:via-white [&_h1]:to-gray-500 [&_h1]:mb-4 [&_p]:text-xl [&_p]:text-gray-400 [&_p]:max-w-2xl [&_p]:mx-auto [&_p]:leading-relaxed">
            <RichText data={richText} enableGutter={false} />
          </div>
        )}

        {/* CTA Buttons */}
        {Array.isArray(links) && links.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {links.map(({ link }, i) => (
              <CMSLink
                key={i}
                {...link}
                className={
                  i === 0
                    ? 'px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/40'
                    : 'px-8 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm'
                }
              />
            ))}
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-white tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  )
}

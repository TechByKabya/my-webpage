import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import type { Media, Project, Post } from '@/payload-types'
import { ImageSlider } from '@/components/ImageSlider'

export const dynamic = 'force-dynamic'

export default async function PortfolioHome() {
  const payload = await getPayload({ config: configPromise })

  // ── Fetch ALL settings from admin panel ──
  const settings = await payload.findGlobal({ slug: 'homepage-settings', depth: 1 })

  // ── Fetch slider images ──
  const { docs: slides } = await payload.find({
    collection: 'hero-slides',
    sort: 'order',
    limit: 20,
    depth: 1,
  })

  // ── Fetch projects ──
  const { docs: projects } = await payload.find({
    collection: 'projects',
    limit: 6,
    sort: '-createdAt',
    depth: 1,
  })

  // ── Fetch blog posts ──
  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 3,
    sort: '-createdAt',
    depth: 1,
  })

  const heroPhoto = settings?.heroPhoto && typeof settings.heroPhoto === 'object'
    ? settings.heroPhoto as Media
    : null

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white selection:bg-indigo-500">

      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section className="relative px-6 pt-32 pb-20 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-20 left-1/3 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">

          {/* Profile photo — you upload this from Admin → Homepage Settings */}
          {heroPhoto?.url && (
            <div className="mx-auto w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-indigo-500/40 ring-offset-4 ring-offset-[#0a0a0f] shadow-2xl shadow-indigo-900/50">
              <img src={heroPhoto.url} alt={heroPhoto.alt || 'Profile'} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Badge — you change this from Admin → Homepage Settings */}
          {settings?.heroBadgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              {settings.heroBadgeText}
            </div>
          )}

          {/* Title — you change this from Admin → Homepage Settings */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
              {settings?.heroTitle || 'Welcome to my website'}
            </span>
          </h1>

          {/* Subtitle — you change this from Admin → Homepage Settings */}
          {settings?.heroSubtitle && (
            <p className="text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
              {settings.heroSubtitle}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="#projects" className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-900/40 hover:scale-105">
              {settings?.heroPrimaryButtonText || 'View My Work'}
            </Link>
            <Link href="#contact" className="px-8 py-3.5 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm">
              {settings?.heroSecondaryButtonText || 'Get In Touch'}
            </Link>
          </div>

          {/* Social links — you add these from Admin → Homepage Settings */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {settings?.githubUrl && (
              <a href={settings.githubUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                GitHub
              </a>
            )}
            {settings?.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                LinkedIn
              </a>
            )}
            {settings?.twitterUrl && (
              <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Twitter
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ─── IMAGE SLIDER ────────────────────────────────────────── */}
      {slides.length > 0 && (
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <ImageSlider slides={slides as any} />
        </section>
      )}

      {/* ─── SKILLS ──────────────────────────────────────────────── */}
      {settings?.skills && (settings.skills as any[]).length > 0 && (
        <section className="px-6 py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-3xl md:text-4xl font-bold">{settings?.skillsSectionTitle || 'My Skills'}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {(settings.skills as any[]).map((skill: any, i: number) => (
                <div key={i} className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-indigo-500/50 transition-all">
                  {skill.icon && <span className="text-2xl">{skill.icon}</span>}
                  <span className="font-medium text-gray-200">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── PROJECTS ────────────────────────────────────────────── */}
      <section id="projects" className="px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 space-y-3">
            <p className="text-indigo-400 font-semibold tracking-widest text-sm uppercase">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-bold">{settings?.projectsSectionTitle || 'Featured Projects'}</h2>
            <p className="text-gray-400 max-w-xl">{settings?.projectsSectionSubtitle || ''}</p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => {
                const cover = typeof project.coverImage === 'object' ? project.coverImage as Media : null
                return (
                  <div key={project.id} className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1">
                    {cover?.url && (
                      <div className="aspect-video overflow-hidden border-b border-white/10">
                        <img src={cover.url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{project.title}</h3>
                      {project.description && <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>}
                      <div className="flex gap-3 pt-2">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">Live Demo →</a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-gray-400 hover:text-white">GitHub →</a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
              <p className="text-gray-400">No projects yet.</p>
              <p className="text-sm text-gray-600 mt-1">Admin → Projects → Add New</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── BLOG ────────────────────────────────────────────────── */}
      <section id="blog" className="px-6 py-24 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 space-y-3">
            <p className="text-emerald-400 font-semibold tracking-widest text-sm uppercase">Blog</p>
            <h2 className="text-4xl md:text-5xl font-bold">{settings?.blogSectionTitle || 'Latest Thoughts'}</h2>
            <p className="text-gray-400">{settings?.blogSectionSubtitle || ''}</p>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/posts/${post.slug || post.id}`}
                  className="group p-6 rounded-2xl border border-white/10 bg-black hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all duration-300">
                  <p className="text-xs text-gray-500 mb-3">{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">{post.title}</h3>
                  <p className="mt-2 text-emerald-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read more →</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
              <p className="text-gray-400">No posts yet.</p>
              <p className="text-sm text-gray-600 mt-1">Admin → Posts → Add New</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CONTACT ─────────────────────────────────────────────── */}
      <section id="contact" className="px-6 py-24 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-violet-400 font-semibold tracking-widest text-sm uppercase">Contact</p>
          <h2 className="text-4xl md:text-5xl font-bold">{settings?.contactTitle || "Let's Work Together"}</h2>
          <p className="text-gray-400 text-lg leading-relaxed">{settings?.contactSubtitle || ''}</p>
          {settings?.contactEmail && (
            <a href={`mailto:${settings.contactEmail}`}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-2xl shadow-indigo-900/50">
              {settings?.contactButtonText || 'Say Hello 👋'}
            </a>
          )}
        </div>
      </section>

    </main>
  )
}

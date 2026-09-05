import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 0 // Update sitemap instantly when new posts are created

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  
  // Use the environment-aware URL so staging/dev previews don't hardcode production
  const siteUrl = getServerSideURL()

  const [pages, blogs, projects, industrialProjects] = await Promise.all([
    payload.find({ collection: 'pages', limit: 1000 }),
    payload.find({ collection: 'blogs', limit: 1000, where: { visibility: { not_equals: 'private' } } }),
    payload.find({ collection: 'projects', limit: 1000, where: { visibility: { not_equals: 'private' } } }),
    payload.find({ collection: 'industrial-projects', limit: 1000, where: { visibility: { not_equals: 'private' } } }),
  ])

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/3d-printing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/industrial`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }
  ]

  pages.docs.forEach((page) => {
    if (page.slug && page.slug !== 'home') {
      sitemap.push({
        url: `${siteUrl}/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  })

  blogs.docs.forEach((blog) => {
    if (blog.slug) {
      sitemap.push({
        url: `${siteUrl}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  })

  projects.docs.forEach((project) => {
    if (project.slug) {
      sitemap.push({
        url: `${siteUrl}/projects/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  })

  industrialProjects.docs.forEach((project) => {
    if (project.slug) {
      sitemap.push({
        url: `${siteUrl}/industrial/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.85,
      })
    }
  })

  return sitemap
}

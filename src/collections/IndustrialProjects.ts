import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidatePath } from 'next/cache'

export const IndustrialProjects: CollectionConfig = {
  slug: 'industrial-projects',
  labels: {
    singular: 'Industrial Project',
    plural: 'Industrial Projects',
  },
  admin: {
    useAsTitle: 'title',
    group: ' ',
    defaultColumns: ['title', 'category', 'visibility', 'featured', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // If htmlCode and assets are present, attempt automatic replacement of local filename references
        if (data?.htmlCode && Array.isArray(data?.assets) && data.assets.length > 0) {
          try {
            let updatedHtml = data.htmlCode

            for (const item of data.assets) {
              const mediaId = typeof item.file === 'object' && item.file !== null ? item.file.id : item.file
              if (!mediaId) continue

              const mediaDoc = await req.payload.findByID({
                collection: 'media',
                id: mediaId,
              })

              if (mediaDoc && mediaDoc.url) {
                const mediaUrl = mediaDoc.url
                const original = mediaDoc.alt?.trim() || ''
                const fn = mediaDoc.filename?.trim() || ''
                const alias = item.customAlias?.trim() || ''
                const baseName = (original || fn).replace(/\.[^.]+$/, '')

                const patterns: string[] = []
                if (original) patterns.push(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                if (fn && fn !== original) patterns.push(fn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                if (alias && alias !== original && alias !== fn) patterns.push(alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                if (baseName && baseName.length > 2) {
                  patterns.push(baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\.[a-zA-Z0-9]+')
                }

                if (patterns.length > 0) {
                  const regexStr = `(['"\\(])(?:(?!(?:https?:)?\\/\\/)[^'"()\\s]*\\/)?(?:${patterns.join('|')})(['"\\)])`
                  const regex = new RegExp(regexStr, 'gi')
                  updatedHtml = updatedHtml.replace(regex, `$1${mediaUrl}$2`)
                }
              }
            }

            data.htmlCode = updatedHtml
          } catch (err) {
            req.payload.logger.warn(`Error auto-linking industrial project assets: ${err}`)
          }
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc, req: { payload } }) => {
        payload.logger.info(`Revalidating caches for industrial project: ${doc.slug}`)
        revalidatePath('/industrial')
        revalidatePath(`/industrial/${doc.slug}`)
        revalidatePath(`/api/industrial-render/${doc.slug}`)
        revalidatePath('/')
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
          revalidatePath(`/industrial/${previousDoc.slug}`)
          revalidatePath(`/api/industrial-render/${previousDoc.slug}`)
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req: { payload } }) => {
        payload.logger.info(`Revalidating caches for deleted industrial project: ${doc?.slug}`)
        revalidatePath('/industrial')
        if (doc?.slug) {
          revalidatePath(`/industrial/${doc.slug}`)
          revalidatePath(`/api/industrial-render/${doc.slug}`)
        }
        revalidatePath('/')
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Project Title',
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      label: 'Industry / Domain',
      defaultValue: 'Industrial Automation',
      admin: {
        description: 'E.g. "Robotics & AI", "Industrial IoT", "Smart Manufacturing", "Factory Automation"',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline / Short Hook',
      admin: {
        description: 'Catchy one-line summary displayed prominently on cards.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Project Overview / Summary',
      admin: {
        description: 'Short paragraph explaining what this elite project accomplished.',
      },
    },
    {
      name: 'assetHelper',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/Admin/IndustrialAssetHelper#IndustrialAssetHelper',
        },
      },
    },
    {
      name: 'htmlCode',
      type: 'code',
      label: 'Custom Standalone HTML / CSS / JS Code',
      required: true,
      admin: {
        language: 'html',
        description: 'Paste your complete animated HTML page here (including <style> and <script> tags). This will render in an isolated, full-screen canvas.',
      },
    },
    {
      name: 'assets',
      type: 'array',
      label: 'Project Image & Media Assets',
      labels: {
        singular: 'Asset',
        plural: 'Assets',
      },
      admin: {
        description: 'Upload all images, SVGs, or media referenced in your HTML code. Use the Asset Helper above to copy CDN URLs or auto-replace filenames.',
      },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Media File',
        },
        {
          name: 'customAlias',
          type: 'text',
          label: 'Filename Match / Alias (e.g. hero.png, schematic.svg)',
          admin: {
            description: 'Optional alias if your HTML code references a different name.',
          },
        },
      ],
    },

    // ── SIDEBAR FIELDS ──
    {
      name: 'visibility',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ],
      defaultValue: 'public',
      required: true,
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/Admin/VisibilityCustomField#VisibilityCustomField',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Feature on Homepage',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Showcase this project in the Homepage "Industrial Solutions" preview section.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order Priority',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers (0, 1, 2...) appear first in grids.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'High-resolution thumbnail preview image for project cards.',
      },
    },
    {
      ...slugField(),
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

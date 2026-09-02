import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { documentationEditor } from '../fields/DocumentationContent'
import { revalidatePath } from 'next/cache'
import { autoGenerateSEO } from '../hooks/autoGenerateSEO'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    plural: 'Projects',
    singular: 'Project',
  },
  admin: {
    useAsTitle: 'title',
    group: ' ',
    components: {
      views: {
        list: {
          Component: '@/components/Admin/ProjectList#ProjectList',
        },
        // Edit header — same pattern as Blogs
        Edit: {
          Default: {},
        },
      },
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeChange: [
      autoGenerateSEO,
    ],
    afterChange: [
      ({ doc, previousDoc, req: { payload } }) => {
        payload.logger.info(`Revalidating caches for project: ${doc.slug}`)
        revalidatePath('/projects')
        revalidatePath(`/projects/${doc.slug}`)
        revalidatePath('/')
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
          revalidatePath(`/projects/${previousDoc.slug}`)
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req: { payload } }) => {
        payload.logger.info(`Revalidating caches for deleted project: ${doc?.slug}`)
        revalidatePath('/projects')
        if (doc?.slug) revalidatePath(`/projects/${doc.slug}`)
        revalidatePath('/')
        return doc
      }
    ],
  },
  fields: [
    // ── TAB SWITCHER UI (must be FIRST field) ──
    {
      name: 'customTabSwitcher',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/Admin/CustomProjectTabSwitcher#CustomProjectTabSwitcher',
        },
      },
    },

    // ── PROJECT CONTENT FIELDS (shown in "Project Content" tab) ──
    // All must have admin.className: 'project-field'
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        className: 'project-field',
      },
    },
    {
      name: 'tag',
      type: 'text',
      required: true,
      label: 'Tag (e.g. Robotics, Award)',
      admin: {
        className: 'project-field',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description / Excerpt',
      admin: {
        className: 'project-field',
        description: 'Brief summary shown on project cards.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: documentationEditor,
      label: 'Project Post Content',
      admin: {
        className: 'project-field',
        description: 'Write the full article or details about your project here.',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube Video URL (Optional)',
      admin: {
        className: 'project-field',
        description: 'Paste a YouTube video link (e.g. https://www.youtube.com/watch?v=...) to embed it in the post.',
      },
    },
    {
      name: 'linkUrl',
      type: 'text',
      label: 'External Link URL (Optional)',
      admin: {
        className: 'project-field',
      },
    },
    {
      name: 'gridSpan',
      type: 'select',
      defaultValue: 'span-1',
      options: [
        { label: 'Span 1 Column', value: 'span-1' },
        { label: 'Span 2 Columns', value: 'span-2' },
      ],
      required: true,
      admin: {
        className: 'project-field',
      },
    },
    {
      name: 'isGithubCard',
      type: 'checkbox',
      label: 'Is this the GitHub/More Projects Card?',
      defaultValue: false,
      admin: {
        className: 'project-field',
        description: 'If checked, this card will be styled as the dark GitHub link card.',
      },
    },


    {
      name: 'seoSocialPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/Admin/ProjectSocialPreview#ProjectSocialPreview',
        },
      },
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Upload a high-quality cover image for your project.',
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

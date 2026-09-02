import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { documentationEditor } from '../fields/DocumentationContent'
import { revalidatePath } from 'next/cache'
import { autoGenerateSEO } from '../hooks/autoGenerateSEO'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  labels: {
    plural: 'Blogs',
    singular: 'Blog',
  },
  admin: {
    useAsTitle: 'title',
    group: ' ',
    components: {
      views: {
        list: {
          Component: '@/components/Admin/BlogList#BlogList',
        },
        Edit: {
          Default: {
            // Header removed due to TS error (not supported in CustomDocumentViewConfig)
          },
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
        payload.logger.info(`Revalidating caches for blog: ${doc.slug}`)
        revalidatePath('/blogs')                  // blog listing page
        revalidatePath(`/blogs/${doc.slug}`)      // new/current post URL
        revalidatePath('/')                       // homepage blog grid
        // If the slug was renamed, also bust the old URL
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
          revalidatePath(`/blogs/${previousDoc.slug}`)
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req: { payload } }) => {
        payload.logger.info(`Revalidating caches for deleted blog: ${doc?.slug}`)
        revalidatePath('/blogs')
        if (doc?.slug) revalidatePath(`/blogs/${doc.slug}`)
        revalidatePath('/')
        return doc
      }
    ],
  },
  fields: [
    {
      name: 'customTabSwitcher',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/Admin/CustomBlogTabSwitcher#CustomBlogTabSwitcher',
        },
      },
    },
    // --- MAIN FIELDS (Handled by Tab Switcher) ---
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        className: 'blog-field',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short Excerpt / Description',
      admin: {
        className: 'blog-field',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: documentationEditor,
      label: 'Main Content',
      required: true,
      admin: {
        className: 'blog-field',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube Video URL (Optional)',
      admin: {
        className: 'blog-field',
        description: 'Paste a YouTube video link (e.g. https://www.youtube.com/watch?v=...) to embed it in the post.',
      }
    },
    // --- SIDEBAR FIELDS ---
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
        description: 'Upload a high-quality cover image for your blog post.',
      }
    },
    {
      ...slugField(),
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

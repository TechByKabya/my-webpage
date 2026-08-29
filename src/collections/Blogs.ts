import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { documentationEditor } from '../fields/DocumentationContent'
import { revalidatePath } from 'next/cache'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  labels: {
    plural: 'Blogs',
    singular: 'Blog',
  },
  admin: {
    useAsTitle: 'title',
    group: ' ',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      ({ req: { payload } }) => {
        revalidatePath('/', 'layout')
      },
    ],
  },
  fields: [
    // ── SIDEBAR ─────────────────────────────────────
    slugField(),
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },

    // ── TABS ────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Blog Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Short Excerpt / Description',
            },
            {
              name: 'content',
              type: 'richText',
              editor: documentationEditor,
              label: 'Main Content',
              required: true,
            },
            {
              name: 'youtubeUrl',
              type: 'text',
              label: 'YouTube Video URL (Optional)',
              admin: {
                description: 'Paste a YouTube video link (e.g. https://www.youtube.com/watch?v=...) to embed it in the post.',
              }
            },
          ],
        },
      ],
    },
  ],
}

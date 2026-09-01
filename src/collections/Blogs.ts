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
      ({ req: { payload } }) => {
        revalidatePath('/', 'layout')
      },
    ],
  },
  fields: [
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
        description: 'Private posts will be hidden from the website.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content Editor',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  ...slugField(),
                  admin: { width: '50%' },
                },
              ],
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
          ],
        },
        {
          label: 'Media & Links',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Upload a high-quality cover image for your blog post.',
              }
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

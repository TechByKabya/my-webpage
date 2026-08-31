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
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
      type: 'tabs',
      tabs: [
        {
          label: 'Project Details',
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
              name: 'tag',
              type: 'text',
              required: true,
              label: 'Tag (e.g. Robotics, Award)',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'content',
              type: 'richText',
              editor: documentationEditor,
              label: 'Project Post Content',
              admin: {
                description: 'Write the full article or details about your project here.',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Upload a high-quality cover image for your project.',
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
        {
          label: 'Links & Appearance',
          fields: [
            {
              name: 'linkUrl',
              type: 'text',
              label: 'External Link URL (Optional)',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'gridSpan',
                  type: 'select',
                  defaultValue: 'span-1',
                  options: [
                    { label: 'Span 1 Column', value: 'span-1' },
                    { label: 'Span 2 Columns', value: 'span-2' },
                  ],
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'isGithubCard',
                  type: 'checkbox',
                  label: 'Is this the GitHub/More Projects Card?',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'If checked, this card will be styled as the dark GitHub link card.',
                    style: { alignSelf: 'center', paddingTop: '30px' }
                  }
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

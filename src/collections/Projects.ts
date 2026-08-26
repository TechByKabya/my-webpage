import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'


export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: '🚀 Portfolio',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A short summary of the project.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'liveUrl',
      type: 'text',
      label: 'Live Demo URL',
      admin: {
        description: 'URL to the live project (optional).',
      },
    },
    {
      name: 'githubUrl',
      type: 'text',
      label: 'GitHub URL',
      admin: {
        description: 'URL to the source code (optional).',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Project Details',
    },
  ],
}

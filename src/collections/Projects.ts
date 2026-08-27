import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { documentationEditor } from '../fields/DocumentationContent'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: '\u200B\u200BProjects',
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
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'linkUrl',
      type: 'text',
      label: 'External Link URL (Optional)',
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
    },
    {
      name: 'isGithubCard',
      type: 'checkbox',
      label: 'Is this the GitHub/More Projects Card?',
      defaultValue: false,
      admin: {
        description: 'If checked, this card will be styled as the dark GitHub link card.',
      }
    },
    {
      name: 'content',
      type: 'richText',
      editor: documentationEditor,
      label: 'Project Post Content',
      admin: {
        description: 'Write the full article or details about your project here.',
      },
    }
  ],
}

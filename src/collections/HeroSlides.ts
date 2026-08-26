import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  labels: {
    singular: 'Hero Slide',
    plural: 'Hero Slides',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['image', 'caption', 'order'],
    group: '🖼️ Media',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Slide Image',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption (optional)',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Order (1 = first)',
      defaultValue: 1,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

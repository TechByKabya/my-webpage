import type { GlobalConfig } from 'payload'

export const PrintingSettings: GlobalConfig = {
  slug: 'printing-settings',
  label: '3D Printing Settings',
  access: {
    read: () => true, // Anyone can read this config
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'materials',
      type: 'array',
      label: 'Available Materials',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Add materials that customers can select (e.g. PLA, PETG).',
      },
    },
    {
      name: 'colors',
      type: 'array',
      label: 'Available Colors',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Add colors that customers can select.',
      },
    },
  ],
}

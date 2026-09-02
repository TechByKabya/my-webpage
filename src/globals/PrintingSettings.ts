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
  hooks: {
    afterChange: [
      ({ doc, req: { payload } }) => {
        payload.logger.info(`Revalidating caches for 3D Printing Settings`)
        import('next/cache').then(({ revalidatePath }) => {
          revalidatePath('/3d-printing')
        })
        return doc
      }
    ]
  },
  fields: [
    {
      name: 'socialBanner',
      type: 'upload',
      relationTo: 'media',
      label: 'Social Media Preview Banner',
      admin: {
        description: 'Upload an image (1200x630px recommended). This image will appear when you share the 3D printing page on social media.',
      },
    },
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

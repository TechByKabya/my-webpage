import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      if (user) return true
      return false
    },
  },
  admin: {
    group: '\u200BSettings',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Site Logo',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Favicon',
      admin: {
        description: 'Upload an icon (ICO, PNG, or SVG). Recommended size: 32x32 or 64x64 pixels.',
      },
    },
  ],
}


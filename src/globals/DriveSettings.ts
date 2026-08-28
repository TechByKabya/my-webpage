import type { GlobalConfig } from 'payload'

export const DriveSettings: GlobalConfig = {
  slug: 'drive-settings',
  label: 'Drive Auth Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'driveUsername',
      type: 'text',
      required: true,
      label: 'Drive Page Username',
    },
    {
      name: 'drivePassword',
      type: 'text',
      required: true,
      label: 'Drive Page Password',
    },
  ],
}

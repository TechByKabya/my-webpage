import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const DriveSettings: GlobalConfig = {
  slug: 'drive-settings',
  label: 'Drive Auth Settings',
  admin: {
    group: ' ',
  },
  access: {
    read: authenticated,
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

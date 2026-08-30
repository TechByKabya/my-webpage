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
    group: ' ',
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
    {
      name: 'loadingAnimation',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Loading Screen Animation',
      admin: {
        description:
          'Upload a short video or GIF shown while the page loads (keep it small/low-res for fast display, e.g. MOV, MP4, WebM under 500 KB).',
      },
    },
    {
      name: 'adminLoginAvatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Admin Login — Avatar Photo',
      admin: {
        description:
          'Your profile photo shown on the left panel of the admin login page. Use a square PNG, minimum 400×400 px.',
      },
    },
    {
      name: 'adminLoginVideo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Admin Login — Logo Video',
      admin: {
        description:
          'Short looping video shown as the logo on the admin login form. Upload a MOV or MP4 file (keep under 5MB).',
      },
    },
  ],
}


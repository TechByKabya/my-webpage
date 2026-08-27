import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Home Page Setup',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Site Settings',
  },
  fields: [
    // ── NAVIGATION MENU ──────────────────────────────────
    {
      type: 'collapsible',
      label: 'Navigation Menu',
      fields: [
        {
          name: 'menuItems',
          type: 'array',
          label: 'Menu Links',
          admin: {
            description: 'Manage the links shown in the top navigation bar.',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              admin: {
                description: 'URL or anchor link (e.g., #hero, #projects)',
              },
            },
            {
              name: 'isButton',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Render this item as a highlighted button (like Connect)',
              },
            },
          ],
        },
      ],
    },

    // ── HERO SECTION ──────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Hero Section (Top of the page)',
      fields: [
        {
          name: 'heroBadgeText',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Based in Bangladesh',
        },
        {
          name: 'heroTitle',
          type: 'textarea',
          label: 'Hero Title (Use newline for breaks)',
          defaultValue: 'Design.\nBuild.\nLearn.',
          required: true,
        },
        {
          name: 'heroBio',
          type: 'textarea',
          label: 'Bio / Description',
          defaultValue: 'I work where hardware and software meet — building practical projects, helping teams, and learning along the way.',
        },
        {
          name: 'heroPhoto',
          type: 'upload',
          relationTo: 'media',
          label: 'Profile Photo',
        },
        {
          name: 'heroFloatCard1Icon',
          type: 'text',
          label: 'Float Card 1 Icon Class (FontAwesome)',
          defaultValue: 'fas fa-bolt',
        },
        {
          name: 'heroFloatCard1Text',
          type: 'text',
          label: 'Float Card 1 Text',
          defaultValue: 'Reliable',
        },
        {
          name: 'heroFloatCard2Icon',
          type: 'text',
          label: 'Float Card 2 Icon Class (FontAwesome)',
          defaultValue: 'fas fa-brain',
        },
        {
          name: 'heroFloatCard2Text',
          type: 'text',
          label: 'Float Card 2 Text',
          defaultValue: 'AI experiments',
        },
      ],
    },



    // ── CONTACT SECTION ──────────────────────────────────
    {
      type: 'collapsible',
      label: 'Contact Section',
      fields: [
        {
          name: 'contactTitle',
          type: 'text',
          label: 'Title',
          defaultValue: 'Interested in collaborating?',
        },
        {
          name: 'contactSubtitle',
          type: 'textarea',
          label: 'Description',
          defaultValue: 'Open to practical collaborations, small R&D efforts, and project work.',
        },
        {
          name: 'contactEmail',
          type: 'text',
          label: 'Email',
          defaultValue: 'kabyaghosh4@gmail.com',
        },
        {
          name: 'contactPhone',
          type: 'text',
          label: 'Phone Number',
          defaultValue: '+880 1950-440296',
        },
        {
          name: 'githubUrl',
          type: 'text',
          label: 'GitHub URL',
        },
        {
          name: 'linkedinUrl',
          type: 'text',
          label: 'LinkedIn URL (Optional)',
        },
        {
          name: 'facebookUrl',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'youtubeUrl',
          type: 'text',
          label: 'YouTube URL',
        },
      ],
    },



    // ── CHATBOT ──────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Chatbot',
      fields: [
        {
          name: 'botWelcomeMessage',
          type: 'textarea',
          defaultValue: 'Hello — ask me about projects, skills, or how to get in touch.',
        },
      ],
    },
  ],
}

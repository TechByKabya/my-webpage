import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Homepage Settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Site Settings',
  },
  fields: [
    // ── HERO SECTION ──────────────────────────────────────
    {
      type: 'collapsible',
      label: '🎯 Hero Section (Top of the page)',
      fields: [
        {
          name: 'heroBadgeText',
          type: 'text',
          label: 'Badge Text (the small pill at the top)',
          defaultValue: 'Open to opportunities',
        },
        {
          name: 'heroTitle',
          type: 'text',
          label: 'Your Name / Main Title',
          defaultValue: 'Hi, I\'m a Full-Stack Developer',
          required: true,
        },
        {
          name: 'heroSubtitle',
          type: 'textarea',
          label: 'Subtitle / Description',
          defaultValue: 'I build beautiful, fast, and scalable web applications.',
        },
        {
          name: 'heroPhoto',
          type: 'upload',
          relationTo: 'media',
          label: 'Profile Photo (shows as circular avatar)',
        },
        {
          name: 'heroPrimaryButtonText',
          type: 'text',
          label: 'Primary Button Text',
          defaultValue: 'View My Work',
        },
        {
          name: 'heroSecondaryButtonText',
          type: 'text',
          label: 'Secondary Button Text',
          defaultValue: 'Get In Touch',
        },
      ],
    },

    // ── SKILLS SECTION ───────────────────────────────────
    {
      type: 'collapsible',
      label: '💡 Skills Section',
      fields: [
        {
          name: 'skillsSectionTitle',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'My Skills',
        },
        {
          name: 'skills',
          type: 'array',
          label: 'Skills (add as many as you want)',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Skill Name (e.g. React, Python, Figma)',
              required: true,
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Emoji Icon (e.g. ⚛️ 🐍 🎨)',
            },
          ],
        },
      ],
    },

    // ── PROJECTS SECTION ─────────────────────────────────
    {
      type: 'collapsible',
      label: '🚀 Projects Section',
      fields: [
        {
          name: 'projectsSectionTitle',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Featured Projects',
        },
        {
          name: 'projectsSectionSubtitle',
          type: 'text',
          label: 'Section Subtitle',
          defaultValue: 'A selection of my best work.',
        },
      ],
    },

    // ── BLOG SECTION ─────────────────────────────────────
    {
      type: 'collapsible',
      label: '📝 Blog Section',
      fields: [
        {
          name: 'blogSectionTitle',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Latest Thoughts',
        },
        {
          name: 'blogSectionSubtitle',
          type: 'text',
          label: 'Section Subtitle',
          defaultValue: 'Insights and articles on development, design, and tech.',
        },
      ],
    },

    // ── CONTACT SECTION ──────────────────────────────────
    {
      type: 'collapsible',
      label: '📬 Contact Section',
      fields: [
        {
          name: 'contactTitle',
          type: 'text',
          label: 'Contact Section Title',
          defaultValue: "Let's Work Together",
        },
        {
          name: 'contactSubtitle',
          type: 'textarea',
          label: 'Contact Section Description',
          defaultValue: "Have a project in mind? I'd love to hear about it.",
        },
        {
          name: 'contactEmail',
          type: 'email',
          label: 'Your Email Address (for the contact button)',
          required: true,
        },
        {
          name: 'contactButtonText',
          type: 'text',
          label: 'Contact Button Text',
          defaultValue: 'Say Hello 👋',
        },
      ],
    },

    // ── SOCIAL LINKS ─────────────────────────────────────
    {
      type: 'collapsible',
      label: '🔗 Social Links',
      fields: [
        {
          name: 'githubUrl',
          type: 'text',
          label: 'GitHub URL',
        },
        {
          name: 'linkedinUrl',
          type: 'text',
          label: 'LinkedIn URL',
        },
        {
          name: 'twitterUrl',
          type: 'text',
          label: 'Twitter / X URL',
        },
      ],
    },
  ],
}

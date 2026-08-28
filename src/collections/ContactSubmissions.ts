import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact Submission',
    plural: 'Contact Submissions',
  },
  admin: {
    hidden: () => true,
    group: '\u200B\u200BContact',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'createdAt'],
    description: 'Messages submitted through the contact form on the website.',
  },
  access: {
    create: anyone,       // Public can submit
    read: authenticated,  // Only admins can view
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subject',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      options: [
        { label: '🔵 New', value: 'new' },
        { label: '👀 Read', value: 'read' },
        { label: '✅ Replied', value: 'replied' },
        { label: '🗑️ Archived', value: 'archived' },
      ],
    },
  ],
  timestamps: true,
}

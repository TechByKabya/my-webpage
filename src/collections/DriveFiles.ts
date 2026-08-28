import type { CollectionConfig } from 'payload'

export const DriveFiles: CollectionConfig = {
  slug: 'drive-files',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'fileType', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'File Name',
    },
    {
      name: 'fileType',
      type: 'select',
      required: true,
      options: [
        { label: 'PDF', value: 'pdf' },
        { label: 'PowerPoint', value: 'pptx' },
        { label: 'Code', value: 'code' },
        { label: 'Text', value: 'txt' },
        { label: 'Other', value: 'other' },
      ],
      label: 'File Type',
    },
    {
      name: 'gDriveLink',
      type: 'text',
      required: true,
      label: 'Google Drive Link',
      admin: {
        description: 'Paste the Google Drive share link here (e.g., https://drive.google.com/file/d/.../view)',
      },
    },
  ],
}

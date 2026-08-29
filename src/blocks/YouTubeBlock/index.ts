import type { Block } from 'payload'

export const YouTubeBlock: Block = {
  slug: 'youtubeBlock',
  labels: {
    singular: 'YouTube Embed',
    plural: 'YouTube Embeds',
  },
  fields: [
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube Video URL',
      required: true,
      admin: {
        description: 'Paste a YouTube video link (e.g. https://www.youtube.com/watch?v=...)',
      },
    },
  ],
}

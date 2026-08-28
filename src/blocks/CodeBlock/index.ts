import type { Block } from 'payload'

export const CodeBlock: Block = {
  slug: 'codeBlock',
  labels: {
    singular: 'Code Snippet',
    plural: 'Code Snippets',
  },
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'JSON', value: 'json' },
        { label: 'Bash', value: 'bash' },
        { label: 'Python', value: 'python' },
        { label: 'C++', value: 'cpp' },
        { label: 'Markdown', value: 'markdown' },
      ],
      required: true,
      admin: {
        width: '50%',
      },
    },
    {
      name: 'code',
      type: 'code',
      required: true,
      admin: {
        language: 'typescript', // default editor language in admin UI
      },
    },
  ],
}

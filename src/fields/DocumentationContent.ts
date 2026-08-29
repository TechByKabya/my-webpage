import {
  BlocksFeature,
  HeadingFeature,
  BlockquoteFeature,
  OrderedListFeature,
  UnorderedListFeature,
  UploadFeature,
  HorizontalRuleFeature,
  AlignFeature,
  InlineCodeFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { CodeBlock } from '../blocks/CodeBlock'
import { YouTubeBlock } from '../blocks/YouTubeBlock'

export const documentationEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BlockquoteFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    UploadFeature({
      collections: {
        media: {
          fields: [
            {
              name: 'caption',
              type: 'text',
              label: 'Caption (Optional)',
            },
          ],
        },
      },
    }),
    HorizontalRuleFeature(),
    AlignFeature(),
    InlineCodeFeature(),
    BlocksFeature({
      blocks: [CodeBlock, YouTubeBlock],
    }),
  ],
})

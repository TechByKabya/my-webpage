import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const generateTitle: GenerateTitle<any> = ({ doc, collectionSlug }) => {
  if (doc?.title) {
    return `${doc.title} | Kabya Ghosh`
  }
  return 'Kabya Ghosh'
}

const generateDescription: any = ({ doc, collectionSlug }: any) => {
  if (collectionSlug === 'blogs' || collectionSlug === 'projects') {
    return doc?.excerpt || doc?.description || ''
  }
  return ''
}

const generateImage: any = ({ doc, collectionSlug }: any) => {
  if ((collectionSlug === 'blogs' || collectionSlug === 'projects') && doc?.coverImage) {
    return doc.coverImage
  }
  return null
}

const generateURL: GenerateURL<any> = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()

  if (collectionSlug === 'blogs' && doc?.slug) return `${url}/blogs/${doc.slug}`
  if (collectionSlug === 'projects' && doc?.slug) return `${url}/projects/${doc.slug}`
  
  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  vercelBlobStorage({
    enabled: true,
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      admin: {
        hidden: () => true,
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    collections: ['pages', 'blogs', 'projects'],
    generateTitle,
    generateDescription,
    generateImage,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      admin: {
        hidden: () => true,
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      admin: {
        hidden: () => true,
      },
    },
  }),
]

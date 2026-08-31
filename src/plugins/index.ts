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

import { generateObject } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'

const getGoogleAI = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) return null
  return createGoogleGenerativeAI({ apiKey })
}

const generateTitle: GenerateTitle<any> = async ({ doc, collectionSlug }) => {
  const title = doc?.title || ''
  if (!title) return 'Kabya Ghosh'
  
  const google = getGoogleAI()
  if (google) {
    try {
      const { object } = await generateObject({
        model: google('gemini-3.6-flash'),
        schema: z.object({ title: z.string() }),
        prompt: `Create a highly engaging, click-worthy SEO meta title for this post: "${title}". 
        CRITICAL RULES:
        1. MUST be strictly under 50 characters long.
        2. DO NOT append site names like "| Kabya Ghosh". Just the core title.`,
      })
      
      let cleanTitle = object.title.replace(/\|.*/, '').replace(/- Kabya.*/, '').trim()
      if (cleanTitle.length > 55) {
        cleanTitle = cleanTitle.substring(0, 55).trim()
      }
      return cleanTitle
    } catch (e) {
      // fallback
    }
  }
  return `${title} | Kabya Ghosh`
}

const generateDescription: any = async ({ doc, collectionSlug }: any) => {
  const title = doc?.title || ''
  const excerpt = doc?.excerpt || ''
  
  if (collectionSlug === 'blogs' || collectionSlug === 'projects') {
    const google = getGoogleAI()
    if (google && title) {
      try {
        const { object } = await generateObject({
          model: google('gemini-3.6-flash'),
          schema: z.object({ description: z.string() }),
          prompt: `Generate an SEO meta description (aim for 120-150 chars, max 160) for this post titled "${title}". Excerpt: "${excerpt}". Return it without quotes.`,
        })
        return object.description
      } catch (e) {
        // fallback
      }
    }
    return excerpt || doc?.description || ''
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
    tabbedUI: true,
    generateTitle,
    generateDescription,
    generateImage,
    generateURL,
    fields: ({ defaultFields }) => [
      {
        name: 'aiBanner',
        type: 'ui',
        admin: {
          components: {
            Field: '@/components/Admin/AIAutomationBanner#AIAutomationBanner',
          },
        },
      },
      {
        name: 'seoScoreGauge',
        type: 'ui',
        admin: {
          components: {
            Field: '@/components/Admin/SEOScoreGauge#SEOScoreGauge',
          },
        },
      },
      ...defaultFields,
      {
        name: 'socialPreview',
        type: 'ui',
        admin: {
          components: {
            Field: '@/components/Admin/SocialPreview#SocialPreview',
          },
        },
      },
    ],
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

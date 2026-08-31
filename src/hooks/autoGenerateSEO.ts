import type { CollectionBeforeChangeHook } from 'payload'
import { generateObject } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'

export const autoGenerateSEO: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  // Only auto-generate on create or update
  if (operation !== 'create' && operation !== 'update') {
    return data
  }

  // Ensure data.meta exists
  if (!data.meta) {
    data.meta = {}
  }

  // If both title and description already exist, skip generation
  if (data.meta.title && data.meta.description) {
    return data
  }

  // We need a source title to generate from
  const sourceTitle = data.title
  if (!sourceTitle) {
    return data
  }

  // Ensure API key is present
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    req.payload.logger.warn('GOOGLE_GENERATIVE_AI_API_KEY is not set. Skipping AI SEO generation.')
    return data
  }

  const google = createGoogleGenerativeAI({
    apiKey,
  })

  // Combine title and excerpt for context
  const excerpt = data.excerpt || ''
  
  const prompt = `
    You are an expert SEO copywriter.
    I am writing a technical blog post or project page.
    Title: "${sourceTitle}"
    Excerpt: "${excerpt}"
    
    Please generate an SEO-optimized Meta Title (maximum 60 characters) and a Meta Description (maximum 160 characters).
    Make them catchy, professional, and relevant to the provided text. Do not include quotes in the generated text.
  `

  try {
    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: z.object({
        title: z.string().describe('The SEO meta title. Aim for 50 chars.'),
        description: z.string().describe('The SEO meta description. Aim for 120-150 chars.'),
      }),
      prompt,
    })

    // Populate missing fields with generated content
    if (!data.meta.title) {
      data.meta.title = object.title
    }
    if (!data.meta.description) {
      data.meta.description = object.description
    }
    
    req.payload.logger.info(`Auto-generated SEO for "${sourceTitle}"`)
  } catch (error) {
    req.payload.logger.error(`Failed to auto-generate SEO for "${sourceTitle}": ${error}`)
  }

  return data
}

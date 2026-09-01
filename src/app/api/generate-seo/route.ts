import { NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const { title, excerpt } = await req.json()
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    if (!title && !excerpt) {
      return NextResponse.json({ error: 'Please provide at least a title or excerpt to generate SEO.' }, { status: 400 })
    }

    const google = createGoogleGenerativeAI({ apiKey })

    const { object } = await generateObject({
      model: google('gemini-flash-lite-latest'),
      schema: z.object({
        seoTitle: z.string().describe('An engaging SEO title between 50-60 characters'),
        seoDescription: z.string().describe('An SEO meta description between 120-160 characters'),
      }),
      prompt: `You are an expert SEO copywriter. Generate an optimized SEO Title and SEO Meta Description for a blog post based on the following input.
      
Input Title: ${title || 'None provided'}
Input Excerpt: ${excerpt || 'None provided'}`
    })

    return NextResponse.json(object)

  } catch (error: any) {
    console.error('SEO Generation error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

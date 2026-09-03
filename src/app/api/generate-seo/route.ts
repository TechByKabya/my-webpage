import { NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

// Rate limit: max 10 SEO generations per IP per hour (admin-only feature)
const rateLimit = new Map<string, { count: number; time: number }>()

function pruneRateLimit(windowMs: number) {
  const now = Date.now()
  for (const [key, data] of rateLimit.entries()) {
    if (now - data.time >= windowMs) {
      rateLimit.delete(key)
    }
  }
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const now = Date.now()
    const windowMs = 60 * 60 * 1000 // 1 hour

    pruneRateLimit(windowMs)

    if (rateLimit.has(ip)) {
      const data = rateLimit.get(ip)!
      if (now - data.time < windowMs) {
        if (data.count >= 10) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Max 10 SEO generations per hour.' },
            { status: 429 },
          )
        }
        data.count++
      } else {
        rateLimit.set(ip, { count: 1, time: now })
      }
    } else {
      rateLimit.set(ip, { count: 1, time: now })
    }

    const { title, excerpt } = await req.json()
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    if (!title && !excerpt) {
      return NextResponse.json(
        { error: 'Please provide at least a title or excerpt to generate SEO.' },
        { status: 400 },
      )
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
Input Excerpt: ${excerpt || 'None provided'}`,
    })

    return NextResponse.json(object)
  } catch (error: any) {
    console.error('SEO Generation error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

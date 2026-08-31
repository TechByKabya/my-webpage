import { generateObject } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
})

async function test() {
  console.log("Key:", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0, 10) + "...")
  try {
    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: z.object({ title: z.string() }),
      prompt: `Generate an SEO meta title (max 50 chars) for this post titled "Why the ESP32 is the Undisputed King of Modern IoT Development". Return it without quotes and without any suffixes.`,
    })
    console.log("Success flash:", object)
  } catch (e: any) {
    console.error("Error pro:", e.message)
  }
}

test()

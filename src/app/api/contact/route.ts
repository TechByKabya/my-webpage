import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const rateLimit = new Map<string, { count: number; time: number }>()

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowMs = 60 * 60 * 1000 // 1 hour

    if (rateLimit.has(ip)) {
      const data = rateLimit.get(ip)!
      if (now - data.time < windowMs) {
        if (data.count >= 5) {
          return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
        }
        data.count++
      } else {
        rateLimit.set(ip, { count: 1, time: now })
      }
    } else {
      rateLimit.set(ip, { count: 1, time: now })
    }

    const body = await req.json()
    const { name, email, subject, message, website } = body

    // Honeypot check - if a bot fills this hidden field, silently reject
    if (website) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'contact-submissions',
      data: { name, email, subject, message, status: 'new' },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

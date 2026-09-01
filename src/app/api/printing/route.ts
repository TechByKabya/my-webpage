import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const rateLimit = new Map<string, { count: number; time: number }>();

function pruneRateLimit(windowMs: number) {
  const now = Date.now();
  for (const [key, data] of rateLimit.entries()) {
    if (now - data.time >= windowMs) {
      rateLimit.delete(key);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minutes
    
    pruneRateLimit(windowMs);

    if (rateLimit.has(ip)) {
      const data = rateLimit.get(ip)!;
      if (now - data.time < windowMs) {
        if (data.count >= 2) { // Max 2 requests per 5 minutes to prevent spam/email abuse
          return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
        }
        data.count++;
      } else {
        rateLimit.set(ip, { count: 1, time: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, time: now });
    }

    const body = await req.json()
    
    // Validate required fields roughly
    if (!body.name || !body.email || !body.address || !body.orderType || !body.material || !body.color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise })
    
    const result = await payload.create({
      collection: 'printing-requests',
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        orderType: body.orderType,
        fileLink: body.fileLink,
        ideaDescription: body.ideaDescription,
        material: body.material,
        color: body.color,
        infill: body.infill,
        layerHeight: body.layerHeight,
        notes: body.notes,
      },
    })

    return NextResponse.json({ success: true, doc: result }, { status: 201 })
  } catch (error) {
    console.error('Printing Request error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

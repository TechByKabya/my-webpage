import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { setDriveAuthCookie } from '@/utilities/driveAuth'

const rateLimit = new Map<string, { count: number; time: number }>();

function pruneRateLimit(windowMs: number) {
  const now = Date.now();
  for (const [key, data] of rateLimit.entries()) {
    if (now - data.time >= windowMs) {
      rateLimit.delete(key);
    }
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minutes
    
    pruneRateLimit(windowMs);

    if (rateLimit.has(ip)) {
      const data = rateLimit.get(ip)!;
      if (now - data.time < windowMs) {
        if (data.count >= 5) { // Max 5 login attempts per 5 minutes per IP
          return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
        }
        data.count++;
      } else {
        rateLimit.set(ip, { count: 1, time: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, time: now });
    }

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const settings = await payload.findGlobal({ slug: 'drive-settings' })

    if (
      settings &&
      settings.driveUsername === username &&
      settings.drivePassword === password
    ) {
      await setDriveAuthCookie()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

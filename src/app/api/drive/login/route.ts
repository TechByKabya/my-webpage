import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { setDriveAuthCookie } from '@/utilities/driveAuth'

export async function POST(request: Request) {
  try {
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

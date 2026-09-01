import crypto from 'crypto'
import { cookies } from 'next/headers'

// Use PAYLOAD_SECRET for signing, or a fallback if not set.
const getSecret = () => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is missing. Cannot sign drive auth cookie.');
  }
  return process.env.PAYLOAD_SECRET;
}

export const signDriveCookie = (payload: string): string => {
  const hmac = crypto.createHmac('sha256', getSecret())
  hmac.update(payload)
  const signature = hmac.digest('hex')
  return `${payload}.${signature}`
}

export const verifyDriveCookie = (cookieValue: string): boolean => {
  const parts = cookieValue.split('.')
  if (parts.length !== 2) return false
  const [payload, signature] = parts
  
  const expectedSignature = signDriveCookie(payload).split('.')[1]
  // Use timingSafeEqual to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex'),
    )
  } catch {
    return false
  }
}

export const setDriveAuthCookie = async () => {
  const cookieStore = await cookies()
  // No expires / maxAge = session cookie → browser clears it when all tabs are closed
  const value = signDriveCookie(Date.now().toString())

  cookieStore.set('drive_auth', value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    // deliberately omitting `expires` and `maxAge` to create a session cookie
    path: '/',
  })
}

export const checkDriveAuth = async (): Promise<boolean> => {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('drive_auth')
  if (!authCookie) return false
  
  return verifyDriveCookie(authCookie.value)
}

export const clearDriveAuthCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('drive_auth')
}

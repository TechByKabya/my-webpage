import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { checkDriveAuth } from '@/utilities/driveAuth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await checkDriveAuth()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const payload = await getPayload({ config: configPromise })
    const fileRecord = await payload.findByID({
      collection: 'drive-files',
      id: id,
    })

    if (!fileRecord || !fileRecord.gDriveLink) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Extract the Google Drive ID from the link
    // Handles formats like:
    // https://drive.google.com/file/d/1Babc.../view
    // https://drive.google.com/open?id=1Babc...
    let driveId = ''
    const url = fileRecord.gDriveLink
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
    if (match && match[1]) {
      driveId = match[1]
    } else {
      const urlObj = new URL(url)
      driveId = urlObj.searchParams.get('id') || ''
    }

    if (!driveId) {
      // If we couldn't parse the ID, just fallback to the original link
      return NextResponse.redirect(url)
    }

    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`
    return NextResponse.redirect(directDownloadUrl)

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

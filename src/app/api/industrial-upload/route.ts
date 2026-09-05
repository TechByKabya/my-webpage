import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers()
    const payload = await getPayload({ config: configPromise })

    // Verify authenticated user
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged into the admin panel to upload assets.' },
        { status: 401 },
      )
    }

    const formData = await req.formData()
    const projectId = formData.get('projectId') as string | null

    // Accept either 'files' or 'file'
    const rawFiles = formData.getAll('files').concat(formData.getAll('file'))
    const files = rawFiles.filter((f): f is File => typeof f === 'object' && f !== null && 'arrayBuffer' in f)

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided in upload request.' },
        { status: 400 },
      )
    }

    const uploadedDocs: Array<{
      id: string | number
      filename: string
      originalName: string
      alt: string
      url: string
    }> = []

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const doc = await payload.create({
        collection: 'media',
        data: {
          alt: file.name,
        },
        file: {
          data: buffer,
          name: file.name,
          mimetype: file.type || 'image/png',
          size: file.size,
        },
      })

      if (doc) {
        uploadedDocs.push({
          id: doc.id,
          filename: doc.filename || file.name,
          originalName: file.name,
          alt: file.name,
          url: doc.url || '',
        })
      }
    }

    // If projectId is provided, attach newly uploaded assets directly to the project
    if (projectId && uploadedDocs.length > 0) {
      try {
        const existingProject = await payload.findByID({
          collection: 'industrial-projects',
          id: projectId,
          depth: 0,
        })

        if (existingProject) {
          const currentAssets = Array.isArray(existingProject.assets) ? [...existingProject.assets] : []
          uploadedDocs.forEach((u) => {
            currentAssets.push({
              file: Number(u.id),
              customAlias: u.originalName,
            })
          })

          await payload.update({
            collection: 'industrial-projects',
            id: projectId,
            data: {
              assets: currentAssets,
            },
          })
        }
      } catch (attachErr) {
        console.warn('Could not auto-attach uploaded assets to project:', attachErr)
      }
    }

    return NextResponse.json({
      success: true,
      count: uploadedDocs.length,
      uploaded: uploadedDocs,
    })
  } catch (error: any) {
    console.error('Error in industrial-upload route:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to upload assets.' },
      { status: 500 },
    )
  }
}

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { checkDriveAuth } from '@/utilities/driveAuth'
import { DriveLogin } from '@/components/Frontend/DriveLogin'
import { DriveBrowser, DriveFile } from '@/components/Frontend/DriveBrowser'

export const metadata = {
  title: 'Secure Drive',
}

// Never cache this page — auth state must be checked live on every request
export const dynamic = 'force-dynamic'

export default async function DrivePage() {
  const isAuth = await checkDriveAuth()

  if (!isAuth) {
    return <DriveLogin />
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'drive-files',
    sort: '-createdAt',
    limit: 100,
  })

  const files: DriveFile[] = result.docs.map((doc) => ({
    id: String(doc.id),
    name: doc.name,
    fileType: doc.fileType as any,
    createdAt: doc.createdAt,
  }))

  return <DriveBrowser files={files} />
}

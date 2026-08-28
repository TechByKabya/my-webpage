import React from 'react'
import type { Metadata } from 'next'
import { PrintingOrderForm } from '@/components/Frontend/PrintingOrderForm'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const metadata: Metadata = {
  title: '3D Printing Service | Kabya Ghosh',
  description: 'Request a custom 3D printing service from Kabya Ghosh. Premium, high-quality prints shipped to you.',
}

export default async function PrintingServicePage() {
  const payload = await getPayload({ config: configPromise })
  
  let materials = [{ name: 'PLA' }]
  let colors = [{ name: 'Black' }, { name: 'White' }]
  
  try {
    const settings = await payload.findGlobal({ slug: 'printing-settings' })
    // @ts-ignore
    if (settings.materials?.length) materials = settings.materials
    // @ts-ignore
    if (settings.colors?.length) colors = settings.colors
  } catch (e) {
    console.error("Failed to fetch printing settings", e)
  }

  const availableMaterials = materials.map((m: any) => m.name || m)
  const availableColors = colors.map((c: any) => c.name || c)

  return (
    <>
      <style>{`
        header#main-nav { display: none !important; }
        body { overflow: hidden !important; }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <PrintingOrderForm 
            availableMaterials={availableMaterials}
            availableColors={availableColors}
          />
        </main>
      </div>
    </>
  )
}


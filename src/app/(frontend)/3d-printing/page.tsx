export const maxDuration = 30
import React from 'react'
import type { Metadata } from 'next'
import { PrintingOrderForm } from '@/components/Frontend/PrintingOrderForm'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const metadata: Metadata = {
  title: 'Low Cost 3D Printing Service in BD | Near Daffodil, Dhaka',
  description: 'Premium, low cost 3D printing service in Dhaka, BD. Fast delivery, precision prints, serving students and professionals near Daffodil International University and all of Bangladesh.',
  keywords: ['3D printing service in bd', 'low cost printing service in dhaka', '3d printing service near daffodil', '3D print BD', 'Rapid Prototyping Bangladesh', 'Kabya Ghosh'],
  openGraph: {
    title: 'Low Cost 3D Printing Service in BD | Near Daffodil, Dhaka',
    description: 'Premium, low cost 3D printing service in Dhaka, BD. Fast delivery, precision prints, serving students and professionals near Daffodil and all of Bangladesh.',
    url: 'https://www.kabyac.tech/3d-printing',
    siteName: 'Kabya Ghosh',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.kabyac.tech/3d-printing',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Kabya Ghosh 3D Printing Service',
    image: 'https://www.kabyac.tech/kabya.jpeg',
    description: 'Low cost 3D printing service in Dhaka, BD. Fast delivery and precision prints near Daffodil.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressRegion: 'Dhaka',
      addressCountry: 'BD'
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Dhaka'
      },
      {
        '@type': 'Country',
        name: 'Bangladesh'
      },
      {
        '@type': 'Place',
        name: 'Daffodil International University (DIU)'
      }
    ],
    url: 'https://www.kabyac.tech/3d-printing',
    priceRange: '৳৳',
    telephone: '+880', // Keeping generic to pass validation if exact phone isn't public
    offers: {
      '@type': 'Offer',
      url: 'https://www.kabyac.tech/3d-printing',
      priceCurrency: 'BDT',
      price: '150', // Base price indicator
      availability: 'https://schema.org/InStock',
      itemOffered: {
        '@type': 'Service',
        name: 'Custom 3D Printing'
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        header#main-nav { display: none !important; }
        body { overflow: hidden !important; }
        @media (max-width: 768px) {
          body { overflow: auto !important; }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
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


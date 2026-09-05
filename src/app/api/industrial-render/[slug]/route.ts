import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    if (!slug) {
      return new NextResponse('Missing project slug', { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const { docs } = await payload.find({
      collection: 'industrial-projects',
      where: {
        slug: { equals: slug },
        visibility: { not_equals: 'private' },
      },
      limit: 1,
      depth: 1,
    })

    if (!docs || docs.length === 0) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Not Found | Kabya Ghosh</title>
  <style>
    body {
      margin: 0;
      background: #090a0f;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .box {
      max-width: 480px;
      padding: 40px 24px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      background: rgba(255,255,255,0.03);
    }
    h1 { font-size: 1.8rem; margin-bottom: 12px; color: #38bdf8; }
    p { color: #94a3b8; line-height: 1.6; margin-bottom: 24px; }
    a {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 8px;
      background: #0284c7;
      color: #fff;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="box">
    <h1>Project Not Found</h1>
    <p>This industrial project is currently private or does not exist.</p>
    <a href="/industrial">Return to Industrial Solutions</a>
  </div>
</body>
</html>`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      )
    }

    const project = docs[0]
    let htmlContent = (project.htmlCode as string) || ''

    // If it lacks basic DOCTYPE/HTML wrapper, wrap it
    if (!htmlContent.includes('<html') && !htmlContent.includes('<!DOCTYPE')) {
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title || 'Industrial Solution'}</title>
</head>
<body>
${htmlContent}
</body>
</html>`
    } else if (!htmlContent.includes('name="viewport"')) {
      // Ensure viewport meta tag exists for mobile responsiveness
      htmlContent = htmlContent.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
    }

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
        'X-Robots-Tag': 'noindex', // Official indexable route is /industrial/[slug]
      },
    })
  } catch (error) {
    console.error('Error rendering industrial project HTML:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

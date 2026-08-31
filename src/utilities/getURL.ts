import canUseDOM from './canUseDOM'

export const getServerSideURL = () => {
  // On Vercel production, always use the canonical domain first
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://www.kabyac.tech'
  }
  // On preview/staging deployments, use the Vercel-assigned URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  // Local development fallback
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }
  return 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }

  if (process.env.VERCEL_ENV === 'production') {
    return 'https://www.kabyac.tech'
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return ''
}

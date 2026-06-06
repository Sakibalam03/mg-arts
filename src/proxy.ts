import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CMS_HOSTNAME = 'cms.rdpdc.in'

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') ?? ''
  const pathname = request.nextUrl.pathname

  if (hostname === CMS_HOSTNAME) {
    // Pass through Next.js internals and Payload API — these are not admin UI routes
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon')
    ) {
      return NextResponse.next()
    }

    // Payload redirects internally to /cms/... — strip the prefix so the
    // subdomain URL stays clean (e.g. /cms/login → /login on cms.mgarts.co.in)
    if (pathname.startsWith('/cms')) {
      return NextResponse.redirect(new URL(pathname.slice(4) || '/', request.url))
    }

    // All other paths on the CMS subdomain → rewrite to /cms prefix
    return NextResponse.rewrite(new URL(`/cms${pathname}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

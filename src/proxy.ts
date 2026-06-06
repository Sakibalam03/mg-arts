import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

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

  // Auth route protection — lightweight cookie check, no DB call
  const sessionCookie = getSessionCookie(request)

  if (pathname.startsWith('/dashboard')) {
    if (!sessionCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url, 307)
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/auth')) {
    if (sessionCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      url.search = ''
      return NextResponse.redirect(url, 307)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

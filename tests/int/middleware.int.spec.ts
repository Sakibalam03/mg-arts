import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('better-auth/cookies', () => ({
  getSessionCookie: vi.fn(),
}))

const { proxy } = await import('@/proxy')
const { getSessionCookie } = await import('better-auth/cookies')

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('/dashboard/* protection', () => {
    it('redirects unauthenticated request to /auth with next param', async () => {
      vi.mocked(getSessionCookie).mockReturnValue(undefined)
      const req = new NextRequest('http://localhost:3000/dashboard')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe('http://localhost:3000/auth?next=%2Fdashboard')
    })

    it('allows authenticated request to /dashboard', async () => {
      vi.mocked(getSessionCookie).mockReturnValue('session-token-value')
      const req = new NextRequest('http://localhost:3000/dashboard')
      const res = proxy(req)
      expect(res.status).not.toBe(307)
    })

    it('redirects unauthenticated /dashboard/projects to /auth with next param', async () => {
      vi.mocked(getSessionCookie).mockReturnValue(undefined)
      const req = new NextRequest('http://localhost:3000/dashboard/projects')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/auth?next=')
      expect(res.headers.get('location')).toContain('dashboard')
    })
  })

  describe('/auth/* handling', () => {
    it('allows unauthenticated request to /auth', async () => {
      vi.mocked(getSessionCookie).mockReturnValue(undefined)
      const req = new NextRequest('http://localhost:3000/auth')
      const res = proxy(req)
      expect(res.status).not.toBe(307)
    })

    it('redirects authenticated request from /auth to /dashboard', async () => {
      vi.mocked(getSessionCookie).mockReturnValue('session-token-value')
      const req = new NextRequest('http://localhost:3000/auth')
      const res = proxy(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard')
    })

    it('allows unauthenticated request to /auth/verify', async () => {
      vi.mocked(getSessionCookie).mockReturnValue(undefined)
      const req = new NextRequest('http://localhost:3000/auth/verify')
      const res = proxy(req)
      expect(res.status).not.toBe(307)
    })
  })

  describe('public routes', () => {
    it('allows unauthenticated request to /', async () => {
      vi.mocked(getSessionCookie).mockReturnValue(undefined)
      const req = new NextRequest('http://localhost:3000/')
      const res = proxy(req)
      expect(res.status).not.toBe(307)
    })

    it('does not intercept /cms routes', async () => {
      vi.mocked(getSessionCookie).mockReturnValue(undefined)
      const req = new NextRequest('http://localhost:3000/cms')
      const res = proxy(req)
      expect(res.status).not.toBe(307)
    })

    it('does not intercept /api/auth routes', async () => {
      vi.mocked(getSessionCookie).mockReturnValue(undefined)
      const req = new NextRequest('http://localhost:3000/api/auth/sign-in')
      const res = proxy(req)
      expect(res.status).not.toBe(307)
    })
  })
})

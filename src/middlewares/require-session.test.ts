import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/data-access/_shared/auth-storage'
import { requireSession } from './require-session'

const ORIGIN = 'http://localhost:3002'

function buildRequest(pathname: string, sessionRole: string | null = null): NextRequest {
  const request = new NextRequest(new URL(pathname, ORIGIN))
  if (sessionRole !== null) request.cookies.set(SESSION_COOKIE_NAME, sessionRole)
  return request
}

function redirectTarget(pathname: string, sessionRole: string | null = null): string | null {
  return requireSession(buildRequest(pathname, sessionRole))?.headers.get('location') ?? null
}

describe('requireSession', () => {
  it('lets guests through the public and auth pages', () => {
    expect(requireSession(buildRequest('/'))).toBeNull()
    expect(requireSession(buildRequest('/auth/login'))).toBeNull()
    expect(requireSession(buildRequest('/auth/verify-email'))).toBeNull()
    expect(requireSession(buildRequest('/auth/reset-password'))).toBeNull()
    expect(requireSession(buildRequest('/invites/accept'))).toBeNull()
  })

  it('redirects a guest from a signed-in page to the login page', () => {
    expect(redirectTarget('/lists')).toBe(`${ORIGIN}/auth/login`)
    expect(redirectTarget('/lists/42')).toBe(`${ORIGIN}/auth/login`)
  })

  it('does not treat a path that only shares the prefix as signed-in', () => {
    expect(requireSession(buildRequest('/listsomething'))).toBeNull()
  })

  it('rejects a session cookie holding an unknown role', () => {
    expect(redirectTarget('/lists', 'superadmin')).toBe(`${ORIGIN}/auth/login`)
  })

  it('lets a signed-in user reach the signed-in pages', () => {
    expect(requireSession(buildRequest('/lists', 'user'))).toBeNull()
  })

  it('sends a signed-in user away from the login page', () => {
    expect(redirectTarget('/auth/login', 'user')).toBe(`${ORIGIN}/lists`)
  })
})

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
    expect(requireSession(buildRequest('/browse'))).toBeNull()
    expect(requireSession(buildRequest('/auth/login'))).toBeNull()
    expect(requireSession(buildRequest('/auth/verify-email'))).toBeNull()
    expect(requireSession(buildRequest('/auth/reset-password'))).toBeNull()
    expect(requireSession(buildRequest('/invites/accept'))).toBeNull()
  })

  it('sends a guest from a signed-in page to the login page, remembering the page', () => {
    expect(redirectTarget('/lists')).toBe(`${ORIGIN}/auth/login?next=%2Flists`)
    expect(redirectTarget('/lists/42?tab=guests')).toBe(
      `${ORIGIN}/auth/login?next=%2Flists%2F42%3Ftab%3Dguests`,
    )
    expect(redirectTarget('/profile')).toBe(`${ORIGIN}/auth/login?next=%2Fprofile`)
  })

  it('does not treat a path that only shares the prefix as signed-in', () => {
    expect(requireSession(buildRequest('/listsomething'))).toBeNull()
  })

  it('rejects a session cookie holding an unknown role', () => {
    expect(redirectTarget('/lists', 'superadmin')).toBe(`${ORIGIN}/auth/login?next=%2Flists`)
  })

  it('lets a signed-in user reach the signed-in pages', () => {
    expect(requireSession(buildRequest('/lists', 'user'))).toBeNull()
  })

  it('sends a signed-in user away from the login page to my lists by default', () => {
    expect(redirectTarget('/auth/login', 'user')).toBe(`${ORIGIN}/lists`)
  })

  it('sends a signed-in user back to the page they asked for', () => {
    expect(redirectTarget('/auth/login?next=%2Flists%2F42%3Ftab%3Dguests', 'user')).toBe(
      `${ORIGIN}/lists/42?tab=guests`,
    )
  })

  it('ignores a return path pointing outside the app', () => {
    expect(redirectTarget('/auth/login?next=https%3A%2F%2Fevil.example', 'user')).toBe(
      `${ORIGIN}/lists`,
    )
    expect(redirectTarget('/auth/login?next=%2F%2Fevil.example', 'user')).toBe(`${ORIGIN}/lists`)
  })
})

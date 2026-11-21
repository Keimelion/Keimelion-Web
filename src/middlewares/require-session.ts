import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME, isKnownRole } from '@/data-access/_shared/auth-storage'
import { AppPaths, SIGNED_IN_PATH_PREFIXES } from '@/lib/app-paths'

function isSignedInPath(pathname: string): boolean {
  return SIGNED_IN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function requireSession(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl
  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const hasValidSession = cookieValue !== undefined && isKnownRole(cookieValue)

  if (pathname === AppPaths.LOGIN && hasValidSession) {
    return NextResponse.redirect(new URL(AppPaths.LISTS, request.url))
  }

  if (isSignedInPath(pathname) && !hasValidSession) {
    return NextResponse.redirect(new URL(AppPaths.LOGIN, request.url))
  }

  return null
}

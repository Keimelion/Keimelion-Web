import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME, isValidSessionCookie } from '@/data-access/_shared/auth-storage'
import {
  AppPaths,
  LOGIN_RETURN_PARAM,
  SIGNED_IN_PATH_PREFIXES,
  isPathWithin,
} from '@/lib/app-paths'
import { buildLoginPath, resolveLoginReturnPath } from '@/lib/login-return-path'

export function requireSession(request: NextRequest): NextResponse | null {
  const { pathname, search, searchParams } = request.nextUrl
  const hasValidSession = isValidSessionCookie(request.cookies.get(SESSION_COOKIE_NAME)?.value)

  if (isAccountEntryPath(pathname) && hasValidSession) {
    const returnPath = resolveLoginReturnPath(searchParams.get(LOGIN_RETURN_PARAM))
    return NextResponse.redirect(new URL(returnPath, request.url))
  }

  if (isSignedInPath(pathname) && !hasValidSession) {
    return NextResponse.redirect(new URL(buildLoginPath(`${pathname}${search}`), request.url))
  }

  return null
}

function isAccountEntryPath(pathname: string): boolean {
  return pathname === AppPaths.LOGIN || pathname === AppPaths.SIGNUP
}

function isSignedInPath(pathname: string): boolean {
  return SIGNED_IN_PATH_PREFIXES.some((prefix) => isPathWithin(pathname, prefix))
}

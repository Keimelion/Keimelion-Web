import { UserRoles } from '@keimelion/sdk/enums'
import { userDetailSchema } from '@keimelion/sdk/schemas'
import type { UserDetailParsed } from '@keimelion/sdk/schemas'

const ACCESS_TOKEN_KEY = 'keimelion_access_token'
const REFRESH_TOKEN_KEY = 'keimelion_refresh_token'
const STORED_USER_KEY = 'keimelion_user'
export const SESSION_COOKIE_NAME = 'keimelion_web_session'
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

const KNOWN_ROLES: readonly string[] = Object.values(UserRoles)

export function isKnownRole(role: string): boolean {
  return KNOWN_ROLES.includes(role)
}

function buildCookieFlags(): string {
  const secureFlag = window.location.protocol === 'https:' ? '; secure' : ''
  return `path=/; samesite=lax${secureFlag}`
}

function writeSessionCookie(role: string): void {
  document.cookie = `${SESSION_COOKIE_NAME}=${role}; ${buildCookieFlags()}; max-age=${String(SESSION_COOKIE_MAX_AGE_SECONDS)}`
}

function deleteSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=; ${buildCookieFlags()}; max-age=0`
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getStoredUser(): UserDetailParsed | null {
  const raw = localStorage.getItem(STORED_USER_KEY)
  if (!raw) return null

  try {
    const parsed = userDetailSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      clearSession()
      return null
    }
    return parsed.data
  } catch {
    clearSession()
    return null
  }
}

export function saveSession(
  accessToken: string,
  refreshToken: string,
  user: UserDetailParsed,
): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.setItem(STORED_USER_KEY, JSON.stringify(user))
  writeSessionCookie(user.role)
}

export function rotateTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(STORED_USER_KEY)
  deleteSessionCookie()
}

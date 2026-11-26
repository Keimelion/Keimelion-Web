import { UserRoles } from '@keimelion/sdk/enums'
import { userDetailSchema } from '@keimelion/sdk/schemas'
import type { UserDetailParsed } from '@keimelion/sdk/schemas'

const ACCESS_TOKEN_KEY = 'keimelion_access_token'
const REFRESH_TOKEN_KEY = 'keimelion_refresh_token'
const STORED_USER_KEY = 'keimelion_user'
const EMAIL_NOT_VERIFIED_KEY = 'keimelion_email_not_verified'
const ACCOUNT_BANNED_KEY = 'keimelion_account_banned'
const FLAG_SET_VALUE = 'true'
export const SESSION_COOKIE_NAME = 'keimelion_web_session'
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export const SessionStates = {
  ACTIVE: 'active',
  ACCOUNT_BANNED: 'account_banned',
  EMAIL_NOT_VERIFIED: 'email_not_verified',
  NONE: 'none',
} as const

export type SessionState = (typeof SessionStates)[keyof typeof SessionStates]

const KNOWN_ROLES: readonly string[] = Object.values(UserRoles)

interface ParsedUserCache {
  raw: string
  user: UserDetailParsed
}

let parsedUserCache: ParsedUserCache | null = null

export function isKnownRole(role: string): boolean {
  return KNOWN_ROLES.includes(role)
}

export function isValidSessionCookie(cookieValue: string | undefined): boolean {
  return cookieValue !== undefined && isKnownRole(cookieValue)
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

export function getSessionState(): SessionState {
  if (localStorage.getItem(ACCOUNT_BANNED_KEY) === FLAG_SET_VALUE) {
    return SessionStates.ACCOUNT_BANNED
  }
  if (getRefreshToken() === null) return SessionStates.NONE
  if (getEmailNotVerifiedAt() !== null) return SessionStates.EMAIL_NOT_VERIFIED
  return SessionStates.ACTIVE
}

export function getEmailNotVerifiedAt(): number | null {
  const markedAt = Number(localStorage.getItem(EMAIL_NOT_VERIFIED_KEY))
  if (!Number.isFinite(markedAt) || markedAt <= 0) return null
  return markedAt
}

export function markEmailNotVerified(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.setItem(EMAIL_NOT_VERIFIED_KEY, String(Date.now()))
}

export function markAccountBanned(): void {
  clearSession()
  localStorage.setItem(ACCOUNT_BANNED_KEY, FLAG_SET_VALUE)
}

export function getStoredUser(): UserDetailParsed | null {
  const raw = localStorage.getItem(STORED_USER_KEY)
  if (!raw) return null
  if (parsedUserCache?.raw === raw) return parsedUserCache.user

  try {
    const parsed = userDetailSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      clearSession()
      return null
    }
    parsedUserCache = { raw, user: parsed.data }
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
  localStorage.removeItem(EMAIL_NOT_VERIFIED_KEY)
  localStorage.removeItem(ACCOUNT_BANNED_KEY)
  writeSessionCookie(user.role)
}

export function rotateTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.removeItem(EMAIL_NOT_VERIFIED_KEY)
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(STORED_USER_KEY)
  localStorage.removeItem(EMAIL_NOT_VERIFIED_KEY)
  localStorage.removeItem(ACCOUNT_BANNED_KEY)
  deleteSessionCookie()
}

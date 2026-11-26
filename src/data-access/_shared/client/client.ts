import { ApiError, createClient } from '@keimelion/sdk/client'
import type { KeimelionClient } from '@keimelion/sdk/client'
import { ErrorCode, HttpStatus } from '@keimelion/sdk/enums'
import {
  SessionStates,
  clearSession,
  getAccessToken,
  getEmailNotVerifiedAt,
  getRefreshToken,
  getSessionState,
  markAccountBanned,
  markEmailNotVerified,
  rotateTokens,
} from '@/data-access/_shared/auth-storage'
import { buildLoginPathFromCurrentPage } from '@/lib/login-return-path'
import { useLocaleStore } from '@/lib/i18n/locale-store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''
const REQUEST_TIMEOUT_MS = 2 * 60 * 1000
const EMAIL_VERIFICATION_RECHECK_MS = 5 * 60 * 1000
const ACCEPT_LANGUAGE_HEADER = 'Accept-Language'
const NO_REFRESH_TOKEN_CODE = 'NO_REFRESH_TOKEN'
const REFRESH_FAILED_CODE = 'REFRESH_FAILED'
const EMAIL_NOT_VERIFIED_MESSAGE = 'Email address has not been verified'
const ACCOUNT_BANNED_MESSAGE = 'This account has been suspended'

let refreshPromise: Promise<string> | null = null

export const apiClient: KeimelionClient = createClient({
  baseUrl: API_BASE_URL,
  timeoutMs: REQUEST_TIMEOUT_MS,
  getToken: getAccessToken,
  fetch: fetchWithAppLocale,
  onUnauthorized: renewSession,
})

export function refreshAccessToken(): Promise<string> {
  refreshPromise ??= executeTokenRefresh().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

function fetchWithAppLocale(url: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers)
  headers.set(ACCEPT_LANGUAGE_HEADER, useLocaleStore.getState().locale)
  return globalThis.fetch(url, { ...init, headers })
}

async function renewSession(): Promise<boolean> {
  rejectRestrictedSession()
  if (getRefreshToken() !== null) {
    await refreshAccessToken()
    return true
  }
  if (getAccessToken() === null) return false
  return endSession(NO_REFRESH_TOKEN_CODE, 'No refresh token available')
}

function rejectRestrictedSession(): void {
  const sessionState = getSessionState()
  if (sessionState === SessionStates.ACCOUNT_BANNED) {
    throw buildForbiddenError(ErrorCode.ACCOUNT_BANNED, ACCOUNT_BANNED_MESSAGE)
  }
  if (sessionState === SessionStates.EMAIL_NOT_VERIFIED && !isEmailVerificationRecheckDue()) {
    throw buildForbiddenError(ErrorCode.EMAIL_NOT_VERIFIED, EMAIL_NOT_VERIFIED_MESSAGE)
  }
}

function isEmailVerificationRecheckDue(): boolean {
  const markedAt = getEmailNotVerifiedAt()
  return markedAt === null || Date.now() - markedAt >= EMAIL_VERIFICATION_RECHECK_MS
}

async function executeTokenRefresh(): Promise<string> {
  const refreshToken = getRefreshToken()
  if (refreshToken === null) {
    return endSession(NO_REFRESH_TOKEN_CODE, 'No refresh token available')
  }
  try {
    const tokens = await apiClient.auth.refresh({ refreshToken })
    rotateTokens(tokens.accessToken, tokens.refreshToken)
    return tokens.accessToken
  } catch (cause: unknown) {
    return handleRefreshFailure(cause, refreshToken)
  }
}

function handleRefreshFailure(cause: unknown, attemptedRefreshToken: string): string {
  if (getRefreshToken() !== attemptedRefreshToken) return resumeReplacedSession(cause)
  if (isForbiddenWithCode(cause, ErrorCode.EMAIL_NOT_VERIFIED)) {
    markEmailNotVerified()
    throw cause
  }
  if (isForbiddenWithCode(cause, ErrorCode.ACCOUNT_BANNED)) {
    markAccountBanned()
    throw cause
  }
  if (isTransientFailure(cause)) throw cause
  return endSession(REFRESH_FAILED_CODE, 'Session expired, please log in again', cause)
}

function resumeReplacedSession(cause: unknown): string {
  const accessToken = getAccessToken()
  if (accessToken === null) throw cause
  return accessToken
}

function isTransientFailure(cause: unknown): boolean {
  if (!(cause instanceof ApiError)) return true
  return (
    cause.status < HttpStatus.BAD_REQUEST ||
    cause.status === HttpStatus.TOO_MANY_REQUESTS ||
    cause.status >= HttpStatus.INTERNAL_SERVER_ERROR
  )
}

function isForbiddenWithCode(error: unknown, code: ErrorCode): error is ApiError {
  return error instanceof ApiError && error.status === HttpStatus.FORBIDDEN && error.code === code
}

function buildForbiddenError(code: ErrorCode, message: string): ApiError {
  return new ApiError({ status: HttpStatus.FORBIDDEN, code, message, metadata: {} })
}

function endSession(code: string, message: string, cause?: unknown): never {
  clearSession()
  window.location.assign(buildLoginPathFromCurrentPage())
  throw new ApiError({ status: HttpStatus.UNAUTHORIZED, code, message, metadata: {}, cause })
}

import { ApiError, createClient } from '@keimelion/sdk/client'
import type { KeimelionClient } from '@keimelion/sdk/client'
import { ErrorCode, HttpStatus } from '@keimelion/sdk/enums'
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  markEmailNotVerified,
  rotateTokens,
} from '@/data-access/_shared/auth-storage'
import { buildLoginPathFromCurrentPage } from '@/lib/login-return-path'
import { useLocaleStore } from '@/lib/i18n/locale-store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''
const REQUEST_TIMEOUT_MS = 2 * 60 * 1000
const ACCEPT_LANGUAGE_HEADER = 'Accept-Language'
const NO_REFRESH_TOKEN_CODE = 'NO_REFRESH_TOKEN'
const REFRESH_FAILED_CODE = 'REFRESH_FAILED'

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
  if (getRefreshToken() === null) return false
  await refreshAccessToken()
  return true
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
    return handleRefreshFailure(cause)
  }
}

function handleRefreshFailure(cause: unknown): never {
  if (isForbiddenWithCode(cause, ErrorCode.EMAIL_NOT_VERIFIED)) {
    markEmailNotVerified()
    throw cause
  }
  if (isForbiddenWithCode(cause, ErrorCode.ACCOUNT_BANNED)) {
    clearSession()
    throw cause
  }
  return endSession(REFRESH_FAILED_CODE, 'Session expired, please log in again', cause)
}

function isForbiddenWithCode(error: unknown, code: ErrorCode): error is ApiError {
  return error instanceof ApiError && error.status === HttpStatus.FORBIDDEN && error.code === code
}

function endSession(code: string, message: string, cause?: unknown): never {
  clearSession()
  window.location.assign(buildLoginPathFromCurrentPage())
  throw new ApiError({ status: HttpStatus.UNAUTHORIZED, code, message, metadata: {}, cause })
}

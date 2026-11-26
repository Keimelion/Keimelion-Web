'use client'

import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@keimelion/sdk/client'
import { ErrorCode, HttpStatus } from '@keimelion/sdk/enums'
import { getRefreshToken } from '@/data-access/_shared/auth-storage'
import { refreshAccessToken } from '@/data-access/_shared/client'
import { verifyEmail } from '@/data-access/auth/auth.api'
import { parseVerificationToken } from '@/features/auth/auth.input-schemas'
import { takeUrlFragment } from '@/features/auth/take-url-fragment'

export const EmailVerificationStatuses = {
  VERIFYING: 'verifying',
  INVALID_LINK: 'invalid_link',
  FAILED: 'failed',
  TOO_MANY_ATTEMPTS: 'too_many_attempts',
  VERIFIED: 'verified',
  SIGNING_IN: 'signing_in',
  REDIRECTING_TO_LOGIN: 'redirecting_to_login',
  ACCOUNT_SUSPENDED: 'account_suspended',
} as const

export type EmailVerificationStatus =
  (typeof EmailVerificationStatuses)[keyof typeof EmailVerificationStatuses]

const SessionResumptions = {
  RESUMED: 'resumed',
  LOGIN_REQUIRED: 'login_required',
  SESSION_ENDED: 'session_ended',
  ACCOUNT_BANNED: 'account_banned',
} as const

type SessionResumption = (typeof SessionResumptions)[keyof typeof SessionResumptions]

const STATUS_BY_SESSION_RESUMPTION: Record<SessionResumption, EmailVerificationStatus> = {
  [SessionResumptions.RESUMED]: EmailVerificationStatuses.SIGNING_IN,
  [SessionResumptions.LOGIN_REQUIRED]: EmailVerificationStatuses.VERIFIED,
  [SessionResumptions.SESSION_ENDED]: EmailVerificationStatuses.REDIRECTING_TO_LOGIN,
  [SessionResumptions.ACCOUNT_BANNED]: EmailVerificationStatuses.ACCOUNT_SUSPENDED,
}

const INVALID_LINK_ERROR_CODES: readonly string[] = [
  ErrorCode.BAD_REQUEST,
  ErrorCode.UNPROCESSABLE_ENTITY,
]

interface EmailVerificationLink {
  status: EmailVerificationStatus
  retry: () => void
}

export function useEmailVerificationLink(): EmailVerificationLink {
  const verification = useMutation({
    mutationFn: verifyAndResumeSession,
    meta: { silent: true },
  })
  const { mutate } = verification
  const { token, isTokenUnusable } = useVerificationTokenFromUrl(mutate)
  const retry = useCallback(() => {
    if (token !== null) mutate(token)
  }, [mutate, token])

  return { status: resolveStatus(isTokenUnusable, verification), retry }
}

interface VerificationTokenFromUrl {
  token: string | null
  isTokenUnusable: boolean
}

function useVerificationTokenFromUrl(onToken: (token: string) => void): VerificationTokenFromUrl {
  const [linkToken, setLinkToken] = useState<VerificationTokenFromUrl>({
    token: null,
    isTokenUnusable: false,
  })
  const hasReadUrlRef = useRef(false)

  useEffect(() => {
    if (hasReadUrlRef.current) return
    hasReadUrlRef.current = true
    const token = parseVerificationToken(takeUrlFragment())
    setLinkToken({ token, isTokenUnusable: token === null })
    if (token !== null) onToken(token)
  }, [onToken])

  return linkToken
}

async function verifyAndResumeSession(token: string): Promise<SessionResumption> {
  try {
    await verifyEmail(token)
  } catch (verificationError: unknown) {
    return resumeAlreadyVerifiedSession(verificationError)
  }
  if (getRefreshToken() === null) return SessionResumptions.LOGIN_REQUIRED
  return resumeStoredSession()
}

async function resumeStoredSession(): Promise<SessionResumption> {
  try {
    await refreshAccessToken()
    return SessionResumptions.RESUMED
  } catch (refreshError: unknown) {
    return resolveFailedResumption(refreshError)
  }
}

function resolveFailedResumption(refreshError: unknown): SessionResumption {
  if (isAccountBanned(refreshError)) return SessionResumptions.ACCOUNT_BANNED
  if (isSessionEnded(refreshError)) return SessionResumptions.SESSION_ENDED
  return SessionResumptions.LOGIN_REQUIRED
}

async function resumeAlreadyVerifiedSession(
  verificationError: unknown,
): Promise<SessionResumption> {
  if (!isInvalidLinkError(verificationError) || getRefreshToken() === null) throw verificationError
  try {
    await refreshAccessToken()
    return SessionResumptions.RESUMED
  } catch (refreshError: unknown) {
    if (isAccountBanned(refreshError)) return SessionResumptions.ACCOUNT_BANNED
    throw verificationError
  }
}

interface VerificationResult {
  isError: boolean
  isSuccess: boolean
  error: Error | null
  data: SessionResumption | undefined
}

function resolveStatus(
  isTokenUnusable: boolean,
  verification: VerificationResult,
): EmailVerificationStatus {
  if (isTokenUnusable) return EmailVerificationStatuses.INVALID_LINK
  if (verification.isError) return resolveErrorStatus(verification.error)
  if (!verification.isSuccess || verification.data === undefined) {
    return EmailVerificationStatuses.VERIFYING
  }
  return STATUS_BY_SESSION_RESUMPTION[verification.data]
}

function resolveErrorStatus(error: Error | null): EmailVerificationStatus {
  if (isInvalidLinkError(error)) return EmailVerificationStatuses.INVALID_LINK
  if (error instanceof ApiError && error.code === ErrorCode.RATE_LIMIT_EXCEEDED) {
    return EmailVerificationStatuses.TOO_MANY_ATTEMPTS
  }
  return EmailVerificationStatuses.FAILED
}

function isInvalidLinkError(error: unknown): boolean {
  return error instanceof ApiError && INVALID_LINK_ERROR_CODES.includes(error.code)
}

function isAccountBanned(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status === HttpStatus.FORBIDDEN &&
    error.code === ErrorCode.ACCOUNT_BANNED
  )
}

function isSessionEnded(error: unknown): boolean {
  return error instanceof ApiError && error.status === HttpStatus.UNAUTHORIZED
}

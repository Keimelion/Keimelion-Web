'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@keimelion/sdk/client'
import { ErrorCode } from '@keimelion/sdk/enums'
import { getRefreshToken } from '@/data-access/_shared/auth-storage'
import { refreshAccessToken } from '@/data-access/_shared/client'
import { verifyEmail } from '@/data-access/auth/auth.api'
import { parseVerificationToken } from '@/features/auth/auth.input-schemas'
import { AppPaths } from '@/lib/app-paths'

export const EmailVerificationStatuses = {
  VERIFYING: 'verifying',
  INVALID_LINK: 'invalid_link',
  FAILED: 'failed',
  VERIFIED: 'verified',
  SIGNING_IN: 'signing_in',
} as const

export type EmailVerificationStatus =
  (typeof EmailVerificationStatuses)[keyof typeof EmailVerificationStatuses]

const INVALID_LINK_ERROR_CODES: readonly string[] = [
  ErrorCode.BAD_REQUEST,
  ErrorCode.UNPROCESSABLE_ENTITY,
]

interface EmailVerificationLink {
  status: EmailVerificationStatus
  retry: () => void
}

export function useEmailVerificationLink(): EmailVerificationLink {
  const router = useRouter()
  const verification = useMutation({
    mutationFn: verifyAndResumeSession,
    meta: { silent: true },
    onSuccess: (isSessionResumed) => {
      if (isSessionResumed) router.replace(AppPaths.NEW_LIST)
    },
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
    const token = takeVerificationTokenFromUrl()
    setLinkToken({ token, isTokenUnusable: token === null })
    if (token !== null) onToken(token)
  }, [onToken])

  return linkToken
}

async function verifyAndResumeSession(token: string): Promise<boolean> {
  await verifyEmail(token)
  if (getRefreshToken() === null) return false
  try {
    await refreshAccessToken()
    return true
  } catch {
    return false
  }
}

function takeVerificationTokenFromUrl(): string | null {
  const { pathname, search, hash } = window.location
  if (hash !== '') window.history.replaceState(window.history.state, '', `${pathname}${search}`)
  return parseVerificationToken(hash)
}

interface VerificationResult {
  isError: boolean
  isSuccess: boolean
  error: Error | null
  data: boolean | undefined
}

function resolveStatus(
  isTokenUnusable: boolean,
  verification: VerificationResult,
): EmailVerificationStatus {
  if (isTokenUnusable) return EmailVerificationStatuses.INVALID_LINK
  if (verification.isError) {
    return isInvalidLinkError(verification.error)
      ? EmailVerificationStatuses.INVALID_LINK
      : EmailVerificationStatuses.FAILED
  }
  if (!verification.isSuccess) return EmailVerificationStatuses.VERIFYING
  return verification.data === true
    ? EmailVerificationStatuses.SIGNING_IN
    : EmailVerificationStatuses.VERIFIED
}

function isInvalidLinkError(error: Error | null): boolean {
  return error instanceof ApiError && INVALID_LINK_ERROR_CODES.includes(error.code)
}

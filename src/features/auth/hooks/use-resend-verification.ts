'use client'

import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import type { ResendVerificationResponseParsed } from '@keimelion/sdk/schemas'
import { resendVerification } from '@/data-access/auth/auth.api'
import type { ResendVerificationInput } from '@/features/auth/auth.input-schemas'

export function useResendVerification(): UseMutationResult<
  ResendVerificationResponseParsed,
  Error,
  ResendVerificationInput
> {
  return useMutation({
    mutationFn: ({ email }: ResendVerificationInput) => resendVerification(email),
    meta: { silent: true },
  })
}

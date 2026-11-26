'use client'

import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import type { ForgotPasswordResponseParsed } from '@keimelion/sdk/schemas'
import { requestPasswordReset } from '@/data-access/auth/auth.api'
import type { ForgotPasswordInput } from '@/features/auth/auth.input-schemas'

export function useRequestPasswordReset(): UseMutationResult<
  ForgotPasswordResponseParsed,
  Error,
  ForgotPasswordInput
> {
  return useMutation({
    mutationFn: ({ email }: ForgotPasswordInput) => requestPasswordReset(email),
    meta: { silent: true },
  })
}

'use client'

import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import type { ResetPasswordRequestInput } from '@keimelion/sdk/schemas'
import { clearSession } from '@/data-access/_shared/auth-storage'
import { resetPassword } from '@/data-access/auth/auth.api'

export function useResetPassword(): UseMutationResult<void, Error, ResetPasswordRequestInput> {
  return useMutation({
    mutationFn: async (input: ResetPasswordRequestInput) => {
      await resetPassword(input)
      clearSession()
    },
    meta: { silent: true },
  })
}

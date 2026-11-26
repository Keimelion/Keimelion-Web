'use client'

import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import type { RegisterResponseParsed } from '@keimelion/sdk/schemas'
import { saveUnverifiedSession } from '@/data-access/_shared/auth-storage'
import { register } from '@/data-access/auth/auth.api'
import type { SignupInput } from '@/features/auth/auth.input-schemas'
import { AppPaths } from '@/lib/app-paths'

export function useSignup(): UseMutationResult<string, Error, SignupInput> {
  return useMutation({
    mutationFn: async (input: SignupInput) => openSessionAfterSignup(await register(input)),
    meta: { silent: true },
  })
}

function openSessionAfterSignup({ refreshToken, user }: RegisterResponseParsed): string {
  saveUnverifiedSession(refreshToken, user)
  return AppPaths.CHECK_INBOX
}

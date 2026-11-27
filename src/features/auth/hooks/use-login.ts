'use client'

import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import type { UserDetailParsed } from '@keimelion/sdk/schemas'
import { saveSession } from '@/data-access/_shared/auth-storage'
import { login } from '@/data-access/auth/auth.api'
import type { LoginInput } from '@/features/auth/auth.input-schemas'

export function useLogin(): UseMutationResult<UserDetailParsed, Error, LoginInput> {
  return useMutation({
    mutationFn: openSession,
    meta: { silent: true, skipUnauthorizedRedirect: true, skipEmailNotVerifiedRedirect: true },
  })
}

async function openSession(input: LoginInput): Promise<UserDetailParsed> {
  const { accessToken, refreshToken, user } = await login(input)
  saveSession(accessToken, refreshToken, user)
  return user
}

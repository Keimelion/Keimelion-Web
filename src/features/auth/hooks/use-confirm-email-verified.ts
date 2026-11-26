'use client'

import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { getRefreshToken } from '@/data-access/_shared/auth-storage'
import { refreshAccessToken } from '@/data-access/_shared/client'
import { AppPaths } from '@/lib/app-paths'

export function useConfirmEmailVerified(): UseMutationResult<boolean, Error, void> {
  const router = useRouter()
  return useMutation({
    mutationFn: resumeVerifiedSession,
    meta: { silent: true },
    onSuccess: (isSessionResumed) => {
      router.replace(isSessionResumed ? AppPaths.NEW_LIST : AppPaths.LOGIN)
    },
  })
}

async function resumeVerifiedSession(): Promise<boolean> {
  if (getRefreshToken() === null) return false
  await refreshAccessToken()
  return true
}

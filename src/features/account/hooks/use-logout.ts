'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { clearSession, getRefreshToken } from '@/data-access/_shared/auth-storage'
import { logout } from '@/data-access/auth/auth.api'
import { AppPaths } from '@/lib/app-paths'

export function useLogout(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: () => logout(getRefreshToken()),
    meta: { silent: true, skipUnauthorizedRedirect: true },
    onSettled: () => {
      clearSession()
      queryClient.clear()
      router.replace(AppPaths.HOME)
      router.refresh()
    },
  })
}

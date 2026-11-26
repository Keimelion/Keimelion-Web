'use client'

import { useSyncExternalStore } from 'react'
import { getStoredUser } from '@/data-access/_shared/auth-storage'
import { subscribeToStorage } from '@/lib/subscribe-to-storage'

export function useStoredUserEmail(): string | null {
  return useSyncExternalStore(subscribeToStorage, readStoredUserEmail, readServerEmail)
}

function readStoredUserEmail(): string | null {
  return getStoredUser()?.email ?? null
}

function readServerEmail(): null {
  return null
}

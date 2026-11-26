'use client'

import { useSyncExternalStore } from 'react'
import { getStoredUser } from '@/data-access/_shared/auth-storage'

const STORAGE_EVENT = 'storage'

export function useStoredUserInitial(): string | null {
  return useSyncExternalStore(subscribeToStorage, readStoredUserInitial, readServerInitial)
}

function subscribeToStorage(onChange: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, onChange)
  return () => {
    window.removeEventListener(STORAGE_EVENT, onChange)
  }
}

function readStoredUserInitial(): string | null {
  const user = getStoredUser()
  if (user === null) return null
  const [firstCharacter] = Array.from(user.username ?? user.email)
  return firstCharacter?.toLocaleUpperCase() ?? null
}

function readServerInitial(): null {
  return null
}

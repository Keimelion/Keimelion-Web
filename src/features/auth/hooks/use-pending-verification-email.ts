'use client'

import { useSyncExternalStore } from 'react'

const pendingEmailListeners = new Set<() => void>()
let pendingVerificationEmail: string | null = null

export function rememberPendingVerificationEmail(email: string): void {
  pendingVerificationEmail = email
  pendingEmailListeners.forEach((notify) => {
    notify()
  })
}

export function usePendingVerificationEmail(): string | null {
  return useSyncExternalStore(subscribeToPendingEmail, readPendingEmail, readServerPendingEmail)
}

function subscribeToPendingEmail(onChange: () => void): () => void {
  pendingEmailListeners.add(onChange)
  return () => {
    pendingEmailListeners.delete(onChange)
  }
}

function readPendingEmail(): string | null {
  return pendingVerificationEmail
}

function readServerPendingEmail(): null {
  return null
}

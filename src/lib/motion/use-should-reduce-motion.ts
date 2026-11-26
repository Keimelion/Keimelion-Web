'use client'

import { useReducedMotion } from 'motion/react'
import { useSyncExternalStore } from 'react'

export function useShouldReduceMotion(): boolean {
  const prefersReducedMotion = useReducedMotion() ?? false
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    readClientSnapshot,
    readServerSnapshot,
  )
  return isHydrated && prefersReducedMotion
}

function subscribeToNothing(): () => void {
  return () => undefined
}

function readClientSnapshot(): boolean {
  return true
}

function readServerSnapshot(): boolean {
  return false
}

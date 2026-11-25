'use client'

import { useSyncExternalStore } from 'react'

const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)'

export function useIsDesktopViewport(): boolean {
  return useSyncExternalStore(subscribeToViewport, readIsDesktop, readServerIsDesktop)
}

function subscribeToViewport(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => {
    mediaQuery.removeEventListener('change', onChange)
  }
}

function readIsDesktop(): boolean {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
}

function readServerIsDesktop(): boolean {
  return false
}

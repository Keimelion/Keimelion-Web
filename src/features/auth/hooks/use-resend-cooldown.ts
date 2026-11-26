'use client'

import { useCallback, useEffect, useState } from 'react'

export const RESEND_COOLDOWN_SECONDS = 60
const MS_PER_SECOND = 1000

interface ResendCooldown {
  remainingSeconds: number
  startCooldown: () => void
}

export function useResendCooldown(): ResendCooldown {
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    if (endsAt === null) return undefined
    const intervalId = window.setInterval(() => {
      const secondsLeft = secondsUntil(endsAt)
      setRemainingSeconds(secondsLeft)
      if (secondsLeft === 0) setEndsAt(null)
    }, MS_PER_SECOND)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [endsAt])

  const startCooldown = useCallback(() => {
    setEndsAt(Date.now() + RESEND_COOLDOWN_SECONDS * MS_PER_SECOND)
    setRemainingSeconds(RESEND_COOLDOWN_SECONDS)
  }, [])

  return { remainingSeconds, startCooldown }
}

function secondsUntil(timestamp: number): number {
  return Math.max(0, Math.ceil((timestamp - Date.now()) / MS_PER_SECOND))
}

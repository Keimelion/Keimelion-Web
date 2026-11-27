'use client'

import { useEffect, useRef, useState } from 'react'
import { parseResetToken } from '@/features/auth/auth.input-schemas'
import { takeUrlFragment } from '@/features/auth/take-url-fragment'

export const ResetTokenStates = {
  READING: 'reading',
  MISSING: 'missing',
  FOUND: 'found',
} as const

export type ResetTokenState = (typeof ResetTokenStates)[keyof typeof ResetTokenStates]

interface ResetPasswordToken {
  state: ResetTokenState
  token: string | null
}

const READING_TOKEN: ResetPasswordToken = { state: ResetTokenStates.READING, token: null }

export function useResetPasswordToken(): ResetPasswordToken {
  const [resetToken, setResetToken] = useState<ResetPasswordToken>(READING_TOKEN)
  const hasReadUrlRef = useRef(false)

  useEffect(() => {
    if (hasReadUrlRef.current) return
    hasReadUrlRef.current = true
    setResetToken(readToken())
  }, [])

  return resetToken
}

function readToken(): ResetPasswordToken {
  const token = parseResetToken(takeUrlFragment())
  if (token === null) return { state: ResetTokenStates.MISSING, token: null }
  return { state: ResetTokenStates.FOUND, token }
}

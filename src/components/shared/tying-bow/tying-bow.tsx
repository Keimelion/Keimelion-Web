'use client'

import { useEffect } from 'react'
import { BowGlyph } from '@/components/icons'
import { useShouldReduceMotion } from '@/lib/motion'
import { TyingBowGlyph } from './tying-bow-glyph'

const START_DELAY_S = 0

interface TyingBowProps {
  onDone: () => void
  className?: string | undefined
}

export function TyingBow({ onDone, className }: TyingBowProps): React.JSX.Element {
  const shouldReduceMotion = useShouldReduceMotion()

  useEffect(() => {
    if (shouldReduceMotion) onDone()
  }, [shouldReduceMotion, onDone])

  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={className}>
      {shouldReduceMotion ? <BowGlyph /> : <TyingBowGlyph delay={START_DELAY_S} onDone={onDone} />}
    </svg>
  )
}

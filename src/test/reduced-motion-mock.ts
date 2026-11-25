import type * as MotionModule from 'motion/react'
import { vi } from 'vitest'

export const reducedMotionPreference = { isReduced: false }

export async function mockMotionWithReducedMotionPreference(
  importOriginal: () => Promise<typeof MotionModule>,
): Promise<typeof MotionModule> {
  const original = await importOriginal()
  return { ...original, useReducedMotion: vi.fn(() => reducedMotionPreference.isReduced) }
}

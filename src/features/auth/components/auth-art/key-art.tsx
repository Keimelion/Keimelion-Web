'use client'

import { motion } from 'motion/react'
import { KeyIcon } from '@/components/icons'
import { wiggle } from '@/lib/motion'

export function KeyArt(): React.JSX.Element {
  return (
    <motion.span
      {...wiggle}
      className="flex size-24 items-center justify-center rounded-pill bg-raised text-ink shadow-float"
    >
      <KeyIcon className="size-[60px]" />
    </motion.span>
  )
}

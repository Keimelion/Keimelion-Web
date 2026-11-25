'use client'

import { motion } from 'motion/react'

import { BowIcon } from '@/components/icons'
import { wiggle } from '@/lib/motion'

export function ToastBow(): React.JSX.Element {
  return (
    <motion.span className="inline-flex text-paper-rose" {...wiggle}>
      <BowIcon className="size-6" />
    </motion.span>
  )
}

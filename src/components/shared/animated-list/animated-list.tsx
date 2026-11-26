'use client'

import { AnimatePresence, motion } from 'motion/react'
import { land, rowExit, useShouldReduceMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface AnimatedListProps {
  label: string
  className?: string | undefined
  children: React.ReactNode
}

export function AnimatedList({ label, className, children }: AnimatedListProps): React.JSX.Element {
  return (
    <ul aria-label={label} className={cn('flex min-w-0 flex-col', className)}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </ul>
  )
}

interface AnimatedListItemProps {
  className?: string | undefined
  children: React.ReactNode
}

const INSTANT = { duration: 0 }

export function AnimatedListItem({
  className,
  children,
}: AnimatedListItemProps): React.JSX.Element {
  const shouldReduceMotion = useShouldReduceMotion()
  return (
    <motion.li
      layout="position"
      {...land}
      {...rowExit}
      {...(shouldReduceMotion
        ? { transition: INSTANT, exit: { height: 0, opacity: 0, transition: INSTANT } }
        : {})}
      className={cn('min-w-0 overflow-hidden', className)}
    >
      {children}
    </motion.li>
  )
}

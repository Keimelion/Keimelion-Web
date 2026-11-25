'use client'

import { motion } from 'motion/react'
import { OccasionIcon } from '@/components/shared/occasion-icon'
import { bob } from '@/lib/motion'
import { OCCASION_PAPER_CLASS_NAMES } from '@/lib/occasions/occasion-paper'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'
import { OCCASION_SHAPE_BY_PAPER } from '@/lib/occasions/occasion-shape'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  paper: OccasionPaper
  title: string
  description: string
  action: React.ReactNode
}

export function EmptyState({
  paper,
  title,
  description,
  action,
}: EmptyStateProps): React.JSX.Element {
  return (
    <section className="flex min-w-0 flex-col items-center gap-3 px-6 py-10 text-center">
      <span
        className={cn(
          'mb-2 flex size-28 items-center justify-center rounded-pill text-ink',
          OCCASION_PAPER_CLASS_NAMES[paper].paper,
        )}
      >
        <motion.span className="inline-flex" {...bob}>
          <OccasionIcon shape={OCCASION_SHAPE_BY_PAPER[paper]} className="size-14" />
        </motion.span>
      </span>
      <h2 className="text-title">{title}</h2>
      <p className="max-w-sm text-body text-muted-foreground">{description}</p>
      {action}
    </section>
  )
}

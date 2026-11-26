'use client'

import Link from 'next/link'
import { useId } from 'react'
import { OccasionIcon } from '@/components/shared/occasion-icon'
import { Button } from '@/components/ui/button'
import { FEEDBACK_BUG_PATH } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'
import { OCCASION_PAPER_CLASS_NAMES, OccasionPapers } from '@/lib/occasions/occasion-paper'
import { OCCASION_SHAPE_BY_PAPER } from '@/lib/occasions/occasion-shape'
import { cn } from '@/lib/utils'

const ERROR_PAPER = OccasionPapers.LILAC

interface ErrorStateProps {
  title: string
  description: string
  isRetrying: boolean
  onRetry: () => void
}

export function ErrorState({
  title,
  description,
  isRetrying,
  onRetry,
}: ErrorStateProps): React.JSX.Element {
  const t = useTranslate()
  const titleId = useId()
  return (
    <section
      aria-labelledby={titleId}
      className="flex min-w-0 flex-col items-center gap-3 px-6 py-10 text-center"
    >
      <span
        className={cn(
          'mb-2 flex size-[92px] -rotate-6 items-center justify-center rounded-card text-ink',
          OCCASION_PAPER_CLASS_NAMES[ERROR_PAPER].paper,
        )}
      >
        <OccasionIcon shape={OCCASION_SHAPE_BY_PAPER[ERROR_PAPER]} className="size-12" />
      </span>
      <h2 id={titleId} className="text-title">
        {title}
      </h2>
      <p className="max-w-sm text-body text-muted-foreground">{description}</p>
      <Button size="sm" className="mt-1" isLoading={isRetrying} onClick={onRetry}>
        {t('common.error_state.try_again')}
      </Button>
      <Link
        href={FEEDBACK_BUG_PATH}
        className="touch-target w-fit text-sm font-semibold text-brand underline underline-offset-4"
      >
        {t('common.error_state.report')}
      </Link>
    </section>
  )
}

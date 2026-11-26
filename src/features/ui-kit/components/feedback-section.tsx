'use client'

import { useCallback, useState } from 'react'
import { Confetti } from '@/components/shared/confetti'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslate } from '@/lib/i18n/use-translate'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'
import { ReplayStage } from './replay-stage'

export function FeedbackSection(): React.JSX.Element {
  const t = useTranslate()
  const [isCelebrating, setIsCelebrating] = useState(true)
  const endCelebration = useCallback(() => {
    setIsCelebrating(false)
  }, [])
  return (
    <KitSection title={t('dev.kit.feedback.title')} kicker={t('dev.kit.feedback.kicker')}>
      <div className="grid gap-5 lg:grid-cols-3">
        <KitSpecimen
          label={t('dev.kit.feedback.skeleton')}
          className="flex-col items-stretch rounded-card bg-raised p-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-16 rounded-[14px]" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </KitSpecimen>
        <KitSpecimen label={t('dev.kit.feedback.empty')} className="rounded-card bg-raised p-3">
          <ReplayStage animationName={t('dev.kit.feedback.empty')} onReplay={null}>
            <EmptyState
              paper={OccasionPapers.MINT}
              title={t('dev.kit.feedback.empty_title')}
              description={t('dev.kit.feedback.empty_description')}
              action={<Button size="sm">{t('dev.kit.feedback.empty_action')}</Button>}
            />
          </ReplayStage>
        </KitSpecimen>
        <KitSpecimen label={t('dev.kit.feedback.confetti')} className="flex-col items-stretch">
          <ReplayStage
            animationName={t('dev.kit.feedback.confetti')}
            onReplay={() => {
              setIsCelebrating(true)
            }}
          >
            <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-card bg-surface">
              {isCelebrating ? <Confetti onDone={endCelebration} /> : null}
              <span className="font-hand text-kicker text-hand">{t('dev.kit.feedback.yay')}</span>
            </div>
          </ReplayStage>
        </KitSpecimen>
      </div>
    </KitSection>
  )
}

'use client'

import { ErrorState } from '@/components/shared/error-state'
import { LostParcel } from '@/components/shared/lost-parcel'
import { useTranslate } from '@/lib/i18n/use-translate'
import { notifyInfo } from '@/lib/notify'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'
import { ReplayStage } from './replay-stage'

export function StatesSection(): React.JSX.Element {
  const t = useTranslate()
  const announceRetry = (): void => {
    notifyInfo({ title: t('common.error_state.try_again') })
  }
  return (
    <KitSection title={t('dev.kit.states.title')} kicker={t('dev.kit.states.kicker')}>
      <div className="grid gap-5 lg:grid-cols-3">
        <KitSpecimen label={t('dev.kit.states.error')} className="rounded-card bg-raised">
          <ErrorState
            title={t('dev.kit.states.error_title')}
            description={t('dev.kit.states.error_description')}
            isRetrying={false}
            onRetry={announceRetry}
          />
        </KitSpecimen>
        <KitSpecimen label={t('dev.kit.states.error_retrying')} className="rounded-card bg-raised">
          <ErrorState
            title={t('dev.kit.states.error_title')}
            description={t('dev.kit.states.error_description')}
            isRetrying
            onRetry={announceRetry}
          />
        </KitSpecimen>
        <KitSpecimen
          label={t('dev.kit.states.lost_parcel')}
          className="rounded-card bg-surface p-4"
        >
          <ReplayStage animationName={t('dev.kit.states.lost_parcel')} onReplay={null}>
            <LostParcel
              stampLabel={t('error.not_found.stamp')}
              addressLabel={t('error.not_found.label_to')}
              pageLabel={t('error.not_found.label_page')}
              className="w-full max-w-[285px]"
            />
          </ReplayStage>
        </KitSpecimen>
      </div>
    </KitSection>
  )
}

'use client'

import { useCallback, useState } from 'react'
import { TeacupIcon } from '@/components/icons'
import { Thumb, ThumbSizes } from '@/components/shared/thumb'
import { WrappedGift, WrappedGiftModes } from '@/components/shared/wrapped-gift'
import type { WrappedGiftMode } from '@/components/shared/wrapped-gift'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import { KitSection } from './kit-section'
import { ReplayStage } from './replay-stage'

const MODE_LABEL_IDS: Readonly<Record<WrappedGiftMode, MessageId>> = {
  [WrappedGiftModes.STATIC]: 'dev.kit.gift.static',
  [WrappedGiftModes.WRAP]: 'dev.kit.gift.wrap',
  [WrappedGiftModes.UNWRAP]: 'dev.kit.gift.unwrap',
}

export function GiftSection(): React.JSX.Element {
  const t = useTranslate()
  return (
    <KitSection title={t('dev.kit.gift.title')} kicker={t('dev.kit.gift.kicker')}>
      <ul className="grid gap-4 sm:grid-cols-3">
        {Object.values(WrappedGiftModes).map((mode) => (
          <GiftDemo key={mode} mode={mode} />
        ))}
      </ul>
    </KitSection>
  )
}

interface GiftDemoProps {
  mode: WrappedGiftMode
}

function GiftDemo({ mode }: GiftDemoProps): React.JSX.Element {
  const t = useTranslate()
  const [doneCount, setDoneCount] = useState(0)
  const markDone = useCallback(() => {
    setDoneCount((count) => count + 1)
  }, [])
  const gift = (
    <WrappedGift paper={OccasionPapers.SKY} mode={mode} onDone={markDone} className="size-[90px]">
      <Thumb kind="drawing" size={ThumbSizes.LG} paper={OccasionPapers.SKY} icon={TeacupIcon} />
    </WrappedGift>
  )
  return (
    <li className="flex flex-col items-start gap-3 rounded-card bg-raised p-4 shadow-card">
      <span className="font-mono text-label font-medium uppercase">{t(MODE_LABEL_IDS[mode])}</span>
      {mode === WrappedGiftModes.STATIC ? (
        gift
      ) : (
        <ReplayStage animationName={t(MODE_LABEL_IDS[mode])} onReplay={null}>
          {gift}
        </ReplayStage>
      )}
      <p aria-live="polite" className="text-small text-muted-foreground">
        {t('dev.kit.gift.done_count', { count: doneCount })}
      </p>
    </li>
  )
}

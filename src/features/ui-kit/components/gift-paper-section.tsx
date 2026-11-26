'use client'

import { WrappedGift, WrappedGiftModes } from '@/components/shared/wrapped-gift'
import { useTranslate } from '@/lib/i18n/use-translate'
import { GIFT_PATTERN_LIST } from '@/lib/occasions/gift-pattern'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import { GIFT_PATTERN_LABEL_IDS } from '../ui-kit'
import { KitSection } from './kit-section'

const PAPERS = Object.values(OccasionPapers)

function ignoreDone(): void {
  return undefined
}

export function GiftPaperSection(): React.JSX.Element {
  const t = useTranslate()
  return (
    <KitSection title={t('dev.kit.gift_papers.title')} kicker={t('dev.kit.gift_papers.kicker')}>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {GIFT_PATTERN_LIST.map((pattern) => (
          <li key={pattern} className="flex min-w-0 flex-col gap-2">
            <span className="font-semibold">{t(GIFT_PATTERN_LABEL_IDS[pattern])}</span>
            <span className="flex flex-wrap gap-1.5">
              {PAPERS.map((paper) => (
                <WrappedGift
                  key={paper}
                  paper={paper}
                  pattern={pattern}
                  mode={WrappedGiftModes.STATIC}
                  onDone={ignoreDone}
                  className="size-12"
                />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </KitSection>
  )
}

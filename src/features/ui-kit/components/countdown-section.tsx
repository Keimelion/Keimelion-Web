'use client'

import { Countdown } from '@/components/shared/countdown'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { OCCASION_PAPER_CLASS_NAMES, OccasionPapers } from '@/lib/occasions/occasion-paper'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'
import { cn } from '@/lib/utils'
import { KitSection } from './kit-section'

interface CountdownSample {
  labelId: MessageId
  daysBeforeEvent: number | null
  paper: OccasionPaper
}

const EVENT_YEAR = 2027
const EVENT_MONTH_INDEX = 5
const EVENT_DAY = 14

const SAMPLES: readonly CountdownSample[] = [
  { labelId: 'dev.kit.countdown.far', daysBeforeEvent: 209, paper: OccasionPapers.LILAC },
  { labelId: 'dev.kit.countdown.near', daysBeforeEvent: 3, paper: OccasionPapers.LILAC },
  { labelId: 'dev.kit.countdown.tomorrow', daysBeforeEvent: 1, paper: OccasionPapers.LILAC },
  { labelId: 'dev.kit.countdown.today', daysBeforeEvent: 0, paper: OccasionPapers.LILAC },
  { labelId: 'dev.kit.countdown.past', daysBeforeEvent: -6, paper: OccasionPapers.LILAC },
  { labelId: 'dev.kit.countdown.no_date', daysBeforeEvent: null, paper: OccasionPapers.SKY },
]

export function CountdownSection(): React.JSX.Element {
  const t = useTranslate()
  return (
    <KitSection title={t('dev.kit.countdown.title')} kicker={t('dev.kit.countdown.kicker')}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLES.map((sample) => (
          <li key={sample.labelId} className="flex min-w-0 flex-col gap-2.5">
            <span className="font-mono text-label text-muted-foreground uppercase">
              {t(sample.labelId)}
            </span>
            <div
              className={cn(
                'overflow-hidden rounded-[24px] px-[18px] pt-[18px] pb-[34px] text-ink',
                OCCASION_PAPER_CLASS_NAMES[sample.paper].paper,
              )}
            >
              <Countdown
                date={sample.daysBeforeEvent === null ? null : createEventDate()}
                today={
                  sample.daysBeforeEvent === null ? null : createEventDate(-sample.daysBeforeEvent)
                }
                occasionKicker={t(
                  sample.daysBeforeEvent === null
                    ? 'dev.kit.countdown.home_kicker'
                    : 'dev.kit.countdown.wedding_kicker',
                )}
              >
                <h3 className="text-[28px] leading-[30px]">
                  {t(
                    sample.daysBeforeEvent === null
                      ? 'dev.kit.countdown.home_title'
                      : 'dev.kit.countdown.wedding_title',
                  )}
                </h3>
              </Countdown>
            </div>
          </li>
        ))}
      </ul>
    </KitSection>
  )
}

function createEventDate(dayOffset = 0): Date {
  return new Date(EVENT_YEAR, EVENT_MONTH_INDEX, EVENT_DAY + dayOffset)
}

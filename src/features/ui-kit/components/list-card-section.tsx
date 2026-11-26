import { GlobeIcon } from '@/components/icons'
import { OccasionIcon } from '@/components/shared/occasion-icon'
import { PaperEdge } from '@/components/shared/paper-edge'
import { Progress } from '@/components/shared/progress'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { OCCASION_PAPER_CLASS_NAMES, getOccasionPaper } from '@/lib/occasions/occasion-paper'
import { OCCASION_SHAPE_BY_PAPER } from '@/lib/occasions/occasion-shape'
import { cn } from '@/lib/utils'
import { KitSection } from './kit-section'

interface ListCardSample {
  occasionSlug: string
  reserved: number
  wanted: number
}

const SAMPLES: readonly ListCardSample[] = [
  { occasionSlug: 'wedding', reserved: 6, wanted: 18 },
  { occasionSlug: 'birth', reserved: 0, wanted: 12 },
  { occasionSlug: 'first-apartment', reserved: 9, wanted: 9 },
  { occasionSlug: 'birthday', reserved: 3, wanted: 7 },
  { occasionSlug: 'other', reserved: 1, wanted: 4 },
]

export async function ListCardSection(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <KitSection title={t('dev.kit.list_cards.title')} kicker={t('dev.kit.list_cards.kicker')}>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLES.map((sample) => {
          const paper = getOccasionPaper(sample.occasionSlug)
          return (
            <li
              key={sample.occasionSlug}
              className={cn(
                'relative flex min-w-0 flex-col gap-2.5 overflow-hidden rounded-[24px] px-4 pt-4 pb-[34px] text-ink',
                OCCASION_PAPER_CLASS_NAMES[paper].paper,
              )}
            >
              <PaperEdge occasionSlug={sample.occasionSlug} />
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <OccasionIcon shape={OCCASION_SHAPE_BY_PAPER[paper]} className="size-[22px]" />
                  <span className="font-mono text-label uppercase">{sample.occasionSlug}</span>
                </span>
                <span className="inline-flex h-6 items-center gap-1.5 rounded-pill bg-inverse px-[9px] text-[11px] font-bold text-on-inverse">
                  <GlobeIcon className="size-3" />
                  {t('dev.kit.list_cards.public')}
                </span>
              </span>
              <span className="font-display text-2xl leading-[26px] font-extrabold tracking-[-0.035em]">
                {t('dev.kit.countdown.wedding_title')}
              </span>
              <Progress
                value={sample.reserved}
                max={sample.wanted}
                label={t('dev.kit.list_cards.progress_label')}
                valueText={t('dev.kit.list_cards.progress_value', {
                  reserved: sample.reserved,
                  wanted: sample.wanted,
                })}
              />
            </li>
          )
        })}
      </ul>
    </KitSection>
  )
}

import { CasseroleIcon, HeadphonesIcon, LampIcon, PlantIcon, TeacupIcon } from '@/components/icons'
import type { LineIconProps } from '@/components/icons'
import { OccasionIcon } from '@/components/shared/occasion-icon'
import { Thumb, ThumbSizes } from '@/components/shared/thumb'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { OCCASION_PAPER_CLASS_NAMES, OccasionPapers } from '@/lib/occasions/occasion-paper'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'
import { OCCASION_SHAPE_BY_PAPER } from '@/lib/occasions/occasion-shape'
import { cn } from '@/lib/utils'
import { KIT_PHOTO_SOURCE, OCCASION_PAPER_LABEL_IDS } from '../ui-kit'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

const PAPERS = Object.values(OccasionPapers)

const SAMPLE_DRAWINGS: Readonly<Record<OccasionPaper, React.ComponentType<LineIconProps>>> = {
  [OccasionPapers.LILAC]: LampIcon,
  [OccasionPapers.ROSE]: TeacupIcon,
  [OccasionPapers.SKY]: HeadphonesIcon,
  [OccasionPapers.MUSTARD]: CasseroleIcon,
  [OccasionPapers.MINT]: PlantIcon,
}

export async function OccasionSection(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <KitSection title={t('dev.kit.occasions.title')} kicker={t('dev.kit.occasions.kicker')}>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {PAPERS.map((paper) => (
          <li key={paper} className="flex flex-col gap-2">
            <span
              className={cn(
                'flex h-28 items-center justify-center rounded-[20px] text-ink',
                OCCASION_PAPER_CLASS_NAMES[paper].paper,
              )}
            >
              <OccasionIcon shape={OCCASION_SHAPE_BY_PAPER[paper]} className="size-12" />
            </span>
            <span className="font-bold">{t(OCCASION_PAPER_LABEL_IDS[paper])}</span>
            <span className="font-mono text-label text-muted-foreground">
              {paper} · {OCCASION_SHAPE_BY_PAPER[paper]}
            </span>
          </li>
        ))}
      </ul>
      <KitSpecimen label={t('dev.kit.occasions.thumbs')}>
        {PAPERS.map((paper) => (
          <Thumb
            key={paper}
            kind="drawing"
            size={ThumbSizes.MD}
            paper={paper}
            icon={SAMPLE_DRAWINGS[paper]}
          />
        ))}
        <Thumb kind="drawing" size={ThumbSizes.SM} paper={OccasionPapers.LILAC} icon={LampIcon} />
        <Thumb kind="drawing" size={ThumbSizes.LG} paper={OccasionPapers.SKY} icon={TeacupIcon} />
        <Thumb
          kind="photo"
          size={ThumbSizes.MD}
          src={KIT_PHOTO_SOURCE}
          alt={t('dev.kit.occasions.photo_alt')}
        />
        <Thumb
          kind="photo"
          size={ThumbSizes.LG}
          src={KIT_PHOTO_SOURCE}
          alt={t('dev.kit.occasions.photo_alt')}
        />
      </KitSpecimen>
    </KitSection>
  )
}

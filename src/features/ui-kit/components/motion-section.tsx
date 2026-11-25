'use client'

import { motion } from 'motion/react'
import { BowIcon, PlantIcon } from '@/components/icons'
import { OccasionIcon } from '@/components/shared/occasion-icon'
import { Thumb, ThumbSizes } from '@/components/shared/thumb'
import { TyingBow } from '@/components/shared/tying-bow'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import {
  bob,
  flip,
  land,
  landGlow,
  press,
  scrim,
  seq,
  sheetUp,
  toastIn,
  unfold,
  wiggle,
} from '@/lib/motion'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import { OccasionShapes } from '@/lib/occasions/occasion-shape'
import { KitSection } from './kit-section'
import { ReplayStage } from './replay-stage'

const SEQ_SHAPES = Object.values(OccasionShapes)

const NO_OP = (): void => undefined

export function MotionSection(): React.JSX.Element {
  const t = useTranslate()
  return (
    <KitSection title={t('dev.kit.motion.title')} kicker={t('dev.kit.motion.kicker')}>
      <p className="text-small text-muted-foreground">{t('dev.kit.motion.reduced_motion')}</p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MotionCard name="land" descriptionId="dev.kit.motion.land">
          <motion.span className="relative block rounded-thumb" {...land}>
            <Thumb
              kind="drawing"
              size={ThumbSizes.LG}
              paper={OccasionPapers.MINT}
              icon={PlantIcon}
            />
            <motion.span
              className="absolute inset-0 rounded-thumb shadow-[0_0_0_6px] shadow-gift-mustard/55"
              {...landGlow}
            />
          </motion.span>
        </MotionCard>
        <MotionCard name="toast-in" descriptionId="dev.kit.motion.toast_in">
          <motion.span
            className="inline-flex min-h-12 items-center gap-2.5 rounded-pill bg-inverse pr-[18px] pl-3 text-sm font-semibold text-on-inverse"
            {...toastIn}
          >
            <motion.span className="inline-flex text-paper-rose" {...wiggle}>
              <BowIcon className="size-5" />
            </motion.span>
            {t('dev.kit.motion.saved')}
          </motion.span>
        </MotionCard>
        <MotionCard name="sheet-up / scrim" descriptionId="dev.kit.motion.sheet_up">
          <span className="relative block h-28 w-full overflow-hidden rounded-thumb bg-sunken">
            <motion.span className="absolute inset-0 bg-scrim" {...scrim} />
            <motion.span
              className="absolute inset-x-0 top-10 bottom-0 rounded-t-sheet bg-raised p-3"
              {...sheetUp}
            >
              <span className="mx-auto block h-[5px] w-11 rounded-[9px] bg-rule" />
            </motion.span>
          </span>
        </MotionCard>
        <MotionCard name="press" descriptionId="dev.kit.motion.press">
          <motion.button
            type="button"
            className="min-h-12 cursor-pointer rounded-pill bg-brand px-[22px] font-bold text-on-brand shadow-[inset_0_-3px_0_var(--brand-deep)]"
            {...press}
          >
            {t('dev.kit.motion.press_me')}
          </motion.button>
        </MotionCard>
        <MotionCard name="flip" descriptionId="dev.kit.motion.flip">
          <motion.span
            className="inline-flex h-[42px] w-[27px] items-center justify-center rounded-lg bg-raised font-display text-[34px] font-extrabold text-ink"
            {...flip}
          >
            9
          </motion.span>
        </MotionCard>
        <MotionCard name="unfold" descriptionId="dev.kit.motion.unfold">
          <motion.span
            className="block w-full rounded-card bg-paper-lilac p-4 font-display text-title text-ink"
            {...unfold}
          >
            {t('dev.kit.motion.new_list')}
          </motion.span>
        </MotionCard>
        <MotionCard name="seq" descriptionId="dev.kit.motion.seq">
          <span className="flex gap-2 text-ink">
            {SEQ_SHAPES.map((shape, position) => (
              <motion.span key={shape} className="inline-flex" {...seq(position)}>
                <OccasionIcon shape={shape} className="size-8" />
              </motion.span>
            ))}
          </span>
        </MotionCard>
        <MotionCard name="tie" descriptionId="dev.kit.motion.tie">
          <TyingBow onDone={NO_OP} className="size-20 text-brand" />
        </MotionCard>
        <MotionCard name="wiggle" descriptionId="dev.kit.motion.wiggle">
          <motion.span className="inline-flex text-brand" {...wiggle}>
            <BowIcon className="size-12" />
          </motion.span>
        </MotionCard>
        <MotionCard name="bob" descriptionId="dev.kit.motion.bob">
          <motion.span className="inline-flex text-ink" {...bob}>
            <OccasionIcon shape={OccasionShapes.FLOWER} className="size-14" />
          </motion.span>
        </MotionCard>
      </ul>
    </KitSection>
  )
}

interface MotionCardProps {
  name: string
  descriptionId: MessageId
  children: React.ReactNode
}

function MotionCard({ name, descriptionId, children }: MotionCardProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <li className="flex min-w-0 flex-col gap-2.5 rounded-card bg-raised p-4 shadow-card">
      <ReplayStage
        animationName={name}
        onReplay={null}
        className="flex h-32 items-center justify-center overflow-hidden rounded-thumb bg-surface px-3"
      >
        {children}
      </ReplayStage>
      <span className="font-mono text-label font-medium">{name}</span>
      <span className="text-small text-muted-foreground">{t(descriptionId)}</span>
    </li>
  )
}

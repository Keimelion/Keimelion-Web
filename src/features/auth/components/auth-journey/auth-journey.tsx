'use client'

import { useState } from 'react'
import { SunShape, TeacupIcon } from '@/components/icons'
import { Confetti } from '@/components/shared/confetti'
import { WrappedGift, WrappedGiftModes } from '@/components/shared/wrapped-gift'
import { useShouldReduceMotion } from '@/lib/motion'
import { useTranslate } from '@/lib/i18n/use-translate'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import { useIsDesktopViewport } from '@/lib/use-is-desktop-viewport'
import { JourneyBow } from './journey-bow'
import { JourneyStop } from './journey-stop'
import { PhoneTile, ProductTile, SharedListTile } from './journey-tiles'
import { JOURNEY_ROAD_PATH, JOURNEY_STOPS, JourneyPhases } from './journey-timeline'
import type { JourneyPhase } from './journey-timeline'
import { doNothing } from '@/lib/utils'

export function AuthJourney(): React.JSX.Element {
  const t = useTranslate()
  const phase = useJourneyPhase()
  const [hasBowArrived, setHasBowArrived] = useState(false)
  return (
    <div
      data-journey-phase={phase}
      className="relative h-[680px] w-[560px] shrink-0 scale-[0.8] xl:scale-95 [@media(min-width:1400px)_and_(min-height:860px)]:scale-[1.2]"
    >
      <JourneyScenery />
      <JourneyStop phase={phase} stop={JOURNEY_STOPS.ADD}>
        <ProductTile />
      </JourneyStop>
      <JourneyStop phase={phase} stop={JOURNEY_STOPS.SHARE}>
        <SharedListTile />
      </JourneyStop>
      <JourneyStop phase={phase} stop={JOURNEY_STOPS.RESERVE}>
        <PhoneTile phase={phase} />
      </JourneyStop>
      <JourneyStop phase={phase} stop={JOURNEY_STOPS.WRAP}>
        <JourneyGift phase={phase} hasBowArrived={hasBowArrived} />
      </JourneyStop>
      <JourneyBow
        phase={phase}
        hasArrived={hasBowArrived}
        onArrive={() => {
          setHasBowArrived(true)
        }}
      />
      <p className="absolute right-12 bottom-10 left-12 font-display text-[34px] leading-9 font-extrabold text-balance text-ink">
        {t('auth.journey.tagline')}
      </p>
    </div>
  )
}

function useJourneyPhase(): JourneyPhase {
  const shouldReduceMotion = useShouldReduceMotion()
  const isDesktop = useIsDesktopViewport()
  if (shouldReduceMotion) return JourneyPhases.DONE
  return isDesktop ? JourneyPhases.PLAYING : JourneyPhases.IDLE
}

function JourneyScenery(): React.JSX.Element {
  return (
    <>
      <span className="absolute -top-[60px] -left-20 size-80 rounded-pill bg-raised/25" />
      <span className="absolute top-[300px] -right-[110px] size-[360px] rounded-pill bg-raised/25" />
      <SunShape className="absolute top-[30px] left-[360px] size-[70px] text-gift-mustard" />
      <svg aria-hidden="true" width="560" height="680" className="absolute inset-0">
        <path
          d={JOURNEY_ROAD_PATH}
          fill="none"
          strokeWidth="22"
          strokeLinecap="round"
          className="stroke-ink/10"
        />
        <path
          d={JOURNEY_ROAD_PATH}
          fill="none"
          strokeWidth="5"
          strokeDasharray="1 14"
          strokeLinecap="round"
          className="stroke-gift-ribbon"
        />
      </svg>
    </>
  )
}

interface JourneyGiftProps {
  phase: JourneyPhase
  hasBowArrived: boolean
}

function JourneyGift({ phase, hasBowArrived }: JourneyGiftProps): React.JSX.Element {
  const [isCelebrating, setIsCelebrating] = useState(true)
  const isWrapped = phase === JourneyPhases.DONE || hasBowArrived
  const tile = (
    <span className="flex size-full items-center justify-center bg-paper-mustard text-ink">
      <TeacupIcon className="size-[60px]" />
    </span>
  )
  return (
    <div className="relative h-[100px] w-[118px]">
      {isWrapped ? (
        <WrappedGift
          paper={OccasionPapers.ROSE}
          mode={phase === JourneyPhases.DONE ? WrappedGiftModes.STATIC : WrappedGiftModes.WRAP}
          onDone={doNothing}
          className="size-full rounded-[18px]"
        >
          {tile}
        </WrappedGift>
      ) : (
        <span className="block size-full overflow-hidden rounded-[18px]">{tile}</span>
      )}
      {hasBowArrived && isCelebrating ? (
        <span className="absolute -inset-x-8 -top-8 h-[180px]">
          <Confetti
            onDone={() => {
              setIsCelebrating(false)
            }}
          />
        </span>
      ) : null}
    </div>
  )
}

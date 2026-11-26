import type { MessageId } from '@/lib/i18n/messages'

export const JourneyPhases = {
  IDLE: 'idle',
  PLAYING: 'playing',
  DONE: 'done',
} as const

export type JourneyPhase = (typeof JourneyPhases)[keyof typeof JourneyPhases]

export const JOURNEY_ROAD_PATH =
  'M110 120 C250 40, 470 80, 450 220 C430 340, 130 240, 110 360 C90 480, 330 440, 450 470'

export const JOURNEY_TRAVEL_S = 7.5

export interface JourneyStopPlacement {
  number: number
  arrivalS: number
  labelId: MessageId
  className: string
}

export const JOURNEY_STOPS = {
  ADD: {
    number: 1,
    arrivalS: 0,
    labelId: 'auth.journey.step_add',
    className: 'top-[70px] left-[35px] w-[150px]',
  },
  SHARE: {
    number: 2,
    arrivalS: 2.5,
    labelId: 'auth.journey.step_share',
    className: 'top-[150px] left-[360px] w-[180px]',
  },
  RESERVE: {
    number: 3,
    arrivalS: 5,
    labelId: 'auth.journey.step_reserve',
    className: 'top-[280px] left-[50px] w-[120px]',
  },
  WRAP: {
    number: 4,
    arrivalS: 7.5,
    labelId: 'auth.journey.step_wrapped',
    className: 'top-[410px] left-[375px] w-[150px]',
  },
} as const satisfies Record<string, JourneyStopPlacement>

export const BOW_TRAVEL = {
  offsetDistance: ['0%', '0%', '35.2%', '35.2%', '67.8%', '67.8%', '100%'],
  times: [0, 0.133, 0.333, 0.467, 0.667, 0.8, 1],
}

export const DIMMED_TILE_FILTER = 'saturate(0.4) brightness(0.98)'
export const LIT_TILE_FILTER = 'saturate(1) brightness(1)'

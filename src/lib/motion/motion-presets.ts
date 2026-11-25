import type { MotionProps } from 'motion/react'
import { MotionDurations, MotionEasings } from './motion-tokens'

export type MotionPreset = Pick<
  MotionProps,
  'initial' | 'animate' | 'exit' | 'transition' | 'whileTap' | 'style'
>

const LAND_DROP_PX = -36
const LAND_SETTLE_PX = 4
const LAND_SQUASH_TIME = 0.6
const LAND_DURATION_S = 0.5
const GLOW_DURATION_S = 1
const TOAST_RISE_PX = 30
const TOAST_LEAVE_PX = 16
const PRESS_SCALE = 0.94
const FLIP_PERSPECTIVE_PX = 200
const UNFOLD_SCALE_Y = 0.6
const SEQ_STEP_S = 0.12
const WIGGLE_DEGREES = 10
const WIGGLE_ORIGIN_Y = 0.6
const BOB_PX = -6
const BOB_PERIOD_S = 3
const ROW_EXIT_DURATION_S = 0.25

export const land: MotionPreset = {
  initial: { opacity: 0, y: LAND_DROP_PX, scale: 0.96 },
  animate: {
    opacity: [0, 1, 1],
    y: [LAND_DROP_PX, LAND_SETTLE_PX, 0],
    scaleX: [0.96, 1.02, 1],
    scaleY: [0.96, 0.97, 1],
  },
  transition: {
    duration: LAND_DURATION_S,
    times: [0, LAND_SQUASH_TIME, 1],
    ease: MotionEasings.SPRING,
  },
}

export const landGlow: MotionPreset = {
  initial: { opacity: 0 },
  animate: { opacity: [0, 0, 1, 0] },
  transition: { duration: GLOW_DURATION_S, times: [0, 0.25, 0.4, 1], ease: 'easeInOut' },
}

export const toastIn: MotionPreset = {
  initial: { opacity: 0, y: TOAST_RISE_PX, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: TOAST_LEAVE_PX, transition: { duration: MotionDurations.S } },
  transition: { duration: MotionDurations.M, ease: MotionEasings.SPRING },
}

export const sheetUp: MotionPreset = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { duration: MotionDurations.M, ease: MotionEasings.SHEET } },
  exit: { y: '100%', transition: { duration: MotionDurations.S, ease: MotionEasings.STANDARD } },
}

export const scrim: MotionPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: MotionDurations.S, ease: MotionEasings.STANDARD },
}

export const press: MotionPreset = {
  whileTap: { scale: PRESS_SCALE },
  transition: { duration: MotionDurations.XS, ease: MotionEasings.SPRING },
}

export const flip: MotionPreset = {
  initial: { rotateX: -90, transformPerspective: FLIP_PERSPECTIVE_PX },
  animate: { rotateX: 0, transformPerspective: FLIP_PERSPECTIVE_PX },
  transition: { duration: MotionDurations.L, ease: MotionEasings.FLIP },
}

export const unfold: MotionPreset = {
  initial: { opacity: 0, scaleY: UNFOLD_SCALE_Y, originY: 0 },
  animate: { opacity: 1, scaleY: 1, originY: 0 },
  transition: { duration: MotionDurations.L, ease: MotionEasings.SOFT_OUT },
}

export function seq(position: number): MotionPreset {
  return {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: {
      duration: MotionDurations.M,
      ease: MotionEasings.POP,
      delay: position * SEQ_STEP_S,
    },
  }
}

export const wiggle: MotionPreset = {
  style: { originY: WIGGLE_ORIGIN_Y },
  animate: {
    rotate: [0, -WIGGLE_DEGREES, WIGGLE_DEGREES, -WIGGLE_DEGREES, WIGGLE_DEGREES, 0],
  },
  transition: { duration: MotionDurations.GIFT, ease: 'easeInOut' },
}

export const rowExit: MotionPreset = {
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: ROW_EXIT_DURATION_S, ease: MotionEasings.STANDARD },
  },
}

export const bob: MotionPreset = {
  animate: { y: [0, BOB_PX, 0] },
  transition: { duration: BOB_PERIOD_S, ease: 'easeInOut', repeat: Infinity },
}

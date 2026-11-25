import { MotionEasings } from '@/lib/motion'
import type { MotionPreset } from '@/lib/motion'

export interface GiftTimeline {
  paper: MotionPreset
  verticalRibbon: MotionPreset
  horizontalRibbon: MotionPreset
  bow: MotionPreset
}

const WRAP_PAPER_S = 0.56
const WRAP_RIBBON_DELAY_S = 0.5
const WRAP_RIBBON_S = 0.35
const WRAP_BOW_DELAY_S = 0.85
const WRAP_BOW_S = 0.35

const UNWRAP_BOW_S = 0.55
const UNWRAP_BOW_LIFT_TIME = 0.4
const UNWRAP_RIBBON_DELAY_S = 0.38
const UNWRAP_RIBBON_S = 0.38
const UNWRAP_PAPER_DELAY_S = 0.71
const UNWRAP_PAPER_S = 0.49
const UNWRAP_PAPER_SKEW_DEGREES = -8

const BOW_TILT_DEGREES = -40

export const WRAP_TIMELINE: GiftTimeline = {
  paper: {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    style: { originX: 0 },
    transition: { duration: WRAP_PAPER_S, ease: MotionEasings.STANDARD },
  },
  verticalRibbon: {
    initial: { scaleY: 0 },
    animate: { scaleY: 1 },
    style: { originY: 0 },
    transition: {
      duration: WRAP_RIBBON_S,
      delay: WRAP_RIBBON_DELAY_S,
      ease: MotionEasings.STANDARD,
    },
  },
  horizontalRibbon: {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    style: { originX: 0 },
    transition: {
      duration: WRAP_RIBBON_S,
      delay: WRAP_RIBBON_DELAY_S,
      ease: MotionEasings.STANDARD,
    },
  },
  bow: {
    initial: { scale: 0, rotate: BOW_TILT_DEGREES },
    animate: { scale: 1, rotate: 0 },
    transition: { duration: WRAP_BOW_S, delay: WRAP_BOW_DELAY_S, ease: MotionEasings.POP },
  },
}

export const UNWRAP_TIMELINE: GiftTimeline = {
  bow: {
    initial: { y: 0, rotate: 0, scale: 1, opacity: 1 },
    animate: {
      y: [0, -6, -60],
      rotate: [0, -14, 40],
      scale: [1, 1.15, 0.4],
      opacity: [1, 1, 0],
    },
    transition: {
      duration: UNWRAP_BOW_S,
      times: [0, UNWRAP_BOW_LIFT_TIME, 1],
      ease: MotionEasings.ACCELERATE,
    },
  },
  verticalRibbon: {
    initial: { scaleY: 1 },
    animate: { scaleY: 0 },
    style: { originY: 0 },
    transition: {
      duration: UNWRAP_RIBBON_S,
      delay: UNWRAP_RIBBON_DELAY_S,
      ease: MotionEasings.STANDARD,
    },
  },
  horizontalRibbon: {
    initial: { scaleX: 1 },
    animate: { scaleX: 0 },
    style: { originX: 0 },
    transition: {
      duration: UNWRAP_RIBBON_S,
      delay: UNWRAP_RIBBON_DELAY_S,
      ease: MotionEasings.STANDARD,
    },
  },
  paper: {
    initial: { scaleX: 1, skewY: 0 },
    animate: { scaleX: 0, skewY: UNWRAP_PAPER_SKEW_DEGREES },
    style: { originX: 1 },
    transition: {
      duration: UNWRAP_PAPER_S,
      delay: UNWRAP_PAPER_DELAY_S,
      ease: MotionEasings.STANDARD,
    },
  },
}

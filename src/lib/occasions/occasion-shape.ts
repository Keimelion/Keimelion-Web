import { OccasionPapers } from './occasion-paper'
import type { OccasionPaper } from './occasion-paper'

export const OccasionShapes = {
  FLOWER: 'flower',
  CLOUD: 'cloud',
  ARCHES: 'arches',
  SUN: 'sun',
  LEAF: 'leaf',
} as const

export type OccasionShape = (typeof OccasionShapes)[keyof typeof OccasionShapes]

export const OCCASION_SHAPE_BY_PAPER: Readonly<Record<OccasionPaper, OccasionShape>> = {
  [OccasionPapers.LILAC]: OccasionShapes.FLOWER,
  [OccasionPapers.ROSE]: OccasionShapes.CLOUD,
  [OccasionPapers.SKY]: OccasionShapes.ARCHES,
  [OccasionPapers.MUSTARD]: OccasionShapes.SUN,
  [OccasionPapers.MINT]: OccasionShapes.LEAF,
}

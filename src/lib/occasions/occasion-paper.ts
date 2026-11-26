export const OccasionPapers = {
  LILAC: 'lilac',
  ROSE: 'rose',
  SKY: 'sky',
  MUSTARD: 'mustard',
  MINT: 'mint',
} as const

export type OccasionPaper = (typeof OccasionPapers)[keyof typeof OccasionPapers]

interface OccasionPaperClassNames {
  paper: string
  gift: string
  paperFill: string
  giftFill: string
}

export const OCCASION_PAPER_CLASS_NAMES: Readonly<Record<OccasionPaper, OccasionPaperClassNames>> =
  {
    [OccasionPapers.LILAC]: {
      paper: 'bg-paper-lilac',
      gift: 'bg-gift-lilac',
      paperFill: 'fill-paper-lilac',
      giftFill: 'fill-gift-lilac',
    },
    [OccasionPapers.ROSE]: {
      paper: 'bg-paper-rose',
      gift: 'bg-gift-rose',
      paperFill: 'fill-paper-rose',
      giftFill: 'fill-gift-rose',
    },
    [OccasionPapers.SKY]: {
      paper: 'bg-paper-sky',
      gift: 'bg-gift-sky',
      paperFill: 'fill-paper-sky',
      giftFill: 'fill-gift-sky',
    },
    [OccasionPapers.MUSTARD]: {
      paper: 'bg-paper-mustard',
      gift: 'bg-gift-mustard',
      paperFill: 'fill-paper-mustard',
      giftFill: 'fill-gift-mustard',
    },
    [OccasionPapers.MINT]: {
      paper: 'bg-paper-mint',
      gift: 'bg-gift-mint',
      paperFill: 'fill-paper-mint',
      giftFill: 'fill-gift-mint',
    },
  }

const FALLBACK_OCCASION_PAPER = OccasionPapers.MINT

const OCCASION_PAPER_BY_SLUG: ReadonlyMap<string, OccasionPaper> = new Map([
  ['wedding', OccasionPapers.LILAC],
  ['birth', OccasionPapers.ROSE],
  ['first-apartment', OccasionPapers.SKY],
  ['birthday', OccasionPapers.MUSTARD],
  ['other', OccasionPapers.MINT],
])

export function getOccasionPaper(occasionSlug: string | null): OccasionPaper {
  if (occasionSlug === null) return FALLBACK_OCCASION_PAPER
  return OCCASION_PAPER_BY_SLUG.get(occasionSlug) ?? FALLBACK_OCCASION_PAPER
}

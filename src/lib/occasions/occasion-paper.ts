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
}

export const OCCASION_PAPER_CLASS_NAMES: Readonly<Record<OccasionPaper, OccasionPaperClassNames>> =
  {
    [OccasionPapers.LILAC]: { paper: 'bg-paper-lilac', gift: 'bg-gift-lilac' },
    [OccasionPapers.ROSE]: { paper: 'bg-paper-rose', gift: 'bg-gift-rose' },
    [OccasionPapers.SKY]: { paper: 'bg-paper-sky', gift: 'bg-gift-sky' },
    [OccasionPapers.MUSTARD]: { paper: 'bg-paper-mustard', gift: 'bg-gift-mustard' },
    [OccasionPapers.MINT]: { paper: 'bg-paper-mint', gift: 'bg-gift-mint' },
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

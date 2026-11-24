import { describe, expect, it } from 'vitest'
import { getOccasionPaper, OccasionPapers } from './occasion-paper'

describe('getOccasionPaper', () => {
  it.each([
    ['wedding', OccasionPapers.LILAC],
    ['birth', OccasionPapers.ROSE],
    ['first-apartment', OccasionPapers.SKY],
    ['birthday', OccasionPapers.MUSTARD],
    ['other', OccasionPapers.MINT],
  ])('maps the %s occasion to the %s paper', (occasionSlug, expectedPaper) => {
    expect(getOccasionPaper(occasionSlug)).toBe(expectedPaper)
  })

  it('falls back to the other paper for an unknown occasion', () => {
    expect(getOccasionPaper('graduation')).toBe(OccasionPapers.MINT)
  })

  it('falls back to the other paper when the list has no occasion', () => {
    expect(getOccasionPaper(null)).toBe(OccasionPapers.MINT)
  })

  it('does not resolve object prototype keys as occasions', () => {
    expect(getOccasionPaper('constructor')).toBe(OccasionPapers.MINT)
  })
})

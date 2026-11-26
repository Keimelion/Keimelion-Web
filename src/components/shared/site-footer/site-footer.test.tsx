import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createEnglishServerTranslate } from '@/test/server-translate-mock'
import { renderWithIntl } from '@/test/test-utils'
import { SiteFooter } from './site-footer'

vi.mock('@/lib/i18n/server-translate', () => ({
  getServerTranslate: () => Promise.resolve(createEnglishServerTranslate()),
}))

describe('SiteFooter', () => {
  it('lists the five legal pages and the feedback link', async () => {
    renderWithIntl(await SiteFooter({}))

    const nav = screen.getByRole('navigation', { name: 'Legal and feedback' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Legal notice', '/legal/notice'],
      ['Terms of use', '/legal/terms'],
      ['Privacy', '/legal/privacy'],
      ['Affiliate links', '/legal/affiliate-links'],
      ['Cookies', '/legal/cookies'],
      ['Feedback', '/feedback'],
    ])
  })

  it('signs off with the current year and Made in France', async () => {
    renderWithIntl(await SiteFooter({}))

    const year = String(new Date().getFullYear())
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      `© ${year} Keimêlion · Made in France`,
    )
  })
})

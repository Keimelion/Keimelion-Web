import { screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createEnglishServerTranslate } from '@/test/server-translate-mock'
import { renderWithIntl } from '@/test/test-utils'
import { SiteFooter } from './site-footer'

vi.mock('@/lib/i18n/server-translate', () => ({
  getServerTranslate: () => Promise.resolve(createEnglishServerTranslate()),
}))

const TEST_APP_VERSION = '1.2.3'

afterEach(() => {
  vi.unstubAllEnvs()
})

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

  it('signs off with the current year and the app version', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_VERSION', TEST_APP_VERSION)
    renderWithIntl(await SiteFooter({}))

    const year = String(new Date().getFullYear())
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      `© ${year} Keimêlion · v${TEST_APP_VERSION}`,
    )
  })
})

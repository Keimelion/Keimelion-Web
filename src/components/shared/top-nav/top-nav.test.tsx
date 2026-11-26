import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createEnglishServerTranslate } from '@/test/server-translate-mock'
import { renderWithIntl } from '@/test/test-utils'
import { TopNav } from './top-nav'

const navigation = vi.hoisted(() => ({ pathname: '/' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ refresh: vi.fn() }),
}))

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'system', setTheme: vi.fn() }),
}))

vi.mock('@/lib/i18n/server-translate', () => ({
  getServerTranslate: () => Promise.resolve(createEnglishServerTranslate()),
}))

beforeEach(() => {
  navigation.pathname = '/'
})

async function renderTopNav(isSignedIn: boolean): Promise<void> {
  renderWithIntl(
    await TopNav({ isSignedIn, accountMenu: <button type="button">Your account</button> }),
  )
}

function navLinkNames(): string[] {
  const nav = screen.getByRole('navigation', { name: 'Main navigation' })
  return within(nav)
    .getAllByRole('link')
    .map((link) => link.textContent)
}

describe('TopNav', () => {
  it('shows Browse, My lists, the New list button and the account menu when signed in', async () => {
    await renderTopNav(true)

    expect(navLinkNames()).toEqual(['Browse', 'My lists'])
    expect(screen.getByRole('link', { name: 'New list' })).toHaveAttribute('href', '/lists/new')
    expect(screen.getByRole('button', { name: 'Your account' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Log in' })).not.toBeInTheDocument()
  })

  it('shows Browse, Log in and Create my list to a guest', async () => {
    await renderTopNav(false)

    expect(navLinkNames()).toEqual(['Browse'])
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/auth/login')
    expect(screen.getByRole('link', { name: 'Create my list' })).toHaveAttribute(
      'href',
      '/lists/new',
    )
    expect(screen.queryByRole('button', { name: 'Your account' })).not.toBeInTheDocument()
  })

  it('links the logo home', async () => {
    await renderTopNav(false)

    expect(screen.getByRole('link', { name: /home/ })).toHaveAttribute('href', '/')
  })

  it('underlines the link of the current section in brand', async () => {
    navigation.pathname = '/lists/lea-axel'
    await renderTopNav(true)

    const activeLink = screen.getByRole('link', { name: 'My lists' })
    expect(activeLink).toHaveAttribute('aria-current', 'page')
    expect(activeLink).toHaveClass('shadow-[inset_0_-2px_0_var(--brand)]')
    expect(screen.getByRole('link', { name: 'Browse' })).not.toHaveAttribute('aria-current')
  })
})

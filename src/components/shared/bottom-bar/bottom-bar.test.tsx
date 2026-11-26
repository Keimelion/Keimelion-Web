import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { BottomBar } from './bottom-bar'

const navigation = vi.hoisted(() => ({ pathname: '/' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
}))

beforeEach(() => {
  navigation.pathname = '/'
})

function tabNames(): string[] {
  const bar = screen.getByRole('navigation', { name: 'Main navigation' })
  return within(bar)
    .getAllByRole('link')
    .map((link) => link.textContent)
}

describe('BottomBar', () => {
  it('offers Home, Browse, My lists and Profile to a signed-in user', () => {
    renderWithIntl(<BottomBar isSignedIn />)

    expect(tabNames()).toEqual(['Home', 'Browse', 'My lists', 'Profile'])
    expect(screen.getByRole('link', { name: 'My lists' })).toHaveAttribute('href', '/lists')
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile')
  })

  it('offers Home, Browse and Log in to a guest', () => {
    renderWithIntl(<BottomBar isSignedIn={false} />)

    expect(tabNames()).toEqual(['Home', 'Browse', 'Log in'])
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/auth/login')
  })

  it('marks the tab of the current section in brand pink', () => {
    navigation.pathname = '/lists/lea-axel'
    renderWithIntl(<BottomBar isSignedIn />)

    const activeTab = screen.getByRole('link', { name: 'My lists' })
    expect(activeTab).toHaveAttribute('aria-current', 'page')
    expect(activeTab).toHaveClass('text-brand')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('only marks Home on the home page itself', () => {
    renderWithIntl(<BottomBar isSignedIn={false} />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Browse' })).not.toHaveAttribute('aria-current')
  })
})

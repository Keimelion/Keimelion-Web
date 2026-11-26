import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reducedMotionPreference } from '@/test/reduced-motion-mock'
import { createEnglishServerTranslate } from '@/test/server-translate-mock'
import { renderWithIntl } from '@/test/test-utils'
import { NotFound } from './not-found'

vi.mock('@/lib/i18n/server-translate', () => ({
  getServerTranslate: () => Promise.resolve(createEnglishServerTranslate()),
}))

const navigation = vi.hoisted(() => ({ pathname: '/wishlist' }))

vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }))

vi.mock('motion/react', async (importOriginal) => {
  const { mockMotionWithReducedMotionPreference } = await import('@/test/reduced-motion-mock')
  return mockMotionWithReducedMotionPreference(importOriginal)
})

beforeEach(() => {
  reducedMotionPreference.isReduced = false
  navigation.pathname = '/wishlist'
})

function findStamp(): Element | null {
  return screen.getByText('ADDRESS UNKNOWN').parentElement
}

describe('NotFound', () => {
  it('tells the visitor the page does not exist, on a parcel stamped address unknown', async () => {
    const { container } = renderWithIntl(await NotFound({ isSignedIn: false }))

    expect(
      screen.getByRole('heading', { level: 1, name: "This page doesn't exist" }),
    ).toBeInTheDocument()
    expect(screen.getByText('return to sender')).toBeInTheDocument()
    const parcel = container.querySelector('svg[aria-hidden="true"]')
    expect(parcel).toHaveTextContent('404')
    expect(parcel).toHaveTextContent('ADDRESS UNKNOWN')
  })

  it('writes the requested address on the parcel label', async () => {
    const { container } = renderWithIntl(await NotFound({ isSignedIn: false }))

    expect(container.querySelector('svg')).toHaveTextContent('wishlist')
  })

  it('truncates a long address on the parcel label', async () => {
    navigation.pathname = '/lists/birthday-party-2026'
    const { container } = renderWithIntl(await NotFound({ isSignedIn: false }))

    expect(container.querySelector('svg')).toHaveTextContent('lists/bir…')
  })

  it('falls back to this-page when the address is empty', async () => {
    navigation.pathname = '/'
    const { container } = renderWithIntl(await NotFound({ isSignedIn: false }))

    expect(container.querySelector('svg')).toHaveTextContent('this-page')
  })

  it('offers home and creating a list to a guest', async () => {
    renderWithIntl(await NotFound({ isSignedIn: false }))

    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Create my list' })).toHaveAttribute(
      'href',
      '/lists/new',
    )
    expect(screen.queryByRole('link', { name: 'My lists' })).not.toBeInTheDocument()
  })

  it('offers home and my lists to a signed-in user', async () => {
    renderWithIntl(await NotFound({ isSignedIn: true }))

    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'My lists' })).toHaveAttribute('href', '/lists')
    expect(screen.queryByRole('link', { name: 'Create my list' })).not.toBeInTheDocument()
  })

  it('waits to thump the stamp down', async () => {
    renderWithIntl(await NotFound({ isSignedIn: false }))

    expect(findStamp()).toHaveStyle({ opacity: '0' })
  })

  it('shows the stamp at once when motion is reduced', async () => {
    reducedMotionPreference.isReduced = true
    renderWithIntl(await NotFound({ isSignedIn: false }))

    expect(findStamp()).not.toHaveStyle({ opacity: '0' })
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import { areDevPagesEnabled } from './dev-pages'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('areDevPagesEnabled', () => {
  it('enables the dev pages outside a production build', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('ENABLE_DEV_PAGES', '')

    expect(areDevPagesEnabled()).toBe(true)
  })

  it('hides the dev pages in a production build', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ENABLE_DEV_PAGES', '')

    expect(areDevPagesEnabled()).toBe(false)
  })

  it('shows the dev pages in a production build started with the opt-in flag', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ENABLE_DEV_PAGES', 'true')

    expect(areDevPagesEnabled()).toBe(true)
  })
})

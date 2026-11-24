import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { ThemePicker } from './theme-picker'

const setThemeMock = vi.fn()
const themeState: { theme: string | undefined } = { theme: 'system' }

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: themeState.theme, setTheme: setThemeMock }),
}))

beforeEach(() => {
  setThemeMock.mockClear()
  themeState.theme = 'system'
})

afterEach(() => {
  Reflect.deleteProperty(document, 'startViewTransition')
})

async function openPicker(): Promise<ReturnType<typeof userEvent.setup>> {
  const user = userEvent.setup()
  renderWithIntl(<ThemePicker />)
  await user.click(screen.getByRole('button', { name: 'Choose theme' }))
  return user
}

describe('ThemePicker', () => {
  it('offers the light, dark and system settings', async () => {
    await openPicker()

    expect(screen.getByRole('menuitemradio', { name: 'Light' })).toBeInTheDocument()
    expect(screen.getByRole('menuitemradio', { name: 'Dark' })).toBeInTheDocument()
    expect(screen.getByRole('menuitemradio', { name: 'System' })).toBeInTheDocument()
  })

  it('marks the stored setting as checked', async () => {
    themeState.theme = 'dark'
    await openPicker()

    expect(screen.getByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('checks system when no setting is stored yet', async () => {
    themeState.theme = undefined
    await openPicker()

    expect(screen.getByRole('menuitemradio', { name: 'System' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('applies the chosen setting directly when view transitions are unsupported', async () => {
    const user = await openPicker()
    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }))

    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })

  it('cross-fades the change through a view transition when supported', async () => {
    const startViewTransition = vi.fn((update: () => void) => {
      update()
    })
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      configurable: true,
    })
    const user = await openPicker()
    await user.click(screen.getByRole('menuitemradio', { name: 'Light' }))

    expect(startViewTransition).toHaveBeenCalledTimes(1)
    expect(setThemeMock).toHaveBeenCalledWith('light')
  })
})

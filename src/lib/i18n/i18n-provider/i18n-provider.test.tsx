import { act, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it } from 'vitest'
import { useLocaleStore } from '@/lib/i18n/locale-store'
import { useTranslate } from '@/lib/i18n/use-translate'
import { I18nProvider } from './i18n-provider'

function ThemeToggleLabel(): React.JSX.Element {
  const t = useTranslate()
  return <p>{t('common.theme_toggle.toggle')}</p>
}

beforeEach(() => {
  useLocaleStore.setState({ locale: 'en' })
})

describe('I18nProvider', () => {
  it('server-renders with the request locale so hydration matches the server HTML', () => {
    useLocaleStore.setState({ locale: 'fr' })
    const html = renderToString(
      <I18nProvider requestLocale="en">
        <ThemeToggleLabel />
      </I18nProvider>,
    )
    expect(html).toContain('Toggle theme')
  })

  it('renders the catalog of the store locale', () => {
    useLocaleStore.setState({ locale: 'fr' })
    render(
      <I18nProvider requestLocale="en">
        <ThemeToggleLabel />
      </I18nProvider>,
    )
    expect(screen.getByText('Changer de thème')).toBeInTheDocument()
  })

  it('switches catalog and document language when the locale changes', () => {
    render(
      <I18nProvider requestLocale="en">
        <ThemeToggleLabel />
      </I18nProvider>,
    )
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()

    act(() => {
      useLocaleStore.getState().setLocale('fr')
    })

    expect(screen.getByText('Changer de thème')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('fr')
  })
})

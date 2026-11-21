import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY } from './locale'
import type * as ResolveLocaleModule from './resolve-locale'

const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = value
    },
    removeItem: (key: string): void => {
      store = Object.fromEntries(Object.entries(store).filter(([k]) => k !== key))
    },
    clear: (): void => {
      store = {}
    },
  }
})()

Object.defineProperty(global, 'localStorage', { value: mockLocalStorage, writable: true })

beforeEach(() => {
  mockLocalStorage.clear()
  vi.unstubAllGlobals()
})

async function importFresh(): Promise<typeof ResolveLocaleModule> {
  vi.resetModules()
  return import('./resolve-locale')
}

describe('resolveInitialLocale', () => {
  it('returns stored locale when localStorage has a valid value', async () => {
    mockLocalStorage.setItem(LOCALE_STORAGE_KEY, 'fr')
    const { resolveInitialLocale } = await importFresh()
    expect(resolveInitialLocale()).toBe('fr')
  })

  it('ignores invalid stored locale and falls back to browser language', async () => {
    mockLocalStorage.setItem(LOCALE_STORAGE_KEY, 'de')
    vi.stubGlobal('navigator', { language: 'fr-FR', languages: ['fr-FR'] })
    const { resolveInitialLocale } = await importFresh()
    expect(resolveInitialLocale()).toBe('fr')
  })

  it('parses navigator.language stripping region code', async () => {
    vi.stubGlobal('navigator', { language: 'fr-FR', languages: ['fr-FR'] })
    const { resolveInitialLocale } = await importFresh()
    expect(resolveInitialLocale()).toBe('fr')
  })

  it('uses navigator.languages array and picks first match', async () => {
    vi.stubGlobal('navigator', { language: 'de-DE', languages: ['de-DE', 'en-US'] })
    const { resolveInitialLocale } = await importFresh()
    expect(resolveInitialLocale()).toBe('en')
  })

  it('falls back to en when browser locale is unsupported', async () => {
    vi.stubGlobal('navigator', { language: 'de-DE', languages: ['de-DE', 'ja-JP'] })
    const { resolveInitialLocale } = await importFresh()
    expect(resolveInitialLocale()).toBe('en')
  })

  it('persists resolved locale to localStorage', async () => {
    vi.stubGlobal('navigator', { language: 'fr-FR', languages: ['fr-FR'] })
    const { resolveInitialLocale } = await importFresh()
    resolveInitialLocale()
    expect(mockLocalStorage.getItem(LOCALE_STORAGE_KEY)).toBe('fr')
  })

  it('storage precedence: stored locale wins over browser locale', async () => {
    mockLocalStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    vi.stubGlobal('navigator', { language: 'fr-FR', languages: ['fr-FR'] })
    const { resolveInitialLocale } = await importFresh()
    expect(resolveInitialLocale()).toBe('en')
  })
})

describe('persistLocale', () => {
  it('writes the locale cookie read by server components', async () => {
    const { persistLocale } = await import('./resolve-locale')
    persistLocale('fr')
    expect(document.cookie).toContain(`${LOCALE_COOKIE_NAME}=fr`)
  })
})

describe('resolveRequestLocale', () => {
  it('uses the locale cookie first', async () => {
    const { resolveRequestLocale } = await importFresh()
    expect(resolveRequestLocale('fr', 'en-US,en;q=0.9')).toBe('fr')
  })

  it('ignores an unsupported cookie value and falls back to Accept-Language', async () => {
    const { resolveRequestLocale } = await importFresh()
    expect(resolveRequestLocale('de', 'fr-FR,fr;q=0.9')).toBe('fr')
  })

  it('picks the first supported language of Accept-Language', async () => {
    const { resolveRequestLocale } = await importFresh()
    expect(resolveRequestLocale(null, 'de-DE,de;q=0.9,fr;q=0.8,en;q=0.7')).toBe('fr')
  })

  it('falls back to en without cookie nor Accept-Language', async () => {
    const { resolveRequestLocale } = await importFresh()
    expect(resolveRequestLocale(null, null)).toBe('en')
  })

  it('falls back to en when no requested language is supported', async () => {
    const { resolveRequestLocale } = await importFresh()
    expect(resolveRequestLocale(null, 'de-DE,ja;q=0.5')).toBe('en')
  })
})

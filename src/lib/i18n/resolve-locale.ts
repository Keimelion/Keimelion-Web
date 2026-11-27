import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY } from './locale'
import type { Locale } from './locale'

const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
const ACCEPT_LANGUAGE_SEPARATOR = ','
const ACCEPT_LANGUAGE_PARAMETER_SEPARATOR = ';'
const COOKIE_SEPARATOR = ';'

function extractLanguageCode(browserLocale: string): string {
  return browserLocale.split('-')[0]?.trim().toLowerCase() ?? ''
}

function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

function resolveFromBrowser(navigatorLanguages: readonly string[]): Locale {
  for (const browserLocale of navigatorLanguages) {
    const code = extractLanguageCode(browserLocale)
    if (isValidLocale(code)) return code
  }
  return DEFAULT_LOCALE
}

function parseAcceptLanguage(acceptLanguage: string): string[] {
  return acceptLanguage
    .split(ACCEPT_LANGUAGE_SEPARATOR)
    .map((entry) => entry.split(ACCEPT_LANGUAGE_PARAMETER_SEPARATOR)[0]?.trim() ?? '')
    .filter((languageTag) => languageTag !== '')
}

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored !== null && isValidLocale(stored)) return stored
  } catch {
    return null
  }
  return null
}

function readCookieLocale(): Locale | null {
  if (typeof document === 'undefined') return null
  const cookiePrefix = `${LOCALE_COOKIE_NAME}=`
  const entry = document.cookie
    .split(COOKIE_SEPARATOR)
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(cookiePrefix))
  if (entry === undefined) return null
  const value = entry.slice(cookiePrefix.length)
  return isValidLocale(value) ? value : null
}

function writeLocaleCookie(locale: Locale): void {
  const secureFlag = window.location.protocol === 'https:' ? '; secure' : ''
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; samesite=lax${secureFlag}; max-age=${String(LOCALE_COOKIE_MAX_AGE_SECONDS)}`
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    writeLocaleCookie(locale)
  } catch {
    return
  }
}

export function resolveInitialLocale(): Locale {
  const stored = readStoredLocale()
  if (stored !== null) return stored

  const cookieLocale = readCookieLocale()
  if (cookieLocale !== null) {
    persistLocale(cookieLocale)
    return cookieLocale
  }

  const browserLocales =
    typeof navigator !== 'undefined'
      ? navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language]
      : [DEFAULT_LOCALE]

  const resolved = resolveFromBrowser(browserLocales)
  persistLocale(resolved)
  return resolved
}

export function resolveRequestLocale(
  cookieLocale: string | null,
  acceptLanguage: string | null,
): Locale {
  if (cookieLocale !== null && isValidLocale(cookieLocale)) return cookieLocale
  if (acceptLanguage === null) return DEFAULT_LOCALE
  return resolveFromBrowser(parseAcceptLanguage(acceptLanguage))
}

import { describe, expect, it } from 'vitest'
import { buildLoginPath, resolveLoginReturnPath } from './login-return-path'

describe('buildLoginPath', () => {
  it('carries the requested page, query included, in the next parameter', () => {
    expect(buildLoginPath('/lists/abc?tab=guests')).toBe(
      '/auth/login?next=%2Flists%2Fabc%3Ftab%3Dguests',
    )
  })
})

describe('resolveLoginReturnPath', () => {
  it('returns an internal path with its query and hash', () => {
    expect(resolveLoginReturnPath('/lists/abc?tab=guests#items')).toBe(
      '/lists/abc?tab=guests#items',
    )
  })

  it('falls back to my lists when there is no return path', () => {
    expect(resolveLoginReturnPath(null)).toBe('/lists')
    expect(resolveLoginReturnPath('')).toBe('/lists')
  })

  it.each([
    'https://evil.example/lists',
    '//evil.example/lists',
    '/\\evil.example',
    '/\t/evil.example',
    '/..//evil.example',
    '/lists/../..//evil.example',
    '/.//evil.example',
    'javascript:alert(1)',
    'lists',
  ])('rejects %s as an open redirect', (rawReturnPath) => {
    expect(resolveLoginReturnPath(rawReturnPath)).toBe('/lists')
  })

  it('never sends the user back to an account page', () => {
    expect(resolveLoginReturnPath('/auth/login')).toBe('/lists')
    expect(resolveLoginReturnPath('/auth/verify-email')).toBe('/lists')
  })
})

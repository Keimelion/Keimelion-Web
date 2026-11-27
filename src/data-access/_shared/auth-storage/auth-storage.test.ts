import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  SESSION_COOKIE_NAME,
  SessionStates,
  clearSession,
  getAccessToken,
  getRefreshToken,
  getSessionState,
  getPostVerificationPath,
  getStoredUser,
  isKnownRole,
  markAccountBanned,
  markEmailNotVerified,
  rotateTokens,
  saveSession,
  saveUnverifiedSession,
} from '@/data-access/_shared/auth-storage'
import type { UserDetailParsed } from '@keimelion/sdk/schemas'
import { subscribeToStorage } from '@/lib/subscribe-to-storage'

const STORED_USER_KEY = 'keimelion_user'
const REFRESH_TOKEN_KEY = 'keimelion_refresh_token'

function readSessionCookie(): string | null {
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${SESSION_COOKIE_NAME}=`))
  if (!match) return null
  const value = match.split('=')[1] ?? ''
  return value === '' ? null : value
}

function forceClearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`
}

const OWNER_USER: UserDetailParsed = {
  id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  email: 'owner@example.com',
  username: 'owner',
  authProvider: 'email' as const,
  role: 'user' as const,
  avatarImageId: null,
  avatar: null,
  isCgvAccepted: true,
  cgvAcceptedAt: null,
  isMarketingOptedIn: false,
  defaultCurrency: 'EUR' as const,
  emailVerifiedAt: null,
  lastActiveAt: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
}

beforeEach(() => {
  localStorage.clear()
  forceClearSessionCookie()
})

afterEach(() => {
  localStorage.clear()
  forceClearSessionCookie()
})

describe('isKnownRole', () => {
  it('accepts every role of the SDK', () => {
    expect(isKnownRole('user')).toBe(true)
    expect(isKnownRole('moderator')).toBe(true)
    expect(isKnownRole('admin')).toBe(true)
  })

  it('rejects unknown role strings', () => {
    expect(isKnownRole('superadmin')).toBe(false)
    expect(isKnownRole('')).toBe(false)
  })
})

describe('saveSession / clearSession', () => {
  it('writes token, refresh token, user, and role cookie atomically', () => {
    saveSession('tok-abc', 'refresh-abc', OWNER_USER)
    expect(getAccessToken()).toBe('tok-abc')
    expect(getRefreshToken()).toBe('refresh-abc')
    expect(getStoredUser()).toEqual(OWNER_USER)
    expect(readSessionCookie()).toBe('user')
  })

  it('clears token, refresh token, user, and cookie atomically', () => {
    saveSession('tok', 'refresh-tok', OWNER_USER)
    clearSession()
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
    expect(getStoredUser()).toBeNull()
    expect(readSessionCookie()).toBeNull()
  })
})

describe('saveUnverifiedSession', () => {
  it('keeps the refresh token and user without an access token or cookie, marked unverified', () => {
    saveSession('old-access', 'old-refresh', OWNER_USER)
    saveUnverifiedSession('refresh-unverified', OWNER_USER, null)
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBe('refresh-unverified')
    expect(getStoredUser()).toEqual(OWNER_USER)
    expect(readSessionCookie()).toBeNull()
    expect(getSessionState()).toBe(SessionStates.EMAIL_NOT_VERIFIED)
  })
})

describe('getPostVerificationPath', () => {
  it('keeps the signup return path through the token rotation that follows verification', () => {
    saveUnverifiedSession('refresh', OWNER_USER, '/invites/accept')
    rotateTokens('access', 'new-refresh')
    expect(getPostVerificationPath()).toBe('/invites/accept')
  })

  it('forgets it on a new sign-up without one, a login or a logout', () => {
    saveUnverifiedSession('refresh', OWNER_USER, '/invites/accept')
    saveUnverifiedSession('refresh', OWNER_USER, null)
    expect(getPostVerificationPath()).toBeNull()

    saveUnverifiedSession('refresh', OWNER_USER, '/invites/accept')
    saveSession('access', 'refresh', OWNER_USER)
    expect(getPostVerificationPath()).toBeNull()

    saveUnverifiedSession('refresh', OWNER_USER, '/invites/accept')
    clearSession()
    expect(getPostVerificationPath()).toBeNull()
  })
})

describe('same-tab notification', () => {
  it('tells the subscribers of this tab, after the call returns, when the session changes', async () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeToStorage(onChange)

    saveSession('access', 'refresh', OWNER_USER)
    expect(onChange).not.toHaveBeenCalled()
    await Promise.resolve()
    expect(onChange).toHaveBeenCalledOnce()

    clearSession()
    await Promise.resolve()
    expect(onChange).toHaveBeenCalledTimes(2)
    unsubscribe()
  })
})

describe('rotateTokens', () => {
  it('updates both tokens without touching the stored user or cookie', () => {
    saveSession('old-access', 'old-refresh', OWNER_USER)
    rotateTokens('new-access', 'new-refresh')
    expect(getAccessToken()).toBe('new-access')
    expect(getRefreshToken()).toBe('new-refresh')
    expect(getStoredUser()).toEqual(OWNER_USER)
    expect(readSessionCookie()).toBe('user')
  })
})

describe('getRefreshToken', () => {
  it('returns null when no refresh token is stored', () => {
    expect(getRefreshToken()).toBeNull()
  })

  it('returns the stored refresh token', () => {
    localStorage.setItem(REFRESH_TOKEN_KEY, 'rf-token')
    expect(getRefreshToken()).toBe('rf-token')
  })
})

describe('getSessionState', () => {
  it('is none without a refresh token', () => {
    expect(getSessionState()).toBe(SessionStates.NONE)
  })

  it('is active once a session is saved', () => {
    saveSession('access', 'refresh', OWNER_USER)
    expect(getSessionState()).toBe(SessionStates.ACTIVE)
  })

  it('is email_not_verified after markEmailNotVerified, keeping the refresh token and cookie', () => {
    saveSession('access', 'refresh', OWNER_USER)
    markEmailNotVerified()
    expect(getSessionState()).toBe(SessionStates.EMAIL_NOT_VERIFIED)
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBe('refresh')
    expect(getStoredUser()).toEqual(OWNER_USER)
    expect(readSessionCookie()).toBe('user')
  })

  it('goes back to active, cookie restored, when the tokens rotate', () => {
    saveUnverifiedSession('refresh', OWNER_USER, null)
    rotateTokens('new-access', 'new-refresh')
    expect(getSessionState()).toBe(SessionStates.ACTIVE)
    expect(readSessionCookie()).toBe('user')
  })

  it('is account_banned after markAccountBanned, with the session cleared', () => {
    saveSession('access', 'refresh', OWNER_USER)
    markAccountBanned()
    expect(getSessionState()).toBe(SessionStates.ACCOUNT_BANNED)
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
    expect(readSessionCookie()).toBeNull()
  })

  it('goes back to active when a new session is saved after a ban', () => {
    markAccountBanned()
    saveSession('access', 'refresh', OWNER_USER)
    expect(getSessionState()).toBe(SessionStates.ACTIVE)
  })

  it('goes back to none when the session is cleared', () => {
    saveSession('access', 'refresh', OWNER_USER)
    markEmailNotVerified()
    clearSession()
    expect(getSessionState()).toBe(SessionStates.NONE)
    saveSession('access', 'refresh', OWNER_USER)
    expect(getSessionState()).toBe(SessionStates.ACTIVE)
  })
})

describe('getStoredUser', () => {
  it('returns null when no user is stored', () => {
    expect(getStoredUser()).toBeNull()
  })

  it.each([
    ['is tampered', '{not valid json at all!!!}'],
    ['has the wrong shape', JSON.stringify({ foo: 'bar' })],
  ])('returns null without touching the session when stored JSON %s', (_case, storedUser) => {
    saveSession('tok', 'refresh-tok', OWNER_USER)
    localStorage.setItem(STORED_USER_KEY, storedUser)
    expect(getStoredUser()).toBeNull()
    expect(localStorage.getItem(STORED_USER_KEY)).toBe(storedUser)
    expect(getAccessToken()).toBe('tok')
    expect(getRefreshToken()).toBe('refresh-tok')
    expect(readSessionCookie()).toBe('user')
  })
})

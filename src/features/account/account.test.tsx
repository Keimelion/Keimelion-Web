import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { UserDetailParsed } from '@keimelion/sdk/schemas'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithQueryClient } from '@/test/test-utils'
import { AccountMenu } from './components/account-menu'

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }))
const authStorage = vi.hoisted(() => ({
  getStoredUser: vi.fn<() => Pick<UserDetailParsed, 'username' | 'email'> | null>(),
  getRefreshToken: vi.fn<() => string | null>(),
  clearSession: vi.fn(),
}))
const authApi = vi.hoisted(() => ({
  logout: vi.fn<(refreshToken: string | null) => Promise<void>>(),
}))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/data-access/_shared/auth-storage', () => authStorage)
vi.mock('@/data-access/auth/auth.api', () => authApi)

beforeEach(() => {
  vi.clearAllMocks()
  authStorage.getStoredUser.mockReturnValue({ username: 'léa', email: 'lea@example.com' })
  authStorage.getRefreshToken.mockReturnValue('refresh-token')
  authApi.logout.mockResolvedValue(undefined)
})

async function openAccountMenu(): Promise<ReturnType<typeof userEvent.setup>> {
  const user = userEvent.setup()
  renderWithQueryClient(<AccountMenu />)
  await user.click(screen.getByRole('button', { name: 'Your account' }))
  return user
}

describe('AccountMenu', () => {
  it('shows the initial of the signed-in user on the avatar', () => {
    renderWithQueryClient(<AccountMenu />)

    expect(screen.getByRole('button', { name: 'Your account' })).toHaveTextContent('L')
  })

  it('falls back to the email initial when the user has no username', () => {
    authStorage.getStoredUser.mockReturnValue({ username: null, email: 'axel@example.com' })
    renderWithQueryClient(<AccountMenu />)

    expect(screen.getByRole('button', { name: 'Your account' })).toHaveTextContent('A')
  })

  it('opens the profile, the legal pages and the feedback form', async () => {
    const user = await openAccountMenu()

    await user.click(screen.getByRole('menuitem', { name: 'Profile' }))
    expect(router.push).toHaveBeenCalledWith('/profile')

    await user.click(screen.getByRole('button', { name: 'Your account' }))
    await user.click(screen.getByRole('menuitem', { name: 'Send feedback' }))
    expect(router.push).toHaveBeenCalledWith('/feedback')
  })

  it('logs out: revokes the session, forgets it locally and goes home', async () => {
    const user = await openAccountMenu()

    await user.click(screen.getByRole('menuitem', { name: 'Log out' }))

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/')
    })
    expect(authApi.logout).toHaveBeenCalledWith('refresh-token')
    expect(authStorage.clearSession).toHaveBeenCalledTimes(1)
    expect(router.refresh).toHaveBeenCalledTimes(1)
  })

  it('still logs out locally when the API cannot be reached', async () => {
    authApi.logout.mockRejectedValue(new Error('offline'))
    const user = await openAccountMenu()

    await user.click(screen.getByRole('menuitem', { name: 'Log out' }))

    await waitFor(() => {
      expect(authStorage.clearSession).toHaveBeenCalledTimes(1)
    })
    expect(router.replace).toHaveBeenCalledWith('/')
  })
})

import { StrictMode } from 'react'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApiError } from '@keimelion/sdk/client'
import { ErrorCode } from '@keimelion/sdk/enums'
import type { UserDetailParsed } from '@keimelion/sdk/schemas'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithQueryClient } from '@/test/test-utils'
import { parseVerificationToken } from './auth.input-schemas'
import { CheckInboxScreen } from './components/check-inbox-screen'
import { ResendVerificationForm } from './components/resend-verification-form'
import { VerifyEmailScreen } from './components/verify-email-screen'
import { RESEND_COOLDOWN_SECONDS } from './hooks/use-resend-cooldown'

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }))
const authStorage = vi.hoisted(() => ({
  getStoredUser: vi.fn<() => Pick<UserDetailParsed, 'email'> | null>(),
  getRefreshToken: vi.fn<() => string | null>(),
}))
const sessionClient = vi.hoisted(() => ({ refreshAccessToken: vi.fn<() => Promise<string>>() }))
const authApi = vi.hoisted(() => ({
  verifyEmail: vi.fn<(token: string) => Promise<{ message: string }>>(),
  resendVerification: vi.fn<(email: string) => Promise<{ message: string }>>(),
}))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/data-access/_shared/auth-storage', () => authStorage)
vi.mock('@/data-access/_shared/client', () => sessionClient)
vi.mock('@/data-access/auth/auth.api', () => authApi)

const VALID_TOKEN = '3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b'
const STORED_EMAIL = 'lea@example.com'
const NEUTRAL_RESEND_MESSAGE = "If your account isn't verified yet, a new link has been sent."
const MS_PER_SECOND = 1000

function apiError(status: number, code: string): ApiError {
  return new ApiError({ status, code, message: code, metadata: {} })
}

function openVerificationLink(hash: string): void {
  window.history.replaceState(null, '', `/auth/verify-email${hash}`)
}

beforeEach(() => {
  vi.clearAllMocks()
  authStorage.getStoredUser.mockReturnValue(null)
  authStorage.getRefreshToken.mockReturnValue(null)
  sessionClient.refreshAccessToken.mockResolvedValue('access-token')
  authApi.verifyEmail.mockResolvedValue({ message: 'Email verified successfully' })
  authApi.resendVerification.mockResolvedValue({ message: 'generic' })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('parseVerificationToken', () => {
  it('reads the token from the URL fragment', () => {
    expect(parseVerificationToken(`#token=${VALID_TOKEN}`)).toBe(VALID_TOKEN)
  })

  it('returns null when the fragment has no token or a malformed one', () => {
    expect(parseVerificationToken('')).toBeNull()
    expect(parseVerificationToken('#token=')).toBeNull()
    expect(parseVerificationToken('#token=not-a-token')).toBeNull()
  })
})

describe('ResendVerificationForm', () => {
  it('shows an inline error and does not call the API for an invalid email', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<ResendVerificationForm defaultEmail="" />)

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Resend email' }))

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(authApi.resendVerification).not.toHaveBeenCalled()
  })

  it('sends the normalised email and shows a neutral message, never an affirmative one', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<ResendVerificationForm defaultEmail="" />)

    await user.type(screen.getByLabelText('Email'), '  Lea@Example.com ')
    await user.click(screen.getByRole('button', { name: 'Resend email' }))

    expect(await screen.findByRole('status')).toHaveTextContent(NEUTRAL_RESEND_MESSAGE)
    expect(authApi.resendVerification).toHaveBeenCalledWith(STORED_EMAIL)
  })

  it('disables the button for 60 seconds with a visible countdown after a resend', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    renderWithQueryClient(<ResendVerificationForm defaultEmail={STORED_EMAIL} />)

    await user.click(screen.getByRole('button', { name: 'Resend email' }))

    expect(await screen.findByRole('button', { name: 'Resend in 60 s' })).toBeDisabled()
    act(() => {
      vi.advanceTimersByTime(MS_PER_SECOND)
    })
    expect(screen.getByRole('button', { name: 'Resend in 59 s' })).toBeDisabled()
    act(() => {
      vi.advanceTimersByTime(RESEND_COOLDOWN_SECONDS * MS_PER_SECOND)
    })
    expect(screen.getByRole('button', { name: 'Resend email' })).toBeEnabled()
  })

  it('shows "too many attempts" when the API rate-limits the resend', async () => {
    authApi.resendVerification.mockRejectedValue(apiError(429, ErrorCode.RATE_LIMIT_EXCEEDED))
    const user = userEvent.setup()
    renderWithQueryClient(<ResendVerificationForm defaultEmail={STORED_EMAIL} />)

    await user.click(screen.getByRole('button', { name: 'Resend email' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Too many attempts, try again later.',
    )
    expect(screen.getByRole('button', { name: 'Resend email' })).toBeEnabled()
  })

  it('shows a connection message when the resend fails for another reason', async () => {
    authApi.resendVerification.mockRejectedValue(apiError(0, 'NETWORK_ERROR'))
    const user = userEvent.setup()
    renderWithQueryClient(<ResendVerificationForm defaultEmail={STORED_EMAIL} />)

    await user.click(screen.getByRole('button', { name: 'Resend email' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      "We couldn't send the email. Check your connection and try again.",
    )
  })
})

describe('CheckInboxScreen', () => {
  beforeEach(() => {
    authStorage.getStoredUser.mockReturnValue({ email: STORED_EMAIL })
    authStorage.getRefreshToken.mockReturnValue('refresh-token')
  })

  it('shows the stored email in the copy and prefills the resend field', () => {
    renderWithQueryClient(<CheckInboxScreen />)

    expect(screen.getByRole('heading', { level: 1, name: 'Check your inbox' })).toBeInTheDocument()
    expect(screen.getByText(new RegExp(STORED_EMAIL))).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveValue(STORED_EMAIL)
  })

  it('refreshes the session and opens the onboarding once the email is verified', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<CheckInboxScreen />)

    await user.click(screen.getByRole('button', { name: "I've verified my email" }))

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/lists/new')
    })
    expect(sessionClient.refreshAccessToken).toHaveBeenCalledOnce()
  })

  it('stays on the screen with a hint while the email is still not verified', async () => {
    sessionClient.refreshAccessToken.mockRejectedValue(apiError(403, ErrorCode.EMAIL_NOT_VERIFIED))
    const user = userEvent.setup()
    renderWithQueryClient(<CheckInboxScreen />)

    await user.click(screen.getByRole('button', { name: "I've verified my email" }))

    expect(
      await screen.findByText(
        "We haven't seen your confirmation yet. Open the link in the email, then try again.",
      ),
    ).toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it('sends the user to the login page when there is no session to refresh', async () => {
    authStorage.getStoredUser.mockReturnValue(null)
    authStorage.getRefreshToken.mockReturnValue(null)
    const user = userEvent.setup()
    renderWithQueryClient(<CheckInboxScreen />)

    expect(screen.getByLabelText('Email')).toHaveValue('')
    await user.click(screen.getByRole('button', { name: "I've verified my email" }))

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/auth/login')
    })
    expect(sessionClient.refreshAccessToken).not.toHaveBeenCalled()
  })
})

describe('VerifyEmailScreen', () => {
  it('verifies the token once, even in StrictMode, and clears it from the URL', async () => {
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(
      <StrictMode>
        <VerifyEmailScreen />
      </StrictMode>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Email verified' }),
    ).toBeInTheDocument()
    expect(authApi.verifyEmail).toHaveBeenCalledOnce()
    expect(authApi.verifyEmail).toHaveBeenCalledWith(VALID_TOKEN)
    expect(window.location.hash).toBe('')
  })

  it('asks a user without a stored session to log in', async () => {
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(<VerifyEmailScreen />)

    expect(
      await screen.findByText('Your account is ready. Please log in to continue.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/auth/login')
    expect(sessionClient.refreshAccessToken).not.toHaveBeenCalled()
  })

  it('refreshes a stored session and opens the onboarding', async () => {
    authStorage.getRefreshToken.mockReturnValue('refresh-token')
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(<VerifyEmailScreen />)

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/lists/new')
    })
    expect(sessionClient.refreshAccessToken).toHaveBeenCalledOnce()
  })

  it('falls back to "please log in" when the stored session cannot be refreshed', async () => {
    authStorage.getRefreshToken.mockReturnValue('refresh-token')
    sessionClient.refreshAccessToken.mockRejectedValue(apiError(0, 'NETWORK_ERROR'))
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(<VerifyEmailScreen />)

    expect(await screen.findByRole('link', { name: 'Log in' })).toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it('says it is redirecting to login, without a button, when the stored session has ended', async () => {
    authStorage.getRefreshToken.mockReturnValue('refresh-token')
    sessionClient.refreshAccessToken.mockRejectedValue(apiError(401, 'REFRESH_FAILED'))
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(<VerifyEmailScreen />)

    expect(
      await screen.findByText(
        "Your account is ready. Your session has expired, so we're taking you to the login page…",
      ),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Log in' })).not.toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it('resumes a stored session when a link that was already used is opened again', async () => {
    authApi.verifyEmail.mockRejectedValue(apiError(400, ErrorCode.BAD_REQUEST))
    authStorage.getRefreshToken.mockReturnValue('refresh-token')
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(<VerifyEmailScreen />)

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/lists/new')
    })
    expect(sessionClient.refreshAccessToken).toHaveBeenCalledOnce()
  })

  it('keeps the invalid-link state when the stored session is still unverified', async () => {
    authApi.verifyEmail.mockRejectedValue(apiError(400, ErrorCode.BAD_REQUEST))
    authStorage.getRefreshToken.mockReturnValue('refresh-token')
    sessionClient.refreshAccessToken.mockRejectedValue(apiError(403, ErrorCode.EMAIL_NOT_VERIFIED))
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(<VerifyEmailScreen />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'This link is no longer valid' }),
    ).toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it('tells the user to wait when the verification is rate-limited', async () => {
    authApi.verifyEmail.mockRejectedValue(apiError(429, ErrorCode.RATE_LIMIT_EXCEEDED))
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(<VerifyEmailScreen />)

    expect(await screen.findByRole('heading', { name: 'Too many attempts' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('shows the invalid-link state with the resend form when the API rejects the token', async () => {
    authApi.verifyEmail.mockRejectedValue(apiError(400, ErrorCode.BAD_REQUEST))
    authStorage.getStoredUser.mockReturnValue({ email: STORED_EMAIL })
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(<VerifyEmailScreen />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'This link is no longer valid' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveValue(STORED_EMAIL)
    expect(screen.getByRole('button', { name: 'Resend email' })).toBeEnabled()
  })

  it('shows the invalid-link state without calling the API when the token is missing', async () => {
    openVerificationLink('')
    renderWithQueryClient(<VerifyEmailScreen />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'This link is no longer valid' }),
    ).toBeInTheDocument()
    expect(authApi.verifyEmail).not.toHaveBeenCalled()
  })

  it('shows an error state with a retry when the API cannot be reached', async () => {
    authApi.verifyEmail.mockRejectedValueOnce(apiError(500, ErrorCode.INTERNAL_ERROR))
    openVerificationLink(`#token=${VALID_TOKEN}`)
    const user = userEvent.setup()
    renderWithQueryClient(<VerifyEmailScreen />)

    await user.click(await screen.findByRole('button', { name: 'Try again' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Email verified' }),
    ).toBeInTheDocument()
    expect(authApi.verifyEmail).toHaveBeenCalledTimes(2)
  })
})

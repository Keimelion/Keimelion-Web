import { StrictMode } from 'react'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApiError } from '@keimelion/sdk/client'
import { ErrorCode } from '@keimelion/sdk/enums'
import type { UserDetailParsed } from '@keimelion/sdk/schemas'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithQueryClient } from '@/test/test-utils'
import { mockDesktopViewport } from '@/test/viewport-mock'
import { parseResetToken, parseVerificationToken } from './auth.input-schemas'
import { CheckInboxScreen } from './components/check-inbox-screen'
import { ForgotPasswordScreen } from './components/forgot-password-screen'
import { LoginScreen } from './components/login-screen'
import { ResendVerificationForm } from './components/resend-verification-form'
import { ResetPasswordScreen } from './components/reset-password-screen'
import { SignupScreen } from './components/signup-screen'
import { VerifyEmailScreen } from './components/verify-email-screen'
import { RESEND_COOLDOWN_SECONDS } from './hooks/use-resend-cooldown'
import { PasswordStrengths, ratePasswordStrength } from './password-strength'

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }))
const authStorage = vi.hoisted(() => ({
  getStoredUser: vi.fn<() => Pick<UserDetailParsed, 'email'> | null>(),
  getRefreshToken: vi.fn<() => string | null>(),
  saveSession: vi.fn(),
  saveUnverifiedSession: vi.fn(),
  clearSession: vi.fn(),
}))
const sessionClient = vi.hoisted(() => ({ refreshAccessToken: vi.fn<() => Promise<string>>() }))
const authApi = vi.hoisted(() => ({
  verifyEmail: vi.fn<(token: string) => Promise<{ message: string }>>(),
  resendVerification: vi.fn<(email: string) => Promise<{ message: string }>>(),
  login: vi.fn(),
  register: vi.fn(),
  requestPasswordReset: vi.fn<(email: string) => Promise<{ message: string }>>(),
  resetPassword: vi.fn(),
}))

vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/data-access/_shared/auth-storage', () => authStorage)
vi.mock('@/data-access/_shared/client', () => sessionClient)
vi.mock('@/data-access/auth/auth.api', () => authApi)

const VALID_TOKEN = '3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b'
const STORED_EMAIL = 'lea@example.com'
const NEUTRAL_RESEND_MESSAGE = "If your account isn't verified yet, a new link has been sent."
const MS_PER_SECOND = 1000
const RESET_TOKEN = 'a'.repeat(64)
const WRAP_TIMEOUT_MS = 3000
const SIGNED_IN_USER = { id: 'user-1', email: STORED_EMAIL, role: 'user' }

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
  authApi.login.mockResolvedValue({
    accessToken: 'access',
    refreshToken: 'refresh',
    user: SIGNED_IN_USER,
  })
  authApi.register.mockResolvedValue({ refreshToken: 'refresh', user: SIGNED_IN_USER })
  authApi.requestPasswordReset.mockResolvedValue({ message: 'generic' })
  authApi.resetPassword.mockResolvedValue({ message: 'Password reset successfully' })
  mockDesktopViewport(false)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('parseResetToken', () => {
  it('reads the reset token from the URL fragment', () => {
    expect(parseResetToken(`#token=${RESET_TOKEN}`)).toBe(RESET_TOKEN)
  })

  it('returns null when the fragment carries no token', () => {
    expect(parseResetToken('')).toBeNull()
    expect(parseResetToken('#token=')).toBeNull()
  })
})

describe('ratePasswordStrength', () => {
  it('grows with length and variety', () => {
    expect(ratePasswordStrength('')).toBe(PasswordStrengths.EMPTY)
    expect(ratePasswordStrength('short')).toBe(PasswordStrengths.WEAK)
    expect(ratePasswordStrength('abcdefgh')).toBe(PasswordStrengths.FAIR)
    expect(ratePasswordStrength('abcdefgh12')).toBe(PasswordStrengths.STRONG)
    expect(ratePasswordStrength('a long sentence works')).toBe(PasswordStrengths.VERY_STRONG)
  })
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
    expect(screen.getByText(STORED_EMAIL)).toBeInTheDocument()
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
      await screen.findByRole('heading', { level: 1, name: 'Email confirmed' }),
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

  it('refreshes a stored session, wraps the gift once, then opens the onboarding', async () => {
    authStorage.getRefreshToken.mockReturnValue('refresh-token')
    openVerificationLink(`#token=${VALID_TOKEN}`)
    renderWithQueryClient(<VerifyEmailScreen />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Email confirmed' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/lists/new')
    expect(router.replace).not.toHaveBeenCalled()
    await waitFor(
      () => {
        expect(router.replace).toHaveBeenCalledExactlyOnceWith('/lists/new')
      },
      { timeout: WRAP_TIMEOUT_MS },
    )
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

    await waitFor(
      () => {
        expect(router.replace).toHaveBeenCalledWith('/lists/new')
      },
      { timeout: WRAP_TIMEOUT_MS },
    )
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
      await screen.findByRole('heading', { level: 1, name: 'Email confirmed' }),
    ).toBeInTheDocument()
    expect(authApi.verifyEmail).toHaveBeenCalledTimes(2)
  })
})

describe('LoginScreen', () => {
  function renderLogin(): void {
    renderWithQueryClient(<LoginScreen returnPath="/lists/42" signupHref="/auth/signup" />)
  }

  async function submitLogin(email: string, password: string): Promise<void> {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Email'), email)
    await user.type(screen.getByLabelText('Password'), password)
    await user.click(screen.getByRole('button', { name: 'Log in' }))
  }

  it('shows the email, password, forgot-password and sign-up links', () => {
    renderLogin()

    expect(screen.getByRole('heading', { level: 1, name: 'Log in' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute(
      'href',
      '/auth/forgot-password',
    )
    expect(screen.getByRole('link', { name: 'Create an account' })).toHaveAttribute(
      'href',
      '/auth/signup',
    )
    expect(screen.queryByRole('button', { name: /google/i })).not.toBeInTheDocument()
  })

  it('validates inline without calling the API', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
    expect(authApi.login).not.toHaveBeenCalled()
  })

  it('saves the session and goes back to the page the user came from', async () => {
    renderLogin()

    await submitLogin('  Lea@Example.com ', 'secret-password')

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/lists/42')
    })
    expect(authApi.login).toHaveBeenCalledWith({ email: STORED_EMAIL, password: 'secret-password' })
    expect(authStorage.saveSession).toHaveBeenCalledWith('access', 'refresh', SIGNED_IN_USER)
    expect(router.refresh).toHaveBeenCalledOnce()
  })

  it('shows wrong credentials under the password field', async () => {
    authApi.login.mockRejectedValue(apiError(401, ErrorCode.UNAUTHORIZED))
    renderLogin()

    await submitLogin(STORED_EMAIL, 'wrong-password')

    expect(await screen.findByText('Wrong email or password.')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true')
    expect(router.replace).not.toHaveBeenCalled()
  })

  it.each([
    [429, ErrorCode.RATE_LIMIT_EXCEEDED, 'Too many attempts. Wait a minute, then try again.'],
    [403, ErrorCode.ACCOUNT_BANNED, 'This account has been suspended.'],
    [
      0,
      'NETWORK_ERROR',
      "We can't reach Keimêlion right now. Check your connection and try again.",
    ],
  ])('maps a %i %s error to a targeted message', async (status, code, message) => {
    authApi.login.mockRejectedValue(apiError(status, code))
    renderLogin()

    await submitLogin(STORED_EMAIL, 'secret-password')

    expect(await screen.findByRole('alert')).toHaveTextContent(message)
  })

  it('maps a server validation issue to the field it names', async () => {
    authApi.login.mockRejectedValue(
      new ApiError({
        status: 422,
        code: ErrorCode.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        metadata: { issues: [{ path: 'email', message: 'Invalid email', code: 'invalid_format' }] },
      }),
    )
    renderLogin()

    await submitLogin(STORED_EMAIL, 'secret-password')

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('sends an unverified account to check-inbox with the typed email prefilled', async () => {
    authApi.login.mockRejectedValue(apiError(403, ErrorCode.EMAIL_NOT_VERIFIED))
    renderLogin()

    await submitLogin('unverified@example.com', 'secret-password')

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/auth/check-inbox')
    })
    renderWithQueryClient(<CheckInboxScreen />)
    expect(screen.getAllByLabelText('Email').at(-1)).toHaveValue('unverified@example.com')
    expect(screen.getByText('unverified@example.com')).toBeInTheDocument()
  })
})

describe('SignupScreen', () => {
  async function fillSignup(username: string, email: string, password: string): Promise<void> {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('First name'), username)
    await user.type(screen.getByLabelText('Email'), email)
    await user.type(screen.getByLabelText('Password'), password)
    await user.click(screen.getByRole('button', { name: 'Create my account' }))
  }

  it('shows the password rule and checks the fields inline', async () => {
    renderWithQueryClient(<SignupScreen loginHref="/auth/login" />)

    expect(
      screen.getByText('At least 8 characters. A short sentence works great.'),
    ).toBeInTheDocument()
    await fillSignup('Léa Marie', STORED_EMAIL, 'short')

    expect(
      await screen.findByText('Letters, numbers, - and _ only, no spaces.'),
    ).toBeInTheDocument()
    expect(screen.getByText('At least 8 characters. Add a few more.')).toBeInTheDocument()
    expect(authApi.register).not.toHaveBeenCalled()
  })

  it('keeps the unverified session and opens check-inbox after a sign-up', async () => {
    renderWithQueryClient(<SignupScreen loginHref="/auth/login" />)

    await fillSignup('Léa', 'Lea@Example.com', 'a long sentence works')

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/auth/check-inbox')
    })
    expect(authApi.register).toHaveBeenCalledWith({
      username: 'Léa',
      email: STORED_EMAIL,
      password: 'a long sentence works',
    })
    expect(authStorage.saveUnverifiedSession).toHaveBeenCalledWith('refresh', SIGNED_IN_USER)
  })

  it('shows a taken email under the email field', async () => {
    authApi.register.mockRejectedValue(apiError(409, ErrorCode.CONFLICT))
    renderWithQueryClient(<SignupScreen loginHref="/auth/login" />)

    await fillSignup('Léa', STORED_EMAIL, 'a long sentence works')

    expect(
      await screen.findByText('An account already exists with this email. Log in instead?'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('opens the terms in a sheet without losing the form', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<SignupScreen loginHref="/auth/login" />)
    await user.type(screen.getByLabelText('First name'), 'Léa')

    await user.click(screen.getByRole('link', { name: 'Terms of use' }))

    expect(await screen.findByRole('dialog', { name: 'Terms of use' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(screen.getByLabelText('First name')).toHaveValue('Léa')
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute(
      'href',
      '/legal/privacy',
    )
  })
})

describe('ForgotPasswordScreen', () => {
  it('confirms the link was sent without telling whether the account exists', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<ForgotPasswordScreen />)

    await user.type(screen.getByLabelText('Email'), STORED_EMAIL)
    await user.click(screen.getByRole('button', { name: 'Send the link' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      `Done. If ${STORED_EMAIL} has an account, the link is on its way. It's valid for 1 hour.`,
    )
    expect(authApi.requestPasswordReset).toHaveBeenCalledWith(STORED_EMAIL)
  })

  it('shows a rate limit inline', async () => {
    authApi.requestPasswordReset.mockRejectedValue(apiError(429, ErrorCode.RATE_LIMIT_EXCEEDED))
    const user = userEvent.setup()
    renderWithQueryClient(<ForgotPasswordScreen />)

    await user.type(screen.getByLabelText('Email'), STORED_EMAIL)
    await user.click(screen.getByRole('button', { name: 'Send the link' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Too many attempts. Wait a minute, then try again.',
    )
  })
})

describe('ResetPasswordScreen', () => {
  function openResetLink(hash: string): void {
    window.history.replaceState(null, '', `/auth/reset-password${hash}`)
  }

  async function chooseNewPassword(password: string, confirmation: string): Promise<void> {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('New password'), password)
    await user.type(screen.getByLabelText('Confirm'), confirmation)
    await user.click(screen.getByRole('button', { name: 'Save and log in' }))
  }

  it('shows the expired state with a new-link action when the link has no token', async () => {
    openResetLink('')
    renderWithQueryClient(<ResetPasswordScreen />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'This link has expired' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ask for a new one' })).toHaveAttribute(
      'href',
      '/auth/forgot-password',
    )
  })

  it('reads the token from the fragment, removes it from the URL and saves the password', async () => {
    openResetLink(`#token=${RESET_TOKEN}`)
    renderWithQueryClient(
      <StrictMode>
        <ResetPasswordScreen />
      </StrictMode>,
    )
    expect(window.location.hash).toBe('')

    await chooseNewPassword('a long sentence works', 'a long sentence works')

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/auth/login')
    })
    expect(authApi.resetPassword).toHaveBeenCalledWith({
      passwordResetToken: RESET_TOKEN,
      password: 'a long sentence works',
    })
    expect(authStorage.clearSession).toHaveBeenCalledOnce()
  })

  it('checks the confirmation inline', async () => {
    openResetLink(`#token=${RESET_TOKEN}`)
    renderWithQueryClient(<ResetPasswordScreen />)

    await chooseNewPassword('a long sentence works', 'another sentence')

    expect(await screen.findByText("The two passwords don't match.")).toBeInTheDocument()
    expect(authApi.resetPassword).not.toHaveBeenCalled()
  })

  it('switches to the expired state when the API rejects the token', async () => {
    authApi.resetPassword.mockRejectedValue(apiError(400, ErrorCode.INVALID_RESET_TOKEN))
    openResetLink(`#token=${RESET_TOKEN}`)
    renderWithQueryClient(<ResetPasswordScreen />)

    await chooseNewPassword('a long sentence works', 'a long sentence works')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'This link has expired' }),
    ).toBeInTheDocument()
  })
})

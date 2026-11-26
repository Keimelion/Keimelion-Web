import type { BrowserContext, Page } from '@playwright/test'
import type {
  ApiErrorBodyInput,
  RefreshResponseInput,
  ResendVerificationResponseInput,
  UserDetailInput,
  VerifyEmailResponseInput,
} from '@keimelion/sdk/schemas'
import { expect, expectNoAccessibilityViolations, test } from './support/test'

const VERIFY_EMAIL_ROUTE = 'POST /v1/auth/verify-email'
const RESEND_VERIFICATION_ROUTE = 'POST /v1/auth/resend-verification'
const REFRESH_ROUTE = 'POST /v1/auth/refresh'
const VALID_TOKEN = '3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b'
const MOBILE_VIEWPORT = { width: 390, height: 844 }
const DESKTOP_VIEWPORT = { width: 1440, height: 900 }
const COLOR_SCHEMES = ['light', 'dark'] as const
const HTTP_OK = 200
const HTTP_BAD_REQUEST = 400
const HTTP_FORBIDDEN = 403
const HTTP_TOO_MANY_REQUESTS = 429
const FAILED_RESOURCE_ERROR = 'Failed to load resource: the server responded with a status of'

const UNVERIFIED_USER: UserDetailInput = {
  id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  email: 'lea@example.com',
  username: null,
  authProvider: 'email',
  role: 'user',
  avatarImageId: null,
  avatar: null,
  isCgvAccepted: true,
  cgvAcceptedAt: '2026-11-01T00:00:00.000Z',
  isMarketingOptedIn: false,
  defaultCurrency: 'EUR',
  emailVerifiedAt: null,
  lastActiveAt: null,
  createdAt: '2026-11-01T00:00:00.000Z',
  updatedAt: '2026-11-01T00:00:00.000Z',
}

const GENERIC_RESEND_RESPONSE: ResendVerificationResponseInput = {
  message: 'If the account exists and is not verified, a new email has been sent',
}
const VERIFIED_RESPONSE: VerifyEmailResponseInput = { message: 'Email verified successfully' }
const REFRESHED_TOKENS: RefreshResponseInput = {
  accessToken: 'fresh-access',
  refreshToken: 'fresh-refresh',
}

function errorBody(code: string): ApiErrorBodyInput {
  return { message: code, code, metadata: {} }
}

async function storeUnverifiedSession(context: BrowserContext): Promise<void> {
  await context.addInitScript((user) => {
    if (sessionStorage.getItem('seeded') !== null) return
    sessionStorage.setItem('seeded', 'true')
    localStorage.setItem('keimelion_refresh_token', 'unverified-refresh')
    localStorage.setItem('keimelion_user', JSON.stringify(user))
    localStorage.setItem('keimelion_email_not_verified', String(Date.now()))
  }, UNVERIFIED_USER)
}

function expectOnlyFailedResourceErrors(consoleErrors: string[]): void {
  expect(consoleErrors.every((message) => message.startsWith(FAILED_RESOURCE_ERROR))).toBe(true)
  consoleErrors.length = 0
}

async function heading(page: Page, name: string): Promise<void> {
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible()
}

for (const colorScheme of COLOR_SCHEMES) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme })

    for (const viewport of [MOBILE_VIEWPORT, DESKTOP_VIEWPORT]) {
      const size = `${String(viewport.width)} px`

      test(`check your inbox shows the email and the resend form at ${size}`, async ({
        page,
        context,
      }) => {
        await page.setViewportSize(viewport)
        await storeUnverifiedSession(context)
        await page.goto('/auth/check-inbox')

        await heading(page, 'Check your inbox')
        await expect(
          page.getByText('We sent a confirmation link to lea@example.com.'),
        ).toBeVisible()
        await expect(page.getByLabel('Email')).toHaveValue('lea@example.com')
        await expectNoAccessibilityViolations(page)
      })

      test(`an expired link offers a new one at ${size}`, async ({ page, api, consoleErrors }) => {
        await page.setViewportSize(viewport)
        api.respond(VERIFY_EMAIL_ROUTE, {
          status: HTTP_BAD_REQUEST,
          body: errorBody('BAD_REQUEST'),
        })
        api.respond(RESEND_VERIFICATION_ROUTE, { status: HTTP_OK, body: GENERIC_RESEND_RESPONSE })
        await page.goto(`/auth/verify-email#token=${VALID_TOKEN}`)

        await heading(page, 'This link is no longer valid')
        await page.getByLabel('Email').fill('lea@example.com')
        await page.getByRole('button', { name: 'Resend email' }).click()
        await expect(page.getByRole('status').last()).toHaveText(
          "If your account isn't verified yet, a new link has been sent.",
        )
        await expect(page.getByRole('button', { name: /Resend in \d+ s/ })).toBeDisabled()
        await expectNoAccessibilityViolations(page)
        expectOnlyFailedResourceErrors(consoleErrors)
      })

      test(`a valid link without a session asks to log in at ${size}`, async ({ page, api }) => {
        await page.setViewportSize(viewport)
        api.respond(VERIFY_EMAIL_ROUTE, { status: HTTP_OK, body: VERIFIED_RESPONSE })
        await page.goto(`/auth/verify-email#token=${VALID_TOKEN}`)

        await heading(page, 'Email confirmed')
        await expect(page.getByRole('link', { name: 'Log in' }).last()).toHaveAttribute(
          'href',
          '/auth/login',
        )
        expect(new URL(page.url()).hash).toBe('')
        expect(api.handledRequests).toEqual([VERIFY_EMAIL_ROUTE])
        await expectNoAccessibilityViolations(page)
      })
    }
  })
}

test('a link without a token shows the invalid state without calling the API', async ({
  page,
  api,
}) => {
  await page.goto('/auth/verify-email')

  await heading(page, 'This link is no longer valid')
  expect(api.handledRequests).toEqual([])
})

test('a valid link with a stored session signs the user in and opens the onboarding', async ({
  page,
  context,
  api,
}) => {
  await storeUnverifiedSession(context)
  api.respond(VERIFY_EMAIL_ROUTE, { status: HTTP_OK, body: VERIFIED_RESPONSE })
  api.respond(REFRESH_ROUTE, { status: HTTP_OK, body: REFRESHED_TOKENS })
  await page.goto(`/auth/verify-email#token=${VALID_TOKEN}`)

  await expect(page).toHaveURL('/lists/new')
  expect(api.handledRequests).toEqual([VERIFY_EMAIL_ROUTE, REFRESH_ROUTE])
})

test('"I\'ve verified" keeps the session while the email is still unverified', async ({
  page,
  context,
  api,
  consoleErrors,
}) => {
  await storeUnverifiedSession(context)
  api.respond(REFRESH_ROUTE, { status: HTTP_FORBIDDEN, body: errorBody('EMAIL_NOT_VERIFIED') })
  await page.goto('/auth/check-inbox')

  await page.getByRole('button', { name: "I've verified my email" }).click()

  await expect(
    page.getByText(
      "We haven't seen your confirmation yet. Open the link in the email, then try again.",
    ),
  ).toBeVisible()
  await expect(page).toHaveURL('/auth/check-inbox')
  expect(await page.evaluate(() => localStorage.getItem('keimelion_refresh_token'))).toBe(
    'unverified-refresh',
  )
  expectOnlyFailedResourceErrors(consoleErrors)
})

test('"I\'ve verified" opens the onboarding once the email is verified', async ({
  page,
  context,
  api,
}) => {
  await storeUnverifiedSession(context)
  api.respond(REFRESH_ROUTE, { status: HTTP_OK, body: REFRESHED_TOKENS })
  await page.goto('/auth/check-inbox')

  await page.getByRole('button', { name: "I've verified my email" }).click()

  await expect(page).toHaveURL('/lists/new')
})

test('a rate-limited resend tells the user to try again later', async ({
  page,
  api,
  consoleErrors,
}) => {
  api.respond(RESEND_VERIFICATION_ROUTE, {
    status: HTTP_TOO_MANY_REQUESTS,
    body: errorBody('RATE_LIMIT_EXCEEDED'),
  })
  await page.goto('/auth/check-inbox')

  await page.getByLabel('Email').fill('lea@example.com')
  await page.getByRole('button', { name: 'Resend email' }).click()

  await expect(page.getByText('Too many attempts, try again later.')).toBeVisible()
  expectOnlyFailedResourceErrors(consoleErrors)
})

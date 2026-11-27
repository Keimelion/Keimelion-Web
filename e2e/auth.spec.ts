import type { Page } from '@playwright/test'
import type {
  ApiErrorBodyInput,
  ForgotPasswordResponseInput,
  LoginResponseInput,
  RegisterResponseInput,
  ResetPasswordResponseInput,
  UserDetailInput,
} from '@keimelion/sdk/schemas'
import { expect, expectNoAccessibilityViolations, test } from './support/test'

const LOGIN_ROUTE = 'POST /v1/auth/login'
const REGISTER_ROUTE = 'POST /v1/auth/register'
const FORGOT_PASSWORD_ROUTE = 'POST /v1/auth/forgot-password'
const RESET_PASSWORD_ROUTE = 'POST /v1/auth/reset-password'
const MOBILE_VIEWPORT = { width: 390, height: 844 }
const DESKTOP_VIEWPORT = { width: 1440, height: 900 }
const COLOR_SCHEMES = ['light', 'dark'] as const
const HTTP_OK = 200
const HTTP_CREATED = 201
const HTTP_BAD_REQUEST = 400
const HTTP_UNAUTHORIZED = 401
const HTTP_FORBIDDEN = 403
const RESET_TOKEN = 'a'.repeat(64)
const PASSWORD = 'a long sentence works'
const FAILED_RESOURCE_ERROR = 'Failed to load resource: the server responded with a status of'

const USER: UserDetailInput = {
  id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  email: 'lea@example.com',
  username: 'Léa',
  authProvider: 'email',
  role: 'user',
  avatarImageId: null,
  avatar: null,
  isCgvAccepted: true,
  cgvAcceptedAt: '2026-11-01T00:00:00.000Z',
  isMarketingOptedIn: false,
  defaultCurrency: 'EUR',
  emailVerifiedAt: '2026-11-01T00:00:00.000Z',
  lastActiveAt: null,
  createdAt: '2026-11-01T00:00:00.000Z',
  updatedAt: '2026-11-01T00:00:00.000Z',
}

const LOGIN_RESPONSE: LoginResponseInput = {
  accessToken: 'access',
  refreshToken: 'refresh',
  user: USER,
}
const REGISTER_RESPONSE: RegisterResponseInput = {
  refreshToken: 'refresh',
  user: { ...USER, emailVerifiedAt: null },
}
const FORGOT_PASSWORD_RESPONSE: ForgotPasswordResponseInput = {
  message: 'If this email is registered, a reset link has been sent',
}
const RESET_PASSWORD_RESPONSE: ResetPasswordResponseInput = {
  message: 'Password reset successfully',
}

function errorBody(code: string): ApiErrorBodyInput {
  return { message: code, code, metadata: {} }
}

function expectOnlyFailedResourceErrors(consoleErrors: string[]): void {
  expect(consoleErrors.every((message) => message.startsWith(FAILED_RESOURCE_ERROR))).toBe(true)
  consoleErrors.length = 0
}

async function heading(page: Page, name: string): Promise<void> {
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible()
}

async function logIn(page: Page, email: string): Promise<void> {
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
  await page.getByRole('button', { name: 'Log in' }).click()
}

for (const colorScheme of COLOR_SCHEMES) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme })

    for (const viewport of [MOBILE_VIEWPORT, DESKTOP_VIEWPORT]) {
      const size = `${String(viewport.width)} px`

      for (const { path, title } of [
        { path: '/auth/login', title: 'Log in' },
        { path: '/auth/signup', title: 'Create your account' },
        { path: '/auth/forgot-password', title: 'Forgot your password?' },
        { path: `/auth/reset-password#token=${RESET_TOKEN}`, title: 'New password' },
      ]) {
        test(`${path.split('#')[0] ?? path} has no accessibility violation at ${size}`, async ({
          page,
        }) => {
          await page.setViewportSize(viewport)
          await page.goto(path)

          await heading(page, title)
          await expectNoAccessibilityViolations(page)
        })
      }
    }
  })
}

test('the desktop log in shows the journey, the phone shows the hero', async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT)
  await page.goto('/auth/login')
  await expect(page.getByText('From an idea to a wrapped gift.')).toBeVisible()

  await page.setViewportSize(MOBILE_VIEWPORT)
  await expect(page.getByText('From an idea to a wrapped gift.')).toBeHidden()
  await expect(page.getByRole('link', { name: 'Back' })).toBeVisible()
})

test('logging in returns to the page the user asked for', async ({ page, api }) => {
  api.respond(LOGIN_ROUTE, { status: HTTP_OK, body: LOGIN_RESPONSE })
  await page.goto('/auth/login?next=%2Flists%3Ftab%3Dshared')

  await logIn(page, 'lea@example.com')

  await expect(page).toHaveURL('/lists?tab=shared')
  await expect(page.getByRole('heading', { level: 1, name: 'My lists' })).toBeVisible()
})

test('wrong credentials show inline under the password', async ({ page, api, consoleErrors }) => {
  api.respond(LOGIN_ROUTE, { status: HTTP_UNAUTHORIZED, body: errorBody('UNAUTHORIZED') })
  await page.goto('/auth/login')

  await logIn(page, 'lea@example.com')

  await expect(page.getByText('Wrong email or password.')).toBeVisible()
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('aria-invalid', 'true')
  await expect(page).toHaveURL('/auth/login')
  expectOnlyFailedResourceErrors(consoleErrors)
})

test('an unverified login opens check-inbox with the typed email', async ({
  page,
  api,
  consoleErrors,
}) => {
  api.respond(LOGIN_ROUTE, { status: HTTP_FORBIDDEN, body: errorBody('EMAIL_NOT_VERIFIED') })
  await page.goto('/auth/login')

  await logIn(page, 'unverified@example.com')

  await expect(page).toHaveURL('/auth/check-inbox')
  await heading(page, 'Check your inbox')
  await expect(page.getByLabel('Email')).toHaveValue('unverified@example.com')
  expectOnlyFailedResourceErrors(consoleErrors)
})

test('signing up keeps the form while reading the terms, then opens check-inbox', async ({
  page,
  api,
}) => {
  api.respond(REGISTER_ROUTE, { status: HTTP_CREATED, body: REGISTER_RESPONSE })
  await page.goto('/auth/signup')
  await page.getByLabel('First name').fill('Léa')
  await page.getByLabel('Email').fill('lea@example.com')
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)

  await page.getByRole('link', { name: 'Terms of use' }).click()
  await expect(page.getByRole('dialog', { name: 'Terms of use' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page).toHaveURL('/auth/signup')
  await expect(page.getByLabel('First name')).toHaveValue('Léa')

  await page.getByRole('button', { name: 'Create my account' }).click()

  await expect(page).toHaveURL('/auth/check-inbox')
  await expect(page.getByText('lea@example.com', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Email')).toHaveValue('lea@example.com')
})

test('forgot password confirms without revealing the account', async ({ page, api }) => {
  api.respond(FORGOT_PASSWORD_ROUTE, { status: HTTP_OK, body: FORGOT_PASSWORD_RESPONSE })
  await page.goto('/auth/forgot-password')

  await page.getByLabel('Email').fill('lea@example.com')
  await page.getByRole('button', { name: 'Send the link' }).click()

  await expect(page.getByRole('status').filter({ hasText: 'Done.' })).toHaveText(
    "Done. If lea@example.com has an account, the link is on its way. It's valid for 1 hour.",
  )
})

test('a reset link sets the new password, then opens the login page', async ({ page, api }) => {
  api.respond(RESET_PASSWORD_ROUTE, { status: HTTP_OK, body: RESET_PASSWORD_RESPONSE })
  await page.goto(`/auth/reset-password#token=${RESET_TOKEN}`)

  await heading(page, 'New password')
  await expect(page).toHaveURL('/auth/reset-password')
  await page.getByLabel('New password').fill(PASSWORD)
  await page.getByLabel('Confirm').fill(PASSWORD)
  await page.getByRole('button', { name: 'Save and log in' }).click()

  await expect(page).toHaveURL('/auth/login')
  await expect(page.getByText('Password updated. Log in with your new password.')).toBeVisible()
})

test('an expired reset link offers a new one', async ({ page, api, consoleErrors }) => {
  api.respond(RESET_PASSWORD_ROUTE, {
    status: HTTP_BAD_REQUEST,
    body: errorBody('INVALID_RESET_TOKEN'),
  })
  await page.goto(`/auth/reset-password#token=${RESET_TOKEN}`)

  await page.getByLabel('New password').fill(PASSWORD)
  await page.getByLabel('Confirm').fill(PASSWORD)
  await page.getByRole('button', { name: 'Save and log in' }).click()

  await heading(page, 'This link has expired')
  await expect(page.getByRole('link', { name: 'Ask for a new one' })).toHaveAttribute(
    'href',
    '/auth/forgot-password',
  )
  expectOnlyFailedResourceErrors(consoleErrors)
})

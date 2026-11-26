import type { Page } from '@playwright/test'
import { expect, expectNoAccessibilityViolations, test } from './support/test'

const SESSION_COOKIE_NAME = 'keimelion_web_session'
const SIGNED_IN_ROLE = 'user'

const PAGES = [
  { path: '/', heading: 'Wishlists made together' },
  { path: '/auth/login', heading: 'Sign in' },
  { path: '/auth/verify-email', heading: 'This link is no longer valid' },
  { path: '/auth/check-inbox', heading: 'Check your inbox' },
  { path: '/auth/reset-password', heading: 'Choose a new password' },
  { path: '/invites/accept', heading: 'Join a list' },
  { path: '/dev/tokens', heading: 'Design tokens' },
  { path: '/dev/kit', heading: 'UI kit' },
]

const COLOR_SCHEMES = ['light', 'dark'] as const

for (const colorScheme of COLOR_SCHEMES) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme })

    for (const { path, heading } of PAGES) {
      test(`${path} renders without accessibility violations`, async ({ page }) => {
        await page.goto(path)

        await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
        const hasDarkClass = await page
          .locator('html')
          .evaluate((root) => root.classList.contains('dark'))
        expect(hasDarkClass).toBe(colorScheme === 'dark')
        await expectNoAccessibilityViolations(page)
      })
    }
  })
}

test('a guest opening a signed-in page is sent to the login page', async ({ page }) => {
  await page.goto('/lists')

  await expect(page).toHaveURL('/auth/login?next=%2Flists')
})

test('a signed-in user reaches the signed-in pages', async ({ page, context, baseURL }) => {
  await context.addCookies([
    { name: SESSION_COOKIE_NAME, value: SIGNED_IN_ROLE, url: baseURL ?? '' },
  ])
  await page.goto('/lists')

  await expect(page.getByRole('heading', { level: 1, name: 'My lists' })).toBeVisible()
})

test('the theme picker switches between light, dark and system and keeps the choice', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const root = page.locator('html')
  await expect(root).toHaveClass(/dark/)

  await selectTheme(page, 'Light')
  await expect(root).not.toHaveClass(/dark/)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(root).not.toHaveClass(/dark/)

  await selectTheme(page, 'Dark')
  await expect(root).toHaveClass(/dark/)

  await page.emulateMedia({ colorScheme: 'light' })
  await selectTheme(page, 'System')
  await expect(root).not.toHaveClass(/dark/)
})

test('the locale picker switches client and server copy to French and keeps it', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Select language' }).click()
  await page.getByRole('menuitem', { name: 'Français' }).click()

  await expect(
    page.getByRole('heading', { level: 1, name: "Des listes d'envies à plusieurs" }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Choisir la langue' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')

  await page.goto('/auth/login')
  await expect(page.getByRole('heading', { level: 1, name: 'Se connecter' })).toBeVisible()
  await expect(page).toHaveTitle('Se connecter · Keimelion')
})

test.describe('first visit from a French browser', () => {
  test.use({ locale: 'fr-FR' })

  test('renders in French from Accept-Language without a hydration mismatch', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { level: 1, name: "Des listes d'envies à plusieurs" }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Choisir la langue' })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  })
})

async function selectTheme(page: Page, themeLabel: string): Promise<void> {
  const option = page.getByRole('menuitemradio', { name: themeLabel })
  await expect(async () => {
    await page.getByRole('button', { name: 'Choose theme' }).click()
    await expect(option).toBeVisible({ timeout: 1000 })
  }).toPass()
  await option.click()
}

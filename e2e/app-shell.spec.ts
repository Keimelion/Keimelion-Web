import type { BrowserContext, Page } from '@playwright/test'
import { expect, expectNoAccessibilityViolations, test } from './support/test'

const SESSION_COOKIE_NAME = 'keimelion_web_session'
const SIGNED_IN_ROLE = 'user'
const MOBILE_VIEWPORT = { width: 390, height: 844 }
const DESKTOP_VIEWPORT = { width: 1440, height: 900 }
const HTTP_NOT_FOUND = 404
const COLOR_SCHEMES = ['light', 'dark'] as const
const DOCUMENT_NOT_FOUND_ERROR =
  'Failed to load resource: the server responded with a status of 404 (Not Found)'

async function signIn(context: BrowserContext, baseURL: string | undefined): Promise<void> {
  await context.addCookies([
    { name: SESSION_COOKIE_NAME, value: SIGNED_IN_ROLE, url: baseURL ?? '' },
  ])
}

async function mainNavigationLinks(page: Page): Promise<string[]> {
  return page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').allInnerTexts()
}

test.describe('mobile', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test('a guest gets Home, Browse and Log in in the bottom bar, Home active', async ({ page }) => {
    await page.goto('/')

    expect(await mainNavigationLinks(page)).toEqual(['Home', 'Browse', 'Log in'])
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.getByRole('contentinfo')).toBeVisible()
    await expectNoAccessibilityViolations(page)
  })

  test('a signed-in user gets Home, Browse, My lists and Profile, My lists active', async ({
    page,
    context,
    baseURL,
  }) => {
    await signIn(context, baseURL)
    await page.goto('/lists')

    expect(await mainNavigationLinks(page)).toEqual(['Home', 'Browse', 'My lists', 'Profile'])
    await expect(page.getByRole('link', { name: 'My lists' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.getByRole('contentinfo')).toBeHidden()
    await expectNoAccessibilityViolations(page)
  })

  test('a guest page from a shared link has no bottom bar', async ({ page }) => {
    await page.goto('/invites/accept')

    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Select language' })).toBeVisible()
  })
})

test.describe('desktop', () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test('a guest gets Browse, Log in and Create my list in the top nav', async ({ page }) => {
    await page.goto('/')

    expect(await mainNavigationLinks(page)).toEqual(['Browse'])
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Create my list' })).toBeVisible()
  })

  test('a signed-in user gets My lists underlined, New list and the account menu', async ({
    page,
    context,
    baseURL,
  }) => {
    await signIn(context, baseURL)
    await page.goto('/lists')

    expect(await mainNavigationLinks(page)).toEqual(['Browse', 'My lists'])
    await expect(page.getByRole('link', { name: 'My lists' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.getByRole('link', { name: 'New list' })).toBeVisible()
    await page.getByRole('button', { name: 'Your account' }).click()
    await expect(page.getByRole('menuitem', { name: 'Log out' })).toBeVisible()
  })

  test('the footer carries the five legal links, Feedback, © and the app version', async ({
    page,
  }) => {
    await page.goto('/')

    const footer = page.getByRole('contentinfo')
    expect(await footer.getByRole('navigation').getByRole('link').allInnerTexts()).toEqual([
      'Legal notice',
      'Terms of use',
      'Privacy',
      'Affiliate links',
      'Cookies',
      'Feedback',
    ])
    await expect(footer).toContainText(/© \d{4} Keimêlion · v\d+\.\d+\.\d+/)
  })
})

test('a signed-in user opening the login page goes back to the page they asked for', async ({
  page,
  context,
  baseURL,
}) => {
  await signIn(context, baseURL)
  await page.goto('/auth/login?next=%2Flists%3Ftab%3Dshared')

  await expect(page).toHaveURL('/lists?tab=shared')
})

for (const colorScheme of COLOR_SCHEMES) {
  test.describe(`404 in the ${colorScheme} theme`, () => {
    test.use({ colorScheme })

    for (const viewport of [MOBILE_VIEWPORT, DESKTOP_VIEWPORT]) {
      test(`an unknown route shows the lost parcel at ${String(viewport.width)} px`, async ({
        page,
        consoleErrors,
      }) => {
        await page.setViewportSize(viewport)
        const response = await page.goto('/this-page-does-not-exist')

        expect(response?.status()).toBe(HTTP_NOT_FOUND)
        await expect(
          page.getByRole('heading', { level: 1, name: "This page doesn't exist" }),
        ).toBeVisible()
        await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Create my list' }).last()).toBeVisible()
        await expect(page).toHaveTitle('Page not found · Keimelion')
        await expectNoAccessibilityViolations(page)
        expect(consoleErrors).toEqual([DOCUMENT_NOT_FOUND_ERROR])
        consoleErrors.length = 0
      })
    }
  })
}

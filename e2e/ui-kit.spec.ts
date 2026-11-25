import { expect, expectNoAccessibilityViolations, test } from './support/test'

const KIT_PATH = '/dev/kit'
const COLOR_SCHEMES = ['light', 'dark'] as const

for (const colorScheme of COLOR_SCHEMES) {
  test.describe(`UI kit overlays in the ${colorScheme} theme`, () => {
    test.use({ colorScheme })

    test('the dialog opens, passes axe and closes with Escape', async ({ page }) => {
      await page.goto(KIT_PATH)
      await page.getByRole('button', { name: 'Dialog' }).click()

      await expect(page.getByRole('dialog', { name: 'Cancel this reservation?' })).toBeVisible()
      await expectNoAccessibilityViolations(page)
      await page.keyboard.press('Escape')
      await expect(page.getByRole('dialog')).toBeHidden()
    })

    test('the bottom sheet rises, passes axe and closes from its action', async ({ page }) => {
      await page.goto(KIT_PATH)
      await page.getByRole('button', { name: 'Bottom sheet' }).click()

      const sheet = page.getByRole('dialog', { name: 'Bottom sheet' })
      await expect(sheet).toBeVisible()
      await expectNoAccessibilityViolations(page)
      await sheet.getByRole('button', { name: 'Got it' }).click()
      await expect(sheet).toBeHidden()
    })

    test('the popover and the toast pass axe', async ({ page }) => {
      await page.goto(KIT_PATH)
      await page.getByRole('button', { name: 'Popover' }).click()
      await expect(
        page.getByText('Only you and the list team can see who reserved what.'),
      ).toBeVisible()
      await page.keyboard.press('Escape')
      await page.getByRole('button', { name: 'Toast', exact: true }).click()

      await expect(page.getByText('Item reserved')).toBeVisible()
      await expect(page.locator('[data-sonner-toast]')).toHaveCSS('opacity', '1')
      await expectNoAccessibilityViolations(page)
    })
  })
}

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('wrap and unwrap jump to their end state at once', async ({ page }) => {
    await page.goto(KIT_PATH)

    await expect(page.getByText('Finished once')).toHaveCount(2)
  })
})

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

    test('the date picker opens, passes axe, picks a day and clears it', async ({ page }) => {
      await page.goto(KIT_PATH)
      const trigger = page.getByRole('button', { name: 'Event date', exact: true })
      const calendar = page.getByRole('dialog', { name: 'Event date' })
      await expect(async () => {
        await trigger.click()
        await expect(calendar).toBeVisible({ timeout: 1000 })
      }).toPass()
      await expectNoAccessibilityViolations(page)
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('Enter')
      await expect(page.getByRole('dialog')).toBeHidden()
      await page.getByRole('button', { name: 'Clear the date' }).click()
      await expect(trigger).toHaveText('No date, no countdown')
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

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('every interactive element offers at least a 44 × 44 px touch target', async ({ page }) => {
    await page.goto(KIT_PATH)

    const undersizedTargets = await page.evaluate(findUndersizedTouchTargets, MIN_TOUCH_TARGET_PX)

    expect(undersizedTargets).toEqual([])
  })
})

const MIN_TOUCH_TARGET_PX = 44

function findUndersizedTouchTargets(minimumSize: number): string[] {
  const selector = 'a[href], button, input, textarea, [role="radio"], [role="switch"], [role="tab"]'
  return Array.from(document.querySelectorAll<HTMLElement>(selector))
    .filter(
      (element) =>
        element.getClientRects().length > 0 &&
        element.closest('.sr-only') === null &&
        element.getAttribute('aria-hidden') !== 'true',
    )
    .filter((element) => {
      const box = element.getBoundingClientRect()
      const extension = getComputedStyle(element, '::before')
      const hasExtension = extension.content !== 'none' && extension.position === 'absolute'
      const width = Math.max(box.width, hasExtension ? parseFloat(extension.width) : 0)
      const height = Math.max(box.height, hasExtension ? parseFloat(extension.height) : 0)
      return Math.round(width) < minimumSize || Math.round(height) < minimumSize
    })
    .map((element) => element.outerHTML.slice(0, 120))
}

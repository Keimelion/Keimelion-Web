import type { Page } from '@playwright/test'
import { expect, expectNoAccessibilityViolations, test } from './support/test'

const KIT_PATH = '/dev/kit'

const COLOURED_TOASTS = [
  { trigger: 'Error toast', message: 'This gift was just reserved by someone else' },
  { trigger: 'Warning toast', message: 'The price went up since you added it' },
]

async function inverseColour(page: Page): Promise<string> {
  return page.evaluate(() => {
    const probe = document.createElement('span')
    probe.style.backgroundColor = 'var(--inverse)'
    document.body.append(probe)
    const colour = getComputedStyle(probe).backgroundColor
    probe.remove()
    return colour
  })
}
const COLOR_SCHEMES = ['light', 'dark'] as const

for (const colorScheme of COLOR_SCHEMES) {
  test.describe(`UI kit overlays in the ${colorScheme} theme`, () => {
    test.use({ colorScheme })

    test('the dialog opens, passes axe and closes with Escape', async ({ page }) => {
      await page.goto(KIT_PATH)
      await page.getByRole('button', { name: 'Dialog', exact: true }).click()

      await expect(page.getByRole('dialog', { name: 'Cancel this reservation?' })).toBeVisible()
      await expectNoAccessibilityViolations(page)
      await page.keyboard.press('Escape')
      await expect(page.getByRole('dialog')).toBeHidden()
    })

    test('the responsive dialog and the confirm dialog pass axe', async ({ page }) => {
      await page.goto(KIT_PATH)
      await page.getByRole('button', { name: 'Responsive dialog' }).click()
      await expect(page.getByRole('dialog', { name: 'Invite an editor' })).toBeVisible()
      await expectNoAccessibilityViolations(page)
      await page.keyboard.press('Escape')

      await page.getByRole('button', { name: 'Confirm dialog' }).click()
      const confirm = page.getByRole('alertdialog', { name: /Delete/ })
      await expect(confirm).toBeVisible()
      await expectNoAccessibilityViolations(page)
      await confirm.getByRole('button', { name: 'Delete the list' }).click()
      await expect(confirm).toBeHidden()
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

    for (const { trigger, message } of COLOURED_TOASTS) {
      test(`the ${trigger.toLowerCase()} stands out and passes axe`, async ({ page }) => {
        await page.goto(KIT_PATH)
        await page.getByRole('button', { name: trigger, exact: true }).click()

        const toast = page.locator('[data-sonner-toast]', { hasText: message })
        await expect(toast).toHaveCSS('opacity', '1')
        const toastColours = await toast.evaluate(
          (element) => getComputedStyle(element).backgroundColor,
        )
        expect(toastColours).not.toBe(await inverseColour(page))
        await expectNoAccessibilityViolations(page)
      })
    }

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
    await page.getByRole('button', { name: 'Replay the Wrap · reserving animation' }).click()
    await expect(page.getByText('Finished once')).toHaveCount(1)
  })
})

for (const width of [390, 1440]) {
  test(`inline controls hug their content at ${String(width)} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(KIT_PATH)

    const stretchedControls = await page.evaluate(findStretchedInlineControls)

    expect(stretchedControls).toEqual([])
  })
}

function findStretchedInlineControls(): string[] {
  const roots = [
    ...Array.from(
      document.querySelectorAll('input[type="number"]'),
      (input) => input.parentElement,
    ),
    ...Array.from(document.querySelectorAll('[role="tablist"]')),
  ].filter((root): root is HTMLElement => root instanceof HTMLElement)
  return roots
    .filter((root) => !root.classList.contains('w-full'))
    .filter((root) => {
      const childrenWidth = Array.from(root.children).reduce(
        (total, child) => total + child.getBoundingClientRect().width,
        0,
      )
      const style = getComputedStyle(root)
      const chrome = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      return root.getBoundingClientRect().width > childrenWidth + chrome + 2
    })
    .map((root) => root.outerHTML.slice(0, 100))
}

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

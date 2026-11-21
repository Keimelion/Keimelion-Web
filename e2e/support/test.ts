import AxeBuilder from '@axe-core/playwright'
import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { mockApi } from './mock-api'
import type { MockApi } from './mock-api'

interface SmokeFixtures {
  api: MockApi
  consoleErrors: string[]
}

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

export const test = base.extend<SmokeFixtures>({
  api: [
    async ({ page }, use): Promise<void> => {
      const api = await mockApi(page)
      await use(api)
      expect(api.unhandledRequests, 'API calls without an e2e mock').toEqual([])
    },
    { auto: true },
  ],
  consoleErrors: [
    async ({ page }, use): Promise<void> => {
      const consoleErrors: string[] = []
      page.on('pageerror', (error) => consoleErrors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })
      await use(consoleErrors)
      expect(consoleErrors, 'Browser errors (hydration mismatches included)').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }

export async function expectNoAccessibilityViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  expect(results.violations).toEqual([])
}

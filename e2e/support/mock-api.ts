import type { Page, Route } from '@playwright/test'
const API_VERSION_PREFIX = '/v1/'
const HEALTH_PATH = '/health'
const HTTP_OK = 200
const HTTP_NO_CONTENT = 204
const HTTP_NOT_FOUND = 404

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
}

const RESPONSES = new Map<string, unknown>()

interface MockResponse {
  status: number
  body: unknown
}

export interface MockApi {
  unhandledRequests: string[]
  handledRequests: string[]
  respond: (routeKey: string, response: MockResponse) => void
}

function isApiUrl(url: URL): boolean {
  return url.pathname.startsWith(API_VERSION_PREFIX) || url.pathname === HEALTH_PATH
}

export async function mockApi(page: Page): Promise<MockApi> {
  const unhandledRequests: string[] = []
  const handledRequests: string[] = []
  const testResponses = new Map<string, MockResponse>()

  await page.route(isApiUrl, async (route: Route): Promise<void> => {
    const request = route.request()
    const method = request.method()
    if (method === 'OPTIONS') {
      await route.fulfill({ status: HTTP_NO_CONTENT, headers: CORS_HEADERS })
      return
    }

    const routeKey = `${method} ${new URL(request.url()).pathname}`
    const testResponse = testResponses.get(routeKey)
    if (testResponse !== undefined) {
      handledRequests.push(routeKey)
      await route.fulfill({
        status: testResponse.status,
        headers: CORS_HEADERS,
        json: testResponse.body,
      })
      return
    }

    const body = RESPONSES.get(routeKey)
    if (body === undefined) {
      unhandledRequests.push(routeKey)
      await route.fulfill({
        status: HTTP_NOT_FOUND,
        headers: CORS_HEADERS,
        json: { message: `No e2e mock for ${routeKey}`, code: 'NOT_FOUND', metadata: {} },
      })
      return
    }

    handledRequests.push(routeKey)
    await route.fulfill({ status: HTTP_OK, headers: CORS_HEADERS, json: body })
  })

  return {
    unhandledRequests,
    handledRequests,
    respond: (routeKey, response) => {
      testResponses.set(routeKey, response)
    },
  }
}

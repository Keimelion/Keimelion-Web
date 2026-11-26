import { z } from 'zod'
import { AppPaths, LOGIN_RETURN_PARAM, isPathWithin } from '@/lib/app-paths'

const INTERNAL_ORIGIN = 'http://keimelion.internal'
const AUTH_PATH_PREFIX = '/auth'
const DEFAULT_LOGIN_RETURN_PATH = AppPaths.LISTS

const loginReturnPathSchema = z.string().refine(isInternalPath).transform(normalizeInternalPath)

export function buildLoginPath(returnPath: string): string {
  const searchParams = new URLSearchParams({ [LOGIN_RETURN_PARAM]: returnPath })
  return `${AppPaths.LOGIN}?${searchParams.toString()}`
}

export function buildAuthPathKeepingReturn(authPath: string, rawReturnPath: string | null): string {
  if (rawReturnPath === null) return authPath
  const searchParams = new URLSearchParams({
    [LOGIN_RETURN_PARAM]: resolveLoginReturnPath(rawReturnPath),
  })
  return `${authPath}?${searchParams.toString()}`
}

export function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  name: string,
): string | null {
  const value = searchParams[name]
  return typeof value === 'string' ? value : null
}

export function buildLoginPathFromCurrentPage(): string {
  const { pathname, search, hash } = window.location
  return buildLoginPath(`${pathname}${search}${hash}`)
}

export function resolveLoginReturnPath(rawReturnPath: string | null): string {
  const parsed = loginReturnPathSchema.safeParse(rawReturnPath)
  return parsed.success ? parsed.data : DEFAULT_LOGIN_RETURN_PATH
}

function isInternalPath(value: string): boolean {
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return false
  const url = new URL(value, INTERNAL_ORIGIN)
  return url.origin === INTERNAL_ORIGIN && !isPathWithin(url.pathname, AUTH_PATH_PREFIX)
}

function normalizeInternalPath(value: string): string {
  const url = new URL(value, INTERNAL_ORIGIN)
  return `${url.pathname}${url.search}${url.hash}`
}

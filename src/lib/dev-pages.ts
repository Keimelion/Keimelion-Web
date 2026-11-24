const ENABLED_FLAG = 'true'

export function areDevPagesEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEV_PAGES === ENABLED_FLAG
}

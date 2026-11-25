const FLIP_KEY_PREFIX = 'keimelion_countdown_flip:'
const CELEBRATION_KEY_PREFIX = 'keimelion_countdown_celebrated:'
const CELEBRATED_FLAG = '1'

type StorageResolver = () => Storage

const resolveLocalStorage: StorageResolver = () => localStorage
const resolveSessionStorage: StorageResolver = () => sessionStorage

export function claimDailyFlip(eventDayKey: string, todayKey: string): boolean {
  const storageKey = `${FLIP_KEY_PREFIX}${eventDayKey}`
  if (readStorage(resolveLocalStorage, storageKey) === todayKey) return false
  writeStorage(resolveLocalStorage, storageKey, todayKey)
  return true
}

export function claimVisitCelebration(eventDayKey: string): boolean {
  const storageKey = `${CELEBRATION_KEY_PREFIX}${eventDayKey}`
  if (readStorage(resolveSessionStorage, storageKey) === CELEBRATED_FLAG) return false
  writeStorage(resolveSessionStorage, storageKey, CELEBRATED_FLAG)
  return true
}

function readStorage(resolveStorage: StorageResolver, key: string): string | null {
  try {
    return resolveStorage().getItem(key)
  } catch {
    return null
  }
}

function writeStorage(resolveStorage: StorageResolver, key: string, value: string): void {
  try {
    resolveStorage().setItem(key, value)
  } catch {
    return
  }
}

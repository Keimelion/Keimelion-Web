const STORAGE_EVENT = 'storage'
const SAME_TAB_STORAGE_EVENT = 'keimelion:storage'

export function subscribeToStorage(onChange: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, onChange)
  window.addEventListener(SAME_TAB_STORAGE_EVENT, onChange)
  return () => {
    window.removeEventListener(STORAGE_EVENT, onChange)
    window.removeEventListener(SAME_TAB_STORAGE_EVENT, onChange)
  }
}

export function notifyStorageSubscribers(): void {
  queueMicrotask(() => {
    window.dispatchEvent(new Event(SAME_TAB_STORAGE_EVENT))
  })
}

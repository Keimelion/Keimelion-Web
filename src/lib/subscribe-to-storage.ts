const STORAGE_EVENT = 'storage'

export function subscribeToStorage(onChange: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, onChange)
  return () => {
    window.removeEventListener(STORAGE_EVENT, onChange)
  }
}

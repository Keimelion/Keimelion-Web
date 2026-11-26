export function takeUrlFragment(): string {
  const { pathname, search, hash } = window.location
  if (hash !== '') window.history.replaceState(window.history.state, '', `${pathname}${search}`)
  return hash
}

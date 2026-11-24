import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('keeps a token text colour next to a token type size', () => {
    expect(cn('text-ink', 'text-title')).toBe('text-ink text-title')
  })

  it('lets a later token type size win over an earlier one', () => {
    expect(cn('text-body', 'text-display-xl')).toBe('text-display-xl')
  })

  it('lets a token radius override a default radius', () => {
    expect(cn('rounded-md', 'rounded-card')).toBe('rounded-card')
  })

  it('lets a token shadow override a default shadow', () => {
    expect(cn('shadow-md', 'shadow-card')).toBe('shadow-card')
  })
})

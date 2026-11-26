import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PaperEdge } from './paper-edge'

describe('PaperEdge', () => {
  it('prints the dotted edge in the paper of the occasion', () => {
    const { container } = render(<PaperEdge occasionSlug="wedding" />)

    expect(container.querySelector('pattern rect')).toHaveClass('fill-paper-lilac')
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('falls back to the default paper without an occasion', () => {
    const { container } = render(<PaperEdge occasionSlug={null} />)

    expect(container.querySelector('pattern rect')).toHaveClass('fill-paper-mint')
  })
})

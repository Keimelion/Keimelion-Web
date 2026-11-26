import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress } from './progress'

describe('Progress', () => {
  it('exposes its name and value to assistive technologies', () => {
    render(<Progress value={6} max={18} label="Reserved gifts" valueText="6 of 18 reserved" />)

    const progress = screen.getByRole('progressbar', { name: 'Reserved gifts' })
    expect(progress).toHaveAttribute('aria-valuenow', '6')
    expect(progress).toHaveAttribute('aria-valuemax', '18')
    expect(progress).toHaveAttribute('aria-valuetext', '6 of 18 reserved')
  })

  it('fills in proportion and never overflows', () => {
    const { rerender } = render(
      <Progress value={6} max={18} label="Reserved" valueText="6 of 18" />,
    )
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({
      width: `${String((6 / 18) * 100)}%`,
    })

    rerender(<Progress value={20} max={18} label="Reserved" valueText="20 of 18" />)
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({ width: '100%' })

    rerender(<Progress value={0} max={0} label="Reserved" valueText="0 of 0" />)
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({ width: '0%' })
  })
})

import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AnimatedList, AnimatedListItem } from './animated-list'

function GiftList({ gifts }: { gifts: string[] }): React.JSX.Element {
  return (
    <AnimatedList label="Gifts">
      {gifts.map((gift) => (
        <AnimatedListItem key={gift}>{gift}</AnimatedListItem>
      ))}
    </AnimatedList>
  )
}

describe('AnimatedList', () => {
  it('lists its rows and lets a removed row leave', async () => {
    const { rerender } = render(<GiftList gifts={['Tea set', 'Casserole']} />)

    expect(screen.getByRole('list', { name: 'Gifts' }).children).toHaveLength(2)
    rerender(<GiftList gifts={['Casserole']} />)

    await waitFor(() => {
      expect(screen.queryByText('Tea set')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Casserole')).toBeInTheDocument()
  })

  it('adds a new row', () => {
    const { rerender } = render(<GiftList gifts={['Casserole']} />)

    rerender(<GiftList gifts={['Casserole', 'Lamp']} />)

    expect(screen.getByText('Lamp')).toBeInTheDocument()
  })
})

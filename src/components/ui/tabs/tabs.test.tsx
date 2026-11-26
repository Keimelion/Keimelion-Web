import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

function AddGiftTabs(): React.JSX.Element {
  return (
    <Tabs defaultValue="link">
      <TabsList aria-label="Add a gift">
        <TabsTrigger value="link">From a link</TabsTrigger>
        <TabsTrigger value="hand">By hand</TabsTrigger>
      </TabsList>
      <TabsContent value="link">Paste a link</TabsContent>
      <TabsContent value="hand">Type a name</TabsContent>
    </Tabs>
  )
}

function countKnobs(tablist: HTMLElement): number {
  return tablist.querySelectorAll('.bg-brand').length
}

describe('Tabs', () => {
  it('exposes a tablist whose active tab controls the visible panel', () => {
    render(<AddGiftTabs />)

    const activeTab = screen.getByRole('tab', { name: 'From a link' })
    expect(activeTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Paste a link')
    expect(activeTab).toHaveAttribute('aria-controls', screen.getByRole('tabpanel').id)
  })

  it('moves the knob and the panel with a click', async () => {
    const user = userEvent.setup()
    render(<AddGiftTabs />)

    await user.click(screen.getByRole('tab', { name: 'By hand' }))

    expect(screen.getByRole('tab', { name: 'By hand' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Type a name')
    expect(countKnobs(screen.getByRole('tablist'))).toBe(1)
    expect(screen.getByRole('tab', { name: 'By hand' }).querySelector('.bg-brand')).not.toBeNull()
  })

  it('follows the arrow keys', async () => {
    const user = userEvent.setup()
    render(<AddGiftTabs />)

    await user.tab()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'By hand' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'By hand' })).toHaveAttribute('aria-selected', 'true')
  })

  it('keeps one knob per instance', () => {
    render(
      <>
        <AddGiftTabs />
        <AddGiftTabs />
      </>,
    )

    screen.getAllByRole('tablist').forEach((tablist) => {
      expect(countKnobs(tablist)).toBe(1)
    })
  })

  it('can be controlled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    function ControlledTabs(): React.JSX.Element {
      const [view, setView] = useState('edit')
      return (
        <Tabs
          value={view}
          onValueChange={(nextView) => {
            setView(nextView)
            onValueChange(nextView)
          }}
        >
          <TabsList aria-label="List view">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="guest">Guest view</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">Editing</TabsContent>
          <TabsContent value="guest">As a guest</TabsContent>
        </Tabs>
      )
    }
    render(<ControlledTabs />)

    await user.click(screen.getByRole('tab', { name: 'Guest view' }))

    expect(onValueChange).toHaveBeenCalledWith('guest')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('As a guest')
  })
})

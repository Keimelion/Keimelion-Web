import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { ReplayStage } from './components/replay-stage'

interface MountProbeProps {
  onMount: () => void
}

function MountProbe({ onMount }: MountProbeProps): React.JSX.Element {
  useEffect(onMount, [onMount])
  return <span>Gift</span>
}

describe('ReplayStage', () => {
  it('names its button after the animation while keeping the visible label', () => {
    renderWithIntl(
      <ReplayStage animationName="land" onReplay={null}>
        <span>Gift</span>
      </ReplayStage>,
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAccessibleName('Replay the land animation')
    expect(button).toHaveTextContent(/^Replay/)
  })

  it('replays the animation from the start by remounting it', async () => {
    const user = userEvent.setup()
    const onMount = vi.fn()
    const onReplay = vi.fn()
    renderWithIntl(
      <ReplayStage animationName="wrap" onReplay={onReplay}>
        <MountProbe onMount={onMount} />
      </ReplayStage>,
    )

    await user.click(screen.getByRole('button', { name: /Replay/ }))

    expect(onReplay).toHaveBeenCalledTimes(1)
    expect(onMount).toHaveBeenCalledTimes(2)
  })
})

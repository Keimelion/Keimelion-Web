import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { notifyWithUndo } from './notify-with-undo'

interface ToastOptions {
  action: { label: string; onClick: () => void }
  onDismiss: () => void
  onAutoClose: () => void
}

const toastMock = vi.hoisted(() =>
  Object.assign(
    vi.fn(() => 'toast-id'),
    { dismiss: vi.fn() },
  ),
)

vi.mock('sonner', () => ({ toast: toastMock }))

function lastToastOptions(): ToastOptions {
  const call = toastMock.mock.calls.at(-1) as unknown as [string, ToastOptions]
  return call[1]
}

function notify(): { onCommit: ReturnType<typeof vi.fn>; onUndo: ReturnType<typeof vi.fn> } {
  const onCommit = vi.fn()
  const onUndo = vi.fn()
  notifyWithUndo({ message: 'Gift removed', onCommit, onUndo })
  return { onCommit, onUndo }
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  toastMock.mockClear()
  toastMock.dismiss.mockClear()
})

describe('notifyWithUndo', () => {
  it('shows the message with an Undo action', () => {
    notify()

    expect(toastMock).toHaveBeenCalledWith(
      'Gift removed',
      expect.objectContaining({ duration: 5000, style: { '--toast-lifetime': '5000ms' } }),
    )
    expect(lastToastOptions().action.label).toBe('Undo')
  })

  it('leaves the timing to the toast, so hovering it keeps the undo window open', () => {
    const { onCommit } = notify()

    vi.advanceTimersByTime(60_000)

    expect(onCommit).not.toHaveBeenCalled()
  })

  it('commits once when the toast closes on its own', () => {
    const { onCommit, onUndo } = notify()

    lastToastOptions().onAutoClose()
    lastToastOptions().onDismiss()

    expect(onCommit).toHaveBeenCalledTimes(1)
    expect(onUndo).not.toHaveBeenCalled()
  })

  it('undoes instead of committing', () => {
    const { onCommit, onUndo } = notify()

    lastToastOptions().action.onClick()
    lastToastOptions().onAutoClose()

    expect(onUndo).toHaveBeenCalledTimes(1)
    expect(onCommit).not.toHaveBeenCalled()
  })

  it('commits right away when the toast is dismissed', () => {
    const { onCommit } = notify()

    lastToastOptions().onDismiss()
    lastToastOptions().onAutoClose()

    expect(onCommit).toHaveBeenCalledTimes(1)
  })
})

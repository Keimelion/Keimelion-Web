import { act, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { CopyField } from './copy-field'

const notifyErrorMock = vi.hoisted(() => vi.fn())

vi.mock('@/lib/notify', () => ({ notifyError: notifyErrorMock }))

const LINK = 'https://keimelion.example/l/lea-axel'

function mockClipboard(writeText: () => Promise<void>): void {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
}

afterEach(() => {
  vi.useRealTimers()
  notifyErrorMock.mockClear()
})

describe('CopyField', () => {
  it('copies the value, announces it and turns back after 2 s', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn(() => Promise.resolve())
    mockClipboard(writeText)
    renderWithIntl(<CopyField value={LINK} label="Share link" />)

    expect(screen.getByRole('textbox', { name: 'Share link' })).toHaveValue(LINK)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
      await Promise.resolve()
    })

    expect(writeText).toHaveBeenCalledWith(LINK)
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Copied to the clipboard')
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
  })

  it('selects the text and shows an error toast when the clipboard refuses', async () => {
    mockClipboard(() => Promise.reject(new Error('denied')))
    renderWithIntl(<CopyField value={LINK} label="Share link" />)
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: 'Share link' })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
      await Promise.resolve()
    })

    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(LINK.length)
    expect(notifyErrorMock).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('copy it with your keyboard')
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Reserve</Button>)

    await user.click(screen.getByRole('button', { name: 'Reserve' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('announces the loading state and ignores presses while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button isLoading onClick={onClick}>
        Reserve
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Reserve' })

    await user.keyboard('{Tab}{Enter}')

    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders its child element when used as a slot', () => {
    render(
      <Button asChild isLoading>
        <a href="/lists">My lists</a>
      </Button>,
    )

    expect(screen.getByRole('link', { name: 'My lists' })).toHaveAttribute('aria-busy', 'true')
  })
})

describe('Button inside a form', () => {
  it('does not submit the form unless it is a submit button', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent) => {
      event.preventDefault()
    })
    render(
      <form onSubmit={onSubmit}>
        <Button>Copy</Button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Copy' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not submit again while loading, even with the keyboard', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent) => {
      event.preventDefault()
    })
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" isLoading>
          Save
        </Button>
      </form>,
    )

    screen.getByRole('button', { name: 'Save' }).focus()
    await user.keyboard('{Enter}')

    expect(onSubmit).not.toHaveBeenCalled()
  })
})

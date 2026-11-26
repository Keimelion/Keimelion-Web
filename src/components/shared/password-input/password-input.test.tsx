import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { PasswordInput } from './password-input'

describe('PasswordInput', () => {
  it('hides the password and reveals it with a pressed toggle', async () => {
    const user = userEvent.setup()
    renderWithIntl(
      <>
        <label htmlFor="password">Password</label>
        <PasswordInput id="password" autoComplete="current-password" />
      </>,
    )
    const input = screen.getByLabelText('Password')
    const toggle = screen.getByRole('button', { name: 'Show password' })

    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('autocomplete', 'current-password')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'password')
    await user.click(toggle)

    expect(input).toHaveAttribute('type', 'text')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })
})

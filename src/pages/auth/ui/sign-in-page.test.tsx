import { SignInPage } from './sign-in-page'
import { render } from '@shared/lib'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('SignInPage', () => {
  it('shows loading and server-side field feedback on failed submit', async () => {
    const user = userEvent.setup()

    render(<SignInPage />)

    await user.type(
      screen.getByLabelText('Login/Pochta'),
      'missing@anordonate.uz',
    )
    await user.type(screen.getByPlaceholderText('Password'), 'password123')

    const submitButton = screen.getByRole('button', { name: 'Kirish' })

    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(
      await screen.findByText('Bu login yoki pochta topilmadi'),
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Kiritilgan ma’lumot tekshirilmadi.',
    )
  })
})

import { ErrorMessage } from './error-message'
import { ASSETS } from '@shared/constants'
import { render } from '@shared/lib'
import { screen } from '@testing-library/dom'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-svg', () => ({
  ReactSVG: ({ src }: { src: string }) => <img data-src={src} />,
}))

describe('ErrorMessage', () => {
  it('should render title correctly', () => {
    render(
      <ErrorMessage
        title="Error Title"
        text="Error text"
        image={ASSETS.BUG_FIXING}
      />,
    )
    expect(screen.getByText('Error Title')).toBeInTheDocument()
  })

  it('should render text correctly', () => {
    render(
      <ErrorMessage
        title="Error Title"
        text="Error text message"
        image={ASSETS.BUG_FIXING}
      />,
    )
    expect(screen.getByText('Error text message')).toBeInTheDocument()
  })

  it('should render image with correct src', () => {
    const { container } = render(
      <ErrorMessage
        title="Error Title"
        text="Error text"
        image={ASSETS.BUG_FIXING}
      />,
    )
    const image = container.querySelector('[data-src]')
    expect(image).toHaveAttribute('data-src', ASSETS.BUG_FIXING)
  })

  it('should render custom image', () => {
    const customImage = '/custom-image.svg'
    const { container } = render(
      <ErrorMessage
        title="Error Title"
        text="Error text"
        image={customImage}
      />,
    )
    const image = container.querySelector('[data-src]')
    expect(image).toHaveAttribute('data-src', customImage)
  })

  it('should render all elements together', () => {
    const { container } = render(
      <ErrorMessage
        title="Error Title"
        text="Error text"
        image={ASSETS.BUG_FIXING}
      />,
    )
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(container.querySelector('[data-src]')).toBeInTheDocument()
    expect(screen.getByText('Error text')).toBeInTheDocument()
  })
})

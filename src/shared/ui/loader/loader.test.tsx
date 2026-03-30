import cn from './loader.module.css'

import { Loader } from './loader'
import { render } from '@shared/lib'
import { describe, expect, it } from 'vitest'

describe('Loader', () => {
  it('renders loader container', () => {
    const { container } = render(<Loader />)

    const loaderBox = container.querySelector(`.${cn.loader}`)
    expect(loaderBox).toBeInTheDocument()
  })

  it('renders Mantine Loader component', () => {
    const { container } = render(<Loader />)

    const mantineLoader = container.querySelector('.mantine-Loader-root')
    expect(mantineLoader).toBeInTheDocument()
  })

  it('applies correct CSS class to container', () => {
    const { container } = render(<Loader />)

    const loaderBox = container.querySelector(`.${cn.loader}`)
    expect(loaderBox).toHaveClass(cn.loader)
  })
})
